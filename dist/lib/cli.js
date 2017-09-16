"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const optimist = require("optimist");
const webdriverio_workflo_1 = require("webdriverio-workflo");
const pkg = require('../../package.json');
const VERSION = pkg.version;
const ALLOWED_ARGV = [
    'host', 'port', 'logLevel', 'coloredLogs', 'baseUrl', 'waitforTimeout',
    'connectionRetryTimeout', 'connectionRetryCount',
    'testcaseFiles', 'specFiles', 'listFiles', 'testcases', 'specs', 'features'
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
let args = {};
for (let key of ALLOWED_ARGV) {
    if (argv[key] !== undefined) {
        args[key] = argv[key];
    }
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
/**
 * run launch sequence
 */
let launcher = new webdriverio_workflo_1.Launcher(wdioConfigFile, args);
launcher.run().then((code) => process.exit(code), (e) => process.nextTick(() => {
    throw e;
}));
//# sourceMappingURL=cli.js.map