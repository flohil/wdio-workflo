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
implements Workflo.PageNode.IElementNode<Partial<Record<K, string>>> {

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

   /**
   * Returns texts of all list elements after performing an initial wait in the order they were retrieved from the DOM.
   *
   * If passing filter, only values defined in this mask will be returned.
   * By default (if no filter is passed), all values will be returned.
   *
   * @param filter a filter mask
   */
  getText(filterMask?: Partial<Record<K, string>>) {
    return this.eachGet(this._$, filterMask, node => node.getText())
  }

  getDirectText(filterMask?: Partial<Record<K, string>>) {
    return this.eachGet(this._$, filterMask, node => node.getDirectText())
  }

  // HELPER FUNCTIONS

  eachCheck<T>(
    context: Record<K, PageElementType>,
    expected: Partial<Record<K, T>>,
    checkFunc: (element: PageElementType, expected?: T) => boolean
  ): boolean {
    const diffs: Workflo.IDiffTree = {}

    for (const key in context) {
      if (expected && typeof expected[key] !== 'undefined') {
        if (!checkFunc(context[key], expected[key] as any as T)) {
          diffs[key] = context[key].__lastDiff
        }
      } else {
        if (!checkFunc(context[key])) {
          diffs[key] = context[key].__lastDiff
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
    filterMask: Partial<Record<K, ResultType>>,
    getFunc: (node: PageElementType) => ResultType,
  ): Partial<Record<K, ResultType>> {
    let result = {} as Record<K, ResultType>;

    for (const k in context) {
      if (filterMask) {
        if (typeof filterMask[k] !== 'undefined') {
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
    expected: Partial<Record<K, ValueType>>,
    waitFunc: (element: PageElementType, expected?: ValueType) => PageElementType,
  ): this {
    for (const key in context) {
      if (expected && typeof expected[key] !== 'undefined') {
        waitFunc(context[key], expected[key] as any as ValueType)
      } else {
        waitFunc(context[key], expected[key] as any as ValueType)
      }
    }

    return this
  }

  eachDo(
    context: Record<K, PageElementType>,
    filterMask: Partial<Record<K, true>>,
    doFunc: (element: PageElementType) => PageElementType,
  ): this {
    for (const key in context) {
      if (filterMask && typeof filterMask[key] !== 'undefined') {
        doFunc(context[key])
      } else {
        doFunc(context[key])
      }
    }

    return this
  }

  eachSet<ValueType>(
    context: Record<K, PageElementType>,
    values: Partial<Record<K, ValueType>>,
    setFunc: (element: PageElementType, value: ValueType) => PageElementType,
  ): this {
    for (const key in context) {
      if (values && typeof values[key] !== 'undefined') {
        setFunc(context[key], values[key] as any as ValueType)
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
  getText(filterMask?: Partial<Record<K, string>>): Partial<Record<K, string>> {
    return this._node.eachGet(
      this._node.$, filterMask, node => node.currently.getText()
    )
  }

  getDirectText(filterMask?: Partial<Record<K, string>>): Partial<Record<K, string>> {
    return this._node.eachGet(
      this._node.$, filterMask, node => node.currently.getDirectText()
    )
  }

  isVisible(filterMask?: Partial<Record<K, true>>) {
    return this._node.eachCheck(
      this._node.$, filterMask, element => element.currently.isVisible()
    )
  }

  isEnabled(filterMask?: Partial<Record<K, true>>) {
    return this._node.eachCheck(
      this._node.$, filterMask, element => element.currently.isEnabled()
    )
  }

  hasText(text: Partial<Record<K, string>>) {
    return this._node.eachCheck(
      this._node.$, text, (element, expected) => element.currently.hasText(expected)
    )
  }

  hasAnyText(filterMask?: Partial<Record<K, string>>) {
    return this._node.eachCheck(
      this._node.$, filterMask, (element) => element.currently.hasAnyText()
    )
  }

  containsText(text: Partial<Record<K, string>>) {
    return this._node.eachCheck(
      this._node.$, text, (element, expected) => element.currently.containsText(expected)
    )
  }

  hasDirectText(directText: Partial<Record<K, string>>) {
    return this._node.eachCheck(
      this._node.$, directText, (element, expected) => element.currently.hasDirectText(expected)
    )
  }

  hasAnyDirectText(filterMask?: Partial<Record<K, string>>) {
    return this._node.eachCheck(
      this._node.$, filterMask, (element) => element.currently.hasAnyDirectText()
    )
  }

  containsDirectText(directText: Partial<Record<K, string>>) {
    return this._node.eachCheck(
      this._node.$, directText, (element, expected) => element.currently.containsDirectText(expected)
    )
  }

  not = {
    isVisible: (filterMask?: Partial<Record<K, true>>) => {
      return this._node.eachCheck(
        this._node.$, filterMask, element => element.currently.not.isVisible()
      )
    },
    isEnabled: (filterMask?: Partial<Record<K, true>>) => {
      return this._node.eachCheck(
        this._node.$, filterMask, element => element.currently.not.isEnabled()
      )
    },
    hasText: (text: Partial<Record<K, string>>) => {
      return this._node.eachCheck(
        this._node.$, text, (element, expected) => element.currently.not.hasText(expected)
      )
    },
    hasAnyText: (filterMask?: Partial<Record<K, string>>) => {
      return this._node.eachCheck(
        this._node.$, filterMask, (element) => element.currently.not.hasAnyText()
      )
    },
    containsText: (text: Partial<Record<K, string>>) => {
      return this._node.eachCheck(
        this._node.$, text, (element, expected) => element.currently.not.containsText(expected)
      )
    },
    hasDirectText: (directText: Partial<Record<K, string>>) => {
      return this._node.eachCheck(
        this._node.$, directText, (element, expected) => element.currently.not.hasDirectText(expected)
      )
    },
    hasAnyDirectText: (filterMask?: Partial<Record<K, string>>) => {
      return this._node.eachCheck(
        this._node.$, filterMask, (element) => element.currently.not.hasAnyDirectText()
      )
    },
    containsDirectText: (directText: Partial<Record<K, string>>) => {
      return this._node.eachCheck(
        this._node.$, directText, (element, expected) => element.currently.not.containsDirectText(expected)
      )
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

  isVisible(opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, true>>} = {}) {
    return this._node.eachWait(
      this._node.$, opts.filterMask, element => element.wait.isVisible()
    )
  }

  isEnabled(opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, true>>} = {}) {
    return this._node.eachWait(
      this._node.$, opts.filterMask, element => element.wait.isEnabled()
    )
  }

  hasText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait(
      this._node.$, text, (element, expected) => element.wait.hasText(expected, opts)
    )
  }

  hasAnyText(opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, string>>} = {}) {
    return this._node.eachWait(
      this._node.$, opts.filterMask, (element) => element.wait.hasAnyText(opts)
    )
  }

  containsText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait(
      this._node.$, text, (element, expected) => element.wait.containsText(expected, opts)
    )
  }

  hasDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait(
      this._node.$, directText, (element, expected) => element.wait.hasDirectText(expected, opts)
    )
  }

  hasAnyDirectText(opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, string>>} = {}) {
    return this._node.eachWait(
      this._node.$, opts.filterMask, (element) => element.wait.hasAnyDirectText(opts)
    )
  }

  containsDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait(
      this._node.$, directText, (element, expected) => element.wait.containsDirectText(expected, opts)
    )
  }

  not = {
    isVisible: (opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, true>>} = {}) => {
      return this._node.eachWait(
        this._node.$, opts.filterMask, element => element.wait.not.isVisible()
      )
    },
    isEnabled: (opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, true>>} = {}) => {
      return this._node.eachWait(
        this._node.$, opts.filterMask, element => element.wait.not.isEnabled()
      )
    },
    hasText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait(
        this._node.$, text, (element, expected) => element.wait.not.hasText(expected, opts)
      )
    },
    hasAnyText: (opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, string>>} = {}) => {
      return this._node.eachWait(
        this._node.$, opts.filterMask, (element) => element.wait.not.hasAnyText(opts)
      )
    },
    containsText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait(
        this._node.$, text, (element, expected) => element.wait.not.containsText(expected, opts)
      )
    },
    hasDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait(
        this._node.$, directText, (element, expected) => element.wait.not.hasDirectText(expected, opts)
      )
    },
    hasAnyDirectText: (opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, string>>} = {}) => {
      return this._node.eachWait(
        this._node.$, opts.filterMask, (element) => element.wait.not.hasAnyDirectText(opts)
      )
    },
    containsDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait(
        this._node.$, directText, (element, expected) => element.wait.not.containsDirectText(expected, opts)
      )
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

  isVisible(opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, true>>} = {}) {
    return this._node.eachCheck(
      this._node.$, opts.filterMask, element => element.eventually.isVisible()
    )
  }

  isEnabled(opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, true>>} = {}) {
    return this._node.eachCheck(
      this._node.$, opts.filterMask, element => element.eventually.isEnabled()
    )
  }

  hasText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck(
      this._node.$, text, (element, expected) => element.eventually.hasText(expected, opts)
    )
  }

  hasAnyText(opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, string>>} = {}) {
    return this._node.eachCheck(
      this._node.$, opts.filterMask, (element) => element.eventually.hasAnyText(opts)
    )
  }

  containsText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck(
      this._node.$, text, (element, expected) => element.eventually.containsText(expected, opts)
    )
  }

  hasDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck(
      this._node.$, directText, (element, expected) => element.eventually.hasDirectText(expected, opts)
    )
  }

  hasAnyDirectText(opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, string>>} = {}) {
    return this._node.eachCheck(
      this._node.$, opts.filterMask, (element) => element.eventually.hasAnyDirectText(opts)
    )
  }

  containsDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck(
      this._node.$, directText, (element, expected) => element.eventually.containsDirectText(expected, opts)
    )
  }

  not = {
    isVisible: (opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, true>>} = {}) => {
      return this._node.eachCheck(
        this._node.$, opts.filterMask, element => element.eventually.not.isVisible()
      )
    },
    isEnabled: (opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, true>>} = {}) => {
      return this._node.eachCheck(
        this._node.$, opts.filterMask, element => element.eventually.not.isEnabled()
      )
    },
    hasText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck(
        this._node.$, text, (element, expected) => element.eventually.not.hasText(expected, opts)
      )
    },
    hasAnyText: (opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, string>>} = {}) => {
      return this._node.eachCheck(
        this._node.$, opts.filterMask, (element) => element.eventually.not.hasAnyText(opts)
      )
    },
    containsText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck(
        this._node.$, text, (element, expected) => element.eventually.not.containsText(expected, opts)
      )
    },
    hasDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck(
        this._node.$, directText, (element, expected) => element.eventually.not.hasDirectText(expected, opts)
      )
    },
    hasAnyDirectText: (opts: Workflo.IWDIOParamsOptional & {filterMask?: Partial<Record<K, string>>} = {}) => {
      return this._node.eachCheck(
        this._node.$, opts.filterMask, (element) => element.eventually.not.hasAnyDirectText(opts)
      )
    },
    containsDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck(
        this._node.$, directText, (element, expected) => element.eventually.not.containsDirectText(expected, opts)
      )
    }
  }
}