/// <reference types="webdriverio" />
import { PageNode, IPageNodeOpts } from './';
import { PageElementStore } from '../stores';
export interface IPageElementOpts<Store extends PageElementStore> extends IPageNodeOpts<Store> {
    wait?: Workflo.WaitType;
    timeout?: number;
    customScroll?: Workflo.ScrollParams;
}
export declare class PageElement<Store extends PageElementStore> extends PageNode<Store> implements Workflo.PageNode.IGetText, Workflo.PageNode.INode {
    protected selector: string;
    protected wait: Workflo.WaitType;
    protected timeout: number;
    protected _$: Store;
    protected customScroll: Workflo.ScrollParams;
    constructor(selector: string, { wait, timeout, customScroll, ...superOpts }: IPageElementOpts<Store>);
    readonly $: Store;
    /**
     *
     */
    readonly _element: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element>> & WebdriverIO.RawResult<WebdriverIO.Element>;
    readonly element: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element>> & WebdriverIO.RawResult<WebdriverIO.Element>;
    initialWait(): void;
    exists(): boolean;
    notExists(): boolean;
    isVisible(): boolean;
    isHidden(): boolean;
    hasText(text?: string): boolean;
    containsText(text?: string): boolean;
    hasValue(value?: string): boolean;
    containsValue(value?: string): boolean;
    isEnabled(): boolean;
    isSelected(): boolean;
    eventuallyExists({ reverse, timeout }?: Workflo.WDIOParams): boolean;
    eventuallyNotExists({ timeout }?: Workflo.WDIOParams): boolean;
    eventuallyIsVisible({ reverse, timeout }?: Workflo.WDIOParams): boolean;
    eventuallyIsHidden({ reverse, timeout }?: Workflo.WDIOParams): boolean;
    eventuallyHasText({ reverse, timeout, text }?: Workflo.WDIOParams & {
        text?: string;
    }): boolean;
    eventuallyContainsText({ reverse, timeout, text }?: Workflo.WDIOParams & {
        text?: string;
    }): boolean;
    eventuallyHasValue({ reverse, timeout, value }?: Workflo.WDIOParams & {
        value?: string;
    }): boolean;
    eventuallyIsEnabled({ reverse, timeout }: Workflo.WDIOParams): boolean;
    eventuallyIsSelected({ reverse, timeout }: Workflo.WDIOParams): boolean;
    waitExist({ timeout, reverse }?: Workflo.WDIOParams): this;
    waitNotExists({ timeout }?: Workflo.WDIOParams): this;
    waitVisible({ timeout, reverse }?: Workflo.WDIOParams): this;
    waitHidden({ timeout, reverse }?: Workflo.WDIOParams): this;
    waitText({ reverse, timeout, text }?: Workflo.WDIOParams & {
        text?: string;
    }): this;
    waitContainsText({ reverse, timeout, text }?: Workflo.WDIOParams & {
        text?: string;
    }): this;
    waitValue({ reverse, timeout, value }?: Workflo.WDIOParams & {
        value?: string;
    }): this;
    waitContainsValue({ reverse, timeout, value }?: Workflo.WDIOParams & {
        value?: string;
    }): this;
    waitEnabled({ reverse, timeout }?: Workflo.WDIOParams): this;
    waitSelected({ reverse, timeout }?: Workflo.WDIOParams): this;
    getAllHTML(): WebdriverIO.Client<string> & string;
    getText(): WebdriverIO.Client<string> & string;
    getDirectText(): string;
    getAttribute(attrName: any): WebdriverIO.Client<string> & WebdriverIO.Client<null> & string;
    getId(): WebdriverIO.Client<string> & WebdriverIO.Client<null> & string;
    getName(): WebdriverIO.Client<string> & WebdriverIO.Client<null> & string;
    getLocation(axis: WebdriverIO.Axis): WebdriverIO.Client<number> & number;
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
}
