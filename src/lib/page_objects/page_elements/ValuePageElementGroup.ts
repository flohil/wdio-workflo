import { PageElementStore } from '../stores'
import { PageElementGroup, IPageElementGroupOpts, PageElementGroupCurrently } from '.';

type ExtractValue<T extends {[key: string]: Workflo.PageNode.INode}> = {
  [P in keyof T]: T[P] extends Workflo.PageNode.IGetValueNode<any> ? ReturnType<T[P]['getValue']> : undefined;
}

export interface IValueGroupOpts<
  Content extends {[key: string] : Workflo.PageNode.INode}
> extends IPageElementGroupOpts<
  Content
> { }

export class ValuePageElementGroup<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode}
> extends PageElementGroup<Store, Content>
implements Workflo.PageNode.IGetValueNode<ExtractValue<Content>>,
Workflo.PageNode.ISetValueNode<ExtractValue<Content>> {

  readonly currently: ValuePageElementGroupCurrently<Store, Content, this>

  constructor({
    ...superOpts
  }: IValueGroupOpts<Content>) {
    super(superOpts)

    this.currently = new ValuePageElementGroupCurrently(this)
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

  /**
   * Sets values after performing the initial wait on all nodes that implement the setValue method.
   * Nodes that do not implement the setValue method will be ignored.
   *
   * @param values
   */
  setValue(values: ExtractValue<Partial<Content>>) {
    for (const k in values) {
      if (isSetValueNode(this.$[k])) {
        const node = this.$[k] as any as Workflo.PageNode.ISetValueNode<any>
        node.setValue(values[k])
      }
    }

    return this
  }
}

class ValuePageElementGroupCurrently<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> extends PageElementGroupCurrently<Store, Content, GroupType>
implements Workflo.PageNode.IGetValue<ExtractValue<Content>>,
  Workflo.PageNode.ISetValueWithContext<ExtractValue<Content>, GroupType> {

  getValue() {
    let result = {} as ExtractValue<Content>;

    for (const k in this._node.$) {
      if (isGetValueNode(this._node.$[k])) {
        const node = this._node.$[k] as any as Workflo.PageNode.IGetValueNode<any>
        result[k] = node.currently.getValue()
      }
    }

    return result;
  }

  /**
   * Sets values immediately on all nodes that implement the setValue method.
   * Nodes that do not implement the setValue method will be ignored.
   *
   * @param values
   */
  setValue(values: ExtractValue<Partial<Content>>) {
    for (const k in values) {
      if (isSetValueNode(this._node.$[k])) {
        const node = this._node.$[k] as any as Workflo.PageNode.ISetValueNode<any>
        node.setValue(values[k])
      }
    }

    return this._node
  }
}

// type guards
function isGetValueNode(node: any): node is Workflo.PageNode.IGetValueNode<any> {
  return typeof node['getValue'] === 'function';
}

function isSetValueNode(node: any): node is Workflo.PageNode.ISetValueNode<Workflo.Value> {
  return typeof node['setValue'] === 'function';
}
