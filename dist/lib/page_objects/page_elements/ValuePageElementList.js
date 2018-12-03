"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const _ = require("lodash");
class ValuePageElementList extends _1.PageElementList {
    constructor(selector, opts) {
        super(selector, opts);
        this.currently = new ValuePageElementListCurrently(this, opts);
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
                throw new Error(`Length of values array (${allElements.length}) did not match length of list page elements (${values.length})!`);
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
}
//# sourceMappingURL=ValuePageElementList.js.map