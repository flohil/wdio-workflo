"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const page_elements_1 = require("../page_elements");
const builders_1 = require("../builders");
const ValuePageElementMap_1 = require("../page_elements/ValuePageElementMap");
// Stores singleton instances of page elements to avoid creating new
// elements on each invocation of a page element.
class PageElementStore {
    constructor() {
        this._instanceCache = Object.create(null);
        this._xPathBuilder = builders_1.XPathBuilder.getInstance();
    }
    // ELEMENTS
    /**
     *
     * @param selector
     * @param options
     */
    Element(selector, options) {
        return this._getElement(selector, page_elements_1.PageElement, Object.assign({ store: this }, options));
    }
    ExistElement(selector, options) {
        return this.Element(selector, Object.assign({ waitType: "exist" /* exist */ }, options));
    }
    // LISTS
    List(selector, options) {
        return this._getList(selector, page_elements_1.PageElementList, Object.assign({ store: this }, options));
    }
    ValueList(selector, options) {
        return this._getList(selector, page_elements_1.ValuePageElementList, Object.assign({ store: this }, options));
    }
    ElementList(selector, options) {
        return this.List(selector, Object.assign({ elementOptions: {}, elementStoreFunc: this.Element }, options));
    }
    ExistElementList(selector, options) {
        return this.List(selector, Object.assign({ elementOptions: {}, elementStoreFunc: this.ExistElement, waitType: "exist" /* exist */ }, options));
    }
    // MAPS
    Map(selector, options) {
        return this._getMap(selector, page_elements_1.PageElementMap, Object.assign({ store: this, elementStoreFunc: options.elementStoreFunc }, options));
    }
    ValueMap(selector, options) {
        return this._getMap(selector, ValuePageElementMap_1.ValuePageElementMap, Object.assign({ store: this, elementStoreFunc: options.elementStoreFunc }, options));
    }
    ElementMap(selector, options) {
        return this.Map(selector, Object.assign({ elementStoreFunc: this.Element, elementOptions: {} }, options));
    }
    ExistElementMap(selector, options) {
        return this.Map(selector, Object.assign({ elementStoreFunc: this.ExistElement, elementOptions: {} }, options));
    }
    // GROUPS
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
    ElementGroup(content, options) {
        return this._getGroup(page_elements_1.PageElementGroup, Object.assign({ store: this, content: content }, options));
    }
    ValueGroup(content, options) {
        return this._getGroup(page_elements_1.ValuePageElementGroup, Object.assign({ store: this, content: content }, options));
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
    _get(selector, type, options = Object.create(Object.prototype), afterConstruction) {
        const _selector = (selector instanceof builders_1.XPathBuilder) ? this._xPathBuilder.build() : selector;
        // catch: selector must not contain |
        if (_selector.indexOf('|||') > -1) {
            throw new Error(`Selector must not contain character sequence '|||': ${_selector}`);
        }
        const id = `${_selector}|||${type}|||${options.toString()}`;
        if (!(id in this._instanceCache)) {
            const result = new type(_selector, options);
            if (typeof afterConstruction !== 'undefined') {
                afterConstruction(result);
            }
            this._instanceCache[id] = result;
        }
        return this._instanceCache[id];
    }
    _getElement(selector, type, options = Object.create(Object.prototype)) {
        return this._get(selector, type, options);
    }
    _getList(selector, type, options = Object.create(Object.prototype)) {
        return this._get(selector, type, options, instance => {
            const cloneFunc = cloneSelector => {
                if (!cloneSelector) {
                    cloneSelector = selector;
                }
                return this._getList(cloneSelector, type, options);
            };
            instance.init(cloneFunc);
        });
    }
    _getMap(selector, type, options = Object.create(Object.prototype)) {
        return this._get(selector, type, options);
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
        const key = `${groupType.name}:${idStr}`;
        if (!(key in this._instanceCache)) {
            this._instanceCache[key] = new groupType(idStr, groupOptions);
        }
        return this._instanceCache[key];
    }
}
exports.PageElementStore = PageElementStore;
// REMOVE THIS - just for testing
// interface IInputOpts<Store extends PageElementStore> extends pageObjects.elements.IValuePageElementOpts<Store> {
// }
// class Input<
//   Store extends pageObjects.stores.PageElementStore,
// > extends pageObjects.elements.ValuePageElement<
//   Store, string
// > {
//   currently: InputCurrently<Store, this>;
//   constructor(selector: string, opts?: IInputOpts<Store>) {
//     super(selector, opts)
//     this.currently = new InputCurrently(this)
//   }
//   setValue(value: string) {
//     this.element.setValue(value)
//     return this
//   }
// }
// class InputCurrently<
//   Store extends pageObjects.stores.PageElementStore,
//   PageElementType extends Input<Store>
// > extends pageObjects.elements.ValuePageElementCurrently<Store, PageElementType, string> {
//   getValue(): string {
//     return this.element.getValue()
//   }
// }
// // achieved mapping type to input value!!!
// class InputStore extends pageObjects.stores.PageElementStore {
//   Input(
//     selector: Workflo.XPath,
//     options?: Pick<IInputOpts<this>, Workflo.Store.ElementPublicKeys>
//   ) {
//     return this._getElement<Input<this>, IInputOpts<this>>(
//       selector,
//       Input,
//       {
//         store: this,
//         ...options
//       }
//     )
//   }
//   InputList(
//     selector: Workflo.XPath,
//     options?: Workflo.PickPartial<
//       pageObjects.elements.IValuePageElementListOpts<
//         this, Input<this>, Pick<IInputOpts<this>, Workflo.Store.ElementPublicKeys>, string
//       >,
//       "waitType" | "timeout" | "disableCache" | "identifier",
//       "elementOptions"
//     >
//   ) {
//     return this.ValueList(
//       selector,
//       {
//         elementOptions: {},
//         elementStoreFunc: this.Input,
//         ...options
//       }
//     )
//   }
//   InputMap<K extends string>(
//     selector: Workflo.XPath,
//     options: Workflo.PickPartial<
//       pageObjects.elements.IPageElementMapOpts<this, K, Input<this>, Pick<IInputOpts<this>, Workflo.Store.ElementPublicKeys>>,
//       Workflo.Store.MapPublicKeys,
//       Workflo.Store.MapPublicPartialKeys
//     >
//   ) {
//     return this.ValueMap(
//       selector,
//       {
//         elementStoreFunc: this.Input,
//         elementOptions: {},
//         ...options
//       }
//     )
//   }
// }
// const inputStore = new InputStore()
// const innerGroup = pageObjects.stores.pageElement.ValueGroup({
//   input: inputStore.Input('//input'),
//   element: inputStore.Element('//div'),
//   inputList: inputStore.InputList('//input'),
//   elementList: inputStore.ElementList('//div'),
//   inputMap: inputStore.InputMap('//input', {
//     identifier: {
//       mappingObject: {
//         x: 'X',
//         y: 'Y'
//       },
//       func: (mapSelector, mappingValue) => xpath(mapSelector).text(mappingValue)
//     }
//   }),
//   elementMap: inputStore.ElementMap('//div', {
//     identifier: {
//       mappingObject: {
//         x: 'X',
//         y: 'Y'
//       },
//       func: (mapSelector, mappingValue) => xpath(mapSelector).text(mappingValue)
//     }
//   }),
//   elementGroup: inputStore.ElementGroup({
//     input: new Input('//input'),
//     element: inputStore.Element('//div'),
//     inputList: inputStore.InputList('//input'),
//     elementList: inputStore.ElementList('//div'),
//     inputMap: inputStore.InputMap('//input', {
//       identifier: {
//         mappingObject: {
//           x: 'X',
//           y: 'Y'
//         },
//         func: (mapSelector, mappingValue) => xpath(mapSelector).text(mappingValue)
//       }
//     }),
//     elementMap: inputStore.ElementMap('//div', {
//       identifier: {
//         mappingObject: {
//           x: 'X',
//           y: 'Y'
//         },
//         func: (mapSelector, mappingValue) => xpath(mapSelector).text(mappingValue)
//       }
//     })
//   }),
//   inputGroup: inputStore.ValueGroup({
//     input: new Input('//input'),
//     element: inputStore.Element('//div'),
//     inputList: inputStore.InputList('//input'),
//     elementList: inputStore.ElementList('//div'),
//     inputMap: inputStore.InputMap('//input', {
//       identifier: {
//         mappingObject: {
//           x: 'X',
//           y: 'Y'
//         },
//         func: (mapSelector, mappingValue) => xpath(mapSelector).text(mappingValue)
//       }
//     }),
//     elementMap: inputStore.ElementMap('//div', {
//       identifier: {
//         mappingObject: {
//           x: 'X',
//           y: 'Y'
//         },
//         func: (mapSelector, mappingValue) => xpath(mapSelector).text(mappingValue)
//       }
//     })
//   })
// })
// const res = innerGroup.getValue({
// })
// innerGroup.currently.getValue({
// })
// const jodel: Exclude<typeof res, never> = {
// }
// const jodel2: typeof res = {
// }
// const input = innerGroup.$.input
// const inputList = innerGroup.$.inputList
// const mask: Workflo.PageNode.ValueGroupFilterMaskWN<typeof innerGroup.$> = {
//   input: false,
//   inputList: false,
//   inputMap: {
//     x: true,
//     y: false
//   },
//   inputGroup: {
//     input: true,
//     inputList: [true, false],
//     inputMap: {
//       x: true,
//       y: false
//     }
//   }
// }
// const mask2: Workflo.PageNode.ExtractValueBooleanWN<typeof innerGroup.$> = {
//   inputGroup: {
//   }
// }
// class MyStore extends PageElementStore {
//   Element(
//     selector: Workflo.XPath,
//     options?: Pick<IMyElementOpts<this>, Workflo.Store.ElementPublicKeys | "testProp">
//   ) {
//     return this._getElement<MyElement<this>, IMyElementOpts<this>>(
//       selector,
//       MyElement,
//       {
//         store: this,
//         ...options
//       }
//     )
//   }
//   Input(
//     selector: Workflo.XPath,
//     options?: Pick<IMyInputOpts<this>, Workflo.Store.ElementPublicKeys | "testInputProp">
//   ) {
//     return this._getElement<MyInput<this>, IMyInputOpts<this>>(
//       selector,
//       MyInput,
//       {
//         store: this,
//         ...options
//       }
//     )
//   }
// }
// interface IMyElementOpts<Store extends MyStore> extends IPageElementOpts<Store> {
//   testProp: string
// }
// // constructor args structure must remain intact -> 1st arg selector, 2nd arg object with arbitrary structure
// // that extends baseclass opts structure
// class MyElement<Store extends MyStore> extends PageElement<Store> {
//   constructor(selector: string, opts: IMyElementOpts<Store>) {
//     super(selector, opts)
//     this.testProp = opts.testProp
//   }
//   testProp: string
// }
// interface IMyInputOpts<Store extends PageElementStore> extends pageObjects.elements.IValuePageElementOpts<Store> {
//   testInputProp: string
// }
// class MyInput<
//   Store extends MyStore,
// > extends pageObjects.elements.ValuePageElement<
//   Store, string
// > implements MyElement<Store> {
//   currently: MyInputCurrently<Store, this>;
//   testInputProp: string
//   testProp: string
//   constructor(selector: string, opts?: IMyInputOpts<Store>) {
//     super(selector, opts)
//     this.testInputProp = opts.testInputProp
//     this.currently = new MyInputCurrently(this)
//   }
//   setValue(value: string) {
//     this.element.setValue(value)
//     return this
//   }
// }
// class MyInputCurrently<
//   Store extends MyStore,
//   PageElementType extends MyInput<Store>
// > extends pageObjects.elements.ValuePageElementCurrently<Store, PageElementType, string> {
//   getValue(): string {
//     return this.element.getValue()
//   }
// }
// applyMixins(MyInput, [MyElement]);
// function applyMixins(derivedCtor: any, baseCtors: any[]) {
//   baseCtors.forEach(baseCtor => {
//       Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
//           derivedCtor.prototype[name] = baseCtor.prototype[name];
//       });
//   });
// }
// const myStore = new MyStore()
// const element = myStore.Element('//asdf')
// const input = myStore.Input('//asdf')
// element.testProp = 'asdf';
// input.testInputProp = 'asdf';
// input.testProp = 'asdf';
//# sourceMappingURL=PageElementStore.js.map