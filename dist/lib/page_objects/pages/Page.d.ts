import { PageElementStore } from '../stores';
export interface IPageArgs<Store extends PageElementStore> extends Workflo.IWDIOParamsInterval {
    elementStore: Store;
}
export declare abstract class Page<Store extends PageElementStore, IsOpenOpts = {}> {
    protected _elementStore: Store;
    protected _timeout: number;
    protected _interval: number;
    constructor(args: IPageArgs<Store>);
    getTimeout(): number;
    getInterval(): number;
    abstract isOpen(opts?: IsOpenOpts): boolean;
    waitIsOpen(opts?: IsOpenOpts & Workflo.IWDIOParamsInterval): void;
    eventuallyIsOpen(opts?: IsOpenOpts & Workflo.IWDIOParamsInterval): boolean;
    protected _handleWaitError(error: any, timeout: number): void;
}
