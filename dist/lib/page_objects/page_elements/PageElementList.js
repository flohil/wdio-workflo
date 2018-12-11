"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const util_1 = require("../../utility_functions/util");
const _1 = require(".");
const builders_1 = require("../builders");
const __1 = require("../");
const util_2 = require("util");
const PageNode_1 = require("./PageNode");
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
        return this.eachGet(this.all, element => element.getText());
    }
    getDirectText() {
        return this.eachGet(this.all, element => element.getDirectText());
    }
    // HELPER FUNCTIONS
    eachCheck(elements, checkFunc, expected) {
        const diffs = {};
        if (util_2.isArray(expected) && expected.length !== elements.length) {
            throw new Error(`${this.constructor.name}: ` +
                `Length of expected (${expected.length}) did not match length of list (${elements.length})!`);
        }
        for (let i = 0; i < elements.length; ++i) {
            const _expected = util_2.isArray(expected) ? expected[i] : expected;
            const element = elements[i];
            if (!checkFunc(element, _expected)) {
                diffs[`[${i + 1}]`] = element.__lastDiff;
            }
        }
        this._lastDiff = {
            tree: diffs
        };
        return Object.keys(diffs).length === 0;
    }
    eachGet(elements, getFunc) {
        return elements.map(element => getFunc(element));
    }
    // perform initial wait to make sure list elements are loaded
    eachWait(elements, waitFunc, expected) {
        if (util_2.isArray(expected) && expected.length !== elements.length) {
            throw new Error(`${this.constructor.name}: ` +
                `Length of expected (${expected.length}) did not match length of list (${elements.length})!`);
        }
        for (let i = 0; i < elements.length; ++i) {
            const _expected = util_2.isArray(expected) ? expected[i] : expected;
            const element = elements[i];
            waitFunc(element, _expected);
        }
        return this;
    }
    eachDo(elements, doFunc) {
        return elements.map(element => doFunc(element));
    }
    eachSet(elements, setFunc, values) {
        if (_.isArray(values)) {
            if (elements.length !== values.length) {
                throw new Error(`Length of values array (${values.length}) did not match length of list page elements (${elements.length})!`);
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
        this.not = {
            isEmpty: () => !this.isEmpty(),
            hasLength: (length, comparator = "==" /* equalTo */) => !this.hasLength(length, comparator),
            isVisible: () => {
                return this._node.eachCheck(this.all, element => element.currently.not.isVisible());
            },
            isEnabled: () => {
                return this._node.eachCheck(this.all, element => element.currently.not.isEnabled());
            },
            hasText: (text) => {
                return this._node.eachCheck(this.all, (element, expected) => element.currently.not.hasText(expected), text);
            },
            hasAnyText: () => {
                return this._node.eachCheck(this.all, (element) => element.currently.not.hasAnyText());
            },
            containsText: (text) => {
                return this._node.eachCheck(this.all, (element, expected) => element.currently.not.containsText(expected), text);
            },
            hasDirectText: (directText) => {
                return this._node.eachCheck(this.all, (element, expected) => element.currently.not.hasDirectText(expected), directText);
            },
            hasAnyDirectText: () => {
                return this._node.eachCheck(this.all, (element) => element.currently.not.hasAnyDirectText());
            },
            containsDirectText: (directText) => {
                return this._node.eachCheck(this.all, (element, expected) => element.currently.not.containsDirectText(expected), directText);
            }
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
        return this._node.eachGet(this.all, element => element.currently.getText());
    }
    getDirectText() {
        return this._node.eachGet(this.all, element => element.currently.getDirectText());
    }
    // CHECK STATE FUNCTIONS
    isEmpty() {
        return !browser.isExisting(this._selector);
    }
    hasLength(length, comparator = "==" /* equalTo */) {
        const actualLength = this.getLength();
        this._node.__setLastDiff({
            actual: actualLength.toString()
        });
        return util_1.compare(actualLength, length, comparator);
    }
    isVisible() {
        return this._node.eachCheck(this.all, element => element.currently.isVisible());
    }
    isEnabled() {
        return this._node.eachCheck(this.all, element => element.currently.isEnabled());
    }
    hasText(text) {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.hasText(expected), text);
    }
    hasAnyText() {
        return this._node.eachCheck(this.all, (element) => element.currently.hasAnyText());
    }
    containsText(text) {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.containsText(expected), text);
    }
    hasDirectText(directText) {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.hasDirectText(expected), directText);
    }
    hasAnyDirectText() {
        return this._node.eachCheck(this.all, (element) => element.currently.hasAnyDirectText());
    }
    containsDirectText(directText) {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.containsDirectText(expected), directText);
    }
}
exports.PageElementListCurrently = PageElementListCurrently;
class PageElementListWait extends PageNode_1.PageNodeWait {
    constructor() {
        super(...arguments);
        this.not = {
            isEmpty: (opts = {}) => this.isEmpty({
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            hasLength: (length, opts = {}) => this.hasLength(length, {
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            isVisible: (opts) => {
                return this._node.eachWait(this._node.all, element => element.wait.not.isVisible(opts));
            },
            isEnabled: (opts) => {
                return this._node.eachWait(this._node.all, element => element.wait.not.isEnabled(opts));
            },
            hasText: (text, opts) => {
                return this._node.eachWait(this._node.all, (element, expected) => element.wait.not.hasText(expected, opts), text);
            },
            hasAnyText: (opts) => {
                return this._node.eachWait(this._node.all, (element) => element.wait.not.hasAnyText(opts));
            },
            containsText: (text, opts) => {
                return this._node.eachWait(this._node.all, (element, expected) => element.wait.not.containsText(expected, opts), text);
            },
            hasDirectText: (directText, opts) => {
                return this._node.eachWait(this._node.all, (element, expected) => element.wait.not.hasDirectText(expected, opts), directText);
            },
            hasAnyDirectText: (opts) => {
                return this._node.eachWait(this._node.all, (element) => element.wait.not.hasAnyDirectText(opts));
            },
            containsDirectText: (directText, opts) => {
                return this._node.eachWait(this._node.all, (element, expected) => element.wait.not.containsDirectText(expected, opts), directText);
            }
        };
    }
    // waits until list has given length
    hasLength(length, { timeout = this._node.getTimeout(), comparator = "==" /* equalTo */, interval = this._node.getInterval(), reverse } = {}) {
        const notStr = (reverse) ? 'not ' : '';
        return this._waitUntil(() => {
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
        return this._waitUntil(() => {
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
    isVisible(opts) {
        return this._node.eachWait(this._node.all, element => element.wait.isVisible(opts));
    }
    isEnabled(opts) {
        return this._node.eachWait(this._node.all, element => element.wait.isEnabled(opts));
    }
    hasText(text, opts) {
        return this._node.eachWait(this._node.all, (element, expected) => element.wait.hasText(expected, opts), text);
    }
    hasAnyText(opts) {
        return this._node.eachWait(this._node.all, (element) => element.wait.hasAnyText(opts));
    }
    containsText(text, opts) {
        return this._node.eachWait(this._node.all, (element, expected) => element.wait.containsText(expected, opts), text);
    }
    hasDirectText(directText, opts) {
        return this._node.eachWait(this._node.all, (element, expected) => element.wait.hasDirectText(expected, opts), directText);
    }
    hasAnyDirectText(opts) {
        return this._node.eachWait(this._node.all, (element) => element.wait.hasAnyDirectText(opts));
    }
    containsDirectText(directText, opts) {
        return this._node.eachWait(this._node.all, (element, expected) => element.wait.containsDirectText(expected, opts), directText);
    }
}
exports.PageElementListWait = PageElementListWait;
class PageElementListEventually extends PageNode_1.PageNodeEventually {
    constructor() {
        super(...arguments);
        this.not = {
            isEmpty: (opts = {}) => this.isEmpty({
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            hasLength: (length, opts = {}) => this.hasLength(length, {
                timeout: opts.timeout, interval: opts.interval, reverse: true
            }),
            isVisible: (opts) => {
                return this._node.eachCheck(this._node.all, element => element.eventually.not.isVisible(opts));
            },
            isEnabled: (opts) => {
                return this._node.eachCheck(this._node.all, element => element.eventually.not.isEnabled(opts));
            },
            hasText: (text, opts) => {
                return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.not.hasText(expected, opts), text);
            },
            hasAnyText: (opts) => {
                return this._node.eachCheck(this._node.all, undefined, (element) => element.eventually.not.hasAnyText(opts));
            },
            containsText: (text, opts) => {
                return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.not.containsText(expected, opts), text);
            },
            hasDirectText: (directText, opts) => {
                return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.not.hasDirectText(expected, opts), directText);
            },
            hasAnyDirectText: (opts) => {
                return this._node.eachCheck(this._node.all, undefined, (element) => element.eventually.not.hasAnyDirectText(opts));
            },
            containsDirectText: (directText, opts) => {
                return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.not.containsDirectText(expected, opts), directText);
            }
        };
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
        return this._eventually(() => this._node.wait.hasLength(length, { timeout, comparator, interval, reverse }));
    }
    isEmpty({ timeout = this._node.getTimeout(), interval = this._node.getInterval(), reverse } = {}) {
        return this._eventually(() => this._node.wait.isEmpty({ timeout, interval, reverse }));
    }
    isVisible(opts) {
        return this._node.eachCheck(this._node.all, element => element.eventually.isVisible(opts));
    }
    isEnabled(opts) {
        return this._node.eachCheck(this._node.all, element => element.eventually.isEnabled(opts));
    }
    hasText(text, opts) {
        return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.hasText(expected, opts), text);
    }
    hasAnyText(opts) {
        return this._node.eachCheck(this._node.all, (element) => element.eventually.hasAnyText(opts));
    }
    containsText(text, opts) {
        return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.containsText(expected, opts), text);
    }
    hasDirectText(directText, opts) {
        return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.hasDirectText(expected, opts), directText);
    }
    hasAnyDirectText(opts) {
        return this._node.eachCheck(this._node.all, (element) => element.eventually.hasAnyDirectText(opts));
    }
    containsDirectText(directText, opts) {
        return this._node.eachCheck(this._node.all, (element, expected) => element.eventually.containsDirectText(expected, opts), directText);
    }
}
exports.PageElementListEventually = PageElementListEventually;
//# sourceMappingURL=PageElementList.js.map