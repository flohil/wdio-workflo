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
   * Appends plain xPath to current selector.
   * @param appendedXPath
   */
  append(appendedXPath: string) {
    this._selector = `${this._selector}${appendedXPath}`
    return this
  }

  /**
   * Appends childSelector to current selector in order to select a child element.
   *
   * After executing .child, the selected child element will become the new
   * "target" for all other xpath modifier functions like .id, .class ...
   * @param childSelector
   */
  child(childSelector: string) {
    return this.append(childSelector)
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
      const outerSelector = this.build()

      this.reset(constraintSelector)

      this._selector = `${outerSelector}[${builderFunc(this).build()}]`

      this.reset(this._selector)
    }

    return this
  }

  /**
   * Restrict current selector to elements which have at least one child defined by childSelector.
   * Calls constraint() but adds a '.' to the beginning of the constraint to select only child elements.
   * @param childSelector
   * @param builderFunc optional -> can be used to apply XPathSelector API to childrenSelector
   */
  hasChild(childSelector: string, builderFunc?: (xpath: XPathBuilder) => XPathBuilder) {
    this.constraint(`.${childSelector}`, builderFunc)
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
  textContains(text: string) {
    this._selector = `${this._selector}[contains(.,'${text}')]`
    return this
  }

  // Modifies element selector, so use only once for
  // the same element.
  attribute(key: string, value: string) {
    this._selector = `${this._selector}[@${key}='${value}']`
    return this
  }

  attributeContains(key: string, value: string) {
    this._selector = `${this._selector}[contains(@${key},'${value}')]`
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