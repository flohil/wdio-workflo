/// <reference types="webdriverio" />
import { PageNode, IPageNodeOpts } from './';
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
    until: (description: string, condition: (element: PageElement<Store>) => boolean, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>;
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
    does: (description: string, condition: (element: PageElement<Store>) => boolean, opts?: Workflo.WDIOParamsOptional) => boolean;
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
    protected selector: string;
    protected waitType: Workflo.WaitType;
    protected timeout: number;
    protected _$: Store;
    protected customScroll: Workflo.ScrollParams;
    constructor(selector: string, {waitType, timeout, customScroll, ...superOpts}: IPageElementOpts<Store>);
    readonly $: Store;
    /**
     *
     */
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
    getAttribute(attrName: any): WebdriverIO.Client<string> & WebdriverIO.Client<null> & string;
    getClass(): WebdriverIO.Client<string> & WebdriverIO.Client<null> & string;
    getId(): WebdriverIO.Client<string> & WebdriverIO.Client<null> & string;
    getName(): WebdriverIO.Client<string> & WebdriverIO.Client<null> & string;
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
    private _waitExists({timeout}?);
    private _waitNotExists({timeout}?);
    private _waitIsVisible({timeout}?);
    private _waitNotIsVisible({timeout}?);
    private _waitHasClass(className, {timeout}?);
    private _waitNotHasClass(className, {timeout}?);
    private _waitContainsClass(className, {timeout}?);
    private _waitNotContainsClass(className, {timeout}?);
    private _waitHasText(text, {timeout}?);
    private _waitNotHasText(text, {timeout}?);
    private _waitHasAnyText({timeout}?);
    private _waitNotHasAnyText({timeout}?);
    private _waitContainsText(text, {timeout}?);
    private _waitNotContainsText(text, {timeout}?);
    private _waitHasValue(value, {timeout}?);
    private _waitNotHasValue(value, {timeout}?);
    private _waitHasAnyValue({timeout}?);
    private _waitNotHasAnyValue({timeout}?);
    private _waitContainsValue(value, {timeout}?);
    private _waitNotContainsValue(value, {timeout}?);
    private _waitIsEnabled({timeout}?);
    private _waitNotIsEnabled({timeout}?);
    private _waitIsSelected({timeout}?);
    private _waitNotIsSelected({timeout}?);
    private _waitUntil(description, condition, {timeout}?);
    wait: IPageElementWaitAPI<Store>;
    private _eventuallyExists({timeout}?);
    private _eventuallyNotExists({timeout}?);
    private _eventuallyIsVisible({timeout}?);
    private _eventuallyNotIsVisible({timeout}?);
    private _eventuallyHasClass(className, {timeout}?);
    private _eventuallyNotHasClass(className, {timeout}?);
    private _eventuallyContainsClass(className, {timeout}?);
    private _eventuallyNotContainsClass(className, {timeout}?);
    private _eventuallyHasText(text, {timeout}?);
    private _eventuallyNotHasText(text, {timeout}?);
    private _eventuallyHasAnyText({timeout}?);
    private _eventuallyNotHasAnyText({timeout}?);
    private _eventuallyContainsText(text, {timeout}?);
    private _eventuallyNotContainsText(text, {timeout}?);
    private _eventuallyHasValue(value, {timeout}?);
    private _eventuallyNotHasValue(value, {timeout}?);
    private _eventuallyHasAnyValue({timeout}?);
    private _eventuallyNotHasAnyValue({timeout}?);
    private _eventuallyContainsValue(value, {timeout}?);
    private _eventuallyNotContainsValue(value, {timeout}?);
    private _eventuallyIsEnabled({timeout}?);
    private _eventuallyNotIsEnabled({timeout}?);
    private _eventuallyIsSelected({timeout}?);
    private _eventuallyNotIsSelected({timeout}?);
    private _eventuallyDoes(description, condition, {timeout}?);
    eventually: IPageElementEventuallyAPI<Store>;
}
