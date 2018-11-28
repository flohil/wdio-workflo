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
  PageElementCurrently
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

  constructor(selector: string, opts: IPageElementOpts<Store>) {
    super(selector, opts)

    this.currently = new ValuePageElementCurrently(this)
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

  wait: IPageElementWait<Store, this> & IValuePageElementWait<Store, this> = Object.assign(super.wait, {
    hasValue: (value: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
      'value', value, () => this.currently.hasValue(value), opts
    ),
    hasAnyValue: (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitWdioCheckFunc(
      'had any value', opts => this.currently.element.waitForValue(opts.timeout, opts.reverse), opts
    ),
    containsValue: (value: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitContainsProperty(
      'value', value, () => this.currently.containsValue(value), opts
    ),
    not: {
      hasValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasValue(value, this._makeReverseParams(opts))
      },
      hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasAnyValue(this._makeReverseParams(opts))
      },
      containsValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.containsValue(value, this._makeReverseParams(opts))
      }
    }
  })

  eventually = Object.assign(super.eventually, {
    hasValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasValue(value, opts))
    },
    hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasAnyValue(opts))
    },
    containsValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.containsValue(value, opts))
    },
    not: {
      hasValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasValue(value, opts))
      },
      hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasAnyValue(opts))
      },
      containsValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.containsValue(value, opts))
      }
    }
  })
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

function getValue<Store extends PageElementStore>(element: WdioElement, pageElement?: PageElement<Store>): string {
  return elementExecute(() => element.getValue(), pageElement)
}