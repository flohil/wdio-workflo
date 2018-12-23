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

  getIsEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this.eachGet<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.getIsEnabled(), filterMask
    )
  }

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
      isIElementNode, node => node.getText(), filterMask
    )
  }

  getDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this.eachGet<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, node => node.getDirectText(), filterMask
    )
  }

  // HELPER FUNCTIONS

  eachGet<
    NodeInterface,
    ResultType extends Partial<Content>,
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    getFunc: (node: NodeInterface) => any,
    filterMask?: Workflo.PageNode.GroupFilterMask<Content>,
  ): Workflo.StripNever<ResultType> {
    let result = {} as ResultType;

    for (const key in this.$) {
      if (supportsInterface(this.$[key])) {
        const node = this.$[key] as any as NodeInterface

        if (filterMask) {
          if (typeof filterMask[key] === 'boolean' && filterMask[key]) {
            result[key] = getFunc(node)
          }
        } else {
          result[key] = getFunc(node)
        }
      }
    }

    return result;
  }

  eachCheck<
    NodeInterface,
    ResultType extends Partial<Content>,
    ExpectedType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>,
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    checkFunc: (node: NodeInterface, expected?: ResultType[keyof ResultType]) => boolean,
    expected?: ExpectedType,
    isFilterMask: boolean = false
  ): boolean {
    const diffs: Workflo.IDiffTree = {}
    const context = this._$ as any as ResultType

    for (const key in context) {
      const node = context[key] as any as NodeInterface

      if (supportsInterface(context[key])) {
        if (expected) {
          const expectedValue = (expected as any)[key] as ExpectedType[keyof ExpectedType]

          if (isFilterMask) {
            if (typeof expectedValue === 'boolean' && expectedValue === true) {
              if (!checkFunc(node)) {
                diffs[`.${key}`] = context[key].__lastDiff
              }
            }
          } else {
            if (typeof expectedValue !== 'undefined') {
              if (!checkFunc(node, expectedValue)) {
                diffs[`.${key}`] = context[key].__lastDiff
              }
            }
          }
        } else {
          if (!checkFunc(node)) {
            diffs[`.${key}`] = context[key].__lastDiff
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
    ResultType extends Partial<Content>,
    ExpectedType extends Partial<Content> = Workflo.PageNode.GroupFilterMask<Content>
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    waitFunc: (node: NodeInterface, expected?: ResultType[keyof ResultType]) => NodeInterface,
    expected?: ExpectedType,
    isFilterMask: boolean = false
  ): this {
    const context = this._$ as any as ResultType

    for (const key in context) {
      const node = context[key] as any as NodeInterface

      if (supportsInterface(context[key])) {
        if (expected) {
          const expectedValue = (expected as any)[key] as ExpectedType[keyof ExpectedType]

          if (isFilterMask) {
            if (typeof expectedValue === 'boolean' && expectedValue === true) {
              waitFunc(node)
            }
          } else {
            if (typeof expectedValue !== 'undefined') {
              waitFunc(node, expectedValue)
            }
          }
        } else {
          waitFunc(node)
        }
      }
    }

    return this
  }

  eachDo<
    NodeInterface
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    doFunc: (node: NodeInterface) => NodeInterface,
    filterMask?: Workflo.PageNode.GroupFilterMask<Content>,
  ): this {
    const context = this._$

    for (const key in context) {
      const node = context[key] as any as NodeInterface

      if (supportsInterface(context[key])) {
        if (filterMask) {
          if (typeof filterMask[key] === 'boolean' && filterMask[key]) {
            doFunc(node)
          }
        } else {
          doFunc(node)
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
    setFunc: (node: NodeInterface, expected?: ValuesType[keyof ValuesType]) => NodeInterface,
    values: Workflo.StripNever<ValuesType>,
  ): this {
    const context = this._$ as Workflo.StripNever<Content>

    for (const key in context) {
      const node = context[key] as any as NodeInterface

      if (supportsInterface(context[key])) {
        if (values) {
          if (typeof values[key] !== 'undefined') {
            setFunc(node, values[key])
          }
        } else {
          setFunc(node, values[key])
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
      isIElementNode, node => node.currently.getExists(), filterMask
    )
  }

  getIsVisible(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.currently.getIsVisible(), filterMask
    )
  }

  getIsEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.currently.getIsEnabled(), filterMask
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
      isIElementNode, node => node.currently.getText(), filterMask
    )
  }

  getDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, node => node.currently.getDirectText(), filterMask
    )
  }

  exists(filterMask?: Workflo.PageNode.GroupFilterMaskExists<Content>) {
    return this._node.eachCheck<
      ElementNode<Content>, ExtractBoolean<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
    > (
      isIElementNode, (node, filterMask) => node.currently.exists(filterMask), filterMask, true
    )
  }

  isVisible(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.currently.isVisible(), filterMask, true
    )
  }

  isEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.currently.isEnabled(), filterMask, true
    )
  }

  hasText(text: ExtractText<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, (node, text) => node.currently.hasText(text), text
    )
  }

  hasAnyText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.currently.hasAnyText(), filterMask, true
    )
  }

  containsText(text: ExtractText<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, (node, text) => node.currently.containsText(text), text
    )
  }

  hasDirectText(directText: ExtractText<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, (node, directText) => node.currently.hasDirectText(directText), directText
    )
  }

  hasAnyDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.currently.hasAnyDirectText(), filterMask, true
    )
  }

  containsDirectText(directText: ExtractText<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, (node, directText) => node.currently.containsDirectText(directText), directText
    )
  }

  get not() {
    return {
      exists: (filterMask?: Workflo.PageNode.GroupFilterMaskExists<Content>) => {
        return this._node.eachCheck<
          ElementNode<Content>, ExtractBoolean<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
        > (
          isIElementNode, node => node.currently.not.exists(), filterMask, true
        )
      },
      isVisible: (filterMask?: Workflo.PageNode.GroupFilterMask<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, node => node.currently.not.isVisible(), filterMask, true
        )
      },
      isEnabled: (filterMask?: Workflo.PageNode.GroupFilterMask<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, node => node.currently.not.isEnabled(), filterMask, true
        )
      },
      hasText: (text: ExtractText<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, (node, text) => node.currently.not.hasText(text), text
        )
      },
      hasAnyText: (filterMask?: Workflo.PageNode.GroupFilterMask<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, node => node.currently.not.hasAnyText(), filterMask, true
        )
      },
      containsText: (text: ExtractText<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, (node, text) => node.currently.not.containsText(text), text
        )
      },
      hasDirectText: (directText: ExtractText<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, (node, directText) => node.currently.not.hasDirectText(directText), directText
        )
      },
      hasAnyDirectText: (filterMask?: Workflo.PageNode.GroupFilterMask<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, node => node.currently.not.hasAnyDirectText(), filterMask, true
        )
      },
      containsDirectText: (directText: ExtractText<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, (node, directText) => node.currently.not.containsDirectText(directText), directText
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
      ElementNode<Content>, ExtractBoolean<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
    > (
      isIElementNode, node => node.wait.exists(otherOpts), filterMask, true
    )
  }

  isVisible(opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.wait.isVisible(otherOpts), filterMask, true
    )
  }

  isEnabled(opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.wait.isEnabled(otherOpts), filterMask, true
    )
  }

  hasText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
      isIElementNode, (node, text) => node.wait.hasText(text, opts), text
    )
  }

  hasAnyText(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.wait.hasAnyText(otherOpts), filterMask, true
    )
  }

  containsText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
      isIElementNode, (node, text) => node.wait.containsText(text, opts), text
    )
  }

  hasDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
      isIElementNode, (node, directText) => node.wait.hasDirectText(directText, opts), directText
    )
  }

  hasAnyDirectText(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.wait.hasAnyDirectText(otherOpts), filterMask, true
    )
  }

  containsDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
      isIElementNode, (node, directText) => node.wait.containsDirectText(directText, opts), directText
    )
  }

  get not() {
    return {
      exists: (opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMaskExists<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait<
          ElementNode<Content>, ExtractBoolean<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
        > (
          isIElementNode, node => node.wait.not.exists(otherOpts), filterMask, true
        )
      },
      isVisible: (opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, node => node.wait.not.isVisible(otherOpts), filterMask, true
        )
      },
      isEnabled: (opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, node => node.wait.not.isEnabled(otherOpts), filterMask, true
        )
      },
      hasText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
          isIElementNode, (node, text) => node.wait.not.hasText(text, opts), text
        )
      },
      hasAnyText: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, node => node.wait.not.hasAnyText(otherOpts), filterMask, true
        )
      },
      containsText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
          isIElementNode, (node, text) => node.wait.not.containsText(text, opts), text
        )
      },
      hasDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
          isIElementNode, (node, directText) => node.wait.not.hasDirectText(directText, opts), directText
        )
      },
      hasAnyDirectText: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, node => node.wait.not.hasAnyDirectText(otherOpts), filterMask, true
        )
      },
      containsDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
          isIElementNode, (node, directText) => node.wait.not.containsDirectText(directText, opts), directText
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
      ElementNode<Content>, ExtractBoolean<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
    > (
      isIElementNode, node => node.eventually.exists(otherOpts), filterMask, true
    )
  }

  isVisible(opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.eventually.isVisible(otherOpts), filterMask, true
    )
  }

  isEnabled(opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.eventually.isEnabled(otherOpts), filterMask, true
    )
  }

  hasText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, (node, text) => node.eventually.hasText(text, opts), text
    )
  }

  hasAnyText(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.eventually.hasAnyText(otherOpts), filterMask, true
    )
  }

  containsText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, (node, text) => node.eventually.containsText(text, opts), text
    )
  }

  hasDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, (node, directText) => node.eventually.hasDirectText(directText, opts), directText
    )
  }

  hasAnyDirectText(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, node => node.eventually.hasAnyDirectText(otherOpts), filterMask, true
    )
  }

  containsDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, (node, directText) => node.eventually.containsDirectText(directText, opts), directText
    )
  }

  get not() {
    return {
      exists: (opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMaskExists<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck<
          ElementNode<Content>, ExtractBoolean<Content>, Workflo.PageNode.GroupFilterMaskExists<Content>
        > (
          isIElementNode, node => node.eventually.not.exists(otherOpts), filterMask, true
        )
      },
      isVisible: (opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, node => node.eventually.not.isVisible(otherOpts), filterMask, true
        )
      },
      isEnabled: (opts: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, node => node.eventually.not.isEnabled(otherOpts), filterMask, true
        )
      },
      hasText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, (node, text) => node.eventually.not.hasText(text, opts), text
        )
      },
      hasAnyText: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, node => node.eventually.not.hasAnyText(otherOpts), filterMask, true
        )
      },
      containsText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, (node, text) => node.eventually.not.containsText(text, opts), text
        )
      },
      hasDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, (node, directText) => node.eventually.not.hasDirectText(directText, opts), directText
        )
      },
      hasAnyDirectText: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, node => node.eventually.not.hasAnyDirectText(otherOpts), filterMask, true
        )
      },
      containsDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, (node, directText) => node.eventually.not.containsDirectText(directText, opts), directText
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
