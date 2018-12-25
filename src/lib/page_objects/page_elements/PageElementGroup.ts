import { PageElementStore } from '../stores'
import { PageNodeCurrently, PageNode } from '.';
import { PageNodeEventually, PageNodeWait, IPageNodeOpts } from './PageNode';

export type ExtractText<Content extends {[key: string]: Workflo.PageNode.INode}> =
  Workflo.PageNode.ExtractText<Content>

export type ExtractBoolean<Content extends {[key: string]: Workflo.PageNode.INode}> =
  Workflo.PageNode.ExtractBoolean<Content>

type ElementNode<Content extends {[K in keyof Content] : Workflo.PageNode.INode}> =
Workflo.PageNode.IElementNode<ExtractText<Content>, ExtractBoolean<Content>, Workflo.PageNode.IGroupFilterMask<Content>>

export interface IPageElementGroupOpts<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode}
> extends IPageNodeOpts<Store> {
  content: Content
}

// Encapsulates arbitrary page element types.
// Exposes its content directly as its own members,
// so each key in content can be accessed via dot notation.
//
// Naming Convention:
// - all content members must start with a lower case letter
// - all group functions must start with upper case letter
// - all private members of group must start with _
export class PageElementGroup<
  Store extends PageElementStore,
  Content extends {[K in keyof Content] : Workflo.PageNode.INode}
> extends PageNode<Store>
implements ElementNode<Content> {
  protected _id: string
  protected _$: Workflo.StripNever<Content>
  protected _lastDiff: Workflo.IDiff

  readonly currently: PageElementGroupCurrently<Store, Content, this>
  readonly wait: PageElementGroupWait<Store, Content, this>
  readonly eventually: PageElementGroupEventually<Store, Content, this>

  constructor(id: string, {
    store,
    timeout,
    content
  }: IPageElementGroupOpts<Store, Content>) {
    super(id, {store, timeout})

    this._id = id
    this._$ = content

    this.currently = new PageElementGroupCurrently(this)
    this.wait = new PageElementGroupWait(this)
    this.eventually = new PageElementGroupEventually(this)
  }

  get $() {
    return this._$
  }

  get __getLastDiff() {
    return this._lastDiff
  }

  toJSON(): Workflo.IElementJSON {
    return {
      pageNodeType: this.constructor.name,
      nodeId: this._id
    }
  }

  __getNodeId() {
    return this._id
  }

  // GETTER FUNCTIONS

  /**
   * Returns texts of all group elements after performing an initial wait in the order they were retrieved from the DOM.
   *
   * If passing filter, only values defined in this mask will be returned.
   * By default (if no filter is passed), all values will be returned.
   *
   * @param filter a filter mask
   */
  getText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this.eachGet<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, filter}) => node.getText(filter), filterMask
    )
  }

  getDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this.eachGet<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, filter}) => node.getDirectText(filter), filterMask
    )
  }

  getIsEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this.eachGet<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, ({node, filter}) => node.getIsEnabled(filter), filterMask
    )
  }

  getHasText(text: ExtractText<Content>) {
    return this.eachCompare<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.getHasText(expected), text
    )
  }

  getHasAnyText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this.eachCompare<ElementNode<Content>> (
      isIElementNode, ({node, filter}) => node.getHasAnyText(filter), filterMask, true
    )
  }

  getContainsText(text: ExtractText<Content>) {
    return this.eachCompare<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.getContainsText(expected), text
    )
  }

  getHasDirectText(directText: ExtractText<Content>) {
    return this.eachCompare<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.getHasDirectText(expected), directText
    )
  }

  getHasAnyDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this.eachCompare<ElementNode<Content>> (
      isIElementNode, ({node, filter}) => node.getHasAnyDirectText(filter), filterMask, true
    )
  }

  getContainsDirectText(directText: ExtractText<Content>) {
    return this.eachCompare<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.getContainsDirectText(expected), directText
    )
  }

  // HELPER FUNCTIONS

  eachGet<
    NodeInterface,
    ResultType extends Partial<Content>,
    FilterType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    getFunc: (
      args: {node: NodeInterface, filter?: FilterType[keyof FilterType]}
    ) => any,
    filterMask?: FilterType,
  ): Workflo.StripNever<ResultType> {
    let result = {} as ResultType;

    for (const key in this.$) {
      if (supportsInterface(this.$[key])) {
        const node = this.$[key] as any as NodeInterface

        if (filterMask) {
          const filter = filterMask[key]

          if (typeof filter === 'boolean') {
            if (filter === true) {
              result[key] = getFunc({node, filter})
            }
          } else if (typeof filter !== 'undefined' && filter !== null) {
            result[key] = getFunc({node, filter})
          }
        } else {
          result[key] = getFunc({node})
        }
      }
    }

    return result;
  }

  eachCompare<
    NodeInterface,
    ExpectedType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>,
    ResultType extends Partial<Content> = Workflo.PageNode.ExtractBoolean<Content>,
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    compareFunc: (args: {
      node: NodeInterface, expected?: ExpectedType[keyof ExpectedType], filter?: ExpectedType[keyof ExpectedType]
    }) => any,
    expected?: ExpectedType,
    isFilterMask: boolean = false
  ): ResultType {
    let result = {} as ResultType;

    for (const key in this._$) {
      const node = this._$[key] as any as NodeInterface

      if (supportsInterface(this._$[key])) {
        if (expected) {
          const expectedValue = (expected as any)[key] as ExpectedType[keyof ExpectedType]

          if (isFilterMask) {
            if (typeof expectedValue === 'boolean') {
              if (expectedValue === true) {
                result[key] = compareFunc({node, filter: expectedValue})
              }
            } else if (typeof expectedValue !== 'undefined' && expectedValue !== null) {
              result[key] = compareFunc({node, filter: expectedValue})
            }
          } else {
            if (typeof expectedValue !== 'undefined') {
              result[key] = compareFunc({node, expected: expectedValue})
            }
          }
        } else {
          result[key] = compareFunc({node})
        }
      }
    }

    return result
  }

  eachCheck<
    NodeInterface,
    ExpectedType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>,
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    checkFunc: (args: {
      node: NodeInterface, expected?: ExpectedType[keyof ExpectedType], filter?: ExpectedType[keyof ExpectedType]
    }) => boolean,
    expected?: ExpectedType,
    isFilterMask: boolean = false
  ): boolean {
    const diffs: Workflo.IDiffTree = {}

    for (const key in this._$) {
      const node = this._$[key] as any as NodeInterface

      if (supportsInterface(this._$[key])) {
        if (expected) {
          const expectedValue = (expected as any)[key] as ExpectedType[keyof ExpectedType]

          if (isFilterMask) {
            if (typeof expectedValue === 'boolean') {
              if (expectedValue === true) {
                if (!checkFunc({node, filter: expectedValue})) {
                  diffs[`.${key}`] = this._$[key].__lastDiff
                }
              }
            } else if (typeof expectedValue !== 'undefined' && expectedValue !== null) {
              if (!checkFunc({node, filter: expectedValue})) {
                diffs[`.${key}`] = this._$[key].__lastDiff
              }
            }
          } else {
            if (typeof expectedValue !== 'undefined') {
              if (!checkFunc({node, expected: expectedValue})) {
                diffs[`.${key}`] = this._$[key].__lastDiff
              }
            }
          }
        } else {
          if (!checkFunc({node})) {
            diffs[`.${key}`] = this._$[key].__lastDiff
          }
        }
      }
    }

    this._lastDiff = {
      tree: diffs
    }

    return Object.keys(diffs).length === 0;
  }

  eachWait<
    NodeInterface,
    ExpectedType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    waitFunc: (args: {
      node: NodeInterface, expected?: ExpectedType[keyof ExpectedType], filter?: ExpectedType[keyof ExpectedType]
    }) => NodeInterface,
    expected?: ExpectedType,
    isFilterMask: boolean = false
  ): this {
    for (const key in this._$) {
      const node = this._$[key] as any as NodeInterface

      if (supportsInterface(this._$[key])) {
        if (expected) {
          const expectedValue = expected[key]

          if (isFilterMask) {
            if (typeof expectedValue === 'boolean') {
              if (expectedValue === true) {
                waitFunc({node, filter: expectedValue})
              }
            } else if (typeof expectedValue !== 'undefined' && expectedValue !== null) {
              waitFunc({node, filter: expectedValue})
            }
          } else {
            if (typeof expectedValue !== 'undefined') {
              waitFunc({node, expected: expectedValue})
            }
          }
        } else {
          waitFunc({node})
        }
      }
    }

    return this
  }

  eachDo<
    NodeInterface,
    FilterType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    doFunc: (args: {
      node: NodeInterface, filter?: FilterType[keyof FilterType]
    }) => NodeInterface,
    filterMask?: FilterType,
  ): this {
    for (const key in this._$) {
      const node = this._$[key] as any as NodeInterface

      if (supportsInterface(this._$[key])) {
        if (filterMask) {
          const filter = filterMask[key]

          if (typeof filter === 'boolean') {
            if (filter === true) {
              doFunc({node, filter})
            }
          } else if (typeof filter !== 'undefined' && filter !== null) {
            doFunc({node, filter})
          }
        } else {
          doFunc({node})
        }
      }
    }

    return this
  }

  eachSet<
    NodeInterface extends Workflo.PageNode.INode,
    ValuesType extends Partial<Content>,
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    setFunc: (
      args: {node: NodeInterface, value?: ValuesType[keyof ValuesType]}
    ) => NodeInterface,
    values: Workflo.StripNever<ValuesType>,
  ): this {
    for (const key in this._$) {
      const node = this._$[key] as any as NodeInterface

      if (supportsInterface(this._$[key])) {
        if (values) {
          if (typeof values[key] !== 'undefined') {
            setFunc({node, value: values[key]})
          }
        } else {
          setFunc({node})
        }
      }
    }

    return this
  }
}

export class PageElementGroupCurrently<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> extends PageNodeCurrently<Store, GroupType> {

  getExists(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, ({node, filter}) => node.currently.getExists(filter), filterMask
    )
  }

  getIsVisible(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, ({node, filter}) => node.currently.getIsVisible(filter), filterMask
    )
  }

  getIsEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, ({node, filter}) => node.currently.getIsEnabled(filter), filterMask
    )
  }

  getHasText(text: ExtractText<Content>) {
    return this._node.eachCompare<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.currently.getHasText(expected), text
    )
  }

  getHasAnyText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCompare<ElementNode<Content>> (
      isIElementNode, ({node, filter}) => node.currently.getHasAnyText(filter), filterMask, true
    )
  }

  getContainsText(text: ExtractText<Content>) {
    return this._node.eachCompare<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.currently.getContainsText(expected), text
    )
  }

  getHasDirectText(directText: ExtractText<Content>) {
    return this._node.eachCompare<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.currently.getHasDirectText(expected), directText
    )
  }

  getHasAnyDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCompare<ElementNode<Content>> (
      isIElementNode, ({node, filter}) => node.currently.getHasAnyDirectText(filter), filterMask, true
    )
  }

  getContainsDirectText(directText: ExtractText<Content>) {
    return this._node.eachCompare<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.currently.getContainsDirectText(expected), directText
    )
  }

  /**
   * Returns texts of all group elements immediatly in the order they were retrieved from the DOM.
   *
   * If passing filter, only values defined in this mask will be returned.
   * By default (if no filter is passed), all values will be returned.
   *
   * @param filter a filter mask
   */
  getText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, filter}) => node.currently.getText(filter), filterMask
    )
  }

  getDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, filter}) => node.currently.getDirectText(filter), filterMask
    )
  }

  exists(filterMask?: Workflo.PageNode.GroupFilterMaskExists<Content>) {
    return this._node.eachCheck<
      ElementNode<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
    > (
      isIElementNode, ({node, filter}) => node.currently.exists(filter), filterMask, true
    )
  }

  isVisible(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCheck<ElementNode<Content>> (
      isIElementNode, ({node, filter}) => node.currently.isVisible(filter), filterMask, true
    )
  }

  isEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCheck<ElementNode<Content>> (
      isIElementNode, ({node, filter}) => node.currently.isEnabled(filter), filterMask, true
    )
  }

  hasText(text: ExtractText<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.currently.hasText(expected), text
    )
  }

  hasAnyText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCheck<ElementNode<Content>> (
      isIElementNode, ({node, filter}) => node.currently.hasAnyText(filter), filterMask, true
    )
  }

  containsText(text: ExtractText<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.currently.containsText(expected), text
    )
  }

  hasDirectText(directText: ExtractText<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.currently.hasDirectText(expected), directText
    )
  }

  hasAnyDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCheck<ElementNode<Content>> (
      isIElementNode, ({node, filter}) => node.currently.hasAnyDirectText(filter), filterMask, true
    )
  }

  containsDirectText(directText: ExtractText<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.currently.containsDirectText(expected), directText
    )
  }

  get not() {
    return {
      exists: (filterMask?: Workflo.PageNode.GroupFilterMaskExists<Content>) => {
        return this._node.eachCheck<
          ElementNode<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
        > (
          isIElementNode, ({node, filter}) => node.currently.not.exists(filter), filterMask, true
        )
      },
      isVisible: (filterMask?: Workflo.PageNode.GroupFilterMask<Content>) => {
        return this._node.eachCheck<ElementNode<Content>> (
          isIElementNode, ({node, filter}) => node.currently.not.isVisible(filter), filterMask, true
        )
      },
      isEnabled: (filterMask?: Workflo.PageNode.GroupFilterMask<Content>) => {
        return this._node.eachCheck<ElementNode<Content>> (
          isIElementNode, ({node, filter}) => node.currently.not.isEnabled(filter), filterMask, true
        )
      },
      hasText: (text: ExtractText<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
          isIElementNode, ({node, expected}) => node.currently.not.hasText(expected), text
        )
      },
      hasAnyText: (filterMask?: Workflo.PageNode.GroupFilterMask<Content>) => {
        return this._node.eachCheck<ElementNode<Content>> (
          isIElementNode, ({node, filter}) => node.currently.not.hasAnyText(filter), filterMask, true
        )
      },
      containsText: (text: ExtractText<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
          isIElementNode, ({node, expected}) => node.currently.not.containsText(expected), text
        )
      },
      hasDirectText: (directText: ExtractText<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
          isIElementNode, ({node, expected}) => node.currently.not.hasDirectText(expected), directText
        )
      },
      hasAnyDirectText: (filterMask?: Workflo.PageNode.GroupFilterMask<Content>) => {
        return this._node.eachCheck<ElementNode<Content>> (
          isIElementNode, ({node, filter}) => node.currently.not.hasAnyDirectText(filter), filterMask, true
        )
      },
      containsDirectText: (directText: ExtractText<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
          isIElementNode, ({node, expected}) => node.currently.not.containsDirectText(expected), directText
        )
      }
    }
  }
}

export class PageElementGroupWait<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> extends PageNodeWait<Store, GroupType> {

  exists(opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMaskExists<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait<
      ElementNode<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
    > (
      isIElementNode, ({node, filter}) => node.wait.exists({filterMask: filter, ...otherOpts}), filterMask, true
    )
  }

  isVisible(opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait<ElementNode<Content>> (
      isIElementNode, ({node, filter}) => node.wait.isVisible({filterMask: filter, ...otherOpts}), filterMask, true
    )
  }

  isEnabled(opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait<ElementNode<Content>> (
      isIElementNode, ({node, filter}) => node.wait.isEnabled({filterMask: filter, ...otherOpts}), filterMask, true
    )
  }

  hasText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.wait.hasText(expected, opts), text
    )
  }

  hasAnyText(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait<ElementNode<Content>> (
      isIElementNode, ({node, filter}) => node.wait.hasAnyText({filterMask: filter, ...otherOpts}), filterMask, true
    )
  }

  containsText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.wait.containsText(expected, opts), text
    )
  }

  hasDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.wait.hasDirectText(expected, opts), directText
    )
  }

  hasAnyDirectText(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait<ElementNode<Content>> (
      isIElementNode,
      ({node, filter}) => node.wait.hasAnyDirectText({filterMask: filter, ...otherOpts}),
      filterMask,
      true
    )
  }

  containsDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.wait.containsDirectText(expected, opts), directText
    )
  }

  get not() {
    return {
      exists: (opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMaskExists<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait<
          ElementNode<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
        > (
          isIElementNode, ({node, filter}) => node.wait.not.exists({filterMask: filter, ...otherOpts}), filterMask, true
        )
      },
      isVisible: (opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait<ElementNode<Content>> (
          isIElementNode,
          ({node, filter}) => node.wait.not.isVisible({filterMask: filter, ...otherOpts}),
          filterMask,
          true
        )
      },
      isEnabled: (opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait<ElementNode<Content>> (
          isIElementNode,
          ({node, filter}) => node.wait.not.isEnabled({filterMask: filter, ...otherOpts}),
          filterMask,
          true
        )
      },
      hasText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractText<Content>> (
          isIElementNode, ({node, expected}) => node.wait.not.hasText(expected, opts), text
        )
      },
      hasAnyText: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait<ElementNode<Content>> (
          isIElementNode,
          ({node, filter}) => node.wait.not.hasAnyText({filterMask: filter, ...otherOpts}),
          filterMask,
          true
        )
      },
      containsText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractText<Content>> (
          isIElementNode, ({node, expected}) => node.wait.not.containsText(expected, opts), text
        )
      },
      hasDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractText<Content>> (
          isIElementNode, ({node, expected}) => node.wait.not.hasDirectText(expected, opts), directText
        )
      },
      hasAnyDirectText: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait<ElementNode<Content>> (
          isIElementNode,
          ({node, filter}) => node.wait.not.hasAnyDirectText({filterMask: filter, ...otherOpts}),
          filterMask,
          true
        )
      },
      containsDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractText<Content>> (
          isIElementNode, ({node, expected}) => node.wait.not.containsDirectText(expected, opts), directText
        )
      }
    }
  }
}

export class PageElementGroupEventually<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> extends PageNodeEventually<Store, GroupType> {

  exists(opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMaskExists<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck<
      ElementNode<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
    > (
      isIElementNode, ({node, filter}) => node.eventually.exists({filterMask: filter, ...otherOpts}), filterMask, true
    )
  }

  isVisible(opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode,
      ({node, filter}) => node.eventually.isVisible({filterMask: filter, ...otherOpts}),
      filterMask,
      true
    )
  }

  isEnabled(opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode,
      ({node, filter}) => node.eventually.isEnabled({filterMask: filter, ...otherOpts}),
      filterMask,
      true
    )
  }

  hasText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.eventually.hasText(expected, opts), text
    )
  }

  hasAnyText(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode,
      ({node, filter}) => node.eventually.hasAnyText({filterMask: filter, ...otherOpts}),
      filterMask,
      true
    )
  }

  containsText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.eventually.containsText(expected, opts), text
    )
  }

  hasDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.eventually.hasDirectText(expected, opts), directText
    )
  }

  hasAnyDirectText(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode,
      ({node, filter}) => node.eventually.hasAnyDirectText({filterMask: filter, ...otherOpts}),
      filterMask,
      true
    )
  }

  containsDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, ({node, expected}) => node.eventually.containsDirectText(expected, opts), directText
    )
  }

  get not() {
    return {
      exists: (opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMaskExists<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck<
          ElementNode<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
        > (
          isIElementNode,
          ({node, filter}) => node.eventually.not.exists({filterMask: filter, ...otherOpts}),
          filterMask,
          true
        )
      },
      isVisible: (opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode,
          ({node, filter}) => node.eventually.not.isVisible({filterMask: filter, ...otherOpts}),
          filterMask,
          true
        )
      },
      isEnabled: (opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode,
          ({node, filter}) => node.eventually.not.isEnabled({filterMask: filter, ...otherOpts}),
          filterMask,
          true
        )
      },
      hasText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
          isIElementNode, ({node, expected}) => node.eventually.not.hasText(expected, opts), text
        )
      },
      hasAnyText: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode,
          ({node, filter}) => node.eventually.not.hasAnyText({filterMask: filter, ...otherOpts}),
          filterMask,
          true
        )
      },
      containsText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
          isIElementNode, ({node, expected}) => node.eventually.not.containsText(expected, opts), text
        )
      },
      hasDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
          isIElementNode, ({node, expected}) => node.eventually.not.hasDirectText(expected, opts), directText
        )
      },
      hasAnyDirectText: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode,
          ({node, filter}) => node.eventually.not.hasAnyDirectText({filterMask: filter, ...otherOpts}),
          filterMask,
          true
        )
      },
      containsDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>> (
          isIElementNode, ({node, expected}) => node.eventually.not.containsDirectText(expected, opts), directText
        )
      }
    }
  }
}

// type guards
function isIElementNode<
  Content extends {[K in keyof Content] : Workflo.PageNode.INode}
>(node: Workflo.PageNode.INode | ElementNode<Content>): node is ElementNode<Content> {
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
  typeof node.eventually['containsDirectText'] === 'function'
}
