"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class ValuePageElementMap extends _1.PageElementMap {
    constructor(selector, opts) {
        super(selector, opts);
        this.currently = new ValuePageElementMapCurrently(this);
    }
    /**
     * Returns values of all list elements after performing an initial wait in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getValue(filter) {
        return this.__getInterfaceFunc(this.$, node => node.getValue(), filter);
    }
    /**
     * Sets values on all list elements.
     *
     * If values is an array, the number of list elements must match the number of passed values.
     * The values will be assigned in the order that the list elements were retrieved from the DOM.
     *
     * If values is a single value, the same value will be set on all list elements.
     *
     * @param values
     */
    setValue(values) {
        for (const k in values) {
            this.$[k].setValue(values[k]);
        }
        return this;
    }
}
exports.ValuePageElementMap = ValuePageElementMap;
class ValuePageElementMapCurrently extends _1.PageElementMapCurrently {
    /**
     * Returns values of all list elements immediatly in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getValue(filter) {
        return this._node.__getInterfaceFunc(this._node.$, node => node.currently.getValue(), filter);
    }
    setValue(values) {
        for (const k in values) {
            this._node.$[k].currently.setValue(values[k]);
        }
        return this._node;
    }
}
//# sourceMappingURL=ValuePageElementMap.js.map