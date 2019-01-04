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
/**
 * This function compares the values of two passed variables with a compare method defined in `operator`.
 *
 * The following compare methods are supported:
 *
 * - equals
 * - not equals
 * - less than
 * - greater than
 *
 * @template Type the type of the compared variables
 * @param var1 the first variable to be compared
 * @param var2 the second variable to be compared
 * @param operator defines the method to be used for the comparison (===, !==, <, >)
 * @returns the result of the comparison
 */
export declare function compare<Type>(var1: Type, var2: Type, operator: Workflo.Comparator): boolean;
/**
 * This function returns the textual representation of a compare method (===, !==, <, >).
 *
 * @param comparator defines a method to be used for comparisons (===, !==, <, >)
 * @returns the textual representation of the passed comparison method
 */
export declare function comparatorStr(comparator: Workflo.Comparator): "" | " other than" | " greater than" | " less than";
