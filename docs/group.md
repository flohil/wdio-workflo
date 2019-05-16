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

### State Retrieval Functions

State retrieval functions of the `PageElementMap` class fulfil the same purpose
as those of the `PageElement` class: For each `PageElement` instance managed by the
map, they retrieve the value of a certain attribute of the HTML element that is
wrapped by `PageElement` from the website. They return an object whose keys are
taken from the map's `mappingObject` and whose values represent the values
of the retrieved HTML attribute for each `PageElement`:

```typescript
import { stores } from '?/page_objects';

const linkMap = stores.pageNode.ElementMap('//a', {
  identifier: {
    mappingObject: {
      demo: 'Demo Page',
      api: 'API'
    },
    mappingFunc: (baseSelector, value) => xpath(baseSelector).text(value)
  }
});

const linkTexts = linkMap.getText();
```

In the above examples, the `linkTexts` variable would now store
`{demo: 'Demo Page', api: 'API'}`;

Internally, `PageElementMap` simply iterates over all of its managed
`PageElement` instances and invokes the respective state retrieval function
on each `PageElement`. You can also skip the invocation of the state retrieval
function for certain `PageElement` instances by using a filter mask. The
[Filter Masks section](#filter-masks) of this guide shows you how to do that.

For more information about the types of available state retrieval functions,
please read the [State Retrieval Functions section](element.md#state-retrieval-functions)
of the `PageElement` guide.

### Action Functions

Action functions change the state of the tested web application by interacting
with HTML elements that are mapped by `PageElement` instances. To execute an
action function on each `PageElement` instance managed by a `PageElementMap`,
you have two options:

- You can access each `PageElement` instance via the `$` accessor and invoke an
action function on each.
- You can use the `eachDo()` method of the `PageElementMap` which automatically
loops over the `PageElementMap` instances and invokes an action function which
you need to pass to `eachDo()` on each page element. Using `eachDo()` allows you to
optionally pass a [filter mask](#filter-masks) as second parameter to skip the action
function's invocation for certain `PageElement` instances.

The following code example compares both options for executing action functions
on each element of a list:

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

// Click on each page element of the map after accessing the page elements via the `$` accessor.
linkMap.$.demo.click();
linkMap.$.examples.click();
linkMap.$.api.click();

// Clicks on the `demo` and the `api` but not on the `examples` page element of
// `linkMap` because `examples` is not included in the filter mask.
linkMap.eachDo(
  linkElement => linkElement.click(),
  {
    demo: true,
    api: true
  }
);
```

For more information about the types of available action functions,
please read the [Action Functions section](element.md#action-functions) of the `PageElement` guide.

### State Check Functions

The state check functions of the `PageElementMap` class let you check if all
or some of the `PageElement` instances managed by a `PageElementMap` currently
or eventually have an expected state. They also allow you to wait for some or all
page elements of a map to reach an expected state within a specific timeout.

If a state check function of `PageElementMap` requires you to pass the expected
attribute states as a parameter, this parameter needs to be an object whose
keys are taken from the map's `mappingObject` and whose values represent the values
of the checked HTML attribute for each `PageElement` instance. If you omit
a property representing a certain page element in the parameter object, the
invocation of the state check function will be skipped for this page element.

For state check functions that do not require you to pass the expected attribute
states as a parameter, you can use a [filter mask](#filter-masks) to skip the
invocation of the state check function for certain `PageElement` instances.

The following code example demonstrates the usage of the state check functions
of a `PageElementList`:

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

// Checks if the text of the `demo` element is 'Demo Page', the text of the `examples`
// element is 'Examples' and the text of the `api` element is 'API'.
linkMap.currently.hasText({
  demo: 'Demo Page',
  examples: 'Examples',
  api: 'API'
});

// Checks if the `demo` and the `api` element of the map currently have any text.
linkMap.currently.hasAnyText({
  demo: true,
  api: true
});

// Waits for all elements of the map to become visible.
linkMap.wait.isVisible();

// Waits until the `demo` and `examples` elements of the map are not/no longer visible.
linkMap.wait.not.isVisible({ filterMask: {
  demo: true,
  examples: true,
  api: false,
}});

// Checks if the text of the `demo` element does not eventually contain the string 'ap'
// and if the text of the `api` element does not eventually contain the string 'em'.
linkMap.eventually.not.containsText({
  demo: 'ap',
  api: 'em'
});
```

To find out how state check functions behave differently when invoked on the
`currently`, `wait` or `eventually` API of a `PageElementMap`, please read the
corresponding sections of this guide:
[The `currently` API](#the-currently-api),
[The `wait` API](#the-wait-api),
[The `eventually` API](#the-eventually-api).

For more information about the types of available state check functions,
please read the [State Check Functions section](element.md#state-check-functions) of the `PageElement` guide.

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

The explicit waiting mechanisms of `PageElementMap` are very similar to the
ones used by `PageElement` and you should read about them in the
[Explicit Waiting](element.md#explicit-waiting-currently-wait-and-eventually)
section of the [`PageElement` guide](element.md) before you continue reading
this guide.

To learn how the behavior of state retrieval and state check functions of the `PageElementMap` class differs from its `PageElement` class equivalents, please
read the [State Function Types section of this guide](#state-function-types).
The types of available state retrieval and state check functions can be
found in the [State Function Types section of the `PageElement` guide](element.md#state-function-types) .

### The `currently` API

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

### The `wait` API

#### Overview

The `wait` API of the `PageElementMap` class allows you to explicitly wait
for some or all of the list's managed `PageElement` instances to have an expected
state. It consists of state check functions only which all return an instance
of the `PageElementList`.

If you use a [filter mask](#filter-masks), the `wait` API only waits for the
`PageElement` instances included by the filter mask to reach an expected state.
Otherwise, the `wait` API waits for all managed `PageElement` instances to reach
their expected state. If one or more `PageElement` instance fail to reach their
expected state within a specific timeout, an error will be thrown.

#### Timeout

The `timeout` within which the expected states of the `PageElement` instances must
be reached applies to each `PageElement` instance individually. So, if the `timeout`
was 3000 milliseconds, each `PageElement` instance managed by the map is allowed
to take up to 3 seconds to reach its expected state:

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
  }
});

linkMap.wait.isVisible({
  timeout: 3000,
  filterMask: {
    demo: true,
    api: true
  }
});
```

In the code example above, both the `demo` and the `api` page element of `linkMap`
can take up to 3 seconds to become visible. So in total, the maximum possible wait
time for this `isVisible` invocation is 6 seconds. If either the `demo`, or the `api`,
or both page elements do not become visible within 3 seconds, `wait.isVisible`
will throw an error.

For more information on how to configure the `timeout` and `interval` of
state check functions defined on the `wait` API of a page node class,
please read the [`wait` API section](element.md#the-wait-api) of the `PageElement` guide.

### The `eventually` API

#### Overview

The `eventually` API of the `PageElementMap` class checks if some or all of
the `PageElement` instances managed by a `PageElementMap` eventually reach an
expected state within a specific timeout. It consists of state check functions only
that return `true` if all `PageElement` instances for which the state check function
was executed eventually reached the expected state within specified the timeout.
Otherwise, `false` will be returned.

If you use a [filter mask](#filter-masks), the `eventually` API only checks the
state of `PageElement` instances which are included by the filter mask. Otherwise,
the `eventually` API checks the state of all managed `PageElement` instances.

#### Timeout

Like for the `wait` API, for the `eventually` API too the `timeout` within which
the expected states of the `PageElement` instances must be reached applies to
each `PageElement` instance individually.

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
