---
id: runningTests
title: Running Tests
sidebar_label: Running Tests
---

## Executing all Tests

To run all the testcases and evaluate all the specs specified in your system test
directory, execute the following command from your project's root directory:

```
./node_modules/.bin/wdio-workflo
```

A test run always consists of two phases:

1. Executing testcases
2. Evaluating specs by checking the validation results of testcases which reference them

During each phase, the result status of testcases and specs, as well as a list of all
validation failures and errors which occurred during test execution, are shown in the console.

## Rerun Faulty Testcases and Specs

If some of your specs (`Story`s) or testcases did not pass during the last test run, you can rerun only these faulty specs and testcases using the `rerunFaulty` CLI option:

```bash
./node_modules/.bin/wdio-workflo --rerunFaulty
```

## Filtering Testcases and Specs

Wdio-workflo provides two mechanisms to limit the number of testcases executed and specs evaluated during a single test run:

- Modifying the names of the API functions `suite`, `testcase`, `Feature` and `story`
- Using the CLI's test execution filter options

### Modifying API function names

Wdio-workflo allows you to prepend the letters `x` or `f` to any `suite`, `testcase`, `Feature`, `Story` and `Then` API function:

- An API function prepended with an `x` will be skipped
- An API function prepended with an `f` will cause all equal API functions in the same scope which are not prepended with an `f` to be skipped

If you skip a `suite` or a `Feature`, all `testcase` or `Story` functions defined within the scope of the `suite` / `Feature` will also be skipped. If you skip a `Story` function,
all `Then` functions within the scope of the `Story` function will be skipped.

Examples:

```typescript
suite("skipping testcase example suite", () => {
  // skipped
  xtestcase("testcase a", {}, () => {})

  // executed
  testcase("testcase b", {}, () => {})
})

suite("forcing testcase example suite", () => {
  // executed
  ftextcase("testcase a", {}, () => {})

  // skipped
  testcase("testcase b", {}, () => {})

  // also executed
  ftestcase("testcase c", {}, () => {})
})

// skipped
xsuite("skipped suite", () => {
  // skipped
  testcase("testcase a", {}, () => {})

  // skipped
  testcase("testcase b", {}, () => {})
})

// skipped
xFeature("feature a", {}, () => {
  // skipped
  Story("story a", {}, () => {
  })
})

Feature("feature a", {}, () => {
  // skipped
  xStory("1.1", "story a", {}, () => {
    Given("an initial condition", () => {
      When("a state change occurs", () => {
        // skipped
        Then(1, "the result state should be: ")
      })
    })
  })
})

Feature("feature a", {}, () => {
  Story("1.1", "story a", {}, () => {
    Given("an initial condition", () => {
      When("a state change occurs", () => {
        // skipped
        xThen(1, "the result state should be: ")
      })
    })
  })
})

```

### CLI Execution Filters

You can also use wdio-workflo's CLI options to filter which testcases should be executed
and which specs should be validated during a test run.

These CLI options allow you to filter `suite`, `testcase`, `Feature` and `Story` functions
by name, filename and severity as well as result status and date of their last execution.

You can also combine these CLI options to make your execution filters more precise.
If you choose to do so, every additional CLI option will make the filters more restrictive - only if a `testcase` or `Story` meets all of the conditions defined by each passed CLI option,
will it be executed/validated.

#### Filtering by Name

To filter `testcase` and `suite` functions by name, use the `--testcases` CLI option:

```bash
# execute all testcases of Suite1 as well as Testcase1 of Suite2
./node_modules/.bin/wdio-workflo --testcases '["Suite1", "Suite2.Testcase1"]'

# execute all testcases of Suite2 except for Testcase2
./node_modules/.bin/wdio-workflo --testcases '["Suite2", "-Suite2.Testcase2"]'
```

To filter `Feature` functions by name, use the `--features` CLI option:

```bash
# execute all testcases which validate specs defined within these features
./node_modules/.bin/wdio-workflo --features '["Login", "Logout"]'

# execute all testcases except those which validate specs defined within the feature "Login"
./node_modules/.bin/wdio-workflo --features '["-Login"]'
```

To filter `Story` functions by name, use the `--specs` CLI option:

```bash
# execute all testcases which validate Story 3.2
./node_modules/.bin/wdio-workflo --specs '["3.2"]'

# 1.1* includes Story 1.1 and all of its Sub-Stories, however Story 1.1.2.4 will be skipped
./node_modules/.bin/wdio-workflo --specs '["1.1*", "-1.1.2.4"]'

# 1.* excludes Story 1 itself but includes all of its Sub-Stories
./node_modules/.bin/wdio-workflo --specs '["1.*"]'
```

#### Filtering by Filename

To filter `testcase` and `suite` functions by their filename, use the `--testcaseFiles` CLI option:

```bash
# execute all testcases defined within the files testcaseFile1.tc.ts and testcaseFile2.tc.ts
./node_modules/.bin/wdio-workflo --testcaseFiles '["testcaseFile1", "testcaseFile2"]'
```

To filter `Story` and `Feature` functions by their filename, use the `--specFiles` CLI option:

```bash
# validate all Stories defined within the files specFile1.tc.ts and specFile2.tc.ts
./node_modules/.bin/wdio-workflo --specFiles '["specFile1", "specFile2"]'
```

#### Filtering by Severity

Both the `testcase` and the `Story` function allow you to define a `severity` property in their `metadata` object parameter. The `severity` defines how grave the implications of a
failed `testcase` or a not correctly validated `Story` would be for your application.

There are five different `severity` levels: `blocker`, `critical`, `normal`, `minor` and `trivial`.

To filter `testcase` functions by their `severity`, use the `--testcaseSeverity` CLI option:

```bash
# execute all testcases with a severity of "blocker"
./node_modules/.bin/wdio-workflo --testcaseSeverity '["blocker"]'
```

To filter `Story` functions by their `severity`, use the `--specSeverity` CLI option:

```bash
# validate all Stories with a severity of "normal", "minor" or "trivial"
./node_modules/.bin/wdio-workflo --specSeverity '["normal", "minor", "trivial"]'
```

#### Filtering by Status

Every time you execute a `testcase` or validate a `Story`, wdio-workflo keeps track
of their result status. You can use this information to filter `testcase` and `Story` functions based on the result status of their last execution or validation.

The five result status for `testcase` functions are: `passed`, `failed`, `broken`, `pending` and `unknown`. Additionally, you can use `faulty` as a shortcut for `broken`, `failed` and `unknown`.

The five result status for `Story` functions are: `passed`, `failed`, `broken`, `unvalidated` and `unknown`. Additionally, you can use `faulty` as a shortcut for `broken`, `failed`, `unvalidated` and `unknown`.

To filter `testcase` functions by their result status, use the `--testcaseStatus` CLI option:

```bash
# execute all testcases whose result status from their last execution is either "broken" or "pending"
./node_modules/.bin/wdio-workflo --testcaseStatus '["broken", "pending"]'
```

To filter `Story` functions by their result status, use the `--specStatus` CLI option:

```bash
# validate all Stories whose result status from their last execution is "unvalidated"
./node_modules/.bin/wdio-workflo --specStatus '["unvalidated"]'

# validate all Stories whose last result status is "broken", "failed", "unvalidated" or "unknown"
./node_modules/.bin/wdio-workflo --specStatus '["faulty"]'
```

#### Filtering by Date

There might be situations when you want to execute all `testcase` functions or
validate all `Story` functions that have not been run since a specific date.

To filter `testcase` and `Story` functions by the date they were run for the last time, use the `--dates` CLI option:

```bash
# restricts by last run started between 2017-03-10 and 2017-10-28 (both at 0 pm, 0 min, 0 sec)
./node_modules/.bin/wdio-workflo --dates '["(2017-03-10, 2017-10-28)"]'

# restricts by last run started on 2017-07-21 or at 2017-07-22 at 2 pm, 51 min, 13 sec
./node_modules/.bin/wdio-workflo --specStatus '["2017-07-21", "2017-07-22T14:51:13"]'
```

## Running Tests Headless

An easy way to run your tests headless is to use Google's Chrome browser
and set the following options in `workflo.conf.ts`:

```typescript
export const workfloConfig: IWorkfloConfig = {
  /*...*/
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['headless', 'disable-gpu']
    }
  }
  /*...*/
}
```