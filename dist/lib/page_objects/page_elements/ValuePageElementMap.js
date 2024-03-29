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
/**
 * ValuePageElementMap extends PageElementMap with the possibility to set, retrieve and check the values of
 * ValuePageElements managed by ValuePageElementMap.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template K the key names of ValuePageElementMap's `$` accessor used to access the map's managed ValuePageElements
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementMap
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the ValuePageElements
 * managed by ValuePageElementMap
 * @template ValueType type of the values of ValuePageElements managed by ValuePageElementMap
 */
class ValuePageElementMap extends _1.PageElementMap {
    /**
     * ValuePageElementMap extends PageElementMap with the possibility to set, retrieve and check the values of
     * ValuePageElements managed by ValuePageElementMap.
     *
     * @param selector an XPath expression which identifies all ValuePageElements managed by ValuePageElementMap
     * @param opts the options used to configure ValuePageElementMap
     */
    constructor(selector, opts) {
        super(selector, opts);
        this.currently = new ValuePageElementMapCurrently(this);
        this.wait = new ValuePageElementMapWait(this);
        this.eventually = new ValuePageElementMapEventually(this);
    }
    /**
     * Returns the values of all ValuePageElements managed by ValuePageElementMap as a result map after performing the
     * initial waiting condition of each ValuePageElement.
     *
     * @param filterMask can be used to skip the invocation of the `getValue` function for some or all managed
     * ValuePageElements. The results of skipped function invocations are not included in the total results object.
     */
    getValue(filterMask) {
        return this.eachGet(this._$, node => node.getValue(), filterMask);
    }
    /**
     * Returns the 'hasValue' status of all ValuePageElements managed by ValuePageElementMap as a result map after
     * performing the initial waiting condition of each managed ValuePageElement.
     *
     * A ValuePageElement's 'hasValue' status is set to true if its actual text equals the expected text.
     *
     * @param values the expected values used in the comparisons which set the 'hasValue' status
     */
    getHasValue(values) {
        return this.eachCompare(this.$, (element, expected) => element.currently.hasValue(expected), values);
    }
    /**
     * Returns the 'hasAnyValue' status of all ValuePageElements managed by ValuePageElementMap as a result map after
     * performing the initial waiting condition of each managed ValuePageElement.
     *
     * A ValuePageElement's 'hasAnyValue' status is set to true if the ValuePageElement has any text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyValue` function for some or all managed
     * ValuePageElements. The results of skipped function invocations are not included in the total results object.
     */
    getHasAnyValue(filterMask) {
        return this.eachCompare(this.$, (element) => element.currently.hasAnyValue(), filterMask, true);
    }
    /**
     * Returns the 'containsValue' status of all ValuePageElements managed by ValuePageElementMap as a result map after
     * performing the initial waiting condition of each managed ValuePageElement.
     *
     * A ValuePageElement's 'containsValue' status is set to true if its actual text contains the expected text.
     *
     * @param values the expected values used in the comparisons which set the 'containsValue' status
     */
    getContainsValue(values) {
        return this.eachCompare(this.$, (element, expected) => element.currently.containsValue(expected), values);
    }
    /**
     * This function sets the passed values to all ValuePageElements managed by ValuePageElementMap
     * after performing the initial waiting condition of each ValuePageElement.
     *
     * @param values a map of setter values
     */
    setValue(values) {
        return this.eachSet(this._$, (element, value) => element.setValue(value), values);
    }
}
exports.ValuePageElementMap = ValuePageElementMap;
/**
 * This class defines all `currently` functions of ValuePageElementMap.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template K the key names of ValuePageElementMap's `$` accessor used to access the map's managed ValuePageElements
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementMap
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the ValuePageElements
 * managed by ValuePageElementMap
 * @template MapType type of the ValuePageElementMap for which ValuePageElementMapCurrently defines all `currently`
 * functions
 * @template ValueType type of the values of ValuePageElements managed by ValuePageElementMap
 */
class ValuePageElementMapCurrently extends _1.PageElementMapCurrently {
    /**
     * Returns the current values of all ValuePageElements managed by ValuePageElementMap as a result map.
     *
     * @param filterMask can be used to skip the invocation of the `getValue` function for some or all managed
     * ValuePageElements. The results of skipped function invocations are not included in the total results object.
     */
    getValue(filterMask) {
        return this._node.eachGet(this._node.$, node => node.currently.getValue(), filterMask);
    }
    /**
     * Returns the current 'hasValue' status of all ValuePageElements managed by ValuePageElementMap as a result map.
     *
     * A ValuePageElement's 'hasValue' status is set to true if its actual text equals the expected text.
     *
     * @param values the expected values used in the comparisons which set the 'hasValue' status
     */
    getHasValue(values) {
        return this._node.eachCompare(this._node.$, (element, expected) => element.currently.hasValue(expected), values);
    }
    /**
     * Returns the current 'hasAnyValue' status of all ValuePageElements managed by ValuePageElementMap as a result map.
     *
     * A ValuePageElement's 'hasAnyValue' status is set to true if the ValuePageElement has any text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyValue` function for some or all managed
     * ValuePageElements. The results of skipped function invocations are not included in the total results object.
     */
    getHasAnyValue(filterMask) {
        return this._node.eachCompare(this._node.$, (element) => element.currently.hasAnyValue(), filterMask, true);
    }
    /**
     * Returns the current 'containsValue' status of all ValuePageElements managed by ValuePageElementMap as a result map.
     *
     * A ValuePageElement's 'containsValue' status is set to true if its actual text contains the expected text.
     *
     * @param values the expected values used in the comparisons which set the 'containsValue' status
     */
    getContainsValue(values) {
        return this._node.eachCompare(this._node.$, (element, expected) => element.currently.containsValue(expected), values);
    }
    /**
     * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap currently equal the
     * expected values.
     *
     * @param values the expected values supposed to equal the actual values
     */
    hasValue(values) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.currently.hasValue(expected), values);
    }
    /**
     * Returns true if all ValuePageElements managed by ValuePageElementMap currently have any text.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyValue` function for some or all managed
     * ValuePageElements
     */
    hasAnyValue(filterMask) {
        return this._node.eachCheck(this._node.$, (element) => element.currently.hasAnyValue(), filterMask, true);
    }
    /**
     * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap currently contain the
     * expected values.
     *
     * @param values the expected values supposed to be contained in the actual values
     */
    containsValue(values) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.currently.containsValue(expected), values);
    }
    /**
     * returns the negated variants of ValuePageElementMapCurrently's state check functions
     */
    get not() {
        return Object.assign({}, super.not, { 
            /**
             * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap currently do not
             * equal the expected values.
             *
             * @param values the expected values supposed not to equal the actual values
             */
            hasValue: (values) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.currently.not.hasValue(expected), values);
            }, 
            /**
             * Returns true if all ValuePageElements managed by ValuePageElementMap currently do not have any text.
             *
             * @param filterMask can be used to skip the invocation of the `hasAnyValue` function for some or all managed
             * ValuePageElements
             */
            hasAnyValue: (filterMask) => {
                return this._node.eachCheck(this._node.$, element => element.currently.not.hasAnyValue(), filterMask, true);
            }, 
            /**
             * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap currently do not
             * contain the expected values.
             *
             * @param values the expected values supposed not to be contained in the actual values
             */
            containsValue: (values) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.currently.not.containsValue(expected), values);
            } });
    }
}
/**
 * This class defines all `wait` functions of ValuePageElementMap.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template K the key names of ValuePageElementMap's `$` accessor used to access the map's managed ValuePageElements
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementMap
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the ValuePageElements
 * managed by ValuePageElementMap
 * @template MapType type of the ValuePageElementMap for which ValuePageElementMapWait defines all `wait`
 * functions
 * @template ValueType type of the values of ValuePageElements managed by ValuePageElementMap
 */
class ValuePageElementMapWait extends _1.PageElementMapWait {
    /**
     * Waits for the actual values of all ValuePageElements managed by ValuePageElementMap to equal the expected values.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param values the expected values supposed to equal the actual values
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     *
     * @returns this (an instance of ValuePageElementMap)
     */
    hasValue(values, opts) {
        return this._node.eachWait(this._node.$, (element, expected) => element.wait.hasValue(expected, opts), values);
    }
    /**
     * Waits for all ValuePageElements managed by ValuePageElementMap to have any text.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for some
     * or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the `interval`
     * used to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     *
     * @returns this (an instance of ValuePageElementMap)
     */
    hasAnyValue(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.$, element => element.wait.hasAnyValue(otherOpts), filterMask, true);
    }
    /**
     * Waits for the actual values of all ValuePageElements managed by ValuePageElementMap to contain the expected values.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param values the expected values supposed to be contained in the actual values
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     *
     * @returns this (an instance of ValuePageElementMap)
     */
    containsValue(values, opts) {
        return this._node.eachWait(this._node.$, (element, expected) => element.wait.containsValue(expected, opts), values);
    }
    /**
     * returns the negated variants of ValuePageElementMapWait's state check functions
     */
    get not() {
        return Object.assign({}, super.not, { 
            /**
             * Waits for the actual values of all ValuePageElements managed by ValuePageElementMap not to equal the expected
             * values.
             *
             * Throws an error if the condition is not met within a specific timeout.
             *
             * @param values the expected values supposed not to equal the actual values
             * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
             * to check it
             *
             * If no `timeout` is specified, a ValuePageElement's default timeout is used.
             * If no `interval` is specified, a ValuePageElement's default interval is used.
             *
             * @returns this (an instance of ValuePageElementMap)
             */
            hasValue: (values, opts) => {
                return this._node.eachWait(this._node.$, (element, expected) => element.wait.not.hasValue(expected, opts), values);
            }, 
            /**
             * Waits for all ValuePageElements managed by ValuePageElementMap not to have any text.
             *
             * Throws an error if the condition is not met within a specific timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for
             * some or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the
             * `interval` used to check it
             *
             * If no `timeout` is specified, a ValuePageElement's default timeout is used.
             * If no `interval` is specified, a ValuePageElement's default interval is used.
             *
             * @returns this (an instance of ValuePageElementMap)
             */
            hasAnyValue: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.$, element => element.wait.not.hasAnyValue(otherOpts), filterMask, true);
            }, 
            /**
             * Waits for the actual values of all ValuePageElements managed by ValuePageElementMap not to contain the expected
             * values.
             *
             * Throws an error if the condition is not met within a specific timeout.
             *
             * @param values the expected values supposed not to be contained in the actual values
             * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
             * to check it
             *
             * If no `timeout` is specified, a ValuePageElement's default timeout is used.
             * If no `interval` is specified, a ValuePageElement's default interval is used.
             *
             * @returns this (an instance of ValuePageElementMap)
             */
            containsValue: (values, opts) => {
                return this._node.eachWait(this._node.$, (element, expected) => element.wait.not.containsValue(expected, opts), values);
            } });
    }
}
/**
 * This class defines all `eventually` functions of ValuePageElementMap.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template K the key names of ValuePageElementMap's `$` accessor used to access the map's managed ValuePageElements
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementMap
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the ValuePageElements
 * managed by ValuePageElementMap
 * @template MapType type of the ValuePageElementMap for which ValuePageElementMapEventually defines all `eventually`
 * functions
 * @template ValueType type of the values of ValuePageElements managed by ValuePageElementMap
 */
class ValuePageElementMapEventually extends _1.PageElementMapEventually {
    /**
     * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap eventually equal the
     * expected values within a specific timeout.
     *
     * @param values the expected values supposed to equal the actual values
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     */
    hasValue(values, opts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.hasValue(expected, opts), values);
    }
    /**
     * Returns true if all ValuePageElements managed by ValuePageElementMap eventually have any text within a specific
     * timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for some
     * or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the `interval`
     * used to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     */
    hasAnyValue(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.$, element => element.eventually.hasAnyValue(otherOpts), filterMask, true);
    }
    /**
     * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap eventually contain the
     * expected values within a specific timeout.
     *
     * @param values the expected values supposed to be contained in the actual values
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     */
    containsValue(values, opts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.containsValue(expected, opts), values);
    }
    /**
     * returns the negated variants of ValuePageElementMapEventually's state check functions
     */
    get not() {
        return Object.assign({}, super.not, { 
            /**
             * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap eventually do not
             * equal the expected values within a specific timeout.
             *
             * @param values the expected values supposed not to equal the actual values
             * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
             * to check it
             *
             * If no `timeout` is specified, a ValuePageElement's default timeout is used.
             * If no `interval` is specified, a ValuePageElement's default interval is used.
             */
            hasValue: (values, opts) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.not.hasValue(expected, opts), values);
            }, 
            /**
             * Returns true if all ValuePageElements managed by ValuePageElementMap eventually do not have any text within a
             * specific timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for
             * some or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the
             * `interval` used to check it
             *
             * If no `timeout` is specified, a ValuePageElement's default timeout is used.
             * If no `interval` is specified, a ValuePageElement's default interval is used.
             */
            hasAnyValue: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.$, element => element.eventually.not.hasAnyValue(otherOpts), filterMask, true);
            }, 
            /**
             * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap eventually do not
             * contain the expected values within a specific timeout.
             *
             * @param values the expected values supposed not to be contained in the actual values
             * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
             * to check it
             *
             * If no `timeout` is specified, a ValuePageElement's default timeout is used.
             * If no `interval` is specified, a ValuePageElement's default interval is used.
             */
            containsValue: (values, opts) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.not.containsValue(expected, opts), values);
            } });
    }
}
//# sourceMappingURL=ValuePageElementMap.js.map