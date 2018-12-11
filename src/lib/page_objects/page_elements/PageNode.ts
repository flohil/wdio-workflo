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

  __toJSON(): Workflo.IElementJSON {
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

  protected _wait(func: () => boolean, errorMessage: string, timeout: number) {
    try {
      func();
    } catch (error) {
      if (error.message.includes('could not be located on the page')) {
        throw new Error(
          `${this._node.constructor.name} could not be located on the page within ${timeout}ms.\n` +
          `( ${this._node.getSelector()} )`
        )
      } else {
        throw new Error(
          `${this._node.constructor.name}${errorMessage} within ${timeout}ms.\n( ${this._node.getSelector()} )`
        )
      }
    }

    return this._node
  }

  protected _waitUntil(
    waitFunc: () => boolean, errorMessageFunc: () => string, timeout: number
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
      }, timeout)
    } catch (untilError) {
      error = error || untilError

      if (error.message.includes('could not be located on the page')) {
        throw new Error(
          `${this._node.constructor.name} could not be located on the page within ${timeout}ms.\n` +
          `( ${this._node.getSelector()} )`
        )
      } else {
        throw new Error(
          `${this._node.constructor.name}${errorMessageFunc()} within ${timeout}ms.\n( ${this._node.getSelector()} )`
        )
      }
    }

    return this._node
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