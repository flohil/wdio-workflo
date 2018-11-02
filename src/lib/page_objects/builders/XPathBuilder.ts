export class XPathBuilder {
  private static _instance: XPathBuilder
  private _selector: string

  static getInstance() {
    if (typeof XPathBuilder._instance === 'undefined') {
      XPathBuilder._instance = new XPathBuilder()
    }

    return XPathBuilder._instance
  }

  private SelectorBuilder() {
    this._selector = ''
  }

  reset(selector: string) {
    this._selector = selector
    return this
  }

  /**
   * Appends plain xPath string to current selector.
   * @param appendedSelector
   */
  append(appendedSelector: string) {
    this._selector = `${this._selector}${appendedSelector}`
    return this
  }

  /**
   * Adds plain xPath constraint to current selector.
   * @param constraintSelector
   * @param builderFunc optional -> can be used to apply XPathSelector API to constraintSelector
   */
  constraint(constraintSelector: string, builderFunc?: (xpath: XPathBuilder) => XPathBuilder) {
    if ( !builderFunc ) {
      this._selector = `${this._selector}[${constraintSelector}]`
    } else {
      const constraintBuilder = XPathBuilder.getInstance().reset(constraintSelector)

      this._selector = `${this._selector}${builderFunc(constraintBuilder).build()}`
    }

    return this
  }

  // Modifies element selector, so use only once for
  // the same element.
  text(text: string) {
    this._selector = `${this._selector}[. = '${text}']`

    return this
  }

  // Modifies element selector, so use only once for
  // the same element.
  containsText(text: string) {
    this._selector = `${this._selector}[contains(.,'${text}')]`
    return this
  }

  // Modifies element selector, so use only once for
  // the same element.
  attr(key: string, value: string) {
    this._selector = `${this._selector}[@${key}='${value}']`
    return this
  }

  containsAttr(key: string, value: string) {
    this._selector = `${this._selector}[contains(@${key},'${value}')]`
    return this
  }

  id(value: string) {
    return this.attr('id', value)
  }

  containsId(value: string) {
    return this.containsAttr('id', value)
  }

  class(value: string) {
    return this.attr('class', value)
  }

  containsClass(value: string) {
    return this.containsAttr('class', value)
  }

  /**
   * Finds element by index of accurence on a single "level" of the DOM.
   * Eg.: If index === 3, there must be 3 siblings on the same DOM level that match the current selector
   * and the third one will be selected.
   * @param index starts at 1
   */
  levelIndex(index: number) {
    this._selector = `${this._selector}[${index}]`
    return this
  }

  /**
   * Finds element by index of accurence accross all "levels/depths" of the DOM.
   * @param index starts at 1
   */
  index(index: number) {
    const selector = `(${this.build()})[${index}]`
    this.reset(selector)

    return this
  }

  build() {
    const selector = this._selector
    return selector
  }
}