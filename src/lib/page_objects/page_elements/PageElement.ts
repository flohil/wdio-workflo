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
  customScroll?: Workflo.IScrollParams
}

export type WdioElement = WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element>> & WebdriverIO.RawResult<WebdriverIO.Element>

export interface IPageElementCommonWaitAPI<Store extends PageElementStore, ReturnType> {
  exists: (opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  isVisible: (opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  hasClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  containsClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  hasText: (text: string, opts: Workflo.IWDIOParamsOptional) => ReturnType,
  hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  containsText: (text: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  hasValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  containsValue: (value: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  hasHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  hasAnyHTML: (opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  containsHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  hasAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  containsAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  hasId: (id: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  hasAnyId: (opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  containsId: (id: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  hasName: (name: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  hasAnyName: (opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  containsName: (name: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  isEnabled: (opts?: Workflo.IWDIOParamsOptional) => ReturnType,
  isSelected: (opts?: Workflo.IWDIOParamsOptional) => ReturnType
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
  containsDirectText: (directText: string) => boolean
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
  getSize: () => Workflo.ISize
}

export interface IPageElementWaitAPI<Store extends PageElementStore>
extends IPageElementCommonWaitAPI<Store, PageElement<Store>>{
  untilElement: (
    description: string, condition: (element: PageElement<Store>) => boolean, opts?: Workflo.IWDIOParamsOptional) => PageElement<Store>,
  not: IPageElementWaitNotAPI<Store>
}

export interface IPageElementWaitNotAPI<Store extends PageElementStore>
extends IPageElementCommonWaitAPI<Store, PageElement<Store>> {}

export interface IPageElementEventuallyAPI<Store extends PageElementStore>
extends IPageElementCommonWaitAPI<Store, boolean> {
  meetsCondition: (condition: (element: PageElement<Store>) => boolean, opts?: Workflo.IWDIOParamsOptional) => boolean
  not: IPageElementEventuallyNotAPI<Store>
}

export interface IPageElementEventuallyNotAPI<Store extends PageElementStore>
extends IPageElementCommonWaitAPI<Store, boolean> {}

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
          this._waitExists()
        }
        break
      case Workflo.WaitType.visible:
        if (!this.currently.isVisible()) {
          this._waitIsVisible()
        }
        break
      case Workflo.WaitType.value:
        if (!this.currently.hasAnyValue()) {
          this._waitHasAnyValue()
        }
        break
      case Workflo.WaitType.text:
        if (!this.currently.hasAnyText()) {
          this._waitHasAnyText()
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

  getSize() {
    return this._getSize(this.element)
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
    getSize: (): Workflo.ISize => {
      return this._getSize(this.__element)
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
    }
  }

// WAIT (for certain state within timeout)

  private _waitExists = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForExist(timeout),
      ` never existed`
    )
  }

  private _waitNotExists = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForExist(timeout, true),
      ` never not existed`
    )
  }

  private _waitIsVisible = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForVisible(timeout),
      ` never became visible`
    )
  }

  private _waitNotIsVisible = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForVisible(timeout, true),
      ` never became invisible`
    )
  }

  private _waitHasClass = (
    className: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this.currently.hasClass(className)
    }, timeout, `${this.constructor.name}: Class never became '${className}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotHasClass = (
    className: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this.currently.hasClass(className)
    }, timeout, `${this.constructor.name}: Class never became other than '${className}'.\n( ${this._selector} )`)

    return this
  }

  private _waitContainsClass = (
    className: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this.currently.containsClass(className)
    }, timeout, `${this.constructor.name}: Class never contained '${className}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotContainsClass = (
    className: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this.currently.containsClass(className)
    }, timeout, `${this.constructor.name}: Class never not contained '${className}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasText = (
    text: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this.currently.hasText(text)
    }, timeout, `${this.constructor.name}: Text never became '${text}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotHasText = (
    text: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this.currently.hasText(text)
    }, timeout, `${this.constructor.name}: Text never became other than '${text}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasAnyText = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForText(timeout),
      ` never had any text`
    )
  }

  private _waitNotHasAnyText = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForText(timeout, true),
      ` never not had any text`
    )
  }

  private _waitContainsText = (
    text: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this.currently.containsText(text)
    }, timeout, `${this.constructor.name}: Text never contained '${text}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotContainsText = (
    text: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this.currently.containsText(text)
    }, timeout, `${this.constructor.name}: Text never not contained '${text}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasValue = (
    value: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this.currently.hasValue(value)
    }, timeout, `${this.constructor.name}: Value never became '${value}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotHasValue = (
    value: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this.currently.hasValue(value)
    }, timeout, `${this.constructor.name}: Value never became other than '${value}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasAnyValue = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForValue(timeout),
      ` never had any value`
    )
  }

  private _waitNotHasAnyValue = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForValue(timeout, true),
      ` never not had any value`
    )
  }

  private _waitContainsValue = (
    value: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this.currently.containsValue(value)
    }, timeout, `${this.constructor.name}: Value never contained '${value}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotContainsValue = (
    value: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this.currently.containsValue(value)
    }, timeout, `${this.constructor.name}: Value never not contained '${value}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasDirectText = (
    directText: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this.currently.hasDirectText(directText)
    }, timeout, `${this.constructor.name}: DirectText never became '${directText}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotHasDirectText = (
    directText: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this.currently.hasDirectText(directText)
    }, timeout, `${this.constructor.name}: DirectText never became other than '${directText}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasAnyDirectText = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this.currently.hasAnyDirectText()
    }, timeout, `${this.constructor.name} never had any direct text.\n( ${this._selector} )`)

    return this
  }

  private _waitNotHasAnyDirectText = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this.currently.hasAnyDirectText()
    }, timeout, `${this.constructor.name} never not had any direct text.\n( ${this._selector} )`)

    return this
  }

  private _waitContainsDirectText = (
    directText: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this.currently.containsDirectText(directText)
    }, timeout, `${this.constructor.name}: Direct text never contained '${directText}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotContainsDirectText = (
    directText: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this.currently.containsDirectText(directText)
    }, timeout, `${this.constructor.name}: Direct text never not contained '${directText}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasAttribute = (
    attributeName: string, attributeValue: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this.currently.hasAttribute(attributeName, attributeValue)
    }, timeout, `${this.constructor.name}: Value of attribute '${attributeName}' never became '${attributeValue}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotHasAttribute = (
    attributeName: string, attributeValue: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this.currently.hasAttribute(attributeName, attributeValue)
    }, timeout, `${this.constructor.name}: Value of attribute '${attributeName}' never became other than '${attributeValue}'.\n( ${this._selector} )`)

    return this
  }

  private _waitHasAnyAttribute = (
    attributeName: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this.currently.hasAnyAttribute(attributeName)
    }, timeout, `${this.constructor.name}: Attribute '${attributeName}' never had any value.\n( ${this._selector} )`)

    return this
  }

  private _waitNotHasAnyAttribute = (
    attributeName: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this.currently.hasAnyAttribute(attributeName)
    }, timeout, `${this.constructor.name}: Attribute '${attributeName}' never not had any value.\n( ${this._selector} )`)

    return this
  }

  private _waitContainsAttribute = (
    attributeName: string, attributeValue: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return this.currently.containsAttribute(attributeName, attributeValue)
    }, timeout, `${this.constructor.name}: Value of attribute '${attributeName}' never contained '${attributeValue}'.\n( ${this._selector} )`)

    return this
  }

  private _waitNotContainsAttribute = (
    attributeName: string, attributeValue: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    browser.waitUntil(() => {
      return !this.currently.containsAttribute(attributeName, attributeValue)
    }, timeout, `${this.constructor.name}: Value of attribute '${attributeName}' never not contained '${attributeValue}'.\n( ${this._selector} )`)

    return this
  }

  _waitHasHTML: any;
  _waitHasAnyHTML: any;
  _waitContainsHTML: any;
  _waitHasId: any;
  _waitHasAnyId: any;
  _waitContainsId: any;
  _waitHasName: any;
  _waitHasAnyName: any;
  _waitContainsName: any;
  _waitNotHasHTML: any;
  _waitNotHasAnyHTML: any;
  _waitNotContainsHTML: any;
  _waitNotHasId: any;
  _waitNotHasAnyId: any;
  _waitNotContainsId: any;
  _waitNotHasName: any;
  _waitNotHasAnyName: any;
  _waitNotContainsName: any;

  private _waitIsEnabled = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForEnabled(timeout),
      ` never became enabled`
    )
  }

  private _waitNotIsEnabled = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForEnabled(timeout, true),
      ` never became disabled`
    )
  }

  private _waitIsSelected = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._wait(
      () => this.__element.waitForSelected(timeout),
      ` never became selected`
    )
  }

  private _waitNotIsSelected = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    this.__element.waitForSelected(timeout, true)

    return this._wait(
      () => this.__element.waitForSelected(timeout, true),
      ` never became deselected`
    )
  }

  private _waitUntilElement = (
    description: string, condition: (element: this) => boolean, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
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
    isEnabled: this._waitIsEnabled,
    isSelected: this._waitIsSelected,
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
    hasHTML: this._waitHasHTML,
    hasAnyHTML: this._waitHasAnyHTML,
    containsHTML: this._waitContainsHTML,
    hasId: this._waitHasId,
    hasAnyId: this._waitHasAnyId,
    containsId: this._waitContainsId,
    hasName: this._waitHasName,
    hasAnyName: this._waitHasAnyName,
    containsName: this._waitContainsName,
    untilElement: this._waitUntilElement,

    not: {
      exists: this._waitNotExists,
      isVisible: this._waitNotIsVisible,
      isEnabled: this._waitNotIsEnabled,
      isSelected: this._waitNotIsSelected,
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
      hasHTML: this._waitNotHasHTML,
      hasAnyHTML: this._waitNotHasAnyHTML,
      containsHTML: this._waitNotContainsHTML,
      hasId: this._waitNotHasId,
      hasAnyId: this._waitNotHasAnyId,
      containsId: this._waitNotContainsId,
      hasName: this._waitNotHasName,
      hasAnyName: this._waitNotHasAnyName,
      containsName: this._waitNotContainsName
    }
  }

// EVENTUALLY FUNCTIONS (check wether certain state if reached after timeout)

  // checks if at least one element matching selector is existing within timeout
  // reverse is optional and false by default
  // timeout is optional and this._timeout by default
  private _eventuallyExists = ({ timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}) => {
    return this._eventually(() => this._waitExists({ timeout }))
  }

  private _eventuallyNotExists = ({ timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}) => {
    return this._eventually(() => this._waitNotExists({ timeout }))
  }

  // checks if at least one element matching selector is visible within timeout
  // reverse is optional and false by default
  // timeout is optional and this._timeout by default
  private _eventuallyIsVisible = ({ timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}) => {
    return this._eventually(() => this._waitIsVisible({ timeout }))
  }

  private _eventuallyNotIsVisible = ({ timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}) => {
    return this._eventually(() => this._waitNotIsVisible({ timeout }))
  }

  private _eventuallyHasClass = (
    className: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitHasClass(className, { timeout }))
  }

  private _eventuallyNotHasClass = (
    className: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotHasClass(className, { timeout }))
  }

  private _eventuallyContainsClass = (
    className: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitContainsClass(className, { timeout }))
  }

  private _eventuallyNotContainsClass = (
    className: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotContainsClass(className, { timeout }))
  }

  private _eventuallyHasText = (
    text: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitHasText(text, { timeout }))
  }

  private _eventuallyNotHasText = (
    text: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotHasText(text, { timeout }))
  }

  private _eventuallyHasAnyText = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitHasAnyText({ timeout }))
  }

  private _eventuallyNotHasAnyText = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotHasAnyText({ timeout }))
  }

  private _eventuallyContainsText = (
    text: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitContainsText(text, { timeout }))
  }

  private _eventuallyNotContainsText = (
    text: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotContainsText(text, { timeout }))
  }

  private _eventuallyHasValue = (
    value: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitHasValue(value, { timeout }))
  }

  private _eventuallyNotHasValue = (
    value: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotHasValue(value, { timeout }))
  }

  private _eventuallyHasAnyValue = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitHasAnyValue({ timeout }))
  }

  private _eventuallyNotHasAnyValue = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotHasAnyValue({ timeout }))
  }

  private _eventuallyContainsValue = (
    value: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitContainsValue(value, { timeout }))
  }

  private _eventuallyNotContainsValue = (
    value: string, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotContainsValue(value, { timeout }))
  }

  private _eventuallyIsEnabled = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitIsEnabled({ timeout }))
  }

  private _eventuallyNotIsEnabled = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotIsEnabled({ timeout }))
  }

  private _eventuallyIsSelected = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitIsSelected({ timeout }))
  }

  private _eventuallyNotIsSelected = (
    { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
  ) => {
    return this._eventually(() => this._waitNotIsSelected({ timeout }))
  }

  private _eventuallyMeetsCondition = (
    condition: (element: this) => boolean, { timeout = this._timeout }: Workflo.IWDIOParamsOptional = {}
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
  _eventuallyHasHTML: any;
  _eventuallyHasAnyHTML: any;
  _eventuallyContainsHTML: any;
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
  _eventuallyNotHasHTML: any;
  _eventuallyNotHasAnyHTML: any;
  _eventuallyNotContainsHTML: any;
  _eventuallyNotHasId: any;
  _eventuallyNotHasAnyId: any;
  _eventuallyNotContainsId: any;
  _eventuallyNotHasName: any;
  _eventuallyNotHasAnyName: any;
  _eventuallyNotContainsName: any;

  public eventually: IPageElementEventuallyAPI<Store> = {
    exists: this._eventuallyExists,
    isVisible: this._eventuallyIsVisible,
    isEnabled: this._eventuallyIsEnabled,
    isSelected: this._eventuallyIsSelected,
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
    hasHTML: this._eventuallyHasHTML,
    hasAnyHTML: this._eventuallyHasAnyHTML,
    containsHTML: this._eventuallyContainsHTML,
    hasId: this._eventuallyHasId,
    hasAnyId: this._eventuallyHasAnyId,
    containsId: this._eventuallyContainsId,
    hasName: this._eventuallyHasName,
    hasAnyName: this._eventuallyHasAnyName,
    containsName: this._eventuallyContainsName,
    meetsCondition: this._eventuallyMeetsCondition,

    not: {
      exists: this._eventuallyNotExists,
      isVisible: this._eventuallyNotIsVisible,
      isEnabled: this._eventuallyNotIsEnabled,
      isSelected: this._eventuallyNotIsSelected,
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
      hasHTML: this._eventuallyNotHasHTML,
      hasAnyHTML: this._eventuallyNotHasAnyHTML,
      containsHTML: this._eventuallyNotContainsHTML,
      hasId: this._eventuallyNotHasId,
      hasAnyId: this._eventuallyNotHasAnyId,
      containsId: this._eventuallyNotContainsId,
      hasName: this._eventuallyNotHasName,
      hasAnyName: this._eventuallyNotHasAnyName,
      containsName: this._eventuallyNotContainsName
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