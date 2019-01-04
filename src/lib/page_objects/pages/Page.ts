import { PageElementStore } from '../stores'
import { DEFAULT_TIMEOUT, DEFAULT_INTERVAL, stores } from '../'

/**
 * Defines the opts parameter passed to the constructor of Page.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes via Page
 */
export interface IPageOpts<Store extends PageElementStore> extends Workflo.ITimeoutInterval {
  /**
   * an instance of PageElementStore which can be used to retrieve/create PageNodes via Page
   */
  store: Store
}

/**
 * This class serves as the base class for all Pages.
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
  /**
   * an instance of PageElementStore which can be used to retrieve/create PageNodes via Page
   */
  protected _store: Store
  /**
   * the default timeout in milliseconds used by Page for its `wait` and `eventually` functions.
   */
  protected _timeout: number
  /**
   * the default interval in milliseconds used by Page for its `wait` and `eventually` functions.
   */
  protected _interval: number

  /**
   * defines all functions of PageNode which wait for a condition to become true within a specified timeout
   */
  wait: PageWait<Store, this, IsOpenOpts, IsClosedOpts>
  /**
   * defines all functions of PageNode which check if a condition eventually becomes true within a specified timeout
   */
  eventually: PageEventually<Store, this, IsOpenOpts, IsClosedOpts>

  /**
   * Page serves as the base class for all Pages.
   *
   * @param opts the options required to create an instance of Page
   */
  constructor(opts: IPageOpts<Store>) {
    this._store = opts.store

    this._timeout = opts.timeout || JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || DEFAULT_TIMEOUT
    this._interval = opts.interval || JSON.parse(process.env.WORKFLO_CONFIG).intervals.default || DEFAULT_INTERVAL

    this.wait = new PageWait(this)
    this.eventually = new PageEventually(this)
  }

  /**
   * Returns an instance of PageElementStore which can be used to retrieve/create PageNodes via Page
   */
  getStore() {
    return this._store
  }

  /**
   * Returns the default timeout in milliseconds used by Page for its `wait` and `eventually` functions.
   */
  getTimeout() {
    return this._timeout
  }

  /**
   * Returns the default interval in milliseconds used by Page for its `wait` and `eventually` functions.
   */
  getInterval() {
    return this._interval
  }

  /**
   * Checks if the Page is currently open.
   *
   * @param opts options needed to determine if the Page is currently open
   */
  abstract isOpen(opts?: IsOpenOpts): boolean

  /**
   * Checks if the Page is currently closed.
   *
   * @param opts options needed to determine if the Page is currently closed
   */
  abstract isClosed(opts?: IsClosedOpts): boolean
}

/**
 * This class defines all `wait` functions of Page.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes via Page
 * @template PageType type of the Page for which PageWait defines all `wait` functions
 * @template IsOpenOpts type of the opts parameter passed to the functions `isOpen`
 * @template IsClosedOpts type of the opts parameter passed to the functions `isClosed`
 */
class PageWait<
  Store extends PageElementStore,
  PageType extends Page<Store, IsOpenOpts, IsClosedOpts>,
  IsOpenOpts,
  IsClosedOpts
> {

  /**
   * the Page for which PageWait defines all `wait` functions
   */
  protected _page: PageType

  /**
   * PageWait defines all `wait` functions of Page.
   *
   * @param page the Page for which PageWait defines all `wait` functions
   */
  constructor(page: PageType) {
    this._page = page;
  }

  /**
   * A function which provides common functionality to wait for a certain conditionFunc to return true
   * within a specific timeout.
   *
   * @param conditionFunc the condition which is expected to return true within a specific timeout
   * @param conditionMessage a message used to describe the checked condition in error messages
   * @param opts includes the timeout within which the condition is expected to return true and
   * the interval used to check for this condition.
   *
   * If no `timeout` is specified, the Page's default timeout is used instead.
   * If no `interval` is specified, the Page's default interval is used instead.
   */
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

  /**
   * Waits for Page to become open and throws an error of the Page does not become open within a specific timeout.
   *
   * @param opts includes the options defined in IsOpenOpts, the timeout within which the Page must become open and
   * the interval used to check for this condition.
   *
   * If no `timeout` is specified, the Page's default timeout is used instead.
   * If no `interval` is specified, the Page's default interval is used instead.
   *
   * @returns an instance of Page
   */
  isOpen(opts: IsOpenOpts & Workflo.ITimeoutInterval = Object.create(null)) {
    return this._wait(() => this._page.isOpen(opts), " to be open", opts)
  }

  /**
   * Waits for Page to become closed and throws an error of the Page does not become closed within a specific timeout.
   *
   * @param opts includes the options defined in IsClosedOpts, the timeout within which the Page must become closed and
   * the interval used to check for this condition.
   *
   * If no `timeout` is specified, the Page's default timeout is used instead.
   * If no `interval` is specified, the Page's default interval is used instead.
   *
   * @returns an instance of Page
   */
  isClosed(opts: IsClosedOpts & Workflo.ITimeoutInterval = Object.create(null)) {
    return this._wait(() => this._page.isClosed(opts), " to be closed", opts)
  }
}

/**
 * This class defines all `eventually` functions of Page.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes via Page
 * @template PageType type of the Page for which PageEventually defines all `eventually` functions
 * @template IsOpenOpts type of the opts parameter passed to the function `isOpen`
 * @template IsClosedOpts type of the opts parameter passed to the functions `isClosed`
 */
class PageEventually<
  Store extends PageElementStore,
  PageType extends Page<Store, IsOpenOpts, IsClosedOpts>,
  IsOpenOpts,
  IsClosedOpts
> {

  /**
   * the Page for which PageEventually defines all `eventually` functions
   */
  protected _page: PageType

  /**
   * PageEventually defines all `eventually` functions of Page.
   *
   * @param page the Page for which PageEventually defines all `eventually` functions
   */
  constructor(page: PageType) {
    this._page = page;
  }

  /**
   * A function which provides common functionality to check if certain conditionFunc eventually returns true
   * within a specific timeout.
   *
   * @param conditionFunc the condition which is expected to return true within a specific timeout
   * @param opts includes the timeout within which the condition is expected to return true and
   * the interval used to check for this condition.
   *
   * If no `timeout` is specified, the Page's default timeout is used instead.
   * If no `interval` is specified, the Page's default interval is used instead.
   */
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

  /**
   * Checks if Page eventually becomes open within a specific timeout.
   *
   * @param opts includes the options defined in IsOpenOpts, the timeout within which the Page must become open and
   * the interval used to check for this condition.
   *
   * If no `timeout` is specified, the Page's default timeout is used instead.
   * If no `interval` is specified, the Page's default interval is used instead.
   */
  isOpen(opts: IsOpenOpts & Workflo.ITimeoutInterval = Object.create(null)) {
    return this._eventually(() => this._page.isOpen(opts), opts)
  }

  /**
   * Checks if Page eventually becomes closed within a specific timeout.
   *
   * @param opts includes the options defined in IsClosedOpts, the timeout within which the Page must become closed and
   * the interval used to check for this condition.
   *
   * If no `timeout` is specified, the Page's default timeout is used instead.
   * If no `interval` is specified, the Page's default interval is used instead.
   */
  isClosed(opts: IsClosedOpts & Workflo.ITimeoutInterval = Object.create(null)) {
    return this._eventually(() => this._page.isClosed(opts), opts)
  }
}