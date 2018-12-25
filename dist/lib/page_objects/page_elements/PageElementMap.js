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
// holds several PageElement instances of the same type
class PageElementMap extends _1.PageNode {
    constructor(_selector, _a) {
        var { identifier, elementStoreFunc, elementOptions } = _a, superOpts = __rest(_a, ["identifier", "elementStoreFunc", "elementOptions"]);
        super(_selector, superOpts);
        this._selector = _selector;
        this._selector = _selector;
        this._elementOptions = elementOptions;
        this._elementStoreFunc = elementStoreFunc;
        this._identifier = identifier;
        this._$ = Workflo.Object.mapProperties(this._identifier.mappingObject, (value, key) => this._elementStoreFunc.apply(this._store, [
            this._identifier.func(this._selector, value),
            this._elementOptions
        ]));
        this.currently = new PageElementMapCurrently(this);
        this.wait = new PageElementMapWait(this);
        this.eventually = new PageElementMapEventually(this);
    }
    get $() {
        return this._$;
    }
    /**
     * In case of language changes, for example, change values of mappingObject while keys must stay the same.
     * @param mappingObject
     */
    changeMappingObject(mappingObject) {
        this._$ = Workflo.Object.mapProperties(mappingObject, (value, key) => this._elementStoreFunc.apply(this._store, [
            this._identifier.func(this._selector, value),
            this._elementOptions
        ]));
    }
    // GETTER FUNCTIONS
    getSelector() {
        return this._selector;
    }
    /**
    * Returns texts of all list elements after performing an initial wait in the order they were retrieved from the DOM.
    *
    * If passing filter, only values defined in this mask will be returned.
    * By default (if no filter is passed), all values will be returned.
    *
    * @param filter a filter mask
    */
    getText(filterMask) {
        return this.eachGet(this._$, node => node.getText(), filterMask);
    }
    getDirectText(filterMask) {
        return this.eachGet(this._$, node => node.getDirectText(), filterMask);
    }
    getIsEnabled(filterMask) {
        return this.eachGet(this.$, node => node.getIsEnabled(), filterMask);
    }
    getHasText(text) {
        return this.eachCompare(this.$, (element, expected) => element.currently.hasText(expected), text);
    }
    getHasAnyText(filterMask) {
        return this.eachCompare(this.$, (element) => element.currently.hasAnyText(), filterMask, true);
    }
    getContainsText(text) {
        return this.eachCompare(this.$, (element, expected) => element.currently.containsText(expected), text);
    }
    getHasDirectText(directText) {
        return this.eachCompare(this.$, (element, expected) => element.currently.hasDirectText(expected), directText);
    }
    getHasAnyDirectText(filterMask) {
        return this.eachCompare(this.$, (element) => element.currently.hasAnyDirectText(), filterMask, true);
    }
    getContainsDirectText(directText) {
        return this.eachCompare(this.$, (element, expected) => element.currently.containsDirectText(expected), directText);
    }
    // HELPER FUNCTIONS
    eachCompare(context, checkFunc, expected, isFilterMask = false) {
        const result = {};
        for (const key in context) {
            if (expected) {
                const expectedValue = expected[key];
                if (isFilterMask) {
                    if (typeof expectedValue === 'boolean' && expectedValue) {
                        result[key] = checkFunc(context[key], expectedValue);
                    }
                }
                else {
                    if (typeof expectedValue !== 'undefined') {
                        result[key] = checkFunc(context[key], expectedValue);
                    }
                }
            }
            else {
                result[key] = checkFunc(context[key]);
            }
        }
        return result;
    }
    eachCheck(context, checkFunc, expected, isFilterMask = false) {
        const diffs = {};
        for (const key in context) {
            if (expected) {
                if (isFilterMask) {
                    if (typeof expected[key] === 'boolean' && expected[key]) {
                        if (!checkFunc(context[key])) {
                            diffs[`.${key}`] = context[key].__lastDiff;
                        }
                    }
                }
                else {
                    if (typeof expected[key] !== 'undefined') {
                        if (!checkFunc(context[key], expected[key])) {
                            diffs[`.${key}`] = context[key].__lastDiff;
                        }
                    }
                }
            }
            else {
                if (!checkFunc(context[key])) {
                    diffs[`.${key}`] = context[key].__lastDiff;
                }
            }
        }
        this._lastDiff = {
            tree: diffs
        };
        return Object.keys(diffs).length === 0;
    }
    /**
     * Helper function to map element content nodes to a value by calling a node interface function on each node.
     *
     * If passing filter mask, only values defined in this mask will be returned.
     * By default (if no filter mask is passed), all values will be returned.
     *
     * @param getFunc
     * @param filterMask a filter mask
     */
    eachGet(context, getFunc, filterMask) {
        let result = {};
        for (const k in context) {
            if (filterMask) {
                if (typeof filterMask[k] === 'boolean' && filterMask[k]) {
                    result[k] = getFunc(context[k]);
                }
            }
            else {
                result[k] = getFunc(context[k]);
            }
        }
        return result;
    }
    eachWait(context, waitFunc, expected, isFilterMask = false) {
        for (const key in context) {
            if (expected) {
                if (isFilterMask) {
                    if (typeof expected[key] === 'boolean' && expected[key]) {
                        waitFunc(context[key]);
                    }
                }
                else {
                    if (typeof expected[key] !== 'undefined') {
                        waitFunc(context[key], expected[key]);
                    }
                }
            }
            else {
                waitFunc(context[key], expected[key]);
            }
        }
        return this;
    }
    eachDo(context, doFunc, filterMask) {
        for (const key in context) {
            if (filterMask) {
                if (typeof filterMask[key] === 'boolean' && filterMask[key]) {
                    doFunc(context[key]);
                }
            }
            else {
                doFunc(context[key]);
            }
        }
        return this;
    }
    eachSet(context, setFunc, values) {
        for (const key in context) {
            if (values) {
                if (typeof values[key] !== 'undefined') {
                    setFunc(context[key], values[key]);
                }
            }
            else {
                setFunc(context[key], values[key]);
            }
        }
        return this;
    }
}
exports.PageElementMap = PageElementMap;
class PageElementMapCurrently extends _1.PageNodeCurrently {
    /**
     * Returns texts of all list elements immediatly in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getText(filterMask) {
        return this._node.eachGet(this._node.$, node => node.currently.getText(), filterMask);
    }
    getDirectText(filterMask) {
        return this._node.eachGet(this._node.$, node => node.currently.getDirectText(), filterMask);
    }
    getExists(filterMask) {
        return this._node.eachGet(this._node.$, node => node.currently.exists(), filterMask);
    }
    getIsVisible(filterMask) {
        return this._node.eachGet(this._node.$, node => node.currently.isVisible(), filterMask);
    }
    getIsEnabled(filterMask) {
        return this._node.eachGet(this._node.$, node => node.currently.isEnabled(), filterMask);
    }
    getHasText(text) {
        return this._node.eachCompare(this._node.$, (element, expected) => element.currently.hasText(expected), text);
    }
    getHasAnyText(filterMask) {
        return this._node.eachCompare(this._node.$, (element) => element.currently.hasAnyText(), filterMask, true);
    }
    getContainsText(text) {
        return this._node.eachCompare(this._node.$, (element, expected) => element.currently.containsText(expected), text);
    }
    getHasDirectText(directText) {
        return this._node.eachCompare(this._node.$, (element, expected) => element.currently.hasDirectText(expected), directText);
    }
    getHasAnyDirectText(filterMask) {
        return this._node.eachCompare(this._node.$, (element) => element.currently.hasAnyDirectText(), filterMask, true);
    }
    getContainsDirectText(directText) {
        return this._node.eachCompare(this._node.$, (element, expected) => element.currently.containsDirectText(expected), directText);
    }
    exists(filterMask) {
        return this._node.eachCheck(this._node.$, element => element.currently.exists(), filterMask, true);
    }
    isVisible(filterMask) {
        return this._node.eachCheck(this._node.$, element => element.currently.isVisible(), filterMask, true);
    }
    isEnabled(filterMask) {
        return this._node.eachCheck(this._node.$, element => element.currently.isEnabled(), filterMask, true);
    }
    hasText(text) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.currently.hasText(expected), text);
    }
    hasAnyText(filterMask) {
        return this._node.eachCheck(this._node.$, (element) => element.currently.hasAnyText(), filterMask, true);
    }
    containsText(text) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.currently.containsText(expected), text);
    }
    hasDirectText(directText) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.currently.hasDirectText(expected), directText);
    }
    hasAnyDirectText(filterMask) {
        return this._node.eachCheck(this._node.$, (element) => element.currently.hasAnyDirectText(), filterMask, true);
    }
    containsDirectText(directText) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.currently.containsDirectText(expected), directText);
    }
    get not() {
        return {
            exists: (filterMask) => {
                return this._node.eachCheck(this._node.$, element => element.currently.not.exists(), filterMask, true);
            },
            isVisible: (filterMask) => {
                return this._node.eachCheck(this._node.$, element => element.currently.not.isVisible(), filterMask, true);
            },
            isEnabled: (filterMask) => {
                return this._node.eachCheck(this._node.$, element => element.currently.not.isEnabled(), filterMask, true);
            },
            hasText: (text) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.currently.not.hasText(expected), text);
            },
            hasAnyText: (filterMask) => {
                return this._node.eachCheck(this._node.$, (element) => element.currently.not.hasAnyText(), filterMask, true);
            },
            containsText: (text) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.currently.not.containsText(expected), text);
            },
            hasDirectText: (directText) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.currently.not.hasDirectText(expected), directText);
            },
            hasAnyDirectText: (filterMask) => {
                return this._node.eachCheck(this._node.$, (element) => element.currently.not.hasAnyDirectText(), filterMask, true);
            },
            containsDirectText: (directText) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.currently.not.containsDirectText(expected), directText);
            }
        };
    }
}
exports.PageElementMapCurrently = PageElementMapCurrently;
class PageElementMapWait extends _1.PageNodeWait {
    exists(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.$, element => element.wait.exists(otherOpts), filterMask, true);
    }
    isVisible(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.$, element => element.wait.isVisible(otherOpts), filterMask, true);
    }
    isEnabled(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.$, element => element.wait.isEnabled(otherOpts), filterMask, true);
    }
    hasText(text, opts) {
        return this._node.eachWait(this._node.$, (element, expected) => element.wait.hasText(expected, opts), text);
    }
    hasAnyText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.$, (element) => element.wait.hasAnyText(otherOpts), filterMask, true);
    }
    containsText(text, opts) {
        return this._node.eachWait(this._node.$, (element, expected) => element.wait.containsText(expected, opts), text);
    }
    hasDirectText(directText, opts) {
        return this._node.eachWait(this._node.$, (element, expected) => element.wait.hasDirectText(expected, opts), directText);
    }
    hasAnyDirectText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.$, (element) => element.wait.hasAnyDirectText(otherOpts), filterMask, true);
    }
    containsDirectText(directText, opts) {
        return this._node.eachWait(this._node.$, (element, expected) => element.wait.containsDirectText(expected, opts), directText);
    }
    get not() {
        return {
            exists: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.$, element => element.wait.not.exists(otherOpts), filterMask, true);
            },
            isVisible: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.$, element => element.wait.not.isVisible(otherOpts), filterMask, true);
            },
            isEnabled: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.$, element => element.wait.not.isEnabled(otherOpts), filterMask, true);
            },
            hasText: (text, opts) => {
                return this._node.eachWait(this._node.$, (element, expected) => element.wait.not.hasText(expected, opts), text);
            },
            hasAnyText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.$, (element) => element.wait.not.hasAnyText(otherOpts), filterMask, true);
            },
            containsText: (text, opts) => {
                return this._node.eachWait(this._node.$, (element, expected) => element.wait.not.containsText(expected, opts), text);
            },
            hasDirectText: (directText, opts) => {
                return this._node.eachWait(this._node.$, (element, expected) => element.wait.not.hasDirectText(expected, opts), directText);
            },
            hasAnyDirectText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.$, (element) => element.wait.not.hasAnyDirectText(otherOpts), filterMask, true);
            },
            containsDirectText: (directText, opts) => {
                return this._node.eachWait(this._node.$, (element, expected) => element.wait.not.containsDirectText(expected, opts), directText);
            }
        };
    }
}
exports.PageElementMapWait = PageElementMapWait;
class PageElementMapEventually extends _1.PageNodeEventually {
    exists(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.$, element => element.eventually.exists(otherOpts), filterMask, true);
    }
    isVisible(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.$, element => element.eventually.isVisible(otherOpts), filterMask, true);
    }
    isEnabled(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.$, element => element.eventually.isEnabled(otherOpts), filterMask, true);
    }
    hasText(text, opts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.hasText(expected, opts), text);
    }
    hasAnyText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.$, (element) => element.eventually.hasAnyText(otherOpts), filterMask, true);
    }
    containsText(text, opts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.containsText(expected, opts), text);
    }
    hasDirectText(directText, opts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.hasDirectText(expected, opts), directText);
    }
    hasAnyDirectText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.$, (element) => element.eventually.hasAnyDirectText(otherOpts), filterMask, true);
    }
    containsDirectText(directText, opts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.containsDirectText(expected, opts), directText);
    }
    get not() {
        return {
            exists: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.$, element => element.eventually.not.exists(otherOpts), filterMask, true);
            },
            isVisible: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.$, element => element.eventually.not.isVisible(otherOpts), filterMask, true);
            },
            isEnabled: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.$, element => element.eventually.not.isEnabled(otherOpts), filterMask, true);
            },
            hasText: (text, opts) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.not.hasText(expected, opts), text);
            },
            hasAnyText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.$, (element) => element.eventually.not.hasAnyText(otherOpts), filterMask, true);
            },
            containsText: (text, opts) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.not.containsText(expected, opts), text);
            },
            hasDirectText: (directText, opts) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.not.hasDirectText(expected, opts), directText);
            },
            hasAnyDirectText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.$, (element) => element.eventually.not.hasAnyDirectText(otherOpts), filterMask, true);
            },
            containsDirectText: (directText, opts) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.not.containsDirectText(expected, opts), directText);
            }
        };
    }
}
exports.PageElementMapEventually = PageElementMapEventually;
//# sourceMappingURL=PageElementMap.js.map