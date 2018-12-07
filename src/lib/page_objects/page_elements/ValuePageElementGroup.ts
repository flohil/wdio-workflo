import { PageElementStore } from '../stores'
import { PageElementGroup, IPageElementGroupOpts, PageElementGroupCurrently, PageElementGroupEventually, PageElementGroupWait } from '.';

type ExtractValue<T extends {[key: string]: Workflo.PageNode.INode}> = {
  [P in keyof T]: T[P] extends Workflo.PageNode.IGetValueElementNode<any> ? ReturnType<T[P]['getValue']> : undefined;
}

export interface IValueGroupOpts<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode}
> extends IPageElementGroupOpts<
  Store, Content
> { }

export class ValuePageElementGroup<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode}
> extends PageElementGroup<Store, Content>
implements Workflo.PageNode.IGetValueElementNode<ExtractValue<Partial<Content>>>,
Workflo.PageNode.ISetValueElementNode<ExtractValue<Partial<Content>>> {

  readonly currently: ValuePageElementGroupCurrently<Store, Content, this>
  readonly wait: ValuePageElementGroupWait<Store, Content, this>
  readonly eventually: ValuePageElementGroupEventually<Store, Content, this>

  constructor(id: string, {
    ...superOpts
  }: IValueGroupOpts<Store, Content>) {
    super(id, superOpts)

    this.currently = new ValuePageElementGroupCurrently(this)
    this.wait = new ValuePageElementGroupWait(this)
    this.eventually = new ValuePageElementGroupEventually(this)
  }

  getValue(filter?: ExtractValue<Partial<Content>>) {
    let result = {} as ExtractValue<Partial<Content>>;

    for (const k in this.$) {
      if (isGetValueNode(this.$[k])) {
        const elem = this.$[k] as any as Workflo.PageNode.IGetValueElementNode<any>

        if (filter) {
          if (typeof filter[k] !== 'undefined') {
            result[k] = elem.getValue()
          }
        } else {
          result[k] = elem.getValue()
        }
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
        const node = this.$[k] as any as Workflo.PageNode.ISetValueElementNode<any>
        node.setValue(values[k])
      }
    }

    return this
  }

  // HELPER FUNCTIONS

  __compareValue<K extends string>(
    compareFunc: (node: Workflo.PageNode.IGetValueElementNode<any>, expected?: Content[K]) => boolean,
    expected?: ExtractValue<Partial<Content>>,
  ): boolean {
    const diffs: Workflo.PageNode.IDiffTree = {}

    for (const k in expected) {
      if (isGetValueNode(this._$[k])) {
        const elem = this._$[k] as any as Workflo.PageNode.IGetValueElementNode<any>

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

class ValuePageElementGroupCurrently<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends ValuePageElementGroup<Store, Content>
> extends PageElementGroupCurrently<Store, Content, GroupType> {

  getValue(filter?: ExtractValue<Partial<Content>>) {
    let result = {} as ExtractValue<Partial<Content>>;

    for (const k in this._node.$) {
      if (isGetValueNode(this._node.$[k])) {
        const elem = this._node.$[k] as any as Workflo.PageNode.IGetValueElementNode<any>

        if (filter) {
          if (typeof filter[k] !== 'undefined') {
            result[k] = elem.currently.getValue()
          }
        } else {
          result[k] = elem.currently.getValue()
        }
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
        const node = this._node.$[k] as any as Workflo.PageNode.ISetValueElementNode<any>
        node.currently.setValue(values[k])
      }
    }

    return this._node
  }

  hasValue(value: ExtractValue<Partial<Content>>) {
    return this._node.__compareValue((element, expected) => element.currently.hasValue(expected), value)
  }

  hasAnyValue() {
    return this._node.__compareValue(element => element.currently.hasAnyValue())
  }

  containsValue(value: ExtractValue<Partial<Content>>) {
    return this._node.__compareValue((element, expected) => element.currently.containsValue(expected), value)
  }

  not = {...super.not,
    hasValue: (value: ExtractValue<Partial<Content>>) => {
      return this._node.__compareValue((element, expected) => element.currently.not.hasValue(expected), value)
    },
    hasAnyValue: () => {
      return this._node.__compareValue(element => element.currently.not.hasAnyValue())
    },
    containsValue: (value: ExtractValue<Partial<Content>>) => {
      return this._node.__compareValue((element, expected) => element.currently.not.containsValue(expected), value)
    }
  }
}

class ValuePageElementGroupWait<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends ValuePageElementGroup<Store, Content>
> extends PageElementGroupWait<Store, Content, GroupType> {

  
}

class ValuePageElementGroupEventually<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends ValuePageElementGroup<Store, Content>
> extends PageElementGroupEventually<Store, Content, GroupType> {

  hasValue(value: ExtractValue<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.__compareValue(
      (element, expected) => element.eventually.hasValue(expected, opts), value
    )
  }

  hasAnyValue(opts?: Workflo.IWDIOParamsOptional) {
    return this._node.__compareValue(element => element.eventually.hasAnyValue(opts))
  }

  containsValue(value: ExtractValue<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.__compareValue(
      (element, expected) => element.eventually.containsValue(expected, opts), value
    )
  }

  not = {...super.not,
    hasValue: (value: ExtractValue<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.__compareValue(
        (element, expected) => element.eventually.not.hasValue(expected, opts), value
      )
    },
    hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.__compareValue(element => element.eventually.not.hasAnyValue())
    },
    containsValue: (value: ExtractValue<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.__compareValue(
        (element, expected) => element.eventually.not.containsValue(expected, opts), value
      )
    }
  }
}

// type guards
function isGetValueNode(node: any): node is Workflo.PageNode.IGetValueElementNode<any> {
  return typeof node.getValue === 'function';
}

function isSetValueNode(node: any): node is Workflo.PageNode.ISetValueElementNode<Workflo.Value> {
  return typeof node.setValue === 'function';
}
