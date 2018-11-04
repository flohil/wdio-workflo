"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function elementMatcherFunction(resultFunction, assertionFunction, errorTextFunction) {
    return (util, customEqualityTesters) => {
        function baseCompareFunction(element, expected, negativeComparison, timeout) {
            let result = {
                pass: true,
                message: ''
            };
            let negateAssertionResult = false;
            let defaultNegativeMessage = '';
            const actuals = resultFunction({ element, expected, timeout });
            let actual = undefined;
            if (_.isArray(actuals)) {
                if (negativeComparison && actuals.length > 1) {
                    actual = actuals[1];
                    console.log("in not result");
                }
                else {
                    actual = actuals[0];
                }
            }
            else {
                actual = actuals;
            }
            const successes = (typeof actual === 'boolean') ? actual : assertionFunction(actual, expected);
            let success = undefined;
            if (_.isArray(successes)) {
                if (negativeComparison) {
                    if (successes.length > 1) {
                        success = successes[1];
                        console.log("in not assertion");
                    }
                    else {
                        success = !successes[0];
                    }
                }
                else {
                    success = successes[0];
                }
            }
            else {
                if (negativeComparison) {
                    success = !successes;
                }
                else {
                    success = successes;
                }
            }
            if (!success) {
                if (typeof timeout === 'undefined') {
                    timeout = element.getTimeout();
                }
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
// TODO: add not functions for eventually not
exports.elementMatchers = {
    toExist: elementMatcherFunction(({ element }) => element._exists(), actual => actual === true, () => " to exist"),
    toBeVisible: elementMatcherFunction(({ element }) => element._isVisible(), actual => actual === true, () => " to be visible"),
    toBeSelected: elementMatcherFunction(({ element }) => element._isSelected(), actual => actual === true, () => " to be selected"),
    toBeEnabled: elementMatcherFunction(({ element }) => element._isEnabled(), actual => actual === true, () => " to be selected"),
    toHaveClass: elementMatcherFunction(({ element }) => element.getClass(), (actual, expected) => actual === expected, ({ actual, expected }) => createLongErrorMessage('class', 'be', actual, expected)),
    toContainClass: elementMatcherFunction(({ element }) => element.getClass(), (actual, expected) => actual.indexOf(expected) > -1, ({ actual, expected }) => createLongErrorMessage('class', 'contain', actual, expected)),
    toHaveText: elementMatcherFunction(({ element }) => element.getText(), (actual, expected) => actual === expected, ({ actual, expected }) => createLongErrorMessage('text', 'be', actual, expected)),
    toHaveAnyText: elementMatcherFunction(({ element }) => element.getText(), (actual) => actual.length > 0, () => " to have any text"),
    toContainText: elementMatcherFunction(({ element }) => element.getText(), (actual, expected) => actual.indexOf(expected) > -1, ({ actual, expected }) => createLongErrorMessage('text', 'contain', actual, expected)),
    toHaveValue: elementMatcherFunction(({ element }) => element.getValue(), (actual, expected) => actual === expected, ({ actual, expected }) => createLongErrorMessage('value', 'be', actual, expected)),
    toHaveAnyValue: elementMatcherFunction(({ element }) => element.getValue(), (actual) => actual.length > 0, () => " to have any value"),
    toContainValue: elementMatcherFunction(({ element }) => element.getValue(), (actual, expected) => actual.indexOf(expected) > -1, ({ actual, expected }) => createLongErrorMessage('value', 'contain', actual, expected)),
};
function expectElement(element) {
    return expect(element);
}
exports.expectElement = expectElement;
//# sourceMappingURL=matchers.js.map