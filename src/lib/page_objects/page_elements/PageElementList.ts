import { compare } from '../../utility_functions/util'
import { PageNode, IPageNodeOpts, PageElement } from './'
import { PageElementStore } from '../stores'
import { FirstByBuilder } from '../builders'

export interface IPageElementListIdentifier<
  Store extends PageElementStore,
  ElementType extends PageElement<Store>
> {
  mappingObject: {[key: string] : string},
  func: ( element: ElementType ) => string
}

// use disableCache for a "dynamic" list whose structure changes over time
// alternatively, call refresh() when the times of structure changes are known
export interface IPageElementListOpts<
  Store extends PageElementStore, 
  PageElementType extends PageElement<Store>,
  PageElementOptions
> extends IPageNodeOpts<Store> {
  wait?: Workflo.WaitType,
  timeout?: number,
  disableCache?: boolean,
  store: Store,
  elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType,
  elementOptions: PageElementOptions
  identifier?: IPageElementListIdentifier<Store, PageElementType>
}

// holds several PageElement instances of the same type
export class PageElementList<
  Store extends PageElementStore,   
  PageElementType extends PageElement<Store>,
  PageElementOptions
> extends PageNode<Store> implements Workflo.PageNode.INode {
  protected wait: Workflo.WaitType
  protected timeout: number
  
  protected disableCache: boolean
  protected elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  protected elementOptions: PageElementOptions
  protected identifier: IPageElementListIdentifier<Store, PageElementType>
  protected identifiedObjCache: {[key: string] : {[key: string] : PageElementType}}
  protected firstByBuilder: FirstByBuilder<Store, PageElementType, PageElementOptions>

  constructor( 
    protected selector: string,
    { 
      wait = Workflo.WaitType.visible,
      timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default,
      disableCache = false,
      elementStoreFunc,
      elementOptions,
      identifier,
      ...superOpts
    } : IPageElementListOpts<Store, PageElementType, PageElementOptions> 
  ) {
    super(selector, superOpts)

    this.wait = wait
    this.timeout = timeout
    
    this.selector = selector
    this.elementOptions = elementOptions
    this.elementStoreFunc = elementStoreFunc
    this.identifier = identifier
    this.identifiedObjCache = {}

    this.firstByBuilder = new FirstByBuilder(this.selector, {
      store: this.store,
      elementStoreFunc: this.elementStoreFunc,
      elementOptions: this.elementOptions
    })
  }

  get _elements() {
    return browser.elements( this.selector )
  }

  get elements() {
    this.initialWait()

    return this._elements
  }

  initialWait() {
    switch(this.wait) {
      case Workflo.WaitType.exist:
      this.waitExist()
      break
      case Workflo.WaitType.visible:
      this.waitVisible()
      break
      case Workflo.WaitType.value:
      this.waitValue()
      break
      case Workflo.WaitType.text:
      this.waitText()
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
        const selector = `(${this.selector})[${i + 1}]`

        const listElement = this.elementStoreFunc.apply( this.store, [ selector, this.elementOptions ] )      
        
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
          const selector = `(${this.selector})[${i + 1}]`
  
          const listElement = this.elementStoreFunc.apply( this.store, [ selector, this.elementOptions ] )      
          
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
    this.identifier = identifier

    return this
  }

  // Returns an object consisting of this._identifier.object's keys
  // as keys and the elements mapped by this._identifier.func()
  // as values.
  // 
  // If this.identifier is undefined, returns undefined.
  // If cached option is set to true, returns cached identified elements object
  // if it exists and otherwise fetches new identified elements object.
  // Per default, returns a cached version of this identifier was already
  // used unless resetCache is set to true.
  // This means that the returned structure of the list may reflect an earlier state,
  // while its contents are still guaranteed to be refreshed on each access!
  //
  // Attention: this may take a long time, try to avoid: if only single elements of list
  // are needed, use firstByXXX instead
  identify(
    {identifier = this.identifier, resetCache = false}: 
    {identifier?: IPageElementListIdentifier<Store, PageElementType>, resetCache?: boolean} = {}
  ) {
    if (!identifier) {
      return undefined
    } 

    const cacheKey = `${identifier.mappingObject.toString()}|||${identifier.func.toString()}`

    if (this.disableCache || resetCache || !(cacheKey in this.identifiedObjCache)) {
      const queryResults: {[key:string]:PageElementType} = {}

      // create hash where result of identifier func is key
      // and list element is value
      this.listElements.forEach( 
        ( element ) => { 
          const resultKey = identifier.func( element )
          queryResults[ resultKey ] = element
        }
      )

      const mappedObj: {[key: string] : PageElementType} = {}

      // Assign each key in identifier's object a list element by
      // mapping queryResult's keys to identifier mapObject's values
      for ( const key in identifier.mappingObject ) {
        if ( identifier.mappingObject.hasOwnProperty( key ) ) {
          mappedObj[ key ] = queryResults[ identifier.mappingObject[ key ] ]
        }
      }

      this.identifiedObjCache[cacheKey] = mappedObj
    }
      
    return this.identifiedObjCache[cacheKey]
  }

  // TEMPORARY GET FUNCTIONS - NEWLY EVALUATED ON EACH CALL

  /**
   * 
   * @param index Index starts with 0
   */
  get( index: number ) {
    return this.firstBy().index(index + 1).get()
  }

  getAll() {
    return this.listElements
  }

  // gets the length of the list/the number of elements in the list
  getLength() {
    return this.listElements.length
  }

  firstBy() {
    return this.firstByBuilder.reset()
  }

  // WAIT FUNCTIONS

  // Waits for at least one element of the list to exist.
  // 
  // If reverse is set to true, function will wait until no element
  // that matches the this.selector exists.
  waitExist(
    { timeout = this.timeout, reverse = false }: Workflo.WDIOParams = {}
  ) {
    this._elements.waitForExist(timeout, reverse)
    
    return this
  }

  // Waits for at least one element of the list to be visible.
  // 
  // If reverse is set to true, function will wait until no element
  // that matches the this.selector is visible.
  waitVisible(
    { timeout = this.timeout, reverse = false }: Workflo.WDIOParams = {}
  ) {
    this._elements.waitForVisible(timeout, reverse)
    
    return this
  }

  // Waits for at least one element of the list has a text.
  // 
  // If reverse is set to true, function will wait until no element
  // that matches the this.selector has a text.
  waitText(
    { timeout = this.timeout, reverse = false }: Workflo.WDIOParams = {}
  ) {
    this._elements.waitForText(timeout, reverse)

    return this
  }

  // Waits for at least one element of the list have a value.
  // 
  // If reverse is set to true, function will wait until no element
  // that matches the this.selector has a value.
  waitValue(
    { timeout = this.timeout, reverse = false }: Workflo.WDIOParams = {}
  ) {
    this._elements.waitForValue(timeout, reverse)

    return this
  }

  // waits until list has given length
  waitLength( {
    length, 
    timeout = this.timeout, 
    comparator = Workflo.Comparator.equalTo,
    interval = 500
  }: {
    length: number, 
    timeout?: number, 
    comparator?: Workflo.Comparator,
    interval?: number
  }) {
    browser.waitUntil(
      () => {
        let value = this._elements.value

        if (!value || !value.length) {
          return false
        } else {
          return compare(value.length, length, comparator)
        }
      },
    timeout, `${this.selector}: List length never became ${comparator.toString()} ${length}`, interval )

    return this
  }

  // returns true if list has length within timeout
  // else returns false
  eventuallyHasLength( {length, timeout = this.timeout}: {length: number, timeout: number} ) {
    try {
      this.waitLength( {length, timeout} )
      return true
    } catch (error) {
      return false
    }
  }

  isEmpty() {
    return !browser.isExisting(this.selector)
  }

  eventuallyIsEmpty({timeout = this.timeout} : {timeout?: number}) {
    try {
      browser.waitUntil(() => {
        return !browser.isExisting(this.selector)
      }, timeout, `List never became empty: ${this.selector}`)

      return true
    } catch (error) {
      return false
    }
  }

  waitEmpty({timeout = this.timeout, interval = 500} : {timeout?: number, interval?: number}) {
    browser.waitUntil(() => {
      return !browser.isExisting(this.selector)
    }, timeout, `List never became empty: ${this.selector}`, interval)
  }
}