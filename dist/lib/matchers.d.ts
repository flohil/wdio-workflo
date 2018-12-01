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
interface ErrorFuncArgs<OptsType, ExpectedType> {
    actual: string;
    expected?: ExpectedType;
    opts?: OptsType;
}
interface ErrorFuncNoArgs<OptsType> {
    actual: string;
    opts?: OptsType;
}
export declare type ErrorTextFunction<OptsType, ExpectedType> = (args: ErrorFuncArgs<OptsType & {
    timeout?: number;
}, ExpectedType>) => string | string[];
export declare type ErrorTextNoArgsFunction<OptsType> = (args: ErrorFuncNoArgs<OptsType & {
    timeout?: number;
}>) => string | string[];
export declare function matcherFunction<Store extends stores.PageElementStore, NodeType extends ElementOrList<Store>, OptsType extends Object = {
    timeout?: number;
}, ExpectedType = string>(resultFunction: ResultFunction<Store, NodeType, OptsType, ExpectedType>, errorTextFunction: ErrorTextFunction<OptsType, ExpectedType>, noArgs?: boolean): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: NodeType, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: NodeType, opts?: OptsType) => jasmine.CustomMatcherResult;
} | {
    compare: (node: NodeType, expected: ExpectedType, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: NodeType, expected: ExpectedType, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createLongErrorMessage(property: string, comparison: string, actual: string, expected: string): string[];
export declare function createEventuallyErrorMessage(property: string, comparison: string, actual: string, expected: string, timeout: number): string[];
export declare const elementMatchers: jasmine.CustomMatcherFactories;
export declare const listMatchers: jasmine.CustomMatcherFactories;
export declare const valueElementMatchers: jasmine.CustomMatcherFactories;
export declare function expectElement<Store extends stores.PageElementStore, PageElementType extends elements.PageElement<Store>>(element: PageElementType): jasmine.Matchers<PageElementType>;
export declare function expectList<Store extends stores.PageElementStore, PageElementType extends elements.PageElement<Store>, PageElementOptions, PageElemnetListType extends elements.PageElementList<Store, PageElementType, PageElementOptions>>(list: PageElemnetListType): jasmine.Matchers<PageElemnetListType>;
export {};
