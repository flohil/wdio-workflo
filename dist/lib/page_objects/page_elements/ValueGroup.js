"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class ValueGroup extends _1.TextGroup {
    constructor(_a) {
        var superOpts = __rest(_a, []);
        super(superOpts);
    }
    /**
     * Returns node value for nodes which implement Workflo.PageNode.IGetValue
     * or undefined for those which don't.
     * @param param
     */
    GetValue({ filter, options } = {}) {
        return this.Solve({
            values: Workflo.Object.stripMaskDeep(filter),
            solve: (node) => {
                if (isGetValueNode(node)) {
                    return {
                        nodeSupported: true,
                        result: node.getValue()
                    };
                }
                else {
                    return {
                        nodeSupported: false
                    };
                }
            }
        }, options);
    }
    SetValue({ values, options }) {
        return this.Solve({
            values: values,
            solve: (node, value) => {
                if (isSetValueNode(node)) {
                    node.setValue(value);
                    return {
                        nodeSupported: true
                    };
                }
                else {
                    return {
                        nodeSupported: false
                    };
                }
            }
        }, options);
    }
}
exports.ValueGroup = ValueGroup;
// type guards
function isGetValueNode(node) {
    return node.getValue !== undefined;
}
function isSetValueNode(node) {
    return node.setValue !== undefined;
}
//# sourceMappingURL=ValueGroup.js.map