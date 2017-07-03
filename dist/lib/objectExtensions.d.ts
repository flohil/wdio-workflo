/// <reference types="jasmine-expect" />
export declare function mapToObject(input: any, mapFunc: any): {};
export declare function convertToObject(unknownTypedInput: any, valueFunc?: any, options?: {
    switchKeyValue: boolean;
    overwriteValues: boolean;
    stackValues: jasmine.AssymetricMatchers;
}): any;
export declare function mapProperties(input: any, func: any): {};
export declare function forEachProperty(input: any, func: any): void;
export declare function arrayFrom(input: any, func: any): any[];
export declare function invert(obj: any): {};
export declare function filter(obj: any, func: any): {};
export declare function addToProps(obj: any, key: any, value: any, overwrite?: boolean): void;
export declare function splitToObj(str: any, delim: any): any;
export declare function stripNegatives(obj: any): any;
export declare function stripNegativesRec(obj: any): any;
export declare function getAllMethods(obj: any): any[];
export declare function subset(obj: any, matchingObject: any): {};
