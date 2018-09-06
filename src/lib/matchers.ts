import { elements, stores } from './page_objects'

function elementMatcherFunction<ExpectedType, ActualType>(
  resultFunction: (element: elements.PageElement<stores.PageElementStore>, expected: ExpectedType) => ActualType,
  assertionFunction: (actual: ActualType, expected: ExpectedType) => boolean,
  errorTextFunction: (actual: ActualType, expected: ExpectedType) => string ) {
  return (util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>) => {
    return {
      compare: (element: elements.PageElement<stores.PageElementStore>, expected: ExpectedType): jasmine.CustomMatcherResult => {
        let result: jasmine.CustomMatcherResult = {
          pass: true,
          message: ''
        };

        const actual: ActualType = resultFunction(element, expected)

        if (!assertionFunction(actual, expected)) {
          result.pass = false;
          result.message = `${element.constructor.name} ${errorTextFunction(actual, expected)}\n(${element.getSelector()})`;
        }

        return result;
      }
    }
  }
}

export const elementMatchers: jasmine.CustomMatcherFactories = {
  toExist: elementMatcherFunction(
    element => element.exists(),
    actual => actual === true,
    () => "does not exist"
  ),
  toBeVisible: elementMatcherFunction(
    element => element.isVisible(),
    actual => actual === true,
    () => "is not visible"
  ),
  toBeHidden: elementMatcherFunction(
    element => element.isVisible(),
    actual => actual === false,
    () => "is not hidden"
  ),
  toHaveText: elementMatcherFunction(
    (element) => element.getText(),
    (actual, expected: string) => (typeof expected !== 'undefined') ? actual === expected : actual.length > 0,
    (actual, expected: string) => (typeof expected !== 'undefined')
    ? `expected its text to be "${expected}" but has text "${actual}"` : 'was expected to have any text but has no text',
  ),
  toContainText: elementMatcherFunction(
    (element) => element.getText(),
    (actual, expected: string) => (typeof expected !== 'undefined') ? actual.indexOf(expected) > -1 : actual.length > 0,
    (actual, expected: string) => (typeof expected !== 'undefined')
    ? `has text "${actual}" but expected text to be "${expected}"` : 'has no text',
  ),
  toHaveValue: elementMatcherFunction(
    (element) => element.initialWait()._element.getValue(),
    (actual, expected: string) => (typeof expected !== 'undefined') ? actual === expected : actual.length > 0,
    (actual, expected: string) => (typeof expected !== 'undefined')
    ? `expected its value to be "${expected}" but has value "${actual}"` : 'was expected to have any text but has no text',
  ),
};

export function expectElement<
  S extends stores.PageElementStore,
  E extends elements.PageElement<S>
>(element: E) {
  return expect(element)
}