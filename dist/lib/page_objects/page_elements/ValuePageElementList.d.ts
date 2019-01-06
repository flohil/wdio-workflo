import { PageElementList, ValuePageElement, IValuePageElementOpts, IPageElementListOpts, PageElementListCurrently, PageElementListEventually, PageElementListWait } from './';
import { PageElementStore } from '../stores';
/**
 * Describes the opts parameter passed to the constructor function of ValuePageElementList.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementList
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the ValuePageElements
 * managed by ValuePageElementList
 * @template ValueType type of the value of the ValuePageElements managed by ValuePageElementList
 */
export interface IValuePageElementListOpts<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ValueType> extends IPageElementListOpts<Store, PageElementType, PageElementOptions> {
}
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
export declare class ValuePageElementList<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ValueType> extends PageElementList<Store, PageElementType, PageElementOptions> implements Workflo.PageNode.IValueElementNode<ValueType[], boolean[], ValueType[] | ValueType> {
    readonly currently: ValuePageElementListCurrently<Store, PageElementType, PageElementOptions, this, ValueType>;
    readonly wait: ValuePageElementListWait<Store, PageElementType, PageElementOptions, this, ValueType>;
    readonly eventually: ValuePageElementListEventually<Store, PageElementType, PageElementOptions, this, ValueType>;
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
    constructor(selector: string, opts: IValuePageElementListOpts<Store, PageElementType, PageElementOptions, ValueType>);
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
    initialWait(): void;
    /**
     * Returns the values of all ValuePageElements managed by ValuePageElementList as an array after performing
     * ValuePageElementList's initial waiting condition.
     *
     * @param filterMask can be used to skip the invocation of the `getValue` function for some or all managed
     * ValuePageElements. The results of skipped function invocations are not included in the total results array.
     */
    getValue(filterMask?: Workflo.PageNode.ListFilterMask): ValueType[];
    /**
     * Returns the 'hasValue' status of all ValuePageElements managed by ValuePageElementList as an array after performing
     * ValuePageElementList's initial waiting condition.
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
    getHasValue(value: ValueType | ValueType[]): boolean[];
    /**
     * Returns the 'hasAnyValue' status of all ValuePageElements managed by ValuePageElementList as an array after
     * performing ValuePageElementList's initial waiting condition.
     *
     * A ValuePageElement's 'hasAnyValue' status is set to true if the ValuePageElement has any value.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyValue` function for some or all managed
     * ValuePageElements. The results of skipped function invocations are not included in the total results array.
     */
    getHasAnyValue(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
    /**
     * Returns the 'containsValue' status of all ValuePageElements managed by ValuePageElementList as an array after
     * performing ValuePageElementList's initial waiting condition.
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
    getContainsValue(value: ValueType | ValueType[]): boolean[];
    /**
     * Sets values on all list elements after the initial wait was performed.
     *
     * If values is an array, the number of list elements must match the number of passed values.
     * The values will be assigned in the order that the list elements were retrieved from the DOM.
     *
     * If values is a single value, the same value will be set on all list elements.
     *
     * @param values
     */
    setValue(values: ValueType[] | ValueType): this;
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
declare class ValuePageElementListCurrently<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementListCurrently<Store, PageElementType, PageElementOptions, ListType> {
    /**
     * Returns the current values of all ValuePageElements managed by ValuePageElementList as an array.
     *
     * @param filterMask can be used to skip the invocation of the `getValue` function for some or all managed
     * ValuePageElements. The results of skipped function invocations are not included in the total results array.
     */
    getValue(filterMask?: Workflo.PageNode.ListFilterMask): ValueType[];
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
    getHasValue(value: ValueType | ValueType[]): boolean[];
    /**
     * Returns the current 'hasAnyValue' status of all ValuePageElements managed by ValuePageElementList as an array.
     *
     * A ValuePageElement's 'hasAnyValue' status is set to true if the ValuePageElement has any value.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyValue` function for some or all managed
     * ValuePageElements. The results of skipped function invocations are not included in the total results array.
     */
    getHasAnyValue(filterMask?: Workflo.PageNode.ListFilterMask): boolean[];
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
    getContainsValue(value: ValueType | ValueType[]): boolean[];
    /**
     * Returns true if the actual values of all ValuePageElements managed by ValuePageElementList equal the expected
     * value(s).
     *
     * @param value the expected value(s) supposed to equal the actual values
     *
     * If `value` is a single value, this value is compared to each element in the array of actual values of all
     * ValuePageElements.
     * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of its
     * array elements are compared to the array of actual values of all ValuePageElements.
     */
    hasValue(value: ValueType | ValueType[]): boolean;
    /**
     * Returns true if all ValuePageElements managed by ValuePageElementList have any value.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyValue` function for some or all managed
     * ValuePageElements
     */
    hasAnyValue(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    /**
     * Returns true if the actual values of all ValuePageElements managed by ValuePageElementList contain the expected
     * value(s).
     *
     * @param value the expected value(s) supposed to be contained in the actual values
     *
     * If `value` is a single value, this value is compared to each element in the array of actual values of all
     * ValuePageElements.
     * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of its
     * array elements are compared to the array of actual values of all ValuePageElements.
     */
    containsValue(value: ValueType | ValueType[]): boolean;
    /**
     * returns the negated variants of ValuePageElementListCurrently's state check functions
     */
    readonly not: {
        /**
         * Returns true if the actual values of all ValuePageElements managed by ValuePageElementList do not equal the
         * expected value(s).
         *
         * @param value the expected value(s) supposed not to equal the actual values
         *
         * If `value` is a single value, this value is compared to each element in the array of actual values of all
         * ValuePageElements.
         * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of
         * its array elements are compared to the array of actual values of all ValuePageElements.
         */
        hasValue: (value: ValueType | ValueType[]) => boolean;
        /**
         * Returns true if all ValuePageElements managed by ValuePageElementList do not have any value.
         *
         * @param filterMask can be used to skip the invocation of the `hasAnyValue` function for some or all managed
         * ValuePageElements
         */
        hasAnyValue: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        /**
         * Returns true if the actual values of all ValuePageElements managed by ValuePageElementList do not contain the
         * expected value(s).
         *
         * @param value the expected value(s) supposed not to be contained in the actual values
         *
         * If `value` is a single value, this value is compared to each element in the array of actual values of all
         * ValuePageElements.
         * If `value` is an array of values, its length must match the length of ValuePageElementList and the values of
         * its array elements are compared to the array of actual values of all ValuePageElements.
         */
        containsValue: (value: ValueType | ValueType[]) => boolean;
        isEmpty: () => boolean;
        hasLength: (length: number, comparator?: Workflo.Comparator) => boolean;
        exists: (filterMask?: boolean) => boolean;
        isVisible: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        isEnabled: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        hasText: (text: string | string[]) => boolean;
        hasAnyText: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        containsText: (text: string | string[]) => boolean;
        hasDirectText: (directText: string | string[]) => boolean;
        hasAnyDirectText: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        containsDirectText: (directText: string | string[]) => boolean;
    };
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
declare class ValuePageElementListWait<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementListWait<Store, PageElementType, PageElementOptions, ListType> {
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
     * If no `timeout` is specified, ValuePageElementList's default timeout is used.
     * If no `interval` is specified, ValuePageElementList's default interval is used.
     *
     * @returns this (an instance of ValuePageElementList)
     */
    hasValue(value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval): ListType;
    /**
     * Waits for all ValuePageElements managed by ValuePageElementList to have any value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for some
     * or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the `interval`
     * used to check it
     *
     * If no `timeout` is specified, ValuePageElementList's default timeout is used.
     * If no `interval` is specified, ValuePageElementList's default interval is used.
     *
     * @returns this (an instance of ValuePageElementList)
     */
    hasAnyValue(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask): ListType;
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
     * If no `timeout` is specified, ValuePageElementList's default timeout is used.
     * If no `interval` is specified, ValuePageElementList's default interval is used.
     *
     * @returns this (an instance of ValuePageElementList)
     */
    containsValue(value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval): ListType;
    /**
     * returns the negated variants of ValuePageElementListWait's state check functions
     */
    readonly not: {
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
         * If no `timeout` is specified, ValuePageElementList's default timeout is used.
         * If no `interval` is specified, ValuePageElementList's default interval is used.
         *
         * @returns this (an instance of ValuePageElementList)
         */
        hasValue: (value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval) => ListType;
        /**
         * Waits for all ValuePageElements managed by ValuePageElementList not to have any value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for
         * some or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, ValuePageElementList's default timeout is used.
         * If no `interval` is specified, ValuePageElementList's default interval is used.
         *
         * @returns this (an instance of ValuePageElementList)
         */
        hasAnyValue: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask) => ListType;
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
         * If no `timeout` is specified, ValuePageElementList's default timeout is used.
         * If no `interval` is specified, ValuePageElementList's default interval is used.
         *
         * @returns this (an instance of ValuePageElementList)
         */
        containsValue: (value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval) => ListType;
        hasLength: (length: number, opts?: import("./PageElementList").IPageElementListWaitLengthParams) => ListType;
        isEmpty: (opts?: Workflo.ITimeoutInterval) => ListType;
        exists: (opts?: Workflo.ITimeout & {
            filterMask?: boolean;
        }) => ListType;
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask) => ListType;
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask) => ListType;
        hasText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => ListType;
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask) => ListType;
        containsText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => ListType;
        hasDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => ListType;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask) => ListType;
        containsDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => ListType;
    };
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
declare class ValuePageElementListEventually<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementListEventually<Store, PageElementType, PageElementOptions, ListType> {
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
     * If no `timeout` is specified, ValuePageElementList's default timeout is used.
     * If no `interval` is specified, ValuePageElementList's default interval is used.
     *
     * @returns this (an instance of ValuePageElementList)
     */
    hasValue(value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if all ValuePageElements managed by ValuePageElementList eventually have any value within a specific
     * timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for some
     * or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the `interval`
     * used to check it
     *
     * If no `timeout` is specified, ValuePageElementList's default timeout is used.
     * If no `interval` is specified, ValuePageElementList's default interval is used.
     *
     * @returns this (an instance of ValuePageElementList)
     */
    hasAnyValue(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask): boolean;
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
     * If no `timeout` is specified, ValuePageElementList's default timeout is used.
     * If no `interval` is specified, ValuePageElementList's default interval is used.
     *
     * @returns this (an instance of ValuePageElementList)
     */
    containsValue(value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * returns the negated variants of ValuePageElementListEventually's state check functions
     */
    readonly not: {
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
         * If no `timeout` is specified, ValuePageElementList's default timeout is used.
         * If no `interval` is specified, ValuePageElementList's default interval is used.
         *
         * @returns this (an instance of ValuePageElementList)
         */
        hasValue: (value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if all ValuePageElements managed by ValuePageElementList eventually do not have any value within a
         * specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for
         * some or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, ValuePageElementList's default timeout is used.
         * If no `interval` is specified, ValuePageElementList's default interval is used.
         *
         * @returns this (an instance of ValuePageElementList)
         */
        hasAnyValue: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask) => boolean;
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
         * If no `timeout` is specified, ValuePageElementList's default timeout is used.
         * If no `interval` is specified, ValuePageElementList's default interval is used.
         *
         * @returns this (an instance of ValuePageElementList)
         */
        containsValue: (value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval) => boolean;
        hasLength: (length: number, opts?: import("./PageElementList").IPageElementListWaitLengthParams) => boolean;
        isEmpty: (opts?: Workflo.ITimeoutInterval) => boolean;
        exists: (opts?: Workflo.ITimeout & {
            filterMask?: boolean;
        }) => boolean;
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask) => boolean;
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask) => boolean;
        hasText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask) => boolean;
        containsText: (text: string | string[], opts?: Workflo.ITimeoutInterval) => boolean;
        hasDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask) => boolean;
        containsDirectText: (directText: string | string[], opts?: Workflo.ITimeoutInterval) => boolean;
    };
}
export {};
