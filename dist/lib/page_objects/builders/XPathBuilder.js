"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class XPathBuilder {
    static getInstance() {
        if (typeof XPathBuilder.instance === 'undefined') {
            XPathBuilder.instance = new XPathBuilder();
        }
        return XPathBuilder.instance;
    }
    SelectorBuilder() {
        this._selector = '';
    }
    reset(selector) {
        this._selector = selector;
        return this;
    }
    append(selector) {
        this._selector = `${this._selector}${selector}`;
        return this;
    }
    constraint(constraint) {
        this._selector = `${this._selector}[${constraint}]`;
        return this;
    }
    // Modifies element selector, so use only once for
    // the same element.
    text(text) {
        this._selector = `${this._selector}[. = '${text}']`;
        return this;
    }
    // Modifies element selector, so use only once for
    // the same element.
    containedText(text) {
        this._selector = `${this._selector}[contains(.,'${text}')]`;
        return this;
    }
    // Modifies element selector, so use only once for
    // the same element.
    attr(key, value) {
        this._selector = `${this._selector}[@${key}='${value}']`;
        return this;
    }
    containedAttr(key, value) {
        this._selector = `${this._selector}[contains(@${key},'${value}')]`;
        return this;
    }
    level(level) {
        this._selector = `${this._selector}[${level}]`;
        return this;
    }
    id(value) {
        return this.attr('id', value);
    }
    class(value) {
        return this.attr('class', value);
    }
    containedClass(value) {
        return this.containedAttr('class', value);
    }
    build() {
        const selector = this._selector;
        return selector;
    }
}
exports.XPathBuilder = XPathBuilder;
//# sourceMappingURL=XPathBuilder.js.map