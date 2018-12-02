import { PageElementStore } from '../stores'

export type ExtractText<T extends {[key: string]: Workflo.PageNode.INode}> = {
  [P in keyof T]: T[P] extends Workflo.PageNode.IGetTextNode<any> ? ReturnType<T[P]['getText']> : undefined;
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
> implements Workflo.PageNode.IGetTextNode<ExtractText<Content>> {
  protected _id: string
  protected _$: Content

  readonly currently: PageElementGroupCurrently<Store, Content, this>

  constructor({
    id,
    content
  }: IPageElementGroupOpts<Content>) {
    this._id = id
    this._$ = content

    this.currently = new PageElementGroupCurrently(this)
  }

  get $() {
    return this._$
  }

  __toJSON(): Workflo.PageNode.IElementJSON {
    return {
      pageNodeType: this.constructor.name,
      nodeId: this._id
    }
  }

  // GETTER FUNCTIONS

  __getNodeId() {
    return this._id
  }

  getText() {
    let result = {} as ExtractText<Content>;

    for (const k in this.$) {
      if (isGetTextNode(this.$[k])) {
        const elem = this.$[k] as any as Workflo.PageNode.IGetTextNode<any>
        result[k] = elem.getText()
      }
    }

    return result;
  }
}

// type guards
function isGetTextNode(node: any): node is Workflo.PageNode.IGetTextNode<any> {
  return node.getText !== undefined;
}

export class PageElementGroupCurrently<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> implements Workflo.PageNode.IGetText<ExtractText<Content>> {

  protected readonly _node: GroupType

  constructor(node: GroupType) {
    this._node = node;
  }

  getText() {
    let result = {} as ExtractText<Content>;

    for (const k in this._node.$) {
      if (isGetTextNode(this._node.$[k])) {
        const elem = this._node.$[k] as any as Workflo.PageNode.IGetTextNode<any>
        result[k] = elem.getText()
      }
    }

    return result;
  }
}