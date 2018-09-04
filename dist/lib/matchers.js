"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function elementMatcherFunction(assertionFunction, errorText) {
    return (util, customEqualityTesters) => {
        return {
            compare: (element) => {
                let result = {
                    pass: true,
                    message: ''
                };
                if (!assertionFunction(element)) {
                    result.pass = false;
                    result.message = `${element.constructor.name} ${errorText}: ${element.getSelector()}`;
                }
                return result;
            }
        };
    };
}
exports.elementMatchers = {
    toExist: elementMatcherFunction(element => element.exists(), "does not exist")
};
function expectElement(element) {
    return expect(element);
}
exports.expectElement = expectElement;
//# sourceMappingURL=matchers.js.map