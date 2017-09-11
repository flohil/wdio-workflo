import { PageNode, IPageNodeOpts, PageElement } from './'
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
  PageElementOptions
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
  PageElementOptions
> extends PageNode<Store> implements Workflo.PageNode.INode {
  protected elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  protected elementOptions: PageElementOptions
  protected identifier: IPageElementMapIdentifier<K>
  protected _$: Record<K, PageElementType>

  constructor( 
    protected selector: string,
    { 
      identifier,
      elementStoreFunc,
      elementOptions,
      ...superOpts
    } : IPageElementMapOpts<Store, K, PageElementType, PageElementOptions> 
  ) {
    super(selector, superOpts)
    
    this.selector = selector
    this.elementOptions = elementOptions
    this.elementStoreFunc = elementStoreFunc
    this.identifier = identifier

    this._$ = Workflo.Object.mapProperties(
      this.identifier.mappingObject,
      (value, key) => <PageElementType> this.elementStoreFunc.apply(
        this.store, [
          this.identifier.func(this.selector, value),
          this.elementOptions
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
      (value, key) => <PageElementType> this.elementStoreFunc.apply(
        this.store, [
          this.identifier.func(this.selector, value),
          this.elementOptions
        ]
      )
    )
  }
}