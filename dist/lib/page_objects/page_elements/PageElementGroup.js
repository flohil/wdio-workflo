"use strict";
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
    /**
     * Returns texts of all group elements after performing an initial wait in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getText(filterMask) {
        return this.eachGet(isIElementNode, filterMask, node => node.getText());
    }
    getDirectText(filterMask) {
        return this.eachGet(isIElementNode, filterMask, node => node.getDirectText());
    }
    // HELPER FUNCTIONS
    eachGet(supportsInterface, filterMask, getFunc) {
        let result = {};
        for (const key in this.$) {
            if (supportsInterface(this.$[key])) {
                const node = this.$[key];
                if (filterMask) {
                    if (typeof filterMask[key] !== 'undefined') {
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
    eachCheck(supportsInterface, expected, checkFunc) {
        const diffs = {};
        const context = this._$;
        for (const key in context) {
            const node = context[key];
            if (supportsInterface(context[key])) {
                if (expected) {
                    if (typeof expected[key] !== 'undefined') {
                        if (!checkFunc(node, expected[key])) {
                            diffs[`.${key}`] = context[key].__lastDiff;
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
    eachWait(supportsInterface, expected, waitFunc) {
        const context = this._$;
        for (const key in context) {
            const node = context[key];
            if (supportsInterface(context[key])) {
                if (expected) {
                    if (typeof expected[key] !== 'undefined') {
                        waitFunc(node, expected[key]);
                    }
                }
                else {
                    waitFunc(node);
                }
            }
        }
        return this;
    }
    eachDo(supportsInterface, filterMask, doFunc) {
        const context = this._$;
        for (const key in context) {
            const node = context[key];
            if (supportsInterface(context[key])) {
                if (filterMask) {
                    if (typeof filterMask[key] !== 'undefined') {
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
    eachSet(supportsInterface, values, setFunc) {
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
    /**
     * Returns texts of all group elements immediatly in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getText(filterMask) {
        return this._node.eachGet(isIElementNode, filterMask, node => node.currently.getText());
    }
    getDirectText(filterMask) {
        return this._node.eachGet(isIElementNode, filterMask, node => node.currently.getDirectText());
    }
    exists(filterMask) {
        return this._node.eachCheck(isIElementNode, filterMask, node => node.currently.exists());
    }
    isVisible(filterMask) {
        return this._node.eachCheck(isIElementNode, filterMask, node => node.currently.isVisible());
    }
    isEnabled(filterMask) {
        return this._node.eachCheck(isIElementNode, filterMask, node => node.currently.isEnabled());
    }
    hasText(text) {
        return this._node.eachCheck(isIElementNode, text, (node, text) => node.currently.hasText(text));
    }
    hasAnyText(filterMask) {
        return this._node.eachCheck(isIElementNode, filterMask, node => node.currently.hasAnyText());
    }
    containsText(text) {
        return this._node.eachCheck(isIElementNode, text, (node, text) => node.currently.containsText(text));
    }
    hasDirectText(directText) {
        return this._node.eachCheck(isIElementNode, directText, (node, directText) => node.currently.hasDirectText(directText));
    }
    hasAnyDirectText(filterMask) {
        return this._node.eachCheck(isIElementNode, filterMask, node => node.currently.hasAnyDirectText());
    }
    containsDirectText(directText) {
        return this._node.eachCheck(isIElementNode, directText, (node, directText) => node.currently.containsDirectText(directText));
    }
    get not() {
        return {
            exists: (filterMask) => {
                return this._node.eachCheck(isIElementNode, filterMask, node => node.currently.not.exists());
            },
            isVisible: (filterMask) => {
                return this._node.eachCheck(isIElementNode, filterMask, node => node.currently.not.isVisible());
            },
            isEnabled: (filterMask) => {
                return this._node.eachCheck(isIElementNode, filterMask, node => node.currently.not.isEnabled());
            },
            hasText: (text) => {
                return this._node.eachCheck(isIElementNode, text, (node, text) => node.currently.not.hasText(text));
            },
            hasAnyText: (filterMask) => {
                return this._node.eachCheck(isIElementNode, filterMask, node => node.currently.not.hasAnyText());
            },
            containsText: (text) => {
                return this._node.eachCheck(isIElementNode, text, (node, text) => node.currently.not.containsText(text));
            },
            hasDirectText: (directText) => {
                return this._node.eachCheck(isIElementNode, directText, (node, directText) => node.currently.not.hasDirectText(directText));
            },
            hasAnyDirectText: (filterMask) => {
                return this._node.eachCheck(isIElementNode, filterMask, node => node.currently.not.hasAnyDirectText());
            },
            containsDirectText: (directText) => {
                return this._node.eachCheck(isIElementNode, directText, (node, directText) => node.currently.not.containsDirectText(directText));
            }
        };
    }
}
exports.PageElementGroupCurrently = PageElementGroupCurrently;
class PageElementGroupWait extends PageNode_1.PageNodeWait {
    exists(opts = {}) {
        return this._node.eachWait(isIElementNode, opts.filterMask, node => node.wait.exists(opts));
    }
    isVisible(opts = {}) {
        return this._node.eachWait(isIElementNode, opts.filterMask, node => node.wait.isVisible(opts));
    }
    isEnabled(opts = {}) {
        return this._node.eachWait(isIElementNode, opts.filterMask, node => node.wait.isEnabled(opts));
    }
    hasText(text, opts) {
        return this._node.eachWait(isIElementNode, text, (node, text) => node.wait.hasText(text, opts));
    }
    hasAnyText(opts = {}) {
        return this._node.eachWait(isIElementNode, opts.filterMask, node => node.wait.hasAnyText(opts));
    }
    containsText(text, opts) {
        return this._node.eachWait(isIElementNode, text, (node, text) => node.wait.containsText(text, opts));
    }
    hasDirectText(directText, opts) {
        return this._node.eachWait(isIElementNode, directText, (node, directText) => node.wait.hasDirectText(directText, opts));
    }
    hasAnyDirectText(opts = {}) {
        return this._node.eachWait(isIElementNode, opts.filterMask, node => node.wait.hasAnyDirectText(opts));
    }
    containsDirectText(directText, opts) {
        return this._node.eachWait(isIElementNode, directText, (node, directText) => node.wait.containsDirectText(directText, opts));
    }
    get not() {
        return {
            exists: (opts = {}) => {
                return this._node.eachWait(isIElementNode, opts.filterMask, node => node.wait.not.exists(opts));
            },
            isVisible: (opts = {}) => {
                return this._node.eachWait(isIElementNode, opts.filterMask, node => node.wait.not.isVisible(opts));
            },
            isEnabled: (opts = {}) => {
                return this._node.eachWait(isIElementNode, opts.filterMask, node => node.wait.not.isEnabled(opts));
            },
            hasText: (text, opts) => {
                return this._node.eachWait(isIElementNode, text, (node, text) => node.wait.not.hasText(text, opts));
            },
            hasAnyText: (opts = {}) => {
                return this._node.eachWait(isIElementNode, opts.filterMask, node => node.wait.not.hasAnyText(opts));
            },
            containsText: (text, opts) => {
                return this._node.eachWait(isIElementNode, text, (node, text) => node.wait.not.containsText(text, opts));
            },
            hasDirectText: (directText, opts) => {
                return this._node.eachWait(isIElementNode, directText, (node, directText) => node.wait.not.hasDirectText(directText, opts));
            },
            hasAnyDirectText: (opts = {}) => {
                return this._node.eachWait(isIElementNode, opts.filterMask, node => node.wait.not.hasAnyDirectText(opts));
            },
            containsDirectText: (directText, opts) => {
                return this._node.eachWait(isIElementNode, directText, (node, directText) => node.wait.not.containsDirectText(directText, opts));
            }
        };
    }
}
exports.PageElementGroupWait = PageElementGroupWait;
class PageElementGroupEventually extends PageNode_1.PageNodeEventually {
    exists(opts = {}) {
        return this._node.eachCheck(isIElementNode, opts.filterMask, node => node.eventually.exists(opts));
    }
    isVisible(opts = {}) {
        return this._node.eachCheck(isIElementNode, opts.filterMask, node => node.eventually.isVisible(opts));
    }
    isEnabled(opts = {}) {
        return this._node.eachCheck(isIElementNode, opts.filterMask, node => node.eventually.isEnabled(opts));
    }
    hasText(text, opts) {
        return this._node.eachCheck(isIElementNode, text, (node, text) => node.eventually.hasText(text, opts));
    }
    hasAnyText(opts = {}) {
        return this._node.eachCheck(isIElementNode, opts.filterMask, node => node.eventually.hasAnyText(opts));
    }
    containsText(text, opts) {
        return this._node.eachCheck(isIElementNode, text, (node, text) => node.eventually.containsText(text, opts));
    }
    hasDirectText(directText, opts) {
        return this._node.eachCheck(isIElementNode, directText, (node, directText) => node.eventually.hasDirectText(directText, opts));
    }
    hasAnyDirectText(opts = {}) {
        return this._node.eachCheck(isIElementNode, opts.filterMask, node => node.eventually.hasAnyDirectText(opts));
    }
    containsDirectText(directText, opts) {
        return this._node.eachCheck(isIElementNode, directText, (node, directText) => node.eventually.containsDirectText(directText, opts));
    }
    get not() {
        return {
            exists: (opts = {}) => {
                return this._node.eachCheck(isIElementNode, opts.filterMask, node => node.eventually.not.exists(opts));
            },
            isVisible: (opts = {}) => {
                return this._node.eachCheck(isIElementNode, opts.filterMask, node => node.eventually.not.isVisible(opts));
            },
            isEnabled: (opts = {}) => {
                return this._node.eachCheck(isIElementNode, opts.filterMask, node => node.eventually.not.isEnabled(opts));
            },
            hasText: (text, opts) => {
                return this._node.eachCheck(isIElementNode, text, (node, text) => node.eventually.not.hasText(text, opts));
            },
            hasAnyText: (opts = {}) => {
                return this._node.eachCheck(isIElementNode, opts.filterMask, node => node.eventually.not.hasAnyText(opts));
            },
            containsText: (text, opts) => {
                return this._node.eachCheck(isIElementNode, text, (node, text) => node.eventually.not.containsText(text, opts));
            },
            hasDirectText: (directText, opts) => {
                return this._node.eachCheck(isIElementNode, directText, (node, directText) => node.eventually.not.hasDirectText(directText, opts));
            },
            hasAnyDirectText: (opts = {}) => {
                return this._node.eachCheck(isIElementNode, opts.filterMask, node => node.eventually.not.hasAnyDirectText(opts));
            },
            containsDirectText: (directText, opts) => {
                return this._node.eachCheck(isIElementNode, directText, (node, directText) => node.eventually.not.containsDirectText(directText, opts));
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