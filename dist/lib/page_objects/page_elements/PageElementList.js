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
// holds several PageElement instances of the same type
class PageElementList extends _1.PageNode {
    constructor(selector, opts) {
        super(selector, opts);
        this.selector = selector;
        this._waitType = opts.waitType || "visible" /* visible */;
        this._disableCache = opts.disableCache || false;
        this._elementOptions = opts.elementOpts;
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
     * Use this method to initialize properties that rely on the this type
     * which is not available in the constructor.
     *
     * Make sure that this method is invoked immediatly after construction.
     *
     * @param cloneFunc
     */
    init(cloneFunc) {
        this._whereBuilder = new builders_1.ListWhereBuilder(this._selector, {
            store: this._store,
            elementStoreFunc: this._elementStoreFunc,
            elementOptions: this._elementOptions,
            cloneFunc: cloneFunc,
            getAllFunc: list => list.all
        });
        this.currently.init(cloneFunc);
    }
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
    get $() {
        return this._$;
    }
    get elements() {
        this.initialWait();
        return browser.elements(this._selector);
    }
    get where() {
        this.initialWait();
        return this._whereBuilder.reset();
    }
    /**
     * Returns the first page element found in the DOM that matches the list selector.
     */
    get first() {
        return this.where.getFirst();
    }
    /**
     * @param index starts at 0
     */
    at(index) {
        return this.where.getAt(index);
    }
    /**
     * Returns all page elements found in the DOM that match the list selector after initial wait.
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
                    const listElement = this._elementStoreFunc.apply(this._store, [selector, this._elementOptions]);
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
    setIdentifier(identifier) {
        this._identifier = identifier;
        return this;
    }
    /**
     * Returns an object consisting of this._identifier.object's keys
     * as keys and the elements mapped by this._identifier.func()
     * as values.
     *
     * If this.identifier is undefined, the mapped object's keys will be defined
     * by the index of an element's occurence in the element list (first element -> 0, seconed element -> 1...)
     *
     * If cached option is set to true, returns cached identified elements object
     * if it exists and otherwise fetches new identified elements object.
     * Per default, returns a cached version of this identifier was already
     * used unless resetCache is set to true.
     * This means that the returned structure of the list may reflect an earlier state,
     * while its contents are still guaranteed to be refreshed on each access!
     *
     * Attention: this may take a long time, try to avoid: if only single elements of list
     * are needed, use get() or where instead.
     **/
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
    getSelector() {
        return this._selector;
    }
    getInterval() {
        return this._interval;
    }
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
    getText(filterMask) {
        return this.eachGet(this.all, element => element.getText(), filterMask);
    }
    getDirectText(filterMask) {
        return this.eachGet(this.all, element => element.getDirectText(), filterMask);
    }
    getIsEnabled(filterMask) {
        return this.eachGet(this.all, element => element.currently.isEnabled(), filterMask);
    }
    getHasText(text) {
        return this.eachCompare(this.all, (element, expected) => element.currently.hasText(expected), text);
    }
    getHasAnyText(filterMask) {
        return this.eachCompare(this.all, (element) => element.currently.hasAnyText(), filterMask, true);
    }
    getContainsText(text) {
        return this.eachCompare(this.all, (element, expected) => element.currently.containsText(expected), text);
    }
    getHasDirectText(directText) {
        return this.eachCompare(this.all, (element, expected) => element.currently.hasDirectText(expected), directText);
    }
    getHasAnyDirectText(filterMask) {
        return this.eachCompare(this.all, (element) => element.currently.hasAnyDirectText(), filterMask, true);
    }
    getContainsDirectText(directText) {
        return this.eachCompare(this.all, (element, expected) => element.currently.containsDirectText(expected), directText);
    }
    // HELPER FUNCTIONS
    _includedInFilter(filter) {
        return (typeof filter === 'boolean' && filter === true);
    }
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
     * If the list is empty (no elements could be located matching the list selector),
     * this function will always return true.
     *
     * @param elements
     * @param checkFunc
     * @param expected
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
     * Uses default interval and default timeout of each element contained in this list.
     *
     * @param elements
     * @param waitFunc
     * @param expected
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
class PageElementListCurrently extends PageNode_1.PageNodeCurrently {
    constructor(node, opts) {
        super(node);
        this._selector = node.getSelector();
        this._store = opts.store;
        this._elementOptions = opts.elementOpts;
        this._elementStoreFunc = opts.elementStoreFunc;
        this._node = node;
    }
    /**
     * Use this method to initialize properties that rely on the this type
     * which is not available in the constructor.
     *
     * Make sure that this method is invoked immediatly after construction.
     *
     * @param cloneFunc
     */
    init(cloneFunc) {
        this._whereBuilder = new builders_1.ListWhereBuilder(this._selector, {
            store: this._store,
            elementStoreFunc: this._elementStoreFunc,
            elementOptions: this._elementOptions,
            cloneFunc: cloneFunc,
            getAllFunc: list => list.all
        });
    }
    // RETRIEVAL FUNCTIONS for wdio or list elements
    get elements() {
        return browser.elements(this._selector);
    }
    get where() {
        return this._whereBuilder.reset();
    }
    /**
     * Returns the first page element found in the DOM that matches the list selector.
     */
    get first() {
        return this.where.getFirst();
    }
    /**
     * @param index starts at 0
     */
    at(index) {
        return this.where.getAt(index);
    }
    /**
     * Returns all page elements found in the DOM that match the list selector after initial wait.
     */
    get all() {
        const elements = [];
        const value = this.elements.value;
        if (value && value.length) {
            // create list elements
            for (let i = 0; i < value.length; i++) {
                // make each list element individually selectable via xpath
                const selector = `(${this._selector})[${i + 1}]`;
                const listElement = this._elementStoreFunc.apply(this._store, [selector, this._elementOptions]);
                elements.push(listElement);
            }
        }
        return elements;
    }
    // PUBLIC GETTER FUNCTIONS
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
    getText(filterMask) {
        return this._node.eachGet(this.all, element => element.currently.getText(), filterMask);
    }
    getDirectText(filterMask) {
        return this._node.eachGet(this.all, element => element.currently.getDirectText(), filterMask);
    }
    getExists(filterMask) {
        return this._node.eachGet(this.all, element => element.currently.exists(), filterMask);
    }
    getIsVisible(filterMask) {
        return this._node.eachGet(this.all, element => element.currently.isVisible(), filterMask);
    }
    getIsEnabled(filterMask) {
        return this._node.eachGet(this.all, element => element.currently.isEnabled(), filterMask);
    }
    getHasText(text) {
        return this._node.eachCompare(this.all, (element, expected) => element.currently.hasText(expected), text);
    }
    getHasAnyText(filterMask) {
        return this._node.eachCompare(this.all, (element) => element.currently.hasAnyText(), filterMask, true);
    }
    getContainsText(text) {
        return this._node.eachCompare(this.all, (element, expected) => element.currently.containsText(expected), text);
    }
    getHasDirectText(directText) {
        return this._node.eachCompare(this.all, (element, expected) => element.currently.hasDirectText(expected), directText);
    }
    getHasAnyDirectText(filterMask) {
        return this._node.eachCompare(this.all, (element) => element.currently.hasAnyDirectText(), filterMask, true);
    }
    getContainsDirectText(directText) {
        return this._node.eachCompare(this.all, (element, expected) => element.currently.containsDirectText(expected), directText);
    }
    // CHECK STATE FUNCTIONS
    isEmpty() {
        const actualLength = this.getLength();
        this._node.__setLastDiff({
            actual: actualLength.toString()
        });
        return actualLength === 0;
    }
    hasLength(length, comparator = "==" /* equalTo */) {
        const actualLength = this.getLength();
        this._node.__setLastDiff({
            actual: actualLength.toString()
        });
        return util_1.compare(actualLength, length, comparator);
    }
    exists(filterMask) {
        if (filterMask === false) {
            return true;
        }
        else {
            return this.not.isEmpty();
        }
    }
    isVisible(filterMask) {
        return this._node.eachCheck(this.all, element => element.currently.isVisible(), filterMask, true);
    }
    isEnabled(filterMask) {
        return this._node.eachCheck(this.all, element => element.currently.isEnabled(), filterMask, true);
    }
    hasText(text) {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.hasText(expected), text);
    }
    hasAnyText(filterMask) {
        return this._node.eachCheck(this.all, (element) => element.currently.hasAnyText(), filterMask, true);
    }
    containsText(text) {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.containsText(expected), text);
    }
    hasDirectText(directText) {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.hasDirectText(expected), directText);
    }
    hasAnyDirectText(filterMask) {
        return this._node.eachCheck(this.all, (element) => element.currently.hasAnyDirectText(), filterMask, true);
    }
    containsDirectText(directText) {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.containsDirectText(expected), directText);
    }
    get not() {
        return {
            isEmpty: () => !this.isEmpty(),
            hasLength: (length, comparator = "==" /* equalTo */) => !this.hasLength(length, comparator),
            exists: (filterMask) => {
                if (filterMask === false) {
                    return true;
                }
                else {
                    return this.isEmpty();
                }
            },
            isVisible: (filterMask) => {
                return this._node.eachCheck(this.all, element => element.currently.not.isVisible(), filterMask, true);
            },
            isEnabled: (filterMask) => {
                return this._node.eachCheck(this.all, element => element.currently.not.isEnabled(), filterMask, true);
            },
            hasText: (text) => {
                return this._node.eachCheck(this.all, (element, expected) => element.currently.not.hasText(expected), text);
            },
            hasAnyText: (filterMask) => {
                return this._node.eachCheck(this.all, (element) => element.currently.not.hasAnyText(), filterMask, true);
            },
            containsText: (text) => {
                return this._node.eachCheck(this.all, (element, expected) => element.currently.not.containsText(expected), text);
            },
            hasDirectText: (directText) => {
                return this._node.eachCheck(this.all, (element, expected) => element.currently.not.hasDirectText(expected), directText);
            },
            hasAnyDirectText: (filterMask) => {
                return this._node.eachCheck(this.all, (element) => element.currently.not.hasAnyDirectText(), filterMask, true);
            },
            containsDirectText: (directText) => {
                return this._node.eachCheck(this.all, (element, expected) => element.currently.not.containsDirectText(expected), directText);
            }
        };
    }
}
exports.PageElementListCurrently = PageElementListCurrently;
class PageElementListWait extends PageNode_1.PageNodeWait {
    // waits until list has given length
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
    get any() {
        return this._node.currently.first.wait;
    }
    // Typescript has a bug that prevents Exclude from working with generic extended types:
    // https://github.com/Microsoft/TypeScript/issues/24791
    // Bug will be fixed in Typescript 3.3.0
    // get any() {
    //   return excludeNot(this._list.currently.first.wait)
    // }
    get none() {
        return this._node.currently.first.wait.not;
    }
    exists(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        if (filterMask !== false) {
            this.not.isEmpty(otherOpts);
        }
        return this._node;
    }
    isVisible(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.all, element => element.wait.isVisible(otherOpts), filterMask, true);
    }
    isEnabled(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.all, element => element.wait.isEnabled(otherOpts), filterMask, true);
    }
    hasText(text, opts) {
        return this._node.eachWait(this._node.all, (element, expected) => element.wait.hasText(expected, opts), text);
    }
    hasAnyText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.all, (element) => element.wait.hasAnyText(otherOpts), filterMask, true);
    }
    containsText(text, opts) {
        return this._node.eachWait(this._node.all, (element, expected) => element.wait.containsText(expected, opts), text);
    }
    hasDirectText(directText, opts) {
        return this._node.eachWait(this._node.all, (element, expected) => element.wait.hasDirectText(expected, opts), directText);
    }
    hasAnyDirectText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.all, (element) => element.wait.hasAnyDirectText(otherOpts), filterMask, true);
    }
    containsDirectText(directText, opts) {
        return this._node.eachWait(this._node.all, (element, expected) => element.wait.containsDirectText(expected, opts), directText);
    }
    get not() {
        return {
            isEmpty: (opts = {}) => this.isEmpty({
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            hasLength: (length, opts = {}) => this.hasLength(length, {
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            exists: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                if (filterMask !== false) {
                    this.isEmpty(otherOpts);
                }
                return this._node;
            },
            isVisible: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.all, element => element.wait.not.isVisible(otherOpts), filterMask, true);
            },
            isEnabled: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.all, element => element.wait.not.isEnabled(otherOpts), filterMask, true);
            },
            hasText: (text, opts) => {
                return this._node.eachWait(this._node.all, (element, expected) => element.wait.not.hasText(expected, opts), text);
            },
            hasAnyText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.all, (element) => element.wait.not.hasAnyText(otherOpts), filterMask, true);
            },
            containsText: (text, opts) => {
                return this._node.eachWait(this._node.all, (element, expected) => element.wait.not.containsText(expected, opts), text);
            },
            hasDirectText: (directText, opts) => {
                return this._node.eachWait(this._node.all, (element, expected) => element.wait.not.hasDirectText(expected, opts), directText);
            },
            hasAnyDirectText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.all, (element) => element.wait.not.hasAnyDirectText(otherOpts), filterMask, true);
            },
            containsDirectText: (directText, opts) => {
                return this._node.eachWait(this._node.all, (element, expected) => element.wait.not.containsDirectText(expected, opts), directText);
            }
        };
    }
}
exports.PageElementListWait = PageElementListWait;
class PageElementListEventually extends PageNode_1.PageNodeEventually {
    // Typescript has a bug that prevents Exclude from working with generic extended types:
    // https://github.com/Microsoft/TypeScript/issues/24791
    // Bug will be fixed in Typescript 3.3.0
    // get any() {
    //   return excludeNot(this._list.currently.first.eventually)
    // }
    get any() {
        return this._node.currently.first.eventually;
    }
    get none() {
        return this._node.currently.first.eventually.not;
    }
    hasLength(length, { timeout = this._node.getTimeout(), comparator = "==" /* equalTo */, interval = this._node.getInterval(), reverse } = {}) {
        return this._node.__eventually(() => this._node.wait.hasLength(length, { timeout, comparator, interval, reverse }));
    }
    isEmpty({ timeout = this._node.getTimeout(), interval = this._node.getInterval(), reverse } = {}) {
        return this._node.__eventually(() => this._node.wait.isEmpty({ timeout, interval, reverse }));
    }
    exists(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        if (filterMask === false) {
            return true;
        }
        else {
            return this.not.isEmpty(otherOpts);
        }
    }
    isVisible(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.all, element => element.eventually.isVisible(otherOpts), filterMask, true);
    }
    isEnabled(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.all, element => element.eventually.isEnabled(otherOpts), filterMask, true);
    }
    hasText(text, opts) {
        return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.hasText(expected, opts), text);
    }
    hasAnyText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.all, (element) => element.eventually.hasAnyText(otherOpts), filterMask, true);
    }
    containsText(text, opts) {
        return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.containsText(expected, opts), text);
    }
    hasDirectText(directText, opts) {
        return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.hasDirectText(expected, opts), directText);
    }
    hasAnyDirectText(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.all, (element) => element.eventually.hasAnyDirectText(otherOpts), filterMask, true);
    }
    containsDirectText(directText, opts) {
        return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.containsDirectText(expected, opts), directText);
    }
    get not() {
        return {
            isEmpty: (opts = {}) => this.isEmpty({
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            hasLength: (length, opts = {}) => this.hasLength(length, {
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            exists: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                if (filterMask === false) {
                    return true;
                }
                else {
                    return this.isEmpty(otherOpts);
                }
            },
            isVisible: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.all, element => element.eventually.not.isVisible(otherOpts), filterMask, true);
            },
            isEnabled: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.all, element => element.eventually.not.isEnabled(otherOpts), filterMask, true);
            },
            hasText: (text, opts) => {
                return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.not.hasText(expected, opts), text);
            },
            hasAnyText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.all, (element) => element.eventually.not.hasAnyText(otherOpts), filterMask, true);
            },
            containsText: (text, opts) => {
                return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.not.containsText(expected, opts), text);
            },
            hasDirectText: (directText, opts) => {
                return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.not.hasDirectText(expected, opts), directText);
            },
            hasAnyDirectText: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.all, (element) => element.eventually.not.hasAnyDirectText(otherOpts), filterMask, true);
            },
            containsDirectText: (directText, opts) => {
                return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.not.containsDirectText(expected, opts), directText);
            }
        };
    }
}
exports.PageElementListEventually = PageElementListEventually;
//# sourceMappingURL=PageElementList.js.map