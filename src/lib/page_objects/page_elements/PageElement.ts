import * as _ from 'lodash'

import {
  PageElementBase,
  IPageElementBaseOpts,
  PageElementBaseCurrently,
  PageElementBaseWait,
  PageElementBaseEventually
} from '.'
import { PageElementStore } from '../stores'
import * as htmlParser from 'htmlparser2'
import { tolerancesToString, isNullOrUndefined, isEmpty } from '../../helpers'

/**
 * Describes the opts parameter passed to the constructor function of PageElement.
 */
export interface IPageElementOpts<
  Store extends PageElementStore
> extends IPageElementBaseOpts<Store> {
  /**
   * This interface is used in the parameters of scrollTo and click actions of PageElement.
   * It allows you to scroll a PageElement that resides inside a scrollable container into view.
   */
  customScroll?: Workflo.IScrollParams
}

/**
 * PageElement serves as the main building block for all page objects.
 *
 * Modern websites are usually built with reusable components (eg. in React or Angular) which provide a consistent
 * structure of the component's HTML elements and their behavior.
 *
 * The goal of PageElements is to also benefit from these advantages by recreating website components as testing
 * components. To do so, PageElement maps the structure of a website's components and provides an api to interact
 * with them.
 *
 * A big pitfall of scripted browser testing is that a website and its building blocks need to be loaded and rendered
 * before they can be interacted with and all of this takes time. Therefore, browser based tests constantly need to wait
 * for elements of a page to be loaded and rendered or for certain conditions to be met.
 *
 * PageElements try to overcome these hurdles be performing an "initial waiting condition" before interacting with
 * elements on the page. The supported initial wait conditions include:
 *
 * - 'exist' to wait for an element to exist in the DOM
 * - 'visible' to wait for an element to become visible in the viewport (not obscured by other elements, not set to
 * 'hidden', not outside of the viewport...)
 * - 'text' to wait for an element to have any text
 *
 * All public functions/actions defined on the PageElement class that interact with an element on the page or that
 * retrieve or check an element's state automatically wait for this initial wait condition to become true before
 * proceeding with any other functionality.
 *
 * PageElement furthermore provides three apis to:
 *
 * - `.currently`: retrieve or check the current state
 * - `.wait`: wait for a certain state
 * - `.eventually`: check if a certain state is eventually reached within a specific timeout.
 */
export class PageElement<
  Store extends PageElementStore
> extends PageElementBase<Store> implements Workflo.PageNode.IElementNode<string, boolean, boolean> {

  /**
   * stores the default custom scrolling behaviour
   */
  protected _customScroll: Workflo.IScrollParams

  readonly currently: PageElementCurrently<Store, this>
  readonly wait: PageElementWait<Store, this>
  readonly eventually: PageElementEventually<Store, this>

  /**
    * PageElement serves as the main building block for all page objects.
    *
    * Modern websites are usually built with reusable components (eg. in React or Angular) which provide a consistent
    * structure of the component's HTML elements and their behavior.
    *
    * The goal of PageElements is to also benefit from these advantages by recreating website components as testing
    * components. To do so, PageElement maps the structure of a website's components and provides an api to interact
    * with them.
    *
    * A big pitfall of scripted browser testing is that a website and its building blocks need to be loaded and rendered
    * before they can be interacted with and all of this takes time. Therefore, browser based tests constantly need to wait
    * for elements of a page to be loaded and rendered or for certain conditions to be met.
    *
    * PageElements try to overcome these hurdles be performing an "initial waiting condition" before interacting with
    * elements on the page. The supported initial wait conditions include:
    *
    * - 'exist' to wait for an element to exist in the DOM
    * - 'visible' to wait for an element to become visible in the viewport (not obscured by other elements, not set to
    * 'hidden', not outside of the viewport...)
    * - 'text' to wait for an element to have any text
    * - 'value' to wait for an element to have any value
    *
    * Functions/actions defined on the PageElement class that interact with an element on the page or that retrieve or
    * check an element's state automatically wait for this initial wait condition to become true before proceeding with
    * any other functionality.
    *
    * PageElement furthermore provides three apis to:
    *
    * - `.currently`: retrieve or check the current state
    * - `.wait`: wait for a certain state
    * - `.eventually`: check if a certain state is eventually reached within a specific timeout.
    *
    * @param selector the XPath selector used to identify PageElement on the page
    * @param opts the options used to configure PageElement
    */
  constructor(
    selector: string,
    {
      customScroll = undefined,
      ...superOpts
    }: IPageElementOpts<Store>
  ) {
    super(selector, superOpts)

    this._customScroll = customScroll

    this.currently = new PageElementCurrently(this)
    this.wait = new PageElementWait(this)
    this.eventually = new PageElementEventually(this)
  }

  /**
   * For internal use only in order to retrieve an Element's Store type!
   *
   * @ignore
   */
  get __$(): Store {
    return this._$
  }

// ABSTRACT BASE CLASS IMPLEMENTATIONS

  /**
   * Returns true if `actual` equals `expected`.
   *
   * By default, the comparison is only implemented for the type `string`.
   * If the comparison is not implemented for the type of `actual` and `expected`, an error will be thrown.
   *
   * @template T the type of both `actual` and `expected`
   * @param actual an actual value retrieved from the page's state
   * @param expected an expected value
   */
  __equals<T>(actual: T, expected: T): boolean {
    if(isEmpty(actual) && isEmpty(expected)) {
      return true
    } else if (typeof actual === 'string' || typeof expected === 'string') {
      return actual === expected
    } else {
      throw new Error(
        `${this.constructor.name}.__equals is missing an implementation for type of values: ${actual}, ${expected}`
      )
    }
  }

  /**
   * Returns true if `actual` has any value.
   *
   * By default, the comparison is only implemented for the type `string`.
   * If the comparison is not implemented for the type of `actual`, an error will be thrown.
   *
   * @template T the type of `actual`
   * @param actual an actual value retrieved from the page's state
   */
  __any<T>(actual: T): boolean {
    if (isEmpty(actual)) {
      return false
    } else if (typeof actual === 'string') {
      return (actual) ? actual.length > 0 : false
    } else {
      throw new Error(
        `${this.constructor.name}.__any is missing an implementation for type of value: ${actual}`
      )
    }
  }

  /**
   * Returns true if `actual` contains `expected`.
   *
   * By default, the comparison is only implemented for the type `string`.
   * If the comparison is not implemented for the type of `actual` and `expected`, an error will be thrown.
   *
   * @template T the type of both `actual` and `expected`
   * @param actual an actual value retrieved from the page's state
   * @param expected an expected value
   */
  __contains<T>(actual: T, expected: T) {
    if(isEmpty(actual) && isEmpty(expected)) {
      return true
    } else if (isEmpty(actual) && typeof expected === 'string' && expected.length > 0) {
      return false
    } else if (typeof actual === 'string') {
      if (typeof expected === 'string') {
        return (actual) ? actual.indexOf(expected) > -1 : false
      } else {
        // expected is null or undefined
        return true
      }
    } else {
      throw new Error(
        `${this.constructor.name}.__contains is missing an implementation for type of values: ${actual}, ${expected}`
      )
    }
  }

  /**
   * Converts `value` to the type `string`.
   *
   * By default, the comparison is only implemented for the types `string`, `number` and `undefined` and for the value
   * `null`.
   * If the comparison is not implemented for the type of `value`, an error will be thrown.
   *
   * @param value the value whose type should be converted
   */
  __typeToString<T>(value: T) {
    if (isNullOrUndefined(value)) {
      return ''
    } else if (typeof value === 'string') {
      return (value.length > 0) ? value : ''
    } else if (typeof value === 'number') {
      return value.toString()
    } else {
      throw new Error(`${this.constructor.name}.__typeToString is missing an implementation for type of value: ${value}`)
    }
  }

// RETRIEVE ELEMENT FUNCTIONS

  /**
   * Return WdioElement from current state, not performing an initial wait.
   */
  protected get __element() {
    return browser.element(this._selector)
  }

  /**
   * Fetches the first webdriverio element from the HTML page that is identified by PageNode's XPath selector after
   * performing PageElement's initial wait condition.
   */
  get element() {
    this.initialWait()

    return this.__element
  }

  /**
   * Performs PageElement's initial wait condition.
   */
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

  /**
   * Returns true if the PageElement is enabled after performing the initial waiting condition.
   */
  getIsEnabled() {
    return this._executeAfterInitialWait( () => this.currently.isEnabled() )
  }

  /**
   * Returns PageElement's HTML after performing the initial waiting condition.
   */
  getHTML() {
    return this._executeAfterInitialWait( () => this.currently.getHTML() )
  }

  /**
   * Returns PageElement's direct text after performing the initial waiting condition.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children elements.
   */
  getDirectText() {
    return this._executeAfterInitialWait( () => this.currently.getDirectText() )
  }

  getText() {
    return this._executeAfterInitialWait( () => this.currently.getText() )
  }

  getAttribute(attributeName: string) {
    return this._executeAfterInitialWait( () => this.currently.getAttribute(attributeName) )
  }

  getClass() {
    return this._executeAfterInitialWait( () => this.currently.getAttribute('class') )
  }

  getId() {
    return this._executeAfterInitialWait( () => this.currently.getAttribute('id') )
  }

  getName() {
    return this._executeAfterInitialWait( () => this.currently.getAttribute('name') )
  }

  getLocation() {
    return this._executeAfterInitialWait( () => this.currently.getLocation() )
  }

  getX() {
    return this._executeAfterInitialWait( () => this.currently.getX() )
  }

  getY() {
    return this._executeAfterInitialWait( () => this.currently.getY() )
  }

  getSize() {
    return this._executeAfterInitialWait( () => this.currently.getSize() )
  }

  getWidth() {
    return this._executeAfterInitialWait( () => this.currently.getWidth() )
  }

  getHeight() {
    return this._executeAfterInitialWait( () => this.currently.getHeight() )
  }

  getHasText(text: string) {
    return this._executeAfterInitialWait( () => this.currently.hasText(text) )
  }

  getHasAnyText() {
    return this._executeAfterInitialWait( () => this.currently.hasAnyText() )
  }

  getContainsText(text: string) {
    return this._executeAfterInitialWait( () => this.currently.containsText(text) )
  }

  getHasDirectText(directText: string) {
    return this._executeAfterInitialWait( () => this.currently.hasDirectText(directText) )
  }

  getHasAnyDirectText() {
    return this._executeAfterInitialWait( () => this.currently.hasAnyDirectText() )
  }

  getContainsDirectText(directText: string) {
    return this._executeAfterInitialWait( () => this.currently.containsDirectText(directText) )
  }

// INTERACTION FUNCTIONS (interact with state after initial wait)

/**
   * Clicks on PageElement after performing PageElement's initial waiting condition.
   *
   * Before clicking on PageElement, it is scrolled into the viewport.
   *
   * If the clicked HTML element is obscured by another HTML element, the click will be repeated
   * until the clicked HTML element is no longer obscured and can therefore receive the click or until a specific
   * timeout is reached.
   *
   * If a postCondition is defined in `click`'s options, the click will be repeated until the postCondition function
   * returns true or until a specific timeout is reached.
   *
   * @param options configures the scrolling behavior
   * @returns PageElement
   */
  click(
    options: Workflo.IClickOpts = {}
  ) {
    this.initialWait()

    let errorMessage = ''
    const interval = options.interval || this._interval
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
      const result: Workflo.IJSError = browser.selectorExecute(
        this.getSelector(), function (elems: HTMLElement[], selector) {
          if (elems.length === 0) {
            return {
              notFound: [selector]
            }
          }

          elems[0].click()
        }, this.getSelector()
      )

      if (isJsError(result)) {
        throw new Error(`${this.constructor.name} could not be clicked: ${result.notFound.join(', ')}\n( ${this._selector} )`)
      }
    }

    if (options.customScroll) {
      this._scrollTo(options.customScroll)
    }

    // wait for other overlapping elements to disappear
    try {
      browser.waitUntil(
        () => {
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
            } else {
              error.message = error.message.replace('unknown error: ', '')
              throw error
            }
          }
        },
        this._timeout,
        `${this.constructor.name} did not become clickable after timeout.\n( ${this._selector} )`,
        interval
      );
    } catch (waitE) {
      waitE.message = errorMessage.replace('unknown error: ', '')
      throw waitE
    }

    if (options && options.postCondition && remainingTimeout > 0) {
      options.timeout = options.timeout || this._timeout

      try {
        browser.waitUntil(
          () => {
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
          },
          remainingTimeout + options.timeout,
          `${this.constructor.name}: Postcondition for click never became true.\n( ${this._selector} )`,
          interval
        )
      } catch (waitE) {
        waitE.message = errorMessage.replace('unknown error: ', '')
        throw waitE
      }
    }

    return this
  }

  /**
   * Scrolls PageElement into view if PageElement resides in a scrollable container.
   *
   * Does not perform the initial waiting condition.
   *
   * @param params configures the scrolling behavior
   * @returns PageElement
   */
  protected _scrollTo(
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

  /**
   * Scrolls PageElement into view if PageElement resides in a scrollable container after performing the initial waiting
   * condition.
   *
   * @param params configures the scrolling behavior
   * @returns PageElement
   */
  scrollTo(
    params: Workflo.IScrollParams
  ) {
    this.initialWait()
    this._scrollTo(params)

    return this
  }

// HELPER FUNCTIONS

  /**
   * Executes func after initial wait and, if an error occurs during execution of func,
   * throws a custom error message that the page element could not be located on the page.
   *
   * @template ResultType the type of the executed function's result
   * @param func the function to be executed after performing the initial wait condition
   */
  protected _executeAfterInitialWait<ResultType>(func: () => ResultType) {
    this.initialWait()
    return this.__execute(func)
  }
}

export class PageElementCurrently<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>
> extends PageElementBaseCurrently<Store, PageElementType> {

// GET STATE

  getExists() {
    return this.exists()
  }

  getIsVisible() {
    return this.isVisible()
  }

  getIsEnabled() {
    return this.isEnabled()
  }

  /**
   * Overwriting this function will affect the behaviour of the functions
   * getHTML, hasHTML, containsHTML and hasAnyHTML in PageElement base class and its
   * currently, wait and eventually containers.
   */
  getHTML(): string {
    const result: Workflo.IJSError | string = browser.selectorExecute(
      [this._node.getSelector()], function (elems: HTMLElement[], elementSelector: string
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
    }, this._node.getSelector())

    if (isJsError(result)) {
      throw new Error(
        `${this._node.constructor.name} could not be located on the page.\n( ${this._node.getSelector()} )`
        )
    } else {
      return result || ''
    }
  }

  /**
   * Gets text that resides on the level directly below the selected page element.
   * Does not include any text of the page element's nested children elements.
   *
   * Overwriting this function will affect the behaviour of the functions
   * getDirectText, hasDirectText, containsDirectText and hasDirectAnyText in PageElement base class and its
   * currently, wait and eventually containers.
   */
  getDirectText(): string {
    const html = this.getHTML()

    if (html.length === 0) {
      return ''
    }

    let text = ""
    const constructorName = this._node.constructor.name

    const handler = new htmlParser.DomHandler(function (error, dom) {
      if (error) {
        throw new Error(`Error creating dom for direct text in ${constructorName}: ${error}\n( ${this._pageElement.getSelector()} )`)
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

  /**
   * Returns text of this.element including all texts of nested children.
   * Be aware that only text visible within the viewport will be returned.
   *
   * Overwriting this function will affect the behaviour of the functions
   * getText, hasText, containsText and hasAnyText in PageElement base class and its
   * currently, wait and eventually containers.
   */
  getText(): string {
    return this._node.__execute(() => this.element.getText())
  }

  /**
   * Overwriting this function will affect the behaviour of the functions
   * getAttribute, hasAttribute, containsAttribute and hasAnyAttribute in PageElement base class and its
   * currently, wait and eventually containers.
   */
  getAttribute(attrName: string): string {
    return this._node.__execute(() => this.element.getAttribute(attrName))
  }

  /**
   * Overwriting this function will affect the behaviour of the functions
   * getClass, hasClass, containsClass and hasAnyClass in PageElement base class and its
   * currently, wait and eventually containers.
   */
  getClass() {
    return this.getAttribute('class')
  }

  /**
   * Overwriting this function will affect the behaviour of the functions
   * getId, hasId, containsId and hasAnyId in PageElement base class and its
   * currently, wait and eventually containers.
   */
  getId() {
    return this.getAttribute('id')
  }

  /**
   * Overwriting this function will affect the behaviour of the functions
   * getName, hasName, containsName and hasAnyName in PageElement base class and its
   * currently, wait and eventually containers.
   */
  getName() {
    return this.getAttribute('name')
  }

  /**
   * Overwriting this function will affect the behaviour of the functions
   * getLocation, hasLocation, containsLocation and hasAnyLocation in PageElement base class and its
   * currently, wait and eventually containers.
   */
  getLocation() {
    return <Workflo.ICoordinates> (<any> this._node.__execute(() => this.element.getLocation()))
  }

  /**
   * Overwriting this function will affect the behaviour of the functions
   * getX, hasX, containsX and hasAnyX in PageElement base class and its
   * currently, wait and eventually containers.
   */
  getX() {
    return this.getLocation().x
  }

  /**
   * Overwriting this function will affect the behaviour of the functions
   * getY, hasY, containsY and hasAnyY in PageElement base class and its
   * currently, wait and eventually containers.
   */
  getY() {
    return this.getLocation().y
  }

  /**
   * Overwriting this function will affect the behaviour of the functions
   * getSize, hasSize, containsSize and hasAnySize in PageElement base class and its
   * currently, wait and eventually containers.
   */
  getSize() {
    return <Workflo.ISize> (<any> this._node.__execute(() => this.element.getElementSize()))
  }

  /**
   * Overwriting this function will affect the behaviour of the functions
   * getWidth, hasWidth, containsWidth and hasAnyWidth in PageElement base class and its
   * currently, wait and eventually containers.
   */
  getWidth() {
    return this.getSize().width
  }

  /**
   * Overwriting this function will affect the behaviour of the functions
   * getHeight, hasHeight, containsHeight and hasAnyHeight in PageElement base class and its
   * currently, wait and eventually containers.
   */
  getHeight() {
    return this.getSize().height
  }

  getHasText(text: string) {
    return this.hasText(text)
  }

  getHasAnyText() {
    return this.hasAnyText()
  }

  getContainsText(text: string) {
    return this.containsText(text)
  }

  getHasDirectText(directText: string) {
    return this.hasDirectText(directText)
  }

  getHasAnyDirectText() {
    return this.hasAnyDirectText()
  }

  getContainsDirectText(directText: string) {
    return this.containsDirectText(directText)
  }

// CHECK STATE

    /**
   * @param actual the actual browser value in pixels
   * @param expected the expected value in pixels or 0 if expected was smaller than 0
   * @param tolerance the tolerance in pixels or 0 if tolerance was smaller than 0
   */
  protected _withinTolerance(actual: number, expected: number, tolerance?: number) {
    const tolerances: Workflo.ITolerance = {
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

  /**
   * Overwriting this function will affect the behaviour of the function
   * exists in PageElement base class and its currently, wait and eventually containers.
   */
  exists(): boolean {
    return this.element.isExisting()
  }

  /**
   * Overwriting this function will affect the behaviour of the function
   * isVisible in PageElement base class and its currently, wait and eventually containers.
   */
  isVisible(): boolean {
    return this.element.isVisible()
  }

  /**
   * Overwriting this function will affect the behaviour of the function
   * isEnabled in PageElement base class and its currently, wait and eventually containers.
   */
  isEnabled(): boolean {
    return this._node.__execute(() => this.element.isEnabled())
  }

  /**
   * Overwriting this function will affect the behaviour of the function
   * isSelected in PageElement base class and its currently, wait and eventually containers.
   */
  isSelected(): boolean {
    return this._node.__execute(() => this.element.isSelected())
  }

  /**
   * Overwriting this function will affect the behaviour of the function
   * isChecked in PageElement base class and its currently, wait and eventually containers.
   */
  isChecked(): boolean {
    return this.hasAnyAttribute('checked')
  }

  hasText(text: string) {
    return this._compareHas(text, this.getText())
  }
  hasAnyText() {
    return this._compareHasAny(this.getText())
  }
  containsText(text: string) {
    return this._compareContains(text, this.getText())
  }
  hasHTML(html: string) {
    return this._compareHas(html, this.getHTML())
  }
  hasAnyHTML() {
    return this._compareHasAny(this.getHTML())
  }
  containsHTML(html: string) {
    return this._compareContains(html, this.getHTML())
  }
  hasDirectText(directText: string) {
    return this._compareHas(directText, this.getDirectText())
  }
  hasAnyDirectText() {
    return this._compareHasAny(this.getDirectText())
  }
  containsDirectText(directText: string) {
    return this._compareContains(directText, this.getDirectText())
  }
  hasAttribute(attribute: Workflo.IAttribute) {
    return this._compareHas(attribute.value, this.getAttribute(attribute.name))
  }
  hasAnyAttribute(attributeName: string) {
    return this._compareHasAny(this.getAttribute(attributeName))
  }
  containsAttribute(attribute: Workflo.IAttribute) {
    return this._compareContains(attribute.value, this.getAttribute(attribute.name))
  }
  hasClass(className: string) {
    return this._compareHas(className, this.getClass())
  }
  hasAnyClass() {
    return this._compareHasAny(this.getClass())
  }
  containsClass(className: string) {
    return this._compareContains(className, this.getClass())
  }
  hasId(id: string) {
    return this._compareHas(id, this.getId())
  }
  hasAnyId() {
    return this._compareHasAny(this.getId())
  }
  containsId(id: string) {
    return this._compareContains(id, this.getId())
  }
  hasName(name: string) {
    return this._compareHas(name, this.getName())
  }
  hasAnyName() {
    return this._compareHasAny(this.getName())
  }
  containsName(name: string) {
    return this._compareContains(name, this.getName())
  }
  hasLocation(coordinates: Workflo.ICoordinates, tolerances: Partial<Workflo.ICoordinates> = { x: 0, y: 0 }) {
    const actualCoords = this.getLocation()
    this._writeLastDiff(tolerancesToString(actualCoords))

    return this._hasAxisLocation(coordinates.x, actualCoords.x, tolerances.x)
      && this._hasAxisLocation(coordinates.y, actualCoords.y, tolerances.y)
  }
  hasX(x: number, tolerance?: number) {
    const actual = this.getX()
    this._writeLastDiff(tolerancesToString(actual))

    return this._hasAxisLocation(x, actual, tolerance)
  }
  hasY(y: number, tolerance?: number) {
    const actual = this.getY()
    this._writeLastDiff(tolerancesToString(actual))

    return this._hasAxisLocation(y, actual, tolerance)
  }
  hasSize(size: Workflo.ISize, tolerances: Partial<Workflo.ISize> = {width: 0, height: 0}) {
    const actualSize = this.getSize()
    this._writeLastDiff(tolerancesToString(actualSize))

    return this._hasSideSize(size.width, actualSize.width, tolerances.width)
      && this._hasSideSize(size.height, actualSize.height, tolerances.height)
  }
  hasWidth(width: number, tolerance?: number) {
    const actual = this.getWidth()
    this._writeLastDiff(tolerancesToString(actual))

    return this._hasSideSize(width, actual, tolerance)
  }
  hasHeight(height: number, tolerance?: number) {
    const actual = this.getHeight()
    this._writeLastDiff(tolerancesToString(actual))

    return this._hasSideSize(height, actual, tolerance)
  }

  get not() {
    return  {
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
      hasAttribute: (attribute: Workflo.IAttribute) => !this.hasAttribute(attribute),
      hasAnyAttribute: (attributeName: string) => !this.hasAnyAttribute(attributeName),
      containsAttribute: (attribute: Workflo.IAttribute) => !this.containsAttribute(attribute),
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
      hasLocation: (coordinates: Workflo.ICoordinates, tolerances?: Partial<Workflo.ICoordinates>) =>
        !this.hasLocation(coordinates, tolerances),
      hasX: (x: number, tolerance?: number) => !this.hasX(x, tolerance),
      hasY: (y: number, tolerance?: number) => !this.hasY(y, tolerance),
      hasSize: (size: Workflo.ISize, tolerances?: Partial<Workflo.ISize>) =>
        !this.hasSize(size, tolerances),
      hasWidth: (width: number, tolerance?: number) => !this.hasWidth(width, tolerance),
      hasHeight: (height: number, tolerance?: number) => !this.hasHeight(height, tolerance),
    }
  }
}

export class PageElementWait<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>
> extends PageElementBaseWait<Store, PageElementType> {

  exists(opts: Workflo.ITimeoutReverse = {}) {
    return this._waitWdioCheckFunc(
      'existed', opts => this._node.currently.element.waitForExist(opts.timeout, opts.reverse), opts
    )
  }
  isVisible(opts: Workflo.ITimeoutReverse = {}) {
    return this._waitWdioCheckFunc(
      'became visible', opts => this._node.currently.element.waitForVisible(opts.timeout, opts.reverse), opts
    )
  }
  isEnabled(opts: Workflo.ITimeoutReverse = {}) {
    return this._waitWdioCheckFunc(
      'became enabled', opts => this._node.currently.element.waitForEnabled(opts.timeout, opts.reverse), opts
    )
  }
  isSelected(opts: Workflo.ITimeoutReverse = {}) {
    return this._waitWdioCheckFunc(
      'became selected', opts => this._node.currently.element.waitForSelected(opts.timeout, opts.reverse), opts
    )
  }
  isChecked(opts: Workflo.ITimeoutReverseInterval = {}) {
    const timeout = opts.timeout || this._node.getTimeout()
    const interval = opts.interval || this._node.getInterval()
    const reverseStr = (opts.reverse) ? ' not' : ''

    this._node.__waitUntil(
      () => {
        if ( opts.reverse ) {
          return this._node.currently.not.isChecked()
        } else {
          return this._node.currently.isChecked()
        }
      },
      () => ` never${reverseStr} became checked`,
      timeout,
      interval
    )

    return this._node
  }
  hasText(text: string, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasProperty(
      'text', text, () => this._node.currently.hasText(text), opts
    )
  }
  hasAnyText(opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasAnyProperty(
      'text', () => this._node.currently.hasAnyText(), opts
    )
  }
  containsText(text: string, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasProperty(
      'text', text, () => this._node.currently.containsText(text), opts
    )
  }
  hasHTML(html: string, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasProperty(
      'HTML', html, () => this._node.currently.hasHTML(html), opts
    )
  }
  hasAnyHTML(opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasAnyProperty(
      'HTML', () => this._node.currently.hasAnyHTML(), opts
    )
  }
  containsHTML(html: string, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitContainsProperty(
      'HTML', html, () => this._node.currently.containsHTML(html), opts
    )
  }
  hasDirectText(directText: string, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasProperty(
      'direct text', directText, () => this._node.currently.hasDirectText(directText), opts
    )
  }
  hasAnyDirectText(opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasAnyProperty(
      'direct text', () => this._node.currently.hasAnyDirectText(), opts
    )
  }
  containsDirectText(directText: string, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitContainsProperty(
      'direct text', directText, () => this._node.currently.containsDirectText(directText), opts
    )
  }
  hasAttribute(attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasProperty(
      `Attribute '${attribute.name}'`,
      attribute.value,
      () => this._node.currently.hasAttribute(attribute), opts
    )
  }
  hasAnyAttribute(attributeName: string, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasAnyProperty(
      `Attribute '${attributeName}'`, () => this._node.currently.hasAnyAttribute(attributeName), opts
    )
  }
  containsAttribute(attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitContainsProperty(
      `Attribute '${attribute.name}'`,
      attribute.value,
      () => this._node.currently.containsAttribute(attribute), opts
    )
  }
  hasClass(className: string, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasProperty(
      `class`, className, () => this._node.currently.hasClass(className), opts
    )
  }
  hasAnyClass(opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasAnyProperty(
      `class`, () => this._node.currently.hasAnyClass(), opts
    )
  }
  containsClass(className: string, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitContainsProperty(
      `class`, className, () => this._node.currently.containsClass(className), opts
    )
  }
  hasId(id: string, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasProperty(
      `id`, id, () => this._node.currently.hasId(id), opts
    )
  }
  hasAnyId(opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasAnyProperty(
      `id`, () => this._node.currently.hasAnyId(), opts
    )
  }
  containsId(id: string, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitContainsProperty(
      `id`, id, () => this._node.currently.containsId(id), opts
    )
  }
  hasName(name: string, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasProperty(
      `name`, name, () => this._node.currently.hasName(name), opts
    )
  }
  hasAnyName(opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitHasAnyProperty(
      `id`, () => this._node.currently.hasAnyName(), opts
    )
  }
  containsName(name: string, opts?: Workflo.ITimeoutReverseInterval) {
    return this._waitContainsProperty(
      `name`, name, () => this._node.currently.containsName(name), opts
    )
  }
  hasLocation(
    coordinates: Workflo.ICoordinates,
    opts: {tolerances?: Partial<Workflo.ICoordinates>} & Workflo.ITimeoutReverseInterval =
      { tolerances: { x: 0, y: 0 } }
  ) {
    const { tolerances, ...otherOpts } = opts

    if (tolerances && (tolerances.x > 0 || tolerances.y > 0)) {
      return this._waitWithinProperty(
        `location`,
        tolerancesToString(coordinates, tolerances),
        () => this._node.currently.hasLocation(coordinates, tolerances),
        otherOpts
      )
    } else {
      return this._waitHasProperty(
        `location`,
        tolerancesToString(coordinates),
        () => this._node.currently.hasLocation(coordinates),
        otherOpts
      )
    }
  }
  hasX(
    x: number, opts: {tolerance?: number} & Workflo.ITimeoutReverseInterval = { tolerance: 0 }
  ) {
    const { tolerance, ...otherOpts } = opts

    if ( tolerance ) {
      return this._waitWithinProperty(
        `X-location`,
        tolerancesToString(x, tolerance),
        () => this._node.currently.hasX(x, tolerance),
        otherOpts
      )
    } else {
      return this._waitHasProperty(
        `X-location`,
        x.toString(),
        () => this._node.currently.hasX(x),
        otherOpts
      )
    }
  }
  hasY(
    y: number, opts: {tolerance?: number} & Workflo.ITimeoutReverseInterval = { tolerance: 0 }
  ) {
    const { tolerance, ...otherOpts } = opts

    if ( tolerance ) {
      return this._waitWithinProperty(
        `Y-location`,
        tolerancesToString(y, tolerance),
        () => this._node.currently.hasY(y, tolerance),
        otherOpts
      )
    } else {
      return this._waitHasProperty(
        `Y-location`,
        y.toString(),
        () => this._node.currently.hasY(y),
        otherOpts
      )
    }
  }
  hasSize(
    size: Workflo.ISize,
    opts: {tolerances?: Partial<Workflo.ISize>} & Workflo.ITimeoutReverseInterval =
      { tolerances: { width: 0, height: 0 } }
  ) {
    const { tolerances, ...otherOpts } = opts

    if (tolerances && (tolerances.width > 0 || tolerances.height > 0)) {
      return this._waitWithinProperty(
        `size`,
        tolerancesToString(size, tolerances),
        () => this._node.currently.hasSize(size, tolerances),
        otherOpts
      )
    } else {
      return this._waitHasProperty(
        `size`,
        tolerancesToString(size),
        () => this._node.currently.hasSize(size),
        otherOpts
      )
    }
  }
  hasWidth(
    width: number, opts: {tolerance?: number} & Workflo.ITimeoutReverseInterval = { tolerance: 0 }
  ) {
    const { tolerance, ...otherOpts } = opts

    if ( tolerance ) {
      return this._waitWithinProperty(
        `width`,
        tolerancesToString(width, tolerance),
        () => this._node.currently.hasWidth(width, tolerance),
        otherOpts
      )
    } else {
      return this._waitHasProperty(
        `width`,
        width.toString(),
        () => this._node.currently.hasWidth(width),
        otherOpts
      )
    }
  }
  hasHeight(
    height: number, opts: {tolerance?: number} & Workflo.ITimeoutReverseInterval = { tolerance: 0 }
  ) {
    const { tolerance, ...otherOpts } = opts

    if ( tolerance ) {
      return this._waitWithinProperty(
        `height`,
        tolerancesToString(height, tolerance),
        () => this._node.currently.hasHeight(height, tolerance),
        otherOpts
      )
    } else {
      return this._waitHasProperty(
        `height`,
        height.toString(),
        () => this._node.currently.hasHeight(height),
        otherOpts
      )
    }
  }
  untilElement(
    description: string,
    condition: (element: PageElementType) => boolean,
    { timeout = this._node.getTimeout(), interval = this._node.getInterval() }: Workflo.ITimeoutInterval = {}
  ) {
    this._node.__waitUntil(
      () => condition(this._node),
      () => `: Wait until element ${description} failed`,
      timeout,
      interval
    )

    return this._node
  }

  get not() {
    return {
      exists: (opts?: Workflo.ITimeout) => {
        return this.exists(this._makeReverseParams(opts))
      },
      isVisible: (opts?: Workflo.ITimeout) => {
        return this.isVisible(this._makeReverseParams(opts))
      },
      isEnabled: (opts?: Workflo.ITimeout) => {
        return this.isEnabled(this._makeReverseParams(opts))
      },
      isSelected: (opts?: Workflo.ITimeout) => {
        return this.isSelected(this._makeReverseParams(opts))
      },
      isChecked: (opts?: Workflo.ITimeoutInterval) => {
        return this.isChecked(this._makeReverseParams(opts))
      },
      hasText: (text: string, opts?: Workflo.ITimeoutInterval) => {
        return this.hasText(text, this._makeReverseParams(opts))
      },
      hasAnyText: (opts?: Workflo.ITimeoutInterval) => {
        return this.hasAnyText(this._makeReverseParams(opts))
      },
      containsText: (text: string, opts?: Workflo.ITimeoutInterval) => {
        return this.containsText(text, this._makeReverseParams(opts))
      },
      hasHTML: (html: string, opts?: Workflo.ITimeoutInterval) => {
        return this.hasHTML(html, this._makeReverseParams(opts))
      },
      hasAnyHTML: (opts?: Workflo.ITimeoutInterval) => {
        return this.hasAnyHTML(this._makeReverseParams(opts))
      },
      containsHTML: (html: string, opts?: Workflo.ITimeoutInterval) => {
        return this.containsHTML(html, this._makeReverseParams(opts))
      },
      hasDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => {
        return this.hasDirectText(directText, this._makeReverseParams(opts))
      },
      hasAnyDirectText: (opts?: Workflo.ITimeoutInterval) => {
        return this.hasAnyDirectText(this._makeReverseParams(opts))
      },
      containsDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => {
        return this.containsDirectText(directText, this._makeReverseParams(opts))
      },
      hasAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => {
        return this.hasAttribute(attribute, this._makeReverseParams(opts))
      },
      hasAnyAttribute: (attributeName: string, opts?: Workflo.ITimeoutInterval) => {
        return this.hasAnyAttribute(attributeName, this._makeReverseParams(opts))
      },
      containsAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => {
        return this.containsAttribute(attribute, this._makeReverseParams(opts))
      },
      hasClass: (className: string, opts?: Workflo.ITimeoutInterval) => {
        return this.hasClass(className, this._makeReverseParams(opts))
      },
      hasAnyClass: (opts?: Workflo.ITimeoutInterval) => {
        return this.hasAnyClass(this._makeReverseParams(opts))
      },
      containsClass: (className: string, opts?: Workflo.ITimeoutInterval) => {
        return this.containsClass(className, this._makeReverseParams(opts))
      },
      hasId: (id: string, opts?: Workflo.ITimeoutInterval) => {
        return this.hasId(id, this._makeReverseParams(opts))
      },
      hasAnyId: (opts?: Workflo.ITimeoutInterval) => {
        return this.hasAnyId(this._makeReverseParams(opts))
      },
      containsId: (id: string, opts?: Workflo.ITimeoutInterval) => {
        return this.containsId(id, this._makeReverseParams(opts))
      },
      hasName: (name: string, opts?: Workflo.ITimeoutInterval) => {
        return this.hasName(name, this._makeReverseParams(opts))
      },
      hasAnyName: (opts?: Workflo.ITimeoutInterval) => {
        return this.hasAnyName(this._makeReverseParams(opts))
      },
      containsName: (name: string, opts?: Workflo.ITimeoutInterval) => {
        return this.containsName(name, this._makeReverseParams(opts))
      },
      hasLocation: (
        coordinates: Workflo.ICoordinates,
        opts: {tolerances?: Partial<Workflo.ICoordinates>} & Workflo.ITimeoutInterval =
          { tolerances: { x: 0, y: 0 } }
      ) => this.hasLocation(
        coordinates, {tolerances: opts.tolerances, timeout: opts.timeout, reverse: true}
      ),
      hasX: (
        x: number, opts: {tolerance?: number} & Workflo.ITimeoutInterval = { tolerance: 0 }
      ) => this.hasX(
        x, {tolerance: opts.tolerance, timeout: opts.timeout, reverse: true}
      ),
      hasY: (
        y: number, opts: {tolerance?: number} & Workflo.ITimeoutInterval = { tolerance: 0 }
      ) => this.hasY(
        y, {tolerance: opts.tolerance, timeout: opts.timeout, reverse: true}
      ),
      hasSize: (
        size: Workflo.ISize,
        opts: {tolerances?: Partial<Workflo.ISize>} & Workflo.ITimeoutInterval =
          { tolerances: { width: 0, height: 0 } }
      ) => this.hasSize(
        size, {tolerances: opts.tolerances, timeout: opts.timeout, reverse: true}
      ),
      hasWidth: (
        width: number, opts: {tolerance?: number} & Workflo.ITimeoutInterval = { tolerance: 0 }
      ) => this.hasWidth(
        width, {tolerance: opts.tolerance, timeout: opts.timeout, reverse: true}
      ),
      hasHeight: (
        height: number, opts: {tolerance?: number} & Workflo.ITimeoutInterval = { tolerance: 0 }
      ) => this.hasHeight(
        height, {tolerance: opts.tolerance, timeout: opts.timeout, reverse: true}
      )
    }
  }
}

export class PageElementEventually<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>
> extends PageElementBaseEventually<Store, PageElementType> {

  exists(opts?: Workflo.ITimeout) {
    return this._node.__eventually(() => this._node.wait.exists(opts))
  }
  isVisible(opts?: Workflo.ITimeout) {
    return this._node.__eventually(() => this._node.wait.isVisible(opts))
  }
  isEnabled(opts?: Workflo.ITimeout) {
    return this._node.__eventually(() => this._node.wait.isEnabled(opts))
  }
  isSelected(opts?: Workflo.ITimeout) {
    return this._node.__eventually(() => this._node.wait.isSelected(opts))
  }
  isChecked(opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.isChecked(opts))
  }
  hasText(text: string, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasText(text, opts))
  }
  hasAnyText(opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasAnyText(opts))
  }
  containsText(text: string, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.containsText(text, opts))
  }
  hasHTML(html: string, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasHTML(html, opts))
  }
  hasAnyHTML(opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasAnyHTML(opts))
  }
  containsHTML(html: string, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.containsHTML(html, opts))
  }
  hasDirectText(directText: string, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasDirectText(directText, opts))
  }
  hasAnyDirectText(opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasAnyDirectText(opts))
  }
  containsDirectText(directText: string, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.containsDirectText(directText, opts))
  }
  hasAttribute(attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasAttribute(attribute, opts))
  }
  hasAnyAttribute(attributeName: string, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasAnyAttribute(attributeName, opts))
  }
  containsAttribute(attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.containsAttribute(attribute, opts))
  }
  hasClass(className: string, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasClass(className, opts))
  }
  hasAnyClass(opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasAnyClass(opts))
  }
  containsClass(className: string, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.containsClass(className, opts))
  }
  hasId(id: string, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasId(id, opts))
  }
  hasAnyId(opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasAnyId(opts))
  }
  containsId(id: string, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.containsId(id, opts))
  }
  hasName(name: string, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasName(name, opts))
  }
  hasAnyName(opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.hasAnyName(opts))
  }
  containsName(name: string, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(() => this._node.wait.containsName(name, opts))
  }
  hasLocation(
    coordinates: Workflo.ICoordinates,
    opts: {tolerances?: Partial<Workflo.ICoordinates>} & Workflo.ITimeoutInterval = { tolerances: { x: 0, y: 0 } }
  ) {
    return this._node.__eventually(
      () => this._node.wait.hasLocation(coordinates, {tolerances: opts.tolerances, timeout: opts.timeout})
    )
  }
  hasX(
    x: number, opts: {tolerance?: number} & Workflo.ITimeoutInterval = { tolerance: 0 }
  ) {
    return this._node.__eventually(
      () => this._node.wait.hasX(x, {tolerance: opts.tolerance, timeout: opts.timeout})
    )
  }
  hasY(
    y: number, opts: {tolerance?: number} & Workflo.ITimeoutInterval = { tolerance: 0 }
  ) {
    return this._node.__eventually(
      () => this._node.wait.hasY(y, {tolerance: opts.tolerance, timeout: opts.timeout})
    )
  }
  hasSize(
    size: Workflo.ISize,
    opts: {tolerances?: Partial<Workflo.ISize>} & Workflo.ITimeoutInterval = { tolerances: { width: 0, height: 0 } }
  ) {
    return this._node.__eventually(
      () => this._node.wait.hasSize(size, {tolerances: opts.tolerances, timeout: opts.timeout})
    )
  }
  hasWidth(
    width: number, opts: {tolerance?: number} & Workflo.ITimeoutInterval = { tolerance: 0 }
  ) {
    return this._node.__eventually(
      () => this._node.wait.hasWidth(width, {tolerance: opts.tolerance, timeout: opts.timeout})
    )
  }
  hasHeight(
    height: number, opts: {tolerance?: number} & Workflo.ITimeoutInterval = { tolerance: 0 }
  ) {
    return this._node.__eventually(
      () => this._node.wait.hasHeight(height, {tolerance: opts.tolerance, timeout: opts.timeout})
    )
  }
  meetsCondition(condition: (element: PageElementType) => boolean, opts?: Workflo.ITimeoutInterval) {
    return this._node.__eventually(
      () => this._node.wait.untilElement(' meets condition', () => condition(this._node), opts)
    )
  }

  get not() {
    return {
      exists: (opts?: Workflo.ITimeout) => {
        return this._node.__eventually(() => this._node.wait.not.exists(opts))
      },
      isVisible: (opts?: Workflo.ITimeout) => {
        return this._node.__eventually(() => this._node.wait.not.isVisible(opts))
      },
      isEnabled: (opts?: Workflo.ITimeout) => {
        return this._node.__eventually(() => this._node.wait.not.isEnabled(opts))
      },
      isSelected: (opts?: Workflo.ITimeout) => {
        return this._node.__eventually(() => this._node.wait.not.isSelected(opts))
      },
      isChecked: (opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.isChecked(opts))
      },
      hasText: (text: string, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasText(text, opts))
      },
      hasAnyText: (opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasAnyText(opts))
      },
      containsText: (text: string, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.containsText(text, opts))
      },
      hasHTML: (html: string, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasHTML(html, opts))
      },
      hasAnyHTML: (opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasAnyHTML(opts))
      },
      containsHTML: (html: string, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.containsHTML(html, opts))
      },
      hasDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasDirectText(directText, opts))
      },
      hasAnyDirectText: (opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasAnyDirectText(opts))
      },
      containsDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.containsDirectText(directText, opts))
      },
      hasAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasAttribute(attribute, opts))
      },
      hasAnyAttribute: (attributeName: string, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasAnyAttribute(attributeName, opts))
      },
      containsAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.containsAttribute(attribute, opts))
      },
      hasClass: (className: string, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasClass(className, opts))
      },
      hasAnyClass: (opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasAnyClass(opts))
      },
      containsClass: (className: string, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.containsClass(className, opts))
      },
      hasId: (id: string, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasId(id, opts))
      },
      hasAnyId: (opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasAnyId(opts))
      },
      containsId: (id: string, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.containsId(id, opts))
      },
      hasName: (name: string, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasName(name, opts))
      },
      hasAnyName: (opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.hasAnyName(opts))
      },
      containsName: (name: string, opts?: Workflo.ITimeoutInterval) => {
        return this._node.__eventually(() => this._node.wait.not.containsName(name, opts))
      },
      hasLocation: (
        coordinates: Workflo.ICoordinates,
        opts: {tolerances?: Partial<Workflo.ICoordinates>} & Workflo.ITimeoutInterval =
          { tolerances: { x: 0, y: 0 } }
      ) => this._node.__eventually(
        () => this._node.wait.not.hasLocation(coordinates, {tolerances: opts.tolerances, timeout: opts.timeout})
      ),
      hasX: (
        x: number, opts: {tolerance?: number} & Workflo.ITimeoutInterval = { tolerance: 0 }
      ) => this._node.__eventually(
        () => this._node.wait.not.hasX(x, {tolerance: opts.tolerance, timeout: opts.timeout})
      ),
      hasY: (
        y: number, opts: {tolerance?: number} & Workflo.ITimeoutInterval = { tolerance: 0 }
      ) => this._node.__eventually(
        () => this._node.wait.not.hasY(y, {tolerance: opts.tolerance, timeout: opts.timeout})
      ),
      hasSize: (
        size: Workflo.ISize,
        opts: {tolerances?: Partial<Workflo.ISize>} & Workflo.ITimeoutInterval =
          { tolerances: { width: 0, height: 0 } }
      ) => this._node.__eventually(
        () => this._node.wait.not.hasSize(size, {tolerances: opts.tolerances, timeout: opts.timeout})
      ),
      hasWidth: (
        width: number, opts: {tolerance?: number} & Workflo.ITimeoutInterval = { tolerance: 0 }
      ) => this._node.__eventually(
        () => this._node.wait.not.hasWidth(width, {tolerance: opts.tolerance, timeout: opts.timeout})
      ),
      hasHeight: (
        height: number, opts: {tolerance?: number} & Workflo.ITimeoutInterval = { tolerance: 0 }
      ) => this._node.__eventually(
        () => this._node.wait.not.hasHeight(height, {tolerance: opts.tolerance, timeout: opts.timeout})
      ),
    }
  }
}

// TYPE GUARDS

/**
 * Returns true if the passed result is an instance of Workflo.IJSError.
 *
 * @param result an arbitrary value/object
 */
function isJsError(result: any): result is Workflo.IJSError {
  if (!result) {
    return false
  }

  return result.notFound !== undefined;
}