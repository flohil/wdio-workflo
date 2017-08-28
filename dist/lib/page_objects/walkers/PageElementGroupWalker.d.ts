export interface IPageElementGroupWalkerOpts {
}
export declare class PageElementGroupWalker<Store extends Workflo.IPageElementStore> {
    constructor(options: IPageElementGroupWalkerOpts);
    walk<ValueType, ResultType>(problem: Workflo.IProblem<ValueType, ResultType>, content: {
        [key: string]: Workflo.PageNode.INode;
    }, options?: Workflo.IWalkerOptions): Workflo.IRecObj<ResultType>;
    protected solveElement<ValueType, ResultType>(problem: Workflo.IProblem<ValueType, ResultType>, element: Workflo.PageNode.INode, value: ValueType, options: Workflo.IWalkerOptions): Workflo.ISolveResult<ResultType>;
    protected solveGroup<ValueType, ResultType>(problem: Workflo.IProblem<ValueType, ResultType>, group: Workflo.IPageElementGroup<Store, {
        [key: string]: Workflo.PageNode.INode;
    }, this, IPageElementGroupWalkerOpts>, values: {
        [key: string]: ValueType;
    }, options: Workflo.IWalkerOptions): Workflo.IRecObj<ResultType>;
    protected solveList<ValueType, ResultType>(problem: Workflo.IProblem<ValueType, ResultType>, list: Workflo.IPageElementList<Workflo.IPageElementStore, Workflo.IPageElement<Store>, Workflo.IPageElementOpts<Store>>, values: {
        [key: string]: ValueType;
    }, options: Workflo.IWalkerOptions): {
        [key: string]: ResultType;
    };
}
