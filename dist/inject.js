"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import functions from './functions'
//import registerSteps from './registerSteps'
const Functions = require("./lib/api");
const objectFunctions = require("./lib/utilityFunctions/object");
const arrayFunctions = require("./lib/utilityFunctions/array");
const classFunctions = require("./lib/utilityFunctions/class");
const stringFunctions = require("./lib/utilityFunctions/string");
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
        Class: {}
    };
    safeAddAll(context.Workflo.Object, [objectFunctions]);
    safeAddAll(context.Workflo.Array, [arrayFunctions]);
    safeAddAll(context.Workflo.String, [stringFunctions]);
    safeAddAll(context.Workflo.Class, [classFunctions]);
}
exports.inject = inject;
inject({});
//# sourceMappingURL=inject.js.map