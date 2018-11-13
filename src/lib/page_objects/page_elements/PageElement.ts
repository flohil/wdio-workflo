import * as _ from 'lodash'

import { PageNode, IPageNodeOpts } from '.'
import { XPathBuilder } from '../builders'
import { PageElementStore } from '../stores'
import * as htmlParser from 'htmlparser2'
import { tolerancesToString } from '../../helpers'
import { DEFAULT_TIMEOUT } from '../'

export type WdioElement = WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element>> & WebdriverIO.RawResult<WebdriverIO.Element>

export interface IPageElementOpts<
  Store extends PageElementStore
  > extends IPageNodeOpts<Store> {
  waitType?: Workflo.WaitType
  timeout?: number
  customScroll?: Workflo.IScrollParams
}

export interface ITolerance {
  lower: number,
  upper: number
}

export interface IPageElementCommonWaitAPI<Store extends PageElementStore, OptionalParams, ReturnType> {
  exists: (opts?: OptionalParams) => ReturnType,
  isVisible: (opts?: OptionalParams) => ReturnType,
  isEnabled: (opts?: OptionalParams) => ReturnType,
  isSelected: (opts?: OptionalParams) => ReturnType,
  isChecked: (opts?: OptionalParams) => ReturnType,
  hasText: (text: string, opts?: OptionalParams) => ReturnType,
  hasAnyText: (opts?: OptionalParams) => ReturnType,
  containsText: (text: string, opts?: OptionalParams) => ReturnType,
  hasValue: (value: string, opts?: OptionalParams) => ReturnType,
  hasAnyValue: (opts?: OptionalParams) => ReturnType,
  containsValue: (value: string, opts?: OptionalParams) => ReturnType,
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

export interface IPageElementCheckStateAPI<Store extends PageElementStore> {
  exists: () => boolean,
  isVisible: () => boolean,
  isEnabled: () => boolean,
  isSelected: () => boolean,
  isChecked: () => boolean,
  hasText: (text: string) => boolean,
  hasAnyText: () => boolean,
  containsText: (text: string) => boolean,
  hasValue: (value: string) => boolean,
  hasAnyValue: () => boolean,
  containsValue: (value: string) => boolean,
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

export interface IPageElementGetStateAPI<Store extends PageElementStore> {
  element: WdioElement,
  getHTML: () => string
  getText: () => string
  getDirectText: () => string
  getValue: () => string
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

export interface IPageElementWaitAPI<Store extends PageElementStore>
extends IPageElementCommonWaitAPI<Store, Workflo.IWDIOParamsOptionalReverse, PageElement<Store>>{
  untilElement: (
    description: string, condition: (element: PageElement<Store>) => boolean, opts?: Workflo.IWDIOParamsOptional) => PageElement<Store>,
  not: IPageElementWaitNotAPI<Store>
}

export interface IPageElementWaitNotAPI<Store extends PageElementStore>
extends IPageElementCommonWaitAPI<Store, Workflo.IWDIOParamsOptional, PageElement<Store>> {}

export interface IPageElementEventuallyAPI<Store extends PageElementStore>
extends IPageElementCommonWaitAPI<Store, Workflo.IWDIOParamsOptional, boolean> {
  meetsCondition: (condition: (element: PageElement<Store>) => boolean, opts?: Workflo.IWDIOParamsOptional) => boolean
  not: IPageElementEventuallyNotAPI<Store>
}

export interface IPageElementEventuallyNotAPI<Store extends PageElementStore>
extends IPageElementCommonWaitAPI<Store, Workflo.IWDIOParamsOptional, boolean> {}

export interface IPageElementCurrentlyAPI<Store extends PageElementStore>
extends IPageElementCheckStateAPI<Store>, IPageElementGetStateAPI<Store> {
  lastActualResult: string
  not: IPageElementCheckStateAPI<Store>
}

export class PageElement<
  Store extends PageElementStore
  > extends PageNode<Store>
  implements Workflo.PageNode.IGetText, IPageElementGetStateAPI<Store> {

  protected _waitType: Workflo.WaitType
  protected _timeout: number
  protected _$: Store
  protected _customScroll: Workflo.IScrollParams

  readonly currently: IPageElementCurrentlyAPI<Store> & IPageElementGetStateAPI<Store>

  // available options:
  // - wait -> initial wait operation: exist, visible, text, value
  constructor(
    protected _selector: string,
    {
      waitType = Workflo.WaitType.visible,
      timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || DEFAULT_TIMEOUT,
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

    this.currently = new Currently(this)
  }

// RETRIEVE ELEMENT FUNCTIONS

  /**
   * Return WdioElement from current state, not performing an initial wait.
   */
  private get __element() {
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
      case Workflo.WaitType.value:
        if (!this.currently.hasAnyValue()) {
          this.wait.hasAnyValue()
        }
        break
      case Workflo.WaitType.text:
        if (!this.currently.hasAnyText()) {
          this.wait.hasAnyText()
        }
        break
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
  getValue() { return getValue(this.element) }
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

  scrollTo(
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

// WAIT (for certain state within timeout)

  private _waitWdioCheckFunc(
    checkTypeStr: string,
    conditionFunc: (opts: Workflo.IWDIOParamsOptionalReverse) => boolean,
    { timeout = this._timeout, reverse }: Workflo.IWDIOParamsOptionalReverse = {}
  ) {
    const reverseStr = (reverse) ? ' not' : ''

    return this._wait(
      () => conditionFunc({timeout, reverse}),
      ` never${reverseStr} ${checkTypeStr} within ${timeout} ms`
    )
  }

  private _waitProperty(
    name: string,
    conditionType: 'has' | 'contains' | 'any' | 'within',
    conditionFunc: (value?: string) => boolean,
    { timeout = this._timeout, reverse }: Workflo.IWDIOParamsOptionalReverse = {},
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
        errorMessage = `${this.constructor.name}'s ${name} "${this.currently.lastActualResult}" never${reverseStr} ${conditionStr} "${value}" within ${timeout} ms.\n( ${this._selector} )`
      } else if (conditionType === 'any') {
        errorMessage = `${this.constructor.name} never${reverseStr} ${conditionStr} any ${name} within ${timeout} ms.\n( ${this._selector} )`
      }

      throw new Error(errorMessage)
    }

    return this
  }

  private _waitWithinProperty(
    name: string,
    value: string,
    conditionFunc: (value: string) => boolean,
    opts?: Workflo.IWDIOParamsOptionalReverse
  ) {
    return this._waitProperty(name, 'within', conditionFunc, opts, value)
  }

  private _waitHasProperty(
    name: string,
    value: string,
    conditionFunc: (value: string) => boolean,
    opts?: Workflo.IWDIOParamsOptionalReverse
  ) {
    return this._waitProperty(name, 'has', conditionFunc, opts, value)
  }

  private _waitHasAnyProperty(
    name: string,
    conditionFunc: (value: string) => boolean,
    opts?: Workflo.IWDIOParamsOptionalReverse
  ) {
    return this._waitProperty(name, 'any', conditionFunc, opts)
  }

  private _waitContainsProperty(
    name: string,
    value: string,
    conditionFunc: (value: string) => boolean,
    opts?: Workflo.IWDIOParamsOptionalReverse
  ) {
    return this._waitProperty(name, 'contains', conditionFunc, opts, value)
  }

  private _makeReverseParams(opts: Workflo.IWDIOParamsOptional = {}): Workflo.IWDIOParamsOptionalReverse {
    return {timeout: opts.timeout, reverse: true}
  }

  public wait: IPageElementWaitAPI<Store> = {
    exists: (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitWdioCheckFunc(
      'existed', opts => this.currently.element.waitForExist(opts.timeout, opts.reverse), opts
    ),
    isVisible: (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitWdioCheckFunc(
      'became visible', opts => this.currently.element.waitForVisible(opts.timeout, opts.reverse), opts
    ),
    isEnabled: (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitWdioCheckFunc(
      'became enabled', opts => this.currently.element.waitForEnabled(opts.timeout, opts.reverse), opts
    ),
    isSelected: (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitWdioCheckFunc(
      'became selected', opts => this.currently.element.waitForSelected(opts.timeout, opts.reverse), opts
    ),
    isChecked: (opts: Workflo.IWDIOParamsOptionalReverse = {}) => {
      const timeout = opts.timeout || this._timeout
      const reverseStr = (opts.reverse) ? ' not' : ''

      browser.waitUntil(
        () => {
          if ( opts.reverse ) {
            return this.currently.not.isChecked()
          } else {
            return this.currently.isChecked()
          }
        }, timeout, `${this.constructor.name} never${reverseStr} became checked within ${timeout} ms.\n( ${this._selector} )`
      )

      return this
    },
    hasText: (text: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
      'text', text, () => this.currently.hasText(text), opts
    ),
    hasAnyText: (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitWdioCheckFunc(
      'had any text', opts => this.currently.element.waitForText(opts.timeout, opts.reverse), opts
    ),
    containsText: (text: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
      'text', text, () => this.currently.containsText(text), opts
    ),
    hasValue: (value: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
      'value', value, () => this.currently.hasValue(value), opts
    ),
    hasAnyValue: (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitWdioCheckFunc(
      'had any value', opts => this.currently.element.waitForValue(opts.timeout, opts.reverse), opts
    ),
    containsValue: (value: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitContainsProperty(
      'value', value, () => this.currently.containsValue(value), opts
    ),
    hasHTML: (html: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
      'HTML', html, () => this.currently.hasHTML(html), opts
    ),
    hasAnyHTML: (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasAnyProperty(
      'HTML', () => this.currently.hasAnyHTML(), opts
    ),
    containsHTML: (html: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitContainsProperty(
      'HTML', html, () => this.currently.containsHTML(html), opts
    ),
    hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
      'direct text', directText, () => this.currently.hasDirectText(directText), opts
    ),
    hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasAnyProperty(
      'direct text', () => this.currently.hasAnyDirectText(), opts
    ),
    containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitContainsProperty(
      'direct text', directText, () => this.currently.containsDirectText(directText), opts
    ),
    hasAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptionalReverse) => {
      return this._waitHasProperty(
        `Attribute '${attributeName}'`, attributeValue, () => this.currently.hasAttribute(attributeName, attributeValue), opts
      )
    },
    hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasAnyProperty(
      `Attribute '${attributeName}'`, () => this.currently.hasAnyAttribute(attributeName), opts
    ),
    containsAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptionalReverse) => {
      return this._waitContainsProperty(
        `Attribute '${attributeName}'`, attributeValue, () => this.currently.containsAttribute(attributeName, attributeValue), opts
      )
    },
    hasClass: (className: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
      `class`, className, () => this.currently.hasClass(className), opts
    ),
    hasAnyClass: (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasAnyProperty(
      `class`, () => this.currently.hasAnyClass(), opts
    ),
    containsClass: (className: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitContainsProperty(
      `class`, className, () => this.currently.containsClass(className), opts
    ),
    hasId: (id: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
      `id`, id, () => this.currently.hasId(id), opts
    ),
    hasAnyId: (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasAnyProperty(
      `id`, () => this.currently.hasAnyId(), opts
    ),
    containsId: (id: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitContainsProperty(
      `id`, id, () => this.currently.containsId(id), opts
    ),
    hasName: (name: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasProperty(
      `name`, name, () => this.currently.hasName(name), opts
    ),
    hasAnyName: (opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitHasAnyProperty(
      `id`, () => this.currently.hasAnyName(), opts
    ),
    containsName: (name: string, opts?: Workflo.IWDIOParamsOptionalReverse) => this._waitContainsProperty(
      `name`, name, () => this.currently.containsName(name), opts
    ),
    hasLocation: (
      coordinates: Workflo.ICoordinates,
      opts: {tolerances?: Partial<Workflo.ICoordinates>} & Workflo.IWDIOParamsOptionalReverse = { tolerances: { x: 0, y: 0 } }
    ) => {
      const { tolerances, ...otherOpts } = opts

      if (tolerances && (tolerances.x > 0 || tolerances.y > 0)) {
        return this._waitWithinProperty(
          `location`,
          tolerancesToString(coordinates, tolerances),
          () => this.currently.hasLocation(coordinates, tolerances),
          otherOpts
        )
      } else {
        return this._waitHasProperty(
          `location`,
          tolerancesToString(coordinates),
          () => this.currently.hasLocation(coordinates),
          otherOpts
        )
      }
    },
    hasX: (
      x: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptionalReverse = { tolerance: 0 }
    ) => {
      const { tolerance, ...otherOpts } = opts

      if ( tolerance ) {
        return this._waitWithinProperty(
          `X-location`,
          tolerancesToString(x, tolerance),
          () => this.currently.hasX(x, tolerance),
          otherOpts
        )
      } else {
        return this._waitHasProperty(
          `X-location`,
          x.toString(),
          () => this.currently.hasX(x),
          otherOpts
        )
      }
    },
    hasY: (
      y: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptionalReverse = { tolerance: 0 }
    ) => {
      const { tolerance, ...otherOpts } = opts

      if ( tolerance ) {
        return this._waitWithinProperty(
          `Y-location`,
          tolerancesToString(y, tolerance),
          () => this.currently.hasY(y, tolerance),
          otherOpts
        )
      } else {
        return this._waitHasProperty(
          `Y-location`,
          y.toString(),
          () => this.currently.hasY(y),
          otherOpts
        )
      }
    },
    hasSize: (
      size: Workflo.ISize,
      opts: {tolerances?: Partial<Workflo.ISize>} & Workflo.IWDIOParamsOptionalReverse = { tolerances: { width: 0, height: 0 } }
    ) => {
      const { tolerances, ...otherOpts } = opts

      if (tolerances && (tolerances.width > 0 || tolerances.height > 0)) {
        return this._waitWithinProperty(
          `size`,
          tolerancesToString(size, tolerances),
          () => this.currently.hasSize(size, tolerances),
          otherOpts
        )
      } else {
        return this._waitHasProperty(
          `size`,
          tolerancesToString(size),
          () => this.currently.hasSize(size),
          otherOpts
        )
      }
    },
    hasWidth: (
      width: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptionalReverse = { tolerance: 0 }
    ) => {
      const { tolerance, ...otherOpts } = opts

      if ( tolerance ) {
        return this._waitWithinProperty(
          `width`,
          tolerancesToString(width, tolerance),
          () => this.currently.hasWidth(width, tolerance),
          otherOpts
        )
      } else {
        return this._waitHasProperty(
          `width`,
          width.toString(),
          () => this.currently.hasWidth(width),
          otherOpts
        )
      }
    },
    hasHeight: (
      height: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptionalReverse = { tolerance: 0 }
    ) => {
      const { tolerance, ...otherOpts } = opts

      if ( tolerance ) {
        return this._waitWithinProperty(
          `height`,
          tolerancesToString(height, tolerance),
          () => this.currently.hasHeight(height, tolerance),
          otherOpts
        )
      } else {
        return this._waitHasProperty(
          `height`,
          height.toString(),
          () => this.currently.hasHeight(height),
          otherOpts
        )
      }
    },
    untilElement: (
      description: string, condition: (element: this) => boolean, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
    ) => {
      browser.waitUntil(
        () => condition(this),
        timeout,
        `${this.constructor.name}: Wait until element ${description} failed.\n( ${this._selector} )`
      )

      return this
    },

    not: {
      exists: (opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.exists(this._makeReverseParams(opts))
      },
      isVisible: (opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.isVisible(this._makeReverseParams(opts))
      },
      isEnabled: (opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.isEnabled(this._makeReverseParams(opts))
      },
      isSelected: (opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.isSelected(this._makeReverseParams(opts))
      },
      isChecked: (opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.isChecked(this._makeReverseParams(opts))
      },
      hasText: (text: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasText(text, this._makeReverseParams(opts))
      },
      hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasAnyText(this._makeReverseParams(opts))
      },
      containsText: (text: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.containsText(text, this._makeReverseParams(opts))
      },
      hasValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasValue(value, this._makeReverseParams(opts))
      },
      hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasAnyValue(this._makeReverseParams(opts))
      },
      containsValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.containsValue(value, this._makeReverseParams(opts))
      },
      hasHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasHTML(html, this._makeReverseParams(opts))
      },
      hasAnyHTML: (opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasAnyHTML(this._makeReverseParams(opts))
      },
      containsHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.containsHTML(html, this._makeReverseParams(opts))
      },
      hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasDirectText(directText, this._makeReverseParams(opts))
      },
      hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasAnyDirectText(this._makeReverseParams(opts))
      },
      containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.containsDirectText(directText, this._makeReverseParams(opts))
      },
      hasAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasAttribute(attributeName, attributeValue, this._makeReverseParams(opts))
      },
      hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasAnyAttribute(attributeName, this._makeReverseParams(opts))
      },
      containsAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.containsAttribute(attributeName, attributeValue, this._makeReverseParams(opts))
      },
      hasClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasClass(className, this._makeReverseParams(opts))
      },
      hasAnyClass: (opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasAnyClass(this._makeReverseParams(opts))
      },
      containsClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.containsClass(className, this._makeReverseParams(opts))
      },
      hasId: (id: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasId(id, this._makeReverseParams(opts))
      },
      hasAnyId: (opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasAnyId(this._makeReverseParams(opts))
      },
      containsId: (id: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.containsId(id, this._makeReverseParams(opts))
      },
      hasName: (name: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasName(name, this._makeReverseParams(opts))
      },
      hasAnyName: (opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.hasAnyName(this._makeReverseParams(opts))
      },
      containsName: (name: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this.wait.containsName(name, this._makeReverseParams(opts))
      },
      hasLocation: (
        coordinates: Workflo.ICoordinates,
        opts: {tolerances?: Partial<Workflo.ICoordinates>} & Workflo.IWDIOParamsOptional = { tolerances: { x: 0, y: 0 } }
      ) => this.wait.hasLocation(
        coordinates, {tolerances: opts.tolerances, timeout: opts.timeout, reverse: true}
      ),
      hasX: (
        x: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
      ) => this.wait.hasX(
        x, {tolerance: opts.tolerance, timeout: opts.timeout, reverse: true}
      ),
      hasY: (
        y: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
      ) => this.wait.hasY(
        y, {tolerance: opts.tolerance, timeout: opts.timeout, reverse: true}
      ),
      hasSize: (
        size: Workflo.ISize,
        opts: {tolerances?: Partial<Workflo.ISize>} & Workflo.IWDIOParamsOptional = { tolerances: { width: 0, height: 0 } }
      ) => this.wait.hasSize(
        size, {tolerances: opts.tolerances, timeout: opts.timeout, reverse: true}
      ),
      hasWidth: (
        width: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
      ) => this.wait.hasWidth(
        width, {tolerance: opts.tolerance, timeout: opts.timeout, reverse: true}
      ),
      hasHeight: (
        height: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
      ) => this.wait.hasHeight(
        height, {tolerance: opts.tolerance, timeout: opts.timeout, reverse: true}
      )
    }
  }

// EVENTUALLY FUNCTIONS (check wether certain state is reached after timeout)

  public eventually: IPageElementEventuallyAPI<Store> = {
    exists: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.exists(opts))
    },
    isVisible: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.isVisible(opts))
    },
    isEnabled: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.isEnabled(opts))
    },
    isSelected: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.isSelected(opts))
    },
    isChecked: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.isChecked(opts))
    },
    hasText: (text: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasText(text, opts))
    },
    hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasAnyText(opts))
    },
    containsText: (text: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.containsText(text, opts))
    },
    hasValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasValue(value, opts))
    },
    hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasAnyValue(opts))
    },
    containsValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.containsValue(value, opts))
    },
    hasHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasHTML(html, opts))
    },
    hasAnyHTML: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasAnyHTML(opts))
    },
    containsHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.containsHTML(html, opts))
    },
    hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasDirectText(directText, opts))
    },
    hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasAnyDirectText(opts))
    },
    containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.containsDirectText(directText, opts))
    },
    hasAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasAttribute(attributeName, attributeValue, opts))
    },
    hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasAnyAttribute(attributeName, opts))
    },
    containsAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.containsAttribute(attributeName, attributeValue, opts))
    },
    hasClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasClass(className, opts))
    },
    hasAnyClass: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasAnyClass(opts))
    },
    containsClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.containsClass(className, opts))
    },
    hasId: (id: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasId(id, opts))
    },
    hasAnyId: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasAnyId(opts))
    },
    containsId: (id: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.containsId(id, opts))
    },
    hasName: (name: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasName(name, opts))
    },
    hasAnyName: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.hasAnyName(opts))
    },
    containsName: (name: string, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(() => this.wait.containsName(name, opts))
    },
    hasLocation: (
      coordinates: Workflo.ICoordinates,
      opts: {tolerances?: Partial<Workflo.ICoordinates>} & Workflo.IWDIOParamsOptional = { tolerances: { x: 0, y: 0 } }
    ) => this._eventually(
      () => this.wait.hasLocation(coordinates, {tolerances: opts.tolerances, timeout: opts.timeout})
    ),
    hasX: (
      x: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
    ) => this._eventually(
      () => this.wait.hasX(x, {tolerance: opts.tolerance, timeout: opts.timeout})
    ),
    hasY: (
      y: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
    ) => this._eventually(
      () => this.wait.hasY(y, {tolerance: opts.tolerance, timeout: opts.timeout})
    ),
    hasSize: (
      size: Workflo.ISize,
      opts: {tolerances?: Partial<Workflo.ISize>} & Workflo.IWDIOParamsOptional = { tolerances: { width: 0, height: 0 } }
    ) => this._eventually(
      () => this.wait.hasSize(size, {tolerances: opts.tolerances, timeout: opts.timeout})
    ),
    hasWidth: (
      width: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
    ) => this._eventually(
      () => this.wait.hasWidth(width, {tolerance: opts.tolerance, timeout: opts.timeout})
    ),
    hasHeight: (
      height: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
    ) => this._eventually(
      () => this.wait.hasHeight(height, {tolerance: opts.tolerance, timeout: opts.timeout})
    ),
    meetsCondition: (condition: (element: this) => boolean, opts?: Workflo.IWDIOParamsOptional) => {
      return this._eventually(
        () => this.wait.untilElement(' meets condition', () => condition(this), opts)
      )
    },

    not: {
      exists: (opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.exists(opts))
      },
      isVisible: (opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.isVisible(opts))
      },
      isEnabled: (opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.isEnabled(opts))
      },
      isSelected: (opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.isSelected(opts))
      },
      isChecked: (opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.isChecked(opts))
      },
      hasText: (text: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasText(text, opts))
      },
      hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasAnyText(opts))
      },
      containsText: (text: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.containsText(text, opts))
      },
      hasValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasValue(value, opts))
      },
      hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasAnyValue(opts))
      },
      containsValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.containsValue(value, opts))
      },
      hasHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasHTML(html, opts))
      },
      hasAnyHTML: (opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasAnyHTML(opts))
      },
      containsHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.containsHTML(html, opts))
      },
      hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasDirectText(directText, opts))
      },
      hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasAnyDirectText(opts))
      },
      containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.containsDirectText(directText, opts))
      },
      hasAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasAttribute(attributeName, attributeValue, opts))
      },
      hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasAnyAttribute(attributeName, opts))
      },
      containsAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.containsAttribute(attributeName, attributeValue, opts))
      },
      hasClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasClass(className, opts))
      },
      hasAnyClass: (opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasAnyClass(opts))
      },
      containsClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.containsClass(className, opts))
      },
      hasId: (id: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasId(id, opts))
      },
      hasAnyId: (opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasAnyId(opts))
      },
      containsId: (id: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.containsId(id, opts))
      },
      hasName: (name: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasName(name, opts))
      },
      hasAnyName: (opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.hasAnyName(opts))
      },
      containsName: (name: string, opts?: Workflo.IWDIOParamsOptional) => {
        return this._eventually(() => this.wait.not.containsName(name, opts))
      },
      hasLocation: (
        coordinates: Workflo.ICoordinates,
        opts: {tolerances?: Partial<Workflo.ICoordinates>} & Workflo.IWDIOParamsOptional = { tolerances: { x: 0, y: 0 } }
      ) => this._eventually(
        () => this.wait.not.hasLocation(coordinates, {tolerances: opts.tolerances, timeout: opts.timeout})
      ),
      hasX: (
        x: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
      ) => this._eventually(
        () => this.wait.not.hasX(x, {tolerance: opts.tolerance, timeout: opts.timeout})
      ),
      hasY: (
        y: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
      ) => this._eventually(
        () => this.wait.not.hasY(y, {tolerance: opts.tolerance, timeout: opts.timeout})
      ),
      hasSize: (
        size: Workflo.ISize,
        opts: {tolerances?: Partial<Workflo.ISize>} & Workflo.IWDIOParamsOptional = { tolerances: { width: 0, height: 0 } }
      ) => this._eventually(
        () => this.wait.not.hasSize(size, {tolerances: opts.tolerances, timeout: opts.timeout})
      ),
      hasWidth: (
        width: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
      ) => this._eventually(
        () => this.wait.not.hasWidth(width, {tolerance: opts.tolerance, timeout: opts.timeout})
      ),
      hasHeight: (
        height: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptional = { tolerance: 0 }
      ) => this._eventually(
        () => this.wait.not.hasHeight(height, {tolerance: opts.tolerance, timeout: opts.timeout})
      ),
    }
  }
}

class Currently<
  Store extends PageElementStore,
> implements IPageElementCurrentlyAPI<Store>, IPageElementGetStateAPI<Store> {

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
  getValue() { return getValue(this.element, this._pageElement) }
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
  private _withinTolerance(actual: number, expected: number, tolerance?: number) {
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

  private _hasAxisLocation(expected: number, actual: number, tolerance?: number): boolean {
    return this._withinTolerance(actual, expected, tolerance)
  }

  private _hasSideSize(expected: number, actual: number, tolerance?: number): boolean {
    return this._withinTolerance(actual, expected, tolerance)
  }

  private _compareHas(expected: string, actual: string) {
    this._lastActualResult = actual || ''
    return actual === expected
  }

  private _compareHasAny(actual: string) {
    const result = (actual) ? actual.length > 0 : false
    this._lastActualResult = actual || ''
    return result
  }

  private _compareContains(expected: string, actual: string) {
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
  hasValue = (value: string) => this._compareHas(value, this.getValue())
  hasAnyValue = () => this._compareHasAny(this.getValue())
  containsValue = (value: string) => this._compareContains(value, this.getValue())
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
    hasValue: (value: string) => !this.hasValue(value),
    hasAnyValue: () => !this.hasAnyValue(),
    containsValue: (value: string) => !this.containsValue(value),
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

function getValue<Store extends PageElementStore>(element: WdioElement, pageElement?: PageElement<Store>): string {
  return elementExecute(() => element.getValue(), pageElement)
}

function getAttribute<Store extends PageElementStore>(element: WdioElement, attrName: string, pageElement?: PageElement<Store>): string {
  return elementExecute(() => element.getAttribute(attrName), pageElement)
}

function getClass<Store extends PageElementStore>(element: WdioElement, pageElement?: PageElement<Store>): string {
  return elementExecute(() => element.getAttribute('class'), pageElement)
}

function getId<Store extends PageElementStore>(element: WdioElement, pageElement?: PageElement<Store>): string {
  return elementExecute(() => element.getAttribute('id'), pageElement)
}

function getName<Store extends PageElementStore>(element: WdioElement, pageElement?: PageElement<Store>): string {
  return elementExecute(() => element.getAttribute('name'), pageElement)
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
function elementExecute<Store extends PageElementStore, ResultType>(func: () => ResultType, pageElement?: PageElement<Store>) {
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

function isScrollResult(result: any): result is Workflo.IScrollResult {
  return result.elemTop !== undefined;
}