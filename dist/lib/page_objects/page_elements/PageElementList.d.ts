/// <reference types="webdriverio" />
import { PageNode, IPageNodeOpts, PageElement, IPageElementOpts } from '.';
import { PageElementStore } from '../stores';
import { ListWhereBuilder } from '../builders';
export declare type WdioElements = WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>;
export interface IPageElementListIdentifier<Store extends PageElementStore, PageElementType extends PageElement<Store>> {
    mappingObject: {
        [key: string]: string;
    };
    func: (element: PageElementType) => string;
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
export interface IPageElementListOpts<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>> extends IPageNodeOpts<Store> {
    elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    elementOptions: PageElementOptions;
    waitType?: Workflo.WaitType;
    timeout?: number;
    interval?: number;
    disableCache?: boolean;
    identifier?: IPageElementListIdentifier<Store, PageElementType>;
}
export declare class PageElementList<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>> extends PageNode<Store> implements Workflo.PageNode.IGetTextNode<string[]> {
    protected _selector: string;
    protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    protected _elementOptions: PageElementOptions;
    protected _waitType: Workflo.WaitType;
    protected _timeout: number;
    protected _interval: number;
    protected _disableCache: boolean;
    protected _identifier: IPageElementListIdentifier<Store, PageElementType>;
    protected _identifiedObjCache: {
        [key: string]: {
            [key: string]: PageElementType;
        };
    };
    protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOptions, this>;
    protected _lastDiff: Workflo.PageNode.IDiff;
    readonly currently: PageElementListCurrently<Store, PageElementType, PageElementOptions, this>;
    readonly wait: PageElementListWait<Store, PageElementType, PageElementOptions, this>;
    readonly eventually: PageElementListEventually<Store, PageElementType, PageElementOptions, this>;
    constructor(_selector: string, opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>);
    /**
     * Use this method to initialize properties that rely on the this type
     * which is not available in the constructor.
     *
     * Make sure that this method is invoked immediatly after construction.
     *
     * @param cloneFunc
     */
    init(cloneFunc: (selector: Workflo.XPath) => this): void;
    initialWait(): void;
    readonly elements: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>;
    readonly where: ListWhereBuilder<Store, PageElementType, PageElementOptions, this>;
    /**
     * Returns the first page element found in the DOM that matches the list selector.
     */
    readonly first: PageElementType;
    /**
     * @param index starts at 0
     */
    at(index: number): PageElementType;
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
     * are needed, use get() or where instead.
     **/
    identify({ identifier, resetCache }?: {
        identifier?: IPageElementListIdentifier<Store, PageElementType>;
        resetCache?: boolean;
    }): {
        [key: string]: PageElementType;
    };
    getTimeout(): number;
    getInterval(): number;
    getLength(): number;
    getText(): string[];
    __compare<T>(compareFunc: (element: PageElementType, expected?: T) => boolean, expected?: T | T[]): boolean;
}
export declare class PageElementListCurrently<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> implements Workflo.PageNode.IGetText<string[]>, Workflo.PageNode.ICheckTextCurrently<string | string[]> {
    protected readonly _node: ListType;
    protected _selector: string;
    protected _store: Store;
    protected _elementOptions: PageElementOptions;
    protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOptions, ListType>;
    protected _lastDiff: Workflo.PageNode.IDiff;
    constructor(node: ListType, opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>);
    /**
     * Use this method to initialize properties that rely on the this type
     * which is not available in the constructor.
     *
     * Make sure that this method is invoked immediatly after construction.
     *
     * @param cloneFunc
     */
    init(cloneFunc: (selector: Workflo.XPath) => ListType): void;
    /**
     * Whenever a function that checks the state of the GUI
     * by comparing an expected result to an actual result is called,
     * the actual and expected result and selector will be stored in 'lastDiff'.
     *
     * This can be useful to determine why the last invocation of such a function returned false.
     *
     * These "check-GUI-state functions" include all hasXXX, hasAnyXXX and containsXXX functions
     * defined in the .currently, .eventually and .wait API of PageElement.
     */
    readonly __lastDiff: Workflo.PageNode.IDiff;
    readonly elements: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>;
    readonly where: ListWhereBuilder<Store, PageElementType, PageElementOptions, ListType>;
    /**
     * Returns the first page element found in the DOM that matches the list selector.
     */
    readonly first: PageElementType;
    /**
     * @param index starts at 0
     */
    at(index: number): PageElementType;
    /**
     * Returns all page elements found in the DOM that match the list selector after initial wait.
     */
    readonly all: PageElementType[];
    getLength(): number;
    getText(): string[];
    isEmpty(): boolean;
    hasLength(length: number, comparator?: Workflo.Comparator): boolean;
    hasText(text: string | string[]): boolean;
    hasAnyText(): boolean;
    containsText(text: string | string[]): boolean;
    not: {
        isEmpty: () => boolean;
        hasLength: (length: number, comparator?: Workflo.Comparator) => boolean;
        hasText: (text: string | string[]) => boolean;
        hasAnyText: () => boolean;
        containsText: (text: string | string[]) => boolean;
    };
}
export declare class PageElementListWait<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> {
    protected readonly _node: ListType;
    constructor(node: ListType);
    hasLength(length: number, { timeout, comparator, interval, reverse }?: IPageElementListWaitLengthReverseParams): ListType;
    isEmpty({ timeout, interval, reverse }?: IPageElementListWaitEmptyReverseParams): ListType;
    readonly any: PageElementType["wait"];
    readonly none: PageElementType['wait']['not'];
    not: {
        isEmpty: (opts: IPageElementListWaitEmptyParams) => ListType;
        hasLength: (length: number, opts?: IPageElementListWaitLengthParams) => ListType;
    };
}
export declare class PageElementListEventually<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> implements Workflo.PageNode.ICheckTextEventually<string | string[]> {
    protected readonly _node: ListType;
    constructor(node: ListType);
    protected _eventually(func: () => void): boolean;
    readonly any: PageElementType["eventually"];
    readonly none: PageElementType['eventually']['not'];
    hasLength(length: number, { timeout, comparator, interval, reverse }?: IPageElementListWaitLengthReverseParams): boolean;
    isEmpty({ timeout, interval, reverse }?: IPageElementListWaitEmptyReverseParams): boolean;
    hasText(text: string | string[], opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyText(opts?: Workflo.IWDIOParamsOptional): boolean;
    containsText(text: string | string[], opts?: Workflo.IWDIOParamsOptional): boolean;
    not: {
        isEmpty: (opts: IPageElementListWaitEmptyParams) => boolean;
        hasLength: (length: number, opts: IPageElementListWaitLengthParams) => boolean;
        hasText: (text: string | string[], opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsText: (text: string | string[], opts?: Workflo.IWDIOParamsOptional) => boolean;
    };
}
export declare function excludeNot<T extends {
    not: N;
}, N>(obj: T): Pick<T, Exclude<keyof T, "not">>;
