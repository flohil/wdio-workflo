"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class ValuePageElementMap extends _1.PageElementMap {
    constructor(selector, opts) {
        super(selector, opts);
        this.currently = new ValuePageElementMapCurrently(this);
        this.wait = new ValuePageElementMapWait(this);
        this.eventually = new ValuePageElementMapEventually(this);
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
        return this.eachGet(this._$, filter, node => node.getValue());
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
        return this.eachSet(this._$, values, (element, value) => element.setValue(value));
    }
}
exports.ValuePageElementMap = ValuePageElementMap;
class ValuePageElementMapCurrently extends _1.PageElementMapCurrently {
    constructor() {
        super(...arguments);
        this.not = Object.assign({}, super.not, { hasValue: (value) => {
                return this._node.eachCheck(this._node.$, value, (element, expected) => element.currently.not.hasValue(expected));
            }, hasAnyValue: (filterMask) => {
                return this._node.eachCheck(this._node.$, filterMask, element => element.currently.not.hasAnyValue());
            }, containsValue: (value) => {
                return this._node.eachCheck(this._node.$, value, (element, expected) => element.currently.not.containsValue(expected));
            } });
    }
    /**
     * Returns values of all list elements immediatly in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getValue(filter) {
        return this._node.eachGet(this._node.$, filter, node => node.currently.getValue());
    }
    setValue(values) {
        return this._node.eachSet(this._node.$, values, (element, value) => element.setValue(value));
    }
    hasValue(value) {
        return this._node.eachCheck(this._node.$, value, (element, expected) => element.currently.hasValue(expected));
    }
    hasAnyValue(filterMask) {
        return this._node.eachCheck(this._node.$, filterMask, (element) => element.currently.hasAnyValue());
    }
    containsValue(value) {
        return this._node.eachCheck(this._node.$, value, (element, expected) => element.currently.containsValue(expected));
    }
}
class ValuePageElementMapWait extends _1.PageElementMapWait {
    constructor() {
        super(...arguments);
        this.not = Object.assign({}, super.not, { hasValue: (value, opts) => {
                return this._node.eachWait(this._node.$, value, (element, expected) => element.wait.not.hasValue(expected, opts));
            }, hasAnyValue: (opts = {}) => {
                return this._node.eachWait(this._node.$, opts.filterMask, element => element.wait.not.hasAnyValue(opts));
            }, containsValue: (value, opts) => {
                return this._node.eachWait(this._node.$, value, (element, expected) => element.wait.not.containsValue(expected, opts));
            } });
    }
    hasValue(value, opts) {
        return this._node.eachWait(this._node.$, value, (element, expected) => element.wait.hasValue(expected, opts));
    }
    hasAnyValue(opts = {}) {
        return this._node.eachWait(this._node.$, opts.filterMask, element => element.wait.hasAnyValue(opts));
    }
    containsValue(value, opts) {
        return this._node.eachWait(this._node.$, value, (element, expected) => element.wait.containsValue(expected, opts));
    }
}
class ValuePageElementMapEventually extends _1.PageElementMapEventually {
    constructor() {
        super(...arguments);
        this.not = Object.assign({}, super.not, { hasValue: (value, opts) => {
                return this._node.eachCheck(this._node.$, value, (element, expected) => element.eventually.not.hasValue(expected, opts));
            }, hasAnyValue: (opts = {}) => {
                return this._node.eachCheck(this._node.$, opts.filterMask, element => element.eventually.not.hasAnyValue(opts));
            }, containsValue: (value, opts) => {
                return this._node.eachCheck(this._node.$, value, (element, expected) => element.eventually.not.containsValue(expected, opts));
            } });
    }
    hasValue(value, opts) {
        return this._node.eachCheck(this._node.$, value, (element, expected) => element.eventually.hasValue(expected, opts));
    }
    hasAnyValue(opts = {}) {
        return this._node.eachCheck(this._node.$, opts.filterMask, element => element.eventually.hasAnyValue(opts));
    }
    containsValue(value, opts) {
        return this._node.eachCheck(this._node.$, value, (element, expected) => element.eventually.containsValue(expected, opts));
    }
}
//# sourceMappingURL=ValuePageElementMap.js.map