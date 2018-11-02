import { TextGroup, ITextGroupOpts } from '.'
import { PageElementGroupWalker, IPageElementGroupWalkerOpts } from '../walkers'
import { PageElementStore } from '../stores'

export interface IValueGroupOpts<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  WalkerType extends PageElementGroupWalker<Store>,
  WalkerOptions extends IPageElementGroupWalkerOpts
> extends ITextGroupOpts<
  Store,
  Content,
  WalkerType,
  WalkerOptions
> { }

export class ValueGroup<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  WalkerType extends PageElementGroupWalker<Store>,
  WalkerOptions extends IPageElementGroupWalkerOpts
> extends TextGroup<Store, Content, WalkerType, WalkerOptions> {
  constructor({
    ...superOpts
  }: IValueGroupOpts<Store, Content, WalkerType, WalkerOptions>) {
    super(superOpts)
  }

  /**
   * Returns node value for nodes which implement Workflo.PageNode.IGetValue
   * or undefined for those which don't.
   * @param param
   */
  GetValue( {filter, options} : {
    filter?: Workflo.IRecObj<boolean>,
    options?: Workflo.IWalkerOptions
  } = {} ) {
    return this.Solve<any, Workflo.Value>({
      values: Workflo.Object.stripMaskDeep(filter),
      solve: ( node ) => {
        if (isGetValueNode(node)) {
          return {
            nodeSupported: true,
            result: node.getValue()
          }
        } else {
          return {
            nodeSupported: false
          }
        }
      }
    }, options)
  }

  SetValue( {values, options} : {
    values: Workflo.IRecObj<Workflo.Value>
    options?: Workflo.IWalkerOptions
  } ) {
    return this.Solve<Workflo.Value, void>({
      values: values,
      solve: ( node, value ) => {
        if (isSetValueNode(node)) {
          node.setValue(value)
          return {
            nodeSupported: true
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
function isGetValueNode(node: any): node is Workflo.PageNode.IGetValue {
  return node.getValue !== undefined;
}

function isSetValueNode(node: any): node is Workflo.PageNode.ISetValue<Workflo.Value> {
  return node.setValue !== undefined;
}