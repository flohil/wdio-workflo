/**
 * Splits a string at delim and returns an object with the
 * split string parts as keys and the values set to true.
 *
 * @param str
 * @param delim
 */
export declare function splitToObj(str: string, delim: string | RegExp): {
    [part: string]: boolean;
};
export declare function stripWhitespaces(str: string): string;
