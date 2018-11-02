/// <reference types="webdriverio" />
import { PageNode, IPageNodeOpts } from '.';
import { PageElementStore } from '../stores';
export interface IPageElementOpts<Store extends PageElementStore> extends IPageNodeOpts<Store> {
    waitType?: Workflo.WaitType;
    timeout?: number;
    customScroll?: Workflo.ScrollParams;
}
export interface IPageElementWaitAPI<Store extends PageElementStore> {
    exists: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    isVisible: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    hasClass: (className: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    containsClass: (className: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    hasText: (text: string, opts: Workflo.WDIOParamsOptional) => PageElement<Store>;
    hasAnyText: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    containsText: (text: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    hasValue: (value: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    hasAnyValue: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    containsValue: (value: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    isEnabled: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    isSelected: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    untilElement: (description: string, condition: (element: PageElement<Store>) => boolean, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    not: IPageElementWaitNotAPI<Store>;
}
export interface IPageElementWaitNotAPI<Store extends PageElementStore> {
    exists: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    isVisible: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    hasClass: (className: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    containsClass: (className: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    hasText: (text: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    hasAnyText: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    containsText: (text: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    hasValue: (value: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    hasAnyValue: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    containsValue: (value: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    isEnabled: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
    isSelected: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
}
export interface IPageElementEventuallyAPI<Store extends PageElementStore> {
    exists: (opts?: Workflo.WDIOParamsOptional) => boolean;
    isVisible: (opts?: Workflo.WDIOParamsOptional) => boolean;
    hasClass: (className: string, opts?: Workflo.WDIOParamsOptional) => boolean;
    containsClass: (className: string, opts?: Workflo.WDIOParamsOptional) => boolean;
    hasText: (text: string, opts: Workflo.WDIOParamsOptional) => boolean;
    hasAnyText: (opts?: Workflo.WDIOParamsOptional) => boolean;
    containsText: (text: string, opts?: Workflo.WDIOParamsOptional) => boolean;
    hasValue: (value: string, opts?: Workflo.WDIOParamsOptional) => boolean;
    hasAnyValue: (opts?: Workflo.WDIOParamsOptional) => boolean;
    containsValue: (value: string, opts?: Workflo.WDIOParamsOptional) => boolean;
    isEnabled: (opts?: Workflo.WDIOParamsOptional) => boolean;
    isSelected: (opts?: Workflo.WDIOParamsOptional) => boolean;
    meetsCondition: (condition: (element: PageElement<Store>) => boolean, opts?: Workflo.WDIOParamsOptional) => boolean;
    not: IPageElementEventuallyNotAPI<Store>;
}
export interface IPageElementEventuallyNotAPI<Store extends PageElementStore> {
    exists: (opts?: Workflo.WDIOParamsOptional) => boolean;
    isVisible: (opts?: Workflo.WDIOParamsOptional) => boolean;
    hasClass: (className: string, opts?: Workflo.WDIOParamsOptional) => boolean;
    containsClass: (className: string, opts?: Workflo.WDIOParamsOptional) => boolean;
    hasText: (text: string, opts?: Workflo.WDIOParamsOptional) => boolean;
    hasAnyText: (opts?: Workflo.WDIOParamsOptional) => boolean;
    containsText: (text: string, opts?: Workflo.WDIOParamsOptional) => boolean;
    hasValue: (value: string, opts?: Workflo.WDIOParamsOptional) => boolean;
    hasAnyValue: (opts?: Workflo.WDIOParamsOptional) => boolean;
    containsValue: (value: string, opts?: Workflo.WDIOParamsOptional) => boolean;
    isEnabled: (opts?: Workflo.WDIOParamsOptional) => boolean;
    isSelected: (opts?: Workflo.WDIOParamsOptional) => boolean;
}
export declare class PageElement<Store extends PageElementStore> extends PageNode<Store> implements Workflo.PageNode.IGetText {
    protected _selector: string;
    protected waitType: Workflo.WaitType;
    protected timeout: number;
    protected _$: Store;
    protected customScroll: Workflo.ScrollParams;
    constructor(_selector: string, { waitType, timeout, customScroll, ...superOpts }: IPageElementOpts<Store>);
    readonly $: Store;
    readonly _element: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element>> & WebdriverIO.RawResult<WebdriverIO.Element>;
    readonly element: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element>> & WebdriverIO.RawResult<WebdriverIO.Element>;
    initialWait(): this;
    exists(): boolean;
    isVisible(): boolean;
    hasClass(className: string): boolean;
    containsClass(className: string): boolean;
    hasText(text: string): boolean;
    hasAnyText(): boolean;
    containsText(text: string): boolean;
    hasValue(value: string): boolean;
    hasAnyValue(): boolean;
    containsValue(value: string): boolean;
    isEnabled(): boolean;
    isSelected(): boolean;
    getAllHTML(): WebdriverIO.Client<string> & string;
    getText(): WebdriverIO.Client<string> & string;
    getDirectText(): string;
    getValue(): WebdriverIO.Client<string> & string;
    getAttribute(attrName: any): null;
    getClass(): null;
    getId(): null;
    getName(): null;
    getLocation(axis: WebdriverIO.Axis): WebdriverIO.Client<number> & number;
    getSize(): WebdriverIO.Client<WebdriverIO.Size> & WebdriverIO.Size;
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
        customScroll?: Workflo.ScrollParams;
    }): this;
    scrollTo(params: Workflo.ScrollParams): Workflo.ScrollResult;
    private _waitExists;
    private _waitNotExists;
    private _waitIsVisible;
    private _waitNotIsVisible;
    private _waitHasClass;
    private _waitNotHasClass;
    private _waitContainsClass;
    private _waitNotContainsClass;
    private _waitHasText;
    private _waitNotHasText;
    private _waitHasAnyText;
    private _waitNotHasAnyText;
    private _waitContainsText;
    private _waitNotContainsText;
    private _waitHasValue;
    private _waitNotHasValue;
    private _waitHasAnyValue;
    private _waitNotHasAnyValue;
    private _waitContainsValue;
    private _waitNotContainsValue;
    private _waitIsEnabled;
    private _waitNotIsEnabled;
    private _waitIsSelected;
    private _waitNotIsSelected;
    private _waitUntilElement;
    wait: IPageElementWaitAPI<Store>;
    private _eventuallyExists;
    private _eventuallyNotExists;
    private _eventuallyIsVisible;
    private _eventuallyNotIsVisible;
    private _eventuallyHasClass;
    private _eventuallyNotHasClass;
    private _eventuallyContainsClass;
    private _eventuallyNotContainsClass;
    private _eventuallyHasText;
    private _eventuallyNotHasText;
    private _eventuallyHasAnyText;
    private _eventuallyNotHasAnyText;
    private _eventuallyContainsText;
    private _eventuallyNotContainsText;
    private _eventuallyHasValue;
    private _eventuallyNotHasValue;
    private _eventuallyHasAnyValue;
    private _eventuallyNotHasAnyValue;
    private _eventuallyContainsValue;
    private _eventuallyNotContainsValue;
    private _eventuallyIsEnabled;
    private _eventuallyNotIsEnabled;
    private _eventuallyIsSelected;
    private _eventuallyNotIsSelected;
    private _eventuallyMeetsCondition;
    eventually: IPageElementEventuallyAPI<Store>;
}
