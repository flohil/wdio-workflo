"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
/**
 * Iterates over all properties in an object and executes
 * func on each.
 *
 * Returns a new object with the same keys as the input
 * object and the values as result of the func.
 *
 * @param obj an object for which a func should be executed on each property
 * @param func the function to be executed on each property of the passed object
 */
function mapProperties(obj, func) {
    if (_.isArray(obj)) {
        throw new Error(`Input must be an object: ${obj}`);
    }
    else {
        const resultObj = Object.create(Object.prototype);
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                resultObj[key] = func(obj[key], key);
            }
        }
        return resultObj;
    }
}
exports.mapProperties = mapProperties;
/**
 * Returns a new object with the original object's keys and values inverted.
 * The original object's values must therefore be implicitly convertable to type string.
 *
 * @param obj an object whose keys and values should be inverted
 */
function invert(obj) {
    const new_obj = {};
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            new_obj[obj[prop]] = prop;
        }
    }
    return new_obj;
}
exports.invert = invert;
//# sourceMappingURL=object.js.map