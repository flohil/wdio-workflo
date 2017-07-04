/**
 * Returns names of all methods of a ES6 class (except for constructor)
 * see http://stackoverflow.com/questions/31054910/get-functions-methods-of-a-class
 * 
 * @param obj 
 */
export function getAllMethods( obj: any ) : string[] {
    let props: string[] = []

    do {
        const l = Object.getOwnPropertyNames(obj)
            .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
            .sort()
            .filter((p, i, arr) =>
                typeof obj[p] === 'function' &&  //only the methods
                p !== 'constructor' &&           //not the constructor
                (i == 0 || p !== arr[i - 1]) &&  //not overriding in this prototype
                props.indexOf(p) === -1          //not overridden in a child
            )
        props = props.concat(l)
    }
    while (
        (obj = Object.getPrototypeOf(obj)) &&   //walk-up the prototype chain
        Object.getPrototypeOf(obj)              //not the the Object prototype methods (hasOwnProperty, etc...)
    )

    return props
}