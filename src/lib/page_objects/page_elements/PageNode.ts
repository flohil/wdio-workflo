import { PageElementStore } from '../stores'

export interface IPageNodeOpts<Store extends PageElementStore> {
  store: Store
}

export class PageNode<Store extends PageElementStore> implements Workflo.PageNode.INode {
  protected _store: Store

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

  toJSON(): Workflo.PageNode.IElementJSON {
    return {
      pageNodeType: this.constructor.name,
      nodeId: this._selector
    }
  }

  getSelector() {
    return this._selector
  }
}