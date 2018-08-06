import * as _ from 'lodash'

import { PageNode, IPageNodeOpts } from './'
import { XPathBuilder } from '../builders'
import { PageElementStore } from '../stores'
import * as htmlParser from 'htmlparser2'

export interface IPageElementOpts<
  Store extends PageElementStore
> extends IPageNodeOpts<Store> {
  wait?: Workflo.WaitType
  timeout?: number
  customScroll?: Workflo.ScrollParams
}

export class PageElement<
  Store extends PageElementStore
> extends PageNode<Store> implements Workflo.PageNode.IGetText, Workflo.PageNode.INode {
  protected wait: Workflo.WaitType
  protected timeout: number
  protected _$: Store
  protected customScroll: Workflo.ScrollParams

  // available options:
  // - wait -> initial wait operation: exist, visible, text, value
  constructor(
    protected selector: string,
    {
      wait = Workflo.WaitType.visible,
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

    this.wait = wait
    this.timeout = timeout
    this.customScroll = customScroll
  }

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
    switch(this.wait) {
      case Workflo.WaitType.exist:
      if (!this.exists()) {
        this.waitExist()
      }
      break
      case Workflo.WaitType.visible:
      if (!this.isVisible()) {
        this.waitVisible()
      }
      break
      case Workflo.WaitType.value:
      if (!this.hasValue()) {
        this.waitValue()
      }
      break
      case Workflo.WaitType.text:
      if (!this.hasText()) {
        this.waitText()
      }
      break
    }
  }

  // Returns true if element matching this selector currently exists.
  exists() : boolean {
    return this._element.isExisting()
  }

  // Returns true if element matching this selector currently is visible.
  isVisible() : boolean {
    return this._element.isVisible()
  }

  // Returns true if element matching this selector currently has text.
  hasText(text: string = undefined) : boolean {
    return (text) ? this._element.getText() === text : this._element.getText().length > 0
  }

  // Returns true if element matching this selector currently contains text.
  containsText(text: string = undefined) : boolean {
    return (text) ? this._element.getText().indexOf(text) > -1 : this._element.getText().length > 0
  }

  // Returns true if element matching this selector currently has value.
  hasValue(value: string = undefined) : boolean {
    return (value) ? this._element.getValue() === value : this._element.getValue().length > 0
  }

  // Returns true if element matching this selector currently contains value.
  containsValue(value: string = undefined) : boolean {
    return (value) ? this._element.getValue().indexOf(value) > -1 : this._element.getValue().length > 0
  }

  // Returns true if element matching this selector is enabled.
  isEnabled() : boolean {
    return this._element.isEnabled()
  }

  // Returns true if element matching this selector is enabled.
  isSelected() : boolean {
    return this._element.isSelected()
  }

  // checks if at least one element matching selector is existing within timeout
  // reverse is optional and false by default
  // timeout is optional and this._timeout by default
  eventuallyExists({ reverse = false, timeout = this.timeout }: Workflo.WDIOParams = {}) {
    try {
     this.waitExist({reverse, timeout})
    } catch (error) {
      return reverse
    }

    return !reverse
  }

  eventuallyDoesNotExist({ timeout = this.timeout }: Workflo.WDIOParams = {}) {
    return this.eventuallyExists({reverse: true, timeout})
  }

  // checks if at least one element matching selector is visible within timeout
  // reverse is optional and false by default
  // timeout is optional and this._timeout by default
  eventuallyIsVisible({ reverse = false, timeout = this.timeout }: Workflo.WDIOParams = {}) {
    try {
      this.waitVisible({reverse, timeout})
    } catch (error) {
      return reverse
    }

    return !reverse
  }

  eventuallyIsHidden({ reverse = true, timeout = this.timeout }: Workflo.WDIOParams = {}) {
    try {
      this.waitVisible({reverse, timeout})
    } catch (error) {
      return !reverse
    }

    return reverse
  }

  eventuallyHasText(
    { reverse = false, timeout = this.timeout, text = undefined }: Workflo.WDIOParams & { text?: string } = {}
  )  {
    try {
      this.waitText({reverse, timeout, text})
    } catch (error) {
      return reverse
    }

    return !reverse
  }

  eventuallyContainsText(
    { reverse = false, timeout = this.timeout, text = undefined }: Workflo.WDIOParams & { text?: string } = {}
  )  {
    try {
      this.waitContainsText({reverse, timeout, text})
    } catch (error) {
      return reverse
    }

    return !reverse
  }

  eventuallyHasValue(
    { reverse = false, timeout = this.timeout, value = undefined }: Workflo.WDIOParams & { value?: string } = {}
  ) {
    try {
      this.waitValue({reverse, timeout, value})
    } catch (error) {
      return reverse
    }

    return !reverse
  }

  eventuallyIsEnabled(
    { reverse = false, timeout = this.timeout }: Workflo.WDIOParams
  ) {
    try {
      this.waitEnabled({reverse, timeout})
    } catch (error) {
      return reverse
    }

    return !reverse
  }

  eventuallyIsSelected(
    { reverse = false, timeout = this.timeout }: Workflo.WDIOParams
  ) {
    try {
      this.waitSelected({reverse, timeout})
    } catch (error) {
      return reverse
    }

    return !reverse
  }

  // WAIT FUNCTIONS

  // Waits until at least one matching element exists.
  //
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // exists that matches the this.selector.
  waitExist(
    { timeout = this.timeout, reverse = false }: Workflo.WDIOParams = {}
  ) {
    this._element.waitForExist(timeout, reverse)

    return this
  }

  waitDoesNotExist(
    { timeout = this.timeout }: Workflo.WDIOParams = {}
  ) {
    return this.waitExist({reverse: true, timeout})
  }

  // Waits until at least one matching element is visible.
  //
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // is visible that matches the this.selector.
  waitVisible(
    { timeout = this.timeout, reverse = false }: Workflo.WDIOParams = {}
  ) {
    this._element.waitForVisible(timeout, reverse)

    return this
  }

  waitHidden(
    { timeout = this.timeout, reverse = false }: Workflo.WDIOParams = {}
  ) {
    this._element.waitForVisible(timeout, !reverse)

    return this
  }

  // Waits until at least one matching element has a text.
  //
  // text -> defines the text that element should have
  // If text is undefined, waits until element's text is not empty.
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // has a text that matches the this.selector.
  waitText(
    { reverse = false, timeout = this.timeout, text = undefined }: Workflo.WDIOParams & { text?: string } = {}
  ) {
    this._element.waitForText(timeout, reverse)

    if (typeof text !== 'undefined' &&
      typeof this._element.getText !== 'undefined') {
      browser.waitUntil(() => {
        return this.hasText(text)
      }, timeout, `${this.selector}: Text never became ${text}`)
    }

    return this
  }

  // Waits until at least one matching element contains a text.
  //
  // text -> defines the text that element should have
  // If text is undefined, waits until element's text is not empty.
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // has a text that matches the this.selector.
  waitContainsText(
    { reverse = false, timeout = this.timeout, text = undefined }: Workflo.WDIOParams & { text?: string } = {}
  ) {
    this._element.waitForText(timeout, reverse)

    if (typeof text !== 'undefined' &&
      typeof this._element.getText !== 'undefined') {
      browser.waitUntil(() => {
        return this.containsText(text)
      }, timeout, `${this.selector}: Text never contained ${text}`)
    }

    return this
  }

  // Waits until at least one matching element has a value.
  //
  // value -> defines the value that element should have
  // If value is undefined, waits until element's value is not empty.
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // has a value that matches the this.selector.
  waitValue(
    { reverse = false, timeout = this.timeout, value = undefined }: Workflo.WDIOParams & { value?: string } = {}
  ) {
    this._element.waitForValue(timeout, reverse)

    if (typeof value !== 'undefined' &&
      typeof this._element.getValue !== 'undefined') {
      browser.waitUntil(() => {
        return this.hasValue(value)
      }, timeout, `${this.selector}: Value never became ${value}`)
    }

    return this
  }

  // Waits until at least one matching element contains a value.
  //
  // value -> defines the value that element should have
  // If value is undefined, waits until element's value is not empty.
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // has a text that matches the this.selector.
  waitContainsValue(
    { reverse = false, timeout = this.timeout, value = undefined }: Workflo.WDIOParams & { value?: string } = {}
  ) {
    this._element.waitForValue(timeout, reverse)

    if (typeof value !== 'undefined' &&
      typeof this._element.getValue !== 'undefined') {
      browser.waitUntil(() => {
        return this.containsValue(value)
      }, timeout, `${this.selector}: Value never contained ${value}`)
    }

    return this
  }

  // Waits until at least one matching element is enabled.
  //
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // is enabled that matches the this.selector.
  waitEnabled(
    { reverse = false, timeout = this.timeout }: Workflo.WDIOParams = {}
  ) {
    this._element.waitForEnabled(timeout, reverse)

    return this
  }

  // Waits until at least one matching element is selected.
  //
  // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
  // If reverse is set to true, function will wait until no element
  // is selected that matches the this.selector.
  waitSelected(
    { reverse = false, timeout = this.timeout }: Workflo.WDIOParams = {}
  ) {
    this._element.waitForSelected(timeout, reverse)

    return this
  }

  // AWAITED GETTER FUNCTIONS

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

  getAttribute(attrName) {
    return this.element.getAttribute(attrName)
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

  // INTERACTION FUNCTIONS

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

    const result: Workflo.JSError | Workflo.ScrollResult = browser.selectorExecute([this.getSelector()], function (elems: HTMLElement[], elementSelector, params) {
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
        container = getScrollParent(elem, true)
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