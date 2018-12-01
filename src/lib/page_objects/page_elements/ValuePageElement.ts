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
> extends PageElement<Store> implements Workflo.PageNode.IGetValue<ValueType>, Workflo.PageNode.ISetValue<ValueType> {

  abstract readonly currently: ValuePageElementCurrently<Store, this, ValueType>
  readonly wait: ValuePageElementWait<Store, this, ValueType>
  readonly eventually: ValuePageElementEventually<Store, this, ValueType>

  constructor(selector: string, opts: IPageElementOpts<Store>) {
    super(selector, opts)
  }

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
    return this._execute( () => this.currently.getValue() )
  }

  abstract setValue<ValueType>(value: ValueType): this
}

export abstract class ValuePageElementCurrently<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends PageElementCurrently<Store, PageElementType> {

  abstract getValue(): ValueType

  hasValue(value: ValueType) {
    return this._compareHas(value, this.getValue())
  }
  hasAnyValue() {
    return this._compareHasAny(this.getValue())
  }
  containsValue(value: ValueType) {
    return this._compareContains(value, this.getValue())
  }

  not = Object.assign(super.not, {
    hasValue: (value: ValueType) => !this.hasValue(value),
    hasAnyValue: () => !this.hasAnyValue(),
    containsValue: (value: ValueType) => !this.containsValue(value),
  })
}

export class ValuePageElementWait<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends PageElementWait<Store, PageElementType> {
  hasValue(value: ValueType, opts?: Workflo.IWDIOParamsOptionalReverse) {
    return this._waitHasProperty(
      'value', value, () => this._pageElement.currently.hasValue(value), opts
    )
  }
  hasAnyValue(opts?: Workflo.IWDIOParamsOptionalReverse) {
    return this._waitWdioCheckFunc(
      'had any value', opts => this._pageElement.currently.element.waitForValue(opts.timeout, opts.reverse), opts
    )
  }
  containsValue(value: ValueType, opts?: Workflo.IWDIOParamsOptionalReverse) {
    return this._waitContainsProperty(
      'value', value, () => this._pageElement.currently.containsValue(value), opts
    )
  }

  not = Object.assign(super.not, {
    hasValue: (value: ValueType, opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasValue(value, this._makeReverseParams(opts))
    },
    hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasAnyValue(this._makeReverseParams(opts))
    },
    containsValue: (value: ValueType, opts?: Workflo.IWDIOParamsOptional) => {
      return this.containsValue(value, this._makeReverseParams(opts))
    }
  })
}

export class ValuePageElementEventually<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends PageElementEventually<Store, PageElementType> {
  hasValue(value: ValueType, opts?: Workflo.IWDIOParamsOptional) {
    return this._eventually(() => this._pageElement.wait.hasValue(value, opts))
  }
  hasAnyValue(opts?: Workflo.IWDIOParamsOptional) {
    return this._eventually(() => this._pageElement.wait.hasAnyValue(opts))
  }
  containsValue(value: ValueType, opts?: Workflo.IWDIOParamsOptional) {
    return this._eventually(() => this._pageElement.wait.containsValue(value, opts))
  }

  not = Object.assign(super.not, {
    hasValue: (value: ValueType, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasValue(value, opts))
    },
    hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasAnyValue(opts))
    },
    containsValue: (value: ValueType, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.containsValue(value, opts))
    }
  })
}