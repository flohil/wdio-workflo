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
    __getTrue(filterMask) {
        return this.eachGet(this._$, filterMask, node => node.__getTrue());
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
        return this.eachGet(this._$, filterMask, node => node.getText());
    }
    getDirectText(filterMask) {
        return this.eachGet(this._$, filterMask, node => node.getDirectText());
    }
    getIsEnabled(filterMask) {
        return this.eachGet(this.$, filterMask, node => {
            node.wait.isEnabled();
            return node.currently.isEnabled();
        });
    }
    // HELPER FUNCTIONS
    eachCheck(context, expected, checkFunc) {
        const diffs = {};
        for (const key in context) {
            if (expected) {
                if (typeof expected[key] !== 'undefined') {
                    if (!checkFunc(context[key], expected[key])) {
                        diffs[`.${key}`] = context[key].__lastDiff;
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
    eachGet(context, filterMask, getFunc) {
        let result = {};
        for (const k in context) {
            if (filterMask) {
                if (typeof filterMask[k] !== 'undefined') {
                    result[k] = getFunc(context[k]);
                }
            }
            else {
                result[k] = getFunc(context[k]);
            }
        }
        return result;
    }
    eachWait(context, expected, waitFunc) {
        for (const key in context) {
            if (expected) {
                if (typeof expected[key] !== 'undefined') {
                    waitFunc(context[key], expected[key]);
                }
            }
            else {
                waitFunc(context[key], expected[key]);
            }
        }
        return this;
    }
    eachDo(context, filterMask, doFunc) {
        for (const key in context) {
            if (filterMask) {
                if (typeof filterMask[key] !== 'undefined') {
                    doFunc(context[key]);
                }
            }
            else {
                doFunc(context[key]);
            }
        }
        return this;
    }
    eachSet(context, values, setFunc) {
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
        return this._node.eachGet(this._node.$, filterMask, node => node.currently.getText());
    }
    getDirectText(filterMask) {
        return this._node.eachGet(this._node.$, filterMask, node => node.currently.getDirectText());
    }
    getExists(filterMask) {
        return this._node.eachGet(this._node.$, filterMask, node => node.currently.exists());
    }
    getIsVisible(filterMask) {
        return this._node.eachGet(this._node.$, filterMask, node => node.currently.isVisible());
    }
    getIsEnabled(filterMask) {
        return this._node.eachGet(this._node.$, filterMask, node => node.currently.isEnabled());
    }
    exists(filterMask) {
        return this._node.eachCheck(this._node.$, filterMask, element => element.currently.exists());
    }
    isVisible(filterMask) {
        return this._node.eachCheck(this._node.$, filterMask, element => element.currently.isVisible());
    }
    isEnabled(filterMask) {
        return this._node.eachCheck(this._node.$, filterMask, element => element.currently.isEnabled());
    }
    hasText(text) {
        return this._node.eachCheck(this._node.$, text, (element, expected) => element.currently.hasText(expected));
    }
    hasAnyText(filterMask) {
        return this._node.eachCheck(this._node.$, filterMask, (element) => element.currently.hasAnyText());
    }
    containsText(text) {
        return this._node.eachCheck(this._node.$, text, (element, expected) => element.currently.containsText(expected));
    }
    hasDirectText(directText) {
        return this._node.eachCheck(this._node.$, directText, (element, expected) => element.currently.hasDirectText(expected));
    }
    hasAnyDirectText(filterMask) {
        return this._node.eachCheck(this._node.$, filterMask, (element) => element.currently.hasAnyDirectText());
    }
    containsDirectText(directText) {
        return this._node.eachCheck(this._node.$, directText, (element, expected) => element.currently.containsDirectText(expected));
    }
    get not() {
        return {
            exists: (filterMask) => {
                return this._node.eachCheck(this._node.$, filterMask, element => element.currently.not.exists());
            },
            isVisible: (filterMask) => {
                return this._node.eachCheck(this._node.$, filterMask, element => element.currently.not.isVisible());
            },
            isEnabled: (filterMask) => {
                return this._node.eachCheck(this._node.$, filterMask, element => element.currently.not.isEnabled());
            },
            hasText: (text) => {
                return this._node.eachCheck(this._node.$, text, (element, expected) => element.currently.not.hasText(expected));
            },
            hasAnyText: (filterMask) => {
                return this._node.eachCheck(this._node.$, filterMask, (element) => element.currently.not.hasAnyText());
            },
            containsText: (text) => {
                return this._node.eachCheck(this._node.$, text, (element, expected) => element.currently.not.containsText(expected));
            },
            hasDirectText: (directText) => {
                return this._node.eachCheck(this._node.$, directText, (element, expected) => element.currently.not.hasDirectText(expected));
            },
            hasAnyDirectText: (filterMask) => {
                return this._node.eachCheck(this._node.$, filterMask, (element) => element.currently.not.hasAnyDirectText());
            },
            containsDirectText: (directText) => {
                return this._node.eachCheck(this._node.$, directText, (element, expected) => element.currently.not.containsDirectText(expected));
            }
        };
    }
}
exports.PageElementMapCurrently = PageElementMapCurrently;
class PageElementMapWait extends _1.PageNodeWait {
    exists(opts = {}) {
        return this._node.eachWait(this._node.$, opts.filterMask, element => element.wait.exists(opts));
    }
    isVisible(opts = {}) {
        return this._node.eachWait(this._node.$, opts.filterMask, element => element.wait.isVisible(opts));
    }
    isEnabled(opts = {}) {
        return this._node.eachWait(this._node.$, opts.filterMask, element => element.wait.isEnabled(opts));
    }
    hasText(text, opts) {
        return this._node.eachWait(this._node.$, text, (element, expected) => element.wait.hasText(expected, opts));
    }
    hasAnyText(opts = {}) {
        return this._node.eachWait(this._node.$, opts.filterMask, (element) => element.wait.hasAnyText(opts));
    }
    containsText(text, opts) {
        return this._node.eachWait(this._node.$, text, (element, expected) => element.wait.containsText(expected, opts));
    }
    hasDirectText(directText, opts) {
        return this._node.eachWait(this._node.$, directText, (element, expected) => element.wait.hasDirectText(expected, opts));
    }
    hasAnyDirectText(opts = {}) {
        return this._node.eachWait(this._node.$, opts.filterMask, (element) => element.wait.hasAnyDirectText(opts));
    }
    containsDirectText(directText, opts) {
        return this._node.eachWait(this._node.$, directText, (element, expected) => element.wait.containsDirectText(expected, opts));
    }
    get not() {
        return {
            exists: (opts = {}) => {
                return this._node.eachWait(this._node.$, opts.filterMask, element => element.wait.not.exists(opts));
            },
            isVisible: (opts = {}) => {
                return this._node.eachWait(this._node.$, opts.filterMask, element => element.wait.not.isVisible(opts));
            },
            isEnabled: (opts = {}) => {
                return this._node.eachWait(this._node.$, opts.filterMask, element => element.wait.not.isEnabled(opts));
            },
            hasText: (text, opts) => {
                return this._node.eachWait(this._node.$, text, (element, expected) => element.wait.not.hasText(expected, opts));
            },
            hasAnyText: (opts = {}) => {
                return this._node.eachWait(this._node.$, opts.filterMask, (element) => element.wait.not.hasAnyText(opts));
            },
            containsText: (text, opts) => {
                return this._node.eachWait(this._node.$, text, (element, expected) => element.wait.not.containsText(expected, opts));
            },
            hasDirectText: (directText, opts) => {
                return this._node.eachWait(this._node.$, directText, (element, expected) => element.wait.not.hasDirectText(expected, opts));
            },
            hasAnyDirectText: (opts = {}) => {
                return this._node.eachWait(this._node.$, opts.filterMask, (element) => element.wait.not.hasAnyDirectText(opts));
            },
            containsDirectText: (directText, opts) => {
                return this._node.eachWait(this._node.$, directText, (element, expected) => element.wait.not.containsDirectText(expected, opts));
            }
        };
    }
}
exports.PageElementMapWait = PageElementMapWait;
class PageElementMapEventually extends _1.PageNodeEventually {
    exists(opts = {}) {
        return this._node.eachCheck(this._node.$, opts.filterMask, element => element.eventually.exists(opts));
    }
    isVisible(opts = {}) {
        return this._node.eachCheck(this._node.$, opts.filterMask, element => element.eventually.isVisible(opts));
    }
    isEnabled(opts = {}) {
        return this._node.eachCheck(this._node.$, opts.filterMask, element => element.eventually.isEnabled(opts));
    }
    hasText(text, opts) {
        return this._node.eachCheck(this._node.$, text, (element, expected) => element.eventually.hasText(expected, opts));
    }
    hasAnyText(opts = {}) {
        return this._node.eachCheck(this._node.$, opts.filterMask, (element) => element.eventually.hasAnyText(opts));
    }
    containsText(text, opts) {
        return this._node.eachCheck(this._node.$, text, (element, expected) => element.eventually.containsText(expected, opts));
    }
    hasDirectText(directText, opts) {
        return this._node.eachCheck(this._node.$, directText, (element, expected) => element.eventually.hasDirectText(expected, opts));
    }
    hasAnyDirectText(opts = {}) {
        return this._node.eachCheck(this._node.$, opts.filterMask, (element) => element.eventually.hasAnyDirectText(opts));
    }
    containsDirectText(directText, opts) {
        return this._node.eachCheck(this._node.$, directText, (element, expected) => element.eventually.containsDirectText(expected, opts));
    }
    get not() {
        return {
            exists: (opts = {}) => {
                return this._node.eachCheck(this._node.$, opts.filterMask, element => element.eventually.not.exists(opts));
            },
            isVisible: (opts = {}) => {
                return this._node.eachCheck(this._node.$, opts.filterMask, element => element.eventually.not.isVisible(opts));
            },
            isEnabled: (opts = {}) => {
                return this._node.eachCheck(this._node.$, opts.filterMask, element => element.eventually.not.isEnabled(opts));
            },
            hasText: (text, opts) => {
                return this._node.eachCheck(this._node.$, text, (element, expected) => element.eventually.not.hasText(expected, opts));
            },
            hasAnyText: (opts = {}) => {
                return this._node.eachCheck(this._node.$, opts.filterMask, (element) => element.eventually.not.hasAnyText(opts));
            },
            containsText: (text, opts) => {
                return this._node.eachCheck(this._node.$, text, (element, expected) => element.eventually.not.containsText(expected, opts));
            },
            hasDirectText: (directText, opts) => {
                return this._node.eachCheck(this._node.$, directText, (element, expected) => element.eventually.not.hasDirectText(expected, opts));
            },
            hasAnyDirectText: (opts = {}) => {
                return this._node.eachCheck(this._node.$, opts.filterMask, (element) => element.eventually.not.hasAnyDirectText(opts));
            },
            containsDirectText: (directText, opts) => {
                return this._node.eachCheck(this._node.$, directText, (element, expected) => element.eventually.not.containsDirectText(expected, opts));
            }
        };
    }
}
exports.PageElementMapEventually = PageElementMapEventually;
//# sourceMappingURL=PageElementMap.js.map