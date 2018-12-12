"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PageElement_1 = require("./PageElement");
class ValuePageElement extends PageElement_1.PageElement {
    constructor(selector, opts) {
        super(selector, opts);
    }
    initialWait() {
        if (this._waitType === "value" /* value */) {
            if (!this.currently.hasAnyValue()) {
                this.wait.hasAnyValue();
            }
            return this;
        }
        else {
            return super.initialWait();
        }
    }
    getValue() {
        return this._executeAfterInitialWait(() => this.currently.getValue());
    }
    setValue(value) {
        this.initialWait();
        return this.currently.setValue(value);
    }
}
exports.ValuePageElement = ValuePageElement;
class ValuePageElementCurrently extends PageElement_1.PageElementCurrently {
    constructor() {
        super(...arguments);
        this.not = Object.assign({}, super.not, { hasValue: (value) => !this.hasValue(value), hasAnyValue: () => !this.hasAnyValue(), containsValue: (value) => !this.containsValue(value) });
    }
    hasValue(value) {
        return this._compareHas(value, this.getValue());
    }
    hasAnyValue() {
        return this._compareHasAny(this.getValue());
    }
    containsValue(value) {
        return this._compareContains(value, this.getValue());
    }
}
exports.ValuePageElementCurrently = ValuePageElementCurrently;
class ValuePageElementWait extends PageElement_1.PageElementWait {
    constructor() {
        super(...arguments);
        this.not = Object.assign({}, super.not, { hasValue: (value, opts) => {
                return this.hasValue(value, this._makeReverseParams(opts));
            }, hasAnyValue: (opts) => {
                return this.hasAnyValue(this._makeReverseParams(opts));
            }, containsValue: (value, opts) => {
                return this.containsValue(value, this._makeReverseParams(opts));
            } });
    }
    hasValue(value, opts) {
        return this._waitHasProperty('value', value, () => this._node.currently.hasValue(value), opts);
    }
    hasAnyValue(opts = {}) {
        return this._waitWdioCheckFunc('had any value', opts => this._node.currently.element.waitForValue(opts.timeout, opts.reverse), opts);
    }
    containsValue(value, opts) {
        return this._waitContainsProperty('value', value, () => this._node.currently.containsValue(value), opts);
    }
}
exports.ValuePageElementWait = ValuePageElementWait;
class ValuePageElementEventually extends PageElement_1.PageElementEventually {
    constructor() {
        super(...arguments);
        this.not = Object.assign({}, super.not, { hasValue: (value, opts) => {
                return this._node.__eventually(() => this._node.wait.not.hasValue(value, opts));
            }, hasAnyValue: (opts) => {
                return this._node.__eventually(() => this._node.wait.not.hasAnyValue(opts));
            }, containsValue: (value, opts) => {
                return this._node.__eventually(() => this._node.wait.not.containsValue(value, opts));
            } });
    }
    hasValue(value, opts) {
        return this._node.__eventually(() => this._node.wait.hasValue(value, opts));
    }
    hasAnyValue(opts) {
        return this._node.__eventually(() => this._node.wait.hasAnyValue(opts));
    }
    containsValue(value, opts) {
        return this._node.__eventually(() => this._node.wait.containsValue(value, opts));
    }
}
exports.ValuePageElementEventually = ValuePageElementEventually;
//# sourceMappingURL=ValuePageElement.js.map