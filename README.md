# Overview
Wdio-workflo is a framework for writing automated functional system tests and based on a customized version of
webdriverio v4.13 ( https://webdriver.io/ ).

It allows you to define acceptance criteria which can by referenced in your testcases to automatically validate
the requirements of your tested application. The test reports created by wdio-workflo will not only show the result
status of your testcases, but also indicate which requirements could not be fulfilled or validated because of failed or
broken testcases.

Wdio-workflo wants to get you started with writing functional system tests as quickly as possible by preconfiguring
webdriverio and all required services. It helps you save a lot of time and work by providing boilerplate code and the
basic building blocks of a sophisticated page object pattern architecture. Testcases in wdio-workflo consist of
reusable steps formulated in natural language to make them comprehensible for all stakeholder.

# Installation and Configuration
- Install wdio-workflo by running ```npm install --save-dev wdio-workflo``` in your project folder.
This will automatically create wdio-workflo's configuration file ```workflo.conf.ts``` in the same directory.
- Adapt wdio-workflo's configuration in ```workflo.conf.ts``` to your own needs.
- Run ```./node_modules/.bin/wdio-workflo --init``` to create the boilerplate code for your functional system tests.

You are now all set to write your first functional system test using wdio-workflo! :D

# Writing your first functional system test

## Goal
This little 'Getting Started' guide quickly walks you through all necessary steps to write functional system tests in
wdio-workflo.

In our example, we will browse to the public npm registry at https://www.npmjs.com/ and search for the wdio-workflo
npm package.

## Configure the base url in workflo.conf.ts
At first we set the base url for our tested web application in wdio-workflo's configuration.

To do so, open the file ```workflo.conf.ts``` in your project folder and set the value of its baseUrl property to
"https://www.npmjs.com/":

```
// workflo.conf.ts
const workfloConfig: IWorkfloConfig = {
  /* ... */
  baseUrl: 'https://www.npmjs.com/',
  /* ... */
}
```

## Create PageElements and a Page to map the components of the tested web application
Now we need to map all HTML components required to search for the wdio-workflo npm package on https://www.npmjs.com/.

To do so, create the files ```NpmJsPage.ts``` in the ```src/page_objects/pages``` folder and ```Input.ts``` in the
```src/page_objects/page_elements``` folder of your system test directory.

```
// Input.ts
import { PageElementStore } from '../stores'
import { ValuePageElement, ValuePageElementCurrently } from './ValuePageElement'

export class Input<Store extends PageElementStore> extends ValuePageElement<Store, string> {

  readonly currently = new InputCurrently(this)

  setValue(value: string): this {
    this.element.setValue(value)

    return this
  }
}

export class InputCurrently<
  Store extends PageElementStore,
  PageElementType extends Input<Store>
> extends ValuePageElementCurrently<Store, PageElementType, string> {

  getValue(): string {
    return this.element.getValue()
  }
}
```

```
// NpmJsPage.ts
const workfloConfig: IWorkfloConfig = {
  /* ... */
  baseUrl: 'https://www.npmjs.com/',
  /* ... */
}
```


## Create a spec file to define your requirements
Create the file ```npmjs.spec.ts``` in the ```src/specs``` folder of your system test directory.

In this file, we will define requirements of our tested application.

```
// npmjs.spec.ts


```

write spec

write testcase

write steps

show your results

```./node_modules/.bin/wdio-workflo --report```

# Running your tests

```./node_modules/.bin/wdio-workflo```

can filter the tests run by testcases, specs and many more:

```./node_modules/.bin/wdio-workflo --testcases '["MySuite.sample test"]'```

```./node_modules/.bin/wdio-workflo --specs '["4.1.2"]'```

# Help

show all options of wdio-workflo's cli

```./node_modules/.bin/wdio-workflo --help```

# Features
Wdio-workflo

Spec definitions with acceptance criteria to automatically validate requirements of tested application.
similar to cucumber
specs are written in gherkin language: Given - When - Then -> subset of gherkin language which is also
used by cucumber (https://docs.cucumber.io/gherkin/reference/)
describes initial state of tested application's user story
when describe state change triggered by a user or a system
then is an acceptance criteria which can be referenced by testcases to validate requirements

testcases consisting of reusable steps

page objects: default building blocks for page object pattern -> Page, PageElement, PageElementList,
PageElementMap and PageElementGroup

Page objects: benefits of modern wep applications which are built with reusable components to world of system testing
-> map websites components structure and behavior

helps to avoid common pitfalls:
- initial waiting condition performed automatically before interacting with pageelements

uses spec style reporter to output steps, results and errors in the console

generate  html test results using allure reports (link)


at the moment, only one browser can system tested concurrently

# Guide

learn more about wdio-workflo's features and about how to test your browser-based application using wdio-workflo

# Documentation

available in apiDocs folder for wdio-workflo

docuemntation of webdriverio v4.13 -link-

