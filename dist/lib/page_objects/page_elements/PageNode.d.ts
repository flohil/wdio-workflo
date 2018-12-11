import { PageElementStore } from '../stores';
export interface IPageNodeOpts<Store extends PageElementStore> {
    store: Store;
}
export declare class PageNode<Store extends PageElementStore> implements Workflo.PageNode.INode {
    protected _selector: string;
    protected _store: Store;
    protected _lastDiff: Workflo.IDiff;
    readonly currently: PageNodeCurrently<Store, this>;
    readonly wait: PageNodeWait<Store, this>;
    readonly eventually: PageNodeEventually<Store, this>;
    constructor(_selector: string, { store }: IPageNodeOpts<Store>);
    __getNodeId(): string;
    __toJSON(): Workflo.IElementJSON;
    readonly __lastDiff: Workflo.IDiff;
    __setLastDiff(diff: Workflo.IDiff): void;
    getSelector(): string;
}
export declare class PageNodeCurrently<Store extends PageElementStore, PageElementType extends PageNode<Store>> {
    protected readonly _node: PageElementType;
    constructor(node: PageElementType);
}
export declare class PageNodeWait<Store extends PageElementStore, PageElementType extends PageNode<Store>> {
    protected readonly _node: PageElementType;
    constructor(node: PageElementType);
    protected _wait(func: () => boolean, errorMessage: string, timeout: number): PageElementType;
    protected _waitUntil(waitFunc: () => boolean, errorMessageFunc: () => string, timeout: number): PageElementType;
}
export declare class PageNodeEventually<Store extends PageElementStore, PageElementType extends PageNode<Store>> {
    protected readonly _node: PageElementType;
    constructor(node: PageElementType);
}
