// import { getAllMethods } from './utilityFunctions/class'
// interface IPageElement {
//     selector: string
// }
// class PageElement implements IPageElement {
//     private _selector: string
//     private _name: string
//     private _waitTime: number
//     constructor(selector: string, options: {name: string}) {
//         this._selector = selector
//         this._name = options.name
//     }
//     wait = () => {
//         console.log("wait")
//     }
//     get selector() {
//         return this._selector
//     }
//     get name() {
//         return this._name
//     }
// }
// class InputElement extends PageElement {
//     public set(value: string) {
//         console.log("set: ", value)
//     }
// }
// class MyInputElement extends InputElement {
//     public set(value: string) {
//         console.log("other set: ", value)
//     }
// }
// class PageElementStore {
//     private cache = {}
//     Element = <T extends PageElement, O>(
//         selector: string, 
//         options: {
//             type?: { new(selector: string, options: {}): T }
//         } = {}
//     ) => this.get(selector, options.type || PageElement, {name: "asdf"}) as T & this
//     protected get = <O, T>(selector: string, type: { new(selector: string, options: O): T }, options: O) => {
//         console.log("options: ", options)
//         if(!(selector in this.cache)) {
//             const result = new type(selector, options)
//             for ( const method of getAllMethods(this) ) {
//                 if ( method.indexOf('_') !== 0 && /^[A-Z]/.test( method ) ) {
//                     result[ method ] = ( _selector, _options ) => {
//                         _selector = `${selector}${_selector}`
//                         return this[ method ].apply( this, [ _selector, _options ] ) 
//                     }
//                 }
//             }
//             this.cache[selector] = result
//         }
//         return this.cache[selector]
//     }
// }
// type ElOptions<O, R> = {
//     type?: { new(selector: string, options: O): R }
// }
// class InputElementStore extends PageElementStore {
//     Element = <T extends PageElement, O>(
//         selector: string, 
//         options: {
//             name: string,
//             type?: { new(selector: string, options: {name: string}): T }
//         } = {name: "asdf"}
//     ) => this.get(selector, options.type || PageElement, options) as T & this
//     InputElement = <T extends InputElement, O>(
//         selector: string,
//         options: {
//             waitTime: number,
//             type?: { new(selector: string, options: {waitTime: number}): T }
//         } = {waitTime: 5}
//     ) => this.get(selector, options.type || InputElement, options) as T & this
// }
// class TestPage {
//     private store: PageElementStore
//     constructor() {
//         this.store = new PageElementStore()
//     }
//     get myContainer() {
//         return this.store.Element("//div")
//     }
//     get myButton() {
//         return this.store.Element("//button")
//     }
// }
// class TestPageB {
//     private store: InputElementStore
//     constructor() {
//         this.store = new InputElementStore()
//     }
//     get myInput() {
//         return this.store.InputElement("//input")
//     }
//     get otherInput() {
//         return this.store.InputElement("//otherInput", {type: MyInputElement, waitTime: 3})
//     }
//     get myElement() {
//         return this.store.Element("//div")
//     }
// }
// const page: TestPage = new TestPage()
// const pageB: TestPageB = new TestPageB()
// console.log(pageB.myInput)
// console.log(pageB.myElement)
// pageB.myInput.set("asdf")
// pageB.otherInput.set("other")
// console.log(page.myContainer.Element("//span").Element("//button")) 
//# sourceMappingURL=testElementsAndStores.js.map