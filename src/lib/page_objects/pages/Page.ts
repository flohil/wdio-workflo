import { PageElementStore } from '../stores'
import { DEFAULT_TIMEOUT, DEFAULT_INTERVAL } from '../'

export interface IPageArgs<Store extends PageElementStore> extends Workflo.IWDIOParamsInterval {
  elementStore: Store
}

export abstract class Page<
  Store extends PageElementStore,
  IsOpenOpts = {}
> {
  protected _elementStore: Store
  protected _timeout: number
  protected _interval: number

  constructor(args: IPageArgs<Store>) {
    this._elementStore = args.elementStore

    this._timeout = args.timeout || JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || DEFAULT_TIMEOUT
    this._interval = args.interval || JSON.parse(process.env.WORKFLO_CONFIG).intervals.default || DEFAULT_INTERVAL
  }

  getTimeout() {
    return this._timeout
  }

  getInterval() {
    return this._interval
  }

  abstract isOpen(opts?: IsOpenOpts): boolean

  waitIsOpen(opts: IsOpenOpts & Workflo.IWDIOParamsInterval = Object.create(null)) {
    const timeout = opts.timeout || this._timeout
    let error: any

    try {
      browser.waitUntil(() => {
        try {
          const result = this.isOpen()

          error = undefined

          return result
        } catch( funcError ) {
          error = funcError
        }
      }, timeout, '', opts.interval || this._interval)
    } catch (untilError) {
      error = error || untilError

      this._handleWaitError(error, timeout)
    }
  }

  eventuallyIsOpen(opts: IsOpenOpts & Workflo.IWDIOParamsInterval = Object.create(null)) {
    try {
      browser.waitUntil(() => this.isOpen(), opts.timeout || this._timeout, '', opts.interval || this._interval)
      return true
    } catch(error) {
      return false
    }
  }

  protected _handleWaitError(error: any, timeout: number) {
    if ('type' in error && error.type === 'WaitUntilTimeoutError') {
      const waitError = new Error(
        `Waiting for page ${this.constructor.name} to be open within ${timeout}ms failed`
      ) as any

      waitError.type = 'WaitUntilTimeoutError'

      throw waitError
    } else {
      throw error
    }
  }
}