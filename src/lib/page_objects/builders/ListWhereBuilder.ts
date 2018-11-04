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
  cloneFunc: CloneFunc<ListType>,
  getAllFunc: (list: ListType) => PageElementType[]
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
  protected _getAllFunc: (list: ListType) => PageElementType[]

  protected _xPathBuilder: XPathBuilder

  constructor(selector: string, opts: IWhereBuilderOpts<Store, PageElementType, PageElementOptions, ListType>) {
    this._selector = selector
    this._store = opts.store
    this._elementStoreFunc = opts.elementStoreFunc
    this._elementOptions = opts.elementOptions
    this._cloneFunc = opts.cloneFunc
    this._getAllFunc = opts.getAllFunc

    this._xPathBuilder = XPathBuilder.getInstance()
  }

// XPathBuilder facade

  reset() {
    this._xPathBuilder.reset(this._selector)
    return this
  }

  /**
   * Appends plain xPath string to current selector.
   * @param appendedSelector
   */
  append(appendedSelector: string) {
    this._xPathBuilder.append(appendedSelector)
    return this
  }

  /**
   * Adds plain xPath constraint to current selector.
   * @param constraintSelector
   * @param builderFunc optional -> can be used to apply XPathSelector API to constraintSelector
   */
  constraint(constraintSelector: string, builderFunc?: (xPath: XPathBuilder) => XPathBuilder) {
    this._xPathBuilder.constraint(constraintSelector, builderFunc)
    return this
  }

  /**
   * Restrict current selector to elements which have at least one child defined by childrenSelector.
   * Calls constraint() but adds a '.' to the beginning of the constraint to select only child elements.
   * @param childSelector
   * @param builderFunc optional -> can be used to apply XPathSelector API to childrenSelector
   */
  child(childSelector: string, builderFunc?: (xpath: XPathBuilder) => XPathBuilder) {
    this.constraint(`.${childSelector}`, builderFunc)
    return this
  }

  text(text: string) {
    this._xPathBuilder.text(text)
    return this
  }

  textContains(text: string) {
    this._xPathBuilder.textContains(text)
    return this
  }

  attribute(key: string, value: string) {
    this._xPathBuilder.attribute(key, value)
    return this
  }

  attributeContains(key: string, value: string) {
    this._xPathBuilder.attributeContains(key, value)
    return this
  }

  id(value: string) {
    return this.attribute('id', value)
  }

  idContains(value: string) {
    return this.attributeContains('id', value)
  }

  class(value: string) {
    return this.attribute('class', value)
  }

  classContains(value: string) {
    return this.attributeContains('class', value)
  }

  name(value: string) {
    return this.attribute('name', value)
  }

  nameContains(value: string) {
    return this.attributeContains('name', value)
  }

  /**
   * Finds element by index of accurence on a single "level" of the DOM.
   * Eg.: If index === 3, there must be 3 siblings on the same DOM level that match the current selector
   * and the third one will be selected.
   * @param index starts at 1
   */
  levelIndex(level: number) {
    this._xPathBuilder.levelIndex(level)
    return this
  }

  /**
   * Finds element by index of accurence accross all "levels/depths" of the DOM.
   * @param index starts at 1
   */
  index(index: number) {
    this._xPathBuilder.index( index )
    return this
  }

// Result retrieval functions

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
    return this._getAllFunc(this.getList())
  }

  getList() {
    return this._cloneFunc( this._xPathBuilder.build() )
  }
}