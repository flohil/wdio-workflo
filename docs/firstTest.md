---
id: firstTest
title: Writing your first Test
sidebar_label: Writing your first Test
---

## Overview

This guide walks you through all stages of writing your first functional system
test in wdio-workflo. It provides basic explanation and code examples for each stage.

For more detailed information about each of the core components and concepts mentioned
here, please refer to their respective guides.

The goal of our first test is to ensure the correct functionality of a link
located in the footer of wdio-workflo's demo site which redirects users back
to wdio-workflo's main website.

All code for this guide can also be found at https://github.com/flohil/wdio-workflo-example.

## Prerequisites

This guide assumes that you have installed and initialized wdio-workflo with
its default configuration. If you haven't done so already, please follow the
steps described in the [Setup guide](setup.md).

Furthermore, you need to have Google Chrome installed on your system
(You can also change the browser used to run your tests in `workflo.conf.ts`).

## Defining the Requirements
Wdio-workflo follows a behavior-driven software development approach and encourages you to define the requirements of your application in so-called 'spec' files before you start writing testcases.

So, let's start by creating the file 'footer.spec.ts' in the `src/specs` folder
of your system test directory:

```typescript
Feature("Footer", {}, () => {
  Story("1.1", "Opening framework website", {}, () => {
    Given("the user is located on the demo website", () => {
      When("the user clicks on the framework link in the footer", () => {
        Then(1, "the framework website is opened");
      });
    });
  });
});
```

As you can see, the requirements for the behavior of the link we are about to test
are defined within a `Story`. Each `Story` consists of an id ("1.1"), a title,
an object which stores metadata about the story ({}) and a body function.
Related `Story`s are grouped together in a `Feature`.

Inside a `Story`'s body function, we use the so-called `Gherkin` syntax to
describe the states and state changes of our application's user interface:

- `Given` describes an initial state.
- `When` describes a transition from one state to another, triggered by a user or a system.
- `Then` describes an expected state and thus defines an acceptance criteria for your requirements.

`Story`s are supposed to be understood by all stakeholders of your project
(including non-technical users). Therefore, `Story`s are written in natural language.

Please notice that the first parameter of our `Then` function is a numerical id.
This id is necessary to reference and validate a certain acceptance criteria of a `Story`
from within a testcase.

For more information about specs, please visit the [Specs guide](specs.md).

## Creating Page Objects

Wdio-workflo uses an architecture based on the [Page Object Pattern](https://martinfowler.com/bliki/PageObject.html) to map the structure of a
website and to provide an API to interact with the website.

Since wdio-workflo's page object architecture is a quite extensive topic to cover,
we will only brush page object's in this guide. For a complete description
of all page object components provided by wdio-workflo, please read the [Page Objects guide](pageObjects.md).

In a nutshell, wdio-workflo's page architecture consists of 3 main components:
`PageNode`, `PageNodeStore` and `Page`.

### Page Nodes

A `PageNode` represents a component of a website. In frontend web development
frameworks like React.js or Angular, a `PageNode` is the equivalent of a
React/Angular Component. These components are reusable building blocks of a
website with a certain HTML structure and behavior. Each page on a website
usually consists of many of these components.

Wdio-workflo provides 4 base classes to recreate website components in our
testing environment:

- [`PageElement`](element.md) to map a single component
- [`PageElementList`](list.md) to map a collection of similar components with dynamic data like a news feed
- [`PageElementMap`](map.md) to map a collection of similar components with static data like navigation menu entries
- [`PageElementGroup`](group.md) to map a composition of different components like a form
(with inputs, checkboxes, dropdowns...)

All of these classes are already implemented by wdio-workflo and you can use them to map very basic website components like a button or a div/span container which simply renders some text.

You can, of course, derive your own `PageNode` classes from these base classes
to map more complex website components. However, for our first functional system test,
we will skip the creation of a custom `PageNode` class and use the basic `PageElement`
class to map the "framework link" located on the footer.

### Page Node Stores

A [`PageNodeStore`](store.md) configures, initializes and caches instances of `PageNode`s.
It can be thought of as a mixture of Factory and Facade pattern.

Writing functional system tests with wdio-workflo, we usually never instantiate
`PageNode`s directly but always use `PageNodeStores` to access instances of
`PageNode`s.

When you create your own custom `PageNode` classes, you have to add a factory method
in a `PageNodeStore` in order to use your custom page nodes.
Since we do not use any custom `PageNode` classes in our first functional system test,
we can skip this for now.

### Pages

A [`Page`](page.md) in wdio-workflo is basically an aggregation of `PageNodes`. It maps
the structure of a website's pages, dialogs or page fragments (eg. header, footer...).
Each `Page` is assigned an instance of a `PageNodeStore` to create its `PageNode`s.

In addition, a `Page` can also define method to abstract the behavior of a
page, dialog of page fragment. The `Page` base class provided by wdio-workflo
includes methods to check if the `Page` is currently or eventually open/closed
and to wait for a page to be open/closed.

For our first functional system test, we have to map the structure of the demo
website's footer page fragment (actually, it is sufficient to only map the framework link).

To do so, please create a new directory named `common` in the folder `src/page_objects/pages`
and add the file `Footer.ts` inside this directory:

```typescript
import { stores } from '?/page_objects';

import { Page } from '../Page';

export class Footer extends Page<stores.PageNodeStore> {

  constructor() {
    super({ store: stores.pageNode });
  }

  get container() {
    return this._store.Element(
      xpath('//footer')
    );
  }

  get frameworkLink() {
    return this.container.$.Element(
      xpath('//a').text('wdio-workflo')
    );
  }

  isOpen(): boolean {
    return this.container.currently.isVisible();
  }

  isClosed(): boolean {
    return this.container.currently.not.isVisible();
  }
}

export const footer = new Footer();
```

Now there is quite a lot going on here. Don't fear - let me walk you through it
step by step.

At the top of the file, you will notice there is an absolute and a relative `import` statement
to import our `PageNodeStore` and `Page` base classes.
`?` in the absolute import refers to the `src` folder inside your system test directory.

*I usually use absolute imports ("?/page_objects") if I need to import code from a folder
which is not a direct sibling to or a parent of the folder of the current file.
However, if I import code from a file that resides in the same folder as or a parent folder of
the current file, I use relative imports.*

*As a rule of thumb, all files within the same "module" (folder "family")
should be imported with relative imports and all other files with absolute imports.
This also helps to reduce errors related to circular dependencies in TypeScript.*

Since our `Footer` class extends the base `Page` class and each `Page` class is
associated with a `PageNodeStore` class in order to be able to create `PageNode`s,
we need to tell the base `Page` class the type of the `PageNodeStore` that we want to use
(`Page<stores.PageNodeStore>`). Furthermore, we need to pass an instance of said
page node store to the parameters of the super class constructor
(`super({ store: stores.pageNode })`).

The `Page` base class also has two abstract methods `isOpen` and `isClosed`
which need to be implemented by our `Footer` class. To indicate whether a website's page
is open or closed, we usually check if one of the page's components currently visible (rendered).

Usually, each page is wrapped within a container HTML element. If this container
element is rendered, we assume that our page is currently open.

Therefore, we now define a `PageElement` called `container` on our `Footer` page fragment.

You might wonder why our `container` is implemented as a getter function.
The reason for this is that each `Page` class is actually stateless - all state is stored in the website
itself and the `Page` only provides an API to interact with the website.
So if we want to interact with a component on a website, we must fetch its current
state from the website first.

*To do so, we could write "normal" class methods, like "getContainer()".
These methods usually have no parameters, which allows us to use a more elegant way: JavaScript getters.
These are basically functions that look like class variables
(without function parenthesis) and they are newly evaluated each time you access them.*

Inside our `container` getter function, we fetch a `PageElement` instance from
the `PageNodeStore` associated with our `Footer` by invoking `this._store.Element()`.

To identify our `container` in the website's DOM, we need to pass an XPath selector
to the `.Element()` factory method. Here we have two options: We can either write
the XPath selector as a "raw" string, or we can use wdio-workflo's `xpath` builder
function. Using the `XPathBuilder` is useful for more complex XPath selectors
whose syntax can be a bit intimidating and error-prone.

To explain how wdio-workflo's `XPathBuilder` works, let's now have a look at the
mapping of our framework link.

This time, we use a different way of retrieving a `PageElement` from a `PageNodeStore`.
Same as with `Page`s, every `PageNode` is also associated with a `PageNodeStore` in
order to create `PageNode`s which are children of other `PageNode`s in the HTML
structure of a website. For `PageElement`s and `PageElementList`s, the associated
`PageNodeStore` instance is available via the `$` accessor.

The `$` accessor has one special feature: It chains the XPath selectors of the
parent and the child `PageNode`s together. In our example, this would result
in the XPath selector '//footer//a[., "wdio-workflo"]'.

So, one remaining mystery: What does the '[., "wdio-workflo"]' part of our selector mean?

This is the kind of question that you do not need to worry about if you use wdio-workflo's
XPathBuilder instead of writing "raw" XPath strings. Using XPathBuilder, you
only supply an XPath selector for the HTML element tag, prepended by "/" for a
direct child or "//" for an indirect child. The XPathBuilder then provides
a couple of functions to add constraints to your HTML element, eg. its text or
its CSS classname. To see all available options, simple write `xpath().` and
trigger the autocompletion mechanism of your code editor.

One last thing:

I usually add `index.ts` files in each page object folder, so that I can export
and import all page objects defined within a folder as a single "module".

To do so, create the file `index.ts` in the folder `src/page_objects/pages/common`:

```typescript
export * from './Footer';
```

and add the following two lines to the file `index.ts` in the folder `src/page_objects/pages`:

```typescript
import * as common from './common';

export { common };
```

## Steps

Now that we have mapped all of the demo website's components with which we need
to interact, we need to write [Steps](steps.md) which encapsulate these website interactions
in order to make them reusable.

Each `Step` is defined by

- a title in natural language
- a body function where the actual interaction logic with the website is implemented
- step arguments which are passed as parameters to the step's body function
- a step callback which gets invoked after the body function

So let's create a file called `demo.step.ts` in the folder `src/steps`:

```typescript
import { defineSteps, IOptStepParams, Step } from 'wdio-workflo';

import { pages } from '?/page_objects';

const demoSteps = defineSteps({
  "open demo website":
  (params?: IOptStepParams<Workflo.EmptyObject, void>) =>
    new Step(params, () => {
      // When not providing a protocol, the url is resolved relative to the baseUrl.
      browser.url('');
      pages.common.footer.wait.isOpen();
    }),

  "open framework link in footer and return url":
  (params?: IOptStepParams<Workflo.EmptyObject, string>) =>
    new Step(params, () => {
      pages.common.footer.frameworkLink.click();

      return browser.getUrl();
    }),
});

export { demoSteps };
```

To make sure wdio-workflo can handle our `Step`s correctly, we need to pass our step definitions object as a parameter to wdio-workflo's `defineSteps` function.
This step definitions object consists of the `Step` titles as keys and
step creation functions as values.

A step creation function returns a new instance of a `Step` and is always passed
a single step `params` object, which encapsulates our step arguments and an optional step
callback function. This `params` object is then passed on into a `Step`'s constructor
as first parameter, together with the `Step`'s body function as its second
parameter.

An example step `params` object could look like this:

```typescript
{
  args: { url: "https://google.com" }
  cb: () => {
    console.log("step was executed")
  }
}
```

A `Step` might or might not require step arguments, depending on the logic implemented
in the `Step`'s body function. If the `Step` does require step arguments, the type
of the step `params` object becomes `IStepParams`, if it does not, the type
`IOptStepParams` should be used.

In our case, both the step "open demo website" and the step "open framework link in footer" do not require external step arguments. Therefore, the type of our step `params` object is `IOptStepParams`. Since we do not need to pass step arguments to these two steps
and since the step callback function is always optional, we can mark the whole
step `params` object as optional as well be putting a `?` next to the parameter name.
This means that when we invoke these steps, we do not need to provide a step
`params` object at all.

You may have noticed that the type `IOptStepParams` (and also the type `IStepParams`)
requires two type parameters.

The first type parameter defines the type of our step arguments. If we do not have any step arguments, like in our case, we should use the `Workflo.EmptyObject` type.

The second type parameter defines the return type of our `Step`'s body function.
The return value of a `Step`'s body function is passed as a single parameter to its
call back function. If we do not return anything, we can use the `void` type as in our step "open demo website". In our second step "open framework link in footer and return url",
we return the browser's url after clicking on the framework link. Since this url
is a string, we use `string` as return type.

There is only one thing left which I would like to explain in a little more detail:
the body function of the "open demo website" step. The line `browser.url('');`
is used to navigate to different domains or paths within a domain.

If you want to open a completely different website, you need to start the url with
"http://" or "https://". If you want to open a page on the same domain, you
can start your url parameter with a "/" to resolve it relative to the root of
the baseUrl property defined in your `workflo.conf.ts` file. If you omit the "/",
the path is resolved relative to the baseUrl itself.

So, in our case, `browser.url('');` simply opens the base url of our demo website.

The next line `pages.common.footer.wait.isOpen();` is also very important,
because it demonstrates one of the most common pitfalls of testing web applications:
timeouts and waiting.

Keep in mind that loading and rendering a website takes some time - usually longer
than our test runner takes to invoke the next command. Therefore, if we forget
to wait for an element of a website to be rendered and try to interact with this element,
we will run into errors because the element simply isn't available yet.

Wdio-workflo supports two waiting mechanisms: explicit and implicit waiting.
In this case, we explicitly tell our test to wait for our footer to be open to make
sure that our demo website has finished loading before any interactions with elements
on this website can take place.

Explaining all aspects of wdio-workflo's waiting mechanisms is beyond the scope
of this guide. If you are interested, you can find more information in the
[Page Element guide](element.md).

There is one last thing left to do before we can resume our guide: We need to register
our newly created step definitions in the `index.ts` file of our `src/steps` folder:

```typescript
import { defineSteps, proxifySteps } from 'wdio-workflo';

////////////////////////////////////////////////////////////
// EDIT THIS AREA TO CREATE A MERGED STEP DEFINITIONS OBJECT
////////////////////////////////////////////////////////////

// IMPORT YOUR STEP DEFINITIONS
import { demoSteps } from './demo.step';

// MERGE ALL STEP DEFINITIONS INTO ONE OBJECT AS SHOWN BELOW
const stepDefinitions = defineSteps({
  ...demoSteps,
});

////////////////////////////////////////////////////////////

const steps = proxifySteps(stepDefinitions);

export { steps };
```

This file merges all step definitions of different `.step.ts` files together
into one big `steps` object. This comes in handy when writing testcases
because we can "query" the `steps` object to see if certain steps that we
would like to use have already been implemented.

You can also export smaller collections of steps, but you need to make sure
that your exported steps have been proxified by calling wdio-workflo's `proxifySteps`
function and passing it your step definitions. Otherwise, wdio-workflo will not
be able to handle your steps correctly.

## Testcases

We have now finished all preliminary work to write our first actual [testcase](testcases.md).

A `testcase` is defined by a title, some metadata about the testcase and a body function. The body function contains a sequence of `Step`s which modify the state of the tested web application. Within the callback function of each `Step`, a testcase can validate one or many acceptance criteria of our requirements which we defined in our spec files.

Multiple similar `testcase`s should be grouped together in `suite`s.

For our first `testcase`, create the file `demo.tc.ts` in the folder `src/testcases`
with the following content:

```typescript
import { pages } from '?/page_objects';
import { steps } from '?/steps';

suite("demo", {}, () => {
  testcase("open framework link", {}, () => {
    const frameworkUrl = 'https://flohil.github.io/wdio-workflo/';

    given(steps["open demo website"]())
    .when(steps["open framework link in footer and return url"]({
      cb: (url) => {
        validate({ "1.1": [1] }, () => {
          // if step body function does not return the data we need for validation
          // const url = browser.getUrl();

          expect(url).toEqual(frameworkUrl);
        });
      }
    }));
  });
});
```

If you wonder about the curly braces which are the second parameters of our
`suite` and `testcase` functions, these are used to add metadata. For example,
you can define the `severity` of a `testcase` (how severe it would be if the
testcase failed). More details about the different kinds of metadata available
can be found in the [Testcases guide](testcases.md).

The structure of a `testcase` always follows the same pattern:

- first you pass a `Step` to the `given()` function to establish a well-known, initial state in your application
- then you use pass a `Step` to the `when()` function to modify the state of the application
- finally, you validate the resulting state using the `validate()` function inside
a `Step`'s callback function

Of course, you can have more than one `Step` for establishing the initial state
and for performing state modifications. To use multiple `Step`s, simply append an
`and()` function to your `given()` or `when()` invocations.

Most of our testcase code should be quite self-explanatory. I only want to give
a little more explanation about the callback function of our "open framework link in footer and return url" step.

As you can see, the callback function is passed the `url` string which we
returned in the body function of the step. It then invokes the `validate` function
by passing it a validation object as first parameter and a validation function
as second parameter.

The keys of validation objects are the ids of the `Story`s that we defined in our
spec files. The values of validation objects are arrays of acceptance criteria ids
of these `Story`s. So in our case, we tell our `testcase` to validate the
acceptance criteria with the id 1 of our `Story` with the id "1.1". We could
also add more acceptance criteria ids to the array of a `Story` id or even add more
`Story` ids if one validation is used to validate multiple requirements at once.

Inside a validation function, we usually need to retrieve some data from the
tested application which describes the current state of the GUI. In our case,
the step itself already returns the resulting url - both approaches are valid
and wdio-workflo does not force you to use one over the other. However,
if you fetch the data inside the callback function you can be more flexible because
you are not limited to the data returned by a step and can access any data you like
via page objects' API functions.

The last interesting thing about the validation above is the use of the
`expect(url).toEqual(frameworkUrl)` expectation matchers to compare the actual
browser url with the expected framework url.

Wdio-workflo uses the [Jasmine test framework](https://jasmine.github.io/) to
compare our actual and expected data. To provide you with even more flexibility,
wdio-workflo also added matchers from the [jasmine-expect](https://www.npmjs.com/package/jasmine-expect) npm packages.

Furthermore, wdio-workflo provides some custom matchers for its page object classes: `expectElement`, `expectList`, `expectMap`, `expectGroup` and `expectPage`.
These custom matchers will help you reduce the code required for expectation matching
and provides very useful error messages custom-tailored to page objects.

You can read more about wdio-workflo's expectation matchers in the
`Expectation Matcher guide`(matchers.md).

## Running your Test

Finally, we are now able to run our first functional system test written with
wdio-workflo.

Simply execute the following command from your project's root directory:

```
./node_modules/.bin/wdio-workflo
```

This will run all your tests.

You can also filter which tests should be run. For example, to only execute
our newly created testcase, we could run:

```
./node_modules/.bin/wdio-workflo --testcases '["demo.open framework link"]'
```

You can read more about execution filters in the [Execution Filters guide](runningTests.md#cli-execution-filters).

Or, you can learn about all CLI options available in Wdio-Workflo by visiting
the [CLI Options page](cliOptions.md).

## Showing the Test Report

While running your tests, wdio-workflo will write a [spec report](reporters#spec-reporter)
into the console window. This report is useful for test development, because in case of
errors, you can jump directly to the line in which the error occurred by clicking on this
line in the error stack trace.

If you run your tests on a continuous integration server like Jenkins, wdio-workflo
also supports a nice graphical report in the [Allure Report](http://allure.qatools.ru/) format.

To generate and display this report in a browser, run the following command:

```
./node_modules/.bin/wdio-workflo --report
```

Unfortunately, at the moment the Allure report generated by wdio-workflo
does not differentiate between testcases and specs properly on all of its pages:

Allure's "Overview" and "Graphs" page will treat both testcases and specs as "test cases" or "tests".
However, you can open Allure's "Behaviors" page which groups all test artifacts into "Specs" and
"Testcases" to examine specs and testcases separately.

For more information about test reports, please read the [Reporters guide](reporters.md).
