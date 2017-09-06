export interface IPageNodeOpts<Store extends Workflo.IPageElementStore> {
    store: Store;
}
export declare class PageNode<Store extends Workflo.IPageElementStore> {
    protected selector: string;
    protected store: Store;
    protected timeout: number;
    constructor(selector: string, {store}: IPageNodeOpts<Store>);
    __getNodeId(): string;
    getSelector(): string;
}
