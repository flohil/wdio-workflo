import * as _ from 'lodash';

import {
  IPageElementGroupOpts, IPageElementListOpts,
  IPageElementMapOpts, IPageElementOpts,
  IValuePageElementGroupOpts, IValuePageElementListOpts,
  IValuePageElementOpts, PageElement,
  PageElementGroup, PageElementList,
  PageElementMap, ValuePageElement,
  ValuePageElementGroup, ValuePageElementList,
} from '../page_elements';

import {
  XPathBuilder,
} from '../builders';
import { IValuePageElementMapOpts, ValuePageElementMap } from '../page_elements/ValuePageElementMap';

/**
 * A function used to clone a PageElementList.
 *
 * @template Type the type of the cloned list
 * @param selector the selector of the cloned list
 */
export type CloneFunc<Type> = (
  selector?: Workflo.XPath,
) => Type;

/**
 * PageNodeStore serves as a facade for the creation and retrieval of Page Nodes.
 * Basically, Page Nodes should only be created or retrieved via PageNodeStores and never by "manually" invoking
 * their constructor functions.
 *
 * PageNodeStore caches instances of Page Nodes with the same type and selector to avoid creating new Page Nodes on each
 * invocation of a retrieval function.
 *
 * Furthermore, PageNodeStore allows you to define default opts parameters and provide pre-configured variants of
 * PageNodes (eg. Element and ExistElement).
 */
export class PageNodeStore {

  /**
   * Caches instances of PageNodes.
   */
  protected _instanceCache: {[id: string] : any};
  /**
   * An instance of XPathBuilder used to build the currently constructed XPath expressions of retrieved PageNodes.
   */
  protected _xPathBuilder: XPathBuilder;

  constructor() {
    this._instanceCache = Object.create(null);
    this._xPathBuilder = XPathBuilder.getInstance();
  }

// ELEMENTS

  /**
   * Retrieves an instance of a PageElement from the store.
   *
   * The waitType of the PageElement is set to 'visible' by default.
   *
   * @param selector the XPath selector of the retrieved PageElement
   * @param opts the publicly available options used to configure the retrieved PageElement
   * @returns an instance of the retrieved PageElement
   */
  Element(
    selector: Workflo.XPath,
    opts?: Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>,
  ) {
    return this._getElement<PageElement<this>, IPageElementOpts<this>>(
      selector,
      PageElement,
      {
        store: this,
        ...opts,
      },
    );
  }

  /**
   * Retrieves an instance of a PageElement from the store.
   *
   * The waitType of the retrieved PageElement is set to 'exist' and cannot be overwritten.
   *
   * @param selector the XPath selector of the retrieved PageElement
   * @param opts the publicly available options used to configure the retrieved PageElement
   * @returns an instance of the retrieved PageElement
   */
  ExistElement(
    selector: Workflo.XPath,
    opts?: Pick<IPageElementOpts<this>, Exclude<Workflo.Store.ElementPublicKeys, 'waitType'>>,
  ) {
    return this.Element(
      selector,
      {
        waitType: Workflo.WaitType.exist,
        ...opts,
      },
    );
  }

// LISTS

  /**
   * Retrieves an instance of a PageElementList from the store that manages any instance of PageElement which inherits
   * from the PageElement class.
   *
   * The waitType of PageElements managed by PageElementList and the waitType of the list itself are set to 'visible' by
   * default.
   *
   * @template PageElementType the type of PageElement managed by PageElementList
   * @template PageElementOpts the type of the opts parameter passed to the constructor function of PageElements managed
   * by PageElementList
   * @param selector the XPath selector of the retrieved PageElementList
   * @param opts the publicly available options used to configure the retrieved PageElementList
   * @returns an instance of the retrieved PageElementList
   */
  protected List<
    PageElementType extends PageElement<this>,
    PageElementOpts extends Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>,
  > (
    selector: Workflo.XPath,
    opts: Pick<
      IPageElementListOpts<this, PageElementType, PageElementOpts>,
      Workflo.Store.ListConstructorKeys
    >,
  ) {
    return this._getList<
      PageElementList<this, PageElementType, PageElementOpts>,
      IPageElementListOpts<this, PageElementType, PageElementOpts>
    > (
      selector,
      PageElementList,
      {
        store: this,
        ...opts,
      },
    );
  }

  /**
   * Retrieves an instance of a ValuePageElementList from the store that manages any instance of ValuePageElement which
   * inherits from the ValuePageElement class.
   *
   * The waitType of PageElements managed by ValuePageElementList and the waitType of the list itself are set to
   * 'visible' by default.
   *
   * @template PageElementType the type of ValuePageElement managed by ValuePageElementList
   * @template PageElementOpts the type of the opts parameter passed to the constructor function of ValuePageElements
   * managed by ValuePageElementList
   * @param selector the XPath selector of the retrieved ValuePageElementList
   * @param opts the publicly available options used to configure the retrieved ValuePageElementList
   * @returns an instance of the retrieved ValuePageElementList
   */
  protected ValueList<
    PageElementType extends ValuePageElement<this, ReturnType<PageElementType['getValue']>>,
    PageElementOpts extends Pick<IValuePageElementOpts<this>, Workflo.Store.ElementPublicKeys>,
  > (
    selector: Workflo.XPath,
    opts: Pick<
      IValuePageElementListOpts<this, PageElementType, PageElementOpts, ReturnType<PageElementType['getValue']>>,
      Workflo.Store.ListConstructorKeys
    >,
  ) {
    return this._getList<
      ValuePageElementList<this, PageElementType, PageElementOpts, ReturnType<PageElementType['getValue']>>,
      IValuePageElementListOpts<this, PageElementType, PageElementOpts, ReturnType<PageElementType['getValue']>>
    > (
      selector,
      ValuePageElementList,
      {
        store: this,
        ...opts,
      },
    );
  }

  /**
   * Retrieves an instance of a PageElementList from the store that manages PageElement instances of the type
   * PageElement.
   *
   * The waitType of the PageElements managed by PageElementList and the waitType of the list itself are set to
   * 'visible' by default.
   *
   * @param selector the XPath selector of the retrieved PageElementList
   * @param opts the publicly available options used to configure the retrieved PageElementList
   * @returns an instance of the retrieved PageElementList
   */
  ElementList(
    selector: Workflo.XPath,
    opts?: Workflo.PickPartial<
      IPageElementListOpts<this, PageElement<this>, Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>>,
      Workflo.Store.ListPublicKeys,
      Workflo.Store.ListPublicPartialKeys
    >,
  ) {
    return this.List(
      selector,
      {
        elementOpts: {},
        elementStoreFunc: this.Element,
        ...opts,
      },
    );
  }

// MAPS

  /**
   * Retrieves an instance of a PageElementMap from the store that manages any instance of PageElement which inherits
   * from the PageElement class.
   *
   * The waitType of PageElements managed by PageElementMap is set to 'visible' by default.
   *
   * @template K the names of all PageElements managed by PageElementMap
   * @template PageElementType the type of PageElement managed by PageElementMap
   * @template PageElementOpts the type of the opts parameter passed to the constructor function of PageElements managed
   * by PageElementMap
   * @param selector the XPath selector of the retrieved PageElementMap
   * @param opts the publicly available options used to configure the retrieved PageElementMap
   * @returns an instance of the retrieved PageElementMap
   */
  protected Map<
    K extends string,
    PageElementType extends PageElement<this>,
    PageElementOpts extends Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>
  >(
    selector: Workflo.XPath,
    opts: Pick<
      IPageElementMapOpts<this, K, PageElementType, PageElementOpts>,
      Workflo.Store.MapConstructorKeys
    >,
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
        elementStoreFunc: opts.elementStoreFunc,
        ...opts,
      },
    );
  }

  /**
   * Retrieves an instance of a ValuePageElementMap from the store that manages any instance of ValuePageElement which
   * inherits from the ValuePageElement class.
   *
   * The waitType of ValuePageElements managed by ValuePageElementMap is set to 'visible' by default.
   *
   * @template K the names of all ValuePageElements managed by ValuePageElementMap
   * @template PageElementType the type of ValuePageElement managed by ValuePageElementMap
   * @template PageElementOpts the type of the opts parameter passed to the constructor function of ValuePageElements
   * managed by ValuePageElementMap
   * @param selector the XPath selector of the retrieved ValuePageElementMap
   * @param opts the publicly available options used to configure the retrieved ValuePageElementMap
   * @returns an instance of the retrieved ValuePageElementMap
   */
  protected ValueMap<
    K extends string,
    PageElementType extends ValuePageElement<this, ReturnType<PageElementType['getValue']>>,
    PageElementOpts extends Pick<IValuePageElementOpts<this>, Workflo.Store.ElementPublicKeys>
  >(
    selector: Workflo.XPath,
    opts: Pick<
      IValuePageElementMapOpts<this, K, PageElementType, PageElementOpts, ReturnType<PageElementType['getValue']>>,
      Workflo.Store.MapConstructorKeys
    >,
  ) {
    return this._getMap<
      K,
      ValuePageElementMap<this, K, PageElementType, PageElementOpts, ReturnType<PageElementType['getValue']>>,
      IValuePageElementMapOpts<this, K, PageElementType, PageElementOpts, ReturnType<PageElementType['getValue']>>
    > (
      selector,
      ValuePageElementMap,
      {
        store: this,
        elementStoreFunc: opts.elementStoreFunc,
        ...opts,
      },
    );
  }

  /**
   * Retrieves an instance of a PageElementMap from the store that manages PageElement instances of the type
   * PageElement.
   *
   * The waitType of PageElements managed by PageElementMap is set to 'visible' by default.
   *
   * @template K the names of all PageElements managed by PageElementMap
   * @param selector the XPath selector of the retrieved PageElementMap
   * @param opts the publicly available options used to configure the retrieved PageElementMap
   * @returns an instance of the retrieved PageElementMap
   */
  ElementMap<K extends string>(
    selector: Workflo.XPath,
    opts: Workflo.PickPartial<
      IPageElementMapOpts<this, K, PageElement<this>, Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>>,
      Workflo.Store.MapPublicKeys,
      Workflo.Store.MapPublicPartialKeys
    >,
  ) {
    return this.Map(
      selector,
      {
        elementStoreFunc: this.Element,
        elementOpts: {},
        ...opts,
      },
    );
  }

  /**
   * Retrieves an instance of a PageElementMap from the store that manages PageElement instances of the type
   * PageElement.
   *
   * The waitType of PageElements managed by PageElementMap is set to 'exist' by default.
   *
   * @template K the names of all PageElements managed by PageElementMap
   * @param selector the XPath selector of the retrieved PageElementMap
   * @param opts the publicly available options used to configure the retrieved PageElementMap
   * @returns an instance of the retrieved PageElementMap
   */
  ExistElementMap<K extends string>(
    selector: Workflo.XPath,
    opts: Workflo.PickPartial<
      IPageElementMapOpts<
        this, K, PageElement<this>, Pick<IPageElementOpts<this>, Exclude<Workflo.Store.ElementPublicKeys, 'waitType'>>
      >,
      Workflo.Store.MapPublicKeys,
      Workflo.Store.MapPublicPartialKeys
    >,
  ) {
    return this.Map(
      selector,
      {
        elementStoreFunc: this.ExistElement,
        elementOpts: {},
        ...opts,
      },
    );
  }

// GROUPS

  /**
   * Retrieves an instance of a PageElementGroup from the store.
   *
   * The group functions (state check -> hasXXX/hasAnyXXX/containsXXX, state retrieval -> getXXX) supported by the
   * retrieved PageElementGroup are defined in Workflo.IElementNode.
   *
   * @param content an object whose keys are the names of PageNodes managed by the PageElementGroup and whose values
   * are instances of these PageNodes
   * @param opts the publicly available options used to configure the retrieved PageElementGroup
   * @returns an instance of the retrieved PageElementGroup
   */
  ElementGroup<Content extends Record<string, Workflo.PageNode.IPageNode>> (
    content: Content,
  ) {
    return this._getGroup<
      this,
      Content,
      PageElementGroup<this, Content>,
      Pick<IPageElementGroupOpts<
        this,
        Content
      >, Workflo.Store.GroupConstructorKeys>
    > (
      PageElementGroup,
      {
        content,
        store: this,
      },
    );
  }

  /**
   * Retrieves an instance of a ValuePageElementGroup from the store.
   *
   * The group functions (state check -> hasXXX/hasAnyXXX/containsXXX, state retrieval -> getXXX) supported by the
   * retrieved ValuePageElementGroup are defined in Workflo.IValueElementNode.
   *
   * @param content an object whose keys are the names of PageNodes managed by the ValuePageElementGroup and whose
   * values are instances of these PageNodes
   * @param opts the publicly available options used to configure the retrieved ValuePageElementGroup
   * @returns an instance of the retrieved PageElementGroup
   */
  ValueGroup<Content extends Record<string, Workflo.PageNode.IPageNode>>(
    content: Content,
  ) {
    return this._getGroup<
      this,
      Content,
      ValuePageElementGroup<this, Content>,
      Pick<IValuePageElementGroupOpts<
        this, Content
      >, Workflo.Store.GroupConstructorKeys>
    > (
      ValuePageElementGroup,
      {
        content,
        store: this,
      },
    );
  }

// Functions to retrieve PageNode instances

  /**
   * Creates or retrieves a cached version of a PageNode instance with the given selector, type and opts.
   *
   * If a page element with identical parameters already exists in this store,
   * a cached instance of this page element will be returned.
   *
   * @template Type type of the retrieved PageElement instance
   * @template Opts type of the opts parameter passed to the constructor of the retrieved PageNode instance
   * @param selector the selector of the retrieved PageNode
   * @param type the constructor function of the retrieved PageNode instance
   * @param opts the opts parameter passed to the constructor of the retrieved PageNode instance
   */
  private _get<
    Type,
    Opts
  >(
    selector: Workflo.XPath,
    type: { new(selector: string, opts: Opts): Type },
    opts: Opts = Object.create(Object.prototype),
    afterConstruction?: (instance: Type) => void,
  ) : Type {
    const _selector = (selector instanceof XPathBuilder) ? this._xPathBuilder.build() : selector;

    // catch: selector must not contain |
    if (_selector.indexOf('|||') > -1) {
      throw new Error(`Selector must not contain character sequence '|||': ${_selector}`);
    }

    const id = `${_selector}|||${type}|||${opts.toString()}`;

    if (!(id in this._instanceCache)) {
      const result = new type(_selector, opts);

      if (typeof afterConstruction !== 'undefined') {
        afterConstruction(result);
      }

      this._instanceCache[id] = result;
    }

    return this._instanceCache[id];
  }

  /**
   * Creates or retrieves a cached version of a PageElement instance.
   *
   * @template ElementType type of the retrieved PageElement instance
   * @template ElementOpts type of the opts parameter passed to the constructor of the retrieved PageElement instance
   * @param selector the XPath selector of the retrieved PageElement instance
   * @param type the constructor function of the retrieved PageElement instance
   * @param opts the opts parameter passed to the constructor of the retrieved PageElement instance
   */
  protected _getElement<
    ElementType extends PageElement<this>,
    ElementOptions,
  >(
    selector: Workflo.XPath,
    type: { new(selector: string, opts: ElementOptions): ElementType },
    opts: ElementOptions = Object.create(Object.prototype),
  ) : ElementType {
    return this._get(selector, type, opts);
  }

  /**
   * Creates or retrieves a cached version of a PageElementList instance.
   *
   * @template ListType type of the retrieved PageElementList instance
   * @template ListOptions type of the opts parameter passed to the constructor of the retrieved PageElementList
   * instance
   * @param selector the XPath selector of the retrieved PageElementList instance
   * @param type the constructor function of the retrieved PageElementList instance
   * @param opts the opts parameter passed to the constructor of the retrieved PageElementList instance
   */
  protected _getList<
    ListType extends PageElementList<this, any, any>,
    ListOptions,
  >(
    selector: Workflo.XPath,
    type: { new(selector: string, opts: ListOptions): ListType },
    opts: ListOptions = Object.create(Object.prototype),
  ) : ListType {
    return this._get(selector, type, opts, instance => {
      const cloneFunc: CloneFunc<ListType> = cloneSelector => {
        if (!cloneSelector) {
          cloneSelector = selector;
        }

        return this._getList<ListType, ListOptions>(cloneSelector, type, opts);
      };

      instance.init(cloneFunc);
    });
  }

  /**
   * Creates or retrieves a cached version of a PageElementMap instance.
   *
   * @template MapType type of the retrieved PageElementMap instance
   * @template MapOptions type of the opts parameter passed to the constructor of the retrieved PageElementMap instance
   * @param selector the XPath selector of the retrieved PageElementMap instance
   * @param type the constructor function of the retrieved PageElementMap instance
   * @param opts the opts parameter passed to the constructor of the retrieved PageElementMap instance
   */
  protected _getMap<
    K extends string,
    MapType extends PageElementMap<this, K, any, any>,
    MapOptions extends IPageElementMapOpts<this, K, any, any>
  >(
    selector: Workflo.XPath,
    type: { new(selector: string, opts: MapOptions): MapType },
    opts: MapOptions = Object.create(Object.prototype),
  ) : MapType {
    return this._get(selector, type, opts);
  }

  /**
   * Creates or retrieves a cached version of a PageElementGroup instance.
   *
   * @template Store type of the PageElementGroup's PageNodeStore
   * @template GroupType type of the retrieved PageElementGroup instance
   * @template GroupOptions type of the opts parameter passed to the constructor of the retrieved PageElementGroup
   * instance
   * @param type the constructor function of the retrieved PageElementGroup instance
   * @param opts the opts parameter passed to the constructor of the retrieved PageElementGroup instance
   */
  protected _getGroup<
    Store extends PageNodeStore,
    Content extends {[key: string] : Workflo.PageNode.IPageNode},
    GroupType extends PageElementGroup<
      Store,
      Content
    >,
    GroupOptions extends Pick<IPageElementGroupOpts<
      Store,
      Content
    >, Workflo.Store.GroupConstructorKeys >
  > (
    type: { new(id: string, opts: IPageElementGroupOpts<Store, Content>): GroupType },
    opts: GroupOptions,
  ) : GroupType {

    // Build id from group's elements' ids.
    // If two groups have the same content,
    // they are the same.
    let idStr = '';

    for (const key in opts.content) {
      if (opts.content.hasOwnProperty(key)) {
        idStr += `${opts.content[key].__getNodeId()};`;
      }
    }

    const key = `${type.name}:${idStr}`;

    if (!(key in this._instanceCache)) {
      this._instanceCache[key] = new type(idStr, opts);
    }

    return this._instanceCache[key];
  }
}

export const pageNode = new PageNodeStore();
