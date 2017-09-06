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
        var { wait = "visible" /* visible */, timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default } = _a, superOpts = __rest(_a, ["wait", "timeout"]);
        super(selector, superOpts);
        this.selector = selector;
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
        this.wait = wait;
        this.timeout = timeout;
    }
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
        switch (this.wait) {
            case "exist" /* exist */:
                this.waitExist();
                break;
            case "visible" /* visible */:
                this.waitVisible();
                break;
            case "value" /* value */:
                this.waitValue();
                break;
            case "text" /* text */:
                this.waitText();
                break;
        }
    }
    // Returns true if element matching this selector currently exists.
    exists() {
        return this._element.isExisting();
    }
    // Returns true if element matching this selector currently is visible.
    isVisible() {
        return this._element.isVisible();
    }
    // Returns true if element matching this selector currently has text.
    hasText(text = undefined) {
        return (text) ? this._element.getText() === text : this._element.getText().length > 0;
    }
    // Returns true if element matching this selector currently contains text.
    containsText(text = undefined) {
        return (text) ? this._element.getText().indexOf(text) > -1 : this._element.getText().length > 0;
    }
    // Returns true if element matching this selector currently has value.
    hasValue(value = undefined) {
        return (value) ? this._element.getValue() === value : this._element.getValue().length > 0;
    }
    // Returns true if element matching this selector is enabled.
    isEnabled() {
        return this._element.isEnabled();
    }
    // Returns true if element matching this selector is enabled.
    isSelected() {
        return this._element.isSelected();
    }
    // checks if at least one element matching selector is existing within timeout
    // reverse is optional and false by default
    // timeout is optional and this._timeout by default
    eventuallyExists({ reverse = false, timeout = this.timeout } = {}) {
        try {
            this.waitExist({ reverse, timeout });
        }
        catch (error) {
            return reverse;
        }
        return !reverse;
    }
    // checks if at least one element matching selector is visible within timeout
    // reverse is optional and false by default
    // timeout is optional and this._timeout by default
    eventuallyIsVisible({ reverse = false, timeout = this.timeout } = {}) {
        try {
            this.waitVisible({ reverse, timeout });
        }
        catch (error) {
            return reverse;
        }
        return !reverse;
    }
    eventuallyIsHidden({ reverse = true, timeout = this.timeout } = {}) {
        try {
            this.waitVisible({ reverse, timeout });
        }
        catch (error) {
            return !reverse;
        }
        return reverse;
    }
    eventuallyHasText({ reverse = false, timeout = this.timeout, text = undefined } = {}) {
        try {
            this.waitText({ reverse, timeout, text });
        }
        catch (error) {
            return reverse;
        }
        return !reverse;
    }
    eventuallyContainsText({ reverse = false, timeout = this.timeout, text = undefined } = {}) {
        try {
            this.waitContainsText({ reverse, timeout, text });
        }
        catch (error) {
            return reverse;
        }
        return !reverse;
    }
    eventuallyHasValue({ reverse = false, timeout = this.timeout, value = undefined } = {}) {
        try {
            this.waitValue({ reverse, timeout, value });
        }
        catch (error) {
            return reverse;
        }
        return !reverse;
    }
    eventuallyIsEnabled({ reverse = false, timeout = this.timeout }) {
        try {
            this.waitEnabled({ reverse, timeout });
        }
        catch (error) {
            return reverse;
        }
        return !reverse;
    }
    eventuallyIsSelected({ reverse = false, timeout = this.timeout }) {
        try {
            this.waitSelected({ reverse, timeout });
        }
        catch (error) {
            return reverse;
        }
        return !reverse;
    }
    // WAIT FUNCTIONS
    // Waits until at least one matching element exists.
    // 
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // exists that matches the this.selector.
    waitExist({ timeout = this.timeout, reverse = false } = {}) {
        this._element.waitForExist(timeout, reverse);
        return this;
    }
    // Waits until at least one matching element is visible.
    // 
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // is visible that matches the this.selector.
    waitVisible({ timeout = this.timeout, reverse = false } = {}) {
        this._element.waitForVisible(timeout, reverse);
        return this;
    }
    waitHidden({ timeout = this.timeout, reverse = false } = {}) {
        this._element.waitForVisible(timeout, !reverse);
        return this;
    }
    // Waits until at least one matching element has a text.
    // 
    // text -> defines the text that element should have
    // If text is undefined, waits until element's text is not empty.
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // has a text that matches the this.selector.
    waitText({ reverse = false, timeout = this.timeout, text = undefined } = {}) {
        this._element.waitForText(timeout, reverse);
        if (typeof text !== 'undefined' &&
            typeof this._element.getText !== 'undefined') {
            browser.waitUntil(() => {
                return this.hasText(text);
            }, timeout, `${this.selector}: Text never became ${text}`);
        }
        return this;
    }
    // Waits until at least one matching element contains a text.
    // 
    // text -> defines the text that element should have
    // If text is undefined, waits until element's text is not empty.
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // has a text that matches the this.selector.
    waitContainsText({ reverse = false, timeout = this.timeout, text = undefined } = {}) {
        this._element.waitForText(timeout, reverse);
        if (typeof text !== 'undefined' &&
            typeof this._element.getText !== 'undefined') {
            browser.waitUntil(() => {
                return this.containsText(text);
            }, timeout, `${this.selector}: Text never contained ${text}`);
        }
        return this;
    }
    // Waits until at least one matching element has a value.
    // 
    // value -> defines the value that element should have
    // If value is undefined, waits until element's value is not empty.
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // has a value that matches the this.selector.
    waitValue({ reverse = false, timeout = this.timeout, value = undefined } = {}) {
        this._element.waitForValue(timeout, reverse);
        if (typeof value !== 'undefined' &&
            typeof this._element.getValue !== 'undefined') {
            browser.waitUntil(() => {
                return this.hasValue(value);
            }, timeout, `${this.selector}: Value never became ${value}`);
        }
        return this;
    }
    // Waits until at least one matching element is enabled.
    // 
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // is enabled that matches the this.selector.
    waitEnabled({ reverse = false, timeout = this.timeout } = {}) {
        this._element.waitForEnabled(timeout, reverse);
        return this;
    }
    // Waits until at least one matching element is selected.
    // 
    // wdioParams -> { timeout: <Number in ms>, reverse: <boolean> }
    // If reverse is set to true, function will wait until no element
    // is selected that matches the this.selector.
    waitSelected({ reverse = false, timeout = this.timeout } = {}) {
        this._element.waitForSelected(timeout, reverse);
        return this;
    }
    // AWAITED GETTER FUNCTIONS
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
    getAttribute(attrName) {
        return this.element.getAttribute(attrName);
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
    // INTERACTION FUNCTIONS
    /**
     *
     * @param postCondition Sometimes javascript that is to be executed after a click
     * is not loaded right at the moment that the element wait condition
     * is fulfilled. (eg. element is visible)
     * In this case, postCondition function will be
     */
    click(postCondition) {
        this.initialWait();
        let errorMessage = '';
        const interval = 250;
        let remainingTimeout = this.timeout;
        // wait for other overlapping elements to disappear
        browser.waitUntil(() => {
            remainingTimeout -= interval;
            try {
                this._element.click();
                return true;
            }
            catch (error) {
                if (error.message.indexOf("is not clickable at point") > -1) {
                    errorMessage = error.message;
                    return false;
                }
                else {
                    throw error;
                }
            }
        }, this.timeout, `Element did not become clickable after timeout: ${this.selector}\n\n${errorMessage}`, interval);
        if (postCondition && remainingTimeout > 0) {
            postCondition.timeout = postCondition.timeout || this.timeout;
            browser.waitUntil(() => {
                try {
                    if (postCondition.func()) {
                        return true;
                    }
                    else {
                        if (this.isVisible() && this.isEnabled()) {
                            this._element.click();
                        }
                    }
                }
                catch (error) {
                    errorMessage = error.message;
                }
            }, remainingTimeout + postCondition.timeout, `Postcondition for click never became true: ${this.selector}\n\n${errorMessage}`, interval);
        }
        return this;
    }
}
exports.PageElement = PageElement;
//# sourceMappingURL=PageElement.js.map