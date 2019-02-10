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
const __1 = require("..");
const builders_1 = require("../builders");
/**
 * This class provides basic functionalities for all PageElements.
 *
 * @template Store type of the PageNodeStore used by PageElementBase to retrieve PageNodes from the store
 */
class PageElementBase extends _1.PageNode {
    /**
     * PageElementBase provides basic functionalities for all PageElements.
     *
     * @param selector the raw XPath selector of the PageElementBase
     * @param opts the options used to configure PageElementBase
     */
    constructor(selector, _a) {
        var { waitType = Workflo.WaitType.visible, timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || __1.DEFAULT_TIMEOUT, interval = JSON.parse(process.env.WORKFLO_CONFIG).intervals.default || __1.DEFAULT_INTERVAL } = _a, superOpts = __rest(_a, ["waitType", "timeout", "interval"]);
        super(selector, superOpts);
        this._$ = Object.create(null);
        this._timeout = timeout;
        this._interval = interval;
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
                        throw new Error(`Selector chaining via the '.$' accessor is not supported for PageElementGroups.
Instead, you can retrieve PageElementGroups directly from an instance of PageNodeStore.`);
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
    /**
     * `$` provides access to the PageNode retrieval functions of PageElementBase's PageNodeStore and prefixes the
     * selectors of all PageNodes retrieved via `$` with the selector of PageElementBase.
     */
    get $() {
        return this._$;
    }
    /**
     * Returns the XPath selector of PageElementBase.
     */
    getSelector() {
        return this._selector;
    }
    /**
     * Returns the default timeout that a PageElement uses if no other explicit timeout
     * is passed to one of its functions which operates with timeouts (eg. wait, eventually)
     */
    getTimeout() {
        return this._timeout;
    }
    /**
     * Returns the default interval that a PageElement uses if no other explicit interval
     * is passed to one of its functions which operates with intervals (eg. wait, eventually)
     */
    getInterval() {
        return this._interval;
    }
}
exports.PageElementBase = PageElementBase;
/**
 * This class defines all `currently` functions of PageElementBase.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementBaseCurrently defines all `currently`
 * functions
 */
class PageElementBaseCurrently extends _1.PageNodeCurrently {
    /**
     * Fetches the first webdriverio element from the HTML page that is identified by PageElement's XPath selector.
     */
    get element() {
        return browser.element(this._node.getSelector());
    }
    /**
     * Stores the values of `actual` and `expected` into `this._lastDiff` as strings.
     *
     * @param actual an actual value
     * @param expected an expected value
     */
    _writeLastDiff(actual, expected) {
        const diff = {
            actual: this._node.__typeToString(actual),
            timeout: this._node.getTimeout(),
        };
        diff.expected = this._node.__typeToString(expected);
        this._node.__setLastDiff(diff);
    }
    /**
     * Checks if the actual value lies within a given tolerance of the expected value.
     *
     * @param actual the actual value from the browser
     * @param expected the expected value or 0 if expected was smaller than 0
     * @param tolerance the tolerance or 0 if tolerance was smaller than 0
     */
    _withinTolerance(actual, expected, tolerance) {
        const tolerances = {
            lower: actual,
            upper: actual,
        };
        if (tolerance) {
            tolerances.lower -= Math.max(tolerance, 0);
            tolerances.upper += Math.max(tolerance, 0);
        }
        return Math.max(expected, 0) >= Math.max(tolerances.lower, 0) &&
            Math.max(expected, 0) <= Math.max(tolerances.upper, 0);
    }
    /**
     * Checks if the `actual` value has/equals the `expected` value and writes both values into `this._lastDiff`.
     *
     * @template T the type of both the actual and the expected value
     * @param expected the expected value
     * @param actual the actual value
     */
    _compareHas(expected, actual) {
        this._writeLastDiff(actual, expected);
        return this._node.__equals(actual, expected);
    }
    /**
     * Checks if `actual` has any value and writes `actual` into `this._lastDiff`.
     *
     * @template T the type of the actual value
     * @param actual the actual value
     */
    _compareHasAny(actual) {
        this._writeLastDiff(actual);
        return this._node.__any(actual);
    }
    /**
     * Checks if the `actual` value contains the `expected` value and writes both values into `this._lastDiff`.
     *
     * @template T the type of both the actual and the expected value
     * @param expected the value expected to be contained in the actual value
     * @param actual the actual value expected to contain the expected value
     */
    _compareContains(expected, actual) {
        this._writeLastDiff(actual, expected);
        return this._node.__contains(actual, expected);
    }
}
exports.PageElementBaseCurrently = PageElementBaseCurrently;
/**
 * This class defines all `wait` functions of PageElementBase.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementBaseWait defines all `wait`
 * functions
 */
class PageElementBaseWait extends _1.PageNodeWait {
    /**
     * This function waits for a certain condition to be met.
     *
     * It does so by invoking a condition function which checks if a certain condition eventually becomes true within a
     * specific timeout.
     *
     * A `WaitUntilTimeoutError` will be thrown and the PageElement's default timeout will be written to `_lastdiff`
     * if the condition function's return value is `false`.
     *
     * @param checkTypeStr describes what kind of check is performed by the condition function
     * @param conditionFunc a function that checks if a certain condition is eventually met within a specific timeout
     * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
     * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
     * condition function
     */
    _waitWdioCheckFunc(checkTypeStr, conditionFunc, { timeout = this._node.getTimeout(), reverse, interval = this._node.getInterval() } = {}) {
        const reverseStr = (reverse) ? ' not' : '';
        try {
            return this._node.__wait(() => conditionFunc({ timeout, reverse, interval }), ` never${reverseStr} ${checkTypeStr}`, timeout);
        }
        catch (error) {
            this._node.__setLastDiff({ timeout: this._node.getTimeout() });
            throw error;
        }
    }
    /**
     * This function can be used to assemble and execute a `wait` state check function.
     *
     * It regularly invokes a condition function until it returns true or until a specific timeout is reached.
     *
     * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
     * specific timeout.
     *
     * @param name the name of the property for which the wait condition is performed
     * @param conditionType the type of comparison performed in the conditionFunc
     * @param conditionFunc a function which compares an actual with an expected value
     * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
     * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
     * condition function
     * @param expectedValue the expected value passed to the conditionFunc
     */
    _waitProperty(name, conditionType, conditionFunc, { timeout = this._node.getTimeout(), reverse, interval = this._node.getInterval() } = {}, expectedValue) {
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
        return this._node.__waitUntil(() => (reverse) ? !conditionFunc(expectedValue) : conditionFunc(expectedValue), () => {
            if (conditionType === 'has' || conditionType === 'contains' || conditionType === 'within') {
                return `'s ${name} "${this._node.__lastDiff.actual}" never` +
                    `${reverseStr} ${conditionStr} "${this._node.__typeToString(expectedValue)}"`;
            }
            else if (conditionType === 'any') {
                return ` never${reverseStr} ${conditionStr} ${name}`;
            }
            else {
                return '';
            }
        }, timeout, interval);
    }
    /**
     * This function waits for an actual value to lie within a certain range of an expected value.
     *
     * It does so by regularly invoking a condition function until it returns true or until a specific timeout is reached.
     *
     * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
     * specific timeout.
     *
     * @param name the name of the property for which the wait condition is performed
     * @param expectedValue the expected value passed to the conditionFunc
     * @param conditionFunc a function which compares the actual and the expected value
     * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
     * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
     * condition function
     */
    _waitWithinProperty(name, expectedValue, conditionFunc, opts) {
        return this._waitProperty(name, 'within', conditionFunc, opts, expectedValue);
    }
    /**
     * This function waits for an actual value to have/equal an expected value.
     *
     * It does so by regularly invoking a condition function until it returns true or until a specific timeout is reached.
     *
     * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
     * specific timeout.
     *
     * @param name the name of the property for which the wait condition is performed
     * @param expectedValue the expected value passed to the conditionFunc
     * @param conditionFunc a function which compares the actual and the expected value
     * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
     * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
     * condition function
     */
    _waitHasProperty(name, expectedValue, conditionFunc, opts) {
        return this._waitProperty(name, 'has', conditionFunc, opts, expectedValue);
    }
    /**
     * This function waits for a property to have any value.
     *
     * It does so by regularly invoking a condition function until it returns true or until a specific timeout is reached.
     *
     * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
     * specific timeout.
     *
     * @param name the name of the property for which the wait condition is performed
     * @param conditionFunc a function which checks if a property has any value
     * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
     * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
     * condition function
     */
    _waitHasAnyProperty(name, conditionFunc, opts) {
        return this._waitProperty(name, 'any', conditionFunc, opts);
    }
    /**
     * This function waits for an actual value to contain an expected value.
     *
     * It does so by regularly invoking a condition function until it returns true or until a specific timeout is reached.
     *
     * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
     * specific timeout.
     *
     * @param name the name of the property for which the wait condition is performed
     * @param expectedValue the expected value passed to the conditionFunc
     * @param conditionFunc a function which compares the actual and the expected value
     * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
     * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
     * condition function
     */
    _waitContainsProperty(name, expectedValue, conditionFunc, opts) {
        return this._waitProperty(name, 'contains', conditionFunc, opts, expectedValue);
    }
    /**
     * Adds a `reverse` property to the passed opts parameter and sets its value to `true`.
     *
     * @param opts the object which should be extended with a `reverse` property
     */
    _makeReverseParams(opts = {}) {
        return { timeout: opts.timeout, reverse: true, interval: opts.interval };
    }
}
exports.PageElementBaseWait = PageElementBaseWait;
/**
 * This class defines all `eventually` functions of PageElementBase.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementBaseEventually defines all `eventually`
 * functions
 */
class PageElementBaseEventually extends _1.PageNodeEventually {
}
exports.PageElementBaseEventually = PageElementBaseEventually;
//# sourceMappingURL=PageElementBase.js.map