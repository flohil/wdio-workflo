import { PageElementStore } from '../stores'
import _ = require('lodash');

export interface IPageNodeOpts<Store extends PageElementStore> {
  store: Store
}

export class PageNode<Store extends PageElementStore> implements Workflo.PageNode.INode {
  protected _store: Store
  protected _lastDiff: Workflo.PageNode.IDiff

  readonly currently: PageNodeCurrently<Store, this>
  readonly wait: PageNodeWait<Store, this>
  readonly eventually: PageNodeEventually<Store, this>

  // available options:
  // - wait -> initial wait operation: exist, visible, text, value
  constructor(
    protected _selector: string,
    {
      store
    } : IPageNodeOpts<Store>
  ) {
    this._store = store

    this.currently = new PageNodeCurrently(this)
    this.wait = new PageNodeWait(this)
    this.eventually = new PageNodeEventually(this)
  }

  __getNodeId() {
    return this._selector
  }

  __toJSON(): Workflo.PageNode.IElementJSON {
    return {
      pageNodeType: this.constructor.name,
      nodeId: this._selector
    }
  }

  get __lastDiff() {
    this._lastDiff = this._lastDiff || {}
    this._lastDiff.selector = this.getSelector()

    return this._lastDiff
  }

  getSelector() {
    return this._selector
  }
}

export class PageNodeCurrently<
  Store extends PageElementStore,
  PageElementType extends PageNode<Store>
> {
  protected readonly _node: PageElementType

  constructor(node: PageElementType) {
    this._node = node
  }
}

export class PageNodeWait<
  Store extends PageElementStore,
  PageElementType extends PageNode<Store>
> {
  protected readonly _node: PageElementType

  constructor(node: PageElementType) {
    this._node = node
  }
}

export class PageNodeEventually<
  Store extends PageElementStore,
  PageElementType extends PageNode<Store>
> {
  protected readonly _node: PageElementType

  constructor(node: PageElementType) {
    this._node = node
  }
}