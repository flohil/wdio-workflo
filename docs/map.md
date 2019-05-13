---
id: map
title: Map
sidebar_label: Map
---

*This guide provides a detailed explanation of wdio-workflo's `PageElementMap` and
`ValuePageElementMap` classes. However, it does not show you how to customize these
classes. If you want to learn how to create your own, customized map classes
by extending wdio-workflo's `PageElementMap` or `ValuePageElementMap` class, read the
[Customizing a Map](customMap.md) guide.*

## Overview and Objective

Wdio-workflo's `PageElementMap` manages a static collection of `PageElement` instances
or of instances of a class derived from the `PageElement` class. Static means
that the contents of the collection/the individual page elements managed by the
collection are already known at compile time and do not change during runtime.

Some typical website components that should be mapped by a `PageElementMap`
are a the links in a navigation menu, because they are usually known at the time
of test creation and do not change during the runtime of your web application.

All `PageElement` instances managed by a `PageElementMap` share a common
base XPath selector, for example, they could all be HTML link `<a>` elements
located by the XPath selector `//a[@role="navigationLink"]`. Although the
page elements all share the same base XPath selector, each of them can be
accessed via a unique key. In order for this to work, all page elements of
a map need to have unique values for a certain HTML attribute.
The `PageElementMap` class maps its managed `PageElement` instances to the
aforementioned unique keys based on the HTML attribute values you provided.

If this sounds very theoretical to you, there are plenty of practical examples
and explanations further down this guide. All in all, the objective of the
`PageElementMap` class is to greatly reduce the amount of code needed to define
a couple of similar `PageElement` instances.

Finally, like the `PageElement` and the `PageElementList` classes,  `PageElementMap`
also features a `currently` and an `eventually` API to check if some, none or all
of the map's elements currently/eventually have a certain state, and a `wait` API
to wait for some, none or all of the map's elements to reach a certain state.

## Creating a `PageElementMap`

### `ElementMap()` Factory Method

Instead of manually invoking the constructor of `PageElementMap` using the `new` keyword,
you should always call the `ElementMap()` factory method of the [PageNodeStore](store.md)
class to create an instance of the `PageElementMap` class:

```typescript
import { stores } from '?/page_objects';

const linkMap = stores.pageNode.ElementMap('//a', {
  identifier: {
    mappingObject: {
      demo: 'Demo Page',
      examples: 'Examples',
      api: 'API'
    },
    mappingFunc: (baseSelector, value) => xpath(baseSelector).text(value)
  }
});
```

As you can see from the example above, the `ElementMap()` factory method requires
us to pass an `identifier` property in its publicly configurable `opts` parameter.
To understand how the `identifier` property works, let us examine the type parameters
and constructor of `PageElementMap` in more detail!

### Type Parameters

The `PageElementMap` class has four type parameters:

- The type of the `PageNodeStore` associated with the map to create other page nodes.
- The unique keys used to access the page elements managed by the map.
- The class type of the page elements managed by the map.
- The type of the `opts` parameter of a single page element managed by the map.

```typescript
export class PageElementMap<
  Store extends PageNodeStore,
  K extends string,
  PageElementType extends PageElement<Store>,
  PageElementOpts extends Partial<IPageElementOpts<Store>>
> extends PageNode<Store>
```

### Constructor

The constructor of `PageElementMap` requires two parameters:

- The XPath selector that locates all of the map's page elements on a website.
- The `opts` parameter containing properties to configure the `PageElementMap`

```typescript
constructor(
  selector: string,
  opts: IPageElementMapOpts<Store, K, PageElementType, PageElementOpts>,
) { /*...*/ }
```

The most important properties of the `opts` parameter are:

- `store` => The `PageNodeStore` instance associated with the `PageElementMap`.
- `identifier` => An object containing all information required to map the page elements
of a map to a set of unique keys.
- `timeout` => The map's default timeout for all functions of the [`eventually` and `wait` APIs](#explicit-waiting-currently-wait-and-eventually).
- `interval` => The map's default interval for all functions of the [`eventually` and `wait` APIs](#explicit-waiting-currently-wait-and-eventually).
- `elementStoreFunc` => The factory method used to create a single map element.
- `elementOpts` => The `opts` parameter passed to `elementStoreFunc` to create a map element.

### `identifier` Object

The `identifier` object, which is passed to the constructor of a `PageElementMap`
as a property of the `opts` parameters object, contains all information required
to map the `PageElement` instances managed by a `PageElementMap` to a set of
unique keys. It consists of two properties: `mappingObject` and `mappingFunc`.

As already mentioned, the precondition for using a `PageElementMap` is that all
of its `PageElement` instances have a unique value for a certain HTML attribute.
Simply speaking, the task of the `mappingFunc` is to define which kind of
HTML attribute is to be used for the mapping process, whereas the `mappingObject`
defines the unique values of this HTML attribute for each `PageElement` instance
and the unique keys used to access these `PageElement` instances on the map.

During the mapping process, `PageElementMap` iterates over all key-value pairs
of the `mappingObject` and invokes `mappingFunc` for each pair, passing it
the base XPath selector that identifies all page elements of a map as first parameter
and the unique HTML attribute value of the currently iterated entry of `mappingObject`
as second parameter. `mappingFunc` now uses the base XPath selector and the unique
HTML attribute value to create an XPath expression that uniquely identifies
each of the map's `PageElement` instances. Finally, `PageElementMap` creates
a `PageElement` instance for each unique XPath expression and assigns the
created page element to the corresponding key of the `mappingObject`.

To help you better understand this mapping process, let's revisit our
`ElementMap()` factory method code example from above:

```typescript
import { stores } from '?/page_objects';

const linkMap = stores.pageNode.ElementMap('//a', {
  identifier: {
    mappingObject: {
      demo: 'Demo Page',
      examples: 'Examples',
      api: 'API'
    },
    mappingFunc: (baseSelector, value) => xpath(baseSelector).text(value)
  }
});
```

In this example, our `PageElementMap` manages three `PageElement` instances,
each wrapping an HTML link `<a>` element - hence the base XPath selector is `'//a'`.
Looking a the `mappingFunc` implementation, we can see that the HTML attribute
used to uniquely identify each of these `PageElement` instances is the `text` of
the HTML element. Therefore, the values of our `mappingObject` represent the texts
of the HTML link elements, and its keys determine the names by which we will later be
able to access each `PageElement` instance of the map.

The following section of this guide shows you how we can access the `PageElement`
instances managed by a `PageElementMap` via the keys defined in the `mappingObject`.

## Accessing Map Elements

In the previous section of this guide, I explained the mapping process of
`PageElementMap` that links each of the map's `PageElement` instances to a
unique key.

To access these `PageElement` instances, we need to use the `$` accessor of the
`PageElementMap` class. The `$` accessor returns an object whose keys are taken
from `mappingObject` and whose values are the `PageElement` instances assigned
to the respective key during the mapping process:

![The `$` accessor of `PageElementMap`](assets/map_dollar_accessor.png)

So if we wanted to click on the `api` link of our `linkMap` from the above
code example, we would write:

```typescript
linkMap.$.api.click();
```

## State Functions

### Behavior of State Functions for `PageElementMap`

muss nicht alle setzen bei setValue

### Filter Masks

The `PageElementMap` filter mask allows you to restrict the execution of a
state retrieval, action or state check function to certain managed `PageElement`
instances.

The `PageElementMap` filter mask is an object whose keys are taken from the map's
`mappingObject` and whose values are booleans. A property value of `true` means
that the function will be executed for the corresponding `PageElement`. A value of
`false` or simply not defining a property for a certain key means that the
function execution will be skipped.

The filter mask can be set via the last parameter of a state retrieval, action or
state check function. If such a function has other optional parameters, the filter
mask can be defined via the `filterMask` property of the `opts` parameter (which
is always the last function parameter). Otherwise, the filter mask itself represents
the last function parameter.

Here are some examples for how to use a `PageElementMap` filter mask:

```typescript
import { stores } from '?/page_objects';

const linkMap = stores.pageNode.ElementMap('//a', {
  identifier: {
    mappingObject: {
      demo: 'Demo Page',
      examples: 'Examples',
      api: 'API'
    },
    mappingFunc: (baseSelector, value) => xpath(baseSelector).text(value)
  }
});

// `texts` will be an object containing two properties, one with the key
// 'demo' and one with the key 'api', whose values are the text of the respective
// page elements. The text of the skipped `examples` page element is not included
// in the result object.
const texts = linkMap.getText({
  demo: true,
  api: true
});

// Only the `examples` page element will be clicked, because the `api` page element's
// filter mask value is set to `false` and the `demo` page element is not included
// in the filter mask at all.
linkMap.eachDo(
  element => element.click(), {
    examples: true,
    api: false
  }
);

// There are other optional parameters like `timeout`, therefore the filter mask
// is defined via the `filterMask` property of the `opts` parameter.
// The `hasAnyText` function will return true if within 3 seconds, the `api`
// page element and the `demo` page element have any text (are not empty).
linkMap.eventually.hasAnyText({ timeout: 3000, filterMask: {
  api: true,
  examples: false,
  demo: true
}});
```

Filter masks are not available for state check functions that require you to pass
the expected attribute values as a parameter, e.g. `hasText(texts)` or
`containsValue(values)`. In these cases, you can skip the execution of the state
check function for a certain `PageElement` instance by simply not defining
an object property for the corresponding key:

```typescript
import { stores } from '?/page_objects';

const linkMap = stores.pageNode.ElementMap('//a', {
  identifier: {
    mappingObject: {
      demo: 'Demo Page',
      examples: 'Examples',
      api: 'API'
    },
    mappingFunc: (baseSelector, value) => xpath(baseSelector).text(value)
  }
});

// The `hasDirectText` function will be invoked for the `demo` and `api` page
// elements of `linkMap` but skipped for the `examples` page element. The function
// returns `true` if the direct text (the text that resides directly/one layer below
// the HTML element) of the `demo` page element is currently 'Demo Page' and the
// direct text of the `api` page element is currently 'API'.
const result = linkMap.currently.hasDirectText({
  demo: 'Demo Page',
  api: 'API'
});
```

## Waiting Mechanisms

### Implicit Waiting

`PageElementMap` does not have an implicit waiting mechanism of its own.
However, if you invoke a state retrieval or action function on a `PageElement`
instance  managed by a `PageElementMap`, the
[implicit waiting mechanism of the `PageElement`](element#implicit-waiting) will be triggered.

The publicly configurable `opts` parameter of the `ElementMap()` factory method
provides an `elementOpts.waitType` property which allows you to define the `waitType`
of the `PageElement` instances managed by the `PageElementMap`:

```typescript
import { stores } from '?/page_objects';

const linkMap = stores.pageNode.ElementMap('//a', {
  identifier: {
    mappingObject: {
      demo: 'demoLink',
      examples: 'examplesLink',
      api: 'apiLink'
    },
    mappingFunc: (baseSelector, value) => xpath(baseSelector).id(value)
  },
  elementOpts: { waitType: Workflo.WaitType.text }
});

linkMap.eachDo(
  // The `click()` action function triggers linkElement's implicit waiting mechanism.
  // So, before each click, wdio-workflo waits for the linkElement to have any text.
  linkElement => linkElement.click()
);
```

### Explicit Waiting: `currently`, `wait` and `eventually`

#### Preface

The explicit waiting mechanisms of `PageElementMap` are very similar to the
ones used by `PageElement` and you should read about them in the
[Explicit Waiting](element.md#explicit-waiting-currently-wait-and-eventually)
section of the [`PageElement` guide](element.md) before you continue reading
this guide.

To learn how the behavior of state retrieval and state check functions of the `PageElementMap` class differs from its `PageElement` class equivalents, please
read the [State Function Types section of this guide](#state-function-types).
The types of available state retrieval and state check functions can be
found in the [State Function Types section of the `PageElement` guide](element.md#state-function-types) .

#### The `currently` API

The `currently` API of the `PageElementMap` class consists of state retrieval
functions and state check functions. It does not trigger an implicit wait on the
managed `PageElement` instances of the `PageElementMap`.

The state retrieval functions of a map's `currently` API return an object whose
keys are taken from the map's `mappingObject` and whose values represent the
current values of the retrieved HTML attribute for each page element managed the map.
The state check functions of the `currently` API check wether the page elements
managed by the `PageElementMap` currently have an expected state for a certain
HTML attribute.

By using a [filter mask](#filter-masks), you can skip the invocation of a
state retrieval or state check function for certain `PageElement` instances of
the map.

#### The `wait` API

The `wait` API of the `PageElementMap` class allows you to explicitly wait
for some or all of the list's managed `PageElement` instances to have an expected
state. It consists of state check functions only which all return an instance
of the `PageElementList`.

If you use a filtermask, the `wait` API only waits for the `PageElement` instances
included by the filter mask to reach an expected state. Otherwise, the `wait` API
waits for all managed `PageElement` instances to reach their expected state.
If one or more `PageElement` instance fail to reach their expected state within
a specific timeout, an error will be thrown.


FINISH this!!!

#### The `eventually` API




The `eventually` API of the `PageElementList` class checks if some or all of
the `PageElement` instances managed by a `PageElementList` eventually reach an
expected state within a specific timeout. It consists of state check functions only
that return `true` if all `PageElement` instances for which the state check function
was executed eventually reached the expected state within the timeout. Otherwise,
`false` will be returned.

If you use a filtermask, the `eventually` API only checks the state of `PageElement`
instances which are included by the filter mask. Otherwise, the `eventually` API
checks the state of all managed `PageElement` instances.

timeouts

available types of functions -> above




## The `ValuePageElementMap` Class

If you want a map to manage page elements that are derived from the
`ValuePageElement` class, you need to use a `ValuePageElementMap` instead
of a `PageElementMap`.

The `ValuePageElementMap` class adds the methods `getValue` and `setValue`
to set and retrieve the values of all page elements managed by the map. Furthermore,
its `currently`, `wait` and `eventually` APIs include the state check functions
`hasValue`, `containsValue` and `hasAnyValue` to wait for or check if some or all
map elements have certain expected values.

Wdio-workflo's example repository contains an `Input` class that is derived from
`ValuePageElement`. To create a `ValuePageElementMap` that manages instances
of the `Input` class, the `PageNodeStore` of the example repository provides
an `InputMap()` [factory method](store.md#factory-methods).
Below you can find code examples for how to use the `getValue` and `setValue` methods
as well as the  `hasValue`, `containsValue` and `hasAnyValue` state check functions
of our `ValuePageElementMap` managing instances of `Input`:

```typescript
const inputMap = stores.pageNode.InputMap('//input', {
  identifier: {
    mappingObject: {
      username: 'username',
      password: 'password',
      email: 'email'
    },
    mappingFunc: (baseSelector, value) => xpath(baseSelector).id(value)
  }
});

// Performs an implicit wait for each input element of the map and then returns
// the values of the map's input elements as an object whose keys are taken from
// `mappingObject`.
const values: Record<'username' | 'password' | 'email', string> =
inputMap.getValue();

// Returns the values of all input elements managed by the map an object whose
// keys are taken from `mappingObject` withing performing an implicit wait.
const currentValues: Record<'username' | 'password' | 'email', string> =
inputMap.currently.getValue();

// Performs an implicit wait for each map element and then the values of the
// `username` input to 'johnDoe', of the `password` input to 'superSecret' and
// of the `email` input to 'john@doe.com'.
inputMap.setValue({
  username: 'johnDoe',
  password: 'superSecret',
  email: 'john@doe.com'
});

// Performs an implicit wait for the `username` and the `password` input elements
// and then sets the value of the `username` input to 'johnDoe' and the value
// of the `password` input to 'superSecret'.
inputMap.setValue({
  username: 'johnDoe',
  password: 'superSecret',
});

// Checks if currently, the `username` input has the value 'johnDoe' and the
// `email` input has the value 'john@doe.com'.
inputMap.currently.hasValue({
  username: 'johnDoe',
  email: 'john@doe.com'
});

// Waits for the `username` input to have the value 'johnDoe', the `password`
// input to have the value 'superSecret' and the `email` input to have the value
// 'john@doe.com' within half a second.
inputMap.wait.not.containsValue({
  username: 'johnDoe',
  password: 'superSecret',
  email: 'john@doe.com'
}, { timeout: 500 });

// Checks if all input elements of `inputMap` eventually have any value
// (are not empty) within the default timeout of our map class.
inputMap.eventually.hasAnyValue();

// Checks if, eventually, the `username` and the `email` input have any value
// (are not empty) within the default timeout of our map class.
inputMap.eventually.hasAnyValue({ filterMask: {
  username: true,
  email: true,
}});
```

Unlike the `ValuePageElement` class, `ValuePageElementMap` is not an abstract
class. The `getValue` and `setValue` methods of the `ValuePageElementMap`
are already implemented and internally invoke the `getValue` and `setValue` methods
of the `ValuePageElement` instances managed by the map. Therefore, we can simply use `ValuePageElementMap` directly and don't need to create a custom map class just
for the sake of implementing `getValue` and `setValue`.

We should, however, add a new factory method to our `PageNodeStore` that returns
an instance of a `ValuePageElementMap` whose types (or rather the types of its
map elements) are already configured. Like in the above code example, where the
`InputMap()` factory method returns a `ValuePageElementMap` that is configured
to manage instances of the `Input` class.

To learn how to create a factory method that returns a configured `ValuePageElementMap`, please read the
[Adding a map factory method for a custom `ValuePageElement`](customMap.md#adding-a-map-factory-method-for-custom-elements)
section of the [Customizing a Map](customMap.md) guide.
