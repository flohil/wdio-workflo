"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import functions from './functions'
//import registerSteps from './registerSteps'
const Functions = require("./api");
const objectFunctions = require("./utility_functions/object");
const arrayFunctions = require("./utility_functions/array");
const classFunctions = require("./utility_functions/class");
const stringFunctions = require("./utility_functions/string");
const utilFunctions = require("./utility_functions/util");
const matchers_1 = require("./matchers");
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
    context.expectElement = matchers_1.expectElement;
    context.expectList = matchers_1.expectList;
    context.expectMap = matchers_1.expectMap;
    context.expectGroup = matchers_1.expectGroup;
}
exports.inject = inject;
inject({});
beforeAll(() => {
    jasmine.addMatchers(matchers_1.elementMatchers);
    jasmine.addMatchers(matchers_1.listMatchers);
    jasmine.addMatchers(matchers_1.allMatchers);
    jasmine.addMatchers(matchers_1.valueAllMatchers);
});
//# sourceMappingURL=inject.js.map