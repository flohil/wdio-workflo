import { pageObjects as core } from 'wdio-workflo'

import { PageElementStore } from '../stores'

/**
 * This interface can be used to extend wdio-workflo's IPageElementOpts interface.
 * It is supposed to serve as the base IPageElementOpts interface throughout your project.
 *
 * IPageElementOpts describes the opts parameter passed to the constructor function of PageElement.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 */
export interface IPageElementOpts<
  Store extends PageElementStore
> extends core.elements.IPageElementOpts<Store> {}

 /**
 * This class can be used to extend or customize the functionality provided by wdio-workflo's PageElement class.
 * It is supposed to serve as the base PageElement class throughout your project.
 *
 * PageElement is the main building block for all page objects.
 *
 * Modern websites are usually built with reusable components (eg. in React or Angular) which provide a consistent
 * structure of the component's HTML elements and their behavior.
 *
 * The goal of PageElements is to also benefit from these advantages by recreating website components as testing
 * components. To do so, PageElement maps the structure of a website's components and provides an api to interact
 * with them.
 *
 * A big pitfall of scripted browser testing is that a website and its building blocks need to be loaded and rendered
 * before they can be interacted with and all of this takes time. Therefore, browser based tests constantly need to wait
 * for elements of a page to be loaded and rendered or for certain conditions to be met.
 *
 * PageElements try to overcome these hurdles be performing an "initial waiting condition" before interacting with
 * elements on the page. The supported initial wait conditions include:
 *
 * - 'exist' to wait for an element to exist in the DOM
 * - 'visible' to wait for an element to become visible in the viewport (not obscured by other elements, not set to
 * 'hidden', not outside of the viewport...)
 * - 'text' to wait for an element to have any text
 *
 * All public functions/actions defined on the PageElement class that interact with an element on the page or that
 * retrieve or check an element's state automatically wait for this initial wait condition to become true before
 * proceeding with any other functionality.
 *
 * PageElement furthermore provides three apis to:
 *
 * - `.currently`: retrieve or check the current state
 * - `.wait`: wait for a certain state
 * - `.eventually`: check if a certain state is eventually reached within a specific timeout.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 */
export class PageElement<Store extends PageElementStore> extends core.elements.PageElement<Store> {

  readonly currently: PageElementCurrently<Store, this>
  readonly wait: PageElementWait<Store, this>
  readonly eventually: PageElementEventually<Store, this>

 /**
  * PageElement serves as the main building block for all page objects.
  *
  * Modern websites are usually built with reusable components (eg. in React or Angular) which provide a consistent
  * structure of the component's HTML elements and their behavior.
  *
  * The goal of PageElements is to also benefit from these advantages by recreating website components as testing
  * components. To do so, PageElement maps the structure of a website's components and provides an api to interact
  * with them.
  *
  * A big pitfall of scripted browser testing is that a website and its building blocks need to be loaded and rendered
  * before they can be interacted with and all of this takes time. Therefore, browser based tests constantly need to wait
  * for elements of a page to be loaded and rendered or for certain conditions to be met.
  *
  * PageElements try to overcome these hurdles be performing an "initial waiting condition" before interacting with
  * elements on the page. The supported initial wait conditions include:
  *
  * - 'exist' to wait for an element to exist in the DOM
  * - 'visible' to wait for an element to become visible in the viewport (not obscured by other elements, not set to
  * 'hidden', not outside of the viewport...)
  * - 'text' to wait for an element to have any text
  * - 'value' to wait for an element to have any value
  *
  * Functions/actions defined on the PageElement class that interact with an element on the page or that retrieve or
  * check an element's state automatically wait for this initial wait condition to become true before proceeding with
  * any other functionality.
  *
  * PageElement furthermore provides three apis to:
  *
  * - `.currently`: retrieve or check the current state
  * - `.wait`: wait for a certain state
  * - `.eventually`: check if a certain state is eventually reached within a specific timeout.
  *
  * @param selector the XPath selector used to identify PageElement on the page
  * @param opts the options used to configure PageElement
  */
  constructor(selector: string, opts?: IPageElementOpts<Store>) {
    super(selector, opts)

    this.currently = new PageElementCurrently(this)
    this.wait = new PageElementWait(this)
    this.eventually = new PageElementEventually(this)
  }
}

/**
 * This class can be used to extend or customize the functionality provided by wdio-workflo's PageElementCurrently
 * class. It is supposed to serve as the base PageElementCurrently class throughout your project.
 *
 * PageElementCurrently defines all `currently` functions of PageElement.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementCurrently defines all `currently` functions
 */
export class PageElementCurrently<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>
> extends core.elements.PageElementCurrently<Store, PageElementType> {}

/**
 * This class can be used to extend or customize the functionality provided by wdio-workflo's PageElementWait
 * class. It is supposed to serve as the base PageElementWait class throughout your project.
 *
 * PageElementWait defines all `wait` functions of PageElement.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementWait defines all `wait` functions
 */
export class PageElementWait<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>
> extends core.elements.PageElementWait<Store, PageElementType> {}

/**
 * This class can be used to extend or customize the functionality provided by wdio-workflo's PageElementEventually
 * class. It is supposed to serve as the base PageElementEventually class throughout your project.
 *
 * PageElementEventually defines all `eventually` functions of PageElement.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementEventually defines all `eventually` functions
 */
export class PageElementEventually<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>
> extends core.elements.PageElementEventually<Store, PageElementType> {}