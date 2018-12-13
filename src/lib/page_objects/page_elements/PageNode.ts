import { PageElementStore } from '../stores'
import _ = require('lodash');

export interface IPageNodeOpts<Store extends PageElementStore> {
  store: Store
}

export class PageNode<Store extends PageElementStore> implements Workflo.PageNode.INode {
  protected _store: Store
  protected _lastDiff: Workflo.IDiff

  readonly currently: PageNodeCurrently<Store, this>
  readonly wait: PageNodeWait<Store, this>
  readonly eventually: PageNodeEventually<Store, this>

  // available options:
  // - wait -> initial wait operation: exist, visible, text, value
  constructor(
    protected _selector: string,
    {
      store
    } : IPageNodeOpts<Store>
  ) {
    this._store = store

    this.currently = new PageNodeCurrently(this)
    this.wait = new PageNodeWait(this)
    this.eventually = new PageNodeEventually(this)
  }

  __getNodeId() {
    return this._selector
  }

  toJSON(): Workflo.IElementJSON {
    return {
      pageNodeType: this.constructor.name,
      nodeId: this._selector
    }
  }

  get __lastDiff() {
    const lastDiff = this._lastDiff || {}
    lastDiff.selector = this.getSelector()
    lastDiff.constructorName = this.constructor.name

    return lastDiff
  }

  __setLastDiff(diff: Workflo.IDiff) {
    this._lastDiff = diff
  }

  getSelector() {
    return this._selector
  }

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
        `( ${this.getSelector()} )`

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
        `( ${this.getSelector()} )`
      )
    } else if ('type' in error && error.type === 'WaitUntilTimeoutError') {
      const waitError = new Error(
        `${this.constructor.name}${errorMessage} within ${timeout}ms.\n( ${this.getSelector()} )`
      ) as any

      waitError.type = 'WaitUntilTimeoutError'

      throw waitError
    } else {
      throw error
    }
  }
}

export class PageNodeCurrently<
  Store extends PageElementStore,
  PageElementType extends PageNode<Store>
> {
  protected readonly _node: PageElementType

  constructor(node: PageElementType) {
    this._node = node
  }
}

export class PageNodeWait<
  Store extends PageElementStore,
  PageElementType extends PageNode<Store>
> {
  protected readonly _node: PageElementType

  constructor(node: PageElementType) {
    this._node = node
  }
}

export class PageNodeEventually<
  Store extends PageElementStore,
  PageElementType extends PageNode<Store>
> {
  protected readonly _node: PageElementType

  constructor(node: PageElementType) {
    this._node = node
  }
}