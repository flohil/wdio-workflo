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
export declare function mapProperties<T, O>(input: {
    [key: string]: T;
}, func: (value: T, key?: string) => O): {
    [key: string]: O;
};
/**
 * Iterates over all properties in an object and executes func on each.
 *
 * @param input
 * @param func
 */
export declare function forEachProperty<T>(input: {
    [key: string]: T;
}, func: (value: T, key?: string) => void): void;
/**
 * Returns a new object with the original object's keys and values inverted.
 * The original object's values must therefore be implicitly convertable to type string.
 *
 * @param obj
 */
export declare function invert(obj: {
    [key: string]: string;
}): {
    [key: string]: string;
};
/**
 * Returns a new filtered object that only contains those
 * properties of the initial object where func returned true.
 *
 * Does not traverse nested objects!
 *
 * @param obj
 * @param func
 */
export declare function filter<T>(obj: {
    [key: string]: T;
}, func: (value: T, key?: string) => boolean): {
    [key: string]: T;
};
/**
 * If key already exists in obj, turns respective value
 * into array and pushes value onto the array.
 * Else, adds "normal" key-value pair as property.
 * If overwrite is true, always overwrites existing value
 * with new value without turning it into array.
 *
 * @param obj
 * @param key
 * @param value
 * @param overwrite
 */
export declare function addToProp<T>(obj: {
    [key: string]: T | T[];
}, key: string, value: T, overwrite?: boolean): void;
/**
 * Creates a copy of original object in which all
 * key-value pairs matching the passed props are removed.
 *
 * @param obj
 * @param props
 */
export declare function stripProps<T>(obj: {
    [key: string]: T;
}, props: string[]): {
    [key: string]: T;
};
/**
 * Returns properties of obj whose keys are also present in
 * subsetObj as a new object.
 *
 * Does not traverse nested objects!
 *
 * @param obj
 * @param matchingObject
 */
export declare function subset<T, O>(obj: {
    [key: string]: T;
}, maskObject: {
    [key: string]: O;
}): {
    [key: string]: T;
};
