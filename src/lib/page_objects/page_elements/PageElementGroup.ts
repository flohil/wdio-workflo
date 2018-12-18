import { PageElementStore } from '../stores'
import { PageNodeCurrently, PageNode } from '.';
import { PageNodeEventually, PageNodeWait, IPageNodeOpts } from './PageNode';

export type ExtractText<Content extends {[key: string]: Workflo.PageNode.INode}> =
  Workflo.PageNode.ExtractText<Content>

export type ExtractBoolean<Content extends {[key: string]: Workflo.PageNode.INode}> =
  Workflo.PageNode.ExtractBoolean<Content>

export type ExtractTrue<Content extends {[key: string]: Workflo.PageNode.INode}> =
  Workflo.PageNode.ExtractTrue<Content>

type ElementNode<Content extends {[K in keyof Content] : Workflo.PageNode.INode}> =
Workflo.PageNode.IElementNode<ExtractText<Content>, ExtractBoolean<Content>, ExtractTrue<Content>>

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
  protected _$: StripNever<Content>
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

  __getTrue(filterMask?: ExtractTrue<Content>) {
    return this.eachGet<ElementNode<Content>, ExtractTrue<Content>> (
      isIElementNode, filterMask, node => node.__getTrue()
    )
  }

  getIsEnabled(filterMask?: ExtractTrue<Content>) {
    return this.eachGet<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, filterMask, node => node.getIsEnabled()
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
  getText(filterMask?: ExtractTrue<Content>) {
    return this.eachGet<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, filterMask, node => node.getText()
    )
  }

  getDirectText(filterMask?: ExtractTrue<Content>) {
    return this.eachGet<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, filterMask, node => node.getDirectText()
    )
  }

  // HELPER FUNCTIONS

  eachGet<
    NodeInterface,
    ResultType extends Partial<Content>,
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    filterMask: ExtractTrue<Content>,
    getFunc: (node: NodeInterface) => any,
  ): StripNever<ResultType> {
    let result = {} as ResultType;

    for (const key in this.$) {
      if (supportsInterface(this.$[key])) {
        const node = this.$[key] as any as NodeInterface

        if (filterMask) {
          if (typeof filterMask[key] !== 'undefined') {
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
    ExpectedType extends Partial<Content> = ExtractTrue<Content>
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    expected: ExpectedType,
    checkFunc: (node: NodeInterface, expected?: ResultType[keyof ResultType]) => boolean,
  ): boolean {
    const diffs: Workflo.IDiffTree = {}
    const context = this._$ as any as ResultType

    for (const key in context) {
      const node = context[key] as any as NodeInterface

      if (supportsInterface(context[key])) {
        if (expected) {
          const expectedValue = (expected as any)[key] as ExpectedType[keyof ExpectedType]

          if (typeof expectedValue !== 'undefined') {
            if (!checkFunc(node, expectedValue)) {
              diffs[`.${key}`] = context[key].__lastDiff
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
    ExpectedType extends Partial<Content> = ExtractTrue<Content>
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    expected: ExpectedType,
    waitFunc: (node: NodeInterface, expected?: ResultType[keyof ResultType]) => NodeInterface
  ): this {
    const context = this._$ as any as ResultType

    for (const key in context) {
      const node = context[key] as any as NodeInterface

      if (supportsInterface(context[key])) {
        if (expected) {
          const expectedValue = (expected as any)[key] as ExpectedType[keyof ExpectedType]

          if (typeof expectedValue !== 'undefined') {
            waitFunc(node, expectedValue)
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
    filterMask: ExtractTrue<Content>,
    doFunc: (node: NodeInterface) => NodeInterface
  ): this {
    const context = this._$

    for (const key in context) {
      const node = context[key] as any as NodeInterface

      if (supportsInterface(context[key])) {
        if (filterMask) {
          if (typeof filterMask[key] !== 'undefined') {
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
    values: StripNever<ValuesType>,
    setFunc: (node: NodeInterface, expected?: ValuesType[keyof ValuesType]) => NodeInterface
  ): this {
    const context = this._$ as StripNever<Content>

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

  getExists(filterMask?: ExtractTrue<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, filterMask, node => node.currently.getExists()
    )
  }

  getIsVisible(filterMask?: ExtractTrue<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, filterMask, node => node.currently.getIsVisible()
    )
  }

  getIsEnabled(filterMask?: ExtractTrue<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, filterMask, node => node.currently.getIsEnabled()
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
  getText(filterMask?: ExtractTrue<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, filterMask, node => node.currently.getText()
    )
  }

  getDirectText(filterMask?: ExtractTrue<Content>) {
    return this._node.eachGet<ElementNode<Content>, ExtractText<Content>> (
      isIElementNode, filterMask, node => node.currently.getDirectText()
    )
  }

  exists(filterMask?: ExtractTrue<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, filterMask, node => node.currently.exists()
    )
  }

  isVisible(filterMask?: ExtractTrue<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, filterMask, node => node.currently.isVisible()
    )
  }

  isEnabled(filterMask?: ExtractTrue<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, filterMask, node => node.currently.isEnabled()
    )
  }

  hasText(text: ExtractText<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, text, (node, text) => node.currently.hasText(text)
    )
  }

  hasAnyText(filterMask?: ExtractTrue<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, filterMask, node => node.currently.hasAnyText()
    )
  }

  containsText(text: ExtractText<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, text, (node, text) => node.currently.containsText(text)
    )
  }

  hasDirectText(directText: ExtractText<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, directText, (node, directText) => node.currently.hasDirectText(directText)
    )
  }

  hasAnyDirectText(filterMask?: ExtractTrue<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, filterMask, node => node.currently.hasAnyDirectText()
    )
  }

  containsDirectText(directText: ExtractText<Content>) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, directText, (node, directText) => node.currently.containsDirectText(directText)
    )
  }

  get not() {
    return {
      exists: (filterMask?: ExtractTrue<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, filterMask, node => node.currently.not.exists()
        )
      },
      isVisible: (filterMask?: ExtractTrue<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, filterMask, node => node.currently.not.isVisible()
        )
      },
      isEnabled: (filterMask?: ExtractTrue<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, filterMask, node => node.currently.not.isEnabled()
        )
      },
      hasText: (text: ExtractText<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, text, (node, text) => node.currently.not.hasText(text)
        )
      },
      hasAnyText: (filterMask?: ExtractTrue<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, filterMask, node => node.currently.not.hasAnyText()
        )
      },
      containsText: (text: ExtractText<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, text, (node, text) => node.currently.not.containsText(text)
        )
      },
      hasDirectText: (directText: ExtractText<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, directText, (node, directText) => node.currently.not.hasDirectText(directText)
        )
      },
      hasAnyDirectText: (filterMask?: ExtractTrue<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, filterMask, node => node.currently.not.hasAnyDirectText()
        )
      },
      containsDirectText: (directText: ExtractText<Content>) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, directText, (node, directText) => node.currently.not.containsDirectText(directText)
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

  exists(opts: Workflo.IWDIOParams & {filterMask?: ExtractTrue<Content>} = {}) {
    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, opts.filterMask, node => node.wait.exists(opts)
    )
  }

  isVisible(opts: Workflo.IWDIOParams & {filterMask?: ExtractTrue<Content>} = {}) {
    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, opts.filterMask, node => node.wait.isVisible(opts)
    )
  }

  isEnabled(opts: Workflo.IWDIOParams & {filterMask?: ExtractTrue<Content>} = {}) {
    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, opts.filterMask, node => node.wait.isEnabled(opts)
    )
  }

  hasText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
      isIElementNode, text, (node, text) => node.wait.hasText(text, opts)
    )
  }

  hasAnyText(opts: Workflo.IWDIOParamsInterval & {filterMask?: ExtractTrue<Content>} = {}) {
    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, opts.filterMask, node => node.wait.hasAnyText(opts)
    )
  }

  containsText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
      isIElementNode, text, (node, text) => node.wait.containsText(text, opts)
    )
  }

  hasDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
      isIElementNode, directText, (node, directText) => node.wait.hasDirectText(directText, opts)
    )
  }

  hasAnyDirectText(opts: Workflo.IWDIOParamsInterval & {filterMask?: ExtractTrue<Content>} = {}) {
    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, opts.filterMask, node => node.wait.hasAnyDirectText(opts)
    )
  }

  containsDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
      isIElementNode, directText, (node, directText) => node.wait.containsDirectText(directText, opts)
    )
  }

  get not() {
    return {
      exists: (opts: Workflo.IWDIOParams & {filterMask?: ExtractTrue<Content>} = {}) => {
        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, opts.filterMask, node => node.wait.not.exists(opts)
        )
      },
      isVisible: (opts: Workflo.IWDIOParams & {filterMask?: ExtractTrue<Content>} = {}) => {
        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, opts.filterMask, node => node.wait.not.isVisible(opts)
        )
      },
      isEnabled: (opts: Workflo.IWDIOParams & {filterMask?: ExtractTrue<Content>} = {}) => {
        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, opts.filterMask, node => node.wait.not.isEnabled(opts)
        )
      },
      hasText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
          isIElementNode, text, (node, text) => node.wait.not.hasText(text, opts)
        )
      },
      hasAnyText: (opts: Workflo.IWDIOParamsInterval & {filterMask?: ExtractTrue<Content>} = {}) => {
        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, opts.filterMask, node => node.wait.not.hasAnyText(opts)
        )
      },
      containsText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
          isIElementNode, text, (node, text) => node.wait.not.containsText(text, opts)
        )
      },
      hasDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
          isIElementNode, directText, (node, directText) => node.wait.not.hasDirectText(directText, opts)
        )
      },
      hasAnyDirectText: (opts: Workflo.IWDIOParamsInterval & {filterMask?: ExtractTrue<Content>} = {}) => {
        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, opts.filterMask, node => node.wait.not.hasAnyDirectText(opts)
        )
      },
      containsDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ElementNode<Content>, ExtractBoolean<Content>, ExtractText<Content>> (
          isIElementNode, directText, (node, directText) => node.wait.not.containsDirectText(directText, opts)
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

  exists(opts: Workflo.IWDIOParams & {filterMask?: ExtractTrue<Content>} = {}) {
    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, opts.filterMask, node => node.eventually.exists(opts)
    )
  }

  isVisible(opts: Workflo.IWDIOParams & {filterMask?: ExtractTrue<Content>} = {}) {
    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, opts.filterMask, node => node.eventually.isVisible(opts)
    )
  }

  isEnabled(opts: Workflo.IWDIOParams & {filterMask?: ExtractTrue<Content>} = {}) {
    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, opts.filterMask, node => node.eventually.isEnabled(opts)
    )
  }

  hasText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, text, (node, text) => node.eventually.hasText(text, opts)
    )
  }

  hasAnyText(opts: Workflo.IWDIOParamsInterval & {filterMask?: ExtractTrue<Content>} = {}) {
    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, opts.filterMask, node => node.eventually.hasAnyText(opts)
    )
  }

  containsText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, text, (node, text) => node.eventually.containsText(text, opts)
    )
  }

  hasDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, directText, (node, directText) => node.eventually.hasDirectText(directText, opts)
    )
  }

  hasAnyDirectText(opts: Workflo.IWDIOParamsInterval & {filterMask?: ExtractTrue<Content>} = {}) {
    return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
      isIElementNode, opts.filterMask, node => node.eventually.hasAnyDirectText(opts)
    )
  }

  containsDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
      isIElementNode, directText, (node, directText) => node.eventually.containsDirectText(directText, opts)
    )
  }

  get not() {
    return {
      exists: (opts: Workflo.IWDIOParams & {filterMask?: ExtractTrue<Content>} = {}) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, opts.filterMask, node => node.eventually.not.exists(opts)
        )
      },
      isVisible: (opts: Workflo.IWDIOParams & {filterMask?: ExtractTrue<Content>} = {}) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, opts.filterMask, node => node.eventually.not.isVisible(opts)
        )
      },
      isEnabled: (opts: Workflo.IWDIOParams & {filterMask?: ExtractTrue<Content>} = {}) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, opts.filterMask, node => node.eventually.not.isEnabled(opts)
        )
      },
      hasText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, text, (node, text) => node.eventually.not.hasText(text, opts)
        )
      },
      hasAnyText: (opts: Workflo.IWDIOParamsInterval & {filterMask?: ExtractTrue<Content>} = {}) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, opts.filterMask, node => node.eventually.not.hasAnyText(opts)
        )
      },
      containsText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, text, (node, text) => node.eventually.not.containsText(text, opts)
        )
      },
      hasDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, directText, (node, directText) => node.eventually.not.hasDirectText(directText, opts)
        )
      },
      hasAnyDirectText: (opts: Workflo.IWDIOParamsInterval & {filterMask?: ExtractTrue<Content>} = {}) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractBoolean<Content>> (
          isIElementNode, opts.filterMask, node => node.eventually.not.hasAnyDirectText(opts)
        )
      },
      containsDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ElementNode<Content>, ExtractText<Content>, ExtractText<Content>> (
          isIElementNode, directText, (node, directText) => node.eventually.not.containsDirectText(directText, opts)
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
