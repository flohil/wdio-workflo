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
        const resultObj = {};
        for (const key in input) {
            if (input.hasOwnProperty(key)) {
                resultObj[key] = func(input[key], key);
            }
        }
        return resultObj;
    }
}
exports.mapProperties = mapProperties;
/**
 * Iterates over all properties in an object and executes func on each.
 * @param input
 * @param func
 */
function forEachProperty(input, func) {
    for (const key in input) {
        if (input.hasOwnProperty(key)) {
            func(key, input[key]);
        }
    }
}
exports.forEachProperty = forEachProperty;
// inverts an object's keys and values.
/**
 * Returns a new object with the original object's keys and values inverted.
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
 * Returns a filtered object that only contains those
 * properties of the initial object where func returned true.
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
 * with new value without turning into array.
 *
 * @param obj
 * @param key
 * @param value
 * @param overwrite
 */
function addToProps(obj, key, value, overwrite = false) {
    if (obj[key] && !overwrite) {
        if (!(_.isArray(obj[key]))) {
            obj[key] = [obj[key]];
        }
        obj[key].push(value);
    }
    else {
        obj[key] = value;
    }
}
exports.addToProps = addToProps;
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
 * Creates a copy of original object in which all
 * properties with negative values are removed recursively.
 *
 * @param obj
 */
function stripNegatives(obj) {
    const resObj = _.cloneDeep(obj);
    return stripNegativesRec(resObj);
}
exports.stripNegatives = stripNegatives;
function stripNegativesRec(obj) {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (typeof obj[prop] === 'object') {
                stripNegativesRec(obj[prop]);
            }
            else {
                if (obj[prop] === false) {
                    delete obj[prop];
                }
            }
        }
    }
    return obj;
}
exports.stripNegativesRec = stripNegativesRec;
/**
 * Returns properties of obj whose keys are also present in
 * subsetObj as a new object.
 *
 * @param obj
 * @param matchingObject
 */
function subset(obj, matchingObject) {
    const subset = {};
    for (const key in matchingObject) {
        if (key in obj) {
            subset[key] = obj[key];
        }
    }
    return subset;
}
exports.subset = subset;
//# sourceMappingURL=object.js.map