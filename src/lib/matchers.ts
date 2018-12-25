import { elements, stores } from './page_objects'
import * as _ from 'lodash'

// MATCHER FUNTCION INTERFACES

type WithoutExpected = 'element' | 'list' | 'map' | 'group'

export interface IMatcherArgs<
  NodeType extends Workflo.PageNode.INode,
  ExpectedType,
  OptsType
> {
  resultFunc: ResultFunction<
    NodeType,
    OptsType,
    ExpectedType
  >,
  errorTextFunc: ErrorTextFunction<
    NodeType,
    OptsType,
    ExpectedType
  >
}

export interface IResultFuncArgs<
  NodeType extends Workflo.PageNode.INode,
  OptsType,
  ExpectedType
> {
  node: NodeType;
  expected: ExpectedType;
  opts: OptsType;
}

export interface IResultFuncWithoutExpected<
  NodeType extends Workflo.PageNode.INode,
  OptsType
> {
  node: NodeType;
  opts: OptsType;
}

export type ResultFunctionResult = () => boolean

export type ResultFunction<
  NodeType extends Workflo.PageNode.INode,
  OptsType,
  ExpectedType
> = (args: IResultFuncArgs<NodeType, OptsType, ExpectedType>) => ResultFunctionResult[]

export type ResultWithoutExpectedFunction<
  NodeType extends Workflo.PageNode.INode,
  OptsType
> = (args: IResultFuncWithoutExpected<NodeType, OptsType>) => ResultFunctionResult[]

export interface ErrorFuncArgs<
  NodeType extends Workflo.PageNode.INode,
  OptsType,
  ExpectedType,
> {
  actual: string;
  expected: ExpectedType;
  node: NodeType;
  opts: OptsType;
}

export interface ErrorFuncWithoutExpected<
  NodeType extends Workflo.PageNode.INode,
  OptsType
> {
  actual: string;
  node: NodeType;
  opts: OptsType;
}

export type ErrorTextFunction<
  NodeType extends Workflo.PageNode.INode,
  OptsType,
  ExpectedType,
> = (args: ErrorFuncArgs<NodeType, OptsType, ExpectedType>) => string[]

export type ErrorTextWithoutExpectedFunction<
  NodeType extends Workflo.PageNode.INode,
  OptsType
> = (args: ErrorFuncWithoutExpected<NodeType, OptsType>) => string[]

export interface ICompareElementFuncs<
  ElementExpectedType = never,
  ListExpectedType = never,
  MapExpectedType = never,
  GroupExpectedType = never
> {
  element?: IMatcherArgs<
    elements.PageElement<stores.PageElementStore>,
    ElementExpectedType,
    never
  >,
  list?: IMatcherArgs<
    elements.PageElementList<
      stores.PageElementStore,
      elements.PageElement<stores.PageElementStore>,
      elements.IPageElementOpts<stores.PageElementStore>
    >,
    ListExpectedType,
    Workflo.PageNode.ListFilterMask
  >,
  map?: IMatcherArgs<
    elements.PageElementMap<
      stores.PageElementStore,
      string,
      elements.PageElement<stores.PageElementStore>,
      elements.IPageElementOpts<stores.PageElementStore>
    >,
    MapExpectedType,
    Workflo.PageNode.MapFilterMask<string>
  >,
  group?: IMatcherArgs<
    elements.PageElementGroup<stores.PageElementStore, Workflo.PageNode.GroupContent>,
    GroupExpectedType,
    Workflo.PageNode.GroupFilterMask<Workflo.PageNode.GroupContent>
  >
}

export interface ICompareEventuallyElementFuncs<
  ElementExpectedType = undefined,
  ListExpectedType = undefined,
  MapExpectedType = undefined,
  GroupExpectedType = undefined
> {
  element?: IMatcherArgs<
    elements.PageElement<stores.PageElementStore>,
    ElementExpectedType,
    Workflo.IWDIOParamsInterval
  >,
  list?: IMatcherArgs<
    elements.PageElementList<
      stores.PageElementStore,
      elements.PageElement<stores.PageElementStore>,
      elements.IPageElementOpts<stores.PageElementStore>
    >,
    ListExpectedType,
    Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask
  >,
  map?: IMatcherArgs<
    elements.PageElementMap<
      stores.PageElementStore,
      string,
      elements.PageElement<stores.PageElementStore>,
      elements.IPageElementOpts<stores.PageElementStore>
    >,
    MapExpectedType,
    Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<string>
  >,
  group?: IMatcherArgs<
    elements.PageElementGroup<stores.PageElementStore, Workflo.PageNode.GroupContent>,
    GroupExpectedType,
    Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Workflo.PageNode.GroupContent>
  >
}

export interface ICompareValueElementFuncs<
  ElementValueType = any,
  ListValueType = any | any[],
  MapValueType = Partial<Record<string, any>>,
  GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>
> {
  element?: IMatcherArgs<
    elements.ValuePageElement<stores.PageElementStore, ElementValueType>,
    ElementValueType,
    never
  >,
  list?: IMatcherArgs<
    elements.ValuePageElementList<
      stores.PageElementStore,
      elements.ValuePageElement<stores.PageElementStore, ElementValueType>,
      elements.IValuePageElementOpts<stores.PageElementStore>,
      ElementValueType
    >,
    ListValueType,
    Workflo.PageNode.ListFilterMask
  >,
  map?: IMatcherArgs<
    elements.ValuePageElementMap<
      stores.PageElementStore,
      string,
      elements.ValuePageElement<stores.PageElementStore, ElementValueType>,
      elements.IPageElementOpts<stores.PageElementStore>,
      ElementValueType
    >,
    MapValueType,
    Workflo.PageNode.MapFilterMask<string>
  >,
  group?: IMatcherArgs<
    elements.ValuePageElementGroup<stores.PageElementStore, Workflo.PageNode.GroupContent>,
    GroupValueType,
    Workflo.PageNode.GroupFilterMask<Workflo.PageNode.GroupContent>
  >
}

export interface ICompareEventuallyValueElementFuncs<
  ElementValueType = any,
  ListValueType = any | any[],
  MapValueType = Partial<Record<string, any>>,
  GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>
> {
  element?: IMatcherArgs<
    elements.ValuePageElement<stores.PageElementStore, ElementValueType>,
    ElementValueType,
    Workflo.IWDIOParamsInterval
  >,
  list?: IMatcherArgs<
    elements.ValuePageElementList<
      stores.PageElementStore,
      elements.ValuePageElement<stores.PageElementStore, ElementValueType>,
      elements.IValuePageElementOpts<stores.PageElementStore>,
      ElementValueType
    >,
    ListValueType,
    Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask
  >,
  map?: IMatcherArgs<
    elements.ValuePageElementMap<
      stores.PageElementStore,
      string,
      elements.ValuePageElement<stores.PageElementStore, ElementValueType>,
      elements.IPageElementOpts<stores.PageElementStore>,
      ElementValueType
    >,
    MapValueType,
    Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<string>
  >,
  group?: IMatcherArgs<
    elements.ValuePageElementGroup<stores.PageElementStore, Workflo.PageNode.GroupContent>,
    GroupValueType,
    Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Workflo.PageNode.GroupContent>
  >
}

// MATCHER FUNCS

function isWithoutExpected(node: Workflo.PageNode.INode, withoutExpected: WithoutExpected[] = []) {
  let _withoutExpected = false

  if (node instanceof elements.PageElement) {
    if (withoutExpected.indexOf('element') >= 0) {
      _withoutExpected = true
    }
  } else if (node instanceof elements.PageElementList) {
    if (withoutExpected.indexOf('list') >= 0) {
      _withoutExpected = true
    }
  } else if (node instanceof elements.PageElementMap) {
    if (withoutExpected.indexOf('map') >= 0) {
      _withoutExpected = true
    }
  } else if (node instanceof elements.PageElementGroup) {
    if (withoutExpected.indexOf('group') >= 0) {
      _withoutExpected = true
    }
  } else {
    throw new Error(`Unknown node type in matchers: ${node.constructor.name}.` +
      `Node type needs to extend PageElement, PageElementList, PageElementMap or PageElementGroup.`)
  }

  return _withoutExpected
}

export function createMatcher<
  OptsType extends Object = Object,
  CompareFuncsType extends (ICompareElementFuncs<
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  > | ICompareEventuallyElementFuncs<
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >) = ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
  ElementExpectedType = never,
  ListExpectedType = never,
  MapExpectedType = never,
  GroupExpectedType = never,
>(
  compareFuncs: CompareFuncsType,
  ensureOpts: boolean = false,
  withoutExpected: WithoutExpected[] = [],
) {
  return (util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>) => {

    function baseCompareFunction(
      node: Workflo.PageNode.INode,
      negativeComparison: boolean,
      opts: OptsType = undefined,
      expected: any = undefined,
    ): jasmine.CustomMatcherResult {
      let result: jasmine.CustomMatcherResult = {
        pass: true,
        message: ''
      };

      let resultFunc: ResultFunction<Workflo.PageNode.INode, any, {timeout?: number}>
      let errorTextFunc: ErrorTextFunction<Workflo.PageNode.INode, any, {timeout?: number}>

      if (node instanceof elements.PageElement) {
        if (compareFuncs.element) {
          ({resultFunc, errorTextFunc} = compareFuncs.element)
        } else {
          throw new Error(`No PageElement matcher was implemented for node type ${node.constructor.name}`)
        }
      } else if (node instanceof elements.PageElementList) {
        if (compareFuncs.list) {
          ({resultFunc, errorTextFunc} = compareFuncs.list)
        } else {
          throw new Error(`No PageElementList matcher was implemented for node type ${node.constructor.name}`)
        }
      } else if (node instanceof elements.PageElementMap) {
        if (compareFuncs.map) {
          ({resultFunc, errorTextFunc} = compareFuncs.map)
        } else {
          throw new Error(`No PageElementMap matcher was implemented for node type ${node.constructor.name}`)
        }
      } else if (node instanceof elements.PageElementGroup) {
        if (compareFuncs.group) {
          ({resultFunc, errorTextFunc} = compareFuncs.group)
        } else {
          throw new Error(`No PageElementGroup matcher was implemented for node type ${node.constructor.name}`)
        }
      } else {
        throw new Error(`Unknown node type in matchers: ${node.constructor.name}.` +
          `Node type needs to extend PageElement, PageElementList, PageElementMap or PageElementGroup.`)
      }

      if (ensureOpts && typeof opts === 'undefined') {
        opts = Object.create(null)
      }

      const successes = resultFunc({node, expected, opts})
      const success = (negativeComparison) ? successes[1]() : successes[0]()

      if (!success) {
        let optsWithTimeout: OptsType & {timeout?: number} = (typeof opts === 'object') ? opts : Object.create(null);

        if (!optsWithTimeout['timeout'] ) {
          optsWithTimeout.timeout = node.getTimeout()
        }

        const actual = node.__lastDiff.actual
        const errorTexts = errorTextFunc({actual, expected, node, opts: optsWithTimeout})
        let errorText: string = undefined

        if ( negativeComparison && errorTexts.length > 1 ) {
          errorText = errorTexts[1]
        } else {
          errorText = errorTexts[0]
        }

        result.pass = false;
        result.message = errorText;
      }

      return result;
    }

    return {
      compare: (
        node: Workflo.PageNode.INode, expectedOrOpts?: any | OptsType, opts?: OptsType
      ): jasmine.CustomMatcherResult => {
        if (isWithoutExpected(node, withoutExpected)) {
          return baseCompareFunction(node, false, expectedOrOpts as OptsType);
        } else {
          return baseCompareFunction(node, false, opts, expectedOrOpts);
        }
      },
      negativeCompare: (
        node: Workflo.PageNode.INode, expectedOrOpts?: any | OptsType, opts?: OptsType
      ): jasmine.CustomMatcherResult => {
        if (isWithoutExpected(node, withoutExpected)) {
          return baseCompareFunction(node, true, expectedOrOpts as OptsType);
        } else {
          return baseCompareFunction(node, true, opts, expectedOrOpts);
        }
      }
    }
  }
}

export function createMatcherWithoutExpected<
  OptsType extends Object = Object
>(
  compareFuncs: ICompareElementFuncs,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group']
) {
  return createMatcher<OptsType>(compareFuncs, false, withoutExpected)
}

export function createEventuallyMatcher<
  OptsType extends Object = Workflo.IWDIOParamsInterval
>(
  compareFuncs: ICompareEventuallyElementFuncs
) {
  return createMatcher<OptsType, ICompareEventuallyElementFuncs>(compareFuncs, true)
}

export function createEventuallyMatcherWithoutExpected<
  OptsType extends Object = Workflo.IWDIOParamsInterval,
>(
  compareFuncs: ICompareEventuallyElementFuncs,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group']
) {
  return createMatcher<OptsType, ICompareEventuallyElementFuncs>(compareFuncs, true, withoutExpected)
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
  return createMatcher<
    OptsType,
    ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, false)
}

export function createTextMatcherWithoutExpected<
  OptsType extends Object = Object,
  ElementExpectedType = string,
  ListExpectedType = string | string[],
  MapExpectedType = Record<string, string>,
  GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group']
) {
  return createMatcher<
    OptsType,
    ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, false, withoutExpected)
}

export function createEventuallyTextMatcher<
  OptsType extends Object = Workflo.IWDIOParamsInterval,
  ElementExpectedType = string,
  ListExpectedType = string | string[],
  MapExpectedType = Record<string, string>,
  GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareEventuallyElementFuncs<
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >
) {
  return createMatcher<
    OptsType,
    ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, true)
}

export function createEventuallyTextMatcherWithoutExpected<
  OptsType extends Object = Workflo.IWDIOParamsInterval,
  ElementExpectedType = string,
  ListExpectedType = string | string[],
  MapExpectedType = Record<string, string>,
  GroupExpectedType = Workflo.PageNode.ExtractText<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareEventuallyElementFuncs<
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group']
) {
  return createMatcher<
    OptsType,
    ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, true, withoutExpected)
}

export function createBooleanMatcher<
  OptsType extends Object = Object,
  ElementExpectedType = boolean,
  ListExpectedType = boolean | boolean[],
  MapExpectedType = Record<string, boolean>,
  GroupExpectedType = Workflo.PageNode.ExtractBoolean<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>
) {
  return createMatcher<
    OptsType,
    ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs)
}

export function createBooleanMatcherWithoutExpected<
  OptsType extends Object = Object,
  ElementExpectedType = boolean,
  ListExpectedType = boolean | boolean[],
  MapExpectedType = Record<string, boolean>,
  GroupExpectedType = Workflo.PageNode.ExtractBoolean<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group']
) {
  return createMatcher<
    OptsType,
    ICompareElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, false, withoutExpected)
}

export function createEventuallyBooleanMatcher<
  OptsType extends Object = Workflo.IWDIOParamsInterval,
  ElementExpectedType = boolean,
  ListExpectedType = boolean | boolean[],
  MapExpectedType = Record<string, boolean>,
  GroupExpectedType = Workflo.PageNode.ExtractBoolean<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareEventuallyElementFuncs<
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >
) {
  return createMatcher<
    OptsType,
    ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, true)
}

export function createEventuallyBooleanMatcherWithoutExpected<
  OptsType extends Object = Workflo.IWDIOParamsInterval,
  ElementExpectedType = boolean,
  ListExpectedType = boolean | boolean[],
  MapExpectedType = Record<string, boolean>,
  GroupExpectedType = Workflo.PageNode.ExtractBoolean<Workflo.PageNode.GroupContent>,
>(
  compareFuncs: ICompareEventuallyElementFuncs<
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group']
) {
  return createMatcher<
    OptsType,
    ICompareEventuallyElementFuncs<ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType>,
    ElementExpectedType, ListExpectedType, MapExpectedType, GroupExpectedType
  >(compareFuncs, true, withoutExpected)
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
  return createMatcher<
    OptsType,
    ICompareValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
    ElementValueType, ListValueType, MapValueType, GroupValueType
  >(compareFuncs)
}

export function createValueMatcherWithoutExpected<
  OptsType extends Object = Object,
  ElementValueType = any,
  ListValueType = any | any[],
  MapValueType = Partial<Record<string, any>>,
  GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>
>(
  compareFuncs: ICompareValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group']
) {
  return createMatcher<
    OptsType,
    ICompareValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
    ElementValueType, ListValueType, MapValueType, GroupValueType
  >(compareFuncs, false, withoutExpected)
}

export function createEventuallyValueMatcher<
  OptsType extends Object = Workflo.IWDIOParamsInterval,
  ElementValueType = any,
  ListValueType = any | any[],
  MapValueType = Partial<Record<string, any>>,
  GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>
>(
  compareFuncs: ICompareEventuallyValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
) {
  return createMatcher<
    OptsType,
    ICompareEventuallyValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
    ElementValueType, ListValueType, MapValueType, GroupValueType
  >(compareFuncs, true)
}

export function createEventuallyValueMatcherWithoutExpected<
  OptsType extends Object = Workflo.IWDIOParamsInterval,
  ElementValueType = any,
  ListValueType = any | any[],
  MapValueType = Partial<Record<string, any>>,
  GroupValueType = Workflo.PageNode.ExtractValue<Workflo.PageNode.GroupContent>
>(
  compareFuncs: ICompareEventuallyValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
  withoutExpected: WithoutExpected[] = ['element', 'list', 'map', 'group']
) {
  return createMatcher<
    OptsType,
    ICompareEventuallyValueElementFuncs<ElementValueType, ListValueType, MapValueType, GroupValueType>,
    ElementValueType, ListValueType, MapValueType, GroupValueType
  >(compareFuncs, true, withoutExpected)
}

// export function createValueMatcherWithoutExpected<
//   NodeType extends Workflo.PageNode.INode,
//   OptsType extends Object = {timeout?: number},
// >(
//   compareFuncs: ICompareValueElementFuncs,
// ) {
//   return createMatcher<NodeType, OptsType, undefined, ICompareValueElementFuncs>(compareFuncs, true)
// }


// ERROR TEXT FUNCTIONS

function convertDiffToMessages(
  diff: Workflo.IDiff, actualOnly: boolean = false, comparisonLines: string[] = [], paths: string[] = []
): string[] {
  if (diff.tree && Object.keys(diff.tree).length > 0) {
    const keys = Object.keys(diff.tree)

    keys.forEach(
      key => {
        const _paths = [...paths]
        _paths.push(key)

        convertDiffToMessages(diff.tree[key], actualOnly, comparisonLines, _paths)
      }
    )
  } else {
    let _paths = paths.join('')

    if (_paths.charAt(0) === '.') {
      _paths = _paths.substring(1)
    }

    const _actual = printValue(diff.actual)
    const _expected = printValue(diff.expected)

    let compareStr = ''

    if (actualOnly) {
      compareStr = (typeof diff.actual === 'undefined') ?
      '' :`{actual: "${_actual}"}\n`
    } else {
      compareStr = (typeof diff.actual === 'undefined' && typeof diff.expected === 'undefined') ?
      '' :`{actual: "${_actual}", expected: "${_expected}"}\n`
    }

    comparisonLines.push(`${diff.constructorName} at path '${_paths}'\n${compareStr}( ${diff.selector} )`)
  }

  return comparisonLines
}

function printValue(value: any) {
  if (typeof value === 'undefined') {
    return ''
  } else if (value === null) {
    return ''
  }

  return value.toString()
}

export function createBaseMessage<
  Store extends stores.PageElementStore,
  NodeType extends elements.PageElement<Store>
>(node: NodeType, errorTexts: string | string[]) {
  let errorText = undefined
  let notErrorText = undefined

  if ( _.isArray(errorTexts) ) {
    errorText = errorTexts[0]
    notErrorText = errorTexts[1]
  } else {
    errorText = errorTexts
    notErrorText = errorTexts
  }

  return [
    `Expected ${node.constructor.name}${errorText}.\n( ${node.__getNodeId()} )`,
    `Expected ${node.constructor.name}${notErrorText}.\n( ${node.__getNodeId()} )`
  ]
}

export function createMessage<
  Store extends stores.PageElementStore,
  NodeType extends elements.PageElement<Store>
>(node: NodeType, errorTexts: string | string[]) {
  let errorText = undefined
  let notErrorText = undefined

  if ( _.isArray(errorTexts) ) {
    errorText = errorTexts[0]
    notErrorText = errorTexts[1]
  } else {
    errorText = errorTexts
    notErrorText = errorTexts
  }

  return createBaseMessage(node, [
    ` to ${errorText}`,
    ` not to ${notErrorText}`
  ])
}

export function createEventuallyMessage<
  Store extends stores.PageElementStore,
  NodeType extends elements.PageElement<Store>
>(node: NodeType, errorTexts: string | string[], timeout: number) {
  let errorText = undefined
  let notErrorText = undefined

  if ( _.isArray(errorTexts) ) {
    errorText = errorTexts[0]
    notErrorText = errorTexts[1]
  } else {
    errorText = errorTexts
    notErrorText = errorTexts
  }

  return createBaseMessage(node, [
    ` to eventually ${errorText} within ${timeout} ms`,
    ` not to eventually ${notErrorText} within ${timeout} ms`
  ])
}

export function createPropertyMessage<
  Store extends stores.PageElementStore,
  NodeType extends elements.PageElement<Store>,
  ExpectedType = string
>(
  node: NodeType, property: string, comparison: string, actual: string, expected: ExpectedType
) {
  const _actual = printValue(actual)
  const _expected = printValue(expected)

  return createBaseMessage(node, [
    `'s ${property} "${_actual}" to ${comparison} "${_expected}"`,
    `'s ${property} "${_actual}" not to ${comparison} "${_expected}"`,
  ])
}

export function createAnyMessage<
  Store extends stores.PageElementStore,
  NodeType extends elements.PageElement<Store>
>(node: NodeType, property: string, comparison: string, actual: string) {
  const _actual = printValue(actual)

  return createBaseMessage(node, [
    ` to ${comparison} any ${property}`,
    ` to ${comparison} no ${property} but had ${property} "${_actual}"`,
  ])
}

export function createEventuallyPropertyMessage<
  Store extends stores.PageElementStore,
  NodeType extends elements.PageElement<Store>,
  ExpectedType = string
>(
  node: NodeType, property: string, comparison: string, actual: string, expected: ExpectedType, timeout: number
) {
  const _actual = printValue(actual)
  const _expected = printValue(expected)

  return createBaseMessage(node, [
    `'s ${property} "${_actual}" to eventually ${comparison} "${_expected}" within ${timeout} ms`,
    `'s ${property} "${_actual}" not to eventually ${comparison} "${_expected}" within ${timeout} ms`
  ])
}

export function createEventuallyAnyMessage<
  Store extends stores.PageElementStore,
  NodeType extends elements.PageElement<Store>
>(node: NodeType, property: string, comparison: string, actual: string, timeout: number) {
  const _actual = printValue(actual)

  return createBaseMessage(node, [
    ` to eventually ${comparison} any ${property} within ${timeout} ms`,
    ` to eventually ${comparison} no ${property} within ${timeout} ms but had ${property} "${_actual}"`,
  ])
}

export function createEachMessage<
  Store extends stores.PageElementStore,
  PageElementType extends elements.PageElement<Store>,
  PageElementOptions extends elements.IPageElementOpts<Store>,
  K extends string,
  Content extends Workflo.PageNode.GroupContent,
  NodeType extends elements.PageElementList<Store, PageElementType, PageElementOptions> |
    elements.PageElementMap<Store, K, PageElementType, PageElementOptions> |
    elements.PageElementGroup<Store, Content>
>(node: NodeType, errorTexts: string | string[], actualOnly: boolean = false) {
  let errorText = undefined
  let notErrorText = undefined

  if ( _.isArray(errorTexts) ) {
    errorText = errorTexts[0]
    notErrorText = errorTexts[1]
  } else {
    errorText = errorTexts
    notErrorText = errorTexts
  }

  const comparisonLines = convertDiffToMessages(node.__lastDiff, actualOnly)
  const comparisonList = comparisonLines.join('\n\n')
  const hrLine = `\n------------------------------------------------------------------\n`

  return [
    `Expected each of ${node.constructor.name}'s elements to ${errorText}:${hrLine}${comparisonList}${hrLine}`,
    `Expected none of ${node.constructor.name}'s elements to ${notErrorText}:${hrLine}${comparisonList}${hrLine}`
  ]
}

export function createAnyEachMessage<
Store extends stores.PageElementStore,
PageElementType extends elements.PageElement<Store>,
PageElementOptions extends elements.IPageElementOpts<Store>,
K extends string,
Content extends Workflo.PageNode.GroupContent,
NodeType extends elements.PageElementList<Store, PageElementType, PageElementOptions> |
  elements.PageElementMap<Store, K, PageElementType, PageElementOptions> |
  elements.PageElementGroup<Store, Content>
>(node: NodeType, errorTexts: string | string[]) {
  return createEachMessage(node, errorTexts, true)
}

export function createEventuallyEachMessage<
  Store extends stores.PageElementStore,
  PageElementType extends elements.PageElement<Store>,
  PageElementOptions extends elements.IPageElementOpts<Store>,
  K extends string,
  Content extends Workflo.PageNode.GroupContent,
  NodeType extends elements.PageElementList<Store, PageElementType, PageElementOptions> |
    elements.PageElementMap<Store, K, PageElementType, PageElementOptions> |
    elements.PageElementGroup<Store, Content>
>(
  node: NodeType, errorTexts: string | string[], timeout: number
) {
  const within = _.isArray(errorTexts) ?
    errorTexts.map(errorText => `eventually ${errorText} within ${timeout}ms`) :
    `eventually ${errorTexts} within ${timeout}ms`

  return createEachMessage(node, within)
}

export function createEventuallyAnyEachMessage<
  Store extends stores.PageElementStore,
  PageElementType extends elements.PageElement<Store>,
  PageElementOptions extends elements.IPageElementOpts<Store>,
  K extends string,
  Content extends Workflo.PageNode.GroupContent,
  NodeType extends elements.PageElementList<Store, PageElementType, PageElementOptions> |
    elements.PageElementMap<Store, K, PageElementType, PageElementOptions> |
    elements.PageElementGroup<Store, Content>
>(
  node: NodeType, errorTexts: string | string[], timeout: number
) {
  const within = _.isArray(errorTexts) ?
    errorTexts.map(errorText => `eventually ${errorText} within ${timeout}ms`) :
    `eventually ${errorTexts} within ${timeout}ms`

  return createEachMessage(node, within, true)
}

// MATCHERS

export const elementMatchers: jasmine.CustomMatcherFactories = {
  toExist: createMatcherWithoutExpected({
    element: {
      resultFunc: ({node}) => [() => node.currently.exists(), () => node.currently.not.exists()],
      errorTextFunc: ({node}) => createMessage(node, "exist")
    },
    list: {
      resultFunc: ({node, opts}) => {
        if (_.isArray(opts)) {
          throw new Error('Filtermask for toExist() on PageElementList can only be boolean')
        } else {
          return [
            () => node.currently.exists(opts), () => node.currently.not.exists(opts)
          ]
        }
      },
      errorTextFunc: ({node}) => [
        `Expected at least one of ${node.constructor.name}'s elements to exist.\n( ${node.__getNodeId()} )`,
        `Expected none one of ${node.constructor.name}'s elements to exist.\n( ${node.__getNodeId()} )`
      ]
    },
    map: {
      resultFunc: ({node, opts}) => [
        () => node.currently.exists(opts), () => node.currently.not.exists(opts)
      ],
      errorTextFunc: ({node}) => createEachMessage(node, "exist")
    },
    group: {
      resultFunc: ({node, opts}) => [
        () => node.currently.exists(opts), () => node.currently.not.exists(opts)
      ],
      errorTextFunc: ({node}) => createEachMessage(node, "exist")
    }
  }),
  toEventuallyExist: createEventuallyMatcherWithoutExpected({
    element: {
      resultFunc: ({node, opts}) => [() => node.eventually.exists(opts), () => node.eventually.not.exists(opts)],
      errorTextFunc: ({node, opts}) => createEventuallyMessage(node, "exist", opts.timeout)
    },
    list: {
      resultFunc: ({node, opts}) => {
        const {filterMask, ...otherOpts} = opts

        if (_.isArray(filterMask)) {
          throw new Error('Filtermask for toEventuallyExist() on PageElementList can only be boolean')
        } else {
          return [
            () => node.eventually.exists({filterMask, ...otherOpts}),
            () => node.eventually.not.exists({filterMask, ...otherOpts})
          ]
        }
      },
      errorTextFunc: ({node, opts}) => [
        `Expected at least one of ${node.constructor.name}'s elements to eventually exist within ${opts.timeout}ms.\n` +
        `( ${node.__getNodeId()} )`,
        `Expected none one of ${node.constructor.name}'s elements to eventually exist within ${opts.timeout}ms.\n` +
        `( ${node.__getNodeId()} )`
      ]
    },
    map: {
      resultFunc: ({node, opts}) => [
        () => node.eventually.exists(opts), () => node.eventually.not.exists(opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyEachMessage(node, "exist", opts.timeout)
    },
    group: {
      resultFunc: ({node, opts}) => [
        () => node.eventually.exists(opts), () => node.eventually.not.exists(opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyEachMessage(node, "exist", opts.timeout)
    }
  }),
  toBeVisible: createMatcherWithoutExpected({
    element: {
      resultFunc: ({node}) => [() => node.currently.isVisible(), () => node.currently.not.isVisible()],
      errorTextFunc: ({node}) => createMessage(node, "be visible")
    },
    list: {
      resultFunc: ({node, opts}) => [() => node.currently.isVisible(opts), () => node.currently.not.isVisible(opts)],
      errorTextFunc: ({node}) => createEachMessage(node, "be visible")
    },
    map: {
      resultFunc: ({node, opts}) => [
        () => node.currently.isVisible(opts), () => node.currently.not.isVisible(opts)
      ],
      errorTextFunc: ({node}) => createEachMessage(node, "be visible")
    },
    group: {
      resultFunc: ({node, opts}) => [
        () => node.currently.isVisible(opts), () => node.currently.not.isVisible(opts)
      ],
      errorTextFunc: ({node}) => createEachMessage(node, "be visible")
    }
  }),
  toEventuallyBeVisible: createEventuallyMatcherWithoutExpected({
    element: {
      resultFunc: ({node, opts}) => [() => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts)],
      errorTextFunc: ({node, opts}) => createEventuallyMessage(node, "be visible", opts.timeout)
    },
    list: {
      resultFunc: ({node, opts}) => [() => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts)],
      errorTextFunc: ({node, opts}) => createEventuallyEachMessage(node, "be visible", opts.timeout)
    },
    map: {
      resultFunc: ({node, opts}) => [
        () => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyEachMessage(node, "be visible", opts.timeout)
    },
    group: {
      resultFunc: ({node, opts}) => [
        () => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyEachMessage(node, "be visible", opts.timeout)
    }
  }),
  toBeEnabled: createMatcherWithoutExpected({
    element: {
      resultFunc: ({node}) => [() => node.currently.isEnabled(), () => node.currently.not.isEnabled()],
      errorTextFunc: ({node}) => createMessage(node, "be enabled")
    },
    list: {
      resultFunc: ({node, opts}) => [() => node.currently.isEnabled(opts), () => node.currently.not.isEnabled(opts)],
      errorTextFunc: ({node}) => createEachMessage(node, "be enabled")
    },
    map: {
      resultFunc: ({node, opts}) => [
        () => node.currently.isEnabled(opts), () => node.currently.not.isEnabled(opts)
      ],
      errorTextFunc: ({node}) => createEachMessage(node, "be enabled")
    },
    group: {
      resultFunc: ({node, opts}) => [
        () => node.currently.isEnabled(opts), () => node.currently.not.isEnabled(opts)
      ],
      errorTextFunc: ({node}) => createEachMessage(node, "be enabled")
    }
  }),
  toEventuallyBeEnabled: createEventuallyMatcherWithoutExpected({
    element: {
      resultFunc: ({node, opts}) => [() => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts)],
      errorTextFunc: ({node, opts}) => createEventuallyMessage(node, "be enabled", opts.timeout)
    },
    list: {
      resultFunc: ({node, opts}) => [() => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts)],
      errorTextFunc: ({node, opts}) => createEventuallyEachMessage(node, "be enabled", opts.timeout)
    },
    map: {
      resultFunc: ({node, opts}) => [
        () => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyEachMessage(node, "be enabled", opts.timeout)
    },
    group: {
      resultFunc: ({node, opts}) => [
        () => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyEachMessage(node, "be enabled", opts.timeout)
    }
  }),
  toHaveText: createTextMatcher({
    element: {
      resultFunc: ({node, expected}) => [
        () => node.currently.hasText(expected), () => node.currently.not.hasText(expected)
      ],
      errorTextFunc: ({node, actual, expected}) => createPropertyMessage(node, 'text', 'be', actual, expected)
    },
    list: {
      resultFunc: ({node, expected}) => [
        () => node.currently.hasText(expected), () => node.currently.not.hasText(expected)
      ],
      errorTextFunc: ({node}) => createEachMessage(node, 'have text')
    },
    map: {
      resultFunc: ({node, expected}) => [
        () => node.currently.hasText(expected), () => node.currently.not.hasText(expected)
      ],
      errorTextFunc: ({node}) => createEachMessage(node, 'have text')
    },
    group: {
      resultFunc: ({node, expected}) => [
        () => node.currently.hasText(expected), () => node.currently.not.hasText(expected)
      ],
      errorTextFunc: ({node}) => createEachMessage(node, "have text")
    }
  }),
  toEventuallyHaveText: createEventuallyTextMatcher({
    element: {
      resultFunc: ({node, expected, opts}) => [
        () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts)
      ],
      errorTextFunc: ({node, actual, expected, opts}) => createEventuallyPropertyMessage(
        node, 'text', 'be', actual, expected, opts.timeout
      )
    },
    list: {
      resultFunc: ({node, expected, opts}) => [
        () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyEachMessage(node, 'have text', opts.timeout)
    },
    map: {
      resultFunc: ({node, expected, opts}) => [
        () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyEachMessage(node, 'have text', opts.timeout)
    },
    group: {
      resultFunc: ({node, expected, opts}) => [
        () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyEachMessage(node, "have text", opts.timeout)
    }
  }),
  toHaveAnyText: createTextMatcher({
    element: {
      resultFunc: ({node}) => [
        () => node.currently.hasAnyText(), () => node.currently.not.hasAnyText()
      ],
      errorTextFunc: ({node, actual}) => createAnyMessage(node, "text", "have", actual)
    },
    list: {
      resultFunc: ({node, opts}) => [
        () => node.currently.hasAnyText(opts), () => node.currently.not.hasAnyText(opts)
      ],
      errorTextFunc: ({node}) => createAnyEachMessage(node, 'have any text')
    },
    map: {
      resultFunc: ({node, opts}) => [
        () => node.currently.hasAnyText(opts), () => node.currently.not.hasAnyText(opts)
      ],
      errorTextFunc: ({node}) => createAnyEachMessage(node, 'have any text')
    },
    group: {
      resultFunc: ({node, opts}) => [
        () => node.currently.hasAnyText(opts), () => node.currently.not.hasAnyText(opts)
      ],
      errorTextFunc: ({node}) => createAnyEachMessage(node, "have any text")
    }
  }),
  toEventuallyHaveAnyText: createEventuallyTextMatcher({
    element: {
      resultFunc: ({node, expected, opts}) => [
        () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts)
      ],
      errorTextFunc: ({node, actual, opts}) => createEventuallyAnyMessage(node, "text", "have", actual, opts.timeout)
    },
    list: {
      resultFunc: ({node, expected, opts}) => [
        () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyAnyEachMessage(node, 'have any text', opts.timeout)
    },
    map: {
      resultFunc: ({node, expected, opts}) => [
        () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyAnyEachMessage(node, 'have any text', opts.timeout)
    },
    group: {
      resultFunc: ({node, expected, opts}) => [
        () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyAnyEachMessage(node, "have any text", opts.timeout)
    }
  }),

  // toExist: elementMatcherFunction(
  //   ({node}) => [() => node.currently.exists(), () => node.currently.not.exists()],
  //   ({node}) => createBaseMessage(node, "to exist")
  // ),
  // toBeVisible: elementMatcherFunction(
  //   ({node}) => [() => node.currently.isVisible(), () => node.currently.not.isVisible()],
  //   ({node}) => createBaseMessage(node, "to be visible")
  // ),
  // toBeSelected: elementMatcherFunction(
  //   ({node}) => [() => node.currently.isSelected(), () => node.currently.not.isSelected()],
  //   ({node}) => createBaseMessage(node, "to be selected")
  // ),
  // toBeEnabled: elementMatcherFunction(
  //   ({node}) => [() => node.currently.isEnabled(), () => node.currently.not.isEnabled()],
  //   ({node}) => createBaseMessage(node, "to be enabled")
  // ),
  // toBeChecked: elementMatcherFunction(
  //   ({node}) => [() => node.currently.isChecked(), () => node.currently.not.isChecked()],
  //   ({node}) => createBaseMessage(node, "to be checked")
  // ),
  // toHaveText: elementMatcherFunction(
  //   ({node, expected}) => [
  //     () => node.currently.hasText(expected), () => node.currently.not.hasText(expected)
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(node, 'text', 'be', actual, expected)
  // ),
  // toHaveAnyText: elementMatcherFunction(
  //   ({node}) => [() => node.currently.hasAnyText(), () => node.currently.not.hasAnyText()],
  //   ({node}) => createBaseMessage(node, "to have any text")
  // ),
  // toContainText: elementMatcherFunction(
  //   ({node, expected}) => [
  //     () => node.currently.containsText(expected), () => node.currently.not.containsText(expected)
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(node, 'text', 'contain', actual, expected)
  // ),
  // toHaveHTML: elementMatcherFunction(
  //   ({node, expected}) => [
  //     () => node.currently.hasHTML(expected), () => node.currently.not.hasHTML(expected)
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(node, 'HTML', 'be', actual, expected)
  // ),
  // toHaveAnyHTML: elementMatcherFunction(
  //   ({node}) => [
  //     () => node.currently.hasAnyHTML(), () => node.currently.not.hasAnyHTML()
  //   ],
  //   ({node}) => createBaseMessage(node, "to have any HTML")
  // ),
  // toContainHTML: elementMatcherFunction(
  //   ({node, expected}) => [
  //     () => node.currently.containsHTML(expected), () => node.currently.not.containsHTML(expected)
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(node, 'HTML', 'contain', actual, expected)
  // ),
  // toHaveDirectText: elementMatcherFunction(
  //   ({node, expected}) => [
  //     () => node.currently.hasDirectText(expected), () => node.currently.not.hasDirectText(expected)
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(node, 'direct text', 'be', actual, expected)
  // ),
  // toHaveAnyDirectText: elementMatcherFunction(
  //   ({node}) => [
  //     () => node.currently.hasAnyDirectText(), () => node.currently.not.hasAnyDirectText()
  //   ],
  //   ({node}) => createBaseMessage(node, "to have any direct text")
  // ),
  // toContainDirectText: elementMatcherFunction(
  //   ({node, expected}) => [
  //     () => node.currently.containsDirectText(expected), () => node.currently.not.containsDirectText(expected)
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(node, 'direct text', 'contain', actual, expected)
  // ),
  // toHaveAttribute: elementMatcherFunction<Workflo.IAttributeArgs>(
  //   ({node, expected}) => [
  //     () => node.currently.hasAttribute(expected.name, expected.value),
  //     () => node.currently.not.hasAttribute(expected.name, expected.value),
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(node, expected.name, 'be', actual, expected.value)
  // ),
  // toHaveAnyAttribute: elementMatcherFunction<string>(
  //   ({node, expected}) => [
  //     () => node.currently.hasAnyAttribute(expected),
  //     () => node.currently.not.hasAnyAttribute(expected)
  //   ],
  //   ({expected, node}) => createBaseMessage(node, ` to have any ${expected}`)
  // ),
  // toContainAttribute: elementMatcherFunction<Workflo.IAttributeArgs>(
  //   ({node, expected}) => [
  //     () => node.currently.containsAttribute(expected.name, expected.value),
  //     () => node.currently.not.containsAttribute(expected.name, expected.value),
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(node, expected.name, 'contain', actual, expected.value)
  // ),
  // toHaveClass: elementMatcherFunction(
  //   ({node, expected}) => [
  //     () => node.currently.hasClass(expected), () => node.currently.not.hasClass(expected)
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(node, 'class', 'be', actual, expected)
  // ),
  // toHaveAnyClass: elementMatcherFunction(
  //   ({node}) => [
  //     () => node.currently.hasAnyClass(), () => node.currently.not.hasAnyClass()
  //   ],
  //   ({node}) => createBaseMessage(node, ` to have any class`)
  // ),
  // toContainClass: elementMatcherFunction(
  //   ({node, expected}) => [
  //     () => node.currently.containsClass(expected), () => node.currently.not.containsClass(expected)
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(node, 'class', 'contain', actual, expected)
  // ),
  // toHaveId: elementMatcherFunction(
  //   ({node, expected}) => [
  //     () => node.currently.hasId(expected), () => node.currently.not.hasId(expected)
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(node, 'id', 'be', actual, expected)
  // ),
  // toHaveAnyId: elementMatcherFunction(
  //   ({node}) => [
  //     () => node.currently.hasAnyId(), () => node.currently.not.hasAnyId()
  //   ],
  //   ({node}) => createBaseMessage(node, "to have any id")
  // ),
  // toContainId: elementMatcherFunction(
  //   ({node, expected}) => [
  //     () => node.currently.containsId(expected), () => node.currently.not.containsId(expected)
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(node, 'id', 'contain', actual, expected)
  // ),
  // toHaveName: elementMatcherFunction(
  //   ({node, expected}) => [
  //     () => node.currently.hasName(expected), () => node.currently.not.hasName(expected)
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(node, 'name', 'be', actual, expected)
  // ),
  // toHaveAnyName: elementMatcherFunction(
  //   ({node}) => [
  //     () => node.currently.hasAnyName(), () => node.currently.not.hasAnyName()
  //   ],
  //   ({node}) => createBaseMessage(node, "to have any name")
  // ),
  // toContainName: elementMatcherFunction(
  //   ({node, expected}) => [
  //     () => node.currently.containsName(expected), () => node.currently.not.containsName(expected)
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(node, 'name', 'contain', actual, expected)
  // ),
  // toHaveLocation: elementMatcherFunction<Workflo.ICoordinates, {tolerances?: Partial<Workflo.ICoordinates>}>(
  //   ({node, expected, opts}) => [
  //     () => node.currently.hasLocation(expected, opts.tolerances),
  //     () => node.currently.not.hasLocation(expected, opts.tolerances)
  //   ],
  //   ({actual, expected, opts, node}) => createPropertyMessage(
  //     node,
  //     'location',
  //     (opts.tolerances && (opts.tolerances.x > 0 || opts.tolerances.y > 0)) ? 'be in range' : 'be',
  //     actual,
  //     tolerancesToString(expected, opts.tolerances)
  //   )
  // ),
  // toHaveX: elementMatcherFunction<number, {tolerance?: number}>(
  //   ({node, expected, opts}) => [
  //     () => node.currently.hasX(expected, opts.tolerance),
  //     () => node.currently.not.hasX(expected, opts.tolerance)
  //   ],
  //   ({actual, expected, opts, node}) => createPropertyMessage(
  //     node,
  //     'X-coordinate',
  //     (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be',
  //     actual,
  //     tolerancesToString(expected, opts.tolerance)
  //   )
  // ),
  // toHaveY: elementMatcherFunction<number, {tolerance?: number}>(
  //   ({node, expected, opts}) => [
  //     () => node.currently.hasY(expected, opts.tolerance),
  //     () => node.currently.not.hasY(expected, opts.tolerance)
  //   ],
  //   ({actual, expected, opts, node}) => createPropertyMessage(
  //     node,
  //     'Y-coordinate',
  //     (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be',
  //     actual,
  //     tolerancesToString(expected, opts.tolerance)
  //   )
  // ),
  // toHaveSize: elementMatcherFunction<Workflo.ISize, {tolerances?: Partial<Workflo.ISize>}>(
  //   ({node, expected, opts}) => [
  //     () => node.currently.hasSize(expected, opts.tolerances),
  //     () => node.currently.not.hasSize(expected, opts.tolerances)
  //   ],
  //   ({actual, expected, opts, node}) => createPropertyMessage(
  //     node,
  //     'size',
  //     (opts.tolerances && (opts.tolerances.width > 0 || opts.tolerances.height > 0)) ? 'be in range' : 'be',
  //     actual,
  //     tolerancesToString(expected, opts.tolerances)
  //   )
  // ),
  // toHaveWidth: elementMatcherFunction<number, {tolerance?: number}>(
  //   ({node, expected, opts}) => [
  //     () => node.currently.hasWidth(expected, opts.tolerance),
  //     () => node.currently.not.hasWidth(expected, opts.tolerance)
  //   ],
  //   ({actual, expected, opts, node}) => createPropertyMessage(
  //     node,
  //     'width',
  //     (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be',
  //     actual,
  //     tolerancesToString(expected, opts.tolerance)
  //   )
  // ),
  // toHaveHeight: elementMatcherFunction<number, {tolerance?: number}>(
  //   ({node, expected, opts}) => [
  //     () => node.currently.hasHeight(expected, opts.tolerance),
  //     () => node.currently.not.hasHeight(expected, opts.tolerance)
  //   ],
  //   ({actual, expected, opts, node}) => createPropertyMessage(
  //     node,
  //     'height',
  //     (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be',
  //     actual,
  //     tolerancesToString(expected, opts.tolerance)
  //   )
  // ),

  // toEventuallyExist: elementMatcherWithoutExpectedFunction(
  //   ({node, opts}) => [
  //     () => node.eventually.exists(opts), () => node.eventually.not.exists(opts)
  //   ],
  //   ({opts, node}) => createBaseMessage(node, ` to eventually exist within ${opts.timeout} ms`)
  // ),
  // toEventuallyBeVisible: elementMatcherWithoutExpectedFunction(
  //   ({node, opts}) => [
  //     () => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts)
  //   ],
  //   ({opts, node}) => createBaseMessage(node, ` to eventually be visible within ${opts.timeout} ms`)
  // ),
  // toEventuallyBeSelected: elementMatcherWithoutExpectedFunction(
  //   ({node, opts}) => [
  //     () => node.eventually.isSelected(opts), () => node.eventually.not.isSelected(opts)
  //   ],
  //   ({opts, node}) => createBaseMessage(node, ` to eventually be selected within ${opts.timeout} ms`)
  // ),
  // toEventuallyBeEnabled: elementMatcherWithoutExpectedFunction(
  //   ({node, opts}) => [
  //     () => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts)
  //   ],
  //   ({opts, node}) => createBaseMessage(node, ` to eventually be enabled within ${opts.timeout} ms`)
  // ),
  // toEventuallyBeChecked: elementMatcherWithoutExpectedFunction(
  //   ({node, opts}) => [
  //     () => node.eventually.isChecked(opts), () => node.eventually.not.isChecked(opts)
  //   ],
  //   ({opts, node}) => createBaseMessage(node, ` to eventually be checked within ${opts.timeout} ms`)
  // ),
  // toEventuallyHaveText: elementMatcherFunction(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasText(expected, opts),
  //     () => node.eventually.not.hasText(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node, 'text', 'be', actual, expected, opts.timeout
  //   )
  // ),
  // toEventuallyHaveAnyText: elementMatcherWithoutExpectedFunction(
  //   ({node}) => [
  //     () => node.eventually.hasAnyText(), () => node.eventually.not.hasAnyText()
  //   ],
  //   ({opts, node}) => createBaseMessage(node, ` to eventually have any text within ${opts.timeout} ms`)
  // ),
  // toEventuallyContainText: elementMatcherFunction(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.containsText(expected, opts),
  //     () => node.eventually.not.containsText(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node, 'text', 'contain', actual, expected, opts.timeout
  //   )
  // ),
  // toEventuallyHaveHTML: elementMatcherFunction(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasHTML(expected, opts),
  //     () => node.eventually.not.hasHTML(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node, 'HTML', 'be', actual, expected, opts.timeout
  //   )
  // ),
  // toEventuallyHaveAnyHTML: elementMatcherWithoutExpectedFunction(
  //   ({node, opts}) => [
  //     () => node.eventually.hasAnyHTML(opts), () => node.eventually.not.hasAnyHTML(opts)
  //   ],
  //   ({opts, node}) => createBaseMessage(node, ` to eventually have any HTML within ${opts.timeout} ms`)
  // ),
  // toEventuallyContainHTML: elementMatcherFunction(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.containsHTML(expected, opts),
  //     () => node.eventually.not.containsHTML(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node, 'HTML', 'contain', actual, expected, opts.timeout
  //   )
  // ),
  // toEventuallyHaveDirectText: elementMatcherFunction(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasDirectText(expected, opts),
  //     () => node.eventually.not.hasDirectText(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node, 'direct text', 'be', actual, expected, opts.timeout
  //   )
  // ),
  // toEventuallyHaveAnyDirectText: elementMatcherWithoutExpectedFunction(
  //   ({node, opts}) => [
  //     () => node.eventually.hasAnyDirectText(opts),
  //     () => node.eventually.not.hasAnyDirectText(opts)
  //   ],
  //   ({opts, node}) => createBaseMessage(node, ` to eventually have any direct text within ${opts.timeout} ms`)
  // ),
  // toEventuallyContainDirectText: elementMatcherFunction(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.containsDirectText(expected, opts),
  //     () => node.eventually.not.containsDirectText(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node, 'direct text', 'contain', actual, expected, opts.timeout
  //   )
  // ),
  // toEventuallyHaveAttribute: elementMatcherFunction<Workflo.IAttributeArgs>(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasAttribute(expected.name, expected.value, opts),
  //     () => node.eventually.not.hasAttribute(expected.name, expected.value, opts),
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node, expected.name, 'be', actual, expected.value, opts.timeout
  //   )
  // ),
  // toEventuallyHaveAnyAttribute: elementMatcherFunction<string>(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasAnyAttribute(expected, opts),
  //     () => node.eventually.not.hasAnyAttribute(expected, opts),
  //   ],
  //   ({expected, opts, node}) => createBaseMessage(
  //     node, ` to eventually have any ${expected} within ${opts.timeout} ms`
  //   )
  // ),
  // toEventuallyContainAttribute: elementMatcherFunction<Workflo.IAttributeArgs>(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.containsAttribute(expected.name, expected.value, opts),
  //     () => node.eventually.not.containsAttribute(expected.name, expected.value, opts),
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node, expected.name, 'contain', actual, expected.value, opts.timeout
  //   )
  // ),
  // toEventuallyHaveClass: elementMatcherFunction(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasClass(expected, opts),
  //     () => node.eventually.not.hasClass(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node, 'class', 'be', actual, expected, opts.timeout
  //   )
  // ),
  // toEventuallyHaveAnyClass: elementMatcherWithoutExpectedFunction(
  //   ({node}) => [
  //     () => node.eventually.hasAnyClass(), () => node.eventually.not.hasAnyClass()
  //   ],
  //   ({opts, node}) => createBaseMessage(node, ` to eventually have any class within ${opts.timeout} ms`)
  // ),
  // toEventuallyContainClass: elementMatcherFunction(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.containsClass(expected, opts),
  //     () => node.eventually.not.containsClass(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node, 'class', 'contain', actual, expected, opts.timeout
  //   )
  // ),
  // toEventuallyHaveId: elementMatcherFunction(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasId(expected, opts),
  //     () => node.eventually.not.hasId(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node, 'id', 'be', actual, expected, opts.timeout
  //   )
  // ),
  // toEventuallyHaveAnyId: elementMatcherWithoutExpectedFunction(
  //   ({node}) => [
  //     () => node.eventually.hasAnyId(), () => node.eventually.not.hasAnyId()
  //   ],
  //   ({opts, node}) => createBaseMessage(
  //     node, ` to eventually have any id within ${opts.timeout} ms`
  //   )
  // ),
  // toEventuallyContainId: elementMatcherFunction(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.containsId(expected, opts),
  //     () => node.eventually.not.containsId(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node, 'id', 'contain', actual, expected, opts.timeout
  //   )
  // ),
  // toEventuallyHaveName: elementMatcherFunction(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasName(expected, opts),
  //     () => node.eventually.not.hasName(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node, 'name', 'be', actual, expected, opts.timeout
  //   )
  // ),
  // toEventuallyHaveAnyName: elementMatcherWithoutExpectedFunction(
  //   ({node}) => [() => node.eventually.hasAnyName(), () => node.eventually.not.hasAnyName()],
  //   ({opts, node}) => createBaseMessage(
  //     node, ` to eventually have any name within ${opts.timeout} ms`
  //   )
  // ),
  // toEventuallyContainName: elementMatcherFunction(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.containsName(expected, opts),
  //     () => node.eventually.not.containsName(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node, 'name', 'contain', actual, expected, opts.timeout
  //   )
  // ),
  // toEventuallyHaveLocation: elementMatcherFunction<Workflo.ICoordinates, {tolerances?: Partial<Workflo.ICoordinates>}>(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasLocation(expected, opts),
  //     () => node.eventually.not.hasLocation(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node,
  //     'location',
  //     (opts.tolerances && (opts.tolerances.x > 0 || opts.tolerances.y > 0)) ? 'be in range' : 'be',
  //     actual,
  //     tolerancesToString(expected, opts.tolerances),
  //     opts.timeout
  //   )
  // ),
  // toEventuallyHaveX: elementMatcherFunction<number, {tolerance?: number}>(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasX(expected, opts), () => node.eventually.not.hasX(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node,
  //     'X-coordinate',
  //     (opts.tolerance && opts.tolerance > 0) ? 'be in range ' : 'be',
  //     actual,
  //     tolerancesToString(expected, opts.tolerance),
  //     opts.timeout
  //   )
  // ),
  // toEventuallyHaveY: elementMatcherFunction<number, {tolerance?: number}>(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasY(expected, opts), () => node.eventually.not.hasY(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node,
  //     'Y-coordinate',
  //     (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be',
  //     actual,
  //     tolerancesToString(expected, opts.tolerance),
  //     opts.timeout
  //   )
  // ),
  // toEventuallyHaveSize: elementMatcherFunction<Workflo.ISize, {tolerances?: Partial<Workflo.ISize>}>(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasSize(expected, opts), () => node.eventually.not.hasSize(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node,
  //     'size',
  //     (opts.tolerances && (opts.tolerances.width > 0 || opts.tolerances.height > 0)) ? 'be in range' : 'be',
  //     actual,
  //     tolerancesToString(expected, opts.tolerances),
  //     opts.timeout
  //   )
  // ),
  // toEventuallyHaveWidth: elementMatcherFunction<number, {tolerance?: number}>(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasWidth(expected, opts), () => node.eventually.not.hasWidth(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node,
  //     'width',
  //     (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be',
  //     actual,
  //     tolerancesToString(expected, opts.tolerance),
  //     opts.timeout
  //   )
  // ),
  // toEventuallyHaveHeight: elementMatcherFunction<number, {tolerance?: number}>(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasHeight(expected, opts),
  //     () => node.eventually.not.hasHeight(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createEventuallyPropertyMessage(
  //     node,
  //     'height',
  //     (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be',
  //     actual,
  //     tolerancesToString(expected, opts.tolerance),
  //     opts.timeout
  //   )
  // )
};

// export const listMatchers: jasmine.CustomMatcherFactories = {
  // toBeEmpty: listMatcherFunction(
  //   ({node}) => [() => node.currently.isEmpty(), () => node.currently.not.isEmpty()],
  //   ({node}) => createBaseMessage(node, "to be empty")
  // ),
  // toHaveLength: listMatcherFunction<number, {comparator?: Workflo.Comparator}>(
  //   ({node, expected, opts}) => [
  //     () => node.currently.hasLength(expected, opts.comparator),
  //     () => node.currently.not.hasLength(expected, opts.comparator)
  //   ],
  //   ({actual, expected, opts, node}) => createBaseMessage(
  //     node, `'s length ${actual} to be${comparatorStr(opts.comparator)} ${expected}`
  //   )
  // ),
  // toEventuallyBeEmpty: listMatcherWithoutExpectedFunction<IPageElementListWaitEmptyParams>(
  //   ({node, opts}) => [
  //     () => node.eventually.isEmpty(opts), () => node.eventually.not.isEmpty(opts)
  //   ],
  //   ({opts, node}) => createBaseMessage(node, ` to eventually be empty within ${opts.timeout} ms`)
  // ),
  // toEventuallyHaveLength: listMatcherFunction<number, IPageElementListWaitLengthParams>(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasLength(expected, opts),
  //     () => node.eventually.not.hasLength(expected, opts)
  //   ],
  //   ({actual, expected, opts, node}) => createBaseMessage(
  //     node, `'s length ${actual} to be${comparatorStr(opts.comparator)} ${expected} within ${opts.timeout} ms`
  //   )
  // ),
// }

export const valueElementMatchers: jasmine.CustomMatcherFactories = {
  toHaveValue: createValueMatcher({
    element: {
      resultFunc: ({node, expected}) => [
        () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected)
      ],
      errorTextFunc: ({node, actual, expected}) => createPropertyMessage(node, 'value', 'be', actual, expected)
    },
    list: {
      resultFunc: ({node, expected}) => [
        () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected)
      ],
      errorTextFunc: ({node}) => createEachMessage(node, 'have value')
    },
    map: {
      resultFunc: ({node, expected}) => [
        () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected)
      ],
      errorTextFunc: ({node}) => createEachMessage(node, 'have value')
    },
    group: {
      resultFunc: ({node, expected}) => [
        () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected)
      ],
      errorTextFunc: ({node}) => createEachMessage(node, "have value")
    }
  }),
  toEventuallyHaveValue: createEventuallyValueMatcher({
    element: {
      resultFunc: ({node, expected, opts}) => [
        () => node.eventually.hasValue(expected, opts), () => node.eventually.not.hasValue(expected, opts)
      ],
      errorTextFunc: ({node, actual, expected, opts}) => createEventuallyPropertyMessage(
        node, 'value', 'be', actual, expected, opts.timeout
      )
    },
    list: {
      resultFunc: ({node, expected, opts}) => [
        () => node.eventually.hasValue(expected, opts), () => node.eventually.not.hasValue(expected, opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyEachMessage(node, 'have value', opts.timeout)
    },
    map: {
      resultFunc: ({node, expected, opts}) => [
        () => node.eventually.hasValue(expected, opts), () => node.eventually.not.hasValue(expected, opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyEachMessage(node, 'have value', opts.timeout)
    },
    group: {
      resultFunc: ({node, expected, opts}) => [
        () => node.eventually.hasValue(expected, opts), () => node.eventually.not.hasValue(expected, opts)
      ],
      errorTextFunc: ({node, opts}) => createEventuallyEachMessage(node, "have value", opts.timeout)
    }
  }),

  // toHaveValue: valueElementMatcherFunction(
  //   ({node, expected}) => [
  //     () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected)
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(
  //     node, 'value', 'be', actual, node.__typeToString(expected)
  //   )
  // ),
  // toHaveAnyValue: valueElementMatcherFunction(
  //   ({node}) => [() => node.currently.hasAnyValue(), () => node.currently.not.hasAnyValue()],
  //   ({node}) => createBaseMessage(node, "to have any value")
  // ),
  // toContainValue: valueElementMatcherFunction(
  //   ({node, expected}) => [
  //     () => node.currently.containsValue(expected), () => node.currently.not.containsValue(expected)
  //   ],
  //   ({actual, expected, node}) => createPropertyMessage(
  //     node, 'value', 'contain', actual, node.__typeToString(expected)
  //   )
  // ),

  // toEventuallyHaveValue: valueElementMatcherFunction(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.hasValue(expected, opts),
  //     () => node.eventually.not.hasValue(expected, opts)
  //   ],
  //   ({actual, expected, node, opts}) => createEventuallyPropertyMessage(
  //     node, 'value', 'be', actual, node.__typeToString(expected), opts.timeout
  //   )
  // ),
  // toEventuallyHaveAnyValue: valueElementMatcherFunction(
  //   ({node, opts}) => [
  //     () => node.eventually.hasAnyValue(opts),
  //     () => node.eventually.not.hasAnyValue(opts)
  //   ],
  //   ({opts, node}) => createBaseMessage(
  //     node, ` to eventually have any value within ${opts.timeout} ms`
  //   )
  // ),
  // toEventuallyContainValue: valueElementMatcherFunction(
  //   ({node, expected, opts}) => [
  //     () => node.eventually.containsValue(expected, opts),
  //     () => node.eventually.not.containsValue(expected, opts)
  //   ],
  //   ({actual, expected, node, opts}) => createEventuallyPropertyMessage(
  //     node, 'value', 'contain', actual, node.__typeToString(expected), opts.timeout
  //   )
  // ),
}

export function expectElement<
  Store extends stores.PageElementStore,
  PageElementType extends elements.PageElement<Store>
>(element: PageElementType) {
  return expect(element)
}

export function expectList<
  Store extends stores.PageElementStore,
  PageElementType extends elements.PageElement<Store>,
  PageElementOptions,
  PageElementListType extends elements.PageElementList<Store, PageElementType, PageElementOptions>
>(list: PageElementListType) {
  return expect(list)
}

export function expectMap<
  Store extends stores.PageElementStore,
  K extends string,
  PageElementType extends elements.PageElement<Store>,
  PageElementOptions,
  PageElementMapType extends elements.PageElementMap<Store, K, PageElementType, PageElementOptions>
>(map: PageElementMapType) {
  return expect(map)
}

export function expectGroup<
  Store extends stores.PageElementStore,
  Content extends {[K in keyof Content] : Workflo.PageNode.INode},
  PageElementGroupType extends elements.PageElementGroup<Store, Content>
>(group: PageElementGroupType) {
  return expect(group)
}