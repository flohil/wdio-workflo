import * as _ from 'lodash'

import { PageNode, IPageNodeOpts, PageNodeCurrently, PageNodeWait, PageNodeEventually } from '.'
import { XPathBuilder } from '../builders'
import { PageElementStore } from '../stores'
import { DEFAULT_TIMEOUT, stores } from '..'

export interface IPageElementBaseOpts<
  Store extends PageElementStore,
> extends IPageNodeOpts<Store> {
  waitType?: Workflo.WaitType
  timeout?: number
}

export abstract class PageElementBase<
  Store extends PageElementStore,
> extends PageNode<Store> {

  protected _waitType: Workflo.WaitType
  protected _$: Store

  protected _timeout: number

  abstract readonly currently: PageElementBaseCurrently<Store, this>
  abstract readonly wait: PageElementBaseWait<Store, this>
  abstract readonly eventually: PageElementBaseEventually<Store, this>

  constructor(
    selector: string,
    {
      waitType = Workflo.WaitType.visible,
      timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || DEFAULT_TIMEOUT,
      ...superOpts
    }: IPageElementBaseOpts<Store>
  ) {
    super(selector, superOpts)

    this._selector = selector
    this._$ = Object.create(null)

    for (const method of Workflo.Class.getAllMethods(this._store)) {
      if (method.indexOf('_') !== 0 && /^[A-Z]/.test(method)) {
        this._$[method] = <Options extends IPageElementBaseOpts<Store>>(_selector: Workflo.XPath, _options: Options) => {

          if (_selector instanceof XPathBuilder) {
            selector = XPathBuilder.getInstance().build()
          }

          // chain selectors
          _selector = `${selector}${_selector}`

          return this._store[method].apply(this._store, [_selector, _options])
        }
      }
    }

    this._waitType = waitType
    this._timeout = timeout
  }

  get $(): Store {
    return this._$
  }

  getTimeout() { return this._timeout }

  abstract __equals<T>(actual: T, expected: T): boolean
  abstract __any<T>(actual: T): boolean
  abstract __contains<T>(actual: T, expected: T)

  /**
   * This function is used to write a value of an arbitrary type
   * into error messages and log outputs.
   *
   * @param value: T the value to convert to a string
   */
  abstract __typeToString<T>(value: T): string
}

export abstract class PageElementBaseCurrently<
  Store extends PageElementStore,
  PageElementType extends PageElementBase<Store>
> extends PageNodeCurrently<Store, PageElementType> {

  protected _lastDiff: Workflo.IDiff

  /**
   * Whenever a function that checks the state of the GUI
   * by comparing an expected result to an actual result is called,
   * the actual and expected result and the selector will be stored in 'lastDiff'.
   *
   * This can be useful to determine why the last invocation of such a function returned false.
   *
   * These "check-GUI-state functions" include all hasXXX, hasAnyXXX and containsXXX functions
   * defined in the .currently, .eventually and .wait API of PageElement.
   */
  get __lastDiff(): Workflo.IDiff {
    return _.merge(this._lastDiff, {selector: this._node.getSelector(), constructorName: this.constructor.name})
  }

  get element() {
    return browser.element(this._node.getSelector())
  }

  /**
   * Executes func and, if an error occurs during execution of func,
   * throws a custom error message that the page element could not be located on the page.
   * @param func
   */
  protected _execute<ResultType>(func: () => ResultType) {
    try {
      return func()
    } catch ( error ) {
      const errorMsg =
      `${this._node.constructor.name} could not be located on the page.\n` +
      `( ${this._node.getSelector()} )`

      throw new Error(errorMsg)
    }
  }

  protected _writeLastDiff<T>(actual: T, expected?: T) {
    this._lastDiff = {
      actual: this._node.__typeToString(actual),
    }

    if (typeof expected !== 'undefined') {
      this._lastDiff.expected = this._node.__typeToString(expected)
    }
  }

  /**
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

  protected _compareHas<T>(expected: T, actual: T) {
    this._writeLastDiff(actual, expected)

    return this._node.__equals(actual, expected)
  }

  protected _compareHasAny<T>(actual: T) {
    this._writeLastDiff(actual)

    return this._node.__any(actual)
  }

  protected _compareContains<T>(expected: T, actual: T) {
    this._writeLastDiff(actual, expected)

    return this._node.__contains(actual, expected)
  }
}

export abstract class PageElementBaseWait<
  Store extends PageElementStore,
  PageElementType extends PageElementBase<Store>,
> extends PageNodeWait<Store, PageElementType> {

  protected _wait(func: () => void, errorMessage: string) {
    try {
      func();
    } catch (error) {
      throw new Error(`${this._node.constructor.name}${errorMessage}.\n( ${this._node.getSelector()} )`)
    }

    return this._node
  }

  protected _waitWdioCheckFunc(
    checkTypeStr: string,
    conditionFunc: (opts: Workflo.IWDIOParamsOptionalReverse) => boolean,
    { timeout = this._node.getTimeout(), reverse }: Workflo.IWDIOParamsOptionalReverse = {}
  ) {
    const reverseStr = (reverse) ? ' not' : ''

    return this._wait(
      () => conditionFunc({timeout, reverse}),
      ` never${reverseStr} ${checkTypeStr} within ${timeout} ms`
    )
  }

  protected _waitProperty<T>(
    name: string,
    conditionType: 'has' | 'contains' | 'any' | 'within',
    conditionFunc: (value?: T) => boolean,
    { timeout = this._node.getTimeout(), reverse }: Workflo.IWDIOParamsOptionalReverse = {},
    value?: T
  ) {
    const reverseStr = (reverse) ? ' not' : ''
    let conditionStr = ''
    let errorMessage = ''

    if (conditionType === 'has') {
      conditionStr = 'became'
    } else if (conditionType === 'contains') {
      conditionStr = 'contained'
    } else if (conditionType === 'any') {
      conditionStr = 'any'
    } else if (conditionType === 'within') {
      conditionStr = 'was in range'
    }

    try {
      browser.waitUntil(() => {
        if (reverse) {
          return !conditionFunc(value)
        } else {
          return conditionFunc(value)
        }
      }, timeout)
    } catch ( error ) {
      if (conditionType === 'has' || conditionType === 'contains' || conditionType === 'within') {
        errorMessage =
          `${this._node.constructor.name}'s ${name} "${this._node.__lastDiff.actual}" never` +
          `${reverseStr} ${conditionStr} "${this._node.__typeToString(value)}" within ${timeout} ms.\n` +
          `( ${this._node.getSelector()} )`
      } else if (conditionType === 'any') {
        errorMessage =
          `${this._node.constructor.name} never${reverseStr} ${conditionStr} any ${name}` +
          ` within ${timeout} ms.\n( ${this._node.getSelector()} )`
      }

      throw new Error(errorMessage)
    }

    return this._node
  }

  protected _waitWithinProperty<T>(
    name: string,
    value: T,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.IWDIOParamsOptionalReverse
  ) {
    return this._waitProperty(name, 'within', conditionFunc, opts, value)
  }

  protected _waitHasProperty<T>(
    name: string,
    value: T,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.IWDIOParamsOptionalReverse
  ) {
    return this._waitProperty(name, 'has', conditionFunc, opts, value)
  }

  protected _waitHasAnyProperty<T>(
    name: string,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.IWDIOParamsOptionalReverse
  ) {
    return this._waitProperty(name, 'any', conditionFunc, opts)
  }

  protected _waitContainsProperty<T>(
    name: string,
    value: T,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.IWDIOParamsOptionalReverse
  ) {
    return this._waitProperty(name, 'contains', conditionFunc, opts, value)
  }

  protected _makeReverseParams(opts: Workflo.IWDIOParamsOptional = {}): Workflo.IWDIOParamsOptionalReverse {
    return {timeout: opts.timeout, reverse: true}
  }
}

export abstract class PageElementBaseEventually<
  Store extends PageElementStore,
  PageElementType extends PageElementBase<Store>
> extends PageNodeEventually<Store, PageElementType> {

  protected _eventually(func: () => void) : boolean {
    try {
      func();
      return true;
    } catch (error) {
      return false;
    }
  }
}