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
        this._getAllFunc = opts.getAllFunc;
        this._xPathBuilder = XPathBuilder_1.XPathBuilder.getInstance();
    }
    // XPathBuilder facade
    reset() {
        this._xPathBuilder.reset(this._selector);
        return this;
    }
    /**
     * Appends plain xPath to current selector.
     * @param appendedXPath
     */
    append(appendedXpath) {
        this._xPathBuilder.append(appendedXpath);
        return this;
    }
    /**
     * Appends childSelector to current selector in order to select a child element.
     *
     * After executing .child, the selected child element will become the new
     * "target" for all other xpath modifier functions like .id, .class ...
     * @param childSelector
     */
    child(childSelector) {
        this._xPathBuilder.append(childSelector);
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
    hasChild(childSelector, builderFunc) {
        this._xPathBuilder.hasChild(`.${childSelector}`, builderFunc);
        return this;
    }
    text(text) {
        this._xPathBuilder.text(text);
        return this;
    }
    notText(text) {
        this._xPathBuilder.notText(text);
        return this;
    }
    textContains(text) {
        this._xPathBuilder.textContains(text);
        return this;
    }
    notTextContains(text) {
        this._xPathBuilder.notTextContains(text);
        return this;
    }
    attribute(key, value) {
        this._xPathBuilder.attribute(key, value);
        return this;
    }
    notAttribute(key, value) {
        this._xPathBuilder.notAttribute(key, value);
        return this;
    }
    attributeContains(key, value) {
        this._xPathBuilder.attributeContains(key, value);
        return this;
    }
    notAttributeContains(key, value) {
        this._xPathBuilder.notAttributeContains(key, value);
        return this;
    }
    id(value) {
        return this.attribute('id', value);
    }
    notId(value) {
        return this.notAttribute('id', value);
    }
    idContains(value) {
        return this.attributeContains('id', value);
    }
    notIdContains(value) {
        return this.notAttributeContains('id', value);
    }
    class(value) {
        return this.attribute('class', value);
    }
    notClass(value) {
        return this.notAttribute('class', value);
    }
    classContains(value) {
        return this.attributeContains('class', value);
    }
    notClassContains(value) {
        return this.notAttributeContains('class', value);
    }
    name(value) {
        return this.attribute('name', value);
    }
    notName(value) {
        return this.notAttribute('name', value);
    }
    nameContains(value) {
        return this.attributeContains('name', value);
    }
    notNameContains(value) {
        return this.notAttributeContains('name', value);
    }
    type(value) {
        return this.attribute('type', value);
    }
    notType(value) {
        return this.notAttribute('type', value);
    }
    typeContains(value) {
        return this.attributeContains('type', value);
    }
    notTypeContains(value) {
        return this.notAttributeContains('type', value);
    }
    checked() {
        this._xPathBuilder.attribute('checked');
        return this;
    }
    notChecked() {
        this._xPathBuilder.notAttribute('checked');
        return this;
    }
    disabled() {
        this._xPathBuilder.attribute('disabled');
        return this;
    }
    notDisabled() {
        this._xPathBuilder.notAttribute('disabled');
        return this;
    }
    selected() {
        this._xPathBuilder.attribute('selected');
        return this;
    }
    notSelected() {
        this._xPathBuilder.notAttribute('selected');
        return this;
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
        return this._getAllFunc(this.getList());
    }
    getList() {
        return this._cloneFunc(this._xPathBuilder.build());
    }
}
exports.ListWhereBuilder = ListWhereBuilder;
//# sourceMappingURL=ListWhereBuilder.js.map