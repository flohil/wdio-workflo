---
id: getUid
title: The `getUid` Function
sidebar_label: The `getUid` Function
---

## Overview and Objective

Sometimes, a testcase creates entities that need to be uniquely identifiable.

Wdio-workflo's demo website, for example, has a feed page that displays a
list of feed items and each feed item describes a certain kind of animal.
The list of feed items can also be filtered and each animal name should be uniquely
identifiable, so that if we enter the term `"dog"` into the filterbox, only one
feed item with the name `"dog"` is displayed in the list.

Although the demo website offers no way to manually add a new animal feed item, let's
imagine for a moment that it did. How could we test that our new animal feed item was
created successfully? We could, for example, browse the feed item list and check if the new animal
name is displayed in the list.

Let's say that our new animal is a `"penguin"`. If our testcase executes successfully,
a new `"penguin"` feed item will be created and our testcase will be able to find
its feed item in the list of feed items by searching for the name `"penguin"`.

However, you often might want to execute a testcase several times during its development.
If we executed our testcase three times, there would now be three `"penguin"`
items in our animal feed item list if the creation of all three penguins was successful.
But what if the creation of one of our three penguins failed? How would we now
which one of our three penguins could not be created?

For this kind of problem, wdio-workflo provides a `getUid` function.
This function would make our penguins uniquely identifiable by appending an ID
to the name of the penguin, e.g. `"penguin_1"` and `"penguin_2"`.

## Usage

### Using `getUid`

The `guiUid` function is globally available and can therefore be invoked from
anywhere within your test code. It does not need to be imported from anywhere.

`getUid` takes one parameter:

- A string that should be made uniquely identifiable

On each invocation, `getUid` appends an underscore character followed by a counter
value to the string passed to `getUid`. The counter value initially starts at `0`.
So on its first invocation, `getUid` appends `_0` to the string passed to it,
and on its second invocation, `getUid` would append `_1` and so on:

```typescript
getUid('penguin') // return 'penguin_0'
getUid('penguin') // return 'penguin_1'
getUid('penguin') // return 'penguin_2'
```

### uidStore.json

The counter values for each string passed to the `getUid` function are stored in the file
`uidStore.json` located in the `data` folder of your system test directory.

You can reset all counter values by deleting this file, or you can modify the counter
value for a certain string by editing it in `uidStore.json`.
