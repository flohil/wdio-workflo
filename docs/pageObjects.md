---
id: pageObjects
title: Page Objects
sidebar_label: Page Objects
---

## WebdriverIO's Selenium Bindings

### The `browser` Object

Wdio-workflo is based on [webdriverio-v4](http://v4.webdriver.io), a NodeJS
client bindings library for Selenium Webdriver. If you want to send a Selenium Webdriver
command to the browser, you need to invoke one of the [API functions](http://v4.webdriver.io/api.html)
defined on WebdriverIO's globally available `browser` object.

### WebdriverIO's API Functions

The most important API functions of WebdriverIO's `browser` object are `element` / `$`
and `elements` / `$$`. These functions locate HTML elements in the browser window via
CSS or XPATH selectors:

- `element` and `$` take a selector and return the first matching HTML element as WebElement JSON object
- `elements` and `$$` take a  selector and return all matching HTML elements as WebElement JSON objects

After locating one or more HTML elements on the website, you can chain other API functions
to the return values of the `element` / `$` and `elements` / `$$` functions to interact with
the located HTML elements:

```typescript
const errorSpan = browser.element('//span[@id="error"]')
const errorText = errorSpan.getText();

const links = browser.$$('//a')

links.forEach(
  link => link.click()
)
```

## The Purpose of Page Objects

### The Problem of Maintainability and Adaptability

If you test a web application using Selenium Webdriver over an extended period of time,
you'll probably come to a point where the requirements of your application have changed
and you need to adapt your tests to these changes.

Although you could write all of your tests by merely using WebdriverIO's API functions,
adapting tests written in this way can be very time consuming and error prone since
there is no single point of change.

Imagine, for example, that a web application has a login page which contains
a button to submit the login form. In the past, this button was the only button
on the page and it had an HTML ID attribute with the value "button". In the meantime,
the requirements of our tested application have changed and a "forgot password" button
needs to be added to the login page. A developer now decides to change the ID of our
submit button from "button" to the value "submitButton".

Since all of our testcases needed to interact with the submit button of our login page,
we now have to change the selector of the button at many different places in our test code.

To make our tests easier to maintain and to increase their adaptability to changes,
it would be great if there was a single point of change for the selector of our
submit button.

### Introducing Single Points of Change

This is where page objects come into play: Their purpose is to encapsulate the structure
and the behavior of a website's components (a single or a couple of related HTML elements),
so that we have a single point of change in case their structure or their behavior changes.

Modern web development libraries like React.js and Angular adopt a similar approach:
They are based on the idea that websites are composed of reusable components.
Each component manages its own, encapsulated state and consists of one or usually
many different HTML elements that have a common goal. To achieve this goal, a component
provides certain ways to manipulate its behavior.

There could be, for example, a Dropdown component, consisting of an HTML `<input>` element
to show the currently selected value and a `<ul>` list of `div` options representing the possible values
of the Dropdown component. Initially, the list of options is hidden and only if somebody clicks
on the input field, the list of options is displayed, so that the user can select an option.
The structure of the single HTML elements and the way these elements interact with
each other and with the user are all encapsulated and implemented by the Dropdown component.

This Dropdown component is then used in different places of a web application.
If the component's structure or behavior changes, the application developer
needs to make adaptions in one single place only - within the Dropdown component.

Wdio-workflo takes advantage of the component-based architecture of a web application
by applying the same concept to the realm of GUI testing. Similar to React or Angular components,
we write test components that also encapsulate the structure and the behavior of a group of
HTML elements which strive to achieve a common goal. While adhering to the same basic concept of
creating single points of change, the implementation of test components and React/Angular components
differs quite a lot.

Wdio-workflo provides a couple of base classes which facilitate the creation of
such reusable, encapsulated test components. These classes are referred to as "page object classes".

## Page Object Classes

Wdio-workflo's page objects family consists of 3 types of base classes:
`PageNode`, `PageNodeStore` and `Page`.

The remaining part of this guide will only provide you with some basic
information about each of these classes, because they will be explained in full
detail in the following guides.

### Page Nodes

The `PageNode` class is an abstract class that serves as a base class for the
[`PageElement`](element.md), [`PageElementList`](list.md), [`PageElementMap`](map.md) and [`PageElementGroup`](group.md) classes.

#### `PageElement`

The [`PageElement`](element.md) class is wdio-workflo's basic implementation of a reusable,
encapsulated test component. It provides the capabilities to interact with and retrieve
the state/attributes of simple HTML elements like `<div>`, `<span>`, `<button>` or `<a>`.

#### `PageElementList`

The [`PageElementList`](list.md) class manages a collection of similar dynamic `PageElement` instances,
which means that the elements in the collection are all of the same type and not known at compile time.
A good example for elements managed by a `PageElementList` are the items of a
news feed or the rows in a data table.

#### `PageElementMap`

The [`PageElementMap`](map.md) class manages a collection of similar static `PageElement` instances,
which means that the elements in the collection are all of the same type and known at compile time.
A good example for elements managed by a `PageElementMap` are the links of a
navigation menu.

#### `PageElementGroup`

The [`PageElementGroup`](group.md) class manages an arbitrary structure of `PageNode` instances.
It is a representation of the composite pattern, which allows you to perform the
same kind of operation on each `PageNode` managed by the `PageElementGroup`.
The prevalent use case for the `PageElementGroup` class are HTML forms, which
usually contain many HTML form fields of different types. Instead of invoking a `setValue`
function on each individual form field, you can call `setValue` on the whole form
and pass it a single object that contains the data for all form fields.

### Page Node Stores

The [`PageNodeStore`](store.md) class serves as a facade for retrieving instances of
`PageNode` classes and implements factory methods to create, preconfigure and
cache them.

### Pages

The [`Page`](page.md) class maps the structure of a website by encapsulating all test components
used to build the website in its scope.

It fetches instances of `PageNode` classes from a `PageNodeStore` and sets
the XPath selectors used to locate them on the website.

Additionally, the `Page` class defines methods to check if a page is currently/eventually
open (fully loaded) or closed and methods to wait for the page to be open or closed.