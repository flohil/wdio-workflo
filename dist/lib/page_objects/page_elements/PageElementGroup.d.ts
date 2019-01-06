import { PageElementStore } from '../stores';
import { PageNodeCurrently, PageNode } from '.';
import { PageNodeEventually, PageNodeWait, IPageNodeOpts } from './PageNode';
export declare type ExtractText<Content extends {
    [key: string]: Workflo.PageNode.INode;
}> = Workflo.PageNode.ExtractText<Content>;
export declare type ExtractBoolean<Content extends {
    [key: string]: Workflo.PageNode.INode;
}> = Workflo.PageNode.ExtractBoolean<Content>;
declare type ElementNode<Content extends {
    [K in keyof Content]: Workflo.PageNode.INode;
}> = Workflo.PageNode.IElementNode<ExtractText<Content>, ExtractBoolean<Content>, Workflo.PageNode.IGroupFilterMask<Content>>;
export interface IPageElementGroupOpts<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}> extends IPageNodeOpts<Store> {
    content: Content;
}
export declare class PageElementGroup<Store extends PageElementStore, Content extends {
    [K in keyof Content]: Workflo.PageNode.INode;
}> extends PageNode<Store> implements ElementNode<Content> {
    protected _id: string;
    protected _$: Content;
    protected _lastDiff: Workflo.IDiff;
    readonly currently: PageElementGroupCurrently<Store, Content, this>;
    readonly wait: PageElementGroupWait<Store, Content, this>;
    readonly eventually: PageElementGroupEventually<Store, Content, this>;
    constructor(id: string, { store, timeout, interval, content }: IPageElementGroupOpts<Store, Content>);
    readonly $: Content;
    readonly __getLastDiff: Workflo.IDiff;
    toJSON(): Workflo.IElementJSON;
    __getNodeId(): string;
    /**
     * Returns texts of all group elements after performing an initial wait in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractText<Content>;
    getDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractText<Content>;
    getIsEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getHasText(text: ExtractText<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getHasAnyText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getContainsText(text: ExtractText<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getHasDirectText(directText: ExtractText<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getHasAnyDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getContainsDirectText(directText: ExtractText<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    protected _includedInFilter(value: any): boolean;
    eachGet<NodeInterface, ResultType extends Partial<Content>, FilterType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, getFunc: (args: {
        node: NodeInterface;
        filter?: FilterType[keyof FilterType];
    }) => any, filterMask?: FilterType): ResultType;
    eachCompare<NodeInterface, ExpectedType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>, ResultType extends Partial<Content> = Workflo.PageNode.ExtractBoolean<Content>>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, compareFunc: (args: {
        node: NodeInterface;
        expected?: ExpectedType[keyof ExpectedType];
        filter?: ExpectedType[keyof ExpectedType];
    }) => any, expected?: ExpectedType, isFilterMask?: boolean): ResultType;
    eachCheck<NodeInterface, ExpectedType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, checkFunc: (args: {
        node: NodeInterface;
        expected?: ExpectedType[keyof ExpectedType];
        filter?: ExpectedType[keyof ExpectedType];
    }) => boolean, expected?: ExpectedType, isFilterMask?: boolean): boolean;
    eachWait<NodeInterface, ExpectedType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, waitFunc: (args: {
        node: NodeInterface;
        expected?: ExpectedType[keyof ExpectedType];
        filter?: ExpectedType[keyof ExpectedType];
    }) => NodeInterface, expected?: ExpectedType, isFilterMask?: boolean): this;
    eachDo<NodeInterface, FilterType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, doFunc: (args: {
        node: NodeInterface;
        filter?: FilterType[keyof FilterType];
    }) => any, filterMask?: FilterType): this;
    eachSet<NodeInterface extends Workflo.PageNode.INode, ValuesType extends Partial<Content>>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, setFunc: (args: {
        node: NodeInterface;
        value?: ValuesType[keyof ValuesType];
    }) => NodeInterface, values: ValuesType): this;
}
export declare class PageElementGroupCurrently<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends PageElementGroup<Store, Content>> extends PageNodeCurrently<Store, GroupType> {
    getExists(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getIsVisible(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getIsEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getHasText(text: ExtractText<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getHasAnyText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getContainsText(text: ExtractText<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getHasDirectText(directText: ExtractText<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getHasAnyDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getContainsDirectText(directText: ExtractText<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    /**
     * Returns texts of all group elements immediatly in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractText<Content>;
    getDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractText<Content>;
    exists(filterMask?: Workflo.PageNode.GroupFilterMaskExists<Content>): boolean;
    isVisible(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    isEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    hasText(text: ExtractText<Content>): boolean;
    hasAnyText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    containsText(text: ExtractText<Content>): boolean;
    hasDirectText(directText: ExtractText<Content>): boolean;
    hasAnyDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    containsDirectText(directText: ExtractText<Content>): boolean;
    readonly not: {
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
export declare class PageElementGroupWait<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends PageElementGroup<Store, Content>> extends PageNodeWait<Store, GroupType> {
    exists(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMaskExists<Content>): GroupType;
    isVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>): GroupType;
    isEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>): GroupType;
    hasText(text: ExtractText<Content>, opts?: Workflo.ITimeoutInterval): GroupType;
    hasAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>): GroupType;
    containsText(text: ExtractText<Content>, opts?: Workflo.ITimeoutInterval): GroupType;
    hasDirectText(directText: ExtractText<Content>, opts?: Workflo.ITimeoutInterval): GroupType;
    hasAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>): GroupType;
    containsDirectText(directText: ExtractText<Content>, opts?: Workflo.ITimeoutInterval): GroupType;
    readonly not: {
        exists: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMaskExists<Content>) => GroupType;
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
        hasText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => GroupType;
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
        containsText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => GroupType;
        hasDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => GroupType;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
        containsDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => GroupType;
    };
}
export declare class PageElementGroupEventually<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends PageElementGroup<Store, Content>> extends PageNodeEventually<Store, GroupType> {
    exists(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMaskExists<Content>): boolean;
    isVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
    isEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
    hasText(text: ExtractText<Content>, opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
    containsText(text: ExtractText<Content>, opts?: Workflo.ITimeoutInterval): boolean;
    hasDirectText(directText: ExtractText<Content>, opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
    containsDirectText(directText: ExtractText<Content>, opts?: Workflo.ITimeoutInterval): boolean;
    readonly not: {
        exists: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMaskExists<Content>) => boolean;
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        hasText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        containsText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        containsDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => boolean;
    };
}
/**
 * Returns true if the passed node supports all functions defined in IElementNode.
 *
 * @param node a PageNode
 */
export declare function isIElementNode<Content extends {
    [K in keyof Content]: Workflo.PageNode.INode;
}>(node: Workflo.PageNode.INode | ElementNode<Content>): node is ElementNode<Content>;
export {};
