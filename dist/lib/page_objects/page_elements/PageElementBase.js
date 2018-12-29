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
const builders_1 = require("../builders");
const __1 = require("..");
class PageElementBase extends _1.PageNode {
    constructor(selector, _a) {
        var { interval, waitType = "visible" /* visible */ } = _a, superOpts = __rest(_a, ["interval", "waitType"]);
        super(selector, superOpts);
        this._interval = interval || JSON.parse(process.env.WORKFLO_CONFIG).intervals.default || __1.DEFAULT_INTERVAL;
        this._$ = Object.create(null);
        for (const method of Workflo.Class.getAllMethods(this._store)) {
            if (method.indexOf('_') !== 0 && /^[A-Z]/.test(method)) {
                this._$[method] = (_selector, _options) => {
                    if (_selector instanceof builders_1.XPathBuilder) {
                        _selector = builders_1.XPathBuilder.getInstance().build();
                    }
                    if (typeof _selector === 'object') {
                        // Cleaner solution would be to remove PageElementGroups from public store accessor of PageElement,
                        // but this does not work due to typescript bugs that prevent extended generics to work with keyof.
                        // typescript bugs 3.3.0:
                        // https://github.com/Microsoft/TypeScript/issues/24560, https://github.com/Microsoft/TypeScript/issues/24791
                        throw new Error("Selector chaining is not supported for PageElementGroups.");
                    }
                    // chain selectors
                    _selector = `${selector}${_selector}`;
                    return this._store[method].apply(this._store, [_selector, _options]);
                };
            }
        }
        this._waitType = waitType;
    }
    // typescript bugs 3.3.0: 
    // https://github.com/Microsoft/TypeScript/issues/24560, https://github.com/Microsoft/TypeScript/issues/24791
    get $() {
        return this._$;
    }
    getSelector() {
        return this._selector;
    }
    getTimeout() {
        return this._timeout;
    }
    getInterval() {
        return this._interval;
    }
}
exports.PageElementBase = PageElementBase;
class PageElementBaseCurrently extends _1.PageNodeCurrently {
    get element() {
        return browser.element(this._node.getSelector());
    }
    _writeLastDiff(actual, expected) {
        const diff = {
            actual: this._node.__typeToString(actual)
        };
        if (typeof expected !== 'undefined') {
            diff.expected = this._node.__typeToString(expected);
        }
        this._node.__setLastDiff(diff);
    }
    /**
     * @param actual the actual value from the browser
     * @param expected the expected value or 0 if expected was smaller than 0
     * @param tolerance the tolerance or 0 if tolerance was smaller than 0
     */
    _withinTolerance(actual, expected, tolerance) {
        const tolerances = {
            lower: actual,
            upper: actual
        };
        if (tolerance) {
            tolerances.lower -= Math.max(tolerance, 0);
            tolerances.upper += Math.max(tolerance, 0);
        }
        return Math.max(expected, 0) >= Math.max(tolerances.lower, 0) && Math.max(expected, 0) <= Math.max(tolerances.upper, 0);
    }
    _compareHas(expected, actual) {
        this._writeLastDiff(actual, expected);
        return this._node.__equals(actual, expected);
    }
    _compareHasAny(actual) {
        this._writeLastDiff(actual);
        return this._node.__any(actual);
    }
    _compareContains(expected, actual) {
        this._writeLastDiff(actual, expected);
        return this._node.__contains(actual, expected);
    }
}
exports.PageElementBaseCurrently = PageElementBaseCurrently;
class PageElementBaseWait extends _1.PageNodeWait {
    _waitWdioCheckFunc(checkTypeStr, conditionFunc, { timeout = this._node.getTimeout(), reverse, interval = this._node.getInterval() } = {}) {
        const reverseStr = (reverse) ? ' not' : '';
        return this._node.__wait(() => conditionFunc({ timeout, reverse, interval }), ` never${reverseStr} ${checkTypeStr}`, timeout);
    }
    _waitProperty(name, conditionType, conditionFunc, { timeout = this._node.getTimeout(), reverse, interval = this._node.getInterval() } = {}, value) {
        const reverseStr = (reverse) ? ' not' : '';
        let conditionStr = '';
        if (conditionType === 'has') {
            conditionStr = 'became';
        }
        else if (conditionType === 'contains') {
            conditionStr = 'contained';
        }
        else if (conditionType === 'any') {
            conditionStr = 'had any';
        }
        else if (conditionType === 'within') {
            conditionStr = 'was in range';
        }
        return this._node.__waitUntil(() => (reverse) ? !conditionFunc(value) : conditionFunc(value), () => {
            if (conditionType === 'has' || conditionType === 'contains' || conditionType === 'within') {
                return `'s ${name} "${this._node.__lastDiff.actual}" never` +
                    `${reverseStr} ${conditionStr} "${this._node.__typeToString(value)}"`;
            }
            else if (conditionType === 'any') {
                return ` never${reverseStr} ${conditionStr} ${name}`;
            }
            else {
                return '';
            }
        }, timeout, interval);
    }
    _waitWithinProperty(name, value, conditionFunc, opts) {
        return this._waitProperty(name, 'within', conditionFunc, opts, value);
    }
    _waitHasProperty(name, value, conditionFunc, opts) {
        return this._waitProperty(name, 'has', conditionFunc, opts, value);
    }
    _waitHasAnyProperty(name, conditionFunc, opts) {
        return this._waitProperty(name, 'any', conditionFunc, opts);
    }
    _waitContainsProperty(name, value, conditionFunc, opts) {
        return this._waitProperty(name, 'contains', conditionFunc, opts, value);
    }
    _makeReverseParams(opts = {}) {
        return { timeout: opts.timeout, reverse: true, interval: opts.interval };
    }
}
exports.PageElementBaseWait = PageElementBaseWait;
class PageElementBaseEventually extends _1.PageNodeEventually {
}
exports.PageElementBaseEventually = PageElementBaseEventually;
//# sourceMappingURL=PageElementBase.js.map