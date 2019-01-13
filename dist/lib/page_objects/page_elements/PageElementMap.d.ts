import { PageNode, IPageNodeOpts, PageElement, IPageElementOpts, PageNodeEventually, PageNodeCurrently, PageNodeWait } from '.';
import { PageNodeStore } from '../stores';
import { XPathBuilder } from '../builders';
/**
 * Describes the `identifier` property of the `opts` parameter passed to PageElementMap's constructor function.
 *
 * It provides a `mappingObject` and a `mappingFunc` which are used to constrain the "base" XPath selector of
 * PageElementMap using XPath modification functions in order to statically identify a PageElementMap's managed
 * PageElements when the PageElementMap is initially created.
 *
 * @template K the key names of `mappingObject`'s properties
 */
export interface IPageElementMapIdentifier<K extends string> {
    /**
     * An object which provides the key names used to access PageElements via PageElementMap's `$` accessor and the
     * values passed to XPath modification functions in order to constrain the map's "base" XPath selector.
     */
    mappingObject: Record<K, string>;
    /**
     * `mappingFunc` constrains the XPath `baseSelector` of a PageElementMap by invoking XPath modification functions
     * with a `mappingValue` taken from the property values of `mappingObject`.
     *
     * @example
     * // returns '//nav/a[.="Dashboard"]' for {baseSelector: "//nav/a", mappingValue: "Dashboard"}
     * ( baseSelector, mappingValue ) => xpath( baseSelector ).text( mappingValue )
     *
     * @param baseSelector the XPath "base" selector of a PageElementMap
     * @param mappingValue a property value taken from the `mappingObject` of IPageElementMapIdentifier
     *
     * @returns the constrained XPath expression
     */
    mappingFunc: (baseSelector: string, mappingValue: string) => XPathBuilder | string;
}
/**
 * Describes the opts parameter passed to the constructor function of PageElementMap.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template K the key names of PageElementMap's `$` accessor used to access the map's managed PageElements
 * @template PageElementType type of the PageElements managed by PageElementList
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the PageElements managed
 * by PageElementList
 */
export interface IPageElementMapOpts<Store extends PageNodeStore, K extends string, PageElementType extends PageElement<Store>, PageElementOpts extends Partial<IPageElementOpts<Store>>> extends IPageNodeOpts<Store> {
    /**
     * This `identifier` provides a `mappingObject` and a `mappingFunc` which are used to constrain the "base"
     * XPath selector of PageElementMap using XPath modification functions in order to statically identify a
     * PageElementMap's managed PageElements when the PageElementMap is initially created.
     */
    identifier: IPageElementMapIdentifier<K>;
    /**
     * This function retrieves an instance of a PageElement mapped by PageElementMap from the map's PageNodeStore.
     *
     * @param selector the XPath expression used to identify the retrieved PageElement in the DOM
     * @param opts the options used to configure the retrieved PageElement
     */
    elementStoreFunc: (selector: string, options: PageElementOpts) => PageElementType;
    /**
     * the options passed to `elementStoreFunc` to configure the retrieved PageElement instance
     */
    elementOpts: PageElementOpts;
}
/**
 * A PageElementMap manages multiple related "static" PageElements which all have the same type and the same "base"
 * selector.
 *
 * The PageElements managed by PageElementMap are always known in advance and do not change (eg. navigation menu
 * entries). They can therefore be statically identified when PageElementMap is initially created by constraining
 * the map's "base" XPath selector using XPath modification functions.
 *
 * This initial identification process makes use of a `mappingObject` and a `mappingFunc` which are both defined in
 * PageElement's `identifier` object:
 *
 * - For each property of `mappingObject`, `mappingFunc` is invoked with the map's "base" selector as the first and the
 * value of the currently processed property as the second parameter.
 * - `mappingFunc` then constrains the "base" selector by using XPath modification functions which are passed the values
 * of the currently processed properties as parameters.
 * - Each resulting constrained selector is used to retrieve a managed PageElement from the map's PageNodeStore.
 * - These identified PageElements are then mapped to the corresponding key names of `mappingObject`'s properties
 *
 * The resulting object of mapped PageElements can be accessed via PageElementMap's `$` accessor.
 *
 * All of PageElementMap's state retrieval (getXXX) and state check functions (hasXXX/hasAnyXXX/containsXXX) return
 * their result values as a result map. This is an object whose key names or taken from PageElementMap's `$` accessor
 * and whose values are the results of the respective function being executed on the  mapped PageElement.
 *
 * @example
 * // baseSelector = "//nav/a[.="Dashboard"]"
 * // mappingObject = {dashboard: "Dashboard"}
 * //
 * // returns '//nav/a[.="Dashboard"]' for this mappingFunc:
 * ( baseSelector, mappingValue ) => xpath( baseSelector ).text( mappingValue )
 *
 * // returns {dashboard: PageElement("//nav/a[.="Dashboard"]")}
 * this.$
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template K the key names of PageElementMap's `$` accessor used to access the map's managed PageElements
 * @template PageElementType type of the PageElements managed by PageElementList
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the PageElements managed
 * by PageElementList
 */
export declare class PageElementMap<Store extends PageNodeStore, K extends string, PageElementType extends PageElement<Store>, PageElementOpts extends Partial<IPageElementOpts<Store>>> extends PageNode<Store> implements Workflo.PageNode.IElementNode<Partial<Record<K, string>>, Partial<Record<K, boolean>>, Partial<Record<K, boolean>>> {
    /**
     * This function retrieves an instance of a PageElement mapped by PageElementMap from the map's PageNodeStore.
     *
     * @param selector the XPath expression used to identify the retrieved PageElement in the DOM
     * @param opts the options used to configure the retrieved PageElement
     */
    protected _elementStoreFunc: (selector: string, options: PageElementOpts) => PageElementType;
    /**
     * the options passed to `_elementStoreFunc` to configure a managed PageElement instance
     */
    protected _elementOpts: PageElementOpts;
    /**
     * This `_identifier` provides a `mappingObject` and a `mappingFunc` which are used to constrain the "base"
     * XPath selector of PageElementMap using XPath modification functions in order to statically identify a
     * PageElementMap's managed PageElements when the PageElementMap is initially created.
     *
     * The identified and mapped PageElements can be accessed via PageElementMap's `$` accessor.
     */
    protected _identifier: IPageElementMapIdentifier<K>;
    /**
     * `_$` provides access to all mapped PageElements of PageElementMap.
     */
    protected _$: Record<K, PageElementType>;
    readonly currently: PageElementMapCurrently<Store, K, PageElementType, PageElementOpts, this>;
    readonly wait: PageElementMapWait<Store, K, PageElementType, PageElementOpts, this>;
    readonly eventually: PageElementMapEventually<Store, K, PageElementType, PageElementOpts, this>;
    /**
     * A PageElementMap manages multiple related "static" PageElements which all have the same type and the same "base"
     * selector.
     *
     * The PageElements managed by PageElementMap are always known in advance and do not change (eg. navigation menu
     * entries). They can therefore be statically identified when PageElementMap is initially created by constraining
     * the map's "base" XPath selector using XPath modification functions.
     *
     * This initial identification process makes use of a `mappingObject` and a `mappingFunc` which are both defined in
     * PageElement's `identifier` object:
     *
     * - For each property of `mappingObject`, `mappingFunc` is invoked with the map's "base" selector as the first and the
     * value of the currently processed property as the second parameter.
     * - `mappingFunc` then constrains the "base" selector by using XPath modification functions which are passed the values
     * of the currently processed properties as parameters.
     * - Each resulting constrained selector is used to retrieve a managed PageElement from the map's PageNodeStore.
     * - These identified PageElements are then mapped to the corresponding key names of `mappingObject`'s properties
     *
     * The resulting object of mapped PageElements can be accessed via PageElementMap's `$` accessor.
     *
     * All of PageElementMap's state retrieval (getXXX) and state check functions (hasXXX/hasAnyXXX/containsXXX) return
     * their result values as a result map. This is an object whose key names or taken from PageElementMap's `$`
     * accessor and whose values are the results of the respective function being executed on the  mapped PageElement.
     *
     * @example
     * // baseSelector = "//nav/a[.="Dashboard"]"
     * // mappingObject = {dashboard: "Dashboard"}
     * //
     * // returns '//nav/a[.="Dashboard"]' for this mappingFunc:
     * ( baseSelector, mappingValue ) => xpath( baseSelector ).text( mappingValue )
     *
     * // returns {dashboard: PageElement("//nav/a[.="Dashboard"]")}
     * this.$
     *
     * @param selector the "base" XPath selector of PageElementMap which is constrained to identify the map's managed
     * PageElements
     * @opts the options used to configure an instance of PageElementMap
     */
    constructor(selector: string, { identifier, elementStoreFunc, elementOpts: elementOptions, ...superOpts }: IPageElementMapOpts<Store, K, PageElementType, PageElementOpts>);
    /**
     * `$` provides access to all mapped PageElements of PageElementMap.
     */
    readonly $: Record<K, PageElementType>;
    /**
     * This function changes the `mappingObject` used by PageElementMap's `identifier` object to constrain the "base"
     * XPath selector of PageElementMap using XPath modification functions in order to statically identify a
     * PageElementMap's managed PageElements.
     *
     * This can be useful if, for example, the links of a navigation menu are represented using a PageElementMap and
     * the GUI is switched to another language: Now the values used to identify the links by text change while the keys
     * used to access the links via tha map's `$` property stay the same.
     *
     * @param mappingObject
     */
    changeMappingObject(mappingObject: Record<K, string>): void;
    /**
     * Returns the "base" XPath selector that identifies all PageElements managed by PageElementMap.
     */
    getSelector(): string;
    /**
     * Returns the texts of all PageElements managed by PageElementMap as a result map after performing the initial
     * waiting condition of each PageElement.
     *
     * @param filterMask can be used to skip the invocation of the `getText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, string>>;
    /**
     * Returns the direct texts of all PageElements managed by PageElementMap as a result map after performing the
     * initial waiting condition of each PageElement.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `getDirectText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getDirectText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, string>>;
    /**
     * Returns the 'enabled' status of all PageElements managed by PageElementMap as a result map after performing the
     * initial waiting condition of each PageElement.
     *
     * @param filterMask can be used to skip the invocation of the `getIsEnabled` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getIsEnabled(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    /**
     * Returns the 'hasText' status of all PageElements managed by PageElementMap as a result map after performing the
     * initial waiting condition of each managed PageElement.
     *
     * A PageElement's 'hasText' status is set to true if its actual text equals the expected text.
     *
     * @param texts the expected texts used in the comparisons which set the 'hasText' status
     */
    getHasText(texts: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    /**
     * Returns the 'hasAnyText' status of all PageElements managed by PageElementMap as a result map after performing
     * the initial waiting condition of each managed PageElement.
     *
     * A PageElement's 'hasAnyText' status is set to true if the PageElement has any text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getHasAnyText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    /**
     * Returns the 'containsText' status of all PageElements managed by PageElementMap as a result map after performing
     * the initial waiting condition of each managed PageElement.
     *
     * A PageElement's 'containsText' status is set to true if its actual text contains the expected text.
     *
     * @param texts the expected texts used in the comparisons which set the 'containsText' status
     */
    getContainsText(texts: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    /**
     * Returns the 'hasDirectText' status of all PageElements managed by PageElementMap as a result map after performing
     * the initial waiting condition of each managed PageElement.
     *
     * A PageElement's 'hasDirectText' status is set to true if its actual direct text equals the expected direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directTexts the expected direct texts used in the comparisons which set the 'hasDirectText' status
     */
    getHasDirectText(directTexts: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    /**
     * Returns the 'hasAnyDirectText' status of all PageElements managed by PageElementMap as a result map after performing
     * the initial waiting condition of each managed PageElement.
     *
     * A PageElement's 'hasAnyDirectText' status is set to true if the PageElement has any direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyDirectText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getHasAnyDirectText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    /**
     * Returns the 'containsDirectText' status of all PageElements managed by PageElementMap as a result map after
     * performing the initial waiting condition of each managed PageElement.
     *
     * A PageElement's 'containsDirectText' status is set to true if its actual direct text contains the expected direct
     * text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directTexts the expected direct texts used in the comparisons which set the 'containsDirectText' status
     */
    getContainsDirectText(directTexts: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    /**
     * Used to determine if a function of a managed PageElement should be invoked or if its invocation should be skipped
     * because the PageElement is not included by a filterMask.
     *
     * @param filter a filterMask entry that refers to a corresponding managed PageElement
     */
    protected _includedInFilter(value: any): boolean;
    /**
     * Invokes a state check function for each PageElement in a passed `context` map and returns a map of state
     * check function results.
     *
     * @template T the type of an expected value
     * @param context a map containing all PageElements for which `checkFunc` should be executed
     * @param checkFunc a state check function executed for each PageElement in `context`. It is passed a PageElement as
     * first parameter and an expected value used by the state check comparison as an optional second parameter.
     * @param expected a map of expected values used for the state check comparisons
     * @param isFilterMask if set to true, the `expected` parameter represents a filterMask which can be used to skip the
     * invocation of the state check function for some or all PageElements.
     * The results of skipped function invocations are not included in the total results map.
     * @returns an map of results of a state check function executed for each PageElement in `context`
     */
    eachCompare<T>(context: Record<K, PageElementType>, checkFunc: (element: PageElementType, expected?: T) => boolean, expected: Partial<Record<K, T>>, isFilterMask?: boolean): Partial<Record<K, boolean>>;
    /**
     * Invokes a state check function for each PageElement in a passed `context` map and returns true if the result of
     * each state check function invocation was true.
     *
     * @template T the type of an expected value
     * @param context a map containing all PageElements for which `checkFunc` should be executed
     * @param checkFunc a state check function executed for each PageElement in `context`. It is passed a PageElement as
     * first parameter and an expected value used by the state check comparison as an optional second parameter.
     * @param expected a map of expected values used for the state check comparisons
     * @param isFilterMask if set to true, the `expected` parameter represents a filterMask which can be used to skip the
     * invocation of the state check function for some or all PageElements.
     * The results of skipped function invocations are not included in the results map.
     * @returns true if the state check functions of all checked PageElements returned true or if no state check functions
     * were invoked at all
     */
    eachCheck<T>(context: Record<K, PageElementType>, checkFunc: (element: PageElementType, expected?: T) => boolean, expected: Partial<Record<K, T>>, isFilterMask?: boolean): boolean;
    /**
    * Invokes a state retrieval function for each PageElement in a passed `context` map and returns a map of state
    * retrieval function results.
    *
    * @template T the type of a value of the results map
    * @param context a map containing all PageElements for which `getFunc` should be executed
    * @param getFunc a state retrieval function executed for each PageElement in `context`. It is passed a PageElement
    * as first parameter.
    * @param filterMask can be used to skip the invocation of the state retrieval function for some or all PageElements.
    * The results of skipped function invocations are not included in the total results map.
    * @returns an map of results of a state retrieval function executed for each PageElement in `context`
    */
    eachGet<T>(context: Record<K, PageElementType>, getFunc: (node: PageElementType) => T, filterMask: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, T>>;
    /**
     * Invokes a wait function for each PageElement in a passed `context` map.
     *
     * @template T the type of an expected value
     * @param context a map containing all PageElements for which `checkFunc` should be executed
     * @param waitFunc a wait function executed for each PageElement in `context`. It is passed a PageElement as
     * first parameter and an expected value used by the wait condition as an optional second parameter.
     * @param expected a map of expected values used for the wait conditions
     * @param isFilterMask if set to true, the `expected` parameter represents a filterMask which can be used to skip the
     * invocation of the wait function for some or all PageElements.
     * @returns this (an instance of PageElementMap)
     */
    eachWait<ValueType>(context: Record<K, PageElementType>, waitFunc: (element: PageElementType, expected?: ValueType) => PageElementType, expected: Partial<Record<K, ValueType>>, isFilterMask?: boolean): this;
    /**
     * Invokes an action for each of PageElementMap's managed PageElements.
     *
     * @param action an action executed for each of PageElementMap's managed PageElements
     * @param filterMask can be used to skip the execution of an action for some or all PageElements
     * @returns this (an instance of PageElementMap)
     */
    eachDo(action: (element: PageElementType) => any, filterMask?: Workflo.PageNode.MapFilterMask<K>): this;
    /**
     * Invokes a setter function for each PageElement in a passed `context` map.
     *
     * @template T the type of a single setter value
     * @param context a map containing all PageElements for which `setFunc` should be executed
     * @param setFunc a setter function executed for each PageElement in `context`. It is passed a PageElement as
     * first parameter and the value to be set as second parameter.
     * @param values a map of setter values
     * @returns this (an instance of PageElementMap)
     */
    eachSet<T>(context: Record<K, PageElementType>, setFunc: (element: PageElementType, value?: T) => PageElementType, values: Partial<Record<K, T>>): this;
}
/**
 * This class defines all `currently` functions of PageElementMap.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template K the key names of PageElementMap's `$` accessor used to access the map's managed PageElements
 * @template PageElementType type of the PageElements managed by PageElementMap
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the PageElements managed
 * by PageElementMap
 * @template MapType type of the PageElementMap for which PageElementMapCurrently defines all `currently` functions
 */
export declare class PageElementMapCurrently<Store extends PageNodeStore, K extends string, PageElementType extends PageElement<Store>, PageElementOpts extends Partial<IPageElementOpts<Store>>, MapType extends PageElementMap<Store, K, PageElementType, PageElementOpts>> extends PageNodeCurrently<Store, MapType> {
    /**
     * Returns the current texts of all PageElements managed by PageElementMap as a result map.
     *
     * @param filterMask can be used to skip the invocation of the `getText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, string>>;
    /**
     * Returns the current direct texts of all PageElements managed by PageElementMap as a result map.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `getDirectText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getDirectText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, string>>;
    /**
     * Returns the current 'exists' status of all PageElements managed by PageElementMap as a result map.
     *
     * @param filterMask can be used to skip the invocation of the `getExists` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getExists(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    /**
     * Returns the current 'visible' status of all PageElements managed by PageElementMap as a result map.
     *
     * @param filterMask can be used to skip the invocation of the `getIsVisible` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getIsVisible(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    /**
     * Returns the current 'enabled' status of all PageElements managed by PageElementMap as a result map.
     *
     * @param filterMask can be used to skip the invocation of the `getIsEnabled` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getIsEnabled(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    /**
     * Returns the current 'hasText' status of all PageElements managed by PageElementMap as a result map.
     *
     * A PageElement's 'hasText' status is set to true if its actual text equals the expected text.
     *
     * @param texts the expected texts used in the comparisons which set the 'hasText' status
     */
    getHasText(texts: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    /**
     * Returns the current 'hasAnyText' status of all PageElements managed by PageElementMap as a result map.
     *
     * A PageElement's 'hasAnyText' status is set to true if the PageElement has any text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getHasAnyText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    /**
     * Returns the current 'containsText' status of all PageElements managed by PageElementMap as a result map.
     *
     * A PageElement's 'containsText' status is set to true if its actual text contains the expected text.
     *
     * @param texts the expected texts used in the comparisons which set the 'containsText' status
     */
    getContainsText(texts: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    /**
     * Returns the current 'hasDirectText' status of all PageElements managed by PageElementMap as a result map.
     *
     * A PageElement's 'hasDirectText' status is set to true if its actual direct text equals the expected direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directTexts the expected direct texts used in the comparisons which set the 'hasDirectText' status
     */
    getHasDirectText(directTexts: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    /**
     * Returns the current 'hasAnyDirectText' status of all PageElements managed by PageElementMap as a result map.
     *
     * A PageElement's 'hasAnyDirectText' status is set to true if the PageElement has any direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyDirectText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getHasAnyDirectText(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    /**
     * Returns the current 'containsDirectText' status of all PageElements managed by PageElementMap as a result map.
     *
     * A PageElement's 'containsDirectText' status is set to true if its actual direct text contains the expected direct
     * text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directTexts the expected direct texts used in the comparisons which set the 'containsDirectText' status
     */
    getContainsDirectText(directTexts: Partial<Record<K, string>>): Partial<Record<K, boolean>>;
    /**
     * Returns true if all PageElements managed by PageElementMap currently exist.
     *
     * @param filterMask can be used to skip the invocation of the `exists` function for some or all managed
     * PageElements
     */
    exists(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    /**
     * Returns true if all PageElements managed by PageElementMap are currently visible.
     *
     * @param filterMask can be used to skip the invocation of the `isVisible` function for some or all managed
     * PageElements
     */
    isVisible(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    /**
     * Returns true if all PageElements managed by PageElementMap are currently enabled.
     *
     * @param filterMask can be used to skip the invocation of the `isEnabled` function for some or all managed
     * PageElements
     */
    isEnabled(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    /**
     * Returns true if the actual texts of all PageElements managed by PageElementMap currently equal the expected texts.
     *
     * @param texts the expected texts supposed to equal the actual texts
     */
    hasText(texts: Partial<Record<K, string>>): boolean;
    /**
     * Returns true if all PageElements managed by PageElementMap currently have any text.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyText` function for some or all managed
     * PageElements
     */
    hasAnyText(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    /**
     * Returns true if the actual texts of all PageElements managed by PageElementMap currently contain the expected texts.
     *
     * @param texts the expected texts supposed to be contained in the actual texts
     */
    containsText(texts: Partial<Record<K, string>>): boolean;
    /**
     * Returns true if the actual direct texts of all PageElements managed by PageElementMap currently equal the expected
     * direct texts.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directTexts the expected direct texts supposed to equal the actual direct texts
     */
    hasDirectText(directTexts: Partial<Record<K, string>>): boolean;
    /**
     * Returns true if all PageElements managed by PageElementMap currently have any direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyDirectText` function for some or all managed
     * PageElements
     */
    hasAnyDirectText(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    /**
     * Returns true if the actual direct texts of all PageElements managed by PageElementMap currently contain the
     * expected direct texts.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directTexts the expected direct texts supposed to be contained in the actual direct texts
     */
    containsDirectText(directTexts: Partial<Record<K, string>>): boolean;
    /**
     * returns the negated variants of PageElementMapCurrently's state check functions
     */
    readonly not: {
        /**
         * Returns true if all PageElements managed by PageElementMap currently do not exist.
         *
         * @param filterMask can be used to skip the invocation of the `exists` function for some or all managed
         * PageElements
         */
        exists: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementMap are currently not visible.
         *
         * @param filterMask can be used to skip the invocation of the `isVisible` function for some or all managed
         * PageElements
         */
        isVisible: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementMap are currently not enabled.
         *
         * @param filterMask can be used to skip the invocation of the `isEnabled` function for some or all managed
         * PageElements
         */
        isEnabled: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        /**
         * Returns true if the actual texts of all PageElements managed by PageElementMap currently do not equal the
         * expected texts.
         *
         * @param texts the expected texts supposed not to equal the actual texts
         */
        hasText: (text: Partial<Record<K, string>>) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementMap currently do not have any text.
         *
         * @param filterMask can be used to skip the invocation of the `hasAnyText` function for some or all managed
         * PageElements
         */
        hasAnyText: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        /**
         * Returns true if the actual texts of all PageElements managed by PageElementMap currently do not contain the
         * expected texts.
         *
         * @param texts the expected texts supposed not to be contained in the actual texts
         */
        containsText: (text: Partial<Record<K, string>>) => boolean;
        /**
         * Returns true if the actual direct texts of all PageElements managed by PageElementMap currently do not equal
         * the expected direct texts.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directTexts the expected direct texts supposed not to equal the actual direct texts
         */
        hasDirectText: (directText: Partial<Record<K, string>>) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementMap currently do not have any direct text.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param filterMask can be used to skip the invocation of the `hasAnyDirectText` function for some or all managed
         * PageElements
         */
        hasAnyDirectText: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        /**
         * Returns true if the actual direct texts of all PageElements managed by PageElementMap currently do not contain
         * the expected direct texts.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directTexts the expected direct texts supposed not to be contained in the actual direct texts
         */
        containsDirectText: (directText: Partial<Record<K, string>>) => boolean;
    };
}
/**
 * This class defines all `wait` functions of PageElementMap.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template K the key names of PageElementMap's `$` accessor used to access the map's managed PageElements
 * @template PageElementType type of the PageElements managed by PageElementMap
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the PageElements managed
 * by PageElementMap
 * @template MapType type of the PageElementMap for which PageElementMapWait defines all `wait` functions
 */
export declare class PageElementMapWait<Store extends PageNodeStore, K extends string, PageElementType extends PageElement<Store>, PageElementOpts extends Partial<IPageElementOpts<Store>>, MapType extends PageElementMap<Store, K, PageElementType, PageElementOpts>> extends PageNodeWait<Store, MapType> {
    /**
     * Waits for all PageElements managed by PageElementMap to exist.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     *
     * @returns this (an instance of PageElementMap)
     */
    exists(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): MapType;
    /**
     * Waits for all PageElements managed by PageElementMap to be visible.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     *
     * @returns this (an instance of PageElementMap)
     */
    isVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): MapType;
    /**
     * Waits for all PageElements managed by PageElementMap to be enabled.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     *
     * @returns this (an instance of PageElementMap)
     */
    isEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): MapType;
    /**
     * Waits for the actual texts of all PageElements managed by PageElementMap to equal the expected texts.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param texts the expected texts supposed to equal the actual texts
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     *
     * @returns this (an instance of PageElementMap)
     */
    hasText(texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): MapType;
    /**
     * Waits for all PageElements managed by PageElementMap to have any text.
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
     * @returns this (an instance of PageElementMap)
     */
    hasAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): MapType;
    /**
     * Waits for the actual texts of all PageElements managed by PageElementMap to contain the expected texts.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param texts the expected texts supposed to be contained in the actual texts
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     *
     * @returns this (an instance of PageElementMap)
     */
    containsText(texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): MapType;
    /**
     * Waits for the actual direct texts of all PageElements managed by PageElementMap to equal the expected direct texts.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directTexts the expected direct texts supposed to equal the actual direct texts
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     *
     * @returns this (an instance of PageElementMap)
     */
    hasDirectText(directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): MapType;
    /**
     * Waits for all PageElements managed by PageElementMap to have any direct text.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyDirectText` function for some
     * or all managed PageElements, the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     *
     * @returns this (an instance of PageElementMap)
     */
    hasAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): MapType;
    /**
     * Waits for the actual direct texts of all PageElements managed by PageElementMap to contain the expected direct
     * texts.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directTexts the expected direct texts supposed to be contained in the actual direct texts
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     *
     * @returns this (an instance of PageElementMap)
     */
    containsDirectText(directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): MapType;
    /**
     * returns the negated variants of PageElementMapWait's state check functions
     */
    readonly not: {
        /**
         * Waits for all PageElements managed by PageElementMap not to exist.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for
         * some or all managed PageElements and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         *
         * @returns this (an instance of PageElementMap)
         */
        exists: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        /**
         * Waits for all PageElements managed by PageElementMap not to be visible.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for
         * some or all managed PageElements and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         *
         * @returns this (an instance of PageElementMap)
         */
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        /**
         * Waits for all PageElements managed by PageElementMap not to be enabled.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for
         * some or all managed PageElements and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         *
         * @returns this (an instance of PageElementMap)
         */
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        /**
         * Waits for the actual texts of all PageElements managed by PageElementMap not to equal the expected texts.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param texts the expected texts supposed not to equal the actual texts
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         *
         * @returns this (an instance of PageElementMap)
         */
        hasText: (texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
        /**
         * Waits for all PageElements managed by PageElementMap not to have any text.
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
         * @returns this (an instance of PageElementMap)
         */
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        /**
         * Waits for the actual texts of all PageElements managed by PageElementMap not to contain the expected texts.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param texts the expected texts supposed not to be contained in the actual texts
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         *
         * @returns this (an instance of PageElementMap)
         */
        containsText: (texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
        /**
         * Waits for the actual direct texts of all PageElements managed by PageElementMap not to equal the expected
         * direct texts.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directTexts the expected direct texts not supposed to equal the actual direct texts
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         *
         * @returns this (an instance of PageElementMap)
         */
        hasDirectText: (directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
        /**
         * Waits for all PageElements managed by PageElementMap not to have any direct text.
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
         * @returns this (an instance of PageElementMap)
         */
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        /**
         * Waits for the actual direct texts of all PageElements managed by PageElementMap not to contain the expected
         * direct texts.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directTexts the expected direct texts supposed not to be contained in the actual direct texts
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         *
         * @returns this (an instance of PageElementMap)
         */
        containsDirectText: (directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
    };
}
/**
 * This class defines all `eventually` functions of PageElementMap.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template K the key names of PageElementMap's `$` accessor used to access the map's managed PageElements
 * @template PageElementType type of the PageElements managed by PageElementMap
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the PageElements managed
 * by PageElementMap
 * @template MapType type of the PageElementMap for which PageElementMapEventually defines all `eventually` functions
 */
export declare class PageElementMapEventually<Store extends PageNodeStore, K extends string, PageElementType extends PageElement<Store>, PageElementOpts extends Partial<IPageElementOpts<Store>>, MapType extends PageElementMap<Store, K, PageElementType, PageElementOpts>> extends PageNodeEventually<Store, MapType> {
    /**
     * Returns true if all PageElements managed by PageElementMap eventually exist within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     */
    exists(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): boolean;
    /**
     * Returns true if all PageElements managed by PageElementMap eventually are visible within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     */
    isVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): boolean;
    /**
     * Returns true if all PageElements managed by PageElementMap eventually are enabled within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     */
    isEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): boolean;
    /**
     * Returns true if the actual texts of all PageElements managed by PageElementMap eventually equal the expected texts
     * within a specific timeout.
     *
     * @param texts the expected texts supposed to equal the actual texts
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     */
    hasText(texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if all PageElements managed by PageElementMap eventually have any text within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyText` function for some
     * or all managed PageElements, the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     */
    hasAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): boolean;
    /**
     * Returns true if the actual texts of all PageElements managed by PageElementMap eventually contain the expected texts
     * within a specific timeout.
     *
     * @param texts the expected texts supposed to be contained in the actual texts
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     */
    containsText(texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if the actual direct texts of all PageElements managed by PageElementMap eventually equal the expected
     * direct texts within a specific timeout.
     *
     * @param directTexts the expected direct texts supposed to equal the actual direct texts
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     */
    hasDirectText(directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if all PageElements managed by PageElementMap eventually have any direct text within a specific
     * timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyDirectText` function for
     * some or all managed PageElements, the `timeout` within which the condition is expected to be met and the `interval`
     * used to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     */
    hasAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): boolean;
    /**
     * Returns true if the actual direct texts of all PageElements managed by PageElementMap eventually contain the
     * expected direct texts within a specific timeout.
     *
     * @param directTexts the expected direct texts supposed to be contained in the actual direct texts
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     * If no `interval` is specified, a PageElement's default interval is used.
     */
    containsDirectText(directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * returns the negated variants of PageElementMapEventually's state check functions
     */
    readonly not: {
        /**
         * Returns true if all PageElements managed by PageElementMap eventually do not exist within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some
         * or all managed PageElements and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         */
        exists: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementMap eventually are not visible within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for
         * some or all managed PageElements and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         */
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementMap eventually are not enabled within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for
         * some or all managed PageElements and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         */
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        /**
         * Returns true if the actual texts of all PageElements managed by PageElementMap eventually do not equal the
         * expected texts within a specific timeout.
         *
         * @param texts the expected texts supposed not to equal the actual texts
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         */
        hasText: (texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementMap eventually do not have any text within a specific
         * timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyText` function for
         * some or all managed PageElements, the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         */
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        /**
         * Returns true if the actual texts of all PageElements managed by PageElementMap eventually do not contain the
         * expected texts within a specific timeout.
         *
         * @param texts the expected texts supposed not to be contained in the actual texts
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         */
        containsText: (texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if the actual direct texts of all PageElements managed by PageElementMap eventually do not equal
         * the expected direct texts within a specific timeout.
         *
         * @param directTexts the expected direct texts supposed not to equal the actual direct texts
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         */
        hasDirectText: (directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if all PageElements managed by PageElementMap eventually do not have any direct text within a
         * specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyDirectText` function
         * for some or all managed PageElements, the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         */
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        /**
         * Returns true if the actual direct texts of all PageElements managed by PageElementMap eventually do not contain
         * the expected direct texts within a specific timeout.
         *
         * @param directTexts the expected direct texts supposed not to be contained in the actual direct texts
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         * If no `interval` is specified, a PageElement's default interval is used.
         */
        containsDirectText: (directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
    };
}
