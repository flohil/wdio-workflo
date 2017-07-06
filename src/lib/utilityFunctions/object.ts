import * as _ from 'lodash'

/**
 * Iterates over all properties in an object and executes
 * func on each.
 * 
 * Returns a new object with the same keys as the input
 * object and the values as result of the func.
 * 
 * @param input 
 * @param func 
 */
export function mapProperties(input: Object, func: (value: any, key: string) => Object) {
  if (_.isArray(input)) {
    throw new Error(`Input must be an object: ${input}`)
  } else {
    const resultObj = {}

    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        resultObj[key] = func(input[key], key)
      }
    }

    return resultObj
  }
}

/**
 * Iterates over all properties in an object and executes func on each.
 * @param input 
 * @param func 
 */
export function forEachProperty(input: Object, func: (key: string, value: any) => void) {
  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      func(key, input[key])
    }
  }
}

// inverts an object's keys and values.

/**
 * Returns a new object with the original object's keys and values inverted.
 * 
 * @param obj 
 */
export function invert(obj: Object) : Object {
  const new_obj = {}

  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      new_obj[obj[prop]] = prop
    }
  }

  return new_obj
}

/**
 * Returns a filtered object that only contains those
 * properties of the initial object where func returned true.
 * 
 * @param obj 
 * @param func 
 */
export function filter(obj: Object, func: (value: any, key: string) => boolean) {
  const resultObj = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (func(obj[key], key)) {
        resultObj[key] = obj[key]
      }
    }
  }

  return resultObj
}

/**
 * If key already exists in obj, turns respective value
 * into array and pushes value onto the array.
 * Else, adds "normal" key-value pair as property.
 * If overwrite is true, always overwrites existing value
 * with new value without turning into array.
 *
 * @param obj 
 * @param key 
 * @param value 
 * @param overwrite 
 */
export function addToProps(obj: Object, key: string, value: any, overwrite: boolean = false): void {
  if (obj[key] && !overwrite) {
    if (!(_.isArray(obj[key]))) {
      obj[key] = [obj[key]]
    }
    obj[key].push(value)
  } else {
    obj[key] = value
  }
}

/**
 * Creates a copy of original object in which all
 * key-value pairs matching the passed props are removed.
 * 
 * @param obj 
 * @param props 
 */
export function stripProps(obj: Object, props: string[]) {
  const resObj: Object = _.cloneDeep(obj)

  for (const prop of props) {
    delete resObj[prop]
  }

  return resObj
}

/**
 * Creates a copy of original object in which all
 * properties with negative values are removed recursively.
 * 
 * @param obj 
 */
export function stripNegatives(obj: Object): Object {
  const resObj: Object = _.cloneDeep(obj)
  return stripNegativesRec(resObj)
}

export function stripNegativesRec(obj: any): any {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === 'object') {
        stripNegativesRec(obj[prop])
      } else {
        if (obj[prop] === false) {
          delete obj[prop]
        }
      }
    }
  }
  return obj
}

/**
 * Returns properties of obj whose keys are also present in 
 * subsetObj as a new object.
 * 
 * @param obj 
 * @param matchingObject 
 */
export function subset(obj: Object, matchingObject: Object): Object {
  const subset = {}

  for (const key in matchingObject) {
    if (key in obj) {
      subset[key] = obj[key]
    }
  }

  return subset
}