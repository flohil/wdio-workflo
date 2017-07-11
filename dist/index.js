"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/*declare module "workflo" {
    export = Workflo;
}*/
__export(require("./lib/steps"));
const objectFunctions = require("./lib/utilityFunctions/object");
exports.objectFunctions = objectFunctions;
const arrayFunctions = require("./lib/utilityFunctions/array");
exports.arrayFunctions = arrayFunctions;
const classFunctions = require("./lib/utilityFunctions/class");
exports.classFunctions = classFunctions;
const stringFunctions = require("./lib/utilityFunctions/string");
exports.stringFunctions = stringFunctions;
const Kiwi_1 = require("./lib/Kiwi");
exports.Kiwi = Kiwi_1.default;
//# sourceMappingURL=index.js.map