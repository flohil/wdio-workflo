"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XPathBuilder_1 = require("./XPathBuilder");
/**
 * ListWhereBuilder allows to select subsets of a PageElementList (subsets of its managed PageElements) by modifying the
 * list's selector using XPath modification functions.
 *
 * @template Store type of the instance of PageNodeStore that is used by PageNodes returned by ListWhereBuilder
 * @template PageElementType type of instances of PageElements returned by ListWhereBuilder's retrieval functions
 * (getXXX)
 * @template PageElementOpts type of opts passed to the constructors of PageElements returned by ListWhereBuilder's
 * retrieval functions
 * @template ListType type of the PageElementList on which ListWhereBuilder operates
 */
class ListWhereBuilder {
    /**
     * ListWhereBuilder allows to select subsets of a PageElementList (subsets of its managed PageElements) by modifying the
     * list's selector using XPath modification functions.
     *
     * @param selector This is a raw XPath string used as root selector for all XPath modifications performed with
     * ListWhereBuilder. It is appended to the selector of the PageElementList handled by ListWhereBuilder.
     * @param opts opts parameter passed to the constructor of ListWhereBuilder
     */
    constructor(selector, opts) {
        this._selector = selector;
        this._store = opts.store;
        this._elementStoreFunc = opts.elementStoreFunc;
        this._elementOpts = opts.elementOpts;
        this._cloneFunc = opts.cloneFunc;
        this._getAllFunc = opts.getAllFunc;
        this._xPathBuilder = XPathBuilder_1.XPathBuilder.getInstance();
    }
    // XPathBuilder facade
    /**
     * Resets the currently processed XPath expression to the root XPath selector passed to ListWhereBuilder's
     * constructor.
     *
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    reset() {
        this._xPathBuilder.reset(this._selector);
        return this;
    }
    /**
     * Appends a plain XPath string to the currently constructed XPath expression.
     *
     * @param appendedXPath the appended plain XPath string
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    append(appendedXPath) {
        this._xPathBuilder.append(appendedXPath);
        return this;
    }
    /**
     * Appends a childSelector to the currently constructed XPath expression in order to select a child element.
     *
     * After executing `.child`, the selected child element becomes the new "target" for all future XPath modification
     * functions (eg. `.id`, `.class`) until the currently constructed XPath expression is reset.
     *
     * @param childSelector a selector appended to the currently constructed XPath expression to select a child element
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    child(childSelector) {
        this._xPathBuilder.append(childSelector);
        return this;
    }
    /**
     * Adds a plain XPath constraint (eg. '[./span]') to the currently constructed XPath expression.
     *
     * Optionally, a builderFunc can be used to apply XPath modification functions to the constraint selector instead of
     * the "outer" selector. To do so, builderFunc is passed an XPathBuilder instance configured to use
     * `constraintSelector` as a new root for the currently constructed XPath expression.
     *
     * @param constraintSelector a plain XPath constraint appended to the currently constructed XPath expression
     * @param builderFunc can be used to apply XPath modification functions to `constraintSelector`
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    constraint(constraintSelector, builderFunc) {
        this._xPathBuilder.constraint(constraintSelector, builderFunc);
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have at least one child element that matches
     * the passed childSelector.
     *
     * Optionally, a builderFunc can be used to apply XPath modification functions to the child selector instead of
     * the "outer" selector. To do so, builderFunc is passed an XPathBuilder instance configured to use the `childSelector`
     * as a new root for the currently constructed XPath expression.
     *
     * @param childSelector a plain XPath constraint appended to the currently constructed XPath expression
     * @param builderFunc can be used to apply XPath modification functions to `childSelector`
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    hasChild(childSelector, builderFunc) {
        this._xPathBuilder.hasChild(`.${childSelector}`, builderFunc);
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements whose text equals the passed text.
     *
     * @param text a text which must equal the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    text(text) {
        this._xPathBuilder.text(text);
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements whose text does not equal the passed text.
     *
     * @param text a text which must not equal the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notText(text) {
        this._xPathBuilder.notText(text);
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements whose text contains the passed text.
     *
     * @param text a text which must be contained by the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    textContains(text) {
        this._xPathBuilder.textContains(text);
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements whose text does not contain the passed text.
     *
     * @param text a text which must not be contained by the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notTextContains(text) {
        this._xPathBuilder.notTextContains(text);
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute whose name equals
     * the passed name.
     *
     * Optionally, if also passing a value, the currently constructed XPath expression is further restricted to elements
     * which have an HTML attribute whose name equals the passed name and whose value equals the passed value.
     *
     * @param name the name of the HTML attribute used to restrict the currently constructed XPath expression
     * @param value a value that needs to equal the value of the HTML attribute with the passed `name`
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    attribute(name, value) {
        this._xPathBuilder.attribute(name, value);
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute whose name
     * equals the passed name.
     *
     * Optionally, if also passing a value, the currently constructed XPath expression is restricted to elements
     * which have an HTML attribute whose name equals the passed name and whose value does not equal the passed value.
     *
     * @param name the name of the HTML attribute used to restrict the currently constructed XPath expression
     * @param value a value that must not equal the value of the HTML attribute with the passed `name`
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notAttribute(name, value) {
        this._xPathBuilder.notAttribute(name, value);
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute whose name contains
     * the passed name.
     *
     * Optionally, if also passing a value, the currently constructed XPath expression is further restricted to elements
     * which have an HTML attribute whose name equals the passed name and whose value contains the passed value.
     *
     * @param name the name of the HTML attribute used to restrict the currently constructed XPath expression
     * @param value a value that needs to be contained by the value of the HTML attribute with the passed `name`
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    attributeContains(name, value) {
        this._xPathBuilder.attributeContains(name, value);
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute whose name does not
     * contain the passed name.
     *
     * Optionally, if also passing a value, the currently constructed XPath expression is restricted to elements
     * which have an HTML attribute whose name equals the passed name and whose value does not contain the passed value.
     *
     * @param name the name of the HTML attribute used to restrict the currently constructed XPath expression
     * @param value a value that must not be contained by the value of the HTML attribute with the passed `name`
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notAttributeContains(name, value) {
        this._xPathBuilder.notAttributeContains(name, value);
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'id'.
     *
     * Optionally, if also passing an id, the currently constructed XPath expression is further restricted to elements
     * which have an HTML 'id' attribute with a value that equals the passed id.
     *
     * @param id an id which must equal the value of the HTML 'id' attribute of elements selected by the currently
     * constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    id(id) {
        return this.attribute('id', id);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called 'id'.
     *
     * Optionally, if also passing an id, the currently constructed XPath expression is restricted to elements which
     * have an HTML 'id' attribute with a value that does not equal the passed id.
     *
     * @param id an id which must not equal the value of the HTML 'id' attribute of elements selected by the currently
     * constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notId(id) {
        return this.notAttribute('id', id);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'id' with a
     * value that contains the passed id.
     *
     * @param id an id which must be contained by the value of the HTML 'id' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    idContains(id) {
        return this.attributeContains('id', id);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'id' with a
     * value that does not contain the passed id.
     *
     * @param id an id which must not be contained by the value of the HTML 'id' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notIdContains(id) {
        return this.notAttributeContains('id', id);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'class'.
     *
     * Optionally, if also passing a class name, the currently constructed XPath expression is further restricted to
     * elements which have an HTML 'class' attribute with a value that equals the passed class name.
     *
     * @param className a class name which must equal the value of the HTML 'class' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    class(className) {
        return this.attribute('class', className);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called 'class'.
     *
     * Optionally, if also passing a class name, the currently constructed XPath expression is restricted to elements
     * which have an HTML 'class' attribute with a value that does not equal the passed class name.
     *
     * @param className a class name which must not equal the value of the HTML 'class' attribute of elements selected by
     * the currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notClass(className) {
        return this.notAttribute('class', className);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'class' with a
     * value that contains the passed class name.
     *
     * @param className a class name which must be contained by the value of the HTML 'class' attribute of elements
     * selected by the currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    classContains(className) {
        return this.attributeContains('class', className);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'class' with a
     * value that does not contain the passed class name.
     *
     * @param className a class name which must not be contained by the value of the HTML 'class' attribute of elements
     * selected by the currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notClassContains(className) {
        return this.notAttributeContains('class', className);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'name'.
     *
     * Optionally, if also passing a name, the currently constructed XPath expression is further restricted to elements
     * which have an HTML 'name' attribute with a value that equals the passed name.
     *
     * @param name a name which must equal the value of the HTML 'name' attribute of elements selected by the currently
     * constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    name(name) {
        return this.attribute('name', name);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called 'name'.
     *
     * Optionally, if also passing a name, the currently constructed XPath expression is restricted to elements
     * which have an HTML 'name' attribute with a value that does not equal the passed name.
     *
     * @param name a name which must not equal the value of the HTML 'name' attribute of elements selected by the currently
     * constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notName(name) {
        return this.notAttribute('name', name);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'name' with a
     * value that contains the passed name.
     *
     * @param name a name which must be contained by the value of the HTML 'name' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    nameContains(name) {
        return this.attributeContains('name', name);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'name' with a
     * value that does not contain the passed name.
     *
     * @param name a name which must not be contained by the value of the HTML 'name' attribute of elements selected by
     * the currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notNameContains(name) {
        return this.notAttributeContains('name', name);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'type'.
     *
     * Optionally, if also passing a type, the currently constructed XPath expression is further restricted to elements
     * which have an HTML 'type' attribute with a value that equals the passed type.
     *
     * @param type a type which must equal the value of the HTML 'type' attribute of elements selected by the currently
     * constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    type(type) {
        return this.attribute('type', type);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called 'type'.
     *
     * Optionally, if also passing a type, the currently constructed XPath expression is restricted to elements
     * which have an HTML 'type' attribute with a value that does not equal the passed type.
     *
     * @param type a type which must not equal the value of the HTML 'type' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notType(type) {
        return this.notAttribute('type', type);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'type' with a
     * value that contains the passed type.
     *
     * @param type a type which must be contained by the value of the HTML 'type' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    typeContains(type) {
        return this.attributeContains('type', type);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'type' with a
     * value does not contain the passed type.
     *
     * @param type a type which must not be contained by the value of the HTML 'type' attribute of elements selected by
     * the currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notTypeContains(type) {
        return this.notAttributeContains('type', type);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'checked'.
     *
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    checked() {
        this._xPathBuilder.attribute('checked');
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called
     * 'checked'.
     *
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notChecked() {
        this._xPathBuilder.notAttribute('checked');
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'disabled'.
     *
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    disabled() {
        this._xPathBuilder.attribute('disabled');
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called
     * 'disabled'.
     *
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notDisabled() {
        this._xPathBuilder.notAttribute('disabled');
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'selected'.
     *
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    selected() {
        this._xPathBuilder.attribute('selected');
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called
     * 'selected'.
     *
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notSelected() {
        this._xPathBuilder.notAttribute('selected');
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have the passed level index (starting at 1).
     *
     * The passed level index defines an element's index of occurrence on a single "level" of the DOM.
     * Eg.: If index === 3, there must be 3 siblings on the same DOM level that match the current selector
     * and the third one will be selected.
     *
     * @param levelIndex an element's index of occurrence on a single "level" of the DOM - STARTS AT 1
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    levelIndex(levelIndex) {
        this._xPathBuilder.levelIndex(levelIndex);
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have the passed index (starting at 1).
     *
     * The passed index defines an element's index of occurrence across all "levels/depths" of the DOM.
     *
     * @param index an element's index of occurrence on a all "levels/depths" of the DOM - STARTS AT 1
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    index(index) {
        this._xPathBuilder.index(index);
        return this;
    }
    // Result retrieval functions
    /**
     * Retrieves a PageElement that refers to the first HTML element in the DOM which is selected by the currently
     * constructed XPath expression.
     *
     * @returns an instance of PageElement
     */
    getFirst() {
        return this._elementStoreFunc.apply(this._store, [this._xPathBuilder.build(), this._elementOpts]);
    }
    /**
     * Retrieves a PageElement that refers to the HTML element in the DOM at the passed index (starting at 0) which is
     * selected by the currently constructed XPath expression.
     *
     * @param index the index of occurrence of an element in the DOM whose selector is defined by the currently
     * constructed XPath expression (starting at 0)
     * @returns an instance of PageElement
     */
    getAt(index) {
        this.index(index + 1);
        return this.getFirst();
    }
    /**
     * Retrieves all PageElements that refer to HTML elements in the DOM which are selected by the currently constructed
     * XPath expression.
     *
     * @returns an array of instances of PageElement
     */
    getAll() {
        return this._getAllFunc(this.getList());
    }
    /**
     * Retrieves a clone of ListWhereBuilder's PageElementList that manages a subset of the original list's PageElements
     * selected by the currently constructed XPath expression.
     *
     * @returns an instance of PageElementList that manages a subset of the original list's PageElements
     */
    getList() {
        return this._cloneFunc(this._xPathBuilder.build());
    }
}
exports.ListWhereBuilder = ListWhereBuilder;
//# sourceMappingURL=ListWhereBuilder.js.map