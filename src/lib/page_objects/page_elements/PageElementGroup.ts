import { PageNode, PageNodeCurrently } from '.';
import { isNullOrUndefined } from '../../helpers';
import { PageNodeStore } from '../stores';
import { IPageNodeOpts, PageNodeEventually, PageNodeWait } from './PageNode';

/**
 * Extracts the return value types of the `getText` functions of all PageNodes defined within a PageElementGroup's
 * content. For a PageElement, the extract return value type will be `string`.
 */
export type ExtractText<Content extends {[key: string]: Workflo.PageNode.IPageNode}> =
  Workflo.PageNode.ExtractText<Content>;

/**
 * Extracts the return value types of the `getText` functions of all PageNodes defined within a PageElementGroup's
 * content for state check functions. For a PageElement, the extracted return value type will be `string`.
 * Compared to `ExtractText`, this will allow a PageElementList to pass either a single string or
 * an array of strings.
 */
export type ExtractTextStateChecker<Content extends {[key: string]: Workflo.PageNode.IPageNode}> =
  Workflo.PageNode.ExtractTextStateChecker<Content>;

/**
 * Extracts the return value types of the `getIsEnabled` functions of all PageNodes defined within a PageElementGroup's
 * content. For a PageElement, the extract return value type will be `boolean`.
 */
export type ExtractBoolean<Content extends {[key: string]: Workflo.PageNode.IPageNode}> =
  Workflo.PageNode.ExtractBoolean<Content>;

/**
 * Extracts the return value types of the `getIsEnabled` functions of all PageNodes defined within a
 * PageElementGroup's content for state check functions. For a PageElement, the extracted return value
 * type will be `boolean`.
 * Compared to `ExtractBoolean`, this will allow the a PageElementList to pass either a single boolean or
 * an array of booleans.
 */
export type ExtractBooleanStateChecker<Content extends {[key: string]: Workflo.PageNode.IPageNode}> =
  Workflo.PageNode.ExtractBooleanStateChecker<Content>;

/**
 * This interface is implemented by PageElement, PageElementList, PageElementMap and PageElementGroup.
 *
 * IElementNode guarantees support of the following state retrieval functions:
 *
 * - getIsEnabled
 * - getText
 * - getDirectText
 * - getHasText
 * - getHasAnyText
 * - getContainsText
 * - getHasDirectText
 * - getHasAnyDirectText
 * - getContainsDirectText
 *
 * IElementNode guarantees support of the following state check functions:
 *
 * - exists
 * - isVisible
 * - isEnabled
 * - hasText
 * - hasAnyText
 * - containsText
 * - hasDirectText
 * - hasAnyDirectText
 * - containsDirectText
 */
type ElementNode<Content extends {[K in keyof Content] : Workflo.PageNode.IPageNode}> = Workflo.PageNode.IElementNode<
  ExtractText<Content> | ExtractTextStateChecker<Content>,
  ExtractBoolean<Content> | ExtractBooleanStateChecker<Content>,
  Workflo.PageNode.IGroupFilterMask<Content>
>;

/**
 * Describes the opts parameter passed to the constructor function of PageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 */
export interface IPageElementGroupOpts<
  Store extends PageNodeStore,
  Content extends {[key: string] : Workflo.PageNode.IPageNode}
> extends IPageNodeOpts<Store> {
  content: Content;
}

/**
 * A PageElementGroup manages PageNodes of arbitrary types and structure in its `Content` which can be accessed be
 * accessed via PageElementGroup's `$` accessor.
 *
 * It provides a convenient way to handle HTML forms, because it allows for state retrieval, state check, wait and
 * setter functions to be executed on all of its managed PageNodes with a single function call. This can greatly reduce
 * the code required to fill in a form.
 *
 * PageElementGroup does not force its managed PageNodes to support a certain function - it simply checks if a PageNode
 * implements the said function before invoking it. If a PageNode does not implement a function, the invocation of
 * this function is skipped for the affected PageNode and `undefined` will be written as the PageNode's result value.
 *
 * The result values returned by and the parameter values passed to functions which are executed on the managed
 * PageNodes are mapped to the structure of PageElementGroup's `Content` by replacing the `Content`'s original values
 * (PageNodes) with the result value or the parameter value of the function executed on PageNode. The keys of the
 * `Content` structure are never changed.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 */
export class PageElementGroup<
  Store extends PageNodeStore,
  Content extends {[K in keyof Content] : Workflo.PageNode.IPageNode}
> extends PageNode<Store>
implements ElementNode<Content> {
  protected _id: string;
  protected _$: Content;
  protected _lastDiff: Workflo.IDiff;

  readonly currently: PageElementGroupCurrently<Store, Content, this>;
  readonly wait: PageElementGroupWait<Store, Content, this>;
  readonly eventually: PageElementGroupEventually<Store, Content, this>;

  /**
   * A PageElementGroup manages PageNodes of arbitrary types and structure in its `Content` which can be accessed be
   * accessed via PageElementGroup's `$` accessor.
   *
   * It provides a convenient way to handle HTML forms, because it allows for state retrieval, state check, wait and
   * setter functions to be executed on all of its managed PageNodes with a single function call. This can greatly
   * reduce the code required to fill in a form.
   *
   * PageElementGroup does not force its managed PageNodes to support a certain function - it simply checks if a
   * PageNode implements the said function before invoking it. If a PageNode does not implement a function, the
   * invocation of this function is skipped for the affected PageNode and `undefined` will be written as the PageNode's
   * result value.
   *
   * The result values returned by and the parameter values passed to functions which are executed on the managed
   * PageNodes are mapped to the structure of PageElementGroup's `Content` by replacing the `Content`'s original values
   * (PageNodes) with the result value or the parameter value of the function executed on PageNode. The keys of the
   * `Content` structure are never changed.
   *
   * @param id a string which uniquely identifies a PageElementGroup in a PageNodeStore
   * @param opts the options used to configure PageElementGroup
   */
  constructor(id: string, {
    store,
    timeout,
    interval,
    content,
  }: IPageElementGroupOpts<Store, Content>) {
    super(id, { store, timeout, interval });

    this._id = id;
    this._$ = content;

    this.currently = new PageElementGroupCurrently(this);
    this.wait = new PageElementGroupWait(this);
    this.eventually = new PageElementGroupEventually(this);
  }

  /**
   * provides access to a PageElementGroup's `Content`
   */
  get $() {
    return this._$;
  }

  toJSON(): Workflo.IElementJSON {
    return {
      pageNodeType: this.constructor.name,
      nodeId: this._id,
    };
  }

  __getNodeId() {
    return this._id;
  }

  // GETTER FUNCTIONS

  /**
   * Returns the texts of all PageNodes managed by PageElementGroup as a result structure after executing the initial
   * waiting condition of each PageNode.
   *
   * @param filterMask can be used to skip the invocation of the `getText` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this.eachGet<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({ node, filter }) => node.getText(filter), filterMask,
    );
  }

  /**
   * Returns the direct texts of all PageNodes managed by PageElementGroup as a result structure after executing the
   * initial waiting condition of each PageNode.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children HTML elements.
   *
   * @param filterMask can be used to skip the invocation of the `getDirectText` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this.eachGet<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({ node, filter }) => node.getDirectText(filter), filterMask,
    );
  }

  /**
   * Returns the 'enabled' status of all PageNodes managed by PageElementGroup as a result structure after executing
   * the initial waiting condition of each PageNode.
   *
   * @param filterMask can be used to skip the invocation of the `getIsEnabled` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getIsEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this.eachGet<ElementNode<Content>, ExtractBooleanStateChecker<Content>> (
      isIElementNode, ({ node, filter }) => node.getIsEnabled(filter), filterMask,
    );
  }

  /**
   * Returns the 'hasText' status of all PageNodes managed by PageElementGroup as a result structure after executing
   * the initial waiting condition of each PageNode.
   *
   * A PageElement's 'hasText' status is set to true if its actual text equals the expected text.
   *
   * @param texts the expected texts used in the comparisons which set the 'hasText' status
   */
  getHasText(texts: ExtractTextStateChecker<Content>) {
    return this.eachCompare<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.getHasText(expected), texts,
    );
  }

  /**
   * Returns the 'hasAnyText' status of all PageNodes managed by PageElementGroup as a result structure after performing
   * the initial waiting condition of each PageNode.
   *
   * A PageElement's 'hasAnyText' status is set to true if the PageElement has any text.
   *
   * @param filterMask can be used to skip the invocation of the `getHasAnyText` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getHasAnyText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this.eachCompare<ElementNode<Content>> (
      isIElementNode, ({ node, filter }) => node.getHasAnyText(filter), filterMask, true,
    );
  }

  /**
   * Returns the 'containsText' status of all PageNodes managed by PageElementGroup as a result structure after
   * executing the initial waiting condition of each PageNode.
   *
   * A PageElement's 'containsText' status is set to true if its actual text contains the expected text.
   *
   * @param texts the expected texts used in the comparisons which set the 'containsText' status
   */
  getContainsText(texts: ExtractTextStateChecker<Content>) {
    return this.eachCompare<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.getContainsText(expected), texts,
    );
  }

  /**
   * Returns the 'hasDirectText' status of all PageNodes managed by PageElementGroup as a result structure after
   * executing the initial waiting condition of each PageNode.
   *
   * A PageElement's 'hasDirectText' status is set to true if its actual direct text equals the expected direct text.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children HTML elements.
   *
   * @param directTexts the expected direct texts used in the comparisons which set the 'hasDirectText' status
   */
  getHasDirectText(directTexts: ExtractTextStateChecker<Content>) {
    return this.eachCompare<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.getHasDirectText(expected), directTexts,
    );
  }

  /**
   * Returns the 'hasAnyDirectText' status of all PageNodes managed by PageElementGroup as a result structure after
   * performing the initial waiting condition of each PageNode.
   *
   * A PageElement's 'hasAnyDirectText' status is set to true if the PageElement has any direct text.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children HTML elements.
   *
   * @param filterMask can be used to skip the invocation of the `getHasAnyDirectText` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getHasAnyDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this.eachCompare<ElementNode<Content>> (
      isIElementNode, ({ node, filter }) => node.getHasAnyDirectText(filter), filterMask, true,
    );
  }

  /**
   * Returns the 'containsDirectText' status of all PageNodes managed by PageElementGroup as a result structure after
   * executing the initial waiting condition of each PageNode.
   *
   * A PageElement's 'containsDirectText' status is set to true if its actual direct text contains the expected direct
   * text.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children HTML elements.
   *
   * @param directTexts the expected direct texts used in the comparisons which set the 'containsDirectText' status
   */
  getContainsDirectText(directTexts: ExtractTextStateChecker<Content>) {
    return this.eachCompare<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.getContainsDirectText(expected), directTexts,
    );
  }

  // HELPER FUNCTIONS

  /**
   * Used to determine if a function of a managed PageNode should be invoked or if its invocation should be skipped
   * because the PageNode is not included by a filterMask.
   *
   * @param filter a filterMask entry that refers to a corresponding managed PageNode
   */
  protected _includedInFilter(value: any) {
    return !!value;
  }

  /**
   * Invokes a state check function for each PageNode in PageElementGroup's `Content` and returns a structure
   * of state check function results.
   *
   * @template NodeInterface needs to be implemented by all PageNodes for which `compareFunc` should be invoked
   * @template ExpectedType type of the structure of expected values
   * @template ResultType type of the structure of state check function results
   * @param supportsInterface this function checks if a PageNode implements the `NodeInterface` required to invoke
   * `compareFunc`
   * @param compareFunc is a state check function executed for each PageNode in PageElementGroup's `Content`. It is
   * passed an `args` object containing the PageNode and either the PageNode's expected value used by the state check
   * comparison or the PageNode's optional (sub) filter mask.
   * @param expected a structure of expected values used for the state check comparisons
   * @param isFilterMask If set to true, the `expected` parameter represents a filterMask which can be used to skip the
   * invocation of the state check function for some or all PageNodes.
   * @returns a structure of results of a state check function executed for each PageNode in PageElementGroup's
   * `Content`
   */
  eachCompare<
    NodeInterface,
    ExpectedType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>,
    ResultType extends Partial<Content> = Workflo.PageNode.ExtractBoolean<Content>,
  >(
    supportsInterface: (node: Workflo.PageNode.IPageNode) => boolean,
    compareFunc: (args: {
      node: NodeInterface, expected?: ExpectedType[keyof ExpectedType], filter?: ExpectedType[keyof ExpectedType],
    }) => any,
    expected?: ExpectedType,
    isFilterMask: boolean = false,
  ): ResultType {
    const result = {} as ResultType;

    for (const key in this._$) {
      const node = this._$[key] as any as NodeInterface;

      if (supportsInterface(this._$[key])) {
        if (isNullOrUndefined(expected)) {
          result[key] = compareFunc({ node });
        } else {
          const expectedValue = (expected as any)[key] as ExpectedType[keyof ExpectedType];

          if (isFilterMask) {
            if (this._includedInFilter(expectedValue)) {
              result[key] = compareFunc({ node, filter: expectedValue });
            }
          } else {
            if (typeof expectedValue !== 'undefined') {
              result[key] = compareFunc({ node, expected: expectedValue });
            }
          }
        }
      }
    }

    return result;
  }

  /**
   * Invokes a state check function for each PageNode in PageElementGroup's `Content` and returns true if the result of
   * each state check function invocation was true.
   *
   * @template NodeInterface needs to be implemented by all PageNodes for which `checkFunc` should be invoked
   * @template ExpectedType type of the structure of expected values
   * @param supportsInterface this function checks if a PageNode implements the `NodeInterface` required to invoke
   * `checkFunc`
   * @param checkFunc is a state check function executed for each PageNode in PageElementGroup's `Content`. It is
   * passed an `args` object containing the PageNode and either the PageNode's expected value used by the state check
   * comparison or the PageNode's optional (sub) filter mask.
   * @param expected a structure of expected values used for the state check comparisons
   * @param isFilterMask If set to true, the `expected` parameter represents a filterMask which can be used to skip the
   * invocation of the state check function for some or all PageNodes.
   * @returns a boolean indicating whether the result of each state check function invocation was true
   */
  eachCheck<
    NodeInterface,
    ExpectedType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>,
  >(
    supportsInterface: (node: Workflo.PageNode.IPageNode) => boolean,
    checkFunc: (args: {
      node: NodeInterface, expected?: ExpectedType[keyof ExpectedType], filter?: ExpectedType[keyof ExpectedType],
    }) => boolean,
    expected?: ExpectedType,
    isFilterMask: boolean = false,
  ): boolean {
    const diffs: Workflo.IDiffTree = {};

    for (const key in this._$) {
      const node = this._$[key] as any as NodeInterface;

      if (supportsInterface(this._$[key])) {
        if (isNullOrUndefined(expected)) {
          if (!checkFunc({ node })) {
            diffs[`.${key}`] = this._$[key].__lastDiff;
          }
        } else {
          const expectedValue = (expected as any)[key] as ExpectedType[keyof ExpectedType];

          if (isFilterMask) {
            if (this._includedInFilter(expectedValue)) {
              if (!checkFunc({ node, filter: expectedValue })) {
                diffs[`.${key}`] = this._$[key].__lastDiff;
              }
            }
          } else {
            if (typeof expectedValue !== 'undefined') {
              if (!checkFunc({ node, expected: expectedValue })) {
                diffs[`.${key}`] = this._$[key].__lastDiff;
              }
            }
          }
        }
      }
    }

    this._lastDiff = {
      tree: diffs,
    };

    return Object.keys(diffs).length === 0;
  }

  /**
   * Invokes a state retrieval function for each PageNode in PageElementGroup's `Content` and returns a structure
   * of state retrieval function results.
   *
   * @template NodeInterface needs to be implemented by all PageNodes for which `getFunc` should be invoked
   * @template ResultType type of the structure of state retrieval function results
   * @template FilterType type of a filter mask which can be used to skip the invocation of the state retrieval function
   * for some or all PageNodes
   * @param supportsInterface this function checks if a PageNode implements the `NodeInterface` required to invoke
   * `getFunc`
   * @param getFunc is a state retrieval function executed for each PageNode in PageElementGroup's `Content`. It is
   * passed an `args` object containing the PageNode and the PageNode's optional (sub) filter mask.
   * @param filterMask can be used to skip the invocation of the state retrieval function for some or all PageNodes.
   * The results of skipped function invocations are not included in the total results structure.
   * @returns a structure of results of a state retrieval function executed for each PageNode in PageElementGroup's
   * `Content`
   */
  eachGet<
    NodeInterface,
    ResultType extends Partial<Content>,
    FilterType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>
  >(
    supportsInterface: (node: Workflo.PageNode.IPageNode) => boolean,
    getFunc: (
      args: {node: NodeInterface, filter?: FilterType[keyof FilterType]},
    ) => any,
    filterMask?: FilterType,
  ): ResultType {
    const result = {} as ResultType;

    for (const key in this.$) {
      if (supportsInterface(this.$[key])) {
        const node = this.$[key] as any as NodeInterface;

        if (isNullOrUndefined(filterMask)) {
          result[key] = getFunc({ node });
        } else {
          const filter = filterMask[key];

          if (this._includedInFilter(filter)) {
            result[key] = getFunc({ node, filter });
          }
        }
      }
    }

    return result;
  }

   /**
   * Invokes a wait function for each PageNode in PageElementGroup's `Content`.
   *
   * @template NodeInterface needs to be implemented by all PageNodes for which `waitFunc` should be invoked
   * @template ExpectedType type of the structure of expected values
   * @param supportsInterface this function checks if a PageNode implements the `NodeInterface` required to invoke
   * `waitFunc`
   * @param waitFunc is a wait function executed for each PageNode in PageElementGroup's `Content`. It is
   * passed an `args` object containing the PageNode and either the PageNode's expected value used by the wait condition
   * or the PageNode's optional (sub) filter mask.
   * @param expected a structure of expected values used for the wait conditions
   * @param isFilterMask If set to true, the `expected` parameter represents a filterMask which can be used to skip the
   * invocation of the wait function for some or all PageNodes.
   * @returns this (an instance of PageElementGroup)
   */
  eachWait<
    NodeInterface,
    ExpectedType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>
  >(
    supportsInterface: (node: Workflo.PageNode.IPageNode) => boolean,
    waitFunc: (args: {
      node: NodeInterface, expected?: ExpectedType[keyof ExpectedType], filter?: ExpectedType[keyof ExpectedType],
    }) => NodeInterface,
    expected?: ExpectedType,
    isFilterMask: boolean = false,
  ): this {
    for (const key in this._$) {
      const node = this._$[key] as any as NodeInterface;

      if (supportsInterface(this._$[key])) {
        if (isNullOrUndefined(expected)) {
          waitFunc({ node });
        } else {
          const expectedValue = expected[key];

          if (isFilterMask) {
            if (this._includedInFilter(expectedValue)) {
              waitFunc({ node, filter: expectedValue });
            }
          } else {
            if (typeof expectedValue !== 'undefined') {
              waitFunc({ node, expected: expectedValue });
            }
          }
        }
      }
    }

    return this;
  }

  /**
   * Invokes an action for each PageNode in PageElementGroup's `Content`.
   *
   * @template NodeInterface needs to be implemented by all PageNodes for which `action` should be invoked
   * @template FilterType type of a filter mask which can be used to skip the invocation of an action
   * for some or all PageNodes
   * @param supportsInterface this function checks if a PageNode implements the `NodeInterface` required to invoke
   * `action`
   * @param action an action executed for each PageNode in PageElementGroup's `Content`. It is
   * passed an `args` object containing the PageNode and the PageNode's optional (sub) filter mask.
   * @param filterMask can be used to skip the invocation of an action for some or all PageNodes.
   * @returns this (an instance of PageElementGroup)
   */
  eachDo<
    NodeInterface,
    FilterType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>
  >(
    supportsInterface: (node: Workflo.PageNode.IPageNode) => boolean,
    action: (args: {
      node: NodeInterface, filter?: FilterType[keyof FilterType],
    }) => any,
    filterMask?: FilterType,
  ): this {
    for (const key in this._$) {
      const node = this._$[key] as any as NodeInterface;

      if (supportsInterface(this._$[key])) {
        if (isNullOrUndefined(filterMask)) {
          action({ node });
        } else {
          const filter = filterMask[key];

          if (this._includedInFilter(filter)) {
            action({ node, filter });
          }
        }
      }
    }

    return this;
  }

  /**
   * Invokes a setter function for each PageNode in PageElementGroup's `Content`.
   *
   * @template NodeInterface needs to be implemented by all PageNodes for which `setFunc` should be invoked
   * @template ValuesType type of the structure of setter values
   * @param supportsInterface this function checks if a PageNode implements the `NodeInterface` required to invoke
   * `setFunc`
   * @param setFunc a setter function executed for each PageNode in PageElementGroup's `Content`. It is
   * passed an `args` object containing the PageNode and the PageNode's value.
   * @param values a structure of setter values
   * @returns this (an instance of PageElementGroup)
   */
  eachSet<
    NodeInterface extends Workflo.PageNode.IPageNode,
    ValuesType extends Partial<Content>,
  >(
    supportsInterface: (node: Workflo.PageNode.IPageNode) => boolean,
    setFunc: (
      args: {node: NodeInterface, value?: ValuesType[keyof ValuesType]},
    ) => NodeInterface,
    values: ValuesType,
  ): this {
    for (const key in this._$) {
      const node = this._$[key] as any as NodeInterface;

      if (supportsInterface(this._$[key])) {
        if (values) {
          if (typeof values[key] !== 'undefined') {
            setFunc({ node, value: values[key] });
          }
        } else {
          setFunc({ node });
        }
      }
    }

    return this;
  }
}

/**
 * This class defines all `currently` functions of PageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 * @template GroupType type of the PageElementGroup for which PageElementGroupCurrently defines all `currently`
 * functions
 */
export class PageElementGroupCurrently<
  Store extends PageNodeStore,
  Content extends {[key: string] : Workflo.PageNode.IPageNode},
  GroupType extends PageElementGroup<Store, Content>
> extends PageNodeCurrently<Store, GroupType> {

  /**
   * Returns the current 'exists' status of all PageNodes managed by PageElementGroup as a result structure.
   *
   * @param filterMask can be used to skip the invocation of the `getExists` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getExists(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractBooleanStateChecker<Content>> (
      isIElementNode, ({ node, filter }) => node.currently.getExists(filter), filterMask,
    );
  }

  /**
   * Returns the current 'visible' status of all PageNodes managed by PageElementGroup as a result structure.
   *
   * @param filterMask can be used to skip the invocation of the `getIsVisible` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getIsVisible(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractBooleanStateChecker<Content>> (
      isIElementNode, ({ node, filter }) => node.currently.getIsVisible(filter), filterMask,
    );
  }

  /**
   * Returns the current 'enabled' status of all PageNodes managed by PageElementGroup as a result structure.
   *
   * @param filterMask can be used to skip the invocation of the `getIsEnabled` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getIsEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractBooleanStateChecker<Content>> (
      isIElementNode, ({ node, filter }) => node.currently.getIsEnabled(filter), filterMask,
    );
  }

  /**
   * Returns the current 'hasText' status of all PageNodes managed by PageElementGroup as a result structure.
   *
   * A PageNode's 'hasText' status is set to true if its actual text equals the expected text.
   *
   * @param texts the expected texts used in the comparisons which set the 'hasText' status
   */
  getHasText(texts: ExtractTextStateChecker<Content>) {
    return this._node.eachCompare<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.currently.getHasText(expected), texts,
    );
  }

  /**
   * Returns the current 'hasAnyText' status of all PageNodes managed by PageElementGroup as a result structure.
   *
   * A PageNode's 'hasAnyText' status is set to true if the PageNode has any text.
   *
   * @param filterMask can be used to skip the invocation of the `getHasAnyText` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getHasAnyText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCompare<ElementNode<Content>> (
      isIElementNode, ({ node, filter }) => node.currently.getHasAnyText(filter), filterMask, true,
    );
  }

  /**
   * Returns the current 'containsText' status of all PageNodes managed by PageElementGroup as a result structure.
   *
   * A PageNode's 'containsText' status is set to true if its actual text contains the expected text.
   *
   * @param texts the expected texts used in the comparisons which set the 'containsText' status
   */
  getContainsText(texts: ExtractTextStateChecker<Content>) {
    return this._node.eachCompare<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.currently.getContainsText(expected), texts,
    );
  }

  /**
   * Returns the current 'hasDirectText' status of all PageNodes managed by PageElementGroup as a result structure.
   *
   * A PageNode's 'hasDirectText' status is set to true if its actual direct text equals the expected direct text.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children HTML elements.
   *
   * @param directTexts the expected direct texts used in the comparisons which set the 'hasDirectText' status
   */
  getHasDirectText(directTexts: ExtractTextStateChecker<Content>) {
    return this._node.eachCompare<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.currently.getHasDirectText(expected), directTexts,
    );
  }

  /**
   * Returns the current 'hasAnyDirectText' status of all PageNodes managed by PageElementGroup as a result structure.
   *
   * A PageNode's 'hasAnyDirectText' status is set to true if the PageNode has any direct text.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children HTML elements.
   *
   * @param filterMask can be used to skip the invocation of the `getHasAnyDirectText` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getHasAnyDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCompare<ElementNode<Content>> (
      isIElementNode, ({ node, filter }) => node.currently.getHasAnyDirectText(filter), filterMask, true,
    );
  }

  /**
   * Returns the current 'containsDirectText' status of all PageNodes managed by PageElementGroup as a result structure.
   *
   * A PageNode's 'containsDirectText' status is set to true if its actual direct text contains the expected direct
   * text.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children HTML elements.
   *
   * @param directTexts the expected direct texts used in the comparisons which set the 'containsDirectText' status
   */
  getContainsDirectText(directTexts: ExtractTextStateChecker<Content>) {
    return this._node.eachCompare<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.currently.getContainsDirectText(expected), directTexts,
    );
  }

  /**
   * Returns the current texts of all PageNodes managed by PageElementGroup as a result structure.
   *
   * @param filterMask can be used to skip the invocation of the `getText` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({ node, filter }) => node.currently.getText(filter), filterMask,
    );
  }

  /**
   * Returns the current direct texts of all PageNodes managed by PageElementGroup as a result structure.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children HTML elements.
   *
   * @param filterMask can be used to skip the invocation of the `getDirectText` function for some or all managed
   * PageNodes. The results of skipped function invocations are not included in the total results structure.
   */
  getDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({ node, filter }) => node.currently.getDirectText(filter), filterMask,
    );
  }

  /**
   * Returns true if all PageNodes managed by PageElementGroup currently exist.
   *
   * @param filterMask can be used to skip the invocation of the `exists` function for some or all managed
   * PageNodes
   */
  exists(filterMask?: Workflo.PageNode.GroupFilterMaskExists<Content>) {
    return this._node.eachCheck<
      ElementNode<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
    > (
      isIElementNode, ({ node, filter }) => node.currently.exists(filter), filterMask, true,
    );
  }

  /**
   * Returns true if all PageNodes managed by PageElementGroup are currently visible.
   *
   * @param filterMask can be used to skip the invocation of the `isVisible` function for some or all managed
   * PageNodes
   */
  isVisible(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCheck<ElementNode<Content>> (
      isIElementNode, ({ node, filter }) => node.currently.isVisible(filter), filterMask, true,
    );
  }

  /**
   * Returns true if all PageNodes managed by PageElementGroup are currently enabled.
   *
   * @param filterMask can be used to skip the invocation of the `isEnabled` function for some or all managed
   * PageNodes
   */
  isEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCheck<ElementNode<Content>> (
      isIElementNode, ({ node, filter }) => node.currently.isEnabled(filter), filterMask, true,
    );
  }

  /**
   * Returns true if the actual texts of all PageNodes managed by PageElementGroup currently equal the expected texts.
   *
   * @param texts the expected texts supposed to equal the actual texts
   */
  hasText(texts: ExtractTextStateChecker<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.currently.hasText(expected), texts,
    );
  }

  /**
   * Returns true if all PageNodes managed by PageElementGroup currently have any text.
   *
   * @param filterMask can be used to skip the invocation of the `hasAnyText` function for some or all managed
   * PageNodes
   */
  hasAnyText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCheck<ElementNode<Content>> (
      isIElementNode, ({ node, filter }) => node.currently.hasAnyText(filter), filterMask, true,
    );
  }

  /**
   * Returns true if the actual texts of all PageNodes managed by PageElementGroup currently contain the expected texts.
   *
   * @param texts the expected texts supposed to be contained in the actual texts
   */
  containsText(texts: ExtractTextStateChecker<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.currently.containsText(expected), texts,
    );
  }

  /**
   * Returns true if the actual direct texts of all PageNodes managed by PageElementGroup currently equal the expected
   * direct texts.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children HTML elements.
   *
   * @param directTexts the expected direct texts supposed to equal the actual direct texts
   */
  hasDirectText(directTexts: ExtractTextStateChecker<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.currently.hasDirectText(expected), directTexts,
    );
  }

  /**
   * Returns true if all PageNodes managed by PageElementGroup currently have any direct text.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children HTML elements.
   *
   * @param filterMask can be used to skip the invocation of the `hasAnyDirectText` function for some or all managed
   * PageNodes
   */
  hasAnyDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCheck<ElementNode<Content>> (
      isIElementNode, ({ node, filter }) => node.currently.hasAnyDirectText(filter), filterMask, true,
    );
  }

  /**
   * Returns true if the actual direct texts of all PageNodes managed by PageElementGroup currently contain the
   * expected direct texts.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children HTML elements.
   *
   * @param directTexts the expected direct texts supposed to be contained in the actual direct texts
   */
  containsDirectText(directTexts: ExtractTextStateChecker<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.currently.containsDirectText(expected), directTexts,
    );
  }

  /**
   * returns the negated variants of PageElementGroupCurrently's state check functions
   */
  get not() {
    return {
      /**
       * Returns true if all PageNodes managed by PageElementGroup currently do not exist.
       *
       * @param filterMask can be used to skip the invocation of the `exists` function for some or all managed
       * PageNodes
       */
      exists: (filterMask?: Workflo.PageNode.GroupFilterMaskExists<Content>) => {
        return this._node.eachCheck<
          ElementNode<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
        > (
          isIElementNode, ({ node, filter }) => node.currently.not.exists(filter), filterMask, true,
        );
      },
      /**
       * Returns true if all PageNodes managed by PageElementGroup are currently not visible.
       *
       * @param filterMask can be used to skip the invocation of the `isVisible` function for some or all managed
       * PageNodes
       */
      isVisible: (filterMask?: Workflo.PageNode.GroupFilterMask<Content>) => {
        return this._node.eachCheck<ElementNode<Content>> (
          isIElementNode, ({ node, filter }) => node.currently.not.isVisible(filter), filterMask, true,
        );
      },
      /**
       * Returns true if all PageNodes managed by PageElementGroup are currently not enabled.
       *
       * @param filterMask can be used to skip the invocation of the `isEnabled` function for some or all managed
       * PageNodes
       */
      isEnabled: (filterMask?: Workflo.PageNode.GroupFilterMask<Content>) => {
        return this._node.eachCheck<ElementNode<Content>> (
          isIElementNode, ({ node, filter }) => node.currently.not.isEnabled(filter), filterMask, true,
        );
      },
      /**
       * Returns true if the actual texts of all PageNodes managed by PageElementGroup currently do not equal the
       * expected texts.
       *
       * @param texts the expected texts supposed not to equal the actual texts
       */
      hasText: (texts: ExtractTextStateChecker<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
          isIElementNode, ({ node, expected }) => node.currently.not.hasText(expected), texts,
        );
      },
      /**
       * Returns true if all PageNodes managed by PageElementGroup currently do not have any text.
       *
       * @param filterMask can be used to skip the invocation of the `hasAnyText` function for some or all managed
       * PageNodes
       */
      hasAnyText: (filterMask?: Workflo.PageNode.GroupFilterMask<Content>) => {
        return this._node.eachCheck<ElementNode<Content>> (
          isIElementNode, ({ node, filter }) => node.currently.not.hasAnyText(filter), filterMask, true,
        );
      },
      /**
       * Returns true if the actual texts of all PageNodes managed by PageElementGroup currently do not contain the
       * expected texts.
       *
       * @param texts the expected texts supposed not to be contained in the actual texts
       */
      containsText: (texts: ExtractTextStateChecker<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
          isIElementNode, ({ node, expected }) => node.currently.not.containsText(expected), texts,
        );
      },
      /**
       * Returns true if the actual direct texts of all PageNodes managed by PageElementGroup currently do not equal
       * the expected direct texts.
       *
       * A direct text is a text that resides on the level directly below the selected HTML element.
       * It does not include any text of the HTML element's nested children HTML elements.
       *
       * @param directTexts the expected direct texts supposed not to equal the actual direct texts
       */
      hasDirectText: (directTexts: ExtractTextStateChecker<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
          isIElementNode, ({ node, expected }) => node.currently.not.hasDirectText(expected), directTexts,
        );
      },
      /**
       * Returns true if all PageNodes managed by PageElementGroup currently do not have any direct text.
       *
       * A direct text is a text that resides on the level directly below the selected HTML element.
       * It does not include any text of the HTML element's nested children HTML elements.
       *
       * @param filterMask can be used to skip the invocation of the `hasAnyDirectText` function for some or all managed
       * PageNodes
       */
      hasAnyDirectText: (filterMask?: Workflo.PageNode.GroupFilterMask<Content>) => {
        return this._node.eachCheck<ElementNode<Content>> (
          isIElementNode, ({ node, filter }) => node.currently.not.hasAnyDirectText(filter), filterMask, true,
        );
      },
      /**
       * Returns true if the actual direct texts of all PageNodes managed by PageElementGroup currently do not contain
       * the expected direct texts.
       *
       * A direct text is a text that resides on the level directly below the selected HTML element.
       * It does not include any text of the HTML element's nested children HTML elements.
       *
       * @param directTexts the expected direct texts supposed not to be contained in the actual direct texts
       */
      containsDirectText: (directTexts: ExtractTextStateChecker<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
          isIElementNode, ({ node, expected }) => node.currently.not.containsDirectText(expected), directTexts,
        );
      },
    };
  }
}

/**
 * This class defines all `wait` functions of PageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 * @template GroupType type of the PageElementGroup for which PageElementGroupWait defines all `wait` functions
 */
export class PageElementGroupWait<
  Store extends PageNodeStore,
  Content extends {[key: string] : Workflo.PageNode.IPageNode},
  GroupType extends PageElementGroup<Store, Content>
> extends PageNodeWait<Store, GroupType> {

  /**
   * Waits for all PageNodes managed by PageElementGroup to exist.
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some
   * or all managed PageNodes and the `timeout` within which the condition is expected to be met
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   *
   * @returns this (an instance of PageElementGroup)
   */
  exists(opts: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMaskExists<Content> = {}) {
    const { filterMask, ...otherOpts } = opts;

    return this._node.eachWait<
      ElementNode<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
    > (
      isIElementNode, ({ node, filter }) => node.wait.exists({ filterMask: filter, ...otherOpts }), filterMask, true,
    );
  }

  /**
   * Waits for all PageNodes managed by PageElementGroup to be visible.
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for some
   * or all managed PageNodes and the `timeout` within which the condition is expected to be met
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   *
   * @returns this (an instance of PageElementGroup)
   */
  isVisible(opts: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const { filterMask, ...otherOpts } = opts;

    return this._node.eachWait<ElementNode<Content>> (
      isIElementNode, ({ node, filter }) => node.wait.isVisible({ filterMask: filter, ...otherOpts }), filterMask, true,
    );
  }

  /**
   * Waits for all PageNodes managed by PageElementGroup to be enabled.
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for some
   * or all managed PageNodes and the `timeout` within which the condition is expected to be met
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   *
   * @returns this (an instance of PageElementGroup)
   */
  isEnabled(opts: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const { filterMask, ...otherOpts } = opts;

    return this._node.eachWait<ElementNode<Content>> (
      isIElementNode, ({ node, filter }) => node.wait.isEnabled({ filterMask: filter, ...otherOpts }), filterMask, true,
    );
  }

  /**
   * Waits for the actual texts of all PageNodes managed by PageElementGroup to equal the expected texts.
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * @param texts the expected texts supposed to equal the actual texts
   * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
   * to check it
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   * If no `interval` is specified, a PageElement's default interval is used.
   *
   * @returns this (an instance of PageElementGroup)
   */
  hasText(texts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.wait.hasText(expected, opts), texts,
    );
  }

  /**
   * Waits for all PageNodes managed by PageElementGroup to have any text.
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyText` function for some
   * or all managed PageNodes, the `timeout` within which the condition is expected to be met and the `interval` used
   * to check it
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   * If no `interval` is specified, a PageElement's default interval is used.
   *
   * @returns this (an instance of PageElementGroup)
   */
  hasAnyText(opts: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const { filterMask, ...otherOpts } = opts;

    return this._node.eachWait<ElementNode<Content>> (
      isIElementNode,
      ({ node, filter }) => node.wait.hasAnyText({ filterMask: filter, ...otherOpts }),
      filterMask,
      true,
    );
  }

  /**
   * Waits for the actual texts of all PageNodes managed by PageElementGroup to contain the expected texts.
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * @param texts the expected texts supposed to be contained in the actual texts
   * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
   * to check it
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   * If no `interval` is specified, a PageElement's default interval is used.
   *
   * @returns this (an instance of PageElementGroup)
   */
  containsText(texts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.wait.containsText(expected, opts), texts,
    );
  }

  /**
   * Waits for the actual direct texts of all PageNodes managed by PageElementGroup to equal the expected direct texts.
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children HTML elements.
   *
   * @param directTexts the expected direct texts supposed to equal the actual direct texts
   * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
   * to check it
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   * If no `interval` is specified, a PageElement's default interval is used.
   *
   * @returns this (an instance of PageElementGroup)
   */
  hasDirectText(directTexts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.wait.hasDirectText(expected, opts), directTexts,
    );
  }

  /**
   * Waits for all PageNodes managed by PageElementGroup to have any direct text.
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children HTML elements.
   *
   * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyDirectText` function for
   * some or all managed PageNodes, the `timeout` within which the condition is expected to be met and the `interval`
   * used to check it
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   * If no `interval` is specified, a PageElement's default interval is used.
   *
   * @returns this (an instance of PageElementGroup)
   */
  hasAnyDirectText(opts: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const { filterMask, ...otherOpts } = opts;

    return this._node.eachWait<ElementNode<Content>> (
      isIElementNode,
      ({ node, filter }) => node.wait.hasAnyDirectText({ filterMask: filter, ...otherOpts }),
      filterMask,
      true,
    );
  }

  /**
   * Waits for the actual direct texts of all PageNodes managed by PageElementGroup to contain the expected direct
   * texts.
   *
   * Throws an error if the condition is not met within a specific timeout.
   *
   * A direct text is a text that resides on the level directly below the selected HTML element.
   * It does not include any text of the HTML element's nested children HTML elements.
   *
   * @param directTexts the expected direct texts supposed to be contained in the actual direct texts
   * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
   * to check it
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   * If no `interval` is specified, a PageElement's default interval is used.
   *
   * @returns this (an instance of PageElementGroup)
   */
  containsDirectText(directTexts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.wait.containsDirectText(expected, opts), directTexts,
    );
  }

  /**
   * returns the negated variants of PageElementGroupWait's state check functions
   */
  get not() {
    return {
      /**
       * Waits for all PageNodes managed by PageElementGroup not to exist.
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for
       * some or all managed PageNodes and the `timeout` within which the condition is expected to be met
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       *
       * @returns this (an instance of PageElementGroup)
       */
      exists: (opts: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMaskExists<Content> = {}) => {
        const { filterMask, ...otherOpts } = opts;

        return this._node.eachWait<
          ElementNode<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
        > (
          isIElementNode,
          ({ node, filter }) => node.wait.not.exists({ filterMask: filter, ...otherOpts }),
          filterMask,
          true,
        );
      },
      /**
       * Waits for all PageNodes managed by PageElementGroup not to be visible.
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for
       * some or all managed PageNodes and the `timeout` within which the condition is expected to be met
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       *
       * @returns this (an instance of PageElementGroup)
       */
      isVisible: (opts: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const { filterMask, ...otherOpts } = opts;

        return this._node.eachWait<ElementNode<Content>> (
          isIElementNode,
          ({ node, filter }) => node.wait.not.isVisible({ filterMask: filter, ...otherOpts }),
          filterMask,
          true,
        );
      },
      /**
       * Waits for all PageNodes managed by PageElementGroup not to be enabled.
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for
       * some or all managed PageNodes and the `timeout` within which the condition is expected to be met
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       *
       * @returns this (an instance of PageElementGroup)
       */
      isEnabled: (opts: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const { filterMask, ...otherOpts } = opts;

        return this._node.eachWait<ElementNode<Content>> (
          isIElementNode,
          ({ node, filter }) => node.wait.not.isEnabled({ filterMask: filter, ...otherOpts }),
          filterMask,
          true,
        );
      },
      /**
       * Waits for the actual texts of all PageNodes managed by PageElementGroup not to equal the expected texts.
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * @param texts the expected texts supposed not to equal the actual texts
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
       * to check it
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       * If no `interval` is specified, a PageElement's default interval is used.
       *
       * @returns this (an instance of PageElementGroup)
       */
      hasText: (texts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractTextStateChecker<Content>> (
          isIElementNode, ({ node, expected }) => node.wait.not.hasText(expected, opts), texts,
        );
      },
      /**
       * Waits for all PageNodes managed by PageElementGroup not to have any text.
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyText` function for
       * some or all managed PageNodes, the `timeout` within which the condition is expected to be met and the
       * `interval` used to check it
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       * If no `interval` is specified, a PageElement's default interval is used.
       *
       * @returns this (an instance of PageElementGroup)
       */
      hasAnyText: (opts: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const { filterMask, ...otherOpts } = opts;

        return this._node.eachWait<ElementNode<Content>> (
          isIElementNode,
          ({ node, filter }) => node.wait.not.hasAnyText({ filterMask: filter, ...otherOpts }),
          filterMask,
          true,
        );
      },
      /**
       * Waits for the actual texts of all PageNodes managed by PageElementGroup not to contain the expected texts.
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * @param texts the expected texts supposed not to be contained in the actual texts
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
       * to check it
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       * If no `interval` is specified, a PageElement's default interval is used.
       *
       * @returns this (an instance of PageElementGroup)
       */
      containsText: (texts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractTextStateChecker<Content>> (
          isIElementNode, ({ node, expected }) => node.wait.not.containsText(expected, opts), texts,
        );
      },
      /**
       * Waits for the actual direct texts of all PageNodes managed by PageElementGroup not to equal the expected
       * direct texts.
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * A direct text is a text that resides on the level directly below the selected HTML element.
       * It does not include any text of the HTML element's nested children HTML elements.
       *
       * @param directTexts the expected direct texts not supposed to equal the actual direct texts
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
       * to check it
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       * If no `interval` is specified, a PageElement's default interval is used.
       *
       * @returns this (an instance of PageElementGroup)
       */
      hasDirectText: (directTexts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractTextStateChecker<Content>> (
          isIElementNode, ({ node, expected }) => node.wait.not.hasDirectText(expected, opts), directTexts,
        );
      },
      /**
       * Waits for all PageNodes managed by PageElementGroup not to have any direct text.
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * A direct text is a text that resides on the level directly below the selected HTML element.
       * It does not include any text of the HTML element's nested children HTML elements.
       *
       * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyDirectText` function
       * for some or all managed PageNodes, the `timeout` within which the condition is expected to be met and the
       * `interval` used to check it
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       * If no `interval` is specified, a PageElement's default interval is used.
       *
       * @returns this (an instance of PageElementGroup)
       */
      hasAnyDirectText: (opts: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const { filterMask, ...otherOpts } = opts;

        return this._node.eachWait<ElementNode<Content>> (
          isIElementNode,
          ({ node, filter }) => node.wait.not.hasAnyDirectText({ filterMask: filter, ...otherOpts }),
          filterMask,
          true,
        );
      },
      /**
       * Waits for the actual direct texts of all PageNodes managed by PageElementGroup not to contain the expected
       * direct texts.
       *
       * Throws an error if the condition is not met within a specific timeout.
       *
       * A direct text is a text that resides on the level directly below the selected HTML element.
       * It does not include any text of the HTML element's nested children HTML elements.
       *
       * @param directTexts the expected direct texts supposed not to be contained in the actual direct texts
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
       * to check it
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       * If no `interval` is specified, a PageElement's default interval is used.
       *
       * @returns this (an instance of PageElementGroup)
       */
      containsDirectText: (directTexts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractTextStateChecker<Content>> (
          isIElementNode, ({ node, expected }) => node.wait.not.containsDirectText(expected, opts), directTexts,
        );
      },
    };
  }
}

/**
 * This class defines all `eventually` functions of PageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 * @template GroupType type of the PageElementGroup for which PageElementGroupEventually defines all `eventually`
 * functions
 */
export class PageElementGroupEventually<
  Store extends PageNodeStore,
  Content extends {[key: string] : Workflo.PageNode.IPageNode},
  GroupType extends PageElementGroup<Store, Content>
> extends PageNodeEventually<Store, GroupType> {

  /**
   * Returns true if all PageNodes managed by PageElementGroup eventually exist within a specific timeout.
   *
   * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some
   * or all managed PageNodes and the `timeout` within which the condition is expected to be met
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   */
  exists(opts: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMaskExists<Content> = {}) {
    const { filterMask, ...otherOpts } = opts;

    return this._node.eachCheck<
      ElementNode<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
    > (
      isIElementNode,
      ({ node, filter }) => node.eventually.exists({ filterMask: filter, ...otherOpts }),
      filterMask,
      true,
    );
  }

  /**
   * Returns true if all PageNodes managed by PageElementGroup eventually are visible within a specific timeout.
   *
   * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for some
   * or all managed PageNodes and the `timeout` within which the condition is expected to be met
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   */
  isVisible(opts: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const { filterMask, ...otherOpts } = opts;

    return this._node.eachCheck<ElementNode<Content>, ExtractBooleanStateChecker<Content>> (
      isIElementNode,
      ({ node, filter }) => node.eventually.isVisible({ filterMask: filter, ...otherOpts }),
      filterMask,
      true,
    );
  }

  /**
   * Returns true if all PageNodes managed by PageElementGroup eventually are enabled within a specific timeout.
   *
   * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for some
   * or all managed PageNodes and the `timeout` within which the condition is expected to be met
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   */
  isEnabled(opts: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const { filterMask, ...otherOpts } = opts;

    return this._node.eachCheck<ElementNode<Content>, ExtractBooleanStateChecker<Content>> (
      isIElementNode,
      ({ node, filter }) => node.eventually.isEnabled({ filterMask: filter, ...otherOpts }),
      filterMask,
      true,
    );
  }

  /**
   * Returns true if the actual texts of all PageNodes managed by PageElementGroup eventually equal the expected texts
   * within a specific timeout.
   *
   * @param texts the expected texts supposed to equal the actual texts
   * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
   * to check it
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   * If no `interval` is specified, a PageElement's default interval is used.
   */
  hasText(texts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.eventually.hasText(expected, opts), texts,
    );
  }

  /**
   * Returns true if all PageNodes managed by PageElementGroup eventually have any text within a specific timeout.
   *
   * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyText` function for some
   * or all managed PageNodes, the `timeout` within which the condition is expected to be met and the `interval` used
   * to check it
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   * If no `interval` is specified, a PageElement's default interval is used.
   */
  hasAnyText(opts: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const { filterMask, ...otherOpts } = opts;

    return this._node.eachCheck<ElementNode<Content>, ExtractBooleanStateChecker<Content>> (
      isIElementNode,
      ({ node, filter }) => node.eventually.hasAnyText({ filterMask: filter, ...otherOpts }),
      filterMask,
      true,
    );
  }

  /**
   * Returns true if the actual texts of all PageNodes managed by PageElementGroup eventually contain the expected texts
   * within a specific timeout.
   *
   * @param texts the expected texts supposed to be contained in the actual texts
   * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
   * to check it
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   * If no `interval` is specified, a PageElement's default interval is used.
   */
  containsText(texts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.eventually.containsText(expected, opts), texts,
    );
  }

  /**
   * Returns true if the actual direct texts of all PageNodes managed by PageElementGroup eventually equal the expected
   * direct texts within a specific timeout.
   *
   * @param directTexts the expected direct texts supposed to equal the actual direct texts
   * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
   * to check it
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   * If no `interval` is specified, a PageElement's default interval is used.
   */
  hasDirectText(directTexts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.eventually.hasDirectText(expected, opts), directTexts,
    );
  }

  /**
   * Returns true if all PageNodes managed by PageElementGroup eventually have any direct text within a specific
   * timeout.
   *
   * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyDirectText` function for
   * some or all managed PageNodes, the `timeout` within which the condition is expected to be met and the `interval`
   * used to check it
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   * If no `interval` is specified, a PageElement's default interval is used.
   */
  hasAnyDirectText(opts: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const { filterMask, ...otherOpts } = opts;

    return this._node.eachCheck<ElementNode<Content>, ExtractBooleanStateChecker<Content>> (
      isIElementNode,
      ({ node, filter }) => node.eventually.hasAnyDirectText({ filterMask: filter, ...otherOpts }),
      filterMask,
      true,
    );
  }

  /**
   * Returns true if the actual direct texts of all PageNodes managed by PageElementGroup eventually contain the
   * expected direct texts within a specific timeout.
   *
   * @param directTexts the expected direct texts supposed to be contained in the actual direct texts
   * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
   * to check it
   *
   * If no `timeout` is specified, a PageElement's default timeout is used.
   * If no `interval` is specified, a PageElement's default interval is used.
   */
  containsDirectText(directTexts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
      isIElementNode, ({ node, expected }) => node.eventually.containsDirectText(expected, opts), directTexts,
    );
  }

  /**
   * returns the negated variants of PageElementGroupEventually's state check functions
   */
  get not() {
    return {
      /**
       * Returns true if all PageNodes managed by PageElementGroup eventually do not exist within a specific timeout.
       *
       * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some
       * or all managed PageNodes and the `timeout` within which the condition is expected to be met
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       */
      exists: (opts: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMaskExists<Content> = {}) => {
        const { filterMask, ...otherOpts } = opts;

        return this._node.eachCheck<
          ElementNode<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
        > (
          isIElementNode,
          ({ node, filter }) => node.eventually.not.exists({ filterMask: filter, ...otherOpts }),
          filterMask,
          true,
        );
      },
      /**
       * Returns true if all PageNodes managed by PageElementGroup eventually are not visible within a specific timeout.
       *
       * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for
       * some or all managed PageNodes and the `timeout` within which the condition is expected to be met
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       */
      isVisible: (opts: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const { filterMask, ...otherOpts } = opts;

        return this._node.eachCheck<ElementNode<Content>, ExtractBooleanStateChecker<Content>> (
          isIElementNode,
          ({ node, filter }) => node.eventually.not.isVisible({ filterMask: filter, ...otherOpts }),
          filterMask,
          true,
        );
      },
      /**
       * Returns true if all PageNodes managed by PageElementGroup eventually are not enabled within a specific timeout.
       *
       * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for
       * some or all managed PageNodes and the `timeout` within which the condition is expected to be met
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       */
      isEnabled: (opts: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const { filterMask, ...otherOpts } = opts;

        return this._node.eachCheck<ElementNode<Content>, ExtractBooleanStateChecker<Content>> (
          isIElementNode,
          ({ node, filter }) => node.eventually.not.isEnabled({ filterMask: filter, ...otherOpts }),
          filterMask,
          true,
        );
      },
      /**
       * Returns true if the actual texts of all PageNodes managed by PageElementGroup eventually do not equal the
       * expected texts within a specific timeout.
       *
       * @param texts the expected texts supposed not to equal the actual texts
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
       * to check it
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       * If no `interval` is specified, a PageElement's default interval is used.
       */
      hasText: (texts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
          isIElementNode, ({ node, expected }) => node.eventually.not.hasText(expected, opts), texts,
        );
      },
      /**
       * Returns true if all PageNodes managed by PageElementGroup eventually do not have any text within a specific
       * timeout.
       *
       * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyText` function for
       * some or all managed PageNodes, the `timeout` within which the condition is expected to be met and the
       * `interval` used to check it
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       * If no `interval` is specified, a PageElement's default interval is used.
       */
      hasAnyText: (opts: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const { filterMask, ...otherOpts } = opts;

        return this._node.eachCheck<ElementNode<Content>, ExtractBooleanStateChecker<Content>> (
          isIElementNode,
          ({ node, filter }) => node.eventually.not.hasAnyText({ filterMask: filter, ...otherOpts }),
          filterMask,
          true,
        );
      },
      /**
       * Returns true if the actual texts of all PageNodes managed by PageElementGroup eventually do not contain the
       * expected texts within a specific timeout.
       *
       * @param texts the expected texts supposed not to be contained in the actual texts
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
       * to check it
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       * If no `interval` is specified, a PageElement's default interval is used.
       */
      containsText: (texts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
          isIElementNode, ({ node, expected }) => node.eventually.not.containsText(expected, opts), texts,
        );
      },
      /**
       * Returns true if the actual direct texts of all PageNodes managed by PageElementGroup eventually do not equal
       * the expected direct texts within a specific timeout.
       *
       * @param directTexts the expected direct texts supposed not to equal the actual direct texts
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
       * to check it
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       * If no `interval` is specified, a PageElement's default interval is used.
       */
      hasDirectText: (directTexts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
          isIElementNode, ({ node, expected }) => node.eventually.not.hasDirectText(expected, opts), directTexts,
        );
      },
      /**
       * Returns true if all PageNodes managed by PageElementGroup eventually do not have any direct text within a
       * specific timeout.
       *
       * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyDirectText` function
       * for some or all managed PageNodes, the `timeout` within which the condition is expected to be met and the
       * `interval` used to check it
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       * If no `interval` is specified, a PageElement's default interval is used.
       */
      hasAnyDirectText: (opts: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const { filterMask, ...otherOpts } = opts;

        return this._node.eachCheck<ElementNode<Content>, ExtractBooleanStateChecker<Content>> (
          isIElementNode,
          ({ node, filter }) => node.eventually.not.hasAnyDirectText({ filterMask: filter, ...otherOpts }),
          filterMask,
          true,
        );
      },
      /**
       * Returns true if the actual direct texts of all PageNodes managed by PageElementGroup eventually do not contain
       * the expected direct texts within a specific timeout.
       *
       * @param directTexts the expected direct texts supposed not to be contained in the actual direct texts
       * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
       * to check it
       *
       * If no `timeout` is specified, a PageElement's default timeout is used.
       * If no `interval` is specified, a PageElement's default interval is used.
       */
      containsDirectText: (directTexts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractTextStateChecker<Content>> (
          isIElementNode, ({ node, expected }) => node.eventually.not.containsDirectText(expected, opts), directTexts,
        );
      },
    };
  }
}

// type guards

/**
 * Returns true if the passed node supports all functions defined in IElementNode.
 *
 * @param node a PageNode
 */
export function isIElementNode<
  Content extends {[K in keyof Content] : Workflo.PageNode.IPageNode}
>(node: Workflo.PageNode.IPageNode | ElementNode<Content>): node is ElementNode<Content> {
  return typeof node['getText'] === 'function' &&
  typeof node.currently['hasText'] === 'function' &&
  typeof node.currently['hasAnyText'] === 'function' &&
  typeof node.currently['containsText'] === 'function' &&
  typeof node.wait['hasText'] === 'function' &&
  typeof node.wait['hasAnyText'] === 'function' &&
  typeof node.wait['containsText'] === 'function' &&
  typeof node.eventually['hasText'] === 'function' &&
  typeof node.eventually['hasAnyText'] === 'function' &&
  typeof node.eventually['containsText'] === 'function' &&
  typeof node['getDirectText'] === 'function' &&
  typeof node.currently['hasDirectText'] === 'function' &&
  typeof node.currently['hasAnyDirectText'] === 'function' &&
  typeof node.currently['containsDirectText'] === 'function' &&
  typeof node.wait['hasDirectText'] === 'function' &&
  typeof node.wait['hasAnyDirectText'] === 'function' &&
  typeof node.wait['containsDirectText'] === 'function' &&
  typeof node.eventually['hasDirectText'] === 'function' &&
  typeof node.eventually['hasAnyDirectText'] === 'function' &&
  typeof node.eventually['containsDirectText'] === 'function';
}
