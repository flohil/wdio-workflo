/// <reference types="jasmine-expect" />
/**
 * Gets an input array and maps it to an object where
 * the property keys correspond to the array elements
 * and the property values are defiend by mapFunc.
 *
 * @param input
 * @param mapFunc
 */
export declare function mapToObject<T>(input: string[] | number[], mapFunc: (element: string | number) => T): {
    [key: string]: T;
};
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
export declare function convertToObject<T>(arr: any[], valueFunc?: any, options?: {
    switchKeyValue: boolean;
    overwriteValues: boolean;
    stackValues: jasmine.AssymetricMatchers;
}): Object;
