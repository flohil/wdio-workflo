import { XPathBuilder } from './XPathBuilder';
import { PageElement, PageElementList } from '../page_elements';
import { PageElementStore, CloneFunc } from '../stores';
export interface IWhereBuilderOpts<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> {
    store: Store;
    elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    elementOptions: PageElementOptions;
    cloneFunc: CloneFunc<ListType>;
    getAllFunc: (list: ListType) => PageElementType[];
}
export declare class ListWhereBuilder<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> {
    protected _selector: string;
    protected _store: Store;
    protected _elementStoreFunc: (selector: string, opts: PageElementOptions) => PageElementType;
    protected _elementOptions: PageElementOptions;
    protected _cloneFunc: CloneFunc<ListType>;
    protected _getAllFunc: (list: ListType) => PageElementType[];
    protected _xPathBuilder: XPathBuilder;
    constructor(selector: string, opts: IWhereBuilderOpts<Store, PageElementType, PageElementOptions, ListType>);
    reset(): this;
    /**
     * Appends plain xPath string to current selector.
     * @param appendedSelector
     */
    append(appendedSelector: string): this;
    /**
     * Adds plain xPath constraint to current selector.
     * @param constraintSelector
     * @param builderFunc optional -> can be used to apply XPathSelector API to constraintSelector
     */
    constraint(constraintSelector: string, builderFunc?: (xPath: XPathBuilder) => XPathBuilder): this;
    /**
     * Restrict current selector to elements which have at least one child defined by childrenSelector.
     * Calls constraint() but adds a '.' to the beginning of the constraint to select only child elements.
     * @param childSelector
     * @param builderFunc optional -> can be used to apply XPathSelector API to childrenSelector
     */
    child(childSelector: string, builderFunc?: (xpath: XPathBuilder) => XPathBuilder): this;
    text(text: string): this;
    textContains(text: string): this;
    attribute(key: string, value: string): this;
    attributeContains(key: string, value: string): this;
    id(value: string): this;
    idContains(value: string): this;
    class(value: string): this;
    classContains(value: string): this;
    name(value: string): this;
    nameContains(value: string): this;
    /**
     * Finds element by index of accurence on a single "level" of the DOM.
     * Eg.: If index === 3, there must be 3 siblings on the same DOM level that match the current selector
     * and the third one will be selected.
     * @param index starts at 1
     */
    levelIndex(level: number): this;
    /**
     * Finds element by index of accurence accross all "levels/depths" of the DOM.
     * @param index starts at 1
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
