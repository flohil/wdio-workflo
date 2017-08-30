"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XPathBuilder_1 = require("./XPathBuilder");
class FirstByBuilder {
    constructor(selector, options) {
        this.selector = selector;
        this.store = options.store;
        this.elementStoreFunc = options.elementStoreFunc;
        this.elementOptions = options.elementOptions;
        this.xPathBuilder = XPathBuilder_1.XPathBuilder.getInstance();
    }
    reset() {
        this.xPathBuilder.reset(this.selector);
        return this;
    }
    constraint(constraint) {
        this.xPathBuilder.constraint(constraint);
        return this;
    }
    // Modifies element selector, so use only once for
    // the same element.
    text(text) {
        this.xPathBuilder.text(text);
        return this;
    }
    // Modifies element selector, so use only once for
    // the same element.
    containedText(text) {
        this.xPathBuilder.containedText(text);
        return this;
    }
    // Modifies element selector, so use only once for
    // the same element.
    attr(key, value) {
        this.xPathBuilder.attr(key, value);
        return this;
    }
    containedAttr(key, value) {
        this.xPathBuilder.containedAttr(key, value);
        return this;
    }
    level(level) {
        this.xPathBuilder.level(level);
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
    /**
     * Starts with 1
     * @param index
     */
    index(index) {
        const selector = `(${this.xPathBuilder.build()})[${index}]`;
        this.xPathBuilder.reset(selector);
        return this;
    }
    get() {
        return this.elementStoreFunc.apply(this.store, [this.xPathBuilder.build(), this.elementOptions]);
    }
}
exports.FirstByBuilder = FirstByBuilder;
//# sourceMappingURL=FirstByBuilder.js.map