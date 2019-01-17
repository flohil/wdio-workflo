# Overview
Wdio-workflo is a framework for writing behavior-driven automated functional system tests in TypeScript and based on a
customized version of webdriverio v4.13 ( https://webdriver.io/ ).

It allows you to define acceptance criteria which can by referenced in your testcases to automatically validate
the requirements of your tested application. The test reports created by wdio-workflo will not only show the result
status of your testcases, but also indicate which requirements could not be fulfilled or validated because of failed or
broken testcases.

Wdio-workflo wants to get you started with writing functional system tests as quickly as possible by preconfiguring
webdriverio and all required services. It helps you save a lot of time and work by providing boilerplate code and the
basic building blocks of a sophisticated page object pattern architecture. Testcases in wdio-workflo consist of
reusable steps formulated in natural language to make them comprehensible for all stakeholders.

The rest of this document shows you:

 - Where you can learn more about wdio-workflo's features and motivation
 - Where you can find the full API documentation for wdio-workflo and webdriverio v4.13
 - Where you can find code examples for the usage of wdio-workflo
 - How to install and configure wdio-workflo
 - How to write your first functional system test using wdio-workflo
 - How to run your tests
 - How to debug your tests
 - How to show the results of your tests in a graphical report
 - How to show all options of wdio-workflo's Command Line Interface

# Learn more about wdio-workflo
Visit https://wdio-workflo.com (coming soon) to

- gain a deeper insight into wdio-workflo's features and motivation
- find a detailed explanation of the framework's components
- learn from examples that show you how to effectively test your browser-based application and validate its requirements
using wdio-workflo.

# API Documentation
Wdio-workflo's API documentation comes bundled with the npm package and can be displayed by opening the file ```node_modules/wdio-workflo/apiDoc/index.html```

Webdriverio's API docs for version 4.13 can be found at http://v4.webdriver.io/api.html

# Examples
The code for this guide and for all examples found at https://wdio-workflo.com (coming soon) is
available at https://github.com/flohil/wdio-workflo-example.

# Installation and Configuration
- Install wdio-workflo by running ```npm install --save-dev wdio-workflo``` in your project folder.
This will automatically create wdio-workflo's configuration file ```workflo.conf.ts``` and wdio-workflo's typescript
compiler settings file ```tsconfig.workflo.json``` in the same directory.
- Adapt wdio-workflo's configuration in ```workflo.conf.ts``` to your own needs.
- Run ```./node_modules/.bin/wdio-workflo --init``` to create the boilerplate code for your functional system tests.

If you changed the value of `testDir` in ```workflo.conf.json```, you need to make sure that your changed system test
folder path is contained in the `include` array of ```tsconfig.workflo.json```.

# Writing your first Functional System Test
## Overview
This guide walks you through all stages of writing functional system tests in wdio-workflo.
It provides basic explanation/background information and an implementation example for each stage.

In our example, we will browse to the public npm registry at https://www.npmjs.com/ and search for the wdio-workflo
npm package.

All code for this guide can also be found at https://github.com/flohil/wdio-workflo-example.

## Basic Configuration
First, we need to set the base url for our tested web application in wdio-workflo's configuration.

To do so, open the file ```workflo.conf.ts``` in your project folder and set the value of its ```baseUrl``` property to
"https://www.npmjs.com/".

Wdio-workflo's default configuration assumes that the Google Chrome browser is installed on your system.
If this is not the case, please install Google Chrome before proceeding or change the ```browserName``` property
defined in the ```capabilities``` option of ```workflo.conf.ts``` file.

## Defining the Requirements
### Information
Wdio-workflo follows a behavior-driven software development approach and encourages you to define the requirements
of your application in so-called 'spec' files before you start writing testcases.

Spec files view the GUI of your application as a state machine. Therefore, you need to formulate your requirements
as a sequence of initial states, state transitions and expected states using the keywords `Given`, `When` and `Then`:

- `Given` describes an initial, well-known state
- `When` describes a transition from one state to another which is triggered by either a user or a system
- `Then` describes an expected state and thus defines an acceptance criteria for your requirements

Multiple "instances" of the keywords `Given` and `When` can be chained together sequentially with the keyword `And`.

A complete sequence of states and state transitions is called a `Story`. This is similar to the term 'User Story' used
in agile development, except that a `Story` in the context of wdio-workflo is more focused on application states
rather than the motives of a user - you could say that `Story` only cares about the 'what' and 'how', but not about the
'why' (unlike User Stories).

Bear in mind that `Story`s are supposed to be understood by all stakeholders of your project (including non-technical
users). Therefore, `Story`s are written in a natural language.

Related `Story`s are grouped together in a `Feature`.

### Implementation
We now define our requirements for the npmjs page in the file `npmjs.spec.ts` located in the `src/specs` folder of
your system test directory:

```
// npmjs.spec.ts
Feature('Packages', {}, () => {

  // '1.1' is the ID of the Story and used to uniquely identify it.
  // If our `Story` is based on a user story stored in a tool like JIRA, we can link to the corresponding JIRA issue in the generated test report by including its key in the `issues` array.
  Story('1.1', 'Searching a package', { issues: ['NPMJS-1'] }, () => {
    Given('the user is located on the homepage', () => {
      When('the user enters the name of an existing npm package in the search field')
      .And('the user clicks on the "Search" button', () => {

        // The first parameter of `Then` is a numeric ID needed to reference the acceptance criteria in a testcase.
        Then(1, 'at least one npm package is displayed in the list of search results');
        Then(2, 'the npm package whose name exactly matches the searched term is displayed at the top');
      });
    });
  });
});
```

## Creating Page Objects
### Information
Modern websites are usually built with reusable components which has many advantages:

- To change the behavior or structure of a component, we only need to edit it at one place which greatly improves
maintainability.
- Components are always used in the same way which increases the learnability for both developers and users.
- The development speed of a website can be increased by reusing existing components.
- We can use 3rd party component libraries to save even more resources.
- ...

Page objects seek to transfer these advantages to the world of functional system testing by wrapping HTML pages and the
components used to build these pages with an application-specific API.

In other words, page objects are reusable testing components which abstract the structure and the behavior of a website
and its HTML elements.

Wdio-workflo provides the main building blocks of a sophisticated page object architecture out of the box:

- PageNodes
- Pages
- PageNodeStores

#### PageNodes
PageNodes are a family of classes used to map the structure and behavior of a website's components.

There are 4 types of `PageNode` classes:

- `PageElement` can be thought of as wdio-workflo's counterpart to React or Angular components. This class provides
functions to retrieve, check and manipulate the state of a website component and its underlying HTML structure.
- `PageElementList` manages a collection of related `PageElement` instances which all have the same type and XPath
selector. The `PageElement`s managed by `PageElementList` are dynamic, which means that they can change and are
usually not known at compile time (eg. the entries of a news feed, the rows of a data table...).
- `PageElementMap` also manages a collection of related `PageElement` instances which all have the same type and the
same "base" selector. However, in contrary to `PageElementList`, the `PageElement` instances managed by `PageElementMap`
are static which means that they usually do not change and are known at compile time (eg. the links of a navigation menu).
- `PageElementGroup` manages an arbitrary structure of `PageNodes` that can all have different types and selectors (eg.
a form on a website, consisting of input fields, radio boxes, dropdown, checkboxes, labels...)

All PageNodes classes feature the following 3 APIs:

- `currently` to check or retrieve the current state of a website's component
- `wait` to wait for a website component to reach a certain state (within a specific timeout)
- `eventually` to check if a website component eventually reaches a certain state (within a specific timeout)

`PageElement` and `PageElementList` also provide an initial waiting condition that is performed implicitly each time a
function that interacts with a website component's state is invoked directly on these classes
(and not via its `currently`, `wait` or `eventually` APIs). Supported waiting conditions are:

- `exist` to wait for an element to exist in the DOM
- `visible` to wait for an element to be visible (not obscured by another element, visibility not set to hidden...)
- `text` to wait for an element (eg. a button) to have any text
- `value` to wait for an element to have any value (eg. read-only input fields)

This spares us the need to explicitly wait for a `PageElement` to be loaded in the DOM, to become visible etc. before we
can interact with it.

Finally, getting or setting an HTML `value` attribute (eg. when filling in an input field, ticking a checkbox...) is
not supported by these 4 basic PageNode classes. If you want to get or set an HTML element's value, you need to use
the `ValuePageNode` class family, consisting of `ValuePageElement`, `ValuePageElementList`, `ValuePageElementMap` and
`ValuePageElementGroup`. `ValuePageElement` is an abstract class and requires you to implement the methods `setValue`
and `currently.getValue`.

#### Pages
A `Page` is an aggregation of all `PageNode`s which make up a complete website or a large fragment of a website.

Pages allow us to assign meaningful names to PageNodes and they define the XPath selectors which identify a `PageElement`
or the elements of a `PageElementList` in the DOM.

Please be aware that wdio-workflo only supports XPath selectors because they are more "flexible" than CSS selectors
(eg. they support searching for a parent element) and because the performance differences are negligible in most cases.

`Page` requires you to implement the methods `isOpen` and `isClosed` to check if a page is currently open or closed.
Furthermore, `Page` also provides a `wait` and a `eventually` API to wait for the page to be open/closed or to check
if the page is eventually open/closed within a specific timeout.

#### PageNodeStores
When working with wdio-workflo, PageNodes should not be created manually but instead should be retrieved from
a `PageNodeStore`. This is a class that caches PageNode instances which have the same type and the same selector
in order to consume less memory.

In addition to being a PageNode factory, `PageNodeStore` serves as a single facade that gives you access to all PageNode
types without having to import them from all over the place. It also makes the instantiation of PageNodes more
comfortable by defining a default configuration for each PageNode, so that most of the time when you want to use a
PageNode, you only need to pass a XPath selector to the store's factory method.

### Implementation

## Implementing Steps
### Information
While PageNodes already provide us with reusable testing components, Steps are wdio-workflo's main driver for
increased reusability.

A `Step` defines a series of interactions or a single interaction with the tested application (usually via PageNodes).
Each step can be reused as many times as you like within your testcases or it can also be invoked from inside another
step (nested steps).

Each `Step` consists of three key features:

- A description written in natural language, so that non-technical stakeholders too can comprehend what is going on
- A body function that implements the step's interactions with the tested application
- Parameters which can be used to "configure" the step, to provide data that is needed during the step's execution and
to define a callback which is executed immediately after the step has finished

### Implementation

## Writing Testcases
### Information
A `testcase` consists of a sequence of steps and validates the requirements we defined in our spec files.
Sets of related testcases are grouped together in `suite`s.

The structure of a `testcase` closely resembles that of a `Story`. Each testcase provides the following functions
to encapsulate and automatically invoke steps:

- `given` to establish an initial, well-known state
- `when` to perform changes to the tested application's state
- `and` to sequentially chain together multiple `given` or `when` statements

In contrary to the specs defined within a `Story`, a `testcase` does not support nested `given`s or `when`s -
they always need to be chained together sequentially.

In order to check the expected state following the execution of a `Step`, a `testcase` can invoke the `validate`
function inside the step's callback. To do so, we need to pass the IDs of both the validated acceptance criteria and its
containing `Story` to the `validate` function.
Inside the `validate` function's body, we can make use of wdio-workflo's custom page object matchers or Jasmine's
default assertion matchers to compare the state's actual and expected values.

The following custom page object matchers are supported by wdio-workflo:

- `expectElement`
- `expectList`
- `expectMap`
- `expectGroup`
- `expectPage`

The expectation failure messages produced by these custom page object matchers will be a lot more meaningful than those
of Jasmine's default assertion matchers (containing the `PageElement`'s constructor name, the XPath selector of the
affected `PageElement` and the applied timeout in milliseconds if an eventuallyXXX matcher was used).

### Implementation

# Running your tests
## Launching selenium
Wdio-workflo requires a selenium webdriver server to execute your testing commands in the browser.
To make the handling of selenium as seamlessly as possible, wdio-workflo makes use of webdriverio's
`selenium-standalone` service which automatically installs all required selenium drivers and launches a local selenium
webdriver server when you executed your tests.

You can also install the required drivers and launch a selenium webdriver server manually.
In this case, you should disable the `selenium-standalone` service by setting the `services` option in your
`workflo.conf.ts` file to an empty array. If your selenium server does not run locally, you also need to set the
`host` and `port` options of you wdio-workflo configuration to the correct values.

## Executing your testcases
To start all of your tests, run ```./node_modules/.bin/wdio-workflo```

You can filter the executed tests by testcases, specs and many more:

```
./node_modules/.bin/wdio-workflo --testcases '["MySuite.sample test"]'
./node_modules/.bin/wdio-workflo --specs '["4.1.2"]'
```

To only rerun tests which failed during the latest test run, execute

```./node_modules/.bin/wdio-workflo --rerunFaulty```

# Test reports
The results of your tests are available in two different formats:

- Spec report (displayed as a textual report in a console window)
- Allure report (displayed as a visual report in a browser window)

Spec reports are shown during and after the execution of your tests in the console from where you launched your tests.
Allure reports need to be explicitly generated after running your tests.

## Showing the results of the latest test run
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

## Showing the results of a specific previous test run
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

# Debugging
If you want to debug your tests, you can choose from two available options:

- Webdriverio's debug command
- Debugging in Chrome DevTools

## Webdriverio's debug command
If you simply want to inspect the current state of the browser window in which your tests are executed, you can put the ```browser.debug()``` command somewhere in your test case.

This will pause your tests and your commandline interface will switch into a REPL mode that allows you to interact with the tested application via webdriverio commands.

Running the command ```.exit``` in your CLI will exit the breakpoint and continue the test run.

## Debugging in Chrome DevTools
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

The General Options Menu can be opened by hovering over the little circle in the right bottom of the Main Menu and then
clicking on the "sliders" icon.

# Showing all CLI options
There are many more options available via wdio-workflo's Command Line Interface than the ones already mentioned in this
document.

To show all of them, run

```./node_modules/.bin/wdio-workflo --help```


