import { PageElementStore } from '../stores'
import { PageElementGroupWalker, IPageElementGroupWalkerOpts } from '../walkers'

export interface IPageElementGroupOpts<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  WalkerType extends PageElementGroupWalker<Store>,
  WalkerOptions extends IPageElementGroupWalkerOpts
> {
  id: string,
  content: Content,
  walkerType: { new(options: WalkerOptions): WalkerType }
  walkerOptions: WalkerOptions
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
  Content extends {[key: string] : Workflo.PageNode.INode},
  WalkerType extends PageElementGroupWalker<Store>,
  WalkerOptions extends IPageElementGroupWalkerOpts
> implements Workflo.PageNode.INode {
  protected _id: string
  protected _walker: WalkerType
  protected readonly _$: Content

  constructor({
    id,
    content,
    walkerType,
    walkerOptions
  }: IPageElementGroupOpts<Store, Content, WalkerType, WalkerOptions>) {
    this._id = id
    this._walker = new walkerType(walkerOptions)
    this._$ = content
  }

  get $() {
    return this._$
  }

  getNodeId() {
    return this._id
  }

  toJSON(): Workflo.PageNode.IElementJSON {
    return {
      pageNodeType: this.constructor.name,
      nodeId: this._id
    }
  }

  solve<ValueType, ResultType>(
    problem: Workflo.IProblem<ValueType, ResultType>,
    options: Workflo.IWalkerOptions = { throwUnmatchedKey: true, throwSolveError: true }
  ) : Workflo.IRecObj<ResultType> {
    return this._walker.walk( problem, this.$, options )
  }
}