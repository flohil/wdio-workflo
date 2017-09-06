import { PageElementStore } from '../stores'

export interface IPageNodeOpts<Store extends PageElementStore> {
  store: Store
}

export class PageNode<Store extends PageElementStore> {
  protected store: Store
  protected timeout: number

  // available options:
  // - wait -> initial wait operation: exist, visible, text, value
  constructor(
    protected selector: string,
    { 
      store
    } : IPageNodeOpts<Store>
  ) {
    this.store = store
  }

  __getNodeId() {
    return this.selector
  }

  getSelector() {
    return this.selector
  }
}