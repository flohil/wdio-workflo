---
id: config
title: Configuration Options
sidebar_label: Configuration Options
---

This page lists all options of wdio-workflo's configuration file `workflo.conf.ts`.

## Wdio-Workflo Options

```typescript
/**
 * Root directory for all system test artifacts of wdio-workflo.
 *
 * If you set this value to something other than `${__dirname}/system_test`, you need to make sure that
 * the `include` array in workflo's tsconfig file `tsconfig.workflo.json` contains your testDir folder.
 */
testDir: string;

/**
 * Timeouts (for waitXXX and eventuallyXXX actions) in milliseconds.
 *
 * "default" property will be used for every waitXXX and eventuallyXXX action
 * if not explicitly stated otherwise.
 *
 * @default {default: 5000}
 */
timeouts?: ITimeouts;

/**
 * Intervals (for waitXXX and eventuallyXXX actions) in milliseconds.
 *
 * "default" property will be used for every waitXXX and eventuallyXXX action
 * if not explicitly stated otherwise.
 *
 * @default {default: 500}
 */
intervals?: IIntervals;

/**
 * Path to the uidStore.json file which is used to generate unique ids during test execution.
 *
 * The generated ids will be preserved for future test runs until the uidStore.json file is deleted.
 */
uidStorePath?: string;
```

## WebdriverIO Services and Testrunner

```typescript
/**
 * Set a base URL in order to shorten `browser.url()` command calls.
 *
 * @see http://v4.webdriver.io/api/protocol/url.html
 */
baseUrl: string;

/**
 * Webdriverio Services to run for test execution.
 *
 * See http://webdriver.io/guide for more information.
 *
 * @default ['selenium-standalone']
 */
services?: string[];

/**
 * WebdriverIO supports Sauce Labs, Browserstack and Testing Bot (other cloud providers
 * should work too though). These services define specific user and key (or access key)
 * values you need to put in here in order to connect to these services.
 *
 * @default undefined
 */
user?: string;

/**
 * WebdriverIO supports Sauce Labs, Browserstack and Testing Bot (other cloud providers
 * should work too though). These services define specific user and key (or access key)
 * values you need to put in here in order to connect to these services.
 *
 * @default undefined
 */
key?: string;

/**
 * Execution arguments for the node process.
 * If using the debug option, execArgv will always be overwritten with the value ['--inspect']
 */
execArgv?: string[];
```

## Selenium Webdriver

```typescript
/**
 * Protocol to use when communicating with the Selenium standalone server (or driver)
 * @default http
 */
protocol?: string;

/**
 * Host of your WebDriver server.
 * @default 127.0.0.1
 */
host?: string;

/**
 * Port of your WebDriver server.
 * @default 4444
 */
port?: number;

/**
 * Path to WebDriver server.
 * @default  /wd/hub
 */
path?: string;

/**
 * Width of the browser window in pixels.
 */
width: number;

/**
 * Height of the browser window in pixels.
 */
height: number;

/**
 * Defines the capabilities you want to run in your Selenium session.
 * See https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities for a list of the available capabilities.
 *
 * Please be aware that wdio-workflo's reporting only supports one single instance at a time.
 * Therefore, the "maxInstance" property will always be overwritten with the value 1.
 */
capabilities: ICapabilities;

/**
 * Arguments for start command of selenium-standalone service.
 *
 * @default {}
 */
seleniumStartArgs?: StartOpts;

/**
 * Arguments for install command of selenium-standalone service.
 *
 * @default {}
 */
seleniumInstallArgs?: InstallOpts;

/**
 * http(s).Agent instance to use
 *
 * @default new http(s).Agent({ keepAlive: true })
 */
agent?: Object;

/**
 * An HTTP proxy to be used. Supports proxy Auth with Basic Auth, identical to support for the url
 * parameter (by embedding the auth info in the uri)
 *
 * @default undefined (no proxy used)
 */
proxy?: String;

/**
 * A key-value store of query parameters to be added to every selenium request.
 *
 * @default {}
 */
queryParams?: Object;

/**
 * A key-value store of headers to be added to every selenium request. Values must be strings.
 *
 * @default {}
 */
headers?: Object;

/**
 * Timeout for any request to the Selenium server in milliseconds.
 *
 * @default 90000
 */
connectionRetryTimeout?: number;

/**
 * Count of request retries to the Selenium server.
 *
 * @default 3
 */
connectionRetryCount?: number;
```

## Logging and Debugging

```typescript
/**
 * If set to true, will output errors and validation failures immediately.
 * Will be enabled by default if consoleLogLevel is set to 'steps'.
 *
 * @default false
 */
reportErrorsInstantly?: boolean;

/**
 * Log level output in spec reporter console.
 *
 * @default testcases
 */
consoleLogLevel?: 'results' | 'testcases' | 'steps';

/**
 * Outputs selenium commands in the allure report if set to true.
 *
 * @default true
 */
debugSeleniumCommand?: boolean;

/**
 * Remove error stacktrace lines that originate from the test framework itself.
 *
 * @default {default: true}
 */
cleanStackTraces?: boolean;

/**
 * If set to true, Node debugging via the chrome extension "Node-Inspector Manager" is enabled.
 *
 * For more information, please read the "Debugging" guide.
 */
debug?: boolean;
```

## Error Handling

```typescript
/**
 * Defines how many times a testcase should be rerun if it did not pass.
 * The current testcase will be aborted on the first error or failed expectation
 * and rerun <retries> times.
 *
 * @default 0
 */
retries?: number;

/**
 * Skip future testcases after a specific amount of already executed testcases have failed.
 * By default, does not bail.
 *
 * @default 0
 */
bail?: number;
```

## Filtering Executed Tests

```typescript
/**
 * Restricts test execution to these testcases.
 *
 * @example
 * ["Suite1", "Suite2.Testcase1"] => execute all testcases of Suite1 and Testcase1 of Suite2
 * ["Suite2", "-Suite2.Testcase2"] => execute all testcases of Suite2 except for Testcase2
 */
testcases?: string[];

/**
 * Restricts test execution to these features.
 *
 * @example
 * ["Login", "Logout"] => execute all testcases which validate specs defined within these features
 * ["-Login"] => execute all testcases except those which validate specs defined within these features
 */
features?: string[];

/**
 * Restricts test execution to these specs.
 *
 * @example
 * ["3.2"] => execute all testcases which validate spec 3.2
 * ["1.1*", "-1.1.2.4"] => 1.1* includes spec 1.1 and all of its sub-specs (eg. 1.1.2), -1.1.2.4 excludes spec 1.1.2.4
 * ["1.*"] => 1.* excludes spec 1 itself but includes of of its sub-specs
 */
specs?: string[];

/**
 * Restricts specs by status of their criteria set during their last execution.
 *
 * @example
 * ["passed", "failed", "broken", "unvalidated", "unknown"] => these are all available status - combine as you see fit
 * ["faulty"] => faulty is a shortcut for failed, broken, unvalidated and unknown
 */
specStatus?: (SpecStatus | 'faulty')[];

/**
 * Restricts executed testcases by their result status set during their last execution.
 *
 * @example
 * ["passed", "failed", "broken", "pending", "unknown"] => these are all available status - combine as you see fit
 * ["faulty"] => faulty is a shortcut for failed, broken and unknown
 */
testcaseStatus?: (TestcaseStatus | 'faulty')[];

/**
 * Restricts specs by severity set during their last execution.
 *
 * @example
 * ["blocker", "critical", "normal", "minor", "trivial"] => these are all available severities - combine as you see fit
 */
specSeverity?: Severity[];

/**
 * Restricts testcases by severity set during their last execution.
 *
 * @example
 * ["blocker", "critical", "normal", "minor", "trivial"] => these are all available severities - combine as you see fit
 */
testcaseSeverity?: Severity[];

/**
 * Restricts testcases and specs (oldest spec criteria) by given date and time (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss).
 *
 * @example
 * ["(2017-03-10,2017-10-28)"] => restricts by status set between 2017-03-10 and 2017-10-28 (at 0 pm, 0 min, 0 sec)
 * ["2017-07-21", "2017-07-22T14:51:13"] => restricts by last status set on 2017-07-21 or 2017-07-22 at 2 pm, 51 min, 13 sec
 */
dates?: string[];

/**
 * Do not run automatic testcases and consider only manual results.
 *
 * @default {default: false}
 */
manualOnly?: boolean;

/**
 * Run only automatic testcases and do not consider manual results.
 *
 * @default {default: false}
 */
automaticOnly?: boolean;
```

## Reporter Options

```typescript
/**
 * Options for the Allure report.
 */
allure?: {
  /**
   * Pattern used to create urls for issues and bugs.
   *
   * '%s' in pattern will be replaced with issue/bug keys defined in Story options.
   *
   * @example "http://example.com/jira/browse/%s"
   */
  issueTrackerPattern?: string,

  /**
   * Pattern used to create urls for testcase management system.
   *
   * '%s' in pattern will be replaced with testId keys defined in Story options.
   *
   * @example "http://example.com/tms/browse/%s"
   */
  testManagementPattern?: string,

  /**
   * Will be prepended to issue keys displayed in allure report.
   * This can be useful as allure report provides no way to distinct issues and bugs by default.
   */
  issuePrefix?: string,

  /**
   * Will be appended to issue keys displayed in allure report.
   * This can be useful as allure report provides no way to distinct issues and bugs by default.
   */
  issueAppendix?: string,

  /**
   * Will be prepended to bug keys displayed in allure report.
   * This can be useful as allure report provides no way to distinct issues and bugs by default.
   */
  bugPrefix?: string,

  /**
   * Will be appended to bug keys displayed in allure report.
   * This can be useful as allure report provides no way to distinct issues and bugs by default.
   */
  bugAppendix?: string
};
```

## Testrunner Callbacks

```typescript
/**
 * Gets executed once before all workers get launched.
 * @param {ICallbackConfig} config wdio-workflo configuration object
 * @param {Array.<ICapabilities>} capabilities list of capabilities details
 */
onPrepare?<T>(config: ICallbackConfig, capabilities: ICapabilities[]): Promise<T> | void;

/**
 * Gets executed just before initialising the webdriver session and test framework. It allows you
 * to manipulate configurations depending on the capability or testcase.
 *
 * This callback is only invoked during the "testcases" phase.
 *
 * @param {ICallbackConfig} config wdio-workflo configuration object
 * @param {Array.<ICapabilities>} capabilities list of capabilities details
 * @param {Array.<String>} testcaseFiles List of testcases file paths that are to be run
 */
beforeSession?<T>(config: ICallbackConfig, capabilities: ICapabilities[], testcaseFiles: string[]): Promise<T> | void;

/**
 * Gets executed before testcases execution begins. At this point you can access to all global
 * variables like `browser`. It is the perfect place to define custom commands.
 *
 * This callback is only invoked during the "testcases" phase.
 *
 * @param {Array.<ICapabilities>} capabilities list of capabilities details
 * @param {Array.<String>} testcaseFiles List of testcases file paths that are to be run
 */
before?<T>(capabilities: ICapabilities[], testcaseFiles: string[]): Promise<T> | void;

/**
 * Hook that gets executed before the suite starts
 * @param {Suite} suite suite details
 */
beforeSuite?<T>(suite: Suite): Promise<T> | void;

/**
 * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
 * beforeEach in Jasmine)
 */
beforeHook?<T>(): Promise<T> | void;

/**
 * Hook that gets executed _after_ a hook within the suite ends (e.g. runs after calling
 * afterEach in Jasmine)
 */
afterHook?<T>(): Promise<T> | void;

/**
 * Function to be executed before a testcase starts.
 * @param {Test} test test details
 */
beforeTest?<T>(test: Test): Promise<T> | void;

/**
 * Runs before a WebdriverIO command gets executed.
 * @param {String} commandName hook command name
 * @param {Array} args arguments that command would receive
 */
beforeCommand?<T>(commandName: string, args: any[]): Promise<T> | void;

/**
 * Runs after a WebdriverIO command gets executed
 * @param {String} commandName hook command name
 * @param {Array} args arguments that command would receive
 * @param {Number} result 0 - command success, 1 - command error
 * @param {Error} error error object if any
 */
afterCommand?<T>(commandName: string, args: any[], result: number, error: Error): Promise<T> | void;

/**
 * Function to be executed after a testcase ends.
 * @param {Test} test test details
 */
afterTest?<T>(test: Test): Promise<T> | void;

/**
 * Hook that gets executed after the suite has ended
 * @param {Suite} suite suite details
 */
afterSuite?<T>(suite: Suite): Promise<T> | void;

/**
 * Gets executed after all tests are done. You still have access to all global variables from
 * the test.
 * @param {Number} result 0 - test pass, 1 - test fail
 * @param {Array.<ICapabilities>} capabilities list of capabilities details
 * @param {Array.<String>} testcaseFiles List of testcases file paths that ran
 */
after?<T>(result: number, capabilities: ICapabilities[], testcaseFiles: string[]): Promise<T> | void;

/**
 * Gets executed right after terminating the webdriver session.
 *
 * This callback is only invoked during the "testcases" phase.
 *
 * @param {ICallbackConfig} config wdio-workflo configuration object
 * @param {Array.<ICapabilities>} capabilities list of capabilities details
 * @param {Array.<String>} testcaseFiles List of testcases file paths that ran
 */
afterSession?<T>(config: ICallbackConfig, capabilities: ICapabilities, testcaseFiles: string[]): Promise<T> | void;

/**
 * Gets executed before test execution begins. At this point you can access to all global
 * variables like `browser`. It is the perfect place to define custom commands.
 *
 * This callback is only invoked during the "testcases" phase.
 *
 * @param {Array.<ICapabilities>} capabilities list of capabilities details
 * @param {Array.<String>} specFiles List of spec file paths that are to be run
 */
beforeValidator?<T>(capabilities: ICapabilities[], specFiles: string[]): Promise<T> | void;

  /**
 * Gets executed after all tests are done. You still have access to all global variables from
 * the test.
 * @param {Number} result 0 - test pass, 1 - test fail
 * @param {Array.<ICapabilities>} capabilities list of capabilities details
 * @param {Array.<String>} specFiles List of spec file paths that ran
 */
afterValidator?<T>(result: number, capabilities: ICapabilities[], specFiles: string[]): Promise<T> | void;

/**
 * Gets executed after all workers got shut down and the process is about to exit.
 * @param {Number} exitCode 0 - success, 1 - fail
 * @param {ICallbackConfig} config wdio-workflo configuration object
 * @param {Array.<ICapabilities>} capabilities list of capabilities details
 */
onComplete?<T>(exitCode: number, config: ICallbackConfig, capabilities: ICapabilities[]): Promise<T> | void;

/**
* Gets executed when an error happens
* @ {Error} error
*/
onError?<T>(error: Error): Promise<T> | void;
```