import { pageObjects as core, helpers } from 'wdio-workflo'

import { PageNodeStore } from '../stores'
import {
  PageElement,
  PageElementCurrently,
  PageElementEventually,
  PageElementWait,
  IPageElementOpts
} from '../page_elements'

/**
 * This interface can be used to extend wdio-workflo's IValuePageElementOpts interface.
 * It is supposed to serve as the base IValuePageElementOpts interface throughout your project.
 *
 * IValuePageElementOpts the opts parameter passed to the constructor function of ValuePageElement.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 */
export interface IValuePageElementOpts<
  Store extends PageNodeStore
> extends core.elements.IValuePageElementOpts<Store>, IPageElementOpts<Store> {}

/**
 * This class can be used to extend or customize the functionality provided by wdio-workflo's ValuePageElement class.
 * It is supposed to serve as the base ValuePageElement class throughout your project.
 *
 * ValuePageElement extends PageElement with the possibility to set, retrieve and check a PageElement's value.
 *
 * It also adds another initial waiting condition:
 *
 * - 'value' to wait for an element to have any value
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template ValueType the type of PageElement's value
 */
export abstract class ValuePageElement<
  Store extends PageNodeStore,
  ValueType
> extends PageElement<Store>
implements core.elements.ValuePageElement<Store, ValueType> {

  readonly abstract currently: ValuePageElementCurrently<Store, this, ValueType>
  readonly wait: ValuePageElementWait<Store, this, ValueType>
  readonly eventually: ValuePageElementEventually<Store, this, ValueType>

  constructor(selector: string, opts?: IValuePageElementOpts<Store>) {
    super(selector, opts)

    this.wait = new ValuePageElementWait(this)
    this.eventually = new ValuePageElementEventually(this)
  }

  // declarations of core.elements.ValuePageElement functions required for typescript mixin
  abstract setValue(value: ValueType): this;
  getValue: () => ValueType;
  getHasValue: (value: ValueType) => boolean;
  getHasAnyValue: () => boolean;
  getContainsValue: (value: ValueType) => boolean;
}

/**
 * This class can be used to extend or customize the functionality provided by wdio-workflo's ValuePageElementCurrently 
 * class. It is supposed to serve as the base ValuePageElementCurrently class throughout your project.
 *
 * ValuePageElementCurrently defines all `currently` functions of ValuePageElement.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement for which ValuePageElementCurrently defines all `currently`
 * functions
 * @template ValueType the type of ValuePageElement's value
 */
export abstract class ValuePageElementCurrently<
  Store extends PageNodeStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends PageElementCurrently<Store, PageElementType>
implements core.elements.ValuePageElementCurrently<Store, PageElementType, ValueType> {
  // declarations of core.elements.ValuePageElement functions required for typescript mixin
  abstract getValue(): ValueType
  getHasValue: (value: ValueType) => boolean
  getHasAnyValue: () => boolean
  getContainsValue: (value: ValueType) => boolean
  hasValue: (value: ValueType) => boolean
  hasAnyValue: () => boolean
  containsValue: (value: ValueType) => boolean

  readonly not: core.elements.ValuePageElementCurrently<Store, PageElementType, ValueType>['not'] &
    PageElementCurrently<Store, PageElementType>['not']
}

/**
 * This class can be used to extend or customize the functionality provided by wdio-workflo's ValuePageElementWait 
 * class. It is supposed to serve as the base ValuePageElementWait class throughout your project.
 *
 * ValuePageElementWait defines all `wait` functions of ValuePageElement.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement for which ValuePageElementWait defines all `wait`
 * functions
 * @template ValueType the type of ValuePageElement's value
 */
export class ValuePageElementWait<
  Store extends PageNodeStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends PageElementWait<Store, PageElementType>
implements core.elements.ValuePageElementWait<Store, PageElementType, ValueType> {
  // declarations of core.elements.ValuePageElement functions required for typescript mixin
  hasValue: (value: ValueType, opts?: Workflo.ITimeoutReverseInterval) => PageElementType
  hasAnyValue: (opts?: Workflo.ITimeoutReverseInterval) => PageElementType
  containsValue: (value: ValueType, opts?: Workflo.ITimeoutReverseInterval) => PageElementType

  readonly not: core.elements.ValuePageElementWait<Store, PageElementType, ValueType>['not'] &
    PageElementWait<Store, PageElementType>['not']
}

/**
 * This class can be used to extend or customize the functionality provided by wdio-workflo's ValuePageElementEventually
 * class. It is supposed to serve as the base ValuePageElementEventually class throughout your project.
 *
 * ValuePageElementEventually defines all `eventually` functions of ValuePageElement.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement for which ValuePageElementEventually defines all `eventually`
 * functions
 * @template ValueType the type of ValuePageElement's value
 */
export class ValuePageElementEventually<
  Store extends PageNodeStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends PageElementEventually<Store, PageElementType>
implements core.elements.ValuePageElementEventually<Store, PageElementType, ValueType> {
  // declarations of core.elements.ValuePageElement functions required for typescript mixin
  hasValue: (value: ValueType, opts?: Workflo.ITimeoutInterval) => boolean
  hasAnyValue: (opts?: Workflo.ITimeoutInterval) => boolean
  containsValue: (value: ValueType, opts?: Workflo.ITimeoutInterval) => boolean

  readonly not: core.elements.ValuePageElementEventually<Store, PageElementType, ValueType>['not'] &
    PageElementEventually<Store, PageElementType>['not']
}

// mixin functionalities of core.elements.ValuePageElement class -> https://www.typescriptlang.org/docs/handbook/mixins.html

helpers.applyMixins(ValuePageElement, [core.elements.ValuePageElement], ['not']);
helpers.applyMixins(ValuePageElementCurrently, [core.elements.ValuePageElementCurrently], ['not']);
helpers.applyMixins(ValuePageElementWait, [core.elements.ValuePageElementWait], ['not']);
helpers.applyMixins(ValuePageElementEventually, [core.elements.ValuePageElementEventually], ['not']);