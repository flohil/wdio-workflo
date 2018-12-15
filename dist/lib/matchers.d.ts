/// <reference types="jasmine" />
/// <reference types="jasmine-expect" />
import { elements, stores } from './page_objects';
import { PageElement, PageElementList, PageElementMap, PageElementGroup } from './page_objects/page_elements';
import { PageElementStore } from './page_objects/stores';
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
export interface ICompareElementFuncs {
    element?: <Store extends PageElementStore, PageElementType extends PageElement<Store>, ExpectedType, OptsType extends {
        timeout?: number;
    }>() => IMatcherArgs<PageElementType, ExpectedType, OptsType>;
    list?: <Store extends stores.PageElementStore, PageElementType extends PageElement<Store>, PageElementOptions, PageElementListType extends PageElementList<Store, PageElementType, PageElementOptions>, ExpectedType, OptsType extends {
        timeout?: number;
    }>() => IMatcherArgs<PageElementListType, ExpectedType, OptsType>;
    map?: <Store extends stores.PageElementStore, K extends string, PageElementType extends PageElement<Store>, PageElementOptions, PageElementMapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>, ExpectedType, OptsType extends {
        timeout?: number;
    }>() => IMatcherArgs<PageElementMapType, ExpectedType, OptsType>;
    group?: <Store extends stores.PageElementStore, Content extends {
        [K in keyof Content]: Workflo.PageNode.INode;
    }, PageElementGroupType extends PageElementGroup<Store, Content>, ExpectedType, OptsType extends {
        timeout?: number;
    }>() => IMatcherArgs<PageElementGroupType, ExpectedType, OptsType>;
}
export declare function createMatcher<NodeType extends Workflo.PageNode.INode, OptsType extends Object = {
    timeout?: number;
}, ExpectedType = string, CompareFuncType extends ICompareElementFuncs = ICompareElementFuncs>(compareFuncs: CompareFuncType, withoutExpected?: boolean): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: NodeType, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: NodeType, opts?: OptsType) => jasmine.CustomMatcherResult;
} | {
    compare: (node: NodeType, expected: ExpectedType, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: NodeType, expected: ExpectedType, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createMatcherWithoutExpected<NodeType extends Workflo.PageNode.INode, OptsType extends Object = {
    timeout?: number;
}>(compareFuncs: ICompareElementFuncs): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: NodeType, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: NodeType, opts?: OptsType) => jasmine.CustomMatcherResult;
} | {
    compare: (node: NodeType, expected: undefined, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: NodeType, expected: undefined, opts?: OptsType) => jasmine.CustomMatcherResult;
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
