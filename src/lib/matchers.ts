import { elements, stores } from './page_objects'

function elementMatcherFunction(assertionFunction: (element: elements.PageElement<stores.PageElementStore>) => boolean, errorText: string, ) {
  return (util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>) => {
    return {
      compare: (element: elements.PageElement<stores.PageElementStore>): jasmine.CustomMatcherResult => {
        let result: jasmine.CustomMatcherResult = {
          pass: true,
          message: ''
        };

        if (!assertionFunction(element)) {
          result.pass = false;
          result.message = `${element.constructor.name} ${errorText}: ${element.getSelector()}`;
        }

        return result;
      }
    }
  }
}

export const elementMatchers: jasmine.CustomMatcherFactories = {
  toExist: elementMatcherFunction( element => element.exists(), "does not exist" )
};

export function expectElement<
  S extends stores.PageElementStore,
  E extends elements.PageElement<S>
>(element: E) {
  return expect(element)
}