import * as _ from 'lodash'

/**
 * Gets an input array and maps it to an object where
 * the property keys correspond to the array elements
 * and the property values are defiend by mapFunc.
 * 
 * @param input 
 * @param mapFunc 
 */
export function mapToObject<T>(input: string[] | number[], mapFunc: (element: string | number) => T) : {[key: string] : T} {
  const obj = {}

  for (const element of input) {
    obj[element] = mapFunc(element)
  }

  return obj
}

/**
 * Converts arrays into objects.
 * valueFunc will be used to determine the object's 
 * property values and can be either a func or a value.
 * valueFunc gets passed the array element or string as
 * value.
 * If switchKeyValue is true, the keys and values of the
 * resulting object will be switched.
 * If stackValues is true, a value for an existing key
 * will not be replaced by a new value but added to an
 * array of values for the concerned key.
 * 
 * Output is an object where each key
 * represents one element in the array.
 * 
 * @param arr 
 * @param valueFunc 
 * @param options 
 */
export function convertToObject<T>(
  arr: any[],
  valueFunc = undefined,
  options = { switchKeyValue: false, overwriteValues: false, stackValues: any }) : Object {
  let obj: Object = undefined

  if (typeof arr !== 'undefined') {
    obj = {}
    for (const element of arr) {
      let value: any

      if (typeof valueFunc === 'function') {
        value = valueFunc(element)
      } else {
        value = valueFunc
      }

      const propKey = (options.switchKeyValue) ?
        value :
        element
      const propValue = (options.switchKeyValue) ?
        element :
        value

      // if object already has a key, make value array
      // instead of overwriting existing value
      if (propKey in obj && options.stackValues) {
        const valueArray = []

        valueArray.push(obj[propKey])
        valueArray.push(propValue)

        obj[propKey] = valueArray
      } else {
        obj[propKey] = propValue
      }
    }
  }

  return obj
}