/// <reference types="webdriverio" />
import { PageNode, IPageNodeOpts, PageElement, IPageElementWaitAPI, IPageElementWaitNotAPI, IPageElementEventuallyAPI, IPageElementEventuallyNotAPI } from './';
import { PageElementStore } from '../stores';
import { FirstByBuilder } from '../builders';
export interface IPageElementListIdentifier<Store extends PageElementStore, ElementType extends PageElement<Store>> {
    mappingObject: {
        [key: string]: string;
    };
    func: (element: ElementType) => string;
}
export interface IPageElementListWaitEmptyParams extends Workflo.WDIOParamsOptional {
    interval?: number;
}
export interface IPageElementListWaitLengthParams extends IPageElementListWaitEmptyParams {
    comparator?: Workflo.Comparator;
}
export interface IPageElementListOpts<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions> extends IPageNodeOpts<Store> {
    wait?: Workflo.WaitType;
    timeout?: number;
    interval?: number;
    disableCache?: boolean;
    elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    elementOptions: PageElementOptions;
    identifier?: IPageElementListIdentifier<Store, PageElementType>;
}
export interface IPageElementListWaitAPI<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions> {
    hasLength: (length: number, opts?: IPageElementListWaitLengthParams) => PageElementList<Store, PageElementType, PageElementOptions>;
    isEmpty: (opts?: IPageElementListWaitEmptyParams) => PageElementList<Store, PageElementType, PageElementOptions>;
    any: Omit<IPageElementWaitAPI<Store>, 'not'>;
    none: IPageElementWaitNotAPI<Store>;
}
export interface IPageElementListEventuallyAPI<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions> {
    hasLength: (length: number, opts?: IPageElementListWaitLengthParams) => boolean;
    isEmpty: (opts?: IPageElementListWaitEmptyParams) => boolean;
    any: Omit<IPageElementEventuallyAPI<Store>, 'not'>;
    none: IPageElementEventuallyNotAPI<Store>;
}
export declare class PageElementList<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions> extends PageNode<Store> {
    protected selector: string;
    protected waitType: Workflo.WaitType;
    protected timeout: number;
    protected interval: number;
    protected disableCache: boolean;
    protected elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    protected elementOptions: PageElementOptions;
    protected identifier: IPageElementListIdentifier<Store, PageElementType>;
    protected identifiedObjCache: {
        [key: string]: {
            [key: string]: PageElementType;
        };
    };
    protected firstByBuilder: FirstByBuilder<Store, PageElementType, PageElementOptions>;
    constructor(selector: string, {wait, timeout, disableCache, elementStoreFunc, elementOptions, identifier, interval, ...superOpts}: IPageElementListOpts<Store, PageElementType, PageElementOptions>);
    readonly _elements: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>;
    readonly elements: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>;
    initialWait(): void;
    readonly _listElements: PageElementType[];
    readonly listElements: PageElementType[];
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
     * are needed, use firstBy() instead.
     **/
    identify({identifier, resetCache}?: {
        identifier?: IPageElementListIdentifier<Store, PageElementType>;
        resetCache?: boolean;
    }): {
        [key: string]: PageElementType;
    };
    /**
     *
     * @param index Index starts with 0
     */
    get(index: number): PageElementType;
    getAll(): PageElementType[];
    getLength(): number;
    isEmpty(): boolean;
    firstBy(): FirstByBuilder<Store, PageElementType, PageElementOptions>;
    wait: IPageElementListWaitAPI<Store, PageElementType, PageElementOptions>;
    private _waitHasLength(length, {timeout, comparator, interval});
    private _waitEmpty({timeout, interval});
    private readonly _anyWait;
    private readonly _noneWait;
    eventually: IPageElementListEventuallyAPI<Store, PageElementType, PageElementOptions>;
    private _eventuallyHasLength(length, {timeout, comparator, interval});
    private _eventuallyIsEmpty({timeout, interval});
    private readonly _anyEventually;
    private readonly _noneEventually;
}
