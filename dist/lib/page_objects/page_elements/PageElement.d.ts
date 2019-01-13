/// <reference types="webdriverio" />
import { PageElementBase, IPageElementBaseOpts, PageElementBaseCurrently, PageElementBaseWait, PageElementBaseEventually } from '.';
import { PageNodeStore } from '../stores';
/**
 * Describes the opts parameter passed to the constructor function of PageElement.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 */
export interface IPageElementOpts<Store extends PageNodeStore> extends IPageElementBaseOpts<Store> {
    /**
     * This interface is used in the parameters of scrollTo and click actions of PageElement.
     * It allows you to scroll a PageElement that resides inside a scrollable container into view.
     */
    customScroll?: Workflo.IScrollParams;
}
/**
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
 * - 'visible' to wait for an element to become visible (not obscured by other elements, not set to 'hidden')
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
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 */
export declare class PageElement<Store extends PageNodeStore> extends PageElementBase<Store> implements Workflo.PageNode.IElementNode<string, boolean, boolean> {
    /**
     * stores the default custom scrolling behaviour
     */
    protected _customScroll: Workflo.IScrollParams;
    readonly currently: PageElementCurrently<Store, this>;
    readonly wait: PageElementWait<Store, this>;
    readonly eventually: PageElementEventually<Store, this>;
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
      * - 'visible' to wait for an element to become visible(not obscured by other elements, not set to 'hidden'...)
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
    constructor(selector: string, { customScroll, ...superOpts }: IPageElementOpts<Store>);
    /**
     * For internal use only in order to retrieve an Element's Store type!
     *
     * @ignore
     */
    readonly __$: Store;
    /**
     * Returns true if `actual` equals `expected`.
     *
     * By default, the comparison is only implemented for the type `string`.
     * If the comparison is not implemented for the type of `actual` and `expected`, an error will be thrown.
     *
     * @template T the type of both `actual` and `expected`
     * @param actual an actual value retrieved from the page's state
     * @param expected an expected value
     */
    __equals<T>(actual: T, expected: T): boolean;
    /**
     * Returns true if `actual` has any value.
     *
     * By default, the comparison is only implemented for the type `string`.
     * If the comparison is not implemented for the type of `actual`, an error will be thrown.
     *
     * @template T the type of `actual`
     * @param actual an actual value retrieved from the page's state
     */
    __any<T>(actual: T): boolean;
    /**
     * Returns true if `actual` contains `expected`.
     *
     * By default, the comparison is only implemented for the type `string`.
     * If the comparison is not implemented for the type of `actual` and `expected`, an error will be thrown.
     *
     * @template T the type of both `actual` and `expected`
     * @param actual an actual value retrieved from the page's state
     * @param expected an expected value
     */
    __contains<T>(actual: T, expected: T): boolean;
    /**
     * Converts `value` to the type `string`.
     *
     * By default, the comparison is only implemented for the types `string`, `number` and `undefined` and for the value
     * `null`.
     * If the comparison is not implemented for the type of `value`, an error will be thrown.
     *
     * @param value the value whose type should be converted
     */
    __typeToString<T>(value: T): string;
    /**
     * Fetches the first webdriverio element from the HTML page that is identified by PageElement's XPath selector without
     * performing PageElement's initial waiting condition.
     */
    protected readonly __element: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element>> & WebdriverIO.RawResult<WebdriverIO.Element>;
    /**
     * Fetches the first webdriverio element from the HTML page that is identified by PageElement's XPath selector after
     * performing PageElement's initial waiting condition.
     */
    readonly element: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element>> & WebdriverIO.RawResult<WebdriverIO.Element>;
    /**
     * This function performs PageElement's initial waiting condition.
     *
     * It supports the following waiting types:
     *
     * - 'exist' to wait for an element to exist in the DOM
     * - 'visible' to wait for an element to become visible (not obscured by other elements, not set to 'hidden'...)
     * - 'text' to wait for an element to have any text
     *
     * @returns this (an instance of PageElement)
     */
    initialWait(): this;
    /**
     * Returns true if the PageElement is enabled after performing the initial waiting condition.
     */
    getIsEnabled(): boolean;
    /**
     * Returns PageElement's HTML after performing the initial waiting condition.
     */
    getHTML(): string;
    /**
     * Returns PageElement's direct text after performing the initial waiting condition.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     */
    getDirectText(): string;
    /**
     * Returns PageElement's text after performing the initial waiting condition.
     */
    getText(): string;
    /**
     * Returns PageElement's HTML attribute with the passed attribute name after performing the initial waiting condition.
     *
     * @param attributeName the name of the HTML attribute whose value should be returned
     */
    getAttribute(attributeName: string): string;
    /**
     * Returns the value of PageElement's 'class' HTML attribute after performing the initial waiting condition.
     */
    getClass(): string;
    /**
     * Returns the value of PageElement's 'id' HTML attribute after performing the initial waiting condition.
     */
    getId(): string;
    /**
     * Returns the value of PageElement's 'name' HTML attribute after performing the initial waiting condition.
     */
    getName(): string;
    /**
     * Returns the location of PageElement in pixels after performing the initial waiting condition.
     */
    getLocation(): Workflo.ICoordinates;
    /**
     * Returns the X-location of PageElement in pixels after performing the initial waiting condition.
     */
    getX(): number;
    /**
     * Returns the Y-location of PageElement in pixels after performing the initial waiting condition.
     */
    getY(): number;
    /**
     * Returns the size of PageElement in pixels after performing the initial waiting condition.
     */
    getSize(): Workflo.ISize;
    /**
     * Returns the width of PageElement in pixels after performing the initial waiting condition.
     */
    getWidth(): number;
    /**
     * Returns the height of PageElement in pixels after performing the initial waiting condition.
     */
    getHeight(): number;
    /**
     * Returns a PageElement's 'hasText' status after performing the initial waiting condition.
     *
     * A PageElement's 'hasText' status is set to true if its actual text equals the expected text.
     *
     * @param text the expected text used in the comparison which sets the 'hasText' status
     */
    getHasText(text: string): boolean;
    /**
     * Returns a PageElement's 'hasAnyText' status after performing the initial waiting condition.
     *
     * A PageElement's 'hasAnyText' status is set to true if it has any text.
     */
    getHasAnyText(): boolean;
    /**
     * Returns a PageElement's 'containsText' status after performing the initial waiting condition.
     *
     * A PageElement's 'containsText' status is set to true if its actual text contains the expected text.
     *
     * @param text the expected text used in the comparison which sets the 'containsText' status
     */
    getContainsText(text: string): boolean;
    /**
     * Returns a PageElement's 'hasDirectText' status after performing the initial waiting condition.
     *
     * A PageElement's 'hasDirectText' status is set to true if its actual direct text equals the expected direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     *@param directText the expected direct text used in the comparison which sets the 'hasDirectText' status
     */
    getHasDirectText(directText: string): boolean;
    /**
     * Returns a PageElement's 'hasAnyDirectText' status after performing the initial waiting condition.
     *
     * A PageElement's 'hasAnyDirectText' status is set to true if it has any direct text.
     */
    getHasAnyDirectText(): boolean;
    /**
     * Returns a PageElement's 'containsDirectText' status after performing the initial waiting condition.
     *
     * A PageElement's 'containsDirectText' status is set to true if its actual direct text contains the expected direct
     * text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text used in the comparison which sets the 'containsDirectText' status
     */
    getContainsDirectText(directText: string): boolean;
    /**
       * Clicks on PageElement after performing PageElement's initial waiting condition.
       *
       * Before clicking on PageElement, it is scrolled into the viewport.
       *
       * If the clicked HTML element is obscured by another HTML element, the click will be repeated
       * until the clicked HTML element is no longer obscured and can therefore receive the click or until a specific
       * timeout is reached.
       *
       * If a postCondition is defined in `click`'s options, the click will be repeated until the postCondition function
       * returns true or until a specific timeout is reached.
       *
       * @param options configures the scrolling behavior
       * @returns this (an instance of PageElement)
       */
    click(options?: Workflo.IClickOpts): this;
    /**
     * Scrolls PageElement into view if PageElement resides in a scrollable container.
     *
     * Does not perform the initial waiting condition.
     *
     * @param params configures the scrolling behavior
     * @returns this (an instance of PageElement)
     */
    protected _scrollTo(params: Workflo.IScrollParams): Workflo.IScrollResult;
    /**
     * Scrolls PageElement into view if PageElement resides in a scrollable container after performing the initial waiting
     * condition.
     *
     * @param params configures the scrolling behavior
     * @returns this (an instance of PageElement)
     */
    scrollTo(params: Workflo.IScrollParams): this;
    /**
     * Executes func after initial wait and, if an error occurs during execution of func,
     * throws a custom error message that the page element could not be located on the page.
     *
     * @template ResultType the type of the executed function's result
     * @param func the function to be executed after performing the initial wait condition
     */
    protected _executeAfterInitialWait<ResultType>(func: () => ResultType): ResultType;
}
/**
 * This class defines all `currently` functions of PageElement.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementCurrently defines all `currently` functions
 */
export declare class PageElementCurrently<Store extends PageNodeStore, PageElementType extends PageElement<Store>> extends PageElementBaseCurrently<Store, PageElementType> {
    /**
     * Returns true if PageElement currently exists.
     */
    getExists(): boolean;
    /**
     * Returns true if PageElement is currently visible.
     */
    getIsVisible(): boolean;
    /**
     * Returns true if PageElement is currently enabled.
     */
    getIsEnabled(): boolean;
    /**
     * Returns PageElement's current HTML.
     *
     * Overwriting this function affects the behavior of the functions `getHTML`, `hasHTML`, `containsHTML` and
     * `hasAnyHTML` in PageElement and its `currently`, `wait` and `eventually` APIs.
     */
    getHTML(): string;
    /**
     * Returns PageElement's current direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * Overwriting this function affects the behavior of the functions `getDirectText`, `hasDirectText`,
     * `containsDirectText` and `hasAnyDirectText` in PageElement and its `currently`, `wait` and `eventually` APIs.
     */
    getDirectText(): string;
    /**
     * Returns PageElement's current text.
     *
     * Overwriting this function affects the behavior of the functions `getText`, `hasText`, `containsText` and
     * `hasAnyText` in PageElement and its `currently`, `wait` and `eventually` APIs.
     */
    getText(): string;
    /**
     * Returns the current value of PageElement's HTML attribute with the passed attribute name.
     *
     * Overwriting this function affects the behavior of the functions `getAttribute`, `hasAttribute`, `containsAttribute`
     * and `hasAnyAttribute` in PageElement and its `currently`, `wait` and `eventually` APIs.
     *
     * @param attributeName the name of the HTML attribute whose current value should be returned
     */
    getAttribute(attributeName: string): string;
    /**
     * Returns the current value of PageElement's 'class' HTML attribute.
     *
     * Overwriting this function affects the behavior of the functions `getClass`, `hasClass`, `containsClass` and
     * `hasAnyClass` in PageElement and its `currently`, `wait` and `eventually` APIs.
     */
    getClass(): string;
    /**
     * Returns the current value of PageElement's 'id' HTML attribute.
     *
     * Overwriting this function affects the behavior of the functions `getId`, `hasId`, `containsId` and
     * `hasAnyId` in PageElement and its `currently`, `wait` and `eventually` APIs.
     */
    getId(): string;
    /**
     * Returns the current value of PageElement's 'name' HTML attribute.
     *
     * Overwriting this function affects the behavior of the functions `getName`, `hasName`, `containsName` and
     * `hasAnyName` in PageElement and its `currently`, `wait` and `eventually` APIs.
     */
    getName(): string;
    /**
     * Returns the current location of PageElement in pixels.
     *
     * Overwriting this function affects the behavior of the functions `getLocation`, `hasLocation`, `containsLocation`
     * and `hasAnyLocation` in PageElement and its `currently`, `wait` and `eventually` APIs.
     */
    getLocation(): Workflo.ICoordinates;
    /**
     * Returns the current X-location of PageElement in pixels.
     *
     * Overwriting this function affects the behavior of the functions `getX`, `hasX`, `containsX`
     * and `hasAnyX` in PageElement and its `currently`, `wait` and `eventually` APIs.
     */
    getX(): number;
    /**
     * Returns the current Y-location of PageElement in pixels.
     *
     * Overwriting this function affects the behavior of the functions `getY`, `hasY`, `containsY`
     * and `hasAnyY` in PageElement and its `currently`, `wait` and `eventually` APIs.
     */
    getY(): number;
    /**
     * Returns the current size of PageElement in pixels.
     *
     * Overwriting this function affects the behavior of the functions `getSize`, `hasSize`, `containsSize`
     * and `hasAnySize` in PageElement and its `currently`, `wait` and `eventually` APIs.
     */
    getSize(): Workflo.ISize;
    /**
     * Returns the current width of PageElement in pixels.
     *
     * Overwriting this function affects the behavior of the functions `getWidth`, `hasWidth`, `containsWidth`
     * and `hasAnyWidth` in PageElement and its `currently`, `wait` and `eventually` APIs.
     */
    getWidth(): number;
    /**
     * Returns the current height of PageElement in pixels.
     *
     * Overwriting this function affects the behavior of the functions `getHeight`, `hasHeight`, `containsHeight`
     * and `hasAnyHeight` in PageElement and its `currently`, `wait` and `eventually` APIs.
     */
    getHeight(): number;
    /**
     * Returns PageElement's current 'hasText' status.
     *
     * A PageElement's 'hasText' status is set to true if its actual text equals the expected text.
     *
     * @param text the expected text used in the comparison which sets the 'hasText' status
     */
    getHasText(text: string): boolean;
    /**
     * Returns PageElement's current 'hasAnyText' status.
     *
     * A PageElement's 'hasAnyText' status is set to true if it has any text.
     */
    getHasAnyText(): boolean;
    /**
     * Returns PageElement's current 'containsText' status.
     *
     * A PageElement's 'containsText' status is set to true if its actual text contains the expected text.
     *
     * @param text the expected text used in the comparison which sets the 'containsText' status
     */
    getContainsText(text: string): boolean;
    /**
     * Returns PageElement's current 'hasDirectText' status.
     *
     * A PageElement's 'hasDirectText' status is set to true if its actual direct text equals the expected direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text used in the comparison which sets the 'hasDirectText' status
     */
    getHasDirectText(directText: string): boolean;
    /**
     * Returns PageElement's current 'hasAnyDirectText' status.
     *
     * A PageElement's 'hasAnyDirectText' status is set to true if it has any direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     */
    getHasAnyDirectText(): boolean;
    /**
     * Returns PageElement's current 'containsDirectText' status.
     *
     * A PageElement's 'containsDirectText' status is set to true if its actual direct text contains the expected direct
     * text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text used in the comparison which sets the 'containsDirectText' status
     */
    getContainsDirectText(directText: string): boolean;
    /**
     * Returns true if PageElement currently exists.
     *
     * Overwriting this function affects the behavior of the function `exists` in PageElement and its `currently`,
     * `wait` and `eventually` APIs.
     */
    exists(): boolean;
    /**
     * Returns true if PageElement is currently visible.
     *
     * Overwriting this function affects the behavior of the function `isVisible` in PageElement and its `currently`,
     * `wait` and `eventually` APIs.
     */
    isVisible(): boolean;
    /**
     * Returns true if PageElement is currently enabled.
     *
     * Overwriting this function affects the behavior of the function `isEnabled` in PageElement and its `currently`,
     * `wait` and `eventually` APIs.
     */
    isEnabled(): boolean;
    /**
     * Returns true if PageElement is currently selected.
     *
     * Overwriting this function affects the behavior of the function `isSelected` in PageElement and its `currently`,
     * `wait` and `eventually` APIs.
     */
    isSelected(): boolean;
    /**
     * Returns true if PageElement is currently checked.
     *
     * Overwriting this function affects the behavior of the function `isChecked` in PageElement and its `currently`,
     * `wait` and `eventually` APIs.
     */
    isChecked(): boolean;
    /**
     * Returns true if the PageElement's actual text currently equals the expected text.
     *
     * @param text the expected text which is supposed to equal the actual text
     */
    hasText(text: string): boolean;
    /**
     * Returns true if the PageElement currently has any Text.
     */
    hasAnyText(): boolean;
    /**
     * Returns true if the PageElement's actual text currently contains the expected text.
     *
     * @param text the expected text which is supposed to be contained in the actual text
     */
    containsText(text: string): boolean;
    /**
     * Returns true if the PageElement's actual HTML currently equals the expected HTML.
     *
     * @param html the expected HTML which is supposed to equal the actual HTML
     */
    hasHTML(html: string): boolean;
    /**
     * Returns true if the PageElement currently has any HTML.
     */
    hasAnyHTML(): boolean;
    /**
     * Returns true if the PageElement's actual HTML currently contains the expected HTML.
     *
     * @param text the expected HTML which is supposed to be contained in the actual HTML
     */
    containsHTML(html: string): boolean;
    /**
     * Returns true if the PageElement's actual direct text currently equals the expected direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text which is supposed to equal the actual direct text
     */
    hasDirectText(directText: string): boolean;
    /**
     * Returns true if the PageElement currently has any direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     */
    hasAnyDirectText(): boolean;
    /**
     * Returns true if the PageElement's actual direct text currently contains the expected direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text which is supposed to be contained in the actual direct text
     */
    containsDirectText(directText: string): boolean;
    /**
     * Returns true if the specified HTML attribute of PageElement currently has the expected value.
     *
     * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value it
     * is expected to have
     */
    hasAttribute(attribute: Workflo.IAttribute): boolean;
    /**
     * Returns true if the HTML attribute with the specified attributeName of PageElement currently has any value.
     *
     * @param attributeName the name of a PageElement's HTML attribute which is supposed to have any value
     */
    hasAnyAttribute(attributeName: string): boolean;
    /**
     * Returns true if the specified HTML attribute of PageElement currently contains the expected value.
     *
     * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value it
     * is expected to contain
     */
    containsAttribute(attribute: Workflo.IAttribute): boolean;
    /**
     * Returns true if the HTML attribute 'class' of PageElement currently has the specified className.
     *
     * @param className the className which the HTML attribute 'class' of PageElement is supposed to have
     */
    hasClass(className: string): boolean;
    /**
     * Returns true if the HTML attribute 'class' of PageElement currently has any className.
     */
    hasAnyClass(): boolean;
    /**
    * Returns true if the HTML attribute 'class' of PageElement currently contains the specified className.
    *
    * @param className the className which the HTML attribute 'class' of PageElement is supposed to contain
    */
    containsClass(className: string): boolean;
    /**
     * Returns true if the HTML attribute 'id' of PageElement currently has the specified value.
     *
     * @param id the value which the HTML attribute 'id' of PageElement is supposed to have
     */
    hasId(id: string): boolean;
    /**
     * Returns true if the HTML attribute 'id' of PageElement currently has any value.
     */
    hasAnyId(): boolean;
    /**
     * Returns true if the HTML attribute 'id' of PageElement currently contains the specified value.
     *
     * @param id the value which the HTML attribute 'id' of PageElement is supposed to contain
     */
    containsId(id: string): boolean;
    /**
     * Returns true if the HTML attribute 'name' of PageElement currently has the specified value.
     *
     * @param name the value which the HTML attribute 'name' of PageElement is supposed to have
     */
    hasName(name: string): boolean;
    /**
     * Returns true if the HTML attribute 'name' of PageElement currently has any value.
     */
    hasAnyName(): boolean;
    /**
     * Returns true if the HTML attribute 'name' of PageElement currently contains the specified value.
     *
     * @param name the value which the HTML attribute 'name' of PageElement is supposed to contain
     */
    containsName(name: string): boolean;
    /**
     * Returns true if - currently - the location of PageElement matches the specified coordinates or if its location deviates
     * no more than the specified tolerances from the specified coordinates.
     *
     * @param coordinates the expected coordinates of PageElement
     * @param tolerances used to calculate the maximal allowed deviations from the expected coordinates
     */
    hasLocation(coordinates: Workflo.ICoordinates, tolerances?: Partial<Workflo.ICoordinates>): boolean;
    /**
     * Returns true if - currently - the x-location of PageElement matches the specified x-location or if PageElement's
     * x-location deviates no more than the specified tolerance from the specified x-location.
     *
     * @param x the expected x-location of PageElement
     * @param tolerance used to calculate the maximal allowed deviation from the expected x-location
     */
    hasX(x: number, tolerance?: number): boolean;
    /**
     * Returns true if - currently - the y-location of PageElement matches the specified y-location or if PageElement's
     * y-location deviates no more than the specified tolerance from the specified y-location.
     *
     * @param y the expected y-location of PageElement
     * @param tolerance used to calculate the maximal allowed deviation from the expected y-location
     */
    hasY(y: number, tolerance?: number): boolean;
    /**
    * Returns true if - currently - the size of PageElement matches the specified size or if PageElement's size deviates no
    * more than the specified tolerances from the specified size.
    *
    * @param size the expected size of PageElement
    * @param tolerances used to calculate the maximal allowed deviations from the expected size
    */
    hasSize(size: Workflo.ISize, tolerances?: Partial<Workflo.ISize>): boolean;
    /**
     * Returns true if - currently - the width of PageElement matches the specified width or if PageElement's width deviates no
     * more than the specified tolerance from the specified width.
     *
     * @param width the expected width of PageElement
     * @param tolerance used to calculate the maximal allowed deviation from the expected width
     */
    hasWidth(width: number, tolerance?: number): boolean;
    /**
     * Returns true if - currently - the height of PageElement matches the specified height or if PageElement's height deviates no
     * more than the specified tolerance from the specified height.
     *
     * @param height the expected height of PageElement
     * @param tolerance used to calculate the maximal allowed deviation from the expected height
     */
    hasHeight(height: number, tolerance?: number): boolean;
    /**
     * returns the negated variants of PageElementCurrently's state check functions
     */
    readonly not: {
        /**
         * Returns true if PageElement currently does not exist.
         */
        exists: () => boolean;
        /**
         * Returns true if PageElement is currently not visible.
         */
        isVisible: () => boolean;
        /**
         * Returns true if PageElement is currently not enabled.
         */
        isEnabled: () => boolean;
        /**
         * Returns true if PageElement is currently not selected.
         */
        isSelected: () => boolean;
        /**
         * Returns true if PageElement is currently not checked.
         */
        isChecked: () => boolean;
        /**
         * Returns true if the PageElement's actual text currently does not equal the expected text.
         *
         * @param text the expected text which is supposed not to equal the actual text
         */
        hasText: (text: string) => boolean;
        /**
         * Returns true if the PageElement currently does not have any text.
         */
        hasAnyText: () => boolean;
        /**
         * Returns true if the PageElement's actual text currently does not contain the expected text.
         *
         * @param text the expected text which is supposed not to be contained in the actual text
         */
        containsText: (text: string) => boolean;
        /**
         * Returns true if the PageElement's actual direct text currently does not equal the expected direct text.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directText the expected direct text which is supposed not to equal the actual direct text
         */
        hasDirectText: (directText: string) => boolean;
        /**
         * Returns true if the PageElement currently does not have any direct text.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         */
        hasAnyDirectText: () => boolean;
        /**
         * Returns true if the PageElement's actual direct text currently does not contain the expected direct text.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directText the expected direct text which is supposed not to be contained in the actual direct text
         */
        containsDirectText: (directText: string) => boolean;
        /**
         * Returns true if the PageElement's actual HTML currently does not equal the expected HTML.
         *
         * @param html the expected HTML which is supposed not to equal the actual HTML
         */
        hasHTML: (html: string) => boolean;
        /**
         * Returns true if the PageElement currently does not have any HTML.
         */
        hasAnyHTML: () => boolean;
        /**
         * Returns true if the PageElement's actual HTML currently does not contain the expected HTML.
         *
         * @param text the expected HTML which is supposed not to be contained in the actual HTML
         */
        containsHTML: (html: string) => boolean;
        /**
         * Returns true if the specified HTML attribute of PageElement currently does not have the expected value.
         *
         * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value
         * it is expected not to have
         */
        hasAttribute: (attribute: Workflo.IAttribute) => boolean;
        /**
         * Returns true if the HTML attribute with the specified attributeName of PageElement currently does not have any
         * value.
         *
         * @param attributeName the name of a PageElement's HTML attribute which is supposed not to have any value
         */
        hasAnyAttribute: (attributeName: string) => boolean;
        /**
         * Returns true if the specified HTML attribute of PageElement currently does not contain the expected value.
         *
         * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value
         * it is expected not to contain
         */
        containsAttribute: (attribute: Workflo.IAttribute) => boolean;
        /**
         * Returns true if the HTML attribute 'class' of PageElement currently does not have the specified className.
         *
         * @param className the className which the HTML attribute 'class' of PageElement is supposed not to have
         */
        hasClass: (className: string) => boolean;
        /**
         * Returns true if the HTML attribute 'class' of PageElement currently does not have any className.
         */
        hasAnyClass: () => boolean;
        /**
        * Returns true if the HTML attribute 'class' of PageElement currently does not contain the specified className.
        *
        * @param className the className which the HTML attribute 'class' of PageElement is supposed not to contain
        */
        containsClass: (className: string) => boolean;
        /**
         * Returns true if the HTML attribute 'id' of PageElement currently does not have the specified value.
         *
         * @param id the value which the HTML attribute 'id' of PageElement is supposed not to have
         */
        hasId: (id: string) => boolean;
        /**
         * Returns true if the HTML attribute 'id' of PageElement currently does not have any value.
         */
        hasAnyId: () => boolean;
        /**
         * Returns true if the HTML attribute 'id' of PageElement currently does not contain the specified value.
         *
         * @param id the value which the HTML attribute 'id' of PageElement is supposed not to contain
         */
        containsId: (id: string) => boolean;
        /**
         * Returns true if the HTML attribute 'name' of PageElement currently does not have the specified value.
         *
         * @param name the value which the HTML attribute 'name' of PageElement is supposed not to have
         */
        hasName: (name: string) => boolean;
        /**
         * Returns true if the HTML attribute 'name' of PageElement currently does not have any value.
         */
        hasAnyName: () => boolean;
        /**
         * Returns true if the HTML attribute 'name' of PageElement currently does not contain the specified value.
         *
         * @param name the value which the HTML attribute 'name' of PageElement is supposed not to contain
         */
        containsName: (name: string) => boolean;
        /**
         * Returns true if - currently - the location of PageElement does not match the specified coordinates or if its
         * location deviates more than the specified tolerances from the specified coordinates.
         *
         * @param coordinates the not-expected coordinates of PageElement
         * @param tolerances used to calculate the maximal allowed deviations from the expected coordinates
         */
        hasLocation: (coordinates: Workflo.ICoordinates, tolerances?: Partial<Workflo.ICoordinates>) => boolean;
        /**
         * Returns true if - currently - the x-location of PageElement does not match the specified x-location or if
         * PageElement's x-location deviates more than the specified tolerance from the specified x-location.
         *
         * @param x the not-expected x-location of PageElement
         * @param tolerance used to calculate the maximal allowed deviation from the expected x-location
         */
        hasX: (x: number, tolerance?: number) => boolean;
        /**
         * Returns true if - currently - the y-location of PageElement does not match the specified y-location or if
         * PageElement's y-location deviates more than the specified tolerance from the specified y-location.
         *
         * @param y the not-expected y-location of PageElement
         * @param tolerance used to calculate the maximal allowed deviation from the expected y-location
         */
        hasY: (y: number, tolerance?: number) => boolean;
        /**
         * Returns true if - currently - the size of PageElement does not match the specified size or if PageElement's
         * size deviates more than the specified tolerances from the specified size.
         *
         * @param size the not-expected size of PageElement
         * @param tolerances used to calculate the maximal allowed deviations from the expected size
         */
        hasSize: (size: Workflo.ISize, tolerances?: Partial<Workflo.ISize>) => boolean;
        /**
         * Returns true if - currently - the width of PageElement does not match the specified width or if PageElement's
         * width deviates more than the specified tolerance from the specified width.
         *
         * @param width the expected width of PageElement
         * @param tolerance used to calculate the maximal allowed deviation from the expected width
         */
        hasWidth: (width: number, tolerance?: number) => boolean;
        /**
         * Returns true if - currently - the height of PageElement does not match the specified height or if PageElement's
         * height deviates more than the specified tolerance from the specified height.
         *
         * @param height the expected height of PageElement
         * @param tolerance used to calculate the maximal allowed deviation from the expected height
         */
        hasHeight: (height: number, tolerance?: number) => boolean;
    };
}
/**
 * This class defines all `wait` functions of PageElement.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementWait defines all `wait` functions
 */
export declare class PageElementWait<Store extends PageNodeStore, PageElementType extends PageElement<Store>> extends PageElementBaseWait<Store, PageElementType> {
    /**
     * Waits for PageElement to exist.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met and a `reverse` flag that, if
     * set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     *
     * @returns this (an instance of PageElement)
     */
    exists(opts?: Workflo.ITimeoutReverse): PageElementType;
    /**
     * Waits for PageElement to be visible.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met and a `reverse` flag that, if
     * set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     *
     * @returns this (an instance of PageElement)
     */
    isVisible(opts?: Workflo.ITimeoutReverse): PageElementType;
    /**
     * Waits for PageElement to be enabled.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met and a `reverse` flag that, if
     * set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     *
     * @returns this (an instance of PageElement)
     */
    isEnabled(opts?: Workflo.ITimeoutReverse): PageElementType;
    /**
     * Waits for PageElement to be selected.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met and a `reverse` flag that, if
     * set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     *
     * @returns this (an instance of PageElement)
     */
    isSelected(opts?: Workflo.ITimeoutReverse): PageElementType;
    /**
     * Waits for PageElement to be checked.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
     * some or all managed PageElements, the `timeout` within which the condition is expected to be met, the
    * `interval` used to check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    isChecked(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for PageElement's actual text to equal the expected text.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param text the expected text which is supposed to equal the actual text
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasText(text: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for PageElement to have any text.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasAnyText(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for PageElement's actual text to contain the expected text.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param text the expected text which is supposed to be contained in the actual text
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    containsText(text: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for PageElement's actual HTML value to equal the expected HTML value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param html the expected html which is supposed to equal the actual html
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasHTML(html: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for PageElement to have any HTML value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasAnyHTML(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for PageElement's actual HTML value to contain the expected HTML value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param html the expected html which is supposed to be contained in the actual html
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    containsHTML(html: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for PageElement's actual direct text to equal the expected direct text.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param text the expected direct text which is supposed to equal the actual direct text
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasDirectText(directText: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for PageElement to have any direct text.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasAnyDirectText(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for PageElement's actual direct text to contain the expected direct text.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param text the expected direct text which is supposed to be contained in the actual direct text
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    containsDirectText(directText: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the actual value of the specified HTML attribute of PageElement to equal an expected value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value
     * it is expected to have
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasAttribute(attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the actual value of the specified HTML attribute of PageElement to have any value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param attributeName the name of a PageElement's HTML attribute which is supposed to have any value
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasAnyAttribute(attributeName: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the actual value of the specified HTML attribute of PageElement to contain an expected value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value
     * it is expected to contain
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    containsAttribute(attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the actual value of PageElement's 'class' HTML attribute to equal an expected value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param className the expected value which is supposed to equal the actual value of PageElement's HTML 'class'
     * attribute
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasClass(className: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for PageElement's 'class' HTML attribute to have any value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasAnyClass(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the actual value of the PageElement's 'class' HTML attribute to contain an expected value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param className the expected value which is supposed to be contained in the actual value of PageElement's HTML
     * 'class' attribute
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    containsClass(className: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the actual value of PageElement's 'id' HTML attribute to equal an expected value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param id the expected value which is supposed to equal the actual value of PageElement's 'id' HTML attribute
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasId(id: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for PageElement's 'id' HTML attribute to have any value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasAnyId(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the actual value of PageElement's 'id' HTML attribute to contain an expected value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param id the expected value which is supposed to be contained in the actual value of PageElement's HTML 'id'
     * attribute
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    containsId(id: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the actual value of PageElement's 'name' HTML attribute to equal an expected value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param name the expected value which is supposed to equal the actual value of PageElement's 'name' HTML attribute
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasName(name: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for PageElement's 'name' HTML attribute to have any value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasAnyName(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the actual value of PageElement's 'name' HTML attribute to contain an expected value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param name the expected value which is supposed to be contained in the actual value of PageElement's HTML 'name'
     * attribute
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    containsName(name: string, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the location of PageElement to equal the expected coordinates or to deviate no more than the specified
     * tolerances from the expected coordinates.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param coordinates the expected coordinates of PageElement in pixels
     * @param opts includes the `tolerances` used to calculate the maximal allowed deviations from the expected coordinates,
     * the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasLocation(coordinates: Workflo.ICoordinates, opts?: {
        tolerances?: Partial<Workflo.ICoordinates>;
    } & Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the x-location of PageElement to equal the expected x-location or to deviate no more than the specified
     * tolerance from the expected x-location.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param x the expected x-location of PageElement in pixels
     * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected x-location,
     * the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasX(x: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the y-location of PageElement to equal the expected y-location or to deviate no more than the specified
     * tolerance from the expected y-location.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param y the expected y-location of PageElement in pixels
     * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected y-location,
     * the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasY(y: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the size of PageElement to equal the expected size or to deviate no more than the specified
     * tolerances from the expected size.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param size the expected size of PageElement in pixels
     * @param opts includes the `tolerances` used to calculate the maximal allowed deviations from the expected size,
     * the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasSize(size: Workflo.ISize, opts?: {
        tolerances?: Partial<Workflo.ISize>;
    } & Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the width of PageElement to equal the expected width or to deviate no more than the specified
     * tolerance from the expected width.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param width the expected width of PageElement in pixels
     * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected width,
     * the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasWidth(width: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for the height of PageElement to equal the expected height or to deviate no more than the specified
     * tolerance from the expected height.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param height the expected height of PageElement in pixels
     * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected height,
     * the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     *
     * @returns this (an instance of PageElement)
     */
    hasHeight(height: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Wait for PageElement to meet a certain condition.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param description describes the condition that the PageElement is expected to meet
     * @param condition the function which checks if a certain condition is met
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it
     *
     * @returns this (an instance of PageElement)
     */
    untilElement(description: string, condition: (element: PageElementType) => boolean, { timeout, interval }?: Workflo.ITimeoutInterval): PageElementType;
    /**
     * returns the negated variants of PageElementWait's state check functions
     */
    readonly not: {
        /**
         * Waits for a PageElement not to exist.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         *
         * @returns this (an instance of PageElement)
         */
        exists: (opts?: Workflo.ITimeout) => PageElementType;
        /**
         * Waits for a PageElement not to be visible.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         *
         * @returns this (an instance of PageElement)
         */
        isVisible: (opts?: Workflo.ITimeout) => PageElementType;
        /**
         * Waits for a PageElement not to be enabled.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         *
         * @returns this (an instance of PageElement)
         */
        isEnabled: (opts?: Workflo.ITimeout) => PageElementType;
        /**
         * Waits for a PageElement not to be selected.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         *
         * @returns this (an instance of PageElement)
         */
        isSelected: (opts?: Workflo.ITimeout) => PageElementType;
        /**
         * Waits for PageElement not to be checked.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
         * some or all managed PageElements, the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        isChecked: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for PageElement's actual text not to equal the expected text.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param text the expected text which is supposed not to equal the actual text
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasText: (text: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for PageElement not to have any text.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasAnyText: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for PageElement's actual text not to contain the expected text.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param text the expected text which is supposed not to be contained in the actual text
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        containsText: (text: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for PageElement's actual HTML value not to equal the expected HTML value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param html the expected html which is supposed not to equal the actual html
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasHTML: (html: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for PageElement not to have any HTML value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasAnyHTML: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for PageElement's actual HTML value not to contain the expected HTML value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param html the expected html which is supposed not to be contained in the actual html
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        containsHTML: (html: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for PageElement's actual direct text not to equal the expected direct text.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param text the expected direct text which is supposed not to equal the actual direct text
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for PageElement not to have any direct text.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for PageElement's actual direct text not to contain the expected direct text.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param text the expected direct text which is supposed not to be contained in the actual direct text
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        containsDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the actual value of the specified HTML attribute of PageElement not to equal an expected value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value
         * it is expected not to have
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the actual value of the specified HTML attribute of PageElement not to have any value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param attributeName the name of a PageElement's HTML attribute which is supposed to have any value
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasAnyAttribute: (attributeName: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the actual value of the specified HTML attribute of PageElement not to contain an expected value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value
         * it is expected not to contain
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        containsAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the actual value of PageElement's 'class' HTML attribute not to equal an expected value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param className the expected value which is supposed not to equal the actual value of PageElement's HTML 'class'
         * attribute
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasClass: (className: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for PageElement's 'class' HTML attribute not to have any value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasAnyClass: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the actual value of the PageElement's 'class' HTML attribute not to contain an expected value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param className the expected value which is supposed not to be contained in the actual value of PageElement's
         * 'class' HTML attribute
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        containsClass: (className: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the actual value of PageElement's 'id' HTML attribute not to equal an expected value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param id the expected value which is supposed not to equal the actual value of PageElement's 'id' HTML attribute
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasId: (id: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for PageElement's 'id' HTML attribute not to have any value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasAnyId: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the actual value of PageElement's 'id' HTML attribute not to contain an expected value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param id the expected value which is supposed not to be contained in the actual value of PageElement's HTML 'id'
         * attribute
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        containsId: (id: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the actual value of PageElement's 'name' HTML attribute not to equal an expected value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param name the expected value which is supposed not to equal the actual value of PageElement's HTML 'name'
         * attribute
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasName: (name: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for PageElement's 'name' HTML attribute not to have any value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasAnyName: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the actual value of PageElement's 'name' HTML attribute not to contain an expected value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param name the expected value which is supposed not to be contained in the actual value of PageElement's HTML
         * 'name' attribute
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        containsName: (name: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the location of PageElement not to equal the expected coordinates.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param coordinates the not-expected coordinates of PageElement in pixels
         * @param opts includes the `tolerances` used to calculate the maximal allowed deviations from the expected coordinates,
         * the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the x-location of PageElement not to equal the expected x-location.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param x the not-expected x-location of PageElement in pixels
         * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected x-location,
         * the `timeout` within which the condition is expected to be met and the `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the y-location of PageElement not to equal the expected y-location.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param y the not-expected y-location of PageElement in pixels
         * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected y-location,
         * the `timeout` within which the condition is expected to be met and the `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the size of PageElement not to equal the expected size.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param size the not-expected size of PageElement in pixels
         * @param opts includes the `tolerances` used to calculate the maximal allowed deviations from the expected size,
         * the `timeout` within which the condition is expected to be met and the `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the width of PageElement not to equal the expected width.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param width the not-expected width of PageElement in pixels
         * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected width,
         * the `timeout` within which the condition is expected to be met and the `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for the height of PageElement not to equal the expected height.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param height the not-expected height of PageElement in pixels
         * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected height,
         * the `timeout` within which the condition is expected to be met and the `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         *
         * @returns this (an instance of PageElement)
         */
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
    };
}
/**
 * This class defines all `eventually` functions of PageElement.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementEventually defines all `eventually` functions
 */
export declare class PageElementEventually<Store extends PageNodeStore, PageElementType extends PageElement<Store>> extends PageElementBaseEventually<Store, PageElementType> {
    /**
     * Returns true if PageElement eventually exists within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     */
    exists(opts?: Workflo.ITimeout): boolean;
    /**
     * Returns true if PageElement eventually is visible within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     */
    isVisible(opts?: Workflo.ITimeout): boolean;
    /**
     * Returns true if PageElement eventually is enabled within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     */
    isEnabled(opts?: Workflo.ITimeout): boolean;
    /**
     * Returns true if PageElement eventually is selected within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     */
    isSelected(opts?: Workflo.ITimeout): boolean;
    /**
     * Returns true if PageElement eventually is checked within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    isChecked(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's actual text eventually equals the expected text within a specific timeout.
     *
     * @param text the expected text which is supposed to equal PageElement's actual text
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasText(text: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement eventually has any text within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasAnyText(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's actual text eventually contains the expected text within a specific timeout.
     *
     * @param text the expected text which is supposed to be contained in PageElement's actual text
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    containsText(text: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's actual HTML eventually equals the expected HTML within a specific timeout.
     *
     * @param html the expected HTML which is supposed to equal PageElement's actual HTML
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasHTML(html: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement eventually has any HTML within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasAnyHTML(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's actual HTML eventually contains the expected HTML within a specific timeout.
     *
     * @param html the expected HTML which is supposed to be contained in PageElement's actual HTML
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    containsHTML(html: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's actual direct text eventually equals the expected direct text within a specific
     * timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text which is supposed to equal PageElement's actual direct text
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasDirectText(directText: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement eventually has any direct text within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasAnyDirectText(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's actual direct text eventually contains the expected direct text within a specific
     * timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text which is supposed to be contained in PageElement's actual direct text
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    containsDirectText(directText: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if the actual value of the specified HTML attribute of PageElement eventually equals an expected value
     * within a specific timeout.
     *
     * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value
     * it is expected to have
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasAttribute(attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if the specified HTML attribute of PageElement eventually has any value within a specific timeout.
     *
     * @param attributeName the name of a PageElement's HTML attribute which is supposed to have any value
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasAnyAttribute(attributeName: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if the actual value of the specified HTML attribute of PageElement eventually contains an expected
     * value within a specific timeout.
     *
     * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value
     * it is expected to contain
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    containsAttribute(attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if the actual value of PageElement's 'class' HTML attribute eventually equals an expected value
     * within a specific timeout.
     *
     * @param className the expected value which is supposed to equal the actual value of PageElement's HTML 'class'
     * attribute
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasClass(className: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's 'class' HTML attribute eventually has any value within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasAnyClass(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if the actual value of PageElement's 'class' HTML attribute eventually contains an expected value
     * within a specific timeout.
     *
     * @param className the expected value which is supposed to be contained in the actual value of PageElement's HTML
     * 'class' attribute
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    containsClass(className: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if the actual value of PageElement's 'id' HTML attribute eventually equals an expected value
     * within a specific timeout.
     *
     * @param id the expected value which is supposed to equal the actual value of PageElement's 'id' HTML attribute
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasId(id: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's 'id' HTML attribute eventually has any value within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasAnyId(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if the actual value of PageElement's 'id' HTML attribute eventually contains an expected value
     * within a specific timeout.
     *
     * @param id the expected value which is supposed to be contained in the actual value of PageElement's HTML
     * 'id' attribute
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    containsId(id: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if the actual value of PageElement's 'name' HTML attribute eventually equals an expected value
     * within a specific timeout.
     *
     * @param name the expected value which is supposed to equal the actual value of PageElement's 'name' HTML attribute
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasName(name: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's 'name' HTML attribute eventually has any value within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasAnyName(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if the actual value of PageElement's 'name' HTML attribute eventually contains an expected value
     * within a specific timeout.
     *
     * @param name the expected value which is supposed to be contained in the actual value of PageElement's 'name' HTML
     * attribute
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    containsName(name: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's location eventually equals the expected coordinates or if it deviates no more than
     * the specified tolerances from the expected coordinates within a specific timeout.
     *
     * @param coordinates the expected coordinates of PageElement in pixels
     * @param opts includes the `tolerances` used to calculate the maximal allowed deviations from the expected coordinates,
     * the `timeout` within which the condition is expected to be met and the `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasLocation(coordinates: Workflo.ICoordinates, opts?: {
        tolerances?: Partial<Workflo.ICoordinates>;
    } & Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's x-location eventually equals the expected x-location or if it deviates no more
     * than the specified tolerance from the expected x-location within a specific timeout.
     *
     * @param x the expected x-location of PageElement in pixels
     * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected x-location,
     * the `timeout` within which the condition is expected to be met and the `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasX(x: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's y-location eventually equals the expected y-location or if it deviates no more
     * than the specified tolerance from the expected y-location within a specific timeout.
     *
     * @param y the expected y-location of PageElement in pixels
     * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected y-location,
     * the `timeout` within which the condition is expected to be met and the `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasY(y: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's size eventually equals the expected size or if it deviates no more than
     * the specified tolerances from the expected size within a specific timeout.
     *
     * @param size the expected size of PageElement in pixels
     * @param opts includes the `tolerances` used to calculate the maximal allowed deviations from the expected size,
     * the `timeout` within which the condition is expected to be met and the `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasSize(size: Workflo.ISize, opts?: {
        tolerances?: Partial<Workflo.ISize>;
    } & Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's width eventually equals the expected width or if it deviates no more
     * than the specified tolerance from the expected width within a specific timeout.
     *
     * @param width the expected width of PageElement in pixels
     * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected width,
     * the `timeout` within which the condition is expected to be met and the `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasWidth(width: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's height eventually equals the expected height or if it deviates no more
     * than the specified tolerance from the expected height within a specific timeout.
     *
     * @param height the expected height of PageElement in pixels
     * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected height,
     * the `timeout` within which the condition is expected to be met and the `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasHeight(height: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if the passed condition is eventually met within a specific timeout.
     *
     * @param condition a function which is supposed to return true if the specified condition is met
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    meetsCondition(condition: (element: PageElementType) => boolean, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * returns the negated variants of PageElementEventually's state check functions
     */
    readonly not: {
        /**
         * Returns true if PageElement eventually does not exist within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         */
        exists: (opts?: Workflo.ITimeout) => boolean;
        /**
         * Returns true if PageElement eventually is not visible within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         */
        isVisible: (opts?: Workflo.ITimeout) => boolean;
        /**
         * Returns true if PageElement eventually is not enabled within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         */
        isEnabled: (opts?: Workflo.ITimeout) => boolean;
        /**
         * Returns true if PageElement eventually is not selected within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         */
        isSelected: (opts?: Workflo.ITimeout) => boolean;
        /**
         * Returns true if PageElement eventually is not checked within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        isChecked: (opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's actual text eventually does not equal the expected text within a specific timeout.
         *
         * @param text the expected text which is supposed not to equal PageElement's actual text
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasText: (text: string, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement eventually does not have any text within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasAnyText: (opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's actual text eventually does not contain the expected text within a specific
         * timeout.
         *
         * @param text the expected text which is supposed not to be contained in PageElement's actual text
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        containsText: (text: string, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's actual HTML eventually does not equal the expected HTML within a specific timeout.
         *
         * @param html the expected HTML which is supposed not to equal PageElement's actual HTML
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasHTML: (html: string, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement eventually does not have any HTML within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasAnyHTML: (opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's actual HTML eventually does not contain the expected HTML within a specific
         * timeout.
         *
         * @param html the expected HTML which is supposed not to be contained in PageElement's actual HTML
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        containsHTML: (html: string, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's actual direct text eventually does not equal the expected direct text within a
         * specific timeout.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directText the expected direct text which is supposed not to equal PageElement's actual direct text
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement eventually does not have any direct text within a specific timeout.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's actual direct text eventually does not contain the expected direct text within a
         * specific timeout.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directText the expected direct text which is supposed not to be contained in PageElement's actual direct text
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        containsDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if the actual value of the specified HTML attribute of PageElement eventually does not equal an
         * expected value within a specific timeout.
         *
         * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value
         * it is expected not to have
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if the specified HTML attribute of PageElement eventually does not have any value within a
         * specific timeout.
         *
         * @param attributeName the name of a PageElement's HTML attribute which is supposed not to have any value
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasAnyAttribute: (attributeName: string, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if the actual value of the specified HTML attribute of PageElement eventually does not contain an
         * expected value within a specific timeout.
         *
         * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value
         * it is expected not to contain
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        containsAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if the actual value of PageElement's 'class' HTML attribute eventually does not equal an expected
         * value within a specific timeout.
         *
         * @param className the expected value which is supposed not to equal the actual value of PageElement's HTML 'class'
         * attribute
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasClass: (className: string, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's 'class' HTML attribute eventually does not have any value within a specific
         * timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasAnyClass: (opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if the actual value of PageElement's 'class' HTML attribute eventually does not contain an
         * expected value within a specific timeout.
         *
         * @param className the expected value which is supposed not to be contained in the actual value of PageElement's
         * HTML 'class' attribute
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        containsClass: (className: string, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if the actual value of PageElement's 'id' HTML attribute eventually does not equal an expected
         * value within a specific timeout.
         *
         * @param id the expected value which is supposed not to equal the actual value of PageElement's 'id' HTML
         * attribute
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
        */
        hasId: (id: string, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's 'id' HTML attribute eventually does not have any value within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasAnyId: (opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if the actual value of PageElement's 'id' HTML attribute eventually does not contain an expected
         * value within a specific timeout.
         *
         * @param id the expected value which is supposed not to be contained in the actual value of PageElement's HTML
         * 'id' attribute
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        containsId: (id: string, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if the actual value of PageElement's 'name' HTML attribute eventually does not equal an expected
         * value within a specific timeout.
         *
         * @param name the expected value which is supposed not to equal the actual value of PageElement's 'name' HTML
         * attribute
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasName: (name: string, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's 'name' HTML attribute eventually does not have any value within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasAnyName: (opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if the actual value of PageElement's 'name' HTML attribute eventually does not contain an expected
         * value within a specific timeout.
         *
         * @param name the expected value which is supposed not to be contained in the actual value of PageElement's 'name'
         * HTML attribute
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        containsName: (name: string, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's location eventually does not equal the expected coordinates or if it deviates
         * more than the specified tolerances from the expected coordinates within a specific timeout.
         *
         * @param coordinates the not-expected coordinates of PageElement in pixels
         * @param opts includes the `tolerances` used to calculate the maximal allowed deviations from the expected
         * coordinates, the `timeout` within which the condition is expected to be met and the `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's x-location eventually does not equal the expected x-location or if it deviates
         * more than the specified tolerance from the expected x-location within a specific timeout.
         *
         * @param x the not-expected x-location of PageElement in pixels
         * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected
         * x-location, the `timeout` within which the condition is expected to be met and the `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's y-location eventually does not equal the expected y-location or if it deviates
         * more than the specified tolerance from the expected y-location within a specific timeout.
         *
         * @param x the not-expected x-location of PageElement in pixels
         * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected
         * y-location, the `timeout` within which the condition is expected to be met and the `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's size eventually does not equal the expected size or if it deviates
         * more than the specified tolerances from the expected size within a specific timeout.
         *
         * @param size the not-expected size of PageElement in pixels
         * @param opts includes the `tolerances` used to calculate the maximal allowed deviations from the expected
         * size, the `timeout` within which the condition is expected to be met and the `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's width eventually does not equal the expected width or if it deviates
         * more than the specified tolerance from the expected width within a specific timeout.
         *
         * @param width the not-expected width of PageElement in pixels
         * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected
         * width, the `timeout` within which the condition is expected to be met and the `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's height eventually does not equal the expected height or if it deviates
         * more than the specified tolerance from the expected height within a specific timeout.
         *
         * @param height the not-expected height of PageElement in pixels
         * @param opts includes the `tolerance` used to calculate the maximal allowed deviation from the expected
         * height, the `timeout` within which the condition is expected to be met and the `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
    };
}
