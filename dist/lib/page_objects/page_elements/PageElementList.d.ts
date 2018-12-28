/// <reference types="webdriverio" />
import { PageNode, IPageNodeOpts, PageElement, IPageElementOpts, PageElementGroup } from '.';
import { PageElementStore } from '../stores';
import { ListWhereBuilder } from '../builders';
import { PageNodeEventually, PageNodeWait, PageNodeCurrently } from './PageNode';
export declare type WdioElements = WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>;
export interface IPageElementListIdentifier<Store extends PageElementStore, PageElementType extends PageElement<Store>> {
    mappingObject: {
        [key: string]: string;
    };
    func: (element: PageElementType) => string;
}
export interface IPageElementListWaitEmptyReverseParams extends Workflo.IWDIOParamsInterval {
    reverse?: boolean;
}
export interface IPageElementListWaitLengthParams extends Workflo.IWDIOParamsInterval {
    comparator?: Workflo.Comparator;
}
export interface IPageElementListWaitLengthReverseParams extends IPageElementListWaitLengthParams {
    reverse?: boolean;
}
export interface IPageElementListOpts<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>> extends IPageNodeOpts<Store>, Workflo.IWDIOParamsInterval {
    elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    elementOptions: PageElementOptions;
    waitType?: Workflo.WaitType;
    disableCache?: boolean;
    identifier?: IPageElementListIdentifier<Store, PageElementType>;
}
export declare class PageElementList<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>> extends PageNode<Store> implements Workflo.PageNode.IElementNode<string[], boolean[], boolean> {
    protected selector: string;
    protected _$: Store;
    protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    protected _elementOptions: PageElementOptions;
    protected _waitType: Workflo.WaitType;
    protected _interval: number;
    protected _disableCache: boolean;
    protected _identifier: IPageElementListIdentifier<Store, PageElementType>;
    protected _identifiedObjCache: {
        [key: string]: {
            [key: string]: PageElementType;
        };
    };
    protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOptions, this>;
    readonly currently: PageElementListCurrently<Store, PageElementType, PageElementOptions, this>;
    readonly wait: PageElementListWait<Store, PageElementType, PageElementOptions, this>;
    readonly eventually: PageElementListEventually<Store, PageElementType, PageElementOptions, this>;
    constructor(selector: string, opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>);
    /**
     * Use this method to initialize properties that rely on the this type
     * which is not available in the constructor.
     *
     * Make sure that this method is invoked immediatly after construction.
     *
     * @param cloneFunc
     */
    init(cloneFunc: (selector: Workflo.XPath) => this): void;
    initialWait(): void;
    readonly $: Workflo.Omit<Store, Workflo.FilteredKeysByReturnType<Store, PageElementGroup<any, any>>>;
    readonly elements: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>;
    readonly where: ListWhereBuilder<Store, PageElementType, PageElementOptions, this>;
    /**
     * Returns the first page element found in the DOM that matches the list selector.
     */
    readonly first: PageElementType;
    /**
     * @param index starts at 0
     */
    at(index: number): PageElementType;
    /**
     * Returns all page elements found in the DOM that match the list selector after initial wait.
     */
    readonly all: PageElementType[];
    setIdentifier(identifier: IPageElementListIdentifier<Store, PageElementType>): this;
    /**
     * Returns an object consisting of this._identifier.object's keys
     * as keys and the elements mapped by this._identifier.func()
     * as values.
     *
     * If this.identifier is undefined, the mapped object's keys will be defined
     * by the index of an element's occurence in the element list (first element -> 0, seconed element -> 1...)
     *
     * If cached option is set to true, returns cached identified elements object
     * if it exists and otherwise fetches new identified elements object.
     * Per default, returns a cached version of this identifier was already
     * used unless resetCache is set to true.
     * This means that the returned structure of the list may reflect an earlier state,
     * while its contents are still guaranteed to be refreshed on each access!
     *
     * Attention: this may take a long time, try to avoid: if only single elements of list
     * are needed, use get() or where instead.
     **/
    identify({ identifier, resetCache }?: {
        identifier?: IPageElementListIdentifier<Store, PageElementType>;
        resetCache?: boolean;
    }): {
        [key: string]: PageElementType;
    };
    getSelector(): string;
    getInterval(): number;
    getLength(): number;
    getText(filterMask?: Workflo.PageNode.ListFilterMask): string[];
    getDirectText(filterMask?: Workflo.PageNode.ListFilterMask): string[];
    getIsEnabled(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    getHasText(text: string | string[]): boolean[];
    getHasAnyText(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    getContainsText(text: string | string[]): boolean[];
    getHasDirectText(directText: string | string[]): boolean[];
    getHasAnyDirectText(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    getContainsDirectText(directText: string | string[]): boolean[];
    protected _includedInFilter(filter: any): boolean;
    eachCompare<T>(elements: PageElementType[], checkFunc: (element: PageElementType, expected?: T) => boolean, expected?: T | T[], isFilterMask?: boolean): boolean[];
    /**
     * If the list is empty (no elements could be located matching the list selector),
     * this function will always return true.
     *
     * @param elements
     * @param checkFunc
     * @param expected
     */
    eachCheck<T>(elements: PageElementType[], checkFunc: (element: PageElementType, expected?: T) => boolean, expected?: T | T[], isFilterMask?: boolean): boolean;
    eachGet<T>(elements: PageElementType[], getFunc: (element: PageElementType) => T, filterMask?: Workflo.PageNode.ListFilterMask): T[];
    /**
     * Uses default interval and default timeout of each element contained in this list.
     *
     * @param elements
     * @param waitFunc
     * @param expected
     */
    eachWait<T>(elements: PageElementType[], waitFunc: (element: PageElementType, expected?: T) => PageElementType, expected?: T | T[], isFilterMask?: boolean): this;
    eachDo(elements: PageElementType[], doFunc: (element: PageElementType) => PageElementType, filterMask?: Workflo.PageNode.ListFilterMask): this;
    eachSet<T>(elements: PageElementType[], setFunc: (element: PageElementType, value: T) => PageElementType, values?: T | T[]): this;
}
export declare class PageElementListCurrently<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> extends PageNodeCurrently<Store, ListType> {
    protected readonly _node: ListType;
    protected _selector: string;
    protected _store: Store;
    protected _elementOptions: PageElementOptions;
    protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOptions, ListType>;
    constructor(node: ListType, opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>);
    /**
     * Use this method to initialize properties that rely on the this type
     * which is not available in the constructor.
     *
     * Make sure that this method is invoked immediatly after construction.
     *
     * @param cloneFunc
     */
    init(cloneFunc: (selector: Workflo.XPath) => ListType): void;
    readonly elements: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>;
    readonly where: ListWhereBuilder<Store, PageElementType, PageElementOptions, ListType>;
    /**
     * Returns the first page element found in the DOM that matches the list selector.
     */
    readonly first: PageElementType;
    /**
     * @param index starts at 0
     */
    at(index: number): PageElementType;
    /**
     * Returns all page elements found in the DOM that match the list selector after initial wait.
     */
    readonly all: PageElementType[];
    getLength(): number;
    getText(filterMask?: Workflo.PageNode.ListFilterMask): string[];
    getDirectText(filterMask?: Workflo.PageNode.ListFilterMask): string[];
    getExists(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    getIsVisible(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    getIsEnabled(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    getHasText(text: string | string[]): boolean[];
    getHasAnyText(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    getContainsText(text: string | string[]): boolean[];
    getHasDirectText(directText: string | string[]): boolean[];
    getHasAnyDirectText(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    getContainsDirectText(directText: string | string[]): boolean[];
    isEmpty(): boolean;
    hasLength(length: number, comparator?: Workflo.Comparator): boolean;
    exists(filterMask?: boolean): boolean;
    isVisible(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    isEnabled(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    hasText(text: string | string[]): boolean;
    hasAnyText(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    containsText(text: string | string[]): boolean;
    hasDirectText(directText: string | string[]): boolean;
    hasAnyDirectText(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    containsDirectText(directText: string | string[]): boolean;
    readonly not: {
        isEmpty: () => boolean;
        hasLength: (length: number, comparator?: Workflo.Comparator) => boolean;
        exists: (filterMask?: boolean) => boolean;
        isVisible: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        isEnabled: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        hasText: (text: string | string[]) => boolean;
        hasAnyText: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        containsText: (text: string | string[]) => boolean;
        hasDirectText: (directText: string | string[]) => boolean;
        hasAnyDirectText: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        containsDirectText: (directText: string | string[]) => boolean;
    };
}
export declare class PageElementListWait<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> extends PageNodeWait<Store, ListType> {
    hasLength(length: number, { timeout, comparator, interval, reverse }?: IPageElementListWaitLengthReverseParams): ListType;
    isEmpty({ timeout, interval, reverse }?: IPageElementListWaitEmptyReverseParams): ListType;
    readonly any: PageElementType["wait"];
    readonly none: PageElementType['wait']['not'];
    exists(opts?: Workflo.IWDIOParams & {
        filterMask?: boolean;
    }): ListType;
    isVisible(opts?: Workflo.IWDIOParams & Workflo.PageNode.IListFilterMask): ListType;
    isEnabled(opts?: Workflo.IWDIOParams & Workflo.PageNode.IListFilterMask): ListType;
    hasText(text: string | string[], opts?: Workflo.IWDIOParamsInterval): ListType;
    hasAnyText(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask): ListType;
    containsText(text: string | string[], opts?: Workflo.IWDIOParamsInterval): ListType;
    hasDirectText(directText: string | string[], opts?: Workflo.IWDIOParamsInterval): ListType;
    hasAnyDirectText(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask): ListType;
    containsDirectText(directText: string | string[], opts?: Workflo.IWDIOParamsInterval): ListType;
    readonly not: {
        isEmpty: (opts?: Workflo.IWDIOParamsInterval) => ListType;
        hasLength: (length: number, opts?: IPageElementListWaitLengthParams) => ListType;
        exists: (opts?: Workflo.IWDIOParams & {
            filterMask?: boolean;
        }) => ListType;
        isVisible: (opts?: Workflo.IWDIOParams & Workflo.PageNode.IListFilterMask) => ListType;
        isEnabled: (opts?: Workflo.IWDIOParams & Workflo.PageNode.IListFilterMask) => ListType;
        hasText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => ListType;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask) => ListType;
        containsText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => ListType;
        hasDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => ListType;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask) => ListType;
        containsDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => ListType;
    };
}
export declare class PageElementListEventually<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> extends PageNodeEventually<Store, ListType> {
    readonly any: PageElementType["eventually"];
    readonly none: PageElementType['eventually']['not'];
    hasLength(length: number, { timeout, comparator, interval, reverse }?: IPageElementListWaitLengthReverseParams): boolean;
    isEmpty({ timeout, interval, reverse }?: IPageElementListWaitEmptyReverseParams): boolean;
    exists(opts?: Workflo.IWDIOParams & {
        filterMask?: boolean;
    }): boolean;
    isVisible(opts?: Workflo.IWDIOParams & Workflo.PageNode.IListFilterMask): boolean;
    isEnabled(opts?: Workflo.IWDIOParams & Workflo.PageNode.IListFilterMask): boolean;
    hasText(text: string | string[], opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyText(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask): boolean;
    containsText(text: string | string[], opts?: Workflo.IWDIOParamsInterval): boolean;
    hasDirectText(directText: string | string[], opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyDirectText(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask): boolean;
    containsDirectText(directText: string | string[], opts?: Workflo.IWDIOParamsInterval): boolean;
    readonly not: {
        isEmpty: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasLength: (length: number, opts?: IPageElementListWaitLengthParams) => boolean;
        exists: (opts?: Workflo.IWDIOParams & {
            filterMask?: boolean;
        }) => boolean;
        isVisible: (opts?: Workflo.IWDIOParams & Workflo.PageNode.IListFilterMask) => boolean;
        isEnabled: (opts?: Workflo.IWDIOParams & Workflo.PageNode.IListFilterMask) => boolean;
        hasText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask) => boolean;
        containsText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask) => boolean;
        containsDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => boolean;
    };
}
