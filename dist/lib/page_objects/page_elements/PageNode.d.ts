import { PageElementStore } from '../stores';
export interface IPageNodeOpts<Store extends PageElementStore> {
    store: Store;
}
export declare class PageNode<Store extends PageElementStore> implements Workflo.PageNode.INode {
    protected _selector: string;
    protected _store: Store;
    protected _lastDiff: Workflo.PageNode.IDiff;
    readonly currently: PageNodeCurrently<Store, this>;
    readonly wait: PageNodeWait<Store, this>;
    readonly eventually: PageNodeEventually<Store, this>;
    constructor(_selector: string, { store }: IPageNodeOpts<Store>);
    __getNodeId(): string;
    __toJSON(): Workflo.PageNode.IElementJSON;
    readonly __lastDiff: Workflo.PageNode.IDiff;
    getSelector(): string;
}
export declare class PageNodeCurrently<Store extends PageElementStore, PageElementType extends PageNode<Store>> {
    protected readonly _node: PageElementType;
    constructor(node: PageElementType);
}
export declare class PageNodeWait<Store extends PageElementStore, PageElementType extends PageNode<Store>> {
    protected readonly _node: PageElementType;
    constructor(node: PageElementType);
}
export declare class PageNodeEventually<Store extends PageElementStore, PageElementType extends PageNode<Store>> {
    protected readonly _node: PageElementType;
    constructor(node: PageElementType);
}
