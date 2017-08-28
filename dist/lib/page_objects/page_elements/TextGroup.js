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
const _1 = require("./");
class TextGroup extends _1.PageElementGroup {
    constructor(_a) {
        var superOpts = __rest(_a, []);
        super(superOpts);
    }
    GetText({ filter, options } = {}) {
        return this.Solve({
            values: Workflo.Object.stripMaskDeep(filter),
            solve: (node) => {
                if (isGetTextNode(node)) {
                    return {
                        nodeSupported: true,
                        result: node.getText()
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
exports.TextGroup = TextGroup;
// type guards
function isGetTextNode(node) {
    return node.getText !== undefined;
}
//# sourceMappingURL=TextGroup.js.map