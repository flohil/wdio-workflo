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

Wdio-workflo's `PageElementList` class manages a dynamic collection of
`PageElement` instances. Dynamic means that the contents of the collection/the
individual page elements managed by the collection are not known at compile time
and can change during runtime.

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

how to construct and types -> elementFunc, elementOpts

## Accessing List Elements

### `first`, `at` and `all`

first, at, all

### `where` Builder

where builder -> getFirst, getAt, getAll, getList -> sublist

### The Underlying WebdriverIO Elements

elements -> wrapper for browser.elements

## State Retrieval and State Check Functions

### Reading the List Length

getLength,

hasLength (with comparators) and is empty with currently, wait, eventually

getText etc of all elements - with filtermask

### `currently`, `wait` and `eventually`

exists, isVisible, isEnabled
hasValue
other statate check funcs -> hasText take single value or array -> true
if all match - filtermask???

currently, wait, eventually -> link to page element guide

not

any and none

## ValuePageElementList

Whenever you want a list to manage page elements that are derived from the
`ValuePageElement` class, you need to use a `ValuePageElementList` instead
of a `PageElementList`.

However, since `ValuePageElement` is an abstract class and you need to extend

InputList example -> ValueList initializer function

if extend list with additional functionality, your list should extend
ValuePageelementList if it manages page elements derived from `ValuePageElement` class.

You can read more about how to do this in the [Extending `ValuePageElement`](customElement.md#extending-valuepageelement)
section of the [Customizing an Element](customElement.md) guide.
