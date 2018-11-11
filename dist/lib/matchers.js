"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./utility_functions/util");
const _ = require("lodash");
const helpers_1 = require("./helpers");
function matcherFunction(resultFunction, errorTextFunction, noArgs = false) {
    return (util, customEqualityTesters) => {
        function baseCompareFunction(node, negativeComparison, opts = Object.create(null), expected = undefined) {
            let result = {
                pass: true,
                message: ''
            };
            let negateAssertionResult = false;
            let defaultNegativeMessage = '';
            const successes = resultFunction({ node, expected, opts });
            const success = (negativeComparison) ? successes[1]() : successes[0]();
            if (!success) {
                let optsWithTimeout = opts || Object.create(null);
                if (typeof opts === 'undefined' || !opts['timeout']) {
                    optsWithTimeout.timeout = node.getTimeout();
                }
                const actual = node.currently.lastActualResult;
                const errorTexts = errorTextFunction({ actual, expected, opts: optsWithTimeout });
                let errorText = undefined;
                if (_.isArray(errorTexts)) {
                    if (negativeComparison && errorTexts.length > 1) {
                        errorText = errorTexts[1];
                    }
                    else {
                        errorText = errorTexts[0];
                    }
                }
                else {
                    if (negativeComparison) {
                        defaultNegativeMessage = ' not';
                    }
                    errorText = errorTexts;
                }
                result.pass = false;
                result.message = `Expected ${node.constructor.name}${defaultNegativeMessage}${errorText}.\n( ${node.getSelector()} )`;
            }
            return result;
        }
        if (noArgs) {
            return {
                compare: (node, opts) => {
                    return baseCompareFunction(node, false, opts);
                },
                negativeCompare: (node, opts) => {
                    return baseCompareFunction(node, true, opts);
                }
            };
        }
        else {
            return {
                compare: (node, expected, opts) => {
                    return baseCompareFunction(node, false, opts, expected);
                },
                negativeCompare: (node, expected, opts) => {
                    return baseCompareFunction(node, true, opts, expected);
                }
            };
        }
    };
}
function elementMatcherFunction(resultFunction, errorTextFunction) {
    return matcherFunction(resultFunction, errorTextFunction);
}
function elementMatcherNoArgsFunction(resultFunction, errorTextFunction) {
    return matcherFunction(resultFunction, errorTextFunction, true);
}
function listMatcherFunction(resultFunction, errorTextFunction) {
    return matcherFunction(resultFunction, errorTextFunction);
}
function listMatcherNoArgsFunction(resultFunction, errorTextFunction) {
    return matcherFunction(resultFunction, errorTextFunction, true);
}
function createLongErrorMessage(property, comparison, actual, expected) {
    return [
        `'s ${property} "${actual}" to ${comparison} "${expected}"`,
        `'s ${property} "${actual}" not to ${comparison} "${expected}"`,
    ];
}
function createEventuallyErrorMessage(property, comparison, actual, expected, timeout) {
    return [
        `'s ${property} "${actual}" to eventually ${comparison} "${expected}" within ${timeout} ms`,
        `'s ${property} "${actual}" not to eventually ${comparison} "${expected}" within ${timeout} ms`,
    ];
}
exports.elementMatchers = {
    toExist: elementMatcherFunction(({ node }) => [() => node.currently.exists(), () => node.currently.not.exists()], () => " to exist"),
    toBeVisible: elementMatcherFunction(({ node }) => [() => node.currently.isVisible(), () => node.currently.not.isVisible()], () => " to be visible"),
    toBeSelected: elementMatcherFunction(({ node }) => [() => node.currently.isSelected(), () => node.currently.not.isSelected()], () => " to be selected"),
    toBeEnabled: elementMatcherFunction(({ node }) => [() => node.currently.isEnabled(), () => node.currently.not.isEnabled()], () => " to be enabled"),
    toBeChecked: elementMatcherFunction(({ node }) => [() => node.currently.isChecked(), () => node.currently.not.isChecked()], () => " to be checked"),
    toHaveText: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.hasText(expected), () => node.currently.not.hasText(expected)
    ], ({ actual, expected }) => createLongErrorMessage('text', 'be', actual, expected)),
    toHaveAnyText: elementMatcherFunction(({ node }) => [() => node.currently.hasAnyText(), () => node.currently.not.hasAnyText()], () => " to have any text"),
    toContainText: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.containsText(expected), () => node.currently.not.containsText(expected)
    ], ({ actual, expected }) => createLongErrorMessage('text', 'contain', actual, expected)),
    toHaveValue: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected)
    ], ({ actual, expected }) => createLongErrorMessage('value', 'be', actual, expected)),
    toHaveAnyValue: elementMatcherFunction(({ node }) => [() => node.currently.hasAnyValue(), () => node.currently.not.hasAnyValue()], () => " to have any value"),
    toContainValue: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.containsValue(expected), () => node.currently.not.containsValue(expected)
    ], ({ actual, expected }) => createLongErrorMessage('value', 'contain', actual, expected)),
    toHaveHTML: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.hasHTML(expected), () => node.currently.not.hasHTML(expected)
    ], ({ actual, expected }) => createLongErrorMessage('HTML', 'be', actual, expected)),
    toHaveAnyHTML: elementMatcherFunction(({ node }) => [
        () => node.currently.hasAnyHTML(), () => node.currently.not.hasAnyHTML()
    ], () => ` to have any HTML`),
    toContainHTML: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.containsHTML(expected), () => node.currently.not.containsHTML(expected)
    ], ({ actual, expected }) => createLongErrorMessage('HTML', 'contain', actual, expected)),
    toHaveDirectText: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.hasDirectText(expected), () => node.currently.not.hasDirectText(expected)
    ], ({ actual, expected }) => createLongErrorMessage('direct text', 'be', actual, expected)),
    toHaveAnyDirectText: elementMatcherFunction(({ node }) => [
        () => node.currently.hasAnyDirectText(), () => node.currently.not.hasAnyDirectText()
    ], () => ` to have any direct text`),
    toContainDirectText: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.containsDirectText(expected), () => node.currently.not.containsDirectText(expected)
    ], ({ actual, expected }) => createLongErrorMessage('direct text', 'contain', actual, expected)),
    toHaveAttribute: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.hasAttribute(expected.name, expected.value),
        () => node.currently.not.hasAttribute(expected.name, expected.value),
    ], ({ actual, expected }) => createLongErrorMessage(expected.name, 'be', actual, expected.value)),
    toHaveAnyAttribute: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.hasAnyAttribute(expected.name),
        () => node.currently.not.hasAnyAttribute(expected.name),
    ], ({ expected }) => ` to have any ${expected.name}`),
    toContainAttribute: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.containsAttribute(expected.name, expected.value),
        () => node.currently.not.containsAttribute(expected.name, expected.value),
    ], ({ actual, expected }) => createLongErrorMessage(expected.name, 'contain', actual, expected.value)),
    toHaveClass: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.hasClass(expected), () => node.currently.not.hasClass(expected)
    ], ({ actual, expected }) => createLongErrorMessage('class', 'be', actual, expected)),
    toContainClass: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.containsClass(expected), () => node.currently.not.containsClass(expected)
    ], ({ actual, expected }) => createLongErrorMessage('class', 'contain', actual, expected)),
    toHaveId: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.hasId(expected), () => node.currently.not.hasId(expected)
    ], ({ actual, expected }) => createLongErrorMessage('id', 'be', actual, expected)),
    toHaveAnyId: elementMatcherFunction(({ node }) => [
        () => node.currently.hasAnyId(), () => node.currently.not.hasAnyId()
    ], () => ` to have any id`),
    toContainId: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.containsId(expected), () => node.currently.not.containsId(expected)
    ], ({ actual, expected }) => createLongErrorMessage('id', 'contain', actual, expected)),
    toHaveName: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.hasName(expected), () => node.currently.not.hasName(expected)
    ], ({ actual, expected }) => createLongErrorMessage('name', 'be', actual, expected)),
    toHaveAnyName: elementMatcherFunction(({ node }) => [
        () => node.currently.hasAnyName(), () => node.currently.not.hasAnyName()
    ], () => ` to have any name`),
    toContainName: elementMatcherFunction(({ node, expected }) => [
        () => node.currently.containsName(expected), () => node.currently.not.containsName(expected)
    ], ({ actual, expected }) => createLongErrorMessage('name', 'contain', actual, expected)),
    toHaveLocation: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.currently.hasLocation(expected, opts.tolerances),
        () => node.currently.not.hasLocation(expected, opts.tolerances)
    ], ({ actual, expected, opts }) => createLongErrorMessage('location', (opts.tolerances && (opts.tolerances.x > 0 || opts.tolerances.y > 0)) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerances))),
    toHaveX: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.currently.hasX(expected, opts.tolerance),
        () => node.currently.not.hasX(expected, opts.tolerance)
    ], ({ actual, expected, opts }) => createLongErrorMessage('X-coordinate', (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerance))),
    toHaveY: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.currently.hasY(expected, opts.tolerance),
        () => node.currently.not.hasY(expected, opts.tolerance)
    ], ({ actual, expected, opts }) => createLongErrorMessage('Y-coordinate', (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerance))),
    toHaveSize: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.currently.hasSize(expected, opts.tolerances),
        () => node.currently.not.hasSize(expected, opts.tolerances)
    ], ({ actual, expected, opts }) => createLongErrorMessage('size', (opts.tolerances && (opts.tolerances.width > 0 || opts.tolerances.height > 0)) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerances))),
    toHaveWidth: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.currently.hasWidth(expected, opts.tolerance),
        () => node.currently.not.hasWidth(expected, opts.tolerance)
    ], ({ actual, expected, opts }) => createLongErrorMessage('width', (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerance))),
    toHaveHeight: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.currently.hasHeight(expected, opts.tolerance),
        () => node.currently.not.hasHeight(expected, opts.tolerance)
    ], ({ actual, expected, opts }) => createLongErrorMessage('height', (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerance))),
    toEventuallyExist: elementMatcherNoArgsFunction(({ node, opts }) => [
        () => node.eventually.exists(opts), () => node.eventually.not.exists(opts)
    ], ({ opts }) => ` to eventually exist within ${opts.timeout} ms`),
    toEventuallyBeVisible: elementMatcherNoArgsFunction(({ node, opts }) => [
        () => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts)
    ], ({ opts }) => ` to eventually be visible within ${opts.timeout} ms`),
    toEventuallyBeSelected: elementMatcherNoArgsFunction(({ node, opts }) => [
        () => node.eventually.isSelected(opts), () => node.eventually.not.isSelected(opts)
    ], ({ opts }) => ` to eventually be selected within ${opts.timeout} ms`),
    toEventuallyBeEnabled: elementMatcherNoArgsFunction(({ node, opts }) => [
        () => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts)
    ], ({ opts }) => ` to eventually be enabled within ${opts.timeout} ms`),
    toEventuallyBeChecked: elementMatcherNoArgsFunction(({ node, opts }) => [
        () => node.eventually.isChecked(opts), () => node.eventually.not.isChecked(opts)
    ], ({ opts }) => ` to eventually be checked within ${opts.timeout} ms`),
    toEventuallyHaveText: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasText(expected, opts),
        () => node.eventually.not.hasText(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('text', 'be', actual, expected, opts.timeout)),
    toEventuallyHaveAnyText: elementMatcherNoArgsFunction(({ node }) => [
        () => node.eventually.hasAnyText(), () => node.eventually.not.hasAnyText()
    ], ({ opts }) => ` to eventually have any text within ${opts.timeout} ms`),
    toEventuallyContainText: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.containsText(expected, opts),
        () => node.eventually.not.containsText(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('text', 'contain', actual, expected, opts.timeout)),
    toEventuallyHaveValue: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasValue(expected, opts),
        () => node.eventually.not.hasValue(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('value', 'be', actual, expected, opts.timeout)),
    toEventuallyHaveAnyValue: elementMatcherNoArgsFunction(({ node, opts }) => [
        () => node.eventually.hasAnyValue(opts),
        () => node.eventually.not.hasAnyValue(opts)
    ], ({ opts }) => ` to eventually have any value within ${opts.timeout} ms`),
    toEventuallyContainValue: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.containsValue(expected, opts),
        () => node.eventually.not.containsValue(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('value', 'contain', actual, expected, opts.timeout)),
    toEventuallyHaveHTML: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasHTML(expected, opts),
        () => node.eventually.not.hasHTML(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('HTML', 'be', actual, expected, opts.timeout)),
    toEventuallyHaveAnyHTML: elementMatcherNoArgsFunction(({ node, opts }) => [
        () => node.eventually.hasAnyHTML(opts), () => node.eventually.not.hasAnyHTML(opts)
    ], ({ opts }) => ` to eventually have any HTML within ${opts.timeout} ms`),
    toEventuallyContainHTML: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.containsHTML(expected, opts),
        () => node.eventually.not.containsHTML(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('HTML', 'contain', actual, expected, opts.timeout)),
    toEventuallyHaveDirectText: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasDirectText(expected, opts),
        () => node.eventually.not.hasDirectText(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('direct text', 'be', actual, expected, opts.timeout)),
    toEventuallyHaveAnyDirectText: elementMatcherNoArgsFunction(({ node, opts }) => [
        () => node.eventually.hasAnyDirectText(opts),
        () => node.eventually.not.hasAnyDirectText(opts)
    ], ({ opts }) => ` to eventually have any direct text within ${opts.timeout} ms`),
    toEventuallyContainDirectText: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.containsDirectText(expected, opts),
        () => node.eventually.not.containsDirectText(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('direct text', 'contain', actual, expected, opts.timeout)),
    toEventuallyHaveAttribute: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasAttribute(expected.name, expected.value, opts),
        () => node.eventually.not.hasAttribute(expected.name, expected.value, opts),
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage(expected.name, 'be', actual, expected.value, opts.timeout)),
    toEventuallyHaveAnyAttribute: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasAnyAttribute(expected.name, opts),
        () => node.eventually.not.hasAnyAttribute(expected.name, opts),
    ], ({ expected, opts }) => ` to eventually have any ${expected.name} within ${opts.timeout} ms`),
    toEventuallyContainAttribute: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.containsAttribute(expected.name, expected.value, opts),
        () => node.eventually.not.containsAttribute(expected.name, expected.value, opts),
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage(expected.name, 'contain', actual, expected.value, opts.timeout)),
    toEventuallyHaveClass: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasClass(expected, opts),
        () => node.eventually.not.hasClass(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('class', 'be', actual, expected, opts.timeout)),
    toEventuallyContainClass: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.containsClass(expected, opts),
        () => node.eventually.not.containsClass(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('class', 'contain', actual, expected, opts.timeout)),
    toEventuallyHaveId: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasId(expected, opts),
        () => node.eventually.not.hasId(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('id', 'be', actual, expected, opts.timeout)),
    toEventuallyHaveAnyId: elementMatcherNoArgsFunction(({ node }) => [
        () => node.eventually.hasAnyId(), () => node.eventually.not.hasAnyId()
    ], ({ opts }) => ` to eventually have any id within ${opts.timeout} ms`),
    toEventuallyContainId: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.containsId(expected, opts),
        () => node.eventually.not.containsId(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('id', 'contain', actual, expected, opts.timeout)),
    toEventuallyHaveName: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasName(expected, opts),
        () => node.eventually.not.hasName(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('name', 'be', actual, expected, opts.timeout)),
    toEventuallyHaveAnyName: elementMatcherNoArgsFunction(({ node }) => [() => node.eventually.hasAnyName(), () => node.eventually.not.hasAnyName()], ({ opts }) => ` to eventually have any name within ${opts.timeout} ms`),
    toEventuallyContainName: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.containsName(expected, opts),
        () => node.eventually.not.containsName(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('name', 'contain', actual, expected, opts.timeout)),
    toEventuallyHaveLocation: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasLocation(expected, opts),
        () => node.eventually.not.hasLocation(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('location', (opts.tolerances && (opts.tolerances.x > 0 || opts.tolerances.y > 0)) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerances), opts.timeout)),
    toEventuallyHaveX: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasX(expected, opts), () => node.eventually.not.hasX(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('X-coordinate', (opts.tolerance && opts.tolerance > 0) ? 'be in range ' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerance), opts.timeout)),
    toEventuallyHaveY: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasY(expected, opts), () => node.eventually.not.hasY(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('Y-coordinate', (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerance), opts.timeout)),
    toEventuallyHaveSize: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasSize(expected, opts), () => node.eventually.not.hasSize(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('size', (opts.tolerances && (opts.tolerances.width > 0 || opts.tolerances.height > 0)) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerances), opts.timeout)),
    toEventuallyHaveWidth: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasWidth(expected, opts), () => node.eventually.not.hasWidth(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('width', (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerance), opts.timeout)),
    toEventuallyHaveHeight: elementMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasHeight(expected, opts),
        () => node.eventually.not.hasHeight(expected, opts)
    ], ({ actual, expected, opts }) => createEventuallyErrorMessage('height', (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerance), opts.timeout))
};
exports.listMatchers = {
    toBeEmpty: listMatcherFunction(({ node }) => [() => node.currently.isEmpty(), () => node.currently.not.isEmpty()], () => " to be empty"),
    toHaveLength: listMatcherFunction(({ node, expected, opts }) => [
        () => node.currently.hasLength(expected, opts.comparator),
        () => node.currently.not.hasLength(expected, opts.comparator)
    ], ({ actual, expected, opts }) => `'s length ${actual} to be${util_1.comparatorStr(opts.comparator)} ${expected}`),
    toEventuallyBeEmpty: listMatcherNoArgsFunction(({ node, opts }) => [
        () => node.eventually.isEmpty(opts), () => node.eventually.not.isEmpty(opts)
    ], ({ opts }) => ` to eventually be empty within ${opts.timeout} ms`),
    toEventuallyHaveLength: listMatcherFunction(({ node, expected, opts }) => [
        () => node.eventually.hasLength(expected, opts),
        () => node.eventually.not.hasLength(expected, opts)
    ], ({ actual, expected, opts }) => `'s length ${actual} to be${util_1.comparatorStr(opts.comparator)} ${expected} within ${opts.timeout} ms`),
};
function expectElement(element) {
    return expect(element);
}
exports.expectElement = expectElement;
function expectList(list) {
    return expect(list);
}
exports.expectList = expectList;
//# sourceMappingURL=matchers.js.map