import { PageNode, IPageNodeOpts } from './';
import { XPathBuilder } from '../builders';
/**
 * Provides caller with selector of the map and the value of mappingObject's current property.
 * Theses can be used to build the selector of a map's element generically to identify it.
 */
export interface IPageElementMapIdentifier<K extends string> {
    mappingObject: Record<K, string>;
    func: (mapSelector: string, mappingValue: string) => XPathBuilder | string;
}
export interface IPageElementMapOpts<Store extends Workflo.IPageElementStore, ContentKeys extends string, PageElementType extends Workflo.IPageElement<Store>, PageElementOptions> extends IPageNodeOpts<Store> {
    disableCache?: boolean;
    store: Store;
    elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    elementOptions?: PageElementOptions;
    identifier?: IPageElementMapIdentifier<ContentKeys>;
}
export declare class PageElementMap<Store extends Workflo.IPageElementStore, Content extends string, PageElementType extends Workflo.IPageElement<Store>, PageElementOptions> extends PageNode<Store> implements Workflo.PageNode.INode {
    protected selector: string;
    protected disableCache: boolean;
    protected elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    protected elementOptions: PageElementOptions;
    protected type: string;
    protected identifier: IPageElementMapIdentifier<Content>;
    protected identifiedObjCache: {
        [key: string]: {
            [key: string]: PageElementType;
        };
    };
    protected _$: Record<Content, PageElementType>;
    constructor(selector: string, {disableCache, elementStoreFunc, elementOptions, identifier, ...superOpts}: IPageElementMapOpts<Store, Content, PageElementType, PageElementOptions>);
    readonly $: Record<Content, PageElementType>;
}
