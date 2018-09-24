import { elements, stores } from './page_objects'

interface ResultFuncArgs<ExpectedType> {
  element: elements.PageElement<stores.PageElementStore>;
  expected?: ExpectedType;
  timeout?: number;
}

interface ErrorFuncArgs<ExpectedType, ActualType> {
  actual: ActualType | boolean;
  expected?: ExpectedType;
  timeout?: number
}

function elementMatcherFunction<ExpectedType, ActualType>(
  resultFunction: (args: ResultFuncArgs<ExpectedType>) => ActualType | boolean,
  assertionFunction: (actual: ActualType, expected: ExpectedType) => boolean,
  errorTextFunction: (args: ErrorFuncArgs<ExpectedType, ActualType>) => string ) {
  return (util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>) => {
    return {
      compare: (element: elements.PageElement<stores.PageElementStore>, expected: ExpectedType, timeout?: number): jasmine.CustomMatcherResult => {
        let result: jasmine.CustomMatcherResult = {
          pass: true,
          message: ''
        };

        const actual: ActualType | boolean = resultFunction({element, expected, timeout})
        const success: boolean = ( typeof actual === 'boolean'  ) ? actual : assertionFunction(actual, expected)

        if (!success) {
          if (typeof timeout === 'undefined') {
            timeout = element.getTimeout()
          }

          result.pass = false;
          result.message = `Expected ${element.constructor.name}${errorTextFunction({actual, expected, timeout})}.\n( ${element.getSelector()} )`;
        }

        return result;
      }
    }
  }
}

export const elementMatchers: jasmine.CustomMatcherFactories = {
  toExist: elementMatcherFunction(
    ({element}) => element.exists(),
    actual => actual === true,
    () => " to exist"
  ),
  toBeVisible: elementMatcherFunction(
    ({element}) => element.isVisible(),
    actual => actual === true,
    () => " to be visible"
  ),
  toBeHidden: elementMatcherFunction(
    ({element}) => element.isVisible(),
    actual => actual === false,
    () => " to be hidden"
  ),
  toBeEnabled: elementMatcherFunction(
    ({element}) => element.isEnabled(),
    actual => actual === true,
    () => " to be enabled"
  ),
  toBeDisabled: elementMatcherFunction(
    ({element}) => element.isEnabled(),
    actual => actual === false,
    () => " to be disabled"
  ),
  toBeSelected: elementMatcherFunction(
    ({element}) => element.isSelected(),
    actual => actual === true,
    () => " to be selected"
  ),
  toHaveText: elementMatcherFunction<string, string>(
    ({element}) => element.getText(),
    (actual, expected) => (typeof expected !== 'undefined') ? actual === expected : actual.length > 0,
    ({actual, expected}) => (typeof expected !== 'undefined')
    ? `'s text "${actual}" to be "${expected}"` : ' to have any text',
  ),
  toContainText: elementMatcherFunction<string, string>(
    ({element}) => element.getText(),
    (actual, expected) => (typeof expected !== 'undefined') ? actual.indexOf(expected) > -1 : actual.length > 0,
    ({actual, expected}) => (typeof expected !== 'undefined')
    ? `'s text "${actual}" to contain "${expected}"` : ' to contain any text',
  ),
  toHaveValue: elementMatcherFunction<string, string>(
    ({element}) => element.getValue(),
    (actual, expected: string) => (typeof expected !== 'undefined') ? actual === expected : actual.length > 0,
    ({actual, expected}) => (typeof expected !== 'undefined')
    ? `'s value "${actual}" to be "${expected}"` : ' to have any value',
  ),
  toContainValue: elementMatcherFunction<string, string>(
    ({element}) => element.getValue(),
    (actual, expected: string) => (typeof expected !== 'undefined') ? actual.indexOf(expected) > -1 : actual.length > 0,
    ({actual, expected}) => (typeof expected !== 'undefined')
    ? `'s value "${actual}" to contain "${expected}"` : 'to contain any value',
  ),
  toEventuallyExist: elementMatcherFunction(
    ({element, timeout}) => element.eventuallyExists({timeout}),
    actual => actual === true,
    ({timeout}) => ` to eventually exist within ${(timeout)}ms`
  ),
  toEventuallyNotExist: elementMatcherFunction(
    ({element, timeout}) => element.eventuallyNotExists({timeout}),
    actual => actual === true,
    ({timeout}) => ` to eventually not exist within ${(timeout)}ms`
  ),
  toEventuallyBeVisible: elementMatcherFunction(
    ({element, timeout}) => element.eventuallyIsVisible({timeout}),
    actual => actual === true,
    ({timeout}) => ` to eventually be visible within ${(timeout)}ms`
  ),
  toEventuallyBeHidden: elementMatcherFunction(
    ({element, timeout}) => element.eventuallyIsHidden({timeout}),
    actual => actual === false,
    ({timeout}) => ` to eventually be hidden within ${(timeout)}ms`
  ),
  toEventuallyBeEnabled: elementMatcherFunction(
    ({element, timeout}) => element.eventuallyIsEnabled({timeout}),
    actual => actual === true,
    ({timeout}) => ` to eventually be enabled within ${(timeout)}ms`
  ),
  // TODO
  toEventuallyBeDisabled: elementMatcherFunction(
    ({element, timeout}) => element.isEnabled(),
    actual => actual === false,
    ({timeout}) => ` to eventually be disabled within ${(timeout)}ms`
  ),
  toEventuallyBeSelected: elementMatcherFunction(
    ({element, timeout}) => element.eventuallyIsSelected({timeout}),
    actual => actual === true,
    ({timeout}) => ` to eventually be selected within ${(timeout)}ms`
  ),
  toEventuallyHaveText: elementMatcherFunction<string, string>(
    ({element, timeout, expected}) => element.eventuallyHasText({text: expected, timeout}),
    (actual, expected: string) => (typeof expected !== 'undefined') ? actual === expected : actual.length > 0,
    (actual, expected: string) => (typeof expected !== 'undefined')
    ? `'s text "${actual}" to be "${expected}"` : ' to have any text',
  ),
  toEventuallyContainText: elementMatcherFunction(
    (element, timeout) => element.getText(),
    (actual, expected: string) => (typeof expected !== 'undefined') ? actual.indexOf(expected) > -1 : actual.length > 0,
    (actual, expected: string) => (typeof expected !== 'undefined')
    ? `'s text "${actual}" to contain "${expected}"` : ' to contain any text',
  ),
  toEventuallyHaveValue: elementMatcherFunction(
    (element, timeout) => element.getValue(),
    (actual, expected: string) => (typeof expected !== 'undefined') ? actual === expected : actual.length > 0,
    (actual, expected: string) => (typeof expected !== 'undefined')
    ? `'s value "${actual}" to be "${expected}"` : ' to have any value',
  ),
  toEventuallyContainValue: elementMatcherFunction(
    (element, timeout) => element.getValue(),
    (actual, expected: string) => (typeof expected !== 'undefined') ? actual.indexOf(expected) > -1 : actual.length > 0,
    (actual, expected: string) => (typeof expected !== 'undefined')
    ? `'s value "${actual}" to contain "${expected}"` : 'to contain any value',
  )
};

export function expectElement<
  S extends stores.PageElementStore,
  E extends elements.PageElement<S>
>(element: E) {
  return expect(element)
}