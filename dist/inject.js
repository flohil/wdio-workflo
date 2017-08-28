"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import functions from './functions'
//import registerSteps from './registerSteps'
const Functions = require("./lib/api");
const objectFunctions = require("./lib/utility_functions/object");
const arrayFunctions = require("./lib/utility_functions/array");
const classFunctions = require("./lib/utility_functions/class");
const stringFunctions = require("./lib/utility_functions/string");
const utilFunctions = require("./lib/utility_functions/util");
function safeAdd(context, key, obj) {
    if (context.hasOwnProperty(key)) {
        throw new Error(`${key} is already defined within context`);
    }
    else {
        context[key] = obj;
    }
}
function safeAddAll(context, objArr) {
    for (const obj of objArr) {
        for (const key of Object.keys(obj)) {
            safeAdd(context, key, obj[key]);
        }
    }
}
// injects workflo framework into global context
// config: workflo.conf.js config
function inject(config) {
    const context = global;
    // setup variables
    //safeAdd( context, 'steps', {} )
    safeAddAll(context, [Functions]);
    context.Workflo = {
        Object: {},
        Array: {},
        String: {},
        Class: {},
        Util: {}
    };
    safeAddAll(context.Workflo.Object, [objectFunctions]);
    safeAddAll(context.Workflo.Array, [arrayFunctions]);
    safeAddAll(context.Workflo.String, [stringFunctions]);
    safeAddAll(context.Workflo.Class, [classFunctions]);
    safeAddAll(context.Workflo.Util, [utilFunctions]);
}
exports.inject = inject;
inject({});
//# sourceMappingURL=inject.js.map