import {
  PageElement,
  IPageElement,
  IPageElementCurrently,
  IPageElementWaitEventuallyBase,
  IPageElementCheckState,
  IPageElementWait,
  IPageElementEventually,
  IPageElementGetState,
  IPageElementOpts,
  WdioElement,
  elementExecute,
  PageElementCurrently,
  PageElementWait,
  PageElementEventually
} from './PageElement'
import { PageElementStore } from '../stores'

export interface IValuePageElementOpts<
  Store extends PageElementStore
> extends IPageElementOpts<Store> {}

export interface IValuePageElementWaitEventuallyBase<OptionalParams, ReturnType>
extends IPageElementWaitEventuallyBase<OptionalParams, ReturnType> {
  hasValue: (value: string, opts?: OptionalParams) => ReturnType,
  hasAnyValue: (opts?: OptionalParams) => ReturnType,
  containsValue: (value: string, opts?: OptionalParams) => ReturnType,
}

export interface IValuePageElementWait<
  Store extends PageElementStore,
  PageElementType extends IValuePageElement<Store>
> extends
  IPageElementWait<Store, PageElementType>,
  IValuePageElementWaitEventuallyBase<Workflo.IWDIOParamsOptionalReverse, PageElementType>
{
  not: IValuePageElementWaitEventuallyBase<Workflo.IWDIOParamsOptionalReverse, PageElementType>
}

export interface IValuePageElementEventually<
  Store extends PageElementStore,
  PageElementType extends IValuePageElement<Store>
> extends
  IPageElementEventually<Store, PageElementType>,
  IValuePageElementWaitEventuallyBase<Workflo.IWDIOParamsOptional, boolean>
{
  not: IValuePageElementWaitEventuallyBase<Workflo.IWDIOParamsOptional, boolean>
}

export interface IValuePageElementCheckState extends IPageElementCheckState {
  hasValue: (value: string) => boolean
  hasAnyValue: () => boolean
  containsValue: (value: string) => boolean
}

export interface IValuePageElementGetState extends IPageElementGetState {
  getValue: () => string
}

export interface IValuePageElementCurrently extends
  IPageElementCurrently,
  IValuePageElementCheckState,
  IValuePageElementGetState
{
  not: IValuePageElementCheckState
}

export interface IValuePageElement<Store extends PageElementStore> extends
  IPageElement<Store>, IValuePageElementGetState
{
  currently: IValuePageElementCurrently
  wait: IPageElementWait<Store, this> & IValuePageElementWait<Store, this>
  eventually: IPageElementEventually<Store, this> & IValuePageElementEventually<Store, this>
}

export class ValuePageElement<
  Store extends PageElementStore
> extends PageElement<Store> implements IValuePageElement<Store> {

  readonly currently: IValuePageElementCurrently
  readonly wait: IValuePageElementWait<Store, this>
  readonly eventually: IValuePageElementEventually<Store, this>

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

  getValue() { return getValue(this.element) }
}

class ValuePageElementCurrently<Store extends PageElementStore>
extends PageElementCurrently<Store>
implements IValuePageElementCurrently, IValuePageElementGetState {
  getValue() { return getValue(this.element, this._pageElement) }

  hasValue = (value: string) => this._compareHas(value, this.getValue())
  hasAnyValue = () => this._compareHasAny(this.getValue())
  containsValue = (value: string) => this._compareContains(value, this.getValue())

  not = Object.assign(super.not, {
    hasValue: (value: string) => !this.hasValue(value),
    hasAnyValue: () => !this.hasAnyValue(),
    containsValue: (value: string) => !this.containsValue(value),
  })
}

class ValuePageElementWait<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store>
> extends PageElementWait<Store, PageElementType>
implements IValuePageElementWait<Store, PageElementType> {
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

class ValuePageElementEventually<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store>
> extends PageElementEventually<Store, PageElementType>
implements IValuePageElementEventually<Store, PageElementType> {
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

function getValue<Store extends PageElementStore>(element: WdioElement, pageElement?: PageElement<Store>): string {
  return elementExecute(() => element.getValue(), pageElement)
}