"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const page_elements_1 = require("../page_elements");
const walkers_1 = require("../walkers");
const builders_1 = require("../builders");
// Stores singleton instances of page elements to avoid creating new
// elements on each invocation of a page element.
class PageElementStore {
    constructor() {
        this._instanceCache = Object.create(null);
        this._xPathBuilder = builders_1.XPathBuilder.getInstance();
    }
    // DEFINE YOUR ELEMENT GROUPS HERE
    // Encapsulates arbitrary page element types.
    // Returns all nodes passed in content as its own members,
    // so that they can be accessed via dot notation.
    //
    // content is a collection of node getters, where each node
    // can be any form of page element defined in PageElementStore.
    //
    // walkerClass is optional and allows for passing a
    // custom group walker class.
    // Per default, ElementGroupWalker will be used as a walker.
    //
    // functions is an optional array of group function names that
    // defines the functions this group is supposed to support.
    //
    // id is a string to uniquely identify a group.
    // If id is not defined, the group instance will be identified
    // by a concatenated string of its node key names and types.
    ElementGroup(content) {
        return this._getGroup(page_elements_1.PageElementGroup, {
            walkerType: walkers_1.PageElementGroupWalker,
            walkerOptions: {},
            content: content
        });
    }
    TextGroup(content) {
        return this._getGroup(page_elements_1.TextGroup, {
            walkerType: walkers_1.PageElementGroupWalker,
            walkerOptions: {},
            content: content
        });
    }
    ValueGroup(content) {
        return this._getGroup(page_elements_1.ValueGroup, {
            walkerType: walkers_1.PageElementGroupWalker,
            walkerOptions: {},
            content: content
        });
    }
    // DEFINE YOUR SINGLE ELEMENT TYPE ACCESSOR FUNCTIONS HERE
    /**
     *
     * @param selector
     * @param options
     */
    Element(selector, options) {
        return this._get(selector, page_elements_1.PageElement, Object.assign({ store: this }, options));
    }
    ExistElement(selector, options) {
        return this.Element(selector, Object.assign({ waitType: "exist" /* exist */ }, options));
    }
    // DEFINE YOUR ELEMENT LIST TYPE ACCESSOR FUNCTIONS HERE
    List(selector, options) {
        return this._get(selector, page_elements_1.PageElementList, Object.assign({ store: this, elementStoreFunc: options.elementStoreFunc }, options));
    }
    ElementList(selector, options) {
        return this.List(selector, Object.assign({ elementOptions: {}, elementStoreFunc: this.Element }, options));
    }
    ExistElementList(selector, options) {
        return this.List(selector, Object.assign({ elementOptions: {}, elementStoreFunc: this.ExistElement, waitType: "exist" /* exist */ }, options));
    }
    // Element Maps
    Map(selector, options) {
        return this._get(selector, page_elements_1.PageElementMap, Object.assign({ store: this, elementStoreFunc: options.elementStoreFunc }, options));
    }
    ElementMap(selector, options) {
        return this.Map(selector, Object.assign({ elementStoreFunc: this.Element, elementOptions: {} }, options));
    }
    ExistElementMap(selector, options) {
        return this.Map(selector, Object.assign({ elementStoreFunc: this.ExistElement, elementOptions: {} }, options));
    }
    // Functions to retrieve element instances
    /**
     * Returns a page element with the given selector, type and options.
     *
     * If a page element with identical parameters already exists in this store,
     * a cached instance of this page element will be returned.
     *
     * @param selector
     * @param type
     * @param options
     */
    _get(selector, type, options = Object.create(Object.prototype)) {
        const _selector = (selector instanceof builders_1.XPathBuilder) ? this._xPathBuilder.build() : selector;
        // catch: selector must not contain |
        if (_selector.indexOf('|||') > -1) {
            throw new Error(`Selector must not contain character sequence '|||': ${_selector}`);
        }
        const id = `${_selector}|||${type}|||${options.toString()}`;
        const cloneFunc = cloneSelector => {
            if (!cloneSelector) {
                cloneSelector = selector;
            }
            return this._get(cloneSelector, type, options);
        };
        if (!(id in this._instanceCache)) {
            const result = new type(_selector, options, cloneFunc);
            this._instanceCache[id] = result;
        }
        return this._instanceCache[id];
    }
    _getGroup(groupType, groupOptions) {
        // Build id from group's elements' ids.
        // If two groups have the same content,
        // they are the same.
        let idStr = '';
        for (const key in groupOptions.content) {
            if (groupOptions.content.hasOwnProperty(key)) {
                idStr += `${groupOptions.content[key].__getNodeId()};`;
            }
        }
        const key = `${groupType.name}:${groupOptions.walkerType.name}:${idStr}`;
        if (!(key in this._instanceCache)) {
            const fullGroupOptions = _.merge({
                id: idStr,
            }, groupOptions);
            this._instanceCache[key] = new groupType(fullGroupOptions);
        }
        return this._instanceCache[key];
    }
}
exports.PageElementStore = PageElementStore;
//# sourceMappingURL=PageElementStore.js.map