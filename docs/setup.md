---
id: setup
title: Setup
sidebar_label: Setup
---

## Prerequisites

- Wdio-workflo requires Node.js >= 8 to be installed on your environment.
- Furthermore, you need to install Java >= 1.8 to run a Selenium server.
- I recommend writing your tests in Visual Studio Code to profit from its IntelliSense code-completion aid.

*If you encounter problems installing or running wdio-workflo on a Node.js version > 10,
please try to switch to a Node 8 or Node 10 environment.*

## Installation

To install wdio-workflo, run the following command from your project's root directory:

```
npm install --save-dev wdio-workflo
```

## Configuration

### Configuration files

During the installation of wdio-workflo, two files are automatically created in
your project's root directory:

- `workflo.conf.ts` defines all configuration options for wdio-workflo
- `tsconfig.workflo.json` configures the typescript compiler for the usage of wdio-workflo

### Path aliases

To avoid relative imports across multiple hierarchies of folders, wdio-workflo
defines two path aliases in your `tsconfig.workflo.json` file:

- `?` references the `src` folder in your test directory
- `~` references your project's root directory

You can use these path aliases in each TypeScript file in the `src` folder of your test directory.

```TypeScript
import { pages } from '?/page_objects';
import { workfloConfig } from '~/workflo.conf';
```

### Test directory location

By default, wdio-workflo expects all of your test code to reside in the folder
`system_test` relative to your project's root directory. You can change the
location of your test folder by editing the value of `testDir` in `workflo.conf.ts`.

Keep in mind that if you change the default location of your test folder,
you also need to adapt the path aliases defined in `tsconfig.workflo.json`.

## Initialization

To initialize the folder structure of your test directory and to create some
necessary boilerplate files, run the following command from your project's root directory:

```
./node_modules/.bin/wdio-workflo --init
```

*Wdio-workflo creates a `tsconfig.json` inside your test directory. This file
extends `tsconfig.workflo.json` which is located in your project's root directory.
If you changed the default location of your test directory, please make sure
that this `tsconfig.json` file still correctly references the location of `tsconfig.workflo.json`.*