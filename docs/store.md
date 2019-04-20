---
id: store
title: Store
sidebar_label: Store
---

## Overview

### Objective

Writing tests with wdio-workflo, you should never manually create instances of a [`PageNode`](pageObjects.md#page-nodes) class.
Instead, you should fetch `PageNode` instances from a `PageNodeStore` class.

This class contains a number of factory methods which either configure and initialize
a new `PageNode` instance, or fetch an identical `PageNode` instance from the store's cache.
Page nodes are considered identical if they have the same XPath selectors, class types and `opts` parameters.

A `PageNodeStore` can be thought of as a mixture of the factory method and the facade pattern.

### Advantages

#### Less code required for `PageNode` instantiation

Each factory method allows you to define a default configuration for the retrieved `PageNode` class.
This means that you can define default values for certain properties of the page node's `opts` parameter.
If all of the `opts` parameter's properties are preconfigured, you can skip providing an `opts` parameter
when invoking the factory method altogether. This can drastically reduce the amount of code required to
instantiate a `PageNode`.

#### A central facade for all available `PageNode` classes

The `PageNodeStore` class serves as a single facade which gives you access to all `PageNode` classes
without having to import them from all over the place. This makes it very easy to explore
and use the different types of page nodes available in your test code.

Additionally, if you need to adapt the way a certain `PageNode` class is instantiated,
you only need to change it in one place which increases maintainability.

## Location and Naming Convention

Store files are located in the `src/page_objects/stores` folder of your system
test directory. I usually like to name store classes so that they end with the
term `Store`, but from a technical perspective, this is not required and you do not need to follow this convention.

## Factory Methods

### Naming Convention

By convention, factory methods start with a capital letter to indicate that they
create a new or fetch an existing instance of a `PageNode` class. However, technically,
you could name your factory methods any way you want.

Typically, the names of factory methods equal or are very similar to the names of
the `PageNode` classes whose instances they create/fetch from the store's cache:

```typescript
// returns an instance of the `PageElement` class
Element( /*...*/ ) { /*...*/ }

// returns an instance of the `PageElementList` class
ElementList( /*...*/ ) { /*...*/ }

// returns an instance of the `PageElementMap` class
ElementMap( /*...*/ ) { /*...*/ }

// returns an instance of the `ValuePageElementGroup` class
ValueGroup( /*...*/ ) { /*...*/ }
```

### Parameters

A factory method always takes two parameters by convention:

- an XPath selector for page elements, lists and maps or the content managed by a group
- an `opts` parameter which is passed to the constructor of the returned `PageNode` class

Take a look at the factory method `Input()` located in the file `PageNodeStore.ts` in
the `src/page_objects/stores` folder of the wdio-workflo-example repository:

```typescript
Input(
  selector: Workflo.XPath,
  opts?: Pick<IInputOpts<this>, Workflo.Store.BaseKeys>,
) {
  /* create a new instance of a PageNode class or fetch it from the store's cache */
}
```

Both parameters of a factory method are passed, in the same order, to the
constructor of the returned `PageNode` class:

The XPath selector or group content parameter is passed along unaltered.
The `opts` parameter of the factory method, however, contains only the "publicly configurable"
properties of the `opts` object which is passed to the constructor of the returned `PageNode` class.

To create the final, "complete" `opts` parameter object, you need to merge the publicly
configurable `opts` object with an object of default `opts`properties in the
body of the factory method.

If all publicly configurable properties of the `opts` parameter are optional,
you should declare the `opts` parameter of a factory method optional by either appending a
`?` symbol to its name or by initializing it with an empty object `{}` as default value:

```typescript
Input(
  selector: Workflo.XPath,
  opts?: Pick<IInputOpts<this>, Workflo.Store.BaseKeys>,
) { /*...*/ }

// or

Input(
  selector: Workflo.XPath,
  opts: Pick<IInputOpts<this>, Workflo.Store.BaseKeys> = {},
) { /*...*/ }
```

#### Picking the publicly configurable Options

You might have noticed that the type of each factory method's `opts` parameter is defined using TypeScript's `Pick` keyword.

`Pick`, as its name suggests, lets you pick a set of properties from an object,
thereby creating a subset of the original object. `Pick` takes two type parameters:

- The type of the original object
- A list of all object property keys that should by picked from the original object, separated by `|`

In the code example above, we want to create an instance of the `Input` class.
The type of the `Input` class' `opts` parameter is `IInputOpts`.
`IInputOpts` requires one type parameter, the type of the `Input` class' `PageNodeStore`, which we set to `this` to refer to our enclosing store class.

`IInputOpts` has 5 properties: `store`, `timeout`, `interval`, `waitType` and `customScroll`. Which of these properties should be configurable by users of our `Input()` factory method?

The `store` property can always be set to the instance of our enclosing `PageNodeStore` using the `this` keyword. Therefore, it does not need to be
publicly configurable. The other 4 properties could all be publicly configurable - However, experience has shown that out of these, only 2 properties usually NEED to be publicly configured
regularly: `timeout` and `waitType`.

Luckily for us, since `timeout` and `waitType` are used together very often when writing store factory methods, wdio-workflo provides a type alias to describe them: `Workflo.Store.BaseKeys`.

`Workflo.Store.BaseKeys` is exactly the same as writing `'timeout'` | `'waitType'`.

#### Type Aliases for picking publicly configurable `opts`

There is a couple of predefined type aliases available for store factory methods.
You can find them in the `Store` namespace of wdio-workflo's type definition file `index.d.ts`
located in the `dist/` folder of the `wdio-workflo` node module:

```typescript
namespace Store {
  type BaseKeys = 'timeout' | 'waitType';
  type GroupPublicKeys = 'timeout';
  type GroupConstructorKeys = GroupPublicKeys | 'content' | 'store';
  type ElementPublicKeys = BaseKeys | 'customScroll';
  type ListPublicKeys = BaseKeys | 'disableCache' | 'identifier';
  type ListPublicPartialKeys = 'elementOpts';
  type ListConstructorKeys = ListPublicKeys | ListPublicPartialKeys | 'elementStoreFunc';
  type MapPublicKeys = 'identifier' | 'timeout';
  type MapPublicPartialKeys = 'elementOpts';
  type MapConstructorKeys = MapPublicKeys | MapPublicPartialKeys | 'elementStoreFunc';
}
```

### Body

The body of a factory method needs to fulfil two tasks:

- Merge the publicly configurable `opts` object and the default properties `opts` object
- Invoke one of `PageNodeStore`'s initializer functions to create a `PageNode` instance/fetch it from the cache

Let's again take a look at the factory method `Input()` located in the file `PageNodeStore.ts` in
the `src/page_objects/stores` folder of the wdio-workflo-example repository, but this time, including
the full body of the factory method:

```typescript
Input(
  selector: Workflo.XPath,
  opts?: Pick<IInputOpts<this>, Workflo.Store.BaseKeys>,
) {
  return this._getElement<Input<this>, IInputOpts<this>>(
    selector,
    Input,
    {
      store: this,
      ...opts,
    },
  );
}
```

We can see that our factory method invokes the `_getElement` initializer function
that either creates a new `Input` page element instance or fetches an existing,
identical one from the store's page node cache.

More information about all available initializer functions of a `PageNodeStore`
can be found in the [following section](store.md#initializer-functions) of this guide.

We need to configure the two type parameters of the `_getElement` initializer function
(the type of the page node class and the type of its `opts` parameter) and pass it the
XPath selector, the page node class that we want to create and its `opts` parameter object
as arguments.

To create the "full" `opts` parameter object passed to the constructor of the `Input` class,
we merge the factory method's publicly configurable `opts` parameter object with an object of
default properties. To do so, we create a new object `{}` and define our default properties
within its scope. In this case, our only default property is `store` whose value we set to
the instance of our current `PageNodeStore` using the `this` reference. Then we can simply
use the spread operator `...` to copy our publicly configurable `opts` properties into the
"full" `opts` parameter object.

*If you wonder what happened to the `customScroll` and the `interval` properties of the
`opts` parameter object: Both of these are optional properties. Therefore, we do
not need to explicitly define them via the publicly configurable `opts` object, nor
do we need to define them in our default properties `opts` object.*

## Initializer Functions

Each `PageNodeStore` has access to four initializer functions which either
create a new instance of the corresponding `PageNode` class, or return an already
existing, identical `PageNode` instance from the store's page node cache: `_getElement`,
`_getList`, `_getMap` and `_getGroup`.

`PageNode` instances are considered identical if they have the same XPath selectors,
class types and option parameters.

### _getElement

The `_getElement` initializer function creates or fetches instances of the [`PageElement`](element.md) class or of [customized page element classes](customElement.md) derived from the `PageElement` class:

```typescript
this._getElement<Textfield<this>, ITextfieldOpts<this>>(
  selector,
  Textfield,
  {
    store: this,
    ...opts,
  },
);
```

`_getElement` has two type parameters:

- The type of the page element class that should be created/fetched from the cache
- The type of the `opts` object which is passed as 2nd parameter to the page element's constructor

`_getElement` takes three parameters:

- The selector of the page element that should be created/fetched from the cache
- The page element class
- The `opts` parameter of the page element

### _getList

#### Initializer Function for customized `PageElementList` Classes

The `_getList` initializer function creates or fetches instances of the [`PageElementList`](list.md) class or of [customized list classes](customList.md) derived from the `PageElementList` class:

```typescript
this._getList<SearchableFeedItemList<this>, ISearchableFeedItemListOpts<this>>(
  selector,
  SearchableFeedItemList,
  {
    elementOpts: {
      store: this,
      ...opts.elementOpts
    },
    elementStoreFunc: this.FeedItem,
    store: this,
    ...opts,
  },
);
```

`_getList` has two type parameters:

- The type of the list class that should be created/fetched from the cache
- The type of the `opts` object which is passed as 2nd parameter to the list's constructor

`_getList` takes three parameters:

- The selector of the page elements managed by the returned list
- The list class
- The `opts` parameter of the list

Please notice that the `_getList` initializer function is only required if you need
to create customized `PageElementList` classes. These are classes that extend the default `PageElementList` class to add additional functionality, e.g. the `SearchableFeedItemList`
from above which adds a `getByTitle` method to retrieve feed items by their title.

#### Initializer Function for the default `PageElementList` Class

If you want to create a factory method for a `PageElementList` that simply manages customized page elements derived from the default `PageElement` class but does not add any extra functionality to the list itself, you can use the `List` method instead
of the `_getList` initializer function.

The `List` method is basically a preconfigured "shortcut" version of the `_getList`
initializer function that always returns a default `PageElementList` class instance.
Therefore, you do not need to define any type parameters for the `List` method:

```typescript
this.List(
  selector,
  {
    elementOpts: { ...opts.elementOpts },
    elementStoreFunc: this.FeedItem,
    ...opts,
  },
);
```

The `List` method takes two parameters:

- The selector of the page elements managed by the returned `PageElementList`
- The `opts` parameter of the `PageElementList`

By simply defining the `elementStoreFunc` property of the `opts` parameter,
TypeScript will be able to infer the corresponding type of the page element class
managed by the list.

*You might have noticed that our `List` method code example is very similar to the
`_getList` initializer function code example. Both return a list that manages
a `FeedItem` page element. However, the type of the list returned by the `List` method
is the default `PageElementList` class, while the type of the list returned by
`_getList` is the class `SearchableFeedItemList`. Therefore, the custom `getByTitle`
method will be available only if you used the `_getList` initializer function.
However, such additional list functionality might not be required in many use cases.*

### _getMap

#### Initializer Function for customized `PageElementMap` Classes

The `_getMap` initializer function creates or fetches instances of the [`PageElementMap`](map.md)class or of [customized map classes](customMap.md) derived from the `PageElementMap` class:

```typescript
this._getMap<
  K,
  PageElementMap<this, K, PageElementType, PageElementOpts>,
  IPageElementMapOpts<this, K, PageElementType, PageElementOpts>
> (
  selector,
  PageElementMap,
  {
    store: this,
    elementStoreFunc: opts.elementStoreFunc,
    ...opts,
  },
);
```

`_getMap` has three type parameters:

- The keys used to access the page elements managed by the map via the map's `$` accessor
- The type of the map class that should be created/fetched from the cache
- The type of the `opts` object which is passed as 2nd parameter to the map's constructor

`_getMap` takes three parameters:

- The selector of the page elements managed by the returned map
- The map class
- The `opts` parameter of the map

Similar to `_getList`, the `_getMap` initializer function is only required if you need
to create customized `PageElementMap` classes which extend the default `PageElementMap`
class to add extra functionality to the map.

#### Initializer Function for the default `PageElementMap` Class

If you want to create a factory method for a `PageElementMap` that simply manages customized
page elements derived from the default `PageElement` class but does not add any
extra functionality to the map itself, you can use the `Map` method instead
of the `_getMap` initializer function.

The `Map` method is basically a preconfigured "shortcut" version of the `_getMap`
initializer function that always returns a default `PageElementMap` class instance.
Therefore, you do not need to define any type parameters for the `Map` method:

```typescript
this.Map(
  selector,
  {
    elementStoreFunc: this.Link,
    elementOpts: { ...opts.elementOpts },
    ...opts,
  },
);
```

The `Map` method takes two parameters:

- The selector of the page elements managed by the returned `PageElementMap`
- The `opts` parameter of the `PageElementMap`

By simply defining the `elementStoreFunc` property of the `opts` parameter,
TypeScript will be able to infer the corresponding type of the page element class
managed by the map.

### _getGroup

Wdio-workflo's `PageNodeStore` class ships with two factory methods for creating
`PageElementGroup` and `ValuePageElementGroup` classes: `ElementGroup()` and `ValueGroup()`.

There will probably never by a need to add additional factory methods for creating `PageElementGroup` classes to a `PageNodeStore`, but just for the sake of completeness,
there is a `_getGroup` initializer function that lets you create or fetch instances
of `PageElementGroup` classes or classes derived from `PageElementGroup`:

```typescript
this._getGroup<
  this,
  Content,
  ValuePageElementGroup<this, Content>,
  Pick<IValuePageElementGroupOpts<
    this, Content
  >, Workflo.Store.GroupConstructorKeys>
> (
  ValuePageElementGroup,
  {
    content,
    store: this,
    ...opts,
  },
);
```

`_getGroup` has four type parameters:

- The type of the store
- The type of the group's content
- The type of the group class that should be created/fetched from the cache
- The type of the `opts` object which is passed as 2nd parameter to the group's constructor

`_getGroup` takes two parameters:

- The group class
- The `opts` parameter of the group

*Notice that a `PageElementGroup`, other than the `PageElement`, `PageElementList` and
`PageElementMap` classes, does not have an XPath selector. Instead, the group is passed
a content object, which behaves similar to a `Page` class - within its scope, you define
the page nodes managed by the group.*

## Using a `PageNodeStore`

### Accessing a Store from a Page

Usually, each `PageNode` "lives" within the scope of a [`Page`](page.md). Since page nodes
should only be created/retrieved via a store, the `Page` needs access to an instance
of the `PageNodeStore` class:

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
}
```

As you can see from the code above, the instance of the `PageNodeStore` is saved
in the `_store` class member of the `Page` and can be used to invoke the factory
methods of the store, like the `Element` method in this example.

To set the value of `_store`, you need to define the `store` property in the `opts` parameter
passed to the constructor of `Page`. Since the `Footer` class above is derived
from the `Page` class, the `opts` parameter is passed to the `super` constructor.

### Accessing a Store from a PageNode

Pages are not the only classes that need access to a `PageNodeStore` in order
to create instances of page nodes. Each [`PageNode`](pageObjects.md#page-nodes) class, too, stores a
`PageNodeStore` instance in its private `_store` class member for the same reason.

However, in most cases you won't need to access the private `_store` class member of a
`PageNode` directly. Instead, there is a public `$` accessor available for each
[`PageElement`](element.md), [`PageElementList`](list.md) and [`PageElementMap`](map) class.
The `$` accessor also references the `PageNodeStore` instance and automatically prepends the
XPath selector of the parent page node to the XPath selector of the child page node fetched
from the store which is what you want to do 99% of the time.

Consider, for example, a `Textfield` class that extends `PageElement` and has two
child page elements: an `input` field and a `label`. To create the `input` and the
`label` page elements, the `Textfield` class fetches the corresponding
`PageNode` classes from its `PageNodeStore` instance via the `$` accessor:

```typescript
// IValuePageElementOpts requires an instance of a `PageNodeStore` in its `store` property
export interface ITextfieldOpts<
  Store extends PageNodeStore
> extends IValuePageElementOpts<Store> {}

export class Textfield<
  Store extends PageNodeStore
> extends ValuePageElement<Store, string> {

  constructor(selector: string, opts: ITextfieldOpts<Store>) {
    super(selector, opts);
  }

  get label() {
    return this.$.Element(
      xpath('//label').classContains('ms-Label')
    );
  }

  get input() {
    return this.$.Input(
      xpath('//input')
    );
  }
```

Let's assume that the XPath selector of our `Textfield` element is `//div[@role="textfield"]`.
The XPath selector of the `label` child element alone would be `//label[contains(@class, "ms-Label")]`.
However, sine the `Element` factory method of the store is invoked via the `$` accessor,
the full resulting XPath selector of our `label` page element would be
`//div[@role="textfield"]//label[contains(@class, "ms-Label")]`.
