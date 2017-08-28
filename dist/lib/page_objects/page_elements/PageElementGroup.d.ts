export interface IPageElementGroupOpts<Store extends Workflo.IPageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, WalkerType extends Workflo.IPageElementGroupWalker<Store>, WalkerOptions extends Workflo.IPageElementGroupWalkerOpts> {
    id: string;
    content: Content;
    walkerType: {
        new (options: WalkerOptions): WalkerType;
    };
    walkerOptions: WalkerOptions;
}
export declare class PageElementGroup<Store extends Workflo.IPageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, WalkerType extends Workflo.IPageElementGroupWalker<Store>, WalkerOptions extends Workflo.IPageElementGroupWalkerOpts> implements Workflo.PageNode.INode {
    protected __id: string;
    protected __walker: WalkerType;
    protected __content: Content;
    constructor({id, content, walkerType, walkerOptions}: IPageElementGroupOpts<Store, Content, WalkerType, WalkerOptions>);
    __getNodeId(): string;
    Solve<ValueType, ResultType>(problem: Workflo.IProblem<ValueType, ResultType>, options?: Workflo.IWalkerOptions): Workflo.IRecObj<ResultType>;
}
