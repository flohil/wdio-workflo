import { PageElementGroup, IPageElementGroupOpts } from './'

export interface ITextGroupOpts<
  Store extends Workflo.IPageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  WalkerType extends Workflo.IPageElementGroupWalker<Store>,
  WalkerOptions extends Workflo.IPageElementGroupWalkerOpts
> extends IPageElementGroupOpts<
  Store,
  Content,
  WalkerType,
  WalkerOptions
> {}

export class TextGroup<
  Store extends Workflo.IPageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  WalkerType extends Workflo.IPageElementGroupWalker<Store>,
  WalkerOptions extends Workflo.IPageElementGroupWalkerOpts
> extends PageElementGroup<Store, Content, WalkerType, WalkerOptions> {
  constructor({
    ...superOpts
  }: ITextGroupOpts<Store, Content, WalkerType, WalkerOptions>) {
    super(superOpts)
  }

  /**
   * If using filter, only those element text will be returned which are defined and truthy in filter.
   * 
   * @param param0 
   */
  GetText( {filter, options} : {
    filter?: Workflo.IRecObj<boolean>,
    options?: Workflo.IWalkerOptions
  } = {} ) {
    return this.Solve<any, string>({
      values: Workflo.Object.stripMaskDeep(filter),
      solve: ( node ) => {
        if (isGetTextNode(node)) {
          return {
            nodeSupported: true,
            result: node.getText()
          }
        } else {
          return {
            nodeSupported: false
          }
        }
      }
    }, options)
  }
}

// type guards
function isGetTextNode(node: any): node is Workflo.PageNode.IGetText {
  return node.getText !== undefined;
}