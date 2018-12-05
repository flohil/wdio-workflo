"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const _ = require("lodash");
class ValuePageElementList extends _1.PageElementList {
    constructor(selector, opts) {
        super(selector, opts);
        this.currently = new ValuePageElementListCurrently(this, opts);
        this.eventually = new ValuePageElementListEventually(this);
    }
    initialWait() {
        if (this._waitType === "value" /* value */) {
            this.wait.any.hasAnyValue();
        }
        else {
            super.initialWait();
        }
    }
    // GETTER FUNCTIONS
    /**
     * Returns values of all list elements in the order they were retrieved from the DOM
     * after the initial wait was performed.
     */
    getValue() {
        return this.all.map(valuePageElement => valuePageElement.getValue());
    }
    // SETTER FUNCTIONS
    /**
     * Sets values on all list elements after the initial wait was performed.
     *
     * If values is an array, the number of list elements must match the number of passed values.
     * The values will be assigned in the order that the list elements were retrieved from the DOM.
     *
     * If values is a single value, the same value will be set on all list elements.
     *
     * @param values
     */
    setValue(values) {
        const allElements = this.all;
        if (_.isArray(values)) {
            if (allElements.length !== values.length) {
                throw new Error(`${this.constructor.name}: ` +
                    `Length of values array (${allElements.length}) did not match length of list page elements (${values.length})!`);
            }
            else {
                for (let i = 0; i < allElements.length; i++) {
                    allElements[i].setValue(values[i]);
                }
            }
        }
        else {
            for (let i = 0; i < allElements.length; i++) {
                allElements[i].setValue(values);
            }
        }
        return this;
    }
}
exports.ValuePageElementList = ValuePageElementList;
class ValuePageElementListCurrently extends _1.PageElementListCurrently {
    constructor() {
        super(...arguments);
        this.not = Object.assign({}, super.not, { hasValue: (value) => {
                return this._node.__compare((element, expected) => element.currently.not.hasValue(expected), value);
            }, hasAnyValue: () => {
                return this._node.__compare(element => element.currently.not.hasAnyValue());
            }, containsValue: (value) => {
                return this._node.__compare((element, expected) => element.currently.not.containsValue(expected), value);
            } });
    }
    /**
     * Returns values of all list elements in the order they were retrieved from the DOM immediatly.
     */
    getValue() {
        return this.all.map(valuePageElement => valuePageElement.currently.getValue());
    }
    /**
     * Sets values on all list elements immediatly.
     *
     * If values is an array, the number of list elements must match the number of passed values.
     * The values will be assigned in the order that the list elements were retrieved from the DOM.
     *
     * If values is a single value, the same value will be set on all list elements.
     *
     * @param values
     */
    setValue(values) {
        const allElements = this.all;
        if (_.isArray(values)) {
            if (allElements.length !== values.length) {
                throw new Error(`Length of values array (${allElements.length}) did not match length of list page elements (${values.length})!`);
            }
            else {
                for (let i = 0; i < allElements.length; i++) {
                    allElements[i].currently.setValue(values[i]);
                }
            }
        }
        else {
            for (let i = 0; i < allElements.length; i++) {
                allElements[i].currently.setValue(values);
            }
        }
        return this._node;
    }
    // CHECK STATE
    hasValue(value) {
        return this._node.__compare((element, expected) => element.currently.hasValue(expected), value);
    }
    hasAnyValue() {
        return this._node.__compare(element => element.currently.hasAnyValue());
    }
    containsValue(value) {
        return this._node.__compare((element, expected) => element.currently.containsValue(expected), value);
    }
}
class ValuePageElementListEventually extends _1.PageElementListEventually {
    constructor() {
        // CHECK STATE
        super(...arguments);
        this.not = Object.assign({}, super.not, { hasValue: (value, opts) => {
                return this._node.__compare((element, expected) => element.eventually.not.hasValue(expected, opts), value);
            }, hasAnyValue: (opts) => {
                return this._node.__compare(element => element.eventually.not.hasAnyValue(opts));
            }, containsValue: (value, opts) => {
                return this._node.__compare((element, expected) => element.eventually.not.containsValue(expected, opts), value);
            } });
    }
    hasValue(value, opts) {
        return this._node.__compare((element, expected) => element.eventually.hasValue(expected, opts), value);
    }
    hasAnyValue(opts) {
        return this._node.__compare(element => element.eventually.hasAnyValue(opts));
    }
    containsValue(value, opts) {
        return this._node.__compare((element, expected) => element.eventually.containsValue(expected, opts), value);
    }
}
//# sourceMappingURL=ValuePageElementList.js.map