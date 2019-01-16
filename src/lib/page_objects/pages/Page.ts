import { DEFAULT_INTERVAL, DEFAULT_TIMEOUT, stores } from '../';
import { PageNodeStore } from '../stores';

/**
 * Defines the opts parameter passed to the constructor of Page.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes via Page
 */
export interface IPageOpts<Store extends PageNodeStore> extends Workflo.ITimeoutInterval {
  /**
   * an instance of PageNodeStore which can be used to retrieve/create PageNodes via Page
   */
  store: Store;
}

/**
 * This class serves as the base class for all Pages.
 *
 * It provides the functions `isOpen` and `isClosed` to check if the page currently is open or closed.
 * `Page` also features a `wait` API to wait for the page to be open or closed and an `eventually` API to check
 * if the page eventually is open or closed.
 *
 * Contrary to `PageNode`, `Page` does not have an initial waiting condition.
 * Therefore, `Page` has no `currently` API (unlike `PageElement`) because all functions defined directly on `Page`
 * (and not on its `wait` or `eventually` APIs) always describe the current state of the page.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes via Page
 * @template IsOpenOpts type of the opts parameter passed to the functions `isOpen`, `wait.isOpen` and
 * `eventually.isOpen`
 * @template IsClosedOpts type of the opts parameter passed to the functions `isClosed`, `wait.isClosed` and
 * `eventually.isClosed`
 */
export abstract class Page<
  Store extends PageNodeStore,
  IsOpenOpts = {},
  IsClosedOpts = IsOpenOpts
> implements Workflo.IPage<Store, IsOpenOpts, IsClosedOpts> {

  /**
   * an instance of PageNodeStore which can be used to retrieve/create PageNodes via Page
   */
  protected _store: Store;
  /**
   * the default timeout in milliseconds used by Page for its `wait` and `eventually` functions.
   */
  protected _timeout: number;
  /**
   * the default interval in milliseconds used by Page for its `wait` and `eventually` functions.
   */
  protected _interval: number;
  /**
   * Stores the last timeout used by Page's `wait` and `eventually` functions.
   *
   * Intended for framework-internal usage only.
   */
  protected _lastTimeout: number;

  wait: PageWait<Store, this, IsOpenOpts, IsClosedOpts>;
  eventually: PageEventually<Store, this, IsOpenOpts, IsClosedOpts>;

  /**
   * Page serves as the base class for all Pages.
   *
   * @param opts the options required to create an instance of Page
   */
  constructor(opts: IPageOpts<Store>) {
    this._store = opts.store;

    this._timeout = opts.timeout || JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || DEFAULT_TIMEOUT;
    this._interval = opts.interval || JSON.parse(process.env.WORKFLO_CONFIG).intervals.default || DEFAULT_INTERVAL;

    this.wait = new PageWait(this);
    this.eventually = new PageEventually(this);
  }

  get __lastTimeout() {
    const lastTimeout = this._lastTimeout || this._timeout;

    return lastTimeout;
  }

  __setLastTimeout(timeout: number) {
    this._lastTimeout = timeout;
  }

  getStore() {
    return this._store;
  }

  getTimeout() {
    return this._timeout;
  }

  getInterval() {
    return this._interval;
  }

  toJSON(): Workflo.IPageJSON {
    return {
      pageType: this.constructor.name,
    };
  }

  abstract isOpen(opts?: IsOpenOpts): boolean;

  abstract isClosed(opts?: IsClosedOpts): boolean;
}

/**
 * This class defines all `wait` functions of Page.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes via Page
 * @template PageType type of the Page for which PageWait defines all `wait` functions
 * @template IsOpenOpts type of the opts parameter passed to the functions `isOpen`
 * @template IsClosedOpts type of the opts parameter passed to the functions `isClosed`
 */
class PageWait<
  Store extends PageNodeStore,
  PageType extends Page<Store, IsOpenOpts, IsClosedOpts>,
  IsOpenOpts,
  IsClosedOpts
> {

  /**
   * the Page for which PageWait defines all `wait` functions
   */
  protected _page: PageType;

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
   * @param opts includes the `timeout` within which the condition is expected to return true and
   * the `interval` used to check for this condition.
   *
   * If no `timeout` is specified, the Page's default timeout is used instead.
   * If no `interval` is specified, the Page's default interval is used instead.
   */
  protected _wait(
    conditionFunc: () => boolean, conditionMessage: string, opts: Workflo.ITimeoutInterval = Object.create(null),
  ) {
    const timeout = opts.timeout || this._page.getTimeout();
    const interval = opts.interval || this._page.getInterval();

    let error = undefined;

    try {
      browser.waitUntil(() => {
        try {
          return conditionFunc();
        } catch (_error) {
          error = _error;
        }
      },                timeout, '', interval);
    } catch (untilError) {
      const _error = error || untilError;

      if (_error.type === 'WaitUntilTimeoutError') {
        const waitError = new Error(
          `Waiting for page ${this.constructor.name}${conditionMessage} within ${timeout}ms failed.`,
        ) as any;

        waitError.type = 'WaitUntilTimeoutError';

        throw waitError;
      } else {
        throw _error;
      }
    }

    return this._page;
  }

  /**
   * Waits for Page to become open and throws an error of the Page does not become open within a specific timeout.
   *
   * @param opts includes the options defined in `IsOpenOpts`, the `timeout` within which the Page must become open and
   * the `interval` used to check for this condition.
   *
   * If no `timeout` is specified, the Page's default timeout is used instead.
   * If no `interval` is specified, the Page's default interval is used instead.
   *
   * @returns Page
   */
  isOpen(opts: IsOpenOpts & Workflo.ITimeoutInterval = Object.create(null)) {
    return this._wait(() => this._page.isOpen(opts), ' to be open', opts);
  }

  /**
   * Waits for Page to become closed and throws an error of the Page does not become closed within a specific timeout.
   *
   * @param opts includes the options defined in `IsClosedOpts`, the `timeout` within which the Page must become closed
   * and the `interval` used to check for this condition.
   *
   * If no `timeout` is specified, the Page's default timeout is used instead.
   * If no `interval` is specified, the Page's default interval is used instead.
   *
   * @returns Page
   */
  isClosed(opts: IsClosedOpts & Workflo.ITimeoutInterval = Object.create(null)) {
    return this._wait(() => this._page.isClosed(opts), ' to be closed', opts);
  }
}

/**
 * This class defines all `eventually` functions of Page.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes via Page
 * @template PageType type of the Page for which PageEventually defines all `eventually` functions
 * @template IsOpenOpts type of the opts parameter passed to the function `isOpen`
 * @template IsClosedOpts type of the opts parameter passed to the functions `isClosed`
 */
class PageEventually<
  Store extends PageNodeStore,
  PageType extends Page<Store, IsOpenOpts, IsClosedOpts>,
  IsOpenOpts,
  IsClosedOpts
> {

  /**
   * the Page for which PageEventually defines all `eventually` functions
   */
  protected _page: PageType;

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
   * @param opts includes the `timeout` within which the condition is expected to return true and
   * the `interval` used to check for this condition.
   *
   * If no `timeout` is specified, the Page's default timeout is used instead.
   * If no `interval` is specified, the Page's default interval is used instead.
   */
  protected _eventually(
    conditionFunc: () => boolean, opts: Workflo.ITimeoutInterval = Object.create(null),
  ) {
    const timeout = opts.timeout || this._page.getTimeout();
    const interval = opts.interval || this._page.getInterval();

    let error = undefined;

    try {
      browser.waitUntil(
        () => {
          try {
            return conditionFunc();
          } catch (_error) {
            error = _error;
          }
        }, timeout, '', interval);
      return true;
    } catch (untilError) {
      const _error = error || untilError;

      if (_error.type === 'WaitUntilTimeoutError') {
        return false;
      } else {
        throw _error;
      }
    }
  }

  /**
   * Checks if Page eventually becomes open within a specific timeout.
   *
   * @param opts includes the options defined in `IsOpenOpts`, the `timeout` within which the Page must become open and
   * the `interval` used to check for this condition.
   *
   * If no `timeout` is specified, the Page's default timeout is used instead.
   * If no `interval` is specified, the Page's default interval is used instead.
   */
  isOpen(opts: IsOpenOpts & Workflo.ITimeoutInterval = Object.create(null)) {
    return this._eventually(() => this._page.isOpen(opts), opts);
  }

  /**
   * Checks if Page eventually becomes closed within a specific timeout.
   *
   * @param opts includes the options defined in `IsClosedOpts`, the `timeout` within which the Page must become closed
   * and the `interval` used to check for this condition.
   *
   * If no `timeout` is specified, the Page's default timeout is used instead.
   * If no `interval` is specified, the Page's default interval is used instead.
   */
  isClosed(opts: IsClosedOpts & Workflo.ITimeoutInterval = Object.create(null)) {
    return this._eventually(() => this._page.isClosed(opts), opts);
  }
}
