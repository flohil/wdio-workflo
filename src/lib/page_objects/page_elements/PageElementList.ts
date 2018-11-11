import { compare, comparatorStr } from '../../utility_functions/util'
import {
  PageNode,
  IPageNodeOpts,
  PageElement,
  IPageElementWaitAPI,
  IPageElementWaitNotAPI,
  IPageElementEventuallyAPI,
  IPageElementEventuallyNotAPI
} from '.'
import { PageElementStore } from '../stores'
import { ListWhereBuilder } from '../builders'
import { DEFAULT_TIMEOUT } from '../'

export type WdioElements = WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>

export interface IPageElementListIdentifier<
  Store extends PageElementStore,
  ElementType extends PageElement<Store>
> {
  mappingObject: {[key: string] : string},
  func: ( element: ElementType ) => string
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
  PageElementOptions
> extends IPageNodeOpts<Store> {
  waitType?: Workflo.WaitType
  timeout?: number
  interval?: number
  disableCache?: boolean
  elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  elementOptions: PageElementOptions
  identifier?: IPageElementListIdentifier<Store, PageElementType>
}

export interface IPageElementListRetrievalAPI<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
> {
  elements: WdioElements,
  first: PageElementType,
  at: (index: number) => PageElementType,
  all: PageElementType[],
  getLength: () => number
}

export interface IPageElementListWaitAPI<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions
> {
  hasLength: ( length: number, opts?:  IPageElementListWaitLengthReverseParams ) => PageElementList<Store, PageElementType, PageElementOptions>
  isEmpty: ( opts?: IPageElementListWaitLengthReverseParams ) => PageElementList<Store, PageElementType, PageElementOptions>
  any: Omit<IPageElementWaitAPI<Store>, 'not'>
  none: IPageElementWaitNotAPI<Store>
  not: {
    hasLength: ( length: number, opts?:  IPageElementListWaitLengthParams ) => PageElementList<Store, PageElementType, PageElementOptions>
    isEmpty: ( opts?: IPageElementListWaitEmptyParams ) => PageElementList<Store, PageElementType, PageElementOptions>
  }
}

export interface IPageElementListEventuallyAPI<
  Store extends PageElementStore
> {
  hasLength: ( length: number, opts?:  IPageElementListWaitLengthParams ) => boolean
  isEmpty: ( opts?: IPageElementListWaitEmptyParams ) => boolean
  any: Omit<IPageElementEventuallyAPI<Store>, 'not'>
  none: IPageElementEventuallyNotAPI<Store>
  not: {
    hasLength: ( length: number, opts?:  IPageElementListWaitLengthParams ) => boolean
    isEmpty: ( opts?: IPageElementListWaitEmptyParams ) => boolean
  }
}

export interface IPageElementListCurrentlyAPI<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> extends IPageElementListRetrievalAPI<Store, PageElementType> {
  lastActualResult: string
  where: ListWhereBuilder<Store, PageElementType, PageElementOptions, ListType>
  isEmpty: () => boolean
  hasLength: ( length: number, comparator?: Workflo.Comparator ) => boolean
  not: {
    isEmpty: () => boolean
    hasLength: ( length: number, comparator?: Workflo.Comparator ) => boolean
  }
}

// holds several PageElement instances of the same type
export class PageElementList<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions
> extends PageNode<Store> implements IPageElementListRetrievalAPI<Store, PageElementType> {
  protected _waitType: Workflo.WaitType
  protected _timeout: number
  protected _interval: number
  protected _disableCache: boolean
  protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  protected _elementOptions: PageElementOptions
  protected _identifier: IPageElementListIdentifier<Store, PageElementType>
  protected _identifiedObjCache: {[key: string] : {[key: string] : PageElementType}}
  protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOptions, this>
  protected _cloneFunc: (subSelector: string) => this
  protected _lastActualResult: string

  readonly currently: IPageElementListCurrentlyAPI<Store, PageElementType, PageElementOptions, this>
  readonly wait: IPageElementListWaitAPI<Store, PageElementType, PageElementOptions>
  readonly eventually: IPageElementListEventuallyAPI<Store>

  constructor(
    protected _selector: string,
    opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>,
    cloneFunc: <T extends PageElementList<
      Store,
      PageElementType,
      PageElementOptions
    >>(selector: Workflo.XPath) => T
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

    this._cloneFunc = cloneFunc

    this._whereBuilder = new ListWhereBuilder(this._selector, {
      store: this._store,
      elementStoreFunc: this._elementStoreFunc,
      elementOptions: this._elementOptions,
      cloneFunc: this._cloneFunc,
      getAllFunc: list => list.all
    })

    this.currently = new Currently<Store, PageElementType, PageElementOptions, this>(this, opts, cloneFunc)
    this.wait = new Wait<Store, PageElementType, PageElementOptions, this>(this)
    this.eventually = new Eventually<Store, PageElementType, PageElementOptions, this>(this, this._eventually)
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

  initialWait() {
    switch(this._waitType) {
      case Workflo.WaitType.exist:
      this.wait.any.exists()
      break
      case Workflo.WaitType.visible:
      this.wait.any.isVisible()
      break
      case Workflo.WaitType.value:
      this.wait.any.hasAnyValue()
      break
      case Workflo.WaitType.text:
      this.wait.any.hasAnyText()
      break
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
  at = ( index: number ) => this.where.getAt( index )

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
   * are needed, use get() or| firstBy() instead.
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

  getLength() {
    try {
      const value = this.elements.value

      if (value && value.length) {
        return value.length
      }
    } catch(error) {
      // this.elements will throw error if no elements were found
      return 0
    }
  }

  getTimeout() {
    return this._timeout
  }

  getInterval() {
    return this._interval
  }
}

class Currently<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> implements IPageElementListCurrentlyAPI<Store, PageElementType, PageElementOptions, ListType> {

  protected _selector: string
  protected _store: Store
  protected _elementOptions: PageElementOptions
  protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOptions, ListType>
  protected _lastActualResult: string
  protected _list: ListType

  constructor(
    list: ListType,
    opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>,
    cloneFunc: (selector: Workflo.XPath) => ListType
  ) {
    this._selector = list.getSelector()
    this._store = opts.store
    this._elementOptions = opts.elementOptions
    this._elementStoreFunc = opts.elementStoreFunc

    this._whereBuilder = new ListWhereBuilder(this._selector, {
      store: this._store,
      elementStoreFunc: this._elementStoreFunc,
      elementOptions: this._elementOptions,
      cloneFunc: cloneFunc,
      getAllFunc: list => list.currently.all
    })

    this._list = list
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
  at = ( index: number ) => this.where.getAt( index )

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
      }
    } catch(error) {
      // this.elements will throw error if no elements were found
      return 0
    }
  }

// CHECK STATE FUNCTIONS

  isEmpty = () => !browser.isExisting(this._selector)

  hasLength = (
    length: number, comparator: Workflo.Comparator = Workflo.Comparator.equalTo
  ) => {
    const actualLength = this.getLength()

    this._lastActualResult = actualLength.toString()

    return compare(actualLength, length, comparator)
  }

  not = {
    isEmpty: () => !this.isEmpty(),
    hasLength: (
      length: number, comparator: Workflo.Comparator = Workflo.Comparator.equalTo
    ) => !this.hasLength(length, comparator)
  }
}

class Wait<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> implements IPageElementListWaitAPI<Store, PageElementType, PageElementOptions>{

  protected _list: ListType

  constructor(list: ListType) {
    this._list = list
  }

  // waits until list has given length
  hasLength = ( length: number, {
    timeout = this._list.getTimeout(),
    comparator = Workflo.Comparator.equalTo,
    interval = this._list.getInterval(),
    reverse
  }: IPageElementListWaitLengthReverseParams = {}) => {
    browser.waitUntil(
      () => {
        if (reverse) {
          return !this._list.currently.hasLength(length, comparator)
        } else {
          return this._list.currently.hasLength(length, comparator)
        }
      },
    timeout, `${this.constructor.name}: Length never became${comparatorStr(comparator)} ${length}.\n( ${this._list.getSelector()} )`, interval )

    return this._list
  }

  isEmpty = ({
    timeout = this._list.getTimeout(),
    interval = this._list.getInterval(),
    reverse
  } : IPageElementListWaitEmptyReverseParams = {}) => {
    browser.waitUntil(
      () => {
        if (reverse) {
          return !this._list.currently.isEmpty()
        } else {
          return this._list.currently.isEmpty()
        }
      },
    timeout, `${this.constructor.name} never became empty.\n( ${this._list.getSelector()} )`, interval)

    return this._list
  }

  get any() : Omit<IPageElementWaitAPI<Store>, 'not'> {
    const element = this._list.currently.first
    const wait = Object.assign({}, element.wait)

    delete wait.not

    return wait
  }

  get none() : IPageElementWaitNotAPI<Store> {
    return this._list.currently.first.wait.not
  }

  not = {
    isEmpty: (opts: IPageElementListWaitEmptyParams) => this.isEmpty({
      timeout: opts.timeout, interval: opts.interval, reverse: true
    }),
    hasLength: (
      length: number, opts?:  IPageElementListWaitLengthParams
    ) => this.hasLength(length, {
      timeout: opts.timeout, interval: opts.interval, reverse: true
    })
  }
}

class Eventually<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> implements IPageElementListEventuallyAPI<Store>{

  protected _list: ListType
  protected _eventually: (func: () => void) => boolean

  constructor(list: ListType, eventually: (func: () => void) => boolean) {
    this._list = list
    this._eventually = eventually
  }

  hasLength = ( length: number, {
    timeout = this._list.getTimeout(),
    comparator = Workflo.Comparator.equalTo,
    interval = this._list.getInterval(),
    reverse
  }: IPageElementListWaitLengthReverseParams = {} ) => {
    return this._eventually( () => this._list.wait.hasLength( length, { timeout, comparator, interval, reverse } ) )
  }

  isEmpty = ({
    timeout = this._list.getTimeout(),
    interval = this._list.getInterval(),
    reverse
  }: IPageElementListWaitEmptyReverseParams = {}) => {
    return this._eventually( () => this._list.wait.isEmpty( { timeout, interval, reverse } ) )
  }

  get any(): Omit<IPageElementEventuallyAPI<Store>, 'not'> {
    const element = this._list.currently.first
    const eventually = Object.assign({}, element.eventually)

    delete eventually.not

    return eventually
  }

  get none(): IPageElementEventuallyNotAPI<Store> {
    return this._list.currently.first.eventually.not
  }

  not = {
    isEmpty: (opts: IPageElementListWaitEmptyParams) => this.isEmpty({
      timeout: opts.timeout, interval: opts.interval, reverse: true
    }),
    hasLength: (length: number, opts: IPageElementListWaitLengthParams) => this.hasLength(length, {
      timeout: opts.timeout, interval: opts.interval, reverse: true
    })
  }
}