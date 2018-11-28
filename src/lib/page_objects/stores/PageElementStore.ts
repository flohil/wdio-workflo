import * as _ from 'lodash'

import {
  PageElement, IPageElementOpts,
  ValuePageElement, IValuePageElementOpts,
  PageElementList, IPageElementListOpts,
  PageElementMap, IPageElementMapOpts, IPageElementMapIdentifier,
  PageElementGroup, IPageElementGroupOpts,
  TextGroup, ITextGroupOpts,
  ValueGroup, IValueGroupOpts
} from '../page_elements'

import {
  PageElementGroupWalker, IPageElementGroupWalkerOpts
} from '../walkers'

import {
  XPathBuilder
} from '../builders'

export type CloneFunc<Type> = (
  selector?: Workflo.XPath,
) => Type

// Stores singleton instances of page elements to avoid creating new
// elements on each invocation of a page element.
export class PageElementStore {
  protected _instanceCache: {[id: string] : any}
  protected _xPathBuilder: XPathBuilder

  constructor() {
    this._instanceCache = Object.create(null)
    this._xPathBuilder = XPathBuilder.getInstance()
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
  ElementGroup<Content extends Record<string, Workflo.PageNode.INode>> (
    content: Content
  ) {
    return this._getGroup<
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

  TextGroup<Content extends Record<string, Workflo.PageNode.INode>>(
    content: Content
  ) {
    return this._getGroup<
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

  ValueGroup<Content extends Record<string, Workflo.PageNode.INode>>(
    content: Content
  ) {
    return this._getGroup<
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
    options?: Pick<IPageElementOpts<this>, Workflo.PageElementOptions>
  ) {
    return this._get<PageElement<this>, IPageElementOpts<this>>(
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
    options?: Pick<IPageElementOpts<this>, "timeout" | "customScroll">
  ) {
    return this.Element(
      selector,
      {
        waitType: Workflo.WaitType.exist,
        ...options
      }
    )
  }

  ValueElement(
    selector: Workflo.XPath,
    options?: Pick<IPageElementOpts<this>, Workflo.PageElementOptions>
  ) {
    return this._get<ValuePageElement<this>, IValuePageElementOpts<this>>(
      selector,
      ValuePageElement,
      {
        store: this,
        ...options
      }
    )
  }

  ExistValueElement(
    selector: Workflo.XPath,
    options?: Pick<IValuePageElementOpts<this>, "timeout" | "customScroll">
  ) {
    return this.ValueElement(
      selector,
      {
        waitType: Workflo.WaitType.exist,
        ...options
      }
    )
  }

  // DEFINE YOUR ELEMENT LIST TYPE ACCESSOR FUNCTIONS HERE

  protected List<
    PageElementType extends PageElement<this>,
    PageElementOpts extends Pick<IPageElementOpts<this>, 'timeout' | 'waitType'>
  > (
    selector: Workflo.XPath,
    options: Pick<
      IPageElementListOpts<this, PageElementType, PageElementOpts>,
      "waitType" | "timeout" | "elementStoreFunc" | "elementOptions" | "disableCache" | "identifier"
    >
  ) {
    return this._get<
      PageElementList<this, PageElementType, PageElementOpts>,
      IPageElementListOpts<this, PageElementType, PageElementOpts>
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
    options?: PickPartial<
      IPageElementListOpts<this, PageElement<this>, Pick<IPageElementOpts<this>, "timeout" | "waitType">>,
      "waitType" | "timeout" | "disableCache" | "identifier",
      "elementOptions"
    >
  ) {
    return this.List(
      selector,
      {
        elementOptions: {},
        elementStoreFunc: this.Element,
        ...options
      }
    )
  }

  ExistElementList(
    selector: Workflo.XPath,
    options?: PickPartial<
      IPageElementListOpts<this, PageElement<this>, Pick<IPageElementOpts<this>, "timeout">>,
      "timeout" | "disableCache" | "identifier",
      "elementOptions"
    >
  ) {
    return this.List(
      selector,
      {
        elementOptions: {},
        elementStoreFunc: this.ExistElement,
        waitType: Workflo.WaitType.exist,
        ...options
      }
    )
  }

  // Element Maps

  protected Map<
    K extends string,
    PageElementType extends PageElement<this>,
    PageElementOpts extends Pick<IPageElementOpts<this>, 'timeout' | 'waitType'>
  >(
    selector: Workflo.XPath,
    options: Pick<
      IPageElementMapOpts<this, K, PageElementType, PageElementOpts>,
      "elementOptions" | "identifier" | "elementStoreFunc"
    >
  ) {
    return this._get<
      PageElementMap<this, K, PageElementType, PageElementOpts>,
      IPageElementMapOpts<this, K, PageElementType, PageElementOpts>
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
    options: PickPartial<
      IPageElementMapOpts<this, K, PageElement<this>, Pick<IPageElementOpts<this>, 'timeout' | 'waitType'>>,
      "identifier",
      "elementOptions"
    >
  ) {
    return this.Map(
      selector,
      {
        elementStoreFunc: this.Element,
        elementOptions: {},
        ...options
      }
    )
  }

  ExistElementMap<K extends string>(
    selector: Workflo.XPath,
    options: PickPartial<
      IPageElementMapOpts<this, K, PageElement<this>, Pick<IPageElementOpts<this>, 'timeout'>>,
      "identifier",
      "elementOptions"
    >
  ) {
    return this.Map(
      selector,
      {
        elementStoreFunc: this.ExistElement,
        elementOptions: {},
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
  public _get<Type, Options>(
    selector: Workflo.XPath,
    type: { new(selector: string, options: Options, cloneFunc: CloneFunc<Type>): Type },
    options: Exclude<Options, 'cloneFunc'> = Object.create(Object.prototype)
  ) : Type {
    const _selector = (selector instanceof XPathBuilder) ? this._xPathBuilder.build() : selector

    // catch: selector must not contain |
    if (_selector.indexOf('|||') > -1) {
      throw new Error(`Selector must not contain character sequence '|||': ${_selector}`)
    }

    const id = `${_selector}|||${type}|||${options.toString()}`

    const cloneFunc: CloneFunc<Type> = cloneSelector => {
      if ( !cloneSelector ) {
        cloneSelector = selector
      }

      return this._get<Type, Options>(cloneSelector, type, options)
    }

    if(!(id in this._instanceCache)) {
      const result = new type(_selector, options, cloneFunc)
      this._instanceCache[id] = result
    }

    return this._instanceCache[id]
  }

  public _getGroup<
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

    if (!(key in this._instanceCache)) {

      const fullGroupOptions = _.merge({
        id: idStr,
      }, groupOptions)

      this._instanceCache[key] = new groupType(fullGroupOptions)
    }

    return this._instanceCache[key]
  }
}