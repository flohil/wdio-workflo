"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function elementMatcherFunction(resultFunction, errorTextFunction) {
    return (util, customEqualityTesters) => {
        function baseCompareFunction(element, expected, negativeComparison, timeout) {
            let result = {
                pass: true,
                message: ''
            };
            let negateAssertionResult = false;
            let defaultNegativeMessage = '';
            const successes = resultFunction({ element, expected, timeout });
            const success = (negativeComparison) ? successes[1] : successes[0];
            if (!success) {
                if (typeof timeout === 'undefined') {
                    timeout = element.getTimeout();
                }
                const actual = element.lastActualResult;
                const errorTexts = errorTextFunction({ actual, expected, timeout });
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
            compare: (element, expected, timeout) => {
                return baseCompareFunction(element, expected, false, timeout);
            },
            negativeCompare: (element, expected, timeout) => {
                return baseCompareFunction(element, expected, true, timeout);
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
    toHaveClass: elementMatcherFunction(({ element, expected }) => [element.currently.hasClass(expected), element.currently.not.hasClass(expected)], ({ actual, expected }) => createLongErrorMessage('class', 'be', actual, expected)),
    toContainClass: elementMatcherFunction(({ element, expected }) => [element.currently.containsClass(expected), element.currently.not.containsClass(expected)], ({ actual, expected }) => createLongErrorMessage('class', 'contain', actual, expected)),
};
function expectElement(element) {
    return expect(element);
}
exports.expectElement = expectElement;
//# sourceMappingURL=matchers.js.map