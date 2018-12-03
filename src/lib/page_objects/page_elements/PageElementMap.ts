import { PageNode, IPageNodeOpts, PageElement, IPageElementOpts } from '.'
import { PageElementStore } from '../stores'
import { XPathBuilder } from '../builders'

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

  readonly currently: PageElementMapCurrently<Store, K, PageElementType, PageElementOptions, this>

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
   * Helper function to map element content nodes to a value by calling a node interface function on each node.
   *
   * If passing filter, only values defined in this mask will be returned.
   * By default (if no filter is passed), all values will be returned.
   *
   * @param context
   * @param getFunc
   * @param filter a filter mask
   */
  __getInterfaceFunc<
    Store extends PageElementStore,
    K extends string,
    PageElementType extends PageElement<Store>,
    ResultType
  >(
    context: Record<K, PageElementType>,
    getFunc: (node: PageElementType) => ResultType,
    filter?: Partial<Record<K, ResultType>>
  ): Record<K, ResultType> {
    let result = {} as Record<K, ResultType>;

    for (const k in context) {
      if (filter) {
        if (typeof filter[k] !== 'undefined') {
          result[k] = getFunc(context[k])
        }
      } else {
        result[k] = getFunc(context[k])
      }
    }

    return result;
  }

  /**
   * Returns values of all list elements in the order they were retrieved from the DOM.
   */
  getText(filter?: Partial<Record<K, string>>): Partial<Record<K, string>> {
    return this.__getInterfaceFunc(this.$, node => node.getText(), filter)
  }
}

export class PageElementMapCurrently<
  Store extends PageElementStore,
  K extends string,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
  MapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>
> implements Workflo.PageNode.IGetText<Partial<Record<K, string>>> {

  protected readonly _node: MapType

  constructor(node: MapType) {
    this._node = node
  }

  getText(filter?: Partial<Record<K, string>>): Partial<Record<K, string>> {
    return this._node.__getInterfaceFunc(this._node.$, node => node.currently.getText(), filter)
  }
}
