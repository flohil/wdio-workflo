import { PageElementStore } from '../stores';
export interface IPageNodeOpts<Store extends PageElementStore> extends Workflo.IWDIOParams {
    store: Store;
}
export declare abstract class PageNode<Store extends PageElementStore> implements Workflo.PageNode.INode {
    protected _store: Store;
    protected _lastDiff: Workflo.IDiff;
    protected _selector: string;
    protected _timeout: number;
    abstract readonly currently: PageNodeCurrently<Store, this>;
    abstract readonly wait: PageNodeWait<Store, this>;
    abstract readonly eventually: PageNodeEventually<Store, this>;
    constructor(selector: string, opts: IPageNodeOpts<Store>);
    __getNodeId(): string;
    readonly __lastDiff: Workflo.IDiff;
    __setLastDiff(diff: Workflo.IDiff): void;
    getTimeout(): number;
    toJSON(): Workflo.IElementJSON;
    /**
     * Executes func and, if an error occurs during execution of func,
     * throws a custom error message that the page element could not be located on the page.
     * @param func
     */
    __execute<ResultType>(func: () => ResultType): ResultType;
    __eventually(func: () => void): boolean;
    __wait(func: () => boolean, errorMessage: string, timeout: number): this;
    __waitUntil(waitFunc: () => boolean, errorMessageFunc: () => string, timeout: number, interval?: number): this;
    protected _handleWaitError(error: any, errorMessage: string, timeout: number): void;
}
export declare abstract class PageNodeCurrently<Store extends PageElementStore, PageElementType extends PageNode<Store>> {
    protected readonly _node: PageElementType;
    constructor(node: PageElementType);
    abstract readonly not: {};
}
export declare abstract class PageNodeWait<Store extends PageElementStore, PageElementType extends PageNode<Store>> {
    protected readonly _node: PageElementType;
    constructor(node: PageElementType);
    abstract readonly not: {};
}
export declare abstract class PageNodeEventually<Store extends PageElementStore, PageElementType extends PageNode<Store>> {
    protected readonly _node: PageElementType;
    constructor(node: PageElementType);
    abstract readonly not: {};
}
