import { PageElementStore } from '../stores';
import { PageElementGroup, IPageElementGroupOpts, PageElementGroupCurrently, PageElementGroupEventually, PageElementGroupWait } from '.';
declare type ExtractValue<T extends {
    [key: string]: Workflo.PageNode.INode;
}> = Workflo.PageNode.ExtractValue<T>;
declare type ValueElementNode<Content extends {
    [K in keyof Content]: Workflo.PageNode.INode;
}> = Workflo.PageNode.IValueElementNode<ExtractValue<Content>, Workflo.PageNode.GroupFilterMask<Content>>;
export interface IValueGroupOpts<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}> extends IPageElementGroupOpts<Store, Content> {
}
export declare class ValuePageElementGroup<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}> extends PageElementGroup<Store, Content> implements ValueElementNode<Content> {
    readonly currently: ValuePageElementGroupCurrently<Store, Content, this>;
    readonly wait: ValuePageElementGroupWait<Store, Content, this>;
    readonly eventually: ValuePageElementGroupEventually<Store, Content, this>;
    constructor(id: string, { ...superOpts }: IValueGroupOpts<Store, Content>);
    getValue(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractValue<Content>;
    /**
     * Sets values after performing the initial wait on all nodes that implement the setValue method.
     * Nodes that do not implement the setValue method will be ignored.
     *
     * @param values
     */
    setValue(values: Workflo.StripNever<ExtractValue<Content>>): this;
}
declare class ValuePageElementGroupCurrently<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends ValuePageElementGroup<Store, Content>> extends PageElementGroupCurrently<Store, Content, GroupType> {
    getValue(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractValue<Content>;
    hasValue(value: ExtractValue<Content>): boolean;
    hasAnyValue(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    containsValue(value: ExtractValue<Content>): boolean;
    readonly not: {
        hasValue: (value: Workflo.PageNode.ExtractValue<Content>) => boolean;
        hasAnyValue: (filterMask?: Partial<Workflo.PageNode.ExtractBoolean<Content>>) => boolean;
        containsValue: (value: Workflo.PageNode.ExtractValue<Content>) => boolean;
        exists: (filterMask?: Partial<Workflo.PageNode.ExtractExistsFilterMask<Content>>) => boolean;
        isVisible: (filterMask?: Partial<Workflo.PageNode.ExtractBoolean<Content>>) => boolean;
        isEnabled: (filterMask?: Partial<Workflo.PageNode.ExtractBoolean<Content>>) => boolean;
        hasText: (text: Workflo.PageNode.ExtractText<Content>) => boolean;
        hasAnyText: (filterMask?: Partial<Workflo.PageNode.ExtractBoolean<Content>>) => boolean;
        containsText: (text: Workflo.PageNode.ExtractText<Content>) => boolean;
        hasDirectText: (directText: Workflo.PageNode.ExtractText<Content>) => boolean;
        hasAnyDirectText: (filterMask?: Partial<Workflo.PageNode.ExtractBoolean<Content>>) => boolean;
        containsDirectText: (directText: Workflo.PageNode.ExtractText<Content>) => boolean;
    };
}
declare class ValuePageElementGroupWait<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends ValuePageElementGroup<Store, Content>> extends PageElementGroupWait<Store, Content, GroupType> {
    hasValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval): GroupType;
    hasAnyValue(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content>): GroupType;
    containsValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval): GroupType;
    readonly not: {
        hasValue: (value: Workflo.PageNode.ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
        hasAnyValue: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
        containsValue: (value: Workflo.PageNode.ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
        exists: (opts?: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMaskExists<Content>) => GroupType;
        isVisible: (opts?: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
        isEnabled: (opts?: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
        hasText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
        containsText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
        hasDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
        containsDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
    };
}
declare class ValuePageElementGroupEventually<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends ValuePageElementGroup<Store, Content>> extends PageElementGroupEventually<Store, Content, GroupType> {
    hasValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyValue(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
    containsValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval): boolean;
    readonly not: {
        hasValue: (value: Workflo.PageNode.ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyValue: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        containsValue: (value: Workflo.PageNode.ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
        exists: (opts?: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMaskExists<Content>) => boolean;
        isVisible: (opts?: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        isEnabled: (opts?: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        hasText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        containsText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        containsDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
    };
}
export {};
