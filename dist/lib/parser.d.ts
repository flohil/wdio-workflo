import * as ts from "typescript";
export interface SpecInfo {
    description?: string;
    metadata?: Workflo.IStoryMetaData;
}
export interface FeatureInfo {
    metadata?: Workflo.IFeatureMetadata;
    specHash?: SpecHash;
}
export declare type SpecHash = Record<string, SpecInfo>;
export declare type FeatureHash = Record<string, FeatureInfo>;
export interface SpecTableEntry {
    specFile: string;
    feature: string;
}
export declare type SpecTable = Record<string, SpecTableEntry>;
export interface SpecParseResults {
    table: SpecTable;
    tree: FeatureHash;
}
export declare function parseSpecFiles(sourceFile: ts.SourceFile): void;
export declare function specFilesParse(fileNames: string[]): {
    tree: Record<string, FeatureInfo>;
    table: Record<string, SpecTableEntry>;
};
