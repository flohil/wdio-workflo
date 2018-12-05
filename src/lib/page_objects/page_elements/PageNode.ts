import { PageElementStore } from '../stores'
import _ = require('lodash');

export interface IPageNodeOpts<Store extends PageElementStore> {
  store: Store
}

export class PageNode<Store extends PageElementStore> implements Workflo.PageNode.INode {
  protected _store: Store
  protected _lastDiff: Workflo.PageNode.IDiff

  // available options:
  // - wait -> initial wait operation: exist, visible, text, value
  constructor(
    protected _selector: string,
    {
      store
    } : IPageNodeOpts<Store>
  ) {
    this._store = store
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