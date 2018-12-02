import { PageElementStore } from '../stores'
import { PageElementGroup, IPageElementGroupOpts } from '.';

type ExtractValue<T extends {[key: string]: Workflo.PageNode.INode}> = {
  [P in keyof T]: T[P] extends Workflo.PageNode.IGetValueNode<any> ? ReturnType<T[P]['getValue']> : undefined;
}

export interface IValueGroupOpts<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode}
> extends IPageElementGroupOpts<
  Store,
  Content
> { }

export class ValueGroup<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode}
> extends PageElementGroup<Store, Content>
implements Workflo.PageNode.IGetValueNode<ExtractValue<Content>> {

  constructor({
    ...superOpts
  }: IValueGroupOpts<Store, Content>) {
    super(superOpts)
  }

  SetValue( {values, options} : {
    values: Workflo.IRecObj<Workflo.Value>
    options?: Workflo.IWalkerOptions
  } ) {
    return this.solve<Workflo.Value, void>({
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

  getValue() {
    let result = {} as ExtractValue<Content>;

    for (const k in this.$) {
      if (isGetValueNode(this.$[k])) {
        const elem = this.$[k] as any as Workflo.PageNode.IGetValueNode<any>
        result[k] = elem.getValue()
      }
    }

    return result;
  }
}

// type guards
function isGetValueNode(node: any): node is Workflo.PageNode.IGetValueNode<any> {
  return typeof node['getValue'] === 'function';
}

function isSetValueNode(node: any): node is Workflo.PageNode.ISetValueNode<Workflo.Value> {
  return typeof node['setValue'] === 'function';
}
