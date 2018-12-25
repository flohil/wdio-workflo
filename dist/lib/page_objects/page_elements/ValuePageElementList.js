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
class ValuePageElementList extends _1.PageElementList {
    constructor(selector, opts) {
        super(selector, opts);
        this.currently = new ValuePageElementListCurrently(this, opts);
        this.wait = new ValuePageElementListWait(this);
        this.eventually = new ValuePageElementListEventually(this);
    }
    initialWait() {
        if (this._waitType === "value" /* value */) {
            this.wait.any.hasAnyValue();
        }
        else {
            super.initialWait();
        }
    }
    // GETTER FUNCTIONS
    /**
     * Returns values of all list elements in the order they were retrieved from the DOM
     * after the initial wait was performed.
     */
    getValue(filterMask) {
        return this.eachGet(this.all, element => element.getValue(), filterMask);
    }
    getHasValue(value) {
        return this.eachCompare(this.all, (element, expected) => element.currently.hasValue(expected), value);
    }
    getHasAnyValue(filterMask) {
        return this.eachCompare(this.all, (element) => element.currently.hasAnyValue(), filterMask, true);
    }
    getContainsValue(value) {
        return this.eachCompare(this.all, (element, expected) => element.currently.containsValue(expected), value);
    }
    // SETTER FUNCTIONS
    /**
     * Sets values on all list elements after the initial wait was performed.
     *
     * If values is an array, the number of list elements must match the number of passed values.
     * The values will be assigned in the order that the list elements were retrieved from the DOM.
     *
     * If values is a single value, the same value will be set on all list elements.
     *
     * @param values
     */
    setValue(values) {
        return this.eachSet(this.all, (element, value) => element.setValue(value), values);
    }
}
exports.ValuePageElementList = ValuePageElementList;
class ValuePageElementListCurrently extends _1.PageElementListCurrently {
    /**
     * Returns values of all list elements in the order they were retrieved from the DOM immediatly.
     */
    getValue(filterMask) {
        return this._node.eachGet(this.all, element => element.currently.getValue(), filterMask);
    }
    getHasValue(value) {
        return this._node.eachCompare(this.all, (element, expected) => element.currently.hasValue(expected), value);
    }
    getHasAnyValue(filterMask) {
        return this._node.eachCompare(this.all, (element) => element.currently.hasAnyValue(), filterMask, true);
    }
    getContainsValue(value) {
        return this._node.eachCompare(this.all, (element, expected) => element.currently.containsValue(expected), value);
    }
    // CHECK STATE
    hasValue(value) {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.hasValue(expected), value);
    }
    hasAnyValue(filterMask) {
        return this._node.eachCheck(this.all, (element) => element.currently.hasAnyValue(), filterMask, true);
    }
    containsValue(value) {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.containsValue(expected), value);
    }
    get not() {
        return Object.assign({}, super.not, { hasValue: (value) => {
                return this._node.eachCheck(this.all, (element, expected) => element.currently.not.hasValue(expected), value);
            }, hasAnyValue: (filterMask) => {
                return this._node.eachCheck(this.all, (element) => element.currently.not.hasAnyValue(), filterMask, true);
            }, containsValue: (value) => {
                return this._node.eachCheck(this.all, (element, expected) => element.currently.not.containsValue(expected), value);
            } });
    }
}
class ValuePageElementListWait extends _1.PageElementListWait {
    hasValue(value, opts) {
        return this._node.eachWait(this._node.all, (element, expected) => element.wait.hasValue(expected, opts), value);
    }
    hasAnyValue(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.all, (element) => element.wait.hasAnyValue(otherOpts), filterMask, true);
    }
    containsValue(value, opts) {
        return this._node.eachWait(this._node.all, (element, expected) => element.wait.containsValue(expected, opts), value);
    }
    get not() {
        return Object.assign({}, super.not, { hasValue: (value, opts) => {
                return this._node.eachWait(this._node.all, (element, expected) => element.wait.not.hasValue(expected, opts), value);
            }, hasAnyValue: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.all, (element) => element.wait.not.hasAnyValue(otherOpts), filterMask, true);
            }, containsValue: (value, opts) => {
                return this._node.eachWait(this._node.all, (element, expected) => element.wait.not.containsValue(expected, opts), value);
            } });
    }
}
class ValuePageElementListEventually extends _1.PageElementListEventually {
    // CHECK STATE
    hasValue(value, opts) {
        return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.hasValue(expected, opts), value);
    }
    hasAnyValue(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.all, (element) => element.eventually.hasAnyValue(otherOpts), filterMask, true);
    }
    containsValue(value, opts) {
        return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.containsValue(expected, opts), value);
    }
    get not() {
        return Object.assign({}, super.not, { hasValue: (value, opts) => {
                return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.not.hasValue(expected, opts), value);
            }, hasAnyValue: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.all, (element) => element.eventually.not.hasAnyValue(otherOpts), filterMask, true);
            }, containsValue: (value, opts) => {
                return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.not.containsValue(expected, opts), value);
            } });
    }
}
//# sourceMappingURL=ValuePageElementList.js.map