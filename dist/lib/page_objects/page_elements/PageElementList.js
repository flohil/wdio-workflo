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
const util_1 = require("../../utility_functions/util");
const _1 = require("./");
const builders_1 = require("../builders");
// holds several PageElement instances of the same type
class PageElementList extends _1.PageNode {
    constructor(selector, _a) {
        var { waitType = "visible" /* visible */, timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default, disableCache = false, elementStoreFunc, elementOptions, identifier, interval } = _a, superOpts = __rest(_a, ["waitType", "timeout", "disableCache", "elementStoreFunc", "elementOptions", "identifier", "interval"]);
        super(selector, superOpts);
        this.selector = selector;
        // WAIT FUNCTION
        this.wait = {
            hasLength: this._waitHasLength,
            isEmpty: this._waitEmpty,
            any: this._anyWait,
            none: this._noneWait
        };
        // EVENTUALLY
        this.eventually = {
            hasLength: this._eventuallyHasLength,
            isEmpty: this._eventuallyIsEmpty,
            any: this._anyEventually,
            none: this._noneEventually
        };
        this.waitType = waitType;
        this.timeout = timeout;
        this.selector = selector;
        this.elementOptions = elementOptions;
        this.elementStoreFunc = elementStoreFunc;
        this.identifier = identifier;
        this.identifiedObjCache = {};
        this.interval = this.interval || 500;
        this.firstByBuilder = new builders_1.FirstByBuilder(this.selector, {
            store: this.store,
            elementStoreFunc: this.elementStoreFunc,
            elementOptions: this.elementOptions
        });
    }
    get _elements() {
        return browser.elements(this.selector);
    }
    get elements() {
        this.initialWait();
        return this._elements;
    }
    initialWait() {
        switch (this.waitType) {
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
    // Retrieves list of elements identified by this.selector
    // which reflect browser state after first element is found.
    //
    // Waits for at least one element to reach the waiting condition defined
    // in wait type.
    // Todo add _listElements() that does not wait for wait type condition for all elements
    // Returns elements matching list selector that reflect current browser state
    // -> no implicit waiting!!!
    // does not use cache
    get _listElements() {
        const elements = [];
        const value = this._elements.value;
        if (value && value.length) {
            // create list elements
            for (let i = 0; i < value.length; i++) {
                // make each list element individually selectable via xpath
                const selector = `(${this.selector})[${i + 1}]`;
                const listElement = this.elementStoreFunc.apply(this.store, [selector, this.elementOptions]);
                elements.push(listElement);
            }
        }
        return elements;
    }
    // wait until at least one element satisfies the initial wait condition
    get listElements() {
        const elements = [];
        try {
            const value = this.elements.value;
            if (value && value.length) {
                // create list elements
                for (let i = 0; i < value.length; i++) {
                    // make each list element individually selectable via xpath
                    const selector = `(${this.selector})[${i + 1}]`;
                    const listElement = this.elementStoreFunc.apply(this.store, [selector, this.elementOptions]);
                    elements.push(listElement);
                }
            }
            return elements;
        }
        catch (error) {
            // this.elements will throw error if no elements were found
            return elements;
        }
    }
    setIdentifier(identifier) {
        this.identifier = identifier;
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
     * are needed, use firstBy() instead.
     **/
    identify({ identifier = this.identifier, resetCache = false } = {}) {
        const cacheKey = (identifier) ? `${identifier.mappingObject.toString()}|||${identifier.func.toString()}` : 'index';
        if (this.disableCache || resetCache || !(cacheKey in this.identifiedObjCache)) {
            const listElements = this.listElements;
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
            this.identifiedObjCache[cacheKey] = mappedObj;
        }
        return this.identifiedObjCache[cacheKey];
    }
    // TEMPORARY GET FUNCTIONS - NEWLY EVALUATED ON EACH CALL
    /**
     *
     * @param index Index starts with 0
     */
    get(index) {
        return this.firstBy().index(index + 1).get();
    }
    getAll() {
        return this.listElements;
    }
    // gets the length of the list/the number of elements in the list
    getLength() {
        return this.listElements.length;
    }
    isEmpty() {
        return !browser.isExisting(this.selector);
    }
    firstBy() {
        return this.firstByBuilder.reset();
    }
    // waits until list has given length
    _waitHasLength(length, { timeout = this.timeout, comparator = "==" /* equalTo */, interval = this.interval }) {
        browser.waitUntil(() => {
            let value = this._elements.value;
            if (!value || !value.length) {
                return false;
            }
            else {
                return util_1.compare(value.length, length, comparator);
            }
        }, timeout, `${this.selector}: List length never became ${comparator.toString()} ${length}`, interval);
        return this;
    }
    _waitEmpty({ timeout = this.timeout, interval = this.interval }) {
        browser.waitUntil(() => {
            return !browser.isExisting(this.selector);
        }, timeout, `List never became empty: ${this.selector}`, interval);
        return this;
    }
    get _anyWait() {
        const element = this.elementStoreFunc.apply(this.store, [this.selector, this.elementOptions]);
        const wait = Object.assign({}, element.wait);
        delete wait.not;
        return wait;
    }
    get _noneWait() {
        const element = this.elementStoreFunc.apply(this.store, [this.selector, this.elementOptions]);
        return element.wait.not;
    }
    // returns true if list has length within timeout
    // else returns false
    _eventuallyHasLength(length, { timeout = this.timeout, comparator = "==" /* equalTo */, interval = this.interval }) {
        return this._eventually(() => this._waitHasLength(length, { timeout, comparator, interval }));
    }
    _eventuallyIsEmpty({ timeout = this.timeout, interval = this.interval }) {
        return this._eventually(() => this._waitEmpty({ timeout, interval }));
    }
    get _anyEventually() {
        const element = this.elementStoreFunc.apply(this.store, [this.selector, this.elementOptions]);
        const eventually = Object.assign({}, element.eventually);
        delete eventually.not;
        return eventually;
    }
    get _noneEventually() {
        const element = this.elementStoreFunc.apply(this.store, [this.selector, this.elementOptions]);
        return element.eventually.not;
    }
}
exports.PageElementList = PageElementList;
//# sourceMappingURL=PageElementList.js.map