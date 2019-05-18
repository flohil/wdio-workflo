---
id: group
title: Group
sidebar_label: Group
---

## Overview and Objective

Wdio-workflo's `PageElementGroup` manages an arbitrary structure of `PageNode`
instances of various classes. These classes can be (derivations of) `PageElement`,
`PageElementList`, `PageElementMap` or even another, nested `PageElementGroup`.

A typical website component that should be mapped by a `PageElementGroup` is
a form, since forms usually consist of HTML elements of various types, like
text input fields, dropdowns, checkboxes, radio buttons, labels and textareas.

Unlike other page node classes, a `PageElementGroup` has no XPath selector
of its own. It merely provides a way to define a structure of page nodes
and to execute the same function on each of these page nodes. In this regard,
a `PageElementGroup` works similar to the
[composite pattern](https://en.wikipedia.org/wiki/Composite_pattern):

*"In software engineering, the composite pattern is a partitioning design pattern. The composite pattern describes a group of objects that is treated the same way as a single instance of the same type of object. The intent of a composite is to "compose" objects into tree structures to represent part-whole hierarchies. Implementing the composite pattern lets clients treat individual objects and compositions uniformly."* - Quote from wikipedia.org

As noted in the above quote, a `PageElementGroup` manages a tree-like structure
of page nodes. The leaf page nodes are always `PageElement` instances that either
reside directly within the group's content, or are managed by one of the
lists, maps or nested groups located in the group's content.

The main advantage of using a `PageElementGroup` to represent an HTML form
is that if you want to fill in the form, you don't need to invoke the `setValue()`
function for each form element, but instead, you simply pass the values of all
form elements to the `setValue()` function of the `PageElementGroup`. The group
then internally invokes the `setValue()` function for all form elements and
passes the value for each form element to the corresponding function invocation.
A code example showing you how to use the `setValue()` function of a group can be
found in the [`ValuePageElementGroup` section]() of this guide.

Finally, like the other `PageNode` classes, `PageElementGroup` also features a
`currently` and an `eventually` API to check if some, none or all of the group's
page nodes currently/eventually have a certain state, and a `wait` API
to wait for some, none or all of the group's page nodes to reach a certain state.

## Creating a `PageElementGroup`

### `ElementGroup()` Factory Method

Instead of manually invoking the constructor of `PageElementGroup` using the `new` keyword,
you should always call the `ElementGroup()` factory method of the [PageNodeStore](store.md)
class to create an instance of the `PageElementGroup` class:

```typescript
import { stores } from '?/page_objects';

const group = stores.pageNode.ElementGroup({
  get link() {
    return stores.pageNode.Link('//a');
  },
  get label() {
    return stores.pageNode.Element(
      xpath('//span').classContains('label')
    );
  }
});
```

As you can see from the example above, the `ElementGroup()` factory method, unlike
the factory methods of other `PageNode` classes, does not take an XPath selector,
but an object containing the content of the group (all page nodes managed by the group).

### Type Parameters

The `PageElementMap` class has two type parameters:

- The type of the `PageNodeStore` associated with the group to create other page nodes.
- The type of the group's content (all page nodes managed by the group).

```typescript
export class PageElementGroup<
  Store extends PageNodeStore,
  Content extends {[K in keyof Content] : Workflo.PageNode.IPageNode}
> extends PageNode<Store>
```

Please not that the `Content` type parameter of `PageElementGroup` requires forces
each property of the group's content object to implement the `Workflo.PageNode.IPageNode`
interface - or in other words, to be a `PageNode`.

### Constructor

The constructor of `PageElementMap` requires two parameters:

- The `id` of the group which uniquely identifies the group. Simply put, to create
this `id`, `PageNodeStore` transforms the content of a group into one giant string.
- The `opts` parameter containing properties to configure the `PageElementGroup`.

```typescript
constructor(id: string, opts: IPageElementGroupOpts<Store, Content>) {
  /*...*/
}
```

The properties of the `opts` parameter are:

- `store` => The `PageNodeStore` instance associated with the `PageElementGroup`.
- `content` => An object containing all `PageNode` instances managed by the group.

### `content` Object

The `content` object of a `PageElementGroup` can be used to create an arbitrary
structure of classes derived from `PageNode` - these can by (derivations of)
`PageElement`, `PageElementList`, `PageElementMap` and even nested `PageElementGroup` classes. The keys of the `content` object are the names used to access the group's
page nodes, and the values are the page node instances themselves.

In this regard, the `content` object is very similar to the `Page` class, which
also manages page nodes of any classes. And like page nodes of the `Page` class,
all page nodes of the `content` object need to be defined using JavaScript getters.
To find out why, please read the [Defining Page Nodes using JavaScript Getters](page.md#defining-page-nodes-using-javascript-getters) section of the `Page` guide.

Below you can see an example of a `PageElementGroup` content object:

```typescript
import { stores } from '?/page_objects';

const container = stores.pageNode.Element(
  xpath('//div').id('groupContainer')
);

const group = stores.pageNode.ElementGroup({
  get label() {
    // The `label` page element has the following XPath:
    // '//div[@id="groupContainer"]//span[contains(@class, "label")]'
    return container.$.Element(
      xpath('//span').classContains('label')
    );
  },
  get titlesList() {
    return container.$.ElementList(
      xpath('//h3')
    );
  },
  get navigationMap() {
    return container.$.LinkMap(
      xpath('//a').classContains('navigation'), {
        identifier: {
          mappingObject: {
            demo: 'Demo Page',
            examples: 'Examples',
            api: 'API'
          },
          mappingFunc: (baseSelector, value) => xpath(baseSelector).text(value)
        }
      }
    );
  },
  get nestedGroup() {
    return container.$.ElementGroup({
      get errorMessageArea() {
        return container.$.Element(
          xpath('//div').id('errors')
        );
      },
      get successMessageArea() {
        return container.$.Element(
          xpath('//div').id('successes')
        );
      }
    });
  }
});
```

Although a `PageElementGroup` has no XPath selector of its own, in a lot of cases
the page nodes of a group all reside within a common HTML container element. Like in
the example above, you can create such a container as a `PageElement` and then use
its `$` accessor to instantiate the page nodes defined within the `content` object of a group. By doing so, the XPath selector of the container will be prepended to the XPath
selectors of the group's page nodes.

## Accessing Group Elements

To access the `PageNode` instances managed by a group from outside of the
`PageElementGroup` class, we need to use the group's `$` accessor which returns
the `content` object of the group:

![The `$` accessor of `PageElementGroup`](assets/group_dollar_accessor.png)

So if we wanted to click the `label` element of our `group` from the above
code example, we would write:

```typescript
group.$.label.click();
```

## State Functions

### `PageElementGroup` Example Code

The following sections of the "State Functions" chapter refer to the below
example code of a `PageElementGroup` definition to avoid code duplication:

```typescript
import { stores } from '?/page_objects';

const container = stores.pageNode.Element(
  xpath('//div').id('groupContainer')
);

const group = stores.pageNode.ElementGroup({
  get element() {
    return container.$.Element('//span');
  },
  get list() {
    return container.$.ElementList('//h3');
  },
  get map() {
    return container.$.ElementMap('//a', {
      identifier: {
        mappingObject: {
          demo: 'Demo Page',
          examples: 'Examples',
        },
        mappingFunc: (baseSelector, value) => xpath(baseSelector).text(value)
      }
    });
  },
  get nestedGroup() {
    return container.$.ElementGroup({
      get nestedElement() {
        return container.$.Element(xpath('//div'));
      },
    });
  }
});
```

### Composite Pattern

As already mentioned, the content of a `PageElementGroup` defines an arbitrary
tree structure of `PageNode` instances. Each `PageNode` instance can be
a `PageElement`, `PageElementList`, `PageElementMap` or a nested `PageElementGroup`.
The leaf nodes of this tree structure are always `PageElement` instances.

The `PageElementGroup` allows us to invoke state retrieval, state check and
action functions on each `PageNode` instance managed by the group with one simple
call of a function defined on the group itself.

Together, these two features of a `PageElementGroup` represent an implementation
of the [composite pattern](https://en.wikipedia.org/wiki/Composite_pattern),
which allows us to treat a group of `PageNode` instances the same way as a single
`PageNode` instance.

When you invoke a state retrieval, state check or action function on the
`PageElementGroup` class, the group iterates over all of its managed `PageNode`
instances and invokes the respective function on each `PageNode` of the group:

- If this `PageNode` is a `PageElement`, the group has reached a leaf node.
- If this `PageNode` is a `PageElementList` or `PageElementMap`, the group further
invokes the respective function on the `PageElement` instances managed by the list
or map.
- If the `PageNode` is a nested `PageElementGroup`, it invokes the respective
function on each of its managed `PageNode` instances.

This process of function invocations continues recursively until the function was
invoked on each `PageElement` leaf node of the outermost group.

You can skip the invocation of the function for certain `PageNode` instances
by using a filter mask. The [Filter Masks section](#filter-masks) of this guide
shows you how to do that.

### State Retrieval Functions

State retrieval functions of the `PageElementGroup` class fulfil the same purpose
as those of the `PageElement` class: For each `PageElement` leaf node managed by the
group, they retrieve the value of a certain attribute of the HTML element that is
wrapped by `PageElement` from the website. They return an object whose keys are
taken from the group's content object and whose values represent the values
of the retrieved HTML attribute for each `PageNode` managed by the group:

```typescript
const groupTexts = group.getText();

// Assuming the group's `list` page node manages two page elements,
// the content of the `groupTexts` variable could be:
//
// {
//   element: 'Text of Element',
//   list: ['Text of first List Element', 'Text of second List Element'],
//   map: {
//     demo: 'Demo Page',
//     examples: 'Examples'
//   },
//   nestedGroup: {
//     nestedElement: 'Text of Nested Element'
//   }
// };
```

You can use a [filter mask](#filter-masks) to skip the invocation of a state
retrieval function for certain `PageElement` leaf nodes:

```typescript
const filteredGroupTexts = group.getText({
  element: true,
  map: {
    examples: true
  }
});

// The content of the `filteredGroupTexts` variable would now be:
//
// {
//   element: 'Text of Element',
//   list: undefined,
//   map: {
//     demo: undefined,
//     examples: 'Examples'
//   },
//   nestedGroup: undefined
// };
```

For more information about the types of available state retrieval functions,
please read the [State Retrieval Functions section](element.md#state-retrieval-functions)
of the `PageElement` guide. Please note that not all types of `PageElement` state
retrieval functions are also available on a `PageElementGroup`.

### Action Functions

Action functions change the state of the tested web application by interacting
with HTML elements that are mapped by `PageElement` instances. To execute an
action function on each `PageElement` leaf node of a `PageElementGroup`, you have
two options:

- You can access each `PageNode` instance of the group and its nested groups
via the `$` accessor and invoke an action function on each.
- You can use the `eachDo()` method of the `PageElementGroup` which automatically
loops over the managed `PageNode` instances and invokes an action function which
you need to pass to `eachDo()` on each page node. Using `eachDo()` allows you to
optionally pass a [filter mask](#filter-masks) as second parameter to skip the action
function's invocation for certain `PageElement` leaf nodes.

The following code example compares both options for executing action functions
on each page node of a `PageElementGroup`:

```typescript
// Click on each page element leaf node of the group after accessing the group's
// page nodes via the '$' accessor.
group.$.element.click();
group.$.list.click();
group.$.map.click();
group.$.nestedGroup.$.nestedElement.click();

// Clicks on the `element` page element, each page element managed by the `list`
// page node and the `demo` page element of the `map` page node. For all other
// page element leaf nodes of the group, the invocation of the `click()` function
// will be skipped because they are not included in the filter mask.
group.eachDo(
  pageNode => pageNode.click(),
  {
    element: true,
    list: true,
    map: {
      demo: true
    }
  }
);
```

For more information about the types of available action functions,
please read the [Action Functions section](element.md#action-functions) of the `PageElement` guide.

### State Check Functions

The state check functions of the `PageElementGroup` class let you check if all
or some of the group's `PageElement` leaf nodes currently or eventually have an
expected state. They also allow you to wait for some or all page element leaf
nodes of a group to reach an expected state within a specific timeout.

If a state check function of `PageElementGroup` requires you to pass the expected
attribute states as a parameter, this parameter needs to be an object whose
keys are taken from the group's content object and whose values represent the values
of the checked HTML attribute for each `PageNode` instance. If you omit a property
representing a certain managed `PageNode` instance in the parameter object,
the invocation of the state check function will be skipped for this page node
(and all of its page element leaf nodes of the page node is a list, map or group).

For state check functions that do not require you to pass the expected attribute
states as a parameter, you can use a [filter mask](#filter-masks) to skip the
invocation of the state check function for certain `PageElement` leaf nodes.

The following code example demonstrates the usage of the state check functions
of a `PageElementGroup`:

```typescript

// Checks if the texts of all page element leaf nodes currently match the
// expected values.
group.currently.hasText({
  element: 'Text of Element',
  list: ['Text of first List Element', 'Text of second List Element'],
  map: {
    demo: 'Demo Page',
    examples: 'Examples'
  },
  nestedGroup: {
    nestedElement: 'Text of Nested Element'
  }
});

// Checks if the `element` page element and the `nestedElement` page element of
// `nestedGroup` currently have any text (are not empty).
linkMap.currently.hasAnyText({
  element: true,
  nestedGroup: {
    nestedElement: true
  }
});

// Waits for all page element leaf nodes of the group to become visible.
// If one or more page element leaf nodes do not become visible within the default
// timeout defined for each managed page element, list or map, an error will
// be thrown.
group.wait.isVisible();

// Waits until the `element` page element and the `nestedElement` page element of
// `nestedGroup` are no longer visible. Both of these page element are allowed
// to take up to 3 seconds each to become no longer visible. If they fail to do
// so, an error will be thrown.
linkMap.wait.not.isVisible({ timeout: 3000, filterMask: {
  element: true,
  nestedGroup: {
    nestedElement: true
  }
}});

// Checks if the text of `element` eventually contains 'of Element', if the text
// of the second page element managed by `list` eventually contains
// 'second List Element' and if the text of the `nestedElement` page element of
// `nestedGroup` contains 'of Nested'.
group.eventually.containsText({
  element: 'of Element',
  list: [undefined, 'second List Element'],
  nestedGroup: {
    nestedElement: 'of Nested'
  }
});
```

To find out how state check functions behave differently when invoked on the
`currently`, `wait` or `eventually` API of a `PageElementGroup`, please read the
corresponding sections of this guide:
[The `currently` API](#the-currently-api),
[The `wait` API](#the-wait-api),
[The `eventually` API](#the-eventually-api).

For more information about the types of available state check functions,
please read the [State Check Functions section](element.md#state-check-functions)
of the `PageElement` guide. Please note that not all types of `PageElement` state
check functions are also available on a `PageElementGroup`.

### Filter Masks

The `PageElementGroup` filter mask allows you to restrict the execution of a
state retrieval, action or state check function to certain `PageNode` instances
managed by the group.

The `PageElementGroup` filter mask is an object whose keys are taken from the group's
content object and whose values are determined by the filter masks of the
respective `PageNode` instances:

- For `PageElement` instances, you can set the value of a filter mask property
to `true` if you want a function to be executed for the respective page element,
and `false` if you want to skip the function invocation.
- The filter mask formats of lists and maps are explained in full detail in the
filter mask sections of the [PageElementList](list#filter-masks) and [PageElementMap](map#filter-masks) guides.
- If you don't define a property for a specific `PageNode` in the filter mask object, the function call for the respective page node will be skipped.

The filter mask can be set via the last parameter of a state retrieval, action or
state check function. If such a function has other optional parameters, the filter
mask can be defined via the `filterMask` property of the `opts` parameter (which
is always the last function parameter). Otherwise, the filter mask itself represents
the last function parameter.

Here are some examples for how to use filter masks with a `PageElementGroup`:

```typescript
import { stores } from '?/page_objects';

const container = stores.pageNode.Element(
  xpath('//div').id('groupContainer')
);

const group = stores.pageNode.ElementGroup({
  get element() {
    return container.$.Element('//span');
  },
  get list() {
    return container.$.ElementList('//h3');
  },
  get map() {
    return container.$.ElementMap('//a', {
      identifier: {
        mappingObject: {
          demo: 'Demo Page',
          examples: 'Examples',
        },
        mappingFunc: (baseSelector, value) => xpath(baseSelector).text(value)
      }
    });
  },
  get nestedGroup() {
    return container.$.ElementGroup({
      get nestedElement() {
        return container.$.Element(xpath('//div'));
      },
    });
  }
});

// The `getText()` function will be invoked for the `element` page element,
// all page elements of `list`, the `demo` page element of `map` and the
// `nestedElement` page element of `nestedGroup`.
// The `getText()` invocation will be skipped for the `examples` page element
// of `map` because its filter mask value is set to `false`.
const texts = group.getText({
  element: true,
  list: true,
  map: {
    demo: true,
    examples: false
  },
  nestedGroup: {
    nestedElement: true
  }
})

// The `click()` function will only be invoked for the second page element
// of `list`. It will be skipped for the `element` page element because its
// filter mask value is `false`, for the first page element of `list` because
// its filter mask value is also `false`, and for all page elements managed by
// `map` and `nestedGroup` because the filter mask contains no property for them.
group.eachDo(
  node => node.click(), {
  element: false,
  list: [false, true],
})

// There are other optional parameters like `timeout`, therefore the filter mask
// is defined via the `filterMask` property of the `opts` parameter.
// The `hasAnyText` function will return `true` if the `element` and the `nestedElement`,
// both within 3 seconds each, have any text (are not empty).
group.eventually.hasAnyText({ timeout: 3000, filterMask: {
  element: true,
  nestedGroup: {
    nestedElement: true
  }
}});
```

Filter masks are not available for state check functions that require you to pass
the expected attribute values as a parameter, e.g. `hasText(texts)` or
`containsValue(values)`. In these cases, you can skip the execution of the state
check function for a certain `PageNode` instance by simply not defining
an object property for the corresponding key:

```typescript
// The `hasDirectText` function will only be invoked for the `element` page element
// and the `examples` page element of `map`. It will return `true` if the direct text
// (the text that resides directly/one layer below the HTML element) of `element`
// is currently 'Element text' and the direct text of `map.examples` is currently
// 'Examples'.
const result = group.currently.hasDirectText({
  element: 'Element text',
  map: {
    examples: 'Examples'
  }
});
```

## Waiting Mechanisms

### Implicit Waiting

`PageElementGroup` does not have an implicit waiting mechanism of its own.
However, if you invoke a state retrieval or action function on a `PageElement`
leaf node managed by a `PageElementGroup`, the
[implicit waiting mechanism of the `PageElement`](element#implicit-waiting) will be triggered.

### Explicit Waiting: `currently`, `wait` and `eventually`

The explicit waiting mechanisms of `PageElementGroup` are very similar to the
ones used by `PageElement` and you should read about them in the
[Explicit Waiting](element.md#explicit-waiting-currently-wait-and-eventually)
section of the [`PageElement` guide](element.md) before you continue reading
this guide.

To learn how the behavior of state retrieval and state check functions of the `PageElementGroup` class differs from its `PageElement` class equivalents, please
read the [State Function Types section of this guide](#state-function-types).

The types of available state retrieval and state check functions can be
found in the [State Function Types section of the `PageElement` guide](element.md#state-function-types). Please note that not all types of `PageElement`
state retrieval and state check functions are also available on a `PageElementGroup`.

### The `currently` API

The `currently` API of the `PageElementGroup` class consists of state retrieval
functions and state check functions. It does not trigger an implicit wait on the
`PageNode` instances managed by the `PageElementGroup`.

The state retrieval functions of a group's `currently` API retrieve the values
of a certain HTML attribute for each `PageElement` leaf node managed by the group.
They return an object whose keys are taken from the group's content object and whose
values represent the current values of the retrieved HTML attribute for the respective
page nodes managed by the group.

The state check functions of the `currently` API check wether the `PageElement`
leaf nodes managed by the `PageElementGroup` currently have an expected state for a
certain HTML attribute.

By using a [filter mask](#filter-masks), you can skip the invocation of a
state retrieval or state check function for certain `PageElement` leaf nodes of
the group.

### The `wait` API

#### Overview

The `wait` API of the `PageElementGroup` class allows you to explicitly wait
for some or all of the group's managed `PageElement` leaf nodes to have an expected
state. It consists of state check functions only which all return an instance
of the `PageElementGroup`.

If you use a [filter mask](#filter-masks), the `wait` API only waits for the group's
`PageElement` leaf nodes which are included by the filter mask to reach an expected
state. Otherwise, the `wait` API waits for all managed `PageElement` leaf nodes to reach
their expected state. If one or more `PageElement` leaf nodes fail to reach their
expected state within a specific timeout, an error will be thrown.

#### Timeout

The `timeout` within which the expected states of the `PageNode` instances must
be reached applies to each `PageElement` instance individually. So, if the `timeout`
was 3000 milliseconds, each `PageElement` instance managed by the group, or by
one of the group's `PageElementList` and `PageElementMap` page nodes, is allowed
to take up to 3 seconds to reach its expected state:

```typescript
import { stores } from '?/page_objects';

const container = stores.pageNode.Element(
  xpath('//div').id('groupContainer')
);

const group = stores.pageNode.ElementGroup({
  get element() {
    return container.$.Element('//span');
  },
  get list() {
    return container.$.ElementList('//h3');
  },
  get map() {
    return container.$.ElementMap('//a', {
      identifier: {
        mappingObject: {
          demo: 'Demo Page',
          examples: 'Examples',
        },
        mappingFunc: (baseSelector, value) => xpath(baseSelector).text(value)
      }
    });
  },
  get nestedGroup() {
    return container.$.ElementGroup({
      get nestedElement() {
        return container.$.Element(xpath('//div'));
      },
    });
  }
});

// The `element` page element, all page elements managed by the `list` page node,
// all page elements managed by the `map` page node and all page elements
// managed by page nodes of `nestedGroup` are allowed to take up to 3 seconds each
// to become visible.
linkMap.wait.isVisible({
  timeout: 3000
});
```

If we assume that the group's `list` page node in the above code examples manages
two page elements, there is a total of 6 page element leaf nodes:

- The `element` page element.
- The two page elements managed by `list`.
- The `demo` and `examples` page elements managed by `map`.
- The `nestedElement` page element residing in the content of `nestedGroup`.

Each of these 6 page elements can take up to 3 seconds to become visible.
So in total, the maximum possible wait time for this `isVisible()` invocation is
18 seconds. If one or more leaf page elements of `group` do not become visible
within 3 seconds, an error will be thrown.

For more information on how to configure the `timeout` and `interval` of
state check functions defined on the `wait` API of a page node class,
please read the [`wait` API section](element.md#the-wait-api) of the `PageElement` guide.

### The `eventually` API

#### Overview

The `eventually` API of the `PageElementGroup` class checks if some or all of
the `PageNode` instances managed by a `PageElementGroup` eventually reach an
expected state within a specific timeout. It consists of state check functions only
that return `true` if all `PageNode` instances for which the state check function
was executed eventually reached the expected state within the specified timeout.
Otherwise, `false` will be returned.

If you use a [filter mask](#filter-masks), the `eventually` API only checks the
state of `PageElement` leaf nodes which are included by the group's filter mask.
Otherwise, the `eventually` API checks the state of all managed `PageElement`
leaf nodes of the group.

#### Timeout

Like for the `wait` API, for the `eventually` API too the `timeout` within which
the expected states of the `PageElement` leaf nodes must be reached applies to
each `PageElement` leaf node individually.

For more information on how to configure the `timeout` and `interval` of
state check functions defined on the `eventually` API of a page node class,
please read the [`eventually` API section](element.md#the-eventually-api) of the
`PageElement` guide.

## The `ValuePageElementGroup` Class

### Overview and Objective

If you want a group to manage page elements that are derived from the
`ValuePageElement` class, like in the case of HTML forms, you need to use a `ValuePageElementGroup` instead of a `PageElementGroup`.

The `ValuePageElementGroup` class adds the methods `getValue` and `setValue`
to set and retrieve the values of all page nodes managed by the group. Furthermore,
its `currently`, `wait` and `eventually` APIs include the state check functions
`hasValue`, `containsValue` and `hasAnyValue` to wait for or check if some or all
managed page nodes have certain expected values.

### Example Definition of a Form

*Please note that the following code is meant for demonstrative purposes only.
In a real use case, a group used to represent an HTML form usually only
manages different `ValuePageElement` classes and does not contain a
`ValuePageElementList`, `ValuePageElementMap` or a nested `ValuePageElementGroup`.
However, from a purely technical perspective, this would be possible.*

```typescript
export const feed = new FeedPage();

const container = stores.pageNode.Element(
  xpath('//div').id('groupContainer')
);

const form = stores.pageNode.ValueGroup({
  get email() {
    return container.$.Textfield(
      xpath('//div').attribute('role', 'textfield').id('username')
    );
  },
  get acceptTerms() {
    return container.$.Checkbox(
      xpath('//div').attribute('role', 'checkbox').id('acceptTerms')
    );
  },
  get country() {
    return container.$.Dropdown(
      xpath('//div').attribute('role', 'dropdown').id('country')
    );
  },
  get label() {
    return container.$.Element(
      xpath('//label')
    );
  },
  get inputList() {
    return container.$.InputList(
      xpath('//input').classContains('dynamicMetadata')
    );
  },
  get inputMap() {
    return container.$.InputMap(
      xpath('//input'), {
        identifier: {
          mappingObject: {
            username: 'username',
            password: 'password',

          },
          mappingFunc: (baseSelector, value) => xpath(baseSelector).id(value)
        }
      }
    );
  },
  get nestedForm() {
    return container.$.ValueGroup({
      get subscribe() {
        return container.$.Checkbox(
          xpath('//div').attribute('role', 'checkbox').id('acceptTerms')
        );
      },
    });
  }
});
```

Please notice that all page nodes of our `ValuePageElementGroup`, except for
the `label` page element, are either derived from `ValuePageElement` or a class
that manages a collection of `ValuePageElement` instances, like `ValuePageElementList`
and `ValuePageElementMap`. This means that all page nodes, except for `label`,
support the methods `setValue()` and `getValue()` as well as `hasValue()`,
`containsValue()` and `hasAnyValue()` which are defined on the `currently`,
`wait` and `eventually` APIs of the respective page nodes.

So why does our `form` include a `label` page element that is not derived
from `ValuePageElement` and does therefore not implement the `setValue()`
and `getValue()` methods? Well, even though all `value` related methods are
not supported, other state retrieval, state check and action functions still
also work with the `label` page element.

This means that you can call functions like `click()`, `getText()` or
`currently.isVisible()` on each page node of our `form` group, whereas
other methods like `setValue()` can only be invoked on these page nodes
which are derived from the `ValuePageElement` class are which manage instances
of `ValuePageElement` classes.

In the next section of this guide that shows you how to set the values of our
form's page nodes, you'll also see what happens of we try to set a value for
our `label` page element which does not support this operation.

### Setting Form Values

To set the values of our `form` group, we need to invoke its `setValue()` function:

```typescript
const enteredValues: Workflo.PageNode.ExtractValueStateChecker<(typeof form)['$']> = {
  email: 'john@doe.com',
  acceptTerms: true,
  country: 'Nepal',
  label: 123,
  inputList: ['FirstListValue', 'SecondListValue'],
  inputMap: {
    username: 'johnDoe',
    password: 'soSafe1234'
  },
  nestedForm: {
    subscribe: false
  }
};

form.setValue(enteredValues);
```

#### Declaring the type of our form's values

In the example above, we defined the values that we want to use to fill in our
form in the `enteredValues` variable. To find out which type our `enteredValues`
variable needs to have in order to be compatible with the `setValue()` function,
we can hover over the `setValue()` function and VS Code will show us the type
information for this function (alternatively, we can also hold Ctrl and click
on the function name to jump to its declaration):

![How to extract the type of the `values` parameter of `setValue()`](assets/group_extract.png)

In the type information popup, we can see that the type of our `enteredValues`
needs to be `Workflo.PageNode.ExtractValueStateChecker`. Each of wdio-workflo's
`ExtractXXX` types takes one type parameter: the type of the content of a
`PageElementGroup`. To retrieve the content type, we can use the `typeof` operator
to get the type of our `form` group and then access it's content via the `$` accessor:
`(typeof form)['$']`.

#### Skipping the `setValue()` function for certain page nodes

Although the above code example defines values for all page nodes of our group that
support the `setValue()` method, we do not need to do so. We could also only
provide values for some, or even only one page node. In this case, the invocation
of the `setValue()` method will be skipped for all page nodes for which we
did not provide values:

```typescript
// Invokes `setValue()` on the `email` and `acceptTerms` page nodes only.
form.setValue({
  email: 'john@doe.com',
  acceptTerms: true
});
```

#### Trying to set a value on a page node not derived from `ValuePageElement`

You might have noticed that our `setValue()` code example sets the values of all
page nodes except for the `label` page element. This is due to the fact that
`label` is not derived from `ValuePageElement` and therefore does not implement
the `setValue()` method. Wdio-workflo prevents you from accidentally setting
a value for `label` by setting the type of the `label` property of our `enteredValues`
object to `never`. So no matter which can of value you try to set for `label`,
TypeScript will always throw a compile error:

![Trying to set a value for a `PageElement`](assets/group_label_error.png)

![The type of the value of a `PageElement` is `never`](assets/group_label_error_full.png)

### Retrieving Form Values

To retrieve the values of our `form` group, we need to invoke its `getValue()`
method:

```typescript
const retrievedValues = form.getValue();

// `retrievedValues` contains:
//
// {
//   email: 'john@doe.com',
//   acceptTerms: true,
//   country: 'Nepal',
//   inputList: ['FirstListValue', 'SecondListValue'],
//   inputMap: {
//     username: 'johnDoe',
//     password: 'soSafe1234'
//   },
//   nestedForm: {
//     subscribe: false
//   }
// };
```

The result of the `getValue()` method is an object whose structure equals
the structure of the group`s content. However, the page node instances are
replaced by their values.

If we do not need to retrieve the values of all page nodes, we can skip
the `getValue()` function invocation for certain page nodes by using a
[filter mask](#filter-masks):

```typescript
const filteredRetrievedValues = form.getValue({
  email: false,
  country: true,
  inputList: [true, false],
  inputMap: {
    password: true
  },
  nestedForm: {
    subscribe: false
  }
});

// `filteredRetrievedValues` contains:
//
// {
//   email: undefined,
//   acceptTerms: undefined,
//   country: 'Nepal',
//   inputList: ['FirstListValue', undefined],
//   inputMap: {
//     username: undefined,
//     password: 'soSafe1234'
//   },
//   nestedForm: {
//     subscribe: undefined
//   }
// };
```

### Checking Form Values

To check the values of our `form` group, we could invoke the `hasValue()`,
`containsValue()` or `hasAnyValue()` functions defined on the `currently` and
`eventually` APIs of `ValuePageElementGroup` and then use the `expect()`
matcher to check if the resulting value is `true`.

However, this way the error messages thrown if the expectation fails are not
very meaningful.

A much better way to check if our `form` group's values equal certain expected
values is to pass our `form` group to `expectGroup` and invoke its
`toHaveValue()` or `toEventuallyHaveValue()` expectation matchers. This will
give us much more detailed error message in case the expected values do not
match the actual values of our `form`:

```typescript
const expectedValues: Workflo.PageNode.ExtractValueStateChecker<(typeof form)['$']> = {
  email: 'john@doe.com',
  country: 'Nepal',
  inputMap: {
    username: 'johnDoe'
  },
  nestedForm: { subscribe: true }
};

// If this expectation fails, the error message will simply say:
// 'Expected false to be true'.
expect(
  form.eventually.hasValue(expectedValues, { timeout: 3000 })
).toBe(true);

// If this expectation fails, the error message will tell you exactly
// which actual value did not match the expected value, print both values
// and the XPath of the respective page node.
expectGroup(form).toEventuallyHaveValue(expectedValues, { timeout: 3000 });
```

Please note that in the example above, the timeout of 3 seconds will be applied to
each "leaf page element" separately, so the total amount of time needed to complete
these checks can substantially exceed 3 seconds.

## No Need For Customization

Unlike a `PageElementList` or a `PageElementMap`, which are "bound" to a particular
`PageElement` class because they can only manage `PageElement` instances that are all
of the same class, a `PageElementGroup` can manage any combination of `PageNode`
instances of various classes. Therefore, we usually don't need to create custom `PageElementGroup` classes and we also don't have to add additional group factory
methods to a `PageNodeStore`. Instead, we can simply use the two factory
methods `ElementGroup()` and `ValueGroup()`, which already ship with wdio-workflo,
in pretty much any situation.
