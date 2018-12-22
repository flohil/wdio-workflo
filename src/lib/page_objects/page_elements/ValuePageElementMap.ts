import { PageElementMap, ValuePageElement, IValuePageElementOpts, IPageElementMapOpts, PageElementMapCurrently, PageElementMapEventually, PageElementMapWait } from './'
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
implements Workflo.PageNode.IValueElementNode<Partial<Record<K, ValueType>>, Partial<Record<K, true>>> {

  readonly currently: ValuePageElementMapCurrently<Store, K, PageElementType, PageElementOptions, this, ValueType>
  readonly wait: ValuePageElementMapWait<Store, K, PageElementType, PageElementOptions, this, ValueType>
  readonly eventually: ValuePageElementMapEventually<Store, K, PageElementType, PageElementOptions, this, ValueType>

  constructor(
    selector: string,
    opts: IValuePageElementMapOpts<Store, K, PageElementType, PageElementOptions, ValueType>
  ) {
    super(selector, opts)

    this.currently = new ValuePageElementMapCurrently(this)
    this.wait = new ValuePageElementMapWait(this)
    this.eventually = new ValuePageElementMapEventually(this)
  }

  /**
   * Returns values of all list elements after performing an initial wait in the order they were retrieved from the DOM.
   *
   * If passing filter, only values defined in this mask will be returned.
   * By default (if no filter is passed), all values will be returned.
   *
   * @param filterMask a filter mask
   */
  getValue(filterMask?: Workflo.PageNode.MapFilterMask<K>) {
    return this.eachGet(this._$, node => node.getValue(), filterMask)
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
  setValue(values: Partial<Record<K, ValueType>>) {
    return this.eachSet(this._$, (element, value) => element.setValue(value), values)
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
   * @param filterMask a filter mask
   */
  getValue(filterMask?: Workflo.PageNode.MapFilterMask<K>) {
    return this._node.eachGet(this._node.$, node => node.currently.getValue(), filterMask)
  }

  hasValue(value: Partial<Record<K, ValueType>>) {
    return this._node.eachCheck(
      this._node.$, (element, expected) => element.currently.hasValue(expected), value
    )
  }

  hasAnyValue(filterMask?: Workflo.PageNode.MapFilterMask<K>) {
    return this._node.eachCheck(
      this._node.$, (element) => element.currently.hasAnyValue(), filterMask, true
    )
  }

  containsValue(value: Partial<Record<K, ValueType>>) {
    return this._node.eachCheck(
      this._node.$, (element, expected) => element.currently.containsValue(expected), value
    )
  }

  get not() {
    return {...super.not,
      hasValue: (value: Partial<Record<K, ValueType>>) => {
        return this._node.eachCheck(
          this._node.$, (element, expected) => element.currently.not.hasValue(expected), value
        )
      },
      hasAnyValue: (filterMask?: Workflo.PageNode.MapFilterMask<K>) => {
        return this._node.eachCheck(
          this._node.$, element => element.currently.not.hasAnyValue(), filterMask, true
        )
      },
      containsValue: (value: Partial<Record<K, ValueType>>) => {
        return this._node.eachCheck(
          this._node.$, (element, expected) => element.currently.not.containsValue(expected), value
        )
      }
    }
  }
}

class ValuePageElementMapWait<
  Store extends PageElementStore,
  K extends string,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  MapType extends ValuePageElementMap<Store, K, PageElementType, PageElementOptions, ValueType>,
  ValueType
> extends PageElementMapWait<Store, K, PageElementType, PageElementOptions, MapType> {

  hasValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait(
      this._node.$, (element, expected) => element.wait.hasValue(expected, opts), value
    )
  }

  hasAnyValue(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait(
      this._node.$, element => element.wait.hasAnyValue(otherOpts), filterMask,  true
    )
  }

  containsValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait(
      this._node.$, (element, expected) => element.wait.containsValue(expected, opts), value
    )
  }

  get not() {
    return {...super.not,
      hasValue: (value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait(
          this._node.$, (element, expected) => element.wait.not.hasValue(expected, opts), value
        )
      },
      hasAnyValue: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait(
          this._node.$, element => element.wait.not.hasAnyValue(otherOpts), filterMask,  true
        )
      },
      containsValue: (value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait(
          this._node.$, (element, expected) => element.wait.not.containsValue(expected, opts), value
        )
      }
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

  hasValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck(
      this._node.$, (element, expected) => element.eventually.hasValue(expected, opts), value
    )
  }

  hasAnyValue(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck(
      this._node.$, element => element.eventually.hasAnyValue(otherOpts), filterMask,  true
    )
  }

  containsValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck(
      this._node.$, (element, expected) => element.eventually.containsValue(expected, opts), value
    )
  }

  get not() {
    return {...super.not,
      hasValue: (value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck(
          this._node.$, (element, expected) => element.eventually.not.hasValue(expected, opts), value
        )
      },
      hasAnyValue: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck(
          this._node.$, element => element.eventually.not.hasAnyValue(otherOpts), filterMask,  true
        )
      },
      containsValue: (value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck(
          this._node.$, (element, expected) => element.eventually.not.containsValue(expected, opts), value
        )
      }
    }
  }
}