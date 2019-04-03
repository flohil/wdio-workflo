---
id: cliOptions
title: CLI Options
sidebar_label: CLI Options
---

This page describes how to set options via wdio-workflo's command line interface (CLI).

## How to set a CLI Option

To set an option via the CLI, you need to prepend two dashes to the option's
name:

```
./node_modules/.bin/wdio-workflo --version
```

If the option also has a value, the name of the option and the value
need to be separated by a space:

```
./node_modules/.bin/wdio-workflo --retries 3
```

You can use multiple options in a single command:

```
./node_modules/.bin/wdio-workflo --retries 3 --specs '["1.1"]'
```

## Overwriting Configuration Options

Some of wdio-workflo's CLI options can also be set in wdio-workflo's
configuration file `workflo.conf.ts`. As a rule of thumb, an option set
via the CLI always overwrites the corresponding option in `workflo.conf.ts`.

## Showing all available CLI Options

To show a list of all available CLI options, use the `--help` option:

```
./node_modules/.bin/wdio-workflo --help
```

This will output the following:

```text
wdio-workflo CLI runner

Usage: wdio-workflo [configFile] [options]
The [options] object will override values from the config file.

Options:
  --help, -h               Prints wdio-workflo help menu.

  --version, -v            Prints wdio-workflo version.

  --init                   Initializes the folder structure for wdio-workflo tests. Define testDir in workflo.conf.ts before!

  --baseUrl, -b            Set a base URL in order to shorten url command calls

  --host                   Host of your WebDriver server (default: '127.0.0.1')

  --port                   Port your WebDriver server is on (default: 4444)

  --user, -u               username if using a cloud service as Selenium backend

  --key, -k                corresponding access key to the user

  --bail                   Stop test runner after specific amount of tests have failed (default: 0 - don't bail)

  --browserName            name of the browser used for executing tests or displaying results

  --debug                  enable debugging with Node-Inspect Manager chrome extension (default: false)

  --reportErrorsInstantly  report broken testcase errors and errors from validation failures immediately (default: false)
                           allowed values are (true|false)
                           will be enabled by default if consoleLogLevel is set to "steps"

  --retries                how many times flaky tests should be rerun (default: 0)
                           the test results will always refer to the last try/execution
                           to show error messages and stacktraces of all tries enable 'reportErrorsInstantly'

  --consoleLogLevel        Defines the log level for the console output (default: "testcases")
                           "results" will only output the results and errors of testcases and specs
                           "testcases" will additionally print the name of the currently executed test
                           "steps" will additionally print all executed steps in the console

  --debugSeleniumCommand   Outputs selenium commands in the allure report if set to true (default: true)

  --cleanStackTraces       Remove error stack trace lines that originate from the test framework itself (default: true)

  --testcases              restricts test execution to these testcases
                           '["Suite1", "Suite2.Testcase1"]' => execute all testcases of Suite1 and Testcase1 of Suite2
                           '["Suite2", "-Suite2.Testcase2"]' => execute all testcases of Suite2 except for Testcase2

  --features               restricts test execution to these features
                           '["Login", "Logout"]' => execute all testcases which validate specs defined within these features
                           '["-Login"]' => execute all testcases except those which validate specs defined within these features

  --specs                  restricts test execution to these specs
                           '["3.2"]' => execute all testcases which validate spec 3.2
                           '["1.1*", "-1.1.2.4"]' => 1.1* includes spec 1.1 and all of its sub-specs (eg. 1.1.2), -1.1.2.4 excludes spec 1.1.2.4
                           '["1.*"]' => 1.* excludes spec 1 itself but includes of of its sub-specs

  --testcaseFiles          restricts test execution to testcases defined within these files
                           '["testcaseFile1", "testcaseFile2"]' => execute all testcases defined within testcaseFile1.tc.ts and testcaseFile2.tc.ts

  --specFiles              restricts test execution to testcases validated by specs defined within these files
                           '["specFile1", "specFile2"]' => execute all testcases validated by specs defined within specFile1.spec.ts and specFile2.spec.ts

  --listFiles              restricts test execution to the testcases, specs, testcaseFiles, specFiles and lists defined within these files
                           '["listFile1"]' => execute all testcases included by the contents of listFile1.list.ts

  --specStatus             restricts specs by status of their criteria set during their last execution
                           '["passed", "failed", "broken", "unvalidated", "unknown"]' => these are all available status - combine as you see fit
                           '["faulty"]' => faulty is a shortcut for failed, broken, unvalidated and unknown

  --testcaseStatus         restricts testcases by given status
                           '["passed", "failed", "broken", "pending", "unknown"]' => these are all available status - combine as you see fit
                           '["faulty"]' => faulty is a shortcut for failed, broken and unknown

  --specSeverity           restricts specs by severity set during their last execution
                           '["blocker", "critical", "normal", "minor", "trivial"]' => these are all available severities - combine as you see fit

  --testcaseSeverity       restricts testcases by severity set during their last execution
                           '["blocker", "critical", "normal", "minor", "trivial"]' => these are all available severities - combine as you see fit

  --dates                  restricts testcases and specs (oldest spec criteria) by given date and time (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
                           '["(2017-03-10,2017-10-28)"]' => restricts by status set between 2017-03-10 and 2017-10-28 (both at 0 pm, 0 min, 0 sec)
                           '["2017-07-21", "2017-07-22T14:51:13"]' => restricts by last status set on 2017-07-21 or 2017-07-22 at 2 pm, 51 min, 13 sec

  --manualOnly             do not run automatic testcases and consider only manual results

  --automaticOnly          run only automatic testcases and do not consider manual results

  --info                   shows static information about testcases and specs

  --generateReport         generates report for latest results or
                           '2017-10-10_20-38-13' => generate report for given result folder

  --openReport             opens report for latest generated allure results or
                           '2017-10-10_20-38-13' => open report for given generated result folder

  --report                 generates and opens report for latest results or
                           '2017-10-10_20-38-13' => generate and open report for given result folder

  --consoleReport          displays report messages written to console during latest test execution
                           '2017-10-10_20-38-13' => display report messages written to console for given result folder

  --printStatus            show current status of all testcases and specs for the specified browser

  --traceSpec              show spec file defining and all testcases, testcase files and manual result files validating this spec
                           '4.1' => show traceability information for spec 4.1

  --traceTestcase          show testcase file defining and all specs and spec files validated by this testcase
                           'Suite1.testcase1' => show traceability information for testcase1 in Suite1

  --rerunFaulty            reruns all faulty specs and testcases from the latest execution
                           '2017-10-10_20-38-13' => reruns all faulty specs and testcases from the results folder '2017-10-10_20-38-13'
```



