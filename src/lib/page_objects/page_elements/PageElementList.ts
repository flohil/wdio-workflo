import { compare } from '../../utility_functions/util'
import {
  PageNode,
  IPageNodeOpts,
  PageElement,
  IPageElementWaitAPI,
  IPageElementWaitNotAPI,
  IPageElementEventuallyAPI,
  IPageElementEventuallyNotAPI
} from '.'
import { PageElementStore, CloneFunc } from '../stores'
import { ListWhereBuilder } from '../builders'

export interface IPageElementListIdentifier<
  Store extends PageElementStore,
  ElementType extends PageElement<Store>
> {
  mappingObject: {[key: string] : string},
  func: ( element: ElementType ) => string
}

export interface IPageElementListWaitEmptyParams extends Workflo.WDIOParamsOptional {
  interval?: number
}

export interface IPageElementListWaitLengthParams extends IPageElementListWaitEmptyParams {
  comparator?: Workflo.Comparator,
}

// use disableCache for a "dynamic" list whose structure changes over time
// alternatively, call refresh() when the times of structure changes are known
export interface IPageElementListOpts<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions
> extends IPageNodeOpts<Store> {
  waitType?: Workflo.WaitType,
  timeout?: number,
  interval?: number,
  disableCache?: boolean,
  elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType,
  elementOptions: PageElementOptions
  identifier?: IPageElementListIdentifier<Store, PageElementType>
}

export interface IPageElementListWaitAPI<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions
> {
  hasLength: ( length: number, opts?:  IPageElementListWaitLengthParams ) => PageElementList<Store, PageElementType, PageElementOptions>
  isEmpty: ( opts?: IPageElementListWaitEmptyParams ) => PageElementList<Store, PageElementType, PageElementOptions>
  any: Omit<IPageElementWaitAPI<Store>, 'not'>
  none: IPageElementWaitNotAPI<Store>
}

export interface IPageElementListEventuallyAPI<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions
> {
  hasLength: ( length: number, opts?:  IPageElementListWaitLengthParams ) => boolean
  isEmpty: ( opts?: IPageElementListWaitEmptyParams ) => boolean
  any: Omit<IPageElementEventuallyAPI<Store>, 'not'>
  none: IPageElementEventuallyNotAPI<Store>
}

// holds several PageElement instances of the same type
export class PageElementList<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions
> extends PageNode<Store> {
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
    this._timeout = opts.timeout || JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default
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
      cloneFunc: this._cloneFunc
    })
  }

  get _elements() {
    return browser.elements( this._selector )
  }

  get elements() {
    this.initialWait()

    return this._elements
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

  // Retrieves list of elements identified by this.selector
  // which reflect browser state after first element is found.
  //
  // Waits for at least one element to reach the waiting condition defined
  // in wait type.


  // Todo add _listElements() that does not wait for wait type condition for all elements

  // Returns elements matching list selector that reflect current browser state
  // -> no implicit waiting!!!
  // does not use cache
  get _listElements() {
    const elements: PageElementType[] = []

    const value = this._elements.value

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


  // wait until at least one element satisfies the initial wait condition
  get listElements() {
    const elements: PageElementType[] = []

    try {
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
    } catch(error) {
      // this.elements will throw error if no elements were found
      return elements
    }
  }

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
      const listElements = this.listElements

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

  get where() {
    return this._whereBuilder.reset()
  }

  // TEMPORARY GET FUNCTIONS - NEWLY EVALUATED ON EACH CALL

/**
 * Returns the first page element found in the DOM that matches the list selector.
 */
  get first() {
    return this.where.getFirst()
  }

  /**
   *
   * @param index starts at 0
   */
  at( index: number ) {
    return this.where.getAt( index )
  }

  /**
   * Returns all page elements found in the DOM that match the list selector.
   */
  get all() {
    return this.listElements
  }

  /**
   * Returns the number of page elements found in the DOM that match the list selector.
   */
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

  isEmpty() {
    return !browser.isExisting(this._selector)
  }

  // WAIT FUNCTION

  public get wait(): IPageElementListWaitAPI<Store, PageElementType, PageElementOptions> {
    return {
      hasLength: this._waitHasLength,
      isEmpty: this._waitEmpty,
      any: this._anyWait,
      none: this._noneWait
    }
  }

  // waits until list has given length
  private _waitHasLength = ( length: number, {
    timeout = this._timeout,
    comparator = Workflo.Comparator.equalTo,
    interval = this._interval
  }: IPageElementListWaitLengthParams) => {
    browser.waitUntil(
      () => {
        let value = this._elements.value

        if (!value || !value.length) {
          return false
        } else {
          return compare(value.length, length, comparator)
        }
      },
    timeout, `${this.constructor.name}: Length never became ${comparator.toString()} ${length}.\n( ${this._selector} )`, interval )

    return this
  }

  private _waitEmpty = ({
    timeout = this._timeout,
    interval = this._interval
  } : IPageElementListWaitEmptyParams ) => {
    browser.waitUntil(() => {
      return !browser.isExisting(this._selector)
    }, timeout, `${this.constructor.name} never became empty.\n( ${this._selector} )`, interval)

    return this
  }

  private get _anyWait() : Omit<IPageElementWaitAPI<Store>, 'not'> {
    const element = this.first
    const wait = Object.assign({}, element.wait)

    delete wait.not

    return wait
  }

  private get _noneWait() : IPageElementWaitNotAPI<Store> {
    return this.first.wait.not
  }

  // EVENTUALLY

  public get eventually() : IPageElementListEventuallyAPI<Store, PageElementType, PageElementOptions> {
    return {
      hasLength: this._eventuallyHasLength,
      isEmpty: this._eventuallyIsEmpty,
      any: this._anyEventually,
      none: this._noneEventually
    }
  }

  // returns true if list has length within timeout
  // else returns false
  private _eventuallyHasLength = ( length: number, {
    timeout = this._timeout,
    comparator = Workflo.Comparator.equalTo,
    interval = this._interval
  }: IPageElementListWaitLengthParams ) => {
    return this._eventually( () => this._waitHasLength( length, { timeout, comparator, interval } ) )
  }

  private _eventuallyIsEmpty = ({
    timeout = this._timeout,
    interval = this._interval
  } : IPageElementListWaitEmptyParams) => {
    return this._eventually( () => this._waitEmpty( { timeout, interval } ) )
  }

  private get _anyEventually() : Omit<IPageElementEventuallyAPI<Store>, 'not'> {
    const element = this.first
    const eventually = Object.assign({}, element.eventually)

    delete eventually.not

    return eventually
  }

  private get _noneEventually() : IPageElementEventuallyNotAPI<Store> {
    return this.first.eventually.not
  }
}