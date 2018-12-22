import { PageNode, IPageNodeOpts, PageElement, IPageElementOpts, PageNodeEventually, PageNodeCurrently, PageNodeWait } from '.'
import { PageElementStore } from '../stores'
import { XPathBuilder } from '../builders'
import _ = require('lodash');

// https://github.com/Microsoft/TypeScript/issues/14930

/**
 * Provides caller with selector of the map and the value of mappingObject's current property.
 * Theses can be used to build the selector of a map's element generically to identify it.
 */
export interface IPageElementMapIdentifier<K extends string> {
  mappingObject: Record<K, string>,
  func: ( mapSelector: string, mappingValue: string ) => XPathBuilder | string
}

// use disableCache for a "dynamic" list whose structure changes over time
// alternatively, call refresh() when the times of structure changes are known
export interface IPageElementMapOpts<
  Store extends PageElementStore,
  K extends string,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>
> extends IPageNodeOpts<Store> {
  store: Store,
  identifier: IPageElementMapIdentifier<K>,
  elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType,
  elementOptions: PageElementOptions
}

// holds several PageElement instances of the same type
export class PageElementMap<
  Store extends PageElementStore,
  K extends string,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>
> extends PageNode<Store>
implements Workflo.PageNode.IElementNode<
  Partial<Record<K, string>>, Partial<Record<K, boolean>>, Partial<Record<K, true>>
> {

  protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  protected _elementOptions: PageElementOptions
  protected _identifier: IPageElementMapIdentifier<K>

  protected _$: Record<K, PageElementType>
  protected _lastDiff: Workflo.IDiff

  readonly currently: PageElementMapCurrently<Store, K, PageElementType, PageElementOptions, this>
  readonly wait: PageElementMapWait<Store, K, PageElementType, PageElementOptions, this>
  readonly eventually: PageElementMapEventually<Store, K, PageElementType, PageElementOptions, this>

  constructor(
    protected _selector: string,
    {
      identifier,
      elementStoreFunc,
      elementOptions,
      ...superOpts
    } : IPageElementMapOpts<Store, K, PageElementType, PageElementOptions>
  ) {
    super(_selector, superOpts)

    this._selector = _selector
    this._elementOptions = elementOptions
    this._elementStoreFunc = elementStoreFunc
    this._identifier = identifier

    this._$ = Workflo.Object.mapProperties(
      this._identifier.mappingObject,
      (value, key) => <PageElementType> this._elementStoreFunc.apply(
        this._store, [
          this._identifier.func(this._selector, value),
          this._elementOptions
        ]
      )
    )

    this.currently = new PageElementMapCurrently(this)
    this.wait = new PageElementMapWait(this)
    this.eventually = new PageElementMapEventually(this)
  }

  get $() {
    return this._$
  }

  /**
   * In case of language changes, for example, change values of mappingObject while keys must stay the same.
   * @param mappingObject
   */
  changeMappingObject(mappingObject: Record<K, string>) {
    this._$ = Workflo.Object.mapProperties(
      mappingObject,
      (value, key) => <PageElementType> this._elementStoreFunc.apply(
        this._store, [
          this._identifier.func(this._selector, value),
          this._elementOptions
        ]
      )
    )
  }

  // GETTER FUNCTIONS

  getSelector() {
    return this._selector
  }

  __getTrue(filterMask?: Workflo.PageNode.MapFilterMask<K>) {
    return this.eachGet(this._$, node => node.__getTrue(), filterMask)
  }

   /**
   * Returns texts of all list elements after performing an initial wait in the order they were retrieved from the DOM.
   *
   * If passing filter, only values defined in this mask will be returned.
   * By default (if no filter is passed), all values will be returned.
   *
   * @param filter a filter mask
   */
  getText(filterMask?: Workflo.PageNode.MapFilterMask<K>) {
    return this.eachGet(this._$, node => node.getText(), filterMask)
  }

  getDirectText(filterMask?: Workflo.PageNode.MapFilterMask<K>) {
    return this.eachGet(this._$, node => node.getDirectText(), filterMask)
  }

  getIsEnabled(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>> {
    return this.eachGet(this.$, node => {
      node.wait.isEnabled()
      return node.currently.isEnabled()
    }, filterMask)
  }

  // HELPER FUNCTIONS

  eachCheck<T>(
    context: Record<K, PageElementType>,
    checkFunc: (element: PageElementType, expected?: T) => boolean,
    expected: Partial<Record<K, T>>,
    isFilterMask: boolean = false
  ): boolean {
    const diffs: Workflo.IDiffTree = {}

    for (const key in context) {
      if (expected) {
        if (isFilterMask) {
          if (typeof expected[key] === 'boolean' && expected[key]) {
            if (!checkFunc(context[key])) {
              diffs[`.${key}`] = context[key].__lastDiff
            }
          }
        } else {
          if (typeof expected[key] !== 'undefined') {
            if (!checkFunc(context[key], expected[key] as any as T)) {
              diffs[`.${key}`] = context[key].__lastDiff
            }
          }
        }
      } else {
        if (!checkFunc(context[key])) {
          diffs[`.${key}`] = context[key].__lastDiff
        }
      }
    }

    this._lastDiff = {
      tree: diffs
    }

    return Object.keys(diffs).length === 0
  }

  /**
   * Helper function to map element content nodes to a value by calling a node interface function on each node.
   *
   * If passing filter mask, only values defined in this mask will be returned.
   * By default (if no filter mask is passed), all values will be returned.
   *
   * @param getFunc
   * @param filterMask a filter mask
   */
  eachGet<
    ResultType
  >(
    context: Record<K, PageElementType>,
    getFunc: (node: PageElementType) => ResultType,
    filterMask: Workflo.PageNode.MapFilterMask<K>,
  ): Partial<Record<K, ResultType>> {
    let result = {} as Record<K, ResultType>;

    for (const k in context) {
      if (filterMask) {
        if (typeof filterMask[k] === 'boolean' && filterMask[k]) {
          result[k] = getFunc(context[k])
        }
      } else {
        result[k] = getFunc(context[k])
      }
    }

    return result;
  }

  eachWait<ValueType>(
    context: Record<K, PageElementType>,
    waitFunc: (element: PageElementType, expected?: ValueType) => PageElementType,
    expected: Partial<Record<K, ValueType>>,
    isFilterMask: boolean = false
  ): this {
    for (const key in context) {
      if (expected) {
        if (isFilterMask) {
          if (typeof expected[key] === 'boolean' && expected[key]) {
            waitFunc(context[key])
          }
        } else {
          if (typeof expected[key] !== 'undefined') {
            waitFunc(context[key], expected[key] as any as ValueType)
          }
        }
      } else {
        waitFunc(context[key], expected[key] as any as ValueType)
      }
    }

    return this
  }

  eachDo(
    context: Record<K, PageElementType>,
    doFunc: (element: PageElementType) => PageElementType,
    filterMask: Workflo.PageNode.MapFilterMask<K>,
  ): this {
    for (const key in context) {
      if (filterMask) {
        if (typeof filterMask[key] === 'boolean' && filterMask[key]) {
          doFunc(context[key])
        }
      } else {
        doFunc(context[key])
      }
    }

    return this
  }

  eachSet<ValueType>(
    context: Record<K, PageElementType>,
    setFunc: (element: PageElementType, value: ValueType) => PageElementType,
    values: Partial<Record<K, ValueType>>,
  ): this {
    for (const key in context) {
      if (values) {
        if (typeof values[key] !== 'undefined') {
          setFunc(context[key], values[key] as any as ValueType)
        }
      } else {
        setFunc(context[key], values[key] as any as ValueType)
      }
    }

    return this
  }
}

export class PageElementMapCurrently<
  Store extends PageElementStore,
  K extends string,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
  MapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>
> extends PageNodeCurrently<Store, MapType> {

  /**
   * Returns texts of all list elements immediatly in the order they were retrieved from the DOM.
   *
   * If passing filter, only values defined in this mask will be returned.
   * By default (if no filter is passed), all values will be returned.
   *
   * @param filter a filter mask
   */
  getText(filterMask?: Workflo.PageNode.MapFilterMask<K>) {
    return this._node.eachGet(
      this._node.$, node => node.currently.getText(), filterMask
    )
  }

  getDirectText(filterMask?: Workflo.PageNode.MapFilterMask<K>) {
    return this._node.eachGet(
      this._node.$, node => node.currently.getDirectText(), filterMask
    )
  }

  getExists(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>> {
    return this._node.eachGet(this._node.$, node => node.currently.exists(), filterMask)
  }

  getIsVisible(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>> {
    return this._node.eachGet(this._node.$, node => node.currently.isVisible(), filterMask)
  }

  getIsEnabled(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>> {
    return this._node.eachGet(this._node.$, node => node.currently.isEnabled(), filterMask)
  }

  exists(filterMask?: Workflo.PageNode.MapFilterMask<K>) {
    return this._node.eachCheck(
      this._node.$, element => element.currently.exists(), filterMask, true
    )
  }

  isVisible(filterMask?: Workflo.PageNode.MapFilterMask<K>) {
    return this._node.eachCheck(
      this._node.$, element => element.currently.isVisible(), filterMask, true
    )
  }

  isEnabled(filterMask?: Workflo.PageNode.MapFilterMask<K>) {
    return this._node.eachCheck(
      this._node.$, element => element.currently.isEnabled(), filterMask, true
    )
  }

  hasText(text: Partial<Record<K, string>>) {
    return this._node.eachCheck(
      this._node.$, (element, expected) => element.currently.hasText(expected), text
    )
  }

  hasAnyText(filterMask?: Workflo.PageNode.MapFilterMask<K>) {
    return this._node.eachCheck(
      this._node.$, (element) => element.currently.hasAnyText(), filterMask, true
    )
  }

  containsText(text: Partial<Record<K, string>>) {
    return this._node.eachCheck(
      this._node.$, (element, expected) => element.currently.containsText(expected), text
    )
  }

  hasDirectText(directText: Partial<Record<K, string>>) {
    return this._node.eachCheck(
      this._node.$, (element, expected) => element.currently.hasDirectText(expected), directText
    )
  }

  hasAnyDirectText(filterMask?: Workflo.PageNode.MapFilterMask<K>) {
    return this._node.eachCheck(
      this._node.$, (element) => element.currently.hasAnyDirectText(), filterMask, true
    )
  }

  containsDirectText(directText: Partial<Record<K, string>>) {
    return this._node.eachCheck(
      this._node.$, (element, expected) => element.currently.containsDirectText(expected), directText
    )
  }

  get not() {
    return {
      exists: (filterMask?: Workflo.PageNode.MapFilterMask<K>) => {
        return this._node.eachCheck(
          this._node.$, element => element.currently.not.exists(), filterMask, true
        )
      },
      isVisible: (filterMask?: Workflo.PageNode.MapFilterMask<K>) => {
        return this._node.eachCheck(
          this._node.$, element => element.currently.not.isVisible(), filterMask, true
        )
      },
      isEnabled: (filterMask?: Workflo.PageNode.MapFilterMask<K>) => {
        return this._node.eachCheck(
          this._node.$, element => element.currently.not.isEnabled(), filterMask, true
        )
      },
      hasText: (text: Partial<Record<K, string>>) => {
        return this._node.eachCheck(
          this._node.$, (element, expected) => element.currently.not.hasText(expected), text
        )
      },
      hasAnyText: (filterMask?: Workflo.PageNode.MapFilterMask<K>) => {
        return this._node.eachCheck(
          this._node.$, (element) => element.currently.not.hasAnyText(), filterMask, true
        )
      },
      containsText: (text: Partial<Record<K, string>>) => {
        return this._node.eachCheck(
          this._node.$, (element, expected) => element.currently.not.containsText(expected), text
        )
      },
      hasDirectText: (directText: Partial<Record<K, string>>) => {
        return this._node.eachCheck(
          this._node.$, (element, expected) => element.currently.not.hasDirectText(expected), directText
        )
      },
      hasAnyDirectText: (filterMask?: Workflo.PageNode.MapFilterMask<K>) => {
        return this._node.eachCheck(
          this._node.$, (element) => element.currently.not.hasAnyDirectText(), filterMask, true
        )
      },
      containsDirectText: (directText: Partial<Record<K, string>>) => {
        return this._node.eachCheck(
          this._node.$, (element, expected) => element.currently.not.containsDirectText(expected), directText
        )
      }
    }
  }
}

export class PageElementMapWait<
  Store extends PageElementStore,
  K extends string,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
  MapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>
> extends PageNodeWait<Store, MapType> {

  exists(opts: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait(
      this._node.$, element => element.wait.exists(otherOpts), filterMask, true
    )
  }

  isVisible(opts: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait(
      this._node.$, element => element.wait.isVisible(otherOpts), filterMask, true
    )
  }

  isEnabled(opts: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait(
      this._node.$, element => element.wait.isEnabled(otherOpts), filterMask, true
    )
  }

  hasText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait(
      this._node.$, (element, expected) => element.wait.hasText(expected, opts), text
    )
  }

  hasAnyText(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait(
      this._node.$, (element) => element.wait.hasAnyText(otherOpts), filterMask, true
    )
  }

  containsText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait(
      this._node.$, (element, expected) => element.wait.containsText(expected, opts), text
    )
  }

  hasDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait(
      this._node.$, (element, expected) => element.wait.hasDirectText(expected, opts), directText
    )
  }

  hasAnyDirectText(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait(
      this._node.$, (element) => element.wait.hasAnyDirectText(otherOpts), filterMask, true
    )
  }

  containsDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait(
      this._node.$, (element, expected) => element.wait.containsDirectText(expected, opts), directText
    )
  }

  get not() {
    return {
      exists: (opts: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait(
          this._node.$, element => element.wait.not.exists(otherOpts), filterMask, true
        )
      },
      isVisible: (opts: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait(
          this._node.$, element => element.wait.not.isVisible(otherOpts), filterMask, true
        )
      },
      isEnabled: (opts: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait(
          this._node.$, element => element.wait.not.isEnabled(otherOpts), filterMask, true
        )
      },
      hasText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait(
          this._node.$, (element, expected) => element.wait.not.hasText(expected, opts), text
        )
      },
      hasAnyText: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait(
          this._node.$, (element) => element.wait.not.hasAnyText(otherOpts), filterMask, true
        )
      },
      containsText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait(
          this._node.$, (element, expected) => element.wait.not.containsText(expected, opts), text
        )
      },
      hasDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait(
          this._node.$, (element, expected) => element.wait.not.hasDirectText(expected, opts), directText
        )
      },
      hasAnyDirectText: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait(
          this._node.$, (element) => element.wait.not.hasAnyDirectText(otherOpts), filterMask, true
        )
      },
      containsDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait(
          this._node.$, (element, expected) => element.wait.not.containsDirectText(expected, opts), directText
        )
      }
    }
  }
}

export class PageElementMapEventually<
  Store extends PageElementStore,
  K extends string,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
  MapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>
> extends PageNodeEventually<Store, MapType> {

  exists(opts: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck(
      this._node.$, element => element.eventually.exists(otherOpts), filterMask, true
    )
  }

  isVisible(opts: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck(
      this._node.$, element => element.eventually.isVisible(otherOpts), filterMask, true
    )
  }

  isEnabled(opts: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck(
      this._node.$, element => element.eventually.isEnabled(otherOpts), filterMask, true
    )
  }

  hasText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck(
      this._node.$, (element, expected) => element.eventually.hasText(expected, opts), text
    )
  }

  hasAnyText(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck(
      this._node.$, (element) => element.eventually.hasAnyText(otherOpts), filterMask, true
    )
  }

  containsText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck(
      this._node.$, (element, expected) => element.eventually.containsText(expected, opts), text
    )
  }

  hasDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck(
      this._node.$, (element, expected) => element.eventually.hasDirectText(expected, opts), directText
    )
  }

  hasAnyDirectText(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck(
      this._node.$, (element) => element.eventually.hasAnyDirectText(otherOpts), filterMask, true
    )
  }

  containsDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck(
      this._node.$, (element, expected) => element.eventually.containsDirectText(expected, opts), directText
    )
  }

  get not() {
    return {
      exists: (opts: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck(
          this._node.$, element => element.eventually.not.exists(otherOpts), filterMask, true
        )
      },
      isVisible: (opts: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck(
          this._node.$, element => element.eventually.not.isVisible(otherOpts), filterMask, true
        )
      },
      isEnabled: (opts: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck(
          this._node.$, element => element.eventually.not.isEnabled(otherOpts), filterMask, true
        )
      },
      hasText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck(
          this._node.$, (element, expected) => element.eventually.not.hasText(expected, opts), text
        )
      },
      hasAnyText: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck(
          this._node.$, (element) => element.eventually.not.hasAnyText(otherOpts), filterMask, true
        )
      },
      containsText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck(
          this._node.$, (element, expected) => element.eventually.not.containsText(expected, opts), text
        )
      },
      hasDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck(
          this._node.$, (element, expected) => element.eventually.not.hasDirectText(expected, opts), directText
        )
      },
      hasAnyDirectText: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck(
          this._node.$, (element) => element.eventually.not.hasAnyDirectText(otherOpts), filterMask, true
        )
      },
      containsDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck(
          this._node.$, (element, expected) => element.eventually.not.containsDirectText(expected, opts), directText
        )
      }
    }
  }
}