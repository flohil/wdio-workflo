/**
 * Prints values with tolerances as a string.
 *
 * @param values a number or an object with values of type number
 * @param tolerances a number or an object with values of type number
 */
export declare function tolerancesToString(values: number | Record<string, number>, tolerances?: number | Record<string, number>): string | number;
/**
 * Returns true if value is null or undefined.
 *
 * @param value an arbitrary value
 */
export declare function isNullOrUndefined(value: any): boolean;
/**
 * Returns true if value neither null nor undefined.
 *
 * @param value an arbitrary value
 */
export declare function notIsNullOrUndefined(value: any): boolean;
/**
 * Returns true if:
 *
 * - value is undefined
 * - value is null
 * - value is a string and length of value is 0
 *
 * @param value an arbitrary value
 */
export declare function isEmpty(value: any): boolean;
/**
 * Mixes baseCtors classes into derivedCtor class.
 * All properties of baseCtors will be written to derivedCtor.
 * If a property with the same name already exists in derivedCtor, it will be overwritten.
 * For more information about typescript mixins see https://www.typescriptlang.org/docs/handbook/mixins.html
 *
 * @param derivedCtor the class into which baseCtors should be mixed in
 * @param baseCtors the classes which should be mixed into derivedCtor
 * @param mergeObjectKeys If the name of property is contained in mergeObjectKeys and the property exists as an object
 * in both derivedCtor and baseCtor, both objects will be merged together instead of the baseCtor object overwriting
 * the derivedCtor object. Be aware that deep merging is not supported and therefore "nested" properties with the same
 * name in derivedCtor's object and baseCtor's object will still be overwritten by baseCtor's object values.
 */
export declare function applyMixins(derivedCtor: any, baseCtors: any[], mergeObjectKeys?: string[]): void;
