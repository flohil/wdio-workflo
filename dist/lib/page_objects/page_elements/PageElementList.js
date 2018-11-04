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
        // CURRENTLY FUNCTIONS
        this.currently = {
            elements: this.__elements,
            where: this.__where,
            first: this.__first,
            at: (index) => this.__where.getAt(index),
            all: this.__listElements,
            getLength: () => this._getLength(this.__elements),
            isEmpty: () => !browser.isExisting(this._selector)
        };
        // waits until list has given length
        this._waitHasLength = (length, { timeout = this._timeout, comparator = "==" /* equalTo */, interval = this._interval } = {}) => {
            browser.waitUntil(() => {
                let value = this.__elements.value;
                if (!value || !value.length) {
                    return false;
                }
                else {
                    return util_1.compare(value.length, length, comparator);
                }
            }, timeout, `${this.constructor.name}: Length never became ${comparator.toString()} ${length}.\n( ${this._selector} )`, interval);
            return this;
        };
        this._waitEmpty = ({ timeout = this._timeout, interval = this._interval } = {}) => {
            browser.waitUntil(() => {
                return !browser.isExisting(this._selector);
            }, timeout, `${this.constructor.name} never became empty.\n( ${this._selector} )`, interval);
            return this;
        };
        // returns true if list has length within timeout
        // else returns false
        this._eventuallyHasLength = (length, { timeout = this._timeout, comparator = "==" /* equalTo */, interval = this._interval } = {}) => {
            return this._eventually(() => this._waitHasLength(length, { timeout, comparator, interval }));
        };
        this._eventuallyIsEmpty = ({ timeout = this._timeout, interval = this._interval } = {}) => {
            return this._eventually(() => this._waitEmpty({ timeout, interval }));
        };
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
        this.__whereBuilder = new builders_1.ListWhereBuilder(this._selector, {
            store: this._store,
            elementStoreFunc: this._elementStoreFunc,
            elementOptions: this._elementOptions,
            cloneFunc: this._cloneFunc,
            getAllFunc: list => list.currently.all
        });
    }
    // RETRIEVAL FUNCTIONS for wdio or list elements
    get __elements() {
        return browser.elements(this._selector);
    }
    get elements() {
        this.initialWait();
        return this.__elements;
    }
    // Retrieves list of elements identified by this.selector
    // which reflect browser state after first element is found.
    //
    // Waits for at least one element to reach the waiting condition defined
    // in wait type.
    // Todo add _listElements() that does not wait for wait type condition for all elements
    // Returns elements matching list selector that reflect current browser state
    // -> no implicit waiting!!!
    // does not use cache
    get __listElements() {
        const elements = [];
        const value = this.__elements.value;
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
    _listElements() {
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
    // RETRIEVE subset of list functions
    get __where() {
        return this.__whereBuilder.reset();
    }
    /**
     * Returns the first page element found in the DOM that matches the list selector.
     */
    get __first() {
        return this.__where.getFirst();
    }
    get where() {
        return this._whereBuilder.reset();
    }
    /**
     * Returns the first page element found in the DOM that matches the list selector.
     */
    get first() {
        this.initialWait();
        return this.where.getFirst();
    }
    /**
     *
     * @param index starts at 0
     */
    at(index) {
        this.initialWait();
        return this.where.getAt(index);
    }
    /**
     * Returns all page elements found in the DOM that match the list selector after initial wait.
     */
    get all() {
        return this._listElements();
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
    // PRIVATE GETTER FUNCTIONS
    /**
     * Returns the number of page elements found in the DOM that match the list selector.
     */
    _getLength(elements) {
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
    // PUBLIC GETTER FUNCTIONS
    getLength() {
        return this._getLength(this.currently.elements);
    }
    // WAIT functions
    get wait() {
        return {
            hasLength: this._waitHasLength,
            isEmpty: this._waitEmpty,
            any: this._anyWait,
            none: this._noneWait
        };
    }
    get _anyWait() {
        const element = this.first;
        const wait = Object.assign({}, element.wait);
        delete wait.not;
        return wait;
    }
    get _noneWait() {
        return this.first.wait.not;
    }
    // EVENTUALLY
    get eventually() {
        return {
            hasLength: this._eventuallyHasLength,
            isEmpty: this._eventuallyIsEmpty,
            any: this._anyEventually,
            none: this._noneEventually
        };
    }
    get _anyEventually() {
        const element = this.first;
        const eventually = Object.assign({}, element.eventually);
        delete eventually.not;
        return eventually;
    }
    get _noneEventually() {
        return this.first.eventually.not;
    }
}
exports.PageElementList = PageElementList;
//# sourceMappingURL=PageElementList.js.map