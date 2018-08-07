import { PageNode, IPageNodeOpts, PageElement } from './';
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
export interface IPageElementMapOpts<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions> extends IPageNodeOpts<Store> {
    store: Store;
    identifier: IPageElementMapIdentifier<K>;
    elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    elementOptions: PageElementOptions;
}
export declare class PageElementMap<Store extends PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions> extends PageNode<Store> implements Workflo.PageNode.INode {
    protected selector: string;
    protected elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    protected elementOptions: PageElementOptions;
    protected identifier: IPageElementMapIdentifier<K>;
    protected _$: Record<K, PageElementType>;
    constructor(selector: string, { identifier, elementStoreFunc, elementOptions, ...superOpts }: IPageElementMapOpts<Store, K, PageElementType, PageElementOptions>);
    readonly $: Record<K, PageElementType>;
    /**
     * In case of language changes, for example, change values of mappingObject while keys must stay the same.
     * @param mappingObject
     */
    changeMappingObject(mappingObject: Record<K, string>): void;
}
