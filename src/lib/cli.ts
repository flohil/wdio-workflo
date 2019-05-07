/* tslint:disable:max-line-length */
/* tslint:disable:prefer-template */
/* tslint:disable:align */

require('ts-node/register');
require('tsconfig-paths/register');

import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import * as jsonfile from 'jsonfile';
import * as path from 'path';
import * as supportsColor from 'supports-color';

import { generateReport, openReport } from './allureReport';
import { getAllFiles } from './io';
import { specFilesParse, SpecParseResults, testcaseFilesParse, TestcaseParseResults } from './parser';

import * as merge from 'deepmerge';
import * as optimist from 'optimist';

import { arrayFunctions, IWorkfloConfig, objectFunctions } from '..';

import { flattenDiagnosticMessageText } from 'typescript';
import { baseReporter, Launcher } from 'webdriverio-workflo';

const table = require('text-table');
const pkg = require('../../package.json');
const dateTime = require('../../utils/report.js').getDateTime();

const VERSION = pkg.version;

// not supported ALLOWED_ARGV:
// 'logLevel', 'screenshotPath', 'waitforTimeout', 'framework', 'reporters', 'suite', 'spec',
// 'cucumberOpts', 'jasmineNodeOpts', 'mochaOpts', 'exclude', 'connectionRetryTimeout', 'connectionRetryCount',
// 'watch',

const ALLOWED_ARGV = [
  'baseUrl',
  'host',
  'port',
  'user',
  'key',
  'bail',
  'testInfoFilePath',
  'retries',
];

const ALLOWED_OPTS = [
  'help', 'h',
  'version', 'v',
  'init',
  'protocol',
  'baseUrl',
  'host',
  'port',
  'user',
  'key',
  'path',
  'debug',
  'logLevel', 'l',
  'coloredLogs', 'c',
  'bail',
  'baseUrl', 'b',
  'waitforTimeout', 'w',
  'watch',
  'info',
  'testcases',
  'features',
  'specs',
  'testcaseFiles',
  'specFiles',
  'listFiles',
  'specStatus',
  'testcaseStatus',
  'dates',
  'specSeverity',
  'testcaseSeverity',
  'generateReport',
  'openReport',
  'report',
  'consoleReport',
  'printStatus',
  'browserName',
  'traceSpec',
  'traceTestcase',
  'manualOnly',
  'automaticOnly',
  'reportErrorsInstantly',
  'rerunFaulty',
  'retries',
  'consoleLogLevel',
  'debugSeleniumCommand',
  'cleanStackTraces',
  '_',
  '$0',
];

let configFile;
let optionsOffset = 2; // config file defined as first "parameter"
let bail = 0;

declare global {
  interface Date {
    addDays: Function;
  }
}

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

export interface IExecutionFilters {
  specFiles?: Record<string, true>;
  testcaseFiles?: Record<string, true>;
  manualResultFiles?: Record<string, true>;
  specs?: Record<string, true>;
  features?: Record<string, true>;
  testcases?: Record<string, true>;
  suites?: Record<string, true>;
  manualSpecs?: Record<string, true>;
}

export interface ITestcaseTraceInfo {
  testcase: string;
  testcaseFile: string;
  specs: string[];
}

export interface IValidationFileEntry {
  manualFile?: string;
  testcases?: string[];
  testcaseIds?: Record<string, true>;
}

export interface ISpecTraceInfo {
  spec: string;
  specFile: string;
  testcaseCriteriaStrs: string[];
  criteriaValidationFiles: Record<string, IValidationFileEntry>;
  manualCriteria: string[];
  manualCriteriaStr: string;
}

export interface ITraceInfo {
  testcases: Record<string, ITestcaseTraceInfo>;
  specs: Record<string, ISpecTraceInfo>;
}

export interface IAnalysedSpec {
  automated: Record<string, true>;
  manual: Record<string, true>;
  uncovered: Record<string, true>;
  undefined: boolean;
}

export interface IAnalysedCriteria {
  specs: Record<string, IAnalysedSpec>;
  allCriteriaCount: number;
  automatedCriteriaCount: number;
  manualCriteriaCount: number;
  uncoveredCriteriaCount: number;
}

export interface IParseResults {
  specs: SpecParseResults;
  testcases: TestcaseParseResults;
}

interface DateEntry {
  at?: Date;
  from?: Date;
  to?: Date;
}

interface ConsoleReportEntry {
  type: 'log' | 'warn' | 'error';
  arguments: any;
}

interface MergedResultsSpec {
  status: Workflo.SpecStatus;
  dateTime: string;
  resultsFolder: string;
  manual?: boolean;
}

interface MergedResultsTestcase {
  status: Workflo.TestcaseStatus;
  dateTime: string;
  resultsFolder: string;
}

interface MergedResults {
  specs: Record<string, Record<string, MergedResultsSpec>>;
  testcases: Record<string, MergedResultsTestcase>;
}

interface ISuiteHashRec {
  [key: string]: MergedResultsTestcase | ISuiteHashRec;
}

const testcaseStatus = {
  passed: 'passed',
  failed: 'failed',
  broken: 'broken',
  unknown: 'unknown',
  pending: 'pending',
};

const specStatus = {
  passed: 'passed',
  failed: 'failed',
  broken: 'broken',
  unvalidated: 'unvalidated',
  unknown: 'unknown',
  pending: 'pending',
};

type TestCaseStatuses = keyof typeof testcaseStatus;
type SpecStatuses = keyof typeof specStatus;

// options (not yet) supported are commented out
optimist
  .usage('wdio-workflo CLI runner\n\n' +
    'Usage: wdio-workflo [configFile] [options]\n' +
    'The [options] object will override values from the config file.')

  .describe('help', 'Prints wdio-workflo help menu.')
  .alias('help', 'h')
  .describe('version', 'Prints wdio-workflo version.')
  .alias('version', 'v')
  .describe('init', 'Initializes the folder structure for wdio-workflo tests. Define testDir in workflo.conf.ts before!')

  // config options

  .describe('baseUrl', 'Set a base URL in order to shorten url command calls')
  .alias('baseUrl', 'b')
  .describe('host', 'Host of your WebDriver server (default: \'127.0.0.1\')')
  .describe('port', 'Port your WebDriver server is on (default: 4444)')
  .describe('user', 'username if using a cloud service as Selenium backend')
  .alias('user', 'u')
  .describe('key', 'corresponding access key to the user')
  .alias('key', 'k')
  .describe('bail', 'Stop test runner after specific amount of tests have failed (default: 0 - don\'t bail)')
  .describe('browserName', 'name of the browser used for executing tests or displaying results')

  .describe('debug', 'enable debugging with Node-Inspect Manager chrome extension (default: false)')

  .describe('reportErrorsInstantly', 'report broken testcase errors and errors from validation failures immediatly (default: false)\n' +
    '\t\t\t   allowed values are (true|false)\n' +
    '\t\t\t   will be enabled by default if consoleLogLevel is set to "steps"\n')

  .describe('retries', 'how many times flaky tests should be rerun (default: 0)\n' +
    '\t\t\t   the test results will always refer to the last try/execution\n' +
    '\t\t\t   to show error messages and stacktraces of all tries enable \'reportErrorsInstantly\'')

  .describe('consoleLogLevel', 'Defines the log level for the console output (default: "testcases")\n' +
    '\t\t\t   "results" will only output the results and errors of testcases and specs\n' +
    '\t\t\t   "testcases" will additionally print the name of the currently executed test\n' +
    '\t\t\t   "steps" will additionally print all executed steps in the console\n')

  .describe('debugSeleniumCommand', 'Outputs selenium commands in the allure report if set to true (default: true)')
  .describe('cleanStackTraces', 'Remove error stack trace lines that originate from the test framework itself (default: true)')

  // filters

  .describe('testcases', 'restricts test execution to these testcases\n' +
    '\t\t\t   \'["Suite1", "Suite2.Testcase1"]\' => execute all testcases of Suite1 and Testcase1 of Suite2\n' +
    '\t\t\t   \'["Suite2", "-Suite2.Testcase2"]\' => execute all testcases of Suite2 except for Testcase2\n')
  .describe('features', 'restricts test execution to these features\n' +
    '\t\t\t   \'["Login", "Logout"]\' => execute all testcases which validate specs defined within these features\n' +
    '\t\t\t   \'["-Login"]\' => execute all testcases except those which validate specs defined within these features\n')
  .describe('specs', 'restricts test execution to these specs\n' +
    '\t\t\t   \'["3.2"]\' => execute all testcases which validate spec 3.2\n' +
    '\t\t\t   \'["1.1*", "-1.1.2.4"]\' => 1.1* includes spec 1.1 and all of its sub-specs (eg. 1.1.2), -1.1.2.4 excludes spec 1.1.2.4\n' +
    '\t\t\t   \'["1.*"]\' => 1.* excludes spec 1 itself but includes of of its sub-specs\n')
  .describe('testcaseFiles', 'restricts test execution to testcases defined within these files\n' +
    '\t\t\t   \'["testcaseFile1", "testcaseFile2"]\' => execute all testcases defined within testcaseFile1.tc.ts and testcaseFile2.tc.ts\n')
  .describe('specFiles', 'restricts test execution to testcases validated by specs defined within these files\n' +
    '\t\t\t   \'["specFile1", "specFile2"]\' => execute all testcases validated by specs defined within specFile1.spec.ts and specFile2.spec.ts\n')
  .describe('listFiles', 'restricts test execution to the testcases, specs, testcaseFiles, specFiles and lists defined within these files \n' +
    '\t\t\t   \'["listFile1"]\' => execute all testcases included by the contents of listFile1.list.ts\n')
  .describe('specStatus', 'restricts specs by status of their criteria set during their last execution\n' +
    '\t\t\t   \'["passed", "failed", "broken", "unvalidated", "unknown"]\' => these are all available status - combine as you see fit\n' +
    '\t\t\t   \'["faulty"]\' => faulty is a shortcut for failed, broken, unvalidated and unknown\n')
  .describe('testcaseStatus', 'restricts testcases by given status\n' +
    '\t\t\t   \'["passed", "failed", "broken", "pending", "unknown"]\' => these are all available status - combine as you see fit\n' +
    '\t\t\t   \'["faulty"]\' => faulty is a shortcut for failed, broken and unknown\n')
  .describe('specSeverity', 'restricts specs by severity set during their last execution\n' +
    '\t\t\t   \'["blocker", "critical", "normal", "minor", "trivial"]\' => these are all available severities - combine as you see fit\n')
  .describe('testcaseSeverity', 'restricts testcases by severity set during their last execution\n' +
    '\t\t\t   \'["blocker", "critical", "normal", "minor", "trivial"]\' => these are all available severities - combine as you see fit\n')
  .describe('dates', 'restricts testcases and specs (oldest spec criteria) by given date and time (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)\n' +
    '\t\t\t   \'["(2017-03-10,2017-10-28)"]\' => restricts by status set between 2017-03-10 and 2017-10-28 (both at 0 pm, 0 min, 0 sec)\n' +
    '\t\t\t   \'["2017-07-21", "2017-07-22T14:51:13"]\' => restricts by last status set on 2017-07-21 or 2017-07-22 at 2 pm, 51 min, 13 sec\n')
  .describe('manualOnly', 'do not run automatic testcases and consider only manual results')
  .describe('automaticOnly', 'run only automatic testcases and do not consider manual results')

  // actions

  .describe('info', 'shows static information about testcases and specs')

  .describe('generateReport', 'generates report for latest results or\n' +
    '\t\t\t   \'2017-10-10_20-38-13\' => generate report for given result folder\n')
  .describe('openReport', 'opens report for latest generated allure results or\n' +
    '\t\t\t   \'2017-10-10_20-38-13\' => open report for given generated result folder\n')
  .describe('report', 'generates and opens report for latest results or\n' +
    '\t\t\t   \'2017-10-10_20-38-13\' => generate and open report for given result folder\n')
  .describe('consoleReport', 'displays report messages written to console during latest test execution\n' +
    '\t\t\t   \'2017-10-10_20-38-13\' => display report messages written to console for given result folder\n')

  .describe('printStatus', 'show current status of all testcases and specs for the specified browser')

  .describe('traceSpec', 'show spec file defining and all testcases, testcase files and manual result files validating this spec\n' +
    '\t\t\t   \'4.1\' => show traceability information for spec 4.1\n')
  .describe('traceTestcase', 'show testcase file defining and all specs and spec files validated by this testcase\n' +
    '\t\t\t   \'Suite1.testcase1\' => show traceability information for testcase1 in Suite1\n')

  .describe('rerunFaulty', 'reruns all faulty specs and testcases from the latest execution\n' +
    '\t\t\t   \'2017-10-10_20-38-13\' => reruns all faulty specs and testcases from the results folder \'2017-10-10_20-38-13\'')

  // wdio-workflo options

  // .describe('watch', 'watch specs for changes')
  // .describe('jasmineOpts.*', 'Jasmine options, see the full list options at https://github.com/webdriverio/wdio-jasmine-framework#jasminenodeopts-options')

  // not supported

  // .describe('suite', 'overwrites the specs attribute and runs the defined suite') // replaced by 'testcases'
  // .describe('spec', 'run only a certain spec file') // replaced by 'testcaseFiles' and 'specFiles'
  // .describe('cucumberOpts.*', 'Cucumber options, see the full list options at https://github.com/webdriverio/wdio-cucumber-framework#cucumberopts-options') // only jasmine is supported
  // .describe('mochaOpts.*', 'Mocha options, see the full list options at http://mochajs.org') // only jasmine is supported
  // .describe('screenshotPath', 'saves a screenshot to a given path if a command fails') // stored with allure results
  // .alias('screenshotPath', 's')
  // .describe('framework', 'defines the framework (Mocha, Jasmine or Cucumber) to run the specs (default: mocha)')
  // .alias('framework', 'f')
  // .describe('reporters', 'reporters to print out the results on stdout') // supports only workflo adaptions of spec and allure reporters
  // .alias('reporters', 'r')

  .string([
    'host',
    'baseUrl',
    'user',
    'key',
    'bail',
    'specs',
    'testcases',
    'features',
    'specFiles',
    'testcaseFiles',
    'listFiles',
    'specStatus',
    'testcaseStatus',
    'specSeverity',
    'testcaseSeverity',
    'dates',
    'rerunFaulty',
    'retries',
    /*, 'screenshotPath', 'framework', 'reporters', 'suite', 'spec' */
  ])
  .boolean(['debug'])
  .check((arg) => {
    if (arg._.length > 1 && arg._[0] !== 'repl') {
      throw new Error('Error: more than one config file specified');
    }
  });

if (process.argv.length === 2 || process.argv.length > 2 && process.argv[2].substr(0, 1) === '-') {
  configFile = './workflo.conf.ts';
  optionsOffset = 1; // no config file specified
}

const argv = optimist.parse(process.argv.slice(optionsOffset));

argv.coloredLogs = true;

const allowedOpts = arrayFunctions.mapToObject(ALLOWED_OPTS, (element) => true);

for (const optKey in argv) {
  const unknownOpts = [];

  if (!(optKey in allowedOpts)) {
    unknownOpts.push(optKey);
  }

  if (unknownOpts.length > 0) {
    optimist.showHelp();
    console.error(`Unknown cli options: ${unknownOpts.join(', ')}`);
    process.exit(1);
  }
}

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

// default options of wdio
argv.watch = false;

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
  console.error('Workflo config file was not specified or could not be found in its default location (<<current working directory>>/workflo.conf.js)\n');
  optimist.showHelp();
  process.exit(1);
}

process.env.WORKFLO_CONFIG = workfloConfigFile;

const workfloConfig: IWorkfloConfig = require(workfloConfigFile).default;

if (argv.init) {
  ensureFolderStructure(workfloConfig.testDir);
  process.exit(0);
}

// merge config options into argv if argv does not already contain option itself
const mergeOpts = [
  'listFiles',
  'testcases',
  'features',
  'specs',
  'specStatus',
  'testcaseStatus',
  'specSeverity',
  'testcaseSeverity',
  'dates',
  'manualOnly',
  'automaticOnly',
  'debugSeleniumCommand',
  'cleanStackTraces',
];

mergeOpts.forEach(opt => {
  if (typeof workfloConfig[opt] !== 'undefined') {
    if (typeof argv[opt] === 'undefined') {
      argv[opt] = JSON.stringify(workfloConfig[opt]);
    }
  }
});

if (argv.browserName) {
  workfloConfig.capabilities.browserName = argv.browserName;
}

const cleanedBrowserName = workfloConfig.capabilities.browserName.replace(' ', '-');

if (typeof process.env.LATEST_RUN === 'undefined') {
  process.env.LATEST_RUN = dateTime;
}

const resultsPath = path.join(workfloConfig.testDir, 'results', cleanedBrowserName);
const logsPath = path.join(workfloConfig.testDir, 'logs', 'selenium', cleanedBrowserName, process.env.LATEST_RUN);
const allureResultsPath = path.join(resultsPath, process.env.LATEST_RUN, 'allure-results');

const latestRunPath = path.join(resultsPath, 'latestRun');
const mergedResultsPath = path.join(resultsPath, 'mergedResults.json');
const mergedAllureResultsPath = path.join(resultsPath, 'mergedAllureResults');
const consoleReportPath = path.join(resultsPath, process.env.LATEST_RUN, 'consoleReport.json');

fsExtra.ensureDirSync(resultsPath);

process.env.WDIO_WORKFLO_RUN_PATH = path.join(resultsPath, process.env.LATEST_RUN);
process.env.WDIO_WORKFLO_RESULTS_PATH = resultsPath;
process.env.WDIO_WORKFLO_LATEST_RUN_PATH = path.join(resultsPath, 'latestRun');

checkReport().then(() => {
  fsExtra.ensureDirSync(mergedAllureResultsPath);
  fsExtra.ensureDirSync(logsPath);
  fsExtra.ensureDirSync(allureResultsPath);

  // check workflo config properties
  const mandatoryProperties = ['testDir', 'baseUrl'];

  for (const property of mandatoryProperties) {
    if (!(property in workfloConfig)) {
      throw new Error(`Property '${property}' must be defined in workflo config file!`);
    }
  }

  if (typeof workfloConfig.testDir === 'undefined') {
    throw new Error("Please specify option 'testDir' in workflo.conf.js file!");
  }

  const testDir = workfloConfig.testDir;
  const srcDir = path.join(testDir, 'src');
  const specsDir = path.join(srcDir, 'specs');
  const testcasesDir = path.join(srcDir, 'testcases');
  const listsDir = path.join(srcDir, 'lists');
  const manDir = path.join(srcDir, 'manual_results');
  const testInfoFilePath = path.join(process.env.WDIO_WORKFLO_RUN_PATH, 'testinfo.json');

  workfloConfig.uidStorePath = workfloConfig.uidStorePath || path.join(testDir, 'data', 'uidStore.json');

  const filters: IExecutionFilters = {};
  const mergedFilters: IExecutionFilters = {};
  const mergeKeys = ['features', 'specs', 'testcases', 'specFiles', 'testcaseFiles'];

  let mergedResults: MergedResults = {
    specs: {},
    testcases: {},
  };

  if (fs.existsSync(mergedResultsPath)) {
    const mergedResultsStr = fs.readFileSync(mergedResultsPath, 'utf8');

    if (mergedResultsStr !== 'undefined') {
      mergedResults = JSON.parse(mergedResultsStr);
    }
  }

  // merge non-file cli filters
  mergeKeys.forEach(key => mergeIntoFilters(key, argv, mergedFilters));

  // merge filters defined in cli lists and sublists
  if (argv.listFiles) {
    mergeLists({
      listFiles: JSON.parse(argv.listFiles),
    }, mergedFilters);
  }

  // complete cli specFiles and testcaseFiles paths
  completeFilePaths(mergedFilters);

  // if no cli params were defined, merge in all spec and testcase files...
  const completedSpecFiles = completeSpecFiles(argv, mergedFilters);
  const completedTestcaseFiles = completeTestcaseFiles(argv, mergedFilters);

  const parseResults: IParseResults = {
    specs: specFilesParse(Object.keys(mergedFilters.specFiles)),
    testcases: testcaseFilesParse(Object.keys(mergedFilters.testcaseFiles)),
  };

  // check if all defined filters exist
  checkFiltersExist();

  // add manual test cases to test information
  const manualResults = importManualResults();

  // trace argv handling
  if (handleTracingArgs()) {
    process.exit(0);
  }

  const filterDates: DateEntry[] = buildFilterDates();

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
    if (!(testcase in parseResults.testcases.testcaseTable)) {
      delete filters.testcases[testcase];
    }
  }

  let criteriaAnalysis = analyseCriteria();

  if ('rerunFaulty' in argv) {
    handleRerunFaulty();
  } else {
    filterSpecsByDate();

    filterSpecsByStatus();

    filterSpecsBySeverity();

    filterTestcasesByDate();

    filterTestcasesByStatus();

    filterTestcasesBySeverity();

    // remove specs not matched by specs filter
    filterSpecsBySpecs();

    // remove specs not matched by features filter
    filterSpecsByFeatures();

    // remove testcases not matched by testcases filter
    filterTestcasesByTestcases();

    // remove specs not matched by validates in testcases or manual results
    filterSpecsByTestcases();

    // remove testcases that do not validate filtered specs
    filterTestcasesBySpecs();

    // build suites based on testcases
    addSuites();

    filterWildSpecsAndTestcases();

    // remove features not matched by specs
    filterFeaturesBySpecs();

    // remove specFiles not matched by filtered specs
    filterSpecFilesBySpecs();

    // remove testcaseFiles not matched by filtered testcases
    filterTestcaseFilesByTestcases();
  }

  // add manual specs based on manual result files
  addManualResultFilesAndSpecs();

  if (argv.manualOnly) {
    handleManualOnly();

    if (argv.automaticOnly) {
      throw new Error('The flags --automaticOnly and --manualOnly may not be used simultaneously');
    }
  } else if (argv.automaticOnly) {
    handleAutomaticOnly();
  }

  cleanResultsStatus();

  criteriaAnalysis = analyseCriteria();

  const automatedCriteriaRate = (criteriaAnalysis.allCriteriaCount > 0) ?
    criteriaAnalysis.automatedCriteriaCount / criteriaAnalysis.allCriteriaCount : 0;
  const manualCriteriaRate = (criteriaAnalysis.allCriteriaCount > 0) ?
    criteriaAnalysis.manualCriteriaCount / criteriaAnalysis.allCriteriaCount : 0;
  const uncoveredCriteriaRate = (criteriaAnalysis.allCriteriaCount > 0) ?
    criteriaAnalysis.uncoveredCriteriaCount / criteriaAnalysis.allCriteriaCount : 0;

  type CountInfo = { count: number, percentage: string };

  const infoObject: {
    specFiles: number
    testcaseFiles: number
    manualResultFiles: number
    features: number
    specs: number
    suites: number
    testcases: number
    manualResults: number
    allCriteriaCount: CountInfo
    automatedCriteria: CountInfo
    manualCriteria: CountInfo
    uncoveredCriteria: CountInfo
    uncoveredCriteriaObject: Record<string, string[]>,
  } = {
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
      percentage: `(${(criteriaAnalysis.allCriteriaCount > 0) ? 100 : 0}%)`,
    },
    automatedCriteria: {
      count: criteriaAnalysis.automatedCriteriaCount,
      percentage: `(~${automatedCriteriaRate.toLocaleString('en', { style: 'percent' })})`,
    },
    manualCriteria: {
      count: criteriaAnalysis.manualCriteriaCount,
      percentage: `(~${manualCriteriaRate.toLocaleString('en', { style: 'percent' })})`,
    },
    uncoveredCriteria: {
      count: criteriaAnalysis.uncoveredCriteriaCount,
      percentage: `(~${uncoveredCriteriaRate.toLocaleString('en', { style: 'percent' })})`,
    },
    uncoveredCriteriaObject: {},
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
    uncoveredCriteriaObject: 'Uncovered Criteria Object',
  };

  const invertedTranslations = objectFunctions.invert(translations);
  const printObject = objectFunctions.mapProperties(invertedTranslations, value => infoObject[value]);

  if (argv.info) {
    function toTable(key) {
      return [key, printObject[key], ''];
    }

    function toPercentTable(key) {
      return [key, (<CountInfo>printObject[key]).count, (<CountInfo>printObject[key]).percentage];
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
      toPercentTable(translations.allCriteriaCount),
    ], { align: ['l', 'r', 'r'] });

    console.log('\n' + infoTable + '\n');

    if (Object.keys(infoObject.uncoveredCriteriaObject).length > 0) {
      console.log('UNCOVERED CRITERIA:');

      const uncoveredTableRows = [];

      for (const spec in infoObject.uncoveredCriteriaObject) {
        uncoveredTableRows.push([`${spec}:`, `[${infoObject.uncoveredCriteriaObject[spec].join(', ')}]`]);
      }

      const uncoveredTable = table(uncoveredTableRows, { align: ['l', 'l'] });

      console.log(uncoveredTable);
    }

    process.exit(0);
  }

  handlePrintStatus();

  if (fs.existsSync(testInfoFilePath)) {
    fs.unlinkSync(testInfoFilePath);
  }

  const setBooleanArg = (key: string, defaultValue: boolean) => {
    if (typeof argv[key] === 'undefined' && typeof workfloConfig[key] !== 'undefined') {
      return workfloConfig[key];
    } else if (typeof argv[key] !== 'undefined') {
      return JSON.parse(argv[key]);
    } else {
      return defaultValue;
    }
  };

  if (typeof argv.retries === 'undefined' && typeof workfloConfig.retries !== 'undefined') {
    argv.retries = workfloConfig.retries;
  } else if (typeof argv.retries !== 'undefined') {
    argv.retries = parseInt(argv.retries, 10);
  } else {
    argv.retries = 0;
  }

  if (typeof argv.consoleLogLevel === 'undefined' && typeof workfloConfig.consoleLogLevel !== 'undefined') {
    argv.consoleLogLevel = workfloConfig.consoleLogLevel;
  } else if (typeof argv.consoleLogLevel !== 'undefined') {
    argv.consoleLogLevel = argv.consoleLogLevel;
  } else {
    argv.consoleLogLevel = 'testcases';
  }

  if (argv.bail) {
    bail = parseInt(argv.bail, 10);
  } else if (workfloConfig.bail) {
    bail = workfloConfig.bail;
  }

  if (['results', 'testcases', 'steps'].indexOf(argv.consoleLogLevel) < 0) {
    console.warn(`Unknown console log level: ${argv.consoleLogLevel}`);
    console.warn("Setting console log level to default value 'testcases'");
    argv.consoleLogLevel = 'testcases';
  }

  const defaultReportErrorsInstantly = (argv.consoleLogLevel === 'steps') ? true : false;

  const testinfo = {
    criteriaAnalysis,
    resultsPath,
    latestRunPath,
    dateTime,
    mergedResultsPath,
    consoleReportPath,
    mergedAllureResultsPath,
    bail,
    parseResults,
    printObject,
    executionFilters: filters,
    traceInfo: buildTraceInfo(),
    uidStorePath: workfloConfig.uidStorePath,
    allure: workfloConfig.allure,
    reportErrorsInstantly: setBooleanArg('reportErrorsInstantly', defaultReportErrorsInstantly),
    consoleLogLevel: argv.consoleLogLevel,
    automaticOnly: argv.automaticOnly,
    manualOnly: argv.manualOnly,

    browser: cleanedBrowserName,
    retries: argv.retries || 0,
  };

  jsonfile.writeFileSync(testInfoFilePath, testinfo);

  argv.testInfoFilePath = testInfoFilePath;

  const args = {};
  for (const key of ALLOWED_ARGV) {
    if (argv[key] !== undefined) {
      args[key] = argv[key];
    }
  }

  let debugSeleniumCommand = true;

  if (typeof argv.debugSeleniumCommand !== 'undefined') {
    if ((argv.debugSeleniumCommand === 'false')) {
      debugSeleniumCommand = false;
    }
  }

  let cleanStackTraces = true;

  if (typeof argv.cleanStackTraces !== 'undefined') {
    if ((argv.cleanStackTraces === 'false')) {
      cleanStackTraces = false;
    }
  }

  // patch wdio.conf.js
  args['logOutput'] = logsPath,
  args['seleniumLogs'] = path.relative('./', path.join(logsPath));
  args['logLevel'] = 'silent',
  args['reporterOptions'] = JSON.stringify({
    outputDir: path.join(resultsPath, process.env.LATEST_RUN),
    'workflo-allure': {
      debugSeleniumCommand,
      outputDir: path.join(resultsPath, process.env.LATEST_RUN, 'allure-results'),
      debug: false,
    },
  });
  args['bail'] = 0;
  args['cleanStackTraces'] = cleanStackTraces;
  args['host'] = workfloConfig.host || '127.0.0.1';
  args['port'] = workfloConfig.port || '4444';

  if (workfloConfig.debug === true || argv.debug === true) {
    workfloConfig.execArgv = ['--inspect'];
    workfloConfig.debug = false;
  }

  // write latest run file
  if (Object.keys(filters.specs).length > 0 || Object.keys(filters.testcases).length > 0) {
    if (!fs.existsSync(resultsPath)) {
      fs.mkdirSync(resultsPath);
    }

    fs.writeFile(latestRunPath, process.env.LATEST_RUN, err => {
      if (err) {
        return console.error(err);
      }

      console.log(`Setting latest run: ${process.env.LATEST_RUN}\n`);
    });
  } else {
    console.log('No specs or testcases match execution filters. Quitting...');
    process.exit(0);
  }

  /**
   * run launch sequence
   */
  const launcher = new Launcher(wdioConfigFile, args);
  launcher.run().then(
    (code) => process.exit(code),
    (e) => process.nextTick(() => {
      throw e;
    }));

  function mergeIntoFilters(key: string, argv: any, _filters: IExecutionFilters) {
    _filters[key] = {};

    if (argv[key]) {
      const filterArray: string[] = JSON.parse(argv[key]);

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
  function completeSpecFiles(argv: any, _filters: IExecutionFilters): boolean {
    // if user manually defined an empty specFiles array, do not add specFiles from folder
    if (Object.keys(_filters.specFiles).length === 0 && !argv.specFiles) {
      getAllFiles(specsDir, '.spec.ts').forEach(specFile => _filters.specFiles[specFile] = true);
      return true;
    } else {
      let removeOnly = true;
      const removeSpecFiles: Record<string, true> = {};

      for (const specFile in _filters.specFiles) {
        let remove = false;
        let matchStr = specFile;

        if (specFile.substr(0, 1) === '-') {
          remove = true;
          matchStr = specFile.substr(1, specFile.length - 1);
        } else {
          removeOnly = false;
        }

        if (remove) {
          delete _filters.specFiles[specFile];
          removeSpecFiles[matchStr] = true;
        }
      }

      if (removeOnly) {
        getAllFiles(specsDir, '.spec.ts')
          .filter(specFile => !(specFile in removeSpecFiles))
          .forEach(specFile => _filters.specFiles[specFile] = true);
      }
    }

    return false;
  }

  // if no testcase files are present in filters, use all testcase files in testcase folder
  function completeTestcaseFiles(argv: any, _filters: IExecutionFilters): boolean {
    // if user manually defined an empty testcaseFiles array, do not add testcaseFiles from folder
    if (Object.keys(_filters.testcaseFiles).length === 0 && !argv.testcaseFiles) {
      getAllFiles(testcasesDir, '.tc.ts').forEach(testcaseFile => _filters.testcaseFiles[testcaseFile] = true);
      return true;
    } else {
      let removeOnly = true;
      const removeTestcaseFiles: Record<string, true> = {};

      for (const testcaseFile in _filters.testcaseFiles) {
        let remove = false;
        let matchStr = testcaseFile;

        if (testcaseFile.substr(0, 1) === '-') {
          remove = true;
          matchStr = testcaseFile.substr(1, testcaseFile.length - 1);
        } else {
          removeOnly = false;
        }

        if (remove) {
          delete _filters.testcaseFiles[testcaseFile];
          removeTestcaseFiles[matchStr] = true;
        }
      }

      if (removeOnly) {
        getAllFiles(testcasesDir, '.tc.ts')
          .filter(testcaseFile => !(testcaseFile in removeTestcaseFiles))
          .forEach(testcaseFile => _filters.testcaseFiles[testcaseFile] = true);
      }
    }

    return false;
  }

  function completeFilePaths(_filters: IExecutionFilters) {
    const specFilePaths: Record<string, true> = {};
    const testcaseFilePaths: Record<string, true> = {};

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
  function mergeLists(list: Workflo.IFilterList, _filters: IExecutionFilters) {
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
        } else {
          const sublist: Workflo.IFilterList = require(listFilePath).default;

          // recursively traverse sub list files
          mergeLists(sublist, _filters);
        }
      }
    }
  }

  function filterSpecsBySpecs() {
    if (Object.keys(mergedFilters.specs).length > 0) {
      const filteredSpecs: Record<string, true> = {};
      const filteredFeatures: Record<string, true> = {};
      let removeOnly = true;

      for (const spec in mergedFilters.specs) {
        let remove = false;
        let matchStr = spec;

        if (spec.substr(0, 1) === '-') {
          remove = true;
          matchStr = spec.substr(1, spec.length - 1);
        } else {
          removeOnly = false;
        }
        if (matchStr.substr(matchStr.length - 1, 1) === '*') {
          matchStr = matchStr.substr(0, matchStr.length - 1);

          for (const specEntry in parseResults.specs.specTable) {
            if (specEntry.length >= matchStr.length && specEntry.substr(0, matchStr.length) === matchStr) {
              if (remove) {
                delete filters.specs[specEntry];
              } else {
                filteredSpecs[specEntry] = true;
              }
            }
          }
        } else {
          if (remove) {
            delete filters.specs[matchStr];
          } else {
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
      const filteredSpecs: Record<string, true> = {};
      let removeOnly = true;

      for (const feature in mergedFilters.features) {
        let remove = false;
        let matchStr = feature;

        if (feature.substr(0, 1) === '-') {
          remove = true;
          matchStr = feature.substr(1, feature.length - 1);
        } else {
          removeOnly = false;
        }

        if (matchStr in parseResults.specs.featureTable) {
          for (const spec in parseResults.specs.featureTable[matchStr].specs) {
            if (remove) {
              delete filters.specs[spec];
            } else {
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
      const filteredTestcases: Record<string, true> = {};
      let removeOnly = true;

      for (const testcase in mergedFilters.testcases) {
        let remove = false;
        let matchStr = testcase;

        if (testcase.substr(0, 1) === '-') {
          remove = true;
          matchStr = testcase.substr(1, testcase.length - 1);
        } else {
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
            } else {
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
    if ((Object.keys(mergedFilters.testcaseFiles).length > 0 && Object.keys(mergedFilters.testcases).length > 0) || argv.testcaseSeverity || argv.testcaseStatus) {
      const validatedSpecs: Record<string, true> = {};

      // add all spec ids validated in given testcases
      for (const testcase in filters.testcases) {

        // testcase is a suite
        if (testcase in parseResults.testcases.tree) {
          for (const testcaseId in parseResults.testcases.tree[testcase].testcaseHash) {
            for (const validatedSpec in parseResults.testcases.tree[testcase].testcaseHash[testcaseId].specValidateHash) {
              validatedSpecs[validatedSpec] = true;
            }
          }
        } else { // testcase is a testcase
          let matchSuite = testcase;
          const testcaseParts = testcase.split('.');

          // at least one suite followed by a testcase
          if (testcaseParts.length > 1) {
            testcaseParts.pop(); // remove testcase
            matchSuite = testcaseParts.join('.');

            if (matchSuite in parseResults.testcases.tree) {
              for (const validatedSpec in parseResults.testcases.tree[matchSuite].testcaseHash[testcase].specValidateHash) {
                validatedSpecs[validatedSpec] = true;
              }
            }
          }
        }
      }

      // remove specs not validated by filtered testcases or manual results
      for (const spec in filters.specs) {
        if (!(spec in validatedSpecs)) {
          delete filters.specs[spec];
        }
      }
    }
  }

  function filterTestcasesBySpecs() {
    const filteredTestcases: Record<string, true> = {};

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
    const filteredFeatures: Record<string, true> = {};

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
    const filteredSpecFiles: Record<string, true> = {};

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
    const filteredTestcaseFiles: Record<string, true> = {};

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

  function filterWildSpecsAndTestcases() {

    // remove leftover specs caused by testcases that have no validate function
    if ((Object.keys(mergedFilters.testcaseFiles).length > 0 || Object.keys(mergedFilters.testcases).length > 0)
      && Object.keys(mergedFilters.features).length === 0 && Object.keys(mergedFilters.specs).length === 0 && Object.keys(mergedFilters.specFiles).length === 0) {

      const validatedSpecs = {};

      // add all spec ids validated in given testcases
      for (const testcase in filters.testcases) {
        // testcase is a suite
        if (testcase in parseResults.testcases.tree) {
          for (const testcaseId in parseResults.testcases.tree[testcase].testcaseHash) {
            for (const validatedSpec in parseResults.testcases.tree[testcase].testcaseHash[testcaseId].specValidateHash) {
              validatedSpecs[validatedSpec] = true;
            }
          }
        } else {
          let matchSuite = testcase;
          const testcaseParts = testcase.split('.');
          // at least one suite followed by a testcase
          if (testcaseParts.length > 1) {
            testcaseParts.pop(); // remove testcase
            matchSuite = testcaseParts.join('.');
            if (matchSuite in parseResults.testcases.tree) {
              for (const validatedSpec in parseResults.testcases.tree[matchSuite].testcaseHash[testcase].specValidateHash) {
                validatedSpecs[validatedSpec] = true;
              }
            }
          }
        }
      }

      // remove specs not validated by filtered testcases or manual results
      for (const spec in filters.specs) {
        if (!(spec in validatedSpecs)) {
          delete filters.specs[spec];
        }
      }
    }

    if ((Object.keys(mergedFilters.testcaseFiles).length > 0 || Object.keys(mergedFilters.testcases).length > 0) &&
      (Object.keys(mergedFilters.features).length > 0 || Object.keys(mergedFilters.specs).length > 0 || (Object.keys(mergedFilters.specFiles).length > 0 && !completedSpecFiles)) &&
      Object.keys(filters.specs).length === 0) {
      filters.testcases = {};
    }
  }

  interface IManualResultEntry {
    file: string;
    criteria: Workflo.IManualCriteria;
  }

  function importManualResults() {
    const mergedManualTestcases: Record<string, IManualResultEntry> = {};
    const fileTable: Record<string, Workflo.IManualTestcaseResults> = {};

    const manualTestcaseResults = getAllFiles(manDir, '.man.ts');

    for (const manualTestcaseFile of manualTestcaseResults) {
      const manualTestcase: Workflo.IManualTestcaseResults = require(manualTestcaseFile).default;

      fileTable[manualTestcaseFile] = manualTestcase;

      for (const spec in manualTestcase) {
        if (spec in mergedManualTestcases) {
          throw new Error(`Manual results for spec '${spec}' were declared in both '${manualTestcaseFile}' and '${mergedManualTestcases[spec].file}'`);
        } else {
          mergedManualTestcases[spec] = {
            file: manualTestcaseFile,
            criteria: manualTestcase[spec],
          };
        }
      }
    }

    return {
      fileTable,
      specTable: mergedManualTestcases,
    };
  }

  function analyseCriteria() {
    const analysedCriteria: IAnalysedCriteria = {
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
        undefined: false,
      };

      // spec was not defined in a spec file
      if (!(spec in parseResults.specs.specTable)) {
        analysedCriteria.specs[spec].undefined = true;
      } else {
        for (const criteria in parseResults.specs.specTable[spec].criteria) {
          let covered = false;

          if (spec in manualResults.specTable && criteria in manualResults.specTable[spec].criteria) {
            covered = true;

            analysedCriteria.specs[spec].manual[criteria] = true;
            analysedCriteria.manualCriteriaCount++;
          }
          if (spec in parseResults.testcases.validateTable) {
            let _autoCovered = false;

            for (const testcaseId in parseResults.testcases.validateTable[spec]) {
              const suite = parseResults.testcases.testcaseTable[testcaseId].suiteId;

              if (criteria in parseResults.testcases.tree[suite].testcaseHash[testcaseId].specValidateHash[spec]) {
                if (!_autoCovered) {
                  analysedCriteria.automatedCriteriaCount++;
                }

                _autoCovered = true;

                analysedCriteria.specs[spec].automated[criteria] = true;
              }
            }

            if (_autoCovered) {
              if (covered) {
                throw new Error(`Criteria ${criteria} of spec ${spec} must not be both validated automatically and tested manually!`);
              } else {
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
    const suites: Record<string, true> = {};

    for (const testcase in filters.testcases) {
      suites[parseResults.testcases.testcaseTable[testcase].suiteId] = true;
    }

    return suites;
  }

  function handleTracingArgs(): boolean {
    let traced = false;

    if (argv.traceTestcase) {
      if (argv.traceTestcase in parseResults.testcases.testcaseTable) {
        const testcaseTraceInfo = buildTestcaseTraceInfo(argv.traceTestcase);
        printTestcaseTraceInfo(testcaseTraceInfo);
      } else {
        console.warn(`\nTestcase '${argv.traceTestcase}' could not be found and traced!`);
      }

      traced = true;
    }

    if (argv.traceSpec) {
      if (argv.traceSpec in parseResults.specs.specTable) {
        const specTraceInfo = buildSpecTraceInfo(argv.traceSpec);
        printSpecTraceInfo(specTraceInfo);
      } else {
        console.warn(`\nSpec '${argv.traceSpec}' could not be found and traced!`);
      }

      traced = true;
    }

    return traced;
  }

  function buildTestcaseTraceInfo(testcase: string): ITestcaseTraceInfo {
    const testcaseTableEntry = parseResults.testcases.testcaseTable[testcase];
    let testcaseFile = testcaseTableEntry.testcaseFile.replace(srcDir, '');
    testcaseFile = testcaseFile.substring(1, testcaseFile.length).replace('\\', '\/');
    const specHash = parseResults.testcases.tree[testcaseTableEntry.suiteId].testcaseHash[testcase].specValidateHash;
    const specFilesHash = (specHash) ? arrayFunctions.mapToObject(Object.keys(specHash).map(spec => {
      if (parseResults.specs.specTable[spec]) {
        return parseResults.specs.specTable[spec].specFile;
      } else {
        throw new Error(`Spec '${spec}' validated in testcase '${testcase}' could not be found!`);
      }
    }), (spec) => true) : {};
    const specFiles = Object.keys(specFilesHash);
    const specs = (specHash) ? Object.keys(specHash).map(spec => {
      `${spec}: [${Object.keys(specHash[spec]).join(', ')}] ('${parseResults.specs.specTable[spec].specFile}')`;

      let file = parseResults.specs.specTable[spec].specFile.replace(srcDir, '');
      file = `${file.substring(1, file.length).replace('\\', '\/')}`;

      return `${spec}: [${Object.keys(specHash[spec]).join(', ')}] (${file})`;
    }) : [];

    return {
      testcase,
      specs,
      testcaseFile: `${testcaseFile}`,
    };
  }

  function buildSpecTraceInfo(spec: string): ISpecTraceInfo {
    let specFile = parseResults.specs.specTable[spec].specFile.replace(srcDir, '');
    specFile = specFile.substring(1, specFile.length).replace('\\', '\/');
    const testcaseHash = parseResults.testcases.validateTable[spec];
    const testcases = (testcaseHash) ? Object.keys(testcaseHash) : [];
    const testcaseFileHash = (testcaseHash) ? arrayFunctions.mapToObject(testcases.map(testcase => parseResults.testcases.testcaseTable[testcase].testcaseFile), (testcase) => true) : {};
    const testcaseFiles = Object.keys(testcaseFileHash);
    let manualFile = (spec in manualResults.specTable) ? manualResults.specTable[spec].file.replace(srcDir, '') : '';

    if (manualFile.length > 0) {
      manualFile = `${manualFile.substring(1, manualFile.length).replace('\\', '\/')}`;
    }

    const testcaseCriteria: Record<string, string[]> = {};
    testcases.forEach(testcase => testcaseCriteria[testcase] = Object.keys(parseResults.testcases.tree[parseResults.testcases.testcaseTable[testcase].suiteId].testcaseHash[testcase].specValidateHash[spec]));

    const testcaseCriteriaStrs: string[] = Object.keys(testcaseCriteria).map(testcase => {
      let file = parseResults.testcases.testcaseTable[testcase].testcaseFile.replace(srcDir, '');
      file = `${file.substring(1, file.length).replace('\\', '\/')}`;

      return `${testcase}: [${testcaseCriteria[testcase].join(', ')}] (${file})`;
    });

    const criteriaValidationFiles: Record<string, IValidationFileEntry> = {};
    const manualCriteria = (spec in manualResults.specTable) ? Object.keys(manualResults.specTable[spec].criteria) : [];
    const manualCriteriaStr = (manualCriteria.length > 0) ? `[${manualCriteria.join(', ')}] (${manualFile})` : '';

    for (const criteria in parseResults.specs.specTable[spec].criteria) {
      if (manualCriteria.length > 0 && criteria in manualResults.specTable[spec].criteria) {
        criteriaValidationFiles[criteria] = {
          manualFile,
        };
      } else {
        const tcHash: Record<string, string[]> = {};
        const _testcases: string[] = [];
        const _testcaseIds: Record<string, true> = {};

        for (const tc in testcaseCriteria) {
          if (criteria in parseResults.testcases.tree[parseResults.testcases.testcaseTable[tc].suiteId].testcaseHash[tc].specValidateHash[spec]) {
            let _testcaseFile = parseResults.testcases.testcaseTable[tc].testcaseFile.replace(srcDir, '');
            _testcaseFile = `${_testcaseFile.substring(1, _testcaseFile.length).replace('\\', '\/')}`;

            _testcaseIds[tc] = true;

            if (!tcHash[_testcaseFile]) {
              tcHash[_testcaseFile] = [tc];
            } else {
              tcHash[_testcaseFile].push(tc);
            }
          }
        }

        for (const tcFile in tcHash) {
          _testcases.push(`${tcHash[tcFile].join(', ')} (${tcFile})`);
        }

        criteriaValidationFiles[criteria] = {
          testcases: _testcases,
          testcaseIds: _testcaseIds,
        };
      }
    }

    return {
      spec,
      testcaseCriteriaStrs,
      criteriaValidationFiles,
      manualCriteria,
      manualCriteriaStr,
      specFile: `${specFile}`,
    };
  }

  function buildTraceInfo(): ITraceInfo {
    const traceInfo: ITraceInfo = {
      specs: {},
      testcases: {},
    };

    for (const testcase in filters.testcases) {
      traceInfo.testcases[testcase] = buildTestcaseTraceInfo(testcase);
    }

    for (const spec in filters.specs) {
      traceInfo.specs[spec] = buildSpecTraceInfo(spec);
    }

    return traceInfo;
  }

  function printTestcaseTraceInfo(testcaseTraceInfo: ITestcaseTraceInfo) {
    const content: string[][] = [];

    content.push(['Testcase File:', testcaseTraceInfo.testcaseFile]);

    content.push(['validates Specs:', (testcaseTraceInfo.specs.length > 0) ? testcaseTraceInfo.specs.shift() : '[]']);
    testcaseTraceInfo.specs.forEach(spec => content.push(['', spec]));

    const traceTable = table(content, { align: ['l', 'l'] });

    console.log(`\nTrace information for testcase '${testcaseTraceInfo.testcase}':`);
    console.log('\n' + traceTable);
  }

  function printSpecTraceInfo(specTraceInfo: ISpecTraceInfo) {
    const content: string[][] = [];

    content.push(['Spec File:', specTraceInfo.specFile]);

    content.push(['validated by Testcases:', (specTraceInfo.testcaseCriteriaStrs.length > 0) ? specTraceInfo.testcaseCriteriaStrs.shift() : '[]']);
    specTraceInfo.testcaseCriteriaStrs.forEach(testcaseCriteriaStr => content.push(['', testcaseCriteriaStr]));

    content.push(['validated in Manual Results:', (specTraceInfo.manualCriteria.length > 0) ? specTraceInfo.manualCriteriaStr : '[]']);

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
    interface IRunResults {
      specs: Record<string, Record<string, MergedResultsSpec>>;
      testcases: Record<string, MergedResultsTestcase>;
    }

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

    let runResults: IRunResults = {
      specs: {},
      testcases: {},
    };

    const resultsStr = fs.readFileSync(resultsJsonPath, 'utf8');

    if (resultsStr !== 'undefined') {
      runResults = JSON.parse(resultsStr);
    }

    const faultySpecs: Record<string, true> = {};
    const faultyTestcases: Record<string, true> = {};

    for (const testcase in runResults.testcases) {
      const status = runResults.testcases[testcase].status;
      if (status === 'failed' || status === 'broken') {
        faultyTestcases[testcase] = true;
      }
    }

    for (const spec in runResults.specs) {
      for (const criteria in runResults.specs[spec]) {
        const status = runResults.specs[spec][criteria].status;

        if (status === 'failed' || status === 'unvalidated') {
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
    const features: Record<string, true> = {};

    for (const spec in filters.specs) {
      features[parseResults.specs.specTable[spec].feature] = true;
    }

    filters.features = features;
  }

  // adds spec files to filters based on current content of filters.specFiles
  function addSpecFiles() {
    const specFiles: Record<string, true> = {};

    for (const spec in filters.specs) {
      specFiles[parseResults.specs.specTable[spec].specFile] = true;
    }

    filters.specFiles = specFiles;
  }

  // adds testcase files to filters based on current content of filters.testcases
  function addTestcaseFiles() {
    const testcaseFiles: Record<string, true> = {};

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
      } else {
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
            resultsFolder: undefined,
          };

          if (criteria in criteriaAnalysis.specs[spec].manual) {
            mergedResults.specs[spec][criteria].manual = true;
          }
        }
      }
    }

    for (const testcase in parseResults.testcases.testcaseTable) {
      if (!(testcase in mergedResults.testcases)) {
        mergedResults.testcases[testcase] = {
          dateTime,
          status: 'unknown',
          resultsFolder: undefined,
        };
      }
    }

    fs.writeFileSync(mergedResultsPath, JSON.stringify(mergedResults), { encoding: 'utf8' });
  }

  function filterSpecsByDate() {
    if (argv.dates) {
      for (const spec in filters.specs) {
        const matched = false;

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
      const statuses: Record<SpecStatuses, boolean> = {
        passed: false,
        unvalidated: false,
        unknown: false,
        failed: false,
        broken: false,
        pending: false,
      };

      for (const status of parsedStatus) {
        if (status === 'faulty') {
          statuses.broken = true;
          statuses.failed = true;
          statuses.unvalidated = true;
          statuses.unknown = true;
        } else if (!(status in specStatus)) {
          throw new Error(`Unknown value for filter --specStatus: ${status}`);
        } else {
          statuses[status] = true;
        }
      }

      for (const spec in filters.specs) {
        let matched = false;

        // only include spec if one of its criteria has one of the given status
        criteriaLoop:
        for (const criteria in mergedResults.specs[spec]) {
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

  function filterSpecsBySeverity() {
    if (argv.specSeverity) {
      const parsedSeverity = JSON.parse(argv.specSeverity);
      const severities: Record<Workflo.Severity, boolean> = {
        trivial: false,
        minor: false,
        normal: false,
        critical: false,
        blocker: false,
      };

      for (const severity of parsedSeverity) {
        if (!(severity in severities)) {
          throw new Error(`Unknown value for filter --specSeverity: ${severity}`);
        } else {
          severities[severity] = true;
        }
      }

      for (const spec in filters.specs) {
        const feature = parseResults.specs.specTable[spec].feature;
        const severity: Workflo.Severity = parseResults.specs.specTree[feature].specHash[spec].metadata.severity
          || 'normal';

        if (!severities[severity]) {
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
      const statuses: Record<TestCaseStatuses, boolean> = {
        passed: false,
        pending: false,
        unknown: false,
        failed: false,
        broken: false,
      };

      for (const status of parsedStatus) {
        if (status === 'faulty') {
          statuses.broken = true;
          statuses.failed = true;
          statuses.unknown = true;
        } else if (!(status in testcaseStatus)) {
          throw new Error(`Unknown value for filter --testcaseStatus: ${status}`);
        } else {
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

  function filterTestcasesBySeverity() {
    if (argv.testcaseSeverity) {
      const parsedSeverity = JSON.parse(argv.testcaseSeverity);
      const severities: Record<Workflo.Severity, boolean> = {
        trivial: false,
        minor: false,
        normal: false,
        critical: false,
        blocker: false,
      };

      for (const severity of parsedSeverity) {
        if (!(severity in severities)) {
          throw new Error(`Unknown value for filter --testcaseSeverity: ${severity}`);
        } else {
          severities[severity] = true;
        }
      }

      for (const testcase in filters.testcases) {
        const suite = parseResults.testcases.testcaseTable[testcase].suiteId;
        const severity: Workflo.Severity =
          parseResults.testcases.tree[suite].testcaseHash[testcase].metadata.severity || 'normal';

        if (!severities[severity]) {
          delete filters.testcases[testcase];
        }
      }
    }
  }

  function getDates(startDate, stopDate) {
    const dateArray = [];
    let currentDate = startDate;

    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate));
      currentDate = currentDate.addDays(1);
    }

    return dateArray;
  }

  function completeDate(dateExpr: string, endOfDay?: boolean) {
    const time = (endOfDay) ? 'T23:59:59' : 'T00:00:00';

    if (dateExpr.length === 19) {
      return dateExpr;
    } else if (dateExpr.length === 10) {
      return `${dateExpr}${time}`;
    } else {
      throw new Error(`Time ${dateExpr} does not match format YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss`);
    }
  }

  function buildFilterDates() {
    const dates: DateEntry[] = [];

    if (argv.dates) {
      const dateExprs: string[] = JSON.parse(argv.dates);

      for (let dateExpr of dateExprs) {
        dateExpr = dateExpr.replace(/\s/g, '');
        if (dateExpr.substring(0, 1) === '(' && dateExpr.substring(dateExpr.length - 1, dateExpr.length) === ')') {
          dateExpr = dateExpr.substring(1, dateExpr.length - 1);

          const parts = dateExpr.split(',');

          dates.push({
            from: new Date(completeDate(parts[0])),
            to: new Date(completeDate(parts[1], true)),
          });
        } else {
          dates.push({
            at: new Date(completeDate(dateExpr)),
          });
        }
      }
    }

    return dates;
  }

  function inDateFilters(dateExpr: string): boolean {
    const dateParts = dateExpr.split('_');

    if (dateParts.length === 2) {
      dateParts[1] = dateParts[1].replace(/-/g, ':');
    }

    const date = new Date(`${dateParts[0]}T${dateParts[1]}`);
    let matched = false;

    innerLoop:
    for (const dateEntry of filterDates) {
      if (dateEntry.at) {
        if (date.getTime() === dateEntry.at.getTime()) {
          matched = true;
          break innerLoop;
        }
      } else {
        if (date.getTime() >= dateEntry.from.getTime() && date.getTime() <= dateEntry.to.getTime()) {
          matched = true;
          break innerLoop;
        }
      }
    }

    return matched;
  }

  function handlePrintStatus() {
    if (argv.printStatus) {
      console.log();

      if (!fs.existsSync(mergedResultsPath)) {
        console.log(`No mergedResults.json file found - did you run any tests on browser '${argv.printStatus}' yet?`);
      } else {
        const mergedResultsStr = fs.readFileSync(mergedResultsPath, 'utf8');

        let mergedResults: MergedResults = {
          specs: {},
          testcases: {},
        };

        if (mergedResultsStr !== 'undefined') {
          mergedResults = JSON.parse(fs.readFileSync(mergedResultsPath, 'utf8'));
        }

        const counts: {
          testcases: Record<TestCaseStatuses, number>,
          specs: Record<SpecStatuses, number>,
        } = {
          testcases: {
            broken: 0,
            failed: 0,
            passed: 0,
            pending: 0,
            unknown: 0,
          },
          specs: {
            broken: 0,
            failed: 0,
            passed: 0,
            unvalidated: 0,
            unknown: 0,
            pending: 0,
          },
        };

        const suitesHash = buildPrintSuitesHash();
        const featuresHash = buildPrintFeaturesHash();

        console.log('==================================================================');

        printTestcaseStatus(suitesHash, counts.testcases);

        printSpecStatus(featuresHash, counts.specs);

        printTestcaseSummary();

        printSpecSummary();

        printTestcaseCounts(counts.testcases);

        printSpecCounts(counts.specs);
      }

      process.exit(0);
    }
  }

  function printTestcaseStatus(suitesHash: ISuiteHashRec, counts: Record<TestCaseStatuses, number>) {
    const indents = ' ';
    const testcaseIndents = '  ';
    const phase = '[TESTCASE]';
    let first = true;

    function printSuiteContext(context: ISuiteHashRec | MergedResultsTestcase, _indents: string) {
      const suites: string[] = [];

      for (const key in context) {
        if ('status' in context[key]) {
          const testcase = <MergedResultsTestcase>context[key];
          const testcaseParts = key.split('.');

          const resultsFolder = (testcase.resultsFolder) ? `(${testcase.resultsFolder})` : '';
          const coloredSymbol = color(testcase.status, symbol(testcase.status));

          console.log(`${phase}${_indents.substring(0, _indents.length - 2)}${coloredSymbol} ${testcaseParts[testcaseParts.length - 1]} ${color('light', resultsFolder)}`);

          counts[testcase.status]++;
        } else {
          suites.push(key);
        }
      }

      for (const suite of suites) {
        if (!first) {
          console.log(phase);
        } else {
          first = false;
        }
        console.log(`${phase}${_indents}${suite}`);

        printSuiteContext(<ISuiteHashRec>context[suite], `${_indents}    `);
      }
    }

    printSuiteContext(suitesHash, indents);

    console.log('==================================================================');
  }

  function printSpecStatus(featuresHash: Record<string, Record<string, Record<string, MergedResultsSpec>>>, counts: Record<SpecStatuses, number>) {
    const indents = ' ';
    const specIndents = indents + '    ';
    const criteriaIndents = specIndents + '  ';
    const phase = '[SPEC]';
    let first = true;

    for (const feature in featuresHash) {
      if (!first) {
        console.log(phase);
      } else {
        first = false;
      }
      console.log(`${phase}${indents}${feature}`);

      for (const spec in featuresHash[feature]) {
        const description = parseResults.specs.specTree[parseResults.specs.specTable[spec].feature].specHash[spec].description;

        console.log(phase);
        console.log(`${phase}${specIndents}${spec} - ${description}`);

        const criteriaHash: Record<SpecStatuses, Record<string, string[]>> = {
          passed: {},
          pending: {},
          unvalidated: {},
          failed: {},
          broken: {},
          unknown: {},
        };

        for (const criteria in featuresHash[feature][spec]) {
          const criteriaInfo = featuresHash[feature][spec][criteria];

          if (!(criteriaInfo.status in criteriaHash)) {
            criteriaHash[criteriaInfo.status] = {};
          }

          if (!(criteriaInfo.resultsFolder in criteriaHash[criteriaInfo.status])) {
            criteriaHash[criteriaInfo.status][criteriaInfo.resultsFolder] = [];
          }

          criteriaHash[criteriaInfo.status][criteriaInfo.resultsFolder].push(
            (criteriaInfo.manual) ? `${criteria}m` : criteria,
          );

          counts[featuresHash[feature][spec][criteria].status]++;
        }

        for (const status in criteriaHash) {
          for (const resultsFolder in criteriaHash[status]) {
            const _resultsFolder = (resultsFolder && resultsFolder !== 'undefined') ? `(${resultsFolder})` : '';
            console.log(`${phase}${criteriaIndents}${color(status, symbol(status))} [${criteriaHash[status][resultsFolder].join(', ')}] ${color('light', _resultsFolder)}`);
          }
        }
      }
    }

    console.log('==================================================================');
  }

  function buildPrintSuitesHash() {
    const suitesHash: ISuiteHashRec = {};

    for (const testcase in mergedResults.testcases) {
      const suite = parseResults.testcases.testcaseTable[testcase].suiteId;
      const suiteParts = suite.split('.');
      let suiteContext = suitesHash;

      if (testcase in filters.testcases) {
        for (const suitePart of suiteParts) {
          if (!(suitePart in suiteContext)) {
            suiteContext[suitePart] = {};
          }

          suiteContext = <ISuiteHashRec>suiteContext[suitePart];
        }

        suiteContext[testcase] = mergedResults.testcases[testcase];
      }
    }

    // clean suiteshash from empty suites

    return suitesHash;
  }

  function buildPrintFeaturesHash() {
    const featuresHash: Record<string, Record<string, Record<string, MergedResultsSpec>>> = {};

    for (const spec in mergedResults.specs) {
      const feature = parseResults.specs.specTable[spec].feature;

      if (spec in filters.specs) {
        if (!(feature in featuresHash)) {
          featuresHash[feature] = {};
        }

        featuresHash[feature][spec] = <Record<string, MergedResultsSpec>>mergedResults.specs[spec];
      }
    }

    return featuresHash;
  }

  function printTestcaseSummary() {
    let output = '';

    output += 'Number of Testcase Files: ' + Object.keys(filters.testcaseFiles).length + '\n';
    output += 'Number of Suites: ' + Object.keys(filters.suites).length + '\n';
    output += 'Number of Testcases: ' + Object.keys(filters.testcases).length + '\n';

    output += '==================================================================';

    console.log(output);
  }

  function printSpecSummary() {
    let output = '';

    output += 'Number of Spec Files: ' + Object.keys(filters.specFiles).length + '\n';
    output += 'Number of Features: ' + Object.keys(filters.features).length + '\n';
    output += 'Number of Specs: ' + Object.keys(filters.specs).length + '\n';

    output += '==================================================================';

    console.log(output);
  }

  function color(type, str) {
    if (!supportsColor.supportsColor().hasBasic) return String(str);
    return `\u001b[${baseReporter.COLORS[type]}m${str}\u001b[0m`;
  }

  function symbol(status: string) {
    let symbols = baseReporter.SYMBOLS;

    /**
     * With node.js on Windows: use symbols available in terminal default fonts
     */
    if (process.platform === 'win32') {
      symbols = baseReporter.SYMBOLS_WIN;
    }

    switch (status) {
      case 'passed':
        return symbols.ok;
      case 'failed':
        return symbols.error;
      case 'broken':
        return symbols.err;
      case 'pending':
        return '-';
      case 'unvalidated':
        return 'U';
      case 'unknown':
        return '?';
    }
  }

  function printTestcaseCounts(counts: Record<TestCaseStatuses, number>) {
    console.log('Testcase Results:\n');

    printCounts(counts);
  }

  function printSpecCounts(counts: Record<SpecStatuses, number>) {
    console.log('Spec Criteria Results:\n');

    printCounts(counts);
  }

  function printCounts(counts: Record<TestCaseStatuses, number> | Record<SpecStatuses, number>) {
    let fmt;
    let totalCount = 0;

    Object.keys(counts).forEach(key => totalCount += counts[key]);

    function percent(count: number) {
      return (!totalCount) ? 0 : (count / totalCount * 100).toFixed(1);
    }

    fmt = color('green', '%d passing') + color('light', ` (${percent(counts.passed)}%)`);
    console.log(fmt, counts.passed);

    // pending
    if (counts.pending > 0) {
      fmt = color('pending', '%d skipped') + color('light', ` (${percent(counts.pending)}%)`);
      console.log(fmt, counts.pending);
    }

    // unvalidateds
    if ('unvalidated' in counts) {
      const _counts = <Record<SpecStatuses, number>>counts;

      if (_counts.unvalidated > 0) {
        fmt = color('unvalidated', '%d unvalidated') + color('light', ` (${percent(_counts.unvalidated)}%)`);
        console.log(fmt, _counts.unvalidated);
      }
    }

    // failures
    if (counts.failed > 0) {
      fmt = color('fail', '%d failing') + color('light', ` (${percent(counts.failed)}%)`);
      console.log(fmt, counts.failed);
    }

    // broken
    if (counts.broken > 0) {
      fmt = color('broken', '%d broken') + color('light', ` (${percent(counts.broken)}%)`);
      console.log(fmt, counts.broken);
    }

    // unknown
    if (counts.unknown > 0) {
      fmt = color('light', '%d unknown') + color('light', ` (${percent(counts.unknown)}%)`);
      console.log(fmt, counts.unknown);
    }

    console.log('==================================================================');
  }
}).catch((error) => console.error(error));

async function checkReport() {
  console.log();
  console.log(`Selected browser:  ${cleanedBrowserName}`);

  // generate and display reports
  if (argv.generateReport) {
    if (typeof argv.generateReport === 'boolean') {
      argv.generateReport = undefined;
    }
    const exitCode = await generateReport(workfloConfig, argv.generateReport);
    process.exit(exitCode);
  }
  if (argv.openReport) {
    if (typeof argv.openReport === 'boolean') {
      argv.openReport = undefined;
    }
    const exitCode = await openReport(workfloConfig, argv.openReport);
    process.exit(exitCode);
  }
  if (argv.report) {
    if (typeof argv.report === 'boolean') {
      argv.report = undefined;
    }
    let exitCode = await generateReport(workfloConfig, argv.report);

    if (exitCode !== 0) {
      process.exit(exitCode);
    }

    exitCode = await openReport(workfloConfig, argv.report);
    process.exit(exitCode);
  }
  if (argv.consoleReport) {
    let run;

    if (typeof argv.consoleReport === 'string' && argv.consoleReport.length > 0) {
      run = argv.consoleReport;
    } else {
      if (!fs.existsSync(latestRunPath)) {
        throw new Error('No latestRun file found for --showConsoleReport');
      }
      run = fs.readFileSync(latestRunPath, 'utf8');
    }

    const reportPath = path.join(resultsPath, run, 'consoleReport.json');
    const reportStr = fs.readFileSync(reportPath, 'utf8');
    let consoleReport: ConsoleReportEntry[] = [];

    if (reportStr !== 'undefined') {
      consoleReport = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    }

    consoleReport.forEach(entry => {
      switch (entry.type) {
        case 'log':
          console.log(...entry.arguments);
          break;
        case 'warn':
          console.warn(...entry.arguments);
          break;
        case 'error':
          console.error(...entry.arguments);
          break;
      }
    });

    process.exit(0);
  }
}

function ensureFolderStructure(testDir: string) {
  const srcDir = path.join(testDir, 'src');
  const dataDir = path.join(testDir, 'data');
  const logsDir = path.join(testDir, 'logs');
  const resultsDir = path.join(testDir, 'results');
  const listsDir = path.join(srcDir, 'lists');
  const testcasesDir = path.join(srcDir, 'testcases');
  const specsDir = path.join(srcDir, 'specs');
  const manualResultsDir = path.join(srcDir, 'manual_results');
  const stepsDir = path.join(srcDir, 'steps');
  const pageObjectsDir = path.join(srcDir, 'page_objects');

  const stepsIndexPath = path.join(stepsDir, 'index.ts');
  const tsConfigSysTestPath = path.join(workfloConfig.testDir, 'tsconfig.json');

  const templatesDir = path.resolve(__dirname, '../../templates/');
  const readmeTemplatePath = path.join(templatesDir, 'readme.md');

  const createDirs = [
    testDir,
    srcDir,
    logsDir,
    resultsDir,
    dataDir,
    listsDir,
    testcasesDir,
    specsDir,
    manualResultsDir,
    stepsDir,
    pageObjectsDir,
  ];

  const readmeDirs = [
    srcDir,
    logsDir,
    resultsDir,
    dataDir,
    listsDir,
    testcasesDir,
    specsDir,
    manualResultsDir,
    stepsDir,
    pageObjectsDir,
  ];

  try {
    const pageObjectsExisted = fs.existsSync(pageObjectsDir);

    // create all necessary test directories
    createDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    });

    // add steps index file
    if (!fs.existsSync(stepsIndexPath)) {
      fsExtra.copySync(path.join(templatesDir, 'src_boilerplate', 'steps', 'index.ts'), stepsIndexPath);
    }

    // add base classes
    if (!pageObjectsExisted) {
      fsExtra.copySync(path.join(templatesDir, 'src_boilerplate', 'page_objects'), pageObjectsDir);
    }

    // create readme.md files in folders that should not be deleted
    readmeDirs.forEach(dir => {
      const readmePath = path.join(dir, 'readme.md');

      if (!fs.existsSync(readmePath)) {
        fsExtra.copySync(readmeTemplatePath, readmePath);
      }
    });

    // add tsconfig_system_test_directory.json file in system test folder that extends tsconfig.workflo.json
    if (!fs.existsSync(tsConfigSysTestPath)) {
      fsExtra.copySync(
        path.join(templatesDir, 'config', 'tsconfig_system_test_directory.json'), path.join(workfloConfig.testDir, 'tsconfig.json'),
      );
    }

    console.log('\nSuccessfully initialized folder structure for wdio-workflo!');
  } catch (error) {
    console.error('\nFailed to initialize structure for wdio-workflo!');
    console.error(error);

    process.exit(1);
  }
}
