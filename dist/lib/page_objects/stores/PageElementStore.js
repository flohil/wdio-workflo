"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const page_elements_1 = require("../page_elements");
const builders_1 = require("../builders");
const ValuePageElementMap_1 = require("../page_elements/ValuePageElementMap");
/**
 * PageElementStore serves as a facade for the creation and retrieval of Page Nodes.
 * Basically, Page Nodes should only be created or retrieved via PageElementStores and never by "manually" invoking
 * their constructor functions.
 *
 * PageElementStore caches instances of Page Nodes with the same type and selector to avoid creating new Page Nodes on each
 * invocation of a retrieval function.
 *
 * Furthermore, PageElementStore allows you to define default opts parameters and provide pre-configured variants of
 * PageNodes (eg. Element and ExistElement).
 */
class PageElementStore {
    constructor() {
        this._instanceCache = Object.create(null);
        this._xPathBuilder = builders_1.XPathBuilder.getInstance();
    }
    // ELEMENTS
    /**
     * Retrieves an instance of a PageElement from the store.
     *
     * The waitType of the PageElement is set to 'visible' by default.
     *
     * @param selector the XPath selector of the retrieved PageElement
     * @param opts the publicly available options used to configure the retrieved PageElement
     * @returns an instance of the retrieved PageElement
     */
    Element(selector, opts) {
        return this._getElement(selector, page_elements_1.PageElement, Object.assign({ store: this }, opts));
    }
    /**
     * Retrieves an instance of a PageElement from the store.
     *
     * The waitType of the retrieved PageElement is set to 'exist' and cannot be overwritten.
     *
     * @param selector the XPath selector of the retrieved PageElement
     * @param opts the publicly available options used to configure the retrieved PageElement
     * @returns an instance of the retrieved PageElement
     */
    ExistElement(selector, opts) {
        return this.Element(selector, Object.assign({ waitType: "exist" /* exist */ }, opts));
    }
    // LISTS
    /**
     * Retrieves an instance of a PageElementList from the store that manages any instance of PageElement which inherits
     * from the PageElement class.
     *
     * The waitType of PageElements managed by PageElementList and the waitType of the list itself are set to 'visible' by
     * default.
     *
     * @template PageElementType the type of PageElement managed by PageElementList
     * @template PageElementOpts the type of the opts parameter passed to the constructor function of PageElements managed
     * by PageElementList
     * @param selector the XPath selector of the retrieved PageElementList
     * @param opts the publicly available options used to configure the retrieved PageElementList
     * @returns an instance of the retrieved PageElementList
     */
    List(selector, opts) {
        return this._getList(selector, page_elements_1.PageElementList, Object.assign({ store: this }, opts));
    }
    /**
     * Retrieves an instance of a ValuePageElementList from the store that manages any instance of ValuePageElement which
     * inherits from the ValuePageElement class.
     *
     * The waitType of PageElements managed by ValuePageElementList and the waitType of the list itself are set to
     * 'visible' by default.
     *
     * @template PageElementType the type of ValuePageElement managed by ValuePageElementList
     * @template PageElementOpts the type of the opts parameter passed to the constructor function of ValuePageElements
     * managed by ValuePageElementList
     * @param selector the XPath selector of the retrieved ValuePageElementList
     * @param opts the publicly available options used to configure the retrieved ValuePageElementList
     * @returns an instance of the retrieved ValuePageElementList
     */
    ValueList(selector, opts) {
        return this._getList(selector, page_elements_1.ValuePageElementList, Object.assign({ store: this }, opts));
    }
    /**
     * Retrieves an instance of a PageElementList from the store that manages PageElement instances of the type
     * PageElement.
     *
     * The waitType of the PageElements managed by PageElementList and the waitType of the list itself are set to
     * 'visible' by default.
     *
     * @param selector the XPath selector of the retrieved PageElementList
     * @param opts the publicly available options used to configure the retrieved PageElementList
     * @returns an instance of the retrieved PageElementList
     */
    ElementList(selector, opts) {
        return this.List(selector, Object.assign({ elementOpts: {}, elementStoreFunc: this.Element }, opts));
    }
    /**
     * Retrieves an instance of a PageElementList from the store that manages PageElement instances of the type
     * PageElement.
     *
     * The waitType of the PageElements managed by PageElementList and the waitType of the list itself are set to 'exist'
     * by default.
     *
     * @param selector the XPath selector of the retrieved PageElementList
     * @param opts the publicly available options used to configure the retrieved PageElementList
     * @returns an instance of the retrieved PageElementList
     */
    ExistElementList(selector, opts) {
        return this.List(selector, Object.assign({ elementOpts: {}, elementStoreFunc: this.ExistElement, waitType: "exist" /* exist */ }, opts));
    }
    // MAPS
    /**
     * Retrieves an instance of a PageElementMap from the store that manages any instance of PageElement which inherits
     * from the PageElement class.
     *
     * The waitType of PageElements managed by PageElementMap is set to 'visible' by default.
     *
     * @template K the names of all PageElements managed by PageElementMap
     * @template PageElementType the type of PageElement managed by PageElementMap
     * @template PageElementOpts the type of the opts parameter passed to the constructor function of PageElements managed
     * by PageElementMap
     * @param selector the XPath selector of the retrieved PageElementMap
     * @param opts the publicly available options used to configure the retrieved PageElementMap
     * @returns an instance of the retrieved PageElementMap
     */
    Map(selector, opts) {
        return this._getMap(selector, page_elements_1.PageElementMap, Object.assign({ store: this, elementStoreFunc: opts.elementStoreFunc }, opts));
    }
    /**
     * Retrieves an instance of a ValuePageElementMap from the store that manages any instance of ValuePageElement which
     * inherits from the ValuePageElement class.
     *
     * The waitType of ValuePageElements managed by ValuePageElementMap is set to 'visible' by default.
     *
     * @template K the names of all ValuePageElements managed by ValuePageElementMap
     * @template PageElementType the type of ValuePageElement managed by ValuePageElementMap
     * @template PageElementOpts the type of the opts parameter passed to the constructor function of ValuePageElements
     * managed by ValuePageElementMap
     * @param selector the XPath selector of the retrieved ValuePageElementMap
     * @param opts the publicly available options used to configure the retrieved ValuePageElementMap
     * @returns an instance of the retrieved ValuePageElementMap
     */
    ValueMap(selector, opts) {
        return this._getMap(selector, ValuePageElementMap_1.ValuePageElementMap, Object.assign({ store: this, elementStoreFunc: opts.elementStoreFunc }, opts));
    }
    /**
     * Retrieves an instance of a PageElementMap from the store that manages PageElement instances of the type
     * PageElement.
     *
     * The waitType of PageElements managed by PageElementMap is set to 'visible' by default.
     *
     * @template K the names of all PageElements managed by PageElementMap
     * @param selector the XPath selector of the retrieved PageElementMap
     * @param opts the publicly available options used to configure the retrieved PageElementMap
     * @returns an instance of the retrieved PageElementMap
     */
    ElementMap(selector, opts) {
        return this.Map(selector, Object.assign({ elementStoreFunc: this.Element, elementOpts: {} }, opts));
    }
    /**
     * Retrieves an instance of a PageElementMap from the store that manages PageElement instances of the type
     * PageElement.
     *
     * The waitType of PageElements managed by PageElementMap is set to 'exist' by default.
     *
     * @template K the names of all PageElements managed by PageElementMap
     * @param selector the XPath selector of the retrieved PageElementMap
     * @param opts the publicly available options used to configure the retrieved PageElementMap
     * @returns an instance of the retrieved PageElementMap
     */
    ExistElementMap(selector, opts) {
        return this.Map(selector, Object.assign({ elementStoreFunc: this.ExistElement, elementOpts: {} }, opts));
    }
    // GROUPS
    /**
     * Retrieves an instance of a PageElementGroup from the store.
     *
     * The group functions (state check -> hasXXX/hasAnyXXX/containsXXX, state retrieval -> getXXX) supported by the
     * retrieved PageElementGroup are defined in Workflo.IElementNode.
     *
     * @param content an object whose keys are the names of PageNodes managed by the PageElementGroup and whose values
     * are instances of these PageNodes
     * @param opts the publicly available options used to configure the retrieved PageElementGroup
     * @returns an instance of the retrieved PageElementGroup
     */
    ElementGroup(content, opts) {
        return this._getGroup(page_elements_1.PageElementGroup, Object.assign({ store: this, content: content }, opts));
    }
    /**
     * Retrieves an instance of a ValuePageElementGroup from the store.
     *
     * The group functions (state check -> hasXXX/hasAnyXXX/containsXXX, state retrieval -> getXXX) supported by the
     * retrieved ValuePageElementGroup are defined in Workflo.IValueElementNode.
     *
     * @param content an object whose keys are the names of PageNodes managed by the ValuePageElementGroup and whose values
     * are instances of these PageNodes
     * @param opts the publicly available options used to configure the retrieved ValuePageElementGroup
     * @returns an instance of the retrieved PageElementGroup
     */
    ValueGroup(content, opts) {
        return this._getGroup(page_elements_1.ValuePageElementGroup, Object.assign({ store: this, content: content }, opts));
    }
    // Functions to retrieve PageNode instances
    /**
     * Creates or retrieves a cached version of a PageNode instance with the given selector, type and opts.
     *
     * If a page element with identical parameters already exists in this store,
     * a cached instance of this page element will be returned.
     *
     * @template Type type of the retrieved PageElement instance
     * @template Opts type of the opts parameter passed to the constructor of the retrieved PageNode instance
     * @param selector the selector of the retrieved PageNode
     * @param type the constructor function of the retrieved PageNode instance
     * @param opts the opts parameter passed to the constructor of the retrieved PageNode instance
     */
    _get(selector, type, opts = Object.create(Object.prototype), afterConstruction) {
        const _selector = (selector instanceof builders_1.XPathBuilder) ? this._xPathBuilder.build() : selector;
        // catch: selector must not contain |
        if (_selector.indexOf('|||') > -1) {
            throw new Error(`Selector must not contain character sequence '|||': ${_selector}`);
        }
        const id = `${_selector}|||${type}|||${opts.toString()}`;
        if (!(id in this._instanceCache)) {
            const result = new type(_selector, opts);
            if (typeof afterConstruction !== 'undefined') {
                afterConstruction(result);
            }
            this._instanceCache[id] = result;
        }
        return this._instanceCache[id];
    }
    /**
     * Creates or retrieves a cached version of a PageElement instance.
     *
     * @template ElementType type of the retrieved PageElement instance
     * @template ElementOpts type of the opts parameter passed to the constructor of the retrieved PageElement instance
     * @param selector the XPath selector of the retrieved PageElement instance
     * @param type the constructor function of the retrieved PageElement instance
     * @param opts the opts parameter passed to the constructor of the retrieved PageElement instance
     */
    _getElement(selector, type, opts = Object.create(Object.prototype)) {
        return this._get(selector, type, opts);
    }
    /**
     * Creates or retrieves a cached version of a PageElementList instance.
     *
     * @template ListType type of the retrieved PageElementList instance
     * @template ListOptions type of the opts parameter passed to the constructor of the retrieved PageElementList instance
     * @param selector the XPath selector of the retrieved PageElementList instance
     * @param type the constructor function of the retrieved PageElementList instance
     * @param opts the opts parameter passed to the constructor of the retrieved PageElementList instance
     */
    _getList(selector, type, opts = Object.create(Object.prototype)) {
        return this._get(selector, type, opts, instance => {
            const cloneFunc = cloneSelector => {
                if (!cloneSelector) {
                    cloneSelector = selector;
                }
                return this._getList(cloneSelector, type, opts);
            };
            instance.init(cloneFunc);
        });
    }
    /**
     * Creates or retrieves a cached version of a PageElementMap instance.
     *
     * @template MapType type of the retrieved PageElementMap instance
     * @template MapOptions type of the opts parameter passed to the constructor of the retrieved PageElementMap instance
     * @param selector the XPath selector of the retrieved PageElementMap instance
     * @param type the constructor function of the retrieved PageElementMap instance
     * @param opts the opts parameter passed to the constructor of the retrieved PageElementMap instance
     */
    _getMap(selector, type, opts = Object.create(Object.prototype)) {
        return this._get(selector, type, opts);
    }
    /**
     * Creates or retrieves a cached version of a PageElementGroup instance.
     *
     * @template Store type of the PageElementGroup's PageElementStore
     * @template GroupType type of the retrieved PageElementGroup instance
     * @template GroupOptions type of the opts parameter passed to the constructor of the retrieved PageElementGroup
     * instance
     * @param type the constructor function of the retrieved PageElementGroup instance
     * @param opts the opts parameter passed to the constructor of the retrieved PageElementGroup instance
     */
    _getGroup(type, opts) {
        // Build id from group's elements' ids.
        // If two groups have the same content,
        // they are the same.
        let idStr = '';
        for (const key in opts.content) {
            if (opts.content.hasOwnProperty(key)) {
                idStr += `${opts.content[key].__getNodeId()};`;
            }
        }
        const key = `${type.name}:${idStr}`;
        if (!(key in this._instanceCache)) {
            this._instanceCache[key] = new type(idStr, opts);
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
//     opts?: Pick<IInputOpts<this>, Workflo.Store.ElementPublicKeys>
//   ) {
//     return this._getElement<Input<this>, IInputOpts<this>>(
//       selector,
//       Input,
//       {
//         store: this,
//         ...opts
//       }
//     )
//   }
//   InputList(
//     selector: Workflo.XPath,
//     opts?: Workflo.PickPartial<
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
//         ...opts
//       }
//     )
//   }
//   InputMap<K extends string>(
//     selector: Workflo.XPath,
//     opts: Workflo.PickPartial<
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
//         ...opts
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
//     opts?: Pick<IMyElementOpts<this>, Workflo.Store.ElementPublicKeys | "testProp">
//   ) {
//     return this._getElement<MyElement<this>, IMyElementOpts<this>>(
//       selector,
//       MyElement,
//       {
//         store: this,
//         ...opts
//       }
//     )
//   }
//   Input(
//     selector: Workflo.XPath,
//     opts?: Pick<IMyInputOpts<this>, Workflo.Store.ElementPublicKeys | "testInputProp">
//   ) {
//     return this._getElement<MyInput<this>, IMyInputOpts<this>>(
//       selector,
//       MyInput,
//       {
//         store: this,
//         ...opts
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
// expectElement(input).toHaveValue('asdf')
//# sourceMappingURL=PageElementStore.js.map