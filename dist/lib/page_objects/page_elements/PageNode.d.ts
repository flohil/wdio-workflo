import { PageElementStore } from '../stores';
/**
 * Defines the opts parameter passed to the constructor function of PageNode.
 *
 * @template Store type of the PageElementStore used by PageNode to retrieve PageNodes from the store
 */
export interface IPageNodeOpts<Store extends PageElementStore> extends Workflo.ITimeoutInterval {
    /**
     * an instance of PageElementStore which can be used to retrieve/create PageNodes
     */
    store: Store;
}
/**
 * This class serves as a base class for all PageElements, PageElementLists, PageElementMaps and PageElementGroups.
 *
 * @template Store type of the PageElementStore used by PageNode to retrieve PageNodes from the store
 */
export declare abstract class PageNode<Store extends PageElementStore> implements Workflo.PageNode.INode {
    /**
     * an instance of PageElementStore which can be used to retrieve/create PageNodes
     */
    protected _store: Store;
    /**
     * Stores the last differences of PageNode's check state functions.
     *
     * Intended for framework-internal usage only.
     */
    protected _lastDiff: Workflo.IDiff;
    /**
     * the XPath selector of PageNode
     */
    protected _selector: string;
    /**
     * defines an api for all functions of PageNode which check if a condition is currently true or which retrieve a
     * current value from the tested application's state
     */
    abstract readonly currently: PageNodeCurrently<Store, this>;
    /**
     * defines an api for all functions of PageNode which wait for a condition to become true within a specified timeout
     */
    abstract readonly wait: PageNodeWait<Store, this>;
    /**
     * defines an api for all functions of PageNode which check if a condition eventually becomes true within a specified
     * timeout
     */
    abstract readonly eventually: PageNodeEventually<Store, this>;
    /**
     * PageNode serves as a base class for all PageElements, PageElementLists, PageElementMaps and PageElementGroups.
     *
     * @param selector the raw XPath selector of the PageNode
     * @param opts the options used to configure an instance of PageNode
     */
    constructor(selector: string, opts: IPageNodeOpts<Store>);
    __getNodeId(): string;
    readonly __lastDiff: Workflo.IDiff;
    __setLastDiff(diff: Workflo.IDiff): void;
    toJSON(): Workflo.IElementJSON;
    /**
     * Executes func and trows any errors that occur during its execution.
     *
     * If an error occurs because an element could not be located on the page, throws a custom 'could not be located'
     * error message.
     *
     * @template ResultType the result type of the executed function
     * @param func the function to be executed
     * @returns the result value of the executed function
     */
    __execute<ResultType>(func: () => ResultType): ResultType;
    /**
     * Provides custom error handling of 'could not be located' and 'WaitUntilTimeoutError' errors for functions that
     * check if a condition returns true within a specific timeout.
     *
     *
     * @param func the function which is supposed to return true within a specific timeout
     */
    __eventually(func: () => void): boolean;
    /**
     * Provides custom error handling of 'could not be located' and 'WaitUntilTimeoutError' errors for functions that
     * wait for a condition to become true within a specific timeout and throw an error if the condition does not become
     * true.
     *
     *
     * @param func the function which is supposed to return true within a specific timeout and throws an error if the
     * condition does not become true
     * @param errorMessage an errorMessage that describes the condition which did not become true within a specific
     * timeout
     * @param timeout the timeout used to wait for the result of the passed func to return true
     * @returns this (an instance of PageNode)
     */
    __wait(func: () => boolean, errorMessage: string, timeout: number): this;
    /**
     * This function executes a waitFunc until it returns true or a specific timeout is reached.
     * If the return value of waitFunc does not become true within the timeout, this function throws a
     * 'WaitUntilTimeoutError'.
     *
     * __waitUntil also provides custom error handling for 'could not be located' errors.
     *
     *
     * @param waitFunc the function which is supposed to return true within a specific timeout
     * @param errorMessageFunc a function that returns an errorMessage which describes the condition that did not become
     * true within a specific timeout
     * @param timeout the timeout used to wait for the result of the waitFunc to return true
     * @param interval the interval used to check for the result of the waitFunc to return true
     * @returns this (an instance of PageNode)
     */
    __waitUntil(waitFunc: () => boolean, errorMessageFunc: () => string, timeout: number, interval?: number): this;
    /**
     * This function implements custom error handling for 'could not be located' and 'WaitUntilTimeoutError' errors.
     *
     * @param error an arbitrary type of error
     * @param errorMessage used to describe the failed condition check which caused a WaitUntilTimeoutError
     * @param timeout the timeout used to wait for an element to be located or for a wait condition to return true
     */
    protected _handleWaitError(error: any, errorMessage: string, timeout: number): void;
}
/**
 * This class defines all `currently` functions of PageNode.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the Page for which PageNodeCurrently defines all `currently` functions
 */
export declare abstract class PageNodeCurrently<Store extends PageElementStore, PageElementType extends PageNode<Store>> {
    /**
     * the PageNode for which PageNodeCurrently defines all `currently` functions
     */
    protected readonly _node: PageElementType;
    /**
     * PageNodeCurrently defines all `currently` functions of PageNode.
     *
     * @param node PageNode for which PageNodeCurrently defines all `currently` functions
     */
    constructor(node: PageElementType);
    /**
     * returns the negated variants of PageNodeCurrently's state check functions
     */
    abstract readonly not: {};
}
/**
 * This class defines all `wait` functions of PageNode.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the Page for which PageNodeWait defines all `wait` functions
 */
export declare abstract class PageNodeWait<Store extends PageElementStore, PageElementType extends PageNode<Store>> {
    /**
     * the PageNode for which PageNodeWait defines all `wait` functions
     */
    protected readonly _node: PageElementType;
    /**
     * PageNodeWait defines all `wait` functions of PageNode.
     *
     * @param node PageNode for which PageNodeWait defines all `wait` functions
     */
    constructor(node: PageElementType);
    /**
     * returns the negated variants of PageNodeWait's state check functions
     */
    abstract readonly not: {};
}
/**
 * This class defines all `eventually` functions of PageNode.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the Page for which PageNodeEventually defines all `eventually` functions
 */
export declare abstract class PageNodeEventually<Store extends PageElementStore, PageElementType extends PageNode<Store>> {
    /**
     * the PageNode for which PageNodeEventually defines all `eventually` functions
     */
    protected readonly _node: PageElementType;
    /**
     * PageNodeEventually defines all `eventually` functions of PageNode.
     *
     * @param node PageNode for which PageNodeEventually defines all `eventually` functions
     */
    constructor(node: PageElementType);
    /**
     * returns the negated variants of PageNodeEventually's state check functions
     */
    abstract readonly not: {};
}
