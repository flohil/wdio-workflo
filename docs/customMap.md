---
id: customMap
title: Customizing a Map
sidebar_label: Customizing a Map
---

Customizing a `PageElementMap` class is very similar to customizing a `PageElementList`.
However, the only situation where you might want to do so is when you created a
custom element which you want to manage with a map.

## Adding a Map Factory Method for Custom Elements

For demonstration purposes, I added an incredible complex `Link` component in the
wdio-workflo-example repository (all it can do is `open` a link).

The `Link` component would often be used in navigation menus which are mostly
static by nature (the content of a navigation menu usually does not change).
Our preferred class for managing static elements is `PageElementMap`.

So we now need to a map factory method named `LinkMap` for our `Link` component to `PageNodeStore.ts`
located in the `src/page_objects/stores` folder of the wdio-workflo-example repository:

```typescript
LinkMap<K extends string>(
  selector: Workflo.XPath,
  opts: Workflo.PickPartial<
    core.elements.IPageElementMapOpts<
      this, K, Link<this>, Pick<ILinkOpts<this>, Workflo.Store.ElementPublicKeys>
    >,
    Workflo.Store.MapPublicKeys,
    Workflo.Store.MapPublicPartialKeys
  >,
) {
  return this.Map(
    selector,
    {
      elementStoreFunc: this.Link,
      elementOpts: { ...opts.elementOpts },
      ...opts,
    },
  );
}
```

If you read the [Customizing a List](customList.md) guide, this code will look
very familiar to you - it is almost identical to the code we used for our list
factory method `FeedItemList`.

The only difference is that our factory method itself now has a type parameter
called `K` which describes the keys used to identify the elements managed by the map
when invoking the map's `$` accessor.

When you call our `LinkMap` factory method, you do not need to explicitly specify
the type of `K` because TypeScript can infer it from the `identifier` property of
the `opts` object. This is also the reason why the `opts` object is always mandatory
for map factory methods - without it, a map would not make much sense since the
`identifier` property is needed to define the elements managed by the map.

