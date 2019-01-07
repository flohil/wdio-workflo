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
const _ = require("lodash");
const util_1 = require("../../utility_functions/util");
const _1 = require(".");
const builders_1 = require("../builders");
const util_2 = require("util");
const PageNode_1 = require("./PageNode");
const helpers_1 = require("../../helpers");
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
class PageElementList extends _1.PageNode {
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
    constructor(selector, opts) {
        super(selector, opts);
        this.selector = selector;
        this._waitType = opts.waitType || "visible" /* visible */;
        this._disableCache = opts.disableCache || false;
        this._elementOpts = opts.elementOpts;
        this._elementStoreFunc = opts.elementStoreFunc;
        this._identifier = opts.identifier;
        this._identifiedObjCache = {};
        this.currently = new PageElementListCurrently(this, opts);
        this.wait = new PageElementListWait(this);
        this.eventually = new PageElementListEventually(this);
        this._$ = Object.create(null);
        for (const method of Workflo.Class.getAllMethods(this._store)) {
            if (method.indexOf('_') !== 0 && /^[A-Z]/.test(method)) {
                this._$[method] = (_selector, _options) => {
                    if (_selector instanceof builders_1.XPathBuilder) {
                        _selector = builders_1.XPathBuilder.getInstance().build();
                    }
                    // chain selectors
                    _selector = `${selector}${_selector}`;
                    return this._store[method].apply(this._store, [_selector, _options]);
                };
            }
        }
    }
    /**
     * Use this method to initialize properties that rely on the this type which is not available in the constructor.
     *
     * Make sure that this method is invoked immediately after construction.
     *
     * @param cloneFunc creates a copy of PageElementList which manages a subset of the original list's PageElements
     */
    init(cloneFunc) {
        this._whereBuilder = new builders_1.ListWhereBuilder(this._selector, {
            store: this._store,
            elementStoreFunc: this._elementStoreFunc,
            elementOpts: this._elementOpts,
            cloneFunc: cloneFunc,
            getAllFunc: list => list.all
        });
        this.currently.init(cloneFunc);
    }
    /**
     * This function performs PageElementList's initial waiting condition.
     *
     * It supports the following waiting types:
     *
     * - 'exist' to wait for at least one of PageElementList's managed elements to exist in the DOM
     * - 'visible' to wait for at least one of PageElementList's managed elements to become visible in the viewport
     * (not obscured by other elements, not set to 'hidden', not outside of the viewport...)
     * - 'text' to wait for at least one of PageElementList's managed elements to have any text
     *
     * @returns this (an instance of PageElementList)
     */
    initialWait() {
        switch (this._waitType) {
            case "exist" /* exist */:
                this.wait.any.exists();
                break;
            case "visible" /* visible */:
                this.wait.any.isVisible();
                break;
            case "text" /* text */:
                this.wait.any.hasAnyText();
                break;
            default:
                throw Error(`${this.constructor.name}: Unknown initial wait type '${this._waitType}'`);
        }
    }
    // RETRIEVAL FUNCTIONS for wdio or list elements
    // typescript bugs 3.3.0:
    // https://github.com/Microsoft/TypeScript/issues/24560, https://github.com/Microsoft/TypeScript/issues/24791
    /**
     * `$` provides access to the PageNode retrieval functions of PageElementList's PageElementStore and prefixes the
     * selectors of all PageNodes retrieved via `$` with the selector of PageElementList.
     */
    get $() {
        return this._$;
    }
    /**
     * Fetches all webdriverio elements identified by PageElementList's XPath selector from the HTML page after
     * performing PageElementList's initial waiting condition.
     */
    get elements() {
        this.initialWait();
        return browser.elements(this._selector);
    }
    /**
     * The `.where` accessor allows to - after performing PageElementList's initial waiting condition - select and
     * retrieve subsets of the PageElements managed by PageElementList by constraining the list's selector using XPath
     * modification functions.
     */
    get where() {
        this.initialWait();
        return this._whereBuilder.reset();
    }
    /**
     * Retrieves the first PageElement found in the DOM that is identified by PageElementList's XPath selector after
     * performing PageElementList's initial waiting condition.
     */
    get first() {
        return this.where.getFirst();
    }
    /**
     * Retrieves the PageElement found in the DOM at the defined index of occurrence that is identified by
     * PageElementList's XPath selector after performing PageElementList's initial waiting condition.
     *
     * @param index the index of occurrence in the DOM of the retrieved PageElement - STARTS AT 0
     */
    at(index) {
        return this.where.getAt(index);
    }
    /**
     * Retrieves all PageElements found in the DOM that are identified by PageElementList's XPath selector after
     * performing PageElementList's initial waiting condition.
     */
    get all() {
        const _elements = [];
        try {
            const value = this.elements.value;
            if (value && value.length) {
                // create list elements
                for (let i = 0; i < value.length; i++) {
                    // make each list element individually selectable via xpath
                    const selector = `(${this._selector})[${i + 1}]`;
                    const listElement = this._elementStoreFunc.apply(this._store, [selector, this._elementOpts]);
                    _elements.push(listElement);
                }
            }
            return _elements;
        }
        catch (error) {
            // this.elements will throw error if no elements were found
            return _elements;
        }
    }
    // INTERACTION functions
    /**
     * Sets a new default `identifier` for PageElementList's `identify` function.
     *
     * @param identifier used to identify a PageElementList's managed PageElements via the key names defined in `identifier`
     * 's `mappingObject` by matching `mappingObject`'s values with the return values of `identifier`'s `mappingFunc`
     */
    setIdentifier(identifier) {
        this._identifier = identifier;
        return this;
    }
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
    identify({ identifier = this._identifier, resetCache = false } = {}) {
        const cacheKey = (identifier) ? `${identifier.mappingObject.toString()}|||${identifier.mappingFunc.toString()}` : 'index';
        if (this._disableCache || resetCache || !(cacheKey in this._identifiedObjCache)) {
            const listElements = this.all;
            const mappedObj = {};
            if (identifier) { // manually set identifier
                const queryResults = {};
                // create hash where result of identifier func is key
                // and list element is value
                listElements.forEach((element) => {
                    const resultKey = identifier.mappingFunc(element);
                    queryResults[resultKey] = element;
                });
                // Assign each key in identifier's object a list element by
                // mapping queryResult's keys to identifier mapObject's values
                for (const key in identifier.mappingObject) {
                    if (identifier.mappingObject.hasOwnProperty(key)) {
                        mappedObj[key] = queryResults[identifier.mappingObject[key]];
                    }
                }
            }
            else { // default identifier -> mapped by index of results
                for (let i = 0; i < listElements.length; ++i) {
                    mappedObj[i] = listElements[i];
                }
            }
            this._identifiedObjCache[cacheKey] = mappedObj;
        }
        return this._identifiedObjCache[cacheKey];
    }
    // PUBLIC GETTER FUNCTIONS
    /**
     * Returns the XPath selector that identifies all PageElements managed by PageElementList.
     */
    getSelector() {
        return this._selector;
    }
    /**
     * Returns the number of PageElements managed by PageElementList (the number of PageElements found in the DOM which
     * are identified by PageElementList's XPath selector) after performing PageElementList's initial waiting condition.
     */
    getLength() {
        try {
            const value = this.elements.value;
            if (value && value.length) {
                return value.length;
            }
            else {
                return 0;
            }
        }
        catch (error) {
            // this.elements will throw error if no elements were found
            return 0;
        }
    }
    /**
     * Returns the texts of all PageElements managed by PageElementList as an array after performing PageElementList's
     * initial waiting condition.
     *
     * @param filterMask can be used to skip the invocation of the `getText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getText(filterMask) {
        return this.eachGet(this.all, element => element.getText(), filterMask);
    }
    /**
     * Returns the direct texts of all PageElements managed by PageElementList as an array after performing
     * PageElementList's initial waiting condition.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `getDirectText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getDirectText(filterMask) {
        return this.eachGet(this.all, element => element.getDirectText(), filterMask);
    }
    /**
     * Returns the 'enabled' status of all PageElements managed by PageElementList as an array after performing
     * PageElementList's initial waiting condition.
     *
     * @param filterMask can be used to skip the invocation of the `getIsEnabled` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getIsEnabled(filterMask) {
        return this.eachGet(this.all, element => element.currently.isEnabled(), filterMask);
    }
    /**
     * Returns the 'hasText' status of all PageElements managed by PageElementList as an array after performing
     * PageElementList's initial waiting condition.
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
    getHasText(text) {
        return this.eachCompare(this.all, (element, expected) => element.currently.hasText(expected), text);
    }
    /**
     * Returns the 'hasAnyText' status of all PageElements managed by PageElementList as an array after performing
     * PageElementList's initial waiting condition.
     *
     * A PageElement's 'hasAnyText' status is set to true if the PageElement has any text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getHasAnyText(filterMask) {
        return this.eachCompare(this.all, (element) => element.currently.hasAnyText(), filterMask, true);
    }
    /**
     * Returns the 'containsText' status of all PageElements managed by PageElementList as an array after performing
     * PageElementList's initial waiting condition.
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
    getContainsText(text) {
        return this.eachCompare(this.all, (element, expected) => element.currently.containsText(expected), text);
    }
    /**
     * Returns the 'hasDirectText' status of all PageElements managed by PageElementList as an array after performing
     * PageElementList's initial waiting condition.
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
    getHasDirectText(directText) {
        return this.eachCompare(this.all, (element, expected) => element.currently.hasDirectText(expected), directText);
    }
    /**
     * Returns the 'hasAnyDirectText' status of all PageElements managed by PageElementList as an array after performing
     * PageElementList's initial waiting condition.
     *
     * A PageElement's 'hasAnyDirectText' status is set to true if the PageElement has any direct text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyDirectText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getHasAnyDirectText(filterMask) {
        return this.eachCompare(this.all, (element) => element.currently.hasAnyDirectText(), filterMask, true);
    }
    /**
     * Returns the 'containsDirectText' status of all PageElements managed by PageElementList as an array after performing
     * PageElementList's initial waiting condition.
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
    getContainsDirectText(directText) {
        return this.eachCompare(this.all, (element, expected) => element.currently.containsDirectText(expected), directText);
    }
    // HELPER FUNCTIONS
    /**
     * Used to determine if a function of a managed PageElement should be invoked or if its invocation should be skipped
     * because the PageElement is not included by a filterMask.
     *
     * @param filter a filterMask entry that refers to a corresponding managed PageElement
     */
    _includedInFilter(filter) {
        return (typeof filter === 'boolean' && filter === true);
    }
    /**
     * Invokes a state check function for each PageElement in a passed `elements` array and returns an array of state
     * check function results.
     *
     * @template T the type of a single expected value or the type of an array element in an expected values array
     * @param elements an array containing all PageElements for which `checkFunc` should be executed
     * @param checkFunc a state check function executed for each PageElement in `elements`. It is passed a PageElement as
     * first parameter and an expected value used by the state check condition as an optional second parameter.
     * @param expected a single expected value or an array of expected values used for the state check conditions
     *
     * If `expected` is a single value, this value is compared to each element in the array of actual values.
     * If `expected` is an array of values, its length must match the length of `elements` and the values of its
     * array elements are compared to the array of actual values.
     * @param isFilterMask if set to true, the `expected` parameter represents a filterMask which can be used to skip the
     * invocation of the state check function for some or all PageElements.
     * The results of skipped function invocations are not included in the total results array.
     * @returns an array of results of a state check function executed for each PageElement of `elements`
     */
    eachCompare(elements, checkFunc, expected, isFilterMask = false) {
        const result = [];
        if (util_2.isArray(expected) && expected.length !== elements.length) {
            throw new Error(`${this.constructor.name}: ` +
                `Length of expected (${expected.length}) did not match length of list (${elements.length})\n` +
                `( ${this._selector} )`);
        }
        for (let i = 0; i < elements.length; ++i) {
            const _expected = util_2.isArray(expected) ? expected[i] : expected;
            const element = elements[i];
            if (isFilterMask) {
                if (helpers_1.isNullOrUndefined(expected) || this._includedInFilter(_expected)) {
                    result.push(checkFunc(element, _expected));
                }
            }
            else {
                result.push(checkFunc(element, _expected));
            }
        }
        return result;
    }
    /**
     * Invokes a state check function for each PageElement in a passed `elements` array and returns true if the result of
     * each state check function invocation was true.
     *
     * If the passed `elements` array was empty, this function will always return true.
     *
     * @template T the type of a single expected value or the type of an array element in an expected values array
     * @param elements an array containing all PageElements for which `checkFunc` should be executed
     * @param checkFunc a state check function executed for each PageElement in `elements`. It is passed a PageElement as
     * first parameter and an expected value used by the state check condition as an optional second parameter.
     * @param expected a single expected value or an array of expected values used for the state check conditions
     *
     * If `expected` is a single value, this value is compared to each element in the array of actual values.
     * If `expected` is an array of values, its length must match the length of `elements` and the values of its
     * array elements are compared to the array of actual values.
     * @param isFilterMask if set to true, the `expected` parameter represents a filterMask which can be used to skip the
     * invocation of the state check function for some or all PageElements
     * @returns true if the state check functions of all checked PageElements returned true or if no state check functions
     * were invoked at all
     */
    eachCheck(elements, checkFunc, expected, isFilterMask = false) {
        const diffs = {};
        if (util_2.isArray(expected) && expected.length !== elements.length) {
            throw new Error(`${this.constructor.name}: ` +
                `Length of expected (${expected.length}) did not match length of list (${elements.length})\n` +
                `( ${this._selector} )`);
        }
        for (let i = 0; i < elements.length; ++i) {
            const _expected = util_2.isArray(expected) ? expected[i] : expected;
            const element = elements[i];
            if (isFilterMask) {
                if (helpers_1.isNullOrUndefined(expected) || this._includedInFilter(_expected)) {
                    if (!checkFunc(element, _expected)) {
                        diffs[`[${i + 1}]`] = element.__lastDiff;
                    }
                }
            }
            else {
                if (!checkFunc(element, _expected)) {
                    diffs[`[${i + 1}]`] = element.__lastDiff;
                }
            }
        }
        this._lastDiff = {
            tree: diffs
        };
        return Object.keys(diffs).length === 0;
    }
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
    eachGet(elements, getFunc, filterMask) {
        if (helpers_1.isNullOrUndefined(filterMask)) {
            return elements.map(element => getFunc(element));
        }
        else if (filterMask !== false) {
            const result = [];
            if (util_2.isArray(filterMask) && filterMask.length !== elements.length) {
                throw new Error(`${this.constructor.name}: ` +
                    `Length of filterMask array (${filterMask.length}) did not match length of list (${elements.length})\n` +
                    `( ${this._selector} )`);
            }
            for (let i = 0; i < elements.length; ++i) {
                const _filterMask = util_2.isArray(filterMask) ? filterMask[i] : filterMask;
                const element = elements[i];
                if (this._includedInFilter(_filterMask)) {
                    result.push(getFunc(element));
                }
            }
            return result;
        }
        else {
            return [];
        }
    }
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
     * invocation of the state check function for some or all PageElements
     * @returns this (an instance of PageElementList)
     */
    eachWait(elements, waitFunc, expected, isFilterMask = false) {
        if (util_2.isArray(expected) && expected.length !== elements.length) {
            throw new Error(`${this.constructor.name}: ` +
                `Length of expected (${expected.length}) did not match length of list (${elements.length})\n` +
                `( ${this._selector} )`);
        }
        for (let i = 0; i < elements.length; ++i) {
            const _expected = util_2.isArray(expected) ? expected[i] : expected;
            const element = elements[i];
            if (isFilterMask) {
                if (helpers_1.isNullOrUndefined(expected) || this._includedInFilter(_expected)) {
                    waitFunc(element);
                }
            }
            else {
                waitFunc(element, _expected);
            }
        }
        return this;
    }
    /**
     * Executes an action for each of PageElementList's managed PageElements.
     *
     * @param doFunc an action executed for each of PageElementList's managed PageElements
     * @param filterMask can be used to skip the execution of an action for some or all PageElements
     * @returns this (an instance of PageElementList)
     */
    eachDo(doFunc, filterMask) {
        const elements = this.all;
        if (helpers_1.isNullOrUndefined(filterMask)) {
            elements.map(element => doFunc(element));
        }
        else if (filterMask !== false) {
            if (util_2.isArray(filterMask) && filterMask.length !== elements.length) {
                throw new Error(`${this.constructor.name}: ` +
                    `Length of filterMask array (${filterMask.length}) did not match length of list (${elements.length})\n` +
                    `( ${this._selector} )`);
            }
            for (let i = 0; i < elements.length; ++i) {
                const _filterMask = util_2.isArray(filterMask) ? filterMask[i] : filterMask;
                const element = elements[i];
                if (this._includedInFilter(_filterMask)) {
                    doFunc(element);
                }
            }
        }
        return this;
    }
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
    eachSet(elements, setFunc, values) {
        if (_.isArray(values)) {
            if (elements.length !== values.length) {
                throw new Error(`Length of values array (${values.length}) did not match length of list page elements (${elements.length})\n` +
                    `( ${this._selector} )`);
            }
            else {
                for (let i = 0; i < elements.length; i++) {
                    setFunc(elements[i], values[i]);
                }
            }
        }
        else {
            for (let i = 0; i < elements.length; i++) {
                setFunc(elements[i], values);
            }
        }
        return this;
    }
}
exports.PageElementList = PageElementList;
/**
 * This class defines all `currently` functions of PageElementList.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement managed by PageElementList
 * @template PageElementOpts type of the opts paramter passed to the constructor function of managed PageElements
 * @template ListType type of the PageElementList for which PageElementListCurrently defines all `currently` functions
 */
class PageElementListCurrently extends PageNode_1.PageNodeCurrently {
    /**
     * This class defines all `currently` functions of PageElementList.
     *
     * @param node an instance of the PageElementList for which PageElementListCurrently defines all `currently` functions
     * @param opts the opts used to configure PageElementList
     */
    constructor(node, opts) {
        super(node);
        this._selector = node.getSelector();
        this._store = opts.store;
        this._elementOpts = opts.elementOpts;
        this._elementStoreFunc = opts.elementStoreFunc;
        this._node = node;
    }
    /**
     * Use this method to initialize properties that rely on the this type which is not available in the constructor.
     *
     * Make sure that this method is invoked immediately after construction.
     *
     * @param cloneFunc creates a copy of PageElementList which manages a subset of the original list's PageElements
     */
    init(cloneFunc) {
        this._whereBuilder = new builders_1.ListWhereBuilder(this._selector, {
            store: this._store,
            elementStoreFunc: this._elementStoreFunc,
            elementOpts: this._elementOpts,
            cloneFunc: cloneFunc,
            getAllFunc: list => list.all
        });
    }
    // RETRIEVAL FUNCTIONS for wdio or list elements
    /**
     * Immediatly fetches all webdriverio elements identified by PageElementList's XPath selector from the HTML page.
     */
    get elements() {
        return browser.elements(this._selector);
    }
    /**
     * The `.where` accessor allows to select and retrieve subsets of the PageElements managed by PageElementList by
     * constraining the list's selector using XPath modification functions.
     */
    get where() {
        return this._whereBuilder.reset();
    }
    /**
     * Retrieves the first PageElement found in the DOM that is identified by PageElementList's XPath selector.
     */
    get first() {
        return this.where.getFirst();
    }
    /**
     * Retrieves the PageElement found in the DOM at the defined index of occurrence that is identified by
     * PageElementList's XPath selector.
     *
     * @param index the index of occurrence in the DOM of the retrieved PageElement - STARTS AT 0
     */
    at(index) {
        return this.where.getAt(index);
    }
    /**
     * Retrieves all PageElements found in the DOM that are identified by PageElementList's XPath selector.
     */
    get all() {
        const elements = [];
        const value = this.elements.value;
        if (value && value.length) {
            // create list elements
            for (let i = 0; i < value.length; i++) {
                // make each list element individually selectable via xpath
                const selector = `(${this._selector})[${i + 1}]`;
                const listElement = this._elementStoreFunc.apply(this._store, [selector, this._elementOpts]);
                elements.push(listElement);
            }
        }
        return elements;
    }
    // PUBLIC GETTER FUNCTIONS
    /**
     * Returns the current number of PageElements managed by PageElementList (the number of PageElements found in the DOM which
     * are identified by PageElementList's XPath selector).
     */
    getLength() {
        try {
            const value = this.elements.value;
            if (value && value.length) {
                return value.length;
            }
            else {
                return 0;
            }
        }
        catch (error) {
            // this.elements will throw error if no elements were found
            return 0;
        }
    }
    /**
     * Returns the current texts of all PageElements managed by PageElementList as an array.
     *
     * @param filterMask can be used to skip the invocation of the `getText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getText(filterMask) {
        return this._node.eachGet(this.all, element => element.currently.getText(), filterMask);
    }
    /**
     * Returns the current direct texts of all PageElements managed by PageElementList as an array.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `getDirectText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getDirectText(filterMask) {
        return this._node.eachGet(this.all, element => element.currently.getDirectText(), filterMask);
    }
    /**
     * Returns the current 'exists' status of all PageElements managed by PageElementList as an array.
     *
     * @param filterMask can be used to skip the invocation of the `getExists` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getExists(filterMask) {
        return this._node.eachGet(this.all, element => element.currently.exists(), filterMask);
    }
    /**
     * Returns the current 'visible' status of all PageElements managed by PageElementList as an array.
     *
     * @param filterMask can be used to skip the invocation of the `getIsVisible` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getIsVisible(filterMask) {
        return this._node.eachGet(this.all, element => element.currently.isVisible(), filterMask);
    }
    /**
     * Returns the current 'enabled' status of all PageElements managed by PageElementList as an array.
     *
     * @param filterMask can be used to skip the invocation of the `getIsEnabled` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getIsEnabled(filterMask) {
        return this._node.eachGet(this.all, element => element.currently.isEnabled(), filterMask);
    }
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
    getHasText(text) {
        return this._node.eachCompare(this.all, (element, expected) => element.currently.hasText(expected), text);
    }
    /**
     * Returns the current 'hasAnyText' status of all PageElements managed by PageElementList as an array.
     *
     * A PageElement's 'hasAnyText' status is set to true if the PageElement has any text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getHasAnyText(filterMask) {
        return this._node.eachCompare(this.all, (element) => element.currently.hasAnyText(), filterMask, true);
    }
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
    getContainsText(text) {
        return this._node.eachCompare(this.all, (element, expected) => element.currently.containsText(expected), text);
    }
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
    getHasDirectText(directText) {
        return this._node.eachCompare(this.all, (element, expected) => element.currently.hasDirectText(expected), directText);
    }
    /**
     * Returns the current 'hasAnyDirectText' status of all PageElements managed by PageElementList as an array.
     *
     * A PageElement's 'hasAnyDirectText' status is set to true if the PageElement has any direct text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyDirectText` function for some or all managed
     * PageElements. The results of skipped function invocations are not included in the total results array.
     */
    getHasAnyDirectText(filterMask) {
        return this._node.eachCompare(this.all, (element) => element.currently.hasAnyDirectText(), filterMask, true);
    }
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
    getContainsDirectText(directText) {
        return this._node.eachCompare(this.all, (element, expected) => element.currently.containsDirectText(expected), directText);
    }
    // CHECK STATE FUNCTIONS
    /**
     * Returns true if PageElementList is currently empty.
     */
    isEmpty() {
        const actualLength = this.getLength();
        this._node.__setLastDiff({
            actual: actualLength.toString()
        });
        return actualLength === 0;
    }
    /**
     * Returns the result of the comparison between PageElementList's actual length and an expected length using the
     * comparison method defined in `comparator`.
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
    hasLength(length, comparator = "==" /* equalTo */) {
        const actualLength = this.getLength();
        this._node.__setLastDiff({
            actual: actualLength.toString()
        });
        return util_1.compare(actualLength, length, comparator);
    }
    /**
     * Returns true if at least one of the PageElements managed by PageElementList exists.
     *
     * @param filterMask if set to false, the existence check is skipped and `true` is returned
     */
    exists(filterMask) {
        if (filterMask === false) {
            return true;
        }
        else {
            return this.not.isEmpty();
        }
    }
    /**
     * Returns true if all PageElements managed by PageElementList are currently visible.
     *
     * @param filterMask can be used to skip the invocation of the `isVisible` function for some or all managed
     * PageElements
     */
    isVisible(filterMask) {
        return this._node.eachCheck(this.all, element => element.currently.isVisible(), filterMask, true);
    }
    /**
     * Returns true if all PageElements managed by PageElementList are currently enabled.
     *
     * @param filterMask can be used to skip the invocation of the `isEnabled` function for some or all managed
     * PageElements
     */
    isEnabled(filterMask) {
        return this._node.eachCheck(this.all, element => element.currently.isEnabled(), filterMask, true);
    }
    /**
     * Returns true if the actual texts of all PageElements managed by PageElementList equal the expected text(s).
     *
     * @param text the expected text(s) supposed to equal the actual texts
     *
     * If `text` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     */
    hasText(text) {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.hasText(expected), text);
    }
    /**
     * Returns true if all PageElements managed by PageElementList have any text.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyText` function for some or all managed
     * PageElements
     */
    hasAnyText(filterMask) {
        return this._node.eachCheck(this.all, (element) => element.currently.hasAnyText(), filterMask, true);
    }
    /**
     * Returns true if the actual texts of all PageElements managed by PageElementList contain the expected text(s).
     *
     * @param text the expected text(s) supposed to be contained in the actual texts
     *
     * If `text` is a single value, this value is compared to each element in the array of actual values of all
     * PageElements.
     * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
     * elements are compared to the array of actual values of all PageElements.
     */
    containsText(text) {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.containsText(expected), text);
    }
    /**
     * Returns true if the actual direct texts of all PageElements managed by PageElementList equal the expected direct
     * text(s).
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
    hasDirectText(directText) {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.hasDirectText(expected), directText);
    }
    /**
     * Returns true if all PageElements managed by PageElementList have any direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyDirectText` function for some or all managed
     * PageElements
     */
    hasAnyDirectText(filterMask) {
        return this._node.eachCheck(this.all, (element) => element.currently.hasAnyDirectText(), filterMask, true);
    }
    /**
     * Returns true if the actual direct texts of all PageElements managed by PageElementList contain the expected direct
     * text(s).
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
    containsDirectText(directText) {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.containsDirectText(expected), directText);
    }
    /**
     * returns the negated variants of PageElementListCurrently's state check functions
     */
    get not() {
        return {
            /**
             * Returns true if PageElementList is currently not empty.
             */
            isEmpty: () => !this.isEmpty(),
            /**
             * Returns the negated result of the comparison between PageElementList's actual length and an expected length
             * using the comparison method defined in `comparator`.
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
            hasLength: (length, comparator = "==" /* equalTo */) => !this.hasLength(length, comparator),
            /**
             * Returns true if none of the PageElements managed by PageElementList exist.
             *
             * @param filterMask if set to false, the existence check is skipped and `true` is returned
             */
            exists: (filterMask) => {
                if (filterMask === false) {
                    return true;
                }
                else {
                    return this.isEmpty();
                }
            },
            /**
             * Returns true if all PageElements managed by PageElementList are currently not visible.
             *
             * @param filterMask can be used to skip the invocation of the `isVisible` function for some or all managed
             * PageElements
             */
            isVisible: (filterMask) => {
                return this._node.eachCheck(this.all, element => element.currently.not.isVisible(), filterMask, true);
            },
            /**
             * Returns true if all PageElements managed by PageElementList are currently not enabled.
             *
             * @param filterMask can be used to skip the invocation of the `isEnabled` function for some or all managed
             * PageElements
             */
            isEnabled: (filterMask) => {
                return this._node.eachCheck(this.all, element => element.currently.not.isEnabled(), filterMask, true);
            },
            /**
             * Returns true if the actual texts of all PageElements managed by PageElementList do not equal the expected text(s).
             *
             * @param text the expected text(s) supposed not to equal the actual texts
             *
             * If `text` is a single value, this value is compared to each element in the array of actual values of all
             * PageElements.
             * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
             * elements are compared to the array of actual values of all PageElements.
             */
            hasText: (text) => {
                return this._node.eachCheck(this.all, (element, expected) => element.currently.not.hasText(expected), text);
            },
            /**
             * Returns true if all PageElements managed by PageElementList do not have any text.
             *
             * @param filterMask can be used to skip the invocation of the `hasAnyText` function for some or all managed
             * PageElements
             */
            hasAnyText: (filterMask) => {
                return this._node.eachCheck(this.all, (element) => element.currently.not.hasAnyText(), filterMask, true);
            },
            /**
             * Returns true if the actual texts of all PageElements managed by PageElementList do not contain the expected
             * text(s).
             *
             * @param text the expected text(s) supposed not to be contained in the actual texts
             *
             * If `text` is a single value, this value is compared to each element in the array of actual values of all
             * PageElements.
             * If `text` is an array of values, its length must match the length of PageElementList and the values of its array
             * elements are compared to the array of actual values of all PageElements.
             */
            containsText: (text) => {
                return this._node.eachCheck(this.all, (element, expected) => element.currently.not.containsText(expected), text);
            },
            /**
             * Returns true if the actual direct texts of all PageElements managed by PageElementList do not equal the
             * expected direct text(s).
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
            hasDirectText: (directText) => {
                return this._node.eachCheck(this.all, (element, expected) => element.currently.not.hasDirectText(expected), directText);
            },
            /**
             * Returns true if all PageElements managed by PageElementList not hot have any direct text.
             *
             * A direct text is a text that resides on the level directly below the selected HTML element.
             * It does not include any text of the HTML element's nested children HTML elements.
             *
             * @param filterMask can be used to skip the invocation of the `hasAnyDirectText` function for some or all managed
             * PageElements
             */
            hasAnyDirectText: (filterMask) => {
                return this._node.eachCheck(this.all, (element) => element.currently.not.hasAnyDirectText(), filterMask, true);
            },
            /**
             * Returns true if the actual direct texts of all PageElements managed by PageElementList do not contain the
             * expected direct text(s).
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
            containsDirectText: (directText) => {
                return this._node.eachCheck(this.all, (element, expected) => element.currently.not.containsDirectText(expected), directText);
            }
        };
    }
}
exports.PageElementListCurrently = PageElementListCurrently;
/**
 * This class defines all `wait` functions of PageElementList.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement managed by PageElementList
 * @template PageElementOpts type of the opts paramter passed to the constructor function of managed PageElements
 * @template ListType type of the PageElementList for which PageElementListCurrently defines all `wait` functions
 */
class PageElementListWait extends PageNode_1.PageNodeWait {
    /**
     * Provides an API to wait for any PageElement managed by PageElementList to reach a certain state within a
     * specific timeout.
     */
    get any() {
        return this._node.currently.first.wait;
    }
    // Typescript has a bug that prevents Exclude from working with generic extended types:
    // https://github.com/Microsoft/TypeScript/issues/24791
    // Bug will be fixed in Typescript 3.3.0
    // get any() {
    //   return excludeNot(this._list.currently.first.wait)
    // }
    /**
     * Provides an API to wait for none of PageElementList's managed PageElements to reach a certain state within a
     * specific timeout.
     */
    get none() {
        return this._node.currently.first.wait.not;
    }
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
    hasLength(length, { timeout = this._node.getTimeout(), comparator = "==" /* equalTo */, interval = this._node.getInterval(), reverse } = {}) {
        const notStr = (reverse) ? 'not ' : '';
        return this._node.__waitUntil(() => {
            if (reverse) {
                return !this._node.currently.hasLength(length, comparator);
            }
            else {
                return this._node.currently.hasLength(length, comparator);
            }
        }, () => `: Length never ${notStr}became${util_1.comparatorStr(comparator)} ${length}`, timeout, interval);
    }
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
    isEmpty({ timeout = this._node.getTimeout(), interval = this._node.getInterval(), reverse } = {}) {
        const notStr = (reverse) ? 'not ' : '';
        return this._node.__waitUntil(() => {
            if (reverse) {
                return this._node.currently.not.isEmpty();
            }
            else {
                return this._node.currently.isEmpty();
            }
        }, () => ` never ${notStr}became empty`, timeout, interval);
    }
    /**
     * Waits for at least one of the PageElements managed by PageElementList to exist.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some or
     * all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     *
     * @returns this (an instance of PageElementList)
     */
    exists(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        if (filterMask !== false) {
            this.not.isEmpty(otherOpts);
        }
        return this._node;
    }
    /**
     * Waits for all PageElements managed by PageElementList to be visible.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     *
     * @returns this (an instance of PageElementList)
     */
    isVisible(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.all, element => element.wait.isVisible(otherOpts), filterMask, true);
    }
    /**
     * Waits for all PageElements managed by PageElementList to be enabled.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     *
     * @returns this (an instance of PageElementList)
     */
    isEnabled(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.all, element => element.wait.isEnabled(otherOpts), filterMask, true);
    }
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
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    hasText(text, opts) {
        return this._node.eachWait(this._node.all, (element, expected) => element.wait.hasText(expected, opts), text);
    }
    /**
     * Waits for all PageElements managed by PageElementList to have any text.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyText` function for some
     * or all managed PageElements, the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    hasAnyText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.all, (element) => element.wait.hasAnyText(otherOpts), filterMask, true);
    }
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
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    containsText(text, opts) {
        return this._node.eachWait(this._node.all, (element, expected) => element.wait.containsText(expected, opts), text);
    }
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
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    hasDirectText(directText, opts) {
        return this._node.eachWait(this._node.all, (element, expected) => element.wait.hasDirectText(expected, opts), directText);
    }
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
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    hasAnyDirectText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.all, (element) => element.wait.hasAnyDirectText(otherOpts), filterMask, true);
    }
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
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    containsDirectText(directText, opts) {
        return this._node.eachWait(this._node.all, (element, expected) => element.wait.containsDirectText(expected, opts), directText);
    }
    /**
     * returns the negated variants of PageElementListWait's state check functions
     */
    get not() {
        return {
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
            hasLength: (length, opts = {}) => this.hasLength(length, {
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
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
            isEmpty: (opts = {}) => this.isEmpty({
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            /**
             * Waits for none of the PageElements managed by PageElementList to exist.
             *
             * Throws an error if the condition is not met within a specific timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some or
             * all managed PageElements and the `timeout` within which the condition is expected to be met
             *
             * If no `timeout` is specified, PageElementList's default timeout is used.
             *
             * @returns this (an instance of PageElementList)
             */
            exists: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                if (filterMask !== false) {
                    this.isEmpty(otherOpts);
                }
                return this._node;
            },
            /**
             * Waits for all PageElements managed by PageElementList not to be visible.
             *
             * Throws an error if the condition is not met within a specific timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for
             * some or all managed PageElements and the `timeout` within which the condition is expected to be met
             *
             * If no `timeout` is specified, PageElementList's default timeout is used.
             *
             * @returns this (an instance of PageElementList)
             */
            isVisible: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.all, element => element.wait.not.isVisible(otherOpts), filterMask, true);
            },
            /**
             * Waits for all PageElements managed by PageElementList not to be enabled.
             *
             * Throws an error if the condition is not met within a specific timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for
             * some or all managed PageElements and the `timeout` within which the condition is expected to be met
             *
             * If no `timeout` is specified, PageElementList's default timeout is used.
             *
             * @returns this (an instance of PageElementList)
             */
            isEnabled: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.all, element => element.wait.not.isEnabled(otherOpts), filterMask, true);
            },
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
             * If no `timeout` is specified, PageElementList's default timeout is used.
             * If no `interval` is specified, PageElementList's default interval is used.
             *
             * @returns this (an instance of PageElementList)
             */
            hasText: (text, opts) => {
                return this._node.eachWait(this._node.all, (element, expected) => element.wait.not.hasText(expected, opts), text);
            },
            /**
             * Waits for all PageElements managed by PageElementList not to have any text.
             *
             * Throws an error if the condition is not met within a specific timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyText` function for
             * some or all managed PageElements, the `timeout` within which the condition is expected to be met and the
             * `interval` used to check it
             *
             * If no `timeout` is specified, PageElementList's default timeout is used.
             * If no `interval` is specified, PageElementList's default interval is used.
             *
             * @returns this (an instance of PageElementList)
             */
            hasAnyText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.all, (element) => element.wait.not.hasAnyText(otherOpts), filterMask, true);
            },
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
             * If no `timeout` is specified, PageElementList's default timeout is used.
             * If no `interval` is specified, PageElementList's default interval is used.
             *
             * @returns this (an instance of PageElementList)
             */
            containsText: (text, opts) => {
                return this._node.eachWait(this._node.all, (element, expected) => element.wait.not.containsText(expected, opts), text);
            },
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
             * If no `timeout` is specified, PageElementList's default timeout is used.
             * If no `interval` is specified, PageElementList's default interval is used.
             *
             * @returns this (an instance of PageElementList)
             */
            hasDirectText: (directText, opts) => {
                return this._node.eachWait(this._node.all, (element, expected) => element.wait.not.hasDirectText(expected, opts), directText);
            },
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
             * If no `timeout` is specified, PageElementList's default timeout is used.
             * If no `interval` is specified, PageElementList's default interval is used.
             *
             * @returns this (an instance of PageElementList)
             */
            hasAnyDirectText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.all, (element) => element.wait.not.hasAnyDirectText(otherOpts), filterMask, true);
            },
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
             * If no `timeout` is specified, PageElementList's default timeout is used.
             * If no `interval` is specified, PageElementList's default interval is used.
             *
             * @returns this (an instance of PageElementList)
             */
            containsDirectText: (directText, opts) => {
                return this._node.eachWait(this._node.all, (element, expected) => element.wait.not.containsDirectText(expected, opts), directText);
            }
        };
    }
}
exports.PageElementListWait = PageElementListWait;
/**
 * This class defines all `eventually` functions of PageElementList.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement managed by PageElementList
 * @template PageElementOpts type of the opts paramter passed to the constructor function of managed PageElements
 * @template ListType type of the PageElementList for which PageElementListCurrently defines all `eventually` functions
 */
class PageElementListEventually extends PageNode_1.PageNodeEventually {
    // Typescript has a bug that prevents Exclude from working with generic extended types:
    // https://github.com/Microsoft/TypeScript/issues/24791
    // Bug will be fixed in Typescript 3.3.0
    // get any() {
    //   return excludeNot(this._list.currently.first.eventually)
    // }
    /**
     * Provides an API to check if any PageElement managed by PageElementList eventually has a certain state within a
     * specific timeout.
     */
    get any() {
        return this._node.currently.first.eventually;
    }
    /**
     * Provides an API to check if none of the PageElements managed by PageElementList eventually have a certain state
     * within a specific timeout.
     */
    get none() {
        return this._node.currently.first.eventually.not;
    }
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
     *
     * @returns this (an instance of PageElementList)
     */
    hasLength(length, { timeout = this._node.getTimeout(), comparator = "==" /* equalTo */, interval = this._node.getInterval(), reverse } = {}) {
        return this._node.__eventually(() => this._node.wait.hasLength(length, { timeout, comparator, interval, reverse }));
    }
    /**
     * Returns true if PageElementList eventually is empty within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    isEmpty({ timeout = this._node.getTimeout(), interval = this._node.getInterval(), reverse } = {}) {
        return this._node.__eventually(() => this._node.wait.isEmpty({ timeout, interval, reverse }));
    }
    /**
     * Returns true if at least one of the PageElements managed by PageElementList eventually exists within a specific
     * timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some or
     * all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     *
     * @returns this (an instance of PageElementList)
     */
    exists(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        if (filterMask === false) {
            return true;
        }
        else {
            return this.not.isEmpty(otherOpts);
        }
    }
    /**
     * Returns true if all PageElements managed by PageElementList eventually are visible within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     *
     * @returns this (an instance of PageElementList)
     */
    isVisible(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.all, element => element.eventually.isVisible(otherOpts), filterMask, true);
    }
    /**
     * Returns true if all PageElements managed by PageElementList eventually are enabled within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for some
     * or all managed PageElements and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     *
     * @returns this (an instance of PageElementList)
     */
    isEnabled(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.all, element => element.eventually.isEnabled(otherOpts), filterMask, true);
    }
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
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    hasText(text, opts) {
        return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.hasText(expected, opts), text);
    }
    /**
     * Returns true if all PageElements managed by PageElementList eventually have any text within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyText` function for some
     * or all managed PageElements, the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    hasAnyText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.all, (element) => element.eventually.hasAnyText(otherOpts), filterMask, true);
    }
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
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    containsText(text, opts) {
        return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.containsText(expected, opts), text);
    }
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
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    hasDirectText(directText, opts) {
        return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.hasDirectText(expected, opts), directText);
    }
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
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    hasAnyDirectText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.all, (element) => element.eventually.hasAnyDirectText(otherOpts), filterMask, true);
    }
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
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     *
     * @returns this (an instance of PageElementList)
     */
    containsDirectText(directText, opts) {
        return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.containsDirectText(expected, opts), directText);
    }
    /**
     * returns the negated variants of PageElementListEventually's state check functions
     */
    get not() {
        return {
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
             *
             * @returns this (an instance of PageElementList)
             */
            hasLength: (length, opts = {}) => this.hasLength(length, {
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            /**
             * Returns true if PageElementList eventually is not empty within a specific timeout.
             *
             * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
             * check it
             *
             * If no `timeout` is specified, PageElementList's default timeout is used.
             * If no `interval` is specified, PageElementList's default interval is used.
             *
             * @returns this (an instance of PageElementList)
             */
            isEmpty: (opts = {}) => this.isEmpty({
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            /**
             * Returns true if none of the PageElements managed by PageElementList eventually exist within a specific
             * timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some or
             * all managed PageElements and the `timeout` within which the condition is expected to be met
             *
             * If no `timeout` is specified, PageElementList's default timeout is used.
             *
             * @returns this (an instance of PageElementList)
             */
            exists: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                if (filterMask === false) {
                    return true;
                }
                else {
                    return this.isEmpty(otherOpts);
                }
            },
            /**
             * Returns true if all PageElements managed by PageElementList eventually are not visible within a specific
             * timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for
             * some or all managed PageElements and the `timeout` within which the condition is expected to be met
             *
             * If no `timeout` is specified, PageElementList's default timeout is used.
             *
             * @returns this (an instance of PageElementList)
             */
            isVisible: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.all, element => element.eventually.not.isVisible(otherOpts), filterMask, true);
            },
            /**
             * Returns true if all PageElements managed by PageElementList eventually are not enabled within a specific
             * timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for some
             * or all managed PageElements and the `timeout` within which the condition is expected to be met
             *
             * If no `timeout` is specified, PageElementList's default timeout is used.
             *
             * @returns this (an instance of PageElementList)
             */
            isEnabled: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.all, element => element.eventually.not.isEnabled(otherOpts), filterMask, true);
            },
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
             * If no `timeout` is specified, PageElementList's default timeout is used.
             * If no `interval` is specified, PageElementList's default interval is used.
             *
             * @returns this (an instance of PageElementList)
             */
            hasText: (text, opts) => {
                return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.not.hasText(expected, opts), text);
            },
            /**
             * Returns true if all PageElements managed by PageElementList eventually do not have any text within a specific
             * timeout.
             *
             * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyText` function for some
             * or all managed PageElements, the `timeout` within which the condition is expected to be met and the `interval` used
             * to check it
             *
             * If no `timeout` is specified, PageElementList's default timeout is used.
             * If no `interval` is specified, PageElementList's default interval is used.
             *
             * @returns this (an instance of PageElementList)
             */
            hasAnyText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.all, (element) => element.eventually.not.hasAnyText(otherOpts), filterMask, true);
            },
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
             * If no `timeout` is specified, PageElementList's default timeout is used.
             * If no `interval` is specified, PageElementList's default interval is used.
             *
             * @returns this (an instance of PageElementList)
             */
            containsText: (text, opts) => {
                return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.not.containsText(expected, opts), text);
            },
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
            * If no `timeout` is specified, PageElementList's default timeout is used.
            * If no `interval` is specified, PageElementList's default interval is used.
            *
            * @returns this (an instance of PageElementList)
            */
            hasDirectText: (directText, opts) => {
                return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.not.hasDirectText(expected, opts), directText);
            },
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
             * If no `timeout` is specified, PageElementList's default timeout is used.
             * If no `interval` is specified, PageElementList's default interval is used.
             *
             * @returns this (an instance of PageElementList)
             */
            hasAnyDirectText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.all, (element) => element.eventually.not.hasAnyDirectText(otherOpts), filterMask, true);
            },
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
             * If no `timeout` is specified, PageElementList's default timeout is used.
             * If no `interval` is specified, PageElementList's default interval is used.
             *
             * @returns this (an instance of PageElementList)
             */
            containsDirectText: (directText, opts) => {
                return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.not.containsDirectText(expected, opts), directText);
            }
        };
    }
}
exports.PageElementListEventually = PageElementListEventually;
//# sourceMappingURL=PageElementList.js.map