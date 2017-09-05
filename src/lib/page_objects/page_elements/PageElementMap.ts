import { compare } from '../../utility_functions/util'
import { PageNode, IPageNodeOpts } from './'
import { XPathBuilder } from '../builders'

import * as _ from 'lodash'

// https://github.com/Microsoft/TypeScript/issues/14930

/**
 * Provides caller with selector of the map and the value of mappingObject's current property.
 * Theses can be used to build the selector of a map's element generically to identify it.
 */
export interface IPageElementMapIdentifier<Content extends Record<string, string>> {
  mappingObject: Content,
  func: ( mapSelector: string, mappingValue: string ) => XPathBuilder | string
}

// use disableCache for a "dynamic" list whose structure changes over time
// alternatively, call refresh() when the times of structure changes are known
export interface IPageElementMapOpts<
  Store extends Workflo.IPageElementStore, 
  Content extends Record<string, string>,
  PageElementType extends Workflo.IPageElement<Store>,
  PageElementOptions
> extends IPageNodeOpts<Store> {
  disableCache?: boolean,
  store: Store,
  elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType,
  elementOptions?: PageElementOptions
  identifier?: IPageElementMapIdentifier<Content>
}

// holds several PageElement instances of the same type
export class PageElementMap<
  Store extends Workflo.IPageElementStore,
  Content extends Record<string, string>,
  PageElementType extends Workflo.IPageElement<Store>,
  PageElementOptions
> extends PageNode<Store> implements Workflo.PageNode.INode {
  protected disableCache: boolean
  protected elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  protected elementOptions: PageElementOptions
  protected type: string
  protected identifier: IPageElementMapIdentifier<Content>
  protected identifiedObjCache: {[key: string] : {[key: string] : PageElementType}}
  protected _$: {[key in keyof Content] : PageElementType}

  constructor( 
    protected selector: string,
    { 
      disableCache = false,
      elementStoreFunc,
      elementOptions,
      identifier,
      ...superOpts
    } : IPageElementMapOpts<Store, Content, PageElementType, PageElementOptions> 
  ) {
    super(selector, superOpts)
    
    this.selector = selector
    this.elementOptions = elementOptions
    this.elementStoreFunc = elementStoreFunc
    this.type = 'ElementMap' // used by group walker to detect map
    this.identifier = identifier
    this.identifiedObjCache = {}

    this._$ = Workflo.Object.mapProperties(
      this.identifier.mappingObject,
      (value, key) => <PageElementType> this.elementStoreFunc.apply(
        this.store, [
          this.identifier.func(this.selector, value),
          this.elementOptions
        ]
      )
    )

    /* this._$ = Object.create(Object.prototype)

    if (Object.keys(this.identifier.mappingObject).length === 0) {
      throw new Error(`Mapping Object must not be empty for PageElementMap with selector '${this.selector}'`)
    }

    for (const id in this.identifier.mappingObject) {
      this._$ = this.elementStoreFunc.apply( 
        this.store, [ 
          this.identifier.func(this.selector, this.identifier.mappingObject[id]), 
          this.elementOptions 
        ] 
      ) 
    } */
  }

  get $ () {
    return this._$
  }

  // initialWait() {
  //   switch(this.wait) {
  //     case Workflo.WaitType.exist:
  //     this.waitExist()
  //     break
  //     case Workflo.WaitType.visible:
  //     this.waitVisible()
  //     break
  //     case Workflo.WaitType.value:
  //     this.waitValue()
  //     break
  //     case Workflo.WaitType.text:
  //     this.waitText()
  //     break
  //   }
  // }

  // // WAIT FUNCTIONS

  // waitExist(
  //   { timeout = this.timeout, reverse = false }: Workflo.WDIOParams = {}
  // ) {
  //   Workflo.Object.forEachProperty(
  //     this.$, 
  //     (value) => value._element.waitForExist(timeout, reverse)
  //   )
    
  //   return this
  // }

  // // Waits for at least one element of the list to be visible.
  // // 
  // // If reverse is set to true, function will wait until no element
  // // that matches the this.selector is visible.
  // waitVisible(
  //   { timeout = this.timeout, reverse = false }: Workflo.WDIOParams = {}
  // ) {
  //   this._elements.waitForVisible(timeout, reverse)
    
  //   return this
  // }

  // // Waits for at least one element of the list has a text.
  // // 
  // // If reverse is set to true, function will wait until no element
  // // that matches the this.selector has a text.
  // waitText(
  //   { timeout = this.timeout, reverse = false }: Workflo.WDIOParams = {}
  // ) {
  //   this._elements.waitForText(timeout, reverse)

  //   return this
  // }

  // // Waits for at least one element of the list have a value.
  // // 
  // // If reverse is set to true, function will wait until no element
  // // that matches the this.selector has a value.
  // waitValue(
  //   { timeout = this.timeout, reverse = false }: Workflo.WDIOParams = {}
  // ) {
  //   this._elements.waitForValue(timeout, reverse)

  //   return this
  // }

  // // Waits for all existing elements of list to be visible.
  // // 
  // // If reverse is set to true, function will wait until no element
  // // that matches the this.selector is visible.
  // waitAllVisible(
  //   { timeout = this.timeout, reverse = false }: Workflo.WDIOParams = {}
  // ) {
  //   const curElements = this._listElements
  //   const numberCurElements = curElements.length

  //   browser.waitUntil(() => {
  //     return curElements.filter(
  //       (element) => element.isVisible()
  //     ).length === numberCurElements
  //   }, timeout, `${this.selector}: Some list elements never became visible`)
    
  //   return this
  // }

  // // Waits for all existing elements of list to have a text.
  // // 
  // // If reverse is set to true, function will wait until no element
  // // that matches the this.selector has a text.
  // waitAllText(
  //   { timeout = this.timeout, reverse = false }: Workflo.WDIOParams = {}
  // ) {
  //   const curElements = this._listElements
  //   const numberCurElements = curElements.length

  //   browser.waitUntil(() => {
  //     return curElements.filter(
  //       (element) => element.hasText()
  //     ).length === numberCurElements
  //   }, timeout, `${this.selector}: Some list elements never had a text`)

  //   return this
  // }

  // // Waits for all existing elements of list to have a value.
  // // 
  // // If reverse is set to true, function will wait until no element
  // // that matches the this.selector has a value.
  // // for textarea, input and select
  // waitAllValue(
  //   { timeout = this.timeout, reverse = false }: Workflo.WDIOParams = {}
  // ) {
  //   const curElements = this._listElements
  //   const numberCurElements = curElements.length

  //   browser.waitUntil(() => {
  //     return curElements.filter(
  //       (element) => element.hasValue()
  //     ).length === numberCurElements
  //   }, timeout, `${this.selector}: Some list elements never had a text`)

  //   return this
  // }

  // // waits until list has given length
  // waitLength( {
  //   length, 
  //   timeout = this.timeout, 
  //   comparator = Workflo.Comparator.equalTo,
  //   interval = 500
  // }: {
  //   length: number, 
  //   timeout?: number, 
  //   comparator?: Workflo.Comparator,
  //   interval?: number
  // }) {
  //   browser.waitUntil(
  //     () => {
  //       let value = this._elements.value

  //       if (!value || !value.length) {
  //         return false
  //       } else {
  //         return compare(value.length, length, comparator)
  //       }
  //     },
  //   timeout, `${this.selector}: List length never became ${comparator.toString()} ${length}`, interval )

  //   return this
  // }

  // // returns true if list has length within timeout
  // // else returns false
  // eventuallyHasLength( {length, timeout = this.timeout}: {length: number, timeout: number} ) {
  //   try {
  //     this.waitLength( {length, timeout} )
  //     return true
  //   } catch (error) {
  //     return false
  //   }
  // }

  // isEmpty() {
  //   return !browser.isExisting(this.selector)
  // }

  // eventuallyIsEmpty({timeout = this.timeout} : {timeout?: number}) {
  //   try {
  //     browser.waitUntil(() => {
  //       return !browser.isExisting(this.selector)
  //     }, timeout, `List never became empty: ${this.selector}`)

  //     return true
  //   } catch (error) {
  //     return false
  //   }
  // }

  // waitEmpty({timeout = this.timeout, interval = 500} : {timeout?: number, interval?: number}) {
  //   browser.waitUntil(() => {
  //     return !browser.isExisting(this.selector)
  //   }, timeout, `List never became empty: ${this.selector}`, interval)
  // }
}