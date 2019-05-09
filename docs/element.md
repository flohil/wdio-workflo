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
of `PageElement` in more detail!

The `PageElement` class requires you to define one type parameter, the type of its associated `PageNodeStore`, which can be used to create other page nodes:

![The Store type parameter of PageElement](assets/page_element_type_parameters.png)

The constructor of `PageElement` requires two parameters:

- The XPath selector used to located the mapped HTML element on the website
- The `opts` parameter containing properties to configure the `PageElement`

![Constructor of PageElement](assets/page_element_constructor.png)

The most important properties of the `opts` parameter are:

- `store` => The `PageNodeStore` instance associated with the `PageElement`.
- `timeout` => The element's default timeout for all functions of the [`eventually` and `wait` APIs](#explicit-waiting-currently-wait-and-eventually).
- `interval` => The element's default interval for all functions of the [`eventually` and `wait` APIs](#explicit-waiting-currently-wait-and-eventually).
- `waitType` => The waiting type used for the [initial waiting condition](#implicit-waiting) of the `PageElement`.

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
on top of WebdriverIO's [browser.element](http://v4.webdriver.io/api/protocol/element.html) function. The `browser.element` function takes an XPath selector and fetches the first HTML
element matching this selector from the website:

```typescript
browser.element('//div');
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

Most of the time you don't need to access the WebdriverIO element wrapped by the
`PageElement` class from outside the class. In some rare cases, however,
you might need to interact with the WebdriverIO element directly.

One situation that requires you to interact with the WebdriverIO element directly
is if your web application has a context menu that can only be opened by performing a
right click. Wdio-workflo's `PageElement` provides no method to perform a right click
but a WebdriverIO element does:

```typescript
import { stores } from '?/page_objects';

const contentMenuZone = store.pageNode.Element('//div');

// `PageElement.element` triggers an implicit wait and returns the wrapped
// WebdriverIO element which provides a `rightClick` command.
contentMenuZone.element.rightClick();
```

If you want to access the underlying WebdriverIO element of a `PageElement` without
triggering an implicit wait, you can use the `element` accessor of the `currently`
API instead:

```typescript
import { stores } from '?/page_objects';

const contentMenuZone = store.pageNode.Element('//div');

// `PageElement.currently.element` does not trigger an implicit wait.
contentMenuZone.currently.element.rightClick();
```

*To learn more about the waiting mechanisms of `PageElement` read the following
section of this guide.*

## State Function Types

The `PageElement` class offers plenty of methods to read or modify the state of
its mapped/wrapped HTML element. These methods can be divided into three categories:

- State Retrieval Functions
- Action Functions
- State Check Functions

The following sections of this guide describe each of these function categories
in full detail.

### State Retrieval Functions

#### Overview

State retrieval functions retrieve the value of a specific attribute of the HTML
element wrapped by `PageElement`. They are available either directly within the
scope of the `PageElement` class or via the `currently` API. If invoked directly
on the `PageElement` class, state retrieval functions trigger an
[implicit wait](#implicit-waiting) before returning an attribute value, whereas
calling a state retrieval function via the `currently` API does not trigger
an implicit wait and returns the attribute value immediatly.

#### Types of State Retrieval Functions

State retrieval functions always start with the term `get`, followed by the name
of the attribute whose value should be retrieved. However, not all methods of
`PageElement` which start with the term `get` are state retrieval functions -
methods that do not interact with the mapped HTML element (e.g. `getSelector()`,
`getTimeout()` or `getTimeout()`) aren't state retrieval functions and therefore
do not trigger the implicit waiting mechanism of `PageElement`.

State retrieval functions exist for the following HTML attributes:

- `Text` => All text content of an HTML element
(also includes text of nested HTML elements).
- `DirectText` => Text content that is a direct child of an HTML element
(no nested HTML elements).
- `HTML` => All HTML content of an HTML element.
- `Class` => An HTML element's CSS classnames as a single string.
- `Id` => The ID attribute of an HTML element.
- `Name` => The name attribute of an HTML element.
- `Location` => The coordinates of an HTML element in pixels (left top corner).
- `X` => The X coordinate of an HTML element (left top corner).
- `Y` => The Y coordinate of an HTML element (left top corner).
- `Size` => The size of an HTML element in pixels.
- `Width` => The width of an HTML element in pixels.
- `Height` => The height of an HTML element in pixels.
- `Value` => The value of an element like input, checkbox...
(only available in `ValuePageElement` class).

#### Usage Examples

```typescript
import { stores } from '?/page_objects';

const element = stores.pageNode.Element('//div');
const input = stores.pageNode.Input('//input'); // Input implements ValuePageElement

// Retrieves the text of the element after performing an implicit wait.
const text = element.getText();

// Retrieves the text of the element immediatly, without performing an implicit wait.
const currentText = element.currently.getText();

// Retrieves the text of the input after performing an implicit wait.
const value = input.getValue();

// Retrieves the value of the element immediatly, without performing an implicit wait.
const currentValue = input.currently.getValue();
```

### Action Functions

#### Overview

Action functions change the state of tested web application by interacting
with the mapped HTML element of a `PageElement` - they could also be called
state modification functions. Action functions are only available directly within
the scope of `PageElement` and do not exist within its `currently`, `wait` or
`eventually` APIs. Action functions always trigger an
[implicit wait](#implicit-waiting) before interacting with the mapped HTML element.

#### Types of State Check Functions

Wdio-workflo ships with three action functions:

- `click()` => Clicks on a mapped HTML element.
- `scrollTo()` => Scrolls a mapped HTML element into view.
- `setValue()` => Sets the value of an HTML element like input, dropdown, checkbox...
(only available for `ValuePageElement` classes).

// please read documentation of click() function for full description of all click options

-> postcondition, customScroll:

By defining customScroll, PageElement's default custom scrolling behavior can be overwritten.

-> timeout, interval -> used to check postCondition

elem.click({
  postCondition: () => dialogs.confirm.currently.not.isVisible(),
});

`click`

scrollTo

elem.scrollTo({
  directions: {
    x: true,
    y: true,
  },
});

setValue

checkbox.setValue(true)

input.setValue('wdio')

#### Usage Examples

### State Check Functions

#### Overview

State check functions allow you to check wether a specific attribute of the HTML element
mapped by a `PageElement` has an expected value. Each state check function is available
under the same name in the `currently`, `wait` and `eventually` APIs. In the case of the
`currently` API, the check occurs only once whereas the `wait` and `eventually` APIs
regularly perform the check until it either returns true or until a predefined timeout
is reached.

#### Types of State Check Functions

Most state check functions exist in three variants (where XXX is the name of the checked attribute):

- `hasXXX(expectedValue)` to check if the attribute value equals an expected value.
- `containsXXX(expectedValue)` to check if the attribute value contains an expected value.
- `hasAnyXXX()` to check if the attribute has any value at all (is not empty).

The HTML attributes supported by these three variants of state check functions are the
same attributes which are also available for state retrieval functions:

- `Text` => All text content of an HTML element (also includes text of nested HTML elements).
- `DirectText` => Text content that is a direct child of an HTML element (no nested HTML elements).
- `HTML` => All HTML content of an HTML element.
- `Class` => An HTML element's CSS classnames as a single string.
- `Id` => The ID attribute of an HTML element.
- `Name` => The name attribute of an HTML element.
- `Location` => The coordinates of an HTML element in pixels (left top corner).
- `X` => The X coordinate of an HTML element (left top corner).
- `Y` => The Y coordinate of an HTML element (left top corner).
- `Size` => The size of an HTML element in pixels.
- `Width` => The width of an HTML element in pixels.
- `Height` => The height of an HTML element in pixels.
- `Value` => The value of an element like input, checkbox... (only available in `ValuePageElement` class).

Futhermore, there are three special state check functions to check if any arbitrary
HTML attribute has an expected value:

- `hasAttribute({name: 'attrName', value: 'expectedValue'})` to check if the value
of an an attribute with a specific name matches an expected value.
- `containsAttribute({name: 'attrName', value: 'expectedContainedValue'})` to check
if the value of an attribute with a specific name contains an expected value.
- `hasAnyAttribute('attrName')` to check if an attribute with a specific name has
any value (is not empty/undefined).

Besides, there are five state check functions that don't exist in three but only
in one single variant:

- `exists` to check if an HTML element exists in the DOM.
- `isVisible` to check if the HTML element is visible
(not obscured by another element or hidden by CSS styles).
- `isEnabled` to check if the HTML element is enabled
(can be interacted with - not disabled).
- `isSelected` to check if an `<option>` HTML element is the selected option of a
`<select>` element.
- `isChecked` to check if an HTML `<input>` element has a `checked` HTML attribute set.

#### Usage Examples

Here are some code examples of state check functions for the `currently`, `wait`
and `eventually` APIs:

```typescript
import { stores } from '?/page_objects';

const element = stores.pageNode.Element('//div');
const input = stores.pageNode.Input('//input'); // Input implements ValuePageElement

// Checks if the element currently exists in the DOM.
element.currently.exists();

// Waits until the element is visible.
// Throws an error if element does not become visible within predefined timeout.
element.wait.isVisible();

// Checks if the element eventually has the text 'wdio'.
element.eventually.hasText('wdio');

// Checks if the element eventually has the value 'wdio'.
input.eventually.hasValue('wdio');

// Waits for the CSS class string of the element to contain 'active'.
// Throws an error if condition is not met within a predefined timeout.
element.wait.containsClass('active');

// Checks if the element currently has the `readonly` HTML attribute set.
element.currently.hasAnyAttribute('readonly');

// Checks if the element's `role` attribute eventually equals 'activeOption'.
element.eventually.hasAnyAttribute({name: 'role', value: 'activeOption'});
```

#### `not` Modifier

Each state check function is also available in a negated version that checks
for the opposite of an expected value. To use a state check function's negated
version, you need to prepend the state check function with the `.not` modifier:

```typescript
import { stores } from '?/page_objects';

const element = stores.pageNode.Element('//div');
const input = stores.pageNode.Input('//input'); // Input implements ValuePageElement

// Checks if the element does currently not exist in the DOM.
element.currently.not.exists();

// Waits until the element is not/no longer visible.
element.wait.not.isVisible();

// Checks if the element eventually doesn't contain/no longer contains the text 'wdio'.
element.eventually.not.containsText('wdio');

// Checks if the element eventually doesn't contain/no longer contains the value 'wdio'.
input.eventually.not.containsValue('wdio');
```

It is important to always use the `not` modifier instead of putting the
`!` negation operator before your state check functions because these two approaches
are not the same:

The `!` operator executes your state check function as is and then negates its result,
whereas the `not` modifier executes the negated version of your state check function.

To better understand the difference between using the `not` modifier and the `!` negation
operator, take a look at the following code examples for the `wait` and `eventually` APIs:

*If you don't understand these code examples, consider reading the
[Explicit Waiting: `currently`, `wait` and `eventually` section](#explicit-waiting-currently-wait-and-eventually)
of this guide first!*

```typescript
import { stores } from '?/page_objects';

const element = stores.pageNode.Element(xpath('//div'));

// This will wait for the text to become 'wdio-workflo' and throw an error if
// the text stays anything other than 'wdio-workflo' until a timeout is reached.
// If the text does become 'wdio-workflo', the return value of the function
// (the element instance) will be negated which results in the value `false`.
const r1 = !element.wait.hasText('wdio-workflo')

// This will wait for the text to become anything other than 'wdio-workflo' and
// throw an error if it stays 'wdio-workflo' until a timeout is reached.
// The function returns the element itself (an instance of the PageElement class).
const r2 = element.wait.not.hasText('wdio-workflo')

// The following statements are all true because r1 !== r2.
r1 === false
r2 !== false
(r1 instanceof PageElement) !== true
(r2 instanceof PageElement) === true

// This will work, because r2 is an instance of the PageElement class.
r2.click()

// This will not work, because the function 'click' does not exist on `false`.
r1.click()
```

```typescript
import { stores } from '?/page_objects';

const element = stores.pageNode.Element(xpath('//div'));

// Let's assume that the initial text of the element is 'wdio-workflo'!

// The `hasText` function would immediately return `true`, but the return value
// would then be negated by the `!` operator, resulting in the value `false`.
!element.eventually.hasText('wdio-workflo', {timeout: 5000})

// The `hasText` function would wait for 5 seconds for the text to become
// 'wdio-workflo' and then return the value `false` if it did not.
element.eventually.not.hasText('wdio-workflo', {timeout: 5000})

// Now let's assume that after 2 seconds, the text of the element changes to
// something other than 'wdio-workflo'.

// Since `hasText` would immediately return `true` in this example and then
// negate the return value, the result of this statement would be `false`.
const r1 = !element.eventually.hasText('wdio-workflo', {timeout: 5000})

// This statement would wait for 2 seconds until the text changes to something
// other than 'wdio-workflo'. Then it would return `true`!!!
const r2 = element.eventually.not.hasText('wdio-workflo', {timeout: 5000})

// The following statements are all true because r1 !== r2.
r1 === false
r2 === true
```

## Waiting Mechanisms

### Implicit Waiting

#### What is Implicit Waiting and how does it work?

When you open a website in your browser, the website and its components are usually
not available immediately. A request to load the code of the website needs to be processed
by a webserver, the server's response needs to be transferred to your browser and your browser
needs to render the contents of the website before it can be displayed. Depending on the speed
of your internet connection, the size of the website and the computational power of the webserver
and your computer, it might take some time before you can read the contents of a website and
interact with them.

In the age of Web 2.0, asynchronous loading of website content and single page
applications further intensify this problem.

Our tests need to take these waiting times into account, otherwise we would
get a lot of errors because elements could not be located on the website since
the website has not been fully loaded yet.

To reduce the number of explicit waiting statements in your test code,
the `PageElement` class implements an implicit waiting mechanism:
Whenever you call a method that reads the state of an HTML element mapped by `PageElement`
(e.g. `getText()`) or interacts with it (e.g. `click()`), wdio-workflo automatically
waits for an initial waiting condition to be fulfilled before executing the corresponding
command.

The four different kinds of initial waiting conditions are defined by the
`Workflo.WaitType` enum and can be set via the `waitType` property of the
page element's `opts` parameter:

- `exist` waits until the element exists on the website
- `visible` waits until the element is visible on the website
(default value; not obscured by another element or hidden via CSS styles)
- `text` waits until the element has any text content
- `value` waits until the element has any value (only for `ValuePageElement` classes)

Most [factory methods](store.md#factory-methods) of a `PageNodeStore` allow you to define
the value of `waitType` as property of their publicly configurable `opts` parameter:

```typescript
import { stores } from '?/page_objects';

const hiddenContainer = stores.pageNode.Element('//div', {
  waitType: Workflo.WaitType.exist
});
```

#### What triggers the implicit waiting mechanism?

The implicit waiting mechanism is only supported by the `PageElement` class itself
and any class that is derived from `PageElement`. Functions that trigger implicit
waiting can be divided into two categories:

- State retrieval functions => These functions read the state of the web application
by retrieving information about the attributes of an HTML element, e.g. `getText()`.
- Action functions => These functions change the state of the web application by interacting
with HTML elements, e.g. `click()`.

Please be aware that the implicit waiting mechanism only works for functions defined
directly on the `PageElement` class and is not applied within the `currently`,
`wait` and `eventually` APIs of a `PageElement`. This means that `PageElement.getText()`
triggers implicit waiting, but `PageElement.currently.getText()` does not.

Besides state retrieval and action functions, the `element` accessor of the `PageElement`
class also performs an implicit wait before returning the WebdriverIO element wrapped
by the `PageElement` class.

Other page node classes like `PageElementList`, `PageElementMap` and `PageElementGroup`
do not have an implicit waiting mechanism of their own. However, these three classes all
manage instances of the `PageElement` class and whenever you invoke a state retrieval or an
action function on a managed `PageElement` instance, its implicit waiting mechanism will be triggered.

### Explicit Waiting: `currently`, `wait` and `eventually`

In addition to its implicit waiting mechanism, each page node class ships with
a `wait` API that offers you the ability to explicitly control when your tests should wait for an HTML element to reach a certain state.

Furthermore, page nodes also have a `currently` API to read or check the current state of a mapped HTML element without performing an implicit wait, and an `eventually` API that lets you check if an HTML element reaches a certain state within a specific timeout.


#### The `currently` API

The `currently` API bypasses the implicit wait usually performed when invoking
state retrieval methods of a page node class (e.g. `PageElement.getText()`).

Let's take a look at the following code example to better understand the difference between invoking a state retrieval function directly on the `PageElement` class and invoking a state retrieval function on the `currently` API of the `PageElement`:

```typescript
import { stores } from '?/page_objects';

const element = stores.pageNode.Element('//div');

// implicitly waits for the element to be visible and then returns its text
console.log( element.getText() )

// immediately returns the element's text without waiting for it to be visible
console.log( element.currently.getText() )
```

To spare you the need of first reading the current state of an HTML element and then comparing it to an expected value in a second step, wdio-workflo's state check functions let you check directly if the state of an HTML element matches an expected state.

Let's examine the three variants (`hasXXX`, `containsXXX`, `hasAnyXXX`) of `currently` state check functions by the example of an HTML element's "text" attribute:

```typescript
import { stores } from '?/page_objects';

const element = stores.pageNode.Element(
  xpath('//div').text('wdio-workflo')
);

// returns true because the actual text equals 'wdio-workflo'
element.currently.hasText('wdio-workflo')

// returns true because the actual text contains the substring 'workflo'
element.currently.containsText('workflo')

// returns true because the element has any text (it is not blank/empty)
element.currently.hasAnyText()
```

The `currently` API also offers functions to check if the state of an HTML element
does NOT match an expected state. These negated state check functions are
available via the `not` accessor of the `currently` API:

```typescript
import { stores } from '?/page_objects';

const element = stores.pageNode.Element(
  xpath('//div').text('wdio-workflo')
);

// returns true because the actual text does not equal 'icebears'
element.currently.not.hasText('icebears')

// returns true because the actual text does not contain the substring 'icebears'
element.currently.not.containsText('icebears')

// returns false because the element has the text 'wdio-workflo'
element.currently.not.hasAnyText()
```

*Please note that interaction methods of a `PageElement` like `click()` and `scrollTo()` always perform an implicit wait because interacting with elements that have not been rendered yet doesn't make much sense. Therefore, the `currently` API does not contain interaction methods like `click()`.*

#### The `wait` API

untilElement function beschreiben,

last parameter -> opts: allow you to set timeout and interval

The `wait` API contains a set of state check functions that wait for an HTML
element to reach a certain state within a specific timeout.

If the HTML element does not reach the expected state within the specified timeout, an error will be thrown. Otherwise, the `PageElement` instance
will be returned by each function defined on the `wait` API, so you can easily
chain additional `PageElement` method calls:

```typescript
import { stores } from '?/page_objects';

const element = stores.pageNode.Element('//div');

element.wait.hasText('wdio-workflo', {timeout: 3000}).click()
```

If you do not explicitly specify a timeout value when calling a state check function on `wait`, the default timeout of the `PageElement` will be used:

```typescript
import { stores } from '?/page_objects';

const element = stores.pageNode.Element('//div');

// uses this._timeout as timeout value
element.wait.hasText('wdio-workflo')
```

The default timeout value for a specific instance of a `PageElement` can be set by defining the `timeout` property of the publicly configurable `opts` parameter
of a [factory method](store.md#factory-methods) in milliseconds:

```typescript
import { stores } from '?/page_objects';

const element = stores.pageNode.Element('//div', {
  timeout: 10000 // 10 seconds
});
```

Alternatively, you can also define the global default timeout value that will be
used as a fallback value for all page nodes in `workflo.conf.ts`:

```typescript
export const workfloConfig: IWorkfloConfig = {
  /*...*/
  timeouts: {
    default: 6000
  }
  /*...*/
};
```

The `wait` API also offers functions to wait for the state of an HTML element to NOT or no longer match an expected state. These negated state check functions are
available via the `not` accessor of the `wait` API:

```typescript
import { stores } from '?/page_objects';

const element = stores.pageNode.Element('//div');

// waits until the text of the element not or no longer is 'wdio-workflo'
element.wait.not.hasText('wdio-workflo')
```

#### The `eventually` API

meetsCondition function

last parameter -> opts: allow you to set timeout and interval


The `eventually` API is almost identical to the `wait` API: It also waits for an
HTML element to each a certain state within a specific timeout. However, the
state check functions defined on the `eventually` API will return `true` if the
expected state is reached within the specified timeout and `false` if it is not:

```typescript
import { stores } from '?/page_objects';

const element = stores.pageNode.Element(
  xpath('//div').text('wdio-workflo')
);

// will probably return false since the website has not finished rendering yet
element.eventually.hasText('wdio-workflo', {timeout: 1})

// will return true if the website finishes loading within 20 seconds
element.eventually.hasText('wdio-workflo', {timeout: 20000})
```

The `eventually` API does not throw an error if the HTML element fails to reach the expected state within the specified (or default) timeout.

Like the `currently` and the `wait` API, the `eventually` API too offers a
`not` accessor to invoke negated variants of its state check function.
These functions check if the state of an HTML does not match/stops to match an expected state within a specific timeout:

```typescript
import { stores } from '?/page_objects';

const element = stores.pageNode.Element(
  xpath('//div').text('wdio-workflo')
);

element.eventually.not.hasText('icebears')
```

## The `ValuePageElement` Class

Some components of a website like inputs, checkboxes, radio buttons, dropdowns, textareas
or toggles/switches manage a value that can be modified by users.

Wdio-workflo's `PageElement` class has no way of getting, setting or checking the
value of such components. In this event, you need to make use of wdio-workflo's
`ValuePageElement` class. `ValuePageElement` is an abstract class that inherits
all functionality of the `PageElement` class and in addition provides two abstract methods, `getValue` and `setValue`, to manage the value of components like input or checkbox.
Futhermore, the `ValuePageElement` class includes the state check functions `hasValue`, `containsValue` and `hasAnyValue` it its `currently`, `wait` and `eventually` APIs.

Wdio-workflo's example repository contains an `Input` class that is derived from
`ValuePageElement` and implements its `getValue` and `setValue` methods.
Below you can find code examples for how to use the `getValue` and `setValue` methods
as well as the  `hasValue`, `containsValue` and `hasAnyValue` state check functions
of the `Input` class:

```typescript
import { stores } from '?/page_objects';

const input = stores.pageNode.Input(xpath('//input'));

// returns the value after performing an implicit wait
input.getValue()

// returns the value immediately, without performing an implicit wait
input.currently.getValue()

// sets the value of the input to 'wdio-workflo' after performing an implicit wait
input.setValue('wdio-workflo')

// checks if the input currently/at this very moment has the value 'wdio-workflo'
input.currently.hasValue('wdio-workflo');

// waits for the value of the input not to contain the string 'icebears'
input.wait.not.containsValue('icebears');

// checks if the input eventually has any value within 3000 milliseconds
input.eventually.hasAnyValue({timeout: 3000})
```

Since the implementation of components like dropdowns or checkboxes can
vary greatly between the different available component libraries for React,
Angular and the like, wdio-workflo does not ship with a standard implementation
for `getValue` and `setValue`. Instead, you need to create your own, custom page
element classes that inherit from `ValuePageElement` and implement its `getValue`
and `setValue` methods.

You can read more about how to do this in the [Extending `ValuePageElement`](customElement.md#extending-valuepageelement)
section of the [Customizing an Element](customElement.md) guide.