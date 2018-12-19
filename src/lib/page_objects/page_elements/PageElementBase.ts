import * as _ from 'lodash'

import { PageNode, IPageNodeOpts, PageNodeCurrently, PageNodeWait, PageNodeEventually, PageElementGroup } from '.'
import { XPathBuilder } from '../builders'
import { PageElementStore } from '../stores'
import { DEFAULT_INTERVAL } from '..'

export interface IPageElementBaseOpts<
  Store extends PageElementStore,
> extends IPageNodeOpts<Store>, Workflo.IWDIOParamsInterval {
  waitType?: Workflo.WaitType
}

export abstract class PageElementBase<
  Store extends PageElementStore,
> extends PageNode<Store> {

  protected _interval: number
  protected _waitType: Workflo.WaitType
  protected _$: Store

  abstract readonly currently: PageElementBaseCurrently<Store, this>
  abstract readonly wait: PageElementBaseWait<Store, this>
  abstract readonly eventually: PageElementBaseEventually<Store, this>

  constructor(
    selector: string,
    {
      interval,
      waitType = Workflo.WaitType.visible,
      ...superOpts
    }: IPageElementBaseOpts<Store>
  ) {
    super(selector, superOpts)

    this._interval = interval || JSON.parse(process.env.WORKFLO_CONFIG).intervals.default || DEFAULT_INTERVAL

    this._$ = Object.create(null)

    for (const method of Workflo.Class.getAllMethods(this._store)) {
      if (method.indexOf('_') !== 0 && /^[A-Z]/.test(method)) {
        this._$[method] = <Options extends IPageElementBaseOpts<Store>>(_selector: Workflo.XPath, _options: Options) => {

          if (_selector instanceof XPathBuilder) {
            _selector = XPathBuilder.getInstance().build()
          }

          // chain selectors
          _selector = `${selector}${_selector}`

          return this._store[method].apply(this._store, [_selector, _options])
        }
      }
    }

    this._waitType = waitType
  }

  get $() /*:  Omit<Store, FilteredKeysByReturnType<Store, PageElementGroup<any, any>>> */ {
    return this._$
  }

  getSelector() {
    return this._selector
  }

  getTimeout() {
    return this._timeout
  }

  getInterval() {
    return this._interval
  }

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

  get element() {
    return browser.element(this._node.getSelector())
  }

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

  protected _waitWdioCheckFunc(
    checkTypeStr: string,
    conditionFunc: (opts: Workflo.IWDIOParamsReverseInterval) => boolean,
    { timeout = this._node.getTimeout(), reverse, interval = this._node.getInterval() }:
      Workflo.IWDIOParamsReverseInterval = {}
  ) {
    const reverseStr = (reverse) ? ' not' : ''

    return this._node.__wait(
      () => conditionFunc({timeout, reverse, interval}), ` never${reverseStr} ${checkTypeStr}`, timeout
    )
  }

  protected _waitProperty<T>(
    name: string,
    conditionType: 'has' | 'contains' | 'any' | 'within',
    conditionFunc: (opts: Workflo.IWDIOParamsReverseInterval, value?: T) => boolean,
    { timeout = this._node.getTimeout(), reverse, interval = this._node.getInterval() }:
      Workflo.IWDIOParamsReverseInterval = {},
    value?: T
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
      () => (reverse) ? !conditionFunc(value) : conditionFunc(value),
      () => {
        if (conditionType === 'has' || conditionType === 'contains' || conditionType === 'within') {
          return `'s ${name} "${this._node.__lastDiff.actual}" never` +
            `${reverseStr} ${conditionStr} "${this._node.__typeToString(value)}"`
        } else if (conditionType === 'any') {
          return ` never${reverseStr} ${conditionStr} ${name}`
        } else {
          return ''
        }
      },
      timeout, interval
    )
  }

  protected _waitWithinProperty<T>(
    name: string,
    value: T,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.IWDIOParamsReverseInterval
  ) {
    return this._waitProperty(name, 'within', conditionFunc, opts, value)
  }

  protected _waitHasProperty<T>(
    name: string,
    value: T,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.IWDIOParamsReverseInterval
  ) {
    return this._waitProperty(name, 'has', conditionFunc, opts, value)
  }

  protected _waitHasAnyProperty<T>(
    name: string,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.IWDIOParamsReverseInterval
  ) {
    return this._waitProperty(name, 'any', conditionFunc, opts)
  }

  protected _waitContainsProperty<T>(
    name: string,
    value: T,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.IWDIOParamsReverseInterval
  ) {
    return this._waitProperty(name, 'contains', conditionFunc, opts, value)
  }

  protected _makeReverseParams(opts: Workflo.IWDIOParamsInterval = {}): Workflo.IWDIOParamsReverseInterval {
    return {timeout: opts.timeout, reverse: true, interval: opts.interval}
  }
}

export abstract class PageElementBaseEventually<
  Store extends PageElementStore,
  PageElementType extends PageElementBase<Store>
> extends PageNodeEventually<Store, PageElementType> {}