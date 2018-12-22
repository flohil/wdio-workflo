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
    constructor(id, _a) {
        var superOpts = __rest(_a, []);
        super(id, superOpts);
        this.currently = new ValuePageElementGroupCurrently(this);
        this.wait = new ValuePageElementGroupWait(this);
        this.eventually = new ValuePageElementGroupEventually(this);
    }
    getValue(filterMask) {
        return this.eachGet(isIValueElementNode, node => node.getValue(), filterMask);
    }
    /**
     * Sets values after performing the initial wait on all nodes that implement the setValue method.
     * Nodes that do not implement the setValue method will be ignored.
     *
     * @param values
     */
    setValue(values) {
        return this.eachSet(isIValueElementNode, (node, value) => node.setValue(value), values);
    }
}
exports.ValuePageElementGroup = ValuePageElementGroup;
class ValuePageElementGroupCurrently extends _1.PageElementGroupCurrently {
    getValue(filterMask) {
        return this._node.eachGet(isIValueElementNode, node => node.currently.getValue(), filterMask);
    }
    hasValue(value) {
        return this._node.eachCheck(isIValueElementNode, (node, value) => node.currently.hasValue(value), value);
    }
    hasAnyValue(filterMask) {
        return this._node.eachCheck(isIValueElementNode, node => node.currently.hasAnyValue(), filterMask, true);
    }
    containsValue(value) {
        return this._node.eachCheck(isIValueElementNode, (node, value) => node.currently.containsValue(value), value);
    }
    get not() {
        return Object.assign({}, super.not, { hasValue: (value) => {
                return this._node.eachCheck(isIValueElementNode, (node, value) => node.currently.not.hasValue(value), value);
            }, hasAnyValue: (filterMask) => {
                return this._node.eachCheck(isIValueElementNode, node => node.currently.not.hasAnyValue(), filterMask, true);
            }, containsValue: (value) => {
                return this._node.eachCheck(isIValueElementNode, (node, value) => node.currently.not.containsValue(value), value);
            } });
    }
}
class ValuePageElementGroupWait extends _1.PageElementGroupWait {
    hasValue(value, opts) {
        return this._node.eachWait(isIValueElementNode, (node, value) => node.wait.hasValue(value, opts), value);
    }
    hasAnyValue(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(isIValueElementNode, node => node.wait.hasAnyValue(otherOpts), filterMask, true);
    }
    containsValue(value, opts) {
        return this._node.eachWait(isIValueElementNode, (node, value) => node.wait.containsValue(value, opts), value);
    }
    get not() {
        return Object.assign({}, super.not, { hasValue: (value, opts) => {
                return this._node.eachWait(isIValueElementNode, (node, value) => node.wait.hasValue(value, opts), value);
            }, hasAnyValue: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(isIValueElementNode, node => node.wait.hasAnyValue(opts), filterMask, true);
            }, containsValue: (value, opts) => {
                return this._node.eachWait(isIValueElementNode, (node, value) => node.wait.containsValue(value, opts), value);
            } });
    }
}
class ValuePageElementGroupEventually extends _1.PageElementGroupEventually {
    hasValue(value, opts) {
        return this._node.eachCheck(isIValueElementNode, (node, value) => node.eventually.hasValue(value, opts), value);
    }
    hasAnyValue(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(isIValueElementNode, node => node.eventually.hasAnyValue(otherOpts), filterMask, true);
    }
    containsValue(value, opts) {
        return this._node.eachCheck(isIValueElementNode, (node, value) => node.eventually.containsValue(value, opts), value);
    }
    get not() {
        return Object.assign({}, super.not, { hasValue: (value, opts) => {
                return this._node.eachCheck(isIValueElementNode, (node, value) => node.eventually.not.hasValue(value, opts), value);
            }, hasAnyValue: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(isIValueElementNode, node => node.eventually.not.hasAnyValue(otherOpts), filterMask, true);
            }, containsValue: (value, opts) => {
                return this._node.eachCheck(isIValueElementNode, (node, value) => node.eventually.not.containsValue(value, opts), value);
            } });
    }
}
// type guards
function isIValueElementNode(node) {
    return typeof node['getValue'] === 'function' &&
        typeof node['setValue'] === 'function' &&
        typeof node.currently['getValue'] === 'function' &&
        typeof node.currently['hasValue'] === 'function' &&
        typeof node.currently['hasAnyValue'] === 'function' &&
        typeof node.currently['containsValue'] === 'function' &&
        typeof node.wait['hasValue'] === 'function' &&
        typeof node.wait['hasAnyValue'] === 'function' &&
        typeof node.wait['containsValue'] === 'function' &&
        typeof node.eventually['hasValue'] === 'function' &&
        typeof node.eventually['hasAnyValue'] === 'function' &&
        typeof node.eventually['containsValue'] === 'function';
}
//# sourceMappingURL=ValuePageElementGroup.js.map