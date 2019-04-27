---
id: xpathBuilder
title: XPath Builder
sidebar_label: XPath Builder
---

*Please be aware that wdio-workflo only supports XPath selectors because they are more "flexible" than CSS selectors
(eg. they support searching for a parent element) and because the performance differences are negligible in most cases.
Wdio-workflo also features an [XPath builder](./xpathBuilder.md) that you can use as an alternative to writing "raw"
XPath selector strings so that you do not need to remember all details of the XPath syntax which can be quite complex
in some scenarios. In addition, the XPath builder helps to make XPath expression more readable.*

getSelector -> see what built xpath looks like for page nodes