import { PageElementList, ValuePageElement, IValuePageElementOpts, IPageElementListOpts, PageElementListCurrently, PageElementListEventually, PageElementListWait } from './'
import { PageElementStore } from '../stores'
import _ = require('lodash');

export interface IValuePageElementListOpts<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ValueType
> extends IPageElementListOpts<Store, PageElementType, PageElementOptions> {}

export class ValuePageElementList<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ValueType
> extends PageElementList<Store, PageElementType, PageElementOptions>
implements Workflo.PageNode.IValueElementNode<ValueType[], ValueType[] | ValueType> {

  readonly currently: ValuePageElementListCurrently<Store, PageElementType, PageElementOptions, this, ValueType>
  readonly wait: ValuePageElementListWait<Store, PageElementType, PageElementOptions, this, ValueType>
  readonly eventually: ValuePageElementListEventually<Store, PageElementType, PageElementOptions, this, ValueType>

  constructor(
    selector: string,
    opts: IValuePageElementListOpts<Store, PageElementType, PageElementOptions, ValueType>
  ) {
    super(selector, opts)

    this.currently = new ValuePageElementListCurrently(this, opts)
    this.wait = new ValuePageElementListWait(this)
    this.eventually = new ValuePageElementListEventually(this)
  }

  initialWait() {
    if (this._waitType === Workflo.WaitType.value) {
      this.wait.any.hasAnyValue()
    } else {
      super.initialWait()
    }
  }

// GETTER FUNCTIONS

  /**
   * Returns values of all list elements in the order they were retrieved from the DOM
   * after the initial wait was performed.
   */
  getValue() {
    return this.eachGet(this.all, element => element.getValue())
  }

// SETTER FUNCTIONS

  /**
   * Sets values on all list elements after the initial wait was performed.
   *
   * If values is an array, the number of list elements must match the number of passed values.
   * The values will be assigned in the order that the list elements were retrieved from the DOM.
   *
   * If values is a single value, the same value will be set on all list elements.
   *
   * @param values
   */
  setValue(values: ValueType[] | ValueType) {
    return this.eachSet<ValueType>(
      this.all, (element, value) => element.currently.setValue(value), values
    )
  }
}

class ValuePageElementListCurrently<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>,
  ValueType
> extends PageElementListCurrently<Store, PageElementType, PageElementOptions, ListType> {

  /**
   * Returns values of all list elements in the order they were retrieved from the DOM immediatly.
   */
  getValue() {
    return this._node.eachGet(this.all, element => element.currently.getValue())
  }

  /**
   * Sets values on all list elements immediatly.
   *
   * If values is an array, the number of list elements must match the number of passed values.
   * The values will be assigned in the order that the list elements were retrieved from the DOM.
   *
   * If values is a single value, the same value will be set on all list elements.
   *
   * @param values
   */
  setValue(values: ValueType[] | ValueType) {
    return this._node.eachSet<ValueType>(
      this.all, (element, value) => element.currently.setValue(value), values
    )
  }

  // CHECK STATE

  hasValue(value: ValueType | ValueType[]) {
    return this._node.eachCheck(
      this.all, (element, expected) => element.currently.hasValue(expected), value
    )
  }

  hasAnyValue() {
    return this._node.eachCheck(this.all, (element) => element.currently.hasAnyValue())
  }

  containsValue(value: ValueType | ValueType[]) {
    return this._node.eachCheck(
      this.all, (element, expected) => element.currently.containsValue(expected), value
    )
  }

  not = {...super.not,
    hasValue: (value: ValueType | ValueType[]) => {
      return this._node.eachCheck(
        this.all, (element, expected) => element.currently.not.hasValue(expected), value
      )
    },
    hasAnyValue: () => {
      return this._node.eachCheck(this.all, (element) => element.currently.not.hasAnyValue())
    },
    containsValue: (value: ValueType | ValueType[]) => {
      return this._node.eachCheck(
        this.all, (element, expected) => element.currently.not.containsValue(expected), value
      )
    }
  }
}

class ValuePageElementListWait<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>,
  ValueType
> extends PageElementListWait<Store, PageElementType, PageElementOptions, ListType> {

  hasValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait(
      this._node.all, (element, expected) => element.wait.hasValue(expected, opts), value
    )
  }

  hasAnyValue(opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait(
      this._node.all, (element) => element.wait.hasAnyValue(opts),
    )
  }

  containsValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait(
      this._node.all, (element, expected) => element.wait.containsValue(expected, opts), value
    )
  }

  not = {...super.not,
    hasValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait(
        this._node.all, (element, expected) => element.wait.not.hasValue(expected, opts), value
      )
    },
    hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait(
        this._node.all, (element) => element.wait.not.hasAnyValue(opts)
      )
    },
    containsValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait(
        this._node.all, (element, expected) => element.wait.not.containsValue(expected, opts), value
      )
    }
  }
}

class ValuePageElementListEventually<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>,
  ValueType
> extends PageElementListEventually<Store, PageElementType, PageElementOptions, ListType> {

  // CHECK STATE

  hasValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck(
      this._node.all, (element, expected) => element.eventually.hasValue(expected, opts), value
    )
  }

  hasAnyValue(opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck(
      this._node.all, (element) => element.eventually.hasAnyValue(opts)
    )
  }

  containsValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck(
      this._node.all, (element, expected) => element.eventually.containsValue(expected, opts), value
    )
  }

  not = {...super.not,
    hasValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck(
        this._node.all, (element, expected) => element.eventually.not.hasValue(expected, opts), value
      )
    },
    hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck(
        this._node.all, undefined, (element) => element.eventually.not.hasAnyValue(opts)
      )
    },
    containsValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck(
        this._node.all, (element, expected) => element.eventually.not.containsValue(expected, opts), value
      )
    }
  }
}