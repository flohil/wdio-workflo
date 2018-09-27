import * as _ from 'lodash'

import { PageNode, IPageNodeOpts } from './'
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

export interface IPageElementWaitAPI<Store extends PageElementStore> {
  exists: (opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
  isVisible: (opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasClass: (className: string, opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
  containsClass: (className: string, opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasText: (text: string, opts:  Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasAnyText: (opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
  containsText: (text: string, opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasValue: (value: string, opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
  hasAnyValue: (opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
  containsValue: (value: string, opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
  isEnabled: (opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
  isSelected: (opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>

  not: {
    exists: (opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
    isVisible: (opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
    hasClass: (className: string, opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
    containsClass: (className: string, opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
    hasText: (text: string, opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
    hasAnyText: (opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
    containsText: (text: string, opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
    hasValue: (value: string, opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
    hasAnyValue: (opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
    containsValue: (value: string, opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
    isEnabled: (opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>,
    isSelected: (opts?:  Workflo.WDIOParamsOptional) => PageElement<Store>
  }
}

export interface IPageElementEventuallyAPI {
  exists: (opts?:  Workflo.WDIOParamsOptional) => boolean,
  isVisible: (opts?:  Workflo.WDIOParamsOptional) => boolean,
  hasClass: (className: string, opts?:  Workflo.WDIOParamsOptional) => boolean,
  containsClass: (className: string, opts?:  Workflo.WDIOParamsOptional) => boolean,
  hasText: (text: string, opts:  Workflo.WDIOParamsOptional) => boolean,
  hasAnyText: (opts?:  Workflo.WDIOParamsOptional) => boolean,
  containsText: (text: string, opts?:  Workflo.WDIOParamsOptional) => boolean,
  hasValue: (value: string, opts?:  Workflo.WDIOParamsOptional) => boolean,
  hasAnyValue: (opts?:  Workflo.WDIOParamsOptional) => boolean,
  containsValue: (value: string, opts?:  Workflo.WDIOParamsOptional) => boolean,
  isEnabled: (opts?:  Workflo.WDIOParamsOptional) => boolean,
  isSelected: (opts?:  Workflo.WDIOParamsOptional) => boolean

  not: {
    exists: (opts?:  Workflo.WDIOParamsOptional) => boolean,
    isVisible: (opts?:  Workflo.WDIOParamsOptional) => boolean,
    hasClass: (className: string, opts?:  Workflo.WDIOParamsOptional) => boolean,
    containsClass: (className: string, opts?:  Workflo.WDIOParamsOptional) => boolean,
    hasText: (text: string, opts?:  Workflo.WDIOParamsOptional) => boolean,
    hasAnyText: (opts?:  Workflo.WDIOParamsOptional) => boolean,
    containsText: (text: string, opts?:  Workflo.WDIOParamsOptional) => boolean,
    hasValue: (value: string, opts?:  Workflo.WDIOParamsOptional) => boolean,
    hasAnyValue: (opts?:  Workflo.WDIOParamsOptional) => boolean,
    containsValue: (value: string, opts?:  Workflo.WDIOParamsOptional) => boolean,
    isEnabled: (opts?:  Workflo.WDIOParamsOptional) => boolean,
    isSelected: (opts?:  Workflo.WDIOParamsOptional) => boolean
  }
}

export class PageElement<
  Store extends PageElementStore
> extends PageNode<Store> implements Workflo.PageNode.IGetText {
  protected waitType: Workflo.WaitType
  protected timeout: number
  protected _$: Store
  protected customScroll: Workflo.ScrollParams

  // available options:
  // - wait -> initial wait operation: exist, visible, text, value
  constructor(
    protected selector: string,
    {
      waitType = Workflo.WaitType.visible,
      timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default,
      customScroll = undefined,
      ...superOpts
    }: IPageElementOpts<Store>
  ) {
    super(selector, superOpts)

    this._$ = Object.create(null)

    for ( const method of Workflo.Class.getAllMethods(this.store) ) {
      if ( method.indexOf('_') !== 0 && /^[A-Z]/.test( method ) ) {
        this._$[ method ] = <Options extends IPageElementOpts<Store>>( _selector: Workflo.XPath, _options: Options) => {

          if (_selector instanceof XPathBuilder) {
            _selector = XPathBuilder.getInstance().build()
          }

          // chain selectors
          _selector = `${selector}${_selector}`

          return this.store[ method ].apply( this.store, [ _selector, _options ] )
        }
      }
    }

    this.waitType = waitType
    this.timeout = timeout
    this.customScroll = customScroll
  }

// RETRIEVE ELEMENT FUNCTIONS

  get $(): Store {
    return this._$
  }

  /**
   *
   */
  get _element() {
    return browser.element(this.selector)
  }

  get element() {
    this.initialWait()

    return this._element
  }

  initialWait() {
    switch(this.waitType) {
      case Workflo.WaitType.exist:
      if (!this.exists()) {
        this._waitExists()
      }
      break
      case Workflo.WaitType.visible:
      if (!this.isVisible()) {
        this._waitIsVisible()
      }
      break
      case Workflo.WaitType.value:
      if (!this.hasAnyValue()) {
        this._waitHasAnyValue()
      }
      break
      case Workflo.WaitType.text:
      if (!this.hasAnyText()) {
        this._waitHasAnyText()
      }
      break
    }

    return this
  }

// CHECK STATE FUNCTIONS

  // Returns true if element matching this selector currently exists.
  exists() : boolean {
    return this._element.isExisting()
  }

  // Returns true if element matching this selector currently is visible.
  isVisible() : boolean {
    return this._element.isVisible()
  }

  hasClass(className: string) : boolean {
    return this.getClass() === className
  }

  containsClass(className: string) : boolean {
    return this.getClass().indexOf(className) > -1
  }

  // Returns true if element matching this selector currently has text.
  hasText(text: string) : boolean {
    return this._element.getText() === text
  }

  hasAnyText() : boolean {
    return this._element.getText().length > 0
  }

  // Returns true if element matching this selector currently contains text.
  containsText(text: string) : boolean {
    return this._element.getText().indexOf(text) > -1
  }

  // Returns true if element matching this selector currently has value.
  hasValue(value: string) : boolean {
    return this._element.getValue() === value
  }

  hasAnyValue() : boolean {
    return this._element.getValue().length > 0
  }

  // Returns true if element matching this selector currently contains value.
  containsValue(value: string) : boolean {
    return this._element.getValue().indexOf(value) > -1
  }

  // Returns true if element matching this selector is enabled.
  isEnabled() : boolean {
    return this._element.isEnabled()
  }

  // Returns true if element matching this selector is enabled.
  isSelected() : boolean {
    return this._element.isSelected()
  }

// GETTER FUNCTIONS

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
    let text = ""

    const handler = new htmlParser.DomHandler(function (error, dom) {
      if (error) {
        throw new Error(`Error creating dom for exclusive text in ${this.element.selector}: ${error}`)
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

    var parser = new htmlParser.Parser(handler);
    parser.write(html);
    parser.end();


    return text

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

  getValue() {
    return this.element.getValue()
  }

  getAttribute(attrName) {
    return this.element.getAttribute(attrName)
  }

  getClass() {
    return this.element.getAttribute('class')
  }

  getId(){
    return this.element.getAttribute('id')
  }

  getName() {
    return this.element.getAttribute('name')
  }

  getLocation(axis: WebdriverIO.Axis) {
    return this.element.getLocation(axis)
  }

  getSize() {
    return this.element.getElementSize();
  }

  getTimeout() {
    return this.timeout
  }

// INTERACTION FUNCTIONS

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
  click(options?: {postCondition?: () => boolean, timeout?: number, customScroll?: Workflo.ScrollParams}) {
    this.initialWait()

    let errorMessage = ''
    const interval = 250
    const viewPortSize = browser.getViewportSize()
    let y = viewPortSize.height / 2
    let x = viewPortSize.width / 2
    let remainingTimeout = this.timeout;

    if (!options) {
      options = {}
    }

    if (options && !options.customScroll) {
      if (this.customScroll) {
        options.customScroll = this.customScroll
      }
    }

    const clickFunc = !options.customScroll ? () => this._element.click() : () => {
      const result: Workflo.JSError = browser.selectorExecute(this.getSelector(), function (elems: HTMLElement[], selector) {
        if (elems.length === 0) {
          return {
            notFound: [selector]
          }
        }

        elems[0].click()
      }, this.getSelector())

      if (isJsError(result)) {
        throw new Error(`Element could not be clicked: ${result.notFound.join(', ')}`)
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
      }, this.timeout, `Element did not become clickable after timeout: ${this.selector}`, interval);
    } catch (waitE) {
        waitE.message = errorMessage.replace('unknown error: ', '')
        throw waitE
    }

    if (options && options.postCondition && remainingTimeout > 0) {
      options.timeout = options.timeout || this.timeout

      try {
        browser.waitUntil(() => {
          try {
            if (options.postCondition()) {
              return true
            } else {
                if (this.isVisible() && this.isEnabled()) {
                  clickFunc()
                }
            }
          } catch( error ) {
            errorMessage = error.message
          }
        }, remainingTimeout + options.timeout, `Postcondition for click never became true: ${this.selector}`, interval)
      } catch (waitE) {
        waitE.message = errorMessage.replace('unknown error: ', '')
        throw waitE
      }
    }

    return this
  }

  scrollTo(
    params: Workflo.ScrollParams
  ) : Workflo.ScrollResult {
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
        container = <HTMLElement> document.evaluate(params.containerSelector, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

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

// WAIT

  // Waits until at least one matching element exists.
  //
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // exists that matches the this.selector.
  private _waitExists(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    this._element.waitForExist(timeout)

    return this
  }

  private _waitNotExists(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    this._element.waitForExist(timeout, true)

    return this
  }

  // Waits until at least one matching element is visible.
  //
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // is visible that matches the this.selector.
  private _waitIsVisible(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    this._element.waitForVisible(timeout)

    return this
  }

  private _waitNotIsVisible(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    this._element.waitForVisible(timeout, true)

    return this
  }

  private _waitHasClass(
    className: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    browser.waitUntil(() => {
      return this.hasClass(className)
    }, timeout, `${this.selector}: Class never became '${className}'`)

    return this
  }

  private _waitNotHasClass(
    className: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    browser.waitUntil(() => {
      return !this.hasClass(className)
    }, timeout, `${this.selector}: Class never became other than '${className}'`)

    return this
  }

  private _waitContainsClass(
    className: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    browser.waitUntil(() => {
      return this.containsClass(className)
    }, timeout, `${this.selector}: Class never contained '${className}'`)

    return this
  }

  private _waitNotContainsClass(
    className: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    browser.waitUntil(() => {
      return !this.containsClass(className)
    }, timeout, `${this.selector}: Class never not contained '${className}'`)

    return this
  }

  // Waits until at least one matching element has a text.
  //
  // text -> defines the text that element should have
  // If text is undefined, waits until element's text is not empty.
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // has a text that matches the this.selector.
  private _waitHasText(
    text: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    browser.waitUntil(() => {
      return this.hasText(text)
    }, timeout, `${this.selector}: Text never became '${text}'`)

    return this
  }

  private _waitNotHasText(
    text: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    browser.waitUntil(() => {
      return !this.hasText(text)
    }, timeout, `${this.selector}: Text never became other than '${text}'`)

    return this
  }

  private _waitHasAnyText(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    this._element.waitForText(timeout)

    return this
  }

  private _waitNotHasAnyText(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    this._element.waitForText(timeout, true)

    return this
  }

  // Waits until at least one matching element contains a text.
  //
  // text -> defines the text that element should have
  // If text is undefined, waits until element's text is not empty.
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // has a text that matches the this.selector.
  private _waitContainsText(
    text: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    browser.waitUntil(() => {
      return this.containsText(text)
    }, timeout, `${this.selector}: Text never contained '${text}'`)

    return this
  }

  private _waitNotContainsText(
    text: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    browser.waitUntil(() => {
      return !this.containsText(text)
    }, timeout, `${this.selector}: Text never not contained '${text}'`)

    return this
  }

  // Waits until at least one matching element has a value.
  //
  // value -> defines the value that element should have
  // If value is undefined, waits until element's value is not empty.
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // has a value that matches the this.selector.
  private _waitHasValue(
    value: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    browser.waitUntil(() => {
      return this.hasValue(value)
    }, timeout, `${this.selector}: Value never became '${value}'`)

    return this
  }

  private _waitNotHasValue(
    value: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    browser.waitUntil(() => {
      return !this.hasValue(value)
    }, timeout, `${this.selector}: Value never became other than '${value}'`)

    return this
  }

  private _waitHasAnyValue(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    this._element.waitForValue(timeout)

    return this
  }

  private _waitNotHasAnyValue(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    this._element.waitForValue(timeout, true)

    return this
  }

  // Waits until at least one matching element contains a value.
  //
  // value -> defines the value that element should have
  // If value is undefined, waits until element's value is not empty.
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // has a text that matches the this.selector.
  private _waitContainsValue(
    value: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    browser.waitUntil(() => {
      return this.containsValue(value)
    }, timeout, `${this.selector}: Value never contained '${value}'`)

    return this
  }

  private _waitNotContainsValue(
    value: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    browser.waitUntil(() => {
      return !this.containsValue(value)
    }, timeout, `${this.selector}: Value never not contained '${value}'`)

    return this
  }

  // Waits until at least one matching element is enabled.
  //
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // is enabled that matches the this.selector.
  private _waitIsEnabled(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    this._element.waitForEnabled(timeout)

    return this
  }

  private _waitNotIsEnabled(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    this._element.waitForEnabled(timeout, true)

    return this
  }

  // Waits until at least one matching element is selected.
  //
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // is selected that matches the this.selector.
  private _waitIsSelected(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    this._element.waitForSelected(timeout)

    return this
  }

  private _waitNotIsSelected(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    this._element.waitForSelected(timeout, true)

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
    isEnabled: this._waitIsEnabled,
    isSelected: this._waitIsSelected,

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
      isEnabled: this._waitNotIsEnabled,
      isSelected: this._waitNotIsSelected,
    }
  }

// EVENTUALLY FUNCTIONS

  private _eventually(func: () => void) : boolean {
    try {
      func();
      return true;
    } catch (error) {
      return false;
    }
  }

  // checks if at least one element matching selector is existing within timeout
  // reverse is optional and false by default
  // timeout is optional and this._timeout by default
  private _eventuallyExists({ timeout = this.timeout }: Workflo.WDIOParamsOptional = {}) {
    return this._eventually(() => this._waitExists({timeout}))
  }

  private _eventuallyNotExists({ timeout = this.timeout }: Workflo.WDIOParamsOptional = {}) {
    return this._eventually(() => this._waitNotExists({timeout}))
  }

  // checks if at least one element matching selector is visible within timeout
  // reverse is optional and false by default
  // timeout is optional and this._timeout by default
  private _eventuallyIsVisible({ timeout = this.timeout }: Workflo.WDIOParamsOptional = {}) {
    return this._eventually(() => this._waitIsVisible({timeout}))
  }

  private _eventuallyNotIsVisible({ timeout = this.timeout }: Workflo.WDIOParamsOptional = {}) {
    return this._eventually(() => this._waitNotIsVisible({timeout}))
  }

  private _eventuallyHasClass(
    className: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitHasClass(className, {timeout}))
  }

  private _eventuallyNotHasClass(
    className: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitNotHasClass(className, {timeout}))
  }

  private _eventuallyContainsClass(
    className: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitContainsClass(className, {timeout}))
  }

  private _eventuallyNotContainsClass(
    className: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitNotContainsClass(className, {timeout}))
  }

  private _eventuallyHasText(
    text: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitHasText(text, {timeout}))
  }

  private _eventuallyNotHasText(
    text: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitNotHasText(text, {timeout}))
  }

  private _eventuallyHasAnyText(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitHasAnyText({timeout}))
  }

  private _eventuallyNotHasAnyText(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitNotHasAnyText({timeout}))
  }

  private _eventuallyContainsText(
    text: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitContainsText(text, {timeout}))
  }

  private _eventuallyNotContainsText(
    text: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitNotContainsText(text, {timeout}))
  }

  private _eventuallyHasValue(
    value: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitHasValue(value, {timeout}))
  }

  private _eventuallyNotHasValue(
    value: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitNotHasValue(value, {timeout}))
  }

  private _eventuallyHasAnyValue(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitHasAnyValue({timeout}))
  }

  private _eventuallyNotHasAnyValue(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitNotHasAnyValue({timeout}))
  }

  private _eventuallyContainsValue(
    value: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitContainsValue(value, {timeout}))
  }

  private _eventuallyNotContainsValue(
    value: string, { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitNotContainsValue(value, {timeout}))
  }

  private _eventuallyIsEnabled(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitIsEnabled({timeout}))
  }

  private _eventuallyNotIsEnabled(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitNotIsEnabled({timeout}))
  }

  private _eventuallyIsSelected(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitIsSelected({timeout}))
  }

  private _eventuallyNotIsSelected(
    { timeout = this.timeout }: Workflo.WDIOParamsOptional = {}
  ) {
    return this._eventually(() => this._waitNotIsSelected({timeout}))
  }

  public eventually: IPageElementEventuallyAPI = {
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
    isEnabled: this._eventuallyIsEnabled,
    isSelected: this._eventuallyIsSelected,

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