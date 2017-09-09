"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const optimist = require("optimist");
const pkg = require('../../package.json');
const VERSION = pkg.version;
const ALLOWED_ARGV = [
    'host', 'port', 'logLevel', 'coloredLogs', 'baseUrl', 'waitforTimeout',
    'connectionRetryTimeout', 'connectionRetryCount'
    //, 'jasmineOpts', 'user', 'key', 'watch', 'path'
];
// options (not yet) supported are commented out
optimist
    .usage('wdio-workflo CLI runner\n\n' +
    'Usage: wdio-workflo configFile [options]\n' +
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
    '\t\t\t[Suite1, Suite2.Testcase1] => execute all testcases of Suite1 and Testcase1 of Suite2')
    .describe('specs', 'restricts test execution to these specs\n' +
    '\t\t\t[3.2] => execute all testcases which verify spec 3.2\n' +
    '\t\t\t[1.1*, -1.1.2.4] => 1.1* includes spec 1.1 and all of its sub-specs (eg. 1.1.2), -1.1.2.4 excludes spec 1.1.2.4')
    .describe('testcaseFiles', 'restricts test execution to testcases defined within these files\n' +
    '\t\t\t[testcaseFile1, testcaseFile2] => execute all testcases defined within testcaseFile1.tc.ts and testcaseFile2.tc.ts')
    .describe('specFiles', 'restricts test execution to testcases verified by specs defined within these files\n' +
    '\t\t\t[specFile1, specFile2] => execute all testcases verified by specs defined within specFile1.spec.ts and specFile2.spec.ts')
    .describe('listFiles', 'restricts test execution to the testcases, specs, testcaseFiles, specFiles and lists defined within these files \n' +
    '\t\t\t[listFile1] => execute all testcases include by the contents of listFile1.list.ts')
    .string(['host', 'path', 'logLevel', 'baseUrl' /*, 'user', 'key', 'screenshotPath', 'framework', 'reporters', 'suite', 'spec' */])
    .boolean(['coloredLogs', 'watch'])
    .default({ coloredLogs: true })
    .check((arg) => {
    if (arg._.length > 1 && arg._[0] !== 'repl') {
        throw new Error('Error: more than one config file specified');
    }
});
let argv = optimist.parse(process.argv.slice(2));
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
let configFile = argv._[0];
if (!configFile) {
    console.error(`No config file specified!`);
    optimist.showHelp();
    process.exit(1);
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
// /**
//  * run launch sequence if config command wasn't called
//  */
// } else if (!configMode) {
//     let launcher = new Launcher(configFile, args)
//     launcher.run().then(
//         (code) => process.exit(code),
//         (e) => process.nextTick(() => {
//             throw e
//         }))
// }
//# sourceMappingURL=cli.js.map