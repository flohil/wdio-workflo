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
export declare enum WaitType {
    exist = "exist",
    visible = "visible",
    text = "text",
    value = "value"
}
/**
 * This enum is used to perform comparisons of numbers.
 */
export declare enum Comparator {
    equalTo = "==",
    lessThan = "<",
    greaterThan = ">",
    notEqualTo = "!=",
    ne = "!=",
    eq = "==",
    lt = "<",
    gt = ">"
}
