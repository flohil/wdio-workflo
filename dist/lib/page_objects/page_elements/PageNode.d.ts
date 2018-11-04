import { PageElementStore } from '../stores';
export interface IPageNodeOpts<Store extends PageElementStore> {
    store: Store;
}
export declare class PageNode<Store extends PageElementStore> implements Workflo.PageNode.INode {
    protected _selector: string;
    protected _store: Store;
    protected _timeout: number;
    constructor(_selector: string, { store }: IPageNodeOpts<Store>);
    __getNodeId(): string;
    toJSON(): Workflo.PageNode.IElementJSON;
    getSelector(): string;
    protected _eventually(func: () => void): boolean;
    protected _wait(func: () => void, errorMessage: string): this;
}
