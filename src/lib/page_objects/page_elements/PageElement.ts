import * as _ from 'lodash'

import { PageNode, IPageNodeOpts } from '.'
import { XPathBuilder } from '../builders'
import { PageElementStore } from '../stores'
import * as htmlParser from 'htmlparser2'

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
  hasClass: (className: string, opts?: OptionalParams) => ReturnType,
  containsClass: (className: string, opts?: OptionalParams) => ReturnType,
  hasText: (text: string, opts: OptionalParams) => ReturnType,
  hasAnyText: (opts?: OptionalParams) => ReturnType,
  containsText: (text: string, opts?: OptionalParams) => ReturnType,
  hasValue: (value: string, opts?: OptionalParams) => ReturnType,
  hasAnyValue: (opts?: OptionalParams) => ReturnType,
  containsValue: (value: string, opts?: OptionalParams) => ReturnType,
  hasHTML: (html: string, opts?: OptionalParams) => ReturnType,
  hasAnyHTML: (opts?: OptionalParams) => ReturnType,
  containsHTML: (html: string, opts?: OptionalParams) => ReturnType,
  hasAttribute: (attributeName: string, attributeValue: string, opts?: OptionalParams) => ReturnType,
  hasAnyAttribute: (attributeName: string, opts?: OptionalParams) => ReturnType,
  containsAttribute: (attributeName: string, attributeValue: string, opts?: OptionalParams) => ReturnType,
  hasId: (id: string, opts?: OptionalParams) => ReturnType,
  hasAnyId: (opts?: OptionalParams) => ReturnType,
  containsId: (id: string, opts?: OptionalParams) => ReturnType,
  hasName: (name: string, opts?: OptionalParams) => ReturnType,
  hasAnyName: (opts?: OptionalParams) => ReturnType,
  containsName: (name: string, opts?: OptionalParams) => ReturnType,
  hasDirectText: (directText: string, opts?: OptionalParams) => ReturnType,
  hasAnyDirectText: (opts?: OptionalParams) => ReturnType,
  containsDirectText: (directText: string, opts?: OptionalParams) => ReturnType,
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
  hasClass: (className: string) => boolean,
  containsClass: (className: string) => boolean,
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

// Private GETTER FUNCTIONS (work with both element and currently.element)

  /**
   * Get text that resides on the level directly below the selected page element.
   * Does not include text of the page element's nested children elements.
   */
  private _getDirectText(element: WdioElement): string {
    const html = element.getHTML()

    if (html.length === 0) {
      return ''
    }

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
  }

  private _getHTML(element: WdioElement) {

    const result: Workflo.IJSError | string = browser.selectorExecute(
      [this.getSelector()], function (elems: HTMLElement[], elementSelector: string
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
    }, this.getSelector())

    if (isJsError(result)) {
      throw new Error(`${this.constructor.name} could not be located in scrollTo.\n( ${this.getSelector()} )`)
    } else {
      return result
    }
  }

  // returns text of this.element including
  // all texts of nested children
  private _getText(element: WdioElement) {
    return element.getText()
  }

  private _getValue(element: WdioElement) {
    return element.getValue()
  }

  private _getAttribute(element: WdioElement, attrName: string) {
    return element.getAttribute(attrName)
  }

  private _getClass(element: WdioElement) {
    return element.getAttribute('class')
  }

  private _getId(element: WdioElement) {
    return element.getAttribute('id')
  }

  private _getName(element: WdioElement) {
    return element.getAttribute('name')
  }

  private _getLocation(element: WdioElement) {
    return <Workflo.ICoordinates> (<any> element.getLocation())
  }

  private _getSize(element: WdioElement) {
    return <Workflo.ISize> (<any> this.element.getElementSize())
  }

  private _isEnabled(element: WdioElement): boolean {
    return element.isEnabled()
  }

  private _isSelected(element: WdioElement): boolean {
    return element.isSelected()
  }

// Public GETTER FUNCTIONS (return state after initial wait)

  getDirectText() {
    return this._getDirectText(this.element)
  }

  getHTML() {
    return this._getHTML(this.element)
  }

  getText() {
    return this._getText(this.element)
  }

  getValue() {
    return this._getValue(this.element)
  }

  getAttribute(attributeName: string) {
    return this._getAttribute(this.element, attributeName)
  }

  getClass() {
    return this._getClass(this.element)
  }

  getId() {
    return this._getId(this.element)
  }

  getName() {
    return this._getName(this.element)
  }

  getLocation() {
    return this._getLocation(this.element)
  }

  getX() {
    return this._getLocation(this.element).x
  }

  getY() {
    return this._getLocation(this.element).y
  }

  getSize() {
    return this._getSize(this.element)
  }

  getWidth() {
    return this._getSize(this.element).width
  }

  getHeight() {
    return this._getSize(this.element).height
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

// CURRENT CHECK STATE FUNCTIONS

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
      tolerances.lower -= Math.min(tolerance, 0)
      tolerances.upper += Math.min(tolerance, 0)
    }

    return Math.min(expected, 0) >= Math.min(tolerances.lower, 0) && Math.min(expected, 0) <= Math.min(tolerances.upper, 0)
  }

  private _hasAxisLocation(axis: 'x' | 'y', expected: number, tolerance?: number): boolean {
    const actualCoordinates = this.currently.getLocation()

    return this._withinTolerance(actualCoordinates[axis], expected, tolerance)
  }

  private _hasSideSize(side: 'width' | 'height', expected: number, tolerance?: number): boolean {
    const actualSize = this.currently.getSize()

    return this._withinTolerance(actualSize[side], expected, tolerance)
  }

  currently: IPageElementCurrentlyAPI<Store> & IPageElementGetStateAPI<Store> = {
    element: this.__element,

    // GET STATE
    getHTML: (): string => {
      return this._getHTML(this.__element)
    },
    getText: (): string => {
      return this._getText(this.__element)
    },
    getDirectText: (): string => {
      return this._getDirectText(this.__element)
    },
    getValue: (): string => {
      return this._getValue(this.__element)
    },
    getAttribute: (attributeName: string): string => {
      return this._getAttribute(this.__element, attributeName)
    },
    getClass: (): string => {
      return this._getAttribute(this.__element, 'class')
    },
    getId: (): string => {
      return this._getAttribute(this.__element, 'id')
    },
    getName: (): string => {
      return this._getAttribute(this.__element, 'name')
    },
    getLocation: (): Workflo.ICoordinates => {
      return this._getLocation(this.__element)
    },
    getX: (): number => {
      return this._getLocation(this.__element).x
    },
    getY: (): number => {
      return this._getLocation(this.__element).y
    },
    getSize: (): Workflo.ISize => {
      return this._getSize(this.__element)
    },
    getWidth: (): number => {
      return this._getSize(this.__element).width
    },
    getHeight: (): number => {
      return this._getSize(this.__element).height
    },

    // CHECK STATE
    exists: (): boolean => {
      return this.__element.isExisting()
    },
    isVisible: (): boolean => {
      return this.__element.isVisible()
    },
    isEnabled: (): boolean => {
      return this._isEnabled(this.__element)
    },
    isSelected: (): boolean => {
      return this._isSelected(this.__element)
    },
    hasText: (text: string): boolean => {
      return this.currently.getText() === text
    },
    hasAnyText: (): boolean => {
      return this.currently.getText().length > 0
    },
    containsText: (text: string): boolean => {
      return this.currently.getText().indexOf(text) > -1
    },
    hasValue: (value: string): boolean => {
      return this.currently.getValue() === value
    },
    hasAnyValue: (): boolean => {
      return this.currently.getValue().length > 0
    },
    containsValue: (value: string): boolean => {
      return this.currently.getValue().indexOf(value) > -1
    },
    hasHTML: (html: string): boolean => {
      return this.currently.getHTML() === html
    },
    hasAnyHTML: (): boolean => {
      return this.currently.getHTML().length > 0
    },
    containsHTML: (html: string): boolean => {
      return this.currently.getHTML().indexOf(html) > -1
    },
    hasDirectText: (directText: string): boolean => {
      return this.currently.getDirectText() === directText
    },
    hasAnyDirectText: (): boolean => {
      return this.currently.getDirectText().length > 0
    },
    containsDirectText: (directText: string): boolean => {
      return this.currently.getDirectText().indexOf(directText) > 0
    },
    hasAttribute: (attributeName: string, attributeValue: string): boolean => {
      return this.currently.getAttribute(attributeName) === attributeValue
    },
    hasAnyAttribute: (attributeName: string): boolean => {
      return this.currently.getAttribute(attributeName).length > 0
    },
    containsAttribute: (attributeName: string, attributeValue: string): boolean => {
      return this.currently.getAttribute(attributeName).indexOf(attributeValue) > 0
    },
    hasClass: (className: string): boolean => {
      return this.currently.getClass() === className
    },
    containsClass: (className: string): boolean => {
      const _class: string = this.currently.getClass()

      if (!_class) {
        return false
      } else {
        return _class.indexOf(className) > -1
      }
    },
    hasId: (id: string): boolean => {
      return this.currently.getId() === id
    },
    hasAnyId: (): boolean => {
      return this.currently.getId().length > 0
    },
    containsId: (id: string): boolean => {
      return this.currently.getId().indexOf(id) > -1
    },
    hasName: (name: string): boolean => {
      return this.currently.getName() === name
    },
    hasAnyName: (): boolean => {
      return this.currently.getName().length > 0
    },
    containsName: (name: string): boolean => {
      return this.currently.getName().indexOf(name) > -1
    },
    hasLocation: (coordinates: Workflo.ICoordinates, tolerances: Workflo.ICoordinates = { x: 0, y: 0 }): boolean => {
      return this._hasAxisLocation('x', coordinates.x, tolerances.x) && this._hasAxisLocation('y', coordinates.y, tolerances.y)
    },
    hasX: (x: number, tolerance?: number): boolean => {
       return this._hasAxisLocation('x', x, tolerance)
    },
    hasY: (y: number, tolerance?: number): boolean => {
      return this._hasAxisLocation('y', y, tolerance)
    },
    hasSize: (size: Workflo.ISize, tolerances: Workflo.ISize = {width: 0, height: 0}): boolean => {
      return this._hasSideSize('width', size.width, tolerances.width) && this._hasSideSize('height', size.height, tolerances.height)
    },
    hasWidth: (width: number, tolerance?: number): boolean => {
      return this._hasSideSize('width', width, tolerance)
    },
    hasHeight: (height: number, tolerance?: number): boolean => {
      return this._hasSideSize('height', height, tolerance)
    },

    not: {
      exists: () => !this.currently.exists(),
      isVisible: () => !this.currently.isVisible(),
      isEnabled: (): boolean => !this.currently.isEnabled(),
      isSelected: (): boolean => !this.currently.isSelected(),
      hasClass: (className: string) => !this.currently.hasClass(className),
      containsClass: (className: string) => !this.currently.containsClass(className),
      hasText: (text: string) => !this.currently.hasText(text),
      hasAnyText: () => !this.currently.hasAnyText(),
      containsText: (text: string) => !this.currently.containsText(text),
      hasValue: (value: string): boolean => !this.currently.hasValue(value),
      hasAnyValue: (): boolean => !this.currently.hasAnyValue(),
      containsValue: (value: string): boolean => !this.currently.containsValue(value),
      hasDirectText: (directText: string): boolean => !this.currently.hasDirectText(directText),
      hasAnyDirectText: (): boolean => !this.currently.hasAnyDirectText(),
      containsDirectText: (directText: string): boolean => !this.currently.containsDirectText(directText),
      hasAttribute: (attributeName: string, attributeValue: string): boolean => !this.currently.hasAttribute(attributeName, attributeValue),
      hasAnyAttribute: (attributeName: string): boolean => !this.currently.hasAnyAttribute(attributeName),
      containsAttribute: (attributeName: string, attributeValue: string): boolean => !this.currently.containsAttribute(attributeName, attributeValue),
      hasHTML: (html: string) => !this.currently.hasHTML(html),
      hasAnyHTML: () => !this.currently.hasAnyHTML(),
      containsHTML: (html: string) => !this.currently.containsHTML(html),
      hasId: (id: string) => !this.currently.hasId(id),
      hasAnyId: () => !this.currently.hasAnyId(),
      containsId: (id: string) => !this.currently.containsId(id),
      hasName: (name: string) => !this.currently.hasName(name),
      hasAnyName: () => !this.currently.hasAnyName(),
      containsName: (name: string) => !this.currently.containsName(name),
      hasLocation: (coordinates: Workflo.ICoordinates, tolerances?: Workflo.ICoordinates): boolean =>
        !this.currently.hasLocation(coordinates, tolerances),
      hasX: (x: number, tolerance?: number) => !this.currently.hasX(x, tolerance),
      hasY: (y: number, tolerance?: number) => !this.currently.hasY(y, tolerance),
      hasSize: (size: Workflo.ISize, tolerances?: Workflo.ISize): boolean =>
        !this.currently.hasSize(size, tolerances),
      hasWidth: (width: number, tolerance?: number) => !this.currently.hasWidth(width, tolerance),
      hasHeight: (height: number, tolerance?: number) => !this.currently.hasHeight(height, tolerance),
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
      ` never${reverseStr} ${checkTypeStr}.\n( ${this._selector} )`
    )
  }

  private _waitProperty(
    name: string,
    conditionType: 'has' | 'contains' | 'any',
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
    }

    if (conditionType === 'has' || conditionType === 'contains') {
      // capitalize first letter
      name = name.charAt(0).toUpperCase() + name.slice(1)

      errorMessage = `${this.constructor.name}: ${name} never${reverseStr} ${conditionStr} '${value}'.\n( ${this._selector} )`
    } else if (conditionType === 'any') {
      errorMessage = `${this.constructor.name} never${reverseStr} had ${conditionStr} ${name}.\n( ${this._selector} )`
    }

    browser.waitUntil(() => {
      if (reverse) {
        return !conditionFunc(value)
      } else {
        return conditionFunc(value)
      }
    }, timeout, errorMessage)

    return this
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

      return this._waitHasProperty(
        `location`,
        tolerancesObjectToString(coordinates, tolerances),
        () => this._hasAxisLocation('x', coordinates.x, tolerances.x) && this._hasAxisLocation('y', coordinates.y, tolerances.y),
        otherOpts
      )
    },
    hasX: (
      x: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptionalReverse = { tolerance: 0 }
    ) => {
      const { tolerance, ...otherOpts } = opts

      return this._waitHasProperty(
        `x`,
        tolerancesObjectToString({x}, {x: tolerance}),
        () => this._hasAxisLocation('x', x, tolerance),
        otherOpts
      )
    },
    hasY: (
      y: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptionalReverse = { tolerance: 0 }
    ) => {
      const { tolerance, ...otherOpts } = opts

      return this._waitHasProperty(
        `y`,
        tolerancesObjectToString({y}, {y: tolerance}),
        () => this._hasAxisLocation('y', y, tolerance),
        otherOpts
      )
    },
    hasSize: (
      size: Workflo.ISize,
      opts: {tolerances?: Partial<Workflo.ISize>} & Workflo.IWDIOParamsOptionalReverse = { tolerances: { width: 0, height: 0 } }
    ) => {
      const { tolerances, ...otherOpts } = opts

      return this._waitHasProperty(
        `location`,
        tolerancesObjectToString(size, tolerances),
        () => this._hasSideSize('width', size.width, tolerances.width) && this._hasSideSize('height', size.height, tolerances.height),
        otherOpts
      )
    },
    hasWidth: (
      width: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptionalReverse = { tolerance: 0 }
    ) => {
      const { tolerance, ...otherOpts } = opts

      return this._waitHasProperty(
        `width`,
        tolerancesObjectToString({width}, {width: tolerance}),
        () => this._hasSideSize('width', width, tolerance),
        otherOpts
      )
    },
    hasHeight: (
      height: number, opts: {tolerance?: number} & Workflo.IWDIOParamsOptionalReverse = { tolerance: 0 }
    ) => {
      const { tolerance, ...otherOpts } = opts

      return this._waitHasProperty(
        `height`,
        tolerancesObjectToString({height}, {height: tolerance}),
        () => this._hasSideSize('height', height, tolerance),
        otherOpts
      )
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

// type guards
function isJsError(result: any): result is Workflo.IJSError {
  if (!result) {
    return false
  }

  return result.notFound !== undefined;
}

function isScrollResult(result: any): result is Workflo.IScrollResult {
  return result.elemTop !== undefined;
}

function tolerancesObjectToString(actuals, tolerances) {
  var str = '{';
  var props = []

  for (var p in actuals) {
    if (actuals.hasOwnProperty(p)) {
      const actual = actuals[p]
      let actualStr = ''

      if (tolerances[p] !== 0) {
        const tolerance = Math.abs(tolerances[p])

        actualStr = `[${Math.max(actual - tolerance, 0)}, ${Math.max(actual + tolerance, 0)}]`
      } else {
        actualStr = `${actual}`
      }

      props.push(`${p}: ${actualStr}`)
    }
  }

  str += props.join(', ')

  return str + '}';
}