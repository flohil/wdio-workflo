"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This enum describes the four possible initial waiting types supported by wdio-workflo.
 *
 * Every time an interaction with the tested application takes place via a PageElement's action (eg. click),
 * an initial wait condition will be performed before executing the specified action:
 *
 * - 'exist' waits for the PageElement to exist in the DOM
 * - 'visible' waits for the PageElement to become visible (this will not be the case if the
 * PageElement is obscured by another element, hidden or not existing )
 * - 'text' waits for the PageElement to have any text (this will not be the case if the PageElement does not exist,
 * is not visible, or has no text at all)
 * - 'value' waits for the PageElement to have any value (this will not be the case if the PageElement does not
 * exist, is not visible, or has no value at all)
 */
var WaitType;
(function (WaitType) {
    WaitType["exist"] = "exist";
    WaitType["visible"] = "visible";
    WaitType["text"] = "text";
    WaitType["value"] = "value";
})(WaitType = exports.WaitType || (exports.WaitType = {}));
/**
 * This enum is used to perform comparisons of numbers.
 */
var Comparator;
(function (Comparator) {
    Comparator["equalTo"] = "==";
    Comparator["lessThan"] = "<";
    Comparator["greaterThan"] = ">";
    Comparator["notEqualTo"] = "!=";
    Comparator["ne"] = "!=";
    Comparator["eq"] = "==";
    Comparator["lt"] = "<";
    Comparator["gt"] = ">";
})(Comparator = exports.Comparator || (exports.Comparator = {}));
//# sourceMappingURL=enums.js.map