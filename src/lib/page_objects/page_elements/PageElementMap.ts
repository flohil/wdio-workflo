import { PageNode, IPageNodeOpts } from './'
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
  Store extends Workflo.IPageElementStore,
  PageElementType extends Workflo.IPageElement<Store>,
  PageElementOptions
> extends IPageNodeOpts<Store> {
  store: Store,
  elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType,
  elementOptions?: PageElementOptions
}

// holds several PageElement instances of the same type
export class PageElementMap<
  Store extends Workflo.IPageElementStore,
  K extends string,
  PageElementType extends Workflo.IPageElement<Store>,
  PageElementOptions
> extends PageNode<Store> implements Workflo.PageNode.INode {
  protected elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  protected elementOptions: PageElementOptions
  protected type: string
  protected identifier: IPageElementMapIdentifier<K>
  protected _$: Record<K, PageElementType>

  constructor( 
    protected selector: string,
    identifier: IPageElementMapIdentifier<K>,
    { 
      elementStoreFunc,
      elementOptions,
      ...superOpts
    } : IPageElementMapOpts<Store, PageElementType, PageElementOptions> 
  ) {
    super(selector, superOpts)
    
    this.selector = selector
    this.elementOptions = elementOptions
    this.elementStoreFunc = elementStoreFunc
    this.type = 'ElementMap' // used by group walker to detect map
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
}