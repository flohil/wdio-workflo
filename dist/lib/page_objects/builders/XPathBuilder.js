"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * XPathBuilder allows for the creation of XPath expressions using modification functions instead of writing the whole
 * XPath as a raw string.
 *
 * Using XPathBuilder can help to reduce the number of errors originating from a wrong usage of the sometimes quite
 * complex syntax of XPath.
 *
 * XPathBuilder implements the singleton pattern - therefore there can only ever by one instance of XPathBuilder
 * which internally stores the currently constructed XPath expression.
 *
 * To build and retrieve a raw XPath string from the currently constructed XPath expression, call `build` on
 * XPathBuilder's singleton instance.
 */
class XPathBuilder {
    /**
     * Returns a singleton instance of XPathBuilder.
     */
    static getInstance() {
        if (typeof XPathBuilder._instance === 'undefined') {
            XPathBuilder._instance = new XPathBuilder();
        }
        return XPathBuilder._instance;
    }
    /**
     * Resets the currently processed XPath expression to the passed initial XPath selector.
     *
     * This initial XPath selector must select an HTML tag that is one of the following:
     *
     * - a direct child (eg. '/span') of either another XPath expression or of the DOM root node
     * - an indirect/deeply nested child (eg. '//div') of either another XPath expression or of the DOM root node
     *
     * @param selector an XPath selector used as the initial "root" for a new XPath expression (eg. '//div')
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    reset(selector) {
        this._selector = selector;
        return this;
    }
    /**
     * Appends a plain XPath string to the currently constructed XPath expression.
     *
     * @param appendedXPath the appended plain XPath string
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    append(appendedXPath) {
        this._selector = `${this._selector}${appendedXPath}`;
        return this;
    }
    /**
     * Appends a childSelector to the currently constructed XPath expression in order to select a child element.
     *
     * After executing `.child`, the selected child element becomes the new "target" for all future XPath modification
     * functions (eg. `.id`, `.class`) until the currently constructed XPath expression is reset.
     *
     * @param childSelector a selector appended to the currently constructed XPath expression to select a child element
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    child(childSelector) {
        return this.append(childSelector);
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    constraint(constraintSelector, builderFunc) {
        if (!builderFunc) {
            this._selector = `${this._selector}[${constraintSelector}]`;
        }
        else {
            const outerSelector = this.build();
            this.reset(constraintSelector);
            this._selector = `${outerSelector}[${builderFunc(this).build()}]`;
            this.reset(this._selector);
        }
        return this;
    }
    /**
    * Restricts the currently constructed XPath expression to elements which have at least one child element that matches
    * the passed childSelector.
    *
    * Optionally, a builderFunc can be used to apply XPath modification functions to the child selector instead of
    * the "outer" selector. To do so, builderFunc is passed an XPathBuilder instance configured to use the
    * `childSelector` as a new root for the currently constructed XPath expression.
    *
    * @param childSelector a plain XPath constraint appended to the currently constructed XPath expression
    * @param builderFunc can be used to apply XPath modification functions to `childSelector`
    * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
    */
    hasChild(childSelector, builderFunc) {
        this.constraint(`.${childSelector}`, builderFunc);
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements whose text equals the passed text.
     *
     * @param text a text which must equal the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    text(text) {
        this._selector = `${this._selector}[. = '${text}']`;
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements whose text does not equal the passed text.
     *
     * @param text a text which must not equal the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notText(text) {
        this._selector = `${this._selector}[not(. = '${text}')]`;
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements whose text contains the passed text.
     *
     * @param text a text which must be contained by the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    textContains(text) {
        this._selector = `${this._selector}[contains(.,'${text}')]`;
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements whose text does not contain the passed text.
     *
     * @param text a text which must not be contained by the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notTextContains(text) {
        this._selector = `${this._selector}[not(contains(.,'${text}'))]`;
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    attribute(name, value) {
        if (value) {
            this._selector = `${this._selector}[@${name}='${value}']`;
        }
        else {
            this._selector = `${this._selector}[@${name}]`;
        }
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notAttribute(name, value) {
        if (value) {
            this._selector = `${this._selector}[not(@${name}='${value}')]`;
        }
        else {
            this._selector = `${this._selector}[not(@${name})]`;
        }
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    attributeContains(name, value) {
        this._selector = `${this._selector}[contains(@${name},'${value}')]`;
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notAttributeContains(name, value) {
        this._selector = `${this._selector}[not(contains(@${name},'${value}'))]`;
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    class(className) {
        return this.attribute('class', className);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called
     * 'class'.
     *
     * Optionally, if also passing a class name, the currently constructed XPath expression is restricted to elements
     * which have an HTML 'class' attribute with a value that does not equal the passed class name.
     *
     * @param className a class name which must not equal the value of the HTML 'class' attribute of elements selected by
     * the currently constructed XPath expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
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
     * @param name a name which must not equal the value of the HTML 'name' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notTypeContains(type) {
        return this.notAttributeContains('type', type);
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'checked'.
     *
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    checked() {
        return this.attribute('checked');
    }
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called
     * 'checked'.
     *
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notChecked() {
        return this.notAttribute('checked');
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'disabled'.
     *
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    disabled() {
        return this.attribute('disabled');
    }
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called
     * 'disabled'.
     *
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notDisabled() {
        return this.notAttribute('disabled');
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'selected'.
     *
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    selected() {
        return this.attribute('selected');
    }
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called
     * 'selected'.
     *
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notSelected() {
        return this.notAttribute('selected');
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have the passed level index (starting at 1).
     *
     * The passed level index defines an element's index of occurrence on a single "level" of the DOM.
     * Eg.: If index === 3, there must be 3 siblings on the same DOM level that match the current selector
     * and the third one will be selected.
     *
     * @param levelIndex an element's index of occurrence on a single "level" of the DOM - STARTS AT 1
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    levelIndex(levelIndex) {
        this._selector = `${this._selector}[${levelIndex}]`;
        return this;
    }
    /**
     * Restricts the currently constructed XPath expression to elements which have the passed index (starting at 1).
     *
     * The passed index defines an element's index of occurrence across all "levels/depths" of the DOM.
     *
     * @param index an element's index of occurrence on a all "levels/depths" of the DOM - STARTS AT 1
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    index(index) {
        const selector = `(${this.build()})[${index}]`;
        this.reset(selector);
        return this;
    }
    /**
     * Call this function to build and retrieve a raw XPath string from the currently constructed XPath expression.
     *
     * @returns the built XPath string
     */
    build() {
        const selector = this._selector;
        return selector;
    }
}
exports.XPathBuilder = XPathBuilder;
//# sourceMappingURL=XPathBuilder.js.map