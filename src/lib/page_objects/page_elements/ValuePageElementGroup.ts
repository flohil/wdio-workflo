import { PageElementStore } from '../stores'
import {
  PageElementGroup,
  IPageElementGroupOpts,
  PageElementGroupCurrently,
  PageElementGroupEventually,
  PageElementGroupWait,
  ExtractTrue,
  ExtractBoolean
} from '.';

type ExtractValue<T extends {[key: string]: Workflo.PageNode.INode}> = Workflo.PageNode.ExtractValue<T>

type ValueElementNode<Content extends {[K in keyof Content] : Workflo.PageNode.INode}> =
Workflo.PageNode.IValueElementNode<ExtractValue<Content>, Workflo.PageNode.ExtractTrue<Content>>

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
implements ValueElementNode<Content> {

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

  getValue(filterMask?: ExtractTrue<Content>) {
    return this.eachGet<ValueElementNode<Content>, ExtractValue<Content>> (
      isIValueElementNode, filterMask, node => node.getValue()
    )
  }

  /**
   * Sets values after performing the initial wait on all nodes that implement the setValue method.
   * Nodes that do not implement the setValue method will be ignored.
   *
   * @param values
   */
  setValue(values: Workflo.StripNever<ExtractValue<Content>>) {
    return this.eachSet<ValueElementNode<Content>, ExtractValue<Content>> (
      isIValueElementNode, values, (node, value) => node.setValue(value)
    )
  }
}

class ValuePageElementGroupCurrently<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends ValuePageElementGroup<Store, Content>
> extends PageElementGroupCurrently<Store, Content, GroupType> {

  getValue(filterMask?: ExtractTrue<Content>) {
    return this._node.eachGet<ValueElementNode<Content>, ExtractValue<Content>> (
      isIValueElementNode, filterMask, node => node.currently.getValue()
    )
  }

  /**
   * Sets values immediately on all nodes that implement the setValue method.
   * Nodes that do not implement the setValue method will be ignored.
   *
   * @param values
   */
  setValue(values: Workflo.StripNever<ExtractValue<Content>>) {
    return this._node.eachSet<
      ValueElementNode<Content>, ExtractValue<Content>
    > (
      isIValueElementNode, values, (node, value) => node.currently.setValue(value)
    )
  }

  hasValue(value: ExtractValue<Content>) {
    return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>, ExtractValue<Content>> (
      isIValueElementNode, value, (node, value) => node.currently.hasValue(value)
    )
  }

  hasAnyValue(filterMask?: ExtractTrue<Content>) {
    return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>> (
      isIValueElementNode, filterMask, node => node.currently.hasAnyValue()
    )
  }

  containsValue(value: ExtractValue<Content>) {
    return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>, ExtractValue<Content>> (
      isIValueElementNode, value, (node, value) => node.currently.containsValue(value)
    )
  }

  get not() {
    return {...super.not,
      hasValue: (value: ExtractValue<Content>) => {
        return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>, ExtractValue<Content>> (
          isIValueElementNode, value, (node, value) => node.currently.not.hasValue(value)
        )
      },
      hasAnyValue: (filterMask?: ExtractTrue<Content>) => {
        return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>> (
          isIValueElementNode, filterMask, node => node.currently.not.hasAnyValue()
        )
      },
      containsValue: (value: ExtractValue<Content>) => {
        return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>, ExtractValue<Content>> (
          isIValueElementNode, value, (node, value) => node.currently.not.containsValue(value)
        )
      }
    }
  }
}

class ValuePageElementGroupWait<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends ValuePageElementGroup<Store, Content>
> extends PageElementGroupWait<Store, Content, GroupType> {

  hasValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ValueElementNode<Content>, ExtractValue<Content>, ExtractValue<Content>> (
      isIValueElementNode, value, (node, value) => node.wait.hasValue(value, opts)
    )
  }

  hasAnyValue(opts: Workflo.IWDIOParamsInterval & {filterMask?: ExtractTrue<Content>} = {}) {
    return this._node.eachWait<ValueElementNode<Content>, ExtractValue<Content>> (
      isIValueElementNode, opts.filterMask, node => node.wait.hasAnyValue(opts)
    )
  }

  containsValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ValueElementNode<Content>, ExtractValue<Content>, ExtractValue<Content>> (
      isIValueElementNode, value, (node, value) => node.wait.containsValue(value, opts)
    )
  }

  get not() {
    return {...super.not,
      hasValue: (value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ValueElementNode<Content>, ExtractValue<Content>, ExtractValue<Content>> (
          isIValueElementNode, value, (node, value) => node.wait.hasValue(value, opts)
        )
      },
      hasAnyValue: (opts: Workflo.IWDIOParamsInterval & {filterMask?: ExtractTrue<Content>} = {}) => {
        return this._node.eachWait<ValueElementNode<Content>, ExtractValue<Content>> (
          isIValueElementNode, opts.filterMask, node => node.wait.hasAnyValue(opts)
        )
      },
      containsValue: (value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ValueElementNode<Content>, ExtractValue<Content>, ExtractValue<Content>> (
          isIValueElementNode, value, (node, value) => node.wait.containsValue(value, opts)
        )
      }
    }
  }
}

class ValuePageElementGroupEventually<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends ValuePageElementGroup<Store, Content>
> extends PageElementGroupEventually<Store, Content, GroupType> {

  hasValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>, ExtractValue<Content>> (
      isIValueElementNode, value, (node, value) => node.eventually.hasValue(value, opts)
    )
  }

  hasAnyValue(opts: Workflo.IWDIOParamsInterval & {filterMask?: ExtractTrue<Content>} = {}) {
    return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>> (
      isIValueElementNode, opts.filterMask, node => node.eventually.hasAnyValue(opts)
    )
  }

  containsValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>, ExtractValue<Content>> (
      isIValueElementNode, value, (node, value) => node.eventually.containsValue(value, opts)
    )
  }

  get not() {
    return {...super.not,
      hasValue: (value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>, ExtractValue<Content>> (
          isIValueElementNode, value, (node, value) => node.eventually.not.hasValue(value, opts)
        )
      },
      hasAnyValue: (opts: Workflo.IWDIOParamsInterval & {filterMask?: ExtractTrue<Content>} = {}) => {
        return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>> (
          isIValueElementNode, opts.filterMask, node => node.eventually.not.hasAnyValue(opts)
        )
      },
      containsValue: (value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>, ExtractValue<Content>> (
          isIValueElementNode, value, (node, value) => node.eventually.not.containsValue(value, opts)
        )
      }
    }
  }
}

// type guards

function isIValueElementNode<
  Content extends {[K in keyof Content] : Workflo.PageNode.INode}
>(node: Workflo.PageNode.INode | ValueElementNode<Content>): node is ValueElementNode<Content> {
  return typeof node['getValue'] === 'function' &&
  typeof node['setValue'] === 'function' &&
  typeof node.currently['getValue'] === 'function' &&
  typeof node.currently['setValue'] === 'function' &&
  typeof node.currently['hasValue'] === 'function' &&
  typeof node.currently['hasAnyValue'] === 'function' &&
  typeof node.currently['containsValue'] === 'function' &&
  typeof node.wait['hasValue'] === 'function' &&
  typeof node.wait['hasAnyValue'] === 'function' &&
  typeof node.wait['containsValue'] === 'function' &&
  typeof node.eventually['hasValue'] === 'function' &&
  typeof node.eventually['hasAnyValue'] === 'function' &&
  typeof node.eventually['containsValue'] === 'function'
}
