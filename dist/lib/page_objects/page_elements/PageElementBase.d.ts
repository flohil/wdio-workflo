/// <reference types="webdriverio" />
import { PageNode, IPageNodeOpts } from '.';
import { PageElementStore } from '../stores';
export interface IPageElementBaseOpts<Store extends PageElementStore> extends IPageNodeOpts<Store> {
    waitType?: Workflo.WaitType;
    timeout?: number;
}
export declare abstract class PageElementBase<Store extends PageElementStore> extends PageNode<Store> {
    protected _waitType: Workflo.WaitType;
    protected _$: Store;
    protected _timeout: number;
    abstract readonly currently: PageElementBaseCurrently<Store, this>;
    abstract readonly wait: PageElementBaseWait<Store, this>;
    abstract readonly eventually: PageElementBaseEventually<Store, this>;
    constructor(selector: string, { waitType, timeout, ...superOpts }: IPageElementBaseOpts<Store>);
    readonly $: Store;
    getTimeout(): number;
    abstract __equals<T>(actual: T, expected: T): boolean;
    abstract __any<T>(actual: T): boolean;
    abstract __contains<T>(actual: T, expected: T): any;
    /**
     * This function is used to write a value of an arbitrary type
     * into error messages and log outputs.
     *
     * @param value: T the value to convert to a string
     */
    abstract __typeToString<T>(value: T): string;
}
export declare abstract class PageElementBaseCurrently<Store extends PageElementStore, PageElementType extends PageElementBase<Store>> {
    protected readonly _node: PageElementType;
    protected _lastActualResult: string;
    constructor(node: PageElementType);
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
    readonly element: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element>> & WebdriverIO.RawResult<WebdriverIO.Element>;
    /**
     * Executes func and, if an error occurs during execution of func,
     * throws a custom error message that the page element could not be located on the page.
     * @param func
     */
    protected _execute<ResultType>(func: () => ResultType): ResultType;
    /**
     * @param actual the actual value from the browser
     * @param expected the expected value or 0 if expected was smaller than 0
     * @param tolerance the tolerance or 0 if tolerance was smaller than 0
     */
    protected _withinTolerance(actual: number, expected: number, tolerance?: number): boolean;
    protected _compareHas<T>(expected: T, actual: T): boolean;
    protected _compareHasAny<T>(actual: T): boolean;
    protected _compareContains<T>(expected: T, actual: T): any;
}
export declare abstract class PageElementBaseWait<Store extends PageElementStore, PageElementType extends PageElementBase<Store>> {
    protected readonly _node: PageElementType;
    constructor(node: PageElementType);
    protected _wait(func: () => void, errorMessage: string): PageElementType;
    protected _waitWdioCheckFunc(checkTypeStr: string, conditionFunc: (opts: Workflo.IWDIOParamsOptionalReverse) => boolean, { timeout, reverse }?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    protected _waitProperty<T>(name: string, conditionType: 'has' | 'contains' | 'any' | 'within', conditionFunc: (value?: T) => boolean, { timeout, reverse }?: Workflo.IWDIOParamsOptionalReverse, value?: T): PageElementType;
    protected _waitWithinProperty<T>(name: string, value: T, conditionFunc: (value: T) => boolean, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    protected _waitHasProperty<T>(name: string, value: T, conditionFunc: (value: T) => boolean, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    protected _waitHasAnyProperty<T>(name: string, conditionFunc: (value: T) => boolean, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    protected _waitContainsProperty<T>(name: string, value: T, conditionFunc: (value: T) => boolean, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    protected _makeReverseParams(opts?: Workflo.IWDIOParamsOptional): Workflo.IWDIOParamsOptionalReverse;
}
export declare abstract class PageElementBaseEventually<Store extends PageElementStore, PageElementType extends PageElementBase<Store>> {
    protected readonly _node: PageElementType;
    constructor(node: PageElementType);
    protected _eventually(func: () => void): boolean;
}
