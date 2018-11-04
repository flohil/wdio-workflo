import { elements, stores } from './page_objects'
import * as _ from 'lodash'
import { tolerancesObjectToString } from './helpers'

interface ResultFuncArgs<ExpectedType, OptsType> {
  element: elements.PageElement<stores.PageElementStore>;
  expected?: ExpectedType;
  opts?: OptsType;
}

interface ErrorFuncArgs<ExpectedType, OptsType> {
  actual: string;
  expected?: ExpectedType;
  opts?: OptsType
}

type ResultFunction<ExpectedType, OptsType> = (args: ResultFuncArgs<ExpectedType, OptsType & {timeout?: number}>) => boolean[]
type ErrorTextFunction<ExpectedType, OptsType> = (args: ErrorFuncArgs<ExpectedType, OptsType & {timeout?: number}>) => string | string[]

function elementMatcherFunction<ExpectedType = string, OptsType extends Object = {timeout?: number}>(
  resultFunction: ResultFunction<ExpectedType, OptsType>,
  errorTextFunction: ErrorTextFunction<ExpectedType, OptsType>
) {
  return (util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>) => {

    function baseCompareFunction(
      element: elements.PageElement<stores.PageElementStore>,
      expected: ExpectedType,
      negativeComparison: boolean,
      opts?: OptsType
    ): jasmine.CustomMatcherResult {
      let result: jasmine.CustomMatcherResult = {
        pass: true,
        message: ''
      };

      let negateAssertionResult = false
      let defaultNegativeMessage = ''

      const successes: boolean[] = resultFunction({element, expected, opts})
      const success = (negativeComparison) ? successes[1] : successes[0]

      if (!success) {
        let optsWithTimeout: OptsType & {timeout?: number} = opts || Object.create(null)

        if (typeof opts === 'undefined' || !opts['timeout'] ) {
          optsWithTimeout.timeout = element.getTimeout()
        }

        const actual = element.lastActualResult
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
        result.message = `Expected ${element.constructor.name}${defaultNegativeMessage}${errorText}.\n( ${element.getSelector()} )`;
      }

      return result;
    }

    return {
      compare: (element: elements.PageElement<stores.PageElementStore>, expected: ExpectedType, opts?: OptsType): jasmine.CustomMatcherResult => {
        return baseCompareFunction(element, expected, false, opts);
      },
      negativeCompare: (element: elements.PageElement<stores.PageElementStore>, expected: ExpectedType, opts?: OptsType): jasmine.CustomMatcherResult => {
        return baseCompareFunction(element, expected, true, opts);
      }
    }
  }
}

function createLongErrorMessage(property: string, comparison: string, actual: string, expected: string) {
  return [
    `'s ${property} "${actual}" to ${comparison} "${expected}"`,
    `'s ${property} "${actual}" not to ${comparison} "${expected}"`,
  ]
}

function createEventuallyErrorMessage(property: string, comparison: string, actual: string, expected: string, timeout: number) {
  return [
    `'s ${property} "${actual}" to eventually ${comparison} "${expected}" within ${timeout} ms`,
    `'s ${property} "${actual}" not to eventually ${comparison} "${expected}" within ${timeout} ms`,
  ]
}

export const elementMatchers: jasmine.CustomMatcherFactories = {
  toExist: elementMatcherFunction(
    ({element}) => [element.currently.exists(), element.currently.not.exists()],
    () => " to exist"
  ),
  toBeVisible: elementMatcherFunction(
    ({element}) => [element.currently.isVisible(), element.currently.not.isVisible()],
    () => " to be visible"
  ),
  toBeSelected: elementMatcherFunction(
    ({element}) => [element.currently.isSelected(), element.currently.not.isSelected()],
    () => " to be selected"
  ),
  toBeEnabled: elementMatcherFunction(
    ({element}) => [element.currently.isEnabled(), element.currently.not.isEnabled()],
    () => " to be enabled"
  ),
  toHaveText: elementMatcherFunction(
    ({element, expected}) => [element.currently.hasText(expected), element.currently.not.hasText(expected)],
    ({actual, expected}) => createLongErrorMessage('text', 'be', actual, expected)
  ),
  toHaveAnyText: elementMatcherFunction(
    ({element}) => [element.currently.hasAnyText(), element.currently.not.hasAnyText()],
    () => " to have any text"
  ),
  toContainText: elementMatcherFunction(
    ({element, expected}) => [element.currently.containsText(expected), element.currently.not.containsText(expected)],
    ({actual, expected}) => createLongErrorMessage('text', 'contain', actual, expected)
  ),
  toHaveValue: elementMatcherFunction(
    ({element, expected}) => [element.currently.hasValue(expected), element.currently.not.hasValue(expected)],
    ({actual, expected}) => createLongErrorMessage('value', 'be', actual, expected)
  ),
  toHaveAnyValue: elementMatcherFunction(
    ({element}) => [element.currently.hasAnyValue(), element.currently.not.hasAnyValue()],
    () => " to have any value"
  ),
  toContainValue: elementMatcherFunction(
    ({element, expected}) => [element.currently.containsValue(expected), element.currently.not.containsValue(expected)],
    ({actual, expected}) => createLongErrorMessage('value', 'contain', actual, expected)
  ),
  toHaveHTML: elementMatcherFunction(
    ({element, expected}) => [element.currently.hasHTML(expected), element.currently.not.hasHTML(expected)],
    ({actual, expected}) => createLongErrorMessage('HTML', 'be', actual, expected)
  ),
  toHaveAnyHTML: elementMatcherFunction(
    ({element}) => [element.currently.hasAnyHTML(), element.currently.not.hasAnyHTML()],
    () => ` to have any HTML`
  ),
  toContainHTML: elementMatcherFunction(
    ({element, expected}) => [element.currently.containsHTML(expected), element.currently.not.containsHTML(expected)],
    ({actual, expected}) => createLongErrorMessage('HTML', 'contain', actual, expected)
  ),
  toHaveDirectText: elementMatcherFunction(
    ({element, expected}) => [element.currently.hasDirectText(expected), element.currently.not.hasDirectText(expected)],
    ({actual, expected}) => createLongErrorMessage('direct text', 'be', actual, expected)
  ),
  toHaveAnyDirectText: elementMatcherFunction(
    ({element}) => [element.currently.hasAnyDirectText(), element.currently.not.hasAnyDirectText()],
    () => ` to have any direct text`
  ),
  toContainDirectText: elementMatcherFunction(
    ({element, expected}) => [element.currently.containsDirectText(expected), element.currently.not.containsDirectText(expected)],
    ({actual, expected}) => createLongErrorMessage('direct text', 'contain', actual, expected)
  ),
  toHaveAttribute: elementMatcherFunction<Workflo.IAttributeArgs>(
    ({element, expected}) => [
      element.currently.hasAttribute(expected.name, expected.value),
      element.currently.not.hasAttribute(expected.name, expected.value),
    ],
    ({actual, expected}) => createLongErrorMessage(expected.name, 'be', actual, expected.value)
  ),
  toHaveAnyAttribute: elementMatcherFunction<Workflo.IAttributeArgs>(
    ({element, expected}) => [
      element.currently.hasAnyAttribute(expected.name),
      element.currently.not.hasAnyAttribute(expected.name),
    ],
    ({expected}) => ` to have any ${expected.name}`
  ),
  toContainAttribute: elementMatcherFunction<Workflo.IAttributeArgs>(
    ({element, expected}) => [
      element.currently.containsAttribute(expected.name, expected.value),
      element.currently.not.containsAttribute(expected.name, expected.value),
    ],
    ({actual, expected}) => createLongErrorMessage(expected.name, 'contain', actual, expected.value)
  ),
  toHaveClass: elementMatcherFunction(
    ({element, expected}) => [element.currently.hasClass(expected), element.currently.not.hasClass(expected)],
    ({actual, expected}) => createLongErrorMessage('class', 'be', actual, expected)
  ),
  toContainClass: elementMatcherFunction(
    ({element, expected}) => [element.currently.containsClass(expected), element.currently.not.containsClass(expected)],
    ({actual, expected}) => createLongErrorMessage('class', 'contain', actual, expected)
  ),
  toHaveId: elementMatcherFunction(
    ({element, expected}) => [element.currently.hasId(expected), element.currently.not.hasId(expected)],
    ({actual, expected}) => createLongErrorMessage('id', 'be', actual, expected)
  ),
  toHaveAnyId: elementMatcherFunction(
    ({element}) => [element.currently.hasAnyId(), element.currently.not.hasAnyId()],
    () => ` to have any id`
  ),
  toContainId: elementMatcherFunction(
    ({element, expected}) => [element.currently.containsId(expected), element.currently.not.containsId(expected)],
    ({actual, expected}) => createLongErrorMessage('id', 'contain', actual, expected)
  ),
  toHaveName: elementMatcherFunction(
    ({element, expected}) => [element.currently.hasName(expected), element.currently.not.hasName(expected)],
    ({actual, expected}) => createLongErrorMessage('name', 'be', actual, expected)
  ),
  toHaveAnyName: elementMatcherFunction(
    ({element}) => [element.currently.hasAnyName(), element.currently.not.hasAnyName()],
    () => ` to have any name`
  ),
  toContainName: elementMatcherFunction(
    ({element, expected}) => [element.currently.containsName(expected), element.currently.not.containsName(expected)],
    ({actual, expected}) => createLongErrorMessage('name', 'contain', actual, expected)
  ),
  toHaveLocation: elementMatcherFunction<Partial<Workflo.ICoordinates>, {tolerances?: Partial<Workflo.ICoordinates>}>(
    ({element, expected, opts}) => [element.currently.hasLocation(expected, opts.tolerances), element.currently.not.hasLocation(expected, opts.tolerances)],
    ({actual, expected, opts}) => createLongErrorMessage(
      'location',
      (opts.tolerances && (opts.tolerances.x > 0 || opts.tolerances.y > 0)) ? 'be within' : 'be',
      tolerancesObjectToString(actual),
      tolerancesObjectToString(expected)
    )
  ),
  toHaveX: elementMatcherFunction<number, {tolerance?: number}>(
    ({element, expected, opts}) => [element.currently.hasX(expected, opts.tolerance), element.currently.not.hasX(expected, opts.tolerance)],
    ({actual, expected, opts}) => createLongErrorMessage(
      'x',
      (opts.tolerance && opts.tolerance > 0) ? 'be within' : 'be',
      tolerancesObjectToString(actual),
      tolerancesObjectToString(expected)
    )
  ),
  toHaveY: elementMatcherFunction<number, {tolerance?: number}>(
    ({element, expected, opts}) => [element.currently.hasY(expected, opts.tolerance), element.currently.not.hasY(expected, opts.tolerance)],
    ({actual, expected, opts}) => createLongErrorMessage(
      'y',
      (opts.tolerance && opts.tolerance > 0) ? 'be within' : 'be',
      tolerancesObjectToString(actual),
      tolerancesObjectToString(expected)
    )
  ),
  toHaveSize: elementMatcherFunction<Partial<Workflo.ISize>, {tolerances?: Partial<Workflo.ISize>}>(
    ({element, expected, opts}) => [element.currently.hasSize(expected, opts.tolerances), element.currently.not.hasSize(expected, opts.tolerances)],
    ({actual, expected, opts}) => createLongErrorMessage(
      'size',
      (opts.tolerances && (opts.tolerances.width > 0 || opts.tolerances.height > 0)) ? 'be within' : 'be',
      tolerancesObjectToString(actual),
      tolerancesObjectToString(expected)
    )
  ),
  toHaveWidth: elementMatcherFunction<number, {tolerance?: number}>(
    ({element, expected, opts}) => [element.currently.hasWidth(expected, opts.tolerance), element.currently.not.hasWidth(expected, opts.tolerance)],
    ({actual, expected, opts}) => createLongErrorMessage(
      'width',
      (opts.tolerance && opts.tolerance > 0) ? 'be within' : 'be',
      tolerancesObjectToString(actual),
      tolerancesObjectToString(expected)
    )
  ),
  toHaveHeight: elementMatcherFunction<number, {tolerance?: number}>(
    ({element, expected, opts}) => [element.currently.hasHeight(expected, opts.tolerance), element.currently.not.hasHeight(expected, opts.tolerance)],
    ({actual, expected, opts}) => createLongErrorMessage(
      'height',
      (opts.tolerance && opts.tolerance > 0) ? 'be within' : 'be',
      tolerancesObjectToString(actual),
      tolerancesObjectToString(expected)
    )
  ),

  toEventuallyExist: elementMatcherFunction(
    ({element, opts}) => [element.eventually.exists(opts), element.eventually.not.exists(opts)],
    ({opts}) => ` to eventually exist within ${opts.timeout} ms`
  ),
  toEventuallyBeVisible: elementMatcherFunction(
    ({element, opts}) => [element.eventually.isVisible(opts), element.eventually.not.isVisible(opts)],
    ({opts}) => ` to eventually be visible within ${opts.timeout} ms`
  ),
  toEventuallyBeSelected: elementMatcherFunction(
    ({element, opts}) => [element.eventually.isSelected(opts), element.eventually.not.isSelected(opts)],
    ({opts}) => ` to eventually be selected within ${opts.timeout} ms`
  ),
  toEventuallyBeEnabled: elementMatcherFunction(
    ({element, opts}) => [element.eventually.isEnabled(opts), element.eventually.not.isEnabled(opts)],
    ({opts}) => ` to eventually be enabled within ${opts.timeout} ms`
  ),
  toEventuallyHaveText: elementMatcherFunction(
    ({element, expected, opts}) => [element.eventually.hasText(expected, opts), element.eventually.not.hasText(expected, opts)],
    ({actual, expected, opts}) => createEventuallyErrorMessage('text', 'be', actual, expected, opts.timeout)
  ),
  toEventuallyHaveAnyText: elementMatcherFunction(
    ({element}) => [element.eventually.hasAnyText(), element.eventually.not.hasAnyText()],
    ({opts}) => ` to eventually have any text within ${opts.timeout} ms`
  ),
  toEventuallyContainText: elementMatcherFunction(
    ({element, expected, opts}) => [element.eventually.containsText(expected, opts), element.eventually.not.containsText(expected, opts)],
    ({actual, expected, opts}) => createEventuallyErrorMessage('text', 'contain', actual, expected, opts.timeout)
  ),
  toEventuallyHaveValue: elementMatcherFunction(
    ({element, expected, opts}) => [element.eventually.hasValue(expected, opts), element.eventually.not.hasValue(expected, opts)],
    ({actual, expected, opts}) => createEventuallyErrorMessage('value', 'be', actual, expected, opts.timeout)
  ),
  toEventuallyHaveAnyValue: elementMatcherFunction(
    ({element, opts}) => [element.eventually.hasAnyValue(opts), element.eventually.not.hasAnyValue(opts)],
    ({opts}) => ` to eventually have any value within ${opts.timeout} ms`
  ),



  // toEventuallyContainValue: elementMatcherFunction(
  //   ({element, expected}) => [element.eventually.containsValue(expected), element.eventually.not.containsValue(expected)],
  //   ({actual, expected}) => createLongErrorMessage('value', 'contain', actual, expected)
  // ),
  // toEventuallyHaveHTML: elementMatcherFunction(
  //   ({element, expected}) => [element.eventually.hasHTML(expected), element.eventually.not.hasHTML(expected)],
  //   ({actual, expected}) => createLongErrorMessage('HTML', 'be', actual, expected)
  // ),
  // toEventuallyHaveAnyHTML: elementMatcherFunction(
  //   ({element}) => [element.eventually.hasAnyHTML(), element.eventually.not.hasAnyHTML()],
  //   () => ` toEventually have any HTML`
  // ),
  // toEventuallyContainHTML: elementMatcherFunction(
  //   ({element, expected}) => [element.eventually.containsHTML(expected), element.eventually.not.containsHTML(expected)],
  //   ({actual, expected}) => createLongErrorMessage('HTML', 'contain', actual, expected)
  // ),
  // toEventuallyHaveDirectText: elementMatcherFunction(
  //   ({element, expected}) => [element.eventually.hasDirectText(expected), element.eventually.not.hasDirectText(expected)],
  //   ({actual, expected}) => createLongErrorMessage('direct text', 'be', actual, expected)
  // ),
  // toEventuallyHaveAnyDirectText: elementMatcherFunction(
  //   ({element}) => [element.eventually.hasAnyDirectText(), element.eventually.not.hasAnyDirectText()],
  //   () => ` toEventually have any direct text`
  // ),
  // toEventuallyContainDirectText: elementMatcherFunction(
  //   ({element, expected}) => [element.eventually.containsDirectText(expected), element.eventually.not.containsDirectText(expected)],
  //   ({actual, expected}) => createLongErrorMessage('direct text', 'contain', actual, expected)
  // ),
  // toEventuallyHaveAttribute: elementMatcherFunction<Workflo.IAttributeArgs>(
  //   ({element, expected}) => [
  //     element.eventually.hasAttribute(expected.name, expected.value),
  //     element.eventually.not.hasAttribute(expected.name, expected.value),
  //   ],
  //   ({actual, expected}) => createLongErrorMessage(expected.name, 'be', actual, expected.value)
  // ),
  // toEventuallyHaveAnyAttribute: elementMatcherFunction<Workflo.IAttributeArgs>(
  //   ({element, expected}) => [
  //     element.eventually.hasAnyAttribute(expected.name),
  //     element.eventually.not.hasAnyAttribute(expected.name),
  //   ],
  //   ({expected}) => ` toEventually have any ${expected.name}`
  // ),
  // toEventuallyContainAttribute: elementMatcherFunction<Workflo.IAttributeArgs>(
  //   ({element, expected}) => [
  //     element.eventually.containsAttribute(expected.name, expected.value),
  //     element.eventually.not.containsAttribute(expected.name, expected.value),
  //   ],
  //   ({actual, expected}) => createLongErrorMessage(expected.name, 'contain', actual, expected.value)
  // ),
  // toEventuallyHaveClass: elementMatcherFunction(
  //   ({element, expected}) => [element.eventually.hasClass(expected), element.eventually.not.hasClass(expected)],
  //   ({actual, expected}) => createLongErrorMessage('class', 'be', actual, expected)
  // ),
  // toEventuallyContainClass: elementMatcherFunction(
  //   ({element, expected}) => [element.eventually.containsClass(expected), element.eventually.not.containsClass(expected)],
  //   ({actual, expected}) => createLongErrorMessage('class', 'contain', actual, expected)
  // ),
  // toEventuallyHaveId: elementMatcherFunction(
  //   ({element, expected}) => [element.eventually.hasId(expected), element.eventually.not.hasId(expected)],
  //   ({actual, expected}) => createLongErrorMessage('id', 'be', actual, expected)
  // ),
  // toEventuallyHaveAnyId: elementMatcherFunction(
  //   ({element}) => [element.eventually.hasAnyId(), element.eventually.not.hasAnyId()],
  //   () => ` toEventually have any id`
  // ),
  // toEventuallyContainId: elementMatcherFunction(
  //   ({element, expected}) => [element.eventually.containsId(expected), element.eventually.not.containsId(expected)],
  //   ({actual, expected}) => createLongErrorMessage('id', 'contain', actual, expected)
  // ),
  // toEventuallyHaveName: elementMatcherFunction(
  //   ({element, expected}) => [element.eventually.hasName(expected), element.eventually.not.hasName(expected)],
  //   ({actual, expected}) => createLongErrorMessage('name', 'be', actual, expected)
  // ),
  // toEventuallyHaveAnyName: elementMatcherFunction(
  //   ({element}) => [element.eventually.hasAnyName(), element.eventually.not.hasAnyName()],
  //   () => ` toEventually have any name`
  // ),
  // toEventuallyContainName: elementMatcherFunction(
  //   ({element, expected}) => [element.eventually.containsName(expected), element.eventually.not.containsName(expected)],
  //   ({actual, expected}) => createLongErrorMessage('name', 'contain', actual, expected)
  // ),
  // toEventuallyHaveLocation: elementMatcherFunction<Partial<Workflo.ICoordinates>, {tolerances?: Partial<Workflo.ICoordinates>}>(
  //   ({element, expected, opts}) => [element.eventually.hasLocation(expected, opts.tolerances), element.eventually.not.hasLocation(expected, opts.tolerances)],
  //   ({actual, expected, opts}) => createLongErrorMessage(
  //     'location',
  //     (opts.tolerances && (opts.tolerances.x > 0 || opts.tolerances.y > 0)) ? 'be within' : 'be',
  //     tolerancesObjectToString(actual),
  //     tolerancesObjectToString(expected)
  //   )
  // ),
  // toEventuallyHaveX: elementMatcherFunction<number, {tolerance?: number}>(
  //   ({element, expected, opts}) => [element.eventually.hasX(expected, opts.tolerance), element.eventually.not.hasX(expected, opts.tolerance)],
  //   ({actual, expected, opts}) => createLongErrorMessage(
  //     'x',
  //     (opts.tolerance && opts.tolerance > 0) ? 'be within' : 'be',
  //     tolerancesObjectToString(actual),
  //     tolerancesObjectToString(expected)
  //   )
  // ),
  // toEventuallyHaveY: elementMatcherFunction<number, {tolerance?: number}>(
  //   ({element, expected, opts}) => [element.eventually.hasY(expected, opts.tolerance), element.eventually.not.hasY(expected, opts.tolerance)],
  //   ({actual, expected, opts}) => createLongErrorMessage(
  //     'y',
  //     (opts.tolerance && opts.tolerance > 0) ? 'be within' : 'be',
  //     tolerancesObjectToString(actual),
  //     tolerancesObjectToString(expected)
  //   )
  // ),
  // toEventuallyHaveSize: elementMatcherFunction<Partial<Workflo.ISize>, {tolerances?: Partial<Workflo.ISize>}>(
  //   ({element, expected, opts}) => [element.eventually.hasSize(expected, opts.tolerances), element.eventually.not.hasSize(expected, opts.tolerances)],
  //   ({actual, expected, opts}) => createLongErrorMessage(
  //     'size',
  //     (opts.tolerances && (opts.tolerances.width > 0 || opts.tolerances.height > 0)) ? 'be within' : 'be',
  //     tolerancesObjectToString(actual),
  //     tolerancesObjectToString(expected)
  //   )
  // ),
  // toEventuallyHaveWidth: elementMatcherFunction<number, {tolerance?: number}>(
  //   ({element, expected, opts}) => [element.eventually.hasWidth(expected, opts.tolerance), element.eventually.not.hasWidth(expected, opts.tolerance)],
  //   ({actual, expected, opts}) => createLongErrorMessage(
  //     'width',
  //     (opts.tolerance && opts.tolerance > 0) ? 'be within' : 'be',
  //     tolerancesObjectToString(actual),
  //     tolerancesObjectToString(expected)
  //   )
  // ),
  // toEventuallyHaveHeight: elementMatcherFunction<number, {tolerance?: number}>(
  //   ({element, expected, opts}) => [element.eventually.hasHeight(expected, opts.tolerance), element.eventually.not.hasHeight(expected, opts.tolerance)],
  //   ({actual, expected, opts}) => createLongErrorMessage(
  //     'height',
  //     (opts.tolerance && opts.tolerance > 0) ? 'be within' : 'be',
  //     tolerancesObjectToString(actual),
  //     tolerancesObjectToString(expected)
  //   )
  // )
};

export function expectElement<
  S extends stores.PageElementStore,
  E extends elements.PageElement<S>
>(element: E) {
  return expect(element)
}