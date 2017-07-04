import * as _ from 'lodash'
import { convertToObject as convertToObjectArr } from './array'

// Converts strings into objects.
// valueFunc will be used to determine the object's 
// property values and can be either a func or a value.
// valueFunc gets passed the array element or string as
// value.
// If switchKeyValue is true, the keys and values of the
// resulting object will be switched.
// If stackValues is true, a value for an exiting key
// will not be replaced by a new value but added to an
// array of values for the concerned key.
//
// Output is an object with one entry where the key is the string.
export function convertToObject( 
  input: string, 
  valueFunc = undefined, 
  options = { switchKeyValue: false, overwriteValues: false, stackValues: any } ) 
{
  let obj = undefined

  if ( typeof input !== 'undefined' ) {
    obj = convertToObjectArr([input], valueFunc, options)
  }

  return obj
}

// Splits a string at delim and returns an object with the
// split string parts as keys and the values set to true.
export function splitToObj( str: string, delim: string | RegExp ) : Object {
  if ( !( _.isString( str ) ) ) {
    throw new Error(`Input must be a string: ${str}`)
  } else {
    return convertToObjectArr(str.split( delim ), true) 
  }
}
