/// <reference types="jasmine" />
/// <reference types="jasmine-expect" />
import { elements, stores } from './page_objects';
export declare const elementMatchers: jasmine.CustomMatcherFactories;
export declare function expectElement<S extends stores.PageElementStore, E extends elements.PageElement<S>>(element: E): jasmine.Matchers<E>;
