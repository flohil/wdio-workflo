import {
  PageElement,
  IPageElementOpts,
  PageElementCurrently,
  PageElementWait,
  PageElementEventually,
} from './PageElement'
import { PageElementStore } from '../stores'

/**
 * Describes the opts parameter passed to the constructor function of ValuePageElement.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 */
export interface IValuePageElementOpts<
  Store extends PageElementStore
> extends IPageElementOpts<Store> {}

 // intial wait condition also supports 'value'

/**
 * ValuePageElement extends PageElement with the possibility to set, retrieve and check a PageElement's value.
 *
 * It also adds another initial waiting condition:
 *
 * - 'value' to wait for an element to have any value
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template ValueType the type of PageElement's value
 */
export abstract class ValuePageElement<
  Store extends PageElementStore,
  ValueType
> extends PageElement<Store> implements Workflo.PageNode.IValueElementNode<ValueType, boolean> {

  readonly abstract currently: ValuePageElementCurrently<Store, this, ValueType>
  readonly wait: ValuePageElementWait<Store, this, ValueType>
  readonly eventually: ValuePageElementEventually<Store, this, ValueType>

  /**
   * ValuePageElement extends PageElement with the possibility to set, retrieve and check a PageElement's value.
   *
   * It also adds another initial waiting condition:
   *
   * - 'value' to wait for an element to have any value
   *
   * @param selector the XPath selector used to identify ValuePageElement on the page
   * @param opts the options used to configure ValuePageElement
   */
  constructor(selector: string, opts: IValuePageElementOpts<Store>) {
    super(selector, opts)

    this.wait = new ValuePageElementWait(this)
    this.eventually = new ValuePageElementEventually(this)
  }

  /**
   * Sets the value of this PageElement.
   *
   * @param value the value which should be set for PageElement
   * @returns this (an instance of ValuePageElement)
   */
  abstract setValue(value: ValueType): this

  /**
   * Performs PageElement's initial waiting condition.
   *
   * Supports the following waiting types:
   *
   * - 'exist' to wait for an element to exist in the DOM
   * - 'visible' to wait for an element to become visible in the viewport (not obscured by other elements, not set to
   * 'hidden', not outside of the viewport...)
   * - 'text' to wait for an element to have any text
   * - 'value' to wait for an element to have any value
   */
  initialWait() {
    if (this._waitType === Workflo.WaitType.value) {
      if (!this.currently.hasAnyValue()) {
        this.wait.hasAnyValue()
      }

      return this
    } else {
      return super.initialWait()
    }
  }

  /**
   * Returns ValuePageElement's value after performing the initial waiting condition.
   */
  getValue() {
    return this._executeAfterInitialWait( () => this.currently.getValue() )
  }

  /**
   * Returns true if ValuePageElement's actual value equals an expected value after performing the initial waiting
   * condition.
   *
   * @param value the expected value which is supposed to equal ValuePageElement's actual value
   */
  getHasValue(value: ValueType) {
    return this._executeAfterInitialWait( () => this.currently.hasValue(value) )
  }

  /**
   * Returns true if ValuePageElement has any value after performing the initial waiting condition.
   */
  getHasAnyValue() {
    return this._executeAfterInitialWait( () => this.currently.hasAnyValue() )
  }

  /**
   * Returns true if ValuePageElement's actual value contains an expected value after performing the initial waiting
   * condition.
   *
   * @param value the expected value which is supposed to be contained in ValuePageElement's actual value
   */
  getContainsValue(value: ValueType) {
    return this._executeAfterInitialWait( () => this.currently.containsValue(value) )
  }
}

/**
 * This class defines all `currently` functions of ValuePageElement.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement for which ValuePageElementCurrently defines all `currently`
 * functions
 * @template ValueType the type of ValuePageElement's value
 */
export abstract class ValuePageElementCurrently<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends PageElementCurrently<Store, PageElementType> {

  /**
   * Returns the current value of ValuePageElement.
   */
  abstract getValue(): ValueType

  /**
   * Returns ValuePageElement's current 'hasValue' status.
   *
   * A ValuePageElement's 'hasValue' status is set to true if its actual value equals the expected value.
   *
   * @param value the expected value used in the comparison which sets the 'hasValue' status
   */
  getHasValue(value: ValueType) {
    return this.hasValue(value)
  }
  /**
   * Returns ValuePageElement's current 'hasAnyValue' status.
   *
   * A ValuePageElement's 'hasAnyValue' status is set to true if it has any value.
   */
  getHasAnyValue() {
    return this.hasAnyValue()
  }
  /**
   * Returns ValuePageElement's current 'containsValue' status.
   *
   * A ValuePageElement's 'containsValue' status is set to true if its actual value contains the expected value.
   *
   * @param value the expected value used in the comparison which sets the 'containsValue' status
   */
  getContainsValue(value: ValueType) {
    return this.containsValue(value)
  }
  /**
   * Returns true if the ValuePageElement's actual value currently equals the expected value.
   *
   * @param value the expected value which is supposed to equal the actual value
   */
  hasValue(value: ValueType) {
    return this._compareHas(value, this.getValue())
  }
  /**
   * Returns true if the ValuePageElement currently has any Value.
   */
  hasAnyValue() {
    return this._compareHasAny(this.getValue())
  }
  /**
   * Returns true if the ValuePageElement's actual value currently contains the expected value.
   *
   * @param value the expected value which is supposed to be contained in the actual value
   */
  containsValue(value: ValueType) {
    return this._compareContains(value, this.getValue())
  }

  /**
   * returns the negated variants of ValuePageElementCurrently's state check functions
   */
  get not() {
    return {...super.not,
      /**
       * Returns true if the ValuePageElement's actual value currently does not equal the expected value.
       *
       * @param value the expected value which is supposed not to equal the actual value
       */
      hasValue: (value: ValueType) => !this.hasValue(value),
      /**
       * Returns true if the ValuePageElement currently does not have any value.
       */
      hasAnyValue: () => !this.hasAnyValue(),
      /**
       * Returns true if the ValuePageElement's actual value currently does not contain the expected value.
       *
       * @param value the expected value which is supposed not to be contained in the actual value
       */
      containsValue: (value: ValueType) => !this.containsValue(value),
    }
  }
}

/**
 * This class defines all `wait` functions of ValuePageElement.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement for which ValuePageElementWait defines all `wait`
 * functions
 * @template ValueType the type of ValuePageElement's value
 */
export class ValuePageElementWait<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends PageElementWait<Store, PageElementType> {

  /**
   * Waits for ValuePageElement's actual value to equal the expected value.
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * @param value the expected value which is supposed to equal the actual value
   * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
   * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
   *
   * If no `timeout` is specified, ValuePageElement's default timeout is used.
   * If no `interval` is specified, ValuePageElement's default interval is used.
   *
   * @returns this (an instance of ValuePageElement)
   */
  hasValue(value: ValueType, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasProperty(
      'value', value, () => this._node.currently.hasValue(value), opts
    )
  }

  /**
   * Waits for ValuePageElement to have any value.
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
   * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
   *
   * If no `timeout` is specified, ValuePageElement's default timeout is used.
   * If no `interval` is specified, ValuePageElement's default interval is used.
   *
   * @returns this (an instance of ValuePageElement)
   */
  hasAnyValue(opts: Workflo.ITimeoutReverseInterval = {}) {
    return this._waitHasAnyProperty(
      'value', () => this._node.currently.hasAnyValue(), opts
    )
  }

  /**
   * Waits for ValuePageElement's actual value to contain the expected value.
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * @param value the expected value which is supposed to be contained in the actual value
   * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
   * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
   *
   * If no `timeout` is specified, ValuePageElement's default timeout is used.
   * If no `interval` is specified, ValuePageElement's default interval is used.
   *
   * @returns this (an instance of ValuePageElement)
   */
  containsValue(value: ValueType, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitContainsProperty(
      'value', value, () => this._node.currently.containsValue(value), opts
    )
  }

  /**
   * returns the negated variants of ValuePageElementWait's state check functions
   */
  get not() {
    return {...super.not,
      /**
       * Waits for ValuePageElement's actual value not to equal the expected value.
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * @param value the expected value which is supposed not to equal the actual value
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
       * check it
       *
       * If no `timeout` is specified, ValuePageElement's default timeout is used.
       * If no `interval` is specified, ValuePageElement's default interval is used.
       *
       * @returns this (an instance of ValuePageElement)
       */
      hasValue: (value: ValueType, opts?: Workflo.ITimeoutInterval) => {
        return this.hasValue(value, this._makeReverseParams(opts))
      },
      /**
       * Waits for ValuePageElement not to have any value.
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
       * check it
       *
       * If no `timeout` is specified, ValuePageElement's default timeout is used.
       * If no `interval` is specified, ValuePageElement's default interval is used.
       *
       * @returns this (an instance of ValuePageElement)
       */
      hasAnyValue: (opts?: Workflo.ITimeoutInterval) => {
        return this.hasAnyValue(this._makeReverseParams(opts))
      },
      /**
       * Waits for ValuePageElement's actual value not to contain the expected value.
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * @param value the expected value which is supposed not to be contained in the actual value
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
       * check it
       *
       * If no `timeout` is specified, ValuePageElement's default timeout is used.
       * If no `interval` is specified, ValuePageElement's default interval is used.
       *
       * @returns this (an instance of ValuePageElement)
       */
      containsValue: (value: ValueType, opts?: Workflo.ITimeoutInterval) => {
        return this.containsValue(value, this._makeReverseParams(opts))
      }
    }
  }
}

/**
 * This class defines all `eventually` functions of ValuePageElement.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement for which ValuePageElementEventually defines all `eventually`
 * functions
 * @template ValueType the type of ValuePageElement's value
 */
export class ValuePageElementEventually<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends PageElementEventually<Store, PageElementType> {

  /**
   * Returns true if PageElement's actual value eventually equals the expected value within a specific timeout.
   *
   * @param value the expected value which is supposed to equal PageElement's actual value
   * @param opts includes the `timeout` within which the condition is expected to be met and the
   * `interval` used to check it
   *
   * If no `timeout` is specified, PageElement's default timeout is used.
   * If no `interval` is specified, PageElement's default interval is used.
   */
  hasValue(value: ValueType, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasValue(value, opts))
  }

  /**
   * Returns true if PageElement eventually has any value within a specific timeout.
   *
   * @param opts includes the `timeout` within which the condition is expected to be met and the
   * `interval` used to check it
   *
   * If no `timeout` is specified, PageElement's default timeout is used.
   * If no `interval` is specified, PageElement's default interval is used.
   */
  hasAnyValue(opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasAnyValue(opts))
  }

  /**
   * Returns true if PageElement's actual value eventually contains the expected value within a specific timeout.
   *
   * @param value the expected value which is supposed to be contained in PageElement's actual value
   * @param opts includes the `timeout` within which the condition is expected to be met and the
   * `interval` used to check it
   *
   * If no `timeout` is specified, PageElement's default timeout is used.
   * If no `interval` is specified, PageElement's default interval is used.
   */
  containsValue(value: ValueType, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.containsValue(value, opts))
  }

  /**
   * returns the negated variants of ValuePageElementEventually's state check functions
   */
  get not() {
    return {...super.not,
      /**
       * Returns true if PageElement's actual value eventually does not equal the expected value within a specific timeout.
       *
       * @param value the expected value which is supposed not to equal PageElement's actual value
       * @param opts includes the `timeout` within which the condition is expected to be met and the
       * `interval` used to check it
       *
       * If no `timeout` is specified, PageElement's default timeout is used.
       * If no `interval` is specified, PageElement's default interval is used.
       */
      hasValue: (value: ValueType, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasValue(value, opts))
      },
      /**
       * Returns true if PageElement eventually does not have any value within a specific timeout.
       *
       * @param opts includes the `timeout` within which the condition is expected to be met and the
       * `interval` used to check it
       *
       * If no `timeout` is specified, PageElement's default timeout is used.
       * If no `interval` is specified, PageElement's default interval is used.
       */
      hasAnyValue: (opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasAnyValue(opts))
      },
      /**
       * Returns true if PageElement's actual value eventually does not contain the expected value within a specific
       * timeout.
       *
       * @param value the expected value which is supposed not to be contained in PageElement's actual value
       * @param opts includes the `timeout` within which the condition is expected to be met and the
       * `interval` used to check it
       *
       * If no `timeout` is specified, PageElement's default timeout is used.
       * If no `interval` is specified, PageElement's default interval is used.
       */
      containsValue: (value: ValueType, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.containsValue(value, opts))
      }
    }
  }
}