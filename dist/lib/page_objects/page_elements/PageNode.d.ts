export interface IPageNodeOpts<Store extends Workflo.IPageElementStore> {
    wait?: Workflo.WaitType;
    timeout?: number;
    store: Store;
}
export declare class PageNode<Store extends Workflo.IPageElementStore> {
    protected selector: string;
    protected store: Store;
    protected timeout: number;
    constructor(selector: string, {store, timeout}: IPageNodeOpts<Store>);
    __getNodeId(): string;
    getSelector(): string;
}
