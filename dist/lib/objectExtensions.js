"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
// This file does not feature ES6 syntax because it is
// required by system_tests.wdio.conf.js which is not
// transpiled by babel.
// customXXXFunctions (eg customObjectFunctions) will be
// added to respective prototypes (eg object, string) for
// the whole environment in system_tests.wdio.conf.js
// 
// So they can be accessed directly from an object/string,
// like this: obj.mapProperties( func )
//
// Used like this, there is no need to import these functions.
//
// Each function will be passed its own instance as
// first parameter.
// Gets an input array and maps it to an object where
// the property keys correspond to the array elements
// and the property values are defiend by mapFunc.
function mapToObject(input, mapFunc) {
    if (_.isArray(input)) {
        const obj = {};
        for (const element of input) {
            obj[element] = mapFunc(element);
        }
        return obj;
    }
    else {
        throw new Error(`Input must be an array: ${input}`);
    }
}
exports.mapToObject = mapToObject;
// Converts strings, arrays and objects into objects.
// valueFunc will be used to determine the object's 
// property values and can be either a func or a value.
// valueFunc gets passed the array element or string as
// value.
// If switchKeyValue is true, the keys and values of the
// resulting object will be switched.
// If stackValues is true, a value for an exiting key
// will not be replaced by a new value but added to an
// array of values for the concerned key.
//
// If input is object, output remains the same object.
// If input is string, output is an object with one 
// entry where the key is the string.
// If input is array, output is an object where each key
// represents one element in the array. 
function convertToObject(unknownTypedInput, valueFunc = undefined, options = { switchKeyValue: false, overwriteValues: false, stackValues: any }) {
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
                obj = invert(obj);
            }
        }
    }
    return obj;
}
exports.convertToObject = convertToObject;
// Iterates over all properties in an object and executes
// func on each.
// Func will be passed the property value as first and its
// key as second parameter.
// 
// Returns a new object with the same keys as the input
// object and the values as result of the func.
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
// Iterates over all properties in an object and executes
// func on each.
// Func will be passed the property key as first and its
// value as second parameter.
// 
// This function itself will not alter the input object
// and no new object will be created.
function forEachProperty(input, func) {
    if (_.isArray(input)) {
        throw new Error(`Input must be an object: ${input}`);
    }
    else {
        for (const key in input) {
            if (input.hasOwnProperty(key)) {
                func(key, input[key]);
            }
        }
    }
}
exports.forEachProperty = forEachProperty;
// Takes an array as input and creates another array based 
// on the return values of func.
//
// Func will get passed the input arrays elements as argument.
function arrayFrom(input, func) {
    const resultArray = [];
    if (_.isArray(input)) {
        for (const element of input) {
            resultArray.push(func(element));
        }
    }
    else {
        throw new Error(`Input must be an array: ${input}`);
    }
    return resultArray;
}
exports.arrayFrom = arrayFrom;
// Finds a property value inside an input array.
// findFunc will be passed the current element.
//
// Returns the found element or undefined if no property 
// is found wich matches findFunc.
// ALREADY EXISTS!
/*export function find( input, findFunc ) {
  if ( !( _.isArray( input ) ) ) {
    throw new Error( `Input must be an array: ${input}` )
  } else {
    for ( const element of input ) {
      if ( findFunc( element ) ) {
        return element
      }
    }
  }

  return undefined
}*/
// inverts an object's keys and values.
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
// returns a filtered object/array that only contains those
// properties of the initial object where func returned true
// func will get the property value/element of an array as first
// parameter and the object key as second parameter if obj
// is an object.
function filter(obj, func) {
    if (_.isArray(obj)) {
        const resultArr = [];
        for (const el of obj) {
            if (func(el)) {
                resultArr.push(el);
            }
        }
        return resultArr;
    }
    else {
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
}
exports.filter = filter;
// If key already exists in obj, turns respective value
// into array and pushes value onto the array.
// Else, adds "normal" key-value pair as property.
// If overwrite is true, always overwrites existing value
// with new value without turning into array.
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
// Returns last element of an array or undefined if the array
// was empty.
/*export function last( obj ) {
  if ( !( _.isArray( obj ) ) ) {
    throw new Error(`Input must be an array: ${obj}`)
  } else {
    if ( obj.length > 0 ) {
      return obj[ obj.length - 1 ]
    } else {
      return undefined
    }
  }
}*/
// Splits a string at delim and returns an object with the
// split string parts as keys and the values set to true.
function splitToObj(str, delim) {
    if (!(_.isString(str))) {
        throw new Error(`Input must be a string: ${str}`);
    }
    else {
        return str.split(delim).convertToObject(true);
    }
}
exports.splitToObj = splitToObj;
// Creates a copy of original object in which all
// properties with negative values are removed recursively.
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
// returns all methods of a ES6 class (except for constructor)
// see http://stackoverflow.com/questions/31054910/get-functions-methods-of-a-class
function getAllMethods(obj) {
    let props = [];
    do {
        const l = Object.getOwnPropertyNames(obj)
            .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
            .sort()
            .filter((p, i, arr) => typeof obj[p] === 'function' &&
            p !== 'constructor' &&
            (i == 0 || p !== arr[i - 1]) &&
            props.indexOf(p) === -1 //not overridden in a child
        );
        props = props.concat(l);
    } while ((obj = Object.getPrototypeOf(obj)) &&
        Object.getPrototypeOf(obj) //not the the Object prototype methods (hasOwnProperty, etc...)
    );
    return props;
}
exports.getAllMethods = getAllMethods;
// returns properties of obj whose keys are also present in 
// subsetObject as a new object
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
//# sourceMappingURL=objectExtensions.js.map