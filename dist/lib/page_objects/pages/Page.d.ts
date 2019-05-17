import { PageNodeStore } from '../stores';
/**
 * Defines the opts parameter passed to the constructor of Page.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes via Page
 */
export interface IPageOpts<Store extends PageNodeStore> extends Workflo.ITimeoutInterval {
    /**
     * an instance of PageNodeStore which can be used to retrieve/create PageNodes via Page
     */
    store: Store;
}
/**
 * This class serves as the base class for all Pages.
 *
 * It provides the functions `isOpen` and `isClosed` to check if the page currently is open or closed.
 * `Page` also features a `wait` API to wait for the page to be open or closed and an `eventually` API to check
 * if the page eventually is open or closed.
 *
 * Contrary to `PageNode`, `Page` does not have an initial waiting condition.
 * Therefore, `Page` has no `currently` API (unlike `PageElement`) because all functions defined directly on `Page`
 * (and not on its `wait` or `eventually` APIs) always describe the current state of the page.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes via Page
 * @template IsOpenOpts type of the opts parameter passed to the functions `isOpen`, `wait.isOpen` and
 * `eventually.isOpen`
 * @template IsClosedOpts type of the opts parameter passed to the functions `isClosed`, `wait.isClosed` and
 * `eventually.isClosed`
 */
export declare abstract class Page<Store extends PageNodeStore, IsOpenOpts extends object = object, IsClosedOpts extends object = IsOpenOpts> implements Workflo.IPage<Store, IsOpenOpts, IsClosedOpts> {
    /**
     * an instance of PageNodeStore which can be used to retrieve/create PageNodes via Page
     */
    protected _store: Store;
    /**
     * the default timeout in milliseconds used by Page for its `wait` and `eventually` functions.
     */
    protected _timeout: number;
    /**
     * the default interval in milliseconds used by Page for its `wait` and `eventually` functions.
     */
    protected _interval: number;
    /**
     * Stores the last timeout used by Page's `wait` and `eventually` functions.
     *
     * Intended for framework-internal usage only.
     */
    protected _lastTimeout: number;
    wait: PageWait<Store, this, IsOpenOpts, IsClosedOpts>;
    eventually: PageEventually<Store, this, IsOpenOpts, IsClosedOpts>;
    /**
     * Page serves as the base class for all Pages.
     *
     * @param opts the options required to create an instance of Page
     */
    constructor(opts: IPageOpts<Store>);
    readonly __lastTimeout: number;
    __setLastTimeout(timeout: number): void;
    getStore(): Store;
    getTimeout(): number;
    getInterval(): number;
    toJSON(): Workflo.IPageJSON;
    abstract isOpen(opts?: IsOpenOpts): boolean;
    abstract isClosed(opts?: IsClosedOpts): boolean;
}
/**
 * This class defines all `wait` functions of a Page.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes via Page
 * @template PageType type of the Page for which PageWait defines all `wait` functions
 * @template IsOpenOpts type of the opts parameter passed to the function `isOpen`
 * @template IsClosedOpts type of the opts parameter passed to the function `isClosed`
 */
export declare class PageWait<Store extends PageNodeStore, PageType extends Page<Store, IsOpenOpts, IsClosedOpts>, IsOpenOpts extends object, IsClosedOpts extends object> {
    /**
     * the Page for which PageWait defines all `wait` functions
     */
    protected _page: PageType;
    /**
     * PageWait defines all `wait` functions of Page.
     *
     * @param page the Page for which PageWait defines all `wait` functions
     */
    constructor(page: PageType);
    /**
     * A function which provides common functionality to wait for a certain conditionFunc to return true
     * within a specific timeout.
     *
     * @param conditionFunc the condition which is expected to return true within a specific timeout
     * @param conditionMessage a message used to describe the checked condition in error messages
     * @param opts includes the `timeout` within which the condition is expected to return true and
     * the `interval` used to check for this condition.
     *
     * If no `timeout` is specified, the Page's default timeout is used instead.
     * If no `interval` is specified, the Page's default interval is used instead.
     */
    protected _wait(conditionFunc: () => boolean, conditionMessage: string, opts?: Workflo.ITimeoutInterval): PageType;
    /**
     * Waits for Page to become open and throws an error of the Page does not become open within a specific timeout.
     *
     * @param opts includes the options defined in `IsOpenOpts`, the `timeout` within which the Page must become open and
     * the `interval` used to check for this condition.
     *
     * If no `timeout` is specified, the Page's default timeout is used instead.
     * If no `interval` is specified, the Page's default interval is used instead.
     *
     * @returns Page
     */
    isOpen(opts?: IsOpenOpts & Workflo.ITimeoutInterval): PageType;
    /**
     * Waits for Page to become closed and throws an error of the Page does not become closed within a specific timeout.
     *
     * @param opts includes the options defined in `IsClosedOpts`, the `timeout` within which the Page must become closed
     * and the `interval` used to check for this condition.
     *
     * If no `timeout` is specified, the Page's default timeout is used instead.
     * If no `interval` is specified, the Page's default interval is used instead.
     *
     * @returns Page
     */
    isClosed(opts?: IsClosedOpts & Workflo.ITimeoutInterval): PageType;
}
/**
 * This class defines all `eventually` functions of a Page.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes via Page
 * @template PageType type of the Page for which PageEventually defines all `eventually` functions
 * @template IsOpenOpts type of the opts parameter passed to the function `isOpen`
 * @template IsClosedOpts type of the opts parameter passed to the functions `isClosed`
 */
export declare class PageEventually<Store extends PageNodeStore, PageType extends Page<Store, IsOpenOpts, IsClosedOpts>, IsOpenOpts extends object, IsClosedOpts extends object> {
    /**
     * the Page for which PageEventually defines all `eventually` functions
     */
    protected _page: PageType;
    /**
     * PageEventually defines all `eventually` functions of Page.
     *
     * @param page the Page for which PageEventually defines all `eventually` functions
     */
    constructor(page: PageType);
    /**
     * A function which provides common functionality to check if certain conditionFunc eventually returns true
     * within a specific timeout.
     *
     * @param conditionFunc the condition which is expected to return true within a specific timeout
     * @param opts includes the `timeout` within which the condition is expected to return true and
     * the `interval` used to check for this condition.
     *
     * If no `timeout` is specified, the Page's default timeout is used instead.
     * If no `interval` is specified, the Page's default interval is used instead.
     */
    protected _eventually(conditionFunc: () => boolean, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if Page eventually becomes open within a specific timeout.
     *
     * @param opts includes the options defined in `IsOpenOpts`, the `timeout` within which the Page must become open and
     * the `interval` used to check for this condition.
     *
     * If no `timeout` is specified, the Page's default timeout is used instead.
     * If no `interval` is specified, the Page's default interval is used instead.
     */
    isOpen(opts?: IsOpenOpts & Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if Page eventually becomes closed within a specific timeout.
     *
     * @param opts includes the options defined in `IsClosedOpts`, the `timeout` within which the Page must become closed
     * and the `interval` used to check for this condition.
     *
     * If no `timeout` is specified, the Page's default timeout is used instead.
     * If no `interval` is specified, the Page's default interval is used instead.
     */
    isClosed(opts?: IsClosedOpts & Workflo.ITimeoutInterval): boolean;
}
