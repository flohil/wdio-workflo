import * as _ from 'lodash';

import { tolerancesToString } from './helpers';
import { elements, stores, pages } from './page_objects';
import { comparatorStr } from './utility_functions/util';

// MATCHER FUNTCION INTERFACES

type WithoutExpected = 'element' | 'list' | 'map' | 'group';

export interface IMatcherArgs<
  NodeType extends Workflo.PageNode.IPageNode,
  ExpectedType,
  OptsType
> {
  resultFunc: ResultFunction<
    NodeType,
    OptsType,
    ExpectedType
  >;
  errorTextFunc: ErrorTextFunction<
    NodeType,
    OptsType,
    ExpectedType
  >;
}

export interface IResultFuncArgs<
  NodeType extends Workflo.PageNode.IPageNode,
  OptsType,
  ExpectedType
> {
  node: NodeType;
  expected: ExpectedType;
  opts: OptsType;
}

export interface IPageResultFuncArgs<
  PageType extends Workflo.IPage<any, any, any>,
  OptsType,
> {
  page: PageType;
  opts: OptsType;
}

export interface IResultFuncWithoutExpected<
  NodeType extends Workflo.PageNode.IPageNode,
  OptsType
> {
  node: NodeType;
  opts: OptsType;
}

export type ResultFunctionResult = () => boolean;

export type ResultFunction<
  NodeType extends Workflo.PageNode.IPageNode,
  OptsType,
  ExpectedType
> = (args: IResultFuncArgs<NodeType, OptsType, ExpectedType>) => ResultFunctionResult[];

export type PageResultFunction<
  PageType extends Workflo.IPage<any, any, any>,
  OptsType,
> = (args: IPageResultFuncArgs<PageType, OptsType>) => ResultFunctionResult[];

export type ResultWithoutExpectedFunction<
  NodeType extends Workflo.PageNode.IPageNode,
  OptsType
> = (args: IResultFuncWithoutExpected<NodeType, OptsType>) => ResultFunctionResult[];

export interface ErrorFuncArgs<
  NodeType extends Workflo.PageNode.IPageNode,
  OptsType,
  ExpectedType,
> {
  actual: string;
  expected: ExpectedType;
  node: NodeType;
  opts: OptsType;
}

export interface PageErrorFuncArgs<
  PageType extends Workflo.IPage<any, any, any>,
  OptsType,
> {
  page: PageType;
  opts: OptsType;
}

export interface ErrorFuncWithoutExpected<
  NodeType extends Workflo.PageNode.IPageNode,
  OptsType
> {
  actual: string;
  node: NodeType;
  opts: OptsType;
}

export type ErrorTextFunction<
  NodeType extends Workflo.PageNode.IPageNode,
  OptsType,
  ExpectedType,
> = (args: ErrorFuncArgs<NodeType, OptsType, ExpectedType>) => string[];

export type PageErrorTextFunction<
  PageType extends Workflo.IPage<any, any, any>,
  OptsType,
> = (args: PageErrorFuncArgs<PageType, OptsType>) => string[];

export type ErrorTextWithoutExpectedFunction<
  NodeType extends Workflo.PageNode.IPageNode,
  OptsType
> = (args: ErrorFuncWithoutExpected<NodeType, OptsType>) => string[];

export interface ICompareElementFuncs<
  ElementExpectedType = never,
  ListExpectedType = never,
  MapExpectedType = never,
  GroupExpectedType = never,
  ElementOptsType = never,
  ListOptsType = Workflo.PageNode.ListFilterMask,
  MapOptsType = Workflo.PageNode.MapFilterMask<string>,
  GroupOptsType = Workflo.PageNode.GroupFilterMask<Workflo.PageNode.GroupContent>
> {
  element?: IMatcherArgs<
    elements.PageElement<stores.PageNodeStore>,
    ElementExpectedType,
    ElementOptsType
  >;
  list?: IMatcherArgs<
    elements.PageElementList<
      stores.PageNodeStore,
      elements.PageElement<stores.PageNodeStore>,
      elements.IPageElementOpts<stores.PageNodeStore>
    >,
    ListExpectedType,
    ListOptsType
  >;
  map?: IMatcherArgs<
    elements.PageElementMap<
      stores.PageNodeStore,
      string,
      elements.PageElement<stores.PageNodeStore>,
      elements.IPageElementOpts<stores.PageNodeStore>
    >,
    MapExpectedType,
    MapOptsType
  >;
  group?: IMatcherArgs<
    elements.PageElementGroup<stores.PageNodeStore, Workflo.PageNode.GroupContent>,
    GroupExpectedType,
    GroupOptsType
  >;
}

export interface ICompareEventuallyElementFuncs<
  ElementExpectedType = never,
  ListExpectedType = never,
  MapExpectedType = never,
  GroupExpectedType = never,
  ElementOptsType = Workflo.ITimeoutInterval,
  ListOptsType = Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask,
  MapOptsType = Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<string>,
  GroupOptsType = Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Workflo.PageNode.GroupContent>
> {
  element?: IMatcherArgs<
    elements.PageElement<stores.PageNodeStore>,
    ElementExpectedType,
    Workflo.ITimeoutInterval
  >;
  list?: IMatcherArgs<
    elements.PageElementList<
      stores.PageNodeStore,
      elements.PageElement<stores.PageNodeStore>,
      elements.IPageElementOpts<stores.PageNodeStore>
    >,
    ListExpectedType,
    Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask
  >;
  map?: IMatcherArgs<
    elements.PageElementMap<
      stores.PageNodeStore,
      string,
      elements.PageElement<stores.PageNodeStore>,
      elements.IPageElementOpts<stores.PageNodeStore>
    >,
    MapExpectedType,
    Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<string>
  >;
  group?: IMatcherArgs<
    elements.PageElementGroup<stores.PageNodeStore, Workflo.PageNode.GroupContent>,
    GroupExpectedType,
    Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Workflo.PageNode.GroupContent>
  >;
}

export interface ICompareValueElementFuncs<
  ElementValueType = any,
  ListValueType = any | any[],
  MapValueType = Partial<Record<string, any>>,
  GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>
> extends ICompareElementFuncs<
  ElementValueType,
  ListValueType,
  MapValueType,
  GroupValueType,
  never,
  Workflo.PageNode.ListFilterMask,
  Workflo.PageNode.MapFilterMask<string>,
  Workflo.PageNode.GroupFilterMask<Workflo.PageNode.GroupContent>
> {
  element?: IMatcherArgs<
    elements.ValuePageElement<stores.PageNodeStore, ElementValueType>,
    ElementValueType,
    never
  >;
  list?: IMatcherArgs<
    elements.ValuePageElementList<
      stores.PageNodeStore,
      elements.ValuePageElement<stores.PageNodeStore, ElementValueType>,
      elements.IValuePageElementOpts<stores.PageNodeStore>,
      ElementValueType
    >,
    ListValueType,
    Workflo.PageNode.ListFilterMask
  >;
  map?: IMatcherArgs<
    elements.ValuePageElementMap<
      stores.PageNodeStore,
      string,
      elements.ValuePageElement<stores.PageNodeStore, ElementValueType>,
      elements.IPageElementOpts<stores.PageNodeStore>,
      ElementValueType
    >,
    MapValueType,
    Workflo.PageNode.MapFilterMask<string>
  >;
  group?: IMatcherArgs<
    elements.ValuePageElementGroup<stores.PageNodeStore, Workflo.PageNode.GroupContent>,
    GroupValueType,
    Workflo.PageNode.GroupFilterMask<Workflo.PageNode.GroupContent>
  >;
}

export interface ICompareEventuallyValueElementFuncs<
  ElementValueType = any,
  ListValueType = any | any[],
  MapValueType = Partial<Record<string, any>>,
  GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>
> extends ICompareElementFuncs<
  ElementValueType,
  ListValueType,
  MapValueType,
  GroupValueType,
  Workflo.ITimeoutInterval,
  Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask,
  Workflo.ITimeoutInterval & Workflo.PageNode.MapFilterMask<string>,
  Workflo.ITimeoutInterval & Workflo.PageNode.GroupFilterMask<Workflo.PageNode.GroupContent>
> {
  element?: IMatcherArgs<
    elements.ValuePageElement<stores.PageNodeStore, ElementValueType>,
    ElementValueType,
    Workflo.ITimeoutInterval
  >;
  list?: IMatcherArgs<
    elements.ValuePageElementList<
      stores.PageNodeStore,
      elements.ValuePageElement<stores.PageNodeStore, ElementValueType>,
      elements.IValuePageElementOpts<stores.PageNodeStore>,
      ElementValueType
    >,
    ListValueType,
    Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask
  >;
  map?: IMatcherArgs<
    elements.ValuePageElementMap<
      stores.PageNodeStore,
      string,
      elements.ValuePageElement<stores.PageNodeStore, ElementValueType>,
      elements.IPageElementOpts<stores.PageNodeStore>,
      ElementValueType
    >,
    MapValueType,
    Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<string>
  >;
  group?: IMatcherArgs<
    elements.ValuePageElementGroup<stores.PageNodeStore, Workflo.PageNode.GroupContent>,
    GroupValueType,
    Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Workflo.PageNode.GroupContent>
  >;
}

export interface ICompareListLengthElementFuncs extends ICompareElementFuncs<
  never, number, never, never, never, Workflo.Comparator, never, never
> {
  list: IMatcherArgs<
    elements.PageElementList<
      stores.PageNodeStore,
      elements.PageElement<stores.PageNodeStore>,
      elements.IPageElementOpts<stores.PageNodeStore>
    >,
    number,
    Workflo.Comparator
  >;
}

export interface ICompareEventuallyListLengthElementFuncs extends ICompareEventuallyElementFuncs<
  never, number, never, never, never, Workflo.ITimeoutInterval & {comparator?: Workflo.Comparator}, never, never
> {
  list: IMatcherArgs<
    elements.PageElementList<
      stores.PageNodeStore,
      elements.PageElement<stores.PageNodeStore>,
      elements.IPageElementOpts<stores.PageNodeStore>
    >,
    number,
    Workflo.ITimeoutInterval & {comparator?: Workflo.Comparator}
  >;
}

export interface ICompareAttributeElementFuncs extends ICompareElementFuncs<Workflo.IAttribute> {
  element: IMatcherArgs<
    elements.PageElement<
      stores.PageNodeStore
    >,
    Workflo.IAttribute,
    never
  >;
}

export interface ICompareEventuallyAttributeElementFuncs extends ICompareEventuallyElementFuncs<Workflo.IAttribute> {
  element: IMatcherArgs<
    elements.PageElement<
      stores.PageNodeStore
    >,
    Workflo.IAttribute,
    Workflo.ITimeoutInterval
  >;
}

export interface ICompareLocationElementFuncs extends ICompareElementFuncs<Workflo.ICoordinates> {
  element: IMatcherArgs<
    elements.PageElement<
      stores.PageNodeStore
    >,
    Workflo.ICoordinates,
    Partial<Workflo.ICoordinates>
  >;
}

export interface ICompareEventuallyLocationElementFuncs extends ICompareEventuallyElementFuncs<Workflo.ICoordinates> {
  element: IMatcherArgs<
    elements.PageElement<
      stores.PageNodeStore
    >,
    Workflo.ICoordinates,
    Workflo.ITimeoutInterval & {tolerances?: Partial<Workflo.ICoordinates>}
  >;
}

export interface ICompareSizeElementFuncs extends ICompareElementFuncs<Workflo.ISize> {
  element: IMatcherArgs<
    elements.PageElement<
      stores.PageNodeStore
    >,
    Workflo.ISize,
    Partial<Workflo.ISize>
  >;
}

export interface ICompareEventuallySizeElementFuncs extends ICompareEventuallyElementFuncs<Workflo.ISize> {
  element: IMatcherArgs<
    elements.PageElement<
      stores.PageNodeStore
    >,
    Workflo.ISize,
    Workflo.ITimeoutInterval & {tolerances?: Partial<Workflo.ISize>}
  >;
}

export interface ICompareNumberWithToleranceElementFuncs extends ICompareElementFuncs<number> {
  element: IMatcherArgs<
    elements.PageElement<
      stores.PageNodeStore
    >,
    number,
    number
  >;
}

export interface ICompareEventuallyNumberWithToleranceElementFuncs extends ICompareEventuallyElementFuncs<number> {
  element: IMatcherArgs<
    elements.PageElement<
      stores.PageNodeStore
    >,
    number,
    Workflo.ITimeoutInterval & {tolerance?: number}
  >;
}

// MATCHER FUNCS

function isWithoutExpected(node: Workflo.PageNode.IPageNode, withoutExpected: WithoutExpected[] = []) {
  let _withoutExpected = false;

  if (node instanceof elements.PageElement) {
    if (withoutExpected.indexOf('element') >= 0) {
      _withoutExpected = true;
    }
  } else if (node instanceof elements.PageElementList) {
    if (withoutExpected.indexOf('list') >= 0) {
      _withoutExpected = true;
    }
  } else if (node instanceof elements.PageElementMap) {
    if (withoutExpected.indexOf('map') >= 0) {
      _withoutExpected = true;
    }
  } else if (node instanceof elements.PageElementGroup) {
    if (withoutExpected.indexOf('group') >= 0) {
      _withoutExpected = true;
    }
  } else {
    throw new Error(`Unknown node type in matchers: ${node.constructor.name}.
Node type needs to extend PageElement, PageElementList, PageElementMap or PageElementGroup.`);
  }

  return _withoutExpected;
}

export function createBaseMatcher<
  OptsType extends Object = Object,
  CompareFuncsType extends (ICompareElementFuncs<
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType,
    ElementOptsType, ListOptsType, MapOptsType, GroupOptsType
  > | ICompareEventuallyElementFuncs<
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType,
    ElementOptsType, ListOptsType, MapOptsType, GroupOptsType
  >) = ICompareElementFuncs<
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType,
    ElementOptsType, ListOptsType, MapOptsType, GroupOptsType
  >,
  ElementExpectedType = never,
  ListExpectedType = never,
  MapExpectedType = never,
  GroupExpectedType = never,
  ElementOptsType = never,
  ListOptsType = never,
  MapOptsType = never,
  GroupOptsType = never,
>(
  compareFuncs: CompareFuncsType,
  ensureOpts: boolean = false,
  withoutExpected: WithoutExpected[] = [],
) {
  return (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {

    function baseCompareFunction(
      node: Workflo.PageNode.IPageNode,
      negativeComparison: boolean,
      opts: OptsType = undefined,
      expected: any = undefined,
    ): jasmine.CustomMatcherResult {
      const result: jasmine.CustomMatcherResult = {
        pass: true,
        message: '',
      };

      let resultFunc: ResultFunction<Workflo.PageNode.IPageNode, any, {timeout?: number}>;
      let errorTextFunc: ErrorTextFunction<Workflo.PageNode.IPageNode, any, {timeout?: number}>;

      if (node instanceof elements.PageElement) {
        if (compareFuncs.element) {
          ({ resultFunc, errorTextFunc } = compareFuncs.element);
        } else {
          throw new Error(`No PageElement matcher was implemented for node type ${node.constructor.name}`);
        }
      } else if (node instanceof elements.PageElementList) {
        if (compareFuncs.list) {
          ({ resultFunc, errorTextFunc } = compareFuncs.list);
        } else {
          throw new Error(`No PageElementList matcher was implemented for node type ${node.constructor.name}`);
        }
      } else if (node instanceof elements.PageElementMap) {
        if (compareFuncs.map) {
          ({ resultFunc, errorTextFunc } = compareFuncs.map);
        } else {
          throw new Error(`No PageElementMap matcher was implemented for node type ${node.constructor.name}`);
        }
      } else if (node instanceof elements.PageElementGroup) {
        if (compareFuncs.group) {
          ({ resultFunc, errorTextFunc } = compareFuncs.group);
        } else {
          throw new Error(`No PageElementGroup matcher was implemented for node type ${node.constructor.name}`);
        }
      } else {
        throw new Error(`Unknown node type in matchers: ${node.constructor.name}.` +
          'Node type needs to extend PageElement, PageElementList, PageElementMap or PageElementGroup.');
      }

      if (ensureOpts && (typeof opts === 'undefined' || opts === null)) {
        opts = Object.create(null);
      }

      const successes = resultFunc({ node, expected, opts });
      const success = (negativeComparison) ? successes[1]() : successes[0]();

      if (!success) {
        const optsWithTimeout: OptsType & {timeout?: number} =
          ((typeof opts === 'object' && opts !== null) || !!opts) ? opts : Object.create(null);

        if (typeof optsWithTimeout === 'object' && !optsWithTimeout['timeout']) {
          optsWithTimeout.timeout = node.__lastDiff.timeout;
        }

        const actual = node.__lastDiff.actual;
        const errorTexts = errorTextFunc({ actual, expected, node, opts: optsWithTimeout });
        let errorText: string = undefined;

        if (negativeComparison && errorTexts.length > 1) {
          errorText = errorTexts[1];
        } else {
          errorText = errorTexts[0];
        }

        result.pass = false;
        result.message = errorText;
      }

      return result;
    }

    return {
      compare: (
        node: Workflo.PageNode.IPageNode, expectedOrOpts?: any | OptsType, opts?: OptsType,
      ): jasmine.CustomMatcherResult => {
        if (isWithoutExpected(node, withoutExpected)) {
          return baseCompareFunction(node, false, expectedOrOpts as OptsType);
        } else {
          return baseCompareFunction(node, false, opts, expectedOrOpts);
        }
      },
      negativeCompare: (
        node: Workflo.PageNode.IPageNode, expectedOrOpts?: any | OptsType, opts?: OptsType,
      ): jasmine.CustomMatcherResult => {
        if (isWithoutExpected(node, withoutExpected)) {
          return baseCompareFunction(node, true, expectedOrOpts as OptsType);
        } else {
          return baseCompareFunction(node, true, opts, expectedOrOpts);
        }
      },
    };
  };
}

export function createPageMatcher<
  OptsType extends {timeout?: number} = {timeout?: number}
>(
  compareFuncs: {
    resultFunc: PageResultFunction<pages.Page<any, any, any>, OptsType>,
    errorTextFunc: PageErrorTextFunction<pages.Page<any, any, any>, OptsType>,
  },
) {
  return (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) => {

    function baseCompareFunction(
      page: pages.Page<any, any, any>,
      negativeComparison: boolean,
      opts: OptsType = undefined,
    ): jasmine.CustomMatcherResult {
      const result: jasmine.CustomMatcherResult = {
        pass: true,
        message: '',
      };

      if (typeof opts === 'undefined' || opts === null) {
        opts = Object.create(null);
      }

      const successes = compareFuncs.resultFunc({ page, opts });
      const success = (negativeComparison) ? successes[1]() : successes[0]();

      if (!success) {
        const optsWithTimeout: OptsType & {timeout?: number} =
          ((typeof opts === 'object' && opts !== null) || !!opts) ? opts : Object.create(null);

        if (typeof optsWithTimeout === 'object' && !optsWithTimeout['timeout']) {
          optsWithTimeout.timeout = page.__lastTimeout;
        }

        const errorTexts = compareFuncs.errorTextFunc({ page, opts: optsWithTimeout });
        let errorText: string = undefined;

        if (negativeComparison && errorTexts.length > 1) {
          errorText = errorTexts[1];
        } else {
          errorText = errorTexts[0];
        }

        result.pass = false;
        result.message = errorText;
      }

      return result;
    }

    return {
      compare: (
        page: pages.Page<any, any, any>, opts?: OptsType,
      ): jasmine.CustomMatcherResult => {
        return baseCompareFunction(page, false, opts);
      },
      negativeCompare: (
        page: pages.Page<any, any, any>, opts?: OptsType,
      ): jasmine.CustomMatcherResult => {
        return baseCompareFunction(page, true, opts);
      },
    };
  };
}

export function createMatcher<
  OptsType extends Object = Object,
  ElementExpectedType = never,
  ListExpectedType = never,
  MapExpectedType = never,
  GroupExpectedType = never,
>(
  compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
) {
  return createBaseMatcher<
    OptsType,
    ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, false);
}

export function createMatcherWithoutExpected<
  OptsType extends Object = Object
>(
  compareFuncs: ICompareElementFuncs,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group'],
) {
  return createBaseMatcher<OptsType>(compareFuncs, false, withoutExpected);
}

export function createEventuallyMatcher<
  OptsType extends Object = Workflo.ITimeoutInterval
>(
  compareFuncs: ICompareEventuallyElementFuncs,
) {
  return createBaseMatcher<OptsType, ICompareEventuallyElementFuncs>(compareFuncs, true);
}

export function createEventuallyMatcherWithoutExpected<
  OptsType extends Object = Workflo.ITimeoutInterval,
>(
  compareFuncs: ICompareEventuallyElementFuncs,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group'],
) {
  return createBaseMatcher<OptsType, ICompareEventuallyElementFuncs>(compareFuncs, true, withoutExpected);
}

export function createTextMatcher<
  OptsType extends Object = Object,
  ElementExpectedType = string,
  ListExpectedType = string | string[],
  MapExpectedType = Record<string, string>,
  GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
) {
  return createBaseMatcher<
    OptsType,
    ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, false);
}

export function createTextMatcherWithoutExpected<
  OptsType extends Object = Object,
  ElementExpectedType = string,
  ListExpectedType = string | string[],
  MapExpectedType = Record<string, string>,
  GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group'],
) {
  return createBaseMatcher<
    OptsType,
    ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, false, withoutExpected);
}

export function createEventuallyTextMatcher<
  OptsType extends Object = Workflo.ITimeoutInterval,
  ElementExpectedType = string,
  ListExpectedType = string | string[],
  MapExpectedType = Record<string, string>,
  GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareEventuallyElementFuncs<
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >,
) {
  return createBaseMatcher<
    OptsType,
    ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, true);
}

export function createEventuallyTextMatcherWithoutExpected<
  OptsType extends Object = Workflo.ITimeoutInterval,
  ElementExpectedType = string,
  ListExpectedType = string | string[],
  MapExpectedType = Record<string, string>,
  GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareEventuallyElementFuncs<
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group'],
) {
  return createBaseMatcher<
    OptsType,
    ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, true, withoutExpected);
}

export function createBooleanMatcher<
  OptsType extends Object = Object,
  ElementExpectedType = boolean,
  ListExpectedType = boolean | boolean[],
  MapExpectedType = Record<string, boolean>,
  GroupExpectedType = Workflo.PageNode.ExtractBoolean<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
) {
  return createBaseMatcher<
    OptsType,
    ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs);
}

export function createBooleanMatcherWithoutExpected<
  OptsType extends Object = Object,
  ElementExpectedType = boolean,
  ListExpectedType = boolean | boolean[],
  MapExpectedType = Record<string, boolean>,
  GroupExpectedType = Workflo.PageNode.ExtractBoolean<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group'],
) {
  return createBaseMatcher<
    OptsType,
    ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, false, withoutExpected);
}

export function createEventuallyBooleanMatcher<
  OptsType extends Object = Workflo.ITimeoutInterval,
  ElementExpectedType = boolean,
  ListExpectedType = boolean | boolean[],
  MapExpectedType = Record<string, boolean>,
  GroupExpectedType = Workflo.PageNode.ExtractBoolean<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareEventuallyElementFuncs<
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >,
) {
  return createBaseMatcher<
    OptsType,
    ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, true);
}

export function createEventuallyBooleanMatcherWithoutExpected<
  OptsType extends Object = Workflo.ITimeoutInterval,
  ElementExpectedType = boolean,
  ListExpectedType = boolean | boolean[],
  MapExpectedType = Record<string, boolean>,
  GroupExpectedType = Workflo.PageNode.ExtractBoolean<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareEventuallyElementFuncs<
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group'],
) {
  return createBaseMatcher<
    OptsType,
    ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, true, withoutExpected);
}

export function createValueMatcher<
  OptsType extends Object = Object,
  ElementValueType = any,
  ListValueType = any | any[],
  MapValueType = Partial<Record<string, any>>,
  GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>
>(
  compareFuncs: ICompareValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
) {
  return createBaseMatcher<
    OptsType,
    ICompareValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
    ElementValueType, ListValueType, MapValueType, GroupValueType
  >(compareFuncs);
}

export function createValueMatcherWithoutExpected<
  OptsType extends Object = Object,
  ElementValueType = any,
  ListValueType = any | any[],
  MapValueType = Partial<Record<string, any>>,
  GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>
>(
  compareFuncs: ICompareValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group'],
) {
  return createBaseMatcher<
    OptsType,
    ICompareValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
    ElementValueType, ListValueType, MapValueType, GroupValueType
  >(compareFuncs, false, withoutExpected);
}

export function createEventuallyValueMatcher<
  OptsType extends Object = Workflo.ITimeoutInterval,
  ElementValueType = any,
  ListValueType = any | any[],
  MapValueType = Partial<Record<string, any>>,
  GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>
>(
  compareFuncs: ICompareEventuallyValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
) {
  return createBaseMatcher<
    OptsType,
    ICompareEventuallyValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
    ElementValueType, ListValueType, MapValueType, GroupValueType
  >(compareFuncs, true);
}

export function createEventuallyValueMatcherWithoutExpected<
  OptsType extends Object = Workflo.ITimeoutInterval,
  ElementValueType = any,
  ListValueType = any | any[],
  MapValueType = Partial<Record<string, any>>,
  GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>
>(
  compareFuncs: ICompareEventuallyValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group'],
) {
  return createBaseMatcher<
    OptsType,
    ICompareEventuallyValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
    ElementValueType, ListValueType, MapValueType, GroupValueType
  >(compareFuncs, true, withoutExpected);
}

export function createListLengthMatcher<
  OptsType extends Object = Object,
>(
  compareFuncs: ICompareListLengthElementFuncs,
) {
  return createBaseMatcher<
    OptsType,
    ICompareListLengthElementFuncs,
    never, number, never, never, never, Workflo.Comparator, never, never
  >(compareFuncs, false);
}

export function createEventuallyListLengthMatcher<
  OptsType extends Object = Object,
>(
  compareFuncs: ICompareEventuallyListLengthElementFuncs,
) {
  return createBaseMatcher<
    OptsType,
    ICompareEventuallyListLengthElementFuncs,
    never, number, never, never, never, Workflo.ITimeoutInterval & {comparator?: Workflo.Comparator}, never, never
  >(compareFuncs, false);
}

export function createAttributeMatcher<
  OptsType extends Object = Object,
>(
  compareFuncs: ICompareAttributeElementFuncs,
) {
  return createBaseMatcher<
    OptsType,
    ICompareAttributeElementFuncs,
    Workflo.IAttribute, never, never, never
  >(compareFuncs, false);
}

export function createEventuallyAttributeMatcher<
  OptsType extends Object = Object,
>(
  compareFuncs: ICompareEventuallyAttributeElementFuncs,
) {
  return createBaseMatcher<
    OptsType,
    ICompareEventuallyAttributeElementFuncs,
    Workflo.IAttribute, never, never, never
  >(compareFuncs, false);
}

export function createLocationMatcher<
  OptsType extends Object = Object,
>(
  compareFuncs: ICompareLocationElementFuncs,
) {
  return createBaseMatcher<
    OptsType,
    ICompareLocationElementFuncs,
    Workflo.ICoordinates, never, never, never,
    Partial<Workflo.ICoordinates>
  >(compareFuncs, false);
}

export function createEventuallyLocationMatcher<
  OptsType extends Object = Object,
>(
  compareFuncs: ICompareEventuallyLocationElementFuncs,
) {
  return createBaseMatcher<
    OptsType,
    ICompareEventuallyLocationElementFuncs,
    Workflo.ICoordinates, never, never, never,
    Workflo.ITimeoutInterval & {tolerances?: Partial<Workflo.ICoordinates>}
  >(compareFuncs, false);
}

export function createSizeMatcher<
  OptsType extends Object = Object,
>(
  compareFuncs: ICompareSizeElementFuncs,
) {
  return createBaseMatcher<
    OptsType,
    ICompareSizeElementFuncs,
    Workflo.ISize, never, never, never,
    Partial<Workflo.ISize>
  >(compareFuncs, false);
}

export function createEventuallySizeMatcher<
  OptsType extends Object = Object,
>(
  compareFuncs: ICompareEventuallySizeElementFuncs,
) {
  return createBaseMatcher<
    OptsType,
    ICompareEventuallySizeElementFuncs,
    Workflo.ISize, never, never, never,
    Workflo.ITimeoutInterval & {tolerances?: Partial<Workflo.ISize>}
  >(compareFuncs, false);
}

export function createNumberWithToleranceMatcher<
  OptsType extends Object = Object,
>(
  compareFuncs: ICompareNumberWithToleranceElementFuncs,
) {
  return createBaseMatcher<
    OptsType,
    ICompareNumberWithToleranceElementFuncs,
    number, never, never, never,
    number
  >(compareFuncs, false);
}

export function createEventuallyNumberWithToleranceMatcher<
  OptsType extends Object = Object,
>(
  compareFuncs: ICompareEventuallyNumberWithToleranceElementFuncs,
) {
  return createBaseMatcher<
    OptsType,
    ICompareEventuallyNumberWithToleranceElementFuncs,
    number, never, never, never,
    Workflo.ITimeoutInterval & {tolerance?: number}
  >(compareFuncs, false);
}

// ERROR TEXT FUNCTIONS

function convertDiffToMessages(
  diff: Workflo.IDiff,
  actualOnly: boolean = false,
  includeTimeouts: boolean = false,
  timeout: number = undefined,
  comparisonLines: string[] = [],
  paths: string[] = [],
): string[] {
  if (diff.tree && Object.keys(diff.tree).length > 0) {
    const keys = Object.keys(diff.tree);

    keys.forEach(
      key => {
        const _paths = [...paths];
        _paths.push(key);

        convertDiffToMessages(diff.tree[key], actualOnly, includeTimeouts, timeout, comparisonLines, _paths);
      },
    );
  } else {
    let _paths = paths.join('');

    if (_paths.charAt(0) === '.') {
      _paths = _paths.substring(1);
    }

    const _actual = printValue(diff.actual);
    const _expected = printValue(diff.expected);

    let compareStr = '';

    if (actualOnly) {
      compareStr = (typeof diff.actual === 'undefined') ?
      '' :`{actual: "${_actual}"}\n`;
    } else {
      compareStr = (typeof diff.actual === 'undefined' && typeof diff.expected === 'undefined') ?
      '' :`{actual: "${_actual}", expected: "${_expected}"}\n`;
    }

    const timeoutStr = (includeTimeouts) ? ` within ${timeout || diff.timeout}ms` : '';

    comparisonLines.push(`${diff.constructorName} at path '${_paths}'${timeoutStr}\n${compareStr}( ${diff.selector} )`);
  }

  return comparisonLines;
}

function printValue(value: any) {
  if (typeof value === 'undefined') {
    return '';
  } else if (value === null) {
    return '';
  }

  return value.toString();
}

export function createBaseMessage(node: Workflo.PageNode.IPageNode, errorTexts: string | string[]) {
  let errorText = undefined;
  let notErrorText = undefined;

  if (_.isArray(errorTexts)) {
    errorText = errorTexts[0];
    notErrorText = errorTexts[1];
  } else {
    errorText = errorTexts;
    notErrorText = errorTexts;
  }

  return [
    `Expected ${node.constructor.name}${errorText}.\n( ${node.__getNodeId()} )`,
    `Expected ${node.constructor.name}${notErrorText}.\n( ${node.__getNodeId()} )`,
  ];
}

export function createMessage(node: Workflo.PageNode.IPageNode, errorTexts: string | string[]) {
  let errorText = undefined;
  let notErrorText = undefined;

  if (_.isArray(errorTexts)) {
    errorText = errorTexts[0];
    notErrorText = errorTexts[1];
  } else {
    errorText = errorTexts;
    notErrorText = errorTexts;
  }

  return createBaseMessage(node, [
    ` to ${errorText}`,
    ` not to ${notErrorText}`,
  ]);
}

export function createEventuallyMessage(
  node: Workflo.PageNode.IPageNode, errorTexts: string | string[], timeout: number,
) {
  let errorText = undefined;
  let notErrorText = undefined;

  if (_.isArray(errorTexts)) {
    errorText = errorTexts[0];
    notErrorText = errorTexts[1];
  } else {
    errorText = errorTexts;
    notErrorText = errorTexts;
  }

  return createBaseMessage(node, [
    ` to eventually ${errorText} within ${timeout}ms`,
    ` not to eventually ${notErrorText} within ${timeout}ms`,
  ]);
}

export function createPropertyMessage(
  node: Workflo.PageNode.IPageNode, property: string, comparison: string, actual: string, expected: any,
) {
  const _actual = printValue(actual);
  const _expected = printValue(expected);

  return createBaseMessage(node, [
    `'s ${property} "${_actual}" to ${comparison} "${_expected}"`,
    `'s ${property} "${_actual}" not to ${comparison} "${_expected}"`,
  ]);
}

export function createAnyMessage(
  node: Workflo.PageNode.IPageNode, property: string, comparison: string, actual: string,
) {
  const _actual = printValue(actual);

  return createBaseMessage(node, [
    ` to ${comparison} any ${property}`,
    ` to ${comparison} no ${property} but had ${property} "${_actual}"`,
  ]);
}

export function createEventuallyPropertyMessage(
  node: Workflo.PageNode.IPageNode,
  property: string,
  comparison: string,
  actual: string,
  expected: any,
  timeout: number,
) {
  const _actual = printValue(actual);
  const _expected = printValue(expected);

  return createBaseMessage(node, [
    `'s ${property} "${_actual}" to eventually ${comparison} "${_expected}" within ${timeout}ms`,
    `'s ${property} "${_actual}" not to eventually ${comparison} "${_expected}" within ${timeout}ms`,
  ]);
}

export function createEventuallyAnyMessage(
  node: Workflo.PageNode.IPageNode, property: string, comparison: string, actual: string, timeout: number,
) {
  const _actual = printValue(actual);

  return createBaseMessage(node, [
    ` to eventually ${comparison} any ${property} within ${timeout}ms`,
    ` to eventually ${comparison} no ${property} within ${timeout}ms but had ${property} "${_actual}"`,
  ]);
}

export function createEachMessage(
  node: Workflo.PageNode.IPageNode,
  errorTexts: string | string[],
  actualOnly: boolean = false,
  includeTimeouts: boolean = false,
  timeout: number = undefined,
) {
  let errorText = undefined;
  let notErrorText = undefined;

  if (_.isArray(errorTexts)) {
    errorText = errorTexts[0];
    notErrorText = errorTexts[1];
  } else {
    errorText = errorTexts;
    notErrorText = errorTexts;
  }

  const comparisonLines = convertDiffToMessages(node.__lastDiff, actualOnly, includeTimeouts, timeout);
  const comparisonList = comparisonLines.join('\n\n');
  const hrLine = '\n------------------------------------------------------------------\n';

  return [
    `Expected each of ${node.constructor.name}'s elements to ${errorText}:${hrLine}${comparisonList}${hrLine}`,
    `Expected none of ${node.constructor.name}'s elements to ${notErrorText}:${hrLine}${comparisonList}${hrLine}`,
  ];
}

export function createAnyEachMessage(node: Workflo.PageNode.IPageNode, errorTexts: string | string[]) {
  return createEachMessage(node, errorTexts, true);
}

export function createEventuallyEachMessage(
  node: Workflo.PageNode.IPageNode, errorTexts: string | string[], timeout: number,
) {
  const within = _.isArray(errorTexts) ?
    errorTexts.map(errorText => `eventually ${errorText}`) :
    `eventually ${errorTexts}`;

  return createEachMessage(node, within, false, true, timeout);
}

export function createEventuallyAnyEachMessage(
  node: Workflo.PageNode.IPageNode, errorTexts: string | string[], timeout: number,
) {
  const within = _.isArray(errorTexts) ?
    errorTexts.map(errorText => `eventually ${errorText}`) :
    `eventually ${errorTexts}`;

  return createEachMessage(node, within, true, true, timeout);
}

// MATCHERS

export const elementMatchers: jasmine.CustomMatcherFactories = {
  toBeSelected: createMatcherWithoutExpected({
    element: {
      resultFunc: ({ node }) => [() => node.currently.isSelected(), () => node.currently.not.isSelected()],
      errorTextFunc: ({ node }) => createMessage(node, 'be selected'),
    },
  }),
  toEventuallyBeSelected: createEventuallyMatcherWithoutExpected({
    element: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.isSelected(opts), () => node.eventually.not.isSelected(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyMessage(node, 'be selected', opts.timeout),
    },
  }),
  toBeChecked: createMatcherWithoutExpected({
    element: {
      resultFunc: ({ node }) => [() => node.currently.isChecked(), () => node.currently.not.isChecked()],
      errorTextFunc: ({ node }) => createMessage(node, 'be checked'),
    },
  }),
  toEventuallyBeChecked: createEventuallyMatcherWithoutExpected({
    element: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.isChecked(opts), () => node.eventually.not.isChecked(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyMessage(node, 'be checked', opts.timeout),
    },
  }),
  toHaveHTML: createTextMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasHTML(expected), () => node.currently.not.hasHTML(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'HTML', 'be', actual, expected),
    },
  }),
  toEventuallyHaveHTML: createEventuallyTextMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasHTML(expected, opts), () => node.eventually.not.hasHTML(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, 'HTML', 'be', actual, expected, opts.timeout,
      ),
    },
  }),
  toHaveAnyHTML: createTextMatcherWithoutExpected({
    element: {
      resultFunc: ({ node }) => [
        () => node.currently.hasAnyHTML(), () => node.currently.not.hasAnyHTML(),
      ],
      errorTextFunc: ({ node, actual }) => createAnyMessage(node, 'HTML', 'have', actual),
    },
  }),
  toEventuallyHaveAnyHTML: createEventuallyTextMatcherWithoutExpected({
    element: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyHTML(opts), () => node.eventually.not.hasAnyHTML(opts),
      ],
      errorTextFunc: ({ node, actual, opts }) => createEventuallyAnyMessage(node, 'HTML', 'have', actual, opts.timeout),
    },
  }),
  toContainHTML: createTextMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsHTML(expected), () => node.currently.not.containsHTML(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'HTML', 'contain', actual, expected),
    },
  }),
  toEventuallyContainHTML: createEventuallyTextMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsHTML(expected, opts), () => node.eventually.not.containsHTML(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, 'HTML', 'contain', actual, expected, opts.timeout,
      ),
    },
  }),
  toHaveAttribute: createAttributeMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasAttribute(expected), () => node.currently.not.hasAttribute(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) =>
        createPropertyMessage(node, expected.name, 'be', actual, expected.value),
    },
  }),
  toEventuallyHaveAttribute: createEventuallyAttributeMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasAttribute(expected, opts), () => node.eventually.not.hasAttribute(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, expected.name, 'be', actual, expected.value, opts.timeout,
      ),
    },
  }),
  toHaveAnyAttribute: createTextMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasAnyAttribute(expected),
        () => node.currently.not.hasAnyAttribute(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createBaseMessage(node, [
        ` to have any ${expected}`,
        ` to have no ${expected} but had ${expected} "${actual}"`,
      ]),
    },
  }),
  toEventuallyHaveAnyAttribute: createEventuallyTextMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasAnyAttribute(expected, opts),
        () => node.eventually.not.hasAnyAttribute(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createBaseMessage(node, [
        ` to have any ${expected} within ${opts.timeout}ms`,
        ` to have no ${expected} within ${opts.timeout}ms but had ${expected} "${actual}"`,
      ]),
    },
  }),
  toContainAttribute: createAttributeMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsAttribute(expected),
        () => node.currently.not.containsAttribute(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) =>
        createPropertyMessage(node, expected.name, 'contain', actual, expected.value),
    },
  }),
  toEventuallyContainAttribute: createEventuallyAttributeMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsAttribute(expected, opts),
        () => node.eventually.not.containsAttribute(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, expected.name, 'contain', actual, expected.value, opts.timeout,
      ),
    },
  }),
  toHaveClass: createTextMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasClass(expected), () => node.currently.not.hasClass(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'class', 'be', actual, expected),
    },
  }),
  toEventuallyHaveClass: createEventuallyTextMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasClass(expected, opts), () => node.eventually.not.hasClass(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, 'class', 'be', actual, expected, opts.timeout,
      ),
    },
  }),
  toHaveAnyClass: createTextMatcherWithoutExpected({
    element: {
      resultFunc: ({ node }) => [
        () => node.currently.hasAnyClass(), () => node.currently.not.hasAnyClass(),
      ],
      errorTextFunc: ({ node, actual }) => createAnyMessage(node, 'class', 'have', actual),
    },
  }),
  toEventuallyHaveAnyClass: createEventuallyTextMatcherWithoutExpected({
    element: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyClass(opts), () => node.eventually.not.hasAnyClass(opts),
      ],
      errorTextFunc: ({ node, actual, opts }) =>
        createEventuallyAnyMessage(node, 'class', 'have', actual, opts.timeout),
    },
  }),
  toContainClass: createTextMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsClass(expected), () => node.currently.not.containsClass(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'class', 'contain', actual, expected),
    },
  }),
  toEventuallyContainClass: createEventuallyTextMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsClass(expected, opts), () => node.eventually.not.containsClass(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, 'class', 'contain', actual, expected, opts.timeout,
      ),
    },
  }),
  toHaveId: createTextMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasId(expected), () => node.currently.not.hasId(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'id', 'be', actual, expected),
    },
  }),
  toEventuallyHaveId: createEventuallyTextMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasId(expected, opts), () => node.eventually.not.hasId(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, 'id', 'be', actual, expected, opts.timeout,
      ),
    },
  }),
  toHaveAnyId: createTextMatcherWithoutExpected({
    element: {
      resultFunc: ({ node }) => [
        () => node.currently.hasAnyId(), () => node.currently.not.hasAnyId(),
      ],
      errorTextFunc: ({ node, actual }) => createAnyMessage(node, 'id', 'have', actual),
    },
  }),
  toEventuallyHaveAnyId: createEventuallyTextMatcherWithoutExpected({
    element: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyId(opts), () => node.eventually.not.hasAnyId(opts),
      ],
      errorTextFunc: ({ node, actual, opts }) => createEventuallyAnyMessage(node, 'id', 'have', actual, opts.timeout),
    },
  }),
  toContainId: createTextMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsId(expected), () => node.currently.not.containsId(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'id', 'contain', actual, expected),
    },
  }),
  toEventuallyContainId: createEventuallyTextMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsId(expected, opts), () => node.eventually.not.containsId(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, 'id', 'contain', actual, expected, opts.timeout,
      ),
    },
  }),
  toHaveName: createTextMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasName(expected), () => node.currently.not.hasName(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'name', 'be', actual, expected),
    },
  }),
  toEventuallyHaveName: createEventuallyTextMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasName(expected, opts), () => node.eventually.not.hasName(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, 'name', 'be', actual, expected, opts.timeout,
      ),
    },
  }),
  toHaveAnyName: createTextMatcherWithoutExpected({
    element: {
      resultFunc: ({ node }) => [
        () => node.currently.hasAnyName(), () => node.currently.not.hasAnyName(),
      ],
      errorTextFunc: ({ node, actual }) => createAnyMessage(node, 'name', 'have', actual),
    },
  }),
  toEventuallyHaveAnyName: createEventuallyTextMatcherWithoutExpected({
    element: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyName(opts), () => node.eventually.not.hasAnyName(opts),
      ],
      errorTextFunc: ({ node, actual, opts }) => createEventuallyAnyMessage(node, 'name', 'have', actual, opts.timeout),
    },
  }),
  toContainName: createTextMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsName(expected), () => node.currently.not.containsName(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'name', 'contain', actual, expected),
    },
  }),
  toEventuallyContainName: createEventuallyTextMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsName(expected, opts), () => node.eventually.not.containsName(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, 'name', 'contain', actual, expected, opts.timeout,
      ),
    },
  }),
  toHaveLocation: createLocationMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.currently.hasLocation(expected, opts), () => node.currently.not.hasLocation(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createPropertyMessage(
        node,
        'location',
        (opts && (opts.x > 0 || opts.y > 0)) ? 'be in range' : 'be',
        actual,
        tolerancesToString(expected, opts),
      ),
    },
  }),
  toEventuallyHaveLocation: createEventuallyLocationMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasLocation(expected, opts), () => node.eventually.not.hasLocation(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node,
        'location',
        (opts.tolerances && (opts.tolerances.x > 0 || opts.tolerances.y > 0)) ? 'be in range' : 'be',
        actual,
        tolerancesToString(expected, opts.tolerances),
        opts.timeout,
      ),
    },
  }),
  toHaveX: createNumberWithToleranceMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.currently.hasX(expected, opts), () => node.currently.not.hasX(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createPropertyMessage(
        node,
        'X-coordinate',
        (typeof opts === 'number' && opts > 0) ? 'be in range' : 'be',
        actual,
        tolerancesToString(expected, (typeof opts === 'number') ? opts : undefined),
      ),
    },
  }),
  toEventuallyHaveX: createEventuallyNumberWithToleranceMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasX(expected, opts), () => node.eventually.not.hasX(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node,
        'X-coordinate',
        (opts.tolerance && opts.tolerance > 0) ? 'be in range ' : 'be',
        actual,
        tolerancesToString(expected, opts.tolerance),
        opts.timeout,
      ),
    },
  }),
  toHaveY: createNumberWithToleranceMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.currently.hasY(expected, opts), () => node.currently.not.hasY(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createPropertyMessage(
        node,
        'Y-coordinate',
        (typeof opts === 'number' && opts > 0) ? 'be in range' : 'be',
        actual,
        tolerancesToString(expected, (typeof opts === 'number') ? opts : undefined),
      ),
    },
  }),
  toEventuallyHaveY: createEventuallyNumberWithToleranceMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasY(expected, opts), () => node.eventually.not.hasY(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node,
        'Y-coordinate',
        (opts.tolerance && opts.tolerance > 0) ? 'be in range ' : 'be',
        actual,
        tolerancesToString(expected, opts.tolerance),
        opts.timeout,
      ),
    },
  }),
  toHaveSize: createSizeMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.currently.hasSize(expected, opts), () => node.currently.not.hasSize(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createPropertyMessage(
        node,
        'size',
        (opts && (opts.width > 0 || opts.height > 0)) ? 'be in range' : 'be',
        actual,
        tolerancesToString(expected, opts),
      ),
    },
  }),
  toEventuallyHaveSize: createEventuallySizeMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasSize(expected, opts), () => node.eventually.not.hasSize(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node,
        'size',
        (opts.tolerances && (opts.tolerances.width > 0 || opts.tolerances.height > 0)) ? 'be in range' : 'be',
        actual,
        tolerancesToString(expected, opts.tolerances),
        opts.timeout,
      ),
    },
  }),
  toHaveWidth: createNumberWithToleranceMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.currently.hasWidth(expected, opts), () => node.currently.not.hasWidth(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createPropertyMessage(
        node,
        'width',
        (typeof opts === 'number' && opts > 0) ? 'be in range' : 'be',
        actual,
        tolerancesToString(expected, (typeof opts === 'number') ? opts : undefined),
      ),
    },
  }),
  toEventuallyHaveWidth: createEventuallyNumberWithToleranceMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasWidth(expected, opts), () => node.eventually.not.hasWidth(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node,
        'width',
        (opts.tolerance && opts.tolerance > 0) ? 'be in range ' : 'be',
        actual,
        tolerancesToString(expected, opts.tolerance),
        opts.timeout,
      ),
    },
  }),
  toHaveHeight: createNumberWithToleranceMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.currently.hasHeight(expected, opts), () => node.currently.not.hasHeight(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createPropertyMessage(
        node,
        'height',
        (typeof opts === 'number' && opts > 0) ? 'be in range' : 'be',
        actual,
        tolerancesToString(expected, (typeof opts === 'number') ? opts : undefined),
      ),
    },
  }),
  toEventuallyHaveHeight: createEventuallyNumberWithToleranceMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasHeight(expected, opts), () => node.eventually.not.hasHeight(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node,
        'height',
        (opts.tolerance && opts.tolerance > 0) ? 'be in range ' : 'be',
        actual,
        tolerancesToString(expected, opts.tolerance),
        opts.timeout,
      ),
    },
  }),
};

export const listMatchers: jasmine.CustomMatcherFactories = {
  toBeEmpty: createMatcherWithoutExpected({
    list: {
      resultFunc: ({ node }) => [
        () => node.currently.isEmpty(), () => node.currently.not.isEmpty(),
      ],
      errorTextFunc: ({ node, actual }) => createBaseMessage(
        node,
        [` with length ${actual} to be empty`, ' not to be empty'],
      ),
    },
  }),
  toHaveLength: createListLengthMatcher({
    list: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.currently.hasLength(expected, opts), () => node.currently.not.hasLength(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createBaseMessage(
        node, [
          `'s length ${actual} to be${comparatorStr(opts)} ${expected}`,
          `'s length ${actual} not to be${comparatorStr(opts)} ${expected}`,
        ],
      ),
    },
  }),

  toEventuallyBeEmpty: createEventuallyMatcherWithoutExpected({
    list: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.isEmpty(opts), () => node.eventually.not.isEmpty(opts),
      ],
      errorTextFunc: ({ node, actual, opts }) => createBaseMessage(
        node,
        [` with length ${actual} to be empty within ${opts.timeout}ms`, ` not to be empty within ${opts.timeout}ms`],
      ),
    },
  }),
  toEventuallyHaveLength: createEventuallyListLengthMatcher({
    list: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasLength(expected, opts), () => node.eventually.not.hasLength(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createBaseMessage(
        node, [
          `'s length ${actual} to be${comparatorStr(opts.comparator)} ${expected} within ${opts.timeout}ms`,
          `'s length ${actual} not to be${comparatorStr(opts.comparator)} ${expected} within ${opts.timeout}ms`,
        ],
      ),
    },
  }),
};

export const allMatchers: jasmine.CustomMatcherFactories = {
  toExist: createMatcherWithoutExpected({
    element: {
      resultFunc: ({ node }) => [() => node.currently.exists(), () => node.currently.not.exists()],
      errorTextFunc: ({ node }) => createMessage(node, 'exist'),
    },
    list: {
      resultFunc: ({ node, opts }) => {
        if (_.isArray(opts)) {
          throw new Error('Filtermask for toExist() on PageElementList can only be boolean');
        } else {
          return [
            () => node.currently.exists(opts), () => node.currently.not.exists(opts),
          ];
        }
      },
      errorTextFunc: ({ node }) => [
        `Expected at least one of ${node.constructor.name}'s elements to exist.\n( ${node.__getNodeId()} )`,
        `Expected none one of ${node.constructor.name}'s elements to exist.\n( ${node.__getNodeId()} )`,
      ],
    },
    map: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.exists(opts), () => node.currently.not.exists(opts),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'exist'),
    },
    group: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.exists(opts), () => node.currently.not.exists(opts),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'exist'),
    },
  }),
  toEventuallyExist: createEventuallyMatcherWithoutExpected({
    element: {
      resultFunc: ({ node, opts }) => [() => node.eventually.exists(opts), () => node.eventually.not.exists(opts)],
      errorTextFunc: ({ node, opts }) => createEventuallyMessage(node, 'exist', opts.timeout),
    },
    list: {
      resultFunc: ({ node, opts }) => {
        const { filterMask, ...otherOpts } = opts;

        if (_.isArray(filterMask)) {
          throw new Error('Filtermask for toEventuallyExist() on PageElementList can only be boolean');
        } else {
          return [
            () => node.eventually.exists({ filterMask, ...otherOpts }),
            () => node.eventually.not.exists({ filterMask, ...otherOpts }),
          ];
        }
      },
      errorTextFunc: ({ node, opts }) => [
        `Expected at least one of ${node.constructor.name}'s elements to eventually exist within ${opts.timeout}ms.
( ${node.__getNodeId()} )`,
        `Expected none one of ${node.constructor.name}'s elements to eventually exist within ${opts.timeout}ms.
( ${node.__getNodeId()} )`,
      ],
    },
    map: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.exists(opts), () => node.eventually.not.exists(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'exist', opts.timeout),
    },
    group: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.exists(opts), () => node.eventually.not.exists(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'exist', opts.timeout),
    },
  }),
  toBeVisible: createMatcherWithoutExpected({
    element: {
      resultFunc: ({ node }) => [() => node.currently.isVisible(), () => node.currently.not.isVisible()],
      errorTextFunc: ({ node }) => createMessage(node, 'be visible'),
    },
    list: {
      resultFunc: ({ node, opts }) => [() => node.currently.isVisible(opts), () => node.currently.not.isVisible(opts)],
      errorTextFunc: ({ node }) => createEachMessage(node, 'be visible'),
    },
    map: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.isVisible(opts), () => node.currently.not.isVisible(opts),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'be visible'),
    },
    group: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.isVisible(opts), () => node.currently.not.isVisible(opts),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'be visible'),
    },
  }),
  toEventuallyBeVisible: createEventuallyMatcherWithoutExpected({
    element: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyMessage(node, 'be visible', opts.timeout),
    },
    list: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'be visible', opts.timeout),
    },
    map: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'be visible', opts.timeout),
    },
    group: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'be visible', opts.timeout),
    },
  }),
  toBeEnabled: createMatcherWithoutExpected({
    element: {
      resultFunc: ({ node }) => [() => node.currently.isEnabled(), () => node.currently.not.isEnabled()],
      errorTextFunc: ({ node }) => createMessage(node, 'be enabled'),
    },
    list: {
      resultFunc: ({ node, opts }) => [() => node.currently.isEnabled(opts), () => node.currently.not.isEnabled(opts)],
      errorTextFunc: ({ node }) => createEachMessage(node, 'be enabled'),
    },
    map: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.isEnabled(opts), () => node.currently.not.isEnabled(opts),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'be enabled'),
    },
    group: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.isEnabled(opts), () => node.currently.not.isEnabled(opts),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'be enabled'),
    },
  }),
  toEventuallyBeEnabled: createEventuallyMatcherWithoutExpected({
    element: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyMessage(node, 'be enabled', opts.timeout),
    },
    list: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'be enabled', opts.timeout),
    },
    map: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'be enabled', opts.timeout),
    },
    group: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'be enabled', opts.timeout),
    },
  }),
  toHaveText: createTextMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasText(expected), () => node.currently.not.hasText(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'text', 'be', actual, expected),
    },
    list: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasText(expected), () => node.currently.not.hasText(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'have text'),
    },
    map: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasText(expected), () => node.currently.not.hasText(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'have text'),
    },
    group: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasText(expected), () => node.currently.not.hasText(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'have text'),
    },
  }),
  toEventuallyHaveText: createEventuallyTextMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, 'text', 'be', actual, expected, opts.timeout,
      ),
    },
    list: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have text', opts.timeout),
    },
    map: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have text', opts.timeout),
    },
    group: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have text', opts.timeout),
    },
  }),
  toHaveAnyText: createTextMatcherWithoutExpected({
    element: {
      resultFunc: ({ node }) => [
        () => node.currently.hasAnyText(), () => node.currently.not.hasAnyText(),
      ],
      errorTextFunc: ({ node, actual }) => createAnyMessage(node, 'text', 'have', actual),
    },
    list: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.hasAnyText(opts), () => node.currently.not.hasAnyText(opts),
      ],
      errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any text'),
    },
    map: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.hasAnyText(opts), () => node.currently.not.hasAnyText(opts),
      ],
      errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any text'),
    },
    group: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.hasAnyText(opts), () => node.currently.not.hasAnyText(opts),
      ],
      errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any text'),
    },
  }),
  toEventuallyHaveAnyText: createEventuallyTextMatcherWithoutExpected({
    element: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyText(opts), () => node.eventually.not.hasAnyText(opts),
      ],
      errorTextFunc: ({ node, actual, opts }) => createEventuallyAnyMessage(node, 'text', 'have', actual, opts.timeout),
    },
    list: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyText(opts), () => node.eventually.not.hasAnyText(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any text', opts.timeout),
    },
    map: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyText(opts), () => node.eventually.not.hasAnyText(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any text', opts.timeout),
    },
    group: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyText(opts), () => node.eventually.not.hasAnyText(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any text', opts.timeout),
    },
  }),
  toContainText: createTextMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsText(expected), () => node.currently.not.containsText(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'text', 'contain', actual, expected),
    },
    list: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsText(expected), () => node.currently.not.containsText(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'contain text'),
    },
    map: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsText(expected), () => node.currently.not.containsText(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'contain text'),
    },
    group: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsText(expected), () => node.currently.not.containsText(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'contain text'),
    },
  }),
  toEventuallyContainText: createEventuallyTextMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsText(expected, opts), () => node.eventually.not.containsText(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, 'text', 'contain', actual, expected, opts.timeout,
      ),
    },
    list: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsText(expected, opts), () => node.eventually.not.containsText(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain text', opts.timeout),
    },
    map: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsText(expected, opts), () => node.eventually.not.containsText(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain text', opts.timeout),
    },
    group: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsText(expected, opts), () => node.eventually.not.containsText(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain text', opts.timeout),
    },
  }),
  toHaveDirectText: createTextMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasDirectText(expected), () => node.currently.not.hasDirectText(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'direct text', 'be', actual, expected),
    },
    list: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasDirectText(expected), () => node.currently.not.hasDirectText(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'have direct text'),
    },
    map: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasDirectText(expected), () => node.currently.not.hasDirectText(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'have direct text'),
    },
    group: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasDirectText(expected), () => node.currently.not.hasDirectText(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'have direct text'),
    },
  }),
  toEventuallyHaveDirectText: createEventuallyTextMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasDirectText(expected, opts), () => node.eventually.not.hasDirectText(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, 'direct text', 'be', actual, expected, opts.timeout,
      ),
    },
    list: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasDirectText(expected, opts), () => node.eventually.not.hasDirectText(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have direct text', opts.timeout),
    },
    map: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasDirectText(expected, opts), () => node.eventually.not.hasDirectText(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have direct text', opts.timeout),
    },
    group: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasDirectText(expected, opts), () => node.eventually.not.hasDirectText(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have direct text', opts.timeout),
    },
  }),
  toHaveAnyDirectText: createTextMatcherWithoutExpected({
    element: {
      resultFunc: ({ node }) => [
        () => node.currently.hasAnyDirectText(), () => node.currently.not.hasAnyDirectText(),
      ],
      errorTextFunc: ({ node, actual }) => createAnyMessage(node, 'direct text', 'have', actual),
    },
    list: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.hasAnyDirectText(opts), () => node.currently.not.hasAnyDirectText(opts),
      ],
      errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any direct text'),
    },
    map: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.hasAnyDirectText(opts), () => node.currently.not.hasAnyDirectText(opts),
      ],
      errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any direct text'),
    },
    group: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.hasAnyDirectText(opts), () => node.currently.not.hasAnyDirectText(opts),
      ],
      errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any direct text'),
    },
  }),
  toEventuallyHaveAnyDirectText: createEventuallyTextMatcherWithoutExpected({
    element: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyDirectText(opts), () => node.eventually.not.hasAnyDirectText(opts),
      ],
      errorTextFunc: ({ node, actual, opts }) => createEventuallyAnyMessage(
        node, 'direct text', 'have', actual, opts.timeout,
      ),
    },
    list: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyDirectText(opts), () => node.eventually.not.hasAnyDirectText(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any direct text', opts.timeout),
    },
    map: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyDirectText(opts), () => node.eventually.not.hasAnyDirectText(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any direct text', opts.timeout),
    },
    group: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyDirectText(opts), () => node.eventually.not.hasAnyDirectText(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any direct text', opts.timeout),
    },
  }),
  toContainDirectText: createTextMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsDirectText(expected), () => node.currently.not.containsDirectText(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(
        node, 'direct text', 'contain', actual, expected,
      ),
    },
    list: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsDirectText(expected), () => node.currently.not.containsDirectText(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'contain direct text'),
    },
    map: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsDirectText(expected), () => node.currently.not.containsDirectText(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'contain direct text'),
    },
    group: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsDirectText(expected), () => node.currently.not.containsDirectText(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'contain direct text'),
    },
  }),
  toEventuallyContainDirectText: createEventuallyTextMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsDirectText(expected, opts),
        () => node.eventually.not.containsDirectText(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, 'direct text', 'contain', actual, expected, opts.timeout,
      ),
    },
    list: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsDirectText(expected, opts),
        () => node.eventually.not.containsDirectText(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain direct text', opts.timeout),
    },
    map: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsDirectText(expected, opts),
        () => node.eventually.not.containsDirectText(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain direct text', opts.timeout),
    },
    group: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsDirectText(expected, opts),
        () => node.eventually.not.containsDirectText(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain direct text', opts.timeout),
    },
  }),
};

export const valueAllMatchers: jasmine.CustomMatcherFactories = {
  toHaveValue: createValueMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'value', 'be', actual, expected),
    },
    list: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'have value'),
    },
    map: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'have value'),
    },
    group: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'have value'),
    },
  }),
  toEventuallyHaveValue: createEventuallyValueMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasValue(expected, opts), () => node.eventually.not.hasValue(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, 'value', 'be', actual, expected, opts.timeout,
      ),
    },
    list: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasValue(expected, opts), () => node.eventually.not.hasValue(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have value', opts.timeout),
    },
    map: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasValue(expected, opts), () => node.eventually.not.hasValue(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have value', opts.timeout),
    },
    group: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.hasValue(expected, opts), () => node.eventually.not.hasValue(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have value', opts.timeout),
    },
  }),
  toHaveAnyValue: createValueMatcherWithoutExpected({
    element: {
      resultFunc: ({ node }) => [
        () => node.currently.hasAnyValue(), () => node.currently.not.hasAnyValue(),
      ],
      errorTextFunc: ({ node, actual }) => createAnyMessage(node, 'value', 'have', actual),
    },
    list: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.hasAnyValue(opts), () => node.currently.not.hasAnyValue(opts),
      ],
      errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any value'),
    },
    map: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.hasAnyValue(opts), () => node.currently.not.hasAnyValue(opts),
      ],
      errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any value'),
    },
    group: {
      resultFunc: ({ node, opts }) => [
        () => node.currently.hasAnyValue(opts), () => node.currently.not.hasAnyValue(opts),
      ],
      errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any value'),
    },
  }),
  toEventuallyHaveAnyValue: createEventuallyValueMatcherWithoutExpected({
    element: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyValue(opts), () => node.eventually.not.hasAnyValue(opts),
      ],
      errorTextFunc: ({ node, actual, opts }) => createEventuallyAnyMessage(
        node, 'value', 'have', actual, opts.timeout,
      ),
    },
    list: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyValue(opts), () => node.eventually.not.hasAnyValue(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any value', opts.timeout),
    },
    map: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyValue(opts), () => node.eventually.not.hasAnyValue(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any value', opts.timeout),
    },
    group: {
      resultFunc: ({ node, opts }) => [
        () => node.eventually.hasAnyValue(opts), () => node.eventually.not.hasAnyValue(opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any value', opts.timeout),
    },
  }),
  toContainValue: createValueMatcher({
    element: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsValue(expected), () => node.currently.not.containsValue(expected),
      ],
      errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'value', 'contain', actual, expected),
    },
    list: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsValue(expected), () => node.currently.not.containsValue(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'contain value'),
    },
    map: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsValue(expected), () => node.currently.not.containsValue(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'contain value'),
    },
    group: {
      resultFunc: ({ node, expected }) => [
        () => node.currently.containsValue(expected), () => node.currently.not.containsValue(expected),
      ],
      errorTextFunc: ({ node }) => createEachMessage(node, 'contain value'),
    },
  }),
  toEventuallyContainValue: createEventuallyValueMatcher({
    element: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsValue(expected, opts), () => node.eventually.not.containsValue(expected, opts),
      ],
      errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(
        node, 'value', 'contain', actual, expected, opts.timeout,
      ),
    },
    list: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsValue(expected, opts), () => node.eventually.not.containsValue(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain value', opts.timeout),
    },
    map: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsValue(expected, opts), () => node.eventually.not.containsValue(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain value', opts.timeout),
    },
    group: {
      resultFunc: ({ node, expected, opts }) => [
        () => node.eventually.containsValue(expected, opts), () => node.eventually.not.containsValue(expected, opts),
      ],
      errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain value', opts.timeout),
    },
  }),
};

export const pageMatchers: jasmine.CustomMatcherFactories = {
  toBeOpen: createPageMatcher({
    resultFunc: ({ page, opts }) => [
      () => page.isOpen(opts), () => !page.isOpen(opts),
    ],
    errorTextFunc: ({ page }) => [
      `Expected ${page.constructor.name} to be open.`,
      `Expected ${page.constructor.name} not to be open.`,
    ],
  }),
  toBeClosed: createPageMatcher({
    resultFunc: ({ page, opts }) => [
      () => page.isClosed(opts), () => !page.isClosed(opts),
    ],
    errorTextFunc: ({ page }) => [
      `Expected ${page.constructor.name} to be closed.`,
      `Expected ${page.constructor.name} not to be closed.`,
    ],
  }),
  toEventuallyBeOpen: createPageMatcher({
    resultFunc: ({ page, opts }) => [
      () => page.eventually.isOpen(opts), () => !page.eventually.isOpen(opts),
    ],
    errorTextFunc: ({ page, opts }) => [
      `Expected ${page.constructor.name} to eventually be open within ${opts.timeout}ms.`,
      `Expected ${page.constructor.name} not to eventually be open within ${opts.timeout}ms.`,
    ],
  }),
  toEventuallyBeClosed: createPageMatcher({
    resultFunc: ({ page, opts }) => [
      () => page.eventually.isClosed(opts), () => !page.eventually.isClosed(opts),
    ],
    errorTextFunc: ({ page, opts }) => [
      `Expected ${page.constructor.name} to eventually be closed within ${opts.timeout}ms.`,
      `Expected ${page.constructor.name} not to eventually be closed within ${opts.timeout}ms.`,
    ],
  }),
};

export function expectElement<
  Store extends stores.PageNodeStore,
  PageElementType extends elements.PageElement<Store>
>(element: PageElementType) {
  return expect(element);
}

export function expectList<
  Store extends stores.PageNodeStore,
  PageElementType extends elements.PageElement<Store>,
  PageElementOptions,
  PageElementListType extends elements.PageElementList<Store, PageElementType, PageElementOptions>
>(list: PageElementListType) {
  return expect(list);
}

export function expectMap<
  Store extends stores.PageNodeStore,
  K extends string,
  PageElementType extends elements.PageElement<Store>,
  PageElementOptions,
  PageElementMapType extends elements.PageElementMap<Store, K, PageElementType, PageElementOptions>
>(map: PageElementMapType) {
  return expect(map);
}

export function expectGroup<
  Store extends stores.PageNodeStore,
  Content extends {[K in keyof Content] : Workflo.PageNode.IPageNode},
  PageElementGroupType extends elements.PageElementGroup<Store, Content>
>(group: PageElementGroupType) {
  return expect(group);
}

export function expectPage<
  Store extends stores.PageNodeStore,
  PageType extends pages.Page<Store, IsOpenOpts, IsClosedOpts>,
  IsOpenOpts extends {},
  IsClosedOpts extends {}
>(page: PageType) {
  return expect(page);
}
