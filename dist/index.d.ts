/// <reference types="jasmine-expect" />
declare global  {
    namespace Workflo {
        namespace Object {
            function mapProperties(input: Object, func: (value: any, key: string | number) => Object): {};
            function forEachProperty(input: Object, func: (key: string | number, value: any) => void): void;
            function invert(obj: Object): Object;
            function filter(obj: Object, func: (value: any, key: string | number) => boolean): {};
            function addToProps(obj: Object, key: string | number, value: any, overwrite?: boolean): void;
            function stripNegatives(obj: Object): Object;
            function stripNegativesRec(obj: any): any;
            function subset(obj: Object, matchingObject: Object): Object;
        }
        namespace Array {
            function mapToObject<T>(input: string[] | number[], mapFunc: (element: string | number) => T): {
                [key: string]: T;
            };
            function convertToObject<T>(arr: any[], valueFunc?: any, options?: {
                switchKeyValue: boolean;
                overwriteValues: boolean;
                stackValues: jasmine.AssymetricMatchers;
            }): Object;
        }
        namespace String {
            function convertToObject(input: string, valueFunc?: any, options?: {
                switchKeyValue: boolean;
                overwriteValues: boolean;
                stackValues: jasmine.AssymetricMatchers;
            }): any;
            function splitToObj(str: string, delim: string | RegExp): Object;
        }
        namespace Class {
            function getAllMethods(obj: any): string[];
        }
        type StepImpl = <I, O>(params: IStepArgs<I, O>) => IParameterizedStep;
        type StepImplMap = {
            [key: string]: StepImpl;
        };
        type severity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';
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
            issues?: string[];
            severity?: severity;
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
import * as objectFunctions from './lib/utilityFunctions/object';
import * as arrayFunctions from './lib/utilityFunctions/array';
import * as classFunctions from './lib/utilityFunctions/class';
import * as stringFunctions from './lib/utilityFunctions/string';
export { objectFunctions, arrayFunctions, classFunctions, stringFunctions };
