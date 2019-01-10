/// <reference types="webdriverio" />
import { PageNode, IPageNodeOpts, PageElement, IPageElementOpts } from '.';
import { PageElementStore } from '../stores';
import { ListWhereBuilder } from '../builders';
import { PageNodeEventually, PageNodeWait, PageNodeCurrently } from './PageNode';
/**
 * Describes the opts parameter passed to the PageElementList's `identify` function.
 *
 * A list identifier allows for PageElements managed by PageElementList to be accessed via the key names of a
 * `mappingObject`'s properties. To do so, an "identification process" needs to be performed which matches the
 * values of `mappingObject`'s properties to the return values of a `mappingFunc` that is executed on each managed
 * PageElement.
 *
 * Be aware that this form of PageElement identification can be quite slow because PageElementList needs to fetch all
 * managed PageElements from the page before `mappingFunc` can be executed on them.
 *
 * Therefore, always prefer PageElementList's `where` accessor to its `identify` method for the identification of managed
 * PageElements. The only exception to this rule are cases in which the identification of PageElements cannot be
 * described by the modification of an XPath selector (eg. identifying PageElements via their location coordinates on
 * the page).
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement managed by PageElementList
 */
export interface IPageElementListIdentifier<Store extends PageElementStore, PageElementType extends PageElement<Store>> {
    /**
     * An object whose keys are the names by which identified PageElements can be accessed
     * and whose values are used to identify these PageElements when invoking `mappingFunc`.
     */
    mappingObject: {
        [key: string]: string;
    };
    /**
     * A function which is executed on each PageElement mapped by PageElementList.
     *
     * The return value of this function is compared to the values of mappingObject's properties and if there is a match,
     * the PageElement can be accessed via the key of the matching property from now on.
     */
    mappingFunc: (element: PageElementType) => string;
}
/**
 * Describes the opts parameter passed to the `isEmpty` function of PageElementList's `wait` and `eventually` APIs.
 */
export interface IPageElementListWaitEmptyReverseParams extends Workflo.ITimeoutInterval {
    reverse?: boolean;
}
/**
 * Describes the opts parameter passed to the `hasLength` function of PageElementList's `wait.not` and `eventually.not`
 * APIs.
 */
export interface IPageElementListWaitLengthParams extends Workflo.ITimeoutInterval {
    comparator?: Workflo.Comparator;
}
/**
 * Describes the opts parameter passed to the `hasLength` function of PageElementList's `wait` and `eventually` APIs.
 */
export interface IPageElementListWaitLengthReverseParams extends IPageElementListWaitLengthParams {
    reverse?: boolean;
}
/**
 * Describes the opts parameter passed to the constructor function of PageElementList.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement managed by PageElementList
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the PageElements managed
 * by PageElementList
 */
export interface IPageElementListOpts<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOpts extends Partial<IPageElementOpts<Store>>> extends IPageNodeOpts<Store> {
    /**
     * This function retrieves an instance of a PageElement mapped by PageElementList from the list's PageElementStore.
     *
     * @param selector the XPath expression used to identify the retrieved PageElement in the DOM
     * @param opts the options used to configure the retrieved PageElement
     */
    elementStoreFunc: (selector: string, opts: PageElementOpts) => PageElementType;
    /**
     * the options passed to `elementStoreFunc` to configure the retrieved PageElement instance
     */
    elementOpts: PageElementOpts;
    /**
     * `waitType` defines the kind of waiting condition performed when `initialWait` is invoked.
     *
     * The initial waiting condition is performed every time before an interaction with the tested application takes place
     * via a PageElementList's action (eg. identify).
     */
    waitType?: Workflo.WaitType;
    /**
     * By default, the results of an "identification process" (the last invocation of PageElementList's `identify`
     * function) are cached for future invocations of PageElementList's `identify` function.
     *
     * If `disableCache` is set to true, this caching of identification results will be disabled and a new "identification
     * process" will be performed on each invocation of PageElementList's `identify` function.
     *
     * Disabling the identification results cache can be useful if the contents of a PageElementList change often.
     * If the contents of a PageElementList rarely change, PageElementList's `identify` function can be invoked with the
     * `resetCache` option set to true in order to repeat the "identification process" for a changed page content.
     */
    disableCache?: boolean;
    /**
     * This is the default `identifier` used to identify a PageElementList's managed PageElements via the key names
     * defined in `identifier`'s `mappingObject` by matching `mappingObject`'s values with the return values of identifier's
     * `mappingFunc`.
     *
     * This default `identifier` can be overwritten by passing a custom `identifier` in the function parameters of
     * PageElementList's `identify` function.
     */
    identifier?: IPageElementListIdentifier<Store, PageElementType>;
}
/**
 * A PageElementList provides a way to manage multiple related "dynamic" PageElements which all have the same type and
 * the same "base" selector.
 *
 * Typically, the PageElements managed by PageElementList are not known in advance and often change (eg. the entries of
 * a news feed). In order to access certain PageElements, they therefore need to be dynamically identified at runtime.
 *
 * By default, PageElements mapped by PageElementList can only be accessed via their index of occurrence in the DOM
 * using the following accessor methods:
 *
 * - `.first` to retrieve the first PageElement found in the DOM that is identified by PageElementList's XPath selector
 * - `.at` to retrieve the PageElement found in the DOM at the defined index of occurrence that is identified by
 * PageElementList's XPath selector
 * - `.all` to retrieve all PageElements found in the DOM that are identified by PageElementList's XPath selector
 *
 * However, PageElementList also features two other methods to access managed PageElements which are not restricted
 * to index-based access:
 *
 * - The `where` accessor modifies the XPath expression used to identify PageElements by adding additional
 * constraints to PageElementList's XPath selector.
 * - The `identify` method can be used to access managed PageElements via the key names of a `mappingObject` whose
 * values are matched with the return values of a `mappingFunc` that is executed on each managed PageElement. Be aware
 * that this form of PageElement identification can be quite slow because PageElementList needs to fetch all managed
 * PageElements from the page before `mappingFunc` can be executed on them.
 *
 * Therefore, always prefer `where` to `identify` for the identification of managed PageElements. The only exception
 * to this rule are cases in which the identification of PageElements cannot be described by the modification of an
 * XPath selector (eg. identifying PageElements via their location coordinates on the page).
 */
export declare class PageElementList<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>> extends PageNode<Store> implements Workflo.PageNode.IElementNode<string[], boolean[], boolean> {
    protected selector: string;
    /**
     * `_$` provides access to the PageNode retrieval functions of PageElementList's PageElementStore and prefixes the
     * selectors of all PageNodes retrieved via `_$` with the selector of PageElementList.
     */
    protected _$: Store;
    /**
     * This function retrieves an instance of a PageElement mapped by PageElementList from the list's PageElementStore.
     *
     * @param selector the XPath expression used to identify the retrieved PageElement in the DOM
     * @param opts the options used to configure the retrieved PageElement
     */
    protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    /**
     * the options passed to `_elementStoreFunc` to configure a managed  PageElement instance
     */
    protected _elementOpts: PageElementOptions;
    /**
     * defines the kind of waiting condition performed when `initialWait` is invoked
     *
     * The initial waiting condition is performed every time before an interaction with the tested application takes place
     * via a PageElementList's action (eg. identify).
     */
    protected _waitType: Workflo.WaitType;
    /**
     * By default, the results of an "identification process" (the last invocation of PageElementList's `identify`
     * function) are cached for future invocations of PageElementList's `identify` function.
     *
     * If `_disableCache` is set to true, this caching of identification results will be disabled and a new "identification
     * process" will be performed on each invocation of PageElementList's `identify` function.
     *
     * Disabling the identification results cache can be useful if the contents of a PageElementList change often.
     * If the contents of a PageElementList rarely change, PageElementList's `identify` function can be invoked with the
     * `resetCache` option set to true in order to repeat the "identification process" for a changed page content.
     */
    protected _disableCache: boolean;
    /**
     * This is the default `identifier` used to identify a PageElementList's managed PageElements via the key names
     * defined in `identifier`'s `mappingObject` by matching `mappingObject`'s values with the return values of identifier's
     * `mappingFunc`.
     *
     * This default `identifier` can be overwritten by passing a custom `identifier` in the function parameters of
     * PageElementList's `identify` function.
     */
    protected _identifier: IPageElementListIdentifier<Store, PageElementType>;
    /**
     * caches the last result of PageElementList's `identify` function for future invocations of the function
     */
    protected _identifiedObjCache: {
        [key: string]: {
            [key: string]: PageElementType;
        };
    };
    /**
     * Stores an instance of ListWhereBuilder which allows to select subsets of the PageElements managed by PageElementList
     * by modifying the list's selector using XPath modification functions.
     */
    protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOptions, this>;
    /**
     * the default timeout used by PageElementList for all of its functions that operate with timeouts
     * (eg. `wait` and `eventually`)
     */
    protected _timeout: number;
    /**
     * the default interval used by PageElementList for all of its functions that operate with intervals
     * (eg. `wait` and `eventually`)
     */
    protected _interval: number;
    readonly currently: PageElementListCurrently<Store, PageElementType, PageElementOptions, this>;
    readonly wait: PageElementListWait<Store, PageElementType, PageElementOptions, this>;
    readonly eventually: PageElementListEventually<Store, PageElementType, PageElementOptions, this>;
    /**
     * PageElementList provides a way to manage multiple PageElements which all have the same type and selector.
     *
     * By default, PageElements mapped by PageElementList can only be accessed via their index of occurrence in the DOM
     * using the following accessor methods:
     *
     * - `.first` to retrieve the PageElement which maps to the first HTML element found in the DOM that is identified by
     * PageElementList's selector
     * - `.at` to retrieve the PageElement which maps to the HTML element found in the DOM at the defined index that is
     * identified by PageElementList's selector
     * - `.all` to retrieve all PageElements which map to HTML elements found in the DOM that are identified by
     * PageElementList's selector
     *
     * However, PageElementList also features two other methods to access managed PageElements which are not restricted
     * to index-based access:
     *
     * - The `where` accessor modifies the XPath expression used to identify PageElements by adding additional
     * constraints to PageElementList's XPath selector.
     * - The `identify` method can be used to access managed PageElements via the key names of a `mappingObject` whose
     * values are matched with the return values of a `mappingFunc` that is executed on each managed PageElement. Be aware
     * that this form of PageElement identification can be quite slow because PageElementList needs to fetch all managed
     * PageElements from the page before `mappingFunc` can be executed on them.
     *
     * Therefore, always prefer `where` to `identify` for the identification of managed PageElements. The only exception
     * to this rule are cases in which the identification of PageElements cannot be described by the modification of an
     * XPath selector (eg. identifying PageElements via their location coordinates on the page).
     *
     * @param selector an XPath expression which identifies all PageElements managed by PageElementList
     * @param opts the options used to configure PageElementList
     */
    constructor(selector: string, opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>);
    /**
     * Use this method to initialize properties that rely on the this type which is not available in the constructor.
     *
     * Make sure that this method is invoked immediately after construction.
     *
     * @param cloneFunc creates a copy of PageElementList which manages a subset of the original list's PageElements
     */
    init(cloneFunc: (selector: Workflo.XPath) => this): void;
    /**
     * This function performs PageElementList's initial waiting condition.
     *
     * It supports the following waiting types:
     *
     * - 'exist' to wait for at least one of PageElementList's managed elements to exist in the DOM
     * - 'visible' to wait for at least one of PageElementList's managed elements to become visible
     * (not obscured by other elements, not set to 'hidden'...)
     * - 'text' to wait for at least one of PageElementList's managed elements to have any text
     *
     * @returns this (an instance of PageElementList)
     */
    initialWait(): void;
    /**
     * `$` provides access to the PageNode retrieval functions of PageElementList's PageElementStore and prefixes the
     * selectors of all PageNodes retrieved via `$` with the selector of PageElementList.
     */
    readonly $: Store;
    /**
     * Fetches all webdriverio elements identified by PageElementList's XPath selector from the HTML page after
     * performing PageElementList's initial waiting condition.
     */
    readonly elements: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>;
    /**
     * The `.where` accessor allows to - after performing PageElementList's initial waiting condition - select and
     * retrieve subsets of the PageElements managed by PageElementList by constraining the list's selector using XPath
     * modification functions.
     */
    readonly where: ListWhereBuilder<Store, PageElementType, PageElementOptions, this>;
    /**
     * Retrieves the first PageElement found in the DOM that is identified by PageElementList's XPath selector after
     * performing PageElementList's initial waiting condition.
     */
    readonly first: PageElementType;
    /**
     * Retrieves the PageElement found in the DOM at the defined index of occurrence that is identified by
     * PageElementList's XPath selector after performing PageElementList's initial waiting condition.
     *
     * @param index the index of occurrence in the DOM of the retrieved PageElement - STARTS AT 0
     */
    at(index: number): PageElementType;
    /**
     * Retrieves all PageElements found in the DOM that are identified by PageElementList's XPath selector after
     * performing PageElementList's initial waiting condition.
     */
    readonly all: PageElementType[];
    /**
     * Sets a new default `identifier` for PageElementList's `identify` function.
     *
     * @param identifier used to identify a PageElementList's managed PageElements via the key names defined in `identifier`
     * 's `mappingObject` by matching `mappingObject`'s values with the return values of `identifier`'s `mappingFunc`
     */
    setIdentifier(identifier: IPageElementListIdentifier<Store, PageElementType>): this;
    /**
     * This function identifies PageElements managed by PageElementList with the aid of an `identifier`'s `mappingObject`
     * and `mappingFunc` after performing PageElementList's initial waiting condition.
     *
     * It returns an identification results object which allows for PageElements managed by PageElementList to be accessed
     * via the key names of `mappingObject`'s properties. To create this results object, an "identification process" needs
     * to be performed:
     *
     * - At first, PageElementList needs to fetch all managed PageElements from the page.
     * - Then, a `mappingFunc` is executed on each fetched PageElement and its return value is compared to the values of
     * `mappingObject`'s properties.
     * - If there is a match between a `mappingFunc`'s return value and the value of a `mappingObject`'s property,
     * a new property is written to the results object whose key name is taken from the matched `mappingObject`'s property
     * and whose value is the PageElement on which `mappingFunc` was invoked.
     *
     * By default, the identification results object is cached for future invocations of the `identify` method. This
     * behavior can be overwritten by passing a `resetCache` flag to the `identify` method.
     *
     * Disabling the identification results cache can be useful if the contents of a PageElementList change often.
     * If the contents of a PageElementList rarely change, PageElementList's `identify` function can be invoked with the
     * `resetCache` flag set to true in order to repeat the "identification process" for a changed page content.
     *
     * Be aware that the invocation of `identify` can be quite slow (if no identification result is cached yet) because
     * PageElementList needs to fetch all managed PageElements from the page before `mappingFunc` can be executed on them.
     *
     * Therefore, always prefer PageElementList's `where` accessor to its `identify` method for the identification of managed
     * PageElements. The only exception to this rule are cases in which the identification of PageElements cannot be
     * described by the modification of an XPath selector (eg. identifying PageElements via their location coordinates on
     * the page).
     *
     * @param opts includes the `identifier` which provides the `mappingObject` and the `mappingFunc` for the
     * identification process and a `resetCache` flag that, if set to true, deletes any previously cached identification
     * results
     *
     * If no `identifier` is passed to the `identify` method, PageElementList's default `identifier` is used. If no
     * default `identifier` is provided either, the elements' indexes of occurrence will be used as keys in the
     * identification results object.
     *
     * If no `resetCache` flag is provided, the PageElementList's `disabledCache` property is used to determine if
     * identification results should be cached. The `disabledCache` property is set to `false` by default.
     */
    identify({ identifier, resetCache }?: {
        identifier?: IPageElementListIdentifier<Store, PageElementType>;
        resetCache?: boolean;
    }): {
        [key: string]: PageElementType;
    };
    /**
     * Returns the XPath selector that identifies all PageElements managed by PageElementList.
     */
    getSelector(): string;
    /**
     * Returns the default timeout that a PageElementList uses if no other explicit timeout
     * is passed to one of its functions which operates with timeouts (eg. wait, eventually)
     */
    getTimeout(): number;
    /**
     * Returns the default interval that a PageElementList uses if no other explicit interval
     * is passed to one of its functions which operates with intervals (eg. wait, eventually)
     */
    getInterval(): number;
    /**
     * Returns the number of PageElements managed by PageElementList (the number of PageElements found in the DOM which
     * are identified by PageElementList's XPath selector) after performing PageElementList's initial waiting condition.
     */
    getLength(): number;
    /**
     * Returns the texts of all PageElements managed by PageElementList as an array after performing the initial
     * waiting condition of PageElementList and each managed PageElement.
     *
     * @param filterMask can be used to skip the invocation of the `getText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getText(filterMask?: Workflo.PageNode.ListFilterMask): string[];
    /**
     * Returns the direct texts of all PageElements managed by PageElementList as an array after performing the initial
     * waiting condition of PageElementList and each managed PageElement.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `getDirectText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getDirectText(filterMask?: Workflo.PageNode.ListFilterMask): string[];
    /**
     * Returns the 'enabled' status of all PageElements managed by PageElementList as an array after performing the
     * initial waiting condition of PageElementList and each managed PageElement.
     *
     * @param filterMask can be used to skip the invocation of the `getIsEnabled` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getIsEnabled(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    /**
     * Returns the 'hasText' status of all PageElements managed by PageElementList as an array after performing the
     * initial waiting condition of PageElementList and each managed PageElement.
     *
     * A PageElement's 'hasText' status is set to true if its actual text equals the expected text.
     *
     * @param text the expected text used in the comparisons which set the 'hasText' status
     *
     * If `text` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     */
    getHasText(text: string | string[]): boolean[];
    /**
     * Returns the 'hasAnyText' status of all PageElements managed by PageElementList as an array after performing the
     * initial waiting condition of PageElementList and each managed PageElement.
     *
     * A PageElement's 'hasAnyText' status is set to true if the PageElement has any text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getHasAnyText(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    /**
     * Returns the 'containsText' status of all PageElements managed by PageElementList as an array after performing the
     * initial waiting condition of PageElementList and each managed PageElement.
     *
     * A PageElement's 'containsText' status is set to true if its actual text contains the expected text.
     *
     * @param text the expected text used in the comparisons which set the 'containsText' status.
     *
     * If `text` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     */
    getContainsText(text: string | string[]): boolean[];
    /**
     * Returns the 'hasDirectText' status of all PageElements managed by PageElementList as an array after performing the
     * initial waiting condition of PageElementList and each managed PageElement.
     *
     * A PageElement's 'hasDirectText' status is set to true if its actual direct text equals the expected direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text used in the comparisons which set the 'hasDirectText' status.
     *
     * If `directText` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `directText` is an array of values, its length must match the length of PageElementList and the values of its
     * array elements are compared to the array of actual values of all PageElements.
     */
    getHasDirectText(directText: string | string[]): boolean[];
    /**
     * Returns the 'hasAnyDirectText' status of all PageElements managed by PageElementList as an array after performing
     * the initial waiting condition of PageElementList and each managed PageElement.
     *
     * A PageElement's 'hasAnyDirectText' status is set to true if the PageElement has any direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyDirectText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getHasAnyDirectText(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    /**
     * Returns the 'containsDirectText' status of all PageElements managed by PageElementList as an array after performing
     * the initial waiting condition of PageElementList and each managed PageElement.
     *
     * A PageElement's 'containsDirectText' status is set to true if its actual direct text contains the expected direct
     * text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text used in the comparisons which set the 'containsDirectText' status.
     *
     * If `directText` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `directText` is an array of values, its length must match the length of PageElementList and the values of its
     * array elements are compared to the array of actual values of all PageElements.
     */
    getContainsDirectText(directText: string | string[]): boolean[];
    /**
     * Used to determine if a function of a managed PageElement should be invoked or if its invocation should be skipped
     * because the PageElement is not included by a filterMask.
     *
     * @param filter a filterMask entry that refers to a corresponding managed PageElement
     */
    protected _includedInFilter(filter: any): boolean;
    /**
     * Invokes a state check function for each PageElement in a passed `elements` array and returns an array of state
     * check function results.
     *
     * @template T the type of a single expected value or the type of an array element in an expected values array
     * @param elements an array containing all PageElements for which `checkFunc` should be executed
     * @param checkFunc a state check function executed for each PageElement in `elements`. It is passed a PageElement as
     * first parameter and an expected value used by the state check comparison as an optional second parameter.
     * @param expected a single expected value or an array of expected values used for the state check comparisons
     *
     * If `expected` is a single value, this value is compared to each element in the array of actual values.
     * If `expected` is an array of values, its length must match the length of `elements` and the values of its
     * array elements are compared to the array of actual values.
     * @param isFilterMask if set to true, the `expected` parameter represents a filterMask which can be used to skip the
     * invocation of the state check function for some or all PageElements.
     * The results of skipped function invocations are not included in the total results array.
     * @returns an array of results of a state check function executed for each PageElement of `elements`
     */
    eachCompare<T>(elements: PageElementType[], checkFunc: (element: PageElementType, expected?: T) => boolean, expected?: T | T[], isFilterMask?: boolean): boolean[];
    /**
     * Invokes a state check function for each PageElement in a passed `elements` array and returns true if the result of
     * each state check function invocation was true.
     *
     * If the passed `elements` array was empty, this function will always return true.
     *
     * @template T the type of a single expected value or the type of an array element in an expected values array
     * @param elements an array containing all PageElements for which `checkFunc` should be executed
     * @param checkFunc a state check function executed for each PageElement in `elements`. It is passed a PageElement as
     * first parameter and an expected value used by the state check comparison as an optional second parameter.
     * @param expected a single expected value or an array of expected values used for the state check comparisons
     *
     * If `expected` is a single value, this value is compared to each element in the array of actual values.
     * If `expected` is an array of values, its length must match the length of `elements` and the values of its
     * array elements are compared to the array of actual values.
     * @param isFilterMask if set to true, the `expected` parameter represents a filterMask which can be used to skip the
     * invocation of the state check function for some or all PageElements
     * @returns true if the state check functions of all checked PageElements returned true or if no state check functions
     * were invoked at all
     */
    eachCheck<T>(elements: PageElementType[], checkFunc: (element: PageElementType, expected?: T) => boolean, expected?: T | T[], isFilterMask?: boolean): boolean;
    /**
     * Invokes a state retrieval function for each PageElement in a passed `elements` array and returns an array of state
     * retrieval function results.
     *
     * @template T the type of an element of the results array
     * @param elements an array containing all PageElements for which `getFunc` should be executed
     * @param getFunc a state retrieval function executed for each PageElement in `elements`. It is passed a PageElement
     * as first parameter.
     * @param filterMask can be used to skip the invocation of the state retrieval function for some or all PageElements.
     * The results of skipped function invocations are not included in the total results array.
     * @returns an array of results of a state retrieval function executed for each PageElement of `elements`
     */
    eachGet<T>(elements: PageElementType[], getFunc: (element: PageElementType) => T, filterMask?: Workflo.PageNode.ListFilterMask): T[];
    /**
     * Invokes a wait function for each PageElement in a passed `elements` array.
     *
     * Throws an error if the wait condition of an invoked wait function was not met within a specific timeout.
     *
     * @template T the type of a single expected value or the type of an array element in an expected values array
     * @param elements an array containing all PageElements for which `waitFunc` should be executed
     * @param waitFunc a wait function executed for each PageElement in `elements`. It is passed a PageElement as
     * first parameter and an expected value used by the wait condition as an optional second parameter.
     * @param expected a single expected value or an array of expected values used for the wait conditions
     *
     * If `expected` is a single value, this value is compared to each element in the array of actual values.
     * If `expected` is an array of values, its length must match the length of `elements` and the values of its
     * array elements are compared to the array of actual values.
     * @param isFilterMask if set to true, the `expected` parameter represents a filterMask which can be used to skip the
     * invocation of the wait function for some or all PageElements
     * @returns this (an instance of PageElementList)
     */
    eachWait<T>(elements: PageElementType[], waitFunc: (element: PageElementType, expected?: T) => PageElementType, expected?: T | T[], isFilterMask?: boolean): this;
    /**
     * Executes an action for each of PageElementList's managed PageElements.
     *
     * @param action an action executed for each of PageElementList's managed PageElements
     * @param filterMask can be used to skip the execution of an action for some or all PageElements
     * @returns this (an instance of PageElementList)
     */
    eachDo(action: (element: PageElementType) => any, filterMask?: Workflo.PageNode.ListFilterMask): this;
    /**
     * Invokes a setter function for each PageElement in a passed `elements` array.
     *
     * @template T the type of a single setter value or the type of an array element in a setter values array
     * @param elements an array containing all PageElements for which `setFunc` should be executed
     * @param setFunc a setter function executed for each PageElement in `elements`. It is passed a PageElement as
     * first parameter and the value to be set as second parameter.
     * @param values a single setter value or an array of setter values
     *
     * If `values` is a single value, all PageElements in the `elements` array are set to this value.
     * If `values` is an array of values, its length must match the length of `elements` and all PageElements
     * in the `elements` array are set to the values of the `values` array in the order that the PageElements were
     * retrieved from the DOM.
     *
     * @returns this (an instance of PageElementList)
     */
    eachSet<T>(elements: PageElementType[], setFunc: (element: PageElementType, value: T) => PageElementType, values?: T | T[]): this;
}
/**
 * This class defines all `currently` functions of PageElementList.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement managed by PageElementList
 * @template PageElementOpts type of the opts paramter passed to the constructor function of managed PageElements
 * @template ListType type of the PageElementList for which PageElementListCurrently defines all `currently` functions
 */
export declare class PageElementListCurrently<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOpts extends Partial<IPageElementOpts<Store>>, ListType extends PageElementList<Store, PageElementType, PageElementOpts>> extends PageNodeCurrently<Store, ListType> {
    protected readonly _node: ListType;
    /**
     * the XPath selector that identifies all PageElements managed by PageElementList
     */
    protected _selector: string;
    /**
     * an instance of PageElementStore which can be used to retrieve/create PageNodes
     */
    protected _store: Store;
    /**
     * the options passed to `elementStoreFunc` to configure the retrieved PageElement instance
     */
    protected _elementOpts: PageElementOpts;
    /**
     * This function retrieves an instance of a PageElement mapped by PageElementList from the list's PageElementStore.
     *
     * @param selector the XPath expression used to identify the retrieved PageElement in the DOM
     * @param opts the options used to configure the retrieved PageElement
     */
    protected _elementStoreFunc: (selector: string, options: PageElementOpts) => PageElementType;
    /**
     * Stores an instance of ListWhereBuilder which allows to select subsets of the PageElements managed by PageElementList
     * by modifying the list's selector using XPath modification functions.
     */
    protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOpts, ListType>;
    /**
     * This class defines all `currently` functions of PageElementList.
     *
     * @param node an instance of the PageElementList for which PageElementListCurrently defines all `currently` functions
     * @param opts the opts used to configure PageElementList
     */
    constructor(node: ListType, opts: IPageElementListOpts<Store, PageElementType, PageElementOpts>);
    /**
     * Use this method to initialize properties that rely on the this type which is not available in the constructor.
     *
     * Make sure that this method is invoked immediately after construction.
     *
     * @param cloneFunc creates a copy of PageElementList which manages a subset of the original list's PageElements
     */
    init(cloneFunc: (selector: Workflo.XPath) => ListType): void;
    /**
     * Immediatly fetches all webdriverio elements identified by PageElementList's XPath selector from the HTML page.
     */
    readonly elements: WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>;
    /**
     * The `.where` accessor allows to select and retrieve subsets of the PageElements managed by PageElementList by
     * constraining the list's selector using XPath modification functions.
     */
    readonly where: ListWhereBuilder<Store, PageElementType, PageElementOpts, ListType>;
    /**
     * Retrieves the first PageElement found in the DOM that is identified by PageElementList's XPath selector.
     */
    readonly first: PageElementType;
    /**
     * Retrieves the PageElement found in the DOM at the defined index of occurrence that is identified by
     * PageElementList's XPath selector.
     *
     * @param index the index of occurrence in the DOM of the retrieved PageElement - STARTS AT 0
     */
    at(index: number): PageElementType;
    /**
     * Retrieves all PageElements found in the DOM that are identified by PageElementList's XPath selector.
     */
    readonly all: PageElementType[];
    /**
     * Returns the current number of PageElements managed by PageElementList (the number of PageElements found in the DOM which
     * are identified by PageElementList's XPath selector).
     */
    getLength(): number;
    /**
     * Returns the current texts of all PageElements managed by PageElementList as an array.
     *
     * @param filterMask can be used to skip the invocation of the `getText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getText(filterMask?: Workflo.PageNode.ListFilterMask): string[];
    /**
     * Returns the current direct texts of all PageElements managed by PageElementList as an array.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `getDirectText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getDirectText(filterMask?: Workflo.PageNode.ListFilterMask): string[];
    /**
     * Returns the current 'exists' status of all PageElements managed by PageElementList as an array.
     *
     * @param filterMask can be used to skip the invocation of the `getExists` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getExists(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    /**
     * Returns the current 'visible' status of all PageElements managed by PageElementList as an array.
     *
     * @param filterMask can be used to skip the invocation of the `getIsVisible` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getIsVisible(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    /**
     * Returns the current 'enabled' status of all PageElements managed by PageElementList as an array.
     *
     * @param filterMask can be used to skip the invocation of the `getIsEnabled` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getIsEnabled(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    /**
     * Returns the current 'hasText' status of all PageElements managed by PageElementList as an array.
     *
     * A PageElement's 'hasText' status is set to true if its actual text equals the expected text.
     *
     * @param text the expected text used in the comparisons which set the 'hasText' status
     *
     * If `text` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     */
    getHasText(text: string | string[]): boolean[];
    /**
     * Returns the current 'hasAnyText' status of all PageElements managed by PageElementList as an array.
     *
     * A PageElement's 'hasAnyText' status is set to true if the PageElement has any text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getHasAnyText(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    /**
     * Returns the current 'containsText' status of all PageElements managed by PageElementList as an array.
     *
     * A PageElement's 'containsText' status is set to true if its actual text contains the expected text.
     *
     * @param text the expected text used in the comparisons which set the 'containsText' status
     *
     * If `text` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     */
    getContainsText(text: string | string[]): boolean[];
    /**
     * Returns the current 'hasDirectText' status of all PageElements managed by PageElementList as an array.
     *
     * A PageElement's 'hasDirectText' status is set to true if its actual direct text equals the expected direct text.
     *
     * @param directText the expected direct text used in the comparisons which set the 'hasDirectText' status.
     *
     * If `directText` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `directText` is an array of values, its length must match the length of PageElementList and the values of its
     * array elements are compared to the array of actual values of all PageElements.
     */
    getHasDirectText(directText: string | string[]): boolean[];
    /**
     * Returns the current 'hasAnyDirectText' status of all PageElements managed by PageElementList as an array.
     *
     * A PageElement's 'hasAnyDirectText' status is set to true if the PageElement has any direct text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyDirectText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getHasAnyDirectText(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    /**
     * Returns the current 'containsDirectText' status of all PageElements managed by PageElementList as an array.
     *
     * A PageElement's 'containsDirectText' status is set to true if its actual direct text contains the expected direct
     * text.
     *
     * @param directText the expected direct text used in the comparisons which set the 'containsDirectText' status.
     *
     * If `directText` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `directText` is an array of values, its length must match the length of PageElementList and the values of its
     * array elements are compared to the array of actual values of all PageElements.
     */
    getContainsDirectText(directText: string | string[]): boolean[];
    /**
     * Returns true if PageElementList is currently empty.
     */
    isEmpty(): boolean;
    /**
     * Returns the current result of the comparison between PageElementList's actual length and an expected length using
     * the comparison method defined in `comparator`.
     *
     * The following comparison methods are supported:
     *
     * - "==" to check if the actual length equals the expected length
     * - "!=" to check if the actual length does not equal the expected length
     * - "<" to check if the actual length is less than the expected length
     * - ">" to check if the actual length is greater than the expected length
     *
     * @param length the expected length
     * @param comparator defines the method used to compare the actual and the expected length of PageElementList
     */
    hasLength(length: number, comparator?: Workflo.Comparator): boolean;
    /**
     * Returns true if at least one of the PageElements managed by PageElementList currently exists.
     *
     * @param filterMask if set to false, the existence check is skipped and `true` is returned
     */
    exists(filterMask?: boolean): boolean;
    /**
     * Returns true if all PageElements managed by PageElementList are currently visible.
     *
     * @param filterMask can be used to skip the invocation of the `isVisible` function for some or all managed
     * PageElements
     */
    isVisible(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    /**
     * Returns true if all PageElements managed by PageElementList are currently enabled.
     *
     * @param filterMask can be used to skip the invocation of the `isEnabled` function for some or all managed
     * PageElements
     */
    isEnabled(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    /**
     * Returns true if the actual texts of all PageElements managed by PageElementList currently equal the expected text(s).
     *
     * @param text the expected text(s) supposed to equal the actual texts
     *
     * If `text` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     */
    hasText(text: string | string[]): boolean;
    /**
     * Returns true if all PageElements managed by PageElementList currently have any text.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyText` function for some or all managed
     * PageElements
     */
    hasAnyText(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    /**
     * Returns true if the actual texts of all PageElements managed by PageElementList currently contain the expected
     * text(s).
     *
     * @param text the expected text(s) supposed to be contained in the actual texts
     *
     * If `text` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     */
    containsText(text: string | string[]): boolean;
    /**
     * Returns true if the actual direct texts of all PageElements managed by PageElementList currently equal the expected
     * direct text(s).
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text(s) supposed to equal the actual direct texts
     *
     * If `directText` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `directText` is an array of values, its length must match the length of PageElementList and the values of its
     * array elements are compared to the array of actual values of all PageElements.
     */
    hasDirectText(directText: string | string[]): boolean;
    /**
     * Returns true if all PageElements managed by PageElementList currently have any direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyDirectText` function for some or all managed
     * PageElements
     */
    hasAnyDirectText(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    /**
     * Returns true if the actual direct texts of all PageElements managed by PageElementList currently contain the
     * expected direct text(s).
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text(s) supposed to be contained in the actual direct texts
     *
     * If `directText` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `directText` is an array of values, its length must match the length of PageElementList and the values of its
     * array elements are compared to the array of actual values of all PageElements.
     */
    containsDirectText(directText: string | string[]): boolean;
    /**
     * returns the negated variants of PageElementListCurrently's state check functions
     */
    readonly not: {
        /**
         * Returns true if PageElementList is currently not empty.
         */
        isEmpty: () => boolean;
        /**
         * Returns the current negated result of the comparison between PageElementList's actual length and an expected
         * length using the comparison method defined in `comparator`.
         *
         * The following comparison methods are supported:
         *
         * - "==" to check if the actual length equals the expected length
         * - "!=" to check if the actual length does not equal the expected length
         * - "<" to check if the actual length is less than the expected length
         * - ">" to check if the actual length is greater than the expected length
         *
         * @param length the not-expected length
         * @param comparator defines the method used to compare the actual and the expected length of PageElementList
         */
        hasLength: (length: number, comparator?: Workflo.Comparator) => boolean;
        /**
         * Returns true if none of the PageElements managed by PageElementList currently exist.
         *
         * @param filterMask if set to false, the existence check is skipped and `true` is returned
         */
        exists: (filterMask?: boolean) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementList are currently not visible.
         *
         * @param filterMask can be used to skip the invocation of the `isVisible` function for some or all managed
         * PageElements
         */
        isVisible: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementList are currently not enabled.
         *
         * @param filterMask can be used to skip the invocation of the `isEnabled` function for some or all managed
         * PageElements
         */
        isEnabled: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        /**
         * Returns true if the actual texts of all PageElements managed by PageElementList currently do not equal the
         * expected text(s).
         *
         * @param text the expected text(s) supposed not to equal the actual texts
         *
         * If `text` is a single value, this value is compared to each element in the array of actual values of all
         * PageElements.
         * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
         * elements are compared to the array of actual values of all PageElements.
         */
        hasText: (text: string | string[]) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementList currently do not have any text.
         *
         * @param filterMask can be used to skip the invocation of the `hasAnyText` function for some or all managed
         * PageElements
         */
        hasAnyText: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        /**
         * Returns true if the actual texts of all PageElements managed by PageElementList currently do not contain the
         * expected text(s).
         *
         * @param text the expected text(s) supposed not to be contained in the actual texts
         *
         * If `text` is a single value, this value is compared to each element in the array of actual values of all
         * PageElements.
         * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
         * elements are compared to the array of actual values of all PageElements.
         */
        containsText: (text: string | string[]) => boolean;
        /**
         * Returns true if the actual direct texts of all PageElements managed by PageElementList currently do not equal
         * the expected direct text(s).
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directText the expected direct text(s) supposed not to equal the actual direct texts
         *
         * If `directText` is a single value, this value is compared to each element in the array of actual values of all
         * PageElements.
         * If `directText` is an array of values, its length must match the length of PageElementList and the values of
         * its array elements are compared to the array of actual values of all PageElements.
         */
        hasDirectText: (directText: string | string[]) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementList currently do not have any direct text.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param filterMask can be used to skip the invocation of the `hasAnyDirectText` function for some or all managed
         * PageElements
         */
        hasAnyDirectText: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        /**
         * Returns true if the actual direct texts of all PageElements managed by PageElementList currently do not contain
         * the expected direct text(s).
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directText the expected direct text(s) not supposed to be contained in the actual direct texts
         *
         * If `directText` is a single value, this value is compared to each element in the array of actual values of all
         * PageElements.
         * If `directText` is an array of values, its length must match the length of PageElementList and the values of its
         * array elements are compared to the array of actual values of all PageElements.
         */
        containsDirectText: (directText: string | string[]) => boolean;
    };
}
/**
 * This class defines all `wait` functions of PageElementList.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement managed by PageElementList
 * @template PageElementOpts type of the opts paramter passed to the constructor function of managed PageElements
 * @template ListType type of the PageElementList for which PageElementListCurrently defines all `wait` functions
 */
export declare class PageElementListWait<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> extends PageNodeWait<Store, ListType> {
    /**
     * Provides an API to wait for any PageElement managed by PageElementList to reach a certain state within a
     * specific timeout.
     */
    readonly any: PageElementType["wait"];
    /**
     * Provides an API to wait for none of PageElementList's managed PageElements to reach a certain state within a
     * specific timeout.
     */
    readonly none: PageElementType['wait']['not'];
    /**
     * Waits for the result of the comparison between PageElementList's actual length and an expected length using the
     * comparison method defined in `comparator` to return true.
     *
     * Throws an error if the comparison does not return true within a specific timeout.
     *
     * The following comparison methods are supported:
     *
     * - "==" to check if the actual length equals the expected length
     * - "!=" to check if the actual length does not equal the expected length
     * - "<" to check if the actual length is less than the expected length
     * - ">" to check if the actual length is greater than the expected length
     *
     * @param length the expected length
     * @param opts includes a `comparator` which defines the method used to compare the actual and the expected length of
     * PageElementList, the `timeout` within which the comparison is expected to return true, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the comparison to return `false` instead of `true`
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    hasLength(length: number, { timeout, comparator, interval, reverse }?: IPageElementListWaitLengthReverseParams): ListType;
    /**
     * Waits for PageElementList to be empty.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    isEmpty({ timeout, interval, reverse }?: IPageElementListWaitEmptyReverseParams): ListType;
    /**
     * Waits for at least one of the PageElements managed by PageElementList to exist.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some or
     * all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     *
     * @returns this (an instance of PageElementList)
     */
    exists(opts?: Workflo.ITimeout & {
        filterMask?: boolean;
    }): ListType;
    /**
     * Waits for all PageElements managed by PageElementList to be visible.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     *
     * @returns this (an instance of PageElementList)
     */
    isVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask): ListType;
    /**
     * Waits for all PageElements managed by PageElementList to be enabled.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     *
     * @returns this (an instance of PageElementList)
     */
    isEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask): ListType;
    /**
     * Waits for the actual texts of all PageElements managed by PageElementList to equal the expected text(s).
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param text the expected text(s) supposed to equal the actual texts
     *
     * If `text` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    hasText(text: string | string[], opts?: Workflo.ITimeoutInterval): ListType;
    /**
     * Waits for all PageElements managed by PageElementList to have any text.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyText` function for some
     * or all managed PageElements, the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    hasAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask): ListType;
    /**
     * Waits for the actual texts of all PageElements managed by PageElementList to contain the expected text(s).
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param text the expected text(s) supposed to be contained in the actual texts
     *
     * If `text` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    containsText(text: string | string[], opts?: Workflo.ITimeoutInterval): ListType;
    /**
     * Waits for the actual direct texts of all PageElements managed by PageElementList to equal the expected direct
     * text(s).
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text(s) supposed to equal the actual direct texts
     *
     * If `directText` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `directText` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    hasDirectText(directText: string | string[], opts?: Workflo.ITimeoutInterval): ListType;
    /**
     * Waits for all PageElements managed by PageElementList to have any direct text.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyDirectText` function for
     * some or all managed PageElements, the `timeout` within which the condition is expected to be met and the `interval`
     * used to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    hasAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask): ListType;
    /**
     * Waits for the actual direct texts of all PageElements managed by PageElementList to contain the expected direct
     * text(s).
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text(s) supposed to be contained in the actual direct texts
     *
     * If `directText` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `directText` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    containsDirectText(directText: string | string[], opts?: Workflo.ITimeoutInterval): ListType;
    /**
     * returns the negated variants of PageElementListWait's state check functions
     */
    readonly not: {
        /**
         * Waits for the result of the comparison between PageElementList's actual length and an expected length using the
         * comparison method defined in `comparator` to return false.
         *
         * Throws an error if the comparison does not return false within a specific timeout.
         *
         * The following comparison methods are supported:
         *
         * - "==" to check if the actual length equals the expected length
         * - "!=" to check if the actual length does not equal the expected length
         * - "<" to check if the actual length is less than the expected length
         * - ">" to check if the actual length is greater than the expected length
         *
         * @param length the not-expected length
         * @param opts includes a `comparator` which defines the method used to compare the actual and the expected length
         * of PageElementList, the `timeout` within which the comparison is expected to return false and the `interval`
         * used to check it
         *
         * If no `timeout` is specified, PageElementList's default timeout is used.
         * If no `interval` is specified, PageElementList's default interval is used.
         *
         * @returns this (an instance of PageElementList)
         */
        hasLength: (length: number, opts?: IPageElementListWaitLengthParams) => ListType;
        /**
         * Waits for PageElementList not to be empty.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElementList's default timeout is used.
         * If no `interval` is specified, PageElementList's default interval is used.
         *
         * @returns this (an instance of PageElementList)
         */
        isEmpty: (opts?: Workflo.ITimeoutInterval) => ListType;
        /**
         * Waits for none of the PageElements managed by PageElementList to exist.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some or
         * all managed PageElements and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         *
         * @returns this (an instance of PageElementList)
         */
        exists: (opts?: Workflo.ITimeout & {
            filterMask?: boolean;
        }) => ListType;
        /**
         * Waits for all PageElements managed by PageElementList not to be visible.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for
         * some or all managed PageElements and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         *
         * @returns this (an instance of PageElementList)
         */
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask) => ListType;
        /**
         * Waits for all PageElements managed by PageElementList not to be enabled.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for
         * some or all managed PageElements and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         *
         * @returns this (an instance of PageElementList)
         */
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask) => ListType;
        /**
         * Waits for the actual texts of all PageElements managed by PageElementList not to equal the expected text(s).
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param text the expected text(s) supposed not to equal the actual texts
         *
         * If `text` is a single value, this value is compared to each element in the array of actual values of all
         * PageElements.
         * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
         * elements are compared to the array of actual values of all PageElements.
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         *
         * @returns this (an instance of PageElementList)
         */
        hasText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => ListType;
        /**
         * Waits for all PageElements managed by PageElementList not to have any text.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyText` function for
         * some or all managed PageElements, the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         *
         * @returns this (an instance of PageElementList)
         */
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask) => ListType;
        /**
         * Waits for the actual texts of all PageElements managed by PageElementList not to contain the expected text(s).
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param text the expected text(s) supposed not to be contained in the actual texts
         *
         * If `text` is a single value, this value is compared to each element in the array of actual values of all
         * PageElements.
         * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
         * elements are compared to the array of actual values of all PageElements.
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         *
         * @returns this (an instance of PageElementList)
         */
        containsText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => ListType;
        /**
         * Waits for the actual direct texts of all PageElements managed by PageElementList not to equal the expected
         * direct text(s).
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directText the expected direct text(s) supposed not to equal the actual direct texts
         *
         * If `directText` is a single value, this value is compared to each element in the array of actual values of all
         * PageElements.
         * If `directText` is an array of values, its length must match the length of PageElementList and the values of its array
         * elements are compared to the array of actual values of all PageElements.
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         *
         * @returns this (an instance of PageElementList)
         */
        hasDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => ListType;
        /**
         * Waits for all PageElements managed by PageElementList not to have any direct text.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyDirectText` function
         * for some or all managed PageElements, the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         *
         * @returns this (an instance of PageElementList)
         */
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask) => ListType;
        /**
         * Waits for the actual direct texts of all PageElements managed by PageElementList not to contain the expected
         * direct text(s).
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directText the expected direct text(s) supposed not to be contained in the actual direct texts
         *
         * If `directText` is a single value, this value is compared to each element in the array of actual values of all
         * PageElements.
         * If `directText` is an array of values, its length must match the length of PageElementList and the values of its array
         * elements are compared to the array of actual values of all PageElements.
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         *
         * @returns this (an instance of PageElementList)
         */
        containsDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => ListType;
    };
}
/**
 * This class defines all `eventually` functions of PageElementList.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement managed by PageElementList
 * @template PageElementOpts type of the opts paramter passed to the constructor function of managed PageElements
 * @template ListType type of the PageElementList for which PageElementListCurrently defines all `eventually` functions
 */
export declare class PageElementListEventually<Store extends PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions extends Partial<IPageElementOpts<Store>>, ListType extends PageElementList<Store, PageElementType, PageElementOptions>> extends PageNodeEventually<Store, ListType> {
    /**
     * Provides an API to check if any PageElement managed by PageElementList eventually has a certain state within a
     * specific timeout.
     */
    readonly any: PageElementType["eventually"];
    /**
     * Provides an API to check if none of the PageElements managed by PageElementList eventually have a certain state
     * within a specific timeout.
     */
    readonly none: PageElementType['eventually']['not'];
    /**
     * Returns true if the result of the comparison between PageElementList's actual length and an expected length using
     * the comparison method defined in `comparator` eventually returns true within a specific timeout.
     *
     * The following comparison methods are supported:
     *
     * - "==" to check if the actual length equals the expected length
     * - "!=" to check if the actual length does not equal the expected length
     * - "<" to check if the actual length is less than the expected length
     * - ">" to check if the actual length is greater than the expected length
     *
     * @param length the expected length
     * @param opts includes a `comparator` which defines the method used to compare the actual and the expected length of
     * PageElementList, the `timeout` within which the comparison is expected to return true, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the comparison to return `false` instead of `true`
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     */
    hasLength(length: number, { timeout, comparator, interval, reverse }?: IPageElementListWaitLengthReverseParams): boolean;
    /**
     * Returns true if PageElementList eventually is empty within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     */
    isEmpty({ timeout, interval, reverse }?: IPageElementListWaitEmptyReverseParams): boolean;
    /**
     * Returns true if at least one of the PageElements managed by PageElementList eventually exists within a specific
     * timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some or
     * all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     */
    exists(opts?: Workflo.ITimeout & {
        filterMask?: boolean;
    }): boolean;
    /**
     * Returns true if all PageElements managed by PageElementList eventually are visible within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     */
    isVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask): boolean;
    /**
     * Returns true if all PageElements managed by PageElementList eventually are enabled within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     */
    isEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask): boolean;
    /**
     * Returns true if the actual texts of all PageElements managed by PageElementList eventually equal the expected
     * text(s) within a specific timeout.
     *
     * @param text the expected text(s) supposed to equal the actual texts
     *
     * If `text` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     */
    hasText(text: string | string[], opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if all PageElements managed by PageElementList eventually have any text within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyText` function for some
     * or all managed PageElements, the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     */
    hasAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask): boolean;
    /**
     * Returns true if the actual texts of all PageElements managed by PageElementList eventually contain the expected
     * text(s) within a specific timeout.
     *
     * @param text the expected text(s) supposed to be contained in the actual texts
     *
     * If `text` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     */
    containsText(text: string | string[], opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if the actual direct texts of all PageElements managed by PageElementList eventually equal the
     * expected direct text(s) within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text(s) supposed to equal the actual direct texts
     *
     * If `directText` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `directText` is an array of values, its length must match the length of PageElementList and the values of its
     * array elements are compared to the array of actual values of all PageElements.
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     */
    hasDirectText(directText: string | string[], opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if all PageElements managed by PageElementList eventually have any direct text within a specific
     * timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyDirectText` function for
     * some or all managed PageElements, the `timeout` within which the condition is expected to be met and the `interval`
     * used to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     */
    hasAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask): boolean;
    /**
     * Returns true if the actual direct texts of all PageElements managed by PageElementList eventually contain the
     * expected direct text(s) within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the expected direct text(s) supposed to be contained in the actual direct texts
     *
     * If `directText` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `directText` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     */
    containsDirectText(directText: string | string[], opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * returns the negated variants of PageElementListEventually's state check functions
     */
    readonly not: {
        /**
         * Returns true if the result of the comparison between PageElementList's actual length and an expected length using
         * the comparison method defined in `comparator` eventually returns false within a specific timeout.
         *
         * The following comparison methods are supported:
         *
         * - "==" to check if the actual length equals the expected length
         * - "!=" to check if the actual length does not equal the expected length
         * - "<" to check if the actual length is less than the expected length
         * - ">" to check if the actual length is greater than the expected length
         *
         * @param length the not-expected length
         * @param opts includes a `comparator` which defines the method used to compare the actual and the expected length
         * of PageElementList, the `timeout` within which the comparison is expected to return false and the `interval`
         * used to check it
         *
         * If no `timeout` is specified, PageElementList's default timeout is used.
         * If no `interval` is specified, PageElementList's default interval is used.
         */
        hasLength: (length: number, opts?: IPageElementListWaitLengthParams) => boolean;
        /**
         * Returns true if PageElementList eventually is not empty within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, PageElementList's default timeout is used.
         * If no `interval` is specified, PageElementList's default interval is used.
         */
        isEmpty: (opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if none of the PageElements managed by PageElementList eventually exist within a specific
         * timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some or
         * all managed PageElements and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         */
        exists: (opts?: Workflo.ITimeout & {
            filterMask?: boolean;
        }) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementList eventually are not visible within a specific
         * timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for
         * some or all managed PageElements and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         */
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementList eventually are not enabled within a specific
         * timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for some
         * or all managed PageElements and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         */
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask) => boolean;
        /**
         * Returns true if the actual texts of all PageElements managed by PageElementList eventually do not equal the
         * expected text(s) within a specific timeout.
         *
         * @param text the expected text(s) supposed not to equal the actual texts
         *
         * If `text` is a single value, this value is compared to each element in the array of actual values of all
         * PageElements.
         * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
         * elements are compared to the array of actual values of all PageElements.
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         */
        hasText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementList eventually do not have any text within a specific
         * timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyText` function for some
         * or all managed PageElements, the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         */
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask) => boolean;
        /**
         * Returns true if the actual texts of all PageElements managed by PageElementList eventually do not contain the
         * expected text(s) within a specific timeout.
         *
         * @param text the expected text(s) supposed not to be contained in the actual texts
         *
         * If `text` is a single value, this value is compared to each element in the array of actual values of all
         * PageElements.
         * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
         * elements are compared to the array of actual values of all PageElements.
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         */
        containsText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => boolean;
        /**
        * Returns true if the actual direct texts of all PageElements managed by PageElementList eventually do not equal
        * the expected direct text(s) within a specific timeout.
        *
        * A direct text is a text that resides on the level directly below the selected HTML element.
        * It does not include any text of the HTML element's nested children HTML elements.
        *
        * @param directText the expected direct text(s) supposed not to equal the actual direct texts
        *
        * If `directText` is a single value, this value is compared to each element in the array of actual values of all
        * PageElements.
        * If `directText` is an array of values, its length must match the length of PageElementList and the values of its array
        * elements are compared to the array of actual values of all PageElements.
        * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
        * to check it
        *
        * If no `timeout` is specified, a PageElement's default timeout is used.
        * If no `interval` is specified, a PageElement's default interval is used.
        */
        hasDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementList eventually do not have any direct text within a
         * specific timeout.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyDirectText` function for
         * some or all managed PageElements, the `timeout` within which the condition is expected to be met and the `interval`
         * used to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         */
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask) => boolean;
        /**
         * Returns true if the actual direct texts of all PageElements managed by PageElementList eventually do not
         * contain the expected direct text(s) within a specific timeout.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directText the expected direct text(s) supposed not to be contained in the actual direct texts
         *
         * If `directText` is a single value, this value is compared to each element in the array of actual values of all
         * PageElements.
         * If `directText` is an array of values, its length must match the length of PageElementList and the values of its array
         * elements are compared to the array of actual values of all PageElements.
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         */
        containsDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => boolean;
    };
}
