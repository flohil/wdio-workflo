import { PageElementMap, ValuePageElement, IValuePageElementOpts, IPageElementMapOpts } from './'
import { PageElementStore } from '../stores'

export interface IValuePageElementMapOpts<
  Store extends PageElementStore,
  K extends string,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ValueType
> extends IPageElementMapOpts<Store, K, PageElementType, PageElementOptions> {}

export class ValuePageElementMap<
  Store extends PageElementStore,
  K extends string,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ValueType
> extends PageElementMap<Store, K, PageElementType, PageElementOptions>
implements Workflo.PageNode.IGetValueNode<Record<K, ValueType>>, Workflo.PageNode.ISetValueNode<Record<K, ValueType>> {

  constructor(
    selector: string,
    opts: IValuePageElementMapOpts<Store, K, PageElementType, PageElementOptions, ValueType>
  ) {
    super(selector, opts)
  }

  /**
   * Returns values of all list elements in the order they were retrieved from the DOM.
   */
  getValue(): Record<K, ValueType> {
    let result = {} as Record<K, ValueType>;

    for (const k in this.$) {
      result[k] = this.$[k].getValue()
    }

    return result;
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
  setValue(values: Record<K, ValueType>) {
    for (const k in values) {
      this.$[k].setValue(values[k])
    }

    return this
  }
}