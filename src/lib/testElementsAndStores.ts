// import { getAllMethods } from './utilityFunctions/class'
// import * as _ from 'lodash'

// interface IPageElement {
//     selector: string
// }

// class PageElement implements IPageElement {
//     protected _selector: string
//     protected _name: string
//     protected _waitTime: number

//     constructor(selector: string, options: {name?: string}) {
//         options = _.merge({name: 'PageElement'}, options)

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
//     protected _waitTime: number

//     constructor(selector: string, options: {name?: string, waitTime?: number}) {
//         options = _.merge({
//             name: 'InputElement',
//             waitTime: 400
//         }, options)

//         super(selector, options);

//         this._waitTime = options.waitTime
//     }

//     public set(value: string) {
//         console.log("set: ", value)
//     }

//     get waitTime() {
//         return this._waitTime
//     }
// }

// class MyInputElement extends InputElement {
//     public set(value: string) {
//         console.log("other set: ", value)
//     }
// }

// class MyElement extends PageElement {

// }

// class PageElementStore {
//     private cache = {}

//     Element = <T extends PageElement, O>(
//         selector: string,
//         options: {
//             name?: string,
//             type?: { new(selector: string, options: {name: string}): T }
//         } = {}
//     // merging default args
//     ) => this.get(selector, options.type || PageElement, _.merge({name: 'alex'}, options)) as T & this

//     protected get = <O, T>(selector: string, type: { new(selector: string, options: O): T }, options: O) => {        
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
//             name?: string,
//             type?: { new(selector: string, options: {name: string}): T }
//         } = {}
//     ) => this.get(selector, options.type || PageElement, _.merge({name: "hollers"}, options)) as T & this


//     InputElement = <T extends InputElement, O>(
//         selector: string,
//         options: {
//             name?: string,
//             waitTime?: number,
//             type?: { new(selector: string, options: {waitTime: number, name: string}): T }
//         } = {waitTime: 5}
//     ) => this.get(selector, options.type || InputElement, _.merge(options, {name: "input"})) as T & this
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
//         return this.store.Element("//button", {type: MyElement, name: "meine"})
//     }
// }

// class TestPageB {
//     private store: InputElementStore

//     constructor() {
//         this.store = new InputElementStore()
//     }

//     get myInput() {
//         return this.store.InputElement("//input", {name: 'input2', waitTime: 61})
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

// pageB.myInput.set("asdf")
// pageB.otherInput.set("other")


// console.log(page.myContainer.name)
// console.log(page.myButton.name)
// console.log(pageB.myElement.name)
// console.log(pageB.myInput.name)
// console.log(pageB.myInput.waitTime)

// export function addToProp<T>(obj: {[key: string] : T | T[]}, key: string, value: T, overwrite: boolean = false): void {
//   if (obj[key] && !overwrite) {
//     let valueArr: T[] = []
//     valueArr = valueArr.concat(obj[key])
//     valueArr.push(value)

//     obj[key] = valueArr
//   } else {
//     obj[key] = value
//   }
// }

// const obj = {
//   names: 'hansi'
// }

// addToProp(obj, 'names', 'josef')
// addToProp(obj, 'names', 'simone')

// console.log(obj)

// class GetTextClass implements INodeGetText {
//     constructor(protected text: string) {}
//     getText() {
//         return this.text
//     }
// }

// interface INodeGetText {
//     getText() : string
// }

// interface IContext<I> {
//     [key: string] : I
// }

// const context = {
//     hansi: new GetTextClass("hansi text"),
//     donald: new GetTextClass("donald text")
// }

// const mask = {
//     anna: false
// }

// const myObj = {
//     anna: true,
//     peter: true
// }

// let bla: typeof myObj

// import { subset } from './utilityFunctions/object'


// const hello = subset(myObj, mask)

// console.log(hello)

// const optArgs: IOptStepArgs<{}, void> = {
//     cb: () => {}
// }

// const args: IStepArgs<{}, void> = {
//     arg: {var1: "string"}
// }

// import { ParameterizedStep } from './steps'

// const test = new ParameterizedStep(_.merge({arg: {}},optArgs), () => {

// })

////////////////////////////////////////////////////////////////////////

import { mergeStepDefaults, ParameterizedStep, stepsGetter, stepsSetter } from './steps'

const Steps = {
  "open container base dialog in content administration": (params: IStepArgs< {}, void> ): IParameterizedStep =>
    new ParameterizedStep(params, () : void => {
    }),

  "fill data in container settings dialog in content administration": (params?: IStepArgs< { formValues: { [key: string]:any } }, void> ): IParameterizedStep =>
    new ParameterizedStep(mergeStepDefaults({formValues: {var1: 1}}, params ), ({formValues}) : void => {
    }),

  "create new container in content administration": (params: IStepArgs< {}, void> ): IParameterizedStep =>
    new ParameterizedStep(params, () : void => {
    })
}

const steps = new Proxy(Steps, {
  get: (target, name, receiver) => stepsGetter(target, name, receiver),
  set: (target, name, value) => stepsSetter(target, name, value)
})

steps["fill data in container settings dialog in content administration"]()
