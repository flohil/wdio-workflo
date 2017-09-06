import { PageElementStore } from '../stores';
export interface IPageArgs<Store extends PageElementStore> {
    elementStore: Store;
}
export declare class Page<Store extends PageElementStore> {
    protected elementStore: Store;
    constructor(args: IPageArgs<Store>);
}
