/// <reference types="webdriverio" />
import { PageElementBase, IPageElementBaseOpts, PageElementBaseCurrently, PageElementBaseWait, PageElementBaseEventually } from '.';
import { PageElementStore } from '../stores';
export interface IPageElementOpts<Store extends PageElementStore> extends IPageElementBaseOpts<Store> {
    customScroll?: Workflo.IScrollParams;
}
export declare class PageElement<Store extends PageElementStore> extends PageElementBase<Store> implements Workflo.PageNode.IElementNode<string, boolean, boolean> {
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
    __typeToString<T>(value: T): string;
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
    getHasText(text: string): boolean;
    getHasAnyText(): boolean;
    getContainsText(text: string): boolean;
    getHasDirectText(directText: string): boolean;
    getHasAnyDirectText(): boolean;
    getContainsDirectText(directText: string): boolean;
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
    } & Workflo.ITimeoutInterval): this;
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
     * Does not include any text of the page element's nested children elements.
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
    getHasText(text: string): boolean;
    getHasAnyText(): boolean;
    getContainsText(text: string): boolean;
    getHasDirectText(directText: string): boolean;
    getHasAnyDirectText(): boolean;
    getContainsDirectText(directText: string): boolean;
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
    containsText(text: string): boolean;
    hasHTML(html: string): boolean;
    hasAnyHTML(): boolean;
    containsHTML(html: string): boolean;
    hasDirectText(directText: string): boolean;
    hasAnyDirectText(): boolean;
    containsDirectText(directText: string): boolean;
    hasAttribute(attribute: Workflo.IAttribute): boolean;
    hasAnyAttribute(attributeName: string): boolean;
    containsAttribute(attribute: Workflo.IAttribute): boolean;
    hasClass(className: string): boolean;
    hasAnyClass(): boolean;
    containsClass(className: string): boolean;
    hasId(id: string): boolean;
    hasAnyId(): boolean;
    containsId(id: string): boolean;
    hasName(name: string): boolean;
    hasAnyName(): boolean;
    containsName(name: string): boolean;
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
        hasAttribute: (attribute: Workflo.IAttribute) => boolean;
        hasAnyAttribute: (attributeName: string) => boolean;
        containsAttribute: (attribute: Workflo.IAttribute) => boolean;
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
    exists(opts?: Workflo.ITimeoutReverse): PageElementType;
    isVisible(opts?: Workflo.ITimeoutReverse): PageElementType;
    isEnabled(opts?: Workflo.ITimeoutReverse): PageElementType;
    isSelected(opts?: Workflo.ITimeoutReverse): PageElementType;
    isChecked(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasText(text: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasAnyText(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    containsText(text: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasHTML(html: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasAnyHTML(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    containsHTML(html: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasDirectText(directText: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasAnyDirectText(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    containsDirectText(directText: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasAttribute(attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasAnyAttribute(attributeName: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    containsAttribute(attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasClass(className: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasAnyClass(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    containsClass(className: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasId(id: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasAnyId(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    containsId(id: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasName(name: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasAnyName(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    containsName(name: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasLocation(coordinates: Workflo.ICoordinates, opts?: {
        tolerances?: Partial<Workflo.ICoordinates>;
    } & Workflo.ITimeoutReverseInterval): PageElementType;
    hasX(x: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutReverseInterval): PageElementType;
    hasY(y: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutReverseInterval): PageElementType;
    hasSize(size: Workflo.ISize, opts?: {
        tolerances?: Partial<Workflo.ISize>;
    } & Workflo.ITimeoutReverseInterval): PageElementType;
    hasWidth(width: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutReverseInterval): PageElementType;
    hasHeight(height: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutReverseInterval): PageElementType;
    untilElement(description: string, condition: (element: PageElementType) => boolean, { timeout, interval }?: Workflo.ITimeoutInterval): PageElementType;
    readonly not: {
        exists: (opts?: Workflo.ITimeout) => PageElementType;
        isVisible: (opts?: Workflo.ITimeout) => PageElementType;
        isEnabled: (opts?: Workflo.ITimeout) => PageElementType;
        isSelected: (opts?: Workflo.ITimeout) => PageElementType;
        isChecked: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasText: (text: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyText: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsText: (text: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasHTML: (html: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyHTML: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsHTML: (html: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyAttribute: (attributeName: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasClass: (className: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyClass: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsClass: (className: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasId: (id: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyId: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsId: (id: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasName: (name: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyName: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsName: (name: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
    };
}
export declare class PageElementEventually<Store extends PageElementStore, PageElementType extends PageElement<Store>> extends PageElementBaseEventually<Store, PageElementType> {
    exists(opts?: Workflo.ITimeout): boolean;
    isVisible(opts?: Workflo.ITimeout): boolean;
    isEnabled(opts?: Workflo.ITimeout): boolean;
    isSelected(opts?: Workflo.ITimeout): boolean;
    isChecked(opts?: Workflo.ITimeoutInterval): boolean;
    hasText(text: string, opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyText(opts?: Workflo.ITimeoutInterval): boolean;
    containsText(text: string, opts?: Workflo.ITimeoutInterval): boolean;
    hasHTML(html: string, opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyHTML(opts?: Workflo.ITimeoutInterval): boolean;
    containsHTML(html: string, opts?: Workflo.ITimeoutInterval): boolean;
    hasDirectText(directText: string, opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyDirectText(opts?: Workflo.ITimeoutInterval): boolean;
    containsDirectText(directText: string, opts?: Workflo.ITimeoutInterval): boolean;
    hasAttribute(attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyAttribute(attributeName: string, opts?: Workflo.ITimeoutInterval): boolean;
    containsAttribute(attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval): boolean;
    hasClass(className: string, opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyClass(opts?: Workflo.ITimeoutInterval): boolean;
    containsClass(className: string, opts?: Workflo.ITimeoutInterval): boolean;
    hasId(id: string, opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyId(opts?: Workflo.ITimeoutInterval): boolean;
    containsId(id: string, opts?: Workflo.ITimeoutInterval): boolean;
    hasName(name: string, opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyName(opts?: Workflo.ITimeoutInterval): boolean;
    containsName(name: string, opts?: Workflo.ITimeoutInterval): boolean;
    hasLocation(coordinates: Workflo.ICoordinates, opts?: {
        tolerances?: Partial<Workflo.ICoordinates>;
    } & Workflo.ITimeoutInterval): boolean;
    hasX(x: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutInterval): boolean;
    hasY(y: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutInterval): boolean;
    hasSize(size: Workflo.ISize, opts?: {
        tolerances?: Partial<Workflo.ISize>;
    } & Workflo.ITimeoutInterval): boolean;
    hasWidth(width: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutInterval): boolean;
    hasHeight(height: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutInterval): boolean;
    meetsCondition(condition: (element: PageElementType) => boolean, opts?: Workflo.ITimeoutInterval): boolean;
    readonly not: {
        exists: (opts?: Workflo.ITimeout) => boolean;
        isVisible: (opts?: Workflo.ITimeout) => boolean;
        isEnabled: (opts?: Workflo.ITimeout) => boolean;
        isSelected: (opts?: Workflo.ITimeout) => boolean;
        isChecked: (opts?: Workflo.ITimeoutInterval) => boolean;
        hasText: (text: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyText: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsText: (text: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasHTML: (html: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyHTML: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsHTML: (html: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyAttribute: (attributeName: string, opts?: Workflo.ITimeoutInterval) => boolean;
        containsAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => boolean;
        hasClass: (className: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyClass: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsClass: (className: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasId: (id: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyId: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsId: (id: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasName: (name: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyName: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsName: (name: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.ITimeoutInterval) => boolean;
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.ITimeoutInterval) => boolean;
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
    };
}
