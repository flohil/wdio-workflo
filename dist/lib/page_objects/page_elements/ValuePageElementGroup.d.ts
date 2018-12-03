import { PageElementStore } from '../stores';
import { PageElementGroup, IPageElementGroupOpts, PageElementGroupCurrently } from '.';
declare type ExtractValue<T extends {
    [key: string]: Workflo.PageNode.INode;
}> = {
    [P in keyof T]: T[P] extends Workflo.PageNode.IGetValueNode<any> ? ReturnType<T[P]['getValue']> : undefined;
};
export interface IValueGroupOpts<Content extends {
    [key: string]: Workflo.PageNode.INode;
}> extends IPageElementGroupOpts<Content> {
}
export declare class ValuePageElementGroup<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}> extends PageElementGroup<Store, Content> implements Workflo.PageNode.IGetValueNode<ExtractValue<Partial<Content>>>, Workflo.PageNode.ISetValueNode<ExtractValue<Partial<Content>>> {
    readonly currently: ValuePageElementGroupCurrently<Store, Content, this>;
    constructor({ ...superOpts }: IValueGroupOpts<Content>);
    getValue(filter?: ExtractValue<Partial<Content>>): ExtractValue<Partial<Content>>;
    /**
     * Sets values after performing the initial wait on all nodes that implement the setValue method.
     * Nodes that do not implement the setValue method will be ignored.
     *
     * @param values
     */
    setValue(values: ExtractValue<Partial<Content>>): this;
}
declare class ValuePageElementGroupCurrently<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends PageElementGroup<Store, Content>> extends PageElementGroupCurrently<Store, Content, GroupType> implements Workflo.PageNode.IGetValue<ExtractValue<Partial<Content>>>, Workflo.PageNode.ISetValueWithContext<ExtractValue<Partial<Content>>, GroupType> {
    getValue(filter?: ExtractValue<Partial<Content>>): ExtractValue<Partial<Content>>;
    /**
     * Sets values immediately on all nodes that implement the setValue method.
     * Nodes that do not implement the setValue method will be ignored.
     *
     * @param values
     */
    setValue(values: ExtractValue<Partial<Content>>): GroupType;
}
export {};
