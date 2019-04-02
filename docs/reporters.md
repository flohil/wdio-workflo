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
- **unknown/unvalidated** *(magenta)* - A spec was not validated by any testcase.

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

Test runner executes each .tc.ts file that contains testcases which match your
cli execution filters -> link.

For each .tc.ts,

In spec report, displays result status of each testcase defined in a .tc.ts file
and afterwards a list of all validation failures and errors which occured during
the execution of these testcases.

picture

#### Spec Validation Results

Test runner executes each .spec.ts file that contains stories which match your
cli execution filters -> link.

For each .spec.ts,

In spec report, displays validation result status of each story and acceptance criteria
defined in a .spec.ts file and afterwards a list of all validation failures and errors

picture

#### Summary

number of spec files, testcase files, suites, testcases, features and stories which
matches your execution filters -> link.

count and percentage of testcase results and spec results by category

picture

### Configuration Options

Usually, the spec reporter does not output errors or validation failures immediately,
but first finishes all testcases defined in a `.tc.ts` file before outputting

consoleLogLevels
reportErrorsInstantly

## Allure Reporter

debugSeleniumCommands

test reports - testcases vs specs

dashboard page: information about environment, correct number of testcaess and specs,
overview of testcase results, link to build job that was tested

errors page: grouped by verification failure, broken errors (whats difference)

graphs page

timeline page

behaviors page

(packages and suites page can be ignored)

configuration of issue tool etc.


integration on build server: Jenkins, Maven, TeamCity

More information about allure here: http://allure.qatools.ru/