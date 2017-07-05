"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const util_1 = require("./util");
/**
 * Splits a string at delim and returns an object with the
 * split string parts as keys and the values set to true.
 *
 * @param str
 * @param delim
 */
function splitToObj(str, delim) {
    if (!(_.isString(str))) {
        throw new Error(`Input must be a string: ${str}`);
    }
    else {
        return util_1.convertToObject(str.split(delim), true);
    }
}
exports.splitToObj = splitToObj;
//# sourceMappingURL=string.js.map