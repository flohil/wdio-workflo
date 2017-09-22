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
function mergeIntoFilters(key, argv, filters) {
    filters[key] = {};
    if (argv[key]) {
        const filterArray = JSON.parse(argv[key]);
        filterArray.forEach(value => filters[key][value] = true);
    }
}
const filters = {};
const mergeKeys = ['features', 'specs', 'testcases', 'specFiles', 'testcaseFiles'];
// merge non-file cli filters
mergeKeys.forEach(key => mergeIntoFilters(key, argv, filters));
// merge filters defined in cli lists and sublists
if (argv.listFiles) {
    mergeLists({
        listFiles: JSON.parse(argv.listFiles)
    }, filters);
}
// complete cli specFiles and testcaseFiles paths
completeFilePaths(filters);
// if no cli params were defined, merge in all spec and testcase files...
const completedSpecFiles = completeSpecFiles(argv, filters);
const completedTestcaseFiles = completeTestcaseFiles(argv, filters);
const parseResults = {
    specs: parser_1.specFilesParse(Object.keys(filters.specFiles)),
    testcases: parser_1.testcaseFilesParse(Object.keys(filters.testcaseFiles))
};
// count features, specs and testcases based on "parent" filters like specFiles and testcaseFiles and themselves
// only if count matches number of defined filters, the feature/spec/testcase will be executed
// adding more filters adds additional constraints!
if (Object.keys(filters.specs).length > 0) {
    const filteredSpecFiles = {};
    for (const spec in filters.specs) {
        getSpecMatchFiles(spec, parseResults.specs.specTable).forEach(file => filteredSpecFiles[file] = true);
    }
    for (const specFile in filters.specFiles) {
        if (!(specFile in filteredSpecFiles)) {
            delete filters.specFiles[specFile];
        }
    }
}
if (Object.keys(filters.testcases).length > 0) {
    const filteredTestcaseFiles = {};
    for (const testcase in filters.testcases) {
        getTestcaseMatchFiles(testcase, parseResults.testcases.testcaseTable).forEach(file => filteredTestcaseFiles[file] = true);
    }
    // only execute spec files that include filtered options
    for (const testcaseFile in filters.testcaseFiles) {
        if (!(testcaseFile in filteredTestcaseFiles)) {
            delete filters.testcaseFiles[testcaseFile];
        }
    }
}
if (Object.keys(filters.features).length > 0) {
    const filteredFeatures = {};
    for (const feature in filters.features) {
        if (feature in parseResults.specs.featureTable) {
            for (const specFile of parseResults.specs.featureTable[feature].specFiles) {
                filteredFeatures[specFile] = true;
            }
        }
    }
    for (const specFile in filters.specFiles) {
        if (!(specFile in filteredFeatures)) {
            delete filters.specFiles[specFile];
        }
    }
}
// filter spec files based on those specs verified by testcases if no spec filters were supplied
if ((!completedTestcaseFiles || Object.keys(filters.testcases).length > 0) &&
    Object.keys(filters.specs).length === 0 && completedSpecFiles && Object.keys(filters.features).length === 0) {
    const verifiedSpecs = {};
    const verifiedSpecFiles = {};
    if (Object.keys(filters.testcases).length > 0) {
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
    }
    else {
        // only testcaseFiles were given
        // these have already been considered in parseResults.testcases
        for (const testcase in parseResults.testcases.tree) {
            for (const testcaseId in parseResults.testcases.tree[testcase].testcaseHash) {
                for (const verifiedSpec in parseResults.testcases.tree[testcase].testcaseHash[testcaseId].specVerifyHash) {
                    verifiedSpecs[verifiedSpec] = true;
                }
            }
        }
    }
    // for all verified specs, add the corresponding specFiles...
    for (const verifiedSpec in verifiedSpecs) {
        verifiedSpecFiles[parseResults.specs.specTable[verifiedSpec].specFile] = true;
    }
    // removed specFiles not verified by filtered testcases
    for (const specFile in filters.specFiles) {
        if (!(specFile in verifiedSpecFiles)) {
            delete filters.specFiles[specFile];
        }
    }
    // add specs as spec filter...
    filters.specs = verifiedSpecs;
}
// filter spec files based on those specs verified by testcases if no spec filters were supplied
if ((!completedSpecFiles || Object.keys(filters.features).length > 0 || Object.keys(filters.specs).length > 0) &&
    Object.keys(filters.testcases).length === 0 && completedTestcaseFiles) {
    const verifiedSpecSpecs = {};
    const verifiedFeatureSpecs = {};
    let verifiedSpecs = {};
    const verifiedTestcases = {};
    const verifiedTestcaseFiles = {};
    if (!completedSpecFiles && Object.keys(filters.specs).length === 0 && Object.keys(filters.features).length === 0) {
        // only specFiles were given
        // these have already been considered in parseResults.specs
        for (const spec in parseResults.specs.specTable) {
            verifiedSpecs[spec] = true;
        }
    }
    else {
        if (Object.keys(filters.specs).length > 0) {
            for (const spec in filters.specs) {
                verifiedSpecSpecs[spec] = true;
            }
        }
        if (Object.keys(filters.features).length > 0) {
            for (const feature in filters.features) {
                if (feature in parseResults.specs.specTree) {
                    for (const featureId in parseResults.specs.specTree[feature].specHash) {
                        for (const verifiedSpec in parseResults.specs.specTree[feature].specHash) {
                            verifiedFeatureSpecs[verifiedSpec] = true;
                        }
                    }
                }
            }
        }
        if (Object.keys(filters.specs).length > 0 && Object.keys(filters.features).length === 0) {
            verifiedSpecs = verifiedSpecSpecs;
        }
        else if (Object.keys(filters.features).length > 0 && Object.keys(filters.specs).length === 0) {
            verifiedSpecs = verifiedFeatureSpecs;
        }
        else if (Object.keys(filters.features).length > 0 && Object.keys(filters.specs).length > 0) {
            for (const featureSpec in verifiedFeatureSpecs) {
                if (featureSpec in verifiedSpecSpecs) {
                    verifiedSpecs[featureSpec] = true;
                }
            }
        }
    }
    // get all testcase files that verify the extracted specs
    for (const verifiedSpec in verifiedSpecs) {
        if (verifiedSpec in parseResults.testcases.verifyTable) {
            for (const testcaseId in parseResults.testcases.verifyTable[verifiedSpec]) {
                verifiedTestcases[testcaseId] = true;
                verifiedTestcaseFiles[parseResults.testcases.testcaseTable[testcaseId].testcaseFile] = true;
            }
        }
    }
    // removed testcase files not verified by filtered specs
    for (const testcaseFile in filters.testcaseFiles) {
        if (!(testcaseFile in verifiedTestcaseFiles)) {
            delete filters.testcaseFiles[testcaseFile];
        }
    }
    // add testcases as testcases filter...
    filters.testcases = verifiedTestcases;
}
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
// if no spec files are present in filters, use all spec files in specs folder
function completeSpecFiles(argv, filters) {
    // if user manually defined an empty specFiles array, do not add specFiles from folder
    if (Object.keys(filters.specFiles).length === 0 && !argv.specFiles) {
        io_1.getAllFiles(specsDir, '.spec.ts').forEach(specFile => filters.specFiles[specFile] = true);
        return true;
    }
    return false;
}
// if no testcase files are present in filters, use all testcase files in testcase folder
function completeTestcaseFiles(argv, filters) {
    // if user manually defined an empty testcaseFiles array, do not add testcaseFiles from folder
    if (Object.keys(filters.testcaseFiles).length === 0 && !argv.testcaseFiles) {
        io_1.getAllFiles(testcasesDir, '.tc.ts').forEach(testcaseFile => filters.testcaseFiles[testcaseFile] = true);
        return true;
    }
    return false;
}
function getSpecMatchFiles(spec, table) {
    if (spec.substr(0, 1) === '-') {
        return [];
    }
    else if (spec in table) {
        return [table[spec].specFile];
    }
    else if (spec.substr(spec.length - 1, 1) === '*') {
        const matchStr = spec.substr(0, spec.length - 1);
        const matchFilesObj = {};
        for (const specEntry in table) {
            if (specEntry.length >= matchStr.length && specEntry.substr(0, matchStr.length) === matchStr) {
                matchFilesObj[table[specEntry].specFile] = true;
            }
        }
        return Object.keys(matchFilesObj);
    }
    return [];
}
function getTestcaseMatchFiles(testcase, table) {
    if (testcase.substr(0, 1) === '-') {
        return [];
    }
    else {
        const matchFilesObj = {};
        for (const testcaseEntry in table) {
            if (testcaseEntry.substr(0, testcase.length) === testcase) {
                matchFilesObj[table[testcaseEntry].testcaseFile] = true;
            }
        }
        return Object.keys(matchFilesObj);
    }
}
function completeFilePaths(filters) {
    const specFilePaths = {};
    const testcaseFilePaths = {};
    for (const specFile in filters.specFiles) {
        const specFilePath = path.join(specsDir, `${specFile}.spec.ts`);
        specFilePaths[specFilePath] = true;
    }
    for (const testcaseFile in filters.testcaseFiles) {
        const testcaseFilePath = path.join(testcasesDir, `${testcaseFile}.tc.ts`);
        testcaseFilePaths[testcaseFilePath] = true;
    }
    filters.specFiles = specFilePaths;
    filters.testcaseFiles = testcaseFilePaths;
}
/**
 * Loads all specFiles, testcaseFiles, features, specs and testcases defined in lists and sublists of argv.listFiles
 * @param argv
 */
function mergeLists(list, filters) {
    if (list.specFiles) {
        list.specFiles.forEach(value => filters.specFiles[value] = true);
    }
    if (list.testcaseFiles) {
        list.testcaseFiles.forEach(value => filters.testcaseFiles[value] = true);
    }
    if (list.features) {
        list.features.forEach(value => filters.features[value] = true);
    }
    if (list.specs) {
        list.specs.forEach(value => filters.specs[value] = true);
    }
    if (list.testcases) {
        list.testcases.forEach(value => filters.testcases[value] = true);
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
                mergeLists(sublist, filters);
            }
        }
    }
}
//# sourceMappingURL=cli.js.map