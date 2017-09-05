export interface IPageNodeOpts<Store extends Workflo.IPageElementStore> {
  wait?: Workflo.WaitType, 
  timeout?: number
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
      store,
      timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default
    } : IPageNodeOpts<Store>
  ) {
    this.store = store
    this.timeout = timeout
  }

  __getNodeId() {
    return this.selector
  }

  getSelector() {
    return this.selector
  }
}