/// <reference types="webdriverio" />
import { PageNode, IPageNodeOpts, PageNodeCurrently, PageNodeWait, PageNodeEventually } from '.';
import { PageNodeStore } from '../stores';
/**
 * Defines the opts parameter passed to the constructor function of PageElementBase.
 *
 * @template Store type of the PageNodeStore used by PageElementBase to retrieve PageNodes from the store
 */
export interface IPageElementBaseOpts<Store extends PageNodeStore> extends IPageNodeOpts<Store> {
    /**
     * Defines the kind of waiting condition performed when `initialWait` is invoked.
     *
     * The initial waiting condition is performed every time before an interaction with the tested application takes place
     * via a PageElement's action (eg. click).
     */
    waitType?: Workflo.WaitType;
}
/**
 * This class provides basic functionalities for all PageElements.
 *
 * @template Store type of the PageNodeStore used by PageElementBase to retrieve PageNodes from the store
 */
export declare abstract class PageElementBase<Store extends PageNodeStore> extends PageNode<Store> {
    /**
     * Defines the kind of wait condition performed when `initialWait` is invoked.
     *
     * The initial wait condition is performed every time before an interaction with the tested application takes place
     * via a PageElement's action (eg. click).
     */
    protected _waitType: Workflo.WaitType;
    /**
     * `_$` provides access to the PageNode retrieval functions of PageElementBase's PageNodeStore and prefixes the
     * selectors of all PageNodes retrieved via `_$` with the selector of PageElementBase.
     */
    protected _$: Store;
    /**
     * the default timeout used by PageElement for all of its functions that operate with timeouts
     * (eg. `wait` and `eventually`)
     */
    protected _timeout: number;
    /**
     * the default interval used by PageElement for all of its functions that operate with intervals
     * (eg. `wait` and `eventually`)
     */
    protected _interval: number;
    abstract readonly currently: PageElementBaseCurrently<Store, this>;
    abstract readonly wait: PageElementBaseWait<Store, this>;
    abstract readonly eventually: PageElementBaseEventually<Store, this>;
    /**
     * PageElementBase provides basic functionalities for all PageElements.
     *
     * @param selector the raw XPath selector of the PageElementBase
     * @param opts the options used to configure PageElementBase
     */
    constructor(selector: string, { waitType, timeout, interval, ...superOpts }: IPageElementBaseOpts<Store>);
    /**
     * `$` provides access to the PageNode retrieval functions of PageElementBase's PageNodeStore and prefixes the
     * selectors of all PageNodes retrieved via `$` with the selector of PageElementBase.
     */
    readonly $: Store;
    /**
     * Returns the XPath selector of PageElementBase.
     */
    getSelector(): string;
    /**
     * Returns the default timeout that a PageElement uses if no other explicit timeout
     * is passed to one of its functions which operates with timeouts (eg. wait, eventually)
     */
    getTimeout(): number;
    /**
     * Returns the default interval that a PageElement uses if no other explicit interval
     * is passed to one of its functions which operates with intervals (eg. wait, eventually)
     */
    getInterval(): number;
    /**
     * Compares the values of `actual` and `expected` and returns true if they are equal.
     *
     * @template T the type of both `actual` and `expected`
     * @param actual the actual value to be compared
     * @param expected the expected value to be compared
     */
    abstract __equals<T>(actual: T, expected: T): boolean;
    /**
     * Return true if `actual` has any value.
     *
     * @template T the type of both `actual`
     * @param actual the actual value which is supposed to have any value
     */
    abstract __any<T>(actual: T): boolean;
    /**
     * Compares the values of `actual` and `expected` and returns true if `actual` contains `expected`.
     *
     * @template T the type of both `actual` and `expected`
     * @param actual the actual value to be compared
     * @param expected the expected value to be compared
     */
    abstract __contains<T>(actual: T, expected: T): boolean;
    /**
     * This function is used to write a value of an arbitrary type
     * into error messages and log outputs.
     *
     * @param value: T the value to convert to a string
     */
    abstract __typeToString<T>(value: T): string;
}
/**
 * This class defines all `currently` functions of PageElementBase.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementBaseCurrently defines all `currently`
 * functions
 */
export declare abstract class PageElementBaseCurrently<Store extends PageNodeStore, PageElementType extends PageElementBase<Store>> extends PageNodeCurrently<Store, PageElementType> {
    /**
     * Fetches the first webdriverio element from the HTML page that is identified by PageElement's XPath selector.
     */
    readonly element: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element>> & WebdriverIO.RawResult<WebdriverIO.Element>;
    /**
     * Stores the values of `actual` and `expected` into `this._lastDiff` as strings.
     *
     * @param actual an actual value
     * @param expected an expected value
     */
    protected _writeLastDiff<T>(actual: T, expected?: T): void;
    /**
     * Checks if the actual value lies within a given tolerance of the expected value.
     *
     * @param actual the actual value from the browser
     * @param expected the expected value or 0 if expected was smaller than 0
     * @param tolerance the tolerance or 0 if tolerance was smaller than 0
     */
    protected _withinTolerance(actual: number, expected: number, tolerance?: number): boolean;
    /**
     * Checks if the `actual` value has/equals the `expected` value and writes both values into `this._lastDiff`.
     *
     * @template T the type of both the actual and the expected value
     * @param expected the expected value
     * @param actual the actual value
     */
    protected _compareHas<T>(expected: T, actual: T): boolean;
    /**
     * Checks if `actual` has any value and writes `actual` into `this._lastDiff`.
     *
     * @template T the type of the actual value
     * @param actual the actual value
     */
    protected _compareHasAny<T>(actual: T): boolean;
    /**
     * Checks if the `actual` value contains the `expected` value and writes both values into `this._lastDiff`.
     *
     * @template T the type of both the actual and the expected value
     * @param expected the value expected to be contained in the actual value
     * @param actual the actual value expected to contain the expected value
     */
    protected _compareContains<T>(expected: T, actual: T): boolean;
}
/**
 * This class defines all `wait` functions of PageElementBase.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementBaseWait defines all `wait`
 * functions
 */
export declare abstract class PageElementBaseWait<Store extends PageNodeStore, PageElementType extends PageElementBase<Store>> extends PageNodeWait<Store, PageElementType> {
    /**
     * This function waits for a certain condition to be met.
     *
     * It does so by invoking a condition function which checks if a certain condition eventually becomes true within a
     * specific timeout.
     *
     * A `WaitUntilTimeoutError` will be thrown and the PageElement's default timeout will be written to `_lastdiff`
     * if the condition function's return value is `false`.
     *
     * @param checkTypeStr describes what kind of check is performed by the condition function
     * @param conditionFunc a function that checks if a certain condition is eventually met within a specific timeout
     * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
     * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
     * condition function
     */
    protected _waitWdioCheckFunc(checkTypeStr: string, conditionFunc: (opts: Workflo.ITimeoutReverseInterval) => boolean, { timeout, reverse, interval }?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * This function can be used to assemble and execute a `wait` state check function.
     *
     * It regularly invokes a condition function until it returns true or until a specific timeout is reached.
     *
     * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
     * specific timeout.
     *
     * @param name the name of the property for which the wait condition is performed
     * @param conditionType the type of comparison performed in the conditionFunc
     * @param conditionFunc a function which compares an actual with an expected value
     * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
     * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
     * condition function
     * @param expectedValue the expected value passed to the conditionFunc
     */
    protected _waitProperty<T>(name: string, conditionType: 'has' | 'contains' | 'any' | 'within', conditionFunc: (opts: Workflo.ITimeoutReverseInterval, value?: T) => boolean, { timeout, reverse, interval }?: Workflo.ITimeoutReverseInterval, expectedValue?: T): PageElementType;
    /**
     * This function waits for an actual value to lie within a certain range of an expected value.
     *
     * It does so by regularly invoking a condition function until it returns true or until a specific timeout is reached.
     *
     * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
     * specific timeout.
     *
     * @param name the name of the property for which the wait condition is performed
     * @param expectedValue the expected value passed to the conditionFunc
     * @param conditionFunc a function which compares the actual and the expected value
     * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
     * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
     * condition function
     */
    protected _waitWithinProperty<T>(name: string, expectedValue: T, conditionFunc: (value: T) => boolean, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * This function waits for an actual value to have/equal an expected value.
     *
     * It does so by regularly invoking a condition function until it returns true or until a specific timeout is reached.
     *
     * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
     * specific timeout.
     *
     * @param name the name of the property for which the wait condition is performed
     * @param expectedValue the expected value passed to the conditionFunc
     * @param conditionFunc a function which compares the actual and the expected value
     * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
     * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
     * condition function
     */
    protected _waitHasProperty<T>(name: string, expectedValue: T, conditionFunc: (value: T) => boolean, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * This function waits for a property to have any value.
     *
     * It does so by regularly invoking a condition function until it returns true or until a specific timeout is reached.
     *
     * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
     * specific timeout.
     *
     * @param name the name of the property for which the wait condition is performed
     * @param conditionFunc a function which checks if a property has any value
     * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
     * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
     * condition function
     */
    protected _waitHasAnyProperty<T>(name: string, conditionFunc: (value: T) => boolean, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * This function waits for an actual value to contain an expected value.
     *
     * It does so by regularly invoking a condition function until it returns true or until a specific timeout is reached.
     *
     * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
     * specific timeout.
     *
     * @param name the name of the property for which the wait condition is performed
     * @param expectedValue the expected value passed to the conditionFunc
     * @param conditionFunc a function which compares the actual and the expected value
     * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
     * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
     * condition function
     */
    protected _waitContainsProperty<T>(name: string, expectedValue: T, conditionFunc: (value: T) => boolean, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Adds a `reverse` property to the passed opts parameter and sets its value to `true`.
     *
     * @param opts the object which should be extended with a `reverse` property
     */
    protected _makeReverseParams(opts?: Workflo.ITimeoutInterval): Workflo.ITimeoutReverseInterval;
}
/**
 * This class defines all `eventually` functions of PageElementBase.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementBaseEventually defines all `eventually`
 * functions
 */
export declare abstract class PageElementBaseEventually<Store extends PageNodeStore, PageElementType extends PageElementBase<Store>> extends PageNodeEventually<Store, PageElementType> {
}
