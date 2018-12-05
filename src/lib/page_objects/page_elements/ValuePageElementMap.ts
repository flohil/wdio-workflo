import { PageElementMap, ValuePageElement, IValuePageElementOpts, IPageElementMapOpts, PageElementMapCurrently, PageElementMapEventually } from './'
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
implements Workflo.PageNode.IGetValueNode<Partial<Record<K, ValueType>>>,
Workflo.PageNode.ISetValueNode<ExtractValue<Record<K, PageElementType>>> {

  readonly currently: ValuePageElementMapCurrently<Store, K, PageElementType, PageElementOptions, this, ValueType>
  readonly eventually: ValuePageElementMapEventually<Store, K, PageElementType, PageElementOptions, this, ValueType>

  constructor(
    selector: string,
    opts: IValuePageElementMapOpts<Store, K, PageElementType, PageElementOptions, ValueType>
  ) {
    super(selector, opts)

    this.currently = new ValuePageElementMapCurrently(this)
    this.eventually = new ValuePageElementMapEventually(this)
  }

  /**
   * Returns values of all list elements after performing an initial wait in the order they were retrieved from the DOM.
   *
   * If passing filter, only values defined in this mask will be returned.
   * By default (if no filter is passed), all values will be returned.
   *
   * @param filter a filter mask
   */
  getValue(filter?: Partial<Record<K, ValueType>>): Partial<Record<K, ValueType>> {
    return this.__getInterfaceFunc(this.$, node => node.getValue(), filter)
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
  MapType extends ValuePageElementMap<Store, K, PageElementType, PageElementOptions, ValueType>,
  ValueType
> extends PageElementMapCurrently<Store, K, PageElementType, PageElementOptions, MapType> {

  /**
   * Returns values of all list elements immediatly in the order they were retrieved from the DOM.
   *
   * If passing filter, only values defined in this mask will be returned.
   * By default (if no filter is passed), all values will be returned.
   *
   * @param filter a filter mask
   */
  getValue(filter?: Partial<Record<K, ValueType>>): Partial<Record<K, ValueType>> {
    return this._node.__getInterfaceFunc(this._node.$, node => node.currently.getValue(), filter)
  }

  setValue(values: ExtractValue<Partial<Record<K, PageElementType>>>) {
    for (const k in values) {
      this._node.$[k].currently.setValue(values[k])
    }

    return this._node
  }

  hasValue(value: Partial<Record<K, ValueType>>) {
    return this._node.__compare((element, expected) => element.currently.hasValue(expected), value)
  }

  hasAnyValue() {
    return this._node.__compare(element => element.currently.hasAnyValue())
  }

  containsValue(value: Partial<Record<K, ValueType>>) {
    return this._node.__compare((element, expected) => element.currently.containsValue(expected), value)
  }

  not = {...super.not,
    hasValue: (value: Partial<Record<K, ValueType>>) => {
      return this._node.__compare((element, expected) => element.currently.not.hasValue(expected), value)
    },
    hasAnyValue: () => {
      return this._node.__compare(element => element.currently.not.hasAnyValue())
    },
    containsValue: (value: Partial<Record<K, ValueType>>) => {
      return this._node.__compare((element, expected) => element.currently.not.containsValue(expected), value)
    }
  }
}

class ValuePageElementMapEventually<
  Store extends PageElementStore,
  K extends string,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  MapType extends ValuePageElementMap<Store, K, PageElementType, PageElementOptions, ValueType>,
  ValueType
> extends PageElementMapEventually<Store, K, PageElementType, PageElementOptions, MapType> {

  hasValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.__compare((element, expected) => element.eventually.hasValue(expected, opts), value)
  }

  hasAnyValue(opts?: Workflo.IWDIOParamsOptional) {
    return this._node.__compare(element => element.eventually.hasAnyValue(opts))
  }

  containsValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.__compare((element, expected) => element.eventually.containsValue(expected, opts), value)
  }

  not = {...super.not,
    hasValue: (value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.__compare((element, expected) => element.eventually.not.hasValue(expected, opts), value)
    },
    hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.__compare(element => element.eventually.not.hasAnyValue(opts))
    },
    containsValue: (value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.__compare((element, expected) => element.eventually.not.containsValue(expected, opts), value)
    }
  }
}