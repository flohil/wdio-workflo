"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const object_1 = require("./object");
/**
 * Converts strings, arrays and objects into objects.
 * valueFunc will be used to determine the object's
 * property values and can be either a func or a value.
 * valueFunc gets passed the array element or string as
 * value.
 * If switchKeyValue is true, the keys and values of the
 * resulting object will be switched.
 * If stackValues is true, a value for an exiting key
 * will not be replaced by a new value but added to an
 * array of values for the concerned key.
 *
 * If input is object, output remains the same object.
 * If input is string, output is an object with one
 * entry where the key is the string.
 * If input is array, output is an object where each key
 * represents one element in the array.
 *
 * @param unknownTypedInput
 * @param valueFunc
 * @param options
 */
function convertToObject(unknownTypedInput, valueFunc = undefined, options = { switchKeyValue: false, overwriteValues: false, stackValues: false }) {
    let obj = undefined;
    if (typeof unknownTypedInput !== 'undefined') {
        if (typeof unknownTypedInput === 'string') {
            unknownTypedInput = [unknownTypedInput];
        }
        if (_.isArray(unknownTypedInput)) {
            obj = {};
            for (const element of unknownTypedInput) {
                let value;
                if (typeof valueFunc === 'function') {
                    value = valueFunc(element);
                }
                else {
                    value = valueFunc;
                }
                const propKey = (options.switchKeyValue) ?
                    value :
                    element;
                const propValue = (options.switchKeyValue) ?
                    element :
                    value;
                // if object already has a key, make value array
                // instead of overwriting existing value
                if (propKey in obj && options.stackValues) {
                    const valueArray = [];
                    valueArray.push(obj[propKey]);
                    valueArray.push(propValue);
                    obj[propKey] = valueArray;
                }
                else {
                    obj[propKey] = propValue;
                }
            }
        }
        else {
            obj = unknownTypedInput;
            if (options.switchKeyValue) {
                obj = object_1.invert(obj);
            }
        }
    }
    return obj;
}
exports.convertToObject = convertToObject;
//# sourceMappingURL=util.js.map