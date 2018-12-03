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
const _1 = require(".");
const builders_1 = require("../builders");
const __1 = require("../");
const util_2 = require("util");
// holds several PageElement instances of the same type
class PageElementList extends _1.PageNode {
    constructor(_selector, opts) {
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
        this.currently = new PageElementListCurrently(this, opts);
        this.wait = new PageElementListWait(this);
        this.eventually = new PageElementListEventually(this);
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
    get lastDiff() {
        return this._lastDiff;
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
     * are needed, use get() or where instead.
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
    getTimeout() {
        return this._timeout;
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
    getText() {
        return this.all.map(listElement => listElement.getText());
    }
    // HELPER FUNCTIONS
    __compare(compareFunc, actuals, expected) {
        const diffs = [];
        if (util_2.isArray(expected) && expected.length !== actuals.length) {
            throw new Error(`${this.constructor.name}: ` +
                `Length of expected (${expected.length}) did not match length of actual (${actuals.length})!`);
        }
        for (let i = 0; i < actuals.length; ++i) {
            const _actual = actuals[i];
            const _expected = util_2.isArray(expected) ? expected[i] : expected;
            const element = this.at(i);
            if (compareFunc(element, _expected, _actual)) {
                diffs.push({
                    index: i + 1,
                    actual: (typeof _actual !== 'undefined') ? element.__typeToString(_actual) : undefined,
                    expected: (typeof _expected !== 'undefined') ? element.__typeToString(_expected) : undefined,
                    selector: element.getSelector()
                });
            }
        }
        this._lastDiff = diffs;
        return diffs.length === 0;
    }
    __equals(actuals, expected) {
        return this.__compare((element, actual, expected) => element.__equals(actual, expected), actuals, expected);
    }
    __any(actuals) {
        return this.__compare((element, actual) => element.__any(actual), actuals);
    }
    __contains(actuals, expected) {
        return this.__compare((element, actual, expected) => element.__contains(actual, expected), actuals, expected);
    }
    // CHECK STATE functions
    hasText(expected) {
        return this.__equals(this.getText(), expected);
    }
    hasAnyText() {
        return this.__any(this.getText());
    }
    containsText(expected) {
        return this.__contains(this.getText(), expected);
    }
}
exports.PageElementList = PageElementList;
class PageElementListCurrently {
    constructor(node, opts) {
        this.not = {
            isEmpty: () => !this.isEmpty(),
            hasLength: (length, comparator = "==" /* equalTo */) => !this.hasLength(length, comparator)
        };
        this._selector = node.getSelector();
        this._store = opts.store;
        this._elementOptions = opts.elementOptions;
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
    getText() {
        return this.all.map(listElement => listElement.currently.getText());
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
    hasText(expected) {
        return this._node.__equals(this.getText(), expected);
    }
    hasAnyText() {
        return this._node.__any(this.getText());
    }
    containsText(expected) {
        return this._node.__contains(this.getText(), expected);
    }
}
exports.PageElementListCurrently = PageElementListCurrently;
class PageElementListWait {
    constructor(node) {
        this.not = {
            isEmpty: (opts) => this.isEmpty({
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            hasLength: (length, opts) => this.hasLength(length, {
                timeout: opts.timeout, interval: opts.interval, reverse: true
            })
        };
        this._node = node;
    }
    // waits until list has given length
    hasLength(length, { timeout = this._node.getTimeout(), comparator = "==" /* equalTo */, interval = this._node.getInterval(), reverse } = {}) {
        browser.waitUntil(() => {
            if (reverse) {
                return !this._node.currently.hasLength(length, comparator);
            }
            else {
                return this._node.currently.hasLength(length, comparator);
            }
        }, timeout, `${this.constructor.name}: Length never became${util_1.comparatorStr(comparator)} ${length}.\n( ${this._node.getSelector()} )`, interval);
        return this._node;
    }
    isEmpty({ timeout = this._node.getTimeout(), interval = this._node.getInterval(), reverse } = {}) {
        browser.waitUntil(() => {
            if (reverse) {
                return !this._node.currently.isEmpty();
            }
            else {
                return this._node.currently.isEmpty();
            }
        }, timeout, `${this.constructor.name} never became empty.\n( ${this._node.getSelector()} )`, interval);
        return this._node;
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
}
exports.PageElementListWait = PageElementListWait;
class PageElementListEventually {
    constructor(node) {
        this.not = {
            isEmpty: (opts) => this.isEmpty({
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            hasLength: (length, opts) => this.hasLength(length, {
                timeout: opts.timeout, interval: opts.interval, reverse: true
            })
        };
        this._node = node;
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
    hasLength(length, { timeout = this._node.getTimeout(), comparator = "==" /* equalTo */, interval = this._node.getInterval(), reverse } = {}) {
        return this._eventually(() => this._node.wait.hasLength(length, { timeout, comparator, interval, reverse }));
    }
    isEmpty({ timeout = this._node.getTimeout(), interval = this._node.getInterval(), reverse } = {}) {
        return this._eventually(() => this._node.wait.isEmpty({ timeout, interval, reverse }));
    }
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
}
exports.PageElementListEventually = PageElementListEventually;
function excludeNot(obj) {
    let { not } = obj, rest = __rest(obj, ["not"]);
    return rest;
}
exports.excludeNot = excludeNot;
//# sourceMappingURL=PageElementList.js.map