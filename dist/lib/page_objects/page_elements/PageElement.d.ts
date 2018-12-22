/// <reference types="webdriverio" />
import { PageElementBase, IPageElementBaseOpts, PageElementBaseCurrently, PageElementBaseWait, PageElementBaseEventually } from '.';
import { PageElementStore } from '../stores';
export interface IPageElementOpts<Store extends PageElementStore> extends IPageElementBaseOpts<Store> {
    customScroll?: Workflo.IScrollParams;
}
export declare class PageElement<Store extends PageElementStore> extends PageElementBase<Store> implements Workflo.PageNode.IElementNode<string, boolean, true> {
    protected _customScroll: Workflo.IScrollParams;
    readonly currently: PageElementCurrently<Store, this>;
    readonly wait: PageElementWait<Store, this>;
    readonly eventually: PageElementEventually<Store, this>;
    constructor(selector: string, { customScroll, ...superOpts }: IPageElementOpts<Store>);
    /**
     * For internal use only in order to retrieve an Element's Store type!
     */
    readonly __$: Store;
    __equals<T>(actual: T, expected: T): boolean;
    __any<T>(actual: T): boolean;
    __contains<T>(actual: T, expected: T): boolean;
    __typeToString<T>(value: T): "" | (T & string);
    /**
     * Return WdioElement from current state, not performing an initial wait.
     */
    protected readonly __element: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element>> & WebdriverIO.RawResult<WebdriverIO.Element>;
    /**
     * Return WdioElement after performing an initial wait.
     */
    readonly element: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element>> & WebdriverIO.RawResult<WebdriverIO.Element>;
    initialWait(): this;
    getIsEnabled(): boolean;
    getHTML(): string;
    getDirectText(): string;
    getText(): string;
    getAttribute(attributeName: string): string;
    getClass(): string;
    getId(): string;
    getName(): string;
    getLocation(): Workflo.ICoordinates;
    getX(): number;
    getY(): number;
    getSize(): Workflo.ISize;
    getWidth(): number;
    getHeight(): number;
    /**
     *
     * @param postCondition Sometimes javascript that is to be executed after a click
     * is not loaded right at the moment that the element wait condition
     * is fulfilled. (eg. element is visible)
     * In this case, postCondition function will be
     */
    click(options?: {
        postCondition?: () => boolean;
        customScroll?: Workflo.IScrollParams;
    } & Workflo.IWDIOParamsInterval): this;
    protected _scrollTo(params: Workflo.IScrollParams): Workflo.IScrollResult;
    scrollTo(params: Workflo.IScrollParams): this;
    /**
     * Executes func after initial wait and, if an error occurs during execution of func,
     * throws a custom error message that the page element could not be located on the page.
     * @param func
     */
    protected _executeAfterInitialWait<ResultType>(func: () => ResultType): ResultType;
}
export declare class PageElementCurrently<Store extends PageElementStore, PageElementType extends PageElement<Store>> extends PageElementBaseCurrently<Store, PageElementType> {
    getExists(): boolean;
    getIsVisible(): boolean;
    getIsEnabled(): boolean;
    /**
     * Overwriting this function will affect the behaviour of the functions
     * getHTML, hasHTML, containsHTML and hasAnyHTML in PageElement base class and its
     * currently, wait and eventually containers.
     */
    getHTML(): string;
    /**
     * Gets text that resides on the level directly below the selected page element.
     * Does not include text of the page element's nested children elements.
     *
     * Overwriting this function will affect the behaviour of the functions
     * getDirectText, hasDirectText, containsDirectText and hasDirectAnyText in PageElement base class and its
     * currently, wait and eventually containers.
     */
    getDirectText(): string;
    /**
     * Returns text of this.element including all texts of nested children.
     * Be aware that only text visible within the viewport will be returned.
     *
     * Overwriting this function will affect the behaviour of the functions
     * getText, hasText, containsText and hasAnyText in PageElement base class and its
     * currently, wait and eventually containers.
     */
    getText(): string;
    /**
     * Overwriting this function will affect the behaviour of the functions
     * getAttribute, hasAttribute, containsAttribute and hasAnyAttribute in PageElement base class and its
     * currently, wait and eventually containers.
     */
    getAttribute(attrName: string): string;
    /**
     * Overwriting this function will affect the behaviour of the functions
     * getClass, hasClass, containsClass and hasAnyClass in PageElement base class and its
     * currently, wait and eventually containers.
     */
    getClass(): string;
    /**
     * Overwriting this function will affect the behaviour of the functions
     * getId, hasId, containsId and hasAnyId in PageElement base class and its
     * currently, wait and eventually containers.
     */
    getId(): string;
    /**
     * Overwriting this function will affect the behaviour of the functions
     * getName, hasName, containsName and hasAnyName in PageElement base class and its
     * currently, wait and eventually containers.
     */
    getName(): string;
    /**
     * Overwriting this function will affect the behaviour of the functions
     * getLocation, hasLocation, containsLocation and hasAnyLocation in PageElement base class and its
     * currently, wait and eventually containers.
     */
    getLocation(): Workflo.ICoordinates;
    /**
     * Overwriting this function will affect the behaviour of the functions
     * getX, hasX, containsX and hasAnyX in PageElement base class and its
     * currently, wait and eventually containers.
     */
    getX(): number;
    /**
     * Overwriting this function will affect the behaviour of the functions
     * getY, hasY, containsY and hasAnyY in PageElement base class and its
     * currently, wait and eventually containers.
     */
    getY(): number;
    /**
     * Overwriting this function will affect the behaviour of the functions
     * getSize, hasSize, containsSize and hasAnySize in PageElement base class and its
     * currently, wait and eventually containers.
     */
    getSize(): Workflo.ISize;
    /**
     * Overwriting this function will affect the behaviour of the functions
     * getWidth, hasWidth, containsWidth and hasAnyWidth in PageElement base class and its
     * currently, wait and eventually containers.
     */
    getWidth(): number;
    /**
     * Overwriting this function will affect the behaviour of the functions
     * getHeight, hasHeight, containsHeight and hasAnyHeight in PageElement base class and its
     * currently, wait and eventually containers.
     */
    getHeight(): number;
    /**
   * @param actual the actual browser value in pixels
   * @param expected the expected value in pixels or 0 if expected was smaller than 0
   * @param tolerance the tolerance in pixels or 0 if tolerance was smaller than 0
   */
    protected _withinTolerance(actual: number, expected: number, tolerance?: number): boolean;
    protected _hasAxisLocation(expected: number, actual: number, tolerance?: number): boolean;
    protected _hasSideSize(expected: number, actual: number, tolerance?: number): boolean;
    /**
     * Overwriting this function will affect the behaviour of the function
     * exists in PageElement base class and its currently, wait and eventually containers.
     */
    exists(): boolean;
    /**
     * Overwriting this function will affect the behaviour of the function
     * isVisible in PageElement base class and its currently, wait and eventually containers.
     */
    isVisible(): boolean;
    /**
     * Overwriting this function will affect the behaviour of the function
     * isEnabled in PageElement base class and its currently, wait and eventually containers.
     */
    isEnabled(): boolean;
    /**
     * Overwriting this function will affect the behaviour of the function
     * isSelected in PageElement base class and its currently, wait and eventually containers.
     */
    isSelected(): boolean;
    /**
     * Overwriting this function will affect the behaviour of the function
     * isChecked in PageElement base class and its currently, wait and eventually containers.
     */
    isChecked(): boolean;
    hasText(text: string): boolean;
    hasAnyText(): boolean;
    containsText(text: string): any;
    hasHTML(html: string): boolean;
    hasAnyHTML(): boolean;
    containsHTML(html: string): any;
    hasDirectText(directText: string): boolean;
    hasAnyDirectText(): boolean;
    containsDirectText(directText: string): any;
    hasAttribute(attributeName: string, attributeValue: string): boolean;
    hasAnyAttribute(attributeName: string): boolean;
    containsAttribute(attributeName: string, attributeValue: string): any;
    hasClass(className: string): boolean;
    hasAnyClass(): boolean;
    containsClass(className: string): any;
    hasId(id: string): boolean;
    hasAnyId(): boolean;
    containsId(id: string): any;
    hasName(name: string): boolean;
    hasAnyName(): boolean;
    containsName(name: string): any;
    hasLocation(coordinates: Workflo.ICoordinates, tolerances?: Partial<Workflo.ICoordinates>): boolean;
    hasX(x: number, tolerance?: number): boolean;
    hasY(y: number, tolerance?: number): boolean;
    hasSize(size: Workflo.ISize, tolerances?: Partial<Workflo.ISize>): boolean;
    hasWidth(width: number, tolerance?: number): boolean;
    hasHeight(height: number, tolerance?: number): boolean;
    readonly not: {
        exists: () => boolean;
        isVisible: () => boolean;
        isEnabled: () => boolean;
        isSelected: () => boolean;
        isChecked: () => boolean;
        hasText: (text: string) => boolean;
        hasAnyText: () => boolean;
        containsText: (text: string) => boolean;
        hasDirectText: (directText: string) => boolean;
        hasAnyDirectText: () => boolean;
        containsDirectText: (directText: string) => boolean;
        hasAttribute: (attributeName: string, attributeValue: string) => boolean;
        hasAnyAttribute: (attributeName: string) => boolean;
        containsAttribute: (attributeName: string, attributeValue: string) => boolean;
        hasHTML: (html: string) => boolean;
        hasAnyHTML: () => boolean;
        containsHTML: (html: string) => boolean;
        hasClass: (className: string) => boolean;
        hasAnyClass: () => boolean;
        containsClass: (className: string) => boolean;
        hasId: (id: string) => boolean;
        hasAnyId: () => boolean;
        containsId: (id: string) => boolean;
        hasName: (name: string) => boolean;
        hasAnyName: () => boolean;
        containsName: (name: string) => boolean;
        hasLocation: (coordinates: Workflo.ICoordinates, tolerances?: Partial<Workflo.ICoordinates>) => boolean;
        hasX: (x: number, tolerance?: number) => boolean;
        hasY: (y: number, tolerance?: number) => boolean;
        hasSize: (size: Workflo.ISize, tolerances?: Partial<Workflo.ISize>) => boolean;
        hasWidth: (width: number, tolerance?: number) => boolean;
        hasHeight: (height: number, tolerance?: number) => boolean;
    };
}
export declare class PageElementWait<Store extends PageElementStore, PageElementType extends PageElement<Store>> extends PageElementBaseWait<Store, PageElementType> {
    exists(opts?: Workflo.IWDIOParamsReverse): PageElementType;
    isVisible(opts?: Workflo.IWDIOParamsReverse): PageElementType;
    isEnabled(opts?: Workflo.IWDIOParamsReverse): PageElementType;
    isSelected(opts?: Workflo.IWDIOParamsReverse): PageElementType;
    isChecked(opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasText(text: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasAnyText(opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    containsText(text: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasHTML(html: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasAnyHTML(opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    containsHTML(html: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasDirectText(directText: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasAnyDirectText(opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    containsDirectText(directText: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasAttribute(attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasAnyAttribute(attributeName: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    containsAttribute(attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasClass(className: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasAnyClass(opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    containsClass(className: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasId(id: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasAnyId(opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    containsId(id: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasName(name: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasAnyName(opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    containsName(name: string, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasLocation(coordinates: Workflo.ICoordinates, opts?: {
        tolerances?: Partial<Workflo.ICoordinates>;
    } & Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasX(x: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasY(y: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasSize(size: Workflo.ISize, opts?: {
        tolerances?: Partial<Workflo.ISize>;
    } & Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasWidth(width: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasHeight(height: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsReverseInterval): PageElementType;
    untilElement(description: string, condition: (element: PageElementType) => boolean, { timeout, interval }?: Workflo.IWDIOParamsInterval): PageElementType;
    readonly not: {
        exists: (opts?: Workflo.IWDIOParams) => PageElementType;
        isVisible: (opts?: Workflo.IWDIOParams) => PageElementType;
        isEnabled: (opts?: Workflo.IWDIOParams) => PageElementType;
        isSelected: (opts?: Workflo.IWDIOParams) => PageElementType;
        isChecked: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasText: (text: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsText: (text: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasHTML: (html: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyHTML: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsHTML: (html: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasClass: (className: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyClass: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsClass: (className: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasId: (id: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyId: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsId: (id: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasName: (name: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyName: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsName: (name: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.IWDIOParamsInterval) => PageElementType;
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => PageElementType;
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => PageElementType;
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.IWDIOParamsInterval) => PageElementType;
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => PageElementType;
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => PageElementType;
    };
}
export declare class PageElementEventually<Store extends PageElementStore, PageElementType extends PageElement<Store>> extends PageElementBaseEventually<Store, PageElementType> {
    exists(opts?: Workflo.IWDIOParams): boolean;
    isVisible(opts?: Workflo.IWDIOParams): boolean;
    isEnabled(opts?: Workflo.IWDIOParams): boolean;
    isSelected(opts?: Workflo.IWDIOParams): boolean;
    isChecked(opts?: Workflo.IWDIOParamsInterval): boolean;
    hasText(text: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyText(opts?: Workflo.IWDIOParamsInterval): boolean;
    containsText(text: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasHTML(html: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyHTML(opts?: Workflo.IWDIOParamsInterval): boolean;
    containsHTML(html: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasDirectText(directText: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyDirectText(opts?: Workflo.IWDIOParamsInterval): boolean;
    containsDirectText(directText: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAttribute(attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyAttribute(attributeName: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    containsAttribute(attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasClass(className: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyClass(opts?: Workflo.IWDIOParamsInterval): boolean;
    containsClass(className: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasId(id: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyId(opts?: Workflo.IWDIOParamsInterval): boolean;
    containsId(id: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasName(name: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyName(opts?: Workflo.IWDIOParamsInterval): boolean;
    containsName(name: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasLocation(coordinates: Workflo.ICoordinates, opts?: {
        tolerances?: Partial<Workflo.ICoordinates>;
    } & Workflo.IWDIOParamsInterval): boolean;
    hasX(x: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsInterval): boolean;
    hasY(y: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsInterval): boolean;
    hasSize(size: Workflo.ISize, opts?: {
        tolerances?: Partial<Workflo.ISize>;
    } & Workflo.IWDIOParamsInterval): boolean;
    hasWidth(width: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsInterval): boolean;
    hasHeight(height: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsInterval): boolean;
    meetsCondition(condition: (element: PageElementType) => boolean, opts?: Workflo.IWDIOParamsInterval): boolean;
    readonly not: {
        exists: (opts?: Workflo.IWDIOParams) => boolean;
        isVisible: (opts?: Workflo.IWDIOParams) => boolean;
        isEnabled: (opts?: Workflo.IWDIOParams) => boolean;
        isSelected: (opts?: Workflo.IWDIOParams) => boolean;
        isChecked: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasText: (text: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsText: (text: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasHTML: (html: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyHTML: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsHTML: (html: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasClass: (className: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyClass: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsClass: (className: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasId: (id: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyId: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsId: (id: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasName: (name: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyName: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsName: (name: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.IWDIOParamsInterval) => boolean;
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => boolean;
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => boolean;
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.IWDIOParamsInterval) => boolean;
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => boolean;
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => boolean;
    };
}
