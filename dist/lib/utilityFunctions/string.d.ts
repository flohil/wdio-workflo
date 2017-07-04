/// <reference types="jasmine-expect" />
export declare function convertToObject(input: string, valueFunc?: any, options?: {
    switchKeyValue: boolean;
    overwriteValues: boolean;
    stackValues: jasmine.AssymetricMatchers;
}): any;
export declare function splitToObj(str: string, delim: string | RegExp): Object;
