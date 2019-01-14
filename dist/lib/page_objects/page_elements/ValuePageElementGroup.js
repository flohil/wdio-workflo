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
/**
 * ValuePageElementGroup extends PageElementGroup with the possibility to set, retrieve and check the values of
 * ValuePageElements, ValuePageElementLists and ValuePageElementMaps managed by ValuePageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 */
class ValuePageElementGroup extends _1.PageElementGroup {
    /**
     * ValuePageElementGroup extends PageElementGroup with the possibility to set, retrieve and check the values of
     * ValuePageElements, ValuePageElementLists and ValuePageElementMaps managed by ValuePageElementGroup.
     *
     * @param id a string which uniquely identifies a ValuePageElementGroup in a PageNodeStore
     * @param opts the options used to configure ValuePageElementGroup
     */
    constructor(id, _a) {
        var superOpts = __rest(_a, []);
        super(id, superOpts);
        this.currently = new ValuePageElementGroupCurrently(this);
        this.wait = new ValuePageElementGroupWait(this);
        this.eventually = new ValuePageElementGroupEventually(this);
    }
    /**
     * Returns the values of all PageNodes managed by ValuePageElementGroup as a result structure after executing the
     * initial waiting condition of each PageNode.
     *
     * @param filterMask can be used to skip the invocation of the `getValue` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getValue(filterMask) {
        return this.eachGet(isIValueElementNode, ({ node, filter }) => node.getValue(filter), filterMask);
    }
    /**
     * Returns the 'hasValue' status of all PageNodes managed by ValuePageElementGroup as a result structure after
     * executing the initial waiting condition of each PageNode.
     *
     * A ValuePageElement's 'hasValue' status is set to true if its actual value equals the expected value.
     *
     * @param values the expected values used in the comparisons which set the 'hasValue' status
     */
    getHasValue(values) {
        return this.eachCompare(isIValueElementNode, ({ node, expected }) => node.getHasValue(expected), values);
    }
    /**
     * Returns the 'hasAnyValue' status of all PageNodes managed by ValuePageElementGroup as a result structure after
     * performing the initial waiting condition of each PageNode.
     *
     * A ValuePageElement's 'hasAnyValue' status is set to true if the ValuePageElement has any value.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyValue` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getHasAnyValue(filterMask) {
        return this.eachCompare(isIValueElementNode, ({ node, filter }) => node.getHasAnyValue(filter), filterMask, true);
    }
    /**
     * Returns the 'containsValue' status of all PageNodes managed by ValuePageElementGroup as a result structure after
     * executing the initial waiting condition of each PageNode.
     *
     * A ValuePageElement's 'containsValue' status is set to true if its actual value contains the expected value.
     *
     * @param values the expected values used in the comparisons which set the 'containsValue' status
     */
    getContainsValue(values) {
        return this.eachCompare(isIValueElementNode, ({ node, expected }) => node.getContainsValue(expected), values);
    }
    /**
     * This function sets the passed values to all ValuePageElements managed by ValuePageElementGroup
     * after performing the initial waiting condition of each ValuePageElement.
     *
     * @param values a structure of setter values
     */
    setValue(values) {
        return this.eachSet(isIValueElementNode, ({ node, value }) => node.setValue(value), values);
    }
}
exports.ValuePageElementGroup = ValuePageElementGroup;
/**
 * This class defines all `currently` functions of ValuePageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 * @template GroupType type of the ValuePageElementGroup for which ValuePageElementGroupCurrently defines all
 * `currently` functions
 */
class ValuePageElementGroupCurrently extends _1.PageElementGroupCurrently {
    /**
     * Returns the current values of all PageNodes managed by ValuePageElementGroup as a result structure.
     *
     * @param filterMask can be used to skip the invocation of the `getValue` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getValue(filterMask) {
        return this._node.eachGet(isIValueElementNode, ({ node, filter }) => node.currently.getValue(filter), filterMask);
    }
    /**
     * Returns the current 'hasValue' status of all PageNodes managed by ValuePageElementGroup as a result structure.
     *
     * A PageNode's 'hasValue' status is set to true if its actual value equals the expected value.
     *
     * @param values the expected values used in the comparisons which set the 'hasValue' status
     */
    getHasValue(values) {
        return this._node.eachCompare(isIValueElementNode, ({ node, expected }) => node.currently.getHasValue(expected), values);
    }
    /**
     * Returns the current 'hasAnyValue' status of all PageNodes managed by ValuePageElementGroup as a result structure.
     *
     * A PageNode's 'hasAnyValue' status is set to true if the PageNode has any value.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyValue` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getHasAnyValue(filterMask) {
        return this._node.eachCompare(isIValueElementNode, ({ node, filter }) => node.currently.getHasAnyValue(filter), filterMask, true);
    }
    /**
     * Returns the current 'containsValue' status of all PageNodes managed by ValuePageElementGroup as a result structure.
     *
     * A PageNode's 'containsValue' status is set to true if its actual value contains the expected value.
     *
     * @param values the expected values used in the comparisons which set the 'containsValue' status
     */
    getContainsValue(values) {
        return this._node.eachCompare(isIValueElementNode, ({ node, expected }) => node.currently.getContainsValue(expected), values);
    }
    /**
     * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup currently equal the expected
     * values.
     *
     * @param values the expected values supposed to equal the actual values
     */
    hasValue(values) {
        return this._node.eachCheck(isIValueElementNode, ({ node, expected }) => node.currently.hasValue(expected), values);
    }
    /**
     * Returns true if all PageNodes managed by ValuePageElementGroup currently have any value.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyValue` function for some or all managed
     * PageNodes
     */
    hasAnyValue(filterMask) {
        return this._node.eachCheck(isIValueElementNode, ({ node, filter }) => node.currently.hasAnyValue(filter), filterMask, true);
    }
    /**
     * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup currently contain the expected
     * values.
     *
     * @param values the expected values supposed to be contained in the actual values
     */
    containsValue(values) {
        return this._node.eachCheck(isIValueElementNode, ({ node, expected }) => node.currently.containsValue(expected), values);
    }
    /**
     * returns the negated variants of ValuePageElementGroupCurrently's state check functions
     */
    get not() {
        return Object.assign({}, super.not, { 
            /**
             * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup currently do not equal the
             * expected values.
             *
             * @param values the expected values supposed not to equal the actual values
             */
            hasValue: (values) => {
                return this._node.eachCheck(isIValueElementNode, ({ node, expected }) => node.currently.not.hasValue(expected), values);
            }, 
            /**
             * Returns true if all PageNodes managed by ValuePageElementGroup currently do not have any value.
             *
             * @param filterMask can be used to skip the invocation of the `hasAnyValue` function for some or all managed
             * PageNodes
             */
            hasAnyValue: (filterMask) => {
                return this._node.eachCheck(isIValueElementNode, ({ node, filter }) => node.currently.not.hasAnyValue(filter), filterMask, true);
            }, 
            /**
             * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup currently do not contain
             * the expected values.
             *
             * @param values the expected values supposed not to be contained in the actual values
             */
            containsValue: (values) => {
                return this._node.eachCheck(isIValueElementNode, ({ node, expected }) => node.currently.not.containsValue(expected), values);
            } });
    }
}
/**
 * This class defines all `wait` functions of ValuePageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 * @template GroupType type of the ValuePageElementGroup for which ValuePageElementGroupWait defines all `wait`
 * functions
 */
class ValuePageElementGroupWait extends _1.PageElementGroupWait {
    /**
     * Waits for the actual values of all PageNodes managed by ValuePageElementGroup to equal the expected values.
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
     * @returns this (an instance of ValuePageElementGroup)
     */
    hasValue(values, opts) {
        return this._node.eachWait(isIValueElementNode, ({ node, expected }) => node.wait.hasValue(expected, opts), values);
    }
    /**
     * Waits for all PageNodes managed by ValuePageElementGroup to have any value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for some
     * or all managed PageNodes, the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     *
     * @returns this (an instance of ValuePageElementGroup)
     */
    hasAnyValue(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(isIValueElementNode, ({ node, filter }) => node.wait.hasAnyValue(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
    }
    /**
     * Waits for the actual values of all PageNodes managed by ValuePageElementGroup to contain the expected values.
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
     * @returns this (an instance of ValuePageElementGroup)
     */
    containsValue(values, opts) {
        return this._node.eachWait(isIValueElementNode, ({ node, expected }) => node.wait.containsValue(expected, opts), values);
    }
    /**
     * returns the negated variants of ValuePageElementGroupWait's state check functions
     */
    get not() {
        return Object.assign({}, super.not, { 
            /**
             * Waits for the actual values of all PageNodes managed by ValuePageElementGroup not to equal the expected values.
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
             * @returns this (an instance of ValuePageElementGroup)
             */
            hasValue: (values, opts) => {
                return this._node.eachWait(isIValueElementNode, ({ node, expected }) => node.wait.hasValue(expected, opts), values);
            }, 
            /**
             * Waits for all PageNodes managed by ValuePageElementGroup not to have any value.
             *
             * Throws an error if the condition is not met within a specific timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for
             * some or all managed PageNodes, the `timeout` within which the condition is expected to be met and the
             * `interval` used to check it
             *
             * If no `timeout` is specified, a ValuePageElement's default timeout is used.
             * If no `interval` is specified, a ValuePageElement's default interval is used.
             *
             * @returns this (an instance of ValuePageElementGroup)
             */
            hasAnyValue: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(isIValueElementNode, ({ node, filter }) => node.wait.hasAnyValue(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
            }, 
            /**
             * Waits for the actual values of all PageNodes managed by ValuePageElementGroup not to contain the expected
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
             * @returns this (an instance of ValuePageElementGroup)
             */
            containsValue: (values, opts) => {
                return this._node.eachWait(isIValueElementNode, ({ node, expected }) => node.wait.containsValue(expected, opts), values);
            } });
    }
}
/**
 * This class defines all `eventually` functions of ValuePageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 * @template GroupType type of the ValuePageElementGroup for which ValuePageElementGroupEventually defines all
 * `eventually` functions
 */
class ValuePageElementGroupEventually extends _1.PageElementGroupEventually {
    /**
     * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup eventually equal the expected
     * values within a specific timeout.
     *
     * @param values the expected values supposed to equal the actual values
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     */
    hasValue(values, opts) {
        return this._node.eachCheck(isIValueElementNode, ({ node, expected }) => node.eventually.hasValue(expected, opts), values);
    }
    /**
     * Returns true if all PageNodes managed by ValuePageElementGroup eventually have any value within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for some
     * or all managed PageNodes, the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     */
    hasAnyValue(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(isIValueElementNode, ({ node, filter }) => node.eventually.hasAnyValue(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
    }
    /**
     * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup eventually contain the expected
     * values within a specific timeout.
     *
     * @param values the expected values supposed to be contained in the actual values
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     */
    containsValue(values, opts) {
        return this._node.eachCheck(isIValueElementNode, ({ node, expected }) => node.eventually.containsValue(expected, opts), values);
    }
    /**
     * returns the negated variants of ValuePageElementGroupEventually's state check functions
     */
    get not() {
        return Object.assign({}, super.not, { 
            /**
             * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup eventually do not equal the
             * expected values within a specific timeout.
             *
             * @param values the expected values supposed not to equal the actual values
             * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
             * to check it
             *
             * If no `timeout` is specified, a ValuePageElement's default timeout is used.
             * If no `interval` is specified, a ValuePageElement's default interval is used.
             */
            hasValue: (values, opts) => {
                return this._node.eachCheck(isIValueElementNode, ({ node, expected }) => node.eventually.not.hasValue(expected, opts), values);
            }, 
            /**
             * Returns true if all PageNodes managed by ValuePageElementGroup eventually do not have any value within a
             * specific timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for
             * some or all managed PageNodes, the `timeout` within which the condition is expected to be met and the
             * `interval` used to check it
             *
             * If no `timeout` is specified, a ValuePageElement's default timeout is used.
             * If no `interval` is specified, a ValuePageElement's default interval is used.
             */
            hasAnyValue: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(isIValueElementNode, ({ node, filter }) => node.eventually.not.hasAnyValue(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
            }, 
            /**
             * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup eventually do not contain
             * the expected values within a specific timeout.
             *
             * @param values the expected values supposed not to be contained in the actual values
             * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
             * to check it
             *
             * If no `timeout` is specified, a ValuePageElement's default timeout is used.
             * If no `interval` is specified, a ValuePageElement's default interval is used.
             */
            containsValue: (values, opts) => {
                return this._node.eachCheck(isIValueElementNode, ({ node, expected }) => node.eventually.not.containsValue(expected, opts), values);
            } });
    }
}
// type guards
/**
 * Returns true if the passed node supports all functions defined in IValueElementNode.
 *
 * @param node a PageNode
 */
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
exports.isIValueElementNode = isIValueElementNode;
//# sourceMappingURL=ValuePageElementGroup.js.map