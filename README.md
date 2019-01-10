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

# Writing your first Functional System Test
<!-- 

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

## add input to store

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

 -->


# CLI
## Running tests
To start all of your testcases, run ```./node_modules/.bin/wdio-workflo```

You can filter the executed tests by testcases, specs and many more:

```
./node_modules/.bin/wdio-workflo --testcases '["MySuite.sample test"]'
./node_modules/.bin/wdio-workflo --specs '["4.1.2"]'
```

To only rerun tests which failed during the latest test run, execute

```./node_modules/.bin/wdio-workflo --rerunFaulty```

## Printing test reports
The results of your tests are available in two different formats:

- Spec report (displayed as a textual report in a console window)
- Allure report (displayed as a visual report in a browser window)

Spec reports are shown during and after the execution of your tests in the console from where you launched your tests.
Allure reports need to be explicitly generated after running your tests.

### Showing the results of the latest test run
To show the results of the latest test run in the spec format, run

```./node_modules/.bin/wdio-workflo --consoleReport```

To generate and open an allure report for the latest test run, you can either execute each command separately
or you can combine both commands:

```
./node_modules/.bin/wdio-workflo --generateReport
./node_modules/.bin/wdio-workflo --openReport

// or combined

./node_modules/.bin/wdio-workflo --report
```

### Showing the results of a specific previous test run
Each time a test run is executed, wdio-workflo writes its launch time into the file ```latestRun``` stored
in the ```results/<<browserName>>``` folder of wdio-workflo's system test directory.

To show the results of a specific previous test run, append the time at which the test run was launched in the format
YYYY-MM-DD_HH-MM-SS:

```
// spec report format
./node_modules/.bin/wdio-workflo --consoleReport 2017-10-10_20-38-13

// allure report format:
./node_modules/.bin/wdio-workflo --report 2017-10-10_20-38-13

```

## Debugging
If you want to debug your tests, you can choose from two available options:

- Webdriverio's debug command
- Debugging in Chrome DevTools

### Webdriverio's debug command
If you simply want to inspect the current state of the browser window in which your tests are executed, you can put the ```browser.debug()``` command somewhere in your test case.

This will pause your tests and your commandline interface will switch into a REPL mode that allows you to interact with the tested application via webdriverio commands.

Running the command ```.exit``` in your CLI will exit the breakpoint and continue the test run.

### Debugging in Chrome DevTools
In order to be able to debug your tests using the Chrome DevTools, the following preconditions need to be met:

- Google's chrome browser needs to be installed on your system.
- The chrome extension "NIM (Node-Inspector Manager)" needs to be added to and enabled in your chrome browser.
- The "debug" property of wdio-workflo's configuration object in "workflo.conf.ts" needs to be set to true or you need
to invoke your tests with the --debug cli option enabled: ```./node_modules/.bin/wdio-workflo --debug```
- You need to open a browser window in chrome before you start your tests (so that Node-Inspector Manager can hook itself into the Chrome DevTools).
- The "NIM" extension needs to be configured correctly. Further below you can find a list of recommended NIM settings.

Now putting a ```debugger``` statement somewhere in your code will  pause your tests and enter a breakpoint in Chrome DevTools. You can switch to the Chrome DevTools window and step through your test code, observe the state of variables etc. or you can switch to the browser window in which your tests are run and inspect the state of the tested
application.

Sometimes tests might get stuck after entering a ```debugger``` statement. In this case, closing all chrome processes,
opening a new chrome window, switching "Open DevTools" in NIM's Main Menu to "Manual" and then back to "Auto" and finally
restarting your tests should resolve the problem.

These are the recommended settings for the "NIM" chrome extension:

(Main Menu)
- Host: "localhost"
- Port: "9229"
- Open DevTools: "Auto"

(General Options Menu)
- Open in a New Window: "On"
- Make Window Focused: "On"
- Close Automatically: "On"
- Select DevTools Version: "On" -> DevTools Version (default)
- Real-time Collaboration: "Off"
- check Interval: 0.50 secondes

The General Options Menu can be opened by hovering over the little circle in the right bottom of the Main Menu and then clicking on the "sliders" icon.

## Help
To show all options of wdio-workflo's CLI, run

```./node_modules/.bin/wdio-workflo --help```

# Documentation
Wdio-workflo's documentation comes bundled with the npm package and can be displayed by opening the file ```node_modules/wdio-workflo/apiDoc/index.html```

Webdriverio's api docs for version 4.13 can be found at http://v4.webdriver.io/api.html

# Learn more about Wdio-workflo
To gain a deeper insight into wdio-workflo's features and to learn more about how to test your browser-based application using this wdio-workflo, visit the framework's website at https://wdio-workflo.com
