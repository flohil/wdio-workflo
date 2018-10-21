import { PageElementStore } from '../stores'

export interface IPageArgs<Store extends PageElementStore> {
  elementStore: Store,
  timeout?: number
}

export abstract class Page<Store extends PageElementStore> {
  protected elementStore: Store
  protected timeout: number

  constructor(args: IPageArgs<Store>) {
    this.elementStore = args.elementStore

    if ( args.timeout ) {
      this.timeout = args.timeout
    } else {
      this.timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default
    }
  }

  abstract isOpened()

  eventuallyIsOpened( timeout: number = this.timeout ) {
    try {
      browser.waitUntil( () => this.isOpened(), timeout )
      return true
    } catch( error ) {
      return false
    }
  }
}