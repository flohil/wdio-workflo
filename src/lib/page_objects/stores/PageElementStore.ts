import * as _ from 'lodash'

import {
  PageElement, IPageElementOpts,
  PageElementList, IPageElementListOpts,
  PageElementMap, IPageElementMapOpts,
  PageElementGroup, IPageElementGroupOpts,
  TextGroup, ITextGroupOpts,
  ValueGroup, IValueGroupOpts, ValuePageElement, IValuePageElementOpts, IValuePageElementListOpts, ValuePageElementList, IPageElementBaseOpts
} from '../page_elements'

import {
  PageElementGroupWalker, IPageElementGroupWalkerOpts
} from '../walkers'

import {
  XPathBuilder
} from '../builders'
import { IValuePageElementMapOpts, ValuePageElementMap } from '../page_elements/ValuePageElementMap';

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

// GROUPS

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
      >, Workflo.Store.GroupPublicKeys>
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
      >, Workflo.Store.GroupPublicKeys>
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
      >, Workflo.Store.GroupPublicKeys>
    > (
      ValueGroup,
      {
        walkerType: PageElementGroupWalker,
        walkerOptions: {},
        content: content
      }
    )
  }

// ELEMENTS

  /**
   *
   * @param selector
   * @param options
   */
  Element(
    selector: Workflo.XPath,
    options?: Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>
  ) {
    return this._getElement<PageElement<this>, IPageElementOpts<this>>(
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
    options?: Pick<IPageElementOpts<this>, Exclude<Workflo.Store.ElementPublicKeys, "waitType">>
  ) {
    return this.Element(
      selector,
      {
        waitType: Workflo.WaitType.exist,
        ...options
      }
    )
  }

// LISTS

  protected List<
    PageElementType extends PageElement<this>,
    PageElementOpts extends Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>,
  > (
    selector: Workflo.XPath,
    options: Pick<
      IPageElementListOpts<this, PageElementType, PageElementOpts>,
      Workflo.Store.ListConstructorKeys
    >
  ) {
    return this._getList<
      PageElementList<this, PageElementType, PageElementOpts>,
      IPageElementListOpts<this, PageElementType, PageElementOpts>
    > (
      selector,
      PageElementList,
      {
        store: this,
        ...options
      }
    )
  }

  protected ValueList<
    PageElementType extends ValuePageElement<this, ReturnType<PageElementType['getValue']>>,
    PageElementOpts extends Pick<IValuePageElementOpts<this>, Workflo.Store.ElementPublicKeys>,
  > (
    selector: Workflo.XPath,
    options: Pick<
      IValuePageElementListOpts<this, PageElementType, PageElementOpts, ReturnType<PageElementType['getValue']>>,
      Workflo.Store.ListConstructorKeys
    >
  ) {
    return this._getList<
      ValuePageElementList<this, PageElementType, PageElementOpts, ReturnType<PageElementType['getValue']>>,
      IValuePageElementListOpts<this, PageElementType, PageElementOpts, ReturnType<PageElementType['getValue']>>
    > (
      selector,
      ValuePageElementList,
      {
        store: this,
        ...options
      }
    )
  }

  ElementList(
    selector: Workflo.XPath,
    options?: PickPartial<
      IPageElementListOpts<this, PageElement<this>, Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>>,
      Workflo.Store.ListPublicKeys,
      Workflo.Store.ListPublicPartialKeys
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
      Exclude<Workflo.Store.ListPublicKeys, "waitType">,
      Workflo.Store.ListPublicPartialKeys
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

// MAPS

  protected Map<
    K extends string,
    PageElementType extends PageElement<this>,
    PageElementOpts extends Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>
  >(
    selector: Workflo.XPath,
    options: Pick<
      IPageElementMapOpts<this, K, PageElementType, PageElementOpts>,
      Workflo.Store.MapConstructorKeys
    >
  ) {
    return this._getMap<
      K,
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

  protected ValueMap<
    K extends string,
    PageElementType extends ValuePageElement<this, ReturnType<PageElementType["getValue"]>>,
    PageElementOpts extends Pick<IValuePageElementOpts<this>, Workflo.Store.ElementPublicKeys>
  >(
    selector: Workflo.XPath,
    options: Pick<
      IValuePageElementMapOpts<this, K, PageElementType, PageElementOpts, ReturnType<PageElementType["getValue"]>>,
      Workflo.Store.MapConstructorKeys
    >
  ) {
    return this._getMap<
      K,
      ValuePageElementMap<this, K, PageElementType, PageElementOpts, ReturnType<PageElementType["getValue"]>>,
      IValuePageElementMapOpts<this, K, PageElementType, PageElementOpts, ReturnType<PageElementType["getValue"]>>
    > (
      selector,
      ValuePageElementMap,
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
      IPageElementMapOpts<this, K, PageElement<this>, Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>>,
      Workflo.Store.MapPublicKeys,
      Workflo.Store.MapPublicPartialKeys
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
      IPageElementMapOpts<
        this, K, PageElement<this>, Pick<IPageElementOpts<this>, Exclude<Workflo.Store.ElementPublicKeys, "waitType">>
      >,
      Workflo.Store.MapPublicKeys,
      Workflo.Store.MapPublicPartialKeys
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
  private _get<
    Type,
    Options
  >(
    selector: Workflo.XPath,
    type: { new(selector: string, options: Options): Type },
    options: Options = Object.create(Object.prototype),
    afterConstruction?: (instance: Type) => void
  ) : Type {
    const _selector = (selector instanceof XPathBuilder) ? this._xPathBuilder.build() : selector

    // catch: selector must not contain |
    if (_selector.indexOf('|||') > -1) {
      throw new Error(`Selector must not contain character sequence '|||': ${_selector}`)
    }

    const id = `${_selector}|||${type}|||${options.toString()}`

    if(!(id in this._instanceCache)) {
      const result = new type(_selector, options)

      if (typeof afterConstruction !== 'undefined') {
        afterConstruction(result)
      }

      this._instanceCache[id] = result
    }

    return this._instanceCache[id]
  }

  protected _getElement<
    ElementType extends PageElement<this>,
    ElementOptions,
  >(
    selector: Workflo.XPath,
    type: { new(selector: string, options: ElementOptions): ElementType },
    options: ElementOptions = Object.create(Object.prototype),
  ) : ElementType {
    return this._get(selector, type, options)
  }

  protected _getList<
    ListType extends PageElementList<this, any, any>,
    ListOptions,
  >(
    selector: Workflo.XPath,
    type: { new(selector: string, options: ListOptions): ListType },
    options: ListOptions = Object.create(Object.prototype),
  ) : ListType {
    return this._get(selector, type, options, instance => {
      const cloneFunc: CloneFunc<ListType> = cloneSelector => {
        if ( !cloneSelector ) {
          cloneSelector = selector
        }

        return this._getList<ListType, ListOptions>(cloneSelector, type, options)
      }

      instance.init(cloneFunc)
    })
  }

  protected _getMap<
    K extends string,
    MapType extends PageElementMap<this, K, any, any>,
    MapOptions extends IPageElementMapOpts<this, K, any, any>
  >(
    selector: Workflo.XPath,
    type: { new(selector: string, options: MapOptions): MapType },
    options: MapOptions = Object.create(Object.prototype),
  ) : MapType {
    return this._get(selector, type, options)
  }

  protected _getGroup<
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
  ) : GroupType {

    // Build id from group's elements' ids.
    // If two groups have the same content,
    // they are the same.
    let idStr = ''

    for (const key in groupOptions.content) {
      if (groupOptions.content.hasOwnProperty(key)) {
        idStr += `${groupOptions.content[key].getNodeId()};`
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