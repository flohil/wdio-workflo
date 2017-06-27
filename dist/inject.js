"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import functions from './functions'
//import registerSteps from './registerSteps'
const Functions = require("./lib/functions");
function safeAdd(context, key, obj) {
    if (key in context) {
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
    /*console.log("REGISTERING STEPS")
  
    console.log("config: ", config)
  
    registerSteps( config.testDir )*/
}
exports.inject = inject;
inject({});
//# sourceMappingURL=inject.js.map