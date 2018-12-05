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
        this.eventually = new ValuePageElementGroupEventually(this);
    }
    getValue(filter) {
        let result = {};
        for (const k in this.$) {
            if (isGetValueNode(this.$[k])) {
                const elem = this.$[k];
                if (filter) {
                    if (typeof filter[k] !== 'undefined') {
                        result[k] = elem.getValue();
                    }
                }
                else {
                    result[k] = elem.getValue();
                }
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
    // HELPER FUNCTIONS
    __compareValue(compareFunc, expected) {
        const diffs = {};
        for (const k in expected) {
            if (isGetValueNode(this._$[k])) {
                const elem = this._$[k];
                if (!compareFunc(elem, expected[k])) {
                    diffs[k] = elem.__lastDiff;
                }
            }
        }
        this._lastDiff = {
            tree: diffs
        };
        return Object.keys(diffs).length === 0;
    }
}
exports.ValuePageElementGroup = ValuePageElementGroup;
class ValuePageElementGroupCurrently extends _1.PageElementGroupCurrently {
    constructor() {
        super(...arguments);
        this.not = Object.assign({}, super.not, { hasValue: (value) => {
                return this._node.__compareValue((element, expected) => element.currently.not.hasValue(expected), value);
            }, hasAnyValue: () => {
                return this._node.__compareValue(element => element.currently.not.hasAnyValue());
            }, containsValue: (value) => {
                return this._node.__compareValue((element, expected) => element.currently.not.containsValue(expected), value);
            } });
    }
    getValue(filter) {
        let result = {};
        for (const k in this._node.$) {
            if (isGetValueNode(this._node.$[k])) {
                const elem = this._node.$[k];
                if (filter) {
                    if (typeof filter[k] !== 'undefined') {
                        result[k] = elem.currently.getValue();
                    }
                }
                else {
                    result[k] = elem.currently.getValue();
                }
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
                node.currently.setValue(values[k]);
            }
        }
        return this._node;
    }
    hasValue(value) {
        return this._node.__compareValue((element, expected) => element.currently.hasValue(expected), value);
    }
    hasAnyValue() {
        return this._node.__compareValue(element => element.currently.hasAnyValue());
    }
    containsValue(value) {
        return this._node.__compareValue((element, expected) => element.currently.containsValue(expected), value);
    }
}
class ValuePageElementGroupEventually extends _1.PageElementGroupEventually {
    constructor() {
        super(...arguments);
        this.not = Object.assign({}, super.not, { hasValue: (value, opts) => {
                return this._node.__compareValue((element, expected) => element.eventually.not.hasValue(expected, opts), value);
            }, hasAnyValue: (opts) => {
                return this._node.__compareValue(element => element.eventually.not.hasAnyValue());
            }, containsValue: (value, opts) => {
                return this._node.__compareValue((element, expected) => element.eventually.not.containsValue(expected, opts), value);
            } });
    }
    hasValue(value, opts) {
        return this._node.__compareValue((element, expected) => element.eventually.hasValue(expected, opts), value);
    }
    hasAnyValue(opts) {
        return this._node.__compareValue(element => element.eventually.hasAnyValue(opts));
    }
    containsValue(value, opts) {
        return this._node.__compareValue((element, expected) => element.eventually.containsValue(expected, opts), value);
    }
}
// type guards
function isGetValueNode(node) {
    return typeof node.getValue === 'function';
}
function isSetValueNode(node) {
    return typeof node.setValue === 'function';
}
//# sourceMappingURL=ValuePageElementGroup.js.map