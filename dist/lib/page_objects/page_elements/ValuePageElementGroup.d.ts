import { PageElementStore } from '../stores';
import { PageElementGroup, IPageElementGroupOpts, PageElementGroupCurrently, PageElementGroupEventually } from '.';
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
    readonly eventually: ValuePageElementGroupEventually<Store, Content, this>;
    constructor({ ...superOpts }: IValueGroupOpts<Content>);
    getValue(filter?: ExtractValue<Partial<Content>>): ExtractValue<Partial<Content>>;
    /**
     * Sets values after performing the initial wait on all nodes that implement the setValue method.
     * Nodes that do not implement the setValue method will be ignored.
     *
     * @param values
     */
    setValue(values: ExtractValue<Partial<Content>>): this;
    __compareValue<K extends string>(compareFunc: (node: Workflo.PageNode.IGetValueNode<any>, expected?: Content[K]) => boolean, expected?: ExtractValue<Partial<Content>>): boolean;
}
declare class ValuePageElementGroupCurrently<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends ValuePageElementGroup<Store, Content>> extends PageElementGroupCurrently<Store, Content, GroupType> {
    getValue(filter?: ExtractValue<Partial<Content>>): ExtractValue<Partial<Content>>;
    /**
     * Sets values immediately on all nodes that implement the setValue method.
     * Nodes that do not implement the setValue method will be ignored.
     *
     * @param values
     */
    setValue(values: ExtractValue<Partial<Content>>): GroupType;
    hasValue(value: ExtractValue<Partial<Content>>): boolean;
    hasAnyValue(): boolean;
    containsValue(value: ExtractValue<Partial<Content>>): boolean;
    not: {
        hasValue: (value: ExtractValue<Partial<Content>>) => boolean;
        hasAnyValue: () => boolean;
        containsValue: (value: ExtractValue<Partial<Content>>) => boolean;
        hasText: (text: import("./PageElementGroup").ExtractText<Partial<Content>>) => boolean;
        hasAnyText: () => boolean;
        containsText: (text: import("./PageElementGroup").ExtractText<Partial<Content>>) => boolean;
    };
}
declare class ValuePageElementGroupEventually<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends ValuePageElementGroup<Store, Content>> extends PageElementGroupEventually<Store, Content, GroupType> {
    hasValue(value: ExtractValue<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyValue(opts?: Workflo.IWDIOParamsOptional): boolean;
    containsValue(value: ExtractValue<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional): boolean;
    not: {
        hasValue: (value: ExtractValue<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsValue: (value: ExtractValue<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasText: (text: import("./PageElementGroup").ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsText: (text: import("./PageElementGroup").ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
    };
}
export {};
