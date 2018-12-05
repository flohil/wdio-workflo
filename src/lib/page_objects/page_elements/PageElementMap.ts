import { PageNode, IPageNodeOpts, PageElement, IPageElementOpts } from '.'
import { PageElementStore } from '../stores'
import { XPathBuilder } from '../builders'
import _ = require('lodash');
import { pageObjects } from '../../..';

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
implements Workflo.PageNode.IGetTextNode<Partial<Record<K, string>>> {

  protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  protected _elementOptions: PageElementOptions
  protected _identifier: IPageElementMapIdentifier<K>

  protected _$: Record<K, PageElementType>
  protected _lastDiff: Workflo.PageNode.IDiff

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
   * Returns values of all list elements in the order they were retrieved from the DOM.
   */
  getText(filterMask?: Partial<Record<K, boolean>>): Partial<Record<K, string>> {
    return this.eachGet(this._$, filterMask, node => node.getText())
  }

  // HELPER FUNCTIONS

  eachCheck<T>(
    context: Record<K, PageElementType>,
    expected: Partial<Record<K, T>>,
    compareFunc: (element: PageElementType, expected?: T) => boolean
  ): boolean {
    const diffs: Workflo.PageNode.IDiffTree = {}

    for (const key in expected) {
      if (!compareFunc(context[key], expected[key] as any as T)) {
        diffs[key] = context[key].__lastDiff
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
   * If passing filter mask, only values set to true in this mask will be returned.
   * By default (if no filter mask is passed), all values will be returned.
   *
   * @param getFunc
   * @param filterMask a filter mask
   */
  eachGet<
    Store extends PageElementStore,
    PageElementType extends PageElement<Store>,
    ResultType
  >(
    context: Record<K, PageElementType>,
    filterMask: Partial<Record<K, ResultType | boolean>>,
    getFunc: (node: PageElementType) => ResultType,
  ): Record<K, ResultType> {
    let result = {} as Record<K, ResultType>;

    for (const k in context) {
      if (filterMask) {
        if (filterMask[k] === true) {
          result[k] = getFunc(context[k])
        }
      } else {
        result[k] = getFunc(context[k])
      }
    }

    return result;
  }

  eachWait<T>(
    context: Record<K, PageElementType>,
    expected: Partial<Record<K, T>>,
    waitFunc: (element: PageElementType, expected?: T) => PageElementType,
  ): this {
    for (const key in expected) {
      waitFunc(context[key], expected[key] as any as T)
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
> {

  protected readonly _node: MapType

  constructor(node: MapType) {
    this._node = node
  }

  getText(filterMask?: Partial<Record<K, boolean>>): Partial<Record<K, string>> {
    return this._node.eachGet(
      this._node.$, filterMask, node => node.currently.getText()
    )
  }

  hasText(text: Partial<Record<K, string>>) {
    return this._node.eachCheck(
      this._node.$, text, (element, expected) => element.currently.hasText(expected)
    )
  }

  containsText(text: Partial<Record<K, string>>) {
    return this._node.eachCheck(
      this._node.$, text, (element, expected) => element.currently.containsText(expected)
    )
  }

  not = {
    hasText: (text: Partial<Record<K, string>>) => {
      return this._node.eachCheck(
        this._node.$, text, (element, expected) => element.currently.not.hasText(expected)
      )
    },
    containsText: (text: Partial<Record<K, string>>) => {
      return this._node.eachCheck(
        this._node.$, text, (element, expected) => element.currently.not.containsText(expected)
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
> {

  protected readonly _node: MapType

  constructor(node: MapType) {
    this._node = node
  }

  hasText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait(
      this._node.$, text, (element, expected) => element.wait.hasText(expected, opts)
    )
  }

  containsText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait(
      this._node.$, text, (element, expected) => element.wait.containsText(expected, opts)
    )
  }

  not = {
    hasText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait(
        this._node.$, text, (element, expected) => element.wait.not.hasText(expected, opts)
      )
    },
    containsText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait(
        this._node.$, text, (element, expected) => element.wait.not.containsText(expected, opts)
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
> {

  protected readonly _node: MapType

  constructor(node: MapType) {
    this._node = node
  }

  hasText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck(
      this._node.$, text, (element, expected) => element.eventually.hasText(expected, opts)
    )
  }

  containsText(text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck(
      this._node.$, text, (element, expected) => element.eventually.containsText(expected, opts)
    )
  }

  not = {
    hasText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck(
        this._node.$, text, (element, expected) => element.eventually.not.hasText(expected, opts)
      )
    },
    containsText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck(
        this._node.$, text, (element, expected) => element.eventually.not.containsText(expected, opts)
      )
    }
  }
}