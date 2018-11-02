"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XPathBuilder_1 = require("./XPathBuilder");
class ListWhereBuilder {
    constructor(selector, opts) {
        this._selector = selector;
        this._store = opts.store;
        this._elementStoreFunc = opts.elementStoreFunc;
        this._elementOptions = opts.elementOptions;
        this._cloneFunc = opts.cloneFunc;
        this._xPathBuilder = XPathBuilder_1.XPathBuilder.getInstance();
    }
    // XPathBuilder facade
    reset() {
        this._xPathBuilder.reset(this._selector);
        return this;
    }
    /**
     * Appends plain xPath string to current selector.
     * @param appendedSelector
     */
    append(appendedSelector) {
        this._xPathBuilder.append(appendedSelector);
        return this;
    }
    /**
     * Adds plain xPath constraint to current selector.
     * @param constraintSelector
     * @param builderFunc optional -> can be used to apply XPathSelector API to constraintSelector
     */
    constraint(constraintSelector, builderFunc) {
        this._xPathBuilder.constraint(constraintSelector, builderFunc);
        return this;
    }
    /**
     * Restrict current selector to elements which have at least one child defined by childrenSelector.
     * Calls constraint() but adds a '.' to the beginning of the constraint to select only child elements.
     * @param childSelector
     * @param builderFunc optional -> can be used to apply XPathSelector API to childrenSelector
     */
    child(childSelector, builderFunc) {
        this.constraint(`.${childSelector}`, builderFunc);
        return this;
    }
    text(text) {
        this._xPathBuilder.text(text);
        return this;
    }
    containsText(text) {
        this._xPathBuilder.containsText(text);
        return this;
    }
    attr(key, value) {
        this._xPathBuilder.attr(key, value);
        return this;
    }
    containsAttr(key, value) {
        this._xPathBuilder.containsAttr(key, value);
        return this;
    }
    id(value) {
        return this.attr('id', value);
    }
    class(value) {
        return this.attr('class', value);
    }
    containsClass(value) {
        return this.containsAttr('class', value);
    }
    /**
     * Finds element by index of accurence on a single "level" of the DOM.
     * Eg.: If index === 3, there must be 3 siblings on the same DOM level that match the current selector
     * and the third one will be selected.
     * @param index starts at 1
     */
    levelIndex(level) {
        this._xPathBuilder.levelIndex(level);
        return this;
    }
    /**
     * Finds element by index of accurence accross all "levels/depths" of the DOM.
     * @param index starts at 1
     */
    index(index) {
        this._xPathBuilder.index(index);
        return this;
    }
    // Result retrieval functions
    getFirst() {
        return this._elementStoreFunc.apply(this._store, [this._xPathBuilder.build(), this._elementOptions]);
    }
    /**
     *
     * @param index starts with 0
     */
    getAt(index) {
        this.index(index + 1);
        return this.getFirst();
    }
    getAll() {
        return this.getList().all;
    }
    getList() {
        return this._cloneFunc(this._xPathBuilder.build());
    }
}
exports.ListWhereBuilder = ListWhereBuilder;
//# sourceMappingURL=ListWhereBuilder.js.map