---
id: store
title: Store
sidebar_label: Store
---

## Overview

### Objective

Writing tests with wdio-workflo, you should never manually create instances of a `PageNode` class.
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

## Factory Methods

### Parameters

### Body

default configuration

## Initializer Functions

`PageNode` instances are considered identical if they have the same XPath selectors, class types and option parameters.


### _getElement

### _getList

quick: List()

### _getMap

### _getGroup4

## Accessing a `PageNodeStore` Instance


Therefore, ach `Page` and `PageNode` class is associated with a `PageNodeStore`


 and holds a
reference to an instance of this `PageNodeStore` inside their `_store` class members.



page and pageNode


Link to customPageNodes for how to add new page nodes to store