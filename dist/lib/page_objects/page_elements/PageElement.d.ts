/// <reference types="webdriverio" />
import { PageNode, IPageNodeOpts } from '.';
import { PageElementStore } from '../stores';
export declare type WdioElement = WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element>> & WebdriverIO.RawResult<WebdriverIO.Element>;
export interface IPageElementOpts<Store extends PageElementStore> extends IPageNodeOpts<Store> {
    waitType?: Workflo.WaitType;
    timeout?: number;
    customScroll?: Workflo.IScrollParams;
}
export interface ITolerance {
    lower: number;
    upper: number;
}
export interface IPageElementCommonWaitAPI<Store extends PageElementStore, OptionalParams, ReturnType> {
    exists: (opts?: OptionalParams) => ReturnType;
    isVisible: (opts?: OptionalParams) => ReturnType;
    isEnabled: (opts?: OptionalParams) => ReturnType;
    isSelected: (opts?: OptionalParams) => ReturnType;
    isChecked: (opts?: OptionalParams) => ReturnType;
    hasText: (text: string, opts?: OptionalParams) => ReturnType;
    hasAnyText: (opts?: OptionalParams) => ReturnType;
    containsText: (text: string, opts?: OptionalParams) => ReturnType;
    hasValue: (value: string, opts?: OptionalParams) => ReturnType;
    hasAnyValue: (opts?: OptionalParams) => ReturnType;
    containsValue: (value: string, opts?: OptionalParams) => ReturnType;
    hasHTML: (html: string, opts?: OptionalParams) => ReturnType;
    hasAnyHTML: (opts?: OptionalParams) => ReturnType;
    containsHTML: (html: string, opts?: OptionalParams) => ReturnType;
    hasDirectText: (directText: string, opts?: OptionalParams) => ReturnType;
    hasAnyDirectText: (opts?: OptionalParams) => ReturnType;
    containsDirectText: (directText: string, opts?: OptionalParams) => ReturnType;
    hasAttribute: (attributeName: string, attributeValue: string, opts?: OptionalParams) => ReturnType;
    hasAnyAttribute: (attributeName: string, opts?: OptionalParams) => ReturnType;
    containsAttribute: (attributeName: string, attributeValue: string, opts?: OptionalParams) => ReturnType;
    hasClass: (className: string, opts?: OptionalParams) => ReturnType;
    containsClass: (className: string, opts?: OptionalParams) => ReturnType;
    hasId: (id: string, opts?: OptionalParams) => ReturnType;
    hasAnyId: (opts?: OptionalParams) => ReturnType;
    containsId: (id: string, opts?: OptionalParams) => ReturnType;
    hasName: (name: string, opts?: OptionalParams) => ReturnType;
    hasAnyName: (opts?: OptionalParams) => ReturnType;
    containsName: (name: string, opts?: OptionalParams) => ReturnType;
    hasLocation: (coordinates: Partial<Workflo.ICoordinates>, opts?: {
        tolerances?: Partial<Workflo.ICoordinates>;
    } & OptionalParams) => ReturnType;
    hasX: (x: number, opts?: {
        tolerance?: number;
    } & OptionalParams) => ReturnType;
    hasY: (y: number, opts?: {
        tolerance?: number;
    } & OptionalParams) => ReturnType;
    hasSize: (size: Partial<Workflo.ISize>, opts?: {
        tolerances?: Partial<Workflo.ISize>;
    } & OptionalParams) => ReturnType;
    hasWidth: (width: number, opts?: {
        tolerance?: number;
    } & OptionalParams) => ReturnType;
    hasHeight: (height: number, opts?: {
        tolerance?: number;
    } & OptionalParams) => ReturnType;
}
export interface IPageElementCheckStateAPI<Store extends PageElementStore> {
    exists: () => boolean;
    isVisible: () => boolean;
    isEnabled: () => boolean;
    isSelected: () => boolean;
    isChecked: () => boolean;
    hasClass: (className: string) => boolean;
    containsClass: (className: string) => boolean;
    hasText: (text: string) => boolean;
    hasAnyText: () => boolean;
    containsText: (text: string) => boolean;
    hasValue: (value: string) => boolean;
    hasAnyValue: () => boolean;
    containsValue: (value: string) => boolean;
    hasHTML: (html: string) => boolean;
    hasAnyHTML: () => boolean;
    containsHTML: (html: string) => boolean;
    hasAttribute: (attributeName: string, attributeValue: string) => boolean;
    hasAnyAttribute: (attributeName: string) => boolean;
    containsAttribute: (attributeName: string, attributeValue: string) => boolean;
    hasId: (id: string) => boolean;
    hasAnyId: () => boolean;
    containsId: (id: string) => boolean;
    hasName: (name: string) => boolean;
    hasAnyName: () => boolean;
    containsName: (name: string) => boolean;
    hasDirectText: (directText: string) => boolean;
    hasAnyDirectText: () => boolean;
    containsDirectText: (directText: string) => boolean;
    hasLocation: (coordinates: Partial<Workflo.ICoordinates>, tolerances?: Partial<Workflo.ICoordinates>) => boolean;
    hasX: (x: number, tolerance?: number) => boolean;
    hasY: (y: number, tolerance?: number) => boolean;
    hasSize: (size: Partial<Workflo.ISize>, tolerances?: Partial<Workflo.ISize>) => boolean;
    hasWidth: (width: number, tolerance?: number) => boolean;
    hasHeight: (height: number, tolerance?: number) => boolean;
}
export interface IPageElementGetStateAPI<Store extends PageElementStore> {
    element: WdioElement;
    getHTML: () => string;
    getText: () => string;
    getDirectText: () => string;
    getValue: () => string;
    getAttribute: (attributeName: string) => string;
    getClass: () => string;
    getId: () => string;
    getName: () => string;
    getLocation: () => Workflo.ICoordinates;
    getX: () => number;
    getY: () => number;
    getSize: () => Workflo.ISize;
    getWidth: () => number;
    getHeight: () => number;
}
export interface IPageElementWaitAPI<Store extends PageElementStore> extends IPageElementCommonWaitAPI<Store, Workflo.IWDIOParamsOptionalReverse, PageElement<Store>> {
    untilElement: (description: string, condition: (element: PageElement<Store>) => boolean, opts?: Workflo.IWDIOParamsOptional) => PageElement<Store>;
    not: IPageElementWaitNotAPI<Store>;
}
export interface IPageElementWaitNotAPI<Store extends PageElementStore> extends IPageElementCommonWaitAPI<Store, Workflo.IWDIOParamsOptional, PageElement<Store>> {
}
export interface IPageElementEventuallyAPI<Store extends PageElementStore> extends IPageElementCommonWaitAPI<Store, Workflo.IWDIOParamsOptional, boolean> {
    meetsCondition: (condition: (element: PageElement<Store>) => boolean, opts?: Workflo.IWDIOParamsOptional) => boolean;
    not: IPageElementEventuallyNotAPI<Store>;
}
export interface IPageElementEventuallyNotAPI<Store extends PageElementStore> extends IPageElementCommonWaitAPI<Store, Workflo.IWDIOParamsOptional, boolean> {
}
export interface IPageElementCurrentlyAPI<Store extends PageElementStore> extends IPageElementCheckStateAPI<Store>, IPageElementGetStateAPI<Store> {
    lastActualResult: string;
    not: IPageElementCheckStateAPI<Store>;
}
export declare class PageElement<Store extends PageElementStore> extends PageNode<Store> implements Workflo.PageNode.IGetText, IPageElementGetStateAPI<Store> {
    protected _selector: string;
    protected _waitType: Workflo.WaitType;
    protected _timeout: number;
    protected _$: Store;
    protected _customScroll: Workflo.IScrollParams;
    readonly currently: IPageElementCurrentlyAPI<Store> & IPageElementGetStateAPI<Store>;
    constructor(_selector: string, { waitType, timeout, customScroll, ...superOpts }: IPageElementOpts<Store>);
    /**
     * Return WdioElement from current state, not performing an initial wait.
     */
    private readonly __element;
    /**
     * Return WdioElement after performing an initial wait.
     */
    readonly element: WdioElement;
    readonly $: Store;
    initialWait(): this;
    getHTML(): string;
    getText(): string;
    getDirectText(): string;
    getValue(): string;
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
    getTimeout(): number;
    setValue(value: string): void;
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
    scrollTo(params: Workflo.IScrollParams): Workflo.IScrollResult;
    private _waitWdioCheckFunc;
    private _waitProperty;
    private _waitWithinProperty;
    private _waitHasProperty;
    private _waitHasAnyProperty;
    private _waitContainsProperty;
    private _makeReverseParams;
    wait: IPageElementWaitAPI<Store>;
    eventually: IPageElementEventuallyAPI<Store>;
}
