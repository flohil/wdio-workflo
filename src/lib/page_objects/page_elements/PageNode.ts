import { PageElementStore } from '../stores'
import _ = require('lodash');
import { DEFAULT_TIMEOUT, DEFAULT_INTERVAL } from '..'

/**
 * Defines the opts parameter passed to the constructor function of PageNode.
 *
 * @template Store type of the PageElementStore used by PageNode to retrieve PageNodes from the store
 */
export interface IPageNodeOpts<Store extends PageElementStore> extends Workflo.ITimeoutInterval {
  /**
   * an instance of PageElementStore which can be used to retrieve/create PageNodes
   */
  store: Store
}

/**
 * This class serves as a base class for all PageElements, PageElementLists, PageElementMaps and PageElementGroups.
 *
 * @template Store type of the PageElementStore used by PageNode to retrieve PageNodes from the store
 */
export abstract class PageNode<Store extends PageElementStore> implements Workflo.PageNode.INode {
  /**
   * an instance of PageElementStore which can be used to retrieve/create PageNodes
   */
  protected _store: Store
  /**
   * Stores the last differences of PageNode's check state functions.
   *
   * Intended for framework-internal usage only.
   */
  protected _lastDiff: Workflo.IDiff
  /**
   * the XPath selector of PageNode
   */
  protected _selector: string
  /**
   * the default timeout used by PageNode for all functions that operate with timeouts (eg. `wait` and `eventually`)
   */
  protected _timeout: number
  /**
   * the default interval used by PageNode for all functions that operate with intervals (eg. `wait` and `eventually`)
   */
  protected _interval: number

  /**
   * defines all functions of PageNode which check if a condition is currently true or which retrieve a current value
   * from the tested application's state
   */
  abstract readonly currently: PageNodeCurrently<Store, this>
  /**
   * defines all functions of PageNode which wait for a condition to become true within a specified timeout
   */
  abstract readonly wait: PageNodeWait<Store, this>
  /**
   * defines all functions of PageNode which check if a condition eventually becomes true within a specified timeout
   */
  abstract readonly eventually: PageNodeEventually<Store, this>

  /**
   * PageNode serves as a base class for all PageElements, PageElementLists, PageElementMaps and PageElementGroups.
   *
   * @param selector the raw XPath selector of the PageNode
   * @param opts the options required to create an instance of PageNode
   */
  constructor(
    selector: string,
    opts: IPageNodeOpts<Store>
  ) {
    this._selector = selector
    this._store = opts.store
    this._timeout = opts.timeout || JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || DEFAULT_TIMEOUT
    this._interval = opts.interval || JSON.parse(process.env.WORKFLO_CONFIG).intervals.default || DEFAULT_INTERVAL
  }

  // INTERNAL GETTERS AND SETTERS

  __getNodeId() {
    return this._selector
  }

  get __lastDiff() {
    const lastDiff = this._lastDiff || {}
    lastDiff.selector = this.__getNodeId()
    lastDiff.constructorName = this.constructor.name

    return lastDiff
  }

  __setLastDiff(diff: Workflo.IDiff) {
    this._lastDiff = diff
  }

  // PUBLIC GETTERS

  getTimeout() {
    return this._timeout
  }

  getInterval() {
    return this._interval
  }

  // PUBLIC ACTIONS

  toJSON(): Workflo.IElementJSON {
    return {
      pageNodeType: this.constructor.name,
      nodeId: this._selector
    }
  }

  // COMMON HELPER FUNCTIONS

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
  __execute<ResultType>(func: () => ResultType) {
    try {
      return func()
    } catch ( error ) {
      if (error.message.includes('could not be located on the page')) {
        const errorMsg =
        `${this.constructor.name} could not be located on the page.\n` +
        `( ${this.__getNodeId()} )`

        throw new Error(errorMsg)
      } else {
        throw error
      }
    }
  }

  /**
   * Provides custom error handling of 'could not be located' and 'WaitUntilTimeoutError' errors for functions that
   * check if a condition returns true within a specific timeout.
   *
   *
   * @param func the function which is supposed to return true within a specific timeout
   */
  __eventually(func: () => void) : boolean {
    try {
      func();
      return true;
    } catch (error) {
      if (error.message.includes('could not be located on the page')) {
        throw error
      } else if (error.type === 'WaitUntilTimeoutError') {
        return false;
      } else {
        throw error
      }
    }
  }

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
   * @returns an instance of PageNode
   */
  __wait(func: () => boolean, errorMessage: string, timeout: number) {
    try {
      func();
    } catch (error) {
      this._handleWaitError(error, errorMessage, timeout)
    }

    return this
  }

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
   * @returns an instance of PageNode
   */
  __waitUntil(
    waitFunc: () => boolean, errorMessageFunc: () => string, timeout: number, interval?: number
  ) {

    let error: any

    try {
      browser.waitUntil(() => {
        try {
          const result = waitFunc()

          error = undefined

          return result
        } catch( funcError ) {
          error = funcError
        }
      }, timeout, '', interval)
    } catch (untilError) {
      error = error || untilError

      this._handleWaitError(error, errorMessageFunc(), timeout)
    }

    return this
  }

  /**
   * This function implements custom error handling for 'could not be located' and 'WaitUntilTimeoutError' errors.
   *
   * @param error an arbitrary type of error
   * @param errorMessage used to describe the failed condition check which caused a WaitUntilTimeoutError
   * @param timeout the timeout used to wait for an element to be located or for a wait condition to return true
   */
  protected _handleWaitError(error: any, errorMessage: string, timeout: number) {
    if (error.message.includes('could not be located on the page')) {
      throw new Error(
        `${this.constructor.name} could not be located on the page within ${timeout}ms.\n` +
        `( ${this.__getNodeId()} )`
      )
    } else if ('type' in error && error.type === 'WaitUntilTimeoutError') {
      const waitError = new Error(
        `${this.constructor.name}${errorMessage} within ${timeout}ms.\n( ${this.__getNodeId()} )`
      ) as any

      waitError.type = 'WaitUntilTimeoutError'

      throw waitError
    } else {
      throw error
    }
  }
}

/**
 * This class defines all `currently` functions of PageNode.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the Page for which PageNodeCurrently defines all `currently` functions
 */
export abstract class PageNodeCurrently<
  Store extends PageElementStore,
  PageElementType extends PageNode<Store>
> {
  /**
   * the PageNode for which PageNodeCurrently defines all `currently` functions
   */
  protected readonly _node: PageElementType

  /**
   * PageNodeCurrently defines all `currently` functions of PageNode.
   *
   * @param node PageNode for which PageNodeCurrently defines all `currently` functions
   */
  constructor(node: PageElementType) {
    this._node = node
  }

  /**
   * returns the negated variants of PageNodeCurrently's state check functions
   */
  abstract get not(): {}
}

/**
 * This class defines all `wait` functions of PageNode.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the Page for which PageNodeWait defines all `wait` functions
 */
export abstract class PageNodeWait<
  Store extends PageElementStore,
  PageElementType extends PageNode<Store>
> {
  /**
   * the PageNode for which PageNodeWait defines all `wait` functions
   */
  protected readonly _node: PageElementType

  /**
   * PageNodeWait defines all `wait` functions of PageNode.
   *
   * @param node PageNode for which PageNodeWait defines all `wait` functions
   */
  constructor(node: PageElementType) {
    this._node = node
  }

  /**
   * returns the negated variants of PageNodeWait's state check functions
   */
  abstract get not(): {}
}

/**
 * This class defines all `eventually` functions of PageNode.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the Page for which PageNodeEventually defines all `eventually` functions
 */
export abstract class PageNodeEventually<
  Store extends PageElementStore,
  PageElementType extends PageNode<Store>
> {
  /**
   * the PageNode for which PageNodeEventually defines all `eventually` functions
   */
  protected readonly _node: PageElementType

  /**
   * PageNodeEventually defines all `eventually` functions of PageNode.
   *
   * @param node PageNode for which PageNodeEventually defines all `eventually` functions
   */
  constructor(node: PageElementType) {
    this._node = node
  }

  /**
   * returns the negated variants of PageNodeEventually's state check functions
   */
  abstract get not(): {}
}