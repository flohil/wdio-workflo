import * as _ from 'lodash'

import { PageNode, IPageNodeOpts } from '.'
import { XPathBuilder } from '../builders'
import { PageElementStore } from '../stores'
import * as htmlParser from 'htmlparser2'
import { tolerancesToString } from '../../helpers'
import { DEFAULT_TIMEOUT } from '../'

export type WdioElement = WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element>> & WebdriverIO.RawResult<WebdriverIO.Element>

export interface ITolerance {
  lower: number,
  upper: number
}

export interface IPageElementOpts<
  Store extends PageElementStore
  > extends IPageNodeOpts<Store> {
  waitType?: Workflo.WaitType
  timeout?: number
  customScroll?: Workflo.IScrollParams
}

export interface IPageElementWaitEventuallyBase<OptionalParams, ReturnType> {
  exists: (opts?: OptionalParams) => ReturnType,
  isVisible: (opts?: OptionalParams) => ReturnType,
  isEnabled: (opts?: OptionalParams) => ReturnType,
  isSelected: (opts?: OptionalParams) => ReturnType,
  isChecked: (opts?: OptionalParams) => ReturnType,
  hasText: (text: string, opts?: OptionalParams) => ReturnType,
  hasAnyText: (opts?: OptionalParams) => ReturnType,
  containsText: (text: string, opts?: OptionalParams) => ReturnType,
  hasHTML: (html: string, opts?: OptionalParams) => ReturnType,
  hasAnyHTML: (opts?: OptionalParams) => ReturnType,
  containsHTML: (html: string, opts?: OptionalParams) => ReturnType,
  hasDirectText: (directText: string, opts?: OptionalParams) => ReturnType,
  hasAnyDirectText: (opts?: OptionalParams) => ReturnType,
  containsDirectText: (directText: string, opts?: OptionalParams) => ReturnType,
  hasAttribute: (attributeName: string, attributeValue: string, opts?: OptionalParams) => ReturnType,
  hasAnyAttribute: (attributeName: string, opts?: OptionalParams) => ReturnType,
  containsAttribute: (attributeName: string, attributeValue: string, opts?: OptionalParams) => ReturnType,
  hasClass: (className: string, opts?: OptionalParams) => ReturnType,
  hasAnyClass: (opts?: OptionalParams) => ReturnType,
  containsClass: (className: string, opts?: OptionalParams) => ReturnType,
  hasId: (id: string, opts?: OptionalParams) => ReturnType,
  hasAnyId: (opts?: OptionalParams) => ReturnType,
  containsId: (id: string, opts?: OptionalParams) => ReturnType,
  hasName: (name: string, opts?: OptionalParams) => ReturnType,
  hasAnyName: (opts?: OptionalParams) => ReturnType,
  containsName: (name: string, opts?: OptionalParams) => ReturnType,
  hasLocation: (
    coordinates: Partial<Workflo.ICoordinates>,
    opts?: {tolerances?: Partial<Workflo.ICoordinates>} & OptionalParams
  ) => ReturnType,
  hasX: (x: number, opts?: {tolerance?: number} & OptionalParams) => ReturnType,
  hasY: (y: number, opts?: {tolerance?: number} & OptionalParams) => ReturnType,
  hasSize: (
    size: Partial<Workflo.ISize>,
    opts?: {tolerances?: Partial<Workflo.ISize>} & OptionalParams
  ) => ReturnType,
  hasWidth: (width: number, opts?: {tolerance?: number} & OptionalParams) => ReturnType,
  hasHeight: (height: number, opts?: {tolerance?: number} & OptionalParams) => ReturnType
}

export interface IPageElementCheckState {
  exists: () => boolean,
  isVisible: () => boolean,
  isEnabled: () => boolean,
  isSelected: () => boolean,
  isChecked: () => boolean,
  hasText: (text: string) => boolean,
  hasAnyText: () => boolean,
  containsText: (text: string) => boolean,
  hasHTML: (html: string) => boolean,
  hasAnyHTML: () => boolean,
  containsHTML: (html: string) => boolean,
  hasAttribute: (attributeName: string, attributeValue: string) => boolean,
  hasAnyAttribute: (attributeName: string) => boolean,
  containsAttribute: (attributeName: string, attributeValue: string) => boolean,
  hasClass: (className: string) => boolean,
  hasAnyClass: () => boolean,
  containsClass: (className: string) => boolean,
  hasId: (id: string) => boolean,
  hasAnyId: () => boolean,
  containsId: (id: string) => boolean,
  hasName: (name: string) => boolean,
  hasAnyName: () => boolean,
  containsName: (name: string) => boolean,
  hasDirectText: (directText: string) => boolean,
  hasAnyDirectText: () => boolean,
  containsDirectText: (directText: string) => boolean,
  hasLocation: (coordinates: Partial<Workflo.ICoordinates>, tolerances?: Partial<Workflo.ICoordinates>) => boolean,
  hasX: (x: number, tolerance?: number) => boolean,
  hasY: (y: number, tolerance?: number) => boolean,
  hasSize: (size: Partial<Workflo.ISize>, tolerances?: Partial<Workflo.ISize>) => boolean,
  hasWidth: (width: number, tolerance?: number) => boolean,
  hasHeight: (height: number, tolerance?: number) => boolean,
}

export interface IPageElementGetState {
  element: WdioElement,
  getHTML: () => string
  getText: () => string
  getDirectText: () => string
  getAttribute: (attributeName: string) => string
  getClass: () => string
  getId: () => string
  getName: () => string
  getLocation: () => Workflo.ICoordinates
  getX: () => number
  getY: () => number
  getSize: () => Workflo.ISize
  getWidth: () => number
  getHeight: () => number
}

export interface IPageElementCurrently
extends IPageElementCheckState, IPageElementGetState {
  lastActualResult: string
  not: IPageElementCheckState
}

export interface IPageElementWaitNot<
  Store extends PageElementStore,
  PageElementType extends IPageElement<Store>
> extends IPageElementWaitEventuallyBase<Workflo.IWDIOParamsOptionalReverse, PageElementType>{}

export interface IPageElementWait<
  Store extends PageElementStore,
  PageElementType extends IPageElement<Store>
> extends IPageElementWaitEventuallyBase<Workflo.IWDIOParamsOptionalReverse, PageElementType>{
  untilElement: (
    description: string,
    condition: (element: PageElementType) => boolean,
    opts?: Workflo.IWDIOParamsOptional
  ) => PageElementType,
  not: IPageElementWaitNot<Store, PageElementType>
}

export interface IPageElementEventuallyNot
extends IPageElementWaitEventuallyBase<Workflo.IWDIOParamsOptional, boolean> {}

export interface IPageElementEventually<
  Store extends PageElementStore,
  PageElementType extends IPageElement<Store>
> extends IPageElementWaitEventuallyBase<Workflo.IWDIOParamsOptional, boolean> {
  meetsCondition: (condition: (element: PageElementType) => boolean, opts?: Workflo.IWDIOParamsOptional) => boolean
  not: IPageElementEventuallyNot
}

export interface IPageElement<
  Store extends PageElementStore,
> extends IPageElementGetState, Workflo.PageNode.IGetText {
  currently: IPageElementCurrently
  wait: IPageElementWait<Store, this>
  eventually: IPageElementEventually<Store, this>
  element: WdioElement
  $: Store
  initialWait: () => this
  click: (options?: {
      postCondition?: () => boolean,
      timeout?: number,
      customScroll?: Workflo.IScrollParams
  }) => this
  scrollTo: (params: Workflo.IScrollParams) => this
}

export class PageElement<
  Store extends PageElementStore
  > extends PageNode<Store>
  implements IPageElement<Store> {

  protected _waitType: Workflo.WaitType
  protected _timeout: number
  protected _$: Store
  protected _customScroll: Workflo.IScrollParams

  readonly currently: IPageElementCurrently
  readonly wait: IPageElementWait<Store, this>
  readonly eventually: IPageElementEventually<Store, this>

  constructor(
    selector: string,
    {
      waitType = Workflo.WaitType.visible,
      timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || DEFAULT_TIMEOUT,
      customScroll = undefined,
      ...superOpts
    }: IPageElementOpts<Store>
  ) {
    super(selector, superOpts)

    this._selector = selector
    this._$ = Object.create(null)

    for (const method of Workflo.Class.getAllMethods(this._store)) {
      if (method.indexOf('_') !== 0 && /^[A-Z]/.test(method)) {
        this._$[method] = <Options extends IPageElementOpts<Store>>(_selector: Workflo.XPath, _options: Options) => {

          if (_selector instanceof XPathBuilder) {
            selector = XPathBuilder.getInstance().build()
          }

          // chain selectors
          _selector = `${selector}${_selector}`

          return this._store[method].apply(this._store, [_selector, _options])
        }
      }
    }

    this._waitType = waitType
    this._timeout = timeout
    this._customScroll = customScroll

    this.currently = new PageElementCurrently(this)
    this.wait = new PageElementWait(this)
    this.eventually = new PageElementEventually(this)
  }

// RETRIEVE ELEMENT FUNCTIONS

  /**
   * Return WdioElement from current state, not performing an initial wait.
   */
  protected get __element() {
    return browser.element(this._selector)
  }

  /**
   * Return WdioElement after performing an initial wait.
   */
  get element() {
    this.initialWait()

    return this.__element
  }

  get $(): Store {
    return this._$
  }

  initialWait() {
    switch (this._waitType) {
      case Workflo.WaitType.exist:
        if (!this.currently.exists()) {
          this.wait.exists()
        }
        break
      case Workflo.WaitType.visible:
        if (!this.currently.isVisible()) {
          this.wait.isVisible()
        }
        break
      case Workflo.WaitType.text:
        if (!this.currently.hasAnyText()) {
          this.wait.hasAnyText()
        }
        break
      default:
        throw Error(`${this.constructor.name}: Unknown initial wait type '${this._waitType}'`)
    }

    return this
  }

// Public GETTER FUNCTIONS (return state after initial wait)

  getHTML() {
    this.initialWait()
    return getHTML(this)
  }
  getText() { return getText(this.element) }
  getDirectText() { return getDirectText(this.getHTML(), this) }
  getAttribute(attributeName: string) { return getAttribute(this.element, attributeName) }
  getClass() { return getAttribute(this.element, 'class') }
  getId() { return getAttribute(this.element, 'id') }
  getName() { return getAttribute(this.element, 'name') }
  getLocation() { return getLocation(this.element) }
  getX() { return getLocation(this.element).x }
  getY() { return getLocation(this.element).y }
  getSize() { return getSize(this.element) }
  getWidth() { return getSize(this.element).width }
  getHeight() { return getSize(this.element).height }

  getTimeout() { return this._timeout }

// INTERACTION FUNCTIONS (interact with state after initial wait)

  /**
   *
   * @param postCondition Sometimes javascript that is to be executed after a click
   * is not loaded right at the moment that the element wait condition
   * is fulfilled. (eg. element is visible)
   * In this case, postCondition function will be
   */
  click(options?: { postCondition?: () => boolean, timeout?: number, customScroll?: Workflo.IScrollParams }) {
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
      const result: Workflo.IJSError = browser.selectorExecute(this.getSelector(), function (elems: HTMLElement[], selector) {
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
      this._scrollTo(options.customScroll)
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
              if (this.currently.isVisible() && this.currently.isEnabled()) {
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

  _scrollTo(
    params: Workflo.IScrollParams
  ): Workflo.IScrollResult {
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

    const result: Workflo.IJSError | Workflo.IScrollResult = browser.selectorExecute(
      [this.getSelector()], function (elems: HTMLElement[], elementSelector: string, params: Workflo.IScrollParams
      ) {
        var error: Workflo.IJSError = {
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
      throw new Error(`${this.constructor.name} could not be located in scrollTo.\n( ${this.getSelector()} )`)
    } else {
      return result
    }
  }

  scrollTo(
    params: Workflo.IScrollParams
  ) {
    this._scrollTo(params)

    return this
  }
}

export class PageElementCurrently<
  Store extends PageElementStore,
> implements IPageElementCurrently, IPageElementGetState {

  protected _pageElement: PageElement<Store>
  protected _lastActualResult: string

  constructor(pageElement: PageElement<Store>) {
    this._pageElement = pageElement
  }

  /**
   * Whenever a function that checks the state of the GUI
   * by comparing an expected result to an actual result is called,
   * the actual result will be stored in 'lastActualResult'.
   *
   * This can be useful to determine why the last invocation of such a function returned false.
   *
   * These "check-GUI-state functions" include all hasXXX, hasAnyXXX and containsXXX functions
   * defined in the .currently, .eventually and .wait API of PageElement.
   */
  get lastActualResult() {
    return this._lastActualResult
  }

  get element() {
    return browser.element(this._pageElement.getSelector())
  }

  // GET STATE
  getHTML() { return getHTML(this._pageElement) }
  getText() { return getText(this.element, this._pageElement) }
  getDirectText() { return getDirectText(this.getHTML(), this._pageElement) }
  getAttribute(attributeName: string) { return getAttribute(this.element, attributeName, this._pageElement) }
  getClass() { return getAttribute(this.element, 'class', this._pageElement) }
  getId() { return getAttribute(this.element, 'id', this._pageElement) }
  getName() { return getAttribute(this.element, 'name', this._pageElement) }
  getLocation() { return getLocation(this.element, this._pageElement) }
  getX() { return getLocation(this.element, this._pageElement).x }
  getY() { return getLocation(this.element, this._pageElement).y }
  getSize() { return getSize(this.element, this._pageElement) }
  getWidth() { return getSize(this.element, this._pageElement).width }
  getHeight() { return getSize(this.element, this._pageElement).height }

// CHECK STATE

    /**
   * @param actual the actual browser value in pixels
   * @param expected the expected value in pixels or 0 if expected was smaller than 0
   * @param tolerance the tolerance in pixels or 0 if tolerance was smaller than 0
   */
  protected _withinTolerance(actual: number, expected: number, tolerance?: number) {
    const tolerances: ITolerance = {
      lower: actual,
      upper: actual
    }

    if ( tolerance ) {
      tolerances.lower -= Math.max(tolerance, 0)
      tolerances.upper += Math.max(tolerance, 0)
    }

    return Math.max(expected, 0) >= Math.max(tolerances.lower, 0) && Math.max(expected, 0) <= Math.max(tolerances.upper, 0)
  }

  protected _hasAxisLocation(expected: number, actual: number, tolerance?: number): boolean {
    return this._withinTolerance(actual, expected, tolerance)
  }

  protected _hasSideSize(expected: number, actual: number, tolerance?: number): boolean {
    return this._withinTolerance(actual, expected, tolerance)
  }

  protected _compareHas(expected: string, actual: string) {
    this._lastActualResult = actual || ''
    return actual === expected
  }

  protected _compareHasAny(actual: string) {
    const result = (actual) ? actual.length > 0 : false
    this._lastActualResult = actual || ''
    return result
  }

  protected _compareContains(expected: string, actual: string) {
    const result = (actual) ? actual.indexOf(expected) > -1 : false
    this._lastActualResult = actual || ''
    return result
  }

  exists = () => this.element.isExisting()
  isVisible = () => this.element.isVisible()
  isEnabled = () => isEnabled(this.element, this._pageElement)
  isSelected = () => isSelected(this.element, this._pageElement)
  isChecked = () => this.hasAnyAttribute('checked')
  hasText = (text: string) => this._compareHas(text, this.getText())
  hasAnyText = () => this._compareHasAny(this.getText())
  containsText = (text: string) => this._compareContains(text, this.getText())
  hasHTML = (html: string) => this._compareHas(html, this.getHTML())
  hasAnyHTML = () => this._compareHasAny(this.getHTML())
  containsHTML = (html: string) => this._compareContains(html, this.getHTML())
  hasDirectText = (directText: string) => this._compareHas(directText, this.getDirectText())
  hasAnyDirectText = () => this._compareHasAny(this.getDirectText())
  containsDirectText = (directText: string) => this._compareContains(directText, this.getDirectText())
  hasAttribute = (attributeName: string, attributeValue: string) => this._compareHas(
    attributeValue, this.getAttribute(attributeName)
  )
  hasAnyAttribute = (attributeName: string) => this._compareHasAny(this.getAttribute(attributeName))
  containsAttribute = (attributeName: string, attributeValue: string) => this._compareContains(
    attributeValue, this.getAttribute(attributeName)
  )
  hasClass = (className: string) => this._compareHas(className, this.getClass())
  hasAnyClass = () => this._compareHasAny(this.getClass())
  containsClass = (className: string) => this._compareContains(className, this.getClass())
  hasId = (id: string) => this._compareHas(id, this.getId())
  hasAnyId = () => this._compareHasAny(this.getId())
  containsId = (id: string) => this._compareContains(id, this.getId())
  hasName = (name: string) => this._compareHas(name, this.getName())
  hasAnyName = () => this._compareHasAny(this.getName())
  containsName = (name: string) => this._compareContains(name, this.getName())
  hasLocation = (coordinates: Workflo.ICoordinates, tolerances: Workflo.ICoordinates = { x: 0, y: 0 }) => {
    const actualCoords = this.getLocation()
    this._lastActualResult = tolerancesToString(actualCoords)

    return this._hasAxisLocation(coordinates.x, actualCoords.x, tolerances.x)
      && this._hasAxisLocation(coordinates.y, actualCoords.y, tolerances.y)
  }
  hasX = (x: number, tolerance?: number) => {
    const actual = this.getX()
    this._lastActualResult = actual.toString()

    return this._hasAxisLocation(x, actual, tolerance)
  }
  hasY = (y: number, tolerance?: number) => {
    const actual = this.getY()
    this._lastActualResult = actual.toString()

    return this._hasAxisLocation(y, actual, tolerance)
  }
  hasSize = (size: Workflo.ISize, tolerances: Workflo.ISize = {width: 0, height: 0}) => {
    const actualSize = this.getSize()
    this._lastActualResult = tolerancesToString(actualSize)

    return this._hasSideSize(size.width, actualSize.width, tolerances.width)
      && this._hasSideSize(size.height, actualSize.height, tolerances.height)
  }
  hasWidth = (width: number, tolerance?: number) => {
    const actual = this.getWidth()
    this._lastActualResult = actual.toString()

    return this._hasSideSize(width, actual, tolerance)
  }
  hasHeight = (height: number, tolerance?: number) => {
    const actual = this.getHeight()
    this._lastActualResult = actual.toString()

    return this._hasSideSize(height, actual, tolerance)
  }

  not = {
    exists: () => !this.exists(),
    isVisible: () => !this.isVisible(),
    isEnabled: () => !this.isEnabled(),
    isSelected: () => !this.isSelected(),
    isChecked: () => !this.isChecked(),
    hasText: (text: string) => !this.hasText(text),
    hasAnyText: () => !this.hasAnyText(),
    containsText: (text: string) => !this.containsText(text),
    hasDirectText: (directText: string) => !this.hasDirectText(directText),
    hasAnyDirectText: () => !this.hasAnyDirectText(),
    containsDirectText: (directText: string) => !this.containsDirectText(directText),
    hasAttribute: (attributeName: string, attributeValue: string) => !this.hasAttribute(attributeName, attributeValue),
    hasAnyAttribute: (attributeName: string) => !this.hasAnyAttribute(attributeName),
    containsAttribute: (attributeName: string, attributeValue: string) => !this.containsAttribute(attributeName, attributeValue),
    hasHTML: (html: string) => !this.hasHTML(html),
    hasAnyHTML: () => !this.hasAnyHTML(),
    containsHTML: (html: string) => !this.containsHTML(html),
    hasClass: (className: string) => !this.hasClass(className),
    hasAnyClass: () => !this.hasAnyClass(),
    containsClass: (className: string) => !this.containsClass(className),
    hasId: (id: string) => !this.hasId(id),
    hasAnyId: () => !this.hasAnyId(),
    containsId: (id: string) => !this.containsId(id),
    hasName: (name: string) => !this.hasName(name),
    hasAnyName: () => !this.hasAnyName(),
    containsName: (name: string) => !this.containsName(name),
    hasLocation: (coordinates: Workflo.ICoordinates, tolerances?: Workflo.ICoordinates) =>
      !this.hasLocation(coordinates, tolerances),
    hasX: (x: number, tolerance?: number) => !this.hasX(x, tolerance),
    hasY: (y: number, tolerance?: number) => !this.hasY(y, tolerance),
    hasSize: (size: Workflo.ISize, tolerances?: Workflo.ISize) =>
      !this.hasSize(size, tolerances),
    hasWidth: (width: number, tolerance?: number) => !this.hasWidth(width, tolerance),
    hasHeight: (height: number, tolerance?: number) => !this.hasHeight(height, tolerance),
  }
}

export class PageElementWait<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>
> implements IPageElementWait<Store, PageElementType> {

  protected _pageElement: PageElementType

  constructor(pageElement: PageElementType) {
    this._pageElement = pageElement
  }

// HELPER FUNCTIONS

  protected _wait(func: () => void, errorMessage: string) {
    try {
      func();
    } catch (error) {
      throw new Error(`${this._pageElement.constructor.name}${errorMessage}.\n( ${this._pageElement.getSelector()} )`)
    }

    return this._pageElement
  }

  protected _waitWdioCheckFunc(
    checkTypeStr: string,
    conditionFunc: (opts: Workflo.IWDIOParamsOptionalReverse) => boolean,
    { timeout = this._pageElement.getTimeout(), reverse }: Workflo.IWDIOParamsOptionalReverse = {}
  ) {
    const reverseStr = (reverse) ? ' not' : ''

    return this._wait(
      () => conditionFunc({timeout, reverse}),
      ` never${reverseStr} ${checkTypeStr} within ${timeout} ms`
    )
  }

  protected _waitProperty(
    name: string,
    conditionType: 'has' | 'contains' | 'any' | 'within',
    conditionFunc: (value?: string) => boolean,
    { timeout = this._pageElement.getTimeout(), reverse }: Workflo.IWDIOParamsOptionalReverse = {},
    value?: string
  ) {
    const reverseStr = (reverse) ? ' not' : ''
    let conditionStr = ''
    let errorMessage = ''

    if (conditionType === 'has') {
      conditionStr = 'became'
    } else if (conditionType === 'contains') {
      conditionStr = 'contained'
    } else if (conditionType === 'any') {
      conditionStr = 'any'
    } else if (conditionType === 'within') {
      conditionStr = 'was in range'
    }

    try {
      browser.waitUntil(() => {
        if (reverse) {
          return !conditionFunc(value)
        } else {
          return conditionFunc(value)
        }
      }, timeout)
    } catch ( error ) {
      if (conditionType === 'has' || conditionType === 'contains' || conditionType === 'within') {
        errorMessage =
          `${this._pageElement.constructor.name}'s ${name} "${this._pageElement.currently.lastActualResult}" never` +
          `${reverseStr} ${conditionStr} "${value}" within ${timeout} ms.\n( ${this._pageElement.getSelector()} )`
      } else if (conditionType === 'any') {
        errorMessage =
          `${this._pageElement.constructor.name} never${reverseStr} ${conditionStr} any ${name}` +
          ` within ${timeout} ms.\n( ${this._pageElement.getSelector()} )`
      }

      throw new Error(errorMessage)
    }

    return this._pageElement
  }

  protected _waitWithinProperty(
    name: string,
    value: string,
    conditionFunc: (value: string) => boolean,
    opts?: Workflo.IWDIOParamsOptionalReverse
  ) {
    return this._waitProperty(name, 'within', conditionFunc, opts, value)
  }

  protected _waitHasProperty(
    name: string,
    value: string,
    conditionFunc: (value: string) => boolean,
    opts?: Workflo.IWDIOParamsOptionalReverse
  ) {
    return this._waitProperty(name, 'has', conditionFunc, opts, value)
  }

  protected _waitHasAnyProperty(
    name: string,
    conditionFunc: (value: string) => boolean,
    opts?: Workflo.IWDIOParamsOptionalReverse
  ) {
    return this._waitProperty(name, 'any', conditionFunc, opts)
  }

  protected _waitContainsProperty(
    name: string,
    value: string,
    conditionFunc: (value: string) => boolean,
    opts?: Workflo.IWDIOParamsOptionalReverse
  ) {
    return this._waitProperty(name, 'contains', conditionFunc, opts, value)
  }

  protected _makeReverseParams(opts: Workflo.IWDIOParamsOptional = {}): Workflo.IWDIOParamsOptionalReverse {
    return {timeout: opts.timeout, reverse: true}
  }

  exists = (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitWdioCheckFunc(
    'existed', opts => this._pageElement.currently.element.waitForExist(opts.timeout, opts.reverse), opts
  )
  isVisible = (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitWdioCheckFunc(
    'became visible', opts => this._pageElement.currently.element.waitForVisible(opts.timeout, opts.reverse), opts
  )
  isEnabled = (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitWdioCheckFunc(
    'became enabled', opts => this._pageElement.currently.element.waitForEnabled(opts.timeout, opts.reverse), opts
  )
  isSelected = (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitWdioCheckFunc(
    'became selected', opts => this._pageElement.currently.element.waitForSelected(opts.timeout, opts.reverse), opts
  )
  isChecked = (opts: Workflo.IWDIOParamsOptionalReverse = {}) => {
    const timeout = opts.timeout || this._pageElement.getTimeout()
    const reverseStr = (opts.reverse) ? ' not' : ''

    browser.waitUntil(
      () => {
        if ( opts.reverse ) {
          return this._pageElement.currently.not.isChecked()
        } else {
          return this._pageElement.currently.isChecked()
        }
      },
      timeout,
      `${this.constructor.name} never${reverseStr} became checked within ${timeout} ms.\n` +
      `( ${this._pageElement.getSelector()} )`
    )

    return this._pageElement
  }
  hasText = (text: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
    'text', text, () => this._pageElement.currently.hasText(text), opts
  )
  hasAnyText = (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitWdioCheckFunc(
    'had any text', opts => this._pageElement.currently.element.waitForText(opts.timeout, opts.reverse), opts
  )
  containsText = (text: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
    'text', text, () => this._pageElement.currently.containsText(text), opts
  )
  hasHTML = (html: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
    'HTML', html, () => this._pageElement.currently.hasHTML(html), opts
  )
  hasAnyHTML = (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasAnyProperty(
    'HTML', () => this._pageElement.currently.hasAnyHTML(), opts
  )
  containsHTML = (html: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitContainsProperty(
    'HTML', html, () => this._pageElement.currently.containsHTML(html), opts
  )
  hasDirectText = (directText: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
    'direct text', directText, () => this._pageElement.currently.hasDirectText(directText), opts
  )
  hasAnyDirectText = (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasAnyProperty(
    'direct text', () => this._pageElement.currently.hasAnyDirectText(), opts
  )
  containsDirectText = (directText: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitContainsProperty(
    'direct text', directText, () => this._pageElement.currently.containsDirectText(directText), opts
  )
  hasAttribute = (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptionalReverse) => {
    return this._waitHasProperty(
      `Attribute '${attributeName}'`,
      attributeValue,
      () => this._pageElement.currently.hasAttribute(attributeName, attributeValue), opts
    )
  }
  hasAnyAttribute = (attributeName: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasAnyProperty(
    `Attribute '${attributeName}'`, () => this._pageElement.currently.hasAnyAttribute(attributeName), opts
  )
  containsAttribute = (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptionalReverse) => {
    return this._waitContainsProperty(
      `Attribute '${attributeName}'`,
      attributeValue,
      () => this._pageElement.currently.containsAttribute(attributeName, attributeValue), opts
    )
  }
  hasClass = (className: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
    `class`, className, () => this._pageElement.currently.hasClass(className), opts
  )
  hasAnyClass = (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasAnyProperty(
    `class`, () => this._pageElement.currently.hasAnyClass(), opts
  )
  containsClass = (className: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitContainsProperty(
    `class`, className, () => this._pageElement.currently.containsClass(className), opts
  )
  hasId = (id: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
    `id`, id, () => this._pageElement.currently.hasId(id), opts
  )
  hasAnyId = (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasAnyProperty(
    `id`, () => this._pageElement.currently.hasAnyId(), opts
  )
  containsId = (id: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitContainsProperty(
    `id`, id, () => this._pageElement.currently.containsId(id), opts
  )
  hasName = (name: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
    `name`, name, () => this._pageElement.currently.hasName(name), opts
  )
  hasAnyName = (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasAnyProperty(
    `id`, () => this._pageElement.currently.hasAnyName(), opts
  )
  containsName = (name: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitContainsProperty(
    `name`, name, () => this._pageElement.currently.containsName(name), opts
  )
  hasLocation = (
    coordinates: Workflo.ICoordinates,
    opts: {tolerances?: Partial<Workflo.ICoordinates>} & Workflo.IWDIOParamsOptionalReverse = { tolerances: { x: 0, y: 0 } }
  ) => {
    const { tolerances, ...otherOpts } = opts

    if (tolerances && (tolerances.x > 0 || tolerances.y > 0)) {
      return this._waitWithinProperty(
        `location`,
        tolerancesToString(coordinates, tolerances),
        () => this._pageElement.currently.hasLocation(coordinates, tolerances),
        otherOpts
      )
    } else {
      return this._waitHasProperty(
        `location`,
        tolerancesToString(coordinates),
        () => this._pageElement.currently.hasLocation(coordinates),
        otherOpts
      )
    }
  }
  hasX = (
    x: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptionalReverse = { tolerance: 0 }
  ) => {
    const { tolerance, ...otherOpts } = opts

    if ( tolerance ) {
      return this._waitWithinProperty(
        `X-location`,
        tolerancesToString(x, tolerance),
        () => this._pageElement.currently.hasX(x, tolerance),
        otherOpts
      )
    } else {
      return this._waitHasProperty(
        `X-location`,
        x.toString(),
        () => this._pageElement.currently.hasX(x),
        otherOpts
      )
    }
  }
  hasY = (
    y: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptionalReverse = { tolerance: 0 }
  ) => {
    const { tolerance, ...otherOpts } = opts

    if ( tolerance ) {
      return this._waitWithinProperty(
        `Y-location`,
        tolerancesToString(y, tolerance),
        () => this._pageElement.currently.hasY(y, tolerance),
        otherOpts
      )
    } else {
      return this._waitHasProperty(
        `Y-location`,
        y.toString(),
        () => this._pageElement.currently.hasY(y),
        otherOpts
      )
    }
  }
  hasSize = (
    size: Workflo.ISize,
    opts: {tolerances?: Partial<Workflo.ISize>} & Workflo.IWDIOParamsOptionalReverse = { tolerances: { width: 0, height: 0 } }
  ) => {
    const { tolerances, ...otherOpts } = opts

    if (tolerances && (tolerances.width > 0 || tolerances.height > 0)) {
      return this._waitWithinProperty(
        `size`,
        tolerancesToString(size, tolerances),
        () => this._pageElement.currently.hasSize(size, tolerances),
        otherOpts
      )
    } else {
      return this._waitHasProperty(
        `size`,
        tolerancesToString(size),
        () => this._pageElement.currently.hasSize(size),
        otherOpts
      )
    }
  }
  hasWidth = (
    width: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptionalReverse = { tolerance: 0 }
  ) => {
    const { tolerance, ...otherOpts } = opts

    if ( tolerance ) {
      return this._waitWithinProperty(
        `width`,
        tolerancesToString(width, tolerance),
        () => this._pageElement.currently.hasWidth(width, tolerance),
        otherOpts
      )
    } else {
      return this._waitHasProperty(
        `width`,
        width.toString(),
        () => this._pageElement.currently.hasWidth(width),
        otherOpts
      )
    }
  }
  hasHeight = (
    height: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptionalReverse = { tolerance: 0 }
  ) => {
    const { tolerance, ...otherOpts } = opts

    if ( tolerance ) {
      return this._waitWithinProperty(
        `height`,
        tolerancesToString(height, tolerance),
        () => this._pageElement.currently.hasHeight(height, tolerance),
        otherOpts
      )
    } else {
      return this._waitHasProperty(
        `height`,
        height.toString(),
        () => this._pageElement.currently.hasHeight(height),
        otherOpts
      )
    }
  }
  untilElement = (
    description: string,
    condition: (element: PageElementType) => boolean,
    { timeout = this._pageElement.getTimeout() }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(
      () => condition(this._pageElement),
      timeout,
      `${this._pageElement.constructor.name}: Wait until element ${description} failed.\n` +
      `( ${this._pageElement.getSelector()} )`
    )

    return this._pageElement
  }

  not = {
    exists: (opts?: Workflo.IWDIOParamsOptional) => {
      return this.exists(this._makeReverseParams(opts))
    },
    isVisible: (opts?: Workflo.IWDIOParamsOptional) => {
      return this.isVisible(this._makeReverseParams(opts))
    },
    isEnabled: (opts?: Workflo.IWDIOParamsOptional) => {
      return this.isEnabled(this._makeReverseParams(opts))
    },
    isSelected: (opts?: Workflo.IWDIOParamsOptional) => {
      return this.isSelected(this._makeReverseParams(opts))
    },
    isChecked: (opts?: Workflo.IWDIOParamsOptional) => {
      return this.isChecked(this._makeReverseParams(opts))
    },
    hasText: (text: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasText(text, this._makeReverseParams(opts))
    },
    hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasAnyText(this._makeReverseParams(opts))
    },
    containsText: (text: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.containsText(text, this._makeReverseParams(opts))
    },
    hasHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasHTML(html, this._makeReverseParams(opts))
    },
    hasAnyHTML: (opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasAnyHTML(this._makeReverseParams(opts))
    },
    containsHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.containsHTML(html, this._makeReverseParams(opts))
    },
    hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasDirectText(directText, this._makeReverseParams(opts))
    },
    hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasAnyDirectText(this._makeReverseParams(opts))
    },
    containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.containsDirectText(directText, this._makeReverseParams(opts))
    },
    hasAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasAttribute(attributeName, attributeValue, this._makeReverseParams(opts))
    },
    hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasAnyAttribute(attributeName, this._makeReverseParams(opts))
    },
    containsAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.containsAttribute(attributeName, attributeValue, this._makeReverseParams(opts))
    },
    hasClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasClass(className, this._makeReverseParams(opts))
    },
    hasAnyClass: (opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasAnyClass(this._makeReverseParams(opts))
    },
    containsClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.containsClass(className, this._makeReverseParams(opts))
    },
    hasId: (id: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasId(id, this._makeReverseParams(opts))
    },
    hasAnyId: (opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasAnyId(this._makeReverseParams(opts))
    },
    containsId: (id: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.containsId(id, this._makeReverseParams(opts))
    },
    hasName: (name: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasName(name, this._makeReverseParams(opts))
    },
    hasAnyName: (opts?: Workflo.IWDIOParamsOptional) => {
      return this.hasAnyName(this._makeReverseParams(opts))
    },
    containsName: (name: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this.containsName(name, this._makeReverseParams(opts))
    },
    hasLocation: (
      coordinates: Workflo.ICoordinates,
      opts: {tolerances?: Partial<Workflo.ICoordinates>} & Workflo.IWDIOParamsOptional = { tolerances: { x: 0, y: 0 } }
    ) => this.hasLocation(
      coordinates, {tolerances: opts.tolerances, timeout: opts.timeout, reverse: true}
    ),
    hasX: (
      x: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
    ) => this.hasX(
      x, {tolerance: opts.tolerance, timeout: opts.timeout, reverse: true}
    ),
    hasY: (
      y: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
    ) => this.hasY(
      y, {tolerance: opts.tolerance, timeout: opts.timeout, reverse: true}
    ),
    hasSize: (
      size: Workflo.ISize,
      opts: {tolerances?: Partial<Workflo.ISize>} & Workflo.IWDIOParamsOptional = { tolerances: { width: 0, height: 0 } }
    ) => this.hasSize(
      size, {tolerances: opts.tolerances, timeout: opts.timeout, reverse: true}
    ),
    hasWidth: (
      width: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
    ) => this.hasWidth(
      width, {tolerance: opts.tolerance, timeout: opts.timeout, reverse: true}
    ),
    hasHeight: (
      height: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
    ) => this.hasHeight(
      height, {tolerance: opts.tolerance, timeout: opts.timeout, reverse: true}
    )
  }
}

export class PageElementEventually<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>
> implements IPageElementEventually<Store, PageElementType> {

  protected _pageElement: PageElementType

  constructor(pageElement: PageElementType) {
    this._pageElement = pageElement
  }

  protected _eventually(func: () => void) : boolean {
    try {
      func();
      return true;
    } catch (error) {
      return false;
    }
  }

  exists = (opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.exists(opts))
  }
  isVisible = (opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.isVisible(opts))
  }
  isEnabled = (opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.isEnabled(opts))
  }
  isSelected = (opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.isSelected(opts))
  }
  isChecked = (opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.isChecked(opts))
  }
  hasText = (text: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasText(text, opts))
  }
  hasAnyText = (opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasAnyText(opts))
  }
  containsText = (text: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.containsText(text, opts))
  }
  hasHTML = (html: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasHTML(html, opts))
  }
  hasAnyHTML = (opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasAnyHTML(opts))
  }
  containsHTML = (html: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.containsHTML(html, opts))
  }
  hasDirectText = (directText: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasDirectText(directText, opts))
  }
  hasAnyDirectText = (opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasAnyDirectText(opts))
  }
  containsDirectText = (directText: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.containsDirectText(directText, opts))
  }
  hasAttribute = (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasAttribute(attributeName, attributeValue, opts))
  }
  hasAnyAttribute = (attributeName: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasAnyAttribute(attributeName, opts))
  }
  containsAttribute = (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.containsAttribute(attributeName, attributeValue, opts))
  }
  hasClass = (className: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasClass(className, opts))
  }
  hasAnyClass = (opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasAnyClass(opts))
  }
  containsClass = (className: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.containsClass(className, opts))
  }
  hasId = (id: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasId(id, opts))
  }
  hasAnyId = (opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasAnyId(opts))
  }
  containsId = (id: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.containsId(id, opts))
  }
  hasName = (name: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasName(name, opts))
  }
  hasAnyName = (opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.hasAnyName(opts))
  }
  containsName = (name: string, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(() => this._pageElement.wait.containsName(name, opts))
  }
  hasLocation = (
    coordinates: Workflo.ICoordinates,
    opts: {tolerances?: Partial<Workflo.ICoordinates>} & Workflo.IWDIOParamsOptional = { tolerances: { x: 0, y: 0 } }
  ) => this._eventually(
    () => this._pageElement.wait.hasLocation(coordinates, {tolerances: opts.tolerances, timeout: opts.timeout})
  )
  hasX = (
    x: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
  ) => this._eventually(
    () => this._pageElement.wait.hasX(x, {tolerance: opts.tolerance, timeout: opts.timeout})
  )
  hasY = (
    y: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
  ) => this._eventually(
    () => this._pageElement.wait.hasY(y, {tolerance: opts.tolerance, timeout: opts.timeout})
  )
  hasSize = (
    size: Workflo.ISize,
    opts: {tolerances?: Partial<Workflo.ISize>} & Workflo.IWDIOParamsOptional = { tolerances: { width: 0, height: 0 } }
  ) => this._eventually(
    () => this._pageElement.wait.hasSize(size, {tolerances: opts.tolerances, timeout: opts.timeout})
  )
  hasWidth = (
    width: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
  ) => this._eventually(
    () => this._pageElement.wait.hasWidth(width, {tolerance: opts.tolerance, timeout: opts.timeout})
  )
  hasHeight = (
    height: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
  ) => this._eventually(
    () => this._pageElement.wait.hasHeight(height, {tolerance: opts.tolerance, timeout: opts.timeout})
  )
  meetsCondition = (condition: (element: PageElementType) => boolean, opts?: Workflo.IWDIOParamsOptional) => {
    return this._eventually(
      () => this._pageElement.wait.untilElement(' meets condition', () => condition(this._pageElement), opts)
    )
  }

  not = {
    exists: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.exists(opts))
    },
    isVisible: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.isVisible(opts))
    },
    isEnabled: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.isEnabled(opts))
    },
    isSelected: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.isSelected(opts))
    },
    isChecked: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.isChecked(opts))
    },
    hasText: (text: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasText(text, opts))
    },
    hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasAnyText(opts))
    },
    containsText: (text: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.containsText(text, opts))
    },
    hasHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasHTML(html, opts))
    },
    hasAnyHTML: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasAnyHTML(opts))
    },
    containsHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.containsHTML(html, opts))
    },
    hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasDirectText(directText, opts))
    },
    hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasAnyDirectText(opts))
    },
    containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.containsDirectText(directText, opts))
    },
    hasAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasAttribute(attributeName, attributeValue, opts))
    },
    hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasAnyAttribute(attributeName, opts))
    },
    containsAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.containsAttribute(attributeName, attributeValue, opts))
    },
    hasClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasClass(className, opts))
    },
    hasAnyClass: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasAnyClass(opts))
    },
    containsClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.containsClass(className, opts))
    },
    hasId: (id: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasId(id, opts))
    },
    hasAnyId: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasAnyId(opts))
    },
    containsId: (id: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.containsId(id, opts))
    },
    hasName: (name: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasName(name, opts))
    },
    hasAnyName: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.hasAnyName(opts))
    },
    containsName: (name: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this._pageElement.wait.not.containsName(name, opts))
    },
    hasLocation: (
      coordinates: Workflo.ICoordinates,
      opts: {tolerances?: Partial<Workflo.ICoordinates>} & Workflo.IWDIOParamsOptional = { tolerances: { x: 0, y: 0 } }
    ) => this._eventually(
      () => this._pageElement.wait.not.hasLocation(coordinates, {tolerances: opts.tolerances, timeout: opts.timeout})
    ),
    hasX: (
      x: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
    ) => this._eventually(
      () => this._pageElement.wait.not.hasX(x, {tolerance: opts.tolerance, timeout: opts.timeout})
    ),
    hasY: (
      y: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
    ) => this._eventually(
      () => this._pageElement.wait.not.hasY(y, {tolerance: opts.tolerance, timeout: opts.timeout})
    ),
    hasSize: (
      size: Workflo.ISize,
      opts: {tolerances?: Partial<Workflo.ISize>} & Workflo.IWDIOParamsOptional = { tolerances: { width: 0, height: 0 } }
    ) => this._eventually(
      () => this._pageElement.wait.not.hasSize(size, {tolerances: opts.tolerances, timeout: opts.timeout})
    ),
    hasWidth: (
      width: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
    ) => this._eventually(
      () => this._pageElement.wait.not.hasWidth(width, {tolerance: opts.tolerance, timeout: opts.timeout})
    ),
    hasHeight: (
      height: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
    ) => this._eventually(
      () => this._pageElement.wait.not.hasHeight(height, {tolerance: opts.tolerance, timeout: opts.timeout})
    ),
  }
}

// UTILITY FUNCTIONS

/**
 * Gets text that resides on the level directly below the selected page element.
 * Does not include text of the page element's nested children elements.
 */
function getDirectText<Store extends PageElementStore>(html: string, pageElement?: PageElement<Store>): string {
  if (html.length === 0) {
    return ''
  }

  let text = ""
  const constructorName = pageElement.constructor.name
  const selector = pageElement.getSelector()

  const handler = new htmlParser.DomHandler(function (error, dom) {
    if (error) {
      throw new Error(`Error creating dom for direct text in ${constructorName}: ${error}\n( ${selector} )`)
    } else {
      dom.forEach(node => {
        if (node.type === 'text') {
            text += node.data
        }
      });
    }
  });

  const parser = new htmlParser.Parser(handler);
  parser.write(html);
  parser.end();

  return text
}

function getHTML<Store extends PageElementStore>(pageElement: PageElement<Store>) {

  const result: Workflo.IJSError | string = browser.selectorExecute(
    [pageElement.getSelector()], function (elems: HTMLElement[], elementSelector: string
  ) {
      var error: Workflo.IJSError = {
        notFound: []
      };

      if (elems.length === 0) {
        error.notFound.push(elementSelector);
      };

      if (error.notFound.length > 0) {
        return error;
      }

      var elem: HTMLElement = elems[0];

      return elem.innerHTML;
  }, pageElement.getSelector())

  if (isJsError(result)) {
    throw new Error(`${pageElement.constructor.name} could not be located on the page.\n( ${pageElement.getSelector()} )`)
  } else {
    return result || ''
  }
}

// returns text of this.element including
// all texts of nested children
function getText<Store extends PageElementStore>(element: WdioElement, pageElement?: PageElement<Store>): string {
  return elementExecute(() => element.getText(), pageElement)
}

function getAttribute<Store extends PageElementStore>(element: WdioElement, attrName: string, pageElement?: PageElement<Store>): string {
  return elementExecute(() => element.getAttribute(attrName), pageElement)
}

function getLocation<Store extends PageElementStore>(element: WdioElement, pageElement?: PageElement<Store>) {
  return <Workflo.ICoordinates> (<any> elementExecute(() => element.getLocation(), pageElement))
}

function getSize<Store extends PageElementStore>(element: WdioElement, pageElement?: PageElement<Store>) {
  return <Workflo.ISize> (<any> elementExecute(() => element.getElementSize(), pageElement))
}

function isEnabled<Store extends PageElementStore>(element: WdioElement, pageElement?: PageElement<Store>): boolean {
  return elementExecute(() => element.isEnabled(), pageElement)
}

function isSelected<Store extends PageElementStore>(element: WdioElement, pageElement?: PageElement<Store>): boolean {
  return elementExecute(() => element.isSelected(), pageElement)
}

/**
 * Executes func and, if pageElement is defined and an error occurs during execution of func,
 * throws a custom error message that the page element could not be located on the page.
 * @param func
 * @param pageElement
 */
export function elementExecute<Store extends PageElementStore, ResultType>(func: () => ResultType, pageElement?: PageElement<Store>) {
  if (pageElement) {
    try {
      return func()
    } catch ( error ) {
      const errorMsg = `${pageElement.constructor.name} could not be located on the page.\n( ${pageElement.getSelector()} )`

      throw new Error(errorMsg)
    }
  } else {
    return func()
  }
}

// TYPE GUARDS

function isJsError(result: any): result is Workflo.IJSError {
  if (!result) {
    return false
  }

  return result.notFound !== undefined;
}