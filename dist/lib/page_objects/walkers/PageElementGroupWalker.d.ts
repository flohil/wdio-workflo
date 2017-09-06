export interface IPageElementGroupWalkerOpts {
}
export declare class PageElementGroupWalker<Store extends Workflo.IPageElementStore> {
    constructor(options: IPageElementGroupWalkerOpts);
    walk<ValueType, ResultType>(problem: Workflo.IProblem<ValueType, ResultType>, content: Record<string, Workflo.PageNode.INode>, options?: Workflo.IWalkerOptions): Workflo.IRecObj<ResultType>;
    protected solveElement<ValueType, ResultType>(problem: Workflo.IProblem<ValueType, ResultType>, element: Workflo.PageNode.INode, value: ValueType, options: Workflo.IWalkerOptions): Workflo.ISolveResult<ResultType>;
    protected solveGroup<ValueType, ResultType>(problem: Workflo.IProblem<ValueType, ResultType>, group: Workflo.IPageElementGroup<Store, Record<string, Workflo.PageNode.INode>, this, IPageElementGroupWalkerOpts>, values: Record<string, ValueType>, options: Workflo.IWalkerOptions): Workflo.IRecObj<ResultType>;
    protected solveList<ValueType, ResultType>(problem: Workflo.IProblem<ValueType, ResultType>, list: Workflo.IPageElementList<Workflo.IPageElementStore, Workflo.IPageElement<Store>, Workflo.IPageElementOpts<Store>>, values: Record<string, ValueType>, options: Workflo.IWalkerOptions): Record<string, ResultType>;
    protected solveMap<ValueType, ResultType, K extends string>(problem: Workflo.IProblem<ValueType, ResultType>, map: Workflo.IPageElementMap<Workflo.IPageElementStore, K, Workflo.IPageElement<Store>, Workflo.IPageElementOpts<Store>>, values: Record<K, ValueType>, options: Workflo.IWalkerOptions): Record<K, ResultType>;
}
