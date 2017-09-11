"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
/**
 * Converts strings, arrays and objects into objects.
 *
 * If input is string, output is an object with one
 * entry where the key is the string.
 * If input is array, output is an object where each key
 * represents one element in the array.
 * If input is object, output is a clone of the input object.
 *
 * For strings and arrays, valueFunc is used to calculate the
 * resulting object's property values.
 * For objects, valueFunc has no effect -> original property values will be preserved!
 *
 * @param unknownTypedInput
 * @param valueFunc
 */
function convertToObject(unknownTypedInput, valueFunc = undefined) {
    let obj = {};
    if (typeof unknownTypedInput !== 'undefined') {
        if (typeof unknownTypedInput === 'string') {
            unknownTypedInput = [unknownTypedInput];
        }
        if (_.isArray(unknownTypedInput)) {
            for (const element of unknownTypedInput) {
                let value;
                if (typeof valueFunc !== 'undefined') {
                    value = valueFunc(element);
                }
                else {
                    value = undefined;
                }
                obj[element] = value;
            }
        }
        else {
            obj = _.cloneDeep(unknownTypedInput);
        }
    }
    return obj;
}
exports.convertToObject = convertToObject;
function compare(var1, var2, operator) {
    switch (operator) {
        case "==" /* equalTo */ || "==" /* eq */:
            return var1 === var2;
        case "!=" /* notEqualTo */ || "!=" /* ne */:
            return var1 !== var2;
        case ">" /* greaterThan */ || ">" /* gt */:
            return var1 > var2;
        case "<" /* lessThan */ || "<" /* lt */:
            return var1 < var2;
    }
}
exports.compare = compare;
//# sourceMappingURL=util.js.map