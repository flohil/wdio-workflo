/// <reference types="jasmine" />
/// <reference types="jasmine-expect" />
import { elements, stores } from './page_objects';
declare type WithoutExpected = 'element' | 'list' | 'map' | 'group';
export interface IMatcherArgs<NodeType extends Workflo.PageNode.INode, ExpectedType, OptsType> {
    resultFunc: ResultFunction<NodeType, OptsType, ExpectedType>;
    errorTextFunc: ErrorTextFunction<NodeType, OptsType, ExpectedType>;
}
export interface IResultFuncArgs<NodeType extends Workflo.PageNode.INode, OptsType, ExpectedType> {
    node: NodeType;
    expected: ExpectedType;
    opts: OptsType;
}
export interface IResultFuncWithoutExpected<NodeType extends Workflo.PageNode.INode, OptsType> {
    node: NodeType;
    opts: OptsType;
}
export declare type ResultFunctionResult = () => boolean;
export declare type ResultFunction<NodeType extends Workflo.PageNode.INode, OptsType, ExpectedType> = (args: IResultFuncArgs<NodeType, OptsType, ExpectedType>) => ResultFunctionResult[];
export declare type ResultWithoutExpectedFunction<NodeType extends Workflo.PageNode.INode, OptsType> = (args: IResultFuncWithoutExpected<NodeType, OptsType>) => ResultFunctionResult[];
export interface ErrorFuncArgs<NodeType extends Workflo.PageNode.INode, OptsType, ExpectedType> {
    actual: string;
    expected: ExpectedType;
    node: NodeType;
    opts: OptsType;
}
export interface ErrorFuncWithoutExpected<NodeType extends Workflo.PageNode.INode, OptsType> {
    actual: string;
    node: NodeType;
    opts: OptsType;
}
export declare type ErrorTextFunction<NodeType extends Workflo.PageNode.INode, OptsType, ExpectedType> = (args: ErrorFuncArgs<NodeType, OptsType, ExpectedType>) => string[];
export declare type ErrorTextWithoutExpectedFunction<NodeType extends Workflo.PageNode.INode, OptsType> = (args: ErrorFuncWithoutExpected<NodeType, OptsType>) => string[];
export interface ICompareElementFuncs<ElementExpectedType = never, ListExpectedType = never, MapExpectedType = never, GroupExpectedType = never> {
    element?: IMatcherArgs<elements.PageElement<stores.PageElementStore>, ElementExpectedType, never>;
    list?: IMatcherArgs<elements.PageElementList<stores.PageElementStore, elements.PageElement<stores.PageElementStore>, elements.IPageElementOpts<stores.PageElementStore>>, ListExpectedType, Workflo.PageNode.ListFilterMask>;
    map?: IMatcherArgs<elements.PageElementMap<stores.PageElementStore, string, elements.PageElement<stores.PageElementStore>, elements.IPageElementOpts<stores.PageElementStore>>, MapExpectedType, Workflo.PageNode.MapFilterMask<string>>;
    group?: IMatcherArgs<elements.PageElementGroup<stores.PageElementStore, Workflo.PageNode.GroupContent>, GroupExpectedType, Workflo.PageNode.GroupFilterMask<Workflo.PageNode.GroupContent>>;
}
export interface ICompareEventuallyElementFuncs<ElementExpectedType = undefined, ListExpectedType = undefined, MapExpectedType = undefined, GroupExpectedType = undefined> {
    element?: IMatcherArgs<elements.PageElement<stores.PageElementStore>, ElementExpectedType, Workflo.IWDIOParamsInterval>;
    list?: IMatcherArgs<elements.PageElementList<stores.PageElementStore, elements.PageElement<stores.PageElementStore>, elements.IPageElementOpts<stores.PageElementStore>>, ListExpectedType, Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask>;
    map?: IMatcherArgs<elements.PageElementMap<stores.PageElementStore, string, elements.PageElement<stores.PageElementStore>, elements.IPageElementOpts<stores.PageElementStore>>, MapExpectedType, Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<string>>;
    group?: IMatcherArgs<elements.PageElementGroup<stores.PageElementStore, Workflo.PageNode.GroupContent>, GroupExpectedType, Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Workflo.PageNode.GroupContent>>;
}
export interface ICompareValueElementFuncs<ElementValueType = any, ListValueType = any | any[], MapValueType = Partial<Record<string, any>>, GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>> {
    element?: IMatcherArgs<elements.ValuePageElement<stores.PageElementStore, ElementValueType>, ElementValueType, never>;
    list?: IMatcherArgs<elements.ValuePageElementList<stores.PageElementStore, elements.ValuePageElement<stores.PageElementStore, ElementValueType>, elements.IValuePageElementOpts<stores.PageElementStore>, ElementValueType>, ListValueType, Workflo.PageNode.ListFilterMask>;
    map?: IMatcherArgs<elements.ValuePageElementMap<stores.PageElementStore, string, elements.ValuePageElement<stores.PageElementStore, ElementValueType>, elements.IPageElementOpts<stores.PageElementStore>, ElementValueType>, MapValueType, Workflo.PageNode.MapFilterMask<string>>;
    group?: IMatcherArgs<elements.ValuePageElementGroup<stores.PageElementStore, Workflo.PageNode.GroupContent>, GroupValueType, Workflo.PageNode.GroupFilterMask<Workflo.PageNode.GroupContent>>;
}
export interface ICompareEventuallyValueElementFuncs<ElementValueType = any, ListValueType = any | any[], MapValueType = Partial<Record<string, any>>, GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>> {
    element?: IMatcherArgs<elements.ValuePageElement<stores.PageElementStore, ElementValueType>, ElementValueType, Workflo.IWDIOParamsInterval>;
    list?: IMatcherArgs<elements.ValuePageElementList<stores.PageElementStore, elements.ValuePageElement<stores.PageElementStore, ElementValueType>, elements.IValuePageElementOpts<stores.PageElementStore>, ElementValueType>, ListValueType, Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask>;
    map?: IMatcherArgs<elements.ValuePageElementMap<stores.PageElementStore, string, elements.ValuePageElement<stores.PageElementStore, ElementValueType>, elements.IPageElementOpts<stores.PageElementStore>, ElementValueType>, MapValueType, Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<string>>;
    group?: IMatcherArgs<elements.ValuePageElementGroup<stores.PageElementStore, Workflo.PageNode.GroupContent>, GroupValueType, Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Workflo.PageNode.GroupContent>>;
}
export declare function createMatcher<OptsType extends Object = Object, CompareFuncsType extends (ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType> | ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>) = ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>, ElementExpectedType = never, ListExpectedType = never, MapExpectedType = never, GroupExpectedType = never>(compareFuncs: CompareFuncsType, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createMatcherWithoutExpected<OptsType extends Object = Object>(compareFuncs: ICompareElementFuncs, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyMatcher<OptsType extends Object = Workflo.IWDIOParamsInterval>(compareFuncs: ICompareEventuallyElementFuncs): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyMatcherWithoutExpected<OptsType extends Object = Workflo.IWDIOParamsInterval>(compareFuncs: ICompareEventuallyElementFuncs, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createTextMatcher<OptsType extends Object = Object, ElementExpectedType = string, ListExpectedType = string | string[], MapExpectedType = Record<string, string>, GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createTextMatcherWithoutExpected<OptsType extends Object = Object, ElementExpectedType = string, ListExpectedType = string | string[], MapExpectedType = Record<string, string>, GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyTextMatcher<OptsType extends Object = Workflo.IWDIOParamsInterval, ElementExpectedType = string, ListExpectedType = string | string[], MapExpectedType = Record<string, string>, GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyTextMatcherWithoutExpected<OptsType extends Object = Workflo.IWDIOParamsInterval, ElementExpectedType = string, ListExpectedType = string | string[], MapExpectedType = Record<string, string>, GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createBooleanMatcher<OptsType extends Object = Object, ElementExpectedType = boolean, ListExpectedType = boolean | boolean[], MapExpectedType = Record<string, boolean>, GroupExpectedType = Workflo.PageNode.ExtractBoolean<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createBooleanMatcherWithoutExpected<OptsType extends Object = Object, ElementExpectedType = boolean, ListExpectedType = boolean | boolean[], MapExpectedType = Record<string, boolean>, GroupExpectedType = Workflo.PageNode.ExtractBoolean<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyBooleanMatcher<OptsType extends Object = Workflo.IWDIOParamsInterval, ElementExpectedType = boolean, ListExpectedType = boolean | boolean[], MapExpectedType = Record<string, boolean>, GroupExpectedType = Workflo.PageNode.ExtractBoolean<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyBooleanMatcherWithoutExpected<OptsType extends Object = Workflo.IWDIOParamsInterval, ElementExpectedType = boolean, ListExpectedType = boolean | boolean[], MapExpectedType = Record<string, boolean>, GroupExpectedType = Workflo.PageNode.ExtractBoolean<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createValueMatcher<OptsType extends Object = Object, ElementValueType = any, ListValueType = any | any[], MapValueType = Partial<Record<string, any>>, GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createValueMatcherWithoutExpected<OptsType extends Object = Object, ElementValueType = any, ListValueType = any | any[], MapValueType = Partial<Record<string, any>>, GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyValueMatcher<OptsType extends Object = Workflo.IWDIOParamsInterval, ElementValueType = any, ListValueType = any | any[], MapValueType = Partial<Record<string, any>>, GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareEventuallyValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyValueMatcherWithoutExpected<OptsType extends Object = Workflo.IWDIOParamsInterval, ElementValueType = any, ListValueType = any | any[], MapValueType = Partial<Record<string, any>>, GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareEventuallyValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createBaseMessage<Store extends stores.PageElementStore, NodeType extends elements.PageElement<Store>>(node: NodeType, errorTexts: string | string[]): string[];
export declare function createMessage<Store extends stores.PageElementStore, NodeType extends elements.PageElement<Store>>(node: NodeType, errorTexts: string | string[]): string[];
export declare function createEventuallyMessage<Store extends stores.PageElementStore, NodeType extends elements.PageElement<Store>>(node: NodeType, errorTexts: string | string[], timeout: number): string[];
export declare function createPropertyMessage<Store extends stores.PageElementStore, NodeType extends elements.PageElement<Store>, ExpectedType = string>(node: NodeType, property: string, comparison: string, actual: string, expected: ExpectedType): string[];
export declare function createEventuallyPropertyMessage<Store extends stores.PageElementStore, NodeType extends elements.PageElement<Store>, ExpectedType = string>(node: NodeType, property: string, comparison: string, actual: string, expected: ExpectedType, timeout: number): string[];
export declare function createEachMessage<Store extends stores.PageElementStore, PageElementType extends elements.PageElement<Store>, PageElementOptions extends elements.IPageElementOpts<Store>, K extends string, Content extends Workflo.PageNode.GroupContent, NodeType extends elements.PageElementList<Store, PageElementType, PageElementOptions> | elements.PageElementMap<Store, K, PageElementType, PageElementOptions> | elements.PageElementGroup<Store, Content>>(node: NodeType, errorTexts: string | string[]): string[];
export declare function createEventuallyEachMessage<Store extends stores.PageElementStore, PageElementType extends elements.PageElement<Store>, PageElementOptions extends elements.IPageElementOpts<Store>, K extends string, Content extends Workflo.PageNode.GroupContent, NodeType extends elements.PageElementList<Store, PageElementType, PageElementOptions> | elements.PageElementMap<Store, K, PageElementType, PageElementOptions> | elements.PageElementGroup<Store, Content>>(node: NodeType, errorTexts: string | string[], timeout: number): string[];
export declare const elementMatchers: jasmine.CustomMatcherFactories;
export declare const valueElementMatchers: jasmine.CustomMatcherFactories;
export declare function expectElement<Store extends stores.PageElementStore, PageElementType extends elements.PageElement<Store>>(element: PageElementType): jasmine.Matchers<PageElementType>;
export declare function expectList<Store extends stores.PageElementStore, PageElementType extends elements.PageElement<Store>, PageElementOptions, PageElementListType extends elements.PageElementList<Store, PageElementType, PageElementOptions>>(list: PageElementListType): jasmine.Matchers<PageElementListType>;
export declare function expectMap<Store extends stores.PageElementStore, K extends string, PageElementType extends elements.PageElement<Store>, PageElementOptions, PageElementMapType extends elements.PageElementMap<Store, K, PageElementType, PageElementOptions>>(map: PageElementMapType): jasmine.Matchers<PageElementMapType>;
export declare function expectGroup<Store extends stores.PageElementStore, Content extends {
    [K in keyof Content]: Workflo.PageNode.INode;
}, PageElementGroupType extends elements.PageElementGroup<Store, Content>>(group: PageElementGroupType): jasmine.Matchers<PageElementGroupType>;
export {};
