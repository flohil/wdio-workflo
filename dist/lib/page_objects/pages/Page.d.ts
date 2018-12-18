import { PageElementStore } from '../stores';
export interface IPageArgs<Store extends PageElementStore> extends Workflo.IWDIOParamsInterval {
    elementStore: Store;
}
export declare abstract class Page<Store extends PageElementStore, IsOpenOpts = {}, IsClosedOpts = IsOpenOpts> {
    protected _elementStore: Store;
    protected _timeout: number;
    protected _interval: number;
    wait: PageWait<Store, this, IsOpenOpts, IsClosedOpts>;
    eventually: PageEventually<Store, this, IsOpenOpts, IsClosedOpts>;
    constructor(args: IPageArgs<Store>);
    getTimeout(): number;
    getInterval(): number;
    abstract isOpen(opts?: IsOpenOpts): boolean;
    abstract isClosed(opts?: IsClosedOpts): boolean;
}
declare class PageWait<Store extends PageElementStore, PageType extends Page<Store, IsOpenOpts, IsClosedOpts>, IsOpenOpts, IsClosedOpts> {
    protected _page: PageType;
    constructor(page: PageType);
    protected _wait(conditionFunc: () => boolean, conditionMessage: string, opts?: Workflo.IWDIOParamsInterval): PageType;
    isOpen(opts?: IsOpenOpts & Workflo.IWDIOParamsInterval): PageType;
    isClosed(opts?: IsClosedOpts & Workflo.IWDIOParamsInterval): PageType;
}
declare class PageEventually<Store extends PageElementStore, PageType extends Page<Store, IsOpenOpts, IsClosedOpts>, IsOpenOpts, IsClosedOpts> {
    protected _page: PageType;
    constructor(page: PageType);
    protected _eventually(conditionFunc: () => boolean, opts?: Workflo.IWDIOParamsInterval): boolean;
    isOpen(opts?: IsOpenOpts & Workflo.IWDIOParamsInterval): void;
    isClosed(opts?: IsClosedOpts & Workflo.IWDIOParamsInterval): void;
}
export {};
