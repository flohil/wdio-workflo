import { PageElementStore } from '../stores';
import { PageElementGroupWalker, IPageElementGroupWalkerOpts } from '../walkers';
export interface IPageElementGroupOpts<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, WalkerType extends PageElementGroupWalker<Store>, WalkerOptions extends IPageElementGroupWalkerOpts> {
    id: string;
    content: Content;
    walkerType: {
        new (options: WalkerOptions): WalkerType;
    };
    walkerOptions: WalkerOptions;
}
export declare class PageElementGroup<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, WalkerType extends PageElementGroupWalker<Store>, WalkerOptions extends IPageElementGroupWalkerOpts> implements Workflo.PageNode.INode {
    protected __id: string;
    protected __walker: WalkerType;
    readonly __content: Content;
    constructor({ id, content, walkerType, walkerOptions }: IPageElementGroupOpts<Store, Content, WalkerType, WalkerOptions>);
    __getNodeId(): string;
    Solve<ValueType, ResultType>(problem: Workflo.IProblem<ValueType, ResultType>, options?: Workflo.IWalkerOptions): Workflo.IRecObj<ResultType>;
}
