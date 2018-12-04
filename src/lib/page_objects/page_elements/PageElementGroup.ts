import { PageElementStore } from '../stores'

export type ExtractText<T extends {[key: string]: Workflo.PageNode.INode}> = {
  [P in keyof T]: T[P] extends Workflo.PageNode.IGetTextNode<any> ? ReturnType<T[P]['getText']> : undefined;
}

export type FilterMaskText<T extends {[key: string]: Workflo.PageNode.INode}> = {
  [P in keyof T]: T[P] extends Workflo.PageNode.IGetTextNode<any> ? boolean : undefined;
}

export interface IPageElementGroupOpts<
  Content extends {[key: string] : Workflo.PageNode.INode}
> {
  id: string,
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
  Content extends {[key: string] : Workflo.PageNode.INode}
> implements Workflo.PageNode.IGetTextNode<ExtractText<Partial<Content>>> {
  protected _id: string
  protected _$: Content
  protected _lastDiff: Workflo.PageNode.IDiff

  readonly currently: PageElementGroupCurrently<Store, Content, this>
  readonly eventually: PageElementGroupEventually<Store, Content, this>

  constructor({
    id,
    content
  }: IPageElementGroupOpts<Content>) {
    this._id = id
    this._$ = content

    this.currently = new PageElementGroupCurrently(this)
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

  getText(filterMask?: FilterMaskText<Partial<Content>>) {
    let result = {} as ExtractText<Partial<Content>>;

    for (const k in this.$) {
      if (isGetTextNode(this.$[k])) {
        const elem = this.$[k] as any as Workflo.PageNode.IGetTextNode<any>

        if (filterMask) {
          if (filterMask[k] === true) {
            result[k] = elem.getText()
          }
        } else {
          result[k] = elem.getText()
        }
      }
    }

    return result;
  }

  // HELPER FUNCTIONS

  __compareText<T, K extends string>(
    compareFunc: (node: Workflo.PageNode.IGetTextNode<any>, expected?: Content[K]) => boolean,
    expected?: ExtractText<Partial<Content>>,
  ): boolean {
    const diffs: Workflo.PageNode.IDiffTree = {}

    for (const k in expected) {
      if (isGetTextNode(this._$[k])) {
        const elem = this._$[k] as any as Workflo.PageNode.IGetTextNode<any>

        if (!compareFunc(elem, expected[k])) {
          diffs[k] = elem.__lastDiff
        }
      }
    }

    this._lastDiff = {
      tree: diffs
    }

    return Object.keys(diffs).length === 0
  }
}

export class PageElementGroupCurrently<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> implements Workflo.PageNode.IGetText<ExtractText<Partial<Content>>>,
  Workflo.PageNode.ICheckTextCurrently<ExtractText<Partial<Content>>> {

  protected readonly _node: GroupType

  constructor(node: GroupType) {
    this._node = node;
  }

  getText(filterMask?: FilterMaskText<Partial<Content>>) {
    let result = {} as ExtractText<Partial<Content>>;

    for (const k in this._node.$) {
      if (isGetTextNode(this._node.$[k])) {
        const elem = this._node.$[k] as any as Workflo.PageNode.IGetTextNode<any>

        if (filterMask) {
          if (filterMask[k] === true) {
            result[k] = elem.currently.getText()
          }
        } else {
          result[k] = elem.currently.getText()
        }
      }
    }

    return result;
  }

  hasText(text: ExtractText<Partial<Content>>) {
    return this._node.__compareText((element, expected) => element.currently.hasText(expected), text)
  }

  hasAnyText() {
    return this._node.__compareText(element => element.currently.hasAnyText())
  }

  containsText(text: ExtractText<Partial<Content>>) {
    return this._node.__compareText((element, expected) => element.currently.containsText(expected), text)
  }

  not = {
    hasText: (text: ExtractText<Partial<Content>>) => {
      return this._node.__compareText((element, expected) => element.currently.not.hasText(expected), text)
    },
    hasAnyText: () => {
      return this._node.__compareText(element => element.currently.not.hasAnyText())
    },
    containsText: (text: ExtractText<Partial<Content>>) => {
      return this._node.__compareText((element, expected) => element.currently.not.containsText(expected), text)
    }
  }
}

export class PageElementGroupEventually<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> implements Workflo.PageNode.ICheckTextEventually<ExtractText<Partial<Content>>> {

  protected readonly _node: GroupType

  constructor(node: GroupType) {
    this._node = node;
  }

  hasText(text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.__compareText((element, expected) => element.eventually.hasText(expected, opts), text)
  }

  hasAnyText(opts?: Workflo.IWDIOParamsOptional) {
    return this._node.__compareText(element => element.eventually.hasAnyText(opts))
  }

  containsText(text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.__compareText((element, expected) => element.eventually.containsText(expected, opts), text)
  }

  not = {
    hasText: (text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.__compareText((element, expected) => element.eventually.not.hasText(expected, opts), text)
    },
    hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.__compareText(element => element.eventually.not.hasAnyText(opts))
    },
    containsText: (text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.__compareText((element, expected) => element.eventually.not.containsText(expected, opts), text)
    }
  }
}

// type guards
function isGetTextNode(node: any): node is Workflo.PageNode.IGetTextNode<any> {
  return typeof node.getText === 'function' &&
  typeof node.currently.hasText === 'function' &&
  typeof node.currently.hasAnyText === 'function' &&
  typeof node.currently.containsText === 'function' &&
  typeof node.eventually.hasText === 'function' &&
  typeof node.eventually.hasAnyText === 'function' &&
  typeof node.eventually.containsText === 'function'
}