import { PageNode, IPageNodeOpts, PageElement, IPageElementOpts } from '.';
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
export declare class PageElementMap<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>> extends PageNode<Store> implements Workflo.PageNode.IGetTextNode<Partial<Record<K, string>>> {
    protected _selector: string;
    protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    protected _elementOptions: PageElementOptions;
    protected _identifier: IPageElementMapIdentifier<K>;
    protected _$: Record<K, PageElementType>;
    protected _lastDiff: Workflo.PageNode.IDiff;
    readonly currently: PageElementMapCurrently<Store, K, PageElementType, PageElementOptions, this>;
    readonly eventually: PageElementMapEventually<Store, K, PageElementType, PageElementOptions, this>;
    constructor(_selector: string, { identifier, elementStoreFunc, elementOptions, ...superOpts }: IPageElementMapOpts<Store, K, PageElementType, PageElementOptions>);
    readonly $: Record<K, PageElementType>;
    /**
     * In case of language changes, for example, change values of mappingObject while keys must stay the same.
     * @param mappingObject
     */
    changeMappingObject(mappingObject: Record<K, string>): void;
    /**
     * Returns values of all list elements in the order they were retrieved from the DOM.
     */
    getText(filterMask?: Partial<Record<K, boolean>>): Partial<Record<K, string>>;
    /**
     * Helper function to map element content nodes to a value by calling a node interface function on each node.
     *
     * If passing filter mask, only values set to true in this mask will be returned.
     * By default (if no filter mask is passed), all values will be returned.
     *
     * @param context
     * @param getFunc
     * @param filterMask a filter mask
     */
    __getInterfaceFunc<Store extends PageElementStore, PageElementType extends PageElement<Store>, ResultType>(context: Record<K, PageElementType>, getFunc: (node: PageElementType) => ResultType, filterMask?: Partial<Record<K, ResultType | boolean>>): Record<K, ResultType>;
    __compare<T>(compareFunc: (element: PageElementType, expected?: T) => boolean, expected?: Partial<Record<K, T>>): boolean;
}
export declare class PageElementMapCurrently<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, MapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>> {
    protected readonly _node: MapType;
    constructor(node: MapType);
    getText(filterMask?: Partial<Record<K, boolean>>): Partial<Record<K, string>>;
    hasText(text: Partial<Record<K, string>>): boolean;
    hasAnyText(): boolean;
    containsText(text: Partial<Record<K, string>>): boolean;
    not: {
        hasText: (text: Partial<Record<K, string>>) => boolean;
        hasAnyText: () => boolean;
        containsText: (text: Partial<Record<K, string>>) => boolean;
    };
}
export declare class PageElementMapEventually<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, MapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>> {
    protected readonly _node: MapType;
    constructor(node: MapType);
    hasText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyText(opts?: Workflo.IWDIOParamsOptional): boolean;
    containsText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional): boolean;
    not: {
        hasText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
    };
}
