import * as _ from 'lodash'

import { PageNode, IPageNodeOpts, PageNodeCurrently, PageNodeWait, PageNodeEventually, PageElementGroup } from '.'
import { XPathBuilder } from '../builders'
import { PageElementStore } from '../stores'

/**
 * Defines the opts parameter passed to the constructor function of PageElementBase.
 *
 * @template Store type of the PageElementStore used by PageElementBase to retrieve PageNodes from the store
 */
export interface IPageElementBaseOpts<
  Store extends PageElementStore,
> extends IPageNodeOpts<Store> {
  /**
   * Defines the kind of wait condition performed when `initialWait` is invoked.
   *
   * The initial wait condition is performed every time before an interaction with the tested application takes place
   * via a PageElement's action (eg. click).
   */
  waitType?: Workflo.WaitType
}

/**
 * This class provides basic functionalities for all PageElements.
 *
 * @template Store type of the PageElementStore used by PageElementBase to retrieve PageNodes from the store
 */
export abstract class PageElementBase<
  Store extends PageElementStore,
> extends PageNode<Store> {
  /**
   * Defines the kind of wait condition performed when `initialWait` is invoked.
   *
   * The initial wait condition is performed every time before an interaction with the tested application takes place
   * via a PageElement's action (eg. click).
   */
  protected _waitType: Workflo.WaitType
  /**
   * `_$` provides access to the PageNode retrieval functions of PageElementBase's PageElementStore and prefixes the
   * selectors of all PageNodes retrieved via `_$` with the selector of PageElementBase.
   */
  protected _$: Store

  abstract readonly currently: PageElementBaseCurrently<Store, this>
  abstract readonly wait: PageElementBaseWait<Store, this>
  abstract readonly eventually: PageElementBaseEventually<Store, this>

  /**
   * PageElementBase provides basic functionalities for all PageElements.
   *
   * @param selector the raw XPath selector of the PageElementBase
   * @param opts the options used to configure PageElementBase
   */
  constructor(
    selector: string,
    {
      waitType = Workflo.WaitType.visible,
      ...superOpts
    }: IPageElementBaseOpts<Store>
  ) {
    super(selector, superOpts)

    this._$ = Object.create(null)

    for (const method of Workflo.Class.getAllMethods(this._store)) {
      if (method.indexOf('_') !== 0 && /^[A-Z]/.test(method)) {
        this._$[method] = <Options extends IPageElementBaseOpts<Store>>(_selector: Workflo.XPath, _options: Options) => {

          if (_selector instanceof XPathBuilder) {
            _selector = XPathBuilder.getInstance().build()
          }

          if (typeof _selector === 'object') {
            // Cleaner solution would be to remove PageElementGroups from public store accessor of PageElement,
            // but this does not work due to typescript bugs that prevent extended generics to work with keyof.
            // typescript bugs 3.3.0:
            // https://github.com/Microsoft/TypeScript/issues/24560, https://github.com/Microsoft/TypeScript/issues/24791
            throw new Error("Selector chaining is not supported for PageElementGroups.")
          }

          // chain selectors
          _selector = `${selector}${_selector}`

          return this._store[method].apply(this._store, [_selector, _options])
        }
      }
    }

    this._waitType = waitType
  }

  // typescript bugs 3.3.0:
  // https://github.com/Microsoft/TypeScript/issues/24560, https://github.com/Microsoft/TypeScript/issues/24791

  /**
   * `$` provides access to the PageNode retrieval functions of PageElementBase's PageElementStore and prefixes the
   * selectors of all PageNodes retrieved via `$` with the selector of PageElementBase.
   */
  get $() /*: Workflo.Omit<Store, Workflo.FilteredKeysByReturnType<Store, PageElementGroup<any, any>>>*/ {
    return this._$
  }

  /**
   * Returns the XPath selector of PageElementBase.
   */
  getSelector() {
    return this._selector
  }

  /**
   * Compares the values of `actual` and `expected` and returns true if they are equal.
   *
   * @template T the type of both `actual` and `expected`
   * @param actual the actual value to be compared
   * @param expected the expected value to be compared
   */
  abstract __equals<T>(actual: T, expected: T): boolean

  /**
   * Return true if `actual` has any value.
   *
   * @template T the type of both `actual`
   * @param actual the actual value which is supposed to have any value
   */
  abstract __any<T>(actual: T): boolean

  /**
   * Compares the values of `actual` and `expected` and returns true if `actual` contains `expected`.
   *
   * @template T the type of both `actual` and `expected`
   * @param actual the actual value to be compared
   * @param expected the expected value to be compared
   */
  abstract __contains<T>(actual: T, expected: T): boolean

  /**
   * This function is used to write a value of an arbitrary type
   * into error messages and log outputs.
   *
   * @param value: T the value to convert to a string
   */
  abstract __typeToString<T>(value: T): string
}

/**
 * This class defines all `currently` functions of PageElementBase.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementBaseCurrently defines all `currently`
 * functions
 */
export abstract class PageElementBaseCurrently<
  Store extends PageElementStore,
  PageElementType extends PageElementBase<Store>
> extends PageNodeCurrently<Store, PageElementType> {

  /**
   * Fetches the first webdriverio element from the HTML page that is identified by PageNode's XPath selector.
   */
  get element() {
    return browser.element(this._node.getSelector())
  }

  /**
   * Stores the values of `actual` and `expected` into `this._lastDiff` as strings.
   *
   * @param actual an actual value
   * @param expected an expected value
   */
  protected _writeLastDiff<T>(actual: T, expected?: T) {
    const diff: Workflo.IDiff = {
      actual: this._node.__typeToString(actual)
    }

    if (typeof expected !== 'undefined') {
      diff.expected = this._node.__typeToString(expected)
    }

    this._node.__setLastDiff(diff)
  }

  /**
   * Checks if the actual value lies within a given tolerance of the expected value.
   *
   * @param actual the actual value from the browser
   * @param expected the expected value or 0 if expected was smaller than 0
   * @param tolerance the tolerance or 0 if tolerance was smaller than 0
   */
  protected _withinTolerance(actual: number, expected: number, tolerance?: number) {
    const tolerances: Workflo.ITolerance = {
      lower: actual,
      upper: actual
    }

    if ( tolerance ) {
      tolerances.lower -= Math.max(tolerance, 0)
      tolerances.upper += Math.max(tolerance, 0)
    }

    return Math.max(expected, 0) >= Math.max(tolerances.lower, 0) && Math.max(expected, 0) <= Math.max(tolerances.upper, 0)
  }

  /**
   * Checks if the `actual` value has/equals the `expected` value and writes both values into `this._lastDiff`.
   *
   * @template T the type of both the actual and the expected value
   * @param expected the expected value
   * @param actual the actual value
   */
  protected _compareHas<T>(expected: T, actual: T) {
    this._writeLastDiff(actual, expected)

    return this._node.__equals(actual, expected)
  }

  /**
   * Checks if `actual` has any value and writes `actual` into `this._lastDiff`.
   *
   * @template T the type of the actual value
   * @param actual the actual value
   */
  protected _compareHasAny<T>(actual: T) {
    this._writeLastDiff(actual)

    return this._node.__any(actual)
  }

  /**
   * Checks if the `actual` value contains the `expected` value and writes both values into `this._lastDiff`.
   *
   * @template T the type of both the actual and the expected value
   * @param expected the value expected to be contained in the actual value
   * @param actual the actual value expected to contain the expected value
   */
  protected _compareContains<T>(expected: T, actual: T) {
    this._writeLastDiff(actual, expected)

    return this._node.__contains(actual, expected)
  }
}

/**
 * This class defines all `wait` functions of PageElementBase.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementBaseWait defines all `wait`
 * functions
 */
export abstract class PageElementBaseWait<
  Store extends PageElementStore,
  PageElementType extends PageElementBase<Store>,
> extends PageNodeWait<Store, PageElementType> {

  exists(opts: Workflo.ITimeoutReverse = {}) {
    return this._waitWdioCheckFunc(
      'existed', opts => this._node.currently.element.waitForExist(opts.timeout, opts.reverse), opts
    )
  }

  /**
   * This function waits for a certain condition to be met.
   *
   * It does so by invoking a condition function which checks if a certain condition eventually becomes true within a 
   * specific timeout.
   *
   * A `WaitUntilTimeoutError` will be thrown if the condition function's return value is `false`.
   *
   * @param checkTypeStr describes what kind of check is performed by the condition function
   * @param conditionFunc a function that checks if a certain condition is eventually met within a specific timeout
   * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
   * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
   * condition function
   */
  protected _waitWdioCheckFunc(
    checkTypeStr: string,
    conditionFunc: (opts: Workflo.ITimeoutReverseInterval) => boolean,
    { timeout = this._node.getTimeout(), reverse, interval = this._node.getInterval() }:
      Workflo.ITimeoutReverseInterval = {}
  ) {
    const reverseStr = (reverse) ? ' not' : ''

    return this._node.__wait(
      () => conditionFunc({timeout, reverse, interval}), ` never${reverseStr} ${checkTypeStr}`, timeout
    )
  }

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
  protected _waitProperty<T>(
    name: string,
    conditionType: 'has' | 'contains' | 'any' | 'within',
    conditionFunc: (opts: Workflo.ITimeoutReverseInterval, value?: T) => boolean,
    { timeout = this._node.getTimeout(), reverse, interval = this._node.getInterval() }:
      Workflo.ITimeoutReverseInterval = {},
    expectedValue?: T
  ) {
    const reverseStr = (reverse) ? ' not' : ''
    let conditionStr = ''

    if (conditionType === 'has') {
      conditionStr = 'became'
    } else if (conditionType === 'contains') {
      conditionStr = 'contained'
    } else if (conditionType === 'any') {
      conditionStr = 'had any'
    } else if (conditionType === 'within') {
      conditionStr = 'was in range'
    }

    return this._node.__waitUntil(
      () => (reverse) ? !conditionFunc(expectedValue) : conditionFunc(expectedValue),
      () => {
        if (conditionType === 'has' || conditionType === 'contains' || conditionType === 'within') {
          return `'s ${name} "${this._node.__lastDiff.actual}" never` +
            `${reverseStr} ${conditionStr} "${this._node.__typeToString(expectedValue)}"`
        } else if (conditionType === 'any') {
          return ` never${reverseStr} ${conditionStr} ${name}`
        } else {
          return ''
        }
      },
      timeout, interval
    )
  }

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
  protected _waitWithinProperty<T>(
    name: string,
    expectedValue: T,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.ITimeoutReverseInterval
  ) {
    return this._waitProperty(name, 'within', conditionFunc, opts, expectedValue)
  }

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
  protected _waitHasProperty<T>(
    name: string,
    expectedValue: T,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.ITimeoutReverseInterval
  ) {
    return this._waitProperty(name, 'has', conditionFunc, opts, expectedValue)
  }

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
  protected _waitHasAnyProperty<T>(
    name: string,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.ITimeoutReverseInterval
  ) {
    return this._waitProperty(name, 'any', conditionFunc, opts)
  }

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
  protected _waitContainsProperty<T>(
    name: string,
    expectedValue: T,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.ITimeoutReverseInterval
  ) {
    return this._waitProperty(name, 'contains', conditionFunc, opts, expectedValue)
  }

  /**
   * Adds a `reverse` property to the passed opts parameter and sets its value to `true`.
   *
   * @param opts the object which should be extended with a `reverse` property
   */
  protected _makeReverseParams(opts: Workflo.ITimeoutInterval = {}): Workflo.ITimeoutReverseInterval {
    return {timeout: opts.timeout, reverse: true, interval: opts.interval}
  }
}

/**
 * This class defines all `eventually` functions of PageElementBase.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementBaseEventually defines all `eventually`
 * functions
 */
export abstract class PageElementBaseEventually<
  Store extends PageElementStore,
  PageElementType extends PageElementBase<Store>
> extends PageNodeEventually<Store, PageElementType> {}