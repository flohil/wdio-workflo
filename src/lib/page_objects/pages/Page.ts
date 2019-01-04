import { PageElementStore } from '../stores'
import { DEFAULT_TIMEOUT, DEFAULT_INTERVAL, stores } from '../'

/**
 * Defines the opts parameter passed to the constructor of Page.
 */
export interface IPageOpts<Store extends PageElementStore> extends Workflo.ITimeoutInterval {
  /**
   * An instance of PageElementStore which can be used to retrieve/create PageNodes via Page
   */
  store: Store
}

/**
 * This class is supposed to be used as base class for all Pages.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes via Page
 * @template IsOpenOpts type of the opts parameter passed to the functions `isOpen`, `wait.isOpen` and
 * `eventually.isOpen`
 * @template IsClosedOpts type of the opts parameter passed to the functions `isClosed`, `wait.isClosed` and
 * `eventually.isClosed`
 */
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

  constructor(opts: IPageOpts<Store>) {
    this._store = opts.store

    this._timeout = opts.timeout || JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || DEFAULT_TIMEOUT
    this._interval = opts.interval || JSON.parse(process.env.WORKFLO_CONFIG).intervals.default || DEFAULT_INTERVAL

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
    conditionFunc: () => boolean, conditionMessage: string, opts: Workflo.ITimeoutInterval = Object.create(null)
  ) {
    const timeout = opts.timeout || this._page.getTimeout()
    const interval = opts.interval || this._page.getInterval()

    let error = undefined

    try {
      browser.waitUntil(() => {
        try {
          return conditionFunc()
        } catch( _error ) {
          error = _error
        }
      }, timeout, '', interval)
    } catch (untilError) {
      const _error = error || untilError

      if (_error.type === 'WaitUntilTimeoutError') {
        const waitError = new Error(
          `Waiting for page ${this.constructor.name}${conditionMessage} within ${timeout}ms failed.`
        ) as any

        waitError.type = 'WaitUntilTimeoutError'

        throw waitError
      } else {
        throw _error
      }
    }

    return this._page
  }

  isOpen(opts: IsOpenOpts & Workflo.ITimeoutInterval = Object.create(null)) {
    return this._wait(() => this._page.isOpen(opts), " to be open", opts)
  }

  isClosed(opts: IsClosedOpts & Workflo.ITimeoutInterval = Object.create(null)) {
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
    conditionFunc: () => boolean, opts: Workflo.ITimeoutInterval = Object.create(null)
  ) {
    const timeout = opts.timeout || this._page.getTimeout()
    const interval = opts.interval || this._page.getInterval()

    let error = undefined

    try {
      browser.waitUntil(
        () => {
          try {
            return conditionFunc()
          } catch( _error ) {
            error = _error
          }
        }, timeout, '', interval)
      return true
    } catch (untilError) {
      const _error = error || untilError

      if (_error.type === 'WaitUntilTimeoutError') {
        return false;
      } else {
        throw _error
      }
    }
  }

  isOpen(opts: IsOpenOpts & Workflo.ITimeoutInterval = Object.create(null)) {
    return this._eventually(() => this._page.isOpen(opts), opts)
  }

  isClosed(opts: IsClosedOpts & Workflo.ITimeoutInterval = Object.create(null)) {
    return this._eventually(() => this._page.isClosed(opts), opts)
  }
}