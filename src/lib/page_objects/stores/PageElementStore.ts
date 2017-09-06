import * as _ from 'lodash'

import {
  PageElement, IPageElementOpts,
  PageElementList, IPageElementListOpts,
  PageElementMap, IPageElementMapOpts, IPageElementMapIdentifier,
  PageElementGroup, IPageElementGroupOpts,
  TextGroup, ITextGroupOpts,
  ValueGroup, IValueGroupOpts,


  Input, IInputOpts
} from '../page_elements'

import {
  PageElementGroupWalker, IPageElementGroupWalkerOpts
} from '../walkers'

import {
  XPathBuilder
} from '../builders'

// Stores singleton instances of page elements to avoid creating new
// elements on each invocation of a page element.
export class PageElementStore {
  protected instanceCache: {[id: string] : any}
  protected xPathBuilder: XPathBuilder

  constructor() {
    this.instanceCache = Object.create(null)
    this.xPathBuilder = XPathBuilder.getInstance()
  }

  // DEFINE YOUR ELEMENT GROUPS HERE

  // Encapsulates arbitrary page element types.
  // Returns all nodes passed in content as its own members,
  // so that they can be accessed via dot notation.
  //
  // content is a collection of node getters, where each node
  // can be any form of page element defined in PageElementStore.
  //
  // walkerClass is optional and allows for passing a
  // custom group walker class.
  // Per default, ElementGroupWalker will be used as a walker.
  //
  // functions is an optional array of group function names that
  // defines the functions this group is supposed to support.
  //
  // id is a string to uniquely identify a group.
  // If id is not defined, the group instance will be identified
  // by a concatenated string of its node key names and types.
  ElementGroup<Content extends {[key: string] : Workflo.PageNode.INode}>(
    content: Content
  ) {
    return this.getGroup<
      this,
      Content,
      PageElementGroupWalker<this>,
      IPageElementGroupWalkerOpts,
      PageElementGroup<this, Content, PageElementGroupWalker<this>, IPageElementGroupWalkerOpts>,
      Pick<IPageElementGroupOpts<
        this,
        Content, 
        PageElementGroupWalker<this>, 
        IPageElementGroupWalkerOpts
      >, "content" | "walkerType" | "walkerOptions">
    > (
      PageElementGroup,
      {
        walkerType: PageElementGroupWalker,
        walkerOptions: {},
        content: content
      }
    )
  }

  TextGroup<Content extends {[key: string] : Workflo.PageNode.INode}>(
    content: Content
  ) {
    return this.getGroup<
      this,
      Content,
      PageElementGroupWalker<this>,
      IPageElementGroupWalkerOpts,
      TextGroup<this, Content, PageElementGroupWalker<this>, IPageElementGroupWalkerOpts>,
      Pick<ITextGroupOpts<
        this,
        Content, 
        PageElementGroupWalker<this>, 
        IPageElementGroupWalkerOpts
      >, "content" | "walkerType" | "walkerOptions">
    > (
      TextGroup,
      {
        walkerType: PageElementGroupWalker,
        walkerOptions: {},
        content: content
      }
    )
  }

  ValueGroup<Content extends {[key: string] : Workflo.PageNode.INode}>(
    content: Content
  ) {
    return this.getGroup<
      this,
      Content,
      PageElementGroupWalker<this>,
      IPageElementGroupWalkerOpts,
      ValueGroup<this, Content, PageElementGroupWalker<this>, IPageElementGroupWalkerOpts>,
      Pick<IValueGroupOpts<
        this,
        Content, 
        PageElementGroupWalker<this>, 
        IPageElementGroupWalkerOpts
      >, "content" | "walkerType" | "walkerOptions">
    > (
      ValueGroup,
      {
        walkerType: PageElementGroupWalker,
        walkerOptions: {},
        content: content
      }
    )
  }

  // DEFINE YOUR SINGLE ELEMENT TYPE ACCESSOR FUNCTIONS HERE

  /**
   * 
   * @param selector 
   * @param options 
   */
  Element(
    selector: Workflo.XPath,
    options?: Pick<IPageElementOpts<this>, "timeout" | "wait">
  ) {
    return this.get<IPageElementOpts<this>, PageElement<this>>(
      selector,
      PageElement,
      {
        store: this,
        ...options
      }
    )
  } 

  ExistElement(
    selector: Workflo.XPath,
    options?: Pick<IPageElementOpts<this>, "timeout">
  ) {
    return this.Element(
      selector,
      {
        wait: Workflo.WaitType.exist,
        ...options 
      }
    )
  }

  Input(
    selector: Workflo.XPath,
    options?: Pick<IInputOpts<this>, "timeout" | "wait">
  ) {
    return this.get<IInputOpts<this>, Input<this>>(
      selector,
      Input,
      {
        store: this,
        ...options
      }
    )
  }

  // DEFINE YOUR ELEMENT LIST TYPE ACCESSOR FUNCTIONS HERE

  List<
    PageElementType extends PageElement<this>, 
    PageElementOpts extends Pick<IPageElementOpts<this>, 'timeout' | 'wait'>
  > (
    selector: Workflo.XPath, 
    options: Pick<
      IPageElementListOpts<this, PageElementType, PageElementOpts>, 
      "wait" | "timeout" | "elementStoreFunc" | "elementOptions" | "disableCache" | "identifier"
    >
  ) {
    return this.get<
      IPageElementListOpts<this, PageElementType, PageElementOpts>, 
      PageElementList<this, PageElementType, PageElementOpts>
    > (
      selector,
      PageElementList,
      {
        store: this,
        elementStoreFunc: options.elementStoreFunc,
        ...options
      }
    )
  }

  ElementList(
    selector: Workflo.XPath, 
    options?: Pick<
      IPageElementListOpts<this, PageElement<this>, IPageElementOpts<this>>, 
      "wait" | "timeout" | "elementOptions" | "disableCache" | "identifier"
    >
  ) {
    return this.List(
      selector,
      {
        elementStoreFunc: this.Element,
        ...options
      }
    )
  }

  ExistElementList(
    selector: Workflo.XPath, 
    options?: Pick<
      IPageElementListOpts<this, PageElement<this>, IPageElementOpts<this>>,
      "timeout" | "elementOptions" | "disableCache" | "identifier"
    >
  ) {
    return this.List(
      selector,
      {
        elementStoreFunc: this.ExistElement,
        ...options
      }
    )
  }

  // Element Maps

  Map<
    K extends string, 
    PageElementType extends PageElement<this>, 
    PageElementOpts extends Pick<IPageElementOpts<this>, 'timeout' | 'wait'>
  >(
    selector: Workflo.XPath,
    options: Pick<
      IPageElementMapOpts<this, K, PageElementType, PageElementOpts>,
      "elementOptions" | "identifier" | "elementStoreFunc"
    >
  ) {
    return this.get<
      IPageElementMapOpts<this, K, PageElementType, PageElementOpts>, 
      PageElementMap<this, K, PageElementType, PageElementOpts>
    > (
      selector,
      PageElementMap,
      {
        store: this,
        elementStoreFunc: options.elementStoreFunc,
        ...options
      }
    )
  }

  ElementMap<K extends string>(
    selector: Workflo.XPath,
    options: Pick<
      IPageElementMapOpts<this, K, PageElement<this>, Pick<IPageElementOpts<this>, 'timeout' | 'wait'>>, 
      "elementOptions" | "identifier"
    >
  ) {
    return this.Map(
      selector,
      {
        elementStoreFunc: this.Element,
        ...options
      }
    )
  }

  // Functions to retrieve element instances

  /**
   * Returns a page element with the given selector, type and options.
   * 
   * If a page element with identical parameters already exists in this store,
   * a cached instance of this page element will be returned.
   * 
   * @param selector 
   * @param type 
   * @param options 
   */
  protected get<O, T>(
    selector: Workflo.XPath, 
    type: { new(selector: string, options: O): T }, 
    options: O = Object.create(Object.prototype)
  ) : T {
    const _selector = (selector instanceof XPathBuilder) ? this.xPathBuilder.build() : selector

    // catch: selector must not contain |
    if (_selector.indexOf('|||') > -1) {
      throw new Error(`Selector must not contain character sequence '|||': ${_selector}`)
    }

    const id = `${_selector}|||${type}|||${options.toString()}`

    if(!(id in this.instanceCache)) {
      const result = new type(_selector, options)
      this.instanceCache[id] = result
    }

    return this.instanceCache[id]
  }

  protected getGroup<
    Store extends PageElementStore,
    Content extends {[key: string] : Workflo.PageNode.INode},
    WalkerType extends PageElementGroupWalker<Store>,
    WalkerOptions extends IPageElementGroupWalkerOpts,
    GroupType extends PageElementGroup<
      Store,
      Content, 
      WalkerType,
      WalkerOptions
    >,
    GroupOptions extends Pick<IPageElementGroupOpts<
      Store,
      Content,
      WalkerType,
      WalkerOptions
    >, "content" | "walkerType" | "walkerOptions" >
  > (
    groupType: { new(options: IPageElementGroupOpts<Store, Content, WalkerType, WalkerOptions>): GroupType },
    groupOptions: GroupOptions
  ) : Content & GroupType {

    // Build id from group's elements' ids.
    // If two groups have the same content,
    // they are the same.
    let idStr = ''

    for (const key in groupOptions.content) {
      if (groupOptions.content.hasOwnProperty(key)) {
        idStr += `${groupOptions.content[key].__getNodeId()};`
      }
    }

    const key = `${groupType.name}:${groupOptions.walkerType.name}:${idStr}`

    if (!(key in this.instanceCache)) {

      const fullGroupOptions = _.merge({
        id: idStr,
      }, groupOptions)

      this.instanceCache[key] = new groupType(fullGroupOptions)
    }

    return this.instanceCache[key]
  }
}

const store = new PageElementStore()

const inputList = store.List(
  '//input',
  {
    elementStoreFunc: store.Input
  }
)

inputList.get(0).setValue('asdf')