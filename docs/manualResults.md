---
id: manualResults
title: Manual Results
sidebar_label: Manual Results
---

## Overview and Objective

Certain aspects of a web application might be hard to test using automated testcases
or the effort required to write them might just not be worth it. In these cases,
performing manual tests might be the preferred solution.

Wdio-workflo allows you to provide the results of your manual tests in a format
that can be handled by the framework. This way, you can use your manual test results
to validate the acceptance criteria defined within your [specs](specs.md).

The results of your manual test results will also show up in your test reports
and to the framework, it doesn't make much of a difference whether your specs
are validated by automated testcases are by your manual test results.

## Location and Naming Convention

Manual test results need to be placed in the `src/manual_results` folder of
your system test directory. Their filenames must end with `.man.ts`.

## Usage

To define your manual test results, you need to create an object that implements
the `Workflo.IManualTestcaseResults` interface and make this object
the default export of a `.man.ts` file:

```typescript
// homepage.man.ts

const homepage: Workflo.IManualTestcaseResults = {
  "5.5": {
    1: {result: true, date: '2017-08-16'},
    2: {result: false, date: '2017-08-16', comment: 'only fails in internet explorer'}
  }
}

export default homepage
```

The keys of a manual results object are the IDs the validated `Story` functions
and its values are objects that consist of the IDs of acceptance criteria as keys
and objects with the properties `result`, `date` and `comment` as values.

In the example above, our manual results object validates the `Story` with the ID
`"5.5"`. Acceptance criteria `1` of this story passed our manual tests (`result: true`)
and was tested on August 16th, 2017. Acceptance criteria `2` was tested on the same date but
failed to pass our manual tests (`result: false`). However, it only failed in the Internet Explorer
browser and we can record this in the optional `comment` property.