export interface IPageArgs<Store extends Workflo.IPageElementStore> {
  elementStore: Store,
}

export class Page<Store extends Workflo.IPageElementStore> {
  protected elementStore: Store

  // if page needs to be initialized with specific values,
  // pass them in initObj
  constructor(args: IPageArgs<Store>) {
    this.elementStore = args.elementStore
  }
}