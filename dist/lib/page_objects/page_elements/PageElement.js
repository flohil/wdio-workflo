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
const _1 = require("./");
const builders_1 = require("../builders");
const htmlParser = require("htmlparser2");
class PageElement extends _1.PageNode {
    // available options:
    // - wait -> initial wait operation: exist, visible, text, value
    constructor(selector, _a) {
        var { waitType = "visible" /* visible */, timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default, customScroll = undefined } = _a, superOpts = __rest(_a, ["waitType", "timeout", "customScroll"]);
        super(selector, superOpts);
        this.selector = selector;
        this.wait = {
            exists: this._waitExists,
            isVisible: this._waitIsVisible,
            hasClass: this._waitHasClass,
            containsClass: this._waitContainsClass,
            hasText: this._waitHasText,
            hasAnyText: this._waitHasAnyText,
            containsText: this._waitContainsText,
            hasValue: this._waitHasValue,
            hasAnyValue: this._waitHasAnyValue,
            containsValue: this._waitContainsValue,
            isEnabled: this._waitIsEnabled,
            isSelected: this._waitIsSelected,
            until: this._waitUntil,
            not: {
                exists: this._waitNotExists,
                isVisible: this._waitNotIsVisible,
                hasClass: this._waitNotHasClass,
                containsClass: this._waitNotContainsClass,
                hasText: this._waitNotHasText,
                hasAnyText: this._waitNotHasAnyText,
                containsText: this._waitNotContainsText,
                hasValue: this._waitNotHasValue,
                hasAnyValue: this._waitNotHasAnyValue,
                containsValue: this._waitNotContainsValue,
                isEnabled: this._waitNotIsEnabled,
                isSelected: this._waitNotIsSelected,
            }
        };
        this.eventually = {
            exists: this._eventuallyExists,
            isVisible: this._eventuallyIsVisible,
            hasClass: this._eventuallyHasClass,
            containsClass: this._eventuallyContainsClass,
            hasText: this._eventuallyHasText,
            hasAnyText: this._eventuallyHasAnyText,
            containsText: this._eventuallyContainsText,
            hasValue: this._eventuallyHasValue,
            hasAnyValue: this._eventuallyHasAnyValue,
            containsValue: this._eventuallyContainsValue,
            isEnabled: this._eventuallyIsEnabled,
            isSelected: this._eventuallyIsSelected,
            does: this._eventuallyDoes,
            not: {
                exists: this._eventuallyNotExists,
                isVisible: this._eventuallyNotIsVisible,
                hasClass: this._eventuallyNotHasClass,
                containsClass: this._eventuallyNotContainsClass,
                hasText: this._eventuallyNotHasText,
                hasAnyText: this._eventuallyNotHasAnyText,
                containsText: this._eventuallyNotContainsText,
                hasValue: this._eventuallyNotHasValue,
                hasAnyValue: this._eventuallyNotHasAnyValue,
                containsValue: this._eventuallyNotContainsValue,
                isEnabled: this._eventuallyNotIsEnabled,
                isSelected: this._eventuallyNotIsSelected,
            }
        };
        this._$ = Object.create(null);
        for (const method of Workflo.Class.getAllMethods(this.store)) {
            if (method.indexOf('_') !== 0 && /^[A-Z]/.test(method)) {
                this._$[method] = (_selector, _options) => {
                    if (_selector instanceof builders_1.XPathBuilder) {
                        _selector = builders_1.XPathBuilder.getInstance().build();
                    }
                    // chain selectors
                    _selector = `${selector}${_selector}`;
                    return this.store[method].apply(this.store, [_selector, _options]);
                };
            }
        }
        this.waitType = waitType;
        this.timeout = timeout;
        this.customScroll = customScroll;
    }
    // RETRIEVE ELEMENT FUNCTIONS
    get $() {
        return this._$;
    }
    /**
     *
     */
    get _element() {
        return browser.element(this.selector);
    }
    get element() {
        this.initialWait();
        return this._element;
    }
    initialWait() {
        switch (this.waitType) {
            case "exist" /* exist */:
                if (!this.exists()) {
                    this._waitExists();
                }
                break;
            case "visible" /* visible */:
                if (!this.isVisible()) {
                    this._waitIsVisible();
                }
                break;
            case "value" /* value */:
                if (!this.hasAnyValue()) {
                    this._waitHasAnyValue();
                }
                break;
            case "text" /* text */:
                if (!this.hasAnyText()) {
                    this._waitHasAnyText();
                }
                break;
        }
        return this;
    }
    // CHECK STATE FUNCTIONS
    // Returns true if element matching this selector currently exists.
    exists() {
        return this._element.isExisting();
    }
    // Returns true if element matching this selector currently is visible.
    isVisible() {
        return this._element.isVisible();
    }
    hasClass(className) {
        return this.getClass() === className;
    }
    containsClass(className) {
        const _class = this.getClass();
        if (!_class) {
            return false;
        }
        else {
            return _class.indexOf(className) > -1;
        }
    }
    // Returns true if element matching this selector currently has text.
    hasText(text) {
        return this._element.getText() === text;
    }
    hasAnyText() {
        return this._element.getText().length > 0;
    }
    // Returns true if element matching this selector currently contains text.
    containsText(text) {
        return this._element.getText().indexOf(text) > -1;
    }
    // Returns true if element matching this selector currently has value.
    hasValue(value) {
        return this._element.getValue() === value;
    }
    hasAnyValue() {
        return this._element.getValue().length > 0;
    }
    // Returns true if element matching this selector currently contains value.
    containsValue(value) {
        return this._element.getValue().indexOf(value) > -1;
    }
    // Returns true if element matching this selector is enabled.
    isEnabled() {
        return this._element.isEnabled();
    }
    // Returns true if element matching this selector is enabled.
    isSelected() {
        return this._element.isSelected();
    }
    // GETTER FUNCTIONS
    // returns html af all matches for a given selector,
    // even if only ONE WebDriverElement is returned!!!!!
    // eg. for browser.element('div') ->
    // HTML returns all divs
    // but only the first div is returned as WebDriverElement
    getAllHTML() {
        return this.element.getHTML();
    }
    // returns text of this.element including
    // all texts of nested children
    getText() {
        return this.element.getText();
    }
    // get text of this.element node only,
    // excluding all texts of nested children
    // (eg icons etc.)
    // works only for a single matched element (by selector)
    getDirectText() {
        const html = this.element.getHTML();
        let text = "";
        const handler = new htmlParser.DomHandler(function (error, dom) {
            if (error) {
                throw new Error(`Error creating dom for exclusive text in ${this.element.selector}: ${error}`);
            }
            else {
                dom.forEach(node => {
                    node.children.forEach(childNode => {
                        if (childNode.type === 'text') {
                            text += childNode.data;
                        }
                    });
                });
            }
        });
        var parser = new htmlParser.Parser(handler);
        parser.write(html);
        parser.end();
        return text;
        // executing javascript on page does not work in internet explorer
        /*return browser.execute((myelem) : string => {
          const parent = myelem.value
          let child = parent.firstChild
          let ret = ''
          while (child) {
            if (child.nodeType === Node.TEXT_NODE) {
              ret += child.textContent
            }
    
            child = child.nextSibling
          }
          return ret
        }, this.element).value*/
    }
    getValue() {
        return this.element.getValue();
    }
    getAttribute(attrName) {
        return this.element.getAttribute(attrName);
    }
    getClass() {
        return this.element.getAttribute('class');
    }
    getId() {
        return this.element.getAttribute('id');
    }
    getName() {
        return this.element.getAttribute('name');
    }
    getLocation(axis) {
        return this.element.getLocation(axis);
    }
    getSize() {
        return this.element.getElementSize();
    }
    getTimeout() {
        return this.timeout;
    }
    // INTERACTION FUNCTIONS
    setValue(value) {
        this.element.setValue(value);
    }
    /**
     *
     * @param postCondition Sometimes javascript that is to be executed after a click
     * is not loaded right at the moment that the element wait condition
     * is fulfilled. (eg. element is visible)
     * In this case, postCondition function will be
     */
    click(options) {
        this.initialWait();
        let errorMessage = '';
        const interval = 250;
        const viewPortSize = browser.getViewportSize();
        let y = viewPortSize.height / 2;
        let x = viewPortSize.width / 2;
        let remainingTimeout = this.timeout;
        if (!options) {
            options = {};
        }
        if (options && !options.customScroll) {
            if (this.customScroll) {
                options.customScroll = this.customScroll;
            }
        }
        const clickFunc = !options.customScroll ? () => this._element.click() : () => {
            const result = browser.selectorExecute(this.getSelector(), function (elems, selector) {
                if (elems.length === 0) {
                    return {
                        notFound: [selector]
                    };
                }
                elems[0].click();
            }, this.getSelector());
            if (isJsError(result)) {
                throw new Error(`Element could not be clicked: ${result.notFound.join(', ')}`);
            }
        };
        if (options.customScroll) {
            this.scrollTo(options.customScroll);
        }
        // wait for other overlapping elements to disappear
        try {
            browser.waitUntil(() => {
                remainingTimeout -= interval;
                try {
                    clickFunc();
                    errorMessage = undefined;
                    return true;
                }
                catch (error) {
                    if (error.message.indexOf("is not clickable at point") > -1) {
                        errorMessage = error.message;
                        return false;
                    }
                }
            }, this.timeout, `Element did not become clickable after timeout: ${this.selector}`, interval);
        }
        catch (waitE) {
            waitE.message = errorMessage.replace('unknown error: ', '');
            throw waitE;
        }
        if (options && options.postCondition && remainingTimeout > 0) {
            options.timeout = options.timeout || this.timeout;
            try {
                browser.waitUntil(() => {
                    try {
                        if (options.postCondition()) {
                            return true;
                        }
                        else {
                            if (this.isVisible() && this.isEnabled()) {
                                clickFunc();
                            }
                        }
                    }
                    catch (error) {
                        errorMessage = error.message;
                    }
                }, remainingTimeout + options.timeout, `Postcondition for click never became true: ${this.selector}`, interval);
            }
            catch (waitE) {
                waitE.message = errorMessage.replace('unknown error: ', '');
                throw waitE;
            }
        }
        return this;
    }
    scrollTo(params) {
        if (!params.offsets) {
            params.offsets = {
                x: 0,
                y: 0
            };
        }
        if (!params.offsets.x) {
            params.offsets.x = 0;
        }
        if (!params.offsets.y) {
            params.offsets.y = 0;
        }
        if (typeof params.closestContainerIncludesHidden === 'undefined') {
            params.closestContainerIncludesHidden = true;
        }
        const result = browser.selectorExecute([this.getSelector()], function (elems, elementSelector, params) {
            var error = {
                notFound: []
            };
            if (elems.length === 0) {
                error.notFound.push(elementSelector);
            }
            ;
            if (error.notFound.length > 0) {
                return error;
            }
            var elem = elems[0];
            var container = undefined;
            function getScrollParent(element, includeHidden) {
                var style = getComputedStyle(element);
                var excludeStaticParent = style.position === "absolute";
                var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
                if (style.position === "fixed")
                    return document.body;
                for (var parent = element; (parent = parent.parentElement);) {
                    style = getComputedStyle(parent);
                    if (excludeStaticParent && style.position === "static") {
                        continue;
                    }
                    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
                        return parent;
                }
                return document.body;
            }
            if (typeof params.containerSelector === 'undefined') {
                container = getScrollParent(elem, params.closestContainerIncludesHidden);
            }
            else {
                container = document.evaluate(params.containerSelector, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (container === null) {
                    error.notFound.push(params.containerSelector);
                    return error;
                }
            }
            var elemTop = elem.getBoundingClientRect().top;
            var elemLeft = elem.getBoundingClientRect().left;
            var containerTop = container.getBoundingClientRect().top;
            var containerLeft = container.getBoundingClientRect().left;
            var previousScrollTop = container.scrollTop;
            var previousScrollLeft = container.scrollLeft;
            var scrollTop = elemTop - containerTop + previousScrollTop + params.offsets.y;
            var scrollLeft = elemLeft - containerLeft + previousScrollLeft + params.offsets.x;
            if (typeof params.directions !== 'undefined') {
                if (params.directions.y) {
                    container.scrollTop = scrollTop;
                }
                if (params.directions.x) {
                    container.scrollLeft = scrollLeft;
                }
            }
            return {
                elemTop: elemTop,
                elemLeft: elemLeft,
                containerTop: containerTop,
                containerLeft: containerLeft,
                scrollTop: scrollTop,
                scrollLeft: scrollLeft
            };
        }, this.getSelector(), params);
        if (isJsError(result)) {
            throw new Error(`Elements could not be located: ${result.notFound.join(', ')}`);
        }
        else {
            return result;
        }
    }
    // WAIT
    // Waits until at least one matching element exists.
    //
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // exists that matches the this.selector.
    _waitExists({ timeout = this.timeout } = {}) {
        this._element.waitForExist(timeout);
        return this;
    }
    _waitNotExists({ timeout = this.timeout } = {}) {
        this._element.waitForExist(timeout, true);
        return this;
    }
    // Waits until at least one matching element is visible.
    //
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // is visible that matches the this.selector.
    _waitIsVisible({ timeout = this.timeout } = {}) {
        this._element.waitForVisible(timeout);
        return this;
    }
    _waitNotIsVisible({ timeout = this.timeout } = {}) {
        this._element.waitForVisible(timeout, true);
        return this;
    }
    _waitHasClass(className, { timeout = this.timeout } = {}) {
        browser.waitUntil(() => {
            return this.hasClass(className);
        }, timeout, `${this.selector}: Class never became '${className}'`);
        return this;
    }
    _waitNotHasClass(className, { timeout = this.timeout } = {}) {
        browser.waitUntil(() => {
            return !this.hasClass(className);
        }, timeout, `${this.selector}: Class never became other than '${className}'`);
        return this;
    }
    _waitContainsClass(className, { timeout = this.timeout } = {}) {
        browser.waitUntil(() => {
            return this.containsClass(className);
        }, timeout, `${this.selector}: Class never contained '${className}'`);
        return this;
    }
    _waitNotContainsClass(className, { timeout = this.timeout } = {}) {
        browser.waitUntil(() => {
            return !this.containsClass(className);
        }, timeout, `${this.selector}: Class never not contained '${className}'`);
        return this;
    }
    // Waits until at least one matching element has a text.
    //
    // text -> defines the text that element should have
    // If text is undefined, waits until element's text is not empty.
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // has a text that matches the this.selector.
    _waitHasText(text, { timeout = this.timeout } = {}) {
        browser.waitUntil(() => {
            return this.hasText(text);
        }, timeout, `${this.selector}: Text never became '${text}'`);
        return this;
    }
    _waitNotHasText(text, { timeout = this.timeout } = {}) {
        browser.waitUntil(() => {
            return !this.hasText(text);
        }, timeout, `${this.selector}: Text never became other than '${text}'`);
        return this;
    }
    _waitHasAnyText({ timeout = this.timeout } = {}) {
        this._element.waitForText(timeout);
        return this;
    }
    _waitNotHasAnyText({ timeout = this.timeout } = {}) {
        this._element.waitForText(timeout, true);
        return this;
    }
    // Waits until at least one matching element contains a text.
    //
    // text -> defines the text that element should have
    // If text is undefined, waits until element's text is not empty.
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // has a text that matches the this.selector.
    _waitContainsText(text, { timeout = this.timeout } = {}) {
        browser.waitUntil(() => {
            return this.containsText(text);
        }, timeout, `${this.selector}: Text never contained '${text}'`);
        return this;
    }
    _waitNotContainsText(text, { timeout = this.timeout } = {}) {
        browser.waitUntil(() => {
            return !this.containsText(text);
        }, timeout, `${this.selector}: Text never not contained '${text}'`);
        return this;
    }
    // Waits until at least one matching element has a value.
    //
    // value -> defines the value that element should have
    // If value is undefined, waits until element's value is not empty.
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // has a value that matches the this.selector.
    _waitHasValue(value, { timeout = this.timeout } = {}) {
        browser.waitUntil(() => {
            return this.hasValue(value);
        }, timeout, `${this.selector}: Value never became '${value}'`);
        return this;
    }
    _waitNotHasValue(value, { timeout = this.timeout } = {}) {
        browser.waitUntil(() => {
            return !this.hasValue(value);
        }, timeout, `${this.selector}: Value never became other than '${value}'`);
        return this;
    }
    _waitHasAnyValue({ timeout = this.timeout } = {}) {
        this._element.waitForValue(timeout);
        return this;
    }
    _waitNotHasAnyValue({ timeout = this.timeout } = {}) {
        this._element.waitForValue(timeout, true);
        return this;
    }
    // Waits until at least one matching element contains a value.
    //
    // value -> defines the value that element should have
    // If value is undefined, waits until element's value is not empty.
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // has a text that matches the this.selector.
    _waitContainsValue(value, { timeout = this.timeout } = {}) {
        browser.waitUntil(() => {
            return this.containsValue(value);
        }, timeout, `${this.selector}: Value never contained '${value}'`);
        return this;
    }
    _waitNotContainsValue(value, { timeout = this.timeout } = {}) {
        browser.waitUntil(() => {
            return !this.containsValue(value);
        }, timeout, `${this.selector}: Value never not contained '${value}'`);
        return this;
    }
    // Waits until at least one matching element is enabled.
    //
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // is enabled that matches the this.selector.
    _waitIsEnabled({ timeout = this.timeout } = {}) {
        this._element.waitForEnabled(timeout);
        return this;
    }
    _waitNotIsEnabled({ timeout = this.timeout } = {}) {
        this._element.waitForEnabled(timeout, true);
        return this;
    }
    // Waits until at least one matching element is selected.
    //
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // is selected that matches the this.selector.
    _waitIsSelected({ timeout = this.timeout } = {}) {
        this._element.waitForSelected(timeout);
        return this;
    }
    _waitNotIsSelected({ timeout = this.timeout } = {}) {
        this._element.waitForSelected(timeout, true);
        return this;
    }
    _waitUntil(description, condition, { timeout = this.timeout } = {}) {
        browser.waitUntil(() => condition(this), timeout, `${this.selector}: Wait until element ${description} failed`);
        return this;
    }
    // EVENTUALLY FUNCTIONS
    // checks if at least one element matching selector is existing within timeout
    // reverse is optional and false by default
    // timeout is optional and this._timeout by default
    _eventuallyExists({ timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitExists({ timeout }));
    }
    _eventuallyNotExists({ timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitNotExists({ timeout }));
    }
    // checks if at least one element matching selector is visible within timeout
    // reverse is optional and false by default
    // timeout is optional and this._timeout by default
    _eventuallyIsVisible({ timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitIsVisible({ timeout }));
    }
    _eventuallyNotIsVisible({ timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitNotIsVisible({ timeout }));
    }
    _eventuallyHasClass(className, { timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitHasClass(className, { timeout }));
    }
    _eventuallyNotHasClass(className, { timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitNotHasClass(className, { timeout }));
    }
    _eventuallyContainsClass(className, { timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitContainsClass(className, { timeout }));
    }
    _eventuallyNotContainsClass(className, { timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitNotContainsClass(className, { timeout }));
    }
    _eventuallyHasText(text, { timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitHasText(text, { timeout }));
    }
    _eventuallyNotHasText(text, { timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitNotHasText(text, { timeout }));
    }
    _eventuallyHasAnyText({ timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitHasAnyText({ timeout }));
    }
    _eventuallyNotHasAnyText({ timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitNotHasAnyText({ timeout }));
    }
    _eventuallyContainsText(text, { timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitContainsText(text, { timeout }));
    }
    _eventuallyNotContainsText(text, { timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitNotContainsText(text, { timeout }));
    }
    _eventuallyHasValue(value, { timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitHasValue(value, { timeout }));
    }
    _eventuallyNotHasValue(value, { timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitNotHasValue(value, { timeout }));
    }
    _eventuallyHasAnyValue({ timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitHasAnyValue({ timeout }));
    }
    _eventuallyNotHasAnyValue({ timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitNotHasAnyValue({ timeout }));
    }
    _eventuallyContainsValue(value, { timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitContainsValue(value, { timeout }));
    }
    _eventuallyNotContainsValue(value, { timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitNotContainsValue(value, { timeout }));
    }
    _eventuallyIsEnabled({ timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitIsEnabled({ timeout }));
    }
    _eventuallyNotIsEnabled({ timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitNotIsEnabled({ timeout }));
    }
    _eventuallyIsSelected({ timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitIsSelected({ timeout }));
    }
    _eventuallyNotIsSelected({ timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitNotIsSelected({ timeout }));
    }
    _eventuallyDoes(description, condition, { timeout = this.timeout } = {}) {
        return this._eventually(() => this._waitUntil(description, () => condition(this), { timeout }));
    }
}
exports.PageElement = PageElement;
// type guards
function isJsError(result) {
    if (!result) {
        return false;
    }
    return result.notFound !== undefined;
}
function isScrollResult(result) {
    return result.elemTop !== undefined;
}
//# sourceMappingURL=PageElement.js.map