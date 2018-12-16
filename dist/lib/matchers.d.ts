/// <reference types="jasmine" />
/// <reference types="jasmine-expect" />
import { elements, stores } from './page_objects';
export interface IMatcherArgs<NodeType extends Workflo.PageNode.INode, ExpectedType, OptsType extends {
    timeout?: number;
} = {
    timeout?: number;
}> {
    resultFunc: ResultFunction<NodeType, OptsType, ExpectedType>;
    errorTextFunc: ErrorTextFunction<NodeType, OptsType, ExpectedType>;
}
export interface IResultFuncArgs<NodeType extends Workflo.PageNode.INode, OptsType, ExpectedType> {
    node: NodeType;
    expected?: ExpectedType;
    opts?: OptsType;
}
export interface IResultFuncWithoutExpected<NodeType extends Workflo.PageNode.INode, OptsType> {
    node: NodeType;
    opts?: OptsType;
}
export declare type ResultFunctionResult = () => boolean;
export declare type ResultFunction<NodeType extends Workflo.PageNode.INode, OptsType, ExpectedType> = (args: IResultFuncArgs<NodeType, OptsType & {
    timeout?: number;
}, ExpectedType>) => ResultFunctionResult[];
export declare type ResultWithoutExpectedFunction<NodeType extends Workflo.PageNode.INode, OptsType> = (args: IResultFuncWithoutExpected<NodeType, OptsType & {
    timeout?: number;
}>) => ResultFunctionResult[];
export interface ErrorFuncArgs<NodeType extends Workflo.PageNode.INode, OptsType, ExpectedType> {
    actual: string;
    expected?: ExpectedType;
    node?: NodeType;
    opts?: OptsType;
}
export interface ErrorFuncWithoutExpected<NodeType extends Workflo.PageNode.INode, OptsType> {
    actual: string;
    node?: NodeType;
    opts?: OptsType;
}
export declare type ErrorTextFunction<NodeType extends Workflo.PageNode.INode, OptsType, ExpectedType> = (args: ErrorFuncArgs<NodeType, OptsType & {
    timeout?: number;
}, ExpectedType>) => string[];
export declare type ErrorTextWithoutExpectedFunction<NodeType extends Workflo.PageNode.INode, OptsType> = (args: ErrorFuncWithoutExpected<NodeType, OptsType & {
    timeout?: number;
}>) => string[];
export interface ICompareElementFuncs<ElementExpectedType = undefined, ListExpectedType = undefined, MapExpectedType = undefined, GroupExpectedType = undefined> {
    element?: IMatcherArgs<elements.PageElement<stores.PageElementStore>, ElementExpectedType, Workflo.IWDIOParamsOptional>;
    list?: IMatcherArgs<elements.PageElementList<stores.PageElementStore, elements.PageElement<stores.PageElementStore>, elements.IPageElementOpts<stores.PageElementStore>>, ListExpectedType, Workflo.IWDIOParamsOptional>;
    map?: IMatcherArgs<elements.PageElementMap<stores.PageElementStore, string, elements.PageElement<stores.PageElementStore>, elements.IPageElementOpts<stores.PageElementStore>>, MapExpectedType, Workflo.IWDIOParamsOptional & {
        filterMask?: Partial<Record<string, true>>;
    }>;
    group?: IMatcherArgs<elements.PageElementGroup<stores.PageElementStore, {
        [key: string]: Workflo.PageNode.INode;
    }>, GroupExpectedType, Workflo.IWDIOParamsOptional & {
        filterMask?: Workflo.PageNode.ExtractBoolean<{
            [key: string]: Workflo.PageNode.INode;
        }>;
    }>;
}
export declare function matcher<OptsType extends Object = Workflo.IWDIOParamsOptional, ElementExpectedType = undefined, ListExpectedType = undefined, MapExpectedType = undefined, GroupExpectedType = undefined>(compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>, withoutExpected?: boolean): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function matcherWithoutExpected<OptsType extends Object = Workflo.IWDIOParamsOptional, ElementExpectedType = undefined, ListExpectedType = undefined, MapExpectedType = undefined, GroupExpectedType = undefined>(compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function booleanMatcherWithoutExpected<OptsType extends Object = Workflo.IWDIOParamsOptional>(compareFuncs: ICompareElementFuncs<undefined, undefined, undefined, undefined>): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createBaseMessage(node: Workflo.PageNode.INode, errorTexts: string | string[]): string[];
export declare function createPropertyMessage(node: Workflo.PageNode.INode, property: string, comparison: string, actual: string, expected: string): string[];
export declare function createEventuallyPropertyMessage(node: Workflo.PageNode.INode, property: string, comparison: string, actual: string, expected: string, timeout: number): string[];
export declare function createEachMessage(node: Workflo.PageNode.INode, errorTexts: string | string[]): string[];
export declare function createEventuallyEachMessage(node: Workflo.PageNode.INode, errorTexts: string | string[], timeout: number): string[];
export declare const elementMatchers: jasmine.CustomMatcherFactories;
export declare const valueElementMatchers: jasmine.CustomMatcherFactories;
export declare function expectElement<Store extends stores.PageElementStore, PageElementType extends elements.PageElement<Store>>(element: PageElementType): jasmine.Matchers<PageElementType>;
export declare function expectList<Store extends stores.PageElementStore, PageElementType extends elements.PageElement<Store>, PageElementOptions, PageElementListType extends elements.PageElementList<Store, PageElementType, PageElementOptions>>(list: PageElementListType): jasmine.Matchers<PageElementListType>;
export declare function expectMap<Store extends stores.PageElementStore, K extends string, PageElementType extends elements.PageElement<Store>, PageElementOptions, PageElementMapType extends elements.PageElementMap<Store, K, PageElementType, PageElementOptions>>(map: PageElementMapType): jasmine.Matchers<PageElementMapType>;
export declare function expectGroup<Store extends stores.PageElementStore, Content extends {
    [K in keyof Content]: Workflo.PageNode.INode;
}, PageElementGroupType extends elements.PageElementGroup<Store, Content>>(group: PageElementGroupType): jasmine.Matchers<PageElementGroupType>;
