import * as _ from 'lodash'

import { compare, comparatorStr } from '../../utility_functions/util'
import {
  PageNode,
  IPageNodeOpts,
  PageElement,
  IPageElementOpts
} from '.'
import { PageElementStore } from '../stores'
import { ListWhereBuilder } from '../builders'
import { DEFAULT_TIMEOUT } from '../'
import { isArray } from 'util';

export type WdioElements = WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>

export interface IPageElementListIdentifier<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>
> {
  mappingObject: {[key: string] : string},
  func: ( element: PageElementType ) => string
}

export interface IPageElementListWaitEmptyParams extends Workflo.IWDIOParamsOptional {
  interval?: number,
}

export interface IPageElementListWaitEmptyReverseParams extends IPageElementListWaitEmptyParams {
  reverse?: boolean,
}

export interface IPageElementListWaitLengthParams extends IPageElementListWaitEmptyParams {
  comparator?: Workflo.Comparator,
}

export interface IPageElementListWaitLengthReverseParams extends IPageElementListWaitLengthParams {
  reverse?: boolean,
}

// use disableCache for a "dynamic" list whose structure changes over time
// alternatively, call refresh() when the times of structure changes are known
export interface IPageElementListOpts<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>
> extends IPageNodeOpts<Store> {
  elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  elementOptions: PageElementOptions
  waitType?: Workflo.WaitType
  timeout?: number
  interval?: number
  disableCache?: boolean
  identifier?: IPageElementListIdentifier<Store, PageElementType>
}

// holds several PageElement instances of the same type
export class PageElementList<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
> extends PageNode<Store>
implements Workflo.PageNode.IGetTextNode<string[]> {

  protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  protected _elementOptions: PageElementOptions
  protected _waitType: Workflo.WaitType

  protected _timeout: number
  protected _interval: number
  protected _disableCache: boolean
  protected _identifier: IPageElementListIdentifier<Store, PageElementType>
  protected _identifiedObjCache: {[key: string] : {[key: string] : PageElementType}}
  protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOptions, this>
  protected _lastDiff: Workflo.PageNode.IDiff

  readonly currently: PageElementListCurrently<
    Store, PageElementType, PageElementOptions, this
  >
  readonly wait: PageElementListWait<
    Store, PageElementType, PageElementOptions, this
  >
  readonly eventually: PageElementListEventually<
    Store, PageElementType, PageElementOptions, this
  >

  constructor(
    protected _selector: string,
    opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>
  ) {
    super(_selector, opts)

    this._waitType = opts.waitType || Workflo.WaitType.visible
    this._timeout = opts.timeout || JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || DEFAULT_TIMEOUT
    this._disableCache = opts.disableCache || false

    this._selector = _selector
    this._elementOptions = opts.elementOptions
    this._elementStoreFunc = opts.elementStoreFunc
    this._identifier = opts.identifier
    this._identifiedObjCache = {}
    this._interval = opts.interval || 500

    this.currently = new PageElementListCurrently<
      Store, PageElementType, PageElementOptions, this
    >(this, opts)
    this.wait = new PageElementListWait<
      Store, PageElementType, PageElementOptions, this
    >(this)
    this.eventually = new PageElementListEventually<
      Store, PageElementType, PageElementOptions, this
    >(this)
  }

  /**
   * Use this method to initialize properties that rely on the this type
   * which is not available in the constructor.
   *
   * Make sure that this method is invoked immediatly after construction.
   *
   * @param cloneFunc
   */
  init(cloneFunc: (selector: Workflo.XPath) => this) {
    this._whereBuilder = new ListWhereBuilder(this._selector, {
      store: this._store,
      elementStoreFunc: this._elementStoreFunc,
      elementOptions: this._elementOptions,
      cloneFunc: cloneFunc,
      getAllFunc: list => list.all
    })

    this.currently.init(cloneFunc)
  }

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

  get elements() {
    this.initialWait()

    return browser.elements( this._selector )
  }

  get where() {
    this.initialWait()

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

  setIdentifier(identifier: IPageElementListIdentifier<Store, PageElementType>) {
    this._identifier = identifier

    return this
  }

  /**
   * Returns an object consisting of this._identifier.object's keys
   * as keys and the elements mapped by this._identifier.func()
   * as values.
   *
   * If this.identifier is undefined, the mapped object's keys will be defined
   * by the index of an element's occurence in the element list (first element -> 0, seconed element -> 1...)
   *
   * If cached option is set to true, returns cached identified elements object
   * if it exists and otherwise fetches new identified elements object.
   * Per default, returns a cached version of this identifier was already
   * used unless resetCache is set to true.
   * This means that the returned structure of the list may reflect an earlier state,
   * while its contents are still guaranteed to be refreshed on each access!
   *
   * Attention: this may take a long time, try to avoid: if only single elements of list
   * are needed, use get() or where instead.
   **/
  identify(
    {identifier = this._identifier, resetCache = false}:
    {identifier?: IPageElementListIdentifier<Store, PageElementType>, resetCache?: boolean} = {}
  ) {
    const cacheKey = (identifier) ? `${identifier.mappingObject.toString()}|||${identifier.func.toString()}` : 'index'

    if (this._disableCache || resetCache || !(cacheKey in this._identifiedObjCache)) {
      const listElements = this.all

      const mappedObj: {[key: string] : PageElementType} = {}

      if (identifier) { // manually set identifier
        const queryResults: {[key:string]:PageElementType} = {}

        // create hash where result of identifier func is key
        // and list element is value
        listElements.forEach(
          ( element ) => {
            const resultKey = identifier.func( element )
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

  getTimeout() {
    return this._timeout
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

  getText() {
    return this.eachGet(this.all, element => element.getText())
  }

  // HELPER FUNCTIONS

  // context
  eachCheck<T>(
    elements: PageElementType[],
    expected: T | T[],
    checkFunc: (element: PageElementType, expected?: T) => boolean,
  ): boolean {
    const diffs: Workflo.PageNode.IDiffTree = {}

    if (isArray(expected) && expected.length !== elements.length) {
      throw new Error(
        `${this.constructor.name}: ` +
        `Length of expected (${expected.length}) did not match length of list (${elements.length})!`
      )
    }

    for (let i = 0; i < elements.length; ++i) {
      const _expected: T = isArray(expected) ? expected[i] : expected
      const element = elements[i]

      if (!checkFunc(element, _expected)) {
        diffs[`[${i + 1}]`] = element.__lastDiff
      }
    }

    this._lastDiff = {
      tree: diffs
    }

    return Object.keys(diffs).length === 0
  }

  eachGet<T>(
    elements: PageElementType[],
    getFunc: (element: PageElementType) => T
  ): T[] {
    return elements.map(element => getFunc(element))
  }

  // perform initial wait to make sure list elements are loaded
  eachWait<T>(
    elements: PageElementType[],
    expected: T | T[],
    waitFunc: (element: PageElementType, expected: T) => PageElementType,
  ): this {
    if (isArray(expected) && expected.length !== elements.length) {
      throw new Error(
        `${this.constructor.name}: ` +
        `Length of expected (${expected.length}) did not match length of list (${elements.length})!`
      )
    }

    for (let i = 0; i < elements.length; ++i) {
      const _expected: T = isArray(expected) ? expected[i] : expected
      const element = elements[i]

      waitFunc(element, _expected)
    }

    return this
  }
}

export class PageElementListCurrently<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> {

  protected readonly _node: ListType

  protected _selector: string
  protected _store: Store
  protected _elementOptions: PageElementOptions
  protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOptions, ListType>
  protected _lastDiff: Workflo.PageNode.IDiff

  constructor(
    node: ListType,
    opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>,
  ) {
    this._selector = node.getSelector()
    this._store = opts.store
    this._elementOptions = opts.elementOptions
    this._elementStoreFunc = opts.elementStoreFunc

    this._node = node
  }

  /**
   * Use this method to initialize properties that rely on the this type
   * which is not available in the constructor.
   *
   * Make sure that this method is invoked immediatly after construction.
   *
   * @param cloneFunc
   */
  init(cloneFunc: (selector: Workflo.XPath) => ListType) {
    this._whereBuilder = new ListWhereBuilder(this._selector, {
      store: this._store,
      elementStoreFunc: this._elementStoreFunc,
      elementOptions: this._elementOptions,
      cloneFunc: cloneFunc,
      getAllFunc: list => list.all
    })
  }

  /**
   * Whenever a function that checks the state of the GUI
   * by comparing an expected result to an actual result is called,
   * the actual and expected result and selector will be stored in 'lastDiff'.
   *
   * This can be useful to determine why the last invocation of such a function returned false.
   *
   * These "check-GUI-state functions" include all hasXXX, hasAnyXXX and containsXXX functions
   * defined in the .currently, .eventually and .wait API of PageElement.
   */
  get __lastDiff(): Workflo.PageNode.IDiff {
    return _.merge(this._lastDiff, {selector: this._node.getSelector()})
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

  getText() {
    return this._node.eachGet(this.all, element => element.currently.getText())
  }

// CHECK STATE FUNCTIONS

  isEmpty() {
    return !browser.isExisting(this._selector)
  }

  hasLength(
    length: number, comparator: Workflo.Comparator = Workflo.Comparator.equalTo
  ) {
    const actualLength = this.getLength()

    this._lastDiff = {
      actual: actualLength.toString()
    }

    return compare(actualLength, length, comparator)
  }

  hasText(text: string | string[]) {
    return this._node.eachCheck(this.all, text, (element, expected) => element.currently.hasText(expected))
  }

  containsText(text: string | string[]) {
    return this._node.eachCheck(this.all, text, (element, expected) => element.currently.containsText(expected))
  }

  not = {
    isEmpty: () => !this.isEmpty(),
    hasLength: (
      length: number, comparator: Workflo.Comparator = Workflo.Comparator.equalTo
    ) => !this.hasLength(length, comparator),
    hasText: (text: string | string[]) => {
      return this._node.eachCheck(this.all, text, (element, expected) => element.currently.not.hasText(expected))
    },
    containsText: (text: string | string[]) => {
      return this._node.eachCheck(this.all, text, (element, expected) => element.currently.not.containsText(expected))
    }
  }
}

export class PageElementListWait<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> {

  protected readonly _node: ListType

  constructor(node: ListType) {
    this._node = node
  }

  // waits until list has given length
  hasLength( length: number, {
    timeout = this._node.getTimeout(),
    comparator = Workflo.Comparator.equalTo,
    interval = this._node.getInterval(),
    reverse
  }: IPageElementListWaitLengthReverseParams = {}) {
    browser.waitUntil(
      () => {
        if (reverse) {
          return !this._node.currently.hasLength(length, comparator)
        } else {
          return this._node.currently.hasLength(length, comparator)
        }
      },
    timeout, `${this.constructor.name}: Length never became${comparatorStr(comparator)} ${length}.\n( ${this._node.getSelector()} )`, interval )

    return this._node
  }

  isEmpty({
    timeout = this._node.getTimeout(),
    interval = this._node.getInterval(),
    reverse
  } : IPageElementListWaitEmptyReverseParams = {}) {
    browser.waitUntil(
      () => {
        if (reverse) {
          return !this._node.currently.isEmpty()
        } else {
          return this._node.currently.isEmpty()
        }
      },
    timeout, `${this.constructor.name} never became empty.\n( ${this._node.getSelector()} )`, interval)

    return this._node
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

  hasText(text: string | string[], opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait(
      this._node.all, text, (element, expected) => element.wait.hasText(expected, opts),
    )
  }

  containsText(text: string | string[], opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait(
      this._node.all, text, (element, expected) => element.wait.containsText(expected, opts)
    )
  }

  not = {
    isEmpty: (opts: IPageElementListWaitEmptyParams) => this.isEmpty({
      timeout: opts.timeout, interval: opts.interval, reverse: true
    }),
    hasLength: (
      length: number, opts?:  IPageElementListWaitLengthParams
    ) => this.hasLength(length, {
      timeout: opts.timeout, interval: opts.interval, reverse: true
    }),
    hasText: (text: string | string[], opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait(
        this._node.all, text, (element, expected) => element.wait.not.hasText(expected, opts)
      )
    },
    containsText: (text: string | string[], opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait(
        this._node.all, text, (element, expected) => element.wait.not.containsText(expected, opts)
      )
    }
  }
}

export class PageElementListEventually<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> {

  protected readonly _node: ListType

  constructor(node: ListType) {
    this._node = node
  }

  protected _eventually(func: () => void) : boolean {
    try {
      func();
      return true;
    } catch (error) {
      return false;
    }
  }

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
    return this._eventually( () => this._node.wait.hasLength( length, { timeout, comparator, interval, reverse } ) )
  }

  isEmpty({
    timeout = this._node.getTimeout(),
    interval = this._node.getInterval(),
    reverse
  }: IPageElementListWaitEmptyReverseParams = {}) {
    return this._eventually( () => this._node.wait.isEmpty( { timeout, interval, reverse } ) )
  }

  hasText(text: string | string[], opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck(
      this._node.all, text, (element, expected) => element.eventually.hasText(expected, opts)
    )
  }

  containsText(text: string | string[], opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck(
      this._node.all, text, (element, expected) => element.eventually.containsText(expected, opts)
    )
  }

  not = {
    isEmpty: (opts: IPageElementListWaitEmptyParams) => this.isEmpty({
      timeout: opts.timeout, interval: opts.interval, reverse: true
    }),
    hasLength: (length: number, opts: IPageElementListWaitLengthParams) => this.hasLength(length, {
      timeout: opts.timeout, interval: opts.interval, reverse: true
    }),
    hasText: (text: string | string[], opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck(
        this._node.all, text, (element, expected) => element.eventually.not.hasText(expected, opts)
      )
    },
    containsText: (text: string | string[], opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck(
        this._node.all, text, (element, expected) => element.eventually.not.containsText(expected, opts)
      )
    }
  }
}