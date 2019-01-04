import { PageElementStore } from '../stores'
import _ = require('lodash');
import { DEFAULT_TIMEOUT } from '..'

/**
 * Defines the opts parameter passed to the constructor function of PageNode.
 */
export interface IPageNodeOpts<Store extends PageElementStore> extends Workflo.ITimeout {
  store: Store
}

export abstract class PageNode<Store extends PageElementStore> implements Workflo.PageNode.INode {
  protected _store: Store
  protected _lastDiff: Workflo.IDiff
  protected _selector: string
  protected _timeout: number

  abstract readonly currently: PageNodeCurrently<Store, this>
  abstract readonly wait: PageNodeWait<Store, this>
  abstract readonly eventually: PageNodeEventually<Store, this>

  // available options:
  // - wait -> initial wait operation: exist, visible, text, value
  constructor(
    selector: string,
    opts: IPageNodeOpts<Store>
  ) {
    this._selector = selector
    this._store = opts.store
    this._timeout = opts.timeout || JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || DEFAULT_TIMEOUT
  }

  // INTERNAL GETTERS AND SETTERS

  __getNodeId() {
    return this._selector
  }

  get __lastDiff() {
    const lastDiff = this._lastDiff || {}
    lastDiff.selector = this.__getNodeId()
    lastDiff.constructorName = this.constructor.name

    return lastDiff
  }

  __setLastDiff(diff: Workflo.IDiff) {
    this._lastDiff = diff
  }

  // PUBLIC GETTERS

  getTimeout() {
    return this._timeout
  }

  // PUBLIC ACTIONS

  toJSON(): Workflo.IElementJSON {
    return {
      pageNodeType: this.constructor.name,
      nodeId: this._selector
    }
  }

  // COMMON HELPER FUNCTIONS

  /**
   * Executes func and, if an error occurs during execution of func,
   * throws a custom error message that the page element could not be located on the page.
   * @param func
   */
  __execute<ResultType>(func: () => ResultType) {
    try {
      return func()
    } catch ( error ) {
      if (error.message.includes('could not be located on the page')) {
        const errorMsg =
        `${this.constructor.name} could not be located on the page.\n` +
        `( ${this.__getNodeId()} )`

        throw new Error(errorMsg)
      } else {
        throw error
      }
    }
  }

  __eventually(func: () => void) : boolean {
    try {
      func();
      return true;
    } catch (error) {
      if (error.message.includes('could not be located on the page')) {
        throw error
      } else if (error.type === 'WaitUntilTimeoutError') {
        return false;
      } else {
        throw error
      }
    }
  }

  __wait(func: () => boolean, errorMessage: string, timeout: number) {
    try {
      func();
    } catch (error) {
      this._handleWaitError(error, errorMessage, timeout)
    }

    return this
  }

  __waitUntil(
    waitFunc: () => boolean, errorMessageFunc: () => string, timeout: number, interval?: number
  ) {

    let error: any

    try {
      browser.waitUntil(() => {
        try {
          const result = waitFunc()

          error = undefined

          return result
        } catch( funcError ) {
          error = funcError
        }
      }, timeout, '', interval)
    } catch (untilError) {
      error = error || untilError

      this._handleWaitError(error, errorMessageFunc(), timeout)
    }

    return this
  }

  protected _handleWaitError(error: any, errorMessage: string, timeout: number) {
    if (error.message.includes('could not be located on the page')) {
      throw new Error(
        `${this.constructor.name} could not be located on the page within ${timeout}ms.\n` +
        `( ${this.__getNodeId()} )`
      )
    } else if ('type' in error && error.type === 'WaitUntilTimeoutError') {
      const waitError = new Error(
        `${this.constructor.name}${errorMessage} within ${timeout}ms.\n( ${this.__getNodeId()} )`
      ) as any

      waitError.type = 'WaitUntilTimeoutError'

      throw waitError
    } else {
      throw error
    }
  }
}

export abstract class PageNodeCurrently<
  Store extends PageElementStore,
  PageElementType extends PageNode<Store>
> {
  protected readonly _node: PageElementType

  constructor(node: PageElementType) {
    this._node = node
  }

  abstract get not(): {}
}

export abstract class PageNodeWait<
  Store extends PageElementStore,
  PageElementType extends PageNode<Store>
> {
  protected readonly _node: PageElementType

  constructor(node: PageElementType) {
    this._node = node
  }

  abstract get not(): {}
}

export abstract class PageNodeEventually<
  Store extends PageElementStore,
  PageElementType extends PageNode<Store>
> {
  protected readonly _node: PageElementType

  constructor(node: PageElementType) {
    this._node = node
  }

  abstract get not(): {}
}