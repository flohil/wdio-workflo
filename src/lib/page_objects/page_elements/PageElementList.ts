import * as _ from 'lodash'

import { compare, comparatorStr } from '../../utility_functions/util'
import {
  PageNode,
  IPageNodeOpts,
  PageElement,
  IPageElementOpts,
  IPageElementBaseOpts
} from '.'
import { PageElementStore } from '../stores'
import { ListWhereBuilder, XPathBuilder } from '../builders'
import { isArray } from 'util';
import { PageNodeEventually, PageNodeWait, PageNodeCurrently } from './PageNode';
import { isNullOrUndefined } from '../../helpers';

/**
 * Describes the opts parameter passed to the PageElementList's `identify` function.
 *
 * A list identifier allows for PageElements managed by PageElementList to be accessed via the key names of a
 * `mappingObject`'s properties. To do so, an "identification process" needs to be performed which matches the
 * values of `mappingObject`'s properties to the return values of a `mappingFunc` that is executed on each managed
 * PageElement.
 *
 * Be aware that this form of PageElement identification can be quite slow because PageElementList needs to fetch all
 * managed PageElements from the page before `mappingFunc` can be executed on them.
 *
 * Therefore, always prefer PageElementList's `where` accessor to its `identify` method for the identification of managed
 * PageElements. The only exception to this rule are cases in which the identification of PageElements cannot be
 * described by the modification of an XPath selector (eg. identifying PageElements via their location coordinates on
 * the page).
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement managed by PageElementList
 */
export interface IPageElementListIdentifier<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>
> {
  /**
   * An object whose keys are the names by which identified PageElements can be accessed
   * and whose values are used to identify these PageElements when invoking `mappingFunc`.
   */
  mappingObject: {[key: string] : string},
  /**
   * A function which is executed on each PageElement mapped by PageElementList.
   *
   * The return value of this function is compared to the values of mappingObject's properties and if there is a match,
   * the PageElement can be accessed via the key of the matching property from now on.
   */
  mappingFunc: ( element: PageElementType ) => string
}

/**
 * Describes the opts parameter passed to the `isEmpty` function of PageElementList's `wait` and `eventually` APIs.
 */
export interface IPageElementListWaitEmptyReverseParams extends Workflo.ITimeoutInterval {
  reverse?: boolean,
}

/**
 * Describes the opts parameter passed to the `hasLength` function of PageElementList's `wait.not` and `eventually.not`
 * APIs.
 */
export interface IPageElementListWaitLengthParams extends Workflo.ITimeoutInterval {
  comparator?: Workflo.Comparator,
}

/**
 * Describes the opts parameter passed to the `hasLength` function of PageElementList's `wait` and `eventually` APIs.
 */
export interface IPageElementListWaitLengthReverseParams extends IPageElementListWaitLengthParams {
  reverse?: boolean,
}


/**
 * Describes the opts parameter passed to the constructor function of PageElementList.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement managed by PageElementList
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the PageElements managed
 * by PageElementList
 */
export interface IPageElementListOpts<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOpts extends Partial<IPageElementOpts<Store>>
> extends IPageNodeOpts<Store> {
  /**
   * This function retrieves an instance of a PageElement mapped by PageElementList from the list's PageElementStore.
   *
   * @param selector the XPath expression used to identify the retrieved PageElement in the DOM
   * @param opts the options used to configure the retrieved PageElement
   */
  elementStoreFunc: (selector: string, opts: PageElementOpts) => PageElementType
  /**
   * the options passed to `elementStoreFunc` to configure the retrieved PageElement instance
   */
  elementOpts: PageElementOpts
  /**
   * `waitType` defines the kind of waiting condition performed when `initialWait` is invoked.
   *
   * The initial waiting condition is performed every time before an interaction with the tested application takes place
   * via a PageElementList's action (eg. identify).
   */
  waitType?: Workflo.WaitType
  /**
   * By default, the results of an "identification process" (the last invocation of PageElementList's `identify`
   * function) are cached for future invocations of PageElementList's `identify` function.
   *
   * If `disableCache` is set to true, this caching of identification results will be disabled and a new "identification
   * process" will be performed on each invocation of PageElementList's `identify` function.
   *
   * Disabling the identification results cache can be useful if the contents of a PageElementList change often.
   * If the contents of a PageElementList rarely change, PageElementList's `identify` function can be invoked with the
   * `resetCache` option set to true in order to repeat the "identification process" for a changed page content.
   */
  disableCache?: boolean
  /**
   * This is the default `identifier` used to identify a PageElementList's managed PageElements via the key names
   * defined in `identifier`'s `mappingObject` by matching `mappingObject`'s values with the return values of identifier's
   * `mappingFunc`.
   *
   * This default `identifier` can be overwritten by passing a custom `identifier` in the function parameters of
   * PageElementList's `identify` function.
   */
  identifier?: IPageElementListIdentifier<Store, PageElementType>
}

/**
 * PageElementList provides a way to manage multiple PageElements which all have the same type and selector.
 *
 * By default, PageElements mapped by PageElementList can only be accessed via their index of occurrence in the DOM
 * using the following accessor methods:
 *
 * - `.first` to retrieve the first PageElement found in the DOM that is identified by PageElementList's XPath selector
 * - `.at` to retrieve the PageElement found in the DOM at the defined index of occurrence that is identified by
 * PageElementList's XPath selector
 * - `.all` to retrieve all PageElements found in the DOM that are identified by PageElementList's XPath selector
 *
 * However, PageElementList also features two other methods to access managed PageElements which are not restricted
 * to index-based access:
 *
 * - The `where` accessor modifies the XPath expression used to identify PageElements by adding additional
 * constraints to PageElementList's XPath selector.
 * - The `identify` method can be used to access managed PageElements via the key names of a `mappingObject` whose
 * values are matched with the return values of a `mappingFunc` that is executed on each managed PageElement. Be aware
 * that this form of PageElement identification can be quite slow because PageElementList needs to fetch all managed
 * PageElements from the page before `mappingFunc` can be executed on them.
 *
 * Therefore, always prefer `where` to `identify` for the identification of managed PageElements. The only exception
 * to this rule are cases in which the identification of PageElements cannot be described by the modification of an
 * XPath selector (eg. identifying PageElements via their location coordinates on the page).
 */
export class PageElementList<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
> extends PageNode<Store>
implements Workflo.PageNode.IElementNode<string[], boolean[], boolean> {

  /**
   * `_$` provides access to the PageNode retrieval functions of PageElementList's PageElementStore and prefixes the
   * selectors of all PageNodes retrieved via `_$` with the selector of PageElementList.
   */
  protected _$: Store
  /**
   * This function retrieves an instance of a PageElement mapped by PageElementList from the list's PageElementStore.
   *
   * @param selector the XPath expression used to identify the retrieved PageElement in the DOM
   * @param opts the options used to configure the retrieved PageElement
   */
  protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  /**
   * the options passed to `elementStoreFunc` to configure the retrieved PageElement instance
   */
  protected _elementOptions: PageElementOptions
  /**
   * defines the kind of waiting condition performed when `initialWait` is invoked
   *
   * The initial waiting condition is performed every time before an interaction with the tested application takes place
   * via a PageElementList's action (eg. identify).
   */
  protected _waitType: Workflo.WaitType
  /**
   * By default, the results of an "identification process" (the last invocation of PageElementList's `identify`
   * function) are cached for future invocations of PageElementList's `identify` function.
   *
   * If `_disableCache` is set to true, this caching of identification results will be disabled and a new "identification
   * process" will be performed on each invocation of PageElementList's `identify` function.
   *
   * Disabling the identification results cache can be useful if the contents of a PageElementList change often.
   * If the contents of a PageElementList rarely change, PageElementList's `identify` function can be invoked with the
   * `resetCache` option set to true in order to repeat the "identification process" for a changed page content.
   */
  protected _disableCache: boolean
  /**
   * This is the default `identifier` used to identify a PageElementList's managed PageElements via the key names
   * defined in `identifier`'s `mappingObject` by matching `mappingObject`'s values with the return values of identifier's
   * `mappingFunc`.
   *
   * This default `identifier` can be overwritten by passing a custom `identifier` in the function parameters of
   * PageElementList's `identify` function.
   */
  protected _identifier: IPageElementListIdentifier<Store, PageElementType>
  /**
   * caches the last result of PageElementList's `identify` function for future invocations of the function
   */
  protected _identifiedObjCache: {[key: string] : {[key: string] : PageElementType}}
  /**
   * Stores an instance of ListWhereBuilder which allows to select subsets of the PageElements managed by PageElementList
   * by modifying the list's selector using XPath modification functions.
   */
  protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOptions, this>

  readonly currently: PageElementListCurrently<
    Store, PageElementType, PageElementOptions, this
  >
  readonly wait: PageElementListWait<
    Store, PageElementType, PageElementOptions, this
  >
  readonly eventually: PageElementListEventually<
    Store, PageElementType, PageElementOptions, this
  >

  /**
   * PageElementList provides a way to manage multiple PageElements which all have the same type and selector.
   *
   * By default, PageElements mapped by PageElementList can only be accessed via their index of occurrence in the DOM
   * using the following accessor methods:
   *
   * - `.first` to retrieve the PageElement which maps to the first HTML element found in the DOM that is identified by
   * PageElementList's selector
   * - `.at` to retrieve the PageElement which maps to the HTML element found in the DOM at the defined index that is
   * identified by PageElementList's selector
   * - `.all` to retrieve all PageElements which map to HTML elements found in the DOM that are identified by
   * PageElementList's selector
   *
   * However, PageElementList also features two other methods to access managed PageElements which are not restricted
   * to index-based access:
   *
   * - The `where` accessor modifies the XPath expression used to identify PageElements by adding additional
   * constraints to PageElementList's XPath selector.
   * - The `identify` method can be used to access managed PageElements via the key names of a `mappingObject` whose
   * values are matched with the return values of a `mappingFunc` that is executed on each managed PageElement. Be aware
   * that this form of PageElement identification can be quite slow because PageElementList needs to fetch all managed
   * PageElements from the page before `mappingFunc` can be executed on them.
   *
   * Therefore, always prefer `where` to `identify` for the identification of managed PageElements. The only exception
   * to this rule are cases in which the identification of PageElements cannot be described by the modification of an
   * XPath selector (eg. identifying PageElements via their location coordinates on the page).
   *
   * @param selector an XPath expression which identifies all PageElements managed by PageElementList
   * @param opts the options used to configure PageElementList
   */
  constructor(
    protected selector: string,
    opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>
  ) {
    super(selector, opts)

    this._waitType = opts.waitType || Workflo.WaitType.visible
    this._disableCache = opts.disableCache || false

    this._elementOptions = opts.elementOpts
    this._elementStoreFunc = opts.elementStoreFunc
    this._identifier = opts.identifier
    this._identifiedObjCache = {}

    this.currently = new PageElementListCurrently<
      Store, PageElementType, PageElementOptions, this
    >(this, opts)
    this.wait = new PageElementListWait<
      Store, PageElementType, PageElementOptions, this
    >(this)
    this.eventually = new PageElementListEventually<
      Store, PageElementType, PageElementOptions, this
    >(this)

    this._$ = Object.create(null)

    for (const method of Workflo.Class.getAllMethods(this._store)) {
      if (method.indexOf('_') !== 0 && /^[A-Z]/.test(method)) {
        this._$[method] = <Options extends IPageElementBaseOpts<Store>>(_selector: Workflo.XPath, _options: Options) => {

          if (_selector instanceof XPathBuilder) {
            _selector = XPathBuilder.getInstance().build()
          }

          // chain selectors
          _selector = `${selector}${_selector}`

          return this._store[method].apply(this._store, [_selector, _options])
        }
      }
    }
  }

  /**
   * Use this method to initialize properties that rely on the this type which is not available in the constructor.
   *
   * Make sure that this method is invoked immediately after construction.
   *
   * @param cloneFunc creates a copy of PageElementList which manages a subset of the original list's PageElements
   */
  init(cloneFunc: (selector: Workflo.XPath) => this) {
    this._whereBuilder = new ListWhereBuilder(this._selector, {
      store: this._store,
      elementStoreFunc: this._elementStoreFunc,
      elementOpts: this._elementOptions,
      cloneFunc: cloneFunc,
      getAllFunc: list => list.all
    })

    this.currently.init(cloneFunc)
  }

  /**
   * This function performs PageElementList's initial waiting condition.
   *
   * It supports the following waiting types:
   *
   * - 'exist' to wait for at least one of PageElementList's managed elements to exist in the DOM
   * - 'visible' to wait for at least one of PageElementList's managed elements to become visible in the viewport
   * (not obscured by other elements, not set to 'hidden', not outside of the viewport...)
   * - 'text' to wait for at least one of PageElementList's managed elements to have any text
   */
  initialWait() {
    switch(this._waitType) {
      case Workflo.WaitType.exist:
      this.wait.any.exists()
      break
      case Workflo.WaitType.visible:
      this.wait.any.isVisible()
      break
      case Workflo.WaitType.text:
      this.wait.any.hasAnyText()
      break
      default:
        throw Error(`${this.constructor.name}: Unknown initial wait type '${this._waitType}'`)
    }
  }

// RETRIEVAL FUNCTIONS for wdio or list elements

  // typescript bugs 3.3.0:
  // https://github.com/Microsoft/TypeScript/issues/24560, https://github.com/Microsoft/TypeScript/issues/24791

  /**
   * `$` provides access to the PageNode retrieval functions of PageElementList's PageElementStore and prefixes the
   * selectors of all PageNodes retrieved via `$` with the selector of PageElementList.
   */
  get $() /*: Workflo.Omit<Store, Workflo.FilteredKeysByReturnType<Store, PageElementGroup<any, any>>>*/ {
    return this._$
  }

  /**
   * Fetches all webdriverio elements identified by PageElementList's XPath selector from the HTML page after
   * performing PageElementList's initial waiting condition.
   */
  get elements() {
    this.initialWait()

    return browser.elements( this._selector )
  }

  get where() {
    this.initialWait()

    return this._whereBuilder.reset()
  }

  /**
   * Retrieves the first PageElement found in the DOM that is identified by PageElementList's XPath selector after
   * performing PageElementList's initial waiting condition.
   */
  get first() {
    return this.where.getFirst()
  }

  /**
   * Retrieves the PageElement found in the DOM at the defined index of occurrence that is identified by
   * PageElementList's XPath selector after performing PageElementList's initial waiting condition.
   *
   * @param index the index of occurrence of the retrieved PageElement - STARTS AT 0
   */
  at(index: number) {
    return this.where.getAt( index )
  }

  /**
   * Retrieves all PageElements found in the DOM that are identified by PageElementList's XPath selector after
   * performing PageElementList's initial waiting condition.
   */
  get all() {
    const _elements: PageElementType[] = []

    try {
      const value = this.elements.value

      if (value && value.length) {
        // create list elements
        for ( let i = 0; i < value.length; i++ ) {
          // make each list element individually selectable via xpath
          const selector = `(${this._selector})[${i + 1}]`

          const listElement = this._elementStoreFunc.apply( this._store, [ selector, this._elementOptions ] )

          _elements.push( listElement )
        }
      }

      return _elements
    } catch(error) {
      // this.elements will throw error if no elements were found
      return _elements
    }
  }

// INTERACTION functions

  /**
   * Sets a new default `identifier` for PageElementList's `identify` function.
   *
   * @param identifier used to identify a PageElementList's managed PageElements via the key names defined in `identifier`
   * 's `mappingObject` by matching `mappingObject`'s values with the return values of `identifier`'s `mappingFunc`
   */
  setIdentifier(identifier: IPageElementListIdentifier<Store, PageElementType>) {
    this._identifier = identifier

    return this
  }

  /**
   * This function identifies PageElements managed by PageElementList with the aid of an `identifier`'s `mappingObject`
   * and `mappingFunc`.
   *
   * It returns an identification results object which allows for PageElements managed by PageElementList to be accessed
   * via the key names of `mappingObject`'s properties. To create this results object, an "identification process" needs
   * to be performed:
   *
   * - At first, PageElementList needs to fetch all managed PageElements from the page.
   * - Then, a `mappingFunc` is executed on each fetched PageElement and its return value is compared to the values of
   * `mappingObject`'s properties.
   * - If there is a match between a `mappingFunc`'s return value and the value of a `mappingObject`'s property,
   * a new property is written to the results object whose key name is taken from the matched `mappingObject`'s property
   * and whose value is the PageElement on which `mappingFunc` was invoked.
   *
   * By default, the identification results object is cached for future invocations of the `identify` method. This
   * behavior can be overwritten by passing a `resetCache` flag to the `identify` method.
   *
   * Disabling the identification results cache can be useful if the contents of a PageElementList change often.
   * If the contents of a PageElementList rarely change, PageElementList's `identify` function can be invoked with the
   * `resetCache` flag set to true in order to repeat the "identification process" for a changed page content.
   *
   * Be aware that the invocation of `identify` can be quite slow (if no identification result is cached yet) because
   * PageElementList needs to fetch all managed PageElements from the page before `mappingFunc` can be executed on them.
   *
   * Therefore, always prefer PageElementList's `where` accessor to its `identify` method for the identification of managed
   * PageElements. The only exception to this rule are cases in which the identification of PageElements cannot be
   * described by the modification of an XPath selector (eg. identifying PageElements via their location coordinates on
   * the page).
   *
   * @param opts includes the `identifier` which provides the `mappingObject` and the `mappingFunc` for the
   * identification process and a `resetCache` flag that, if set to true, deletes any previously cached identification
   * results
   *
   * If no `identifier` is passed to the `identify` method, PageElementList's default `identifier` is used. If no
   * default `identifier` is provided either, the elements' indexes of occurrence will be used as keys in the
   * identification results object.
   *
   * If no `resetCache` flag is provided, the PageElementList's `disabledCache` property is used to determine if
   * identification results should be cached. The `disabledCache` property is set to `false` by default.
   */
  identify(
    {identifier = this._identifier, resetCache = false}:
    {identifier?: IPageElementListIdentifier<Store, PageElementType>, resetCache?: boolean} = {}
  ) {
    const cacheKey = (identifier) ? `${identifier.mappingObject.toString()}|||${identifier.mappingFunc.toString()}` : 'index'

    if (this._disableCache || resetCache || !(cacheKey in this._identifiedObjCache)) {
      const listElements = this.all

      const mappedObj: {[key: string] : PageElementType} = {}

      if (identifier) { // manually set identifier
        const queryResults: {[key:string]:PageElementType} = {}

        // create hash where result of identifier func is key
        // and list element is value
        listElements.forEach(
          ( element ) => {
            const resultKey = identifier.mappingFunc( element )
            queryResults[ resultKey ] = element
          }
        )

        // Assign each key in identifier's object a list element by
        // mapping queryResult's keys to identifier mapObject's values
        for ( const key in identifier.mappingObject ) {
          if ( identifier.mappingObject.hasOwnProperty( key ) ) {
            mappedObj[ key ] = queryResults[ identifier.mappingObject[ key ] ]
          }
        }
      } else { // default identifier -> mapped by index of results
        for(let i = 0; i < listElements.length; ++i) {
          mappedObj[i] = listElements[i]
        }
      }

      this._identifiedObjCache[cacheKey] = mappedObj
    }

    return this._identifiedObjCache[cacheKey]
  }

// PUBLIC GETTER FUNCTIONS

  getSelector() {
    return this._selector
  }

  getInterval() {
    return this._interval
  }

  getLength() {
    try {
      const value = this.elements.value

      if (value && value.length) {
        return value.length
      } else {
        return 0
      }
    } catch(error) {
      // this.elements will throw error if no elements were found
      return 0
    }
  }

  getText(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this.eachGet(this.all, element => element.getText(), filterMask)
  }

  getDirectText(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this.eachGet(this.all, element => element.getDirectText(), filterMask)
  }

  getIsEnabled(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this.eachGet(this.all, element => element.currently.isEnabled(), filterMask)
  }

  getHasText(text: string | string[]) {
    return this.eachCompare(this.all, (element, expected) => element.currently.hasText(expected), text)
  }

  getHasAnyText(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this.eachCompare(this.all, (element) => element.currently.hasAnyText(), filterMask, true)
  }

  getContainsText(text: string | string[]) {
    return this.eachCompare(this.all, (element, expected) => element.currently.containsText(expected), text)
  }

  getHasDirectText(directText: string | string[]) {
    return this.eachCompare(
      this.all, (element, expected) => element.currently.hasDirectText(expected), directText
    )
  }

  getHasAnyDirectText(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this.eachCompare(this.all, (element) => element.currently.hasAnyDirectText(), filterMask, true)
  }

  getContainsDirectText(directText: string | string[]) {
    return this.eachCompare(
      this.all, (element, expected) => element.currently.containsDirectText(expected), directText
    )
  }

  // HELPER FUNCTIONS

  protected _includedInFilter(filter: any) {
    return (typeof filter === 'boolean' && filter === true)
  }

  eachCompare<T>(
    elements: PageElementType[],
    checkFunc: (element: PageElementType, expected?: T) => boolean,
    expected?: T | T[],
    isFilterMask: boolean = false
  ): boolean[] {
    const result = []

    if (isArray(expected) && expected.length !== elements.length) {
      throw new Error(
        `${this.constructor.name}: ` +
        `Length of expected (${expected.length}) did not match length of list (${elements.length})\n` +
        `( ${this._selector} )`
      )
    }

    for (let i = 0; i < elements.length; ++i) {
      const _expected: T = isArray(expected) ? expected[i] : expected
      const element = elements[i]

      if (isFilterMask) {
        if (isNullOrUndefined(expected) || this._includedInFilter(_expected)) {
          result.push(checkFunc(element, _expected))
        }
      } else {
        result.push(checkFunc(element, _expected))
      }
    }

    return result
  }

  /**
   * If the list is empty (no elements could be located matching the list selector),
   * this function will always return true.
   *
   * @param elements
   * @param checkFunc
   * @param expected
   */
  eachCheck<T>(
    elements: PageElementType[],
    checkFunc: (element: PageElementType, expected?: T) => boolean,
    expected?: T | T[],
    isFilterMask: boolean = false
  ): boolean {
    const diffs: Workflo.IDiffTree = {}

    if (isArray(expected) && expected.length !== elements.length) {
      throw new Error(
        `${this.constructor.name}: ` +
        `Length of expected (${expected.length}) did not match length of list (${elements.length})\n` +
        `( ${this._selector} )`
      )
    }

    for (let i = 0; i < elements.length; ++i) {
      const _expected: T = isArray(expected) ? expected[i] : expected
      const element = elements[i]

      if (isFilterMask) {
        if (isNullOrUndefined(expected) || this._includedInFilter(_expected)) {
          if (!checkFunc(element, _expected)) {
            diffs[`[${i + 1}]`] = element.__lastDiff
          }
        }
      } else {
        if (!checkFunc(element, _expected)) {
          diffs[`[${i + 1}]`] = element.__lastDiff
        }
      }
    }

    this._lastDiff = {
      tree: diffs
    }

    return Object.keys(diffs).length === 0
  }

  eachGet<T>(
    elements: PageElementType[],
    getFunc: (element: PageElementType) => T,
    filterMask?: Workflo.PageNode.ListFilterMask,
  ): T[] {
    if (isNullOrUndefined(filterMask)) {
      return elements.map(element => getFunc(element))
    } else if (filterMask !== false) {
      const result: T[] = []

      if (isArray(filterMask) && filterMask.length !== elements.length) {
        throw new Error(
          `${this.constructor.name}: ` +
          `Length of filterMask array (${filterMask.length}) did not match length of list (${elements.length})\n` +
          `( ${this._selector} )`
        )
      }

      for (let i = 0; i < elements.length; ++i) {
        const _filterMask: boolean = isArray(filterMask) ? filterMask[i] : filterMask
        const element = elements[i]

        if (this._includedInFilter(_filterMask)) {
          result.push(getFunc(element))
        }
      }

      return result
    } else {
      return []
    }
  }

  /**
   * Uses default interval and default timeout of each element contained in this list.
   *
   * @param elements
   * @param waitFunc
   * @param expected
   */
  eachWait<T>(
    elements: PageElementType[],
    waitFunc: (element: PageElementType, expected?: T) => PageElementType,
    expected?: T | T[],
    isFilterMask: boolean = false
  ): this {
    if (isArray(expected) && expected.length !== elements.length) {
      throw new Error(
        `${this.constructor.name}: ` +
        `Length of expected (${expected.length}) did not match length of list (${elements.length})\n` +
        `( ${this._selector} )`
      )
    }

    for (let i = 0; i < elements.length; ++i) {
      const _expected: T = isArray(expected) ? expected[i] : expected
      const element = elements[i]

      if (isFilterMask) {
        if (isNullOrUndefined(expected) || this._includedInFilter(_expected)) {
          waitFunc(element)
        }
      } else {
        waitFunc(element, _expected)
      }
    }

    return this
  }

  eachDo(
    doFunc: (element: PageElementType) => any,
    filterMask?: Workflo.PageNode.ListFilterMask
  ) {
    const elements = this.all

    if (isNullOrUndefined(filterMask)) {
      elements.map(element => doFunc(element))
    } else if (filterMask !== false) {
      if (isArray(filterMask) && filterMask.length !== elements.length) {
        throw new Error(
          `${this.constructor.name}: ` +
          `Length of filterMask array (${filterMask.length}) did not match length of list (${elements.length})\n` +
          `( ${this._selector} )`
        )
      }

      for (let i = 0; i < elements.length; ++i) {
        const _filterMask: boolean = isArray(filterMask) ? filterMask[i] : filterMask
        const element = elements[i]

        if (this._includedInFilter(_filterMask)) {
          doFunc(element)
        }
      }
    }

    return this
  }

  eachSet<T>(
    elements: PageElementType[],
    setFunc: (element: PageElementType, value: T) => PageElementType,
    values?: T | T[],
  ) {
    if (_.isArray(values)) {
      if (elements.length !== values.length) {
        throw new Error(
          `Length of values array (${values.length}) did not match length of list page elements (${elements.length})\n` +
          `( ${this._selector} )`
        )
      } else {
        for ( let i = 0; i < elements.length; i++) {
          setFunc(elements[i], values[i])
        }
      }
    } else {
      for ( let i = 0; i < elements.length; i++) {
        setFunc(elements[i], values)
      }
    }

    return this
  }
}

export class PageElementListCurrently<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> extends PageNodeCurrently<Store, ListType> {

  protected readonly _node: ListType

  protected _selector: string
  protected _store: Store
  protected _elementOptions: PageElementOptions
  protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOptions, ListType>

  constructor(
    node: ListType,
    opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>,
  ) {
    super(node)

    this._selector = node.getSelector()
    this._store = opts.store
    this._elementOptions = opts.elementOpts
    this._elementStoreFunc = opts.elementStoreFunc

    this._node = node
  }

  /**
   * Use this method to initialize properties that rely on the this type which is not available in the constructor.
   *
   * Make sure that this method is invoked immediately after construction.
   *
   * @param cloneFunc creates a copy of PageElementList which manages a subset of the original list's PageElements
   */
  init(cloneFunc: (selector: Workflo.XPath) => ListType) {
    this._whereBuilder = new ListWhereBuilder(this._selector, {
      store: this._store,
      elementStoreFunc: this._elementStoreFunc,
      elementOpts: this._elementOptions,
      cloneFunc: cloneFunc,
      getAllFunc: list => list.all
    })
  }

// RETRIEVAL FUNCTIONS for wdio or list elements

  get elements() {
    return browser.elements( this._selector )
  }

  get where() {
    return this._whereBuilder.reset()
  }

  /**
   * Returns the first page element found in the DOM that matches the list selector.
   */
  get first() {
    return this.where.getFirst()
  }

  /**
   * @param index starts at 0
   */
  at( index: number ) {
    return this.where.getAt( index )
  }

  /**
   * Returns all page elements found in the DOM that match the list selector after initial wait.
   */
  get all() {
    const elements: PageElementType[] = []
    const value = this.elements.value

    if (value && value.length) {
      // create list elements
      for ( let i = 0; i < value.length; i++ ) {
        // make each list element individually selectable via xpath
        const selector = `(${this._selector})[${i + 1}]`

        const listElement = this._elementStoreFunc.apply( this._store, [ selector, this._elementOptions ] )

        elements.push( listElement )
      }
    }

    return elements
  }

// PUBLIC GETTER FUNCTIONS

  getLength() {
    try {
      const value = this.elements.value

      if (value && value.length) {
        return value.length
      } else {
        return 0
      }
    } catch(error) {
      // this.elements will throw error if no elements were found
      return 0
    }
  }

  getText(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this._node.eachGet(this.all, element => element.currently.getText(), filterMask)
  }

  getDirectText(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this._node.eachGet(this.all, element => element.currently.getDirectText(), filterMask)
  }

  getExists(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this._node.eachGet(this.all, element => element.currently.exists(), filterMask)
  }

  getIsVisible(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this._node.eachGet(this.all, element => element.currently.isVisible(), filterMask)
  }

  getIsEnabled(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this._node.eachGet(this.all, element => element.currently.isEnabled(), filterMask)
  }

  getHasText(text: string | string[]) {
    return this._node.eachCompare(this.all, (element, expected) => element.currently.hasText(expected), text)
  }

  getHasAnyText(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this._node.eachCompare(this.all, (element) => element.currently.hasAnyText(), filterMask, true)
  }

  getContainsText(text: string | string[]) {
    return this._node.eachCompare(this.all, (element, expected) => element.currently.containsText(expected), text)
  }

  getHasDirectText(directText: string | string[]) {
    return this._node.eachCompare(
      this.all, (element, expected) => element.currently.hasDirectText(expected), directText
    )
  }

  getHasAnyDirectText(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this._node.eachCompare(this.all, (element) => element.currently.hasAnyDirectText(), filterMask, true)
  }

  getContainsDirectText(directText: string | string[]) {
    return this._node.eachCompare(
      this.all, (element, expected) => element.currently.containsDirectText(expected), directText
    )
  }

// CHECK STATE FUNCTIONS

  isEmpty() {
    const actualLength = this.getLength()

    this._node.__setLastDiff({
      actual: actualLength.toString()
    })

    return actualLength === 0
  }

  hasLength(
    length: number, comparator: Workflo.Comparator = Workflo.Comparator.equalTo
  ) {
    const actualLength = this.getLength()

    this._node.__setLastDiff({
      actual: actualLength.toString()
    })

    return compare(actualLength, length, comparator)
  }

  exists(filterMask?: boolean) {
    if (filterMask === false) {
      return true
    } else {
      return this.not.isEmpty()
    }
  }

  isVisible(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this._node.eachCheck(this.all, element => element.currently.isVisible(), filterMask, true)
  }

  isEnabled(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this._node.eachCheck(this.all, element => element.currently.isEnabled(), filterMask, true)
  }

  hasText(text: string | string[]) {
    return this._node.eachCheck(this.all, (element, expected) => element.currently.hasText(expected), text)
  }

  hasAnyText(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this._node.eachCheck(this.all, (element) => element.currently.hasAnyText(), filterMask, true)
  }

  containsText(text: string | string[]) {
    return this._node.eachCheck(this.all, (element, expected) => element.currently.containsText(expected), text)
  }

  hasDirectText(directText: string | string[]) {
    return this._node.eachCheck(
      this.all, (element, expected) => element.currently.hasDirectText(expected), directText
    )
  }

  hasAnyDirectText(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this._node.eachCheck(this.all, (element) => element.currently.hasAnyDirectText(), filterMask, true)
  }

  containsDirectText(directText: string | string[]) {
    return this._node.eachCheck(
      this.all, (element, expected) => element.currently.containsDirectText(expected), directText
    )
  }

  get not() {
    return {
      isEmpty: () => !this.isEmpty(),
      hasLength: (
        length: number, comparator: Workflo.Comparator = Workflo.Comparator.equalTo
      ) => !this.hasLength(length, comparator),
      exists: (filterMask?: boolean) => {
        if (filterMask === false) {
          return true
        } else {
          return this.isEmpty()
        }
      },
      isVisible: (filterMask?: Workflo.PageNode.ListFilterMask) => {
        return this._node.eachCheck(this.all, element => element.currently.not.isVisible(), filterMask, true)
      },
      isEnabled: (filterMask?: Workflo.PageNode.ListFilterMask) => {
        return this._node.eachCheck(this.all, element => element.currently.not.isEnabled(), filterMask, true)
      },
      hasText: (text: string | string[]) => {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.not.hasText(expected), text)
      },
      hasAnyText: (filterMask?: Workflo.PageNode.ListFilterMask) => {
        return this._node.eachCheck(this.all, (element) => element.currently.not.hasAnyText(), filterMask, true)
      },
      containsText: (text: string | string[]) => {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.not.containsText(expected), text)
      },
      hasDirectText: (directText: string | string[]) => {
        return this._node.eachCheck(
          this.all, (element, expected) => element.currently.not.hasDirectText(expected), directText
        )
      },
      hasAnyDirectText: (filterMask?: Workflo.PageNode.ListFilterMask) => {
        return this._node.eachCheck(this.all, (element) => element.currently.not.hasAnyDirectText(), filterMask, true)
      },
      containsDirectText: (directText: string | string[]) => {
        return this._node.eachCheck(
          this.all, (element, expected) => element.currently.not.containsDirectText(expected), directText
        )
      }
    }
  }
}

export class PageElementListWait<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> extends PageNodeWait<Store, ListType> {

  // waits until list has given length
  hasLength( length: number, {
    timeout = this._node.getTimeout(),
    comparator = Workflo.Comparator.equalTo,
    interval = this._node.getInterval(),
    reverse
  }: IPageElementListWaitLengthReverseParams = {}) {
    const notStr = (reverse) ? 'not ' : ''

    return this._node.__waitUntil(
        () => {
          if (reverse) {
            return !this._node.currently.hasLength(length, comparator)
          } else {
            return this._node.currently.hasLength(length, comparator)
          }
        },
        () => `: Length never ${notStr}became${comparatorStr(comparator)} ${length}`,
        timeout,
        interval
    )
  }

  isEmpty({
    timeout = this._node.getTimeout(),
    interval = this._node.getInterval(),
    reverse
  } : IPageElementListWaitEmptyReverseParams = {}) {
    const notStr = (reverse) ? 'not ' : ''

    return this._node.__waitUntil(
      () => {
        if (reverse) {
          return this._node.currently.not.isEmpty()
        } else {
          return this._node.currently.isEmpty()
        }
      },
      () => ` never ${notStr}became empty`,
      timeout,
      interval
    )
  }

  get any() {
    return this._node.currently.first.wait as any as PageElementType['wait']
  }

  // Typescript has a bug that prevents Exclude from working with generic extended types:
  // https://github.com/Microsoft/TypeScript/issues/24791
  // Bug will be fixed in Typescript 3.3.0
  // get any() {
  //   return excludeNot(this._list.currently.first.wait)
  // }

  get none(): PageElementType['wait']['not'] {
    return this._node.currently.first.wait.not
  }

  exists(opts: Workflo.ITimeout & {filterMask?: boolean} = {}) {
    const {filterMask, ...otherOpts} = opts

    if (filterMask !== false) {
      this.not.isEmpty(otherOpts)
    }

    return this._node
  }

  isVisible(opts: Workflo.ITimeout & Workflo.PageNode.IListFilterMask = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait(this._node.all, element => element.wait.isVisible(otherOpts), filterMask, true)
  }

  isEnabled(opts: Workflo.ITimeout & Workflo.PageNode.IListFilterMask = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait(this._node.all, element => element.wait.isEnabled(otherOpts), filterMask, true)
  }

  hasText(text: string | string[], opts?: Workflo.ITimeoutInterval) {
    return this._node.eachWait(
      this._node.all, (element, expected) => element.wait.hasText(expected, opts), text,
    )
  }

  hasAnyText(opts: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait(
      this._node.all, (element) => element.wait.hasAnyText(otherOpts), filterMask, true
    )
  }

  containsText(text: string | string[], opts?: Workflo.ITimeoutInterval) {
    return this._node.eachWait(
      this._node.all, (element, expected) => element.wait.containsText(expected, opts), text,
    )
  }

  hasDirectText(directText: string | string[], opts?: Workflo.ITimeoutInterval) {
    return this._node.eachWait(
      this._node.all, (element, expected) => element.wait.hasDirectText(expected, opts), directText,
    )
  }

  hasAnyDirectText(opts: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait(
      this._node.all, (element) => element.wait.hasAnyDirectText(otherOpts), filterMask, true
    )
  }

  containsDirectText(directText: string | string[], opts?: Workflo.ITimeoutInterval) {
    return this._node.eachWait(
      this._node.all, (element, expected) => element.wait.containsDirectText(expected, opts), directText,
    )
  }

  get not() {
    return {
      isEmpty: (opts: Workflo.ITimeoutInterval = {}) => this.isEmpty({
        timeout: opts.timeout, interval: opts.interval, reverse: true
      }),
      hasLength: (
        length: number, opts: IPageElementListWaitLengthParams = {}
      ) => this.hasLength(length, {
        timeout: opts.timeout, interval: opts.interval, reverse: true
      }),
      exists: (opts: Workflo.ITimeout & {filterMask?: boolean} = {}) => {
        const {filterMask, ...otherOpts} = opts

        if (filterMask !== false) {
          this.isEmpty(otherOpts)
        }

        return this._node
      },
      isVisible: (opts: Workflo.ITimeout & Workflo.PageNode.IListFilterMask = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait(this._node.all, element => element.wait.not.isVisible(otherOpts), filterMask, true)
      },
      isEnabled: (opts: Workflo.ITimeout & Workflo.PageNode.IListFilterMask = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait(this._node.all, element => element.wait.not.isEnabled(otherOpts), filterMask, true)
      },
      hasText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachWait(
          this._node.all, (element, expected) => element.wait.not.hasText(expected, opts), text
        )
      },
      hasAnyText: (opts: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait(
          this._node.all, (element) => element.wait.not.hasAnyText(otherOpts), filterMask, true
        )
      },
      containsText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachWait(
          this._node.all, (element, expected) => element.wait.not.containsText(expected, opts), text
        )
      },
      hasDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachWait(
          this._node.all, (element, expected) => element.wait.not.hasDirectText(expected, opts), directText
        )
      },
      hasAnyDirectText: (opts: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait(
          this._node.all, (element) => element.wait.not.hasAnyDirectText(otherOpts), filterMask, true
        )
      },
      containsDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachWait(
          this._node.all, (element, expected) => element.wait.not.containsDirectText(expected, opts), directText
        )
      }
    }
  }
}

export class PageElementListEventually<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> extends PageNodeEventually<Store, ListType> {

  // Typescript has a bug that prevents Exclude from working with generic extended types:
  // https://github.com/Microsoft/TypeScript/issues/24791
  // Bug will be fixed in Typescript 3.3.0
  // get any() {
  //   return excludeNot(this._list.currently.first.eventually)
  // }

  get any() {
    return this._node.currently.first.eventually as any as PageElementType['eventually']
  }

  get none(): PageElementType['eventually']['not'] {
    return this._node.currently.first.eventually.not
  }

  hasLength( length: number, {
    timeout = this._node.getTimeout(),
    comparator = Workflo.Comparator.equalTo,
    interval = this._node.getInterval(),
    reverse
  }: IPageElementListWaitLengthReverseParams = {} ) {
    return this._node.__eventually(
      () => this._node.wait.hasLength( length, { timeout, comparator, interval, reverse } )
    )
  }

  isEmpty({
    timeout = this._node.getTimeout(),
    interval = this._node.getInterval(),
    reverse
  }: IPageElementListWaitEmptyReverseParams = {}) {
    return this._node.__eventually( () => this._node.wait.isEmpty( { timeout, interval, reverse } ) )
  }

  exists(opts: Workflo.ITimeout & {filterMask?: boolean} = {}) {
    const {filterMask, ...otherOpts} = opts

    if (filterMask === false) {
      return true
    } else {
      return this.not.isEmpty(otherOpts)
    }
  }

  isVisible(opts: Workflo.ITimeout & Workflo.PageNode.IListFilterMask = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck(this._node.all, element => element.eventually.isVisible(otherOpts), filterMask, true)
  }

  isEnabled(opts: Workflo.ITimeout & Workflo.PageNode.IListFilterMask = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck(this._node.all, element => element.eventually.isEnabled(otherOpts), filterMask, true)
  }

  hasText(text: string | string[], opts?: Workflo.ITimeoutInterval) {
    return this._node.eachCheck(
      this._node.all, (element, expected) => element.eventually.hasText(expected, opts), text
    )
  }

  hasAnyText(opts: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck(
      this._node.all, (element) => element.eventually.hasAnyText(otherOpts), filterMask, true
    )
  }

  containsText(text: string | string[], opts?: Workflo.ITimeoutInterval) {
    return this._node.eachCheck(
      this._node.all, (element, expected) => element.eventually.containsText(expected, opts), text
    )
  }

  hasDirectText(directText: string | string[], opts?: Workflo.ITimeoutInterval) {
    return this._node.eachCheck(
      this._node.all, (element, expected) => element.eventually.hasDirectText(expected, opts), directText
    )
  }

  hasAnyDirectText(opts: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck(
      this._node.all, (element) => element.eventually.hasAnyDirectText(otherOpts), filterMask, true
    )
  }

  containsDirectText(directText: string | string[], opts?: Workflo.ITimeoutInterval) {
    return this._node.eachCheck(
      this._node.all, (element, expected) => element.eventually.containsDirectText(expected, opts), directText
    )
  }

  get not() {
    return {
      isEmpty: (opts: Workflo.ITimeoutInterval = {}) => this.isEmpty({
        timeout: opts.timeout, interval: opts.interval, reverse: true
      }),
      hasLength: (length: number, opts: IPageElementListWaitLengthParams = {}) => this.hasLength(length, {
        timeout: opts.timeout, interval: opts.interval, reverse: true
      }),
      exists: (opts: Workflo.ITimeout & {filterMask?: boolean} = {}) => {
        const {filterMask, ...otherOpts} = opts

        if (filterMask === false) {
          return true
        } else {
          return this.isEmpty(otherOpts)
        }
      },
      isVisible: (opts: Workflo.ITimeout & Workflo.PageNode.IListFilterMask = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck(
          this._node.all, element => element.eventually.not.isVisible(otherOpts), filterMask, true
        )
      },
      isEnabled: (opts: Workflo.ITimeout & Workflo.PageNode.IListFilterMask = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck(
          this._node.all, element => element.eventually.not.isEnabled(otherOpts), filterMask, true
        )
      },
      hasText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachCheck(
          this._node.all, (element, expected) => element.eventually.not.hasText(expected, opts), text
        )
      },
      hasAnyText: (opts: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck(
          this._node.all, (element) => element.eventually.not.hasAnyText(otherOpts), filterMask, true
        )
      },
      containsText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachCheck(
          this._node.all, (element, expected) => element.eventually.not.containsText(expected, opts), text
        )
      },
      hasDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachCheck(
          this._node.all, (element, expected) => element.eventually.not.hasDirectText(expected, opts), directText
        )
      },
      hasAnyDirectText: (opts: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck(
          this._node.all, (element) => element.eventually.not.hasAnyDirectText(otherOpts), filterMask, true
        )
      },
      containsDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachCheck(
          this._node.all, (element, expected) => element.eventually.not.containsDirectText(expected, opts), directText
        )
      }
    }
  }
}