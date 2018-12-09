import { PageElementStore } from '../stores';
import { PageElementGroup, IPageElementGroupOpts, PageElementGroupCurrently, PageElementGroupEventually, PageElementGroupWait } from '.';
declare type ExtractGetValue<T extends {
    [key: string]: Workflo.PageNode.INode;
}> = {
    [P in keyof T]?: T[P] extends Workflo.PageNode.IGetValueElementNode<any> ? ReturnType<T[P]['getValue']> : undefined;
};
declare type ExtractSetValue<T extends {
    [key: string]: Workflo.PageNode.INode;
}> = {
    [P in keyof T]?: T[P] extends Workflo.PageNode.ISetValueElementNode<any> ? ReturnType<T[P]['setValue']> : undefined;
};
export interface IValueGroupOpts<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}> extends IPageElementGroupOpts<Store, Content> {
}
export declare class ValuePageElementGroup<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}> extends PageElementGroup<Store, Content> implements Workflo.PageNode.IGetValueElementNode<ExtractGetValue<Content>>, Workflo.PageNode.ISetValueElementNode<ExtractSetValue<Content>> {
    readonly currently: ValuePageElementGroupCurrently<Store, Content, this>;
    readonly wait: ValuePageElementGroupWait<Store, Content, this>;
    readonly eventually: ValuePageElementGroupEventually<Store, Content, this>;
    constructor(id: string, { ...superOpts }: IValueGroupOpts<Store, Content>);
    getValue(filterMask?: ExtractGetValue<Content>): ExtractGetValue<Content>;
    /**
     * Sets values after performing the initial wait on all nodes that implement the setValue method.
     * Nodes that do not implement the setValue method will be ignored.
     *
     * @param values
     */
    setValue(values: ExtractSetValue<Content>): this;
}
declare class ValuePageElementGroupCurrently<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends ValuePageElementGroup<Store, Content>> extends PageElementGroupCurrently<Store, Content, GroupType> {
    getValue(filterMask?: ExtractGetValue<Content>): ExtractGetValue<Content>;
    /**
     * Sets values immediately on all nodes that implement the setValue method.
     * Nodes that do not implement the setValue method will be ignored.
     *
     * @param values
     */
    setValue(values: ExtractSetValue<Content>): GroupType;
    hasValue(value: ExtractGetValue<Content>): boolean;
    hasAnyValue(filterMask?: ExtractGetValue<Content>): boolean;
    containsValue(value: ExtractGetValue<Content>): boolean;
    not: {
        hasValue: (value: ExtractGetValue<Content>) => boolean;
        hasAnyValue: (filterMask?: ExtractGetValue<Content>) => boolean;
        containsValue: (value: ExtractGetValue<Content>) => boolean;
        isVisible: (filterMask?: import("./PageElementGroup").ExtractBoolean<Content>) => boolean;
        isEnabled: (filterMask?: import("./PageElementGroup").ExtractBoolean<Content>) => boolean;
        hasText: (text: import("./PageElementGroup").ExtractText<Content>) => boolean;
        hasAnyText: (filterMask?: import("./PageElementGroup").ExtractText<Content>) => boolean;
        containsText: (text: import("./PageElementGroup").ExtractText<Content>) => boolean;
        hasDirectText: (directText: import("./PageElementGroup").ExtractText<Content>) => boolean;
        hasAnyDirectText: (filterMask?: import("./PageElementGroup").ExtractText<Content>) => boolean;
        containsDirectText: (directText: import("./PageElementGroup").ExtractText<Content>) => boolean;
    };
}
declare class ValuePageElementGroupWait<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends ValuePageElementGroup<Store, Content>> extends PageElementGroupWait<Store, Content, GroupType> {
    hasValue(value: ExtractGetValue<Content>, opts?: Workflo.IWDIOParamsOptional): GroupType;
    hasAnyValue(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: ExtractGetValue<Content>;
    }): GroupType;
    containsValue(value: ExtractGetValue<Content>, opts?: Workflo.IWDIOParamsOptional): GroupType;
    not: {
        hasValue: (value: ExtractGetValue<Content>, opts?: Workflo.IWDIOParamsOptional) => GroupType;
        hasAnyValue: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: ExtractGetValue<Content>;
        }) => GroupType;
        containsValue: (value: ExtractGetValue<Content>, opts?: Workflo.IWDIOParamsOptional) => GroupType;
        isVisible: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: import("./PageElementGroup").ExtractBoolean<Content>;
        }) => GroupType;
        isEnabled: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: import("./PageElementGroup").ExtractBoolean<Content>;
        }) => GroupType;
        hasText: (text: import("./PageElementGroup").ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) => GroupType;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: import("./PageElementGroup").ExtractText<Content>;
        }) => GroupType;
        containsText: (text: import("./PageElementGroup").ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) => GroupType;
        hasDirectText: (directText: import("./PageElementGroup").ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) => GroupType;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: import("./PageElementGroup").ExtractText<Content>;
        }) => GroupType;
        containsDirectText: (directText: import("./PageElementGroup").ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) => GroupType;
    };
}
declare class ValuePageElementGroupEventually<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends ValuePageElementGroup<Store, Content>> extends PageElementGroupEventually<Store, Content, GroupType> {
    hasValue(value: ExtractGetValue<Content>, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyValue(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: ExtractGetValue<Content>;
    }): boolean;
    containsValue(value: ExtractGetValue<Content>, opts?: Workflo.IWDIOParamsOptional): boolean;
    not: {
        hasValue: (value: ExtractGetValue<Content>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyValue: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: ExtractGetValue<Content>;
        }) => boolean;
        containsValue: (value: ExtractGetValue<Content>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        isVisible: (text: import("./PageElementGroup").ExtractBoolean<Content>) => boolean;
        isEnabled: (filterMask?: import("./PageElementGroup").ExtractBoolean<Content>) => boolean;
        hasText: (text: import("./PageElementGroup").ExtractText<Content>) => boolean;
        hasAnyText: (filterMask?: import("./PageElementGroup").ExtractText<Content>) => boolean;
        containsText: (text: import("./PageElementGroup").ExtractText<Content>) => boolean;
        hasDirectText: (directText: import("./PageElementGroup").ExtractText<Content>) => boolean;
        hasAnyDirectText: (filterMask?: import("./PageElementGroup").ExtractText<Content>) => boolean;
        containsDirectText: (directText: import("./PageElementGroup").ExtractText<Content>) => boolean;
    };
}
export {};
