/**
 * Gets an input array and maps it to an object where
 * the property keys correspond to the array elements
 * and the property values are defiend by mapFunc.
 *
 * @param input
 * @param mapFunc
 */
export declare function mapToObject<T>(input: string[], mapFunc: (element: string) => T): {
    [key: string]: T;
};
