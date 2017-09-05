import { PageNode, IPageNodeOpts } from './';
import { XPathBuilder } from '../builders';
/**
 * Provides caller with selector of the map and the value of mappingObject's current property.
 * Theses can be used to build the selector of a map's element generically to identify it.
 */
export interface IPageElementMapIdentifier {
    mappingObject: {
        [key: string]: string;
    };
    func: (mapSelector: string, mappingValue: string) => XPathBuilder | string;
}
export interface IPageElementMapOpts<Store extends Workflo.IPageElementStore, PageElementType extends Workflo.IPageElement<Store>, PageElementOptions> extends IPageNodeOpts<Store> {
    disableCache?: boolean;
    store: Store;
    elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    elementOptions?: PageElementOptions;
    identifier?: IPageElementMapIdentifier;
}
export declare class PageElementMap<Store extends Workflo.IPageElementStore, Content extends {
    [key: string]: string;
}, PageElementType extends Workflo.IPageElement<Store>, PageElementOptions> extends PageNode<Store> implements Workflo.PageNode.INode {
    protected selector: string;
    protected disableCache: boolean;
    protected elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    protected elementOptions: PageElementOptions;
    protected type: string;
    protected identifier: IPageElementMapIdentifier;
    protected identifiedObjCache: {
        [key: string]: {
            [key: string]: PageElementType;
        };
    };
    protected _$: {
        [key in keyof Content]: PageElementType;
    };
    constructor(selector: string, {disableCache, elementStoreFunc, elementOptions, identifier, ...superOpts}: IPageElementMapOpts<Store, PageElementType, PageElementOptions>);
    readonly $: {
        [key in keyof Content]: PageElementType;
    };
}
