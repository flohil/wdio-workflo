/// <reference types="webdriverio" />
import { PageNode, IPageNodeOpts, PageElement, IPageElementOpts } from '.';
import { PageElementStore } from '../stores';
import { ListWhereBuilder } from '../builders';
import { PageNodeEventually, PageNodeWait, PageNodeCurrently } from './PageNode';
/**
 * Describes the opts parameter passed to the PageElementList's `identify` function.
 *
 * By default, the PageElements mapped by PageElementList can only be accessed via their index of occurrence in the DOM.
 *
 * A list identifier allows for PageElements mapped by PageElementList to be accessed via the key names of a
 * `mappingObject`'s properties too. To do so, an "identification process" needs to be performed once which matches the
 * values of `mappingObject`'s properties to the return values of a `mappingFunc` that is executed on each managed
 * PageElement.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement managed by PageElementList
 */
export interface IPageElementListIdentifier<Store extends PageElementStore, PageElementType extends PageElement<Store>> {
    /**
     * An object whose keys are the names by which identified PageElements can be accessed
     * and whose values are used to identify these PageElements when invoking `mappingFunc`.
     */
    mappingObject: {
        [key: string]: string;
    };
    /**
     * A function which is executed on each PageElement mapped by PageElementList.
     *
     * The return value of this function is compared to the values of mappingObject's properties and if there is a match,
     * the PageElement can be accessed via the key of the matching property from now on.
     */
    mappingFunc: (element: PageElementType) => string;
}
/**
 * Describes the opts parameter passed to the `isEmpty` function of PageElementList's `wait` and `eventually` APIs.
 */
export interface IPageElementListWaitEmptyReverseParams extends Workflo.ITimeoutInterval {
    reverse?: boolean;
}
/**
 * Describes the opts parameter passed to the `hasLength` function of PageElementList's `wait.not` and `eventually.not`
 * APIs.
 */
export interface IPageElementListWaitLengthParams extends Workflo.ITimeoutInterval {
    comparator?: Workflo.Comparator;
}
/**
 * Describes the opts parameter passed to the `hasLength` function of PageElementList's `wait` and `eventually` APIs.
 */
export interface IPageElementListWaitLengthReverseParams extends IPageElementListWaitLengthParams {
    reverse?: boolean;
}
/**
 * Describes the opts parameter passed to the constructor function of PageElementList.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement managed by PageElementList
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the PageElements managed
 * by PageElementList
 */
export interface IPageElementListOpts<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOpts extends Partial<IPageElementOpts<Store>>> extends IPageNodeOpts<Store> {
    /**
     * This function retrieves a PageElement mapped by PageElementList from a PageElementStore.
     *
     * @param selector the XPath expression used to identify the retrieved PageElement in the DOM
     * @param opts the options used to configure the retrieved PageElement
     */
    elementStoreFunc: (selector: string, opts: PageElementOpts) => PageElementType;
    /**
     *
     */
    elementOpts: PageElementOpts;
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
    readonly $: Store;
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
    eachDo(doFunc: (element: PageElementType) => any, filterMask?: Workflo.PageNode.ListFilterMask): this;
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
    exists(opts?: Workflo.ITimeout & {
        filterMask?: boolean;
    }): ListType;
    isVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask): ListType;
    isEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask): ListType;
    hasText(text: string | string[], opts?: Workflo.ITimeoutInterval): ListType;
    hasAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask): ListType;
    containsText(text: string | string[], opts?: Workflo.ITimeoutInterval): ListType;
    hasDirectText(directText: string | string[], opts?: Workflo.ITimeoutInterval): ListType;
    hasAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask): ListType;
    containsDirectText(directText: string | string[], opts?: Workflo.ITimeoutInterval): ListType;
    readonly not: {
        isEmpty: (opts?: Workflo.ITimeoutInterval) => ListType;
        hasLength: (length: number, opts?: IPageElementListWaitLengthParams) => ListType;
        exists: (opts?: Workflo.ITimeout & {
            filterMask?: boolean;
        }) => ListType;
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask) => ListType;
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask) => ListType;
        hasText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => ListType;
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask) => ListType;
        containsText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => ListType;
        hasDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => ListType;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask) => ListType;
        containsDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => ListType;
    };
}
export declare class PageElementListEventually<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> extends PageNodeEventually<Store, ListType> {
    readonly any: PageElementType["eventually"];
    readonly none: PageElementType['eventually']['not'];
    hasLength(length: number, { timeout, comparator, interval, reverse }?: IPageElementListWaitLengthReverseParams): boolean;
    isEmpty({ timeout, interval, reverse }?: IPageElementListWaitEmptyReverseParams): boolean;
    exists(opts?: Workflo.ITimeout & {
        filterMask?: boolean;
    }): boolean;
    isVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask): boolean;
    isEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask): boolean;
    hasText(text: string | string[], opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask): boolean;
    containsText(text: string | string[], opts?: Workflo.ITimeoutInterval): boolean;
    hasDirectText(directText: string | string[], opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask): boolean;
    containsDirectText(directText: string | string[], opts?: Workflo.ITimeoutInterval): boolean;
    readonly not: {
        isEmpty: (opts?: Workflo.ITimeoutInterval) => boolean;
        hasLength: (length: number, opts?: IPageElementListWaitLengthParams) => boolean;
        exists: (opts?: Workflo.ITimeout & {
            filterMask?: boolean;
        }) => boolean;
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask) => boolean;
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask) => boolean;
        hasText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask) => boolean;
        containsText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => boolean;
        hasDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask) => boolean;
        containsDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => boolean;
    };
}
