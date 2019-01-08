import { PageElementList, ValuePageElement, IValuePageElementOpts, IPageElementListOpts, PageElementListCurrently, PageElementListEventually, PageElementListWait } from './'
import { PageElementStore } from '../stores'
import _ = require('lodash');

/**
 * Describes the opts parameter passed to the constructor function of ValuePageElementList.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementList
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the ValuePageElements
 * managed by ValuePageElementList
 * @template ValueType type of the value of the ValuePageElements managed by ValuePageElementList
 */
export interface IValuePageElementListOpts<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ValueType
> extends IPageElementListOpts<Store, PageElementType, PageElementOptions> {}

/**
 * ValuePageElementList extends PageElementList with the possibility to set, retrieve and check the values of
 * ValuePageElements managed by ValuePageElementList.
 *
 * It also adds another initial waiting condition:
 *
 * - 'value' to wait for at least one of ValuePageElementList's managed elements to have any value
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementList
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the ValuePageElements
 * managed by ValuePageElementList
 * @template ValueType type of the value of the ValuePageElements managed by ValuePageElementList
 */
export class ValuePageElementList<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ValueType
> extends PageElementList<Store, PageElementType, PageElementOptions>
implements Workflo.PageNode.IValueElementNode<ValueType[], boolean[], ValueType[] | ValueType> {

  readonly currently: ValuePageElementListCurrently<Store, PageElementType, PageElementOptions, this, ValueType>
  readonly wait: ValuePageElementListWait<Store, PageElementType, PageElementOptions, this, ValueType>
  readonly eventually: ValuePageElementListEventually<Store, PageElementType, PageElementOptions, this, ValueType>

  /**
   * ValuePageElementList extends PageElementList with the possibility to set, retrieve and check the values of
   * ValuePageElements managed by ValuePageElementList.
   *
   * It also adds another initial waiting condition:
   *
   * - 'value' to wait for at least one of ValuePageElementList's managed elements to have any value
   *
   * @param selector an XPath expression which identifies all ValuePageElements managed by ValuePageElementList
   * @param opts the options used to configure ValuePageElementList
   */
  constructor(
    selector: string,
    opts: IValuePageElementListOpts<Store, PageElementType, PageElementOptions, ValueType>
  ) {
    super(selector, opts)

    this.currently = new ValuePageElementListCurrently(this, opts)
    this.wait = new ValuePageElementListWait(this)
    this.eventually = new ValuePageElementListEventually(this)
  }

  /**
   * This function performs ValuePageElementList's initial waiting condition.
   *
   * It supports the following waiting types:
   *
   * - 'exist' to wait for at least one of ValuePageElementList's managed elements to exist in the DOM
   * - 'visible' to wait for at least one of ValuePageElementList's managed elements to become visible in the viewport
   * (not obscured by other elements, not set to 'hidden', not outside of the viewport...)
   * - 'text' to wait for at least one of ValuePageElementList's managed elements to have any text
   * - 'value' to wait for at least one of ValuePageElementList's managed elements to have any value
   *
   * @returns this (an instance of ValuePageElementList)
   */
  initialWait() {
    if (this._waitType === Workflo.WaitType.value) {
      this.wait.any.hasAnyValue()
    } else {
      super.initialWait()
    }
  }

// GETTER FUNCTIONS

  /**
   * Returns the values of all ValuePageElements managed by ValuePageElementList as an array after performing the 
   * initial waiting condition of ValuePageElementList and each managed ValuePageElement.
   *
   * @param filterMask can be used to skip the invocation of the `getValue` function for some or all managed
   * ValuePageElements. The results of skipped function invocations are not included in the total results array.
   */
  getValue(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this.eachGet(this.all, element => element.getValue(), filterMask)
  }

  /**
   * Returns the 'hasValue' status of all ValuePageElements managed by ValuePageElementList as an array after performing 
   * the initial waiting condition of ValuePageElementList and each managed ValuePageElement.
   *
   * A ValuePageElement's 'hasValue' status is set to true if its actual value equals the expected value.
   *
   * @param value the expected value used in the comparisons which set the 'hasValue' status
   *
   * If `value` is a single value, this value is compared to each element in the array of actual values of all
   * ValuePageElements.
   * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of its
   * array elements are compared to the array of actual values of all ValuePageElements.
   */
  getHasValue(value: ValueType | ValueType[]) {
    return this.eachCompare(
      this.all, (element, expected) => element.currently.hasValue(expected), value
    )
  }

  /**
   * Returns the 'hasAnyValue' status of all ValuePageElements managed by ValuePageElementList as an array after 
   * performing the initial waiting condition of ValuePageElementList and each managed ValuePageElement.
   *
   * A ValuePageElement's 'hasAnyValue' status is set to true if the ValuePageElement has any value.
   *
   * @param filterMask can be used to skip the invocation of the `getHasAnyValue` function for some or all managed
   * ValuePageElements. The results of skipped function invocations are not included in the total results array.
   */
  getHasAnyValue(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this.eachCompare(this.all, (element) => element.currently.hasAnyValue(), filterMask, true)
  }

  /**
   * Returns the 'containsValue' status of all ValuePageElements managed by ValuePageElementList as an array after 
   * performing the initial waiting condition of ValuePageElementList and each managed ValuePageElement.
   *
   * A ValuePageElement's 'containsValue' status is set to true if its actual value contains the expected value.
   *
   * @param value the expected value used in the comparisons which set the 'containsValue' status.
   *
   * If `value` is a single value, this value is compared to each element in the array of actual values of all
   * ValuePageElements.
   * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of its
   * array elements are compared to the array of actual values of all ValuePageElements.
   */
  getContainsValue(value: ValueType | ValueType[]) {
    return this.eachCompare(
      this.all, (element, expected) => element.currently.containsValue(expected), value
    )
  }

// SETTER FUNCTIONS

  /**
   * This function sets the passed value(s) to all ValuePageElements managed by ValuePageElementList
   * after performing the initial waiting condition of ValuePageElementList and each managed ValuePageElement.
   *
   * If values is an array, the number of list elements must match the number of passed values.
   * The values will be assigned in the order that the list elements were retrieved from the DOM.
   *
   * @param values a single value or an array of values
   *
   * If `values` is a single value, all managed ValuePageElements are set to this value.
   * If `values` is an array of values, its length must match the length of ValuePageElementList and the managed
   * ValuePageElements are set to the values of the `values` array in the order that the ValuePageElements were
   * retrieved from the DOM.
   *
   * @returns this (an instance of PageElementList)
   */
  setValue(values: ValueType[] | ValueType) {
    return this.eachSet<ValueType>(
      this.all, (element, value) => element.setValue(value), values
    )
  }
}

/**
 * This class defines all `currently` functions of ValuePageElementList.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementList
 * @template PageElementOpts type of the opts paramter passed to the constructor function of managed ValuePageElements
 * @template ListType type of the ValuePageElementList for which ValuePageElementListCurrently defines all `currently`
 * functions
 */
class ValuePageElementListCurrently<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>,
  ValueType
> extends PageElementListCurrently<Store, PageElementType, PageElementOptions, ListType> {

  /**
   * Returns the current values of all ValuePageElements managed by ValuePageElementList as an array.
   *
   * @param filterMask can be used to skip the invocation of the `getValue` function for some or all managed
   * ValuePageElements. The results of skipped function invocations are not included in the total results array.
   */
  getValue(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this._node.eachGet(this.all, element => element.currently.getValue(), filterMask)
  }

  /**
   * Returns the current 'hasValue' status of all ValuePageElements managed by ValuePageElementList as an array.
   *
   * A ValuePageElement's 'hasValue' status is set to true if its actual value equals the expected value.
   *
   * @param value the expected value used in the comparisons which set the 'hasValue' status
   *
   * If `value` is a single value, this value is compared to each element in the array of actual values of all
   * ValuePageElements.
   * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of its
   * array elements are compared to the array of actual values of all ValuePageElements.
   */
  getHasValue(value: ValueType | ValueType[]) {
    return this._node.eachCompare(
      this.all, (element, expected) => element.currently.hasValue(expected), value
    )
  }

  /**
   * Returns the current 'hasAnyValue' status of all ValuePageElements managed by ValuePageElementList as an array.
   *
   * A ValuePageElement's 'hasAnyValue' status is set to true if the ValuePageElement has any value.
   *
   * @param filterMask can be used to skip the invocation of the `getHasAnyValue` function for some or all managed
   * ValuePageElements. The results of skipped function invocations are not included in the total results array.
   */
  getHasAnyValue(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this._node.eachCompare(this.all, (element) => element.currently.hasAnyValue(), filterMask, true)
  }

  /**
   * Returns the current 'containsValue' status of all ValuePageElements managed by ValuePageElementList as an array.
   *
   * A ValuePageElement's 'containsValue' status is set to true if its actual value contains the expected value.
   *
   * @param value the expected value used in the comparisons which set the 'containsValue' status
   *
   * If `value` is a single value, this value is compared to each element in the array of actual values of all
   * ValuePageElements.
   * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of its
   * array elements are compared to the array of actual values of all ValuePageElements.
   */
  getContainsValue(value: ValueType | ValueType[]) {
    return this._node.eachCompare(
      this.all, (element, expected) => element.currently.containsValue(expected), value
    )
  }

  // CHECK STATE

  /**
   * Returns true if the actual values of all ValuePageElements managed by ValuePageElementList currently equal the 
   * expected value(s).
   *
   * @param value the expected value(s) supposed to equal the actual values
   *
   * If `value` is a single value, this value is compared to each element in the array of actual values of all
   * ValuePageElements.
   * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of its
   * array elements are compared to the array of actual values of all ValuePageElements.
   */
  hasValue(value: ValueType | ValueType[]) {
    return this._node.eachCheck(
      this.all, (element, expected) => element.currently.hasValue(expected), value
    )
  }

  /**
   * Returns true if all ValuePageElements managed by ValuePageElementList currently have any value.
   *
   * @param filterMask can be used to skip the invocation of the `hasAnyValue` function for some or all managed
   * ValuePageElements
   */
  hasAnyValue(filterMask?: Workflo.PageNode.ListFilterMask) {
    return this._node.eachCheck(this.all, (element) => element.currently.hasAnyValue(), filterMask, true)
  }

  /**
   * Returns true if the actual values of all ValuePageElements managed by ValuePageElementList currently contain the 
   * expected value(s).
   *
   * @param value the expected value(s) supposed to be contained in the actual values
   *
   * If `value` is a single value, this value is compared to each element in the array of actual values of all
   * ValuePageElements.
   * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of its
   * array elements are compared to the array of actual values of all ValuePageElements.
   */
  containsValue(value: ValueType | ValueType[]) {
    return this._node.eachCheck(
      this.all, (element, expected) => element.currently.containsValue(expected), value
    )
  }

  /**
   * returns the negated variants of ValuePageElementListCurrently's state check functions
   */
  get not() {
    return {...super.not,
      /**
       * Returns true if the actual values of all ValuePageElements managed by ValuePageElementList currently do not 
       * equal the expected value(s).
       *
       * @param value the expected value(s) supposed not to equal the actual values
       *
       * If `value` is a single value, this value is compared to each element in the array of actual values of all
       * ValuePageElements.
       * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of
       * its array elements are compared to the array of actual values of all ValuePageElements.
       */
      hasValue: (value: ValueType | ValueType[]) => {
        return this._node.eachCheck(
          this.all, (element, expected) => element.currently.not.hasValue(expected), value
        )
      },
      /**
       * Returns true if all ValuePageElements managed by ValuePageElementList currently do not have any value.
       *
       * @param filterMask can be used to skip the invocation of the `hasAnyValue` function for some or all managed
       * ValuePageElements
       */
      hasAnyValue: (filterMask?: Workflo.PageNode.ListFilterMask) => {
        return this._node.eachCheck(this.all, (element) => element.currently.not.hasAnyValue(), filterMask, true)
      },
      /**
       * Returns true if the actual values of all ValuePageElements managed by ValuePageElementList currently do not 
       * contain the expected value(s).
       *
       * @param value the expected value(s) supposed not to be contained in the actual values
       *
       * If `value` is a single value, this value is compared to each element in the array of actual values of all
       * ValuePageElements.
       * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of
       * its array elements are compared to the array of actual values of all ValuePageElements.
       */
      containsValue: (value: ValueType | ValueType[]) => {
        return this._node.eachCheck(
          this.all, (element, expected) => element.currently.not.containsValue(expected), value
        )
      }
    }
  }
}

/**
 * This class defines all `wait` functions of ValuePageElementList.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementList
 * @template PageElementOpts type of the opts paramter passed to the constructor function of managed ValuePageElements
 * @template ListType type of the ValuePageElementList for which ValuePageElementListWait defines all `wait`
 * functions
 */
class ValuePageElementListWait<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>,
  ValueType
> extends PageElementListWait<Store, PageElementType, PageElementOptions, ListType> {

  /**
   * Waits for the actual values of all ValuePageElements managed by ValuePageElementList to equal the expected value(s).
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * @param value the expected value(s) supposed to equal the actual values
   *
   * If `value` is a single value, this value is compared to each element in the array of actual values of all
   * ValuePageElements.
   * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of its
   * array elements are compared to the array of actual values of all ValuePageElements.
   * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
   * to check it
   *
   * If no `timeout` is specified, a ValuePageElement's default timeout is used.
   * If no `interval` is specified, a ValuePageElement's default interval is used.
   *
   * @returns this (an instance of ValuePageElementList)
   */
  hasValue(value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval) {
    return this._node.eachWait(
      this._node.all, (element, expected) => element.wait.hasValue(expected, opts), value
    )
  }

  /**
   * Waits for all ValuePageElements managed by ValuePageElementList to have any value.
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for some
   * or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the `interval`
   * used to check it
   *
   * If no `timeout` is specified, a ValuePageElement's default timeout is used.
   * If no `interval` is specified, a ValuePageElement's default interval is used.
   *
   * @returns this (an instance of ValuePageElementList)
   */
  hasAnyValue(opts: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait(
      this._node.all, (element) => element.wait.hasAnyValue(otherOpts), filterMask, true
    )
  }

  /**
   * Waits for the actual values of all ValuePageElements managed by ValuePageElementList to contain the expected
   * value(s).
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * @param value the expected value(s) supposed to be contained in the actual values
   *
   * If `value` is a single value, this value is compared to each element in the array of actual values of all
   * ValuePageElements.
   * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of its
   * array elements are compared to the array of actual values of all ValuePageElements.
   * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
   * to check it
   *
   * If no `timeout` is specified, a ValuePageElement's default timeout is used.
   * If no `interval` is specified, a ValuePageElement's default interval is used.
   *
   * @returns this (an instance of ValuePageElementList)
   */
  containsValue(value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval) {
    return this._node.eachWait(
      this._node.all, (element, expected) => element.wait.containsValue(expected, opts), value
    )
  }

  /**
   * returns the negated variants of ValuePageElementListWait's state check functions
   */
  get not() {
    return {...super.not,
      /**
       * Waits for the actual values of all ValuePageElements managed by ValuePageElementList not to equal the expected
       * value(s).
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * @param value the expected value(s) supposed not to equal the actual values
       *
       * If `value` is a single value, this value is compared to each element in the array of actual values of all
       * ValuePageElements.
       * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of
       * its array elements are compared to the array of actual values of all ValuePageElements.
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
       * to check it
       *
       * If no `timeout` is specified, a ValuePageElement's default timeout is used.
       * If no `interval` is specified, a ValuePageElement's default interval is used.
       *
       * @returns this (an instance of ValuePageElementList)
       */
      hasValue: (value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachWait(
          this._node.all, (element, expected) => element.wait.not.hasValue(expected, opts), value
        )
      },
      /**
       * Waits for all ValuePageElements managed by ValuePageElementList not to have any value.
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for
       * some or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the
       * `interval` used to check it
       *
       * If no `timeout` is specified, a ValuePageElement's default timeout is used.
       * If no `interval` is specified, a ValuePageElement's default interval is used.
       *
       * @returns this (an instance of ValuePageElementList)
       */
      hasAnyValue: (opts: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait(
          this._node.all, (element) => element.wait.not.hasAnyValue(otherOpts), filterMask, true
        )
      },
      /**
       * Waits for the actual values of all ValuePageElements managed by ValuePageElementList not to contain the
       * expected value(s).
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * @param value the expected value(s) supposed not to be contained in the actual values
       *
       * If `value` is a single value, this value is compared to each element in the array of actual values of all
       * ValuePageElements.
       * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of
       * its array elements are compared to the array of actual values of all ValuePageElements.
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
       * to check it
       *
       * If no `timeout` is specified, a ValuePageElement's default timeout is used.
       * If no `interval` is specified, a ValuePageElement's default interval is used.
       *
       * @returns this (an instance of ValuePageElementList)
       */
      containsValue: (value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachWait(
          this._node.all, (element, expected) => element.wait.not.containsValue(expected, opts), value
        )
      }
    }
  }
}

/**
 * This class defines all `eventually` functions of ValuePageElementList.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementList
 * @template PageElementOpts type of the opts paramter passed to the constructor function of managed ValuePageElements
 * @template ListType type of the ValuePageElementList for which ValuePageElementListCurrently defines all `eventually`
 * functions
 */
class ValuePageElementListEventually<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>,
  ValueType
> extends PageElementListEventually<Store, PageElementType, PageElementOptions, ListType> {

  // CHECK STATE

  /**
   * Returns true if the actual values of all ValuePageElements managed by ValuePageElementList eventually equal the
   * expected value(s) within a specific timeout.
   *
   * @param value the expected value(s) supposed to equal the actual values
   *
   * If `value` is a single value, this value is compared to each element in the array of actual values of all
   * ValuePageElements.
   * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of its
   * array elements are compared to the array of actual values of all ValuePageElements.
   * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
   * to check it
   *
   * If no `timeout` is specified, a ValuePageElement's default timeout is used.
   * If no `interval` is specified, a ValuePageElement's default interval is used.
   */
  hasValue(value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval) {
    return this._node.eachCheck(
      this._node.all, (element, expected) => element.eventually.hasValue(expected, opts), value
    )
  }

  /**
   * Returns true if all ValuePageElements managed by ValuePageElementList eventually have any value within a specific
   * timeout.
   *
   * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for some
   * or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the `interval`
   * used to check it
   *
   * If no `timeout` is specified, a ValuePageElement's default timeout is used.
   * If no `interval` is specified, a ValuePageElement's default interval is used.
   */
  hasAnyValue(opts: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck(
      this._node.all, (element) => element.eventually.hasAnyValue(otherOpts), filterMask, true
    )
  }

  /**
   * Returns true if the actual values of all ValuePageElements managed by ValuePageElementList eventually contain the
   * expected value(s) within a specific timeout.
   *
   * @param value the expected value(s) supposed to be contained in the actual values
   *
   * If `value` is a single value, this value is compared to each element in the array of actual values of all
   * ValuePageElements.
   * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of its
   * array elements are compared to the array of actual values of all ValuePageElements.
   * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
   * to check it
   *
   * If no `timeout` is specified, a ValuePageElement's default timeout is used.
   * If no `interval` is specified, a ValuePageElement's default interval is used.
   */
  containsValue(value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval) {
    return this._node.eachCheck(
      this._node.all, (element, expected) => element.eventually.containsValue(expected, opts), value
    )
  }

  /**
   * returns the negated variants of ValuePageElementListEventually's state check functions
   */
  get not() {
    return {...super.not,
      /**
       * Returns true if the actual values of all ValuePageElements managed by ValuePageElementList eventually do not
       * equal the expected value(s) within a specific timeout.
       *
       * @param value the expected value(s) supposed not to equal the actual values
       *
       * If `value` is a single value, this value is compared to each element in the array of actual values of all
       * ValuePageElements.
       * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of
       * its array elements are compared to the array of actual values of all ValuePageElements.
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
       * to check it
       *
       * If no `timeout` is specified, a ValuePageElement's default timeout is used.
       * If no `interval` is specified, a ValuePageElement's default interval is used.
       */
      hasValue: (value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachCheck(
          this._node.all, (element, expected) => element.eventually.not.hasValue(expected, opts), value
        )
      },
      /**
       * Returns true if all ValuePageElements managed by ValuePageElementList eventually do not have any value within a
       * specific timeout.
       *
       * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for
       * some or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the
       * `interval` used to check it
       *
       * If no `timeout` is specified, a ValuePageElement's default timeout is used.
       * If no `interval` is specified, a ValuePageElement's default interval is used.
       */
      hasAnyValue: (opts: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck(
          this._node.all, (element) => element.eventually.not.hasAnyValue(otherOpts), filterMask, true
        )
      },
      /**
       * Returns true if the actual values of all ValuePageElements managed by ValuePageElementList eventually do not
       * contain the expected value(s) within a specific timeout.
       *
       * @param value the expected value(s) supposed not to be contained in the actual values
       *
       * If `value` is a single value, this value is compared to each element in the array of actual values of all
       * ValuePageElements.
       * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of
       * its array elements are compared to the array of actual values of all ValuePageElements.
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
       * to check it
       *
       * If no `timeout` is specified, a ValuePageElement's default timeout is used.
       * If no `interval` is specified, a ValuePageElement's default interval is used.
       */
      containsValue: (value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachCheck(
          this._node.all, (element, expected) => element.eventually.not.containsValue(expected, opts), value
        )
      }
    }
  }
}