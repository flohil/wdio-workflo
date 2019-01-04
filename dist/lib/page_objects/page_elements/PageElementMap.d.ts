import { PageNode, IPageNodeOpts, PageElement, IPageElementOpts, PageNodeEventually, PageNodeCurrently, PageNodeWait } from '.';
import { PageElementStore } from '../stores';
import { XPathBuilder } from '../builders';
/**
 * Provides caller with selector of the map and the value of mappingObject's current property.
 * Theses can be used to build the selector of a map's element generically to identify it.
 */
export interface IPageElementMapIdentifier<K extends string> {
    mappingObject: Record<K, string>;
    func: (mapSelector: string, mappingValue: string) => XPathBuilder | string;
}
export interface IPageElementMapOpts<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>> extends IPageNodeOpts<Store> {
    store: Store;
    identifier: IPageElementMapIdentifier<K>;
    elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    elementOptions: PageElementOptions;
}
export declare class PageElementMap<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>> extends PageNode<Store> implements Workflo.PageNode.IElementNode<Partial<Record<K, string>>, Partial<Record<K, boolean>>, Partial<Record<K, boolean>>> {
    protected _selector: string;
    protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    protected _elementOptions: PageElementOptions;
    protected _identifier: IPageElementMapIdentifier<K>;
    protected _$: Record<K, PageElementType>;
    protected _lastDiff: Workflo.IDiff;
    readonly currently: PageElementMapCurrently<Store, K, PageElementType, PageElementOptions, this>;
    readonly wait: PageElementMapWait<Store, K, PageElementType, PageElementOptions, this>;
    readonly eventually: PageElementMapEventually<Store, K, PageElementType, PageElementOptions, this>;
    constructor(_selector: string, { identifier, elementStoreFunc, elementOptions, ...superOpts }: IPageElementMapOpts<Store, K, PageElementType, PageElementOptions>);
    readonly $: Record<K, PageElementType>;
    /**
     * In case of language changes, for example, change values of mappingObject while keys must stay the same.
     * @param mappingObject
     */
    changeMappingObject(mappingObject: Record<K, string>): void;
    getSelector(): string;
    /**
    * Returns texts of all list elements after performing an initial wait in the order they were retrieved from the DOM.
    *
    * If passing filter, only values defined in this mask will be returned.
    * By default (if no filter is passed), all values will be returned.
    *
    * @param filter a filter mask
    */
    getText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, string>>;
    getDirectText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, string>>;
    getIsEnabled(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    getHasText(text: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    getHasAnyText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    getContainsText(text: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    getHasDirectText(directText: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    getHasAnyDirectText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    getContainsDirectText(directText: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    protected _includedInFilter(value: any): boolean;
    eachCompare<T>(context: Record<K, PageElementType>, checkFunc: (element: PageElementType, expected?: T) => boolean, expected: Partial<Record<K, T>>, isFilterMask?: boolean): Partial<Record<K, boolean>>;
    eachCheck<T>(context: Record<K, PageElementType>, checkFunc: (element: PageElementType, expected?: T) => boolean, expected: Partial<Record<K, T>>, isFilterMask?: boolean): boolean;
    /**
     * Helper function to map element content nodes to a value by calling a node interface function on each node.
     *
     * If passing filter mask, only values defined in this mask will be returned.
     * By default (if no filter mask is passed), all values will be returned.
     *
     * @param getFunc
     * @param filterMask a filter mask
     */
    eachGet<ResultType>(context: Record<K, PageElementType>, getFunc: (node: PageElementType) => ResultType, filterMask: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, ResultType>>;
    eachWait<ValueType>(context: Record<K, PageElementType>, waitFunc: (element: PageElementType, expected?: ValueType) => PageElementType, expected: Partial<Record<K, ValueType>>, isFilterMask?: boolean): this;
    eachDo(doFunc: (element: PageElementType) => any, filterMask?: Workflo.PageNode.MapFilterMask<K>): this;
    eachSet<ValueType>(context: Record<K, PageElementType>, setFunc: (element: PageElementType, value?: ValueType) => PageElementType, values: Partial<Record<K, ValueType>>): this;
}
export declare class PageElementMapCurrently<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, MapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>> extends PageNodeCurrently<Store, MapType> {
    /**
     * Returns texts of all list elements immediatly in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, string>>;
    getDirectText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, string>>;
    getExists(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    getIsVisible(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    getIsEnabled(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    getHasText(text: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    getHasAnyText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    getContainsText(text: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    getHasDirectText(directText: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    getHasAnyDirectText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    getContainsDirectText(directText: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    exists(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    isVisible(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    isEnabled(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    hasText(text: Partial<Record<K, string>>): boolean;
    hasAnyText(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    containsText(text: Partial<Record<K, string>>): boolean;
    hasDirectText(directText: Partial<Record<K, string>>): boolean;
    hasAnyDirectText(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    containsDirectText(directText: Partial<Record<K, string>>): boolean;
    readonly not: {
        exists: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        isVisible: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        isEnabled: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        hasText: (text: Partial<Record<K, string>>) => boolean;
        hasAnyText: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        containsText: (text: Partial<Record<K, string>>) => boolean;
        hasDirectText: (directText: Partial<Record<K, string>>) => boolean;
        hasAnyDirectText: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        containsDirectText: (directText: Partial<Record<K, string>>) => boolean;
    };
}
export declare class PageElementMapWait<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, MapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>> extends PageNodeWait<Store, MapType> {
    exists(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): MapType;
    isVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): MapType;
    isEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): MapType;
    hasText(text: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): MapType;
    hasAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): MapType;
    containsText(text: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): MapType;
    hasDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): MapType;
    hasAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): MapType;
    containsDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): MapType;
    readonly not: {
        exists: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        hasText: (text: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        containsText: (text: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
        hasDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        containsDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
    };
}
export declare class PageElementMapEventually<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, MapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>> extends PageNodeEventually<Store, MapType> {
    exists(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): boolean;
    isVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): boolean;
    isEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): boolean;
    hasText(text: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): boolean;
    containsText(text: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): boolean;
    hasDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): boolean;
    containsDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): boolean;
    readonly not: {
        exists: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        hasText: (text: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        containsText: (text: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        containsDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
    };
}
