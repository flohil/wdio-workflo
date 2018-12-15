/// <reference types="webdriverio" />
import { PageElementBase, IPageElementBaseOpts, PageElementBaseCurrently, PageElementBaseWait, PageElementBaseEventually } from '.';
import { PageElementStore } from '../stores';
export interface IPageElementOpts<Store extends PageElementStore> extends IPageElementBaseOpts<Store> {
    customScroll?: Workflo.IScrollParams;
}
export declare class PageElement<Store extends PageElementStore> extends PageElementBase<Store> implements Workflo.PageNode.IElementNode<string> {
    protected _waitType: Workflo.WaitType;
    protected _$: Store;
    protected _customScroll: Workflo.IScrollParams;
    readonly currently: PageElementCurrently<Store, this>;
    readonly wait: PageElementWait<Store, this>;
    readonly eventually: PageElementEventually<Store, this>;
    constructor(selector: string, { customScroll, ...superOpts }: IPageElementOpts<Store>);
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
        timeout?: number;
        customScroll?: Workflo.IScrollParams;
    }): this;
    protected _scrollTo(params: Workflo.IScrollParams): Workflo.IScrollResult;
    scrollTo(params: Workflo.IScrollParams): this;
    /**
     * Executes func after initial wait and, if an error occurs during execution of func,
     * throws a custom error message that the page element could not be located on the page.
     * @param func
     */
    protected _executeAfterInitialWait<ResultType>(func: () => ResultType): ResultType;
}
export declare class PageElementCurrently<Store extends PageElementStore, PageElementType extends PageElement<Store>> extends PageElementBaseCurrently<Store, PageElementType> implements Workflo.PageNode.IGetElement<string> {
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
    not: {
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
    exists(opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    isVisible(opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    isEnabled(opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    isSelected(opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    isChecked(opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasText(text: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasAnyText(opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    containsText(text: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasHTML(html: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasAnyHTML(opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    containsHTML(html: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasDirectText(directText: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasAnyDirectText(opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    containsDirectText(directText: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasAttribute(attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasAnyAttribute(attributeName: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    containsAttribute(attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasClass(className: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasAnyClass(opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    containsClass(className: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasId(id: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasAnyId(opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    containsId(id: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasName(name: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasAnyName(opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    containsName(name: string, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasLocation(coordinates: Workflo.ICoordinates, opts?: {
        tolerances?: Partial<Workflo.ICoordinates>;
    } & Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasX(x: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasY(y: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasSize(size: Workflo.ISize, opts?: {
        tolerances?: Partial<Workflo.ISize>;
    } & Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasWidth(width: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasHeight(height: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsOptionalReverse): PageElementType;
    untilElement(description: string, condition: (element: PageElementType) => boolean, { timeout }?: Workflo.IWDIOParamsOptional): PageElementType;
    not: {
        exists: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        isVisible: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        isEnabled: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        isSelected: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        isChecked: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasText: (text: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsText: (text: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyHTML: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyClass: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasId: (id: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyId: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsId: (id: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasName: (name: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyName: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsName: (name: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.IWDIOParamsOptional) => PageElementType;
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => PageElementType;
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => PageElementType;
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.IWDIOParamsOptional) => PageElementType;
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => PageElementType;
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => PageElementType;
    };
}
export declare class PageElementEventually<Store extends PageElementStore, PageElementType extends PageElement<Store>> extends PageElementBaseEventually<Store, PageElementType> {
    exists(opts?: Workflo.IWDIOParamsOptional): boolean;
    isVisible(opts?: Workflo.IWDIOParamsOptional): boolean;
    isEnabled(opts?: Workflo.IWDIOParamsOptional): boolean;
    isSelected(opts?: Workflo.IWDIOParamsOptional): boolean;
    isChecked(opts?: Workflo.IWDIOParamsOptional): boolean;
    hasText(text: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyText(opts?: Workflo.IWDIOParamsOptional): boolean;
    containsText(text: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasHTML(html: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyHTML(opts?: Workflo.IWDIOParamsOptional): boolean;
    containsHTML(html: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasDirectText(directText: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyDirectText(opts?: Workflo.IWDIOParamsOptional): boolean;
    containsDirectText(directText: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAttribute(attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyAttribute(attributeName: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    containsAttribute(attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasClass(className: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyClass(opts?: Workflo.IWDIOParamsOptional): boolean;
    containsClass(className: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasId(id: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyId(opts?: Workflo.IWDIOParamsOptional): boolean;
    containsId(id: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasName(name: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyName(opts?: Workflo.IWDIOParamsOptional): boolean;
    containsName(name: string, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasLocation(coordinates: Workflo.ICoordinates, opts?: {
        tolerances?: Partial<Workflo.ICoordinates>;
    } & Workflo.IWDIOParamsOptional): boolean;
    hasX(x: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsOptional): boolean;
    hasY(y: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsOptional): boolean;
    hasSize(size: Workflo.ISize, opts?: {
        tolerances?: Partial<Workflo.ISize>;
    } & Workflo.IWDIOParamsOptional): boolean;
    hasWidth(width: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsOptional): boolean;
    hasHeight(height: number, opts?: {
        tolerance?: number;
    } & Workflo.IWDIOParamsOptional): boolean;
    meetsCondition(condition: (element: PageElementType) => boolean, opts?: Workflo.IWDIOParamsOptional): boolean;
    not: {
        exists: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        isVisible: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        isEnabled: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        isSelected: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        isChecked: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasText: (text: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsText: (text: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyHTML: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyClass: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasId: (id: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyId: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsId: (id: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasName: (name: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyName: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsName: (name: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.IWDIOParamsOptional) => boolean;
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => boolean;
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => boolean;
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.IWDIOParamsOptional) => boolean;
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => boolean;
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => boolean;
    };
}
