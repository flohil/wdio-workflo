import { PageElementStore } from '../stores'
import { DEFAULT_TIMEOUT, DEFAULT_INTERVAL, stores } from '../'

export interface IPageArgs<Store extends PageElementStore> extends Workflo.IWDIOParamsInterval {
  store: Store
}

export abstract class Page<
  Store extends PageElementStore,
  IsOpenOpts = {},
  IsClosedOpts = IsOpenOpts
> {
  protected _store: Store
  protected _timeout: number
  protected _interval: number

  wait: PageWait<Store, this, IsOpenOpts, IsClosedOpts>
  eventually: PageEventually<Store, this, IsOpenOpts, IsClosedOpts>

  constructor(args: IPageArgs<Store>) {
    this._store = args.store

    this._timeout = args.timeout || JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || DEFAULT_TIMEOUT
    this._interval = args.interval || JSON.parse(process.env.WORKFLO_CONFIG).intervals.default || DEFAULT_INTERVAL

    this.wait = new PageWait(this)
    this.eventually = new PageEventually(this)
  }

  getStore() {
    return this._store
  }

  getTimeout() {
    return this._timeout
  }

  getInterval() {
    return this._interval
  }

  abstract isOpen(opts?: IsOpenOpts): boolean
  abstract isClosed(opts?: IsClosedOpts): boolean
}

class PageWait<
  Store extends PageElementStore,
  PageType extends Page<Store, IsOpenOpts, IsClosedOpts>,
  IsOpenOpts,
  IsClosedOpts
> {

  protected _page: PageType

  constructor(page: PageType) {
    this._page = page;
  }

  protected _wait(
    conditionFunc: () => boolean, conditionMessage: string, opts: Workflo.IWDIOParamsInterval = Object.create(null)
  ) {
    const timeout = opts.timeout || this._page.getTimeout()
    const interval = opts.interval || this._page.getInterval()

    try {
      browser.waitUntil(() => conditionFunc(), timeout, '', interval)
    } catch (error) {
      if (error.type === 'WaitUntilTimeoutError') {
        const waitError = new Error(
          `Waiting for page ${this.constructor.name}${conditionMessage} within ${timeout}ms failed`
        ) as any

        waitError.type = 'WaitUntilTimeoutError'

        throw waitError
      } else {
        throw error
      }
    }

    return this._page
  }

  isOpen(opts: IsOpenOpts & Workflo.IWDIOParamsInterval = Object.create(null)) {
    return this._wait(() => this._page.isOpen(opts), " to be open", opts)
  }

  isClosed(opts: IsClosedOpts & Workflo.IWDIOParamsInterval = Object.create(null)) {
    return this._wait(() => this._page.isClosed(opts), " to be closed", opts)
  }
}

class PageEventually<
  Store extends PageElementStore,
  PageType extends Page<Store, IsOpenOpts, IsClosedOpts>,
  IsOpenOpts,
  IsClosedOpts
> {

  protected _page: PageType

  constructor(page: PageType) {
    this._page = page;
  }

  protected _eventually(
    conditionFunc: () => boolean, opts: Workflo.IWDIOParamsInterval = Object.create(null)
  ) {
    const timeout = opts.timeout || this._page.getTimeout()
    const interval = opts.interval || this._page.getInterval()

    try {
      browser.waitUntil(() => conditionFunc(), timeout, '', interval)
      return true
    } catch(error) {
      if (error.type === 'WaitUntilTimeoutError') {
        return false;
      } else {
        throw error
      }
    }
  }

  isOpen(opts: IsOpenOpts & Workflo.IWDIOParamsInterval = Object.create(null)) {
    this._eventually(() => this._page.isOpen(opts), opts)
  }

  isClosed(opts: IsClosedOpts & Workflo.IWDIOParamsInterval = Object.create(null)) {
    this._eventually(() => this._page.isClosed(opts), opts)
  }
}