export declare const Feature: (description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void, jasmineFunc?: (description: string, bodyFunc: () => void) => void) => void;
export declare const fFeature: (description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) => void;
export declare const xFeature: (description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) => void;
export declare const Story: (id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void, jasmineFunc?: (description: string, bodyFunc: () => void) => void) => void;
export declare const fStory: (id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void) => void;
export declare const xStory: (id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void) => void;
export declare const Given: (description: string, bodyFunc: () => void) => void;
export declare const When: (description: string, bodyFunc: () => void) => {
    "And": (description: string, bodyFunc: () => void) => any;
};
export declare const Then: (id: number, description: string, jasmineFunc?: (description: string, bodyFunc: () => void) => void) => void;
export declare const fThen: (id: number, description: string) => void;
export declare const xThen: (id: number, description: string) => void;
export declare const suite: (description: string, metadata: Workflo.ISuiteMetadata, bodyFunc: () => void, jasmineFunc?: (description: string, bodyFunc: () => void) => void) => void;
export declare const fsuite: (description: string, metadata: Workflo.ISuiteMetadata, bodyFunc: () => void) => void;
export declare const xsuite: (description: string, metadata: Workflo.ISuiteMetadata, bodyFunc: () => void) => void;
export declare const testcase: (description: string, metadata: Workflo.ITestcaseMetadata, bodyFunc: () => void, jasmineFunc?: (description: string, bodyFunc: () => void) => void) => void;
export declare const ftestcase: (description: string, metadata: Workflo.ITestcaseMetadata, bodyFunc: () => void) => void;
export declare const xtestcase: (description: string, metadata: Workflo.ITestcaseMetadata, bodyFunc: () => void) => void;
export declare const given: (step: IParameterizedStep) => {
    "and": (step: any) => any;
    "when": (step: any) => {
        "and": (step: any) => any;
    };
};
export declare const verify: (specObj: Workflo.IVerifySpecObject, func: (...testargs: any[]) => void) => void;
