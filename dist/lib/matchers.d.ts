/// <reference types="jasmine" />
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
export interface ICompareElementFuncs<ElementExpectedType = never, ListExpectedType = never, MapExpectedType = never, GroupExpectedType = never, ElementOptsType = never, ListOptsType = Workflo.PageNode.ListFilterMask, MapOptsType = Workflo.PageNode.MapFilterMask<string>, GroupOptsType = Workflo.PageNode.GroupFilterMask<Workflo.PageNode.GroupContent>> {
    element?: IMatcherArgs<elements.PageElement<stores.PageElementStore>, ElementExpectedType, ElementOptsType>;
    list?: IMatcherArgs<elements.PageElementList<stores.PageElementStore, elements.PageElement<stores.PageElementStore>, elements.IPageElementOpts<stores.PageElementStore>>, ListExpectedType, ListOptsType>;
    map?: IMatcherArgs<elements.PageElementMap<stores.PageElementStore, string, elements.PageElement<stores.PageElementStore>, elements.IPageElementOpts<stores.PageElementStore>>, MapExpectedType, MapOptsType>;
    group?: IMatcherArgs<elements.PageElementGroup<stores.PageElementStore, Workflo.PageNode.GroupContent>, GroupExpectedType, GroupOptsType>;
}
export interface ICompareEventuallyElementFuncs<ElementExpectedType = never, ListExpectedType = never, MapExpectedType = never, GroupExpectedType = never, ElementOptsType = Workflo.ITimeoutInterval, ListOptsType = Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask, MapOptsType = Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<string>, GroupOptsType = Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Workflo.PageNode.GroupContent>> {
    element?: IMatcherArgs<elements.PageElement<stores.PageElementStore>, ElementExpectedType, Workflo.ITimeoutInterval>;
    list?: IMatcherArgs<elements.PageElementList<stores.PageElementStore, elements.PageElement<stores.PageElementStore>, elements.IPageElementOpts<stores.PageElementStore>>, ListExpectedType, Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask>;
    map?: IMatcherArgs<elements.PageElementMap<stores.PageElementStore, string, elements.PageElement<stores.PageElementStore>, elements.IPageElementOpts<stores.PageElementStore>>, MapExpectedType, Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<string>>;
    group?: IMatcherArgs<elements.PageElementGroup<stores.PageElementStore, Workflo.PageNode.GroupContent>, GroupExpectedType, Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Workflo.PageNode.GroupContent>>;
}
export interface ICompareValueElementFuncs<ElementValueType = any, ListValueType = any | any[], MapValueType = Partial<Record<string, any>>, GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>> extends ICompareElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType, never, Workflo.PageNode.ListFilterMask, Workflo.PageNode.MapFilterMask<string>, Workflo.PageNode.GroupFilterMask<Workflo.PageNode.GroupContent>> {
    element?: IMatcherArgs<elements.ValuePageElement<stores.PageElementStore, ElementValueType>, ElementValueType, never>;
    list?: IMatcherArgs<elements.ValuePageElementList<stores.PageElementStore, elements.ValuePageElement<stores.PageElementStore, ElementValueType>, elements.IValuePageElementOpts<stores.PageElementStore>, ElementValueType>, ListValueType, Workflo.PageNode.ListFilterMask>;
    map?: IMatcherArgs<elements.ValuePageElementMap<stores.PageElementStore, string, elements.ValuePageElement<stores.PageElementStore, ElementValueType>, elements.IPageElementOpts<stores.PageElementStore>, ElementValueType>, MapValueType, Workflo.PageNode.MapFilterMask<string>>;
    group?: IMatcherArgs<elements.ValuePageElementGroup<stores.PageElementStore, Workflo.PageNode.GroupContent>, GroupValueType, Workflo.PageNode.GroupFilterMask<Workflo.PageNode.GroupContent>>;
}
export interface ICompareEventuallyValueElementFuncs<ElementValueType = any, ListValueType = any | any[], MapValueType = Partial<Record<string, any>>, GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>> extends ICompareElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType, Workflo.ITimeoutInterval, Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask, Workflo.ITimeoutInterval & Workflo.PageNode.MapFilterMask<string>, Workflo.ITimeoutInterval & Workflo.PageNode.GroupFilterMask<Workflo.PageNode.GroupContent>> {
    element?: IMatcherArgs<elements.ValuePageElement<stores.PageElementStore, ElementValueType>, ElementValueType, Workflo.ITimeoutInterval>;
    list?: IMatcherArgs<elements.ValuePageElementList<stores.PageElementStore, elements.ValuePageElement<stores.PageElementStore, ElementValueType>, elements.IValuePageElementOpts<stores.PageElementStore>, ElementValueType>, ListValueType, Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask>;
    map?: IMatcherArgs<elements.ValuePageElementMap<stores.PageElementStore, string, elements.ValuePageElement<stores.PageElementStore, ElementValueType>, elements.IPageElementOpts<stores.PageElementStore>, ElementValueType>, MapValueType, Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<string>>;
    group?: IMatcherArgs<elements.ValuePageElementGroup<stores.PageElementStore, Workflo.PageNode.GroupContent>, GroupValueType, Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Workflo.PageNode.GroupContent>>;
}
export interface ICompareListLengthElementFuncs extends ICompareElementFuncs<never, number, never, never, never, Workflo.Comparator, never, never> {
    list: IMatcherArgs<elements.PageElementList<stores.PageElementStore, elements.PageElement<stores.PageElementStore>, elements.IPageElementOpts<stores.PageElementStore>>, number, Workflo.Comparator>;
}
export interface ICompareEventuallyListLengthElementFuncs extends ICompareEventuallyElementFuncs<never, number, never, never, never, Workflo.ITimeoutInterval & {
    comparator?: Workflo.Comparator;
}, never, never> {
    list: IMatcherArgs<elements.PageElementList<stores.PageElementStore, elements.PageElement<stores.PageElementStore>, elements.IPageElementOpts<stores.PageElementStore>>, number, Workflo.ITimeoutInterval & {
        comparator?: Workflo.Comparator;
    }>;
}
export interface ICompareAttributeElementFuncs extends ICompareElementFuncs<Workflo.IAttribute> {
    element: IMatcherArgs<elements.PageElement<stores.PageElementStore>, Workflo.IAttribute, never>;
}
export interface ICompareEventuallyAttributeElementFuncs extends ICompareEventuallyElementFuncs<Workflo.IAttribute> {
    element: IMatcherArgs<elements.PageElement<stores.PageElementStore>, Workflo.IAttribute, Workflo.ITimeoutInterval>;
}
export interface ICompareLocationElementFuncs extends ICompareElementFuncs<Workflo.ICoordinates> {
    element: IMatcherArgs<elements.PageElement<stores.PageElementStore>, Workflo.ICoordinates, Partial<Workflo.ICoordinates>>;
}
export interface ICompareEventuallyLocationElementFuncs extends ICompareEventuallyElementFuncs<Workflo.ICoordinates> {
    element: IMatcherArgs<elements.PageElement<stores.PageElementStore>, Workflo.ICoordinates, Workflo.ITimeoutInterval & {
        tolerances?: Partial<Workflo.ICoordinates>;
    }>;
}
export interface ICompareSizeElementFuncs extends ICompareElementFuncs<Workflo.ISize> {
    element: IMatcherArgs<elements.PageElement<stores.PageElementStore>, Workflo.ISize, Partial<Workflo.ISize>>;
}
export interface ICompareEventuallySizeElementFuncs extends ICompareEventuallyElementFuncs<Workflo.ISize> {
    element: IMatcherArgs<elements.PageElement<stores.PageElementStore>, Workflo.ISize, Workflo.ITimeoutInterval & {
        tolerances?: Partial<Workflo.ISize>;
    }>;
}
export interface ICompareNumberWithToleranceElementFuncs extends ICompareElementFuncs<number> {
    element: IMatcherArgs<elements.PageElement<stores.PageElementStore>, number, number>;
}
export interface ICompareEventuallyNumberWithToleranceElementFuncs extends ICompareEventuallyElementFuncs<number> {
    element: IMatcherArgs<elements.PageElement<stores.PageElementStore>, number, Workflo.ITimeoutInterval & {
        tolerance?: number;
    }>;
}
export declare function createBaseMatcher<OptsType extends Object = Object, CompareFuncsType extends (ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType, ElementOptsType, ListOptsType, MapOptsType, GroupOptsType> | ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType, ElementOptsType, ListOptsType, MapOptsType, GroupOptsType>) = ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType, ElementOptsType, ListOptsType, MapOptsType, GroupOptsType>, ElementExpectedType = never, ListExpectedType = never, MapExpectedType = never, GroupExpectedType = never, ElementOptsType = never, ListOptsType = never, MapOptsType = never, GroupOptsType = never>(compareFuncs: CompareFuncsType, ensureOpts?: boolean, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createMatcher<OptsType extends Object = Object, ElementExpectedType = never, ListExpectedType = never, MapExpectedType = never, GroupExpectedType = never>(compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createMatcherWithoutExpected<OptsType extends Object = Object>(compareFuncs: ICompareElementFuncs, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyMatcher<OptsType extends Object = Workflo.ITimeoutInterval>(compareFuncs: ICompareEventuallyElementFuncs): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyMatcherWithoutExpected<OptsType extends Object = Workflo.ITimeoutInterval>(compareFuncs: ICompareEventuallyElementFuncs, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createTextMatcher<OptsType extends Object = Object, ElementExpectedType = string, ListExpectedType = string | string[], MapExpectedType = Record<string, string>, GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createTextMatcherWithoutExpected<OptsType extends Object = Object, ElementExpectedType = string, ListExpectedType = string | string[], MapExpectedType = Record<string, string>, GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyTextMatcher<OptsType extends Object = Workflo.ITimeoutInterval, ElementExpectedType = string, ListExpectedType = string | string[], MapExpectedType = Record<string, string>, GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyTextMatcherWithoutExpected<OptsType extends Object = Workflo.ITimeoutInterval, ElementExpectedType = string, ListExpectedType = string | string[], MapExpectedType = Record<string, string>, GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
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
export declare function createEventuallyBooleanMatcher<OptsType extends Object = Workflo.ITimeoutInterval, ElementExpectedType = boolean, ListExpectedType = boolean | boolean[], MapExpectedType = Record<string, boolean>, GroupExpectedType = Workflo.PageNode.ExtractBoolean<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyBooleanMatcherWithoutExpected<OptsType extends Object = Workflo.ITimeoutInterval, ElementExpectedType = boolean, ListExpectedType = boolean | boolean[], MapExpectedType = Record<string, boolean>, GroupExpectedType = Workflo.PageNode.ExtractBoolean<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
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
export declare function createEventuallyValueMatcher<OptsType extends Object = Workflo.ITimeoutInterval, ElementValueType = any, ListValueType = any | any[], MapValueType = Partial<Record<string, any>>, GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareEventuallyValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyValueMatcherWithoutExpected<OptsType extends Object = Workflo.ITimeoutInterval, ElementValueType = any, ListValueType = any | any[], MapValueType = Partial<Record<string, any>>, GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>>(compareFuncs: ICompareEventuallyValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>, withoutExpected?: WithoutExpected[]): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createListLengthMatcher<OptsType extends Object = Object>(compareFuncs: ICompareListLengthElementFuncs): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyListLengthMatcher<OptsType extends Object = Object>(compareFuncs: ICompareEventuallyListLengthElementFuncs): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createAttributeMatcher<OptsType extends Object = Object>(compareFuncs: ICompareAttributeElementFuncs): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyAttributeMatcher<OptsType extends Object = Object>(compareFuncs: ICompareEventuallyAttributeElementFuncs): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createLocationMatcher<OptsType extends Object = Object>(compareFuncs: ICompareLocationElementFuncs): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyLocationMatcher<OptsType extends Object = Object>(compareFuncs: ICompareEventuallyLocationElementFuncs): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createSizeMatcher<OptsType extends Object = Object>(compareFuncs: ICompareSizeElementFuncs): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallySizeMatcher<OptsType extends Object = Object>(compareFuncs: ICompareEventuallySizeElementFuncs): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createNumberWithToleranceMatcher<OptsType extends Object = Object>(compareFuncs: ICompareNumberWithToleranceElementFuncs): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createEventuallyNumberWithToleranceMatcher<OptsType extends Object = Object>(compareFuncs: ICompareEventuallyNumberWithToleranceElementFuncs): (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {
    compare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
    negativeCompare: (node: Workflo.PageNode.INode, expectedOrOpts?: any, opts?: OptsType) => jasmine.CustomMatcherResult;
};
export declare function createBaseMessage(node: Workflo.PageNode.INode, errorTexts: string | string[]): string[];
export declare function createMessage(node: Workflo.PageNode.INode, errorTexts: string | string[]): string[];
export declare function createEventuallyMessage(node: Workflo.PageNode.INode, errorTexts: string | string[], timeout: number): string[];
export declare function createPropertyMessage(node: Workflo.PageNode.INode, property: string, comparison: string, actual: string, expected: any): string[];
export declare function createAnyMessage(node: Workflo.PageNode.INode, property: string, comparison: string, actual: string): string[];
export declare function createEventuallyPropertyMessage(node: Workflo.PageNode.INode, property: string, comparison: string, actual: string, expected: any, timeout: number): string[];
export declare function createEventuallyAnyMessage(node: Workflo.PageNode.INode, property: string, comparison: string, actual: string, timeout: number): string[];
export declare function createEachMessage(node: Workflo.PageNode.INode, errorTexts: string | string[], actualOnly?: boolean): string[];
export declare function createAnyEachMessage(node: Workflo.PageNode.INode, errorTexts: string | string[]): string[];
export declare function createEventuallyEachMessage(node: Workflo.PageNode.INode, errorTexts: string | string[], timeout: number): string[];
export declare function createEventuallyAnyEachMessage(node: Workflo.PageNode.INode, errorTexts: string | string[], timeout: number): string[];
export declare const elementMatchers: jasmine.CustomMatcherFactories;
export declare const listMatchers: jasmine.CustomMatcherFactories;
export declare const allMatchers: jasmine.CustomMatcherFactories;
export declare const valueAllMatchers: jasmine.CustomMatcherFactories;
export declare function expectElement<Store extends stores.PageElementStore, PageElementType extends elements.PageElement<Store>>(element: PageElementType): jasmine.Matchers<PageElementType>;
export declare function expectList<Store extends stores.PageElementStore, PageElementType extends elements.PageElement<Store>, PageElementOptions, PageElementListType extends elements.PageElementList<Store, PageElementType, PageElementOptions>>(list: PageElementListType): jasmine.Matchers<PageElementListType>;
export declare function expectMap<Store extends stores.PageElementStore, K extends string, PageElementType extends elements.PageElement<Store>, PageElementOptions, PageElementMapType extends elements.PageElementMap<Store, K, PageElementType, PageElementOptions>>(map: PageElementMapType): jasmine.Matchers<PageElementMapType>;
export declare function expectGroup<Store extends stores.PageElementStore, Content extends {
    [K in keyof Content]: Workflo.PageNode.INode;
}, PageElementGroupType extends elements.PageElementGroup<Store, Content>>(group: PageElementGroupType): jasmine.Matchers<PageElementGroupType>;
export {};
