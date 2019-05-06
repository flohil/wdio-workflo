import { IPageElementGroupOpts, PageElementGroup, PageElementGroupCurrently, PageElementGroupEventually, PageElementGroupWait } from '.';
import { PageNodeStore } from '../stores';
/**
 * Extracts the return value types of the `getValue` functions of all PageNodes defined within a
 * ValuePageElementGroup's content.
 */
declare type ExtractValue<Content extends {
    [key: string]: Workflo.PageNode.IPageNode;
}> = Workflo.PageNode.ExtractValue<Content>;
/**
 * This interface is implemented by ValuePageElement, ValuePageElementList, ValuePageElementMap and
 * ValuePageElementGroup.
 *
 * IValueElementNode guarantees support of the following state retrieval functions:
 *
 * - getValue
 * - getHasValue
 * - getHasAnyValue
 * - getContainsValue
 *
 * IValueElementNode guarantees support of the following state check functions:
 *
 * - hasValue
 * - hasAnyValue
 * - containsValue
 */
declare type ValueElementNode<Content extends {
    [K in keyof Content]: Workflo.PageNode.IPageNode;
}> = Workflo.PageNode.IValueElementNode<ExtractValue<Content>, Workflo.PageNode.IValueGroupFilterMask<Content>>;
/**
 * Describes the opts parameter passed to the constructor function of ValuePageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 */
export interface IValuePageElementGroupOpts<Store extends PageNodeStore, Content extends {
    [key: string]: Workflo.PageNode.IPageNode;
}> extends IPageElementGroupOpts<Store, Content> {
}
/**
 * ValuePageElementGroup extends PageElementGroup with the possibility to set, retrieve and check the values of
 * ValuePageElements, ValuePageElementLists and ValuePageElementMaps managed by ValuePageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 */
export declare class ValuePageElementGroup<Store extends PageNodeStore, Content extends {
    [key: string]: Workflo.PageNode.IPageNode;
}> extends PageElementGroup<Store, Content> implements ValueElementNode<Content> {
    readonly currently: ValuePageElementGroupCurrently<Store, Content, this>;
    readonly wait: ValuePageElementGroupWait<Store, Content, this>;
    readonly eventually: ValuePageElementGroupEventually<Store, Content, this>;
    /**
     * ValuePageElementGroup extends PageElementGroup with the possibility to set, retrieve and check the values of
     * ValuePageElements, ValuePageElementLists and ValuePageElementMaps managed by ValuePageElementGroup.
     *
     * @param id a string which uniquely identifies a ValuePageElementGroup in a PageNodeStore
     * @param opts the options used to configure ValuePageElementGroup
     */
    constructor(id: string, { ...superOpts }: IValuePageElementGroupOpts<Store, Content>);
    /**
     * Returns the values of all PageNodes managed by ValuePageElementGroup as a result structure after executing the
     * initial waiting condition of each PageNode.
     *
     * @param filterMask can be used to skip the invocation of the `getValue` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>): Workflo.PageNode.ExtractValue<Content>;
    /**
     * Returns the 'hasValue' status of all PageNodes managed by ValuePageElementGroup as a result structure after
     * executing the initial waiting condition of each PageNode.
     *
     * A ValuePageElement's 'hasValue' status is set to true if its actual value equals the expected value.
     *
     * @param values the expected values used in the comparisons which set the 'hasValue' status
     */
    getHasValue(values: ExtractValue<Content>): Workflo.PageNode.ExtractValueBoolean<Content>;
    /**
     * Returns the 'hasAnyValue' status of all PageNodes managed by ValuePageElementGroup as a result structure after
     * performing the initial waiting condition of each PageNode.
     *
     * A ValuePageElement's 'hasAnyValue' status is set to true if the ValuePageElement has any value.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyValue` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getHasAnyValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>): Workflo.PageNode.ExtractValueBoolean<Content>;
    /**
     * Returns the 'containsValue' status of all PageNodes managed by ValuePageElementGroup as a result structure after
     * executing the initial waiting condition of each PageNode.
     *
     * A ValuePageElement's 'containsValue' status is set to true if its actual value contains the expected value.
     *
     * @param values the expected values used in the comparisons which set the 'containsValue' status
     */
    getContainsValue(values: ExtractValue<Content>): Workflo.PageNode.ExtractValueBoolean<Content>;
    /**
     * This function sets the passed values to all ValuePageElements managed by ValuePageElementGroup
     * after performing the initial waiting condition of each ValuePageElement.
     *
     * @param values a structure of setter values
     */
    setValue(values: ExtractValue<Content>): this;
}
/**
 * This class defines all `currently` functions of ValuePageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 * @template GroupType type of the ValuePageElementGroup for which ValuePageElementGroupCurrently defines all
 * `currently` functions
 */
declare class ValuePageElementGroupCurrently<Store extends PageNodeStore, Content extends {
    [key: string]: Workflo.PageNode.IPageNode;
}, GroupType extends ValuePageElementGroup<Store, Content>> extends PageElementGroupCurrently<Store, Content, GroupType> {
    /**
     * Returns the current values of all PageNodes managed by ValuePageElementGroup as a result structure.
     *
     * @param filterMask can be used to skip the invocation of the `getValue` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>): Workflo.PageNode.ExtractValue<Content>;
    /**
     * Returns the current 'hasValue' status of all PageNodes managed by ValuePageElementGroup as a result structure.
     *
     * A PageNode's 'hasValue' status is set to true if its actual value equals the expected value.
     *
     * @param values the expected values used in the comparisons which set the 'hasValue' status
     */
    getHasValue(values: ExtractValue<Content>): Workflo.PageNode.ExtractValueBoolean<Content>;
    /**
     * Returns the current 'hasAnyValue' status of all PageNodes managed by ValuePageElementGroup as a result structure.
     *
     * A PageNode's 'hasAnyValue' status is set to true if the PageNode has any value.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyValue` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getHasAnyValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>): Workflo.PageNode.ExtractValueBoolean<Content>;
    /**
     * Returns the current 'containsValue' status of all PageNodes managed by ValuePageElementGroup as a result structure.
     *
     * A PageNode's 'containsValue' status is set to true if its actual value contains the expected value.
     *
     * @param values the expected values used in the comparisons which set the 'containsValue' status
     */
    getContainsValue(values: ExtractValue<Content>): Workflo.PageNode.ExtractValueBoolean<Content>;
    /**
     * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup currently equal the expected
     * values.
     *
     * @param values the expected values supposed to equal the actual values
     */
    hasValue(values: ExtractValue<Content>): boolean;
    /**
     * Returns true if all PageNodes managed by ValuePageElementGroup currently have any value.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyValue` function for some or all managed
     * PageNodes
     */
    hasAnyValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>): boolean;
    /**
     * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup currently contain the expected
     * values.
     *
     * @param values the expected values supposed to be contained in the actual values
     */
    containsValue(values: ExtractValue<Content>): boolean;
    /**
     * returns the negated variants of ValuePageElementGroupCurrently's state check functions
     */
    readonly not: {
        /**
         * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup currently do not equal the
         * expected values.
         *
         * @param values the expected values supposed not to equal the actual values
         */
        hasValue: (values: Workflo.PageNode.ExtractValue<Content>) => boolean;
        /**
         * Returns true if all PageNodes managed by ValuePageElementGroup currently do not have any value.
         *
         * @param filterMask can be used to skip the invocation of the `hasAnyValue` function for some or all managed
         * PageNodes
         */
        hasAnyValue: (filterMask?: Workflo.PageNode.ExtractValueBoolean<Content>) => boolean;
        /**
         * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup currently do not contain
         * the expected values.
         *
         * @param values the expected values supposed not to be contained in the actual values
         */
        containsValue: (values: Workflo.PageNode.ExtractValue<Content>) => boolean;
        exists: (filterMask?: Workflo.PageNode.ExtractExistsFilterMask<Content>) => boolean;
        isVisible: (filterMask?: Workflo.PageNode.ExtractBoolean<Content>) => boolean;
        isEnabled: (filterMask?: Workflo.PageNode.ExtractBoolean<Content>) => boolean;
        hasText: (texts: Workflo.PageNode.ExtractText<Content>) => boolean;
        hasAnyText: (filterMask?: Workflo.PageNode.ExtractBoolean<Content>) => boolean;
        containsText: (texts: Workflo.PageNode.ExtractText<Content>) => boolean;
        hasDirectText: (directTexts: Workflo.PageNode.ExtractText<Content>) => boolean;
        hasAnyDirectText: (filterMask?: Workflo.PageNode.ExtractBoolean<Content>) => boolean;
        containsDirectText: (directTexts: Workflo.PageNode.ExtractText<Content>) => boolean;
    };
}
/**
 * This class defines all `wait` functions of ValuePageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 * @template GroupType type of the ValuePageElementGroup for which ValuePageElementGroupWait defines all `wait`
 * functions
 */
declare class ValuePageElementGroupWait<Store extends PageNodeStore, Content extends {
    [key: string]: Workflo.PageNode.IPageNode;
}, GroupType extends ValuePageElementGroup<Store, Content>> extends PageElementGroupWait<Store, Content, GroupType> {
    /**
     * Waits for the actual values of all PageNodes managed by ValuePageElementGroup to equal the expected values.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param values the expected values supposed to equal the actual values
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     *
     * @returns this (an instance of ValuePageElementGroup)
     */
    hasValue(values: ExtractValue<Content>, opts?: Workflo.ITimeoutInterval): GroupType;
    /**
     * Waits for all PageNodes managed by ValuePageElementGroup to have any value.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for some
     * or all managed PageNodes, the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     *
     * @returns this (an instance of ValuePageElementGroup)
     */
    hasAnyValue(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.ValueGroupFilterMask<Content>): GroupType;
    /**
     * Waits for the actual values of all PageNodes managed by ValuePageElementGroup to contain the expected values.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param values the expected values supposed to be contained in the actual values
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     *
     * @returns this (an instance of ValuePageElementGroup)
     */
    containsValue(values: ExtractValue<Content>, opts?: Workflo.ITimeoutInterval): GroupType;
    /**
     * returns the negated variants of ValuePageElementGroupWait's state check functions
     */
    readonly not: {
        /**
         * Waits for the actual values of all PageNodes managed by ValuePageElementGroup not to equal the expected values.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param values the expected values supposed not to equal the actual values
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a ValuePageElement's default timeout is used.
         * If no `interval` is specified, a ValuePageElement's default interval is used.
         *
         * @returns this (an instance of ValuePageElementGroup)
         */
        hasValue: (values: Workflo.PageNode.ExtractValue<Content>, opts?: Workflo.ITimeoutInterval) => GroupType;
        /**
         * Waits for all PageNodes managed by ValuePageElementGroup not to have any value.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for
         * some or all managed PageNodes, the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, a ValuePageElement's default timeout is used.
         * If no `interval` is specified, a ValuePageElement's default interval is used.
         *
         * @returns this (an instance of ValuePageElementGroup)
         */
        hasAnyValue: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.ExtractValueBoolean<Content>) => GroupType;
        /**
         * Waits for the actual values of all PageNodes managed by ValuePageElementGroup not to contain the expected
         * values.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param values the expected values supposed not to be contained in the actual values
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a ValuePageElement's default timeout is used.
         * If no `interval` is specified, a ValuePageElement's default interval is used.
         *
         * @returns this (an instance of ValuePageElementGroup)
         */
        containsValue: (values: Workflo.PageNode.ExtractValue<Content>, opts?: Workflo.ITimeoutInterval) => GroupType;
        exists: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMaskExists<Content>) => GroupType;
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
        hasText: (texts: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => GroupType;
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
        containsText: (texts: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => GroupType;
        hasDirectText: (directTexts: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => GroupType;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
        containsDirectText: (directTexts: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => GroupType;
    };
}
/**
 * This class defines all `eventually` functions of ValuePageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 * @template GroupType type of the ValuePageElementGroup for which ValuePageElementGroupEventually defines all
 * `eventually` functions
 */
declare class ValuePageElementGroupEventually<Store extends PageNodeStore, Content extends {
    [key: string]: Workflo.PageNode.IPageNode;
}, GroupType extends ValuePageElementGroup<Store, Content>> extends PageElementGroupEventually<Store, Content, GroupType> {
    /**
     * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup eventually equal the expected
     * values within a specific timeout.
     *
     * @param values the expected values supposed to equal the actual values
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     */
    hasValue(values: ExtractValue<Content>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if all PageNodes managed by ValuePageElementGroup eventually have any value within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for some
     * or all managed PageNodes, the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     */
    hasAnyValue(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
    /**
     * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup eventually contain the expected
     * values within a specific timeout.
     *
     * @param values the expected values supposed to be contained in the actual values
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     */
    containsValue(values: ExtractValue<Content>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * returns the negated variants of ValuePageElementGroupEventually's state check functions
     */
    readonly not: {
        /**
         * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup eventually do not equal the
         * expected values within a specific timeout.
         *
         * @param values the expected values supposed not to equal the actual values
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a ValuePageElement's default timeout is used.
         * If no `interval` is specified, a ValuePageElement's default interval is used.
         */
        hasValue: (values: Workflo.PageNode.ExtractValue<Content>, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if all PageNodes managed by ValuePageElementGroup eventually do not have any value within a
         * specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for
         * some or all managed PageNodes, the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, a ValuePageElement's default timeout is used.
         * If no `interval` is specified, a ValuePageElement's default interval is used.
         */
        hasAnyValue: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        /**
         * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup eventually do not contain
         * the expected values within a specific timeout.
         *
         * @param values the expected values supposed not to be contained in the actual values
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a ValuePageElement's default timeout is used.
         * If no `interval` is specified, a ValuePageElement's default interval is used.
         */
        containsValue: (values: Workflo.PageNode.ExtractValue<Content>, opts?: Workflo.ITimeoutInterval) => boolean;
        exists: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMaskExists<Content>) => boolean;
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        hasText: (texts: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        containsText: (texts: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasDirectText: (directTexts: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        containsDirectText: (directTexts: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.ITimeoutInterval) => boolean;
    };
}
/**
 * Returns true if the passed node supports all functions defined in IValueElementNode.
 *
 * @param node a PageNode
 */
export declare function isIValueElementNode<Content extends {
    [K in keyof Content]: Workflo.PageNode.IPageNode;
}>(node: Workflo.PageNode.IPageNode | ValueElementNode<Content>): node is ValueElementNode<Content>;
export {};
