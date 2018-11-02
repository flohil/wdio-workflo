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

  append(selector: string) {
    this._selector = `${this._selector}${selector}`
    return this
  }

  constraint(constraint: string) {
    this._selector = `${this._selector}[${constraint}]`
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
  containedText(text: string) {
    this._selector = `${this._selector}[contains(.,'${text}')]`
    return this
  }

  // Modifies element selector, so use only once for
  // the same element.
  attr(key: string, value: string) {
    this._selector = `${this._selector}[@${key}='${value}']`
    return this
  }

  containedAttr(key: string, value: string) {
    this._selector = `${this._selector}[contains(@${key},'${value}')]`
    return this
  }

  level(level: number) {
    this._selector = `${this._selector}[${level}]`
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

  build() {
    const selector = this._selector
    return selector
  }
}