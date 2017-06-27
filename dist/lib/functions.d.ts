export declare const Feature: (description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) => void;
export declare const Story: (id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void) => void;
export declare const Given: (description: string, bodyFunc: () => void) => void;
export declare const When: (description: string, bodyFunc: () => void) => {
    "And": (description: string, bodyFunc: () => void) => any;
};
export declare const Then: (id: number, description: string) => void;
export declare const suite: (description: string, metadata: Workflo.ISuiteMetadata, bodyFunc: () => void) => void;
export declare const testcase: (description: string, metadata: Workflo.ITestcaseMetadata, bodyFunc: () => void) => void;
export declare const given: (step: IParameterizedStep) => {
    "and": (step: any) => any;
    "when": (step: any) => {
        "and": (step: any) => any;
    };
};
export declare const verify: (specObj: Workflo.IVerifySpecObject, func: (...testargs: any[]) => void) => void;
