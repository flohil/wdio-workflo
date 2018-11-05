/// <reference types="webdriverio" />
import { PageNode, IPageNodeOpts, PageElement, IPageElementWaitAPI, IPageElementWaitNotAPI, IPageElementEventuallyAPI, IPageElementEventuallyNotAPI } from '.';
import { PageElementStore } from '../stores';
import { ListWhereBuilder } from '../builders';
export declare type WdioElements = WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>;
export interface IPageElementListIdentifier<Store extends PageElementStore, ElementType extends PageElement<Store>> {
    mappingObject: {
        [key: string]: string;
    };
    func: (element: ElementType) => string;
}
export interface IPageElementListWaitEmptyParams extends Workflo.IWDIOParamsOptional {
    interval?: number;
}
export interface IPageElementListWaitEmptyReverseParams extends IPageElementListWaitEmptyParams {
    reverse?: boolean;
}
export interface IPageElementListWaitLengthParams extends IPageElementListWaitEmptyParams {
    comparator?: Workflo.Comparator;
}
export interface IPageElementListWaitLengthReverseParams extends IPageElementListWaitLengthParams {
    reverse?: boolean;
}
export interface IPageElementListOpts<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions> extends IPageNodeOpts<Store> {
    waitType?: Workflo.WaitType;
    timeout?: number;
    interval?: number;
    disableCache?: boolean;
    elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    elementOptions: PageElementOptions;
    identifier?: IPageElementListIdentifier<Store, PageElementType>;
}
export interface IPageElementListRetrievalAPI<Store extends PageElementStore, PageElementType extends PageElement<Store>> {
    elements: WdioElements;
    first: PageElementType;
    at: (index: number) => PageElementType;
    all: PageElementType[];
    getLength: () => number;
}
export interface IPageElementListWaitAPI<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions> {
    hasLength: (length: number, opts?: IPageElementListWaitLengthReverseParams) => PageElementList<Store, PageElementType, PageElementOptions>;
    isEmpty: (opts?: IPageElementListWaitLengthReverseParams) => PageElementList<Store, PageElementType, PageElementOptions>;
    any: Omit<IPageElementWaitAPI<Store>, 'not'>;
    none: IPageElementWaitNotAPI<Store>;
    not: {
        hasLength: (length: number, opts?: IPageElementListWaitLengthParams) => PageElementList<Store, PageElementType, PageElementOptions>;
        isEmpty: (opts?: IPageElementListWaitEmptyParams) => PageElementList<Store, PageElementType, PageElementOptions>;
    };
}
export interface IPageElementListEventuallyAPI<Store extends PageElementStore> {
    hasLength: (length: number, opts?: IPageElementListWaitLengthParams) => boolean;
    isEmpty: (opts?: IPageElementListWaitEmptyParams) => boolean;
    any: Omit<IPageElementEventuallyAPI<Store>, 'not'>;
    none: IPageElementEventuallyNotAPI<Store>;
    not: {
        hasLength: (length: number, opts?: IPageElementListWaitLengthParams) => boolean;
        isEmpty: (opts?: IPageElementListWaitEmptyParams) => boolean;
    };
}
export interface IPageElementListCurrentlyAPI<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> extends IPageElementListRetrievalAPI<Store, PageElementType> {
    lastActualResult: string;
    where: ListWhereBuilder<Store, PageElementType, PageElementOptions, ListType>;
    isEmpty: () => boolean;
    hasLength: (length: number, comparator?: Workflo.Comparator) => boolean;
    not: {
        isEmpty: () => boolean;
        hasLength: (length: number, comparator?: Workflo.Comparator) => boolean;
    };
}
export declare class PageElementList<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions> extends PageNode<Store> implements IPageElementListRetrievalAPI<Store, PageElementType> {
    protected _selector: string;
    protected _waitType: Workflo.WaitType;
    protected _timeout: number;
    protected _interval: number;
    protected _disableCache: boolean;
    protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    protected _elementOptions: PageElementOptions;
    protected _identifier: IPageElementListIdentifier<Store, PageElementType>;
    protected _identifiedObjCache: {
        [key: string]: {
            [key: string]: PageElementType;
        };
    };
    protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOptions, this>;
    protected _cloneFunc: (subSelector: string) => this;
    protected _lastActualResult: string;
    readonly currently: IPageElementListCurrentlyAPI<Store, PageElementType, PageElementOptions, this>;
    readonly wait: IPageElementListWaitAPI<Store, PageElementType, PageElementOptions>;
    readonly eventually: IPageElementListEventuallyAPI<Store>;
    constructor(_selector: string, opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>, cloneFunc: <T extends PageElementList<Store, PageElementType, PageElementOptions>>(selector: Workflo.XPath) => T);
    /**
     * Whenever a function that checks the state of the GUI
     * by comparing an expected result to an actual result is called,
     * the actual result will be stored in 'lastActualResult'.
     *
     * This can be useful to determine why the last invocation of such a function returned false.
     *
     * These "check-GUI-state functions" include all hasXXX, hasAnyXXX and containsXXX functions
     * defined in the .currently, .eventually and .wait API of PageElement.
     */
    readonly lastActualResult: string;
    initialWait(): void;
    readonly elements: WdioElements;
    readonly where: ListWhereBuilder<Store, PageElementType, PageElementOptions, this>;
    /**
     * Returns the first page element found in the DOM that matches the list selector.
     */
    readonly first: PageElementType;
    /**
     * @param index starts at 0
     */
    at: (index: number) => PageElementType;
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
     * are needed, use get() or| firstBy() instead.
     **/
    identify({ identifier, resetCache }?: {
        identifier?: IPageElementListIdentifier<Store, PageElementType>;
        resetCache?: boolean;
    }): {
        [key: string]: PageElementType;
    };
    getLength(): number;
    getTimeout(): number;
    getInterval(): number;
}
