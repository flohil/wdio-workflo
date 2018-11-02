import * as _ from 'lodash'

import { PageNode, IPageNodeOpts } from '.'
import { XPathBuilder } from '../builders'
import { PageElementStore } from '../stores'
import * as htmlParser from 'htmlparser2'

export interface IPageElementOpts<
  Store extends PageElementStore
  > extends IPageNodeOpts<Store> {
  waitType?: Workflo.WaitType
  timeout?: number
  customScroll?: Workflo.ScrollParams
}

export interface IPageElementCommonStateAPI<Store extends PageElementStore> {
  exists: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  isVisible: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasClass: (className: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  containsClass: (className: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasText: (text: string, opts: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasAnyText: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  containsText: (text: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasValue: (value: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasAnyValue: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  containsValue: (value: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasHtml: (html: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasAnyHtml: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  containsHtml: (html: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasAttribute: (attribute: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasAnyAttribute: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  containsAttribute: (attribute: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasId: (id: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasAnyId: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  containsId: (id: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasName: (name: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasAnyName: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  containsName: (name: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasDirectText: (directText: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasAnyDirectText: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  containsDirectText: (directText: string, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  isEnabled: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,
  isSelected: (opts?: Workflo.WDIOParamsOptional) => PageElement<Store>
}

export interface IPageElementWaitAPI<Store extends PageElementStore> extends IPageElementCommonStateAPI<Store>{
  untilElement: (description: string, condition: (element: PageElement<Store>) => boolean, opts?: Workflo.WDIOParamsOptional) => PageElement<Store>,

  not: IPageElementWaitNotAPI<Store>
}
export interface IPageElementWaitNotAPI<Store extends PageElementStore> extends IPageElementCommonStateAPI<Store> {}
export interface IPageElementEventuallyAPI<Store extends PageElementStore> extends IPageElementCommonStateAPI<Store> {
  meetsCondition: (condition: (element: PageElement<Store>) => boolean, opts?: Workflo.WDIOParamsOptional) => boolean

  not: IPageElementEventuallyNotAPI<Store>
}
export interface IPageElementEventuallyNotAPI<Store extends PageElementStore> extends IPageElementCommonStateAPI<Store> {}
export interface IPageElementCurrentlyAPI<Store extends PageElementStore> extends IPageElementCommonStateAPI<Store> {}

export class PageElement<
  Store extends PageElementStore
  > extends PageNode<Store> implements Workflo.PageNode.IGetText {
  protected _waitType: Workflo.WaitType
  protected _timeout: number
  protected _$: Store
  protected _customScroll: Workflo.ScrollParams

  // available options:
  // - wait -> initial wait operation: exist, visible, text, value
  constructor(
    protected _selector: string,
    {
      waitType = Workflo.WaitType.visible,
      timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default,
      customScroll = undefined,
      ...superOpts
    }: IPageElementOpts<Store>
  ) {
    super(_selector, superOpts)

    this._$ = Object.create(null)

    for (const method of Workflo.Class.getAllMethods(this._store)) {
      if (method.indexOf('_') !== 0 && /^[A-Z]/.test(method)) {
        this._$[method] = <Options extends IPageElementOpts<Store>>(selector: Workflo.XPath, _options: Options) => {

          if (selector instanceof XPathBuilder) {
            selector = XPathBuilder.getInstance().build()
          }

          // chain selectors
          selector = `${_selector}${selector}`

          return this._store[method].apply(this._store, [selector, _options])
        }
      }
    }

    this._waitType = waitType
    this._timeout = timeout
    this._customScroll = customScroll
  }

  // RETRIEVE ELEMENT FUNCTIONS

  get $(): Store {
    return this._$
  }

  get __element() {
    return browser.element(this._selector)
  }

  get element() {
    this.initialWait()

    return this.__element
  }

  initialWait() {
    switch (this._waitType) {
      case Workflo.WaitType.exist:
        if (!this._exists()) {
          this._waitExists()
        }
        break
      case Workflo.WaitType.visible:
        if (!this._isVisible()) {
          this._waitIsVisible()
        }
        break
      case Workflo.WaitType.value:
        if (!this._hasAnyValue()) {
          this._waitHasAnyValue()
        }
        break
      case Workflo.WaitType.text:
        if (!this._hasAnyText()) {
          this._waitHasAnyText()
        }
        break
    }

    return this
  }

// CURRENT CHECK STATE FUNCTIONS

  // Returns true if element matching this selector currently exists.
  private _exists(): boolean {
    return this.__element.isExisting()
  }

  // Returns true if element matching this selector currently is visible.
  private _isVisible(): boolean {
    return this.__element.isVisible()
  }

  private _hasClass(className: string): boolean {
    return this.getClass() === className
  }

  private _containsClass(className: string): boolean {
    const _class: string = this.getClass()

    if (!_class) {
      return false
    } else {
      return _class.indexOf(className) > -1
    }
  }

  // Returns true if element matching this selector currently has text.
  private _hasText(text: string): boolean {
    return this.__element.getText() === text
  }

  private _hasAnyText(): boolean {
    return this.__element.getText().length > 0
  }

  // Returns true if element matching this selector currently contains text.
  private _containsText(text: string): boolean {
    return this.__element.getText().indexOf(text) > -1
  }

  // Returns true if element matching this selector currently has value.
  private _hasValue(value: string): boolean {
    return this.__element.getValue() === value
  }

  private _hasAnyValue(): boolean {
    return this.__element.getValue().length > 0
  }

  // Returns true if element matching this selector currently contains value.
  private _containsValue(value: string): boolean {
    return this.__element.getValue().indexOf(value) > -1
  }

  private _hasAttribute(attrName: string, attrValue: string) {
    return this.__element.getAttribute(attrName) === attrValue
  }

  private _hasAnyAttribute(attrName: string) {
    return this.__element.getAttribute(attrName).length > 0
  }

  private _containsAttribute(attrName: string, attrValue: string) {
    return this.__element.getAttribute(attrName).indexOf(attrValue) > 0
  }

  // Returns true if element matching this selector currently has value.
  private _hasDirectText(directText: string): boolean {
    const html = this.__element.getHTML()

    if (directText.length === 0 && html.length === 0) {
      return true
    } else if ( html.length === 0 ) {
      return false
    } else {
      return this._getDirectText(html) === directText
    }
  }

  private _hasAnyDirectText(): boolean {
    const html = this.__element.getHTML()

    if (html.length === 0) {
      return false
    } else {
      return this._getDirectText(html).length > 0
    }
  }

  // Returns true if element matching this selector currently contains value.
  private _containsDirectText(directText: string): boolean {
    const html = this.__element.getHTML()

    if (directText.length === 0 && html.length === 0) {
      return true
    } else if ( html.length === 0 ) {
      return false
    } else {
      return this._getDirectText(html).indexOf(directText) > 0
    }
  }

  // Returns true if element matching this selector is enabled.
  private _isEnabled(): boolean {
    return this.__element.isEnabled()
  }

  // Returns true if element matching this selector is enabled.
  private _isSelected(): boolean {
    return this.__element.isSelected()
  }

  currently: IPageElementCurrentlyAPI<Store> = {
    exists: this._exists,
    isVisible: this._isVisible,
    hasClass: this._hasClass,
    containsClass: this._containsClass,
    hasText: this._hasText,
    hasAnyText: this._hasAnyText,
    containsText: this._containsText,
    hasValue: this._hasValue,
    hasAnyValue: this._hasAnyValue,
    containsValue: this._containsValue,
    hasDirectText: this._hasDirectText,
    hasAnyDirectText: this._hasAnyDirectText,
    containsDirectText: this._containsDirectText,
    hasAttribute: this._hasAttribute,
    hasAnyAttribute: this._hasAnyAttribute,
    containsAttribute: this._containsAttribute,
    hasHtml: this._hasHtml,
    hasAnyHtml: this._hasAnyHtml,
    containsHtml: this._containsHtml,
    hasId: this._hasId,
    hasAnyId: this._hasAnyId,
    containsId: this._containsId,
    hasName: this._hasName,
    hasAnyName: this._hasAnyName,
    containsName: this._containsName,
    isEnabled: this._isEnabled,
    isSelected: this._isSelected,
  }

// GETTER FUNCTIONS (return state after initial wait)

  private _getDirectText(html: string): string {
    let text = ""
    const constructorName = this.constructor.name
    const selector = this._selector

    const handler = new htmlParser.DomHandler(function (error, dom) {
      if (error) {
        throw new Error(`Error creating dom for exclusive text in ${constructorName}: ${error}\n( ${selector} )`)
      }
      else {
        dom.forEach(node => {
          node.children.forEach(childNode => {
            if (childNode.type === 'text') {
              text += childNode.data
            }
          })
        });
      }
    });

    return text

    // var parser = new htmlParser.Parser(handler);
    // parser.write(html);
    // parser.end();

    // executing javascript on page does not work in internet explorer
    /*return browser.execute((myelem) : string => {
      const parent = myelem.value
      let child = parent.firstChild
      let ret = ''
      while (child) {
        if (child.nodeType === Node.TEXT_NODE) {
          ret += child.textContent
        }

        child = child.nextSibling
      }
      return ret
    }, this.element).value*/
  }

  // returns html af all matches for a given selector,
  // even if only ONE WebDriverElement is returned!!!!!
  // eg. for browser.element('div') ->
  // HTML returns all divs
  // but only the first div is returned as WebDriverElement
  getAllHTML() {
    return this.element.getHTML()
  }

  // returns text of this.element including
  // all texts of nested children
  getText() {
    return this.element.getText()
  }

  // get text of this.element node only,
  // excluding all texts of nested children
  // (eg icons etc.)
  // works only for a single matched element (by selector)
  getDirectText(): string {
    const html = this.element.getHTML()

    return this._getDirectText(html)
  }

  getValue() {
    return this.element.getValue()
  }

  getAttribute(attrName: string) {
    return this.element.getAttribute(attrName)
  }

  getClass() {
    return this.element.getAttribute('class')
  }

  getId() {
    return this.element.getAttribute('id')
  }

  getName() {
    return this.element.getAttribute('name')
  }

  getEnabled() {
    return this.element.isEnabled()
  }

  getSelected() {
    return this.element.isSelected()
  }

  getLocation(axis: WebdriverIO.Axis) {
    return this.element.getLocation(axis)
  }

  getSize() {
    return this.element.getElementSize();
  }

  getTimeout() {
    return this._timeout
  }

// INTERACTION FUNCTIONS (interact with state after initial wait)

  setValue(value: string) {
    this.element.setValue(value)
  }

  /**
   *
   * @param postCondition Sometimes javascript that is to be executed after a click
   * is not loaded right at the moment that the element wait condition
   * is fulfilled. (eg. element is visible)
   * In this case, postCondition function will be
   */
  click(options?: { postCondition?: () => boolean, timeout?: number, customScroll?: Workflo.ScrollParams }) {
    this.initialWait()

    let errorMessage = ''
    const interval = 250
    const viewPortSize = browser.getViewportSize()
    let y = viewPortSize.height / 2
    let x = viewPortSize.width / 2
    let remainingTimeout = this._timeout;

    if (!options) {
      options = {}
    }

    if (options && !options.customScroll) {
      if (this._customScroll) {
        options.customScroll = this._customScroll
      }
    }

    const clickFunc = !options.customScroll ? () => this.__element.click() : () => {
      const result: Workflo.JSError = browser.selectorExecute(this.getSelector(), function (elems: HTMLElement[], selector) {
        if (elems.length === 0) {
          return {
            notFound: [selector]
          }
        }

        elems[0].click()
      }, this.getSelector())

      if (isJsError(result)) {
        throw new Error(`${this.constructor.name} could not be clicked: ${result.notFound.join(', ')}\n( ${this._selector} )`)
      }
    }

    if (options.customScroll) {
      this.scrollTo(options.customScroll)
    }

    // wait for other overlapping elements to disappear
    try {
      browser.waitUntil(() => {
        remainingTimeout -= interval;
        try {
          clickFunc();
          errorMessage = undefined;
          return true;
        }
        catch (error) {
          if (error.message.indexOf("is not clickable at point") > -1) {
            errorMessage = error.message;
            return false;
          }
        }
      }, this._timeout, `${this.constructor.name} did not become clickable after timeout.\n( ${this._selector} )`, interval);
    } catch (waitE) {
      waitE.message = errorMessage.replace('unknown error: ', '')
      throw waitE
    }

    if (options && options.postCondition && remainingTimeout > 0) {
      options.timeout = options.timeout || this._timeout

      try {
        browser.waitUntil(() => {
          try {
            if (options.postCondition()) {
              return true
            } else {
              if (this._isVisible() && this._isEnabled()) {
                clickFunc()
              }
            }
          } catch (error) {
            errorMessage = error.message
          }
        }, remainingTimeout + options.timeout, `${this.constructor.name}: Postcondition for click never became true.\n( ${this._selector} )`, interval)
      } catch (waitE) {
        waitE.message = errorMessage.replace('unknown error: ', '')
        throw waitE
      }
    }

    return this
  }

  scrollTo(
    params: Workflo.ScrollParams
  ): Workflo.ScrollResult {
    if (!params.offsets) {
      params.offsets = {
        x: 0,
        y: 0
      }
    }
    if (!params.offsets.x) {
      params.offsets.x = 0
    }
    if (!params.offsets.y) {
      params.offsets.y = 0
    }
    if (typeof params.closestContainerIncludesHidden === 'undefined') {
      params.closestContainerIncludesHidden = true;
    }

    const result: Workflo.JSError | Workflo.ScrollResult = browser.selectorExecute(
      [this.getSelector()], function (elems: HTMLElement[], elementSelector: string, params: Workflo.ScrollParams
      ) {
        var error: Workflo.JSError = {
          notFound: []
        };

        if (elems.length === 0) {
          error.notFound.push(elementSelector);
        };

        if (error.notFound.length > 0) {
          return error;
        }

        var elem: HTMLElement = elems[0];
        var container: HTMLElement = undefined

        function getScrollParent(element, includeHidden) {
          var style = getComputedStyle(element);
          var excludeStaticParent = style.position === "absolute";
          var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

          if (style.position === "fixed") return document.body;
          for (var parent = element; (parent = parent.parentElement);) {
            style = getComputedStyle(parent);
            if (excludeStaticParent && style.position === "static") {
              continue;
            }
            if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
          }

          return document.body;
        }

        if (typeof params.containerSelector === 'undefined') {
          container = getScrollParent(elem, params.closestContainerIncludesHidden)
        } else {
          container = <HTMLElement>document.evaluate(params.containerSelector, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

          if (container === null) {
            error.notFound.push(params.containerSelector)
            return error
          }
        }

        var elemTop = elem.getBoundingClientRect().top;
        var elemLeft = elem.getBoundingClientRect().left;

        var containerTop = container.getBoundingClientRect().top;
        var containerLeft = container.getBoundingClientRect().left;

        var previousScrollTop = container.scrollTop;
        var previousScrollLeft = container.scrollLeft;

        var scrollTop = elemTop - containerTop + previousScrollTop + params.offsets.y;
        var scrollLeft = elemLeft - containerLeft + previousScrollLeft + params.offsets.x;

        if (typeof params.directions !== 'undefined') {
          if (params.directions.y) {
            container.scrollTop = scrollTop;
          }
          if (params.directions.x) {
            container.scrollLeft = scrollLeft;
          }
        }

        return {
          elemTop: elemTop,
          elemLeft: elemLeft,
          containerTop: containerTop,
          containerLeft: containerLeft,
          scrollTop: scrollTop,
          scrollLeft: scrollLeft
        };
      }, this.getSelector(), params)

    if (isJsError(result)) {
      throw new Error(`Elements could not be located: ${result.notFound.join(', ')}`)
    } else {
      return result
    }
  }

// WAIT (for certain state within timeout)

  private _waitExists = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForExist(timeout),
      ` never existed`
    )
  }

  private _waitNotExists = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForExist(timeout, true),
      ` never not existed`
    )
  }

  private _waitIsVisible = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForVisible(timeout),
      ` never became visible`
    )
  }

  private _waitNotIsVisible = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForVisible(timeout, true),
      ` never became invisible`
    )
  }

  private _waitHasClass = (
    className: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this._hasClass(className)
    }, timeout, `${this.constructor.name}: Class never became '${className}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotHasClass = (
    className: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this._hasClass(className)
    }, timeout, `${this.constructor.name}: Class never became other than '${className}'.\n( ${this._selector} )`)

    return this
  }

  private _waitContainsClass = (
    className: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this._containsClass(className)
    }, timeout, `${this.constructor.name}: Class never contained '${className}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotContainsClass = (
    className: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this._containsClass(className)
    }, timeout, `${this.constructor.name}: Class never not contained '${className}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasText = (
    text: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this._hasText(text)
    }, timeout, `${this.constructor.name}: Text never became '${text}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotHasText = (
    text: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this._hasText(text)
    }, timeout, `${this.constructor.name}: Text never became other than '${text}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasAnyText = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForText(timeout),
      ` never had any text`
    )
  }

  private _waitNotHasAnyText = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForText(timeout, true),
      ` never not had any text`
    )
  }

  private _waitContainsText = (
    text: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this._containsText(text)
    }, timeout, `${this.constructor.name}: Text never contained '${text}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotContainsText = (
    text: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this._containsText(text)
    }, timeout, `${this.constructor.name}: Text never not contained '${text}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasValue = (
    value: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this._hasValue(value)
    }, timeout, `${this.constructor.name}: Value never became '${value}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotHasValue = (
    value: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this._hasValue(value)
    }, timeout, `${this.constructor.name}: Value never became other than '${value}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasAnyValue = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForValue(timeout),
      ` never had any value`
    )
  }

  private _waitNotHasAnyValue = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForValue(timeout, true),
      ` never not had any value`
    )
  }

  private _waitContainsValue = (
    value: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this._containsValue(value)
    }, timeout, `${this.constructor.name}: Value never contained '${value}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotContainsValue = (
    value: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this._containsValue(value)
    }, timeout, `${this.constructor.name}: Value never not contained '${value}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasDirectText = (
    directText: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this._hasDirectText(directText)
    }, timeout, `${this.constructor.name}: DirectText never became '${directText}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotHasDirectText = (
    directText: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this._hasDirectText(directText)
    }, timeout, `${this.constructor.name}: DirectText never became other than '${directText}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasAnyDirectText = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this._hasAnyDirectText()
    }, timeout, `${this.constructor.name} never had any direct text.\n( ${this._selector} )`)

    return this
  }

  private _waitNotHasAnyDirectText = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this._hasAnyDirectText()
    }, timeout, `${this.constructor.name} never not had any direct text.\n( ${this._selector} )`)

    return this
  }

  private _waitContainsDirectText = (
    directText: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this._containsDirectText(directText)
    }, timeout, `${this.constructor.name}: Direct text never contained '${directText}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotContainsDirectText = (
    directText: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this._containsDirectText(directText)
    }, timeout, `${this.constructor.name}: Direct text never not contained '${directText}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasAttribute = (
    attribute: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this._hasAttribute(attribute)
    }, timeout, `${this.constructor.name}: Attribute never became '${attribute}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotHasAttribute = (
    attribute: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this._hasAttribute(attribute)
    }, timeout, `${this.constructor.name}: Attribute never became other than '${attribute}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasAnyAttribute = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForAttribute(timeout),
      ` never had any attribute`
    )
  }

  private _waitNotHasAnyAttribute = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForAttribute(timeout, true),
      ` never not had any attribute`
    )
  }

  private _waitContainsAttribute = (
    attribute: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this._containsAttribute(attribute)
    }, timeout, `${this.constructor.name}: Attribute never contained '${attribute}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotContainsAttribute = (
    attribute: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this._containsValue(attribute)
    }, timeout, `${this.constructor.name}: Value never not contained '${attribute}'.\n( ${this._selector} )`)

    return this
  }

  _waitHasHtml: any;
  _waitHasAnyHtml: any;
  _waitContainsHtml: any;
  _waitHasId: any;
  _waitHasAnyId: any;
  _waitContainsId: any;
  _waitHasName: any;
  _waitHasAnyName: any;
  _waitContainsName: any;
  _waitNotHasHtml: any;
  _waitNotHasAnyHtml: any;
  _waitNotContainsHtml: any;
  _waitNotHasId: any;
  _waitNotHasAnyId: any;
  _waitNotContainsId: any;
  _waitNotHasName: any;
  _waitNotHasAnyName: any;
  _waitNotContainsName: any;


  // Waits until at least one matching element is enabled.
  //
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // is enabled that matches the this.selector.
  private _waitIsEnabled = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForEnabled(timeout),
      ` never became enabled`
    )
  }

  private _waitNotIsEnabled = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForEnabled(timeout, true),
      ` never became disabled`
    )
  }

  // Waits until at least one matching element is selected.
  //
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // is selected that matches the this.selector.
  private _waitIsSelected = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForSelected(timeout),
      ` never became selected`
    )
  }

  private _waitNotIsSelected = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    this.__element.waitForSelected(timeout, true)

    return this._wait(
      () => this.__element.waitForSelected(timeout, true),
      ` never became deselected`
    )
  }

  private _waitUntilElement = (
    description: string, condition: (element: this) => boolean, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    browser.waitUntil(
      () => condition(this),
      timeout,
      `${this.constructor.name}: Wait until element ${description} failed.\n( ${this._selector} )`
    )

    return this
  }

  public wait: IPageElementWaitAPI<Store> = {
    exists: this._waitExists,
    isVisible: this._waitIsVisible,
    hasClass: this._waitHasClass,
    containsClass: this._waitContainsClass,
    hasText: this._waitHasText,
    hasAnyText: this._waitHasAnyText,
    containsText: this._waitContainsText,
    hasValue: this._waitHasValue,
    hasAnyValue: this._waitHasAnyValue,
    containsValue: this._waitContainsValue,
    hasDirectText: this._waitHasDirectText,
    hasAnyDirectText: this._waitHasAnyDirectText,
    containsDirectText: this._waitContainsDirectText,
    hasAttribute: this._waitHasAttribute,
    hasAnyAttribute: this._waitHasAnyAttribute,
    containsAttribute: this._waitContainsAttribute,
    hasHtml: this._waitHasHtml,
    hasAnyHtml: this._waitHasAnyHtml,
    containsHtml: this._waitContainsHtml,
    hasId: this._waitHasId,
    hasAnyId: this._waitHasAnyId,
    containsId: this._waitContainsId,
    hasName: this._waitHasName,
    hasAnyName: this._waitHasAnyName,
    containsName: this._waitContainsName,
    isEnabled: this._waitIsEnabled,
    isSelected: this._waitIsSelected,
    untilElement: this._waitUntilElement,

    not: {
      exists: this._waitNotExists,
      isVisible: this._waitNotIsVisible,
      hasClass: this._waitNotHasClass,
      containsClass: this._waitNotContainsClass,
      hasText: this._waitNotHasText,
      hasAnyText: this._waitNotHasAnyText,
      containsText: this._waitNotContainsText,
      hasValue: this._waitNotHasValue,
      hasAnyValue: this._waitNotHasAnyValue,
      containsValue: this._waitNotContainsValue,
      hasDirectText: this._waitNotHasDirectText,
      hasAnyDirectText: this._waitNotHasAnyDirectText,
      containsDirectText: this._waitNotContainsDirectText,
      hasAttribute: this._waitNotHasAttribute,
      hasAnyAttribute: this._waitNotHasAnyAttribute,
      containsAttribute: this._waitNotContainsAttribute,
      hasHtml: this._waitNotHasHtml,
      hasAnyHtml: this._waitNotHasAnyHtml,
      containsHtml: this._waitNotContainsHtml,
      hasId: this._waitNotHasId,
      hasAnyId: this._waitNotHasAnyId,
      containsId: this._waitNotContainsId,
      hasName: this._waitNotHasName,
      hasAnyName: this._waitNotHasAnyName,
      containsName: this._waitNotContainsName,
      isEnabled: this._waitNotIsEnabled,
      isSelected: this._waitNotIsSelected,
    }
  }

// EVENTUALLY FUNCTIONS (check wether certain state if reached after timeout)

  // checks if at least one element matching selector is existing within timeout
  // reverse is optional and false by default
  // timeout is optional and this._timeout by default
  private _eventuallyExists = ({ timeout = this._timeout }: Workflo.WDIOParamsOptional = {}) => {
    return this._eventually(() => this._waitExists({ timeout }))
  }

  private _eventuallyNotExists = ({ timeout = this._timeout }: Workflo.WDIOParamsOptional = {}) => {
    return this._eventually(() => this._waitNotExists({ timeout }))
  }

  // checks if at least one element matching selector is visible within timeout
  // reverse is optional and false by default
  // timeout is optional and this._timeout by default
  private _eventuallyIsVisible = ({ timeout = this._timeout }: Workflo.WDIOParamsOptional = {}) => {
    return this._eventually(() => this._waitIsVisible({ timeout }))
  }

  private _eventuallyNotIsVisible = ({ timeout = this._timeout }: Workflo.WDIOParamsOptional = {}) => {
    return this._eventually(() => this._waitNotIsVisible({ timeout }))
  }

  private _eventuallyHasClass = (
    className: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitHasClass(className, { timeout }))
  }

  private _eventuallyNotHasClass = (
    className: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotHasClass(className, { timeout }))
  }

  private _eventuallyContainsClass = (
    className: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitContainsClass(className, { timeout }))
  }

  private _eventuallyNotContainsClass = (
    className: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotContainsClass(className, { timeout }))
  }

  private _eventuallyHasText = (
    text: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitHasText(text, { timeout }))
  }

  private _eventuallyNotHasText = (
    text: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotHasText(text, { timeout }))
  }

  private _eventuallyHasAnyText = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitHasAnyText({ timeout }))
  }

  private _eventuallyNotHasAnyText = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotHasAnyText({ timeout }))
  }

  private _eventuallyContainsText = (
    text: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitContainsText(text, { timeout }))
  }

  private _eventuallyNotContainsText = (
    text: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotContainsText(text, { timeout }))
  }

  private _eventuallyHasValue = (
    value: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitHasValue(value, { timeout }))
  }

  private _eventuallyNotHasValue = (
    value: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotHasValue(value, { timeout }))
  }

  private _eventuallyHasAnyValue = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitHasAnyValue({ timeout }))
  }

  private _eventuallyNotHasAnyValue = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotHasAnyValue({ timeout }))
  }

  private _eventuallyContainsValue = (
    value: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitContainsValue(value, { timeout }))
  }

  private _eventuallyNotContainsValue = (
    value: string, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotContainsValue(value, { timeout }))
  }

  private _eventuallyIsEnabled = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitIsEnabled({ timeout }))
  }

  private _eventuallyNotIsEnabled = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotIsEnabled({ timeout }))
  }

  private _eventuallyIsSelected = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitIsSelected({ timeout }))
  }

  private _eventuallyNotIsSelected = (
    { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotIsSelected({ timeout }))
  }

  private _eventuallyMeetsCondition = (
    condition: (element: this) => boolean, { timeout = this._timeout }: Workflo.WDIOParamsOptional = {}
  ) => {
    return this._eventually(
      () => this._waitUntilElement(' meets condition', () => condition(this), { timeout })
    )
  }

  _eventuallyHasDirectText: any;
  _eventuallyHasAnyDirectText: any;
  _eventuallyContainsDirectText: any;
  _eventuallyHasAttribute: any;
  _eventuallyHasAnyAttribute: any;
  _eventuallyContainsAttribute: any;
  _eventuallyHasHtml: any;
  _eventuallyHasAnyHtml: any;
  _eventuallyContainsHtml: any;
  _eventuallyHasId: any;
  _eventuallyHasAnyId: any;
  _eventuallyContainsId: any;
  _eventuallyHasName: any;
  _eventuallyHasAnyName: any;
  _eventuallyContainsName: any;
  _eventuallyNotHasDirectText: any;
  _eventuallyNotHasAnyDirectText: any;
  _eventuallyNotContainsDirectText: any;
  _eventuallyNotHasAttribute: any;
  _eventuallyNotHasAnyAttribute: any;
  _eventuallyNotContainsAttribute: any;
  _eventuallyNotHasHtml: any;
  _eventuallyNotHasAnyHtml: any;
  _eventuallyNotContainsHtml: any;
  _eventuallyNotHasId: any;
  _eventuallyNotHasAnyId: any;
  _eventuallyNotContainsId: any;
  _eventuallyNotHasName: any;
  _eventuallyNotHasAnyName: any;
  _eventuallyNotContainsName: any;

  public eventually: IPageElementEventuallyAPI<Store> = {
    exists: this._eventuallyExists,
    isVisible: this._eventuallyIsVisible,
    hasClass: this._eventuallyHasClass,
    containsClass: this._eventuallyContainsClass,
    hasText: this._eventuallyHasText,
    hasAnyText: this._eventuallyHasAnyText,
    containsText: this._eventuallyContainsText,
    hasValue: this._eventuallyHasValue,
    hasAnyValue: this._eventuallyHasAnyValue,
    containsValue: this._eventuallyContainsValue,
    hasDirectText: this._eventuallyHasDirectText,
    hasAnyDirectText: this._eventuallyHasAnyDirectText,
    containsDirectText: this._eventuallyContainsDirectText,
    hasAttribute: this._eventuallyHasAttribute,
    hasAnyAttribute: this._eventuallyHasAnyAttribute,
    containsAttribute: this._eventuallyContainsAttribute,
    hasHtml: this._eventuallyHasHtml,
    hasAnyHtml: this._eventuallyHasAnyHtml,
    containsHtml: this._eventuallyContainsHtml,
    hasId: this._eventuallyHasId,
    hasAnyId: this._eventuallyHasAnyId,
    containsId: this._eventuallyContainsId,
    hasName: this._eventuallyHasName,
    hasAnyName: this._eventuallyHasAnyName,
    containsName: this._eventuallyContainsName,
    isEnabled: this._eventuallyIsEnabled,
    isSelected: this._eventuallyIsSelected,
    meetsCondition: this._eventuallyMeetsCondition,

    not: {
      exists: this._eventuallyNotExists,
      isVisible: this._eventuallyNotIsVisible,
      hasClass: this._eventuallyNotHasClass,
      containsClass: this._eventuallyNotContainsClass,
      hasText: this._eventuallyNotHasText,
      hasAnyText: this._eventuallyNotHasAnyText,
      containsText: this._eventuallyNotContainsText,
      hasValue: this._eventuallyNotHasValue,
      hasAnyValue: this._eventuallyNotHasAnyValue,
      containsValue: this._eventuallyNotContainsValue,
      hasDirectText: this._eventuallyNotHasDirectText,
      hasAnyDirectText: this._eventuallyNotHasAnyDirectText,
      containsDirectText: this._eventuallyNotContainsDirectText,
      hasAttribute: this._eventuallyNotHasAttribute,
      hasAnyAttribute: this._eventuallyNotHasAnyAttribute,
      containsAttribute: this._eventuallyNotContainsAttribute,
      hasHtml: this._eventuallyNotHasHtml,
      hasAnyHtml: this._eventuallyNotHasAnyHtml,
      containsHtml: this._eventuallyNotContainsHtml,
      hasId: this._eventuallyNotHasId,
      hasAnyId: this._eventuallyNotHasAnyId,
      containsId: this._eventuallyNotContainsId,
      hasName: this._eventuallyNotHasName,
      hasAnyName: this._eventuallyNotHasAnyName,
      containsName: this._eventuallyNotContainsName,
      isEnabled: this._eventuallyNotIsEnabled,
      isSelected: this._eventuallyNotIsSelected,
    }
  }
}

// type guards
function isJsError(result: any): result is Workflo.JSError {
  if (!result) {
    return false
  }
  return result.notFound !== undefined;
}

function isScrollResult(result: any): result is Workflo.ScrollResult {
  return result.elemTop !== undefined;
}