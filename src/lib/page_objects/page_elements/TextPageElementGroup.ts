import { PageElementGroup, IPageElementGroupOpts } from '.'
import { PageElementGroupWalker, IPageElementGroupWalkerOpts } from '../walkers'
import { PageElementStore } from '../stores'

type ExtractText<T extends {[key: string]: Workflo.PageNode.INode}> = {
  [P in keyof T]: T[P] extends Workflo.PageNode.IGetText<any> ? ReturnType<T[P]['getText']> : undefined;
}

export interface ITextGroupOpts<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  WalkerType extends PageElementGroupWalker<Store>,
  WalkerOptions extends IPageElementGroupWalkerOpts
> extends IPageElementGroupOpts<
  Store,
  Content,
  WalkerType,
  WalkerOptions
> {}

export class TextGroup<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  WalkerType extends PageElementGroupWalker<Store>,
  WalkerOptions extends IPageElementGroupWalkerOpts
> extends PageElementGroup<Store, Content, WalkerType, WalkerOptions> {
  constructor({
    ...superOpts
  }: ITextGroupOpts<Store, Content, WalkerType, WalkerOptions>) {
    super(superOpts)
  }

  getText() {
    let result = {} as ExtractText<Content>;

    for (const k in this.$) {
      if (isGetTextNode(this.$[k])) {
        const elem = this.$[k] as any as Workflo.PageNode.IGetText<any>
        result[k] = elem.getText()
      }
    }

    return result;
  }
}

// type guards
function isGetTextNode(node: any): node is Workflo.PageNode.IGetText<any> {
  return node.getText !== undefined;
}