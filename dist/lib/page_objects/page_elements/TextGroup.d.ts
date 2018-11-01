import { PageElementGroup, IPageElementGroupOpts } from './';
import { PageElementGroupWalker, IPageElementGroupWalkerOpts } from '../walkers';
import { PageElementStore } from '../stores';
export interface ITextGroupOpts<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, WalkerType extends PageElementGroupWalker<Store>, WalkerOptions extends IPageElementGroupWalkerOpts> extends IPageElementGroupOpts<Store, Content, WalkerType, WalkerOptions> {
}
export declare class TextGroup<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, WalkerType extends PageElementGroupWalker<Store>, WalkerOptions extends IPageElementGroupWalkerOpts> extends PageElementGroup<Store, Content, WalkerType, WalkerOptions> {
    constructor({ ...superOpts }: ITextGroupOpts<Store, Content, WalkerType, WalkerOptions>);
    /**
     * If using filter, only those element text will be returned which are defined and truthy in filter.
     *
     * @param param0
     */
    GetText({ filter, options }?: {
        filter?: Workflo.IRecObj<boolean>;
        options?: Workflo.IWalkerOptions;
    }): Workflo.IRecObj<string>;
}
