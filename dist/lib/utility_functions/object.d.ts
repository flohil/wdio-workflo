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
export declare function mapProperties<T, O, K extends string>(input: Record<K, T>, func: (value: T, key?: K) => O): Record<K, O>;
/**
 * Iterates over all properties in an object and executes func on each.
 *
 * @param input
 * @param func
 */
export declare function forEachProperty<T, K extends string>(input: Record<K, T>, func: (value: T, key?: K) => void): Record<K, T>;
/**
 * Returns a new object with the original object's keys and values inverted.
 * The original object's values must therefore be implicitly convertable to type string.
 *
 * @param obj
 */
export declare function invert<K extends string>(obj: Record<K, string>): Record<string, K>;
/**
 * Returns a new filtered object that only contains those
 * properties of the initial object where func returned true.
 *
 * Does not traverse nested objects!
 *
 * @param obj
 * @param func
 */
export declare function filter<T>(obj: Record<string, T>, func: (value: T, key?: string) => boolean): Record<string, T>;
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
export declare function addToProp<T, K extends string>(obj: Record<K, T | T[]>, key: K, value: T, overwrite?: boolean): Record<K, T | T[]>;
/**
 * Creates a copy of original object in which all
 * key-value pairs matching the passed props are removed.
 *
 * @param obj
 * @param props
 */
export declare function stripProps<T>(obj: Record<string, T>, props: string[]): Record<string, T>;
/**
 * Returns properties of obj whose keys are also present in
 * subsetObj as a new object.
 *
 * Does not traverse nested objects!
 *
 * @param obj
 * @param matchingObject
 */
export declare function subset<T, O>(obj: Record<string, T>, maskObject: Record<string, O>): Record<string, T>;
/**
 * Returns a new object where all properties with a boolean value of false are stripped recursively.
 * @param obj
 */
export declare function stripMaskDeep(obj: Workflo.IRecObj<boolean>): Workflo.IRecObj<boolean>;
