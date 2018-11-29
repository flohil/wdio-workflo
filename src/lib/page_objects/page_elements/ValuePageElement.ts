import {
  PageElement,
  IPageElementOpts,
  WdioElement,
  PageElementCurrently,
  PageElementWait,
  PageElementEventually,
} from './PageElement'
import { PageElementStore } from '../stores'

export interface IValuePageElementOpts<
  Store extends PageElementStore
> extends IPageElementOpts<Store> {}

export class ValuePageElement<
  Store extends PageElementStore
> extends PageElement<Store> {

  readonly currently: ValuePageElementCurrently<Store>
  readonly wait: ValuePageElementWait<Store, this>
  readonly eventually: ValuePageElementEventually<Store, this>

  constructor(selector: string, opts: IPageElementOpts<Store>) {
    super(selector, opts)

    this.currently = new ValuePageElementCurrently(this)
    this.wait = new ValuePageElementWait(this)
    this.eventually = new ValuePageElementEventually(this)
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
}

export class ValuePageElementCurrently<Store extends PageElementStore>
extends PageElementCurrently<Store> {

  getValue(): string {
    return this.element.getValue()
  }

  hasValue = (value: string) => this._compareHas(value, this.getValue())
  hasAnyValue = () => this._compareHasAny(this.getValue())
  containsValue = (value: string) => this._compareContains(value, this.getValue())

  not = Object.assign(super.not, {
    hasValue: (value: string) => !this.hasValue(value),
    hasAnyValue: () => !this.hasAnyValue(),
    containsValue: (value: string) => !this.containsValue(value),
  })
}

export class ValuePageElementWait<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store>
> extends PageElementWait<Store, PageElementType> {
  hasValue = (value: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
    'value', value, () => this._pageElement.currently.hasValue(value), opts
  )
  hasAnyValue = (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitWdioCheckFunc(
    'had any value', opts => this._pageElement.currently.element.waitForValue(opts.timeout, opts.reverse), opts
  )
  containsValue = (value: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitContainsProperty(
    'value', value, () => this._pageElement.currently.containsValue(value), opts
  )

  not = Object.assign(super.not, {
    hasValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasValue(value, this._makeReverseParams(opts))
    },
    hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasAnyValue(this._makeReverseParams(opts))
    },
    containsValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.containsValue(value, this._makeReverseParams(opts))
    }
  })
}

export class ValuePageElementEventually<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store>
> extends PageElementEventually<Store, PageElementType> {
  hasValue = (value: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasValue(value, opts))
  }
  hasAnyValue = (opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasAnyValue(opts))
  }
  containsValue = (value: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.containsValue(value, opts))
  }

  not = Object.assign(super.not, {
    hasValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasValue(value, opts))
    },
    hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasAnyValue(opts))
    },
    containsValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.containsValue(value, opts))
    }
  })
}