import { XPathBuilder } from './XPathBuilder';
import { PageElement, PageElementList } from '../page_elements';
import { PageElementStore, CloneFunc } from '../stores';
export interface IWhereBuilderOpts<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> {
    store: Store;
    elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    elementOptions: PageElementOptions;
    cloneFunc: CloneFunc<ListType>;
}
export declare class ListWhereBuilder<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> {
    protected _selector: string;
    protected _store: Store;
    protected _elementStoreFunc: (selector: string, opts: PageElementOptions) => PageElementType;
    protected _elementOptions: PageElementOptions;
    protected _cloneFunc: CloneFunc<ListType>;
    protected _xPathBuilder: XPathBuilder;
    constructor(selector: string, opts: IWhereBuilderOpts<Store, PageElementType, PageElementOptions, ListType>);
    reset(): this;
    constraint(constraint: string): this;
    text(text: string): this;
    containedText(text: string): this;
    attr(key: string, value: string): this;
    containedAttr(key: string, value: string): this;
    level(level: number): this;
    id(value: string): this;
    class(value: string): this;
    containedClass(value: string): this;
    /**
     * Starts with 1
     * @param index
     */
    index(index: number): this;
    getFirst(): PageElementType;
    /**
     *
     * @param index starts with 0
     */
    getAt(index: number): PageElementType;
    getAll(): PageElementType[];
    getList(): ListType;
}
