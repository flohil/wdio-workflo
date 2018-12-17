import { InstallOpts, StartOpts } from 'selenium-standalone';
import { DesiredCapabilities, Options, Suite, Test, Client, RawResult, Element } from 'webdriverio';
import { IAnalysedCriteria, IExecutionFilters, IParseResults, ITraceInfo } from './lib/cli';
import * as pageObjects from './lib/page_objects';
import { IPageElementListWaitLengthParams } from './lib/page_objects/page_elements/PageElementList';
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
        toHaveHTML(html: string): boolean;
        toHaveAnyHTML(): boolean;
        toContainHTML(html: string): boolean;
        toHaveDirectText(directText: string): boolean;
        toHaveAnyDirectText(): boolean;
        toContainDirectText(directText: string): boolean;
        toHaveAttribute(attributeArgs: Workflo.IAttributeArgs): boolean;
        toHaveAnyAttribute(attributeName: string): boolean;
        toContainAttribute(attributeArgs: Workflo.IAttributeArgs): boolean;
        toHaveClass(className: string): boolean;
        toHaveAnyClass(): boolean;
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
        toEventuallyExist(opts?: Workflo.IWDIOParams): boolean;
        toEventuallyBeVisible(opts?: Workflo.IWDIOParams): boolean;
        toEventuallyBeEnabled(opts?: Workflo.IWDIOParams): boolean;
        toEventuallyBeSelected(opts?: Workflo.IWDIOParams): boolean;
        toEventuallyBeChecked(opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveText(text: string, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveAnyText(opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyContainText(text: string, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveHTML(html: string, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveAnyHTML(opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyContainHTML(html: string, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveDirectText(directText: string, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveAnyDirectText(opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyContainDirectText(directText: string, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveAttribute(attributeArgs: Workflo.IAttributeArgs, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveAnyAttribute(attributeName: string, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyContainAttribute(attributeArgs: Workflo.IAttributeArgs, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveClass(className: string, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveAnyClass(opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyContainClass(className: string, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveId(id: string, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveAnyId(opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyContainId(id: string, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveName(name: string, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveAnyName(opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyContainName(name: string, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveLocation(coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveX(x: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveY(y: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveSize(size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveWidth(width: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveHeight(height: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval): boolean;
    }
    interface CustomListMatchers {
        toBeEmpty(): boolean;
        toHaveLength(length: number, opts?: {
            comparator?: Workflo.Comparator;
        }): boolean;
        toEventuallyBeEmpty(opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveLength(length: number, opts?: IPageElementListWaitLengthParams): boolean;
        toExist(): boolean;
        toBeVisible(): boolean;
        toBeEnabled(): boolean;
        toHaveText(text: string | string[]): boolean;
    }
    interface CustomMapMatchers<K extends string | number | symbol> {
        toExist(opts?: {
            filterMask?: Partial<Record<K, true>>;
        }): boolean;
        toBeVisible(opts?: {
            filterMask?: Partial<Record<K, true>>;
        }): boolean;
        toHaveText(text: Partial<Record<K, string>>): boolean;
    }
    interface CustomGroupMatchers<Content extends {
        [key: string]: Workflo.PageNode.INode;
    }> {
        toExist(opts?: {
            filterMask?: Workflo.PageNode.ExtractBoolean<Content>;
        }): boolean;
        toBeVisible(opts?: {
            filterMask?: Workflo.PageNode.ExtractBoolean<Content>;
        }): boolean;
        toHaveText(text: Workflo.PageNode.ExtractText<Content>): boolean;
    }
    interface CustomValueElementMatchers extends CustomElementMatchers {
        toHaveValue(value: string): boolean;
        toHaveAnyValue(): boolean;
        toContainValue(value: string): boolean;
        toEventuallyHaveValue(value: string, opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyHaveAnyValue(opts?: Workflo.IWDIOParamsInterval): boolean;
        toEventuallyContainValue(value: string, opts?: Workflo.IWDIOParamsInterval): boolean;
    }
    interface ElementMatchers extends CustomElementMatchers {
        not: CustomElementMatchers;
    }
    interface ListMatchers extends CustomListMatchers {
        not: CustomListMatchers;
    }
    interface MapMatchers<K extends string | number | symbol> extends CustomMapMatchers<K> {
        not: CustomMapMatchers<K>;
    }
    interface GroupMatchers<Content extends {
        [key: string]: Workflo.PageNode.INode;
    }> extends CustomGroupMatchers<Content> {
        not: CustomGroupMatchers<Content>;
    }
    interface ValueElementMatchers extends CustomValueElementMatchers {
        not: CustomValueElementMatchers;
    }
    function expectElement<Store extends pageObjects.stores.PageElementStore, PageElementType extends pageObjects.elements.PageElement<Store>, ValueType>(element: PageElementType): PageElementType extends pageObjects.elements.ValuePageElement<Store, ValueType> ? ValueElementMatchers : ElementMatchers;
    function expectList<Store extends pageObjects.stores.PageElementStore, PageElementType extends pageObjects.elements.PageElement<Store>, PageElementOptions, PageElementListType extends pageObjects.elements.PageElementList<Store, PageElementType, PageElementOptions>>(list: PageElementListType): ListMatchers;
    function expectMap<Store extends pageObjects.stores.PageElementStore, K extends string, PageElementType extends pageObjects.elements.PageElement<Store>, PageElementOptions, PageElementMapType extends pageObjects.elements.PageElementMap<Store, K, PageElementType, PageElementOptions>>(map: PageElementMapType): MapMatchers<keyof typeof map['$']>;
    function expectGroup<Store extends pageObjects.stores.PageElementStore, Content extends {
        [K in keyof Content]: Workflo.PageNode.INode;
    }, PageElementGroupType extends pageObjects.elements.PageElementGroup<Store, Content>>(group: PageElementGroupType): GroupMatchers<typeof group['$']>;
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
    type FilteredKeys<T, U> = {
        [P in keyof T]: T[P] extends U ? P : never;
    }[keyof T];
    type FilteredKeysByReturnType<T, U> = {
        [P in keyof T]: T[P] extends (...args: any[]) => Workflo.PageNode.INode ? ReturnType<T[P]> extends U ? P : never : P;
    }[keyof T];
    namespace Workflo {
        type WdioElement = Client<RawResult<Element>> & RawResult<Element>;
        interface IJSError {
            notFound: string[];
        }
        interface ICoordinates {
            x: number;
            y: number;
        }
        interface ISize {
            width: number;
            height: number;
        }
        interface ITolerance {
            lower: number;
            upper: number;
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
        interface IRecObj<Type> {
            [key: string]: Type | IRecObj<Type>;
        }
        interface IWDIOParams {
            timeout?: number;
        }
        interface IWDIOParamsInterval {
            timeout?: number;
            interval?: number;
        }
        interface IWDIOParamsReverse extends IWDIOParams {
            reverse?: boolean;
        }
        interface IWDIOParamsReverseInterval extends IWDIOParamsInterval {
            reverse?: boolean;
        }
        interface IAnyAttributeArgs {
            name: string;
        }
        interface IAttributeArgs extends IAnyAttributeArgs {
            value: string;
        }
        interface IElementJSON {
            pageNodeType: string;
            nodeId: string;
        }
        interface ILastDiff {
            __lastDiff: IDiff;
            __setLastDiff: (diff: IDiff) => void;
        }
        interface IDiffTree {
            [key: string]: IDiff;
        }
        interface IDiff {
            constructorName?: string;
            actual?: string;
            expected?: string;
            selector?: string;
            tree?: IDiffTree;
        }
        namespace Store {
            type BaseKeys = "timeout" | "waitType";
            type GroupPublicKeys = "timeout";
            type GroupConstructorKeys = GroupPublicKeys | "content" | "store";
            type ElementPublicKeys = BaseKeys | "customScroll";
            type ListPublicKeys = BaseKeys | "disableCache" | "identifier";
            type ListPublicPartialKeys = "elementOptions";
            type ListConstructorKeys = ListPublicKeys | ListPublicPartialKeys | "elementStoreFunc";
            type MapPublicKeys = "identifier" | "timeout";
            type MapPublicPartialKeys = "elementOptions";
            type MapConstructorKeys = MapPublicKeys | MapPublicPartialKeys | "elementStoreFunc";
        }
        namespace PageNode {
            interface INode extends ILastDiff {
                __getNodeId(): string;
                getTimeout(): number;
                toJSON(): IElementJSON;
                currently: {};
                wait: {};
                eventually: {};
            }
            type ExtractText<T extends {
                [key: string]: INode;
            }> = {
                [P in keyof T]?: T[P] extends IElementNode<any> ? ReturnType<T[P]['getText']> : undefined;
            };
            type ExtractBoolean<T extends {
                [key: string]: INode;
            }> = {
                [P in keyof T]?: T[P] extends IElementNode<any> ? ReturnType<T[P]['currently']['isVisible']> : undefined;
            };
            type ExtractTrue<T extends {
                [key: string]: INode;
            }> = {
                [P in keyof T]?: T[P] extends IElementNode<any> ? ReturnType<T[P]['currently']['isVisible']> extends boolean ? true : ReturnType<T[P]['currently']['isVisible']> : undefined;
            };
            interface IElementNode<TextType> extends INode, IGetElement<TextType> {
                currently: IGetElement<TextType> & ICheckElementCurrently<TextType>;
                wait: IWaitElement<TextType>;
                eventually: ICheckElementEventually<TextType>;
            }
            interface IGetElement<TextType> {
                getText(filterMask?: TextType): TextType;
                getDirectText(filterMask?: TextType): TextType;
            }
            interface IWaitElement<TextType, OptsType = IWDIOParamsReverseInterval> {
                exists(opts?: OptsType): IElementNode<TextType>;
                isVisible(opts?: OptsType): IElementNode<TextType>;
                isEnabled(opts?: OptsType): IElementNode<TextType>;
                hasText(text: TextType, opts?: OptsType): IElementNode<TextType>;
                hasAnyText(opts?: OptsType): IElementNode<TextType>;
                containsText(text: TextType, opts?: OptsType): IElementNode<TextType>;
                hasDirectText(directText: TextType, opts?: OptsType): IElementNode<TextType>;
                hasAnyDirectText(opts?: OptsType): IElementNode<TextType>;
                containsDirectText(directText: TextType, opts?: OptsType): IElementNode<TextType>;
                not: Omit<IWaitElement<TextType, IWDIOParamsInterval>, 'not'>;
            }
            interface ICheckElementCurrently<TextType> {
                exists(): boolean;
                isVisible(): boolean;
                isEnabled(): boolean;
                hasText(text: TextType): boolean;
                hasAnyText(): boolean;
                containsText(text: TextType): boolean;
                hasDirectText(directText: TextType): boolean;
                hasAnyDirectText(): boolean;
                containsDirectText(directText: TextType): boolean;
                not: Omit<ICheckElementCurrently<TextType>, 'not'>;
            }
            interface ICheckElementEventually<TextType> {
                exists(opts?: IWDIOParams): boolean;
                isVisible(opts?: IWDIOParams): boolean;
                isEnabled(opts?: IWDIOParams): boolean;
                hasText(text: TextType, opts?: IWDIOParamsInterval): boolean;
                hasAnyText(opts?: IWDIOParamsInterval): boolean;
                containsText(text: TextType, opts?: IWDIOParamsInterval): boolean;
                hasDirectText(text: TextType, opts?: IWDIOParamsInterval): boolean;
                hasAnyDirectText(opts?: IWDIOParamsInterval): boolean;
                containsDirectText(text: TextType, opts?: IWDIOParamsInterval): boolean;
                not: Omit<ICheckElementEventually<TextType>, 'not'>;
            }
            type ExtractValue<T extends {
                [key: string]: INode;
            }> = {
                [P in keyof T]?: T[P] extends IValueElementNode<any> ? ReturnType<T[P]['getValue']> : undefined;
            };
            interface IValueElementNode<GetType, SetType = GetType> extends INode, IValueElement<GetType, SetType> {
                currently: IValueElement<GetType, SetType> & ICheckValueCurrently<GetType>;
                wait: IWaitValue<GetType>;
                eventually: ICheckValueEventually<GetType>;
            }
            interface IValueElement<GetType, SetType> {
                getValue(): GetType;
                setValue(value: SetType): IValueElementNode<GetType, SetType>;
            }
            interface IWaitValue<ValueType, OptsType = IWDIOParamsReverseInterval> {
                hasValue(text: ValueType, opts?: OptsType): IValueElementNode<ValueType>;
                hasAnyValue(opts?: OptsType): IValueElementNode<ValueType>;
                containsValue(text: ValueType, opts?: OptsType): IValueElementNode<ValueType>;
                not: Omit<IWaitValue<ValueType, IWDIOParamsInterval>, 'not'>;
            }
            interface ICheckValueCurrently<ValueType> {
                hasValue(value: ValueType): boolean;
                hasAnyValue(): boolean;
                containsValue(value: ValueType): boolean;
                not: Omit<ICheckValueCurrently<ValueType>, 'not'>;
            }
            interface ICheckValueEventually<ValueType> {
                hasValue(value: ValueType, opts?: IWDIOParamsInterval): boolean;
                hasAnyValue(opts?: IWDIOParamsInterval): boolean;
                containsValue(value: ValueType, opts?: IWDIOParamsInterval): boolean;
                not: Omit<ICheckValueEventually<ValueType>, 'not'>;
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
            text = "text",
            value = "value"
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
        type TestcaseStatus = 'passed' | 'failed' | 'broken' | 'unknown' | 'pending';
        type SpecStatus = 'passed' | 'failed' | 'unvalidated' | 'unknown' | 'pending';
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
            testId?: string;
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
export declare type Severity = Workflo.Severity;
export declare type TestcaseStatus = Workflo.TestcaseStatus;
export declare type SpecStatus = Workflo.SpecStatus;
export * from './lib/steps';
import * as objectFunctions from './lib/utility_functions/object';
import * as arrayFunctions from './lib/utility_functions/array';
import * as classFunctions from './lib/utility_functions/class';
import * as stringFunctions from './lib/utility_functions/string';
export { objectFunctions, arrayFunctions, classFunctions, stringFunctions };
export { pageObjects };
import Kiwi from './lib/Kiwi';
export { Kiwi };
export interface Error {
    stack?: string;
}
/**
 * Timeouts in milliseconds.
 */
export interface ITimeouts {
    [key: string]: number;
    default?: number;
}
/**
 * Intervals in milliseconds.
 */
export interface IIntervals {
    [key: string]: number;
    default?: number;
}
export interface ICountAndPercentage {
    count?: number;
    percentage?: string;
}
export interface IPrintObject {
    'Spec Files': number;
    'Testcase Files': number;
    'Manual Result Files': number;
    Features: number;
    Specs: number;
    Suites: number;
    Testcases: number;
    'Manual Results (Specs)': number;
    'Defined Spec Criteria': ICountAndPercentage;
    'Automated Criteria': ICountAndPercentage;
    'Manual Criteria': ICountAndPercentage;
    'Uncovered Criteria': ICountAndPercentage;
    'Uncovered Criteria Object': ICountAndPercentage;
}
export interface ICapabilities extends DesiredCapabilities {
    [key: string]: any;
}
export interface ICallbackConfig extends IWorkfloCallbackConfig, IWorkfloCommonConfig, Options {
}
export interface IWorkfloCommonConfig {
    /**
     * Root directory for all test artifacts of wdio-workflo.
     */
    testDir: string;
    /**
     * http(s).Agent instance to use
     *
     * @default new http(s).Agent({ keepAlive: true })
     */
    agent?: Object;
    /**
     * An HTTP proxy to be used. Supports proxy Auth with Basic Auth, identical to support for the url
     * parameter (by embedding the auth info in the uri)
     *
     * @default undefined (no proxy used)
     */
    proxy?: String;
    /**
     * Path to the uidStore.json file which is used to generate unique ids during test execution.
     *
     * The generated ids will be preversed for future test runs until the uidStore.json file is deleted.
     */
    uidStorePath: string;
    /**
     * Arguments for start command of selenium-standalone service.
     *
     * @default {}
     */
    seleniumStartArgs?: StartOpts;
    /**
     * Arguments for install command of selenium-standalone service.
     *
     * @default {}
     */
    seleniumInstallArgs?: InstallOpts;
    /**
     * A key-value store of query parameters to be added to every selenium request.
     *
     * @default {}
     */
    queryParams?: Object;
    /**
     * A key-value store of headers to be added to every selenium request. Values must be strings.
     *
     * @default {}
     */
    headers?: Object;
    /**
     * Options for allure report.
     */
    allure?: {
        /**
         * Pattern used to create urls for issues and bugs.
         *
         * '%s' in pattern will be replaced with issue/bug keys defined in Story options.
         *
         * @example "http://example.com/jira/browse/%s"
         */
        issueTrackerPattern?: string;
        /**
         * Pattern used to create urls for testcase management system.
         *
         * '%s' in pattern will be replaced with testId keys defined in Story options.
         *
         * @example "http://example.com/tms/browse/%s"
         */
        testManagementPattern?: string;
        /**
         * Will be prepended to issue keys displayed in allure report.
         * This can be useful as allure report provides no way to distinct issues and bugs by default.
         */
        issuePrefix?: string;
        /**
         * Will be appended to issue keys displayed in allure report.
         * This can be useful as allure report provides no way to distinct issues and bugs by default.
         */
        issueAppendix?: string;
        /**
         * Will be prepended to bug keys displayed in allure report.
         * This can be useful as allure report provides no way to distinct issues and bugs by default.
         */
        bugPrefix?: string;
        /**
         * Will be appended to bug keys displayed in allure report.
         * This can be useful as allure report provides no way to distinct issues and bugs by default.
         */
        bugAppendix?: string;
    };
    /**
     * Log level output in spec reporter console.
     *
     * @default testcases
     */
    consoleLogLevel?: 'results' | 'testcases' | 'steps';
    /**
     * If set to true, will output errors and validation failures immediatly.
     *
     * @default false
     */
    reportErrorsInstantly?: boolean;
    /**
   * Defines how many times a testcase should be rerun if it did not pass.
   * The current testcase will be aborted on the first error or failed expectation
   * and rerun <retries> times.
   *
   * @default 0
   */
    retries?: number;
}
export interface IWorkfloCallbackConfig {
    /**
     * Defines which testcase files should run. The pattern is relative to the directory
     * from which `wdio-workflo` was called.
     *
     * Corresponds to the "testcaseFiles" config option in the workflo config file.
     */
    testcases?: string[];
    /**
     * Defines which spec files should run. The pattern is relative to the directory
     * from which `wdio-workflo` was called.
     *
     * Corresponds to the "specFiles" config option in the workflo config file.
     */
    specs?: string[];
    /**
     * Path where the testinfo.json file resides.
     */
    testInfoFilePath: string;
    /**
     * Path where results for the currently active browser are stored.
     */
    resultsPath: string;
    /**
     * Path to the file that contains the name of the folder which stores the results of the latest test run.
     */
    latestRunPath: string;
    /**
     * Name of the browser used to run the current tests.
     */
    browser: string;
    /**
     * Date and time when the current test run was launched.
     */
    dateTime: string;
    /**
     * Path to the json file that stores the merged results of all previous test runs and the current test run.
     */
    mergedResultsPath: string;
    /**
     * Path where the spec reporter console report of the current test run is stored.
     */
    consoleReportPath: string;
    /**
     * Path where the merged results of all previous test runs and the current test run are stored for allure.
     */
    mergedAllureResultsPath: string;
    /**
     * Information about spec criteria of current test run.
     * Used internally by wdio-workflo.
     */
    criteriaAnalysis: IAnalysedCriteria;
    /**
     * Filters used by wdio-workflo to determine which tests and specs to execute.
     * Filters include specFiles, testcaseFiles, features, specs, testcases, suites, manualResultFiles and manualSpecs.
     */
    executionFilters: IExecutionFilters;
    /**
     * Parsing results of testcases and spec files used internally by wdio-workflo
     * to link specs and testcases.
     */
    parseResults: IParseResults;
    /**
     * Information used to trace which testcases validate which specs and which
     * specs are validated in which testcases.
     * Used internally by wdio-workflo.
     */
    traceInfo: ITraceInfo;
    /**
     * Data used by wdio-workflo to output the results and statistics of a test run.
     */
    printObject: IPrintObject;
}
export interface IWorkfloConfig extends IWorkfloCommonConfig {
    /**
     * Set a base URL in order to shorten url command calls. If your `url` parameter starts
     * with `/`, the base url gets prepended, not including the path portion of your baseUrl.
     * If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
     * gets prepended directly.
     */
    baseUrl: string;
    /**
     * Protocol to use when communicating with the Selenium standalone server (or driver)
     * @default http
     */
    protocol?: string;
    /**
     * Host of your WebDriver server.
     * @default 127.0.0.1
     */
    host?: string;
    /**
     * Port your WebDriver server is on.
     * @default 4444
     */
    port?: number;
    /**
     * Path to WebDriver server.
     * @default  /wd/hub
     */
    path?: string;
    /**
     * WebdriverIO supports Sauce Labs, Browserstack and Testing Bot (other cloud providers
     * should work too though). These services define specific user and key (or access key)
     * values you need to put in here in order to connect to these services.
     *
     * @default undefined
     */
    user?: string;
    /**
     * WebdriverIO supports Sauce Labs, Browserstack and Testing Bot (other cloud providers
     * should work too though). These services define specific user and key (or access key)
     * values you need to put in here in order to connect to these services.
     *
     * @default undefined
     */
    key?: string;
    /**
     * Width of the browser window in pixels.
     */
    width: number;
    /**
     * Height of the browser window in pixels.
     */
    height: number;
    /**
     * Defines the capabilities you want to run in your Selenium session.
     * See https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities for a list of the available capabilities.
     *
     * Please be aware that wdio-workflo's reporting only supports one single instance at a time.
     * Therefore, the "maxInstance" property will always be set to 1.
     */
    capabilities: ICapabilities;
    /**
     * Webdriverio Services to run for test execution.
     *
     * See http://webdriver.io/guide for more information.
     *
     * @default ['selenium-standalone']
     */
    services?: string[];
    /**
     * If set to true, Node debugging via the chrome extension "Node-Inspector Manager" is enabled.
     * The test process will then automatically connect to chrome's dedicated dev tools and break on
     * "debugger" statements.
     *
     * In order for this to work properly, a chrome browser must be installed on the system
     * and the chrome extension "Node-Inspector Manager" needs to be installed.
     *
     * Sometimes tests might hang after running with debug enabled.
     * In this case, close all chrome processes, open a new chrome window,
     * turn "Node-Inspector Menu" from "Auto" to "Manual" and again to "Auto"
     * and then restarting the tests should resolve the problem.
     *
     * The following settings are recommended for the "Node-Inspector Manager" extension:
     *
     * (Main Menu)
     * - Host: localhost
     * - Port: 9229
     * - Open DevTools: "Auto"
     *
     * (Settings Menu)
     * - Open in new Window: On
     * - Switch to inspector-window: On
     * - Close automatically: On
     * - Choose DevTools Version: On (default version)
     *
     * @default false
     */
    debug?: boolean;
    /**
     * Execution arguments for the node process.
     * If using the debug option, execArgv will always be overwritten with the value ['--inspect']
     */
    execArgv?: string[];
    /**
     * Outputs selenium commands in the allure report if set to true.
     *
     * @default true
     */
    debugSeleniumCommand?: boolean;
    /**
     * Skip future testcases after specific amount of already executed testcases have failed.
     * By default, does not bail.
     *
     * @default 0
     */
    bail?: number;
    /**
     * Timeout for any request to the Selenium server in milliseconds.
     *
     * @default 90000
     */
    connectionRetryTimeout?: number;
    /**
     * Count of request retries to the Selenium server.
     *
     * @default 3
     */
    connectionRetryCount?: number;
    /**
     * Timeouts (for waitXXX and eventuallyXXX actions) in milliseconds.
     *
     * "default" property will be used for every waitXXX and eventuallyXXX action
     * if not explicitly stated otherwise.
     *
     * @default {default: 5000}
     */
    timeouts?: ITimeouts;
    /**
     * Intervals (for waitXXX and eventuallyXXX actions) in milliseconds.
     *
     * "default" property will be used for every waitXXX and eventuallyXXX action
     * if not explicitly stated otherwise.
     *
     * @default {default: 500}
     */
    intervals?: IIntervals;
    /**
     * Defines which testcase files should run. The pattern is relative to the directory
     * from which `wdio-workflo` was called.
     */
    testcaseFiles?: string[];
    /**
     * Defines which spec files should run. The pattern is relative to the directory
     * from which `wdio-workflo` was called.
     */
    specFiles?: string[];
    /**
     * Defines which manual testcase result files should run. The pattern is relative to the directory
     * from which `wdio-workflo` was called.
     */
    manualResultFiles?: string[];
    /**
     * Restricts test execution to the testcases, specs, testcaseFiles, specFiles and lists defined within these files.
     * The pattern is relative to the directory from which `wdio-workflo` was called.
     */
    listFiles?: string[];
    /**
     * Restricts test execution to these testcases.
     *
     * @example
     * ["Suite1", "Suite2.Testcase1"] => execute all testcases of Suite1 and Testcase1 of Suite2
     * ["Suite2", "-Suite2.Testcase2"] => execute all testcases of Suite2 except for Testcase2
     */
    testcases?: string[];
    /**
     * Restricts test execution to these features.
     *
     * @example
     * ["Login", "Logout"] => execute all testcases which validate specs defined within these features
     * ["-Login"] => execute all testcases except those which validate specs defined within these features
     */
    features?: string[];
    /**
     * Restricts test execution to these specs.
     *
     * @example
     * ["3.2"] => execute all testcases which validate spec 3.2
     * ["1.1*", "-1.1.2.4"] => 1.1* includes spec 1.1 and all of its sub-specs (eg. 1.1.2), -1.1.2.4 excludes spec 1.1.2.4
     * ["1.*"] => 1.* excludes spec 1 itself but includes of of its sub-specs
     */
    specs?: string[];
    /**
     * Restricts specs by status of their criteria set during their last execution.
     *
     * @example
     * ["passed", "failed", "broken", "unvalidated", "unknown"] => these are all available status - combine as you see fit
     * ["faulty"] => faulty is a shortcut for failed, broken, unvalidated and unknown
     */
    specStatus?: (SpecStatus | 'faulty')[];
    /**
     * Restricts executed testcases by given status.
     *
     * @example
     * ["passed", "failed", "broken", "pending", "unknown"] => these are all available status - combine as you see fit
     * ["faulty"] => faulty is a shortcut for failed, broken and unknown
     */
    testcaseStatus?: (TestcaseStatus | 'faulty')[];
    /**
     * Restricts specs by severity set during their last execution.
     *
     * @example
     * ["blocker", "critical", "normal", "minor", "trivial"] => these are all available severities - combine as you see fit
     */
    specSeverity?: Severity[];
    /**
     * Restricts testcases by severity set during their last execution.
     *
     * @example
     * ["blocker", "critical", "normal", "minor", "trivial"] => these are all available severities - combine as you see fit
     */
    testcaseSeverity?: Severity[];
    /**
     * Restricts testcases and specs (oldest spec criteria) by given date and time (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss).
     *
     * @example
   * ["(2017-03-10,2017-10-28)"] => restricts by status set between 2017-03-10 and 2017-10-28 (both at 0 pm, 0 min, 0 sec)
     * ["2017-07-21", "2017-07-22T14:51:13"] => restricts by last status set on 2017-07-21 or 2017-07-22 at 2 pm, 51 min, 13 sec
     */
    dates?: string[];
    /**
     * Do not run automatic testcases and consider only manual results.
     */
    manualOnly?: boolean;
    /**
     * Run only automatic testcases and do not consider manual results.
     */
    automaticOnly?: boolean;
    /**
     * Gets executed once before all workers get launched.
     * @param {ICallbackConfig} config wdio-workflo configuration object
     * @param {Array.<ICapabilities>} capabilities list of capabilities details
     */
    onPrepare?<T>(config: ICallbackConfig, capabilities: ICapabilities[]): Promise<T> | void;
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or testcase.
     *
     * This callback is only invoked during the "testcases" phase.
     *
     * @param {ICallbackConfig} config wdio-workflo configuration object
     * @param {Array.<ICapabilities>} capabilities list of capabilities details
     * @param {Array.<String>} testcaseFiles List of testcases file paths that are to be run
     */
    beforeSession?<T>(config: ICallbackConfig, capabilities: ICapabilities[], testcaseFiles: string[]): Promise<T> | void;
    /**
     * Gets executed before testcases execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     *
     * This callback is only invoked during the "testcases" phase.
     *
     * @param {Array.<ICapabilities>} capabilities list of capabilities details
     * @param {Array.<String>} testcaseFiles List of testcases file paths that are to be run
     */
    before?<T>(capabilities: ICapabilities[], testcaseFiles: string[]): Promise<T> | void;
    /**
     * Hook that gets executed before the suite starts
     * @param {Suite} suite suite details
     */
    beforeSuite?<T>(suite: Suite): Promise<T> | void;
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Jasmine)
     */
    beforeHook?<T>(): Promise<T> | void;
    /**
     * Hook that gets executed _after_ a hook within the suite ends (e.g. runs after calling
     * afterEach in Jasmine)
     */
    afterHook?<T>(): Promise<T> | void;
    /**
     * Function to be executed before a testcase starts.
     * @param {Test} test test details
     */
    beforeTest?<T>(test: Test): Promise<T> | void;
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    beforeCommand?<T>(commandName: string, args: any[]): Promise<T> | void;
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Error} error error object if any
     */
    afterCommand?<T>(commandName: string, args: any[], result: number, error: Error): Promise<T> | void;
    /**
     * Function to be executed after a testcase ends.
     * @param {Test} test test details
     */
    afterTest?<T>(test: Test): Promise<T> | void;
    /**
     * Hook that gets executed after the suite has ended
     * @param {Suite} suite suite details
     */
    afterSuite?<T>(suite: Suite): Promise<T> | void;
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<ICapabilities>} capabilities list of capabilities details
     * @param {Array.<String>} testcaseFiles List of testcases file paths that ran
     */
    after?<T>(result: number, capabilities: ICapabilities[], testcaseFiles: string[]): Promise<T> | void;
    /**
     * Gets executed right after terminating the webdriver session.
     *
     * This callback is only invoked during the "testcases" phase.
     *
     * @param {ICallbackConfig} config wdio-workflo configuration object
     * @param {Array.<ICapabilities>} capabilities list of capabilities details
     * @param {Array.<String>} testcaseFiles List of testcases file paths that ran
     */
    afterSession?<T>(config: ICallbackConfig, capabilities: ICapabilities, testcaseFiles: string[]): Promise<T> | void;
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     *
     * This callback is only invoked during the "testcases" phase.
     *
     * @param {Array.<ICapabilities>} capabilities list of capabilities details
     * @param {Array.<String>} specFiles List of spec file paths that are to be run
     */
    beforeValidator?<T>(capabilities: ICapabilities[], specFiles: string[]): Promise<T> | void;
    /**
    * Gets executed after all tests are done. You still have access to all global variables from
    * the test.
    * @param {Number} result 0 - test pass, 1 - test fail
    * @param {Array.<ICapabilities>} capabilities list of capabilities details
    * @param {Array.<String>} specFiles List of spec file paths that ran
    */
    afterValidator?<T>(result: number, capabilities: ICapabilities[], specFiles: string[]): Promise<T> | void;
    /**
     * Gets executed after all workers got shut down and the process is about to exit.
     * @param {Number} exitCode 0 - success, 1 - fail
     * @param {ICallbackConfig} config wdio-workflo configuration object
     * @param {Array.<ICapabilities>} capabilities list of capabilities details
     */
    onComplete?<T>(exitCode: number, config: ICallbackConfig, capabilities: ICapabilities[]): Promise<T> | void;
    /**
    * Gets executed when an error happens, good place to take a screenshot
    * @ {Error} error
    */
    onError?<T>(error: Error): Promise<T> | void;
}
