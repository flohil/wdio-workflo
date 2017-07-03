"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import functions from './functions'
//import registerSteps from './registerSteps'
const Functions = require("./lib/api");
const objectExtensions = require("./lib/objectExtensions");
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
    // replace with typescript
    context.Workflo = {
        Object: (input) => {
            for (const key in objectExtensions) {
                if (objectExtensions.hasOwnProperty(key)) {
                    Object.defineProperty(input.prototype, key, {
                        value: function (...args) {
                            return objectExtensions[key](this, ...args);
                        },
                        writable: false,
                        configurable: false,
                        enumerable: false
                    });
                }
            }
        }
    };
    context.Workflo.objectExtensions = {};
    for (const key in objectExtensions) {
        if (objectExtensions.hasOwnProperty(key)) {
            safeAdd(context.Workflo.objectExtensions, key, function (...args) {
                return objectExtensions[key](this, ...args);
            });
        }
    }
    /*for (const key in objectExtensions) {
      if ( objectExtensions.hasOwnProperty( key ) ) {
        Object.defineProperty(
          Object.prototype,
          key,
          {
            value: function( ...args ) {
              return objectExtensions[ key ]( this, ...args )
            },
            writable: false,
            configurable: false,
            enumerable: false
          }
        )
      }
    }*/
    /*console.log("REGISTERING STEPS")
  
    console.log("config: ", config)
  
    registerSteps( config.testDir )*/
}
exports.inject = inject;
inject({});
//# sourceMappingURL=inject.js.map