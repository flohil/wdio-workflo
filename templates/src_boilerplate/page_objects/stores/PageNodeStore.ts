import { pageObjects as core } from 'wdio-workflo'
import { IPageElementOpts, PageElement } from '../page_elements';

 /**
 * This class can be used to extend or customize the functionality provided by wdio-workflo's PageNodeStore class.
 * It is supposed to serve as the base PageNodeStore class throughout your project.
 *
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
export class PageNodeStore extends core.stores.PageNodeStore {

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
    options?: Workflo.PickPartial<
      core.elements.IPageElementListOpts<
        this, PageElement<this>, Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>
      >,
      Workflo.Store.ListPublicKeys,
      Workflo.Store.ListPublicPartialKeys
    >
  ) {
    return this.List(
      selector,
      {
        elementOpts: {},
        elementStoreFunc: this.Element,
        ...options
      }
    )
  }

  /**
   * Retrieves an instance of a PageElementList from the store that manages PageElement instances of the type
   * PageElement.
   *
   * The waitType of the PageElements managed by PageElementList and the waitType of the list itself are set to 'exist'
   * by default.
   *
   * @param selector the XPath selector of the retrieved PageElementList
   * @param opts the publicly available options used to configure the retrieved PageElementList
   * @returns an instance of the retrieved PageElementList
   */
  ExistElementList(
    selector: Workflo.XPath,
    options?: Workflo.PickPartial<
      core.elements.IPageElementListOpts<this, PageElement<this>, Pick<IPageElementOpts<this>, "timeout">>,
      Exclude<Workflo.Store.ListPublicKeys, "waitType">,
      Workflo.Store.ListPublicPartialKeys
    >
  ) {
    return this.List(
      selector,
      {
        elementOpts: {},
        elementStoreFunc: this.ExistElement,
        waitType: Workflo.WaitType.exist,
        ...options
      }
    )
  }

// MAPS

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
    options: Workflo.PickPartial<
      core.elements.IPageElementMapOpts<
        this, K, PageElement<this>, Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>
      >,
      Workflo.Store.MapPublicKeys,
      Workflo.Store.MapPublicPartialKeys
    >
  ) {
    return this.Map(
      selector,
      {
        elementStoreFunc: this.Element,
        elementOpts: {},
        ...options
      }
    )
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
    options: Workflo.PickPartial<
      core.elements.IPageElementMapOpts<
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
        elementOpts: {},
        ...options
      }
    )
  }
}