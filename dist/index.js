"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const pageObjects = require("./lib/page_objects");
exports.pageObjects = pageObjects;
__export(require("./lib/steps"));
const objectFunctions = require("./lib/utility_functions/object");
exports.objectFunctions = objectFunctions;
const arrayFunctions = require("./lib/utility_functions/array");
exports.arrayFunctions = arrayFunctions;
const classFunctions = require("./lib/utility_functions/class");
exports.classFunctions = classFunctions;
const stringFunctions = require("./lib/utility_functions/string");
exports.stringFunctions = stringFunctions;
const Kiwi_1 = require("./lib/Kiwi");
exports.Kiwi = Kiwi_1.default;
class Input extends pageObjects.elements.ValuePageElement {
    constructor(selector, opts) {
        super(selector, opts);
        this.currently = new InputCurrently(this);
    }
    setValue(value) {
        this.initialWait();
        return this.currently.setValue(value);
    }
}
class InputCurrently extends pageObjects.elements.ValuePageElementCurrently {
    getValue() {
        return this.element.getValue();
    }
    setValue(value) {
        this.element.setValue(value);
        return this._node;
    }
}
class InputStore extends pageObjects.stores.PageElementStore {
    Input(selector, options) {
        return this._getElement(selector, Input, Object.assign({ store: this }, options));
    }
    InputList(selector, options) {
        return this.ValueList(selector, Object.assign({ elementOptions: {}, elementStoreFunc: this.Input }, options));
    }
    InputMap(selector, options) {
        return this.ValueMap(selector, Object.assign({ elementStoreFunc: this.Input, elementOptions: {} }, options));
    }
}
//# sourceMappingURL=index.js.map