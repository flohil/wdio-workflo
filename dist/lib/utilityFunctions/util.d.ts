/**
 * Converts strings, arrays and objects into objects.
 * valueFunc will be used to determine the object's
 * property values and can be either a func or a value.
 * valueFunc gets passed the array element or string as
 * value.
 * If switchKeyValue is true, the keys and values of the
 * resulting object will be switched.
 * If stackValues is true, a value for an exiting key
 * will not be replaced by a new value but added to an
 * array of values for the concerned key.
 *
 * If input is object, output remains the same object.
 * If input is string, output is an object with one
 * entry where the key is the string.
 * If input is array, output is an object where each key
 * represents one element in the array.
 *
 * @param unknownTypedInput
 * @param valueFunc
 * @param options
 */
export declare function convertToObject(unknownTypedInput: any, valueFunc?: any, options?: {
    switchKeyValue: boolean;
    overwriteValues: boolean;
    stackValues: boolean;
}): Object;
