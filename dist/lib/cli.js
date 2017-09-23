"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const parser_1 = require("./parser");
const io_1 = require("./io");
const optimist = require("optimist");
const webdriverio_workflo_1 = require("webdriverio-workflo");
const pkg = require('../../package.json');
const VERSION = pkg.version;
const ALLOWED_ARGV = [
    'host', 'port', 'logLevel', 'coloredLogs', 'baseUrl', 'waitforTimeout',
    'connectionRetryTimeout', 'connectionRetryCount',
    'executionFilters', 'parseResults'
    //, 'jasmineOpts', 'user', 'key', 'watch', 'path'
];
let configFile;
let optionsOffset = 2; // config file defined as first "parameter"
// options (not yet) supported are commented out
optimist
    .usage('wdio-workflo CLI runner\n\n' +
    'Usage: wdio-workflo [configFile] [options]\n' +
    'The [options] object will override values from the config file.')
    .describe('help', 'prints wdio-workflo help menu')
    .alias('help', 'h')
    .describe('version', 'prints wdio-workflo version')
    .alias('version', 'v')
    .describe('host', 'Selenium server host address')
    .describe('port', 'Selenium server port')
    .describe('logLevel', 'level of logging verbosity (default: silent)')
    .alias('logLevel', 'l')
    .describe('coloredLogs', 'if true enables colors for log output (default: true)')
    .alias('coloredLogs', 'c')
    .describe('bail', 'stop test runner after specific amount of tests have failed (default: 0 - don\'t bail)')
    .describe('baseUrl', 'shorten url command calls by setting a base url')
    .alias('baseUrl', 'b')
    .describe('waitforTimeout', 'timeout for all waitForXXX commands (default: 5000ms)')
    .alias('waitforTimeout', 'w')
    .describe('testcases', 'restricts test execution to these testcases\n' +
    '\t\t\t\'["Suite1", "Suite2.Testcase1"]\' => execute all testcases of Suite1 and Testcase1 of Suite2\n' +
    '\t\t\t\'["Suite2", "-Suite2.Testcase2"]\' => execute all testcases of Suite2 except for Testcase2\n')
    .describe('features', 'restricts test execution to these features\n' +
    '\t\t\t\'["Login"]\' => execute all testcases which are verified by specs defined within these features\n')
    .describe('specs', 'restricts test execution to these specs\n' +
    '\t\t\t\'["3.2"]\' => execute all testcases which verify spec 3.2\n' +
    '\t\t\t\'["1.1*", "-1.1.2.4"]\' => 1.1* includes spec 1.1 and all of its sub-specs (eg. 1.1.2), -1.1.2.4 excludes spec 1.1.2.4\n' +
    '\t\t\t\'["1.*"]\' => 1.* excludes spec 1 itself but includes of of its sub-specs\n')
    .describe('testcaseFiles', 'restricts test execution to testcases defined within these files\n' +
    '\t\t\t\'["testcaseFile1", "testcaseFile2"]\' => execute all testcases defined within testcaseFile1.tc.ts and testcaseFile2.tc.ts\n')
    .describe('specFiles', 'restricts test execution to testcases verified by specs defined within these files\n' +
    '\t\t\t\'["specFile1", "specFile2"]\' => execute all testcases verified by specs defined within specFile1.spec.ts and specFile2.spec.ts\n')
    .describe('listFiles', 'restricts test execution to the testcases, specs, testcaseFiles, specFiles and lists defined within these files \n' +
    '\t\t\t\'["listFile1"]\' => execute all testcases include by the contents of listFile1.list.ts\n')
    .string(['host', 'path', 'logLevel', 'baseUrl', 'specs', 'testcases', 'specFiles', 'testcaseFiles', 'listFiles'
    /*, 'user', 'key', 'screenshotPath', 'framework', 'reporters', 'suite', 'spec' */ 
])
    .boolean(['coloredLogs', 'watch'])
    .default({ coloredLogs: true })
    .check((arg) => {
    if (arg._.length > 1 && arg._[0] !== 'repl') {
        throw new Error('Error: more than one config file specified');
    }
});
if (process.argv.length === 2 || process.argv.length > 2 && process.argv[2].substr(0, 1) === '-') {
    configFile = './workflo.conf.js';
    optionsOffset = 1; // no config file specified
}
let argv = optimist.parse(process.argv.slice(optionsOffset));
if (argv.help) {
    optimist.showHelp();
    process.exit(0);
}
if (argv.version) {
    console.log(`v${VERSION}`);
    process.exit(0);
}
/**
 * use wdio.conf.js default file name if no config was specified
 * otherwise run config sequenz
 */
if (typeof configFile === 'undefined') {
    configFile = argv._[0];
}
/**
 * sanitize jasmineOpts
 */
if (argv.jasmineOpts && argv.jasmineOpts.defaultTimeoutInterval) {
    argv.jasmineOpts.defaultTimeoutInterval = parseInt(argv.jasmineOpts.defaultTimeoutInterval, 10);
}
// cli config file defined workflo config, wdio config is placed in config/wdio.conf.js
const wdioConfigFile = path.join(__dirname, '..', '..', 'config', 'wdio.conf.js');
const workfloConfigFile = path.join(process.cwd(), configFile);
if (!fs.existsSync(workfloConfigFile)) {
    console.error(`Workflo config file was not specified or could not be found in its default location (<<current working directory>>/workflo.conf.js)\n`);
    optimist.showHelp();
    process.exit(1);
}
process.env.WORKFLO_CONFIG = workfloConfigFile;
const workfloConfig = require(workfloConfigFile);
// check workflo config properties
const mandatoryProperties = ['testDir', 'baseUrl', 'specFiles', 'testcaseFiles', 'manualTestcaseFiles', 'uidStorePath'];
for (const property of mandatoryProperties) {
    if (!(property in workfloConfig)) {
        throw new Error(`Property '${property}' must be defined in workflo config file!`);
    }
}
const testDir = workfloConfig.testDir;
const specsDir = path.join(testDir, 'src', 'specs');
const testcasesDir = path.join(testDir, 'src', 'testcases');
const listsDir = path.join(testDir, 'src', 'lists');
const filters = {};
const mergedFilters = {};
const mergeKeys = ['features', 'specs', 'testcases', 'specFiles', 'testcaseFiles'];
// merge non-file cli filters
mergeKeys.forEach(key => mergeIntoFilters(key, argv, mergedFilters));
// merge filters defined in cli lists and sublists
if (argv.listFiles) {
    mergeLists({
        listFiles: JSON.parse(argv.listFiles)
    }, mergedFilters);
}
// complete cli specFiles and testcaseFiles paths
completeFilePaths(mergedFilters);
// if no cli params were defined, merge in all spec and testcase files...
const completedSpecFiles = completeSpecFiles(argv, mergedFilters);
const completedTestcaseFiles = completeTestcaseFiles(argv, mergedFilters);
const parseResults = {
    specs: parser_1.specFilesParse(Object.keys(mergedFilters.specFiles)),
    testcases: parser_1.testcaseFilesParse(Object.keys(mergedFilters.testcaseFiles))
};
// filters contains all filter criteria that is actually executed
// and will be filtered further
filters.specFiles = mergedFilters.specFiles;
filters.testcaseFiles = mergedFilters.testcaseFiles;
// get all features and specs in specFiles
for (const specFile in filters.specFiles) {
    filters.features = parseResults.specs.specFileTable[specFile].features;
    filters.specs = parseResults.specs.specFileTable[specFile].specs;
}
// get all testcases in testcaseFiles
for (const testcaseFile in filters.testcaseFiles) {
    filters.testcases = parseResults.testcases.testcaseFileTable[testcaseFile].testcases;
}
// remove specs not matched by specs filter
filterSpecsBySpecs();
// remove specs not matched by features filter
filterSpecsByFeatures();
// remove testcases not matched by testcases filter
filterTestcasesByTestcases();
// remove specs not matched by verifies in testcases
filterSpecsByTestcases();
// remove testcases that do not verify filtered specs
filterTestcasesBySpecs();
// remove features not matched by specs
filterFeaturesBySpecs();
// build suites based on testcases
addSuites();
// remove specFiles not matched by filtered specs
filterSpecFilesBySpecs();
// remove testcaseFiles not matched by filtered testcases
filterTestcaseFilesByTestcases();
argv.executionFilters = JSON.stringify(filters);
argv.parseResults = JSON.stringify(parseResults);
let args = {};
for (let key of ALLOWED_ARGV) {
    if (argv[key] !== undefined) {
        args[key] = argv[key];
    }
}
/**
 * run launch sequence
 */
let launcher = new webdriverio_workflo_1.Launcher(wdioConfigFile, args);
launcher.run().then((code) => process.exit(code), (e) => process.nextTick(() => {
    throw e;
}));
function mergeIntoFilters(key, argv, _filters) {
    _filters[key] = {};
    if (argv[key]) {
        const filterArray = JSON.parse(argv[key]);
        filterArray.forEach(value => _filters[key][value] = true);
    }
}
// if no spec files are present in filters, use all spec files in specs folder
function completeSpecFiles(argv, _filters) {
    // if user manually defined an empty specFiles array, do not add specFiles from folder
    if (Object.keys(_filters.specFiles).length === 0 && !argv.specFiles) {
        io_1.getAllFiles(specsDir, '.spec.ts').forEach(specFile => _filters.specFiles[specFile] = true);
        return true;
    }
    return false;
}
// if no testcase files are present in filters, use all testcase files in testcase folder
function completeTestcaseFiles(argv, _filters) {
    // if user manually defined an empty testcaseFiles array, do not add testcaseFiles from folder
    if (Object.keys(_filters.testcaseFiles).length === 0 && !argv.testcaseFiles) {
        io_1.getAllFiles(testcasesDir, '.tc.ts').forEach(testcaseFile => _filters.testcaseFiles[testcaseFile] = true);
        return true;
    }
    return false;
}
function completeFilePaths(_filters) {
    const specFilePaths = {};
    const testcaseFilePaths = {};
    for (const specFile in _filters.specFiles) {
        const specFilePath = path.join(specsDir, `${specFile}.spec.ts`);
        specFilePaths[specFilePath] = true;
    }
    for (const testcaseFile in _filters.testcaseFiles) {
        const testcaseFilePath = path.join(testcasesDir, `${testcaseFile}.tc.ts`);
        testcaseFilePaths[testcaseFilePath] = true;
    }
    _filters.specFiles = specFilePaths;
    _filters.testcaseFiles = testcaseFilePaths;
}
/**
 * Loads all specFiles, testcaseFiles, features, specs and testcases defined in lists and sublists of argv.listFiles
 * @param argv
 */
function mergeLists(list, _filters) {
    if (list.specFiles) {
        list.specFiles.forEach(value => _filters.specFiles[value] = true);
    }
    if (list.testcaseFiles) {
        list.testcaseFiles.forEach(value => _filters.testcaseFiles[value] = true);
    }
    if (list.features) {
        list.features.forEach(value => _filters.features[value] = true);
    }
    if (list.specs) {
        list.specs.forEach(value => _filters.specs[value] = true);
    }
    if (list.testcases) {
        list.testcases.forEach(value => _filters.testcases[value] = true);
    }
    if (list.listFiles) {
        for (const listFile of list.listFiles) {
            // complete cli listFiles paths
            const listFilePath = path.join(listsDir, `${listFile}.list.ts`);
            if (!fs.existsSync(listFilePath)) {
                throw new Error(`List file could not be found: ${listFilePath}`);
            }
            else {
                const sublist = require(listFilePath);
                // recursively traverse sub list files
                mergeLists(sublist, _filters);
            }
        }
    }
}
function filterSpecsByFeatures() {
    const filteredSpecs = {};
    for (const feature in mergedFilters.features) {
        if (feature in parseResults.specs.featureTable) {
            for (const spec in parseResults.specs.featureTable[feature].specs) {
                filteredSpecs[spec] = true;
            }
        }
    }
    // delete specs not matched by features
    for (const spec in filters.specs) {
        if (!(spec in filteredSpecs)) {
            delete filters.specs[spec];
        }
    }
}
function filterSpecsBySpecs() {
    const filteredSpecs = {};
    const filteredFeatures = {};
    for (const spec in mergedFilters.specs) {
        let remove = false;
        let matchStr = spec;
        if (spec.substr(0, 1) === '-') {
            remove = true;
            matchStr = spec.substr(1, spec.length - 1);
        }
        if (matchStr.substr(matchStr.length - 1, 1) === '*') {
            matchStr = matchStr.substr(0, matchStr.length - 1);
            for (const specEntry in parseResults.specs.specTable) {
                if (specEntry.length >= matchStr.length && specEntry.substr(0, matchStr.length) === matchStr) {
                    if (remove) {
                        delete filters[specEntry];
                    }
                    else {
                        filteredSpecs[specEntry] = true;
                    }
                }
            }
        }
        else {
            if (remove) {
                delete filters[matchStr];
            }
            else {
                filteredSpecs[matchStr] = true;
            }
        }
    }
    for (const spec in filteredSpecs) {
        if (!(spec in filters.specs)) {
            delete filters.specs[spec];
        }
    }
}
function filterTestcasesByTestcases() {
    const filteredTestcaseFiles = {};
    for (const testcase in mergedFilters.testcases) {
        let remove = false;
        let matchStr = testcase;
        if (testcase.substr(0, 1) === '-') {
            remove = true;
            matchStr = testcase.substr(1, testcase.length - 1);
        }
        else {
            for (const testcaseEntry in parseResults.testcases.testcaseTable) {
                if (testcaseEntry.substr(0, matchStr.length) === matchStr) {
                    if (remove) {
                        delete filters.testcases[testcaseEntry];
                    }
                    else {
                        filteredTestcaseFiles[testcaseEntry] = true;
                    }
                }
            }
        }
    }
    // only execute spec files that include filtered options
    for (const testcaseFile in filters.testcaseFiles) {
        if (!(testcaseFile in filteredTestcaseFiles)) {
            delete filters.testcaseFiles[testcaseFile];
        }
    }
}
function filterSpecsByTestcases() {
    const verifiedSpecs = {};
    // add all spec ids verified in given testcases
    for (const testcase in filters.testcases) {
        // testcase is a suite
        if (testcase in parseResults.testcases.tree) {
            for (const testcaseId in parseResults.testcases.tree[testcase].testcaseHash) {
                for (const verifiedSpec in parseResults.testcases.tree[testcase].testcaseHash[testcaseId].specVerifyHash) {
                    verifiedSpecs[verifiedSpec] = true;
                }
            }
        }
        else {
            let matchSuite = testcase;
            const testcaseParts = testcase.split('.');
            // at least one suite followed by a testcase
            if (testcaseParts.length > 1) {
                testcaseParts.pop(); // remove testcase
                matchSuite = testcaseParts.join('.');
                if (matchSuite in parseResults.testcases.tree) {
                    for (const verifiedSpec in parseResults.testcases.tree[matchSuite].testcaseHash[testcase].specVerifyHash) {
                        verifiedSpecs[verifiedSpec] = true;
                    }
                }
            }
        }
    }
    // removed specs not verified by filtered testcases
    for (const spec in filters.specs) {
        if (!(spec in verifiedSpecs)) {
            delete filters.specs[spec];
        }
    }
}
function filterTestcasesBySpecs() {
    const filteredTestcases = {};
    for (const spec in filters.specs) {
        for (const testcase in parseResults.specs.specTable[spec].testcases) {
            filteredTestcases[testcase] = true;
        }
    }
    for (const testcase in filters.testcases) {
        if (!(testcase in filteredTestcases)) {
            delete filters.testcases[testcase];
        }
    }
}
function filterFeaturesBySpecs() {
    const filteredFeatures = {};
    for (const spec in filters.specs) {
        filteredFeatures[parseResults.specs.specTable[spec].feature] = true;
    }
    for (const feature in filters.features) {
        if (!(feature in filteredFeatures)) {
            delete filters.features[feature];
        }
    }
}
function filterSpecFilesBySpecs() {
    const filteredSpecFiles = {};
    for (const spec in filters.specs) {
        filteredSpecFiles[parseResults.specs.specTable[spec].specFile] = true;
    }
    for (const specFile in filters.specFiles) {
        if (!(specFile in filteredSpecFiles)) {
            delete filters.specFiles[specFile];
        }
    }
}
function filterTestcaseFilesByTestcases() {
    const filteredTestcaseFiles = {};
    for (const testcase in filters.testcases) {
        filteredTestcaseFiles[parseResults.testcases.testcaseTable[testcase].testcaseFile] = true;
    }
    for (const testcaseFile in filters.testcaseFiles) {
        if (!(testcaseFile in filteredTestcaseFiles)) {
            delete filters.testcaseFiles[testcaseFile];
        }
    }
}
function addSuites() {
    filters.suites = {};
    // add suites from testcases
    for (const testcase in filters.testcases) {
        filters.suites[parseResults.testcases.testcaseTable[testcase].suiteId] = true;
    }
    // add parent suites
    for (const suite in filters.suites) {
        const suiteParts = suite.split('.');
        let str = '';
        // child suite is already included
        for (let i = 0; i < (suiteParts.length - 1); ++i) {
            if (suiteParts[i] !== '') {
                let delim = '.';
                if (str.length === 0) {
                    delim = '';
                }
                str += `${delim}${suiteParts[i]}`;
                filters.suites[str] = true;
            }
        }
    }
}
//# sourceMappingURL=cli.js.map