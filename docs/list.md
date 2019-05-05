---
id: list
title: List
sidebar_label: List
---

*This guide provides a detailed explanation of wdio-workflo's `PageElementList` and
`ValuePageElementList` classes. However, it does not show you how to customize these
classes. If you want to learn how to create your own, customized list classes
by extending wdio-workflo's `PageElementList` or `ValuePageElementList` class, read the
[Customizing a List](customList.md) guide.*

## Overview and Objective

Wdio-workflo's `PageElementList` manages a dynamic collection of `PageElement` instances
or of instances of a class derived from the `PageElement` class. Dynamic means
that the contents of the collection/the individual page elements managed by the
collection are not known at compile time and can change during runtime.

Some typical website components that should be mapped by a `PageElementList`
are a the items of a news feed and the rows of a data table, because news feed items
and the rows displayed in a data table are usually not known at
the time of test creation and can change during the runtime of your web application.

`PageElementList` provides several ways to access certain list elements, retrieve
all elements managed by the list and create sublists. It even ships with a
`where` builder that lets you query list elements by modifying their XPath selectors.

Moreover, `PageElementList` features a `currently` and an `eventually` API to
check if some, none or all of the list's elements currently/eventually have
a certain state, and a `wait` API to wait for some, none or all of the list's
elements to reach a certain state.

And finally, of course, the `PageElementList` class provides methods to read
the number of elements managed by the list and to check if the list is empty or if
the number of list elements is equal, smaller or bigger than an expected value.

## Creating a `PageElementList`

Instead of manually invoking the constructor of `PageElementList` using the `new` keyword,
you should always call the `ElementList()` factory method of the [PageNodeStore](store.md)
class to create an instance of the `PageElementList` class:

```typescript
import { stores } from '?/page_objects';

const linkList = store.pageNode.ElementList('//a');
```

However, for the sake of completeness, let's examine the type parameters and constructor
of `PageElementList` in more detail!

The `PageElementList` class has three type parameters:

- The type of the `PageNodeStore` associated with the list to create other page nodes.
- The class type of the page elements managed by the list.
- The type of the `opts` parameter of a single page element managed by the list.

```typescript
export class PageElementList<
  Store extends PageNodeStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
> extends PageNode<Store>
```

The constructor of `PageElementList` requires two parameters:

- The XPath selector that locates all of the list's page elements on a website.
- The `opts` parameter containing properties to configure the `PageElementList`

```typescript
constructor(
  selector: string,
  opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>,
) { /*...*/ }
```

The most important properties of the `opts` parameter are:

- `store` => The `PageNodeStore` instance associated with the `PageElementList`.
- `timeout` => The list's default timeout for all functions of the [`eventually` and `wait` APIs](#explicit-waiting-currently-wait-and-eventually).
- `interval` => The list's default interval for all functions of the [`eventually` and `wait` APIs](#explicit-waiting-currently-wait-and-eventually).
- `waitType` => The waiting type used for the [initial waiting condition](#implicit-waiting) of the `PageElementList`.
- `elementStoreFunc` => The factory method used to create a single list element.
- `elementOpts` => The `opts` parameter passed to `elementStoreFunc` to create a list element.

## Accessing List Elements

### `first`, `at` and `all`

#### `first`

The `first` accessor retrieves the first page element managed by a `PageElementList`:

```typescript
import { stores } from '?/page_objects';

const linkList = store.pageNode.ElementList('//a');

linkList.first.click();
```

#### `at`

The `at` method retrieves a page element managed by a `PageElementList` at a
specific position. It takes one parameter, the index of the retrieved page element
(starting at 0):

```typescript
import { stores } from '?/page_objects';

const linkList = store.pageNode.ElementList('//a');

linkList.at(2).click();
```

#### `all`

The `all` accessor retrieves all page elements managed by a `PageElementList` as
an array. The order of the array elements corresponds to the order in which
the corresponding HTML elements were located on the website:

```typescript
import { stores } from '?/page_objects';

const linkList = store.pageNode.ElementList('//a');

linkList.all.forEach(
  link => link.click()
);
```

### `where` Builder

The `where` class member of `PageElementList` let's you access a slightly modified
version of wdio-workflo's [XPath builder](xpathBuilder.md) which allows you to query
for certain list elements by modifying their XPath selector.

In contrast to the original `xpath` builder, you do not need to pass an initial
XPath expression to the `where` builder. Instead, the `where` builder always
starts out with list's XPath selector (which locates all elements managed by a list)
and then uses the builder functions of the `xpath` builder to expand the list's
XPath selector and further restrict the subset of matched elements.

To learn more about available builder functions and how to apply them,
please read the [XPath builder guide](xpathBuilder.md).

Once you're finished modifying the XPath expression using builder functions,
the `where` builder offers 4 methods to retrieve the page elements matched by
the modified XPath selector:

- `getFirst()` returns the first matched page element.
- `getAt(index)` returns the n-th matched page element (index n starts at 0).
- `getAll()` returns an array of all matched page elements.
- `getList()` returns a new `PageElementList` whose XPath selector is set to the result of the `where` builder.

Below you can find some code examples demonstrating the usage of a list's `where` builder:

```typescript
import { stores } from '?/page_objects';

const linkList = store.pageNode.ElementList('//a');

// Fetch the first element from linkList whose text equals 'Feed Page'.
// Resulting XPath: //a[.="Feed Page"]
const feedPageLink = linkList.where.text('Feed Page').getFirst();

// Fetch all elements from linkList whose class HTML attribute contains 'active'.
// Resulting XPath: //a[contains(@class, "active")]
const firstActiveLink = linkList.where.classContains('active').getAll();

// Fetch the third list element whose 'role' HTML attribute equals 'navigation'.
// Resulting XPath: (//a[@role, "navigation")])[3] => XPath index starts at 1
const thirdNavigationLink = linkList.where.attribute('role', 'navigation').at(2);

// Create a sublist with all elements of linkList that are disabled.
// The sublist will be of the same class type as the original list.
// Resulting XPath: //a[@disabled]
const disabledLinkList = linkList.where.disabled().getList();
```

### `identify` Method

can also pass `identifier` in `opts` parameter - will be overwritten by identifier
passed explicitly to identify func

Compared to the `identify` method described in the next section of this guide,
the `where` builder operates a lot faster because it does not need to retrieve
all elements of a list from the website and then filter through the retrieved
elements. Instead, the direct modification of the XPath selector using a list's
`where` builder allows us to only fetch those elements from the website that
match the modified XPath expression.

Performance-wise, the `where` builder is a very fast method to select certain
elements of a list, because it does not need to retrieve all list element from
a website before filtering them. Instead, the modification of the XPath selector
allows us to apply filters to the XPath itself and only fetch those elements
from the website which match are filter.


### The Underlying WebdriverIO Elements

elements -> wrapper for browser.elements

## State Retrieval and State Check Functions

### Reading the List Length

getLength,

hasLength (with comparators) and is empty with currently, wait, eventually

getText etc of all elements - with filtermask

### Implicit Waiting

one of the elements in the list

### Explicit Waiting: `currently`, `wait` and `eventually`

exists, isVisible, isEnabled
hasValue
other statate check funcs -> hasText take single value or array -> true
if all match - filtermask???

currently, wait, eventually -> link to page element guide

not

any and none

## ValuePageElementList

If you want a list to manage page elements that are derived from the
`ValuePageElement` class, you need to use a `ValuePageElementList` instead
of a `PageElementList`.

The `ValuePageElementList` class adds the methods `getValue` and `setValue`
to set and retrieve the values of all page elements managed by the list. Furthermore,
its `currently`, `wait` and `eventually` APIs include the state check functions
`hasValue`, `containsValue` and `hasAnyValue` to wait for or check if all list
elements have certain expected values.

Wdio-workflo's example repository contains an `Input` class that is derived from
`ValuePageElement`. To create a `ValuePageElementList` that manages instances
of the `Input` class, the `PageNodeStore` of the example repository provides
an `InputList()` [factory method](store.md#factory-methods).
Below you can find code examples for how to use the `getValue` and `setValue` methods
as well as the  `hasValue`, `containsValue` and `hasAnyValue` state check functions
of our `ValuePageElementList` managing instances of `Input`:

```typescript
const inputList = stores.pageNode.InputList(xpath('//input'));

// Returns the values of all input elements managed by the list as an array
// after an implicit wait (e.g. waiting for at least one element to be visible).
const values: string[] = inputList.getValue();

// Returns the values of all input elements managed by the list as an array
// withing performing an implicit wait.
const currentValues: string[] = inputList.currently.getValue();

// Performs an implicit wait and then sets the values of all input elements
// to 'wdio-workflo'.
inputList.setValue('wdio-workflo');

// Performs an implicit wait and then sets the first input's value to 'workflo',
// the second input's value to 'webdriverio' and the third input's value to 'cool'.
// In order for this to work, the number of elements managed by the list must
// equal the number of values passed as an array to `setValue`.
inputList.setValue(['workflo', 'webdriverio', 'cool']);

// Checks if all inputs of the list currently have the value 'wdio-workflo'.
inputList.currently.hasValue('wdio-workflo');

// Waits for the value of first input in the list not to contain 'icebears',
// and for the value of the second input not to contain 'workflo'
// within half a second. This only works if the number of elements managed by
// the list equals the number of values passed as an array to `containsValue`.
inputList.wait.not.containsValue(['icebears', 'workflo'], { timeout: 500 });

// Checks if all input elements of our list eventually have any value
// (are not empty) within the default timeout of our list class.
inputList.eventually.hasAnyValue();

// For a list that manages two input elements, checks if the first input
// element eventually has any value. The second input is ignored because
// it is set to `false` in the list's `filterMask`. Therefore, this would
// return `true` even if the second input never had any value.
inputList.eventually.hasAnyValue({ filterMask: [true, false] });
```

Unlike the `ValuePageElement` class, `ValuePageElementList` is not an abstract
class. The `getValue` and `setValue` methods of the `ValuePageElementList`
are already implemented and internally invoke the `getValue` and `setValue` methods
of the `ValuePageElement` instances managed by the list. Therefore, we can simply use `ValuePageElementList` directly and don't need to create a custom list class just
for the sake of implementing `getValue` and `setValue`.

We should, however, add a new factory method to our `PageNodeStore` that returns
an instance of a `ValuePageElementList` whose types (or rather the types of its
list elements) are already configured. Like in the above code example, where the
`InputList()` factory method returns a `ValuePageElementList` that is configured
to manage instances of the `Input` class.

To learn how to create a factory method that returns a configured `ValuePageElementList`,
please read the [Adding a list factory method for a custom `ValuePageElement`](customElement.md#adding-a-list-factory-method-for-a-custom-valuepageelement)
section of the [Customizing a List](customList.md) guide.
