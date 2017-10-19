declare global  {
    interface Date {
        addDays: Function;
    }
}
export interface IExecutionFilters {
    specFiles?: Record<string, true>;
    testcaseFiles?: Record<string, true>;
    manualResultFiles?: Record<string, true>;
    specs?: Record<string, true>;
    features?: Record<string, true>;
    testcases?: Record<string, true>;
    suites?: Record<string, true>;
    manualSpecs?: Record<string, true>;
}
export interface ITestcaseTraceInfo {
    testcase: string;
    testcaseFile: string;
    specs: string[];
}
export interface IVerificationFileEntry {
    manualFile?: string;
    testcases?: string[];
    testcaseIds?: Record<string, true>;
}
export interface ISpecTraceInfo {
    spec: string;
    specFile: string;
    testcaseCriteriaStrs: string[];
    criteriaVerificationFiles: Record<string, IVerificationFileEntry>;
    manualCriteria: string[];
    manualCriteriaStr: string;
}
export interface ITraceInfo {
    testcases: Record<string, ITestcaseTraceInfo>;
    specs: Record<string, ISpecTraceInfo>;
}
export interface IAnalysedSpec {
    automated: Record<string, true>;
    manual: Record<string, true>;
    uncovered: Record<string, true>;
    undefined: boolean;
}
export interface IAnalysedCriteria {
    specs: Record<string, IAnalysedSpec>;
    allCriteriaCount: number;
    automatedCriteriaCount: number;
    manualCriteriaCount: number;
    uncoveredCriteriaCount: number;
}
export {};
