import {
  IPageElementGroupOpts,
  PageElementGroup,
  PageElementGroupCurrently,
  PageElementGroupEventually,
  PageElementGroupWait,
} from '.';
import { PageNodeStore } from '../stores';

/**
 * Extracts the return value types of the `getValue` functions of all PageNodes defined within a
 * ValuePageElementGroup's content.
 */
type ExtractValue<Content extends {[key: string]: Workflo.PageNode.IPageNode}> = Workflo.PageNode.ExtractValue<Content>;

/**
 * Extracts the return value types of the `getValue` functions of all PageNodes defined within a
 * ValuePageElementGroup's content for state check functions and the setValue function.
 * Compared to `ExtractValue`, this will allow ta PageElementList to pass either a single value or
 * an array of values.
 */
type ExtractValueStateChecker<Content extends {[key: string]: Workflo.PageNode.IPageNode}> =
Workflo.PageNode.ExtractValueStateChecker<Content>;


/**
 * Extracts the return value types of the `getHasValue` functions of all PageNodes defined within a
 * ValuePageElementGroup's content. For a ValuePageElement, the return value type will be `boolean`.
 */
type ExtractValueBoolean<Content extends {[key: string]: Workflo.PageNode.IPageNode}> =
Workflo.PageNode.ExtractValueBoolean<Content>;

/**
 * Extracts the return value types of the `getHasValue` functions of all PageNodes defined within a
 * ValuePageElementGroup's content for state check functions. For a ValuePageElement, the extracted
 * return value type will be `boolean`.
 * Compared to `ExtractValueBoolean`, this will allow a ValuePageElementList to pass either a
 * single boolean or an array of booleans.
 */
type ExtractValueBooleanStateChecker<Content extends {[key: string]: Workflo.PageNode.IPageNode}> =
Workflo.PageNode.ExtractValueBooleanStateChecker<Content>;

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
type ValueElementNode<Content extends {[K in keyof Content] : Workflo.PageNode.IPageNode}> =
Workflo.PageNode.IValueElementNode<
  ExtractValue<Content> | ExtractValueStateChecker<Content>, Workflo.PageNode.IValueGroupFilterMask<Content>
>;

/**
 * Describes the opts parameter passed to the constructor function of ValuePageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 */
export interface IValuePageElementGroupOpts<
  Store extends PageNodeStore,
  Content extends {[key: string] : Workflo.PageNode.IPageNode}
> extends IPageElementGroupOpts<
  Store, Content
> { }

/**
 * ValuePageElementGroup extends PageElementGroup with the possibility to set, retrieve and check the values of
 * ValuePageElements, ValuePageElementLists and ValuePageElementMaps managed by ValuePageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 */
export class ValuePageElementGroup<
  Store extends PageNodeStore,
  Content extends {[key: string] : Workflo.PageNode.IPageNode}
> extends PageElementGroup<Store, Content>
implements ValueElementNode<Content> {

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
  constructor(id: string, {
    ...superOpts
  }: IValuePageElementGroupOpts<Store, Content>) {
    super(id, superOpts);

    this.currently = new ValuePageElementGroupCurrently(this);
    this.wait = new ValuePageElementGroupWait(this);
    this.eventually = new ValuePageElementGroupEventually(this);
  }

  /**
   * Returns the values of all PageNodes managed by ValuePageElementGroup as a result structure after executing the
   * initial waiting condition of each PageNode.
   *
   * @param filterMask can be used to skip the invocation of the `getValue` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>) {
    return this.eachGet<
      ValueElementNode<Content>, ExtractValue<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>
    > (
      isIValueElementNode, ({ node, filter }) => node.getValue(filter), filterMask,
    );
  }

  /**
   * Returns the 'hasValue' status of all PageNodes managed by ValuePageElementGroup as a result structure after
   * executing the initial waiting condition of each PageNode.
   *
   * A ValuePageElement's 'hasValue' status is set to true if its actual value equals the expected value.
   *
   * @param values the expected values used in the comparisons which set the 'hasValue' status
   */
  getHasValue(values: ExtractValueStateChecker<Content>) {
    return this.eachCompare<
      ValueElementNode<Content>, ExtractValueStateChecker<Content>, ExtractValueBoolean<Content>
    > (
      isIValueElementNode, ({ node, expected }) => node.getHasValue(expected), values,
    );
  }

  /**
   * Returns the 'hasAnyValue' status of all PageNodes managed by ValuePageElementGroup as a result structure after
   * performing the initial waiting condition of each PageNode.
   *
   * A ValuePageElement's 'hasAnyValue' status is set to true if the ValuePageElement has any value.
   *
   * @param filterMask can be used to skip the invocation of the `getHasAnyValue` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getHasAnyValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>) {
    return this.eachCompare<
      ValueElementNode<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>, ExtractValueBoolean<Content>
    > (
      isIValueElementNode, ({ node, filter }) => node.getHasAnyValue(filter), filterMask, true,
    );
  }

  /**
   * Returns the 'containsValue' status of all PageNodes managed by ValuePageElementGroup as a result structure after
   * executing the initial waiting condition of each PageNode.
   *
   * A ValuePageElement's 'containsValue' status is set to true if its actual value contains the expected value.
   *
   * @param values the expected values used in the comparisons which set the 'containsValue' status
   */
  getContainsValue(values: ExtractValueStateChecker<Content>) {
    return this.eachCompare<
      ValueElementNode<Content>, ExtractValueStateChecker<Content>, ExtractValueBoolean<Content>
    > (
      isIValueElementNode, ({ node, expected }) => node.getContainsValue(expected), values,
    );
  }

  /**
   * This function sets the passed values to all ValuePageElements managed by ValuePageElementGroup
   * after performing the initial waiting condition of each ValuePageElement.
   *
   * @param values a structure of setter values
   */
  setValue(values: ExtractValueStateChecker<Content>) {
    return this.eachSet<ValueElementNode<Content>, ExtractValueStateChecker<Content>> (
      isIValueElementNode, ({ node, value }) => node.setValue(value), values,
    );
  }
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
class ValuePageElementGroupCurrently<
  Store extends PageNodeStore,
  Content extends {[key: string] : Workflo.PageNode.IPageNode},
  GroupType extends ValuePageElementGroup<Store, Content>
> extends PageElementGroupCurrently<Store, Content, GroupType> {

  /**
   * Returns the current values of all PageNodes managed by ValuePageElementGroup as a result structure.
   *
   * @param filterMask can be used to skip the invocation of the `getValue` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>) {
    return this._node.eachGet<
      ValueElementNode<Content>, ExtractValue<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>
    > (
      isIValueElementNode, ({ node, filter }) => node.currently.getValue(filter), filterMask,
    );
  }

  /**
   * Returns the current 'hasValue' status of all PageNodes managed by ValuePageElementGroup as a result structure.
   *
   * A PageNode's 'hasValue' status is set to true if its actual value equals the expected value.
   *
   * @param values the expected values used in the comparisons which set the 'hasValue' status
   */
  getHasValue(values: ExtractValueStateChecker<Content>) {
    return this._node.eachCompare<
      ValueElementNode<Content>, ExtractValueStateChecker<Content>, ExtractValueBoolean<Content>
    > (
      isIValueElementNode, ({ node, expected }) => node.currently.getHasValue(expected), values,
    );
  }

  /**
   * Returns the current 'hasAnyValue' status of all PageNodes managed by ValuePageElementGroup as a result structure.
   *
   * A PageNode's 'hasAnyValue' status is set to true if the PageNode has any value.
   *
   * @param filterMask can be used to skip the invocation of the `getHasAnyValue` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getHasAnyValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>) {
    return this._node.eachCompare<
      ValueElementNode<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>, ExtractValueBoolean<Content>
    > (
      isIValueElementNode, ({ node, filter }) => node.currently.getHasAnyValue(filter), filterMask, true,
    );
  }

  /**
   * Returns the current 'containsValue' status of all PageNodes managed by ValuePageElementGroup as a result structure.
   *
   * A PageNode's 'containsValue' status is set to true if its actual value contains the expected value.
   *
   * @param values the expected values used in the comparisons which set the 'containsValue' status
   */
  getContainsValue(values: ExtractValueStateChecker<Content>) {
    return this._node.eachCompare<
      ValueElementNode<Content>, ExtractValueStateChecker<Content>, ExtractValueBoolean<Content>
    > (
      isIValueElementNode, ({ node, expected }) => node.currently.getContainsValue(expected), values,
    );
  }

  /**
   * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup currently equal the expected
   * values.
   *
   * @param values the expected values supposed to equal the actual values
   */
  hasValue(values: ExtractValueStateChecker<Content>) {
    return this._node.eachCheck<ValueElementNode<Content>, ExtractValueStateChecker<Content>> (
      isIValueElementNode, ({ node, expected }) => node.currently.hasValue(expected), values,
    );
  }

  /**
   * Returns true if all PageNodes managed by ValuePageElementGroup currently have any value.
   *
   * @param filterMask can be used to skip the invocation of the `hasAnyValue` function for some or all managed
   * PageNodes
   */
  hasAnyValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>) {
    return this._node.eachCheck<ValueElementNode<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>> (
      isIValueElementNode, ({ node, filter }) => node.currently.hasAnyValue(filter), filterMask, true,
    );
  }

  /**
   * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup currently contain the expected
   * values.
   *
   * @param values the expected values supposed to be contained in the actual values
   */
  containsValue(values: ExtractValueStateChecker<Content>) {
    return this._node.eachCheck<ValueElementNode<Content>, ExtractValueStateChecker<Content>> (
      isIValueElementNode, ({ node, expected }) => node.currently.containsValue(expected), values,
    );
  }

  /**
   * returns the negated variants of ValuePageElementGroupCurrently's state check functions
   */
  get not() {
    return {...super.not,
      /**
       * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup currently do not equal the
       * expected values.
       *
       * @param values the expected values supposed not to equal the actual values
       */
      hasValue: (values: ExtractValueStateChecker<Content>) => {
        return this._node.eachCheck<ValueElementNode<Content>, ExtractValueStateChecker<Content>> (
          isIValueElementNode, ({ node, expected }) => node.currently.not.hasValue(expected), values,
        );
      },
      /**
       * Returns true if all PageNodes managed by ValuePageElementGroup currently do not have any value.
       *
       * @param filterMask can be used to skip the invocation of the `hasAnyValue` function for some or all managed
       * PageNodes
       */
      hasAnyValue: (filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>) => {
        return this._node.eachCheck<ValueElementNode<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>> (
          isIValueElementNode, ({ node, filter }) => node.currently.not.hasAnyValue(filter), filterMask, true,
        );
      },
      /**
       * Returns true if the actual values of all PageNodes managed by ValuePageElementGroup currently do not contain
       * the expected values.
       *
       * @param values the expected values supposed not to be contained in the actual values
       */
      containsValue: (values: ExtractValueStateChecker<Content>) => {
        return this._node.eachCheck<ValueElementNode<Content>, ExtractValueStateChecker<Content>> (
          isIValueElementNode, ({ node, expected }) => node.currently.not.containsValue(expected), values,
        );
      },
    };
  }
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
class ValuePageElementGroupWait<
  Store extends PageNodeStore,
  Content extends {[key: string] : Workflo.PageNode.IPageNode},
  GroupType extends ValuePageElementGroup<Store, Content>
> extends PageElementGroupWait<Store, Content, GroupType> {

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
  hasValue(values: ExtractValueStateChecker<Content>, opts?: Workflo.ITimeoutInterval) {
    return this._node.eachWait<ValueElementNode<Content>, ExtractValueStateChecker<Content>> (
      isIValueElementNode, ({ node, expected }) => node.wait.hasValue(expected, opts), values,
    );
  }

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
  hasAnyValue(opts: Workflo.ITimeoutInterval & Workflo.PageNode.ValueGroupFilterMask<Content> = {}) {
    const { filterMask, ...otherOpts } = opts;

    return this._node.eachWait<ValueElementNode<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>> (
      isIValueElementNode,
      ({ node, filter }) => node.wait.hasAnyValue({ filterMask: filter, ...otherOpts }),
      filterMask,
      true,
    );
  }

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
  containsValue(values: ExtractValueStateChecker<Content>, opts?: Workflo.ITimeoutInterval) {
    return this._node.eachWait<ValueElementNode<Content>, ExtractValueStateChecker<Content>> (
      isIValueElementNode, ({ node, expected }) => node.wait.containsValue(expected, opts), values,
    );
  }

  /**
   * returns the negated variants of ValuePageElementGroupWait's state check functions
   */
  get not() {
    return {...super.not,
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
      hasValue: (values: ExtractValueStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachWait<ValueElementNode<Content>, ExtractValueStateChecker<Content>> (
          isIValueElementNode, ({ node, expected }) => node.wait.hasValue(expected, opts), values,
        );
      },
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
      hasAnyValue: (opts: Workflo.ITimeoutInterval & Workflo.PageNode.ValueGroupFilterMask<Content> = {}) => {
        const { filterMask, ...otherOpts } = opts;

        return this._node.eachWait<ValueElementNode<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>> (
          isIValueElementNode,
          ({ node, filter }) => node.wait.hasAnyValue({ filterMask: filter, ...otherOpts }),
          filterMask,
          true,
        );
      },
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
      containsValue: (values: ExtractValueStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachWait<ValueElementNode<Content>, ExtractValueStateChecker<Content>> (
          isIValueElementNode, ({ node, expected }) => node.wait.containsValue(expected, opts), values,
        );
      },
    };
  }
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
class ValuePageElementGroupEventually<
  Store extends PageNodeStore,
  Content extends {[key: string] : Workflo.PageNode.IPageNode},
  GroupType extends ValuePageElementGroup<Store, Content>
> extends PageElementGroupEventually<Store, Content, GroupType> {

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
  hasValue(values: ExtractValueStateChecker<Content>, opts?: Workflo.ITimeoutInterval) {
    return this._node.eachCheck<ValueElementNode<Content>, ExtractValueStateChecker<Content>> (
      isIValueElementNode, ({ node, expected }) => node.eventually.hasValue(expected, opts), values,
    );
  }

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
  hasAnyValue(opts: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const { filterMask, ...otherOpts } = opts;

    return this._node.eachCheck<ValueElementNode<Content>> (
      isIValueElementNode,
      ({ node, filter }) => node.eventually.hasAnyValue({ filterMask: filter, ...otherOpts }),
      filterMask,
      true,
    );
  }

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
  containsValue(values: ExtractValueStateChecker<Content>, opts?: Workflo.ITimeoutInterval) {
    return this._node.eachCheck<ValueElementNode<Content>, ExtractValueStateChecker<Content>> (
      isIValueElementNode, ({ node, expected }) => node.eventually.containsValue(expected, opts), values,
    );
  }

  /**
   * returns the negated variants of ValuePageElementGroupEventually's state check functions
   */
  get not() {
    return {...super.not,
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
      hasValue: (values: ExtractValueStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachCheck<ValueElementNode<Content>, ExtractValueStateChecker<Content>> (
          isIValueElementNode, ({ node, expected }) => node.eventually.not.hasValue(expected, opts), values,
        );
      },
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
      hasAnyValue: (opts: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const { filterMask, ...otherOpts } = opts;

        return this._node.eachCheck<ValueElementNode<Content>> (
          isIValueElementNode,
          ({ node, filter }) => node.eventually.not.hasAnyValue({ filterMask: filter, ...otherOpts }),
          filterMask,
          true,
        );
      },
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
      containsValue: (values: ExtractValueStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachCheck<ValueElementNode<Content>, ExtractValueStateChecker<Content>> (
          isIValueElementNode, ({ node, expected }) => node.eventually.not.containsValue(expected, opts), values,
        );
      },
    };
  }
}

// type guards

/**
 * Returns true if the passed node supports all functions defined in IValueElementNode.
 *
 * @param node a PageNode
 */
export function isIValueElementNode<
  Content extends {[K in keyof Content] : Workflo.PageNode.IPageNode}
>(node: Workflo.PageNode.IPageNode | ValueElementNode<Content>): node is ValueElementNode<Content> {
  return typeof node['getValue'] === 'function' &&
  typeof node['setValue'] === 'function' &&
  typeof node.currently['getValue'] === 'function' &&
  typeof node.currently['hasValue'] === 'function' &&
  typeof node.currently['hasAnyValue'] === 'function' &&
  typeof node.currently['containsValue'] === 'function' &&
  typeof node.wait['hasValue'] === 'function' &&
  typeof node.wait['hasAnyValue'] === 'function' &&
  typeof node.wait['containsValue'] === 'function' &&
  typeof node.eventually['hasValue'] === 'function' &&
  typeof node.eventually['hasAnyValue'] === 'function' &&
  typeof node.eventually['containsValue'] === 'function';
}
