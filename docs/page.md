---
id: page
title: Page
sidebar_label: Page
---

## Overview and Objective

The objective of a `Page` is to map the structure of a website. It is essentially an
aggregation of all `PageNode` instances that make up a complete website or a large fragment
of a website. In order to create these `PageNode` instances, each `Page` has an instance of
a `PageNodeStore` class associated with it that is available via its `_store` class member.

Pages allow us to assign meaningful names to the page nodes in its scope. They also
define XPath selectors to locate these page nodes in the DOM. Since page nodes usually always
live within the scope of a `Page`, pages act as interfaces for testcases who want to access
a certain page node in order to interact with its corresponding HTML elements on a website.

Finally, each `Page` needs to implement two life cycle methods, `isOpen` and `isClosed`,
to indicate whether a page is fully loaded or not. These life cycle methods come in handy
when a single testcase interacts with more than one page and needs to switch pages.

## Location and Naming Convention

Page files are located in the `src/page_objects/pages` folder of your system test
directory. I usually like to name page classes so that they end with the term 'Page'
but from a technical perspective, this is not required and you do not need to follow
this convention.

## Code Example

The following sections of this page guide often refer to code snippets taken
from the `BasePage` class which is located at `src/page_objects/pages/BasePage.ts`
in the wdio-workflo-example repository.

This base class implements some common functionality for all pages of our
web application.

Here is the complete `BasePage.ts` file for a better overview:

```typescript
import { stores } from '?/page_objects';
import { Page, IPageOpts } from './Page';

import { workfloConfig } from '~/workflo.conf';

export interface IBasePageOpts<
  Store extends stores.PageNodeStore
> extends IPageOpts<Store> {
  pageName: DemoApp.PageName;
}

export abstract class BasePage<
  Store extends stores.PageNodeStore
> extends Page<Store> {
  pageName: DemoApp.PageName;

  constructor(opts: IBasePageOpts<Store>) {
    const { pageName, ...superOpts } = opts;
    super(superOpts);

    this.pageName = pageName;
  }

  get container() {
    return this._store.Element(
      xpath('//main'),
    );
  }

  get heading() {
    return this.container.$.Element(
      xpath('//h1')
    );
  }

  // check if pathname section of current browser url starts with our page's name
  private _doesUrlMatchPageName() {
    const pathName = browser.getUrl().replace(workfloConfig.baseUrl, '');

    // we need to double escape backslashes because they are interpreted as a string first
    const pageNameRegex = new RegExp(`^\\/${this.pageName}(\\?|\\/)*`);

    return pageNameRegex.test(pathName);
  }

  isOpen(): boolean {
    return this._doesUrlMatchPageName() &&
      this.heading.currently.isVisible() &&
      this.heading.currently.getText().toLowerCase() === this.pageName;
  }

  isClosed(): boolean {
    return !this._doesUrlMatchPageName() ||
      this.heading.currently.not.isVisible() ||
      this.heading.currently.getText().toLowerCase() !== this.pageName;
  }
}
```

## Structure

### Typing and Constructor

At the top of a page file, we need to declare the type of our page's `opts`
parameter as interface, define the page's class and type parameters and implement
its constructor:

```typescript
export interface IBasePageOpts<
  Store extends stores.PageNodeStore
> extends IPageOpts<Store> {
  pageName: DemoApp.PageName;
}

export abstract class BasePage<
  Store extends stores.PageNodeStore
> extends Page<Store> {
  pageName: DemoApp.PageName;

  constructor(opts: IBasePageOpts<Store>) {
    const { pageName, ...superOpts } = opts;
    super(superOpts);

    this.pageName = pageName;
  }

  /*...*/
}
```

In our code example, we implement `BasePage` as an `abstract` class that cannot live on
its own but needs to be extended by all (or most) normal page classes of our web application.

Each page of our web application has a `pageName`. By appending this `pageName` to the
base url of our web application, we can navigate to the corresponding page if we enter
the combined URL into the address bar of a browser.

So, to declare the type of our page's `opts` parameter, we extend `IBasePageOpts` from
wdio-workflo's `IPageOpts` interface and add our additional `pageName` property.
The `pageName` property is of the type `DemoApp.PageName` which is a list of
string literals containing the names of all the pages of our web application:

```typescript
namespace DemoApp {
  type PageName = 'feed' | 'registration'
}
```

Then we extend our `BasePage` class from wdio-workflo's `Page` class and declare it
to be `abstract` since it only serves as a common base class that should be extended
by all other page classes of our web application.

Both wdio-workflo's `Page` class and its `IPageOpts` interface require us to define
one type parameter: the type of the `PageNodeStore` associated with the page.
For our base class, however, we don't want to define a specific store class,
because each page extending it could be associated with a different store. Therefore,
our `BasePage` class and its `IBasePageOpts` use a generic `Store` type and they themselves require you
to define this `Store` type as a type parameter in all page classes that extend our `BasePage` class.

This may sound a little complicated, but I think the following example explains
how a normal page class can be extended from our `BasePage` class:

```typescript
import { stores } from '?/page_objects';

import { BasePage } from '../BasePage';

export class FeedPage extends BasePage<stores.FeedStore> {

  constructor() {
    super({
      store: stores.feeds,
      pageName: 'feed'
    });
  }

  /*...*/
}
```

As you can see, the `FeedPage` class which extends our `BasePage` class defines
the generic `Store` type parameter of our `BasePage` (the type of the `PageNodeStore`
associated with `FeedPage`) to be `stores.FeedStore`.

In its constructor, `FeedPage` sets the value of the `store` property of `BasePage`'s `opts` parameter
to `stores.feeds` and the value of its `pageName` property to `'feed'`.

### Defining Page Nodes

It is important to realize that all state is stored in the GUI of the tested application and not within a `Page` class.
Therefore, a `Page` itself is always stateless and only provides an API to manipulate or retrieve the state of the
tested application (via its PageNodes).

It is very important that you use always use getter functions to define the PageNodes within a Page.

To quote webdiverio's docs, getter functions "get evaluated when you actually access the property and not when you
generate the object. With that you always request the element before you do an action on it."

If we did not use getter functions to define our PageNodes, the values of the PageNodes would be evaluated at the time
the javascript file is parsed. However, at this time, the website containing the HTML elements that the PageNodes
refer to is usually not yet loaded which means that no elements matching the XPath selector of the PageNodes would
be found in the DOM and that all of our testcases would fail.



constructor: define store,

page nodes as getters - and why

*Please be aware that wdio-workflo only supports XPath selectors because they are more "flexible" than CSS selectors
(eg. they support searching for a parent element) and because the performance differences are negligible in most cases.
Wdio-workflo also features an [XPath builder](./xpathBuilder.md) that you can use as an alternative to writing "raw"
XPath selector strings so that you do not need to remember all details of the XPath syntax which can be quite complex
in some scenarios. In addition, the XPath builder helps to make XPath expression more readable.*

### Implementing "LifeCycle" Methods

`Page` requires you to implement the methods `isOpen` and `isClosed` to check if a page is currently open or closed.
Furthermore, `Page` also provides a `wait` and a `eventually` API to wait for the page to be open/closed or to check
if the page is eventually open/closed within a specific timeout.

implementation of isOpen and isClosed

no implicit waiting - happens
on page node level

therefore no currently API, but
wait and eventually

types in class constructor

## Base Page Class

pageName in url

container and heading

isOPen and isClosed

page fragments