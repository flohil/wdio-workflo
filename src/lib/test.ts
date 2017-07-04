import { getAllMethods } from './objectExtensions'

interface IPageElement {
    selector: string
}

class PageElement implements IPageElement {
    private _selector: string
    private _waitTime: number

    constructor(selector: string) {
        this._selector = selector
    }

    setWaitTime = (waitTime: number) => {
        this._waitTime = waitTime

        return this
    }

    wait = () => {
        console.log("wait")
    }

    get selector() {
        return this._selector
    }

    getSelector = () => {
        return this._selector
    }
}

class InputElement extends PageElement {
    public set(value: string) {
        console.log("set: ", value)
    }
}

class MyInputElement extends InputElement {
    public set(value: string) {
        console.log("other set: ", value)
    }
}

class PageElementStore {
    private cache = {}

    Element = <T extends PageElement>(
        selector: string, 
        options: { 
            type?: { new(selector: string): T }
        } = {}
    ) => this.get(selector, options.type || PageElement) as T & this

    protected get = <O, T>(selector: string, options: O, type: ElOptions<O, T>) => {

        console.log(options)

        if(!(selector in this.cache)) {

            const result = new type(selector)

            for ( const method of getAllMethods(this) ) {
                if ( method.indexOf('_') !== 0 && /^[A-Z]/.test( method ) ) {
                    result[ method ] = ( _selector, _options ) => {
                        _selector = `${selector}${_selector}`

                        return this[ method ].apply( this, [ _selector, _options ] ) 
                    }
                }
            }

            this.cache[selector] = result
        }

        return this.cache[selector]
    }
}

type ElOptions<O, R> = {
    type?: { new(selector: string, options: O): R }
}

class InputElementStore extends PageElementStore {

    InputElement = <T extends InputElement>(
        selector: string, 
        options: {waitTime: number} & ElOptions<{waitTime: number}, T> = {waitTime: 5}
    ) => this.get(selector, options.type || InputElement) as T & this
}

class TestPage {

    private store: PageElementStore

    constructor() {
        this.store = new PageElementStore()
    }

    get myContainer() {
        return this.store.Element("//div")
    }

    get myButton() {
        return this.store.Element("//button")
    }
}

class TestPageB {
    private store: InputElementStore

    constructor() {
        this.store = new InputElementStore()
    }

    get myInput() {
        return this.store.InputElement("//input")
    }

    get otherInput() {
        return this.store.InputElement("//otherInput", {type: MyInputElement, waitTime: 3})
    }

    get myElement() {
        return this.store.Element("//div")
    }
}

const page: TestPage = new TestPage()
const pageB: TestPageB = new TestPageB()

console.log(pageB.myInput)

pageB.myInput.set("asdf")
pageB.otherInput.set("other")

/*pageB.myInput.Element
pageB.myElement.InputElement("//input").set("hello")*/

console.log(page.myContainer.Element("//span").Element("//button"))

// import { getAllMethods } from './objectExtensions'

// interface IPageElement {
//     selector: string
// }

// class PageElement implements IPageElement {
//     private _selector: string
//     private _waitTime: number

//     constructor(selector: string) {
//         this._selector = selector
//     }

//     static createInstance = (selector: string) : PageElement => {
//         return new PageElement(selector)
//     }

//     setWaitTime = (waitTime: number) => {
//         this._waitTime = waitTime

//         return this
//     }

//     wait = () => {
//         console.log("wait")
//     }

//     get selector() {
//         return this._selector
//     }

//     getSelector = () => {
//         return this._selector
//     }
// }

// class InputElement extends PageElement {

//     static createInstance = (selector: string) : InputElement => {
//         return new InputElement(selector)
//     }

//     public set(value: string) {
//         console.log("set: ", value)
//     }
// }

// class PageElementStore {
//     private cache = {}

//     Element = <T extends PageElement>(selector: string, createFunc?: (...args) => T) => this.get(selector, createFunc || PageElement.createInstance) as PageElement & this

//     protected get = <T>(selector: string, createFunc: (...args) => T) => {

//         console.log("selector: ", selector)
//         console.log("createFunc: ", createFunc)


//         if(!(selector in this.cache)) {

//             console.log("createFunc: ", createFunc)

//             const result = createFunc(selector)

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

// class InputElementStore extends PageElementStore {

//     InputElement = <T>(selector: string, createFunc?: (...args) => T) => this.get(selector, InputElement.createInstance) as InputElement & this
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

//     get myElement() {
//         return this.store.Element("//div")
//     }
// }

// const page: TestPage = new TestPage()
// const pageB: TestPageB = new TestPageB()

// console.log(pageB.myInput)

// pageB.myInput.set("asdf")
// /*pageB.myInput.Element
// pageB.myElement.InputElement("//input").set("hello")*/

// console.log(page.myContainer.Element("//span").Element("//button"))
