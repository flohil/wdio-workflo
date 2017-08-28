export interface IPageArgs<Store extends Workflo.IPageElementStore> {
    elementStore: Store;
}
export declare class Page<Store extends Workflo.IPageElementStore> {
    protected elementStore: Store;
    constructor(args: IPageArgs<Store>);
}
