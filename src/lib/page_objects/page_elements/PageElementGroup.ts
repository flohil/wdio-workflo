import { PageElementStore, pageElement } from '../stores'
import { PageNodeCurrently, PageNode } from '.';
import { PageNodeEventually, PageNodeWait } from './PageNode';

export type ExtractText<T extends {[key: string]: Workflo.PageNode.INode}> = {
  [P in keyof T]?: T[P] extends Workflo.PageNode.IElementNode<any> ? ReturnType<T[P]['getText']> : undefined;
}

export type ExtractBoolean<T extends {[key: string]: Workflo.PageNode.INode}> = {
  [P in keyof T]?: T[P] extends Workflo.PageNode.IElementNode<any> ? ReturnType<T[P]['currently']['isVisible']> : undefined;
}

export interface IPageElementGroupOpts<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode}
> {
  store: Store,
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
implements Workflo.PageNode.IElementNode<ExtractText<Content>> {
  protected _id: string
  protected _$: Content
  protected _lastDiff: Workflo.IDiff

  readonly currently: PageElementGroupCurrently<Store, Content, this>
  readonly wait: PageElementGroupWait<Store, Content, this>
  readonly eventually: PageElementGroupEventually<Store, Content, this>

  constructor(id: string, {
    store,
    content
  }: IPageElementGroupOpts<Store, Content>) {
    super(id, {store})

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
  getText(filterMask?: ExtractText<Content>) {
    return this.eachGet<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, filterMask, node => node.getText()
    )
  }

  getDirectText(filterMask?: ExtractText<Content>) {
    return this.eachGet<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, filterMask, node => node.getDirectText()
    )
  }

  // HELPER FUNCTIONS

  eachGet<
    NodeInterface,
    ResultType extends Partial<Content>,
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    filterMask: ResultType,
    getFunc: (node: NodeInterface) => any,
  ): ResultType {
    let result = {} as ResultType;

    for (const key in this.$) {
      if (supportsInterface(this.$[key])) {
        const node = this.$[key] as any as NodeInterface

        if (filterMask) {
          if (typeof filterMask[key] !== 'undefined') {
            this.$[key] = getFunc(node)
          }
        } else {
          this.$[key] = getFunc(node)
        }
      }
    }

    return result;
  }

  eachCheck<
    NodeInterface,
    ResultType extends Partial<Content>,
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    expected: ResultType,
    checkFunc: (node: NodeInterface, expected?: ResultType[keyof ResultType]) => boolean
  ): boolean {
    const diffs: Workflo.IDiffTree = {}
    const context = this._$ as any as ResultType

    for (const key in context) {
      const node = context[key] as any as NodeInterface

      if (supportsInterface(context[key])) {
        if (expected) {
          if (!checkFunc(node, expected[key])) {
            diffs[key] = context[key].__lastDiff
          }
        } else {
          if (!checkFunc(node)) {
            diffs[key] = context[key].__lastDiff
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
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    expected: ResultType,
    waitFunc: (node: NodeInterface, expected?: ResultType[keyof ResultType]) => NodeInterface
  ): this {
    const context = this._$ as any as ResultType

    for (const key in context) {
      const node = context[key] as any as NodeInterface

      if (supportsInterface(context[key])) {
        if (expected) {
          waitFunc(node, expected[key])
        } else {
          waitFunc(node)
        }
      }
    }

    return this
  }

  eachDo<
    NodeInterface,
    ResultType extends Partial<Content>
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    filterMask: ResultType,
    doFunc: (node: NodeInterface) => NodeInterface
  ): this {
    const context = this._$

    for (const key in context) {
      const node = context[key] as any as NodeInterface

      if (supportsInterface(context[key])) {
        if (filterMask && typeof filterMask[key] !== 'undefined') {
          doFunc(node)
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
    ReturnType extends this
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    values: ValuesType,
    setFunc: (node: NodeInterface, expected?: ValuesType[keyof ValuesType]) => NodeInterface
  ): this {
    const context = this._$

    for (const key in context) {
      const node = context[key] as any as NodeInterface

      if (supportsInterface(context[key])) {
        if (values && typeof values[key] !== 'undefined') {
          setFunc(node, values[key])
        } else {
          setFunc(node, values[key])
        }
      }
    }

    return this as ReturnType
  }
}

export class PageElementGroupCurrently<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> extends PageNodeCurrently<Store, GroupType>
implements Workflo.PageNode.IGetElement<ExtractText<Content>> {

  /**
   * Returns texts of all group elements immediatly in the order they were retrieved from the DOM.
   *
   * If passing filter, only values defined in this mask will be returned.
   * By default (if no filter is passed), all values will be returned.
   *
   * @param filter a filter mask
   */
  getText(filterMask?: ExtractText<Content>) {
    return this._node.eachGet<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, filterMask, node => node.currently.getText()
    )
  }

  getDirectText(filterMask?: ExtractText<Content>) {
    return this._node.eachGet<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, filterMask, node => node.currently.getDirectText()
    )
  }

  isVisible(filterMask?: ExtractBoolean<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractBoolean<Content>>, ExtractBoolean<Content>> (
      isIElementNode, filterMask, node => node.currently.isVisible()
    )
  }

  isEnabled(filterMask?: ExtractBoolean<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractBoolean<Content>>, ExtractBoolean<Content>> (
      isIElementNode, filterMask, node => node.currently.isEnabled()
    )
  }

  hasText(text: ExtractText<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, text, (node, text) => node.currently.hasText(text)
    )
  }

  hasAnyText(filterMask?: ExtractText<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, filterMask, node => node.currently.hasAnyText()
    )
  }

  containsText(text: ExtractText<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, text, (node, text) => node.currently.containsText(text)
    )
  }

  hasDirectText(directText: ExtractText<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, directText, (node, directText) => node.currently.hasDirectText(directText)
    )
  }

  hasAnyDirectText(filterMask?: ExtractText<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, filterMask, node => node.currently.hasAnyDirectText()
    )
  }

  containsDirectText(directText: ExtractText<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, directText, (node, directText) => node.currently.containsDirectText(directText)
    )
  }

  not = {
    isVisible: (filterMask?: ExtractBoolean<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractBoolean<Content>>, ExtractBoolean<Content>> (
        isIElementNode, filterMask, node => node.currently.not.isVisible()
      )
    },
    isEnabled: (filterMask?: ExtractBoolean<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractBoolean<Content>>, ExtractBoolean<Content>> (
        isIElementNode, filterMask, node => node.currently.not.isEnabled()
      )
    },
    hasText: (text: ExtractText<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, text, (node, text) => node.currently.not.hasText(text)
      )
    },
    hasAnyText: (filterMask?: ExtractText<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, filterMask, node => node.currently.not.hasAnyText()
      )
    },
    containsText: (text: ExtractText<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, text, (node, text) => node.currently.not.containsText(text)
      )
    },
    hasDirectText: (directText: ExtractText<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, directText, (node, directText) => node.currently.not.hasDirectText(directText)
      )
    },
    hasAnyDirectText: (filterMask?: ExtractText<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, filterMask, node => node.currently.not.hasAnyDirectText()
      )
    },
    containsDirectText: (directText: ExtractText<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, directText, (node, directText) => node.currently.not.containsDirectText(directText)
      )
    }
  }
}

export class PageElementGroupWait<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> extends PageNodeWait<Store, GroupType> {

  isVisible(opts: Workflo.IWDIOParamsOptional & {filterMask?: ExtractBoolean<Content>} = {}) {
    return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractBoolean<Content>>, ExtractBoolean<Content>> (
      isIElementNode, opts.filterMask, node => node.wait.isVisible()
    )
  }

  isEnabled(opts: Workflo.IWDIOParamsOptional & {filterMask?: ExtractBoolean<Content>} = {}) {
    return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractBoolean<Content>>, ExtractBoolean<Content>> (
      isIElementNode, opts.filterMask, node => node.wait.isEnabled()
    )
  }

  hasText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, text, (node, text) => node.wait.hasText(text, opts)
    )
  }

  hasAnyText(opts: Workflo.IWDIOParamsOptional & {filterMask?: ExtractText<Content>} = {}) {
    return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, opts.filterMask, node => node.wait.hasAnyText(opts)
    )
  }

  containsText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, text, (node, text) => node.wait.containsText(text, opts)
    )
  }

  hasDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, directText, (node, directText) => node.wait.hasDirectText(directText, opts)
    )
  }

  hasAnyDirectText(opts: Workflo.IWDIOParamsOptional & {filterMask?: ExtractText<Content>} = {}) {
    return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, opts.filterMask, node => node.wait.hasAnyDirectText(opts)
    )
  }

  containsDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, directText, (node, directText) => node.wait.containsDirectText(directText, opts)
    )
  }

  not = {
    isVisible: (opts: Workflo.IWDIOParamsOptional & {filterMask?: ExtractBoolean<Content>} = {}) => {
      return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractBoolean<Content>>, ExtractBoolean<Content>> (
        isIElementNode, opts.filterMask, node => node.wait.not.isVisible()
      )
    },
    isEnabled: (opts: Workflo.IWDIOParamsOptional & {filterMask?: ExtractBoolean<Content>} = {}) => {
      return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractBoolean<Content>>, ExtractBoolean<Content>> (
        isIElementNode, opts.filterMask, node => node.wait.not.isEnabled()
      )
    },
    hasText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, text, (node, text) => node.wait.not.hasText(text, opts)
      )
    },
    hasAnyText: (opts: Workflo.IWDIOParamsOptional & {filterMask?: ExtractText<Content>} = {}) => {
      return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, opts.filterMask, node => node.wait.not.hasAnyText(opts)
      )
    },
    containsText: (text: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, text, (node, text) => node.wait.not.containsText(text, opts)
      )
    },
    hasDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, directText, (node, directText) => node.wait.not.hasDirectText(directText, opts)
      )
    },
    hasAnyDirectText: (opts: Workflo.IWDIOParamsOptional & {filterMask?: ExtractText<Content>} = {}) => {
      return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, opts.filterMask, node => node.wait.not.hasAnyDirectText(opts)
      )
    },
    containsDirectText: (directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, directText, (node, directText) => node.wait.not.containsDirectText(directText, opts)
      )
    }
  }
}

export class PageElementGroupEventually<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> extends PageNodeEventually<Store, GroupType> {

  isVisible(text: ExtractBoolean<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractBoolean<Content>>, ExtractBoolean<Content>> (
      isIElementNode, text, node => node.eventually.isVisible()
    )
  }

  isEnabled(filterMask?: ExtractBoolean<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractBoolean<Content>>, ExtractBoolean<Content>> (
      isIElementNode, filterMask, node => node.eventually.isEnabled()
    )
  }

  hasText(text: ExtractText<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, text, (node, text) => node.eventually.hasText(text)
    )
  }

  hasAnyText(filterMask?: ExtractText<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, filterMask, node => node.eventually.hasAnyText()
    )
  }

  containsText(text: ExtractText<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, text, (node, text) => node.eventually.containsText(text)
    )
  }

  hasDirectText(directText: ExtractText<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, directText, (node, directText) => node.eventually.hasDirectText(directText)
    )
  }

  hasAnyDirectText(filterMask?: ExtractText<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, filterMask, node => node.eventually.hasAnyDirectText()
    )
  }

  containsDirectText(directText: ExtractText<Content>) {
    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      isIElementNode, directText, (node, directText) => node.eventually.containsDirectText(directText)
    )
  }

  not = {
    isVisible: (text: ExtractBoolean<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractBoolean<Content>>, ExtractBoolean<Content>> (
        isIElementNode, text, node => node.eventually.not.isVisible()
      )
    },
    isEnabled: (filterMask?: ExtractBoolean<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractBoolean<Content>>, ExtractBoolean<Content>> (
        isIElementNode, filterMask, node => node.eventually.not.isEnabled()
      )
    },
    hasText: (text: ExtractText<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, text, (node, text) => node.eventually.not.hasText(text)
      )
    },
    hasAnyText: (filterMask?: ExtractText<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, filterMask, node => node.eventually.not.hasAnyText()
      )
    },
    containsText: (text: ExtractText<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, text, (node, text) => node.eventually.not.containsText(text)
      )
    },
    hasDirectText: (directText: ExtractText<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, directText, (node, directText) => node.eventually.not.hasDirectText(directText)
      )
    },
    hasAnyDirectText: (filterMask?: ExtractText<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, filterMask, node => node.eventually.not.hasAnyDirectText()
      )
    },
    containsDirectText: (directText: ExtractText<Content>) => {
      return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
        isIElementNode, directText, (node, directText) => node.eventually.not.containsDirectText(directText)
      )
    }
  }
}

// type guards
function isIElementNode<TextType>(node: Workflo.PageNode.INode | Workflo.PageNode.IElementNode<TextType>):
node is Workflo.PageNode.IElementNode<TextType> {
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
