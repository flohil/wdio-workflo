import * as _ from 'lodash'
import { convertToObject } from './util'

/**
 * Splits a string at delim and returns an object with the
 * split string parts as keys and the values set to true.
 * 
 * @param str 
 * @param delim 
 */
export function splitToObj( str: string, delim: string | RegExp ) : Object {
  if ( !( _.isString( str ) ) ) {
    throw new Error(`Input must be a string: ${str}`)
  } else {
    return convertToObject(str.split( delim ), true) 
  }
}
