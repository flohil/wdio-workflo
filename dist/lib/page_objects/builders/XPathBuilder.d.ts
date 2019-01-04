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
export declare class XPathBuilder {
    private static _instance;
    private _selector;
    /**
     * Returns a singleton instance of XPathBuilder.
     */
    static getInstance(): XPathBuilder;
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
    reset(selector: string): this;
    /**
     * Appends a plain XPath string to the currently constructed XPath expression.
     *
     * @param appendedXPath the appended plain XPath string
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    append(appendedXPath: string): this;
    /**
     * Appends a childSelector to the currently constructed XPath expression in order to select a child element.
     *
     * After executing `.child`, the selected child element becomes the new "target" for all future XPath modification
     * functions (eg. `.id`, `.class`) until the currently constructed XPath expression is reset.
     *
     * @param childSelector a selector appended to the currently constructed XPath expression to select a child element
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    child(childSelector: string): this;
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
    constraint(constraintSelector: string, builderFunc?: (xpath: XPathBuilder) => XPathBuilder): this;
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
    * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
    */
    hasChild(childSelector: string, builderFunc?: (xpath: XPathBuilder) => XPathBuilder): this;
    /**
     * Restricts the currently constructed XPath expression to elements whose text equals the passed text.
     *
     * @param text a text which must equal the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    text(text: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements whose text does not equal the passed text.
     *
     * @param text a text which must not equal the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notText(text: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements whose text contains the passed text.
     *
     * @param text a text which must be contained by the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    textContains(text: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements whose text does not contain the passed text.
     *
     * @param text a text which must not be contained by the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notTextContains(text: string): this;
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
    attribute(name: string, value?: string): this;
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
    notAttribute(name: string, value?: string): this;
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
    attributeContains(name: string, value: string): this;
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
    notAttributeContains(name: string, value: string): this;
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
    id(id?: string): this;
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
    notId(id?: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'id' with a
     * value that contains the passed id.
     *
     * @param id an id which must be contained by the value of the HTML 'id' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    idContains(id: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'id' with a
     * value that does not contain the passed id.
     *
     * @param id an id which must not be contained by the value of the HTML 'id' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notIdContains(id: string): this;
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
    class(className?: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called 'class'.
     *
     * Optionally, if also passing a class name, the currently constructed XPath expression is restricted to elements
     * which have an HTML 'class' attribute with a value that does not equal the passed class name.
     *
     * @param className a class name which must not equal the value of the HTML 'class' attribute of elements selected by
     * the currently constructed XPath expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notClass(className?: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'class' with a
     * value that contains the passed class name.
     *
     * @param className a class name which must be contained by the value of the HTML 'class' attribute of elements
     * selected by the currently constructed XPath expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    classContains(className: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'class' with a
     * value that does not contain the passed class name.
     *
     * @param className a class name which must not be contained by the value of the HTML 'class' attribute of elements
     * selected by the currently constructed XPath expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notClassContains(className: string): this;
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
    name(name?: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called 'name'.
     *
     * Optionally, if also passing a name, the currently constructed XPath expression is restricted to elements
     * which have an HTML 'name' attribute with a value that does not equal the passed name.
     *
     * @param name a name which must not equal the value of the HTML 'name' attribute of elements selected by the currently
     * constructed XPath expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notName(name?: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'name' with a
     * value that contains the passed name.
     *
     * @param name a name which must be contained by the value of the HTML 'name' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    nameContains(name: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'name' with a
     * value that does not contain the passed name.
     *
     * @param name a name which must not be contained by the value of the HTML 'name' attribute of elements selected by
     * the currently constructed XPath expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notNameContains(name: string): this;
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
    type(type?: string): this;
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
    notType(type?: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'type' with a
     * value that contains the passed type.
     *
     * @param type a type which must be contained by the value of the HTML 'type' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    typeContains(type: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'type' with a
     * value does not contain the passed type.
     *
     * @param type a type which must not be contained by the value of the HTML 'type' attribute of elements selected by
     * the currently constructed XPath expression
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notTypeContains(type: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'checked'.
     *
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    checked(): this;
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called
     * 'checked'.
     *
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notChecked(): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'disabled'.
     *
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    disabled(): this;
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called
     * 'disabled'.
     *
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notDisabled(): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'selected'.
     *
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    selected(): this;
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called
     * 'selected'.
     *
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    notSelected(): this;
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
    levelIndex(levelIndex: number): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have the passed index (starting at 1).
     *
     * The passed index defines an element's index of occurrence across all "levels/depths" of the DOM.
     *
     * @param index an element's index of occurrence on a all "levels/depths" of the DOM - STARTS AT 1
     * @returns the singleton instance of XPathBuilder storing the currently constructed XPath expression
     */
    index(index: number): this;
    /**
     * Call this function to build and retrieve a raw XPath string from the currently constructed XPath expression.
     *
     * @returns the built XPath string
     */
    build(): string;
}
