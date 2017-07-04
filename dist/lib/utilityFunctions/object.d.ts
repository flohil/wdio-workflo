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
export declare function mapProperties(input: Object, func: (value: any, key: string | number) => Object): {};
/**
 * Iterates over all properties in an object and executes func on each.
 * @param input
 * @param func
 */
export declare function forEachProperty(input: Object, func: (key: string | number, value: any) => void): void;
/**
 * Returns a new object with the original object's keys and values inverted.
 *
 * @param obj
 */
export declare function invert(obj: Object): Object;
/**
 * Returns a filtered object that only contains those
 * properties of the initial object where func returned true.
 *
 * @param obj
 * @param func
 */
export declare function filter(obj: Object, func: (value: any, key: string | number) => boolean): {};
/**
 * If key already exists in obj, turns respective value
 * into array and pushes value onto the array.
 * Else, adds "normal" key-value pair as property.
 * If overwrite is true, always overwrites existing value
 * with new value without turning into array.
 *
 * @param obj
 * @param key
 * @param value
 * @param overwrite
 */
export declare function addToProps(obj: Object, key: string | number, value: any, overwrite?: boolean): void;
/**
 * Creates a copy of original object in which all
 * properties with negative values are removed recursively.
 *
 * @param obj
 */
export declare function stripNegatives(obj: Object): Object;
export declare function stripNegativesRec(obj: any): any;
/**
 * Returns properties of obj whose keys are also present in
 * subsetObj as a new object.
 *
 * @param obj
 * @param matchingObject
 */
export declare function subset(obj: Object, matchingObject: Object): Object;
