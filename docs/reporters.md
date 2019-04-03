---
id: reporters
title: Reporters
sidebar_label: Reporters
---

## Introduction

### Overview

Wdio-workflo supports two test reporters:

- A spec reporter for test development which outputs results on the console.
- An allure reporter for continuous integration which generates a visually appealing results website.

### Result Status

While wdio-workflo's reporters pursue different goals, they share the same definitions for possible
result status:

- **passed** *(green)* - All validations of a testcase or spec (acceptance criteria) passed.
- **failed** *(red)* - At least one validation of a testcase or spec failed (actual and expected value didn't match).
- **broken** *(yellow)* - There was a runtime error inside a testcase/one of the testcases that validate a spec.
- **skipped** *(blue/grey)* - The execution of a testcase or spec was skipped (eg. `xtestcase` or `xThen`).
- **unknown/unvalidated** *(magenta)* - A spec was not validated (eg. because of a broken testcase).

*The `broken` status always has precedence over the `failed` status. So for a testcase, if a validation fails and afterwards
a runtime error occurs, the testcase will be marked as `broken`. For a spec, if at least one of the testcases which validate
the spec is `broken`, the spec is marked as `broken`.*

## Spec Reporter

### Objective

The spec reporter's main objective is to support you during the phase of test
development. It automatically outputs its results to the console window from
which you launched your tests.

The spec reporter can be integrated very well with your code editor if you launch
your tests from eg. VS Code's integrated terminal. This gives you the ability to
click on a line of an error/validation failure stacktrace and jump directly to
the described file and line number in your code.

### Structure

A spec report consists of 3 main sections:

- The results of your testcases
- The validation results of your specs (stories and acceptance criteria)
- A summary of your test results

#### Testcase Results

During the first phase of a test run, wdio-workflo performs the following steps for each `.tc.ts`
file inside your `testcase` folder:

- Executing all testcases that match your test execution filters (if you defined any).
- Displaying the result status for each testcase, grouped by their parent suites.
- Showing a list of all validation failures and runtime errors that occurred during test execution.

![Spec validation results](assets/spec_report_test_execution.png)

#### Spec Validation Results

After all testcases have been run, wdio-workflo now links the results of all validations
performed within a testcase to the specs referenced by the validation object.

For each `.spec.ts` file inside your `specs` folder, wdio-workflo will now:

- Display the validation results of your specs (acceptance criteria) grouped by their parent stories.
- Show a list of all validation failures and runtime errors that occurred during a spec validation.

![Spec validation results](assets/spec_report_spec_validation.png)

#### Summary

The spec report's summary of your test run starts with a list of all validation failures and runtime errors
that occurred during the execution of testcases and within spec validations.

![Test statistics](assets/spec_report_summary_errors.png)

At the very end of your spec report you can find some test statistics, including information such as:

- The number of executed testcase and spec files, suites, testcases, features and specs.
- The duration of testcase execution and spec validation.
- The coverage of your acceptance criteria (automated, manual, unvalidated).
- The percentage and count of passing/skipped/failing/broken/unvalidated testcases and specs.

![Test statistics](assets/spec_report_summary_statistics.png)

### Configuration Options

By default, the spec reporter does not output errors immediately and only logs the
name of executed testcases (but not the performed steps).

To change this behavior, your can alter the values of the options `reportErrorsInstantly` and `consoleLogLevel` in your `workflo.conf.ts` file or as CLI options.

This picture shows `reportErrorsInstantly` set to `true` and `consoleLogLevel` set to `'steps'`:

![{consoleLogLevel: 'steps', reportErrorsInstantly: true}](assets/spec_report_console_log_level_steps.png)

## Allure Reporter

### Objective

### Structure

test reports - testcases vs specs

dashboard page: information about environment, correct number of testcaess and specs,
overview of testcase results, link to build job that was tested

errors page: grouped by verification failure, broken errors (whats difference)

graphs page

timeline page

behaviors page

(packages and suites page can be ignored)

### Configuration Options

#### Disabling Selenium Commands Logging

By default, wdio-workflo logs each selenium command request (as well as its parameters and response object)
as a single step in your Allure report.

If this is too much information for you, you can set the `debugSeleniumCommands` option in your
`workflo.conf.ts` file to `false`.

#### Issue Tracking And Test Management Patterns

The Allure report can create links to the bugs, testIds and issues which you defined in your `testcase`
or `Story` metadata objects. In order for this to work, you need to configure the base urls for your
test management and issue tracking tools.

To do so, set the following options in `workflo.conf.ts`:

```typescript
allure: {
  // base url for bugs and issues, %s will be replaced by bug/issue id
  issueTrackerPattern: 'http://example.com/issues/%s',
  // base url for testIds, %s will be replaced by the testId
  testManagementPattern: 'http://example.com/tms/%s',
},
```

### Build Server Integration

There are plugins available for several build servers (including Jenkins, TeamCity, Maven) which enable
you to easily display and integrate Allure reports in your continuous integration pipeline.

For more information, see https://docs.qameta.io/allure/#_reporting.
