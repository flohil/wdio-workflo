"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const helpers_1 = require("./helpers");
function elementMatcherFunction(resultFunction, errorTextFunction) {
    return (util, customEqualityTesters) => {
        function baseCompareFunction(element, expected, negativeComparison, opts) {
            let result = {
                pass: true,
                message: ''
            };
            let negateAssertionResult = false;
            let defaultNegativeMessage = '';
            const successes = resultFunction({ element, expected, opts });
            const success = (negativeComparison) ? successes[1] : successes[0];
            if (!success) {
                let optsWithTimeout = opts || Object.create(null);
                if (typeof opts === 'undefined' || !opts['timeout']) {
                    optsWithTimeout.timeout = element.getTimeout();
                }
                const actual = element.lastActualResult;
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
                result.message = `Expected ${element.constructor.name}${defaultNegativeMessage}${errorText}.\n( ${element.getSelector()} )`;
            }
            return result;
        }
        return {
            compare: (element, expected, opts) => {
                return baseCompareFunction(element, expected, false, opts);
            },
            negativeCompare: (element, expected, opts) => {
                return baseCompareFunction(element, expected, true, opts);
            }
        };
    };
}
function createLongErrorMessage(property, comparison, actual, expected) {
    return [
        `'s ${property} "${actual}" to ${comparison} "${expected}"`,
        `'s ${property} "${actual}" not to ${comparison} "${expected}"`,
    ];
}
exports.elementMatchers = {
    toExist: elementMatcherFunction(({ element }) => [element.currently.exists(), element.currently.not.exists()], () => " to exist"),
    toBeVisible: elementMatcherFunction(({ element }) => [element.currently.isVisible(), element.currently.not.isVisible()], () => " to be visible"),
    toBeSelected: elementMatcherFunction(({ element }) => [element.currently.isSelected(), element.currently.not.isSelected()], () => " to be selected"),
    toBeEnabled: elementMatcherFunction(({ element }) => [element.currently.isEnabled(), element.currently.not.isEnabled()], () => " to be selected"),
    toHaveText: elementMatcherFunction(({ element, expected }) => [element.currently.hasText(expected), element.currently.not.hasText(expected)], ({ actual, expected }) => createLongErrorMessage('text', 'be', actual, expected)),
    toHaveAnyText: elementMatcherFunction(({ element }) => [element.currently.hasAnyText(), element.currently.not.hasAnyText()], () => " to have any text"),
    toContainText: elementMatcherFunction(({ element, expected }) => [element.currently.containsText(expected), element.currently.not.containsText(expected)], ({ actual, expected }) => createLongErrorMessage('text', 'contain', actual, expected)),
    toHaveValue: elementMatcherFunction(({ element, expected }) => [element.currently.hasValue(expected), element.currently.not.hasValue(expected)], ({ actual, expected }) => createLongErrorMessage('value', 'be', actual, expected)),
    toHaveAnyValue: elementMatcherFunction(({ element }) => [element.currently.hasAnyValue(), element.currently.not.hasAnyValue()], () => " to have any value"),
    toContainValue: elementMatcherFunction(({ element, expected }) => [element.currently.containsValue(expected), element.currently.not.containsValue(expected)], ({ actual, expected }) => createLongErrorMessage('value', 'contain', actual, expected)),
    toHaveHTML: elementMatcherFunction(({ element, expected }) => [element.currently.hasHTML(expected), element.currently.not.hasHTML(expected)], ({ actual, expected }) => createLongErrorMessage('HTML', 'be', actual, expected)),
    toHaveAnyHTML: elementMatcherFunction(({ element }) => [element.currently.hasAnyHTML(), element.currently.not.hasAnyHTML()], () => ` to have any HTML`),
    toContainHTML: elementMatcherFunction(({ element, expected }) => [element.currently.containsHTML(expected), element.currently.not.containsHTML(expected)], ({ actual, expected }) => createLongErrorMessage('HTML', 'contain', actual, expected)),
    toHaveDirectText: elementMatcherFunction(({ element, expected }) => [element.currently.hasDirectText(expected), element.currently.not.hasDirectText(expected)], ({ actual, expected }) => createLongErrorMessage('direct text', 'be', actual, expected)),
    toHaveAnyDirectText: elementMatcherFunction(({ element }) => [element.currently.hasAnyDirectText(), element.currently.not.hasAnyDirectText()], () => ` to have any direct text`),
    toContainDirectText: elementMatcherFunction(({ element, expected }) => [element.currently.containsDirectText(expected), element.currently.not.containsDirectText(expected)], ({ actual, expected }) => createLongErrorMessage('direct text', 'contain', actual, expected)),
    toHaveAttribute: elementMatcherFunction(({ element, expected }) => [
        element.currently.hasAttribute(expected.name, expected.value),
        element.currently.not.hasAttribute(expected.name, expected.value),
    ], ({ actual, expected }) => createLongErrorMessage(expected.name, 'be', actual, expected.value)),
    toHaveAnyAttribute: elementMatcherFunction(({ element, expected }) => [
        element.currently.hasAnyAttribute(expected.name),
        element.currently.not.hasAnyAttribute(expected.name),
    ], ({ expected }) => ` to have any ${expected.name}`),
    toContainAttribute: elementMatcherFunction(({ element, expected }) => [
        element.currently.containsAttribute(expected.name, expected.value),
        element.currently.not.containsAttribute(expected.name, expected.value),
    ], ({ actual, expected }) => createLongErrorMessage(expected.name, 'contain', actual, expected.value)),
    toHaveClass: elementMatcherFunction(({ element, expected }) => [element.currently.hasClass(expected), element.currently.not.hasClass(expected)], ({ actual, expected }) => createLongErrorMessage('class', 'be', actual, expected)),
    toContainClass: elementMatcherFunction(({ element, expected }) => [element.currently.containsClass(expected), element.currently.not.containsClass(expected)], ({ actual, expected }) => createLongErrorMessage('class', 'contain', actual, expected)),
    toHaveId: elementMatcherFunction(({ element, expected }) => [element.currently.hasId(expected), element.currently.not.hasId(expected)], ({ actual, expected }) => createLongErrorMessage('id', 'be', actual, expected)),
    toHaveAnyId: elementMatcherFunction(({ element }) => [element.currently.hasAnyId(), element.currently.not.hasAnyId()], () => ` to have any id`),
    toContainId: elementMatcherFunction(({ element, expected }) => [element.currently.containsId(expected), element.currently.not.containsId(expected)], ({ actual, expected }) => createLongErrorMessage('id', 'contain', actual, expected)),
    toHaveName: elementMatcherFunction(({ element, expected }) => [element.currently.hasName(expected), element.currently.not.hasName(expected)], ({ actual, expected }) => createLongErrorMessage('name', 'be', actual, expected)),
    toHaveAnyName: elementMatcherFunction(({ element }) => [element.currently.hasAnyName(), element.currently.not.hasAnyName()], () => ` to have any name`),
    toContainName: elementMatcherFunction(({ element, expected }) => [element.currently.containsName(expected), element.currently.not.containsName(expected)], ({ actual, expected }) => createLongErrorMessage('name', 'contain', actual, expected)),
    toHaveLocation: elementMatcherFunction(({ element, expected, opts }) => [element.currently.hasLocation(expected, opts.tolerances), element.currently.not.hasLocation(expected, opts.tolerances)], ({ actual, expected, opts }) => createLongErrorMessage('location', (opts.tolerances && (opts.tolerances.x > 0 || opts.tolerances.y > 0)) ? 'be within' : 'be', helpers_1.tolerancesObjectToString(actual), helpers_1.tolerancesObjectToString(expected))),
    toHaveX: elementMatcherFunction(({ element, expected, opts }) => [element.currently.hasX(expected, opts.tolerance), element.currently.not.hasX(expected, opts.tolerance)], ({ actual, expected, opts }) => createLongErrorMessage('x', (opts.tolerance && opts.tolerance > 0) ? 'be within' : 'be', helpers_1.tolerancesObjectToString(actual), helpers_1.tolerancesObjectToString(expected))),
    toHaveY: elementMatcherFunction(({ element, expected, opts }) => [element.currently.hasY(expected, opts.tolerance), element.currently.not.hasY(expected, opts.tolerance)], ({ actual, expected, opts }) => createLongErrorMessage('y', (opts.tolerance && opts.tolerance > 0) ? 'be within' : 'be', helpers_1.tolerancesObjectToString(actual), helpers_1.tolerancesObjectToString(expected))),
    toHaveSize: elementMatcherFunction(({ element, expected, opts }) => [element.currently.hasSize(expected, opts.tolerances), element.currently.not.hasSize(expected, opts.tolerances)], ({ actual, expected, opts }) => createLongErrorMessage('size', (opts.tolerances && (opts.tolerances.width > 0 || opts.tolerances.height > 0)) ? 'be within' : 'be', helpers_1.tolerancesObjectToString(actual), helpers_1.tolerancesObjectToString(expected))),
    toHaveWidth: elementMatcherFunction(({ element, expected, opts }) => [element.currently.hasWidth(expected, opts.tolerance), element.currently.not.hasWidth(expected, opts.tolerance)], ({ actual, expected, opts }) => createLongErrorMessage('width', (opts.tolerance && opts.tolerance > 0) ? 'be within' : 'be', helpers_1.tolerancesObjectToString(actual), helpers_1.tolerancesObjectToString(expected))),
    toHaveHeight: elementMatcherFunction(({ element, expected, opts }) => [element.currently.hasHeight(expected, opts.tolerance), element.currently.not.hasHeight(expected, opts.tolerance)], ({ actual, expected, opts }) => createLongErrorMessage('height', (opts.tolerance && opts.tolerance > 0) ? 'be within' : 'be', helpers_1.tolerancesObjectToString(actual), helpers_1.tolerancesObjectToString(expected))),
};
function expectElement(element) {
    return expect(element);
}
exports.expectElement = expectElement;
//# sourceMappingURL=matchers.js.map