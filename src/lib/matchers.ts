
import { comparatorStr } from './utility_functions/util'
import { elements, stores } from './page_objects'
import * as _ from 'lodash'
import { tolerancesToString } from './helpers'
import { IPageElementListWaitEmptyParams, IPageElementListWaitLengthParams, IPageElementOpts } from './page_objects/page_elements';

type ElementOrList<
  Store extends stores.PageElementStore,
> = elements.PageElement<Store> |
    elements.PageElementList<Store, elements.PageElement<Store>, Partial<elements.IPageElementOpts<Store>>>

interface IResultFuncArgs<
  Store extends stores.PageElementStore,
  NodeType extends ElementOrList<Store>,
  OptsType,
  ExpectedType
> {
  node: NodeType;
  expected?: ExpectedType;
  opts?: OptsType;
}

interface IResultFuncNoArgs<
  Store extends stores.PageElementStore,
  NodeType extends ElementOrList<Store>,
  OptsType
> {
  node: NodeType;
  opts?: OptsType;
}

type ResultFunctionResult = () => boolean

export type ResultFunction<
  Store extends stores.PageElementStore,
  NodeType extends ElementOrList<Store>,
  OptsType,
  ExpectedType
> = (args: IResultFuncArgs<Store, NodeType, OptsType & {timeout?: number}, ExpectedType>) => ResultFunctionResult[]

export type ResultNoArgsFunction<
  Store extends stores.PageElementStore,
  NodeType extends ElementOrList<Store>,
  OptsType
> = (args: IResultFuncNoArgs<Store, NodeType, OptsType & {timeout?: number}>) => ResultFunctionResult[]

interface ErrorFuncArgs<OptsType, ExpectedType> {
  actual: string;
  expected?: ExpectedType;
  opts?: OptsType
}

interface ErrorFuncNoArgs<OptsType> {
  actual: string;
  opts?: OptsType
}

export type ErrorTextFunction<OptsType, ExpectedType> = (args: ErrorFuncArgs<OptsType & {timeout?: number}, ExpectedType>) => string | string[]

export type ErrorTextNoArgsFunction<OptsType> = (args: ErrorFuncNoArgs<OptsType & {timeout?: number}>) => string | string[]

export function matcherFunction<
  Store extends stores.PageElementStore,
  NodeType extends ElementOrList<Store>,
  OptsType extends Object = {timeout?: number},
  ExpectedType = string
>(
  resultFunction: ResultFunction<Store, NodeType, OptsType, ExpectedType>,
  errorTextFunction: ErrorTextFunction<OptsType, ExpectedType>,
  noArgs: boolean = false
) {
  return (util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>) => {

    function baseCompareFunction(
      node: NodeType,
      negativeComparison: boolean,
      opts: OptsType = Object.create(null),
      expected: ExpectedType = undefined,
    ): jasmine.CustomMatcherResult {
      let result: jasmine.CustomMatcherResult = {
        pass: true,
        message: ''
      };

      let negateAssertionResult = false
      let defaultNegativeMessage = ''

      const successes = resultFunction({node, expected, opts})
      const success = (negativeComparison) ? successes[1]() : successes[0]()

      if (!success) {
        let optsWithTimeout: OptsType & {timeout?: number} = opts || Object.create(null)

        if (typeof opts === 'undefined' || !opts['timeout'] ) {
          optsWithTimeout.timeout = node.getTimeout()
        }

        const actual = node.currently.lastActualResult
        const errorTexts = errorTextFunction({actual, expected, opts: optsWithTimeout})
        let errorText: string = undefined

        if ( _.isArray( errorTexts ) ) {
          if ( negativeComparison && errorTexts.length > 1 ) {
            errorText = errorTexts[1]
          } else {
            errorText = errorTexts[0]
          }
        } else {
          if ( negativeComparison ) {
            defaultNegativeMessage = ' not'
          }

          errorText = errorTexts
        }

        result.pass = false;
        result.message = `Expected ${node.constructor.name}${defaultNegativeMessage}${errorText}.\n( ${node.getSelector()} )`;
      }

      return result;
    }

    if (noArgs) {
      return {
        compare: (node: NodeType, opts?: OptsType): jasmine.CustomMatcherResult => {
          return baseCompareFunction(node, false, opts);
        },
        negativeCompare: (node: NodeType, opts?: OptsType): jasmine.CustomMatcherResult => {
          return baseCompareFunction(node, true, opts);
        }
      }
    } else {
      return {
        compare: (node: NodeType, expected: ExpectedType, opts?: OptsType): jasmine.CustomMatcherResult => {
          return baseCompareFunction(node, false, opts, expected);
        },
        negativeCompare: (node: NodeType, expected: ExpectedType, opts?: OptsType): jasmine.CustomMatcherResult => {
          return baseCompareFunction(node, true, opts, expected);
        }
      }
    }
  }
}

export function createLongErrorMessage(property: string, comparison: string, actual: string, expected: string) {
  return [
    `'s ${property} "${actual}" to ${comparison} "${expected}"`,
    `'s ${property} "${actual}" not to ${comparison} "${expected}"`,
  ]
}

export function createEventuallyErrorMessage(property: string, comparison: string, actual: string, expected: string, timeout: number) {
  return [
    `'s ${property} "${actual}" to eventually ${comparison} "${expected}" within ${timeout} ms`,
    `'s ${property} "${actual}" not to eventually ${comparison} "${expected}" within ${timeout} ms`,
  ]
}

function elementMatcherFunction<
  ExpectedType = string,
  OptsType extends Object = {timeout?: number}
>(
  resultFunction: ResultFunction<
    stores.PageElementStore,
    elements.PageElement<stores.PageElementStore>,
    OptsType,
    ExpectedType
  >,
  errorTextFunction: ErrorTextFunction<OptsType, ExpectedType>
) {
  return matcherFunction(resultFunction, errorTextFunction)
}

function elementMatcherNoArgsFunction<
  OptsType extends Object = {timeout?: number}
>(
  resultFunction: ResultNoArgsFunction<
    stores.PageElementStore,
    elements.PageElement<stores.PageElementStore>,
    OptsType
  >,
  errorTextFunction: ErrorTextNoArgsFunction<OptsType>
) {
  return matcherFunction(resultFunction, errorTextFunction, true)
}

function listMatcherFunction<
  ExpectedType = string,
  OptsType extends Object = {timeout?: number}
>(
  resultFunction: ResultFunction<
    stores.PageElementStore,
    elements.PageElementList<
      stores.PageElementStore,
      elements.PageElement<stores.PageElementStore>,
      IPageElementOpts<stores.PageElementStore>
    >,
    OptsType,
    ExpectedType
  >,
  errorTextFunction: ErrorTextFunction<OptsType, ExpectedType>
) {
  return matcherFunction(resultFunction, errorTextFunction)
}

function listMatcherNoArgsFunction<
  OptsType extends Object = {timeout?: number}
>(
  resultFunction: ResultNoArgsFunction<
    stores.PageElementStore,
    elements.PageElementList<stores.PageElementStore, elements.PageElement<stores.PageElementStore>, elements.IPageElementOpts<stores.PageElementStore>>,
    OptsType
  >,
  errorTextFunction: ErrorTextNoArgsFunction<OptsType>
) {
  return matcherFunction(resultFunction, errorTextFunction, true)
}

export const elementMatchers: jasmine.CustomMatcherFactories = {
  toExist: elementMatcherFunction(
    ({node}) => [() => node.currently.exists(), () => node.currently.not.exists()],
    () => " to exist"
  ),
  toBeVisible: elementMatcherFunction(
    ({node}) => [() => node.currently.isVisible(), () => node.currently.not.isVisible()],
    () => " to be visible"
  ),
  toBeSelected: elementMatcherFunction(
    ({node}) => [() => node.currently.isSelected(), () => node.currently.not.isSelected()],
    () => " to be selected"
  ),
  toBeEnabled: elementMatcherFunction(
    ({node}) => [() => node.currently.isEnabled(), () => node.currently.not.isEnabled()],
    () => " to be enabled"
  ),
  toBeChecked: elementMatcherFunction(
    ({node}) => [() => node.currently.isChecked(), () => node.currently.not.isChecked()],
    () => " to be checked"
  ),
  toHaveText: elementMatcherFunction(
    ({node, expected}) => [
      () => node.currently.hasText(expected), () => node.currently.not.hasText(expected)
    ],
    ({actual, expected}) => createLongErrorMessage('text', 'be', actual, expected)
  ),
  toHaveAnyText: elementMatcherFunction(
    ({node}) => [() => node.currently.hasAnyText(), () => node.currently.not.hasAnyText()],
    () => " to have any text"
  ),
  toContainText: elementMatcherFunction(
    ({node, expected}) => [
      () => node.currently.containsText(expected), () => node.currently.not.containsText(expected)
    ],
    ({actual, expected}) => createLongErrorMessage('text', 'contain', actual, expected)
  ),
  toHaveHTML: elementMatcherFunction(
    ({node, expected}) => [
      () => node.currently.hasHTML(expected), () => node.currently.not.hasHTML(expected)
    ],
    ({actual, expected}) => createLongErrorMessage('HTML', 'be', actual, expected)
  ),
  toHaveAnyHTML: elementMatcherFunction(
    ({node}) => [
      () => node.currently.hasAnyHTML(), () => node.currently.not.hasAnyHTML()
    ],
    () => ` to have any HTML`
  ),
  toContainHTML: elementMatcherFunction(
    ({node, expected}) => [
      () => node.currently.containsHTML(expected), () => node.currently.not.containsHTML(expected)
    ],
    ({actual, expected}) => createLongErrorMessage('HTML', 'contain', actual, expected)
  ),
  toHaveDirectText: elementMatcherFunction(
    ({node, expected}) => [
      () => node.currently.hasDirectText(expected), () => node.currently.not.hasDirectText(expected)
    ],
    ({actual, expected}) => createLongErrorMessage('direct text', 'be', actual, expected)
  ),
  toHaveAnyDirectText: elementMatcherFunction(
    ({node}) => [
      () => node.currently.hasAnyDirectText(), () => node.currently.not.hasAnyDirectText()
    ],
    () => ` to have any direct text`
  ),
  toContainDirectText: elementMatcherFunction(
    ({node, expected}) => [
      () => node.currently.containsDirectText(expected), () => node.currently.not.containsDirectText(expected)
    ],
    ({actual, expected}) => createLongErrorMessage('direct text', 'contain', actual, expected)
  ),
  toHaveAttribute: elementMatcherFunction<Workflo.IAttributeArgs>(
    ({node, expected}) => [
      () => node.currently.hasAttribute(expected.name, expected.value),
      () => node.currently.not.hasAttribute(expected.name, expected.value),
    ],
    ({actual, expected}) => createLongErrorMessage(expected.name, 'be', actual, expected.value)
  ),
  toHaveAnyAttribute: elementMatcherFunction<string>(
    ({node, expected}) => [
      () => node.currently.hasAnyAttribute(expected),
      () => node.currently.not.hasAnyAttribute(expected)
    ],
    ({expected}) => ` to have any ${expected}`
  ),
  toContainAttribute: elementMatcherFunction<Workflo.IAttributeArgs>(
    ({node, expected}) => [
      () => node.currently.containsAttribute(expected.name, expected.value),
      () => node.currently.not.containsAttribute(expected.name, expected.value),
    ],
    ({actual, expected}) => createLongErrorMessage(expected.name, 'contain', actual, expected.value)
  ),
  toHaveClass: elementMatcherFunction(
    ({node, expected}) => [
      () => node.currently.hasClass(expected), () => node.currently.not.hasClass(expected)
    ],
    ({actual, expected}) => createLongErrorMessage('class', 'be', actual, expected)
  ),
  toHaveAnyClass: elementMatcherFunction(
    ({node}) => [
      () => node.currently.hasAnyClass(), () => node.currently.not.hasAnyClass()
    ],
    () => ` to have any class`
  ),
  toContainClass: elementMatcherFunction(
    ({node, expected}) => [
      () => node.currently.containsClass(expected), () => node.currently.not.containsClass(expected)
    ],
    ({actual, expected}) => createLongErrorMessage('class', 'contain', actual, expected)
  ),
  toHaveId: elementMatcherFunction(
    ({node, expected}) => [
      () => node.currently.hasId(expected), () => node.currently.not.hasId(expected)
    ],
    ({actual, expected}) => createLongErrorMessage('id', 'be', actual, expected)
  ),
  toHaveAnyId: elementMatcherFunction(
    ({node}) => [
      () => node.currently.hasAnyId(), () => node.currently.not.hasAnyId()
    ],
    () => ` to have any id`
  ),
  toContainId: elementMatcherFunction(
    ({node, expected}) => [
      () => node.currently.containsId(expected), () => node.currently.not.containsId(expected)
    ],
    ({actual, expected}) => createLongErrorMessage('id', 'contain', actual, expected)
  ),
  toHaveName: elementMatcherFunction(
    ({node, expected}) => [
      () => node.currently.hasName(expected), () => node.currently.not.hasName(expected)
    ],
    ({actual, expected}) => createLongErrorMessage('name', 'be', actual, expected)
  ),
  toHaveAnyName: elementMatcherFunction(
    ({node}) => [
      () => node.currently.hasAnyName(), () => node.currently.not.hasAnyName()
    ],
    () => ` to have any name`
  ),
  toContainName: elementMatcherFunction(
    ({node, expected}) => [
      () => node.currently.containsName(expected), () => node.currently.not.containsName(expected)
    ],
    ({actual, expected}) => createLongErrorMessage('name', 'contain', actual, expected)
  ),
  toHaveLocation: elementMatcherFunction<Workflo.ICoordinates, {tolerances?: Partial<Workflo.ICoordinates>}>(
    ({node, expected, opts}) => [
      () => node.currently.hasLocation(expected, opts.tolerances),
      () => node.currently.not.hasLocation(expected, opts.tolerances)
    ],
    ({actual, expected, opts}) => createLongErrorMessage(
      'location',
      (opts.tolerances && (opts.tolerances.x > 0 || opts.tolerances.y > 0)) ? 'be in range' : 'be',
      actual,
      tolerancesToString(expected, opts.tolerances)
    )
  ),
  toHaveX: elementMatcherFunction<number, {tolerance?: number}>(
    ({node, expected, opts}) => [
      () => node.currently.hasX(expected, opts.tolerance),
      () => node.currently.not.hasX(expected, opts.tolerance)
    ],
    ({actual, expected, opts}) => createLongErrorMessage(
      'X-coordinate',
      (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be',
      actual,
      tolerancesToString(expected, opts.tolerance)
    )
  ),
  toHaveY: elementMatcherFunction<number, {tolerance?: number}>(
    ({node, expected, opts}) => [
      () => node.currently.hasY(expected, opts.tolerance),
      () => node.currently.not.hasY(expected, opts.tolerance)
    ],
    ({actual, expected, opts}) => createLongErrorMessage(
      'Y-coordinate',
      (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be',
      actual,
      tolerancesToString(expected, opts.tolerance)
    )
  ),
  toHaveSize: elementMatcherFunction<Workflo.ISize, {tolerances?: Partial<Workflo.ISize>}>(
    ({node, expected, opts}) => [
      () => node.currently.hasSize(expected, opts.tolerances),
      () => node.currently.not.hasSize(expected, opts.tolerances)
    ],
    ({actual, expected, opts}) => createLongErrorMessage(
      'size',
      (opts.tolerances && (opts.tolerances.width > 0 || opts.tolerances.height > 0)) ? 'be in range' : 'be',
      actual,
      tolerancesToString(expected, opts.tolerances)
    )
  ),
  toHaveWidth: elementMatcherFunction<number, {tolerance?: number}>(
    ({node, expected, opts}) => [
      () => node.currently.hasWidth(expected, opts.tolerance),
      () => node.currently.not.hasWidth(expected, opts.tolerance)
    ],
    ({actual, expected, opts}) => createLongErrorMessage(
      'width',
      (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be',
      actual,
      tolerancesToString(expected, opts.tolerance)
    )
  ),
  toHaveHeight: elementMatcherFunction<number, {tolerance?: number}>(
    ({node, expected, opts}) => [
      () => node.currently.hasHeight(expected, opts.tolerance),
      () => node.currently.not.hasHeight(expected, opts.tolerance)
    ],
    ({actual, expected, opts}) => createLongErrorMessage(
      'height',
      (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be',
      actual,
      tolerancesToString(expected, opts.tolerance)
    )
  ),

  toEventuallyExist: elementMatcherNoArgsFunction(
    ({node, opts}) => [
      () => node.eventually.exists(opts), () => node.eventually.not.exists(opts)
    ],
    ({opts}) => ` to eventually exist within ${opts.timeout} ms`
  ),
  toEventuallyBeVisible: elementMatcherNoArgsFunction(
    ({node, opts}) => [
      () => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts)
    ],
    ({opts}) => ` to eventually be visible within ${opts.timeout} ms`
  ),
  toEventuallyBeSelected: elementMatcherNoArgsFunction(
    ({node, opts}) => [
      () => node.eventually.isSelected(opts), () => node.eventually.not.isSelected(opts)
    ],
    ({opts}) => ` to eventually be selected within ${opts.timeout} ms`
  ),
  toEventuallyBeEnabled: elementMatcherNoArgsFunction(
    ({node, opts}) => [
      () => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts)
    ],
    ({opts}) => ` to eventually be enabled within ${opts.timeout} ms`
  ),
  toEventuallyBeChecked: elementMatcherNoArgsFunction(
    ({node, opts}) => [
      () => node.eventually.isChecked(opts), () => node.eventually.not.isChecked(opts)
    ],
    ({opts}) => ` to eventually be checked within ${opts.timeout} ms`
  ),
  toEventuallyHaveText: elementMatcherFunction(
    ({node, expected, opts}) => [
      () => node.eventually.hasText(expected, opts),
      () => node.eventually.not.hasText(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage('text', 'be', actual, expected, opts.timeout)
  ),
  toEventuallyHaveAnyText: elementMatcherNoArgsFunction(
    ({node}) => [
      () => node.eventually.hasAnyText(), () => node.eventually.not.hasAnyText()
    ],
    ({opts}) => ` to eventually have any text within ${opts.timeout} ms`
  ),
  toEventuallyContainText: elementMatcherFunction(
    ({node, expected, opts}) => [
      () => node.eventually.containsText(expected, opts),
      () => node.eventually.not.containsText(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage('text', 'contain', actual, expected, opts.timeout)
  ),
  toEventuallyHaveHTML: elementMatcherFunction(
    ({node, expected, opts}) => [
      () => node.eventually.hasHTML(expected, opts),
      () => node.eventually.not.hasHTML(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage('HTML', 'be', actual, expected, opts.timeout)
  ),
  toEventuallyHaveAnyHTML: elementMatcherNoArgsFunction(
    ({node, opts}) => [
      () => node.eventually.hasAnyHTML(opts), () => node.eventually.not.hasAnyHTML(opts)
    ],
    ({opts}) => ` to eventually have any HTML within ${opts.timeout} ms`
  ),
  toEventuallyContainHTML: elementMatcherFunction(
    ({node, expected, opts}) => [
      () => node.eventually.containsHTML(expected, opts),
      () => node.eventually.not.containsHTML(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage('HTML', 'contain', actual, expected, opts.timeout)
  ),
  toEventuallyHaveDirectText: elementMatcherFunction(
    ({node, expected, opts}) => [
      () => node.eventually.hasDirectText(expected, opts),
      () => node.eventually.not.hasDirectText(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage('direct text', 'be', actual, expected, opts.timeout)
  ),
  toEventuallyHaveAnyDirectText: elementMatcherNoArgsFunction(
    ({node, opts}) => [
      () => node.eventually.hasAnyDirectText(opts),
      () => node.eventually.not.hasAnyDirectText(opts)
    ],
    ({opts}) => ` to eventually have any direct text within ${opts.timeout} ms`
  ),
  toEventuallyContainDirectText: elementMatcherFunction(
    ({node, expected, opts}) => [
      () => node.eventually.containsDirectText(expected, opts),
      () => node.eventually.not.containsDirectText(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage('direct text', 'contain', actual, expected, opts.timeout)
  ),
  toEventuallyHaveAttribute: elementMatcherFunction<Workflo.IAttributeArgs>(
    ({node, expected, opts}) => [
      () => node.eventually.hasAttribute(expected.name, expected.value, opts),
      () => node.eventually.not.hasAttribute(expected.name, expected.value, opts),
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage(expected.name, 'be', actual, expected.value, opts.timeout)
  ),
  toEventuallyHaveAnyAttribute: elementMatcherFunction<string>(
    ({node, expected, opts}) => [
      () => node.eventually.hasAnyAttribute(expected, opts),
      () => node.eventually.not.hasAnyAttribute(expected, opts),
    ],
    ({expected, opts}) => ` to eventually have any ${expected} within ${opts.timeout} ms`
  ),
  toEventuallyContainAttribute: elementMatcherFunction<Workflo.IAttributeArgs>(
    ({node, expected, opts}) => [
      () => node.eventually.containsAttribute(expected.name, expected.value, opts),
      () => node.eventually.not.containsAttribute(expected.name, expected.value, opts),
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage(expected.name, 'contain', actual, expected.value, opts.timeout)
  ),
  toEventuallyHaveClass: elementMatcherFunction(
    ({node, expected, opts}) => [
      () => node.eventually.hasClass(expected, opts),
      () => node.eventually.not.hasClass(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage('class', 'be', actual, expected, opts.timeout)
  ),
  toEventuallyHaveAnyClass: elementMatcherNoArgsFunction(
    ({node}) => [
      () => node.eventually.hasAnyClass(), () => node.eventually.not.hasAnyClass()
    ],
    ({opts}) => ` to eventually have any class within ${opts.timeout} ms`
  ),
  toEventuallyContainClass: elementMatcherFunction(
    ({node, expected, opts}) => [
      () => node.eventually.containsClass(expected, opts),
      () => node.eventually.not.containsClass(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage('class', 'contain', actual, expected, opts.timeout)
  ),
  toEventuallyHaveId: elementMatcherFunction(
    ({node, expected, opts}) => [
      () => node.eventually.hasId(expected, opts),
      () => node.eventually.not.hasId(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage('id', 'be', actual, expected, opts.timeout)
  ),
  toEventuallyHaveAnyId: elementMatcherNoArgsFunction(
    ({node}) => [
      () => node.eventually.hasAnyId(), () => node.eventually.not.hasAnyId()
    ],
    ({opts}) => ` to eventually have any id within ${opts.timeout} ms`
  ),
  toEventuallyContainId: elementMatcherFunction(
    ({node, expected, opts}) => [
      () => node.eventually.containsId(expected, opts),
      () => node.eventually.not.containsId(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage('id', 'contain', actual, expected, opts.timeout)
  ),
  toEventuallyHaveName: elementMatcherFunction(
    ({node, expected, opts}) => [
      () => node.eventually.hasName(expected, opts),
      () => node.eventually.not.hasName(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage('name', 'be', actual, expected, opts.timeout)
  ),
  toEventuallyHaveAnyName: elementMatcherNoArgsFunction(
    ({node}) => [() => node.eventually.hasAnyName(), () => node.eventually.not.hasAnyName()],
    ({opts}) => ` to eventually have any name within ${opts.timeout} ms`
  ),
  toEventuallyContainName: elementMatcherFunction(
    ({node, expected, opts}) => [
      () => node.eventually.containsName(expected, opts),
      () => node.eventually.not.containsName(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage('name', 'contain', actual, expected, opts.timeout)
  ),
  toEventuallyHaveLocation: elementMatcherFunction<Workflo.ICoordinates, {tolerances?: Partial<Workflo.ICoordinates>}>(
    ({node, expected, opts}) => [
      () => node.eventually.hasLocation(expected, opts),
      () => node.eventually.not.hasLocation(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage(
      'location',
      (opts.tolerances && (opts.tolerances.x > 0 || opts.tolerances.y > 0)) ? 'be in range' : 'be',
      actual,
      tolerancesToString(expected, opts.tolerances),
      opts.timeout
    )
  ),
  toEventuallyHaveX: elementMatcherFunction<number, {tolerance?: number}>(
    ({node, expected, opts}) => [
      () => node.eventually.hasX(expected, opts), () => node.eventually.not.hasX(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage(
      'X-coordinate',
      (opts.tolerance && opts.tolerance > 0) ? 'be in range ' : 'be',
      actual,
      tolerancesToString(expected, opts.tolerance),
      opts.timeout
    )
  ),
  toEventuallyHaveY: elementMatcherFunction<number, {tolerance?: number}>(
    ({node, expected, opts}) => [
      () => node.eventually.hasY(expected, opts), () => node.eventually.not.hasY(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage(
      'Y-coordinate',
      (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be',
      actual,
      tolerancesToString(expected, opts.tolerance),
      opts.timeout
    )
  ),
  toEventuallyHaveSize: elementMatcherFunction<Workflo.ISize, {tolerances?: Partial<Workflo.ISize>}>(
    ({node, expected, opts}) => [
      () => node.eventually.hasSize(expected, opts), () => node.eventually.not.hasSize(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage(
      'size',
      (opts.tolerances && (opts.tolerances.width > 0 || opts.tolerances.height > 0)) ? 'be in range' : 'be',
      actual,
      tolerancesToString(expected, opts.tolerances),
      opts.timeout
    )
  ),
  toEventuallyHaveWidth: elementMatcherFunction<number, {tolerance?: number}>(
    ({node, expected, opts}) => [
      () => node.eventually.hasWidth(expected, opts), () => node.eventually.not.hasWidth(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage(
      'width',
      (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be',
      actual,
      tolerancesToString(expected, opts.tolerance),
      opts.timeout
    )
  ),
  toEventuallyHaveHeight: elementMatcherFunction<number, {tolerance?: number}>(
    ({node, expected, opts}) => [
      () => node.eventually.hasHeight(expected, opts),
      () => node.eventually.not.hasHeight(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage(
      'height',
      (opts.tolerance && opts.tolerance > 0) ? 'be in range' : 'be',
      actual,
      tolerancesToString(expected, opts.tolerance),
      opts.timeout
    )
  )
};

export const listMatchers: jasmine.CustomMatcherFactories = {
  toBeEmpty: listMatcherFunction(
    ({node}) => [() => node.currently.isEmpty(), () => node.currently.not.isEmpty()],
    () => " to be empty"
  ),
  toHaveLength: listMatcherFunction<number, {comparator?: Workflo.Comparator}>(
    ({node, expected, opts}) => [
      () => node.currently.hasLength(expected, opts.comparator),
      () => node.currently.not.hasLength(expected, opts.comparator)
    ],
    ({actual, expected, opts}) => `'s length ${actual} to be${comparatorStr(opts.comparator)} ${expected}`
  ),
  toEventuallyBeEmpty: listMatcherNoArgsFunction<IPageElementListWaitEmptyParams>(
    ({node, opts}) => [
      () => node.eventually.isEmpty(opts), () => node.eventually.not.isEmpty(opts)
    ],
    ({opts}) => ` to eventually be empty within ${opts.timeout} ms`
  ),
  toEventuallyHaveLength: listMatcherFunction<number, IPageElementListWaitLengthParams>(
    ({node, expected, opts}) => [
      () => node.eventually.hasLength(expected, opts),
      () => node.eventually.not.hasLength(expected, opts)
    ],
    ({actual, expected, opts}) => `'s length ${actual} to be${comparatorStr(opts.comparator)} ${expected} within ${opts.timeout} ms`
  ),
}

function valueElementMatcherFunction<
  ExpectedType = string,
  OptsType extends Object = {timeout?: number}
>(
  resultFunction: ResultFunction<
    stores.PageElementStore,
    elements.ValuePageElement<stores.PageElementStore>,
    OptsType,
    ExpectedType
  >,
  errorTextFunction: ErrorTextFunction<OptsType, ExpectedType>
) {
  return matcherFunction(resultFunction, errorTextFunction)
}

export const valueElementMatchers: jasmine.CustomMatcherFactories = {
  toHaveValue: valueElementMatcherFunction(
    ({node, expected}) => [
      () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected)
    ],
    ({actual, expected}) => createLongErrorMessage('value', 'be', actual, expected)
  ),
  toHaveAnyValue: valueElementMatcherFunction(
    ({node}) => [() => node.currently.hasAnyValue(), () => node.currently.not.hasAnyValue()],
    () => " to have any value"
  ),
  toContainValue: valueElementMatcherFunction(
    ({node, expected}) => [
      () => node.currently.containsValue(expected), () => node.currently.not.containsValue(expected)
    ],
    ({actual, expected}) => createLongErrorMessage('value', 'contain', actual, expected)
  ),

  toEventuallyHaveValue: valueElementMatcherFunction(
    ({node, expected, opts}) => [
      () => node.eventually.hasValue(expected, opts),
      () => node.eventually.not.hasValue(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage('value', 'be', actual, expected, opts.timeout)
  ),
  toEventuallyHaveAnyValue: valueElementMatcherFunction(
    ({node, opts}) => [
      () => node.eventually.hasAnyValue(opts),
      () => node.eventually.not.hasAnyValue(opts)
    ],
    ({opts}) => ` to eventually have any value within ${opts.timeout} ms`
  ),
  toEventuallyContainValue: valueElementMatcherFunction(
    ({node, expected, opts}) => [
      () => node.eventually.containsValue(expected, opts),
      () => node.eventually.not.containsValue(expected, opts)
    ],
    ({actual, expected, opts}) => createEventuallyErrorMessage('value', 'contain', actual, expected, opts.timeout)
  ),
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
  PageElemnetListType extends elements.PageElementList<Store, PageElementType, PageElementOptions>
>(list: PageElemnetListType) {
  return expect(list)
}