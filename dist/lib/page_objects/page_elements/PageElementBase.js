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
const _ = require("lodash");
const _1 = require(".");
const builders_1 = require("../builders");
const __1 = require("..");
class PageElementBase extends _1.PageNode {
    constructor(selector, _a) {
        var { waitType = "visible" /* visible */, timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || __1.DEFAULT_TIMEOUT } = _a, superOpts = __rest(_a, ["waitType", "timeout"]);
        super(selector, superOpts);
        this._selector = selector;
        this._$ = Object.create(null);
        for (const method of Workflo.Class.getAllMethods(this._store)) {
            if (method.indexOf('_') !== 0 && /^[A-Z]/.test(method)) {
                this._$[method] = (_selector, _options) => {
                    if (_selector instanceof builders_1.XPathBuilder) {
                        selector = builders_1.XPathBuilder.getInstance().build();
                    }
                    // chain selectors
                    _selector = `${selector}${_selector}`;
                    return this._store[method].apply(this._store, [_selector, _options]);
                };
            }
        }
        this._waitType = waitType;
        this._timeout = timeout;
    }
    get $() {
        return this._$;
    }
    getTimeout() { return this._timeout; }
}
exports.PageElementBase = PageElementBase;
class PageElementBaseCurrently extends _1.PageNodeCurrently {
    /**
     * Whenever a function that checks the state of the GUI
     * by comparing an expected result to an actual result is called,
     * the actual and expected result and the selector will be stored in 'lastDiff'.
     *
     * This can be useful to determine why the last invocation of such a function returned false.
     *
     * These "check-GUI-state functions" include all hasXXX, hasAnyXXX and containsXXX functions
     * defined in the .currently, .eventually and .wait API of PageElement.
     */
    get __lastDiff() {
        return _.merge(this._lastDiff, { selector: this._node.getSelector() });
    }
    get element() {
        return browser.element(this._node.getSelector());
    }
    /**
     * Executes func and, if an error occurs during execution of func,
     * throws a custom error message that the page element could not be located on the page.
     * @param func
     */
    _execute(func) {
        try {
            return func();
        }
        catch (error) {
            const errorMsg = `${this._node.constructor.name} could not be located on the page.\n` +
                `( ${this._node.getSelector()} )`;
            throw new Error(errorMsg);
        }
    }
    _writeLastDiff(actual, expected) {
        this._lastDiff = {
            actual: this._node.__typeToString(actual),
        };
        if (typeof expected !== 'undefined') {
            this._lastDiff.expected = this._node.__typeToString(expected);
        }
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
    _wait(func, errorMessage) {
        try {
            func();
        }
        catch (error) {
            throw new Error(`${this._node.constructor.name}${errorMessage}.\n( ${this._node.getSelector()} )`);
        }
        return this._node;
    }
    _waitWdioCheckFunc(checkTypeStr, conditionFunc, { timeout = this._node.getTimeout(), reverse } = {}) {
        const reverseStr = (reverse) ? ' not' : '';
        return this._wait(() => conditionFunc({ timeout, reverse }), ` never${reverseStr} ${checkTypeStr} within ${timeout} ms`);
    }
    _waitProperty(name, conditionType, conditionFunc, { timeout = this._node.getTimeout(), reverse } = {}, value) {
        const reverseStr = (reverse) ? ' not' : '';
        let conditionStr = '';
        let errorMessage = '';
        if (conditionType === 'has') {
            conditionStr = 'became';
        }
        else if (conditionType === 'contains') {
            conditionStr = 'contained';
        }
        else if (conditionType === 'any') {
            conditionStr = 'any';
        }
        else if (conditionType === 'within') {
            conditionStr = 'was in range';
        }
        try {
            browser.waitUntil(() => {
                if (reverse) {
                    return !conditionFunc(value);
                }
                else {
                    return conditionFunc(value);
                }
            }, timeout);
        }
        catch (error) {
            if (conditionType === 'has' || conditionType === 'contains' || conditionType === 'within') {
                errorMessage =
                    `${this._node.constructor.name}'s ${name} "${this._node.__lastDiff.actual}" never` +
                        `${reverseStr} ${conditionStr} "${this._node.__typeToString(value)}" within ${timeout} ms.\n` +
                        `( ${this._node.getSelector()} )`;
            }
            else if (conditionType === 'any') {
                errorMessage =
                    `${this._node.constructor.name} never${reverseStr} ${conditionStr} any ${name}` +
                        ` within ${timeout} ms.\n( ${this._node.getSelector()} )`;
            }
            throw new Error(errorMessage);
        }
        return this._node;
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
        return { timeout: opts.timeout, reverse: true };
    }
}
exports.PageElementBaseWait = PageElementBaseWait;
class PageElementBaseEventually extends _1.PageNodeEventually {
    _eventually(func) {
        try {
            func();
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.PageElementBaseEventually = PageElementBaseEventually;
//# sourceMappingURL=PageElementBase.js.map