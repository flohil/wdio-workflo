"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function elementMatcherFunction(resultFunction, assertionFunction, errorTextFunction) {
    return (util, customEqualityTesters) => {
        return {
            compare: (element, expected) => {
                let result = {
                    pass: true,
                    message: ''
                };
                const actual = resultFunction(element, expected);
                if (!assertionFunction(actual, expected)) {
                    result.pass = false;
                    result.message = `Expected ${element.constructor.name}${errorTextFunction(actual, expected)}.\n( ${element.getSelector()} )`;
                }
                return result;
            }
        };
    };
}
exports.elementMatchers = {
    toExist: elementMatcherFunction(element => element.exists(), actual => actual === true, () => " to exist"),
    toBeVisible: elementMatcherFunction(element => element.isVisible(), actual => actual === true, () => " to be visible"),
    toBeHidden: elementMatcherFunction(element => element.isVisible(), actual => actual === false, () => " to be hidden"),
    toBeEnabled: elementMatcherFunction(element => element.isEnabled(), actual => actual === true, () => " to be enabled"),
    toBeDisabled: elementMatcherFunction(element => element.isEnabled(), actual => actual === false, () => " to be disabled"),
    toBeSelected: elementMatcherFunction(element => element.isSelected(), actual => actual === true, () => " to be selected"),
    toHaveText: elementMatcherFunction((element) => element.getText(), (actual, expected) => (typeof expected !== 'undefined') ? actual === expected : actual.length > 0, (actual, expected) => (typeof expected !== 'undefined')
        ? `'s text "${actual}" to be "${expected}"` : ' to have any text'),
    toContainText: elementMatcherFunction((element) => element.getText(), (actual, expected) => (typeof expected !== 'undefined') ? actual.indexOf(expected) > -1 : actual.length > 0, (actual, expected) => (typeof expected !== 'undefined')
        ? `'s text "${actual}" to contain "${expected}"` : ' to contain any text'),
    toHaveValue: elementMatcherFunction((element) => element.getValue(), (actual, expected) => (typeof expected !== 'undefined') ? actual === expected : actual.length > 0, (actual, expected) => (typeof expected !== 'undefined')
        ? `'s value "${actual}" to be "${expected}"` : ' to have any value'),
    toContainValue: elementMatcherFunction((element) => element.getValue(), (actual, expected) => (typeof expected !== 'undefined') ? actual.indexOf(expected) > -1 : actual.length > 0, (actual, expected) => (typeof expected !== 'undefined')
        ? `'s value "${actual}" to contain "${expected}"` : 'to contain any value')
};
function expectElement(element) {
    return expect(element);
}
exports.expectElement = expectElement;
//# sourceMappingURL=matchers.js.map