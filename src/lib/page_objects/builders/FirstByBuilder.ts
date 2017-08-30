import { XPathBuilder } from './XPathBuilder'

export interface IFirstByBuilderOpts<
  Store extends Workflo.IPageElementStore,   
  PageElementType extends Workflo.IPageElement<Store>,
  PageElementOptions
> {
  store: Store
  elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  elementOptions: PageElementOptions
}

export class FirstByBuilder<
  Store extends Workflo.IPageElementStore,   
  PageElementType extends Workflo.IPageElement<Store>,
  PageElementOptions
> {
  private selector: string

  private store: Store
  private elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  private elementOptions: PageElementOptions

  private xPathBuilder: XPathBuilder

  constructor(selector: string, options: IFirstByBuilderOpts<Store, PageElementType, PageElementOptions>) {
    this.selector = selector
    this.store = options.store
    this.elementStoreFunc = options.elementStoreFunc
    this.elementOptions = options.elementOptions

    this.xPathBuilder = XPathBuilder.getInstance()
  }

  reset() {
    this.xPathBuilder.reset(this.selector)
    return this
  }

  constraint(constraint: string) {
    this.xPathBuilder.constraint(constraint)
    return this
  }

  // Modifies element selector, so use only once for
  // the same element.
  text(text: string) {
    this.xPathBuilder.text(text)
    return this
  }

  // Modifies element selector, so use only once for
  // the same element.
  containedText(text: string) {
    this.xPathBuilder.containedText(text)
    return this
  }

  // Modifies element selector, so use only once for
  // the same element.
  attr(key: string, value: string) {
    this.xPathBuilder.attr(key, value)
    return this
  }

  containedAttr(key: string, value: string) {
    this.xPathBuilder.containedAttr(key, value)
    return this
  }

  level(level: number) {
    this.xPathBuilder.level(level)
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
    const selector = `(${this.xPathBuilder.build()})[${index}]`
    this.xPathBuilder.reset(selector)

    return this
  }

  get(): PageElementType {
    return this.elementStoreFunc.apply(
      this.store, [ this.xPathBuilder.build(), this.elementOptions ]
    )
  }
}