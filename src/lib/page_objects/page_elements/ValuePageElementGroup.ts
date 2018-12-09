import { PageElementStore } from '../stores'
import { PageElementGroup, IPageElementGroupOpts, PageElementGroupCurrently, PageElementGroupEventually, PageElementGroupWait } from '.';

type ExtractValue<T extends {[key: string]: Workflo.PageNode.INode}> = {
  [P in keyof T]?: T[P] extends Workflo.PageNode.IGetValueElementNode<any> ? ReturnType<T[P]['getValue']> : undefined;
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

  getValue(filterMask?: ExtractValue<Partial<Content>>) {
    return this.eachGet<Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>> (
      isIGetValueElementNode, filterMask, node => node.getValue()
    )
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
}

class ValuePageElementGroupCurrently<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends ValuePageElementGroup<Store, Content>
> extends PageElementGroupCurrently<Store, Content, GroupType> {

  getValue(filterMask?: ExtractValue<Content>) {
    return this._node.eachGet<Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>> (
      isIGetValueElementNode, filterMask, node => node.currently.getValue()
    )
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
    return this._node.eachCheck<Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>> (
      isIGetValueElementNode, value, (node, value) => node.currently.hasValue(value)
    )
  }

  hasAnyValue(filterMask?: ExtractValue<Partial<Content>>) {
    return this._node.eachCheck<Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>> (
      isIGetValueElementNode, filterMask, node => node.currently.hasAnyValue()
    )
  }

  containsValue(value: ExtractValue<Partial<Content>>) {
    return this._node.eachCheck<Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>> (
      isIGetValueElementNode, value, (node, value) => node.currently.containsValue(value)
    )
  }

  not = {...super.not,
    hasValue: (value: ExtractValue<Partial<Content>>) => {
      return this._node.eachCheck<Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>> (
        isIGetValueElementNode, value, (node, value) => node.currently.not.hasValue(value)
      )
    },
    hasAnyValue: (filterMask?: ExtractValue<Partial<Content>>) => {
      return this._node.eachCheck<Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>> (
        isIGetValueElementNode, filterMask, node => node.currently.not.hasAnyValue()
      )
    },
    containsValue: (value: ExtractValue<Partial<Content>>) => {
      return this._node.eachCheck<Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>> (
        isIGetValueElementNode, value, (node, value) => node.currently.not.containsValue(value)
      )
    }
  }
}

class ValuePageElementGroupWait<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends ValuePageElementGroup<Store, Content>
> extends PageElementGroupWait<Store, Content, GroupType> {

  hasValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait<
      Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>
    > (
      isIGetValueElementNode, value, (node, value) => node.wait.hasValue(value, opts)
    )
  }

  hasAnyValue(opts: Workflo.IWDIOParamsOptional & {filterMask?: ExtractValue<Partial<Content>>} = {}) {
    return this._node.eachWait<
      Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>
    > (
      isIGetValueElementNode, opts.filterMask, node => node.wait.hasAnyValue(opts)
    )
  }

  containsValue(value: ExtractValue<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachWait<
      Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>
    > (
      isIGetValueElementNode, value, (node, value) => node.wait.containsValue(value, opts)
    )
  }

  not = {...super.not,
    hasValue: (value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait<
        Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>
      > (
        isIGetValueElementNode, value, (node, value) => node.wait.hasValue(value, opts)
      )
    },
    hasAnyValue: (opts: Workflo.IWDIOParamsOptional & {filterMask?: ExtractValue<Partial<Content>>} = {}) => {
      return this._node.eachWait<
        Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>
      > (
        isIGetValueElementNode, opts.filterMask, node => node.wait.hasAnyValue(opts)
      )
    },
    containsValue: (value: ExtractValue<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachWait<
        Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>
      > (
        isIGetValueElementNode, value, (node, value) => node.wait.containsValue(value, opts)
      )
    }
  }
}

class ValuePageElementGroupEventually<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends ValuePageElementGroup<Store, Content>
> extends PageElementGroupEventually<Store, Content, GroupType> {

  hasValue(value: ExtractValue<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck<Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>> (
      isIGetValueElementNode, value, (node, value) => node.eventually.hasValue(value, opts)
    )
  }

  hasAnyValue(opts: Workflo.IWDIOParamsOptional & {filterMask?: ExtractValue<Partial<Content>>} = {}) {
    return this._node.eachCheck<Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>> (
      isIGetValueElementNode, opts.filterMask, node => node.eventually.hasAnyValue(opts)
    )
  }

  containsValue(value: ExtractValue<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck<Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>> (
      isIGetValueElementNode, value, (node, value) => node.eventually.containsValue(value, opts)
    )
  }

  not = {...super.not,
    hasValue: (value: ExtractValue<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck<Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>> (
        isIGetValueElementNode, value, (node, value) => node.eventually.not.hasValue(value, opts)
      )
    },
    hasAnyValue: (opts: Workflo.IWDIOParamsOptional & {filterMask?: ExtractValue<Partial<Content>>} = {}) => {
      return this._node.eachCheck<Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>> (
        isIGetValueElementNode, opts.filterMask, node => node.eventually.not.hasAnyValue(opts)
      )
    },
    containsValue: (value: ExtractValue<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck<Workflo.PageNode.IGetValueElementNode<ExtractValue<Content>>, ExtractValue<Content>> (
        isIGetValueElementNode, value, (node, value) => node.eventually.not.containsValue(value, opts)
      )
    }
  }
}

// type guards
function isIGetValueElementNode<TextType>(
  node: Workflo.PageNode.INode | Workflo.PageNode.IGetValueElementNode<TextType>
): node is Workflo.PageNode.IElementNode<TextType> {
  return typeof node['getValue'] === 'function' &&
  typeof node.currently['hasValue'] === 'function' &&
  typeof node.currently['hasAnyValue'] === 'function' &&
  typeof node.currently['containsValue'] === 'function' &&
  typeof node.eventually['hasValue'] === 'function' &&
  typeof node.eventually['hasAnyValue'] === 'function' &&
  typeof node.eventually['containsValue'] === 'function'
}


function isISetValueElementNode<TextType>(
  node: Workflo.PageNode.INode | Workflo.PageNode.ISetValueElementNode<TextType>
): node is Workflo.PageNode.IElementNode<TextType> {
  return typeof node['setValue'] === 'function'
}
