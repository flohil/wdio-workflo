"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Prints values with tolerances as a string.
 *
 * @param values a number or an object with values of type number
 * @param tolerances a number or an object with values of type number
 */
function tolerancesToString(values, tolerances) {
    let str = '{';
    const props = [];
    if (typeof values !== 'object' && typeof values !== 'undefined') {
        if (typeof tolerances === 'undefined') {
            return values;
        }
        else if (typeof tolerances !== 'object') {
            const tolerance = Math.abs(tolerances);
            return `[${Math.max(values - tolerance, 0)}, ${Math.max(values + tolerance, 0)}]`;
        }
    }
    else {
        for (const p in values) {
            if (values.hasOwnProperty(p)) {
                const value = values[p];
                let valueStr = '';
                if (tolerances && typeof tolerances[p] !== 'undefined' && tolerances[p] !== 0) {
                    const tolerance = Math.abs(tolerances[p]);
                    valueStr = `[${Math.max(value - tolerance, 0)}, ${Math.max(value + tolerance, 0)}]`;
                }
                else {
                    valueStr = `${value}`;
                }
                props.push(`${p}: ${valueStr}`);
            }
        }
    }
    str += props.join(', ');
    return `${str}}`;
}
exports.tolerancesToString = tolerancesToString;
/**
 * Returns true if value is null or undefined.
 *
 * @param value an arbitrary value
 */
function isNullOrUndefined(value) {
    return value === null || typeof value === 'undefined';
}
exports.isNullOrUndefined = isNullOrUndefined;
/**
 * Returns true if value is neither null nor undefined.
 *
 * @param value an arbitrary value
 */
function notIsNullOrUndefined(value) {
    return value !== null || typeof value !== 'undefined';
}
exports.notIsNullOrUndefined = notIsNullOrUndefined;
/**
 * Returns true if:
 *
 * - value is undefined
 * - value is null
 * - value is a string and length of value is 0
 *
 * @param value an arbitrary value
 */
function isEmpty(value) {
    if (typeof value === 'string') {
        return value.length === 0;
    }
    return isNullOrUndefined(value);
}
exports.isEmpty = isEmpty;
/**
 * Mixes baseCtors classes into derivedCtor class.
 * All properties of baseCtors will be written to derivedCtor.
 * If a property with the same name already exists in derivedCtor, it will be overwritten.
 * For more information about typescript mixins see https://www.typescriptlang.org/docs/handbook/mixins.html
 *
 * @param derivedCtor the class into which baseCtors should be mixed in
 * @param baseCtors the classes which should be mixed into derivedCtor
 * @param mergeObjectKeys If the name of property is contained in mergeObjectKeys and the property exists as an object
 * in both derivedCtor and baseCtor, both objects will be merged together instead of the baseCtor object overwriting
 * the derivedCtor object. Be aware that deep merging is not supported and therefore "nested" properties with the same
 * name in derivedCtor's object and baseCtor's object will still be overwritten by baseCtor's object values.
 */
function applyMixins(derivedCtor, baseCtors, mergeObjectKeys = []) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            const baseValue = baseCtor.prototype[name];
            const derivedValue = derivedCtor.prototype[name];
            try {
                if ((typeof baseValue === 'object' && typeof derivedValue === 'object') && mergeObjectKeys.indexOf(name) >= 0) {
                    derivedCtor.prototype[name] = Object.assign({}, baseValue, derivedValue);
                }
                else {
                    derivedCtor.prototype[name] = baseValue;
                }
            }
            catch (error) {
                if (error.message.includes('which has only a getter')) {
                    let result = undefined;
                    if ((typeof baseValue === 'object' && typeof derivedValue === 'object') && mergeObjectKeys.indexOf(name) >= 0) {
                        result = Object.assign({}, baseValue, derivedValue);
                    }
                    else {
                        result = baseValue;
                    }
                    Object.defineProperty(derivedCtor, name, {
                        get() {
                            return result;
                        },
                    });
                }
                else {
                    throw error;
                }
            }
        });
    });
}
exports.applyMixins = applyMixins;
//# sourceMappingURL=helpers.js.map