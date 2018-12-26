import {
  PageElement,
  IPageElementOpts,
  PageElementCurrently,
  PageElementWait,
  PageElementEventually,
} from './PageElement'
import { PageElementStore } from '../stores'

export interface IValuePageElementOpts<
  Store extends PageElementStore
> extends IPageElementOpts<Store> {}

export abstract class ValuePageElement<
  Store extends PageElementStore,
  ValueType
> extends PageElement<Store> implements Workflo.PageNode.IValueElementNode<ValueType, boolean> {

  readonly abstract currently: ValuePageElementCurrently<Store, this, ValueType>
  readonly wait: ValuePageElementWait<Store, this, ValueType>
  readonly eventually: ValuePageElementEventually<Store, this, ValueType>

  constructor(selector: string, opts: IPageElementOpts<Store>) {
    super(selector, opts)

    this.wait = new ValuePageElementWait(this)
    this.eventually = new ValuePageElementEventually(this)
  }

  /**
   * Sets the value of this PageElement.
   *
   * @param value
   */
  abstract setValue(value: ValueType): this

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

  getValue() {
    return this._executeAfterInitialWait( () => this.currently.getValue() )
  }

  getHasValue(value: ValueType) {
    return this._executeAfterInitialWait( () => this.currently.hasValue(value) )
  }

  getHasAnyValue() {
    return this._executeAfterInitialWait( () => this.currently.hasAnyValue() )
  }

  getContainsValue(value: ValueType) {
    return this._executeAfterInitialWait( () => this.currently.containsValue(value) )
  }
}

export abstract class ValuePageElementCurrently<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends PageElementCurrently<Store, PageElementType> {

  abstract getValue(): ValueType

  getHasValue(value: ValueType) {
    return this.hasValue(value)
  }

  getHasAnyValue() {
    return this.hasAnyValue()
  }

  getContainsValue(value: ValueType) {
    return this.containsValue(value)
  }

  hasValue(value: ValueType) {
    return this._compareHas(value, this.getValue())
  }

  hasAnyValue() {
    return this._compareHasAny(this.getValue())
  }

  containsValue(value: ValueType) {
    return this._compareContains(value, this.getValue())
  }

  get not() {
    return {...super.not,
      hasValue: (value: ValueType) => !this.hasValue(value),
      hasAnyValue: () => !this.hasAnyValue(),
      containsValue: (value: ValueType) => !this.containsValue(value),
    }
  }
}

export class ValuePageElementWait<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends PageElementWait<Store, PageElementType> {

  hasValue(value: ValueType, opts?: Workflo.IWDIOParamsReverseInterval) {
    return this._waitHasProperty(
      'value', value, () => this._node.currently.hasValue(value), opts
    )
  }

  hasAnyValue(opts: Workflo.IWDIOParamsReverseInterval = {}) {
    return this._waitHasAnyProperty(
      'value', () => this._node.currently.hasAnyValue(), opts
    )
  }

  containsValue(value: ValueType, opts?: Workflo.IWDIOParamsReverseInterval) {
    return this._waitContainsProperty(
      'value', value, () => this._node.currently.containsValue(value), opts
    )
  }

  get not() {
    return {...super.not,
      hasValue: (value: ValueType, opts?: Workflo.IWDIOParamsInterval) => {
        return this.hasValue(value, this._makeReverseParams(opts))
      },
      hasAnyValue: (opts?: Workflo.IWDIOParamsInterval) => {
        return this.hasAnyValue(this._makeReverseParams(opts))
      },
      containsValue: (value: ValueType, opts?: Workflo.IWDIOParamsInterval) => {
        return this.containsValue(value, this._makeReverseParams(opts))
      }
    }
  }
}

export class ValuePageElementEventually<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends PageElementEventually<Store, PageElementType> {

  hasValue(value: ValueType, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.__eventually(() => this._node.wait.hasValue(value, opts))
  }

  hasAnyValue(opts?: Workflo.IWDIOParamsInterval) {
    return this._node.__eventually(() => this._node.wait.hasAnyValue(opts))
  }

  containsValue(value: ValueType, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.__eventually(() => this._node.wait.containsValue(value, opts))
  }

  get not() {
    return {...super.not,
      hasValue: (value: ValueType, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasValue(value, opts))
      },
      hasAnyValue: (opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasAnyValue(opts))
      },
      containsValue: (value: ValueType, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.__eventually(() => this._node.wait.not.containsValue(value, opts))
      }
    }
  }
}