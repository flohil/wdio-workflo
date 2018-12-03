"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class ValuePageElementMap extends _1.PageElementMap {
    constructor(selector, opts) {
        super(selector, opts);
        this.currently = new ValuePageElementMapCurrently(this);
    }
    /**
     * Returns values of all list elements in the order they were retrieved from the DOM.
     */
    getValue() {
        return this.__getInterfaceFunc(this.$, node => node.getValue());
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
    getValue() {
        return this._node.__getInterfaceFunc(this._node.$, node => node.currently.getValue());
    }
    setValue(values) {
        for (const k in values) {
            this._node.$[k].currently.setValue(values[k]);
        }
        return this._node;
    }
}
//# sourceMappingURL=ValuePageElementMap.js.map