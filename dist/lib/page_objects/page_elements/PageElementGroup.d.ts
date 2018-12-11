import { PageElementStore } from '../stores';
import { PageNodeCurrently, PageNode } from '.';
import { PageNodeEventually, PageNodeWait } from './PageNode';
export declare type ExtractText<T extends {
    [key: string]: Workflo.PageNode.INode;
}> = {
    [P in keyof T]?: T[P] extends Workflo.PageNode.IElementNode<any> ? ReturnType<T[P]['getText']> : undefined;
};
export declare type ExtractBoolean<T extends {
    [key: string]: Workflo.PageNode.INode;
}> = {
    [P in keyof T]?: T[P] extends Workflo.PageNode.IElementNode<any> ? ReturnType<T[P]['currently']['isVisible']> : undefined;
};
export interface IPageElementGroupOpts<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}> {
    store: Store;
    content: Content;
}
export declare class PageElementGroup<Store extends PageElementStore, Content extends {
    [K in keyof Content]: Workflo.PageNode.INode;
}> extends PageNode<Store> implements Workflo.PageNode.IElementNode<ExtractText<Content>> {
    protected _id: string;
    protected _$: Content;
    protected _lastDiff: Workflo.IDiff;
    readonly currently: PageElementGroupCurrently<Store, Content, this>;
    readonly wait: PageElementGroupWait<Store, Content, this>;
    readonly eventually: PageElementGroupEventually<Store, Content, this>;
    constructor(id: string, { store, content }: IPageElementGroupOpts<Store, Content>);
    readonly $: Content;
    readonly __getLastDiff: Workflo.IDiff;
    __toJSON(): Workflo.IElementJSON;
    __getNodeId(): string;
    /**
     * Returns texts of all group elements after performing an initial wait in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getText(filterMask?: ExtractText<Content>): ExtractText<Content>;
    getDirectText(filterMask?: ExtractText<Content>): ExtractText<Content>;
    eachGet<NodeInterface, ResultType extends Partial<Content>>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, filterMask: ResultType, getFunc: (node: NodeInterface) => any): ResultType;
    eachCheck<NodeInterface, ResultType extends Partial<Content>>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, expected: ResultType, checkFunc: (node: NodeInterface, expected?: ResultType[keyof ResultType]) => boolean): boolean;
    eachWait<NodeInterface, ResultType extends Partial<Content>>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, expected: ResultType, waitFunc: (node: NodeInterface, expected?: ResultType[keyof ResultType]) => NodeInterface): this;
    eachDo<NodeInterface, ResultType extends Partial<Content>>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, filterMask: ResultType, doFunc: (node: NodeInterface) => NodeInterface): this;
    eachSet<NodeInterface extends Workflo.PageNode.INode, ValuesType extends Partial<Content>, ReturnType extends this>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, values: ValuesType, setFunc: (node: NodeInterface, expected?: ValuesType[keyof ValuesType]) => NodeInterface): this;
}
export declare class PageElementGroupCurrently<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends PageElementGroup<Store, Content>> extends PageNodeCurrently<Store, GroupType> implements Workflo.PageNode.IGetElement<ExtractText<Content>> {
    /**
     * Returns texts of all group elements immediatly in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getText(filterMask?: ExtractText<Content>): ExtractText<Content>;
    getDirectText(filterMask?: ExtractText<Content>): ExtractText<Content>;
    isVisible(filterMask?: ExtractBoolean<Content>): boolean;
    isEnabled(filterMask?: ExtractBoolean<Content>): boolean;
    hasText(text: ExtractText<Content>): boolean;
    hasAnyText(filterMask?: ExtractText<Content>): boolean;
    containsText(text: ExtractText<Content>): boolean;
    hasDirectText(directText: ExtractText<Content>): boolean;
    hasAnyDirectText(filterMask?: ExtractText<Content>): boolean;
    containsDirectText(directText: ExtractText<Content>): boolean;
    not: {
        isVisible: (filterMask?: ExtractBoolean<Content>) => boolean;
        isEnabled: (filterMask?: ExtractBoolean<Content>) => boolean;
        hasText: (text: ExtractText<Content>) => boolean;
        hasAnyText: (filterMask?: ExtractText<Content>) => boolean;
        containsText: (text: ExtractText<Content>) => boolean;
        hasDirectText: (directText: ExtractText<Content>) => boolean;
        hasAnyDirectText: (filterMask?: ExtractText<Content>) => boolean;
        containsDirectText: (directText: ExtractText<Content>) => boolean;
    };
}
export declare class PageElementGroupWait<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends PageElementGroup<Store, Content>> extends PageNodeWait<Store, GroupType> {
    isVisible(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: ExtractBoolean<Content>;
    }): GroupType;
    isEnabled(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: ExtractBoolean<Content>;
    }): GroupType;
    hasText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional): GroupType;
    hasAnyText(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: ExtractText<Content>;
    }): GroupType;
    containsText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional): GroupType;
    hasDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional): GroupType;
    hasAnyDirectText(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: ExtractText<Content>;
    }): GroupType;
    containsDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional): GroupType;
    not: {
        isVisible: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: ExtractBoolean<Content>;
        }) => GroupType;
        isEnabled: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: ExtractBoolean<Content>;
        }) => GroupType;
        hasText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) => GroupType;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: ExtractText<Content>;
        }) => GroupType;
        containsText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) => GroupType;
        hasDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) => GroupType;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: ExtractText<Content>;
        }) => GroupType;
        containsDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) => GroupType;
    };
}
export declare class PageElementGroupEventually<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends PageElementGroup<Store, Content>> extends PageNodeEventually<Store, GroupType> {
    isVisible(text: ExtractBoolean<Content>): boolean;
    isEnabled(filterMask?: ExtractBoolean<Content>): boolean;
    hasText(text: ExtractText<Content>): boolean;
    hasAnyText(filterMask?: ExtractText<Content>): boolean;
    containsText(text: ExtractText<Content>): boolean;
    hasDirectText(directText: ExtractText<Content>): boolean;
    hasAnyDirectText(filterMask?: ExtractText<Content>): boolean;
    containsDirectText(directText: ExtractText<Content>): boolean;
    not: {
        isVisible: (text: ExtractBoolean<Content>) => boolean;
        isEnabled: (filterMask?: ExtractBoolean<Content>) => boolean;
        hasText: (text: ExtractText<Content>) => boolean;
        hasAnyText: (filterMask?: ExtractText<Content>) => boolean;
        containsText: (text: ExtractText<Content>) => boolean;
        hasDirectText: (directText: ExtractText<Content>) => boolean;
        hasAnyDirectText: (filterMask?: ExtractText<Content>) => boolean;
        containsDirectText: (directText: ExtractText<Content>) => boolean;
    };
}
