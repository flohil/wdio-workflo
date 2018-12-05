import { PageElementList, ValuePageElement, IValuePageElementOpts, IPageElementListOpts, PageElementListCurrently, PageElementListEventually } from './'
import { PageElementStore } from '../stores'
import _ = require('lodash');
import { stores } from '..';

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
implements Workflo.PageNode.IGetValueNode<ValueType[]>, Workflo.PageNode.ISetValueNode<ValueType[] | ValueType> {

  readonly currently: ValuePageElementListCurrently<Store, PageElementType, PageElementOptions, this, ValueType>
  readonly eventually: ValuePageElementListEventually<Store, PageElementType, PageElementOptions, this, ValueType>

  constructor(
    selector: string,
    opts: IValuePageElementListOpts<Store, PageElementType, PageElementOptions, ValueType>
  ) {
    super(selector, opts)

    this.currently = new ValuePageElementListCurrently(this, opts)
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
  getValue(): ValueType[] {
    return this.all.map(valuePageElement => valuePageElement.getValue())
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
    const allElements = this.all

    if (_.isArray(values)) {
      if (allElements.length !== values.length) {
        throw new Error(
          `${this.constructor.name}: ` +
          `Length of values array (${allElements.length}) did not match length of list page elements (${values.length})!`
        )
      } else {
        for ( let i = 0; i < allElements.length; i++) {
          allElements[i].setValue(values[i])
        }
      }
    } else {
      for ( let i = 0; i < allElements.length; i++) {
        allElements[i].setValue(values)
      }
    }

    return this
  }
}

class ValuePageElementListCurrently<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>,
  ValueType
> extends PageElementListCurrently<Store, PageElementType, PageElementOptions, ListType>
implements Workflo.PageNode.IGetValue<ValueType[]> {

  /**
   * Returns values of all list elements in the order they were retrieved from the DOM immediatly.
   */
  getValue() {
    return this.all.map(valuePageElement => valuePageElement.currently.getValue())
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
    const allElements = this.all

    if (_.isArray(values)) {
      if (allElements.length !== values.length) {
        throw new Error(
          `Length of values array (${allElements.length}) did not match length of list page elements (${values.length})!`
        )
      } else {
        for ( let i = 0; i < allElements.length; i++) {
          allElements[i].currently.setValue(values[i])
        }
      }
    } else {
      for ( let i = 0; i < allElements.length; i++) {
        allElements[i].currently.setValue(values)
      }
    }

    return this._node
  }

  // CHECK STATE

  hasValue(value: ValueType | ValueType[]) {
    return this._node.__compare((element, expected) => element.currently.hasValue(expected), value)
  }

  hasAnyValue() {
    return this._node.__compare(element => element.currently.hasAnyValue())
  }

  containsValue(value: ValueType | ValueType[]) {
    return this._node.__compare((element, expected) => element.currently.containsValue(expected), value)
  }

  not = {...super.not,
    hasValue: (value: ValueType | ValueType[]) => {
      return this._node.__compare((element, expected) => element.currently.not.hasValue(expected), value)
    },
    hasAnyValue: () => {
      return this._node.__compare(element => element.currently.not.hasAnyValue())
    },
    containsValue: (value: ValueType | ValueType[]) => {
      return this._node.__compare((element, expected) => element.currently.not.containsValue(expected), value)
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
    return this._node.__compare((element, expected) => element.eventually.hasValue(expected, opts), value)
  }

  hasAnyValue(opts?: Workflo.IWDIOParamsOptional) {
    return this._node.__compare(element => element.eventually.hasAnyValue(opts))
  }

  containsValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional) {
    return this._node.__compare((element, expected) => element.eventually.containsValue(expected, opts), value)
  }

  not = {...super.not,
    hasValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.__compare((element, expected) => element.eventually.not.hasValue(expected, opts), value)
    },
    hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.__compare(element => element.eventually.not.hasAnyValue(opts))
    },
    containsValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.__compare((element, expected) => element.eventually.not.containsValue(expected, opts), value)
    }
  }
}