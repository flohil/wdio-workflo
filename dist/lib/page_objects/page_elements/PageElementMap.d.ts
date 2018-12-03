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
export declare class PageElementMap<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>> extends PageNode<Store> implements Workflo.PageNode.IGetTextNode<Record<K, string>> {
    protected _selector: string;
    protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    protected _elementOptions: PageElementOptions;
    protected _identifier: IPageElementMapIdentifier<K>;
    protected _$: Record<K, PageElementType>;
    readonly currently: PageElementMapCurrently<Store, K, PageElementType, PageElementOptions, this>;
    constructor(_selector: string, { identifier, elementStoreFunc, elementOptions, ...superOpts }: IPageElementMapOpts<Store, K, PageElementType, PageElementOptions>);
    readonly $: Record<K, PageElementType>;
    /**
     * In case of language changes, for example, change values of mappingObject while keys must stay the same.
     * @param mappingObject
     */
    changeMappingObject(mappingObject: Record<K, string>): void;
    /**
     * Helper function to map element content nodes to a value by calling a node interface function on each node.
     *
     * @param context
     * @param getFunc
     */
    __getInterfaceFunc<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, ResultType>(context: Record<K, PageElementType>, getFunc: (node: PageElementType) => ResultType): Record<K, ResultType>;
    /**
     * Returns values of all list elements in the order they were retrieved from the DOM.
     */
    getText(): Record<K, string>;
}
export declare class PageElementMapCurrently<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, MapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>> implements Workflo.PageNode.IGetText<Record<K, string>> {
    protected readonly _node: MapType;
    constructor(node: MapType);
    getText(): Record<K, string>;
}
