import { PageElementStore, pageElement } from '../stores'
import { PageNodeCurrently, PageNode } from '.';
import { PageNodeEventually, PageNodeWait } from './PageNode';
import { stores } from '..';

export type ExtractText<T extends {[key: string]: Workflo.PageNode.INode}> = {
  [P in keyof T]?: T[P] extends Workflo.PageNode.IElementNode<any> ? ReturnType<T[P]['getText']> : undefined;
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
implements Workflo.PageNode.IElementNode<ExtractText<Partial<Content>>> {
  protected _id: string
  protected _$: Content
  protected _lastDiff: Workflo.PageNode.IDiff

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

  get __lastDiff() {
    return this._lastDiff
  }

  __toJSON(): Workflo.PageNode.IElementJSON {
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
      node => typeof node['getText'] === 'function',
      node => node.getText(),
      filterMask
    )
  }

  // HELPER FUNCTIONS

  eachGet<
    NodeInterface,
    ResultType extends Partial<Content>,
  >(
    supportsInterface: (node: Workflo.PageNode.INode) => boolean,
    getFunc: (node: NodeInterface) => any,
    filterMask: ResultType
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
    checkFunc: (node: NodeInterface, expected?: ResultType[keyof ResultType]) => boolean,
    expected: ResultType
  ): boolean {
    const diffs: Workflo.PageNode.IDiffTree = {}
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
    waitFunc: (node: NodeInterface, expected?: ResultType[keyof ResultType]) => NodeInterface,
    expected: ResultType
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
}

export class PageElementGroupCurrently<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> extends PageNodeCurrently<Store, GroupType>
implements Workflo.PageNode.IGetText<ExtractText<Partial<Content>>> {

  /**
   * Returns texts of all group elements immediatly in the order they were retrieved from the DOM.
   *
   * If passing filter, only values defined in this mask will be returned.
   * By default (if no filter is passed), all values will be returned.
   *
   * @param filter a filter mask
   */
  getText(filterMask?: ExtractText<Partial<Content>>) {
    return this._node.eachGet<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      node => typeof node.currently["getText"] === "function",
      node => node.currently.getText(),
      filterMask
    )
  }

  hasText(text: ExtractText<Partial<Content>>) {
    // return this._node.eachCheck((element, expected) => element.currently.hasText(expected), text)

    return this._node.eachCheck<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      node => typeof node.currently["hasText"] === "function",
      (node, text) => node.currently.hasText(text),
      text
    )
  }

  hasAnyText() {
    return this._node.eachCheck(element => element.currently.hasAnyText())
  }

  containsText(text: ExtractText<Partial<Content>>) {
    return this._node.eachCheck((element, expected) => element.currently.containsText(expected), text)
  }

  not = {
    hasText: (text: ExtractText<Partial<Content>>) => {
      return this._node.eachCheck((element, expected) => element.currently.not.hasText(expected), text)
    },
    hasAnyText: () => {
      return this._node.eachCheck(element => element.currently.not.hasAnyText())
    },
    containsText: (text: ExtractText<Partial<Content>>) => {
      return this._node.eachCheck((element, expected) => element.currently.not.containsText(expected), text)
    }
  }
}

export class PageElementGroupWait<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> extends PageNodeWait<Store, GroupType> {

  hasText(text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) {

    return this._node.eachWait<Workflo.PageNode.IElementNode<ExtractText<Content>>, ExtractText<Content>> (
      node => typeof node.wait["hasText"] === "function",
      (node, text) => node.wait.hasText(text, opts),
      text
    )
  }

  hasAnyText(opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck(element => element.eventually.hasAnyText(opts))
  }

  containsText(text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck((element, expected) => element.eventually.containsText(expected, opts), text)
  }

  not = {
    hasText: (text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck((element, expected) => element.eventually.not.hasText(expected, opts), text)
    },
    hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck(element => element.eventually.not.hasAnyText(opts))
    },
    containsText: (text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck((element, expected) => element.eventually.not.containsText(expected, opts), text)
    }
  }
}

export class PageElementGroupEventually<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> extends PageNodeEventually<Store, GroupType> {

  hasText(text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck((element, expected) => element.eventually.hasText(expected, opts), text)
  }

  hasAnyText(opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck(element => element.eventually.hasAnyText(opts))
  }

  containsText(text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck((element, expected) => element.eventually.containsText(expected, opts), text)
  }

  not = {
    hasText: (text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck((element, expected) => element.eventually.not.hasText(expected, opts), text)
    },
    hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck(element => element.eventually.not.hasAnyText(opts))
    },
    containsText: (text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck((element, expected) => element.eventually.not.containsText(expected, opts), text)
    }
  }
}

// type guards
function isGetTextNode(node: any): node is Workflo.PageNode.IElementNode<any> {
  return typeof node.getText === 'function' &&
  typeof node.currently.hasText === 'function' &&
  typeof node.currently.hasAnyText === 'function' &&
  typeof node.currently.containsText === 'function' &&
  typeof node.eventually.hasText === 'function' &&
  typeof node.eventually.hasAnyText === 'function' &&
  typeof node.eventually.containsText === 'function'
}
