---
id: executionLists
title: Execution Lists
sidebar_label: Execution Lists
---

## Overview and Objectives

If your test suite grows very large and you don't want to execute all testcases and validate all specs
at once, you can create execution lists to execute only a subset of your test suite.

Execution lists are essentially reusable sets of [Execution filters](runningTests#cli-execution-filters).
They are stored in list files and you can put any combination of execution filters, and even sublists, in
these files.

An ideal example for when to use execution lists are smoke tests which are written to ensure that
the most critical parts of your web application work as intended. Smoke tests indicate whether further
test execution makes sense. Therefore, they should run fast and they should not cover all areas of your application.

## Location and Naming Convention

List files need to be placed in the `src/lists` folder of your system test directory.
By convention, the filename of list files should always end with `.list.ts`.

## Usage

To define an execution list, you need to create an object that implements the `Workflo.IFilterList` interface
and make this object the default export of a list file:

```typescript
const smokeTestList: Workflo.IFilterList = {

}

export default smokeTestList;
```

To run your test suite using the execution filters defined within a list file, you need to set the
`--listFiles` CLI option when starting wdio-workflo. The value of the `--listFiles` CLI option is a JSON array
of list file names (without the `.list.ts` ending):

```bash
./node_modules/.bin/wdio-workflo --listFiles '["smokeTests"]'
```