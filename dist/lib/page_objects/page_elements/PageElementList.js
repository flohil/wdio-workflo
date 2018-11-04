"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../utility_functions/util");
const _1 = require(".");
const builders_1 = require("../builders");
// holds several PageElement instances of the same type
class PageElementList extends _1.PageNode {
    constructor(_selector, opts, cloneFunc) {
        super(_selector, opts);
        this._selector = _selector;
        /**
         * @param index starts at 0
         */
        this.at = (index) => this.where.getAt(index);
        this._waitType = opts.waitType || "visible" /* visible */;
        this._timeout = opts.timeout || JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default;
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
        this.currently = new Currently(this._selector, opts, cloneFunc);
        this.wait = new Wait(this);
        this.eventually = new Eventually(this, this._eventually);
    }
    initialWait() {
        switch (this._waitType) {
            case "exist" /* exist */:
                this.wait.any.exists();
                break;
            case "visible" /* visible */:
                this.wait.any.isVisible();
                break;
            case "value" /* value */:
                this.wait.any.hasAnyValue();
                break;
            case "text" /* text */:
                this.wait.any.hasAnyText();
                break;
        }
    }
    // RETRIEVAL FUNCTIONS for wdio or list elements
    get elements() {
        this.initialWait();
        return this.currently.elements;
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
        return getLength(this.elements);
    }
    getTimeout() {
        return this._timeout;
    }
    getInterval() {
        return this._interval;
    }
}
exports.PageElementList = PageElementList;
class Currently {
    constructor(selector, opts, cloneFunc) {
        /**
         * @param index starts at 0
         */
        this.at = (index) => this.where.getAt(index);
        // PUBLIC GETTER FUNCTIONS
        this.getLength = () => getLength(this.elements);
        // CHECK STATE FUNCTIONS
        this.isEmpty = () => browser.isExisting(this._selector);
        this._selector = selector;
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
}
class Wait {
    constructor(list) {
        // waits until list has given length
        this.hasLength = (length, { timeout = this._list.getTimeout(), comparator = "==" /* equalTo */, interval = this._list.getInterval() } = {}) => {
            browser.waitUntil(() => {
                let value = this._list.currently.elements.value;
                if (!value || !value.length) {
                    return false;
                }
                else {
                    return util_1.compare(value.length, length, comparator);
                }
            }, timeout, `${this.constructor.name}: Length never became ${comparator.toString()} ${length}.\n( ${this._list.getSelector()} )`, interval);
            return this._list;
        };
        this.isEmpty = ({ timeout = this._list.getTimeout(), interval = this._list.getInterval() } = {}) => {
            browser.waitUntil(() => {
                return !browser.isExisting(this._list.getSelector());
            }, timeout, `${this.constructor.name} never became empty.\n( ${this._list.getSelector()} )`, interval);
            return this._list;
        };
        this._list = list;
    }
    get any() {
        const element = this._list.first;
        const wait = Object.assign({}, element.wait);
        delete wait.not;
        return wait;
    }
    get none() {
        return this._list.first.wait.not;
    }
}
class Eventually {
    constructor(list, eventually) {
        this.hasLength = (length, { timeout = this._list.getTimeout(), comparator = "==" /* equalTo */, interval = this._list.getInterval() } = {}) => {
            return this._eventually(() => this._list.wait.hasLength(length, { timeout, comparator, interval }));
        };
        this.isEmpty = ({ timeout = this._list.getTimeout(), interval = this._list.getInterval() } = {}) => {
            return this._eventually(() => this._list.wait.isEmpty({ timeout, interval }));
        };
        this._list = list;
        this._eventually = eventually;
    }
    get any() {
        const element = this._list.first;
        const eventually = Object.assign({}, element.eventually);
        delete eventually.not;
        return eventually;
    }
    get none() {
        return this._list.first.eventually.not;
    }
}
// UTILITY FUNCTIONS
/**
 * Returns the number of page elements found in the DOM that match the list selector.
 */
function getLength(elements) {
    try {
        const value = elements.value;
        if (value && value.length) {
            return value.length;
        }
    }
    catch (error) {
        // this.elements will throw error if no elements were found
        return 0;
    }
}
//# sourceMappingURL=PageElementList.js.map