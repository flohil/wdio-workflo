export interface IPageElementGroupOpts<
  Store extends Workflo.IPageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  WalkerType extends Workflo.IPageElementGroupWalker<Store>,
  WalkerOptions extends Workflo.IPageElementGroupWalkerOpts
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
  Store extends Workflo.IPageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  WalkerType extends Workflo.IPageElementGroupWalker<Store>,
  WalkerOptions extends Workflo.IPageElementGroupWalkerOpts
> implements Workflo.PageNode.INode {
  protected __id: string
  protected __walker: WalkerType
  protected __content: Content

  constructor({
    id,
    content,
    walkerType,
    walkerOptions
  }: IPageElementGroupOpts<Store, Content, WalkerType, WalkerOptions>) {
    const self: any = this

    // merge content directly into group object,
    // so it can be accessed via dot notation
    for ( const key in content ) {
      if ( content.hasOwnProperty( key ) ) {
        if (key.length >= 2 && key.substring(0, 2) === '__') {
          throw new Error(`Content nodes must not start with '__': ${key}`)
        } else if ( /^[A-Z]/.test( key ) ) {
          throw new Error(`Content nodes must not start with capital letters: ${key}`)
        } else {
          self[ key ] = content[ key ]
        }
      }
    }

    this.__id = id
    this.__walker = new walkerType(walkerOptions)
    this.__content = content
  }

  __getNodeId() {
    return this.__id
  }

  Solve<ValueType, ResultType>(
    problem: Workflo.IProblem<ValueType, ResultType>,
    options: Workflo.IWalkerOptions = { throwUnmatchedKey: true, throwSolveError: true }
  ) : Workflo.IRecObj<ResultType> {
    return this.__walker.walk( problem, this.__content, options )
  } 
}