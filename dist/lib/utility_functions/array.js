"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Gets an input array and maps it to an object where
 * the property keys correspond to the array elements
 * and the property values are defiend by mapFunc.
 *
 * @param input
 * @param mapFunc
 */
function mapToObject(input, mapFunc) {
    const obj = {};
    for (const element of input) {
        obj[element] = mapFunc(element);
    }
    return obj;
}
exports.mapToObject = mapToObject;
//# sourceMappingURL=array.js.map