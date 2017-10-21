"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('ts-node/register');
require('tsconfig-paths/register');
const path = require("path");
const fs = require("fs");
const jsonfile = require("jsonfile");
const parser_1 = require("./parser");
const io_1 = require("./io");
const allureReport_1 = require("./allureReport");
const optimist = require("optimist");
const merge = require("deepmerge");
const _1 = require("../");
const webdriverio_workflo_1 = require("webdriverio-workflo");
const table = require('text-table');
const pkg = require('../../package.json');
let dateTime = require('../../utils/report.js').getDateTime();
const VERSION = pkg.version;
const ALLOWED_ARGV = [
    'host', 'port', 'logLevel', 'coloredLogs', 'baseUrl', 'waitforTimeout',
    'connectionRetryTimeout', 'connectionRetryCount', 'testInfoFilePath',
    'workfloOpts'
    //, 'jasmineOpts', 'user', 'key', 'watch', 'path'
];
let configFile;
let optionsOffset = 2; // config file defined as first "parameter"
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
const testcaseStatus = {
    passed: 'passed',
    failed: 'failed',
    broken: 'broken',
    unknown: 'unknown',
    pending: 'pending'
};
const specStatus = {
    passed: 'passed',
    failed: 'failed',
    broken: 'broken',
    unverified: 'unverified',
    unknown: 'unknown'
};
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
    .describe('info', 'shows static information about testcases and specs')
    .describe('testcases', 'restricts test execution to these testcases\n' +
    '\t\t\t   \'["Suite1", "Suite2.Testcase1"]\' => execute all testcases of Suite1 and Testcase1 of Suite2\n' +
    '\t\t\t   \'["Suite2", "-Suite2.Testcase2"]\' => execute all testcases of Suite2 except for Testcase2\n')
    .describe('features', 'restricts test execution to these features\n' +
    '\t\t\t   \'["Login", "Logout"]\' => execute all testcases which verify specs defined within these features\n' +
    '\t\t\t   \'["-Login"]\' => execute all testcases except those which verify specs defined within these features\n')
    .describe('specs', 'restricts test execution to these specs\n' +
    '\t\t\t   \'["3.2"]\' => execute all testcases which verify spec 3.2\n' +
    '\t\t\t   \'["1.1*", "-1.1.2.4"]\' => 1.1* includes spec 1.1 and all of its sub-specs (eg. 1.1.2), -1.1.2.4 excludes spec 1.1.2.4\n' +
    '\t\t\t   \'["1.*"]\' => 1.* excludes spec 1 itself but includes of of its sub-specs\n')
    .describe('testcaseFiles', 'restricts test execution to testcases defined within these files\n' +
    '\t\t\t   \'["testcaseFile1", "testcaseFile2"]\' => execute all testcases defined within testcaseFile1.tc.ts and testcaseFile2.tc.ts\n')
    .describe('specFiles', 'restricts test execution to testcases verified by specs defined within these files\n' +
    '\t\t\t   \'["specFile1", "specFile2"]\' => execute all testcases verified by specs defined within specFile1.spec.ts and specFile2.spec.ts\n')
    .describe('listFiles', 'restricts test execution to the testcases, specs, testcaseFiles, specFiles and lists defined within these files \n' +
    '\t\t\t   \'["listFile1"]\' => execute all testcases include by the contents of listFile1.list.ts\n')
    .describe('specStatus', 'restricts specs by status of their criteria set during their last execution\n' +
    '\t\t\t   \'["passed", "failed", "broken", "unverified", "unknown"]\' => these are all available status - combine as you see fit\n' +
    '\t\t\t   \'["faulty"]\' => faulty is a shortcut for failed, broken, unverified and unknown\n')
    .describe('testcaseStatus', 'restricts testcases by given status\n' +
    '\t\t\t   \'["passed", "failed", "broken", "pending", "unknown"]\' => these are all available status - combine as you see fit\n' +
    '\t\t\t   \'["faulty"]\' => faulty is a shortcut for failed, broken and unknown\n')
    .describe('dates', 'restricts testcases and specs (oldest spec criteria) by given date and time (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)\n' +
    '\t\t\t   \'["(2017-03-10,2017-10-28)"]\' => restricts by status set between 2017-03-10 and 2017-10-28 (both at 0 pm, 0 min, 0 sec)\n' +
    '\t\t\t   \'["2017-07-21", "2017-07-22T14:51:13"]\' => restricts by last status set on 2017-07-21 or 2017-07-22 at 2 pm, 51 min, 13 sec\n')
    .describe('generateReport', 'generates report for latest results or\n' +
    '\t\t\t   \'2017-10-10_20-38-13\' => generate report for given result folder\n')
    .describe('openReport', 'opens report generated latest results or\n' +
    '\t\t\t   \'2017-10-10_20-38-13\' => open report for given result folder\n')
    .describe('report', 'generates and opens report for latest results or\n' +
    '\t\t\t   \'2017-10-10_20-38-13\' => generate and open report for given result folder\n')
    .describe('traceSpec', 'show spec file defining and all testcases, testcase files and manual result files verifying this spec\n' +
    '\t\t\t   \'4.1\' => show traceability information for spec 4.1\n')
    .describe('traceTestcase', 'show testcase file defining and all specs and spec files verified by this testcase\n' +
    '\t\t\t   \'Suite1.testcase1\' => show traceability information for testcase1 in Suite1\n')
    .describe('manualOnly', 'do not run automatic testcases and consider only manual results')
    .describe('automaticOnly', 'run only automatic testcases and do not consider manual results')
    .describe('reportErrorsInstantly', 'report broken testcase errors and errors from verification failures immediatly')
    .describe('rerunFaulty', 'reruns all faulty specs and testcases from the latest execution\n' +
    '\t\t\t   \'2017-10-10_20-38-13\' => reruns all faulty specs and testcases from the results folder \'2017-10-10_20-38-13\'\n')
    .string(['host', 'path', 'logLevel', 'baseUrl', 'specs', 'testcases', 'specFiles', 'testcaseFiles', 'listFiles', 'rerunFaulty'
    /*, 'user', 'key', 'screenshotPath', 'framework', 'reporters', 'suite', 'spec' */ 
])
    .boolean(['coloredLogs', 'watch', 'reportErrorsInstantly', 'cleanResultsStatus'])
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
 * otherwise run config sequence
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
checkGenerateReport().then(() => {
    // check workflo config properties
    const mandatoryProperties = ['testDir', 'baseUrl', 'specFiles', 'testcaseFiles', 'manualResultFiles', 'uidStorePath'];
    for (const property of mandatoryProperties) {
        if (!(property in workfloConfig)) {
            throw new Error(`Property '${property}' must be defined in workflo config file!`);
        }
    }
    if (typeof workfloConfig.testDir === 'undefined') {
        throw new Error(`Please specify option 'testDir' in workflo.conf.js file!`);
    }
    const testDir = workfloConfig.testDir;
    const srcDir = path.join(testDir, 'src');
    const specsDir = path.join(srcDir, 'specs');
    const testcasesDir = path.join(srcDir, 'testcases');
    const listsDir = path.join(srcDir, 'lists');
    const manDir = path.join(srcDir, 'manualResults');
    const testInfoFilePath = path.join(testDir, 'testinfo.json');
    const resultsPath = path.join(workfloConfig.testDir, 'results');
    const latestRunPath = path.join(resultsPath, 'latestRun');
    const mergedResultsPath = path.join(resultsPath, 'mergedResults.json');
    const filters = {};
    const mergedFilters = {};
    const mergeKeys = ['features', 'specs', 'testcases', 'specFiles', 'testcaseFiles'];
    let mergedResults = {
        specs: {},
        testcases: {}
    };
    if (fs.existsSync(mergedResultsPath)) {
        mergedResults = JSON.parse(fs.readFileSync(mergedResultsPath, 'utf8'));
    }
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
    completeSpecFiles(argv, mergedFilters);
    completeTestcaseFiles(argv, mergedFilters);
    const parseResults = {
        specs: parser_1.specFilesParse(Object.keys(mergedFilters.specFiles)),
        testcases: parser_1.testcaseFilesParse(Object.keys(mergedFilters.testcaseFiles))
    };
    cleanResultsStatus();
    // check if all defined filters exist
    checkFiltersExist();
    // add manual test cases to test information
    const manualResults = importManualResults();
    // trace argv handling
    if (handleTracingArgs()) {
        process.exit(0);
    }
    const filterDates = buildFilterDates();
    // filters contains all filter criteria that is actually executed
    // and will be filtered further
    filters.specFiles = mergedFilters.specFiles;
    filters.testcaseFiles = mergedFilters.testcaseFiles;
    // get all features and specs in specFiles
    for (const specFile in filters.specFiles) {
        filters.features = merge(parseResults.specs.specFileTable[specFile].features, filters.features || {});
        filters.specs = merge(parseResults.specs.specFileTable[specFile].specs, filters.specs || {});
    }
    // get all testcases in testcaseFiles
    for (const testcaseFile in filters.testcaseFiles) {
        filters.testcases = merge(parseResults.testcases.testcaseFileTable[testcaseFile].testcases, filters.testcases || {});
    }
    // remove suite names from filters.testcases
    for (const testcase in filters.testcases) {
        if (!(testcase in mergedResults.testcases)) {
            delete filters.testcases[testcase];
        }
    }
    if ('rerunFaulty' in argv) {
        handleRerunFaulty();
    }
    else {
        filterSpecsByDate();
        filterSpecsByStatus();
        filterTestcasesByDate();
        filterTestcasesByStatus();
        // remove specs not matched by specs filter
        filterSpecsBySpecs();
        // remove specs not matched by features filter
        filterSpecsByFeatures();
        // remove testcases not matched by testcases filter
        filterTestcasesByTestcases();
        // remove specs not matched by verifies in testcases or manual results
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
    }
    // add manual specs based on manual result files
    addManualResultFilesAndSpecs();
    const criteriaAnalysis = analyseCriteria();
    if (argv.manualOnly) {
        handleManualOnly();
        if (argv.automaticOnly) {
            throw new Error('The flags --automaticOnly and --manualOnly may not be used simultaneously');
        }
    }
    else if (argv.automaticOnly) {
        handleAutomaticOnly();
    }
    const automatedCriteriaRate = (criteriaAnalysis.allCriteriaCount > 0) ? criteriaAnalysis.automatedCriteriaCount / criteriaAnalysis.allCriteriaCount : 0;
    const manualCriteriaRate = (criteriaAnalysis.allCriteriaCount > 0) ? criteriaAnalysis.manualCriteriaCount / criteriaAnalysis.allCriteriaCount : 0;
    const uncoveredCriteriaRate = (criteriaAnalysis.allCriteriaCount > 0) ? criteriaAnalysis.uncoveredCriteriaCount / criteriaAnalysis.allCriteriaCount : 0;
    const infoObject = {
        specFiles: Object.keys(filters.specFiles).length,
        testcaseFiles: Object.keys(filters.testcaseFiles).length,
        manualResultFiles: Object.keys(filters.manualResultFiles).length,
        features: Object.keys(filters.features).length,
        specs: Object.keys(filters.specs).length,
        suites: Object.keys(getSuites()).length,
        testcases: Object.keys(filters.testcases).length,
        manualResults: Object.keys(filters.manualSpecs).length,
        allCriteriaCount: {
            count: criteriaAnalysis.allCriteriaCount,
            percentage: `(${(criteriaAnalysis.allCriteriaCount > 0) ? 100 : 0}%)`
        },
        automatedCriteria: {
            count: criteriaAnalysis.automatedCriteriaCount,
            percentage: `(~${automatedCriteriaRate.toLocaleString("en", { style: "percent" })})`
        },
        manualCriteria: {
            count: criteriaAnalysis.manualCriteriaCount,
            percentage: `(~${manualCriteriaRate.toLocaleString("en", { style: "percent" })})`
        },
        uncoveredCriteria: {
            count: criteriaAnalysis.uncoveredCriteriaCount,
            percentage: `(~${uncoveredCriteriaRate.toLocaleString("en", { style: "percent" })})`
        },
        uncoveredCriteriaObject: {}
    };
    if (criteriaAnalysis.uncoveredCriteriaCount > 0) {
        for (const spec in criteriaAnalysis.specs) {
            const uncoveredCriteria = Object.keys(criteriaAnalysis.specs[spec].uncovered);
            if (uncoveredCriteria.length > 0) {
                infoObject.uncoveredCriteriaObject[spec] = uncoveredCriteria;
            }
        }
    }
    const translations = {
        specFiles: 'Spec Files',
        testcaseFiles: 'Testcase Files',
        manualResultFiles: 'Manual Result Files',
        features: 'Features',
        specs: 'Specs',
        suites: 'Suites',
        testcases: 'Testcases',
        manualResults: 'Manual Results (Specs)',
        allCriteriaCount: 'Defined Spec Criteria',
        automatedCriteria: 'Automated Criteria',
        manualCriteria: 'Manual Criteria',
        uncoveredCriteria: 'Uncovered Criteria',
        uncoveredCriteriaObject: 'Uncovered Criteria Object'
    };
    const invertedTranslations = _1.objectFunctions.invert(translations);
    const printObject = _1.objectFunctions.mapProperties(invertedTranslations, value => infoObject[value]);
    if (argv.info) {
        function toTable(key) {
            return [key, printObject[key], ''];
        }
        function toPercentTable(key) {
            return [key, printObject[key].count, printObject[key].percentage];
        }
        const infoTable = table([
            ['FILTER FILES:', '', ''],
            toTable(translations.testcaseFiles),
            toTable(translations.specFiles),
            toTable(translations.manualResultFiles),
            ['', '', ''],
            ['FILTERS:', '', ''],
            toTable(translations.suites),
            toTable(translations.testcases),
            toTable(translations.features),
            toTable(translations.specs),
            toTable(translations.manualResults),
            ['', '', ''],
            ['CRITERIA COUNT:', '', ''],
            toPercentTable(translations.automatedCriteria),
            toPercentTable(translations.manualCriteria),
            toPercentTable(translations.uncoveredCriteria),
            toPercentTable(translations.allCriteriaCount)
        ], { align: ['l', 'r', 'r'] });
        console.log('\n' + infoTable + '\n');
        if (Object.keys(infoObject.uncoveredCriteriaObject).length > 0) {
            console.log('UNCOVERED CRITERIA:');
            let uncoveredTableRows = [];
            for (const spec in infoObject.uncoveredCriteriaObject) {
                uncoveredTableRows.push([`${spec}:`, `[${infoObject.uncoveredCriteriaObject[spec].join(', ')}]`]);
            }
            const uncoveredTable = table(uncoveredTableRows, { align: ['l', 'l'] });
            console.log(uncoveredTable);
        }
        process.exit(0);
    }
    if (fs.existsSync(testInfoFilePath)) {
        fs.unlinkSync(testInfoFilePath);
    }
    const testinfo = {
        criteriaAnalysis,
        executionFilters: filters,
        parseResults: parseResults,
        traceInfo: buildTraceInfo(),
        printObject: printObject,
        uidStorePath: workfloConfig.uidStorePath,
        allure: workfloConfig.allure,
        reportResultsInstantly: (typeof workfloConfig.reportResultsInstantly !== 'undefined') ? workfloConfig.reportResultsInstantly : false,
        reportErrorsInstantly: argv.reportErrorsInstantly || (typeof workfloConfig.reportErrorsInstantly !== 'undefined') ? workfloConfig.reportErrorsInstantly : false,
        automaticOnly: argv.automaticOnly,
        manualOnly: argv.manualOnly,
        resultsPath,
        latestRunPath,
        browser: workfloConfig.capabilities.browserName,
        dateTime: dateTime,
        mergedResultsPath
    };
    jsonfile.writeFileSync(testInfoFilePath, testinfo);
    argv.testInfoFilePath = testInfoFilePath;
    let args = {};
    for (let key of ALLOWED_ARGV) {
        if (argv[key] !== undefined) {
            args[key] = argv[key];
        }
    }
    // write latest run file
    if (typeof process.env.LATEST_RUN === 'undefined' && (Object.keys(filters.specs).length > 0 || Object.keys(filters.testcases).length > 0)) {
        if (!fs.existsSync(resultsPath)) {
            fs.mkdirSync(resultsPath);
        }
        fs.writeFile(latestRunPath, dateTime, err => {
            if (err) {
                return console.error(err);
            }
            console.log(`Set latest run: ${dateTime}`);
        });
        process.env.LATEST_RUN = dateTime;
    }
    else {
        console.log("No specs or testcases match execution filters. Quitting...");
        process.exit(0);
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
    function checkFiltersExist() {
        for (const testcase in mergedFilters.testcases) {
            let matchStr = testcase;
            if (matchStr.substr(0, 1) === '-') {
                matchStr = matchStr.substr(1, matchStr.length - 1);
            }
            if (!(matchStr in parseResults.testcases.testcaseTable) && !(matchStr in parseResults.testcases.tree)) {
                throw new Error(`Testcase '${testcase}' did not match any defined testcase or suite!`);
            }
        }
        for (const spec in mergedFilters.specs) {
            let matchStr = spec;
            if (matchStr.substr(0, 1) === '-') {
                matchStr = matchStr.substr(1, matchStr.length - 1);
            }
            if (!(matchStr in parseResults.specs.specTable)) {
                if (matchStr.substr(matchStr.length - 1, 1) === '*') {
                    matchStr = matchStr.substr(0, matchStr.length - 1);
                }
                let found = false;
                for (const _spec in parseResults.specs.specTable) {
                    if (_spec.length >= matchStr.length && _spec.substr(0, matchStr.length) === matchStr) {
                        found = true;
                    }
                }
                if (!found) {
                    throw new Error(`Spec '${spec}' did not match any defined spec!`);
                }
            }
        }
        for (const feature in mergedFilters.features) {
            let matchStr = feature;
            if (matchStr.substr(0, 1) === '-') {
                matchStr = matchStr.substr(1, matchStr.length - 1);
            }
            if (!(matchStr in parseResults.specs.featureTable)) {
                throw new Error(`Feature '${feature}' did not match any defined feature!`);
            }
        }
    }
    // if no spec files are present in filters, use all spec files in specs folder
    function completeSpecFiles(argv, _filters) {
        // if user manually defined an empty specFiles array, do not add specFiles from folder
        if (Object.keys(_filters.specFiles).length === 0 && !argv.specFiles) {
            io_1.getAllFiles(specsDir, '.spec.ts').forEach(specFile => _filters.specFiles[specFile] = true);
        }
        else {
            let removeOnly = true;
            const removeSpecFiles = {};
            for (const specFile in _filters.specFiles) {
                let remove = false;
                let matchStr = specFile;
                if (specFile.substr(0, 1) === '-') {
                    remove = true;
                    matchStr = specFile.substr(1, specFile.length - 1);
                }
                else {
                    removeOnly = false;
                }
                if (remove) {
                    delete _filters.specFiles[specFile];
                    removeSpecFiles[matchStr] = true;
                }
            }
            if (removeOnly) {
                io_1.getAllFiles(specsDir, '.spec.ts')
                    .filter(specFile => !(specFile in removeSpecFiles))
                    .forEach(specFile => _filters.specFiles[specFile] = true);
            }
        }
    }
    // if no testcase files are present in filters, use all testcase files in testcase folder
    function completeTestcaseFiles(argv, _filters) {
        // if user manually defined an empty testcaseFiles array, do not add testcaseFiles from folder
        if (Object.keys(_filters.testcaseFiles).length === 0 && !argv.testcaseFiles) {
            io_1.getAllFiles(testcasesDir, '.tc.ts').forEach(testcaseFile => _filters.testcaseFiles[testcaseFile] = true);
        }
        else {
            let removeOnly = true;
            const removeTestcaseFiles = {};
            for (const testcaseFile in _filters.testcaseFiles) {
                let remove = false;
                let matchStr = testcaseFile;
                if (testcaseFile.substr(0, 1) === '-') {
                    remove = true;
                    matchStr = testcaseFile.substr(1, testcaseFile.length - 1);
                }
                else {
                    removeOnly = false;
                }
                if (remove) {
                    delete _filters.testcaseFiles[testcaseFile];
                    removeTestcaseFiles[matchStr] = true;
                }
            }
            if (removeOnly) {
                io_1.getAllFiles(testcasesDir, '.tc.ts')
                    .filter(testcaseFile => !(testcaseFile in removeTestcaseFiles))
                    .forEach(testcaseFile => _filters.testcaseFiles[testcaseFile] = true);
            }
        }
    }
    function completeFilePaths(_filters) {
        const specFilePaths = {};
        const testcaseFilePaths = {};
        for (const specFile in _filters.specFiles) {
            let matchStr = specFile;
            let prefix = '';
            if (specFile.substr(0, 1) === '-') {
                matchStr = specFile.substr(1, specFile.length - 1);
                prefix = '-';
            }
            const specFilePath = path.join(`${prefix}${specsDir}`, `${matchStr}.spec.ts`);
            specFilePaths[specFilePath] = true;
        }
        for (const testcaseFile in _filters.testcaseFiles) {
            let matchStr = testcaseFile;
            let prefix = '';
            if (testcaseFile.substr(0, 1) === '-') {
                matchStr = testcaseFile.substr(1, testcaseFile.length - 1);
                prefix = '-';
            }
            const testcaseFilePath = path.join(`${prefix}${testcasesDir}`, `${matchStr}.tc.ts`);
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
                    const sublist = require(listFilePath).default;
                    // recursively traverse sub list files
                    mergeLists(sublist, _filters);
                }
            }
        }
    }
    function filterSpecsBySpecs() {
        if (Object.keys(mergedFilters.specs).length > 0) {
            const filteredSpecs = {};
            const filteredFeatures = {};
            let removeOnly = true;
            for (const spec in mergedFilters.specs) {
                let remove = false;
                let matchStr = spec;
                if (spec.substr(0, 1) === '-') {
                    remove = true;
                    matchStr = spec.substr(1, spec.length - 1);
                }
                else {
                    removeOnly = false;
                }
                if (matchStr.substr(matchStr.length - 1, 1) === '*') {
                    matchStr = matchStr.substr(0, matchStr.length - 1);
                    for (const specEntry in parseResults.specs.specTable) {
                        if (specEntry.length >= matchStr.length && specEntry.substr(0, matchStr.length) === matchStr) {
                            if (remove) {
                                delete filters.specs[specEntry];
                            }
                            else {
                                filteredSpecs[specEntry] = true;
                            }
                        }
                    }
                }
                else {
                    if (remove) {
                        delete filters.specs[matchStr];
                    }
                    else {
                        filteredSpecs[matchStr] = true;
                    }
                }
            }
            if (!removeOnly) {
                for (const spec in filters.specs) {
                    if (!(spec in filteredSpecs)) {
                        delete filters.specs[spec];
                    }
                }
            }
        }
    }
    function filterSpecsByFeatures() {
        if (Object.keys(mergedFilters.features).length > 0) {
            const filteredSpecs = {};
            let removeOnly = true;
            for (const feature in mergedFilters.features) {
                let remove = false;
                let matchStr = feature;
                if (feature.substr(0, 1) === '-') {
                    remove = true;
                    matchStr = feature.substr(1, feature.length - 1);
                }
                else {
                    removeOnly = false;
                }
                if (matchStr in parseResults.specs.featureTable) {
                    for (const spec in parseResults.specs.featureTable[matchStr].specs) {
                        if (remove) {
                            delete filters.specs[spec];
                        }
                        else {
                            filteredSpecs[spec] = true;
                        }
                    }
                }
            }
            // delete specs not matched by features
            if (!removeOnly) {
                for (const spec in filters.specs) {
                    if (!(spec in filteredSpecs)) {
                        delete filters.specs[spec];
                    }
                }
            }
        }
    }
    function filterTestcasesByTestcases() {
        if (Object.keys(mergedFilters.testcases).length > 0) {
            const filteredTestcases = {};
            let removeOnly = true;
            for (const testcase in mergedFilters.testcases) {
                let remove = false;
                let matchStr = testcase;
                if (testcase.substr(0, 1) === '-') {
                    remove = true;
                    matchStr = testcase.substr(1, testcase.length - 1);
                }
                else {
                    removeOnly = false;
                }
                const testcaseParts = matchStr.split('.');
                let insideTable = false;
                for (const testcaseEntry in parseResults.testcases.testcaseTable) {
                    const entryParts = testcaseEntry.split('.');
                    let match = true;
                    for (let i = 0; i < testcaseParts.length; ++i) {
                        if (testcaseParts[i] !== entryParts[i]) {
                            match = false;
                        }
                    }
                    if (match) {
                        insideTable = true;
                        if (remove) {
                            delete filters.testcases[testcaseEntry];
                        }
                        else {
                            filteredTestcases[testcaseEntry] = true;
                        }
                    }
                }
                if (!insideTable) {
                    delete mergedFilters.testcases[testcase];
                    delete filters.testcases[testcase];
                }
            }
            // only execute spec files that include filtered options
            if (!removeOnly) {
                for (const testcase in filters.testcases) {
                    if (!(testcase in filteredTestcases)) {
                        delete filters.testcases[testcase];
                    }
                }
            }
        }
    }
    function filterSpecsByTestcases() {
        if (Object.keys(mergedFilters.testcaseFiles).length > 0 && Object.keys(mergedFilters.testcases).length > 0) {
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
            // remove specs not verified by filtered testcases or manual results
            for (const spec in filters.specs) {
                if (!(spec in verifiedSpecs)) {
                    delete filters.specs[spec];
                }
            }
        }
    }
    function filterTestcasesBySpecs() {
        const filteredTestcases = {};
        if (Object.keys(filters.specs).length > 0) {
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
    function importManualResults() {
        let mergedManualTestcases = {};
        let fileTable = {};
        const manualTestcaseResults = io_1.getAllFiles(manDir, '.man.ts');
        for (const manualTestcaseFile of manualTestcaseResults) {
            const manualTestcase = require(manualTestcaseFile).default;
            fileTable[manualTestcaseFile] = manualTestcase;
            for (const spec in manualTestcase) {
                if (spec in mergedManualTestcases) {
                    throw new Error(`Manual results for spec '${spec}' were declared in both '${manualTestcaseFile}' and '${mergedManualTestcases[spec].file}'`);
                }
                else {
                    mergedManualTestcases[spec] = {
                        file: manualTestcaseFile,
                        criteria: manualTestcase[spec]
                    };
                }
            }
        }
        return {
            fileTable: fileTable,
            specTable: mergedManualTestcases
        };
    }
    function analyseCriteria() {
        const analysedCriteria = {
            specs: {},
            allCriteriaCount: 0,
            automatedCriteriaCount: 0,
            manualCriteriaCount: 0,
            uncoveredCriteriaCount: 0,
        };
        for (const spec in filters.specs) {
            analysedCriteria.specs[spec] = {
                automated: {},
                manual: {},
                uncovered: {},
                undefined: false
            };
            // spec was not defined in a spec file
            if (!(spec in parseResults.specs.specTable)) {
                analysedCriteria.specs[spec].undefined = true;
            }
            else {
                for (const criteria in parseResults.specs.specTable[spec].criteria) {
                    let covered = false;
                    if (spec in manualResults.specTable && criteria in manualResults.specTable[spec].criteria) {
                        covered = true;
                        analysedCriteria.specs[spec].manual[criteria] = true;
                        analysedCriteria.manualCriteriaCount++;
                    }
                    if (spec in parseResults.testcases.verifyTable) {
                        let _autoCovered = false;
                        for (const testcaseId in parseResults.testcases.verifyTable[spec]) {
                            const suite = parseResults.testcases.testcaseTable[testcaseId].suiteId;
                            if (criteria in parseResults.testcases.tree[suite].testcaseHash[testcaseId].specVerifyHash[spec]) {
                                if (!_autoCovered) {
                                    analysedCriteria.automatedCriteriaCount++;
                                }
                                _autoCovered = true;
                                analysedCriteria.specs[spec].automated[criteria] = true;
                            }
                        }
                        if (_autoCovered) {
                            if (covered) {
                                throw new Error(`Criteria ${criteria} of spec ${spec} must not be both verified automatically and tested manually!`);
                            }
                            else {
                                covered = true;
                            }
                        }
                    }
                    if (!covered) {
                        analysedCriteria.specs[spec].uncovered[criteria] = true;
                        analysedCriteria.uncoveredCriteriaCount++;
                    }
                }
            }
        }
        analysedCriteria.allCriteriaCount =
            analysedCriteria.automatedCriteriaCount +
                analysedCriteria.manualCriteriaCount +
                analysedCriteria.uncoveredCriteriaCount;
        return analysedCriteria;
    }
    function addManualResultFilesAndSpecs() {
        filters.manualResultFiles = {};
        filters.manualSpecs = {};
        for (const spec in filters.specs) {
            if (spec in manualResults.specTable) {
                filters.manualResultFiles[manualResults.specTable[spec].file] = true;
                filters.manualSpecs[spec] = true;
            }
        }
    }
    function getSuites() {
        const suites = {};
        for (const testcase in filters.testcases) {
            suites[parseResults.testcases.testcaseTable[testcase].suiteId] = true;
        }
        return suites;
    }
    function handleTracingArgs() {
        let traced = false;
        if (argv.traceTestcase) {
            if (argv.traceTestcase in parseResults.testcases.testcaseTable) {
                const testcaseTraceInfo = buildTestcaseTraceInfo(argv.traceTestcase);
                printTestcaseTraceInfo(testcaseTraceInfo);
            }
            else {
                console.warn(`\nTestcase '${argv.traceTestcase}' could not be found and traced!`);
            }
            traced = true;
        }
        if (argv.traceSpec) {
            if (argv.traceSpec in parseResults.specs.specTable) {
                const specTraceInfo = buildSpecTraceInfo(argv.traceSpec);
                printSpecTraceInfo(specTraceInfo);
            }
            else {
                console.warn(`\nSpec '${argv.traceSpec}' could not be found and traced!`);
            }
            traced = true;
        }
        return traced;
    }
    function buildTestcaseTraceInfo(testcase) {
        const testcaseTableEntry = parseResults.testcases.testcaseTable[testcase];
        let testcaseFile = testcaseTableEntry.testcaseFile.replace(srcDir, '');
        testcaseFile = testcaseFile.substring(1, testcaseFile.length).replace('\\', '\/');
        const specHash = parseResults.testcases.tree[testcaseTableEntry.suiteId].testcaseHash[testcase].specVerifyHash;
        const specFilesHash = (specHash) ? _1.arrayFunctions.mapToObject(Object.keys(specHash).map(spec => parseResults.specs.specTable[spec].specFile), (spec) => true) : {};
        const specFiles = Object.keys(specFilesHash);
        const specs = (specHash) ? Object.keys(specHash).map(spec => {
            `${spec}: [${Object.keys(specHash[spec]).join(', ')}] ('${parseResults.specs.specTable[spec].specFile}')`;
            let file = parseResults.specs.specTable[spec].specFile.replace(srcDir, '');
            file = `${file.substring(1, file.length).replace('\\', '\/')}`;
            return `${spec}: [${Object.keys(specHash[spec]).join(', ')}] (${file})`;
        }) : [];
        return {
            testcase,
            testcaseFile: `${testcaseFile}`,
            specs
        };
    }
    function buildSpecTraceInfo(spec) {
        let specFile = parseResults.specs.specTable[spec].specFile.replace(srcDir, '');
        specFile = specFile.substring(1, specFile.length).replace('\\', '\/');
        const testcaseHash = parseResults.testcases.verifyTable[spec];
        const testcases = (testcaseHash) ? Object.keys(testcaseHash) : [];
        const testcaseFileHash = (testcaseHash) ? _1.arrayFunctions.mapToObject(testcases.map(testcase => parseResults.testcases.testcaseTable[testcase].testcaseFile), (testcase) => true) : {};
        const testcaseFiles = Object.keys(testcaseFileHash);
        let manualFile = (spec in manualResults.specTable) ? manualResults.specTable[spec].file.replace(srcDir, '') : '';
        if (manualFile.length > 0) {
            manualFile = `${manualFile.substring(1, manualFile.length).replace('\\', '\/')}`;
        }
        let testcaseCriteria = {};
        testcases.forEach(testcase => testcaseCriteria[testcase] = Object.keys(parseResults.testcases.tree[parseResults.testcases.testcaseTable[testcase].suiteId].testcaseHash[testcase].specVerifyHash[spec]));
        const testcaseCriteriaStrs = Object.keys(testcaseCriteria).map(testcase => {
            let file = parseResults.testcases.testcaseTable[testcase].testcaseFile.replace(srcDir, '');
            file = `${file.substring(1, file.length).replace('\\', '\/')}`;
            return `${testcase}: [${testcaseCriteria[testcase].join(', ')}] (${file})`;
        });
        const criteriaVerificationFiles = {};
        const manualCriteria = (spec in manualResults.specTable) ? Object.keys(manualResults.specTable[spec].criteria) : [];
        const manualCriteriaStr = (manualCriteria.length > 0) ? `[${manualCriteria.join(', ')}] (${manualFile})` : '';
        for (const criteria in parseResults.specs.specTable[spec].criteria) {
            if (manualCriteria.length > 0 && criteria in manualResults.specTable[spec].criteria) {
                criteriaVerificationFiles[criteria] = {
                    manualFile
                };
            }
            else {
                const tcHash = {};
                let _testcases = [];
                let _testcaseIds = {};
                for (const tc in testcaseCriteria) {
                    if (criteria in parseResults.testcases.tree[parseResults.testcases.testcaseTable[tc].suiteId].testcaseHash[tc].specVerifyHash[spec]) {
                        let _testcaseFile = parseResults.testcases.testcaseTable[tc].testcaseFile.replace(srcDir, '');
                        _testcaseFile = `${_testcaseFile.substring(1, _testcaseFile.length).replace('\\', '\/')}`;
                        _testcaseIds[tc] = true;
                        if (!tcHash[_testcaseFile]) {
                            tcHash[_testcaseFile] = [tc];
                        }
                        else {
                            tcHash[_testcaseFile].push(tc);
                        }
                    }
                }
                for (const tcFile in tcHash) {
                    _testcases.push(`${tcHash[tcFile].join(', ')} (${tcFile})`);
                }
                criteriaVerificationFiles[criteria] = {
                    testcases: _testcases,
                    testcaseIds: _testcaseIds
                };
            }
        }
        return {
            spec,
            specFile: `${specFile}`,
            testcaseCriteriaStrs,
            criteriaVerificationFiles,
            manualCriteria,
            manualCriteriaStr
        };
    }
    function buildTraceInfo() {
        let traceInfo = {
            specs: {},
            testcases: {}
        };
        for (const testcase in filters.testcases) {
            traceInfo.testcases[testcase] = buildTestcaseTraceInfo(testcase);
        }
        for (const spec in filters.specs) {
            traceInfo.specs[spec] = buildSpecTraceInfo(spec);
        }
        return traceInfo;
    }
    function printTestcaseTraceInfo(testcaseTraceInfo) {
        const content = [];
        content.push(['Testcase File:', testcaseTraceInfo.testcaseFile]);
        content.push(['Verifies Specs:', (testcaseTraceInfo.specs.length > 0) ? testcaseTraceInfo.specs.shift() : '[]']);
        testcaseTraceInfo.specs.forEach(spec => content.push(['', spec]));
        const traceTable = table(content, { align: ['l', 'l'] });
        console.log(`\nTrace information for testcase '${testcaseTraceInfo.testcase}':`);
        console.log('\n' + traceTable);
    }
    function printSpecTraceInfo(specTraceInfo) {
        const content = [];
        content.push(['Spec File:', specTraceInfo.specFile]);
        content.push(['Verified by Testcases:', (specTraceInfo.testcaseCriteriaStrs.length > 0) ? specTraceInfo.testcaseCriteriaStrs.shift() : '[]']);
        specTraceInfo.testcaseCriteriaStrs.forEach(testcaseCriteriaStr => content.push(['', testcaseCriteriaStr]));
        content.push(['Verified in Manual Results:', (specTraceInfo.manualCriteria.length > 0) ? specTraceInfo.manualCriteriaStr : '[]']);
        const traceTable = table(content, { align: ['l', 'l'] });
        console.log(`\nTrace information for spec '${specTraceInfo.spec}':`);
        console.log('\n' + traceTable);
    }
    function handleManualOnly() {
        filters.testcaseFiles = {};
        filters.testcases = {};
        filters.suites = {};
        for (const spec in filters.specs) {
            if (Object.keys(criteriaAnalysis.specs[spec].manual).length === 0 && Object.keys(criteriaAnalysis.specs[spec].uncovered).length === 0) {
                delete filters.specs[spec];
            }
        }
        filterFeaturesBySpecs();
        filterSpecFilesBySpecs();
    }
    function handleAutomaticOnly() {
        for (const spec in filters.specs) {
            if (Object.keys(criteriaAnalysis.specs[spec].automated).length === 0 && Object.keys(criteriaAnalysis.specs[spec].uncovered).length === 0) {
                delete filters.specs[spec];
            }
        }
        filterFeaturesBySpecs();
        filterSpecFilesBySpecs();
    }
    function handleRerunFaulty() {
        if (!fs.existsSync(latestRunPath)) {
            throw new Error('No latestRun file found for --rerunFaulty');
        }
        const resultsFolder = argv.rerunFaulty || fs.readFileSync(latestRunPath, 'utf8');
        const resultsFolderPath = path.join(resultsPath, resultsFolder);
        if (!fs.existsSync(resultsFolderPath)) {
            throw new Error(`Results folder not found for --rerunFaulty: ${resultsFolderPath}`);
        }
        const resultsJsonPath = path.join(resultsFolderPath, 'results.json');
        if (!fs.existsSync(resultsJsonPath)) {
            throw new Error(`No results.json file found inside results folder: ${resultsFolderPath}`);
        }
        const runResults = JSON.parse(fs.readFileSync(resultsJsonPath, 'utf8'));
        const faultySpecs = {};
        const faultyTestcases = {};
        for (const testcase in runResults.testcases) {
            if (runResults.testcases[testcase] === 'fail' || runResults.testcases[testcase] === 'broken') {
                faultyTestcases[testcase] = true;
            }
        }
        for (const spec in runResults.specs) {
            for (const criteria in runResults.specs[spec]) {
                const status = runResults.specs[spec][criteria].status;
                if (status === 'fail' || status === 'broken' || status === 'unverified') {
                    faultySpecs[spec] = true;
                }
            }
        }
        filters.testcases = faultyTestcases;
        filters.specs = faultySpecs;
        if (Object.keys(filters.specs).length === 0) {
            console.log(`\nNo faulty testcases or specs found for execution results ${resultsFolder}`);
            process.exit(0);
        }
        addSuites();
        addFeatures();
        addTestcaseFiles();
        addSpecFiles();
    }
    // adds features to filters based on current content of filters.specs
    function addFeatures() {
        const features = {};
        for (const spec in filters.specs) {
            features[parseResults.specs.specTable[spec].feature] = true;
        }
        filters.features = features;
    }
    // adds spec files to filters based on current content of filters.specFiles
    function addSpecFiles() {
        const specFiles = {};
        for (const spec in filters.specs) {
            specFiles[parseResults.specs.specTable[spec].specFile] = true;
        }
        filters.specFiles = specFiles;
    }
    // adds testcase files to filters based on current content of filters.testcases
    function addTestcaseFiles() {
        const testcaseFiles = {};
        for (const testcase in filters.testcases) {
            testcaseFiles[parseResults.testcases.testcaseTable[testcase].testcaseFile] = true;
        }
        filters.testcaseFiles = testcaseFiles;
    }
    /**
     * Removes specs and testcases from mergedResults that are no longer defined.
     * Adds defined specs and testcases that have no status yet to mergedResults.
     */
    function cleanResultsStatus() {
        // remove criterias and spec if no criteria in spec
        for (const spec in mergedResults.specs) {
            if (!(spec in parseResults.specs.specTable) || Object.keys(parseResults.specs.specTable[spec].criteria).length === 0) {
                delete mergedResults.specs[spec];
            }
            else {
                const parsedCriteria = parseResults.specs.specTable[spec].criteria;
                const resultsCriteria = mergedResults.specs[spec];
                for (const criteria in resultsCriteria) {
                    if (!(criteria in parsedCriteria)) {
                        delete mergedResults.specs[spec][criteria];
                    }
                }
            }
        }
        for (const testcase in mergedResults.testcases) {
            if (!(testcase in parseResults.testcases.testcaseTable)) {
                delete mergedResults.testcases[testcase];
            }
        }
        // add criteria
        for (const spec in parseResults.specs.specTable) {
            if (!(spec in mergedResults.specs)) {
                mergedResults.specs[spec] = {};
            }
            const parsedCriteria = parseResults.specs.specTable[spec].criteria;
            const resultsCriteria = mergedResults.specs[spec];
            for (const criteria in parsedCriteria) {
                if (!(criteria in resultsCriteria)) {
                    mergedResults.specs[spec][criteria] = {
                        dateTime,
                        status: 'unknown',
                        resultsFolder: undefined
                    };
                }
            }
        }
        for (const testcase in parseResults.testcases.testcaseTable) {
            if (!(testcase in mergedResults.testcases)) {
                mergedResults.testcases[testcase] = {
                    status: 'unknown',
                    dateTime,
                    resultsFolder: undefined
                };
            }
        }
        fs.writeFileSync(mergedResultsPath, JSON.stringify(mergedResults), 'utf8');
    }
    function filterSpecsByDate() {
        if (argv.dates) {
            for (const spec in filters.specs) {
                let matched = false;
                for (const criteria in parseResults.specs.specTable[spec].criteria) {
                    if (!inDateFilters(mergedResults.specs[spec][criteria].dateTime)) {
                        delete filters.specs[spec];
                    }
                }
            }
        }
    }
    function filterSpecsByStatus() {
        if (argv.specStatus) {
            const parsedStatus = JSON.parse(argv.specStatus);
            const statuses = {
                passed: false,
                unverified: false,
                unknown: false,
                failed: false,
                broken: false
            };
            for (const status of parsedStatus) {
                if (status === 'faulty') {
                    statuses.broken = true;
                    statuses.failed = true;
                    statuses.unverified = true;
                    statuses.unknown = true;
                }
                else if (!(status in specStatus)) {
                    throw new Error(`Unknown value for filter --specStatus: ${argv.specStatus}`);
                }
                else {
                    statuses[status] = true;
                }
            }
            for (const spec in filters.specs) {
                let matched = false;
                // only include spec if one of its criteria has one of the given status
                criteriaLoop: for (const criteria in mergedResults.specs[spec]) {
                    if (statuses[mergedResults.specs[spec][criteria].status]) {
                        matched = true;
                        break criteriaLoop;
                    }
                }
                if (!matched) {
                    delete filters.specs[spec];
                }
            }
        }
    }
    function filterTestcasesByDate() {
        if (argv.dates) {
            for (const testcase in filters.testcases) {
                if (!inDateFilters(mergedResults.testcases[testcase].dateTime)) {
                    delete filters.testcases[testcase];
                }
            }
        }
    }
    function filterTestcasesByStatus() {
        if (argv.testcaseStatus) {
            const parsedStatus = JSON.parse(argv.testcaseStatus);
            const statuses = {
                passed: false,
                pending: false,
                unknown: false,
                failed: false,
                broken: false
            };
            for (const status of parsedStatus) {
                if (status === 'faulty') {
                    statuses.broken = true;
                    statuses.failed = true;
                    statuses.unknown = true;
                }
                else if (!(status in testcaseStatus)) {
                    throw new Error(`Unknown value for filter --testcaseStatus: ${argv.testcaseStatus}`);
                }
                else {
                    statuses[status] = true;
                }
            }
            for (const testcase in filters.testcases) {
                if (!statuses[mergedResults.testcases[testcase].status]) {
                    delete filters.testcases[testcase];
                }
            }
        }
    }
    function getDates(startDate, stopDate) {
        var dateArray = new Array();
        var currentDate = startDate;
        while (currentDate <= stopDate) {
            dateArray.push(new Date(currentDate));
            currentDate = currentDate.addDays(1);
        }
        return dateArray;
    }
    function completeDate(dateExpr, endOfDay) {
        const time = (endOfDay) ? 'T23:59:59' : 'T00:00:00';
        if (dateExpr.length === 19) {
            return dateExpr;
        }
        else if (dateExpr.length === 10) {
            return `${dateExpr}${time}`;
        }
        else {
            throw new Error(`Time ${dateExpr} does not match format YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss`);
        }
    }
    function buildFilterDates() {
        const dates = [];
        if (argv.dates) {
            const dateExprs = JSON.parse(argv.dates);
            for (let dateExpr of dateExprs) {
                dateExpr = dateExpr.replace(/\s/g, '');
                if (dateExpr.substring(0, 1) === '(' && dateExpr.substring(dateExpr.length - 1, dateExpr.length) === ')') {
                    dateExpr = dateExpr.substring(1, dateExpr.length - 1);
                    let parts = dateExpr.split(',');
                    dates.push({
                        from: new Date(completeDate(parts[0])),
                        to: new Date(completeDate(parts[1], true))
                    });
                }
                else {
                    dates.push({
                        at: new Date(completeDate(dateExpr))
                    });
                }
            }
        }
        return dates;
    }
    function inDateFilters(dateExpr) {
        const dateParts = dateExpr.split('_');
        if (dateParts.length === 2) {
            dateParts[1] = dateParts[1].replace(/-/g, ':');
        }
        const date = new Date(`${dateParts[0]}T${dateParts[1]}`);
        let matched = false;
        innerLoop: for (const dateEntry of filterDates) {
            if (dateEntry.at) {
                if (date.getTime() === dateEntry.at.getTime()) {
                    matched = true;
                    break innerLoop;
                }
            }
            else {
                if (date.getTime() >= dateEntry.from.getTime() && date.getTime() <= dateEntry.to.getTime()) {
                    matched = true;
                    break innerLoop;
                }
            }
        }
        return matched;
    }
}).catch((error) => console.error(error));
function checkGenerateReport() {
    return __awaiter(this, void 0, void 0, function* () {
        // generate and display reports
        if (argv.generateReport) {
            if (typeof argv.generateReport === 'boolean') {
                argv.generateReport = undefined;
            }
            const exitCode = yield allureReport_1.generateReport(workfloConfig, argv.generateReport);
            process.exit(exitCode);
        }
        if (argv.openReport) {
            if (typeof argv.openReport === 'boolean') {
                argv.openReport = undefined;
            }
            const exitCode = yield allureReport_1.openReport(workfloConfig, argv.openReport);
            process.exit(exitCode);
        }
        if (argv.report) {
            if (typeof argv.report === 'boolean') {
                argv.report = undefined;
            }
            let exitCode = yield allureReport_1.generateReport(workfloConfig, argv.report);
            if (exitCode !== 0) {
                process.exit(exitCode);
            }
            exitCode = yield allureReport_1.openReport(workfloConfig, argv.report);
            process.exit(exitCode);
        }
    });
}
//# sourceMappingURL=cli.js.map