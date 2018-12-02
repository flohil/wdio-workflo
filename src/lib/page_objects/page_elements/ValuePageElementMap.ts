import { PageElementMap, ValuePageElement, IValuePageElementOpts, IPageElementMapOpts, PageElementMapCurrently } from './'
import { PageElementStore } from '../stores'

export interface IValuePageElementMapOpts<
  Store extends PageElementStore,
  K extends string,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ValueType
> extends IPageElementMapOpts<Store, K, PageElementType, PageElementOptions> {}

type ExtractValue<T extends {[key: string]: Workflo.PageNode.INode}> = {
  [P in keyof T]: T[P] extends Workflo.PageNode.IGetValueNode<any> ? ReturnType<T[P]['getValue']> : undefined;
}

export class ValuePageElementMap<
  Store extends PageElementStore,
  K extends string,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ValueType
> extends PageElementMap<Store, K, PageElementType, PageElementOptions>
implements Workflo.PageNode.IGetValueNode<Record<K, ValueType>>,
Workflo.PageNode.ISetValueNode<ExtractValue<Record<K, PageElementType>>> {

  readonly currently: ValuePageElementMapCurrently<Store, K, PageElementType, PageElementOptions, this, ValueType>

  constructor(
    selector: string,
    opts: IValuePageElementMapOpts<Store, K, PageElementType, PageElementOptions, ValueType>
  ) {
    super(selector, opts)

    this.currently = new ValuePageElementMapCurrently(this)
  }

  /**
   * Returns values of all list elements in the order they were retrieved from the DOM.
   */
  getValue(): Record<K, ValueType> {
    return this.__getInterfaceFunc(this.$, node => node.getValue())
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
  setValue(values: ExtractValue<Partial<Record<K, PageElementType>>>) {
    for (const k in values) {
      this.$[k].setValue(values[k])
    }

    return this
  }
}

class ValuePageElementMapCurrently<
  Store extends PageElementStore,
  K extends string,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  MapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>,
  ValueType
> extends PageElementMapCurrently<Store, K, PageElementType, PageElementOptions, MapType>
implements Workflo.PageNode.IGetValue<Record<K, ValueType>>,
  Workflo.PageNode.ISetValueWithContext<ExtractValue<Record<K, PageElementType>>, MapType> {

  getValue(): Record<K, ValueType> {
    return this._node.__getInterfaceFunc(this._node.$, node => node.currently.getValue())
  }

  setValue(values: ExtractValue<Partial<Record<K, PageElementType>>>) {
    for (const k in values) {
      this._node.$[k].currently.setValue(values[k])
    }

    return this._node
  }
}
