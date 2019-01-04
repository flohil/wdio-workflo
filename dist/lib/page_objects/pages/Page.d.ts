import { PageElementStore } from '../stores';
/**
 * Defines the opts parameter passed to the constructor of Page.
 */
export interface IPageOpts<Store extends PageElementStore> extends Workflo.ITimeoutInterval {
    /**
     * An instance of PageElementStore which can be used to retrieve/create PageNodes via Page
     */
    store: Store;
}
/**
 * This class is supposed to be used as base class for all Pages.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes via Page
 * @template IsOpenOpts type of the opts parameter passed to the functions `isOpen`, `wait.isOpen` and
 * `eventually.isOpen`
 * @template IsClosedOpts type of the opts parameter passed to the functions `isClosed`, `wait.isClosed` and
 * `eventually.isClosed`
 */
export declare abstract class Page<Store extends PageElementStore, IsOpenOpts = {}, IsClosedOpts = IsOpenOpts> {
    protected _store: Store;
    protected _timeout: number;
    protected _interval: number;
    wait: PageWait<Store, this, IsOpenOpts, IsClosedOpts>;
    eventually: PageEventually<Store, this, IsOpenOpts, IsClosedOpts>;
    constructor(opts: IPageOpts<Store>);
    getStore(): Store;
    getTimeout(): number;
    getInterval(): number;
    abstract isOpen(opts?: IsOpenOpts): boolean;
    abstract isClosed(opts?: IsClosedOpts): boolean;
}
declare class PageWait<Store extends PageElementStore, PageType extends Page<Store, IsOpenOpts, IsClosedOpts>, IsOpenOpts, IsClosedOpts> {
    protected _page: PageType;
    constructor(page: PageType);
    protected _wait(conditionFunc: () => boolean, conditionMessage: string, opts?: Workflo.ITimeoutInterval): PageType;
    isOpen(opts?: IsOpenOpts & Workflo.ITimeoutInterval): PageType;
    isClosed(opts?: IsClosedOpts & Workflo.ITimeoutInterval): PageType;
}
declare class PageEventually<Store extends PageElementStore, PageType extends Page<Store, IsOpenOpts, IsClosedOpts>, IsOpenOpts, IsClosedOpts> {
    protected _page: PageType;
    constructor(page: PageType);
    protected _eventually(conditionFunc: () => boolean, opts?: Workflo.ITimeoutInterval): boolean;
    isOpen(opts?: IsOpenOpts & Workflo.ITimeoutInterval): boolean;
    isClosed(opts?: IsClosedOpts & Workflo.ITimeoutInterval): boolean;
}
export {};
