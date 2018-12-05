import { PageElementStore } from '../stores';
export interface IPageNodeOpts<Store extends PageElementStore> {
    store: Store;
}
export declare class PageNode<Store extends PageElementStore> implements Workflo.PageNode.INode {
    protected _selector: string;
    protected _store: Store;
    protected _lastDiff: Workflo.PageNode.IDiff;
    constructor(_selector: string, { store }: IPageNodeOpts<Store>);
    __getNodeId(): string;
    __toJSON(): Workflo.PageNode.IElementJSON;
    readonly __lastDiff: Workflo.PageNode.IDiff;
    getSelector(): string;
}
