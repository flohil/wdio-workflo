"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const helpers_1 = require("../../helpers");
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
class PageElementMap extends _1.PageNode {
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
    constructor(selector, _a) {
        var { identifier, elementStoreFunc, elementOpts: elementOptions } = _a, superOpts = __rest(_a, ["identifier", "elementStoreFunc", "elementOpts"]);
        super(selector, superOpts);
        this._selector = selector;
        this._elementOpts = elementOptions;
        this._elementStoreFunc = elementStoreFunc;
        this._identifier = identifier;
        this._$ = Workflo.Object.mapProperties(this._identifier.mappingObject, (value, key) => this._elementStoreFunc.apply(this._store, [
            this._identifier.mappingFunc(this._selector, value),
            this._elementOpts
        ]));
        this.currently = new PageElementMapCurrently(this);
        this.wait = new PageElementMapWait(this);
        this.eventually = new PageElementMapEventually(this);
    }
    /**
     * `$` provides access to all mapped PageElements of PageElementMap.
     */
    get $() {
        return this._$;
    }
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
    changeMappingObject(mappingObject) {
        this._$ = Workflo.Object.mapProperties(mappingObject, (value, key) => this._elementStoreFunc.apply(this._store, [
            this._identifier.mappingFunc(this._selector, value),
            this._elementOpts
        ]));
    }
    // GETTER FUNCTIONS
    /**
     * Returns the "base" XPath selector that identifies all PageElements managed by PageElementMap.
     */
    getSelector() {
        return this._selector;
    }
    /**
     * Returns the texts of all PageElements managed by PageElementMap as a result map after performing the initial
     * waiting condition of each PageElement.
     *
     * @param filterMask can be used to skip the invocation of the `getText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getText(filterMask) {
        return this.eachGet(this._$, node => node.getText(), filterMask);
    }
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
    getDirectText(filterMask) {
        return this.eachGet(this._$, node => node.getDirectText(), filterMask);
    }
    /**
     * Returns the 'enabled' status of all PageElements managed by PageElementMap as a result map after performing the
     * initial waiting condition of each PageElement.
     *
     * @param filterMask can be used to skip the invocation of the `getIsEnabled` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getIsEnabled(filterMask) {
        return this.eachGet(this.$, node => node.getIsEnabled(), filterMask);
    }
    /**
     * Returns the 'hasText' status of all PageElements managed by PageElementMap as a result map after performing the
     * initial waiting condition of each managed PageElement.
     *
     * A PageElement's 'hasText' status is set to true if its actual text equals the expected text.
     *
     * @param texts the expected texts used in the comparisons which set the 'hasText' status
     */
    getHasText(texts) {
        return this.eachCompare(this.$, (element, expected) => element.currently.hasText(expected), texts);
    }
    /**
     * Returns the 'hasAnyText' status of all PageElements managed by PageElementMap as a result map after performing
     * the initial waiting condition of each managed PageElement.
     *
     * A PageElement's 'hasAnyText' status is set to true if the PageElement has any text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getHasAnyText(filterMask) {
        return this.eachCompare(this.$, (element) => element.currently.hasAnyText(), filterMask, true);
    }
    /**
     * Returns the 'containsText' status of all PageElements managed by PageElementMap as a result map after performing
     * the initial waiting condition of each managed PageElement.
     *
     * A PageElement's 'containsText' status is set to true if its actual text contains the expected text.
     *
     * @param texts the expected texts used in the comparisons which set the 'containsText' status
     */
    getContainsText(texts) {
        return this.eachCompare(this.$, (element, expected) => element.currently.containsText(expected), texts);
    }
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
    getHasDirectText(directTexts) {
        return this.eachCompare(this.$, (element, expected) => element.currently.hasDirectText(expected), directTexts);
    }
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
    getHasAnyDirectText(filterMask) {
        return this.eachCompare(this.$, (element) => element.currently.hasAnyDirectText(), filterMask, true);
    }
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
    getContainsDirectText(directTexts) {
        return this.eachCompare(this.$, (element, expected) => element.currently.containsDirectText(expected), directTexts);
    }
    // HELPER FUNCTIONS
    /**
     * Used to determine if a function of a managed PageElement should be invoked or if its invocation should be skipped
     * because the PageElement is not included by a filterMask.
     *
     * @param filter a filterMask entry that refers to a corresponding managed PageElement
     */
    _includedInFilter(value) {
        return (typeof value === 'boolean' && value === true);
    }
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
    eachCompare(context, checkFunc, expected, isFilterMask = false) {
        const result = {};
        for (const key in context) {
            if (helpers_1.isNullOrUndefined(expected)) {
                result[key] = checkFunc(context[key]);
            }
            else {
                const expectedValue = expected[key];
                if (isFilterMask) {
                    if (this._includedInFilter(expectedValue)) {
                        result[key] = checkFunc(context[key], expectedValue);
                    }
                }
                else {
                    if (typeof expectedValue !== 'undefined') {
                        result[key] = checkFunc(context[key], expectedValue);
                    }
                }
            }
        }
        return result;
    }
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
    eachCheck(context, checkFunc, expected, isFilterMask = false) {
        const diffs = {};
        for (const key in context) {
            if (helpers_1.isNullOrUndefined(expected)) {
                if (!checkFunc(context[key])) {
                    diffs[`.${key}`] = context[key].__lastDiff;
                }
            }
            else {
                if (isFilterMask) {
                    if (this._includedInFilter(expected[key])) {
                        if (!checkFunc(context[key])) {
                            diffs[`.${key}`] = context[key].__lastDiff;
                        }
                    }
                }
                else {
                    if (typeof expected[key] !== 'undefined') {
                        if (!checkFunc(context[key], expected[key])) {
                            diffs[`.${key}`] = context[key].__lastDiff;
                        }
                    }
                }
            }
        }
        this._lastDiff = {
            tree: diffs
        };
        return Object.keys(diffs).length === 0;
    }
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
    eachGet(context, getFunc, filterMask) {
        let result = {};
        for (const key in context) {
            if (helpers_1.isNullOrUndefined(filterMask)) {
                result[key] = getFunc(context[key]);
            }
            else {
                if (this._includedInFilter(filterMask[key])) {
                    result[key] = getFunc(context[key]);
                }
            }
        }
        return result;
    }
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
    eachWait(context, waitFunc, expected, isFilterMask = false) {
        for (const key in context) {
            if (helpers_1.isNullOrUndefined(expected)) {
                waitFunc(context[key]);
            }
            else {
                if (isFilterMask) {
                    if (this._includedInFilter(expected[key])) {
                        waitFunc(context[key]);
                    }
                }
                else if (typeof expected[key] !== 'undefined') {
                    waitFunc(context[key], expected[key]);
                }
            }
        }
        return this;
    }
    /**
     * Invokes an action for each of PageElementMap's managed PageElements.
     *
     * @param action an action executed for each of PageElementMap's managed PageElements
     * @param filterMask can be used to skip the execution of an action for some or all PageElements
     * @returns this (an instance of PageElementMap)
     */
    eachDo(action, filterMask) {
        const context = this.$;
        for (const key in context) {
            if (helpers_1.isNullOrUndefined(filterMask)) {
                action(context[key]);
            }
            else {
                if (this._includedInFilter(filterMask[key])) {
                    action(context[key]);
                }
            }
        }
        return this;
    }
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
    eachSet(context, setFunc, values) {
        for (const key in context) {
            if (values) {
                if (typeof values[key] !== 'undefined') {
                    setFunc(context[key], values[key]);
                }
            }
            else {
                setFunc(context[key]);
            }
        }
        return this;
    }
}
exports.PageElementMap = PageElementMap;
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
class PageElementMapCurrently extends _1.PageNodeCurrently {
    /**
     * Returns the current texts of all PageElements managed by PageElementMap as a result map.
     *
     * @param filterMask can be used to skip the invocation of the `getText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getText(filterMask) {
        return this._node.eachGet(this._node.$, node => node.currently.getText(), filterMask);
    }
    /**
     * Returns the current direct texts of all PageElements managed by PageElementMap as a result map.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `getDirectText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getDirectText(filterMask) {
        return this._node.eachGet(this._node.$, node => node.currently.getDirectText(), filterMask);
    }
    /**
     * Returns the current 'exists' status of all PageElements managed by PageElementMap as a result map.
     *
     * @param filterMask can be used to skip the invocation of the `getExists` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getExists(filterMask) {
        return this._node.eachGet(this._node.$, node => node.currently.exists(), filterMask);
    }
    /**
     * Returns the current 'visible' status of all PageElements managed by PageElementMap as a result map.
     *
     * @param filterMask can be used to skip the invocation of the `getIsVisible` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getIsVisible(filterMask) {
        return this._node.eachGet(this._node.$, node => node.currently.isVisible(), filterMask);
    }
    /**
     * Returns the current 'enabled' status of all PageElements managed by PageElementMap as a result map.
     *
     * @param filterMask can be used to skip the invocation of the `getIsEnabled` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getIsEnabled(filterMask) {
        return this._node.eachGet(this._node.$, node => node.currently.isEnabled(), filterMask);
    }
    /**
     * Returns the current 'hasText' status of all PageElements managed by PageElementMap as a result map.
     *
     * A PageElement's 'hasText' status is set to true if its actual text equals the expected text.
     *
     * @param texts the expected texts used in the comparisons which set the 'hasText' status
     */
    getHasText(texts) {
        return this._node.eachCompare(this._node.$, (element, expected) => element.currently.hasText(expected), texts);
    }
    /**
     * Returns the current 'hasAnyText' status of all PageElements managed by PageElementMap as a result map.
     *
     * A PageElement's 'hasAnyText' status is set to true if the PageElement has any text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results object.
     */
    getHasAnyText(filterMask) {
        return this._node.eachCompare(this._node.$, (element) => element.currently.hasAnyText(), filterMask, true);
    }
    /**
     * Returns the current 'containsText' status of all PageElements managed by PageElementMap as a result map.
     *
     * A PageElement's 'containsText' status is set to true if its actual text contains the expected text.
     *
     * @param texts the expected texts used in the comparisons which set the 'containsText' status
     */
    getContainsText(texts) {
        return this._node.eachCompare(this._node.$, (element, expected) => element.currently.containsText(expected), texts);
    }
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
    getHasDirectText(directTexts) {
        return this._node.eachCompare(this._node.$, (element, expected) => element.currently.hasDirectText(expected), directTexts);
    }
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
    getHasAnyDirectText(filterMask) {
        return this._node.eachCompare(this._node.$, (element) => element.currently.hasAnyDirectText(), filterMask, true);
    }
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
    getContainsDirectText(directTexts) {
        return this._node.eachCompare(this._node.$, (element, expected) => element.currently.containsDirectText(expected), directTexts);
    }
    /**
     * Returns true if all PageElements managed by PageElementMap currently exist.
     *
     * @param filterMask can be used to skip the invocation of the `exists` function for some or all managed
     * PageElements
     */
    exists(filterMask) {
        return this._node.eachCheck(this._node.$, element => element.currently.exists(), filterMask, true);
    }
    /**
     * Returns true if all PageElements managed by PageElementMap are currently visible.
     *
     * @param filterMask can be used to skip the invocation of the `isVisible` function for some or all managed
     * PageElements
     */
    isVisible(filterMask) {
        return this._node.eachCheck(this._node.$, element => element.currently.isVisible(), filterMask, true);
    }
    /**
     * Returns true if all PageElements managed by PageElementMap are currently enabled.
     *
     * @param filterMask can be used to skip the invocation of the `isEnabled` function for some or all managed
     * PageElements
     */
    isEnabled(filterMask) {
        return this._node.eachCheck(this._node.$, element => element.currently.isEnabled(), filterMask, true);
    }
    /**
     * Returns true if the actual texts of all PageElements managed by PageElementMap currently equal the expected texts.
     *
     * @param texts the expected texts supposed to equal the actual texts
     */
    hasText(texts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.currently.hasText(expected), texts);
    }
    /**
     * Returns true if all PageElements managed by PageElementMap currently have any text.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyText` function for some or all managed
     * PageElements
     */
    hasAnyText(filterMask) {
        return this._node.eachCheck(this._node.$, (element) => element.currently.hasAnyText(), filterMask, true);
    }
    /**
     * Returns true if the actual texts of all PageElements managed by PageElementMap currently contain the expected texts.
     *
     * @param texts the expected texts supposed to be contained in the actual texts
     */
    containsText(texts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.currently.containsText(expected), texts);
    }
    /**
     * Returns true if the actual direct texts of all PageElements managed by PageElementMap currently equal the expected
     * direct texts.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directTexts the expected direct texts supposed to equal the actual direct texts
     */
    hasDirectText(directTexts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.currently.hasDirectText(expected), directTexts);
    }
    /**
     * Returns true if all PageElements managed by PageElementMap currently have any direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyDirectText` function for some or all managed
     * PageElements
     */
    hasAnyDirectText(filterMask) {
        return this._node.eachCheck(this._node.$, (element) => element.currently.hasAnyDirectText(), filterMask, true);
    }
    /**
     * Returns true if the actual direct texts of all PageElements managed by PageElementMap currently contain the
     * expected direct texts.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directTexts the expected direct texts supposed to be contained in the actual direct texts
     */
    containsDirectText(directTexts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.currently.containsDirectText(expected), directTexts);
    }
    /**
     * returns the negated variants of PageElementMapCurrently's state check functions
     */
    get not() {
        return {
            /**
             * Returns true if all PageElements managed by PageElementMap currently do not exist.
             *
             * @param filterMask can be used to skip the invocation of the `exists` function for some or all managed
             * PageElements
             */
            exists: (filterMask) => {
                return this._node.eachCheck(this._node.$, element => element.currently.not.exists(), filterMask, true);
            },
            /**
             * Returns true if all PageElements managed by PageElementMap are currently not visible.
             *
             * @param filterMask can be used to skip the invocation of the `isVisible` function for some or all managed
             * PageElements
             */
            isVisible: (filterMask) => {
                return this._node.eachCheck(this._node.$, element => element.currently.not.isVisible(), filterMask, true);
            },
            /**
             * Returns true if all PageElements managed by PageElementMap are currently not enabled.
             *
             * @param filterMask can be used to skip the invocation of the `isEnabled` function for some or all managed
             * PageElements
             */
            isEnabled: (filterMask) => {
                return this._node.eachCheck(this._node.$, element => element.currently.not.isEnabled(), filterMask, true);
            },
            /**
             * Returns true if the actual texts of all PageElements managed by PageElementMap currently do not equal the
             * expected texts.
             *
             * @param texts the expected texts supposed not to equal the actual texts
             */
            hasText: (text) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.currently.not.hasText(expected), text);
            },
            /**
             * Returns true if all PageElements managed by PageElementMap currently do not have any text.
             *
             * @param filterMask can be used to skip the invocation of the `hasAnyText` function for some or all managed
             * PageElements
             */
            hasAnyText: (filterMask) => {
                return this._node.eachCheck(this._node.$, (element) => element.currently.not.hasAnyText(), filterMask, true);
            },
            /**
             * Returns true if the actual texts of all PageElements managed by PageElementMap currently do not contain the
             * expected texts.
             *
             * @param texts the expected texts supposed not to be contained in the actual texts
             */
            containsText: (text) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.currently.not.containsText(expected), text);
            },
            /**
             * Returns true if the actual direct texts of all PageElements managed by PageElementMap currently do not equal
             * the expected direct texts.
             *
             * A direct text is a text that resides on the level directly below the selected HTML element.
             * It does not include any text of the HTML element's nested children HTML elements.
             *
             * @param directTexts the expected direct texts supposed not to equal the actual direct texts
             */
            hasDirectText: (directText) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.currently.not.hasDirectText(expected), directText);
            },
            /**
             * Returns true if all PageElements managed by PageElementMap currently do not have any direct text.
             *
             * A direct text is a text that resides on the level directly below the selected HTML element.
             * It does not include any text of the HTML element's nested children HTML elements.
             *
             * @param filterMask can be used to skip the invocation of the `hasAnyDirectText` function for some or all managed
             * PageElements
             */
            hasAnyDirectText: (filterMask) => {
                return this._node.eachCheck(this._node.$, (element) => element.currently.not.hasAnyDirectText(), filterMask, true);
            },
            /**
             * Returns true if the actual direct texts of all PageElements managed by PageElementMap currently do not contain
             * the expected direct texts.
             *
             * A direct text is a text that resides on the level directly below the selected HTML element.
             * It does not include any text of the HTML element's nested children HTML elements.
             *
             * @param directTexts the expected direct texts supposed not to be contained in the actual direct texts
             */
            containsDirectText: (directText) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.currently.not.containsDirectText(expected), directText);
            }
        };
    }
}
exports.PageElementMapCurrently = PageElementMapCurrently;
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
class PageElementMapWait extends _1.PageNodeWait {
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
    exists(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.$, element => element.wait.exists(otherOpts), filterMask, true);
    }
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
    isVisible(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.$, element => element.wait.isVisible(otherOpts), filterMask, true);
    }
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
    isEnabled(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.$, element => element.wait.isEnabled(otherOpts), filterMask, true);
    }
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
    hasText(texts, opts) {
        return this._node.eachWait(this._node.$, (element, expected) => element.wait.hasText(expected, opts), texts);
    }
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
    hasAnyText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.$, (element) => element.wait.hasAnyText(otherOpts), filterMask, true);
    }
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
    containsText(texts, opts) {
        return this._node.eachWait(this._node.$, (element, expected) => element.wait.containsText(expected, opts), texts);
    }
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
    hasDirectText(directTexts, opts) {
        return this._node.eachWait(this._node.$, (element, expected) => element.wait.hasDirectText(expected, opts), directTexts);
    }
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
    hasAnyDirectText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.$, (element) => element.wait.hasAnyDirectText(otherOpts), filterMask, true);
    }
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
    containsDirectText(directTexts, opts) {
        return this._node.eachWait(this._node.$, (element, expected) => element.wait.containsDirectText(expected, opts), directTexts);
    }
    /**
     * returns the negated variants of PageElementMapWait's state check functions
     */
    get not() {
        return {
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
            exists: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.$, element => element.wait.not.exists(otherOpts), filterMask, true);
            },
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
            isVisible: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.$, element => element.wait.not.isVisible(otherOpts), filterMask, true);
            },
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
            isEnabled: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.$, element => element.wait.not.isEnabled(otherOpts), filterMask, true);
            },
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
            hasText: (texts, opts) => {
                return this._node.eachWait(this._node.$, (element, expected) => element.wait.not.hasText(expected, opts), texts);
            },
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
            hasAnyText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.$, (element) => element.wait.not.hasAnyText(otherOpts), filterMask, true);
            },
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
            containsText: (texts, opts) => {
                return this._node.eachWait(this._node.$, (element, expected) => element.wait.not.containsText(expected, opts), texts);
            },
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
            hasDirectText: (directTexts, opts) => {
                return this._node.eachWait(this._node.$, (element, expected) => element.wait.not.hasDirectText(expected, opts), directTexts);
            },
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
            hasAnyDirectText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.$, (element) => element.wait.not.hasAnyDirectText(otherOpts), filterMask, true);
            },
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
            containsDirectText: (directTexts, opts) => {
                return this._node.eachWait(this._node.$, (element, expected) => element.wait.not.containsDirectText(expected, opts), directTexts);
            }
        };
    }
}
exports.PageElementMapWait = PageElementMapWait;
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
class PageElementMapEventually extends _1.PageNodeEventually {
    /**
     * Returns true if all PageElements managed by PageElementMap eventually exist within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     */
    exists(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.$, element => element.eventually.exists(otherOpts), filterMask, true);
    }
    /**
     * Returns true if all PageElements managed by PageElementMap eventually are visible within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     */
    isVisible(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.$, element => element.eventually.isVisible(otherOpts), filterMask, true);
    }
    /**
     * Returns true if all PageElements managed by PageElementMap eventually are enabled within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     */
    isEnabled(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.$, element => element.eventually.isEnabled(otherOpts), filterMask, true);
    }
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
    hasText(texts, opts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.hasText(expected, opts), texts);
    }
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
    hasAnyText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.$, (element) => element.eventually.hasAnyText(otherOpts), filterMask, true);
    }
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
    containsText(texts, opts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.containsText(expected, opts), texts);
    }
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
    hasDirectText(directTexts, opts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.hasDirectText(expected, opts), directTexts);
    }
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
    hasAnyDirectText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.$, (element) => element.eventually.hasAnyDirectText(otherOpts), filterMask, true);
    }
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
    containsDirectText(directTexts, opts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.containsDirectText(expected, opts), directTexts);
    }
    /**
     * returns the negated variants of PageElementMapEventually's state check functions
     */
    get not() {
        return {
            /**
             * Returns true if all PageElements managed by PageElementMap eventually do not exist within a specific timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some
             * or all managed PageElements and the `timeout` within which the condition is expected to be met
             *
             * If no `timeout` is specified, a PageElement's default timeout is used.
             */
            exists: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.$, element => element.eventually.not.exists(otherOpts), filterMask, true);
            },
            /**
             * Returns true if all PageElements managed by PageElementMap eventually are not visible within a specific timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for
             * some or all managed PageElements and the `timeout` within which the condition is expected to be met
             *
             * If no `timeout` is specified, a PageElement's default timeout is used.
             */
            isVisible: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.$, element => element.eventually.not.isVisible(otherOpts), filterMask, true);
            },
            /**
             * Returns true if all PageElements managed by PageElementMap eventually are not enabled within a specific timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for
             * some or all managed PageElements and the `timeout` within which the condition is expected to be met
             *
             * If no `timeout` is specified, a PageElement's default timeout is used.
             */
            isEnabled: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.$, element => element.eventually.not.isEnabled(otherOpts), filterMask, true);
            },
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
            hasText: (texts, opts) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.not.hasText(expected, opts), texts);
            },
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
            hasAnyText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.$, (element) => element.eventually.not.hasAnyText(otherOpts), filterMask, true);
            },
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
            containsText: (texts, opts) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.not.containsText(expected, opts), texts);
            },
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
            hasDirectText: (directTexts, opts) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.not.hasDirectText(expected, opts), directTexts);
            },
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
            hasAnyDirectText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.$, (element) => element.eventually.not.hasAnyDirectText(otherOpts), filterMask, true);
            },
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
            containsDirectText: (directTexts, opts) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.not.containsDirectText(expected, opts), directTexts);
            }
        };
    }
}
exports.PageElementMapEventually = PageElementMapEventually;
//# sourceMappingURL=PageElementMap.js.map