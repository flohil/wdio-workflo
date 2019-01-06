import { PageElement, IPageElementOpts, PageElementCurrently, PageElementWait, PageElementEventually } from './PageElement';
import { PageElementStore } from '../stores';
/**
 * Describes the opts parameter passed to the constructor function of ValuePageElement.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 */
export interface IValuePageElementOpts<Store extends PageElementStore> extends IPageElementOpts<Store> {
}
/**
 * ValuePageElement extends PageElement with the possibility to set, retrieve and check a PageElement's value.
 *
 * It also adds another initial waiting condition:
 *
 * - 'value' to wait for an element to have any value
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template ValueType the type of PageElement's value
 */
export declare abstract class ValuePageElement<Store extends PageElementStore, ValueType> extends PageElement<Store> implements Workflo.PageNode.IValueElementNode<ValueType, boolean> {
    readonly abstract currently: ValuePageElementCurrently<Store, this, ValueType>;
    readonly wait: ValuePageElementWait<Store, this, ValueType>;
    readonly eventually: ValuePageElementEventually<Store, this, ValueType>;
    /**
     * ValuePageElement extends PageElement with the possibility to set, retrieve and check a PageElement's value.
     *
     * It also adds another initial waiting condition:
     *
     * - 'value' to wait for an element to have any value
     *
     * @param selector the XPath selector used to identify ValuePageElement on the page
     * @param opts the options used to configure ValuePageElement
     */
    constructor(selector: string, opts: IValuePageElementOpts<Store>);
    /**
     * Sets the value of this PageElement.
     *
     * @param value the value which should be set for PageElement
     * @returns this (an instance of ValuePageElement)
     */
    abstract setValue(value: ValueType): this;
    /**
     * Performs PageElement's initial waiting condition.
     *
     * Supports the following waiting types:
     *
     * - 'exist' to wait for an element to exist in the DOM
     * - 'visible' to wait for an element to become visible in the viewport (not obscured by other elements, not set to
     * 'hidden', not outside of the viewport...)
     * - 'text' to wait for an element to have any text
     * - 'value' to wait for an element to have any value
     */
    initialWait(): this;
    /**
     * Returns ValuePageElement's value after performing the initial waiting condition.
     */
    getValue(): ValueType;
    /**
     * Returns true if ValuePageElement's actual value equals an expected value after performing the initial waiting
     * condition.
     *
     * @param value the expected value which is supposed to equal ValuePageElement's actual value
     */
    getHasValue(value: ValueType): boolean;
    /**
     * Returns true if ValuePageElement has any value after performing the initial waiting condition.
     */
    getHasAnyValue(): boolean;
    /**
     * Returns true if ValuePageElement's actual value contains an expected value after performing the initial waiting
     * condition.
     *
     * @param value the expected value which is supposed to be contained in ValuePageElement's actual value
     */
    getContainsValue(value: ValueType): boolean;
}
/**
 * This class defines all `currently` functions of ValuePageElement.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement for which ValuePageElementCurrently defines all `currently`
 * functions
 * @template ValueType the type of ValuePageElement's value
 */
export declare abstract class ValuePageElementCurrently<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, ValueType> extends PageElementCurrently<Store, PageElementType> {
    /**
     * Returns the current value of ValuePageElement.
     */
    abstract getValue(): ValueType;
    /**
     * Returns ValuePageElement's current 'hasValue' status.
     *
     * A ValuePageElement's 'hasValue' status is set to true if its actual value equals the expected value.
     *
     * @param value the expected value used in the comparison which sets the 'hasValue' status
     */
    getHasValue(value: ValueType): boolean;
    /**
     * Returns ValuePageElement's current 'hasAnyValue' status.
     *
     * A ValuePageElement's 'hasAnyValue' status is set to true if it has any value.
     */
    getHasAnyValue(): boolean;
    /**
     * Returns ValuePageElement's current 'containsValue' status.
     *
     * A ValuePageElement's 'containsValue' status is set to true if its actual value contains the expected value.
     *
     * @param value the expected value used in the comparison which sets the 'containsValue' status
     */
    getContainsValue(value: ValueType): boolean;
    /**
     * Returns true if the ValuePageElement's actual value currently equals the expected value.
     *
     * @param value the expected value which is supposed to equal the actual value
     */
    hasValue(value: ValueType): boolean;
    /**
     * Returns true if the ValuePageElement currently has any Value.
     */
    hasAnyValue(): boolean;
    /**
     * Returns true if the ValuePageElement's actual value currently contains the expected value.
     *
     * @param value the expected value which is supposed to be contained in the actual value
     */
    containsValue(value: ValueType): boolean;
    /**
     * returns the negated variants of ValuePageElementCurrently's state check functions
     */
    readonly not: {
        /**
         * Returns true if the ValuePageElement's actual value currently does not equal the expected value.
         *
         * @param value the expected value which is supposed not to equal the actual value
         */
        hasValue: (value: ValueType) => boolean;
        /**
         * Returns true if the ValuePageElement currently does not have any value.
         */
        hasAnyValue: () => boolean;
        /**
         * Returns true if the ValuePageElement's actual value currently does not contain the expected value.
         *
         * @param value the expected value which is supposed not to be contained in the actual value
         */
        containsValue: (value: ValueType) => boolean;
        exists: () => boolean;
        isVisible: () => boolean;
        isEnabled: () => boolean;
        isSelected: () => boolean;
        isChecked: () => boolean;
        hasText: (text: string) => boolean;
        hasAnyText: () => boolean;
        containsText: (text: string) => boolean;
        hasDirectText: (directText: string) => boolean;
        hasAnyDirectText: () => boolean;
        containsDirectText: (directText: string) => boolean;
        hasHTML: (html: string) => boolean;
        hasAnyHTML: () => boolean;
        containsHTML: (html: string) => boolean;
        hasAttribute: (attribute: Workflo.IAttribute) => boolean;
        hasAnyAttribute: (attributeName: string) => boolean;
        containsAttribute: (attribute: Workflo.IAttribute) => boolean;
        hasClass: (className: string) => boolean;
        hasAnyClass: () => boolean;
        containsClass: (className: string) => boolean;
        hasId: (id: string) => boolean;
        hasAnyId: () => boolean;
        containsId: (id: string) => boolean;
        hasName: (name: string) => boolean;
        hasAnyName: () => boolean;
        containsName: (name: string) => boolean;
        hasLocation: (coordinates: Workflo.ICoordinates, tolerances?: Partial<Workflo.ICoordinates>) => boolean;
        hasX: (x: number, tolerance?: number) => boolean;
        hasY: (y: number, tolerance?: number) => boolean;
        hasSize: (size: Workflo.ISize, tolerances?: Partial<Workflo.ISize>) => boolean;
        hasWidth: (width: number, tolerance?: number) => boolean;
        hasHeight: (height: number, tolerance?: number) => boolean;
    };
}
/**
 * This class defines all `wait` functions of ValuePageElement.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement for which ValuePageElementWait defines all `wait`
 * functions
 * @template ValueType the type of ValuePageElement's value
 */
export declare class ValuePageElementWait<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, ValueType> extends PageElementWait<Store, PageElementType> {
    /**
     * Waits for ValuePageElement's actual value to equal the expected value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param value the expected value which is supposed to equal the actual value
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, ValuePageElement's default timeout is used.
     * If no `interval` is specified, ValuePageElement's default interval is used.
     *
     * @returns this (an instance of ValuePageElement)
     */
    hasValue(value: ValueType, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for ValuePageElement to have any value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, ValuePageElement's default timeout is used.
     * If no `interval` is specified, ValuePageElement's default interval is used.
     *
     * @returns this (an instance of ValuePageElement)
     */
    hasAnyValue(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * Waits for ValuePageElement's actual value to contain the expected value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param value the expected value which is supposed to be contained in the actual value
     * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
     * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
     *
     * If no `timeout` is specified, ValuePageElement's default timeout is used.
     * If no `interval` is specified, ValuePageElement's default interval is used.
     *
     * @returns this (an instance of ValuePageElement)
     */
    containsValue(value: ValueType, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    /**
     * returns the negated variants of ValuePageElementWait's state check functions
     */
    readonly not: {
        /**
         * Waits for ValuePageElement's actual value not to equal the expected value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param value the expected value which is supposed not to equal the actual value
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, ValuePageElement's default timeout is used.
         * If no `interval` is specified, ValuePageElement's default interval is used.
         *
         * @returns this (an instance of ValuePageElement)
         */
        hasValue: (value: ValueType, opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for ValuePageElement not to have any value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, ValuePageElement's default timeout is used.
         * If no `interval` is specified, ValuePageElement's default interval is used.
         *
         * @returns this (an instance of ValuePageElement)
         */
        hasAnyValue: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        /**
         * Waits for ValuePageElement's actual value not to contain the expected value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param value the expected value which is supposed not to be contained in the actual value
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used to
         * check it
         *
         * If no `timeout` is specified, ValuePageElement's default timeout is used.
         * If no `interval` is specified, ValuePageElement's default interval is used.
         *
         * @returns this (an instance of ValuePageElement)
         */
        containsValue: (value: ValueType, opts?: Workflo.ITimeoutInterval) => PageElementType;
        exists: (opts?: Workflo.ITimeout) => PageElementType;
        isVisible: (opts?: Workflo.ITimeout) => PageElementType;
        isEnabled: (opts?: Workflo.ITimeout) => PageElementType;
        isSelected: (opts?: Workflo.ITimeout) => PageElementType;
        isChecked: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasText: (text: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyText: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsText: (text: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasHTML: (html: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyHTML: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsHTML: (html: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyAttribute: (attributeName: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasClass: (className: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyClass: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsClass: (className: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasId: (id: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyId: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsId: (id: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasName: (name: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyName: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsName: (name: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
    };
}
/**
 * This class defines all `eventually` functions of ValuePageElement.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the ValuePageElement for which ValuePageElementEventually defines all `eventually`
 * functions
 * @template ValueType the type of ValuePageElement's value
 */
export declare class ValuePageElementEventually<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, ValueType> extends PageElementEventually<Store, PageElementType> {
    /**
     * Returns true if PageElement's actual value eventually equals the expected value within a specific timeout.
     *
     * @param value the expected value which is supposed to equal PageElement's actual value
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasValue(value: ValueType, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement eventually has any value within a specific timeout.
     *
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    hasAnyValue(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if PageElement's actual value eventually contains the expected value within a specific timeout.
     *
     * @param value the expected value which is supposed to be contained in PageElement's actual value
     * @param opts includes the `timeout` within which the condition is expected to be met and the
     * `interval` used to check it
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    containsValue(value: ValueType, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * returns the negated variants of ValuePageElementEventually's state check functions
     */
    readonly not: {
        /**
         * Returns true if PageElement's actual value eventually does not equal the expected value within a specific timeout.
         *
         * @param value the expected value which is supposed not to equal PageElement's actual value
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasValue: (value: ValueType, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement eventually does not have any value within a specific timeout.
         *
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        hasAnyValue: (opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if PageElement's actual value eventually does not contain the expected value within a specific
         * timeout.
         *
         * @param value the expected value which is supposed not to be contained in PageElement's actual value
         * @param opts includes the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, PageElement's default timeout is used.
         * If no `interval` is specified, PageElement's default interval is used.
         */
        containsValue: (value: ValueType, opts?: Workflo.ITimeoutInterval) => boolean;
        exists: (opts?: Workflo.ITimeout) => boolean;
        isVisible: (opts?: Workflo.ITimeout) => boolean;
        isEnabled: (opts?: Workflo.ITimeout) => boolean;
        isSelected: (opts?: Workflo.ITimeout) => boolean;
        isChecked: (opts?: Workflo.ITimeoutInterval) => boolean;
        hasText: (text: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyText: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsText: (text: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasHTML: (html: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyHTML: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsHTML: (html: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyAttribute: (attributeName: string, opts?: Workflo.ITimeoutInterval) => boolean;
        containsAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => boolean;
        hasClass: (className: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyClass: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsClass: (className: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasId: (id: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyId: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsId: (id: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasName: (name: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyName: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsName: (name: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.ITimeoutInterval) => boolean;
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.ITimeoutInterval) => boolean;
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
    };
}
