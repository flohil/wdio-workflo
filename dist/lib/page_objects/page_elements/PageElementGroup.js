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
// Encapsulates arbitrary page element types.
// Exposes its content directly as its own members,
// so each key in content can be accessed via dot notation.
//
// Naming Convention:
// - all content members must start with a lower case letter
// - all group functions must start with upper case letter
// - all private members of group must start with _
class PageElementGroup extends _1.PageNode {
    constructor(id, { store, timeout, content }) {
        super(id, { store, timeout });
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
    getIsEnabled(filterMask) {
        return this.eachGet(isIElementNode, node => node.getIsEnabled(), filterMask);
    }
    /**
     * Returns texts of all group elements after performing an initial wait in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getText(filterMask) {
        return this.eachGet(isIElementNode, node => node.getText(), filterMask);
    }
    getDirectText(filterMask) {
        return this.eachGet(isIElementNode, node => node.getDirectText(), filterMask);
    }
    // HELPER FUNCTIONS
    eachGet(supportsInterface, getFunc, filterMask) {
        let result = {};
        for (const key in this.$) {
            if (supportsInterface(this.$[key])) {
                const node = this.$[key];
                if (filterMask) {
                    if (typeof filterMask[key] === 'boolean' && filterMask[key]) {
                        result[key] = getFunc(node);
                    }
                }
                else {
                    result[key] = getFunc(node);
                }
            }
        }
        return result;
    }
    eachCheck(supportsInterface, checkFunc, expected, isFilterMask = false) {
        const diffs = {};
        const context = this._$;
        for (const key in context) {
            const node = context[key];
            if (supportsInterface(context[key])) {
                if (expected) {
                    const expectedValue = expected[key];
                    if (isFilterMask) {
                        if (typeof expectedValue === 'boolean' && expectedValue === true) {
                            if (!checkFunc(node)) {
                                diffs[`.${key}`] = context[key].__lastDiff;
                            }
                        }
                    }
                    else {
                        if (typeof expectedValue !== 'undefined') {
                            if (!checkFunc(node, expectedValue)) {
                                diffs[`.${key}`] = context[key].__lastDiff;
                            }
                        }
                    }
                }
                else {
                    if (!checkFunc(node)) {
                        diffs[`.${key}`] = context[key].__lastDiff;
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
        const context = this._$;
        for (const key in context) {
            const node = context[key];
            if (supportsInterface(context[key])) {
                if (expected) {
                    const expectedValue = expected[key];
                    if (isFilterMask) {
                        if (typeof expectedValue === 'boolean' && expectedValue === true) {
                            waitFunc(node);
                        }
                    }
                    else {
                        if (typeof expectedValue !== 'undefined') {
                            waitFunc(node, expectedValue);
                        }
                    }
                }
                else {
                    waitFunc(node);
                }
            }
        }
        return this;
    }
    eachDo(supportsInterface, doFunc, filterMask) {
        const context = this._$;
        for (const key in context) {
            const node = context[key];
            if (supportsInterface(context[key])) {
                if (filterMask) {
                    if (typeof filterMask[key] === 'boolean' && filterMask[key]) {
                        doFunc(node);
                    }
                }
                else {
                    doFunc(node);
                }
            }
        }
        return this;
    }
    eachSet(supportsInterface, setFunc, values) {
        const context = this._$;
        for (const key in context) {
            const node = context[key];
            if (supportsInterface(context[key])) {
                if (values) {
                    if (typeof values[key] !== 'undefined') {
                        setFunc(node, values[key]);
                    }
                }
                else {
                    setFunc(node, values[key]);
                }
            }
        }
        return this;
    }
}
exports.PageElementGroup = PageElementGroup;
class PageElementGroupCurrently extends _1.PageNodeCurrently {
    getExists(filterMask) {
        return this._node.eachGet(isIElementNode, node => node.currently.getExists(), filterMask);
    }
    getIsVisible(filterMask) {
        return this._node.eachGet(isIElementNode, node => node.currently.getIsVisible(), filterMask);
    }
    getIsEnabled(filterMask) {
        return this._node.eachGet(isIElementNode, node => node.currently.getIsEnabled(), filterMask);
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
        return this._node.eachGet(isIElementNode, node => node.currently.getText(), filterMask);
    }
    getDirectText(filterMask) {
        return this._node.eachGet(isIElementNode, node => node.currently.getDirectText(), filterMask);
    }
    exists(filterMask) {
        return this._node.eachCheck(isIElementNode, (node, filterMask) => node.currently.exists(filterMask), filterMask, true);
    }
    isVisible(filterMask) {
        return this._node.eachCheck(isIElementNode, node => node.currently.isVisible(), filterMask, true);
    }
    isEnabled(filterMask) {
        return this._node.eachCheck(isIElementNode, node => node.currently.isEnabled(), filterMask, true);
    }
    hasText(text) {
        return this._node.eachCheck(isIElementNode, (node, text) => node.currently.hasText(text), text);
    }
    hasAnyText(filterMask) {
        return this._node.eachCheck(isIElementNode, node => node.currently.hasAnyText(), filterMask, true);
    }
    containsText(text) {
        return this._node.eachCheck(isIElementNode, (node, text) => node.currently.containsText(text), text);
    }
    hasDirectText(directText) {
        return this._node.eachCheck(isIElementNode, (node, directText) => node.currently.hasDirectText(directText), directText);
    }
    hasAnyDirectText(filterMask) {
        return this._node.eachCheck(isIElementNode, node => node.currently.hasAnyDirectText(), filterMask, true);
    }
    containsDirectText(directText) {
        return this._node.eachCheck(isIElementNode, (node, directText) => node.currently.containsDirectText(directText), directText);
    }
    get not() {
        return {
            exists: (filterMask) => {
                return this._node.eachCheck(isIElementNode, node => node.currently.not.exists(), filterMask, true);
            },
            isVisible: (filterMask) => {
                return this._node.eachCheck(isIElementNode, node => node.currently.not.isVisible(), filterMask, true);
            },
            isEnabled: (filterMask) => {
                return this._node.eachCheck(isIElementNode, node => node.currently.not.isEnabled(), filterMask, true);
            },
            hasText: (text) => {
                return this._node.eachCheck(isIElementNode, (node, text) => node.currently.not.hasText(text), text);
            },
            hasAnyText: (filterMask) => {
                return this._node.eachCheck(isIElementNode, node => node.currently.not.hasAnyText(), filterMask, true);
            },
            containsText: (text) => {
                return this._node.eachCheck(isIElementNode, (node, text) => node.currently.not.containsText(text), text);
            },
            hasDirectText: (directText) => {
                return this._node.eachCheck(isIElementNode, (node, directText) => node.currently.not.hasDirectText(directText), directText);
            },
            hasAnyDirectText: (filterMask) => {
                return this._node.eachCheck(isIElementNode, node => node.currently.not.hasAnyDirectText(), filterMask, true);
            },
            containsDirectText: (directText) => {
                return this._node.eachCheck(isIElementNode, (node, directText) => node.currently.not.containsDirectText(directText), directText);
            }
        };
    }
}
exports.PageElementGroupCurrently = PageElementGroupCurrently;
class PageElementGroupWait extends PageNode_1.PageNodeWait {
    exists(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(isIElementNode, node => node.wait.exists(otherOpts), filterMask, true);
    }
    isVisible(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(isIElementNode, node => node.wait.isVisible(otherOpts), filterMask, true);
    }
    isEnabled(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(isIElementNode, node => node.wait.isEnabled(otherOpts), filterMask, true);
    }
    hasText(text, opts) {
        return this._node.eachWait(isIElementNode, (node, text) => node.wait.hasText(text, opts), text);
    }
    hasAnyText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(isIElementNode, node => node.wait.hasAnyText(otherOpts), filterMask, true);
    }
    containsText(text, opts) {
        return this._node.eachWait(isIElementNode, (node, text) => node.wait.containsText(text, opts), text);
    }
    hasDirectText(directText, opts) {
        return this._node.eachWait(isIElementNode, (node, directText) => node.wait.hasDirectText(directText, opts), directText);
    }
    hasAnyDirectText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(isIElementNode, node => node.wait.hasAnyDirectText(otherOpts), filterMask, true);
    }
    containsDirectText(directText, opts) {
        return this._node.eachWait(isIElementNode, (node, directText) => node.wait.containsDirectText(directText, opts), directText);
    }
    get not() {
        return {
            exists: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(isIElementNode, node => node.wait.not.exists(otherOpts), filterMask, true);
            },
            isVisible: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(isIElementNode, node => node.wait.not.isVisible(otherOpts), filterMask, true);
            },
            isEnabled: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(isIElementNode, node => node.wait.not.isEnabled(otherOpts), filterMask, true);
            },
            hasText: (text, opts) => {
                return this._node.eachWait(isIElementNode, (node, text) => node.wait.not.hasText(text, opts), text);
            },
            hasAnyText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(isIElementNode, node => node.wait.not.hasAnyText(otherOpts), filterMask, true);
            },
            containsText: (text, opts) => {
                return this._node.eachWait(isIElementNode, (node, text) => node.wait.not.containsText(text, opts), text);
            },
            hasDirectText: (directText, opts) => {
                return this._node.eachWait(isIElementNode, (node, directText) => node.wait.not.hasDirectText(directText, opts), directText);
            },
            hasAnyDirectText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(isIElementNode, node => node.wait.not.hasAnyDirectText(otherOpts), filterMask, true);
            },
            containsDirectText: (directText, opts) => {
                return this._node.eachWait(isIElementNode, (node, directText) => node.wait.not.containsDirectText(directText, opts), directText);
            }
        };
    }
}
exports.PageElementGroupWait = PageElementGroupWait;
class PageElementGroupEventually extends PageNode_1.PageNodeEventually {
    exists(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(isIElementNode, node => node.eventually.exists(otherOpts), filterMask, true);
    }
    isVisible(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(isIElementNode, node => node.eventually.isVisible(otherOpts), filterMask, true);
    }
    isEnabled(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(isIElementNode, node => node.eventually.isEnabled(otherOpts), filterMask, true);
    }
    hasText(text, opts) {
        return this._node.eachCheck(isIElementNode, (node, text) => node.eventually.hasText(text, opts), text);
    }
    hasAnyText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(isIElementNode, node => node.eventually.hasAnyText(otherOpts), filterMask, true);
    }
    containsText(text, opts) {
        return this._node.eachCheck(isIElementNode, (node, text) => node.eventually.containsText(text, opts), text);
    }
    hasDirectText(directText, opts) {
        return this._node.eachCheck(isIElementNode, (node, directText) => node.eventually.hasDirectText(directText, opts), directText);
    }
    hasAnyDirectText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(isIElementNode, node => node.eventually.hasAnyDirectText(otherOpts), filterMask, true);
    }
    containsDirectText(directText, opts) {
        return this._node.eachCheck(isIElementNode, (node, directText) => node.eventually.containsDirectText(directText, opts), directText);
    }
    get not() {
        return {
            exists: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(isIElementNode, node => node.eventually.not.exists(otherOpts), filterMask, true);
            },
            isVisible: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(isIElementNode, node => node.eventually.not.isVisible(otherOpts), filterMask, true);
            },
            isEnabled: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(isIElementNode, node => node.eventually.not.isEnabled(otherOpts), filterMask, true);
            },
            hasText: (text, opts) => {
                return this._node.eachCheck(isIElementNode, (node, text) => node.eventually.not.hasText(text, opts), text);
            },
            hasAnyText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(isIElementNode, node => node.eventually.not.hasAnyText(otherOpts), filterMask, true);
            },
            containsText: (text, opts) => {
                return this._node.eachCheck(isIElementNode, (node, text) => node.eventually.not.containsText(text, opts), text);
            },
            hasDirectText: (directText, opts) => {
                return this._node.eachCheck(isIElementNode, (node, directText) => node.eventually.not.hasDirectText(directText, opts), directText);
            },
            hasAnyDirectText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(isIElementNode, node => node.eventually.not.hasAnyDirectText(otherOpts), filterMask, true);
            },
            containsDirectText: (directText, opts) => {
                return this._node.eachCheck(isIElementNode, (node, directText) => node.eventually.not.containsDirectText(directText, opts), directText);
            }
        };
    }
}
exports.PageElementGroupEventually = PageElementGroupEventually;
// type guards
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
//# sourceMappingURL=PageElementGroup.js.map