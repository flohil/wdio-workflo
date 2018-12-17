import { PageElementStore } from '../stores';
export interface IPageArgs<Store extends PageElementStore> {
    elementStore: Store;
    timeout?: number;
}
export declare abstract class Page<Store extends PageElementStore> {
    protected elementStore: Store;
    protected timeout: number;
    constructor(args: IPageArgs<Store>);
    abstract isOpen(): boolean;
    eventuallyIsOpen(timeout?: number): boolean;
}
