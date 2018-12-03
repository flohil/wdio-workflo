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
     * Helper function to map element content nodes to a value by calling a node interface function on each node.
     *
     * @param context
     * @param getFunc
     */
    __getInterfaceFunc(context, getFunc) {
        let result = {};
        for (const k in context) {
            result[k] = getFunc(context[k]);
        }
        return result;
    }
    /**
     * Returns values of all list elements in the order they were retrieved from the DOM.
     */
    getText() {
        return this.__getInterfaceFunc(this.$, node => node.getText());
    }
}
exports.PageElementMap = PageElementMap;
class PageElementMapCurrently {
    constructor(node) {
        this._node = node;
    }
    getText() {
        return this._node.__getInterfaceFunc(this._node.$, node => node.getText());
    }
}
exports.PageElementMapCurrently = PageElementMapCurrently;
//# sourceMappingURL=PageElementMap.js.map