import { XPathBuilder } from './XPathBuilder';
import { PageElement, PageElementList } from '../page_elements';
import { PageElementStore, CloneFunc } from '../stores';
/**
 * Defines the opts parameter passed to the constructor of ListWhereBuilder.
 */
export interface IWhereBuilderOpts<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> {
    /**
     * An instance of PageElementStore used by PageNodes which are returned by ListWhereBuilder.
     */
    store: Store;
    /**
     * A function that returns instances of a PageElements managed by ListWhereBuilder's PageElementList
     * from the ListWhereBuilder's PageElementStore.
     *
     * @param selector the selector of a created PageElement
     * @param opts passed to the constructor of the created PageElements
     */
    elementStoreFunc: (selector: string, opts: PageElementOptions) => PageElementType;
    /**
     * Opts passed to the constructor of PageElements created via ListWhereBuilder's PageElementStore.
     */
    elementOptions: PageElementOptions;
    /**
     * Creates a copy of ListWhereBuilder's PageElementList which manages a subset of the original list's PageElements.
     *
     * @template ListType the type of the cloned PageElementList
     */
    cloneFunc: CloneFunc<ListType>;
    /**
     * Returns all PageElements manages by ListWhereBuilder's PageElementList.
     *
     * @param list an instance of PageElementList for which all managed PageElements should be returned
     */
    getAllFunc: (list: ListType) => PageElementType[];
}
/**
 * ListWhereBuilder allows to select subsets of a PageElementList (subsets of its managed PageElements) by modifying the
 * list's selector using XPath modification functions.
 *
 * @template Store type of the instance of PageElementStore that is used by PageNodes returned by ListWhereBuilder
 * @template PageElementType type of instances of PageElements returned by ListWhereBuilder's retrieval functions
 * (getXXX)
 * @template PageElementOptions type of opts passed to the constructors of PageElements returned by ListWhereBuilder's
 * retrieval functions
 * @template ListType type of the PageElementList on which ListWhereBuilder operates
 */
export declare class ListWhereBuilder<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> {
    /**
     * Stores the root selector for all XPath modifications performed with ListWhereBuilder.
     */
    protected _selector: string;
    /**
     * An instance of PageElementStore used by PageNodes which are returned by ListWhereBuilder.
     */
    protected _store: Store;
    /**
     * A function that returns instances of a PageElements managed by ListWhereBuilder's PageElementList
     * from the ListWhereBuilder's PageElementStore.
     *
     * @param selector the selector of a created PageElement
     * @param opts passed to the constructor of the created PageElements
     */
    protected _elementStoreFunc: (selector: string, opts: PageElementOptions) => PageElementType;
    /**
     * Opts passed to the constructor of PageElements created via ListWhereBuilder's PageElementStore.
     */
    protected _elementOptions: PageElementOptions;
    /**
     * Creates a copy of ListWhereBuilder's PageElementList which manages a subset of the original list's PageElements.
     *
     * @template ListType the type of the cloned PageElementList
     */
    protected _cloneFunc: CloneFunc<ListType>;
    /**
     * Returns all PageElements manages by ListWhereBuilder's PageElementList.
     *
     * @param list an instance of PageElementList for which all managed PageElements should be returned
     */
    protected _getAllFunc: (list: ListType) => PageElementType[];
    /**
     * An instance of XPathBuilder used by ListWhereBuilder to perform XPath modifications.
     */
    protected _xPathBuilder: XPathBuilder;
    /**
     * ListWhereBuilder allows to select subsets of a PageElementList (subsets of its managed PageElements) by modifying the
     * list's selector using XPath modification functions.
     *
     * @param selector This is a raw XPath string used as root selector for all XPath modifications performed with
     * ListWhereBuilder. It is appended to the selector of the PageElementList handled by ListWhereBuilder.
     * @param opts opts parameter passed to the constructor of ListWhereBuilder
     */
    constructor(selector: string, opts: IWhereBuilderOpts<Store, PageElementType, PageElementOptions, ListType>);
    /**
     * Resets the currently processed XPath expression to the root XPath selector passed to ListWhereBuilder's
     * constructor.
     *
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    reset(): this;
    /**
     * Appends a plain XPath string to the currently constructed XPath expression.
     *
     * @param appendedXPath the appended plain XPath string
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    append(appendedXPath: string): this;
    /**
     * Appends a childSelector to the currently constructed XPath expression in order to select a child element.
     *
     * After executing `.child`, the selected child element becomes the new "target" for all future XPath modification
     * functions (eg. `.id`, `.class`) until the currently constructed XPath expression is reset.
     *
     * @param childSelector a selector appended to the currently constructed XPath expression to select a child element
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    constraint(constraintSelector: string, builderFunc?: (xPath: XPathBuilder) => XPathBuilder): this;
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
    hasChild(childSelector: string, builderFunc?: (xpath: XPathBuilder) => XPathBuilder): this;
    /**
     * Restricts the currently constructed XPath expression to elements whose text equals the passed text.
     *
     * @param text a text which must equal the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    text(text: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements whose text does not equal the passed text.
     *
     * @param text a text which must not equal the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notText(text: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements whose text contains the passed text.
     *
     * @param text a text which must be contained by the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    textContains(text: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements whose text does not contain the passed text.
     *
     * @param text a text which must not be contained by the text of elements selected by the currently constructed XPath
     * expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notId(id?: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'id' with a
     * value that contains the passed id.
     *
     * @param id an id which must be contained by the value of the HTML 'id' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    idContains(id: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'id' with a
     * value that does not contain the passed id.
     *
     * @param id an id which must not be contained by the value of the HTML 'id' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notClass(className?: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'class' with a
     * value that contains the passed class name.
     *
     * @param className a class name which must be contained by the value of the HTML 'class' attribute of elements
     * selected by the currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    classContains(className: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'class' with a
     * value that does not contain the passed class name.
     *
     * @param className a class name which must not be contained by the value of the HTML 'class' attribute of elements
     * selected by the currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notName(name?: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'name' with a
     * value that contains the passed name.
     *
     * @param name a name which must be contained by the value of the HTML 'name' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    nameContains(name: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'name' with a
     * value that does not contain the passed name.
     *
     * @param name a name which must not be contained by the value of the HTML 'name' attribute of elements selected by
     * the currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notType(type?: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'type' with a
     * value that contains the passed type.
     *
     * @param type a type which must be contained by the value of the HTML 'type' attribute of elements selected by the
     * currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    typeContains(type: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'type' with a
     * value does not contain the passed type.
     *
     * @param type a type which must not be contained by the value of the HTML 'type' attribute of elements selected by
     * the currently constructed XPath expression
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notTypeContains(type: string): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'checked'.
     *
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    checked(): this;
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called
     * 'checked'.
     *
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notChecked(): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'disabled'.
     *
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    disabled(): this;
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called
     * 'disabled'.
     *
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    notDisabled(): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have an HTML attribute called 'selected'.
     *
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    selected(): this;
    /**
     * Restricts the currently constructed XPath expression to elements which do not have an HTML attribute called
     * 'selected'.
     *
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
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
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    levelIndex(levelIndex: number): this;
    /**
     * Restricts the currently constructed XPath expression to elements which have the passed index (starting at 1).
     *
     * The passed index defines an element's index of occurrence across all "levels/depths" of the DOM.
     *
     * @param index an element's index of occurrence on a all "levels/depths" of the DOM - STARTS AT 1
     * @returns the singleton instance of ListWhereBuilder storing the currently constructed XPath expression
     */
    index(index: number): this;
    /**
     * Retrieves a PageElement that refers to the first HTML element in the DOM which is selected by the currently
     * constructed XPath expression.
     *
     * @returns an instance of PageElement
     */
    getFirst(): PageElementType;
    /**
     * Retrieves a PageElement that refers to the HTML element in the DOM at the passed index (starting at 0) which is
     * selected by the currently constructed XPath expression.
     *
     * @param index the index of occurrence of an element in the DOM whose selector is defined by the currently
     * constructed XPath expression (starting at 0)
     * @returns an instance of PageElement
     */
    getAt(index: number): PageElementType;
    /**
     * Retrieves all PageElements that refer to HTML elements in the DOM which are selected by the currently constructed
     * XPath expression.
     *
     * @returns an array of instances of PageElement
     */
    getAll(): PageElementType[];
    /**
     * Retrieves a clone of ListWhereBuilder's PageElementList that manages a subset of the original list's PageElements
     * selected by the currently constructed XPath expression.
     *
     * @returns an instance of PageElementList that manages a subset of the original list's PageElements
     */
    getList(): ListType;
}
