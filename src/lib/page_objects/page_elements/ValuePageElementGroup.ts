import { PageElementStore } from '../stores'
import {
  PageElementGroup,
  IPageElementGroupOpts,
  PageElementGroupCurrently,
  PageElementGroupEventually,
  PageElementGroupWait
} from '.';

type ExtractValue<Content extends {[key: string]: Workflo.PageNode.INode}> = Workflo.PageNode.ExtractValue<Content>

type ExtractValueBoolean<Content extends {[key: string]: Workflo.PageNode.INode}> =
Workflo.PageNode.ExtractValueBoolean<Content>

type ValueElementNode<Content extends {[K in keyof Content] : Workflo.PageNode.INode}> =
Workflo.PageNode.IValueElementNode<ExtractValue<Content>, Workflo.PageNode.IValueGroupFilterMask<Content>>

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

  getValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>) {
    return this.eachGet<
      ValueElementNode<Content>, ExtractValue<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>
    > (
      isIValueElementNode, ({node, filter}) => node.getValue(filter), filterMask
    )
  }

  getHasValue(value: ExtractValue<Content>) {
    return this.eachCompare<ValueElementNode<Content>, ExtractValue<Content>, ExtractValueBoolean<Content>> (
      isIValueElementNode, ({node, expected}) => node.getHasValue(expected), value
    )
  }

  getHasAnyValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>) {
    return this.eachCompare<
      ValueElementNode<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>, ExtractValueBoolean<Content>
    > (
      isIValueElementNode, ({node, filter}) => node.getHasAnyValue(filter), filterMask, true
    )
  }

  getContainsValue(value: ExtractValue<Content>) {
    return this.eachCompare<ValueElementNode<Content>, ExtractValue<Content>, ExtractValueBoolean<Content>> (
      isIValueElementNode, ({node, expected}) => node.getContainsValue(expected), value
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
      isIValueElementNode, ({node, value}) => node.setValue(value), values
    )
  }
}

class ValuePageElementGroupCurrently<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends ValuePageElementGroup<Store, Content>
> extends PageElementGroupCurrently<Store, Content, GroupType> {

  getValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>) {
    return this._node.eachGet<
      ValueElementNode<Content>, ExtractValue<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>
    > (
      isIValueElementNode, ({node, filter}) => node.currently.getValue(filter), filterMask
    )
  }

  getHasValue(value: ExtractValue<Content>) {
    return this._node.eachCompare<ValueElementNode<Content>, ExtractValue<Content>, ExtractValueBoolean<Content>> (
      isIValueElementNode, ({node, expected}) => node.currently.getHasValue(expected), value
    )
  }

  getHasAnyValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>) {
    return this._node.eachCompare<
      ValueElementNode<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>, ExtractValueBoolean<Content>
    > (
      isIValueElementNode, ({node, filter}) => node.currently.getHasAnyValue(filter), filterMask, true
    )
  }

  getContainsValue(value: ExtractValue<Content>) {
    return this._node.eachCompare<ValueElementNode<Content>, ExtractValue<Content>, ExtractValueBoolean<Content>> (
      isIValueElementNode, ({node, expected}) => node.currently.getContainsValue(expected), value
    )
  }

  hasValue(value: ExtractValue<Content>) {
    return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>> (
      isIValueElementNode, ({node, expected}) => node.currently.hasValue(expected), value
    )
  }

  hasAnyValue(filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>) {
    return this._node.eachCheck<ValueElementNode<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>> (
      isIValueElementNode, ({node, filter}) => node.currently.hasAnyValue(filter), filterMask, true
    )
  }

  containsValue(value: ExtractValue<Content>) {
    return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>> (
      isIValueElementNode, ({node, expected}) => node.currently.containsValue(expected), value
    )
  }

  get not() {
    return {...super.not,
      hasValue: (value: ExtractValue<Content>) => {
        return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>> (
          isIValueElementNode, ({node, expected}) => node.currently.not.hasValue(expected), value
        )
      },
      hasAnyValue: (filterMask?: Workflo.PageNode.ValueGroupFilterMask<Content>) => {
        return this._node.eachCheck<ValueElementNode<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>> (
          isIValueElementNode, ({node, filter}) => node.currently.not.hasAnyValue(filter), filterMask, true
        )
      },
      containsValue: (value: ExtractValue<Content>) => {
        return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>> (
          isIValueElementNode, ({node, expected}) => node.currently.not.containsValue(expected), value
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
    return this._node.eachWait<ValueElementNode<Content>, ExtractValue<Content>> (
      isIValueElementNode, ({node, expected}) => node.wait.hasValue(expected, opts), value
    )
  }

  hasAnyValue(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.ValueGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachWait<ValueElementNode<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>> (
      isIValueElementNode,
      ({node, filter}) => node.wait.hasAnyValue({filterMask: filter, ...otherOpts}),
      filterMask,
      true
    )
  }

  containsValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait<ValueElementNode<Content>, ExtractValue<Content>> (
      isIValueElementNode, ({node, expected}) => node.wait.containsValue(expected, opts), value
    )
  }

  get not() {
    return {...super.not,
      hasValue: (value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ValueElementNode<Content>, ExtractValue<Content>> (
          isIValueElementNode, ({node, expected}) => node.wait.hasValue(expected, opts), value
        )
      },
      hasAnyValue: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.ValueGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachWait<ValueElementNode<Content>, Workflo.PageNode.ValueGroupFilterMask<Content>> (
          isIValueElementNode,
          ({node, filter}) => node.wait.hasAnyValue({filterMask: filter, ...otherOpts}),
          filterMask,
          true
        )
      },
      containsValue: (value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait<ValueElementNode<Content>, ExtractValue<Content>> (
          isIValueElementNode, ({node, expected}) => node.wait.containsValue(expected, opts), value
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
    return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>> (
      isIValueElementNode, ({node, expected}) => node.eventually.hasValue(expected, opts), value
    )
  }

  hasAnyValue(opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) {
    const {filterMask, ...otherOpts} = opts

    return this._node.eachCheck<ValueElementNode<Content>> (
      isIValueElementNode,
      ({node, filter}) => node.eventually.hasAnyValue({filterMask: filter, ...otherOpts}),
      filterMask,
      true
    )
  }

  containsValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>> (
      isIValueElementNode, ({node, expected}) => node.eventually.containsValue(expected, opts), value
    )
  }

  get not() {
    return {...super.not,
      hasValue: (value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>> (
          isIValueElementNode, ({node, expected}) => node.eventually.not.hasValue(expected, opts), value
        )
      },
      hasAnyValue: (opts: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content> = {}) => {
        const {filterMask, ...otherOpts} = opts

        return this._node.eachCheck<ValueElementNode<Content>> (
          isIValueElementNode,
          ({node, filter}) => node.eventually.not.hasAnyValue({filterMask: filter, ...otherOpts}),
          filterMask,
          true
        )
      },
      containsValue: (value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck<ValueElementNode<Content>, ExtractValue<Content>> (
          isIValueElementNode, ({node, expected}) => node.eventually.not.containsValue(expected, opts), value
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
