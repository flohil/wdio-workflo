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
 * @param input
 * @param func
 */
function mapProperties(input, func) {
    if (_.isArray(input)) {
        throw new Error(`Input must be an object: ${input}`);
    }
    else {
        let resultObj = Object.create(Object.prototype);
        for (const key in input) {
            if (input.hasOwnProperty(key)) {
                const propRes = func(input[key], key);
                resultObj[key] = func(input[key], key);
            }
        }
        return resultObj;
    }
}
exports.mapProperties = mapProperties;
/**
 * Iterates over all properties in an object and executes func on each.
 *
 * @param input
 * @param func
 */
function forEachProperty(input, func) {
    for (const key in input) {
        if (input.hasOwnProperty(key)) {
            func(input[key], key);
        }
    }
    return this;
}
exports.forEachProperty = forEachProperty;
// inverts an object's keys and values.
/**
 * Returns a new object with the original object's keys and values inverted.
 * The original object's values must therefore be implicitly convertable to type string.
 *
 * @param obj
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
/**
 * Returns a new filtered object that only contains those
 * properties of the initial object where func returned true.
 *
 * Does not traverse nested objects!
 *
 * @param obj
 * @param func
 */
function filter(obj, func) {
    const resultObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (func(obj[key], key)) {
                resultObj[key] = obj[key];
            }
        }
    }
    return resultObj;
}
exports.filter = filter;
/**
 * If key already exists in obj, turns respective value
 * into array and pushes value onto the array.
 * Else, adds "normal" key-value pair as property.
 * If overwrite is true, always overwrites existing value
 * with new value without turning it into array.
 *
 * @param obj
 * @param key
 * @param value
 * @param overwrite
 */
function addToProp(obj, key, value, overwrite = false) {
    if (obj[key] && !overwrite) {
        let valueArr = [];
        valueArr = valueArr.concat(obj[key]);
        valueArr.push(value);
        obj[key] = valueArr;
    }
    else {
        obj[key] = value;
    }
    return this;
}
exports.addToProp = addToProp;
/**
 * Creates a copy of original object in which all
 * key-value pairs matching the passed props are removed.
 *
 * @param obj
 * @param props
 */
function stripProps(obj, props) {
    const resObj = _.cloneDeep(obj);
    for (const prop of props) {
        delete resObj[prop];
    }
    return resObj;
}
exports.stripProps = stripProps;
/**
 * Returns properties of obj whose keys are also present in
 * subsetObj as a new object.
 *
 * Does not traverse nested objects!
 *
 * @param obj
 * @param matchingObject
 */
function subset(obj, maskObject) {
    return filter(obj, (value, key) => {
        return key in maskObject;
    });
}
exports.subset = subset;
//# sourceMappingURL=object.js.map