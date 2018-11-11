import * as pageObjects from './lib/page_objects';
import { IPageElementListWaitEmptyParams, IPageElementListWaitLengthParams } from './lib/page_objects/page_elements/PageElementList';
declare global {
    interface CustomElementMatchers {
        toExist(): boolean;
        toBeVisible(): boolean;
        toBeEnabled(): boolean;
        toBeSelected(): boolean;
        toBeChecked(): boolean;
        toHaveText(text: string): boolean;
        toHaveAnyText(): boolean;
        toContainText(text: string): boolean;
        toHaveValue(value: string): boolean;
        toHaveAnyValue(): boolean;
        toContainValue(value: string): boolean;
        toHaveHTML(html: string): boolean;
        toHaveAnyHTML(): boolean;
        toContainHTML(html: string): boolean;
        toHaveDirectText(directText: string): boolean;
        toHaveAnyDirectText(): boolean;
        toContainDirectText(directText: string): boolean;
        toHaveAttribute(attributeArgs: Workflo.IAttributeArgs): boolean;
        toHaveAnyAttribute(attributeArgs: Workflo.IAnyAttributeArgs): boolean;
        toContainAttribute(attributeArgs: Workflo.IAttributeArgs): boolean;
        toHaveClass(className: string): boolean;
        toContainClass(className: string): boolean;
        toHaveId(id: string): boolean;
        toHaveAnyId(): boolean;
        toContainId(id: string): boolean;
        toHaveName(name: string): boolean;
        toHaveAnyName(): boolean;
        toContainName(name: string): boolean;
        toHaveLocation(coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        }): boolean;
        toHaveX(x: number, opts?: {
            tolerance?: number;
        }): boolean;
        toHaveY(y: number, opts?: {
            tolerance?: number;
        }): boolean;
        toHaveSize(size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        }): boolean;
        toHaveWidth(width: number, opts?: {
            tolerance?: number;
        }): boolean;
        toHaveHeight(height: number, opts?: {
            tolerance?: number;
        }): boolean;
        toEventuallyExist(opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyBeVisible(opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyBeEnabled(opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyBeSelected(opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyBeChecked(opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveText(text: string, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveAnyText(opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyContainText(text: string, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveValue(value: string, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveAnyValue(opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyContainValue(value: string, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveHTML(html: string, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveAnyHTML(opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyContainHTML(html: string, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveDirectText(directText: string, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveAnyDirectText(opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyContainDirectText(directText: string, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveAttribute(attributeArgs: Workflo.IAttributeArgs, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveAnyAttribute(attributeArgs: Workflo.IAnyAttributeArgs, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyContainAttribute(attributeArgs: Workflo.IAttributeArgs, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveClass(className: string, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyContainClass(className: string, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveId(id: string, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveAnyId(opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyContainId(id: string, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveName(name: string, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveAnyName(opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyContainName(name: string, opts?: Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveLocation(coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveX(x: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveY(y: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveSize(size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveWidth(width: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional): boolean;
        toEventuallyHaveHeight(height: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional): boolean;
    }
    interface CustomListMatchers {
        toBeEmpty(): boolean;
        toHaveLength(length: number, opts?: {
            comparator?: Workflo.Comparator;
        }): boolean;
        toEventuallyBeEmpty(opts?: IPageElementListWaitEmptyParams): boolean;
        toEventuallyHaveLength(length: number, opts?: IPageElementListWaitLengthParams): boolean;
    }
    interface ElementMatchers extends CustomElementMatchers {
        not: CustomElementMatchers;
    }
    interface ListMatchers extends CustomListMatchers {
        not: CustomListMatchers;
    }
    function expectElement<S extends pageObjects.stores.PageElementStore, E extends pageObjects.elements.PageElement<S>>(element: E): ElementMatchers;
    function expectList<S extends pageObjects.stores.PageElementStore, PageElementType extends pageObjects.elements.PageElement<S>, PageElementOptions, L extends pageObjects.elements.PageElementList<S, PageElementType, PageElementOptions>>(list: L): ListMatchers;
    namespace WebdriverIO {
        interface Client<T> {
            /**
             * Allow any type of promise to be resolved in order to continue synchronous code execution.
             */
            resolvePromise<Type>(promise: Promise<Type>): Type;
        }
    }
    /**
     * Makes all properties of Type optional, except for those whose keys are passed as K.
     */
    type PartialRequire<Type, K extends keyof Type> = Partial<Type> & Pick<Type, K>;
    /**
     * Type is the original object.
     *
     * K represents the original object's property keys to be picked from the original object unaltered.
     *
     * KPartial represents the original object's property keys to be picked from the original object and turned into optional properties.
     */
    type PickPartial<Type, K extends keyof Type, KPartial extends keyof Type> = Pick<Type, K> & Partial<Pick<Type, KPartial>>;
    type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
    namespace Workflo {
        interface ICoordinates {
            x: number;
            y: number;
        }
        interface ISize {
            width: number;
            height: number;
        }
        interface IJSError {
            notFound: string[];
        }
        interface IScrollResult {
            elemTop: number;
            elemLeft: number;
            containerTop: number;
            containerLeft: number;
            scrollTop: number;
            scrollLeft: number;
        }
        interface IScrollParams {
            containerSelector?: string;
            directions: {
                x?: boolean;
                y?: boolean;
            };
            offsets?: {
                x?: number;
                y?: number;
            };
            padding?: {
                x?: number;
                y?: number;
            };
            closestContainerIncludesHidden?: boolean;
        }
        type PageElementOptions = "timeout" | "waitType" | "customScroll";
        interface IRecObj<Type> {
            [key: string]: Type | IRecObj<Type>;
        }
        interface IWDIOParamsOptional {
            timeout?: number;
        }
        interface IWDIOParamsOptionalReverse extends IWDIOParamsOptional {
            reverse?: boolean;
        }
        interface IAnyAttributeArgs {
            name: string;
        }
        interface IAttributeArgs extends IAnyAttributeArgs {
            value: string;
        }
        namespace PageNode {
            interface IElementJSON {
                pageNodeType: string;
                nodeId: string;
            }
            interface INode {
                __getNodeId(): string;
                toJSON(): IElementJSON;
            }
            interface IGetText extends INode {
                getText(): string;
            }
            interface IGetValue extends INode {
                getValue(): string;
            }
            interface ISetValue<T> extends INode {
                setValue(value: T): this;
            }
        }
        interface IProblem<ValueType, ResultType> {
            values: IRecObj<ValueType>;
            solve: <NodeType extends Workflo.PageNode.INode>(node: NodeType, value?: ValueType) => ISolveResult<ResultType>;
        }
        interface ISolveResult<ResultType> {
            nodeSupported: boolean;
            result?: ResultType;
        }
        interface IWalkerOptions {
            throwUnmatchedKey?: boolean;
            throwSolveError?: boolean;
        }
        type Value = string | boolean | number;
        const enum WaitType {
            exist = "exist",
            visible = "visible",
            value = "value",
            text = "text"
        }
        const enum Comparator {
            equalTo = "==",
            lessThan = "<",
            greaterThan = ">",
            notEqualTo = "!=",
            ne = "!=",
            eq = "==",
            lt = "<",
            gt = ">"
        }
        type XPath = pageObjects.builders.XPathBuilder | string;
        namespace Object {
            /**
             * Iterates over all properties in an object and executes
             * func on each.
             *
             * Returns a new object with the same keys as the input
             * object and the values as result of the func.
             *
             * @param input
             * @param func
             */
            function mapProperties<T, O, K extends string>(input: Record<K, T>, func: (value: T, key?: K) => O): Record<K, O>;
            /**
             * Iterates over all properties in an object and executes func on each.
             *
             * @param input
             * @param func
             */
            function forEachProperty<T, K extends string>(input: Record<K, T>, func: (value: T, key?: K) => void): Record<K, T>;
            /**
             * Returns a new object with the original object's keys and values inverted.
             * The original object's values must therefore be implicitly convertable to type string.
             *
             * @param obj
             */
            function invert<K extends string>(obj: Record<K, string>): Record<string, K>;
            /**
             * Returns a new filtered object that only contains those
             * properties of the initial object where func returned true.
             *
             * Does not traverse nested objects!
             *
             * @param obj
             * @param func
             */
            function filter<T>(obj: Record<string, T>, func: (value: T, key?: string) => boolean): Record<string, T>;
            /**
             * If key already exists in obj, turns respective value
             * into array and pushes value onto the array.
             * Else, adds "normal" key-value pair as property.
             * If overwrite is true, always overwrites existing value
             * with new value without turning it into array.
             *
             * @param obj
             * @param key
             * @param value
             * @param overwrite
             */
            function addToProp<T, K extends string>(obj: Record<K, T | T[]>, key: K, value: T, overwrite?: boolean): Record<K, T | T[]>;
            /**
             * Creates a copy of original object in which all
             * key-value pairs matching the passed props are removed.
             *
             * @param obj
             * @param props
             */
            function stripProps<T>(obj: Record<string, T>, props: string[]): Record<string, T>;
            /**
             * Returns properties of obj whose keys are also present in
             * subsetObj as a new object.
             *
             * Does not traverse nested objects!
             *
             * @param obj
             * @param matchingObject
             */
            function subset<T, O>(obj: Record<string, T>, maskObject: Record<string, O>): Record<string, T>;
            /**
             * Returns a new object where all properties with a boolean value of false are stripped recursively.
             * @param obj
             */
            function stripMaskDeep(obj: Workflo.IRecObj<boolean>): Workflo.IRecObj<boolean>;
        }
        namespace Array {
            /**
             * Gets an input array and maps it to an object where
             * the property keys correspond to the array elements
             * and the property values are defiend by mapFunc.
             *
             * @param input
             * @param mapFunc
             */
            function mapToObject<T>(input: string[], mapFunc: (element: string) => T): {
                [key: string]: T;
            };
        }
        namespace String {
            /**
              * Splits a string at delim and returns an object with the
              * split string parts as keys and the values set to true.
              *
              * @param str
              * @param delim
              */
            function splitToObj(str: string, delim: string | RegExp): {
                [part: string]: boolean;
            };
            /**
             * Removes all whitespace characters from a string.
             *
             * @param str
             */
            function stripWhitespaces(str: string): string;
        }
        namespace Class {
            /**
             * Returns names of all methods of a ES6 class (except for constructor).
             *
             * see http://stackoverflow.com/questions/31054910/get-functions-methods-of-a-class
             *
             * @param obj
             */
            function getAllMethods(obj: any): string[];
        }
        namespace Util {
            /**
             * Converts strings, arrays and objects into objects.
             *
             * If input is string, output is an object with one
             * entry where the key is the string.
             * If input is array, output is an object where each key
             * represents one element in the array.
             * If input is object, output is a clone of the input object.
             *
             * For strings and arrays, valueFunc is used to calculate the
             * resulting object's property values.
             * For objects, valueFunc has no effect -> original property values will be preserved!
             *
             * @param unknownTypedInput
             * @param valueFunc
             */
            function convertToObject<T>(unknownTypedInput: {
                [key: string]: T;
            } | string[] | string, valueFunc?: (key: string) => T): {
                [key: string]: T;
            };
            /**
             * Compares two variables of same type.
             *
             * @param var1
             * @param var2
             * @param operator
             */
            function compare<Type>(var1: Type, var2: Type, operator: Workflo.Comparator): boolean;
        }
        interface FilterList {
            listFiles?: string[];
            specFiles?: string[];
            testcaseFiles?: string[];
            features?: string[];
            specs?: string[];
            testcases?: string[];
        }
        interface IManualCriteria {
            [key: number]: {
                result: boolean;
                date: string;
                comment?: string;
            };
        }
        interface IManualTestcaseResults {
            [key: string]: IManualCriteria;
        }
        type StepImpl = <I, O>(params: IStepArgs<I, O>) => IParameterizedStep;
        type StepImplMap = {
            [key: string]: StepImpl;
        };
        type Severity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';
        interface ISpecGiven {
            And: (description: string, bodyFunc?: () => void) => ISpecGiven;
        }
        interface ISpecWhen {
            And: (description: string, bodyFunc?: () => void) => ISpecWhen;
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
            bugs?: string[];
            severity?: Workflo.Severity;
        }
        interface IFeatureMetadata {
        }
        interface ISuiteMetadata {
        }
        interface ITestcaseMetadata {
            bugs?: string[];
            severity?: Workflo.Severity;
        }
        interface IStoryMapEntry {
            descriptionStack: IDescriptionStack;
            description: string;
            metadata: IStoryMetaData;
            featureName: string;
            storyName: string;
            insideWhenSequence: boolean;
            whenSequenceLengths: number[];
            whenRecLevel: number;
            insideGivenSequence: boolean;
            givenSequenceLengths: number[];
            givenRecLevel: number;
        }
        interface IExpectationBlock {
            testcaseName: string;
            execute: () => void;
            screenshot: any;
        }
        type IValidateSpecObject = {
            [specId: string]: number | number[];
        };
        type IValidateContainer = {
            specObj: IValidateSpecObject;
        };
    }
    interface IOptStepArgs<I, O> {
        cb?: (out: O) => void;
        arg?: I;
        description?: string;
    }
    interface IStepArgs<I, O> extends IOptStepArgs<I, O> {
        arg: I;
    }
    interface IParameterizedStep {
        description: string;
        execute: (prefix?: string) => void;
    }
    function getUid(id: string): string;
    function Feature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void): void;
    function fFeature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void): void;
    function xFeature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void): void;
    function Story(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void): void;
    function fStory(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void): void;
    function xStory(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void): void;
    function Given(description: string, bodyFunc?: () => void): Workflo.ISpecGiven;
    function When(description: string, bodyFunc?: () => void): Workflo.ISpecWhen;
    function Then(id: number, description: string): void;
    function fThen(id: number, description: string): void;
    function xThen(id: number, description: string): void;
    function suite(description: string, metadata: Workflo.ISuiteMetadata, bodyFunc: () => void): void;
    function fsuite(description: string, metadata: Workflo.ISuiteMetadata, bodyFunc: () => void): void;
    function xsuite(description: string, metadata: Workflo.ISuiteMetadata, bodyFunc: () => void): void;
    function testcase(description: string, metadata: Workflo.ITestcaseMetadata, bodyFunc: () => void): void;
    function ftestcase(description: string, metadata: Workflo.ITestcaseMetadata, bodyFunc: () => void): void;
    function xtestcase(description: string, metadata: Workflo.ITestcaseMetadata, bodyFunc: () => void): void;
    function given(step: IParameterizedStep): Workflo.ITCGiven;
    function validate(validateObject: Workflo.IValidateSpecObject, func: (...args: any[]) => void): void;
    function xpath(selector: string): pageObjects.builders.XPathBuilder;
}
export * from './lib/steps';
import * as objectFunctions from './lib/utility_functions/object';
import * as arrayFunctions from './lib/utility_functions/array';
import * as classFunctions from './lib/utility_functions/class';
import * as stringFunctions from './lib/utility_functions/string';
export { objectFunctions, arrayFunctions, classFunctions, stringFunctions };
export { pageObjects };
import Kiwi from './lib/Kiwi';
export { Kiwi };
