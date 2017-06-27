declare global  {
    namespace Workflo {
        type StepImpl = <I, O>(params: IStepArgs<I, O>) => IParameterizedStep;
        type StepImplMap = {
            [key: string]: StepImpl;
        };
        interface ISpecWhen {
            And: (description: string, bodyFunc: () => void) => ISpecWhen;
        }
        interface ITCWhen {
            and: (step: IParameterizedStep) => ITCWhen;
        }
        interface ITCGiven {
            and: (step: IParameterizedStep) => ITCGiven;
            when: (step: IParameterizedStep) => ITCWhen;
        }
        interface IDescriptionStack {
            givens: string[];
            whens: string[];
        }
        interface IStoryMetaData {
            issues: string[];
        }
        interface IFeatureMetadata {
        }
        interface ISuiteMetadata {
        }
        interface ITestcaseMetadata {
        }
        interface IStoryMapEntry {
            descriptionStack: IDescriptionStack;
            metadata: IStoryMetaData;
            featureName: string;
            storyName: string;
        }
        interface IExpectationBlock {
            testcaseName: string;
            execute: () => void;
            screenshot: any;
        }
        type IVerifySpecObject = {
            [specId: string]: number | number[];
        };
        type IVerifyContainer = {
            specObj: IVerifySpecObject;
        };
    }
    interface IStepArgs<I, O> {
        cb?: (out: O) => void;
        arg?: I;
        description?: string;
    }
    interface IParameterizedStep {
        description: string;
        execute: (prefix?: string) => void;
    }
    function Feature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void): void;
    function Story(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void): void;
    function Given(description: string, bodyFunc: () => void): void;
    function When(description: string, bodyFunc: () => void): Workflo.ISpecWhen;
    function Then(id: number, description: string): void;
    function suite(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void): void;
    function testcase(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void): void;
    function given(step: IParameterizedStep): Workflo.ITCGiven;
    function verify(verifyObject: Workflo.IVerifySpecObject, func: (...args: any[]) => void): void;
}
export * from './lib/steps';
