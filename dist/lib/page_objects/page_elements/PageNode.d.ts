import { PageElementStore } from '../stores';
export interface IPageNodeOpts<Store extends PageElementStore> {
    store: Store;
}
export declare class PageNode<Store extends PageElementStore> implements Workflo.PageNode.INode {
    protected selector: string;
    protected store: Store;
    protected timeout: number;
    constructor(selector: string, {store}: IPageNodeOpts<Store>);
    __getNodeId(): string;
    toJSON(): Workflo.PageNode.ElementJSON;
    getSelector(): string;
    protected _eventually(func: () => void): boolean;
}
