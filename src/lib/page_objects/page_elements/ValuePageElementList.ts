import { PageElementList, ValuePageElement, IValuePageElementOpts, IPageElementListOpts } from './'
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
implements Workflo.PageNode.IGetValue<ValueType[]>, Workflo.PageNode.ISetValue<ValueType[] | ValueType> {

  constructor(
    selector: string,
    opts: IValuePageElementListOpts<Store, PageElementType, PageElementOptions, ValueType>
  ) {
    super(selector, opts)
  }

  initialWait() {
    if (this._waitType === Workflo.WaitType.value) {
      this.wait.any.hasAnyValue()
    } else {
      super.initialWait()
    }
  }

  /**
   * Returns values of all list elements in the order they were retrieved from the DOM.
   */
  getValue(): ValueType[] {
    return this.all.map(valuePageElement => valuePageElement.getValue())
  }

  /**
   * Sets values on all list elements.
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