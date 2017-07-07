"use strict";
// These matchers get automatically added to jasmine before
// test suite execution starts.
Object.defineProperty(exports, "__esModule", { value: true });
// Please leave in node's module.export format, since file is
// required in system_tests.wdio.conf.js which is not being
// babel transpiled (no ES6 support)
const diff = require('deep-diff').diff;
// ADD YOUR OWN CUSTOM MATCHERS BELOW
const customMatchers = {
    toHaveLength: function () {
        return {
            compare: function (obj, length) {
                const result = {
                    pass: false,
                    message: ''
                };
                if (typeof length !== 'number') {
                    result.message = `${length} is not a number`;
                    return result;
                }
                else if (typeof obj === 'undefined') {
                    result.message = 'Object is undefined';
                    return result;
                }
                else if (obj === null) {
                    result.message = 'Object is null';
                    return result;
                }
                else if (typeof obj !== 'object' && typeof obj !== 'string') {
                    result.message = 'Object is neither of type object/array nor of type string';
                    return result;
                }
                else if (typeof obj === 'string') {
                    result.pass = (obj.length === length);
                    if (!result.pass) {
                        result.message = `Expected string to have a length of ${length}`;
                    }
                    return result;
                }
                else if (Array.isArray(obj)) {
                    result.pass = (obj.length === length);
                    if (!result.pass) {
                        result.message = `Expected array to have a length of ${length}`;
                    }
                    return result;
                }
                else {
                    result.pass = (Object.keys(obj).length === length);
                    if (!result.pass) {
                        result.message = `Expected object to have ${length} keys`;
                    }
                    return result;
                }
            }
        };
    },
    // Checks if urls match (cutting off get parameters)
    toMatchUrl: function () {
        return {
            compare: function (obj, url) {
                const result = {
                    pass: false,
                    message: undefined
                };
                const baseUrl = obj.split('?')[0];
                if (baseUrl === url) {
                    result.pass = true;
                }
                else {
                    result.message = `${obj} does not match url ${url}`;
                }
                return result;
            }
        };
    },
    // Checks if string includes another string
    toInclude: function () {
        return {
            compare: function (obj, substr) {
                const result = {
                    pass: false,
                    message: undefined
                };
                if (obj.includes(substr)) {
                    result.pass = true;
                }
                else {
                    result.message = `'${obj}' does not contain substring '${substr}'`;
                }
                return result;
            }
        };
    },
    // Checks if two objects match and if they don't,
    // outputs the diff of the objects in the error message.
    toEqualObject: function () {
        return {
            compare: function (expectedObj, actualObj) {
                const result = {
                    pass: false,
                    message: undefined
                };
                let diffObj = diff(actualObj, expectedObj);
                if (typeof diffObj === 'undefined') {
                    result.pass = true;
                }
                else {
                    diffObj = prettifyDiffOutput(diffObj);
                    result.message = `Expected object did not match actual object: \n${JSON.stringify(diffObj, null, 2)}`;
                }
                return result;
            }
        };
    }
};
exports.customMatchers = customMatchers;
// DEFINE INTERNAL UTILITY FUNCTIONS BELOW
// makes output of a single diff more readable
function prettifyDiffObj(diff) {
    const obj = {
        kind: undefined,
        path: undefined,
        expect: undefined,
        actual: undefined,
        index: undefined,
        item: undefined,
    };
    if (diff.kind) {
        switch (diff.kind) {
            case 'N':
                obj.kind = 'New';
                break;
            case 'D':
                obj.kind = 'Missing';
                break;
            case 'E':
                obj.kind = 'Changed';
                break;
            case 'A':
                obj.kind = 'Array Canged';
                break;
        }
    }
    if (diff.path) {
        let path = diff.path[0];
        for (let i = 1; i < diff.path.length; i++) {
            path += `/${diff.path[i]}`;
        }
        obj.path = path;
    }
    if (typeof diff.lhs !== 'undefined') {
        obj.expect = diff.lhs;
    }
    if (typeof diff.rhs !== 'undefined') {
        obj.actual = diff.rhs;
    }
    if (diff.index) {
        obj.index = diff.index;
    }
    if (diff.item) {
        obj.item = prettifyDiffObj(diff.item);
    }
    return obj;
}
// makes output of a diff object array more readable
function prettifyDiffOutput(diffArr) {
    const res = [];
    for (const diff of diffArr) {
        res.push(prettifyDiffObj(diff));
    }
    return res;
}
//# sourceMappingURL=jasmineMatchers.js.map