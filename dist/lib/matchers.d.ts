/// <reference types="jasmine" />
/// <reference types="jasmine-expect" />
import { elements, stores } from './page_objects';
declare type ElementOrList<Store extends stores.PageElementStore> = elements.PageElement<Store> | elements.PageElementList<Store, elements.PageElement<Store>, Partial<elements.IPageElementOpts<Store>>>;
interface IResultFuncArgs<Store extends stores.PageElementStore, NodeType extends ElementOrList<Store>, OptsType, ExpectedType> {
    node: NodeType;
    expected?: ExpectedType;
    opts?: OptsType;
}
interface IResultFuncNoArgs<Store extends stores.PageElementStore, NodeType extends ElementOrList<Store>, OptsType> {
    node: NodeType;
    opts?: OptsType;
}
declare type ResultFunctionResult = () => boolean;
export declare type ResultFunction<Store extends stores.PageElementStore, NodeType extends ElementOrList<Store>, OptsType, ExpectedType> = (args: IResultFuncArgs<Store, NodeType, OptsType & {
    timeout?: number;
}, ExpectedType>) => ResultFunctionResult[];
export declare type ResultNoArgsFunction<Store extends stores.PageElementStore, NodeType extends ElementOrList<Store>, OptsType> = (args: IResultFuncNoArgs<Store, NodeType, OptsType & {
    timeout?: number;
}>) => ResultFunctionResult[];
interface ErrorFuncArgs<Store extends stores.PageElementStore, NodeType extends ElementOrList<Store>, OptsType, ExpectedType> {
    actual: string;
    expected?: ExpectedType;
    node?: NodeType;
    opts?: OptsType;
}
interface ErrorFuncNoArgs<Store extends stores.PageElementStore, NodeType extends ElementOrList<Store>, OptsType> {
    actual: string;
    node?: NodeType;
    opts?: OptsType;
}
export declare type ErrorTextFunction<Store extends stores.PageElementStore, NodeType extends ElementOrList<Store>, OptsType, ExpectedType> = (args: ErrorFuncArgs<Store, NodeType, OptsType & {
    timeout?: number;
}, ExpectedType>) => string[];
export declare type ErrorTextNoArgsFunction<Store extends stores.PageElementStore, NodeType extends ElementOrList<Store>, OptsType> = (args: ErrorFuncNoArgs<Store, NodeType, OptsType & {
    timeout?: number;
}>) => string[];
export declare function matcherFunction<Store extends stores.PageElementStore, NodeType extends ElementOrList<Store>, OptsType extends Object = {
    timeout?: number;
}, ExpectedType = string>(resultFunction: ResultFunction<Store, NodeType, OptsType, ExpectedType>, errorTextFunction: ErrorTextFunction<Store, NodeType, OptsType, ExpectedType>, noArgs?: boolean): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: NodeType, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: NodeType, opts?: OptsType) => jasmine.CustomMatcherResult;
} | {
    compare: (node: NodeType, expected: ExpectedType, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: NodeType, expected: ExpectedType, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createBaseMessage(node: Workflo.PageNode.INode, errorTexts: string | string[]): string[];
export declare function createPropertyMessage(node: Workflo.PageNode.INode, property: string, comparison: string, actual: string, expected: string): string[];
export declare function createEventuallyPropertyMessage(node: Workflo.PageNode.INode, property: string, comparison: string, actual: string, expected: string, timeout: number): string[];
export declare function createEachMessage(node: Workflo.PageNode.INode, errorTexts: string | string[]): string[];
export declare function createEventuallyEachMessage(node: Workflo.PageNode.INode, errorTexts: string | string[], timeout: number): string[];
export declare const elementMatchers: jasmine.CustomMatcherFactories;
export declare const listMatchers: jasmine.CustomMatcherFactories;
export declare const mapMatchers: jasmine.CustomMatcherFactories;
export declare const groupMatchers: jasmine.CustomMatcherFactories;
export declare const valueElementMatchers: jasmine.CustomMatcherFactories;
export declare const valueListMatchers: jasmine.CustomMatcherFactories;
export declare const valueMapMatchers: jasmine.CustomMatcherFactories;
export declare const valueGroupMatchers: jasmine.CustomMatcherFactories;
export declare function expectElement<Store extends stores.PageElementStore, PageElementType extends elements.PageElement<Store>>(element: PageElementType): jasmine.Matchers<PageElementType>;
export declare function expectList<Store extends stores.PageElementStore, PageElementType extends elements.PageElement<Store>, PageElementOptions, PageElementListType extends elements.PageElementList<Store, PageElementType, PageElementOptions>>(list: PageElementListType): jasmine.Matchers<PageElementListType>;
export declare function expectMap<Store extends stores.PageElementStore, K extends string, PageElementType extends elements.PageElement<Store>, PageElementOptions, PageElementMapType extends elements.PageElementMap<Store, K, PageElementType, PageElementOptions>>(map: PageElementMapType): jasmine.Matchers<PageElementMapType>;
export declare function expectGroup<Store extends stores.PageElementStore, Content extends {
    [K in keyof Content]: Workflo.PageNode.INode;
}, PageElementGroupType extends elements.PageElementGroup<Store, Content>>(group: PageElementGroupType): jasmine.Matchers<PageElementGroupType>;
export {};
