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
export interface FeatureTableEntry {
    specFiles: string[];
}
export declare type SpecTable = Record<string, SpecTableEntry>;
export declare type FeatureTable = Record<string, FeatureTableEntry>;
export interface SpecParseResults {
    specTable: SpecTable;
    specTree: FeatureHash;
    featureTable: FeatureTable;
}
export declare function parseSpecFiles(sourceFile: ts.SourceFile): void;
export interface TestcaseInfo {
    description?: string;
    metadata?: Workflo.ITestcaseMetadata;
    specVerifyHash?: Record<string, number[]>;
}
export interface SuiteInfo {
    metadata?: Workflo.ISuiteMetadata;
    testcaseHash?: TestcaseHash;
}
export declare type TestcaseHash = Record<string, TestcaseInfo>;
export declare type SuiteHash = Record<string, SuiteInfo>;
export interface TestcaseTableEntry {
    testcaseFile: string;
    suiteId: string;
}
export declare type TestcaseTable = Record<string, TestcaseTableEntry>;
export declare type VerifyTable = Record<string, Record<string, true>>;
export interface TestcaseParseResults {
    testcaseTable: TestcaseTable;
    tree: SuiteHash;
    verifyTable: VerifyTable;
}
export declare function parseTestcaseFiles(sourceFile: ts.SourceFile): void;
export declare function specFilesParse(fileNames: string[]): SpecParseResults;
export declare function testcaseFilesParse(fileNames: string[]): TestcaseParseResults;
