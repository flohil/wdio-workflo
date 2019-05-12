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

### Filter Masks

## Waiting Mechanisms

### Implicit Waiting

### Explicit Waiting: `currently`, `wait` and `eventually`

## The `ValuePageElementMap` Class
