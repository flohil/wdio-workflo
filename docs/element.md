---
id: element
title: Element
sidebar_label: Element
---

*This guide provides a detailed explanation of wdio-workflo's `PageElement` and
`ValuePageElement` classes. However, it does not show you how to customize these
classes. If you want to learn how to create your own, customized page element classes
by extending wdio-workflo's `PageElement` or `ValuePageElement` class, read the
[Customizing an Element](customElement.md) guide.*

## Overview and Objective

Wdio-workflo's `PageElement` class is the main building block of the [Page Objects](pageObjects.md)
class family. It maps a single HTML element of a website and provides methods to interact
with this HTML element and read its state. To locate the mapped HTML element on a website,
`PageElement` makes use of [XPath selectors](xpathBuilder.md).

`PageElement` implements an implicit waiting mechanism that automatically performs an
initial waiting condition before interacting with the mapped HTML element or reading its state.
In addition, `PageElement` also provides the `currently` API to check or read the current state
of the mapped HTML without waiting as well as the `wait` and `eventually` APIs to either wait
for the HTML element's state to meet a certain condition or to check if the HTML element's state
does eventually meet a certain condition.

An important derivation of the `PageElement` class is wdio-workflo's `ValuePageElement`
class that provides two additional methods, `getValue` and `setValue`, to manage the value
of components like inputs, checkboxes or dropdowns.

## Creating a `PageElement`

Instead of manually invoking the constructor of `PageElement` using the `new` keyword,
you should always call the `Element()` factory method of the [PageNodeStore](store.md)
class to create an instance of the `PageElement` class:

```typescript
import { stores } from '?/page_objects';

// create PageElement instances by calling the `Element()` factory method of a PageNodeStore
const myElement = store.pageNode.Element('//div');
```

However, for the sake of completeness, let's examine the type parameters and constructor
of `PageElement` in more detail.

The `PageElement` class requires you to define one type parameter, the type of its associated `PageNodeStore`, which can be used to create other page nodes:

![The Store type parameter of PageElement](assets/page_element_type_parameters.png)

The constructor of `PageElement` requires two parameters:

- The XPath selector used to located the mapped HTML element on the website
- The `opts` parameter containing properties to configure the `PageElement`

![Constructor of PageElement](assets/page_element_constructor.png)

## The Associated `PageNodeStore`

Each `PageElement` stores an instance of a `PageNodeStore` in its private `_store`
class member variable.

If you extend the `PageElement` class to create a custom page element which maps a composite website component that consists of several different HTML elements, you can use
the `PageNodeStore` instance stored inside `_store` to create page nodes
which map these other HTML elements.

Furthermore, `PageElement` provides a public `$` accessor that also refers
to the `PageNodeStore` instance associated with the `PageElement`. The `$` accessor
additionally prepends the XPath selector of its `PageElement` to the XPath selector
passed to the factory methods of the associated `PageNodeStore`:

```typescript
import { stores } from '?/page_objects';

// myContainer has the XPath selector '//div'
const myContainer = stores.pageNode.Element('//div');

// myButton has the combined XPath selector '//div//button'
const myButton = myContainer.$.Element('//button');
```

## The `getSelector()` Method

As already mentioned, `PageElement` uses an XPath selector to located its mapped
HTML element on the website.

You can retrieve the XPath selector of a `PageElement` by calling its `getSelector` method:

```typescript
import { stores } from '?/page_objects';

const myContainer = stores.pageNode.Element('//div');

// outputs '//div' to the console
console.log(myContainer.getSelector())
```

This can be useful if your `PageElement` can't be located on the website and
you want to debug your testcase and output the XPath selector of the affected
`PageElement`.

## The Underlying WebdriverIO Element

Wdio-workflo's `PageElement` class introduces an additional layer of abstraction
on top of WebdriverIO's [browser.element](http://v4.webdriver.io/api/protocol/element.html) method. The `browser.element` method takes an XPath selector and fetches the first HTML
element matching this selector from the website:

```typescript
browser.element('//div')
```

The `PageElement` class does not store any information about the state of its mapped HTML
element. Instead, the state retrieval methods defined on `PageElement` internally invoke [WebdriverIO commands](http://v4.webdriver.io/api.html) on the element returned by `browser.element` to read information about the state of the mapped HTML element
directly from the GUI itself.

You can access the underlying WebdriverIO element of a `PageElement` via its `element`
accessor. Before returning the WebdriverIO element, the `element` accessor
calls the `initialWait()` method of the `PageElement` class to make sure that
the HTML element is fully loaded before you try to interact with it or read its state:

```typescript
get element() {
  this.initialWait();

  return this.__element;
}

protected get __element() {
  return browser.element(this._selector);
}
```

You can learn more about the waiting mechanisms of `PageElement` in the next section
of this guide.

## Waiting Mechanisms

### Implicit Waiting

### Explicit Waiting: `currently`, `wait` and `eventually`

## The `ValuePageElement` Class

Some components of a website like inputs, checkboxes, radio buttons, dropdowns, textareas
or toggles/switches manage a value that can be modified by users.

Wdio-workflo's `PageElement` class has no way of getting or setting the value of such components.
In this event, you need to make use of wdio-workflo's `ValuePageElement` class.
`ValuePageElement` is an abstract class that inherits all functionality of the `PageElement` class
and in addition provides two abstract methods, `getValue` and `setValue`, to manage the value
of components like input or checkbox.

However, since the implementation of these components can vary greatly between the different
available component libraries for React, Angular and the like, wdio-workflo does not
ship with a standard implementation for `getValue` and `setValue`.

Instead, you need to create your own, custom page element classes that inherit
from `ValuePageElement` and implement its `getValue` and `setValue` methods.

You can read more about how to do this in the [Extending `ValuePageElement`](customElement.md#extending-valuepageelement)
section of the [Customizing an Element](customElement.md) guide.