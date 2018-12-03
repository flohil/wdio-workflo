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
class ValuePageElementGroup extends _1.PageElementGroup {
    constructor(_a) {
        var superOpts = __rest(_a, []);
        super(superOpts);
        this.currently = new ValuePageElementGroupCurrently(this);
    }
    getValue() {
        let result = {};
        for (const k in this.$) {
            if (isGetValueNode(this.$[k])) {
                const elem = this.$[k];
                result[k] = elem.getValue();
            }
        }
        return result;
    }
    /**
     * Sets values after performing the initial wait on all nodes that implement the setValue method.
     * Nodes that do not implement the setValue method will be ignored.
     *
     * @param values
     */
    setValue(values) {
        for (const k in values) {
            if (isSetValueNode(this.$[k])) {
                const node = this.$[k];
                node.setValue(values[k]);
            }
        }
        return this;
    }
}
exports.ValuePageElementGroup = ValuePageElementGroup;
class ValuePageElementGroupCurrently extends _1.PageElementGroupCurrently {
    getValue() {
        let result = {};
        for (const k in this._node.$) {
            if (isGetValueNode(this._node.$[k])) {
                const node = this._node.$[k];
                result[k] = node.currently.getValue();
            }
        }
        return result;
    }
    /**
     * Sets values immediately on all nodes that implement the setValue method.
     * Nodes that do not implement the setValue method will be ignored.
     *
     * @param values
     */
    setValue(values) {
        for (const k in values) {
            if (isSetValueNode(this._node.$[k])) {
                const node = this._node.$[k];
                node.setValue(values[k]);
            }
        }
        return this._node;
    }
}
// type guards
function isGetValueNode(node) {
    return typeof node['getValue'] === 'function';
}
function isSetValueNode(node) {
    return typeof node['setValue'] === 'function';
}
//# sourceMappingURL=ValuePageElementGroup.js.map