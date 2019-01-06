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
const PageNode_1 = require("./PageNode");
const helpers_1 = require("../../helpers");
// Encapsulates arbitrary page element types.
// Returns all nodes passed in content as its own members,
// so that they can be accessed via dot notation.
//
// content is a collection of node getters, where each node
// can be any form of page element defined in PageElementStore.
//
// walkerClass is optional and allows for passing a
// custom group walker class.
// Per default, ElementGroupWalker will be used as a walker.
//
// functions is an optional array of group function names that
// defines the functions this group is supposed to support.
//
// id is a string to uniquely identify a group.
// If id is not defined, the group instance will be identified
// by a concatenated string of its node key names and types.
class PageElementGroup extends _1.PageNode {
    constructor(id, { store, timeout, interval, content }) {
        super(id, { store, timeout, interval });
        this._id = id;
        this._$ = content;
        this.currently = new PageElementGroupCurrently(this);
        this.wait = new PageElementGroupWait(this);
        this.eventually = new PageElementGroupEventually(this);
    }
    get $() {
        return this._$;
    }
    get __getLastDiff() {
        return this._lastDiff;
    }
    toJSON() {
        return {
            pageNodeType: this.constructor.name,
            nodeId: this._id
        };
    }
    __getNodeId() {
        return this._id;
    }
    // GETTER FUNCTIONS
    /**
     * Returns texts of all group elements after performing an initial wait in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getText(filterMask) {
        return this.eachGet(isIElementNode, ({ node, filter }) => node.getText(filter), filterMask);
    }
    getDirectText(filterMask) {
        return this.eachGet(isIElementNode, ({ node, filter }) => node.getDirectText(filter), filterMask);
    }
    getIsEnabled(filterMask) {
        return this.eachGet(isIElementNode, ({ node, filter }) => node.getIsEnabled(filter), filterMask);
    }
    getHasText(text) {
        return this.eachCompare(isIElementNode, ({ node, expected }) => node.getHasText(expected), text);
    }
    getHasAnyText(filterMask) {
        return this.eachCompare(isIElementNode, ({ node, filter }) => node.getHasAnyText(filter), filterMask, true);
    }
    getContainsText(text) {
        return this.eachCompare(isIElementNode, ({ node, expected }) => node.getContainsText(expected), text);
    }
    getHasDirectText(directText) {
        return this.eachCompare(isIElementNode, ({ node, expected }) => node.getHasDirectText(expected), directText);
    }
    getHasAnyDirectText(filterMask) {
        return this.eachCompare(isIElementNode, ({ node, filter }) => node.getHasAnyDirectText(filter), filterMask, true);
    }
    getContainsDirectText(directText) {
        return this.eachCompare(isIElementNode, ({ node, expected }) => node.getContainsDirectText(expected), directText);
    }
    // HELPER FUNCTIONS
    _includedInFilter(value) {
        return !!value;
    }
    eachGet(supportsInterface, getFunc, filterMask) {
        let result = {};
        for (const key in this.$) {
            if (supportsInterface(this.$[key])) {
                const node = this.$[key];
                if (helpers_1.isNullOrUndefined(filterMask)) {
                    result[key] = getFunc({ node });
                }
                else {
                    const filter = filterMask[key];
                    if (this._includedInFilter(filter)) {
                        result[key] = getFunc({ node, filter });
                    }
                }
            }
        }
        return result;
    }
    eachCompare(supportsInterface, compareFunc, expected, isFilterMask = false) {
        let result = {};
        for (const key in this._$) {
            const node = this._$[key];
            if (supportsInterface(this._$[key])) {
                if (helpers_1.isNullOrUndefined(expected)) {
                    result[key] = compareFunc({ node });
                }
                else {
                    const expectedValue = expected[key];
                    if (isFilterMask) {
                        if (this._includedInFilter(expectedValue)) {
                            result[key] = compareFunc({ node, filter: expectedValue });
                        }
                    }
                    else {
                        if (typeof expectedValue !== 'undefined') {
                            result[key] = compareFunc({ node, expected: expectedValue });
                        }
                    }
                }
            }
        }
        return result;
    }
    eachCheck(supportsInterface, checkFunc, expected, isFilterMask = false) {
        const diffs = {};
        for (const key in this._$) {
            const node = this._$[key];
            if (supportsInterface(this._$[key])) {
                if (helpers_1.isNullOrUndefined(expected)) {
                    if (!checkFunc({ node })) {
                        diffs[`.${key}`] = this._$[key].__lastDiff;
                    }
                }
                else {
                    const expectedValue = expected[key];
                    if (isFilterMask) {
                        if (this._includedInFilter(expectedValue)) {
                            if (!checkFunc({ node, filter: expectedValue })) {
                                diffs[`.${key}`] = this._$[key].__lastDiff;
                            }
                        }
                    }
                    else {
                        if (typeof expectedValue !== 'undefined') {
                            if (!checkFunc({ node, expected: expectedValue })) {
                                diffs[`.${key}`] = this._$[key].__lastDiff;
                            }
                        }
                    }
                }
            }
        }
        this._lastDiff = {
            tree: diffs
        };
        return Object.keys(diffs).length === 0;
    }
    eachWait(supportsInterface, waitFunc, expected, isFilterMask = false) {
        for (const key in this._$) {
            const node = this._$[key];
            if (supportsInterface(this._$[key])) {
                if (helpers_1.isNullOrUndefined(expected)) {
                    waitFunc({ node });
                }
                else {
                    const expectedValue = expected[key];
                    if (isFilterMask) {
                        if (this._includedInFilter(expectedValue)) {
                            waitFunc({ node, filter: expectedValue });
                        }
                    }
                    else {
                        if (typeof expectedValue !== 'undefined') {
                            waitFunc({ node, expected: expectedValue });
                        }
                    }
                }
            }
        }
        return this;
    }
    eachDo(supportsInterface, doFunc, filterMask) {
        for (const key in this._$) {
            const node = this._$[key];
            if (supportsInterface(this._$[key])) {
                if (helpers_1.isNullOrUndefined(filterMask)) {
                    doFunc({ node });
                }
                else {
                    const filter = filterMask[key];
                    if (this._includedInFilter(filter)) {
                        doFunc({ node, filter });
                    }
                }
            }
        }
        return this;
    }
    eachSet(supportsInterface, setFunc, values) {
        for (const key in this._$) {
            const node = this._$[key];
            if (supportsInterface(this._$[key])) {
                if (values) {
                    if (typeof values[key] !== 'undefined') {
                        setFunc({ node, value: values[key] });
                    }
                }
                else {
                    setFunc({ node });
                }
            }
        }
        return this;
    }
}
exports.PageElementGroup = PageElementGroup;
class PageElementGroupCurrently extends _1.PageNodeCurrently {
    getExists(filterMask) {
        return this._node.eachGet(isIElementNode, ({ node, filter }) => node.currently.getExists(filter), filterMask);
    }
    getIsVisible(filterMask) {
        return this._node.eachGet(isIElementNode, ({ node, filter }) => node.currently.getIsVisible(filter), filterMask);
    }
    getIsEnabled(filterMask) {
        return this._node.eachGet(isIElementNode, ({ node, filter }) => node.currently.getIsEnabled(filter), filterMask);
    }
    getHasText(text) {
        return this._node.eachCompare(isIElementNode, ({ node, expected }) => node.currently.getHasText(expected), text);
    }
    getHasAnyText(filterMask) {
        return this._node.eachCompare(isIElementNode, ({ node, filter }) => node.currently.getHasAnyText(filter), filterMask, true);
    }
    getContainsText(text) {
        return this._node.eachCompare(isIElementNode, ({ node, expected }) => node.currently.getContainsText(expected), text);
    }
    getHasDirectText(directText) {
        return this._node.eachCompare(isIElementNode, ({ node, expected }) => node.currently.getHasDirectText(expected), directText);
    }
    getHasAnyDirectText(filterMask) {
        return this._node.eachCompare(isIElementNode, ({ node, filter }) => node.currently.getHasAnyDirectText(filter), filterMask, true);
    }
    getContainsDirectText(directText) {
        return this._node.eachCompare(isIElementNode, ({ node, expected }) => node.currently.getContainsDirectText(expected), directText);
    }
    /**
     * Returns texts of all group elements immediatly in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getText(filterMask) {
        return this._node.eachGet(isIElementNode, ({ node, filter }) => node.currently.getText(filter), filterMask);
    }
    getDirectText(filterMask) {
        return this._node.eachGet(isIElementNode, ({ node, filter }) => node.currently.getDirectText(filter), filterMask);
    }
    exists(filterMask) {
        return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.currently.exists(filter), filterMask, true);
    }
    isVisible(filterMask) {
        return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.currently.isVisible(filter), filterMask, true);
    }
    isEnabled(filterMask) {
        return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.currently.isEnabled(filter), filterMask, true);
    }
    hasText(text) {
        return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.currently.hasText(expected), text);
    }
    hasAnyText(filterMask) {
        return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.currently.hasAnyText(filter), filterMask, true);
    }
    containsText(text) {
        return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.currently.containsText(expected), text);
    }
    hasDirectText(directText) {
        return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.currently.hasDirectText(expected), directText);
    }
    hasAnyDirectText(filterMask) {
        return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.currently.hasAnyDirectText(filter), filterMask, true);
    }
    containsDirectText(directText) {
        return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.currently.containsDirectText(expected), directText);
    }
    get not() {
        return {
            exists: (filterMask) => {
                return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.currently.not.exists(filter), filterMask, true);
            },
            isVisible: (filterMask) => {
                return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.currently.not.isVisible(filter), filterMask, true);
            },
            isEnabled: (filterMask) => {
                return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.currently.not.isEnabled(filter), filterMask, true);
            },
            hasText: (text) => {
                return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.currently.not.hasText(expected), text);
            },
            hasAnyText: (filterMask) => {
                return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.currently.not.hasAnyText(filter), filterMask, true);
            },
            containsText: (text) => {
                return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.currently.not.containsText(expected), text);
            },
            hasDirectText: (directText) => {
                return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.currently.not.hasDirectText(expected), directText);
            },
            hasAnyDirectText: (filterMask) => {
                return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.currently.not.hasAnyDirectText(filter), filterMask, true);
            },
            containsDirectText: (directText) => {
                return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.currently.not.containsDirectText(expected), directText);
            }
        };
    }
}
exports.PageElementGroupCurrently = PageElementGroupCurrently;
class PageElementGroupWait extends PageNode_1.PageNodeWait {
    exists(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(isIElementNode, ({ node, filter }) => node.wait.exists(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
    }
    isVisible(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(isIElementNode, ({ node, filter }) => node.wait.isVisible(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
    }
    isEnabled(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(isIElementNode, ({ node, filter }) => node.wait.isEnabled(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
    }
    hasText(text, opts) {
        return this._node.eachWait(isIElementNode, ({ node, expected }) => node.wait.hasText(expected, opts), text);
    }
    hasAnyText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(isIElementNode, ({ node, filter }) => node.wait.hasAnyText(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
    }
    containsText(text, opts) {
        return this._node.eachWait(isIElementNode, ({ node, expected }) => node.wait.containsText(expected, opts), text);
    }
    hasDirectText(directText, opts) {
        return this._node.eachWait(isIElementNode, ({ node, expected }) => node.wait.hasDirectText(expected, opts), directText);
    }
    hasAnyDirectText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(isIElementNode, ({ node, filter }) => node.wait.hasAnyDirectText(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
    }
    containsDirectText(directText, opts) {
        return this._node.eachWait(isIElementNode, ({ node, expected }) => node.wait.containsDirectText(expected, opts), directText);
    }
    get not() {
        return {
            exists: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(isIElementNode, ({ node, filter }) => node.wait.not.exists(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
            },
            isVisible: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(isIElementNode, ({ node, filter }) => node.wait.not.isVisible(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
            },
            isEnabled: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(isIElementNode, ({ node, filter }) => node.wait.not.isEnabled(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
            },
            hasText: (text, opts) => {
                return this._node.eachWait(isIElementNode, ({ node, expected }) => node.wait.not.hasText(expected, opts), text);
            },
            hasAnyText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(isIElementNode, ({ node, filter }) => node.wait.not.hasAnyText(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
            },
            containsText: (text, opts) => {
                return this._node.eachWait(isIElementNode, ({ node, expected }) => node.wait.not.containsText(expected, opts), text);
            },
            hasDirectText: (directText, opts) => {
                return this._node.eachWait(isIElementNode, ({ node, expected }) => node.wait.not.hasDirectText(expected, opts), directText);
            },
            hasAnyDirectText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(isIElementNode, ({ node, filter }) => node.wait.not.hasAnyDirectText(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
            },
            containsDirectText: (directText, opts) => {
                return this._node.eachWait(isIElementNode, ({ node, expected }) => node.wait.not.containsDirectText(expected, opts), directText);
            }
        };
    }
}
exports.PageElementGroupWait = PageElementGroupWait;
class PageElementGroupEventually extends PageNode_1.PageNodeEventually {
    exists(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.eventually.exists(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
    }
    isVisible(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.eventually.isVisible(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
    }
    isEnabled(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.eventually.isEnabled(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
    }
    hasText(text, opts) {
        return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.eventually.hasText(expected, opts), text);
    }
    hasAnyText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.eventually.hasAnyText(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
    }
    containsText(text, opts) {
        return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.eventually.containsText(expected, opts), text);
    }
    hasDirectText(directText, opts) {
        return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.eventually.hasDirectText(expected, opts), directText);
    }
    hasAnyDirectText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.eventually.hasAnyDirectText(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
    }
    containsDirectText(directText, opts) {
        return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.eventually.containsDirectText(expected, opts), directText);
    }
    get not() {
        return {
            exists: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.eventually.not.exists(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
            },
            isVisible: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.eventually.not.isVisible(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
            },
            isEnabled: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.eventually.not.isEnabled(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
            },
            hasText: (text, opts) => {
                return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.eventually.not.hasText(expected, opts), text);
            },
            hasAnyText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.eventually.not.hasAnyText(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
            },
            containsText: (text, opts) => {
                return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.eventually.not.containsText(expected, opts), text);
            },
            hasDirectText: (directText, opts) => {
                return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.eventually.not.hasDirectText(expected, opts), directText);
            },
            hasAnyDirectText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(isIElementNode, ({ node, filter }) => node.eventually.not.hasAnyDirectText(Object.assign({ filterMask: filter }, otherOpts)), filterMask, true);
            },
            containsDirectText: (directText, opts) => {
                return this._node.eachCheck(isIElementNode, ({ node, expected }) => node.eventually.not.containsDirectText(expected, opts), directText);
            }
        };
    }
}
exports.PageElementGroupEventually = PageElementGroupEventually;
// type guards
/**
 * Returns true if the passed node supports all functions defined in IElementNode.
 *
 * @param node a PageNode
 */
function isIElementNode(node) {
    return typeof node['getText'] === 'function' &&
        typeof node.currently['hasText'] === 'function' &&
        typeof node.currently['hasAnyText'] === 'function' &&
        typeof node.currently['containsText'] === 'function' &&
        typeof node.wait['hasText'] === 'function' &&
        typeof node.wait['hasAnyText'] === 'function' &&
        typeof node.wait['containsText'] === 'function' &&
        typeof node.eventually['hasText'] === 'function' &&
        typeof node.eventually['hasAnyText'] === 'function' &&
        typeof node.eventually['containsText'] === 'function' &&
        typeof node['getDirectText'] === 'function' &&
        typeof node.currently['hasDirectText'] === 'function' &&
        typeof node.currently['hasAnyDirectText'] === 'function' &&
        typeof node.currently['containsDirectText'] === 'function' &&
        typeof node.wait['hasDirectText'] === 'function' &&
        typeof node.wait['hasAnyDirectText'] === 'function' &&
        typeof node.wait['containsDirectText'] === 'function' &&
        typeof node.eventually['hasDirectText'] === 'function' &&
        typeof node.eventually['hasAnyDirectText'] === 'function' &&
        typeof node.eventually['containsDirectText'] === 'function';
}
exports.isIElementNode = isIElementNode;
//# sourceMappingURL=PageElementGroup.js.map