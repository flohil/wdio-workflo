import { elements, stores } from './page_objects'
import * as _ from 'lodash'

interface ResultFuncArgs<ExpectedType> {
  element: elements.PageElement<stores.PageElementStore>;
  expected?: ExpectedType;
  timeout?: number;
}

interface ErrorFuncArgs<ExpectedType> {
  actual: string;
  expected?: ExpectedType;
  timeout?: number
}

type ResultFunction<ExpectedType> = (args: ResultFuncArgs<ExpectedType>) => boolean[]
type ErrorTextFunction<ExpectedType> = (args: ErrorFuncArgs<ExpectedType>) => string | string[]

function elementMatcherFunction<ExpectedType = string>(
  resultFunction: ResultFunction<ExpectedType>,
  errorTextFunction: ErrorTextFunction<ExpectedType>
) {
  return (util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>) => {

    function baseCompareFunction(
      element: elements.PageElement<stores.PageElementStore>,
      expected: ExpectedType,
      negativeComparison: boolean,
      timeout?: number
    ): jasmine.CustomMatcherResult {
      let result: jasmine.CustomMatcherResult = {
        pass: true,
        message: ''
      };

      let negateAssertionResult = false
      let defaultNegativeMessage = ''

      const successes: boolean[] = resultFunction({element, expected, timeout})
      const success = (negativeComparison) ? successes[1] : successes[0]

      if (!success) {
        if (typeof timeout === 'undefined') {
          timeout = element.getTimeout()
        }

        const actual = element.lastActualResult
        const errorTexts = errorTextFunction({actual, expected, timeout})
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
      compare: (element: elements.PageElement<stores.PageElementStore>, expected: ExpectedType, timeout?: number): jasmine.CustomMatcherResult => {
        return baseCompareFunction(element, expected, false, timeout);
      },
      negativeCompare: (element: elements.PageElement<stores.PageElementStore>, expected: ExpectedType, timeout?: number): jasmine.CustomMatcherResult => {
        return baseCompareFunction(element, expected, true, timeout);
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
    () => " to be selected"
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

  toHaveClass: elementMatcherFunction(
    ({element, expected}) => [element.currently.hasClass(expected), element.currently.not.hasClass(expected)],
    ({actual, expected}) => createLongErrorMessage('class', 'be', actual, expected)
  ),
  toContainClass: elementMatcherFunction(
    ({element, expected}) => [element.currently.containsClass(expected), element.currently.not.containsClass(expected)],
    ({actual, expected}) => createLongErrorMessage('class', 'contain', actual, expected)
  ),

  // toHaveText: elementMatcherFunction<string, string>(
  //   ({element}) => element.getText(),
  //   (actual, expected) => (typeof expected !== 'undefined') ? actual === expected : actual.length > 0,
  //   ({actual, expected}) => (typeof expected !== 'undefined')
  //   ? `'s text "${actual}" to be "${expected}"` : ' to have any text',
  // ),


  // toContainText: elementMatcherFunction<string, string>(
  //   ({element}) => element.getText(),
  //   (actual, expected) => (typeof expected !== 'undefined') ? actual.indexOf(expected) > -1 : actual.length > 0,
  //   ({actual, expected}) => (typeof expected !== 'undefined')
  //   ? `'s text "${actual}" to contain "${expected}"` : ' to contain any text',
  // ),
  // toHaveValue: elementMatcherFunction<string, string>(
  //   ({element}) => element.getValue(),
  //   (actual, expected: string) => (typeof expected !== 'undefined') ? actual === expected : actual.length > 0,
  //   ({actual, expected}) => (typeof expected !== 'undefined')
  //   ? `'s value "${actual}" to be "${expected}"` : ' to have any value',
  // ),


  // toContainValue: elementMatcherFunction<string, string>(
  //   ({element}) => element.getValue(),
  //   (actual, expected) => actual.indexOf(expected) >= 0,
  //   ({actual, expected}) => `'s value "${actual}" to contain "${expected}"`,
  // ),
  // toBeEnabled: elementMatcherFunction(
  //   ({element}) => element.isEnabled(),
  //   actual => actual === true,
  //   () => " to be enabled"
  // ),
  // toBeSelected: elementMatcherFunction(
  //   ({element}) => element.isSelected(),
  //   actual => actual === true,
  //   () => " to be selected"
  // ),


  // toEventuallyExist: elementMatcherFunction(
  //   ({element, timeout}) => element.eventuallyExists({timeout}),
  //   actual => actual === true,
  //   ({timeout}) => ` to eventually exist within ${(timeout)}ms`
  // ),
  // toEventuallyNotExist: elementMatcherFunction(
  //   ({element, timeout}) => element.eventuallyNotExists({timeout}),
  //   actual => actual === true,
  //   ({timeout}) => ` to eventually not exist within ${(timeout)}ms`
  // ),
  // toEventuallyBeVisible: elementMatcherFunction(
  //   ({element, timeout}) => element.eventuallyIsVisible({timeout}),
  //   actual => actual === true,
  //   ({timeout}) => ` to eventually be visible within ${(timeout)}ms`
  // ),
  // toEventuallyBeHidden: elementMatcherFunction(
  //   ({element, timeout}) => element.eventuallyIsHidden({timeout}),
  //   actual => actual === false,
  //   ({timeout}) => ` to eventually be hidden within ${(timeout)}ms`
  // ),
  // toEventuallyBeEnabled: elementMatcherFunction(
  //   ({element, timeout}) => element.eventuallyIsEnabled({timeout}),
  //   actual => actual === true,
  //   ({timeout}) => ` to eventually be enabled within ${(timeout)}ms`
  // ),
  // // TODO
  // toEventuallyBeDisabled: elementMatcherFunction(
  //   ({element, timeout}) => element.isEnabled(),
  //   actual => actual === false,
  //   ({timeout}) => ` to eventually be disabled within ${(timeout)}ms`
  // ),
  // toEventuallyBeSelected: elementMatcherFunction(
  //   ({element, timeout}) => element.eventuallyIsSelected({timeout}),
  //   actual => actual === true,
  //   ({timeout}) => ` to eventually be selected within ${(timeout)}ms`
  // ),
  // toEventuallyHaveText: elementMatcherFunction<string, string>(
  //   ({element, timeout, expected}) => element.eventuallyHasText({text: expected, timeout}),
  //   (actual, expected: string) => (typeof expected !== 'undefined') ? actual === expected : actual.length > 0,
  //   (actual, expected: string) => (typeof expected !== 'undefined')
  //   ? `'s text "${actual}" to be "${expected}"` : ' to have any text',
  // ),
  // toEventuallyContainText: elementMatcherFunction(
  //   (element, timeout) => element.getText(),
  //   (actual, expected: string) => (typeof expected !== 'undefined') ? actual.indexOf(expected) > -1 : actual.length > 0,
  //   (actual, expected: string) => (typeof expected !== 'undefined')
  //   ? `'s text "${actual}" to contain "${expected}"` : ' to contain any text',
  // ),
  // toEventuallyHaveValue: elementMatcherFunction(
  //   (element, timeout) => element.getValue(),
  //   (actual, expected: string) => (typeof expected !== 'undefined') ? actual === expected : actual.length > 0,
  //   (actual, expected: string) => (typeof expected !== 'undefined')
  //   ? `'s value "${actual}" to be "${expected}"` : ' to have any value',
  // ),
  // toEventuallyContainValue: elementMatcherFunction(
  //   (element, timeout) => element.getValue(),
  //   (actual, expected: string) => (typeof expected !== 'undefined') ? actual.indexOf(expected) > -1 : actual.length > 0,
  //   (actual, expected: string) => (typeof expected !== 'undefined')
  //   ? `'s value "${actual}" to contain "${expected}"` : 'to contain any value',
  // )
};

export function expectElement<
  S extends stores.PageElementStore,
  E extends elements.PageElement<S>
>(element: E) {
  return expect(element)
}