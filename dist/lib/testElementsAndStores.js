"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_1 = require("./utilityFunctions/class");
const _ = require("lodash");
class PageElement {
    constructor(selector, options) {
        this.wait = () => {
            console.log("wait");
        };
        options = _.merge({ name: 'PageElement' }, options);
        this._selector = selector;
        this._name = options.name;
    }
    get selector() {
        return this._selector;
    }
    get name() {
        return this._name;
    }
}
class InputElement extends PageElement {
    constructor(selector, options) {
        options = _.merge({
            name: 'InputElement',
            waitTime: 400
        }, options);
        super(selector, options);
        this._waitTime = options.waitTime;
    }
    set(value) {
        console.log("set: ", value);
    }
    get waitTime() {
        return this._waitTime;
    }
}
class MyInputElement extends InputElement {
    set(value) {
        console.log("other set: ", value);
    }
}
class MyElement extends PageElement {
}
class PageElementStore {
    constructor() {
        this.cache = {};
        this.Element = (selector, options = {}
            // merging default args
        ) => this.get(selector, options.type || PageElement, _.merge({ name: 'alex' }, options));
        this.get = (selector, type, options) => {
            if (!(selector in this.cache)) {
                const result = new type(selector, options);
                for (const method of class_1.getAllMethods(this)) {
                    if (method.indexOf('_') !== 0 && /^[A-Z]/.test(method)) {
                        result[method] = (_selector, _options) => {
                            _selector = `${selector}${_selector}`;
                            return this[method].apply(this, [_selector, _options]);
                        };
                    }
                }
                this.cache[selector] = result;
            }
            return this.cache[selector];
        };
    }
}
class InputElementStore extends PageElementStore {
    constructor() {
        super(...arguments);
        this.Element = (selector, options = {}) => this.get(selector, options.type || PageElement, _.merge({ name: "hollers" }, options));
        this.InputElement = (selector, options = { waitTime: 5 }) => this.get(selector, options.type || InputElement, _.merge(options, { name: "input" }));
    }
}
class TestPage {
    constructor() {
        this.store = new PageElementStore();
    }
    get myContainer() {
        return this.store.Element("//div");
    }
    get myButton() {
        return this.store.Element("//button", { type: MyElement, name: "meine" });
    }
}
class TestPageB {
    constructor() {
        this.store = new InputElementStore();
    }
    get myInput() {
        return this.store.InputElement("//input", { name: 'input2', waitTime: 61 });
    }
    get otherInput() {
        return this.store.InputElement("//otherInput", { type: MyInputElement, waitTime: 3 });
    }
    get myElement() {
        return this.store.Element("//div");
    }
}
const page = new TestPage();
const pageB = new TestPageB();
pageB.myInput.set("asdf");
pageB.otherInput.set("other");
console.log(page.myContainer.name);
console.log(page.myButton.name);
console.log(pageB.myElement.name);
console.log(pageB.myInput.name);
console.log(pageB.myInput.waitTime);
//# sourceMappingURL=testElementsAndStores.js.map