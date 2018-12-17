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
export declare class PageElementMap<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>> extends PageNode<Store> implements Workflo.PageNode.IElementNode<Partial<Record<K, string>>> {
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
    getText(filterMask?: Partial<Record<K, string>>): Partial<Record<K, string>>;
    getDirectText(filterMask?: Partial<Record<K, string>>): Partial<Record<K, string>>;
    eachCheck<T>(context: Record<K, PageElementType>, expected: Partial<Record<K, T>>, checkFunc: (element: PageElementType, expected?: T) => boolean): boolean;
    /**
     * Helper function to map element content nodes to a value by calling a node interface function on each node.
     *
     * If passing filter mask, only values defined in this mask will be returned.
     * By default (if no filter mask is passed), all values will be returned.
     *
     * @param getFunc
     * @param filterMask a filter mask
     */
    eachGet<ResultType>(context: Record<K, PageElementType>, filterMask: Partial<Record<K, ResultType>>, getFunc: (node: PageElementType) => ResultType): Partial<Record<K, ResultType>>;
    eachWait<ValueType>(context: Record<K, PageElementType>, expected: Partial<Record<K, ValueType>>, waitFunc: (element: PageElementType, expected?: ValueType) => PageElementType): this;
    eachDo(context: Record<K, PageElementType>, filterMask: Partial<Record<K, true>>, doFunc: (element: PageElementType) => PageElementType): this;
    eachSet<ValueType>(context: Record<K, PageElementType>, values: Partial<Record<K, ValueType>>, setFunc: (element: PageElementType, value: ValueType) => PageElementType): this;
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
    getText(filterMask?: Partial<Record<K, string>>): Partial<Record<K, string>>;
    getDirectText(filterMask?: Partial<Record<K, string>>): Partial<Record<K, string>>;
    exists(filterMask?: Partial<Record<K, true>>): boolean;
    isVisible(filterMask?: Partial<Record<K, true>>): boolean;
    isEnabled(filterMask?: Partial<Record<K, true>>): boolean;
    hasText(text: Partial<Record<K, string>>): boolean;
    hasAnyText(filterMask?: Partial<Record<K, string>>): boolean;
    containsText(text: Partial<Record<K, string>>): boolean;
    hasDirectText(directText: Partial<Record<K, string>>): boolean;
    hasAnyDirectText(filterMask?: Partial<Record<K, string>>): boolean;
    containsDirectText(directText: Partial<Record<K, string>>): boolean;
    readonly not: {
        exists: (filterMask?: Partial<Record<K, true>>) => boolean;
        isVisible: (filterMask?: Partial<Record<K, true>>) => boolean;
        isEnabled: (filterMask?: Partial<Record<K, true>>) => boolean;
        hasText: (text: Partial<Record<K, string>>) => boolean;
        hasAnyText: (filterMask?: Partial<Record<K, string>>) => boolean;
        containsText: (text: Partial<Record<K, string>>) => boolean;
        hasDirectText: (directText: Partial<Record<K, string>>) => boolean;
        hasAnyDirectText: (filterMask?: Partial<Record<K, string>>) => boolean;
        containsDirectText: (directText: Partial<Record<K, string>>) => boolean;
    };
}
export declare class PageElementMapWait<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, MapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>> extends PageNodeWait<Store, MapType> {
    exists(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: Partial<Record<K, true>>;
    }): MapType;
    isVisible(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: Partial<Record<K, true>>;
    }): MapType;
    isEnabled(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: Partial<Record<K, true>>;
    }): MapType;
    hasText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional): MapType;
    hasAnyText(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: Partial<Record<K, string>>;
    }): MapType;
    containsText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional): MapType;
    hasDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional): MapType;
    hasAnyDirectText(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: Partial<Record<K, string>>;
    }): MapType;
    containsDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional): MapType;
    readonly not: {
        exists: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, true>>;
        }) => MapType;
        isVisible: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, true>>;
        }) => MapType;
        isEnabled: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, true>>;
        }) => MapType;
        hasText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => MapType;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, string>>;
        }) => MapType;
        containsText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => MapType;
        hasDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => MapType;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, string>>;
        }) => MapType;
        containsDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => MapType;
    };
}
export declare class PageElementMapEventually<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, MapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>> extends PageNodeEventually<Store, MapType> {
    exists(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: Partial<Record<K, true>>;
    }): boolean;
    isVisible(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: Partial<Record<K, true>>;
    }): boolean;
    isEnabled(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: Partial<Record<K, true>>;
    }): boolean;
    hasText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyText(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: Partial<Record<K, string>>;
    }): boolean;
    containsText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyDirectText(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: Partial<Record<K, string>>;
    }): boolean;
    containsDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional): boolean;
    readonly not: {
        exists: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, true>>;
        }) => boolean;
        isVisible: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, true>>;
        }) => boolean;
        isEnabled: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, true>>;
        }) => boolean;
        hasText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, string>>;
        }) => boolean;
        containsText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, string>>;
        }) => boolean;
        containsDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
    };
}
