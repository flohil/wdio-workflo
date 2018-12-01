"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../utility_functions/util");
const _1 = require(".");
const builders_1 = require("../builders");
const __1 = require("../");
// holds several PageElement instances of the same type
class PageElementList extends _1.PageNode {
    constructor(_selector, opts, cloneFunc) {
        super(_selector, opts);
        this._selector = _selector;
        this._waitType = opts.waitType || "visible" /* visible */;
        this._timeout = opts.timeout || JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || __1.DEFAULT_TIMEOUT;
        this._disableCache = opts.disableCache || false;
        this._selector = _selector;
        this._elementOptions = opts.elementOptions;
        this._elementStoreFunc = opts.elementStoreFunc;
        this._identifier = opts.identifier;
        this._identifiedObjCache = {};
        this._interval = opts.interval || 500;
        this._cloneFunc = cloneFunc;
        this._whereBuilder = new builders_1.ListWhereBuilder(this._selector, {
            store: this._store,
            elementStoreFunc: this._elementStoreFunc,
            elementOptions: this._elementOptions,
            cloneFunc: this._cloneFunc,
            getAllFunc: list => list.all
        });
        this.currently = new PageElementListCurrently(this, opts, cloneFunc);
        this.wait = new PageElementListWait(this);
        this.eventually = new PageElementListEventually(this);
    }
    /**
     * Whenever a function that checks the state of the GUI
     * by comparing an expected result to an actual result is called,
     * the actual result will be stored in 'lastActualResult'.
     *
     * This can be useful to determine why the last invocation of such a function returned false.
     *
     * These "check-GUI-state functions" include all hasXXX, hasAnyXXX and containsXXX functions
     * defined in the .currently, .eventually and .wait API of PageElement.
     */
    get lastActualResult() {
        return this._lastActualResult;
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
     * are needed, use get() or| firstBy() instead.
     **/
    identify({ identifier = this._identifier, resetCache = false } = {}) {
        const cacheKey = (identifier) ? `${identifier.mappingObject.toString()}|||${identifier.func.toString()}` : 'index';
        if (this._disableCache || resetCache || !(cacheKey in this._identifiedObjCache)) {
            const listElements = this.all;
            const mappedObj = {};
            if (identifier) { // manually set identifier
                const queryResults = {};
                // create hash where result of identifier func is key
                // and list element is value
                listElements.forEach((element) => {
                    const resultKey = identifier.func(element);
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
    getTimeout() {
        return this._timeout;
    }
    getInterval() {
        return this._interval;
    }
}
exports.PageElementList = PageElementList;
class PageElementListCurrently {
    constructor(list, opts, cloneFunc) {
        this.not = {
            isEmpty: () => !this.isEmpty(),
            hasLength: (length, comparator = "==" /* equalTo */) => !this.hasLength(length, comparator)
        };
        this._selector = list.getSelector();
        this._store = opts.store;
        this._elementOptions = opts.elementOptions;
        this._elementStoreFunc = opts.elementStoreFunc;
        this._whereBuilder = new builders_1.ListWhereBuilder(this._selector, {
            store: this._store,
            elementStoreFunc: this._elementStoreFunc,
            elementOptions: this._elementOptions,
            cloneFunc: cloneFunc,
            getAllFunc: list => list.currently.all
        });
        this._list = list;
    }
    /**
     * Whenever a function that checks the state of the GUI
     * by comparing an expected result to an actual result is called,
     * the actual result will be stored in 'lastActualResult'.
     *
     * This can be useful to determine why the last invocation of such a function returned false.
     *
     * These "check-GUI-state functions" include all hasXXX, hasAnyXXX and containsXXX functions
     * defined in the .currently, .eventually and .wait API of PageElement.
     */
    get lastActualResult() {
        return this._lastActualResult;
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
    // CHECK STATE FUNCTIONS
    isEmpty() {
        return !browser.isExisting(this._selector);
    }
    hasLength(length, comparator = "==" /* equalTo */) {
        const actualLength = this.getLength();
        this._lastActualResult = actualLength.toString();
        return util_1.compare(actualLength, length, comparator);
    }
}
class PageElementListWait {
    constructor(list) {
        this.not = {
            isEmpty: (opts) => this.isEmpty({
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            hasLength: (length, opts) => this.hasLength(length, {
                timeout: opts.timeout, interval: opts.interval, reverse: true
            })
        };
        this._list = list;
    }
    // waits until list has given length
    hasLength(length, { timeout = this._list.getTimeout(), comparator = "==" /* equalTo */, interval = this._list.getInterval(), reverse } = {}) {
        browser.waitUntil(() => {
            if (reverse) {
                return !this._list.currently.hasLength(length, comparator);
            }
            else {
                return this._list.currently.hasLength(length, comparator);
            }
        }, timeout, `${this.constructor.name}: Length never became${util_1.comparatorStr(comparator)} ${length}.\n( ${this._list.getSelector()} )`, interval);
        return this._list;
    }
    isEmpty({ timeout = this._list.getTimeout(), interval = this._list.getInterval(), reverse } = {}) {
        browser.waitUntil(() => {
            if (reverse) {
                return !this._list.currently.isEmpty();
            }
            else {
                return this._list.currently.isEmpty();
            }
        }, timeout, `${this.constructor.name} never became empty.\n( ${this._list.getSelector()} )`, interval);
        return this._list;
    }
    get any() {
        return this._list.currently.first.wait;
    }
    // Typescript has a bug that prevents Omit from working with generic extended types:
    // https://github.com/Microsoft/TypeScript/issues/24791
    // Bug will be fixed in Typescript 3.2.1
    // get any() {
    //   return _.omit(this._list.currently.first.wait, 'not') as any as Omit<PageElementTypeWait, 'not'>
    // }
    get none() {
        return this._list.currently.first.wait.not;
    }
}
class PageElementListEventually {
    constructor(list) {
        this.not = {
            isEmpty: (opts) => this.isEmpty({
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            hasLength: (length, opts) => this.hasLength(length, {
                timeout: opts.timeout, interval: opts.interval, reverse: true
            })
        };
        this._list = list;
    }
    _eventually(func) {
        try {
            func();
            return true;
        }
        catch (error) {
            return false;
        }
    }
    hasLength(length, { timeout = this._list.getTimeout(), comparator = "==" /* equalTo */, interval = this._list.getInterval(), reverse } = {}) {
        return this._eventually(() => this._list.wait.hasLength(length, { timeout, comparator, interval, reverse }));
    }
    isEmpty({ timeout = this._list.getTimeout(), interval = this._list.getInterval(), reverse } = {}) {
        return this._eventually(() => this._list.wait.isEmpty({ timeout, interval, reverse }));
    }
    // Typescript has a bug that prevents Omit from working with generic extended types:
    // https://github.com/Microsoft/TypeScript/issues/24791
    // Bug will be fixed in Typescript 3.2.1
    // get any() {
    //   return _.omit(this._list.currently.first.eventually, 'not') as Omit<PageElementTypeEventually, 'not'>
    // }
    get any() {
        return this._list.currently.first.eventually;
    }
    get none() {
        return this._list.currently.first.eventually.not;
    }
}
//# sourceMappingURL=PageElementList.js.map