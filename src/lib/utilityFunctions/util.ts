import * as _ from 'lodash'
import { invert } from './object'

/**
 * Converts strings, arrays and objects into objects.
 * 
 * If input is string, output is an object with one 
 * entry where the key is the string.
 * If input is array, output is an object where each key
 * represents one element in the array.
 * If input is object, output is a clone of the input object.
 *
 * For strings and arrays, valueFunc is used to calculate the
 * resulting object's property values.
 * For objects, valueFunc has no effect -> original property values will be preserved!
 * 
 * @param unknownTypedInput 
 * @param valueFunc 
 */
export function convertToObject<T>( 
  unknownTypedInput: {[key: string] : T} | string[] | string, 
  valueFunc: (key: string) => T = undefined,
) : {[key: string] : T}
{
  let obj: {[key: string] : T} = {}

  if ( typeof unknownTypedInput !== 'undefined' ) {
    if ( typeof unknownTypedInput === 'string' ) {
      unknownTypedInput = [ unknownTypedInput ]
    }

    if ( _.isArray( unknownTypedInput ) ) {
      for ( const element of unknownTypedInput ) {
        let value: T

        if (typeof valueFunc !== 'undefined') {
          value = valueFunc( element )
        } else {
          value = undefined
        }
        
        obj[ element ] = value
      }
    } else {
      obj = _.cloneDeep(unknownTypedInput)
    }
  }

  return obj
}

