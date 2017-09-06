import { PageElementStore } from '../stores'

export interface IPageArgs<Store extends PageElementStore> {
  elementStore: Store,
}

export class Page<Store extends PageElementStore> {
  protected elementStore: Store

  // if page needs to be initialized with specific values,
  // pass them in initObj
  constructor(args: IPageArgs<Store>) {
    this.elementStore = args.elementStore
  }
}