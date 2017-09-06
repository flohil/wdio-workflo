import { PageElementStore } from '../stores';
export interface IPageNodeOpts<Store extends PageElementStore> {
    store: Store;
}
export declare class PageNode<Store extends PageElementStore> {
    protected selector: string;
    protected store: Store;
    protected timeout: number;
    constructor(selector: string, {store}: IPageNodeOpts<Store>);
    __getNodeId(): string;
    getSelector(): string;
}
