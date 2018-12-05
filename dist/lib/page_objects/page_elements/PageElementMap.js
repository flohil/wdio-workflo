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
    /**
     * Returns values of all list elements in the order they were retrieved from the DOM.
     */
    getText(filterMask) {
        return this.__getInterfaceFunc(this.$, node => node.getText(), filterMask);
    }
    // HELPER FUNCTIONS
    /**
     * Helper function to map element content nodes to a value by calling a node interface function on each node.
     *
     * If passing filter mask, only values set to true in this mask will be returned.
     * By default (if no filter mask is passed), all values will be returned.
     *
     * @param context
     * @param getFunc
     * @param filterMask a filter mask
     */
    __getInterfaceFunc(context, getFunc, filterMask) {
        let result = {};
        for (const k in context) {
            if (filterMask) {
                if (filterMask[k] === true) {
                    result[k] = getFunc(context[k]);
                }
            }
            else {
                result[k] = getFunc(context[k]);
            }
        }
        return result;
    }
    __compare(compareFunc, expected) {
        const diffs = {};
        for (const key in expected) {
            if (!compareFunc(this._$[key], expected[key])) {
                diffs[key] = this._$[key].__lastDiff;
            }
        }
        this._lastDiff = {
            tree: diffs
        };
        return Object.keys(diffs).length === 0;
    }
}
exports.PageElementMap = PageElementMap;
class PageElementMapCurrently {
    constructor(node) {
        this.not = {
            hasText: (text) => {
                return this._node.__compare((element, expected) => element.currently.not.hasText(expected), text);
            },
            hasAnyText: () => {
                return this._node.__compare(element => element.currently.not.hasAnyText());
            },
            containsText: (text) => {
                return this._node.__compare((element, expected) => element.currently.not.containsText(expected), text);
            }
        };
        this._node = node;
    }
    getText(filterMask) {
        return this._node.__getInterfaceFunc(this._node.$, node => node.currently.getText(), filterMask);
    }
    hasText(text) {
        return this._node.__compare((element, expected) => element.currently.hasText(expected), text);
    }
    hasAnyText() {
        return this._node.__compare(element => element.currently.hasAnyText());
    }
    containsText(text) {
        return this._node.__compare((element, expected) => element.currently.containsText(expected), text);
    }
}
exports.PageElementMapCurrently = PageElementMapCurrently;
class PageElementMapEventually {
    constructor(node) {
        this.not = {
            hasText: (text, opts) => {
                return this._node.__compare((element, expected) => element.eventually.not.hasText(expected, opts), text);
            },
            hasAnyText: (opts) => {
                return this._node.__compare(element => element.eventually.not.hasAnyText(opts));
            },
            containsText: (text, opts) => {
                return this._node.__compare((element, expected) => element.eventually.not.containsText(expected, opts), text);
            }
        };
        this._node = node;
    }
    hasText(text, opts) {
        return this._node.__compare((element, expected) => element.eventually.hasText(expected, opts), text);
    }
    hasAnyText(opts) {
        return this._node.__compare(element => element.eventually.hasAnyText(opts));
    }
    containsText(text, opts) {
        return this._node.__compare((element, expected) => element.eventually.containsText(expected, opts), text);
    }
}
exports.PageElementMapEventually = PageElementMapEventually;
//# sourceMappingURL=PageElementMap.js.map