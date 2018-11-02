import { XPathBuilder } from './XPathBuilder'
import { PageElement, PageElementList } from '../page_elements'
import { PageElementStore, CloneFunc } from '../stores'

export interface IWhereBuilderOpts<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> {
  store: Store
  elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  elementOptions: PageElementOptions,
  cloneFunc: CloneFunc<ListType>
}

export class ListWhereBuilder<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> {
  protected _selector: string

  protected _store: Store
  protected _elementStoreFunc: (selector: string, opts: PageElementOptions) => PageElementType
  protected _elementOptions: PageElementOptions
  protected _cloneFunc: CloneFunc<ListType>

  protected _xPathBuilder: XPathBuilder

  constructor(selector: string, opts: IWhereBuilderOpts<Store, PageElementType, PageElementOptions, ListType>) {
    this._selector = selector
    this._store = opts.store
    this._elementStoreFunc = opts.elementStoreFunc
    this._elementOptions = opts.elementOptions
    this._cloneFunc = opts.cloneFunc

    this._xPathBuilder = XPathBuilder.getInstance()
  }

  reset() {
    this._xPathBuilder.reset(this._selector)
    return this
  }

  constraint(constraint: string) {
    this._xPathBuilder.constraint(constraint)
    return this
  }

  // Modifies element selector, so use only once for
  // the same element.
  text(text: string) {
    this._xPathBuilder.text(text)
    return this
  }

  // Modifies element selector, so use only once for
  // the same element.
  containedText(text: string) {
    this._xPathBuilder.containedText(text)
    return this
  }

  // Modifies element selector, so use only once for
  // the same element.
  attr(key: string, value: string) {
    this._xPathBuilder.attr(key, value)
    return this
  }

  containedAttr(key: string, value: string) {
    this._xPathBuilder.containedAttr(key, value)
    return this
  }

  level(level: number) {
    this._xPathBuilder.level(level)
    return this
  }

  id(value: string) {
    return this.attr('id', value)
  }

  class(value: string) {
    return this.attr('class', value)
  }

  containedClass(value: string) {
    return this.containedAttr('class', value)
  }

  /**
   * Starts with 1
   * @param index
   */
  index(index: number) {
    const selector = `(${this._xPathBuilder.build()})[${index}]`
    this._xPathBuilder.reset(selector)

    return this
  }

  getFirst(): PageElementType {
    return this._elementStoreFunc.apply(
      this._store, [ this._xPathBuilder.build(), this._elementOptions ]
    )
  }

  /**
   *
   * @param index starts with 0
   */
  getAt( index: number ) {
    this.index( index + 1)

    return this.getFirst()
  }

  getAll() {
    return this.getList().all
  }

  getList() {
    return this._cloneFunc( this._xPathBuilder.build() )
  }
}