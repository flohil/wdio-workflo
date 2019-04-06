---
id: customList
title: Customizing a List
sidebar_label: Customizing a List
---

There are two situations where you might want to create a custom `PageElementList` class:

- To add a factory method for a list of your own custom PageElement classes
- To enhance the base `PageElementList` with additional functionality

The first situation is usually much more common, so let's start with explaining it in more detail.

## Adding a List Factory Method for Custom Elements

In our guide on [Customizing an Element](customElement.md), we create a custom `FeedItem` page element.

If you visit wdio-workflo's demo website, you'll notice that on the "Feed"
page there is not just one, but a couple of feed items. This seems like a
perfect fit for a custom `FeedItemList`.

Luckily, creating a list that manages a custom page element class
without implementing any new functionality compared to the base `PageElementList` is very simple. All we have to do is add a new factory
method to a `PageElementStore` class.

Open the file `PageNodeStore.ts` located in the `src/page_objects/stores` folder of the wdio-workflo-example repository and have a look at the `FeedItemList` method:

```typescript
FeedItemList(
  selector: Workflo.XPath,
  opts: Workflo.PickPartial<
    core.elements.IPageElementListOpts<
      this, FeedItem<this>, Pick<IFeedItemOpts<this>, Workflo.Store.ElementPublicKeys>
    >,
    Workflo.Store.ListPublicKeys,
    Workflo.Store.ListPublicPartialKeys
  > = {},
) {
  return this.List(
    selector,
    {
      elementOpts: { ...opts.elementOpts },
      elementStoreFunc: this.FeedItem,
      ...opts,
    },
  );
}
```

### Picking Public Parameters

Factory methods for lists are very similar to those for single elements. Their first parameter is always the XPath `selector` that identifies all elements managed by the list.
The second parameter represents all properties of the list's `opts` object which
can be used to configure an instance of the list.

For our `FeedItemList`, we make use of the `Workflo.PickPartial` type helper.
This allows use to pick some properties from an object as they are, and to pick some
other properties which are additionally made optional. `Workflo.PickPartial` expects
three type parameters:

- The original object type - in our case `core.elements.IPageElementListOpts`
- A list of all property keys which should be picked from the original object as-is
- A list of all property keys which should be picked from the original object and made optional

`IPageElementListOpts` itself also expects three type parameters:

- The type of the `PageNodeStore` (always `this`)
- The type of the page element it manages (`FeedItem`)
- The type of the public `opts` properties passed to a single page element (`Pick<IFeedItemOpts<this>, Workflo.Store.ElementPublicKeys>`)

In our example, `Workflo.Store.ListPublicKeys` consists of the property keys
`timeout`, `waitType`, `disableCache` and `identifier`. If you examine `core.elements.IPageElementListOpts`, you will notice that all of these are already
optional - if they weren't, we would have to explicitly declare them each time
we invoke the `FeedItemList` factory method.

`Workflo.Store.ListPublicPartialKeys` consists of only one property key: `elementOpts`.
This property describes the `opts` parameter passed to the constructor of each
page element managed by the list. This property is required by `IPageElementListOpts`,
which means that we cannot instantiate a page element list without providing them.
To spare the users of our `FeedItemList` from writing a lot of boilerplate code, we provide a default `elementOpts` object in our factory method and turn the `elementOpts`
property into a optional property by using `Workflo.PickPartial`, so that this property
does not need to be defined each time we invoke the `FeedItemList` factory method.

If a user still wants to explicitly define the `elementOpts` for our `FeedItem`,
this is also possible because we merge the public `elementOpts` property into
our default property (`elementOpts: { ...opts.elementOpts }`). If the user does
not specify an `elementOpts` property, the result of the merge will be an empty object.

### Implementation with `List` method

Luckily for us, the implementation of a list factory method for custom page elements
is very easy if we use the `List` method provided by `PageNodeStore`. This method expects
two parameters:

- The XPath selector to identify all elements managed by the list
- The `opts` object used to configured the list

The `opts` object is usually the merged result of the list's public `opts` and
a number of preconfigured properties, like in our case `elementOpts` and `elementStoreFunc`.

`elementStoreFunc` defines the factory method used to create instances of the
custom `PageElement` class managed by our custom list.

## Enhancing a PageElementList with additional Functionality

### Creating a Custom List Class

If we simply added a list factory method for a custom page element class using the
`List` method of `PageNodeStore`, we are restricted to select certain list elements
using the `where` builder of the base `PageElementList` class.

While this might be sufficient in many situations, we sometimes want to provide
the user a more comfortable way of selecting a single element from the list.
We could, for example, allow to select a `FeedItem` by its title.

This requires us to create a custom `PageElementList` class - in our example
the class `SearchableFilterItemList` located in the `src/page_objects/page_elements`
folder of the wdio-workflo-example repository:

```typescript
import { pageObjects as core } from 'wdio-workflo';

import { PageNodeStore } from '../stores';
import { FeedItem, IFeedItemOpts } from './';

export interface ISearchableFeedItemListOpts<
 Store extends PageNodeStore
> extends core.elements.IPageElementListOpts<Store, FeedItem<Store>, IFeedItemOpts<Store>> {}

export class SearchableFeedItemList<
  Store extends PageNodeStore
> extends core.elements.PageElementList<Store, FeedItem<Store>, IFeedItemOpts<Store> > {

  constructor(selector: string, opts: ISearchableFeedItemListOpts<Store>) {
    super(selector, opts);
  }

  getByTitle(title: string) {
    return this.where.hasChild(
      '//div', xpath => xpath.classContains('Feed-itemName').text(title)
    ).getFirst();
  }
}
```

To create our custom `PageElementList` class, we simply extend our list from
`core.elements.PageElementList` and our list's options from `core.elements.IPageElementListOpts`.
Since our `SearchableFeedItemList` is going to only ever manage `FeedItem` elements,
we can configure the 2nd type parameter of `PageElementList` and `IPageElementListOpts` as `FeedItem<Store>`
and their 3rd type parameter as `IFeedItemOpts<Store>`.

Our new `getByTitle` method takes a `title` as parameter and returns the first list item
which has a nested `<div>` HTML element whose class contains `'Feed-itemName'` and whose
text matches our passed `title`.

### Adding an Export Entry to Index.ts

Do not forget to add an export entry for your custom list to the `index.ts` file
located in the `src/page_objects/page_elements` folder:

```typescript
export * from './SearchableFeedItemList';
```

We will need this export entry to import our class type and its `opts` interface from
a `PageNodeStore`.

### Adding a Factory Method for the Custom List

Like before, when we added a simple list factory method for a custom element class using the `List` method of `PageNodeStore`,
we also need to add a factory method for our custom list.

Take a look at the `SearchableFeedItemList` method defined in the file
`src/page_objects/stores/PageNodeStore` of the wdio-workflo-example repository:

```typescript
SearchableFeedItemList(
  selector: Workflo.XPath,
  opts: Workflo.PickPartial<
    ISearchableFeedItemListOpts<this>,
    Workflo.Store.ListPublicKeys,
    Workflo.Store.ListPublicPartialKeys
  > = {},
) {
  return this._getList<
    SearchableFeedItemList<this>,
    ISearchableFeedItemListOpts<this>
  >(
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
}
```

### Picking Public Parameters

The parameters of our `SearchableFeedItemList` method are pretty much identical to our
`FeedItemList` method. The only difference is that we now use `ISearchableFeedItemListOpts`
as first type parameter of `Workflo.PickPartial`.

Since we already defined that `ISearchableFeedItemListOpts` always operates on a `FeedItem` with `IFeedItemOpts`,
we don't need to specify a 2nd and 3rd type parameter for this interface.

### Implementation with `_getList` method

If we wrote a custom `PageElementList` class, we need to use `_getList` instead of the `List` method of `PageElementStore`.

Actually, the `List` method is just a little wrapper method which also calls `_getList` but which only
works with the core `PageElementList` class provided by wdio-workflo.

As you can see from the code above, the `_getList` method expects two type parameters:

- The type of our custom list class
- Our custom list's `opts` interface

The method parameters of `_getList` are also very similar to those of the `List` method.
The only differences are that you need to pass your custom list class as second parameter, so
that the `opts` parameter comes third. We also need to manually define the `store` property
inside the `opts` object and inside its `elementOpts` property now
(the `List` method automatically sets the `store` properties for us).