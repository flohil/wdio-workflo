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
    testcases: Record<string, true>;
    criteria: Record<string, true>;
}
export interface FeatureTableEntry {
    specFiles: Record<string, true>;
    specs: Record<string, true>;
}
export interface SpecFileEntry {
    features: Record<string, true>;
    specs: Record<string, true>;
}
export declare type SpecTable = Record<string, SpecTableEntry>;
export declare type FeatureTable = Record<string, FeatureTableEntry>;
export declare type SpecFileTable = Record<string, SpecFileEntry>;
export interface SpecParseResults {
    specTable: SpecTable;
    specTree: FeatureHash;
    featureTable: FeatureTable;
    specFileTable: SpecFileTable;
}
export declare function parseSpecFiles(sourceFile: ts.SourceFile): void;
export interface TestcaseInfo {
    description?: string;
    metadata?: Workflo.ITestcaseMetadata;
    specVerifyHash?: Record<string, Record<string, true>>;
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
export interface TestcaseFileTableEntry {
    testcases: Record<string, true>;
}
export declare type TestcaseTable = Record<string, TestcaseTableEntry>;
export declare type VerifyTable = Record<string, Record<string, true>>;
export declare type TestcaseFileTable = Record<string, TestcaseFileTableEntry>;
export interface TestcaseParseResults {
    testcaseTable: TestcaseTable;
    tree: SuiteHash;
    verifyTable: VerifyTable;
    testcaseFileTable: TestcaseFileTable;
}
export declare function parseTestcaseFiles(sourceFile: ts.SourceFile): void;
export declare function specFilesParse(fileNames: string[]): SpecParseResults;
export declare function testcaseFilesParse(fileNames: string[]): TestcaseParseResults;
