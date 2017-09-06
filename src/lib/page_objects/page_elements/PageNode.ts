export interface IPageNodeOpts<Store extends Workflo.IPageElementStore> {
  store: Store
}

export class PageNode<Store extends Workflo.IPageElementStore> {
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