export declare function addToProp<T>(obj: {
    [key: string]: T | T[];
}, key: string, value: T, overwrite?: boolean): void;
