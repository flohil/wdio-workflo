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
function isEmpty(value) {
    if (typeof value === 'string') {
        return value.length === 0;
    }
    return isNullOrUndefined(value);
}
exports.isEmpty = isEmpty;
//# sourceMappingURL=helpers.js.map