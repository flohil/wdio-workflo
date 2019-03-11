---
id: setup
title: Setup
sidebar_label: Setup
---

## Installation

To install wdio-workflo, run the following command from your project's root directory:

```
npm install --save-dev wdio-workflo
```

*If you encounter problems installing or running wdio-workflo, please try to
switch to an environment where Node 8 or Node 10 are installed.*

## Configuration

During the installation of wdio-workflo, two files are automatically created in
your project's root directory:

- `workflo.conf.ts` defines all configuration options for wdio-workflo
- `tsconfig.workflo.json` configures the typescript compiler for the usage of wdio-workflo

To avoid relative imports across multiple hierarchies of folders, wdio-workflo
defines two path aliases in your `tsconfig.workflo.json` file:

- `?` references the `src` folder in your test directory
- `~` references your project's root directory

By default, wdio-workflo expects all of your test code to reside in the folder
`system_test` relative to your project's root directory. You can change the
location of your test folder by editing the value of `testDir` in `workflo.conf.ts`.



## Initialization