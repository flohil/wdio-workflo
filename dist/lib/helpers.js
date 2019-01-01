"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function tolerancesToString(values, tolerances) {
    var str = '{';
    var props = [];
    if (typeof values !== 'object' && typeof values !== 'undefined') {
        if (typeof tolerances === 'undefined') {
            return values;
        }
        else {
            const tolerance = Math.abs(tolerances);
            return `[${Math.max(values - tolerance, 0)}, ${Math.max(values + tolerance, 0)}]`;
        }
    }
    for (var p in values) {
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
    str += props.join(', ');
    return str + '}';
}
exports.tolerancesToString = tolerancesToString;
function isNullOrUndefined(value) {
    return value === null || typeof value === 'undefined';
}
exports.isNullOrUndefined = isNullOrUndefined;
function notIsNullOrUndefined(value) {
    return value !== null || typeof value !== 'undefined';
}
exports.notIsNullOrUndefined = notIsNullOrUndefined;
function isEmpty(value) {
    if (typeof value === 'string') {
        return value.length === 0;
    }
    return isNullOrUndefined(value);
}
exports.isEmpty = isEmpty;
function applyMixins(derivedCtor, baseCtors, mergeObjectKeys = []) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            try {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
            catch (error) {
                if (error.message.includes('which has only a getter')) {
                    const baseValue = baseCtor.prototype[name];
                    const derivedValue = derivedCtor.prototype[name];
                    let result = undefined;
                    if ((typeof baseValue === 'object' && typeof derivedValue === 'object') && mergeObjectKeys.indexOf(name) >= 0) {
                        result = Object.assign({}, baseValue, derivedValue);
                    }
                    else {
                        result = baseValue;
                    }
                    Object.defineProperty(derivedCtor, name, {
                        get: function () {
                            return result;
                        }
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