import { PageElementGroup, IPageElementGroupOpts } from './';
export interface ITextGroupOpts<Store extends Workflo.IPageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, WalkerType extends Workflo.IPageElementGroupWalker<Store>, WalkerOptions extends Workflo.IPageElementGroupWalkerOpts> extends IPageElementGroupOpts<Store, Content, WalkerType, WalkerOptions> {
}
export declare class TextGroup<Store extends Workflo.IPageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, WalkerType extends Workflo.IPageElementGroupWalker<Store>, WalkerOptions extends Workflo.IPageElementGroupWalkerOpts> extends PageElementGroup<Store, Content, WalkerType, WalkerOptions> {
    constructor({...superOpts}: ITextGroupOpts<Store, Content, WalkerType, WalkerOptions>);
    GetText({filter, options}?: {
        filter?: Workflo.IRecObj<boolean>;
        options?: Workflo.IWalkerOptions;
    }): Workflo.IRecObj<string>;
}
