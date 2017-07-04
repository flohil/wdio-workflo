import { getAllMethods } from './objectExtensions'

// interface IPageElement {
//     selector: string
// }

// class PageElement implements IPageElement {
//     private _selector: string
//     private _waitTime: number

//     constructor(selector: string) {
//         this._selector = selector
//     }

//     setWaitTime = (waitTime: number) => {
//         this._waitTime = waitTime

//         return this
//     }

//     wait() {
//         console.log("wait")
//     }

//     get selector() {
//         return this._selector
//     }
// }

// class InputElement extends PageElement {
//     public set(value: string) {
//         console.log("set: ", value)
//     }
// }

// class PageElementStore {
//     private cache = {}

//     Element = <T extends PageElement>(selector: string, parent?: T) => this.get(selector, parent) as T

//     get = <T extends PageElement>(selector: string, parent?: T) => {
//         const parentSelector = (parent) ? parent.selector : ''
//         const combinedSelector = `(${parentSelector}${selector})`

//         if(!(combinedSelector in this.cache)) {
//             this.cache[combinedSelector] = new PageElement(combinedSelector)
//         }

//         return this.cache[combinedSelector]
//     }
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
//         return this.store.Element("//button", this.myContainer)
//         .setWaitTime(4000)
//     }
// }

// const page: TestPage = new TestPage()

// const joinedSelector = page.myButton.selector

// console.log(joinedSelector)


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

class PageElementStore {
    private cache = {}

    Element = <T extends PageElement>(selector: string, parent?: T) => this.get(selector, parent) as T & this

    get = <T extends PageElement>(selector: string, parent?: T) => {
        const parentSelector = (parent) ? parent.selector : ''
        const combinedSelector = `(${parentSelector}${selector})`

        if(!(combinedSelector in this.cache)) {

            //const result = Object.assign(this, new PageElement(combinedSelector))

            const result = new PageElement(combinedSelector)

            for ( const method of getAllMethods(this) ) {
                if ( method.indexOf('_') !== 0 && /^[A-Z]/.test( method ) ) {
                    result[ method ] = ( _selector, _options ) => {
                        _selector = `${selector}${_selector}`

                        return this[ method ].apply( this, [ _selector, _options ] ) 
                    }
                }
            }

            this.cache[combinedSelector] = result
        }

        return this.cache[combinedSelector]
    }
}

class InputElementStore extends PageElementStore {

    InputElement = <T extends InputElement>(selector: string, parent?: T) => super.get(selector, parent) as T & this
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
        return this.store.Element("//button", this.myContainer)
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

    get myElement() {
        return this.store.Element("//div")
    }
}

const page: TestPage = new TestPage()
const pageB: TestPageB = new TestPageB()

pageB.myInput.set("asdf")
pageB.myInput.Element
pageB.myElement.InputElement("//input").set("hello")

console.log(page.myContainer.Element("//span").Element("//button").selector)