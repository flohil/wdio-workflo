import { PageNode, PageNodeCurrently } from '.';
import { PageNodeStore } from '../stores';
import { IPageNodeOpts, PageNodeEventually, PageNodeWait } from './PageNode';
/**
 * Extracts the return value types of the `getText` functions of all PageNodes defined within a PageElementGroup's
 * content. For a PageElement, the extract return value type will be `string`.
 */
export declare type ExtractText<Content extends {
    [key: string]: Workflo.PageNode.IPageNode;
}> = Workflo.PageNode.ExtractText<Content>;
/**
 * Extracts the return value types of the `getText` functions of all PageNodes defined within a PageElementGroup's
 * content for state check functions. For a PageElement, the extracted return value type will be `string`.
 * Compared to `ExtractText`, this will allow a PageElementList to pass either a single string or
 * an array of strings.
 */
export declare type ExtractTextStateChecker<Content extends {
    [key: string]: Workflo.PageNode.IPageNode;
}> = Workflo.PageNode.ExtractTextStateChecker<Content>;
/**
 * Extracts the return value types of the `getIsEnabled` functions of all PageNodes defined within a PageElementGroup's
 * content. For a PageElement, the extract return value type will be `boolean`.
 */
export declare type ExtractBoolean<Content extends {
    [key: string]: Workflo.PageNode.IPageNode;
}> = Workflo.PageNode.ExtractBoolean<Content>;
/**
 * Extracts the return value types of the `getIsEnabled` functions of all PageNodes defined within a
 * PageElementGroup's content for state check functions. For a PageElement, the extracted return value
 * type will be `boolean`.
 * Compared to `ExtractBoolean`, this will allow the a PageElementList to pass either a single boolean or
 * an array of booleans.
 */
export declare type ExtractBooleanStateChecker<Content extends {
    [key: string]: Workflo.PageNode.IPageNode;
}> = Workflo.PageNode.ExtractBooleanStateChecker<Content>;
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
declare type ElementNode<Content extends {
    [K in keyof Content]: Workflo.PageNode.IPageNode;
}> = Workflo.PageNode.IElementNode<ExtractText<Content> | ExtractTextStateChecker<Content>, ExtractBoolean<Content> | ExtractBooleanStateChecker<Content>, Workflo.PageNode.IGroupFilterMask<Content>>;
/**
 * Describes the opts parameter passed to the constructor function of PageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 */
export interface IPageElementGroupOpts<Store extends PageNodeStore, Content extends {
    [key: string]: Workflo.PageNode.IPageNode;
}> extends IPageNodeOpts<Store> {
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
export declare class PageElementGroup<Store extends PageNodeStore, Content extends {
    [K in keyof Content]: Workflo.PageNode.IPageNode;
}> extends PageNode<Store> implements ElementNode<Content> {
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
    constructor(id: string, { store, content, }: IPageElementGroupOpts<Store, Content>);
    /**
     * provides access to a PageElementGroup's `Content`
     */
    readonly $: Content;
    toJSON(): Workflo.IElementJSON;
    __getNodeId(): string;
    /**
     * Returns the texts of all PageNodes managed by PageElementGroup as a result structure after executing the initial
     * waiting condition of each PageNode.
     *
     * @param filterMask can be used to skip the invocation of the `getText` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractText<Content>;
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
    getDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractText<Content>;
    /**
     * Returns the 'enabled' status of all PageNodes managed by PageElementGroup as a result structure after executing
     * the initial waiting condition of each PageNode.
     *
     * @param filterMask can be used to skip the invocation of the `getIsEnabled` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getIsEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    /**
     * Returns the 'hasText' status of all PageNodes managed by PageElementGroup as a result structure after executing
     * the initial waiting condition of each PageNode.
     *
     * A PageElement's 'hasText' status is set to true if its actual text equals the expected text.
     *
     * @param texts the expected texts used in the comparisons which set the 'hasText' status
     */
    getHasText(texts: ExtractTextStateChecker<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    /**
     * Returns the 'hasAnyText' status of all PageNodes managed by PageElementGroup as a result structure after performing
     * the initial waiting condition of each PageNode.
     *
     * A PageElement's 'hasAnyText' status is set to true if the PageElement has any text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyText` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getHasAnyText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    /**
     * Returns the 'containsText' status of all PageNodes managed by PageElementGroup as a result structure after
     * executing the initial waiting condition of each PageNode.
     *
     * A PageElement's 'containsText' status is set to true if its actual text contains the expected text.
     *
     * @param texts the expected texts used in the comparisons which set the 'containsText' status
     */
    getContainsText(texts: ExtractTextStateChecker<Content>): Workflo.PageNode.ExtractBoolean<Content>;
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
    getHasDirectText(directTexts: ExtractTextStateChecker<Content>): Workflo.PageNode.ExtractBoolean<Content>;
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
    getHasAnyDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
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
    getContainsDirectText(directTexts: ExtractTextStateChecker<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    /**
     * Used to determine if a function of a managed PageNode should be invoked or if its invocation should be skipped
     * because the PageNode is not included by a filterMask.
     *
     * @param filter a filterMask entry that refers to a corresponding managed PageNode
     */
    protected _includedInFilter(value: any): boolean;
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
    eachCompare<NodeInterface, ExpectedType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>, ResultType extends Partial<Content> = Workflo.PageNode.ExtractBoolean<Content>>(supportsInterface: (node: Workflo.PageNode.IPageNode) => boolean, compareFunc: (args: {
        node: NodeInterface;
        expected?: ExpectedType[keyof ExpectedType];
        filter?: ExpectedType[keyof ExpectedType];
    }) => any, expected?: ExpectedType, isFilterMask?: boolean): ResultType;
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
    eachCheck<NodeInterface, ExpectedType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>>(supportsInterface: (node: Workflo.PageNode.IPageNode) => boolean, checkFunc: (args: {
        node: NodeInterface;
        expected?: ExpectedType[keyof ExpectedType];
        filter?: ExpectedType[keyof ExpectedType];
    }) => boolean, expected?: ExpectedType, isFilterMask?: boolean): boolean;
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
    eachGet<NodeInterface, ResultType extends Partial<Content>, FilterType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>>(supportsInterface: (node: Workflo.PageNode.IPageNode) => boolean, getFunc: (args: {
        node: NodeInterface;
        filter?: FilterType[keyof FilterType];
    }) => any, filterMask?: FilterType): ResultType;
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
    eachWait<NodeInterface, ExpectedType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>>(supportsInterface: (node: Workflo.PageNode.IPageNode) => boolean, waitFunc: (args: {
        node: NodeInterface;
        expected?: ExpectedType[keyof ExpectedType];
        filter?: ExpectedType[keyof ExpectedType];
    }) => NodeInterface, expected?: ExpectedType, isFilterMask?: boolean): this;
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
    eachDo<NodeInterface, FilterType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>>(supportsInterface: (node: Workflo.PageNode.IPageNode) => boolean, action: (args: {
        node: NodeInterface;
        filter?: FilterType[keyof FilterType];
    }) => any, filterMask?: FilterType): this;
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
    eachSet<NodeInterface extends Workflo.PageNode.IPageNode, ValuesType extends Partial<Content>>(supportsInterface: (node: Workflo.PageNode.IPageNode) => boolean, setFunc: (args: {
        node: NodeInterface;
        value?: ValuesType[keyof ValuesType];
    }) => NodeInterface, values: ValuesType): this;
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
export declare class PageElementGroupCurrently<Store extends PageNodeStore, Content extends {
    [key: string]: Workflo.PageNode.IPageNode;
}, GroupType extends PageElementGroup<Store, Content>> extends PageNodeCurrently<Store, GroupType> {
    /**
     * Returns the current 'exists' status of all PageNodes managed by PageElementGroup as a result structure.
     *
     * @param filterMask can be used to skip the invocation of the `getExists` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getExists(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    /**
     * Returns the current 'visible' status of all PageNodes managed by PageElementGroup as a result structure.
     *
     * @param filterMask can be used to skip the invocation of the `getIsVisible` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getIsVisible(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    /**
     * Returns the current 'enabled' status of all PageNodes managed by PageElementGroup as a result structure.
     *
     * @param filterMask can be used to skip the invocation of the `getIsEnabled` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getIsEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    /**
     * Returns the current 'hasText' status of all PageNodes managed by PageElementGroup as a result structure.
     *
     * A PageNode's 'hasText' status is set to true if its actual text equals the expected text.
     *
     * @param texts the expected texts used in the comparisons which set the 'hasText' status
     */
    getHasText(texts: ExtractTextStateChecker<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    /**
     * Returns the current 'hasAnyText' status of all PageNodes managed by PageElementGroup as a result structure.
     *
     * A PageNode's 'hasAnyText' status is set to true if the PageNode has any text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyText` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getHasAnyText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    /**
     * Returns the current 'containsText' status of all PageNodes managed by PageElementGroup as a result structure.
     *
     * A PageNode's 'containsText' status is set to true if its actual text contains the expected text.
     *
     * @param texts the expected texts used in the comparisons which set the 'containsText' status
     */
    getContainsText(texts: ExtractTextStateChecker<Content>): Workflo.PageNode.ExtractBoolean<Content>;
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
    getHasDirectText(directTexts: ExtractTextStateChecker<Content>): Workflo.PageNode.ExtractBoolean<Content>;
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
    getHasAnyDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractBoolean<Content>;
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
    getContainsDirectText(directTexts: ExtractTextStateChecker<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    /**
     * Returns the current texts of all PageNodes managed by PageElementGroup as a result structure.
     *
     * @param filterMask can be used to skip the invocation of the `getText` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractText<Content>;
    /**
     * Returns the current direct texts of all PageNodes managed by PageElementGroup as a result structure.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `getDirectText` function for some or all managed
     * PageNodes. The results of skipped function invocations are not included in the total results structure.
     */
    getDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): Workflo.PageNode.ExtractText<Content>;
    /**
     * Returns true if all PageNodes managed by PageElementGroup currently exist.
     *
     * @param filterMask can be used to skip the invocation of the `exists` function for some or all managed
     * PageNodes
     */
    exists(filterMask?: Workflo.PageNode.GroupFilterMaskExists<Content>): boolean;
    /**
     * Returns true if all PageNodes managed by PageElementGroup are currently visible.
     *
     * @param filterMask can be used to skip the invocation of the `isVisible` function for some or all managed
     * PageNodes
     */
    isVisible(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    /**
     * Returns true if all PageNodes managed by PageElementGroup are currently enabled.
     *
     * @param filterMask can be used to skip the invocation of the `isEnabled` function for some or all managed
     * PageNodes
     */
    isEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    /**
     * Returns true if the actual texts of all PageNodes managed by PageElementGroup currently equal the expected texts.
     *
     * @param texts the expected texts supposed to equal the actual texts
     */
    hasText(texts: ExtractTextStateChecker<Content>): boolean;
    /**
     * Returns true if all PageNodes managed by PageElementGroup currently have any text.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyText` function for some or all managed
     * PageNodes
     */
    hasAnyText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    /**
     * Returns true if the actual texts of all PageNodes managed by PageElementGroup currently contain the expected texts.
     *
     * @param texts the expected texts supposed to be contained in the actual texts
     */
    containsText(texts: ExtractTextStateChecker<Content>): boolean;
    /**
     * Returns true if the actual direct texts of all PageNodes managed by PageElementGroup currently equal the expected
     * direct texts.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directTexts the expected direct texts supposed to equal the actual direct texts
     */
    hasDirectText(directTexts: ExtractTextStateChecker<Content>): boolean;
    /**
     * Returns true if all PageNodes managed by PageElementGroup currently have any direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyDirectText` function for some or all managed
     * PageNodes
     */
    hasAnyDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    /**
     * Returns true if the actual direct texts of all PageNodes managed by PageElementGroup currently contain the
     * expected direct texts.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directTexts the expected direct texts supposed to be contained in the actual direct texts
     */
    containsDirectText(directTexts: ExtractTextStateChecker<Content>): boolean;
    /**
     * returns the negated variants of PageElementGroupCurrently's state check functions
     */
    readonly not: {
        /**
         * Returns true if all PageNodes managed by PageElementGroup currently do not exist.
         *
         * @param filterMask can be used to skip the invocation of the `exists` function for some or all managed
         * PageNodes
         */
        exists: (filterMask?: Workflo.PageNode.ExtractExistsFilterMask<Content>) => boolean;
        /**
         * Returns true if all PageNodes managed by PageElementGroup are currently not visible.
         *
         * @param filterMask can be used to skip the invocation of the `isVisible` function for some or all managed
         * PageNodes
         */
        isVisible: (filterMask?: Workflo.PageNode.ExtractBooleanStateChecker<Content>) => boolean;
        /**
         * Returns true if all PageNodes managed by PageElementGroup are currently not enabled.
         *
         * @param filterMask can be used to skip the invocation of the `isEnabled` function for some or all managed
         * PageNodes
         */
        isEnabled: (filterMask?: Workflo.PageNode.ExtractBooleanStateChecker<Content>) => boolean;
        /**
         * Returns true if the actual texts of all PageNodes managed by PageElementGroup currently do not equal the
         * expected texts.
         *
         * @param texts the expected texts supposed not to equal the actual texts
         */
        hasText: (texts: Workflo.PageNode.ExtractTextStateChecker<Content>) => boolean;
        /**
         * Returns true if all PageNodes managed by PageElementGroup currently do not have any text.
         *
         * @param filterMask can be used to skip the invocation of the `hasAnyText` function for some or all managed
         * PageNodes
         */
        hasAnyText: (filterMask?: Workflo.PageNode.ExtractBooleanStateChecker<Content>) => boolean;
        /**
         * Returns true if the actual texts of all PageNodes managed by PageElementGroup currently do not contain the
         * expected texts.
         *
         * @param texts the expected texts supposed not to be contained in the actual texts
         */
        containsText: (texts: Workflo.PageNode.ExtractTextStateChecker<Content>) => boolean;
        /**
         * Returns true if the actual direct texts of all PageNodes managed by PageElementGroup currently do not equal
         * the expected direct texts.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directTexts the expected direct texts supposed not to equal the actual direct texts
         */
        hasDirectText: (directTexts: Workflo.PageNode.ExtractTextStateChecker<Content>) => boolean;
        /**
         * Returns true if all PageNodes managed by PageElementGroup currently do not have any direct text.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param filterMask can be used to skip the invocation of the `hasAnyDirectText` function for some or all managed
         * PageNodes
         */
        hasAnyDirectText: (filterMask?: Workflo.PageNode.ExtractBooleanStateChecker<Content>) => boolean;
        /**
         * Returns true if the actual direct texts of all PageNodes managed by PageElementGroup currently do not contain
         * the expected direct texts.
         *
         * A direct text is a text that resides on the level directly below the selected HTML element.
         * It does not include any text of the HTML element's nested children HTML elements.
         *
         * @param directTexts the expected direct texts supposed not to be contained in the actual direct texts
         */
        containsDirectText: (directTexts: Workflo.PageNode.ExtractTextStateChecker<Content>) => boolean;
    };
}
/**
 * This class defines all `wait` functions of PageElementGroup.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template Content an arbitrary object structure of PageNode instances as values and the names used to identify
 * these PageNodes as keys
 * @template GroupType type of the PageElementGroup for which PageElementGroupWait defines all `wait` functions
 */
export declare class PageElementGroupWait<Store extends PageNodeStore, Content extends {
    [key: string]: Workflo.PageNode.IPageNode;
}, GroupType extends PageElementGroup<Store, Content>> extends PageNodeWait<Store, GroupType> {
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
    exists(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMaskExists<Content>): GroupType;
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
    isVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>): GroupType;
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
    isEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>): GroupType;
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
    hasText(texts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval): GroupType;
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
    hasAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>): GroupType;
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
    containsText(texts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval): GroupType;
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
    hasDirectText(directTexts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval): GroupType;
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
    hasAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>): GroupType;
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
    containsDirectText(directTexts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval): GroupType;
    /**
     * returns the negated variants of PageElementGroupWait's state check functions
     */
    readonly not: {
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
        exists: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMaskExists<Content>) => GroupType;
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
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
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
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
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
        hasText: (texts: Workflo.PageNode.ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => GroupType;
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
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
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
        containsText: (texts: Workflo.PageNode.ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => GroupType;
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
        hasDirectText: (directTexts: Workflo.PageNode.ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => GroupType;
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
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>) => GroupType;
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
        containsDirectText: (directTexts: Workflo.PageNode.ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => GroupType;
    };
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
export declare class PageElementGroupEventually<Store extends PageNodeStore, Content extends {
    [key: string]: Workflo.PageNode.IPageNode;
}, GroupType extends PageElementGroup<Store, Content>> extends PageNodeEventually<Store, GroupType> {
    /**
     * Returns true if all PageNodes managed by PageElementGroup eventually exist within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some
     * or all managed PageNodes and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     */
    exists(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMaskExists<Content>): boolean;
    /**
     * Returns true if all PageNodes managed by PageElementGroup eventually are visible within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for some
     * or all managed PageNodes and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     */
    isVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
    /**
     * Returns true if all PageNodes managed by PageElementGroup eventually are enabled within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for some
     * or all managed PageNodes and the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, a PageElement's default timeout is used.
     */
    isEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
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
    hasText(texts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval): boolean;
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
    hasAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
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
    containsText(texts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval): boolean;
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
    hasDirectText(directTexts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval): boolean;
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
    hasAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
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
    containsDirectText(directTexts: ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * returns the negated variants of PageElementGroupEventually's state check functions
     */
    readonly not: {
        /**
         * Returns true if all PageNodes managed by PageElementGroup eventually do not exist within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `exists` function for some
         * or all managed PageNodes and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         */
        exists: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMaskExists<Content>) => boolean;
        /**
         * Returns true if all PageNodes managed by PageElementGroup eventually are not visible within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `isVisible` function for
         * some or all managed PageNodes and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         */
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
        /**
         * Returns true if all PageNodes managed by PageElementGroup eventually are not enabled within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `isEnabled` function for
         * some or all managed PageNodes and the `timeout` within which the condition is expected to be met
         *
         * If no `timeout` is specified, a PageElement's default timeout is used.
         */
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
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
        hasText: (texts: Workflo.PageNode.ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => boolean;
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
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
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
        containsText: (texts: Workflo.PageNode.ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => boolean;
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
        hasDirectText: (directTexts: Workflo.PageNode.ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => boolean;
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
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>) => boolean;
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
        containsDirectText: (directTexts: Workflo.PageNode.ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval) => boolean;
    };
}
/**
 * Returns true if the passed node supports all functions defined in IElementNode.
 *
 * @param node a PageNode
 */
export declare function isIElementNode<Content extends {
    [K in keyof Content]: Workflo.PageNode.IPageNode;
}>(node: Workflo.PageNode.IPageNode | ElementNode<Content>): node is ElementNode<Content>;
export {};
