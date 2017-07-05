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
