/// <reference types="webdriverio" />
import { PageNode, IPageNodeOpts } from './';
import { FirstByBuilder } from '../builders/FirstByBuilder';
export interface IPageElementListIdentifier<Store extends Workflo.IPageElementStore, ElementType extends Workflo.IPageElement<Store>> {
    mappingObject: {
        [key: string]: string;
    };
    func: (element: ElementType) => string;
}
export interface IPageElementListOpts<Store extends Workflo.IPageElementStore, PageElementType extends Workflo.IPageElement<Store>, PageElementOptions> extends IPageNodeOpts<Store> {
    disableCache?: boolean;
    store: Store;
    elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    elementOptions?: PageElementOptions;
    identifier?: IPageElementListIdentifier<Store, PageElementType>;
}
export declare class PageElementList<Store extends Workflo.IPageElementStore, PageElementType extends Workflo.IPageElement<Store>, PageElementOptions> extends PageNode<Store> implements Workflo.PageNode.INode {
    protected selector: string;
    protected disableCache: boolean;
    protected elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    protected elementOptions: PageElementOptions;
    protected type: string;
    protected identifier: IPageElementListIdentifier<Store, PageElementType>;
    protected identifiedObjCache: {
        [key: string]: {
            [key: string]: PageElementType;
        };
    };
    protected firstByBuilder: FirstByBuilder<Store, PageElementType, PageElementOptions>;
    constructor(selector: string, {disableCache, elementStoreFunc, elementOptions, identifier, ...superOpts}: IPageElementListOpts<Store, PageElementType, PageElementOptions>);
    readonly _elements: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>;
    readonly elements: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>;
    initialWait(): void;
    readonly _listElements: PageElementType[];
    readonly listElements: PageElementType[];
    setIdentifier(identifier: IPageElementListIdentifier<Store, PageElementType>): this;
    identify({identifier, resetCache}?: {
        identifier?: IPageElementListIdentifier<Store, PageElementType>;
        resetCache?: boolean;
    }): {
        [key: string]: PageElementType;
    };
    get(index: number): PageElementType;
    getAll(): PageElementType[];
    getLength(): number;
    firstBy(): FirstByBuilder<Store, PageElementType, PageElementOptions>;
    waitExist({timeout, reverse}?: Workflo.WDIOParams): this;
    waitVisible({timeout, reverse}?: Workflo.WDIOParams): this;
    waitText({timeout, reverse}?: Workflo.WDIOParams): this;
    waitValue({timeout, reverse}?: Workflo.WDIOParams): this;
    waitAllVisible({timeout, reverse}?: Workflo.WDIOParams): this;
    waitAllText({timeout, reverse}?: Workflo.WDIOParams): this;
    waitAllValue({timeout, reverse}?: Workflo.WDIOParams): this;
    waitLength({length, timeout, comparator, interval}: {
        length: number;
        timeout?: number;
        comparator?: Workflo.Comparator;
        interval?: number;
    }): this;
    eventuallyHasLength({length, timeout}: {
        length: number;
        timeout: number;
    }): boolean;
    isEmpty(): boolean;
    eventuallyIsEmpty({timeout}: {
        timeout?: number;
    }): boolean;
    waitEmpty({timeout, interval}: {
        timeout?: number;
        interval?: number;
    }): void;
}
