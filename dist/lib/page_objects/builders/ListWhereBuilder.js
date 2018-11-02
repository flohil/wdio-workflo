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
    reset() {
        this._xPathBuilder.reset(this._selector);
        return this;
    }
    constraint(constraint) {
        this._xPathBuilder.constraint(constraint);
        return this;
    }
    // Modifies element selector, so use only once for
    // the same element.
    text(text) {
        this._xPathBuilder.text(text);
        return this;
    }
    // Modifies element selector, so use only once for
    // the same element.
    containedText(text) {
        this._xPathBuilder.containedText(text);
        return this;
    }
    // Modifies element selector, so use only once for
    // the same element.
    attr(key, value) {
        this._xPathBuilder.attr(key, value);
        return this;
    }
    containedAttr(key, value) {
        this._xPathBuilder.containedAttr(key, value);
        return this;
    }
    level(level) {
        this._xPathBuilder.level(level);
        return this;
    }
    id(value) {
        return this.attr('id', value);
    }
    class(value) {
        return this.attr('class', value);
    }
    containedClass(value) {
        return this.containedAttr('class', value);
    }
    /**
     * Starts with 1
     * @param index
     */
    index(index) {
        const selector = `(${this._xPathBuilder.build()})[${index}]`;
        this._xPathBuilder.reset(selector);
        return this;
    }
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