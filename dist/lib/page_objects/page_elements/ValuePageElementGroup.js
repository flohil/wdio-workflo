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
        return this.eachGet(isIGetValueElementNode, filterMask, node => node.getValue());
    }
    /**
     * Sets values after performing the initial wait on all nodes that implement the setValue method.
     * Nodes that do not implement the setValue method will be ignored.
     *
     * @param values
     */
    setValue(values) {
        return this.eachSet(isISetValueElementNode, values, (node, value) => node.setValue(value));
    }
}
exports.ValuePageElementGroup = ValuePageElementGroup;
class ValuePageElementGroupCurrently extends _1.PageElementGroupCurrently {
    constructor() {
        super(...arguments);
        this.not = Object.assign({}, super.not, { hasValue: (value) => {
                return this._node.eachCheck(isIGetValueElementNode, value, (node, value) => node.currently.not.hasValue(value));
            }, hasAnyValue: (filterMask) => {
                return this._node.eachCheck(isIGetValueElementNode, filterMask, node => node.currently.not.hasAnyValue());
            }, containsValue: (value) => {
                return this._node.eachCheck(isIGetValueElementNode, value, (node, value) => node.currently.not.containsValue(value));
            } });
    }
    getValue(filterMask) {
        return this._node.eachGet(isIGetValueElementNode, filterMask, node => node.currently.getValue());
    }
    /**
     * Sets values immediately on all nodes that implement the setValue method.
     * Nodes that do not implement the setValue method will be ignored.
     *
     * @param values
     */
    setValue(values) {
        return this._node.eachSet(isISetValueElementNode, values, (node, value) => node.currently.setValue(value));
    }
    hasValue(value) {
        return this._node.eachCheck(isIGetValueElementNode, value, (node, value) => node.currently.hasValue(value));
    }
    hasAnyValue(filterMask) {
        return this._node.eachCheck(isIGetValueElementNode, filterMask, node => node.currently.hasAnyValue());
    }
    containsValue(value) {
        return this._node.eachCheck(isIGetValueElementNode, value, (node, value) => node.currently.containsValue(value));
    }
}
class ValuePageElementGroupWait extends _1.PageElementGroupWait {
    constructor() {
        super(...arguments);
        this.not = Object.assign({}, super.not, { hasValue: (value, opts) => {
                return this._node.eachWait(isIGetValueElementNode, value, (node, value) => node.wait.hasValue(value, opts));
            }, hasAnyValue: (opts = {}) => {
                return this._node.eachWait(isIGetValueElementNode, opts.filterMask, node => node.wait.hasAnyValue(opts));
            }, containsValue: (value, opts) => {
                return this._node.eachWait(isIGetValueElementNode, value, (node, value) => node.wait.containsValue(value, opts));
            } });
    }
    hasValue(value, opts) {
        return this._node.eachWait(isIGetValueElementNode, value, (node, value) => node.wait.hasValue(value, opts));
    }
    hasAnyValue(opts = {}) {
        return this._node.eachWait(isIGetValueElementNode, opts.filterMask, node => node.wait.hasAnyValue(opts));
    }
    containsValue(value, opts) {
        return this._node.eachWait(isIGetValueElementNode, value, (node, value) => node.wait.containsValue(value, opts));
    }
}
class ValuePageElementGroupEventually extends _1.PageElementGroupEventually {
    constructor() {
        super(...arguments);
        this.not = Object.assign({}, super.not, { hasValue: (value, opts) => {
                return this._node.eachCheck(isIGetValueElementNode, value, (node, value) => node.eventually.not.hasValue(value, opts));
            }, hasAnyValue: (opts = {}) => {
                return this._node.eachCheck(isIGetValueElementNode, opts.filterMask, node => node.eventually.not.hasAnyValue(opts));
            }, containsValue: (value, opts) => {
                return this._node.eachCheck(isIGetValueElementNode, value, (node, value) => node.eventually.not.containsValue(value, opts));
            } });
    }
    hasValue(value, opts) {
        return this._node.eachCheck(isIGetValueElementNode, value, (node, value) => node.eventually.hasValue(value, opts));
    }
    hasAnyValue(opts = {}) {
        return this._node.eachCheck(isIGetValueElementNode, opts.filterMask, node => node.eventually.hasAnyValue(opts));
    }
    containsValue(value, opts) {
        return this._node.eachCheck(isIGetValueElementNode, value, (node, value) => node.eventually.containsValue(value, opts));
    }
}
// type guards
function isIGetValueElementNode(node) {
    return typeof node['getValue'] === 'function' &&
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
function isISetValueElementNode(node) {
    return typeof node['setValue'] === 'function' &&
        typeof node.currently['setValue'] === 'function';
}
//# sourceMappingURL=ValuePageElementGroup.js.map