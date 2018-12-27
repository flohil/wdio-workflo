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
export declare function convertToObject<T>(unknownTypedInput: {
    [key: string]: T;
} | string[] | string, valueFunc?: (key: string) => T): {
    [key: string]: T;
};
export declare function compare<Type>(var1: Type, var2: Type, operator: Workflo.Comparator): boolean;
export declare function comparatorStr(comparator: Workflo.Comparator): "" | " other than" | " greater than" | " less than";
