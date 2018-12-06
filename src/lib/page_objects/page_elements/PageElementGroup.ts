import { PageElementStore, pageElement } from '../stores'

import {PageElement} from './PageElement'

export type ExtractText<T extends {[key: string]: Workflo.PageNode.INode}> = {
  [P in keyof T]: T[P] extends Workflo.PageNode.IGetTextNode<any> ? ReturnType<T[P]['getText']> : undefined;
}

export type ExtractInterfaceFunc<
  T extends {[key: string]: NodeInterface | Workflo.PageNode.INode},
  NodeInterface extends {[key: string]: (...args: any[]) => any},
  InterfaceFuncKey extends keyof NodeInterface
> = {
  [P in keyof T]: T[P] extends NodeInterface ? ReturnType<T[P][InterfaceFuncKey]> : undefined;
}

export type FilterMaskText<T extends {[key: string]: Workflo.PageNode.INode}> = {
  [P in keyof T]: T[P] extends Workflo.PageNode.IGetTextNode<any> ? boolean : undefined;
}

export interface IPageElementGroupOpts<
  Content extends {[key: string] : Workflo.PageNode.INode}
> {
  id: string,
  content: Content
}

// Encapsulates arbitrary page element types.
// Exposes its content directly as its own members,
// so each key in content can be accessed via dot notation.
//
// Naming Convention:
// - all content members must start with a lower case letter
// - all group functions must start with upper case letter
// - all private members of group must start with _
export class PageElementGroup<
  Store extends PageElementStore,
  Content extends {[K in keyof Content] : Workflo.PageNode.INode}
> implements Workflo.PageNode.IGetTextNode<ExtractText<Partial<Content>>> {
  protected _id: string
  protected _$: Content
  protected _lastDiff: Workflo.PageNode.IDiff

  readonly currently: PageElementGroupCurrently<Store, Content, this>
  readonly eventually: PageElementGroupEventually<Store, Content, this>

  constructor({
    id,
    content
  }: IPageElementGroupOpts<Content>) {
    this._id = id
    this._$ = content

    this.currently = new PageElementGroupCurrently(this)
    this.eventually = new PageElementGroupEventually(this)
  }

  get $() {
    return this._$
  }

  get __lastDiff() {
    return this._lastDiff
  }

  __toJSON(): Workflo.PageNode.IElementJSON {
    return {
      pageNodeType: this.constructor.name,
      nodeId: this._id
    }
  }

  __getNodeId() {
    return this._id
  }

  // GETTER FUNCTIONS

  getText(filterMask?: FilterMaskText<Partial<Content>>) {

    let result = {} as ExtractText<Partial<Content>>;

    for (const k in this.$) {
      if (isGetTextNode(this.$[k])) {
        const elem = this.$[k] as any as Workflo.PageNode.IGetTextNode<any>

        if (filterMask) {
          if (filterMask[k] === true) {
            result[k] = elem.getText()
          }
        } else {
          result[k] = elem.getText()
        }
      }
    }

    return result;
  }

  // HELPER FUNCTIONS

  getText2() {
    return this.eachGet(this.$, 'getText', node => node.getText())
  }

  eachGet<
    NodeInterface extends {[P in keyof NodeInterface]: (...args: any[]) => ReturnType<NodeInterface[keyof NodeInterface]>},
    _Content extends {[K in keyof _Content]: NodeInterface | Workflo.PageNode.INode},
  >(
    context: _Content,
    funcName: keyof NodeInterface,
    getFunc: (node: NodeInterface) => ReturnType<NodeInterface[keyof NodeInterface]>,
  ): ExtractInterfaceFunc<_Content, NodeInterface, keyof NodeInterface> {
    let result = {} as ExtractInterfaceFunc<_Content, NodeInterface, keyof NodeInterface>;

    for (const k in context) {
      const node = context[k]

      if (hasNodeInterface(node, funcName)) {
        result[k] = getFunc(node) as any
      }
    }

    return result;
  }

  eachCheck<K extends string>(
    compareFunc: (node: Workflo.PageNode.IGetTextNode<any>, expected?: Content[K]) => boolean,
    expected?: ExtractText<Partial<Content>>,
  ): boolean {

    const jd = {
      a: pageElement.Element('//div'),
      b: pageElement.ElementList('//div'),
      c: pageElement.ElementGroup({
        d: pageElement.Element('//div'),
        e: pageElement.ElementList('//div'),
      })
    }

    const jiji = jd.c.getText2()

    const kkk = this.eachGet(jd, 'getText', node => node.getText())

    const diffs: Workflo.PageNode.IDiffTree = {}

    for (const k in expected) {
      if (isGetTextNode(this._$[k])) {
        const elem = this._$[k] as any as Workflo.PageNode.IGetTextNode<any>

        if (!compareFunc(elem, expected[k])) {
          diffs[k] = elem.__lastDiff
        }
      }
    }

    this._lastDiff = {
      tree: diffs
    }

    return Object.keys(diffs).length === 0
  }
}

export class PageElementGroupCurrently<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> implements Workflo.PageNode.IGetText<ExtractText<Partial<Content>>>,
  Workflo.PageNode.ICheckTextCurrently<ExtractText<Partial<Content>>> {

  protected readonly _node: GroupType

  constructor(node: GroupType) {
    this._node = node;
  }

  getText(filterMask?: FilterMaskText<Partial<Content>>) {
    let result = {} as ExtractText<Partial<Content>>;

    for (const k in this._node.$) {
      if (isGetTextNode(this._node.$[k])) {
        const elem = this._node.$[k] as any as Workflo.PageNode.IGetTextNode<any>

        if (filterMask) {
          if (filterMask[k] === true) {
            result[k] = elem.currently.getText()
          }
        } else {
          result[k] = elem.currently.getText()
        }
      }
    }

    return result;
  }

  hasText(text: ExtractText<Partial<Content>>) {
    return this._node.eachCheck((element, expected) => element.currently.hasText(expected), text)
  }

  hasAnyText() {
    return this._node.eachCheck(element => element.currently.hasAnyText())
  }

  containsText(text: ExtractText<Partial<Content>>) {
    return this._node.eachCheck((element, expected) => element.currently.containsText(expected), text)
  }

  not = {
    hasText: (text: ExtractText<Partial<Content>>) => {
      return this._node.eachCheck((element, expected) => element.currently.not.hasText(expected), text)
    },
    hasAnyText: () => {
      return this._node.eachCheck(element => element.currently.not.hasAnyText())
    },
    containsText: (text: ExtractText<Partial<Content>>) => {
      return this._node.eachCheck((element, expected) => element.currently.not.containsText(expected), text)
    }
  }
}

export class PageElementGroupEventually<
  Store extends PageElementStore,
  Content extends {[key: string] : Workflo.PageNode.INode},
  GroupType extends PageElementGroup<Store, Content>
> implements Workflo.PageNode.ICheckTextEventually<ExtractText<Partial<Content>>> {

  protected readonly _node: GroupType

  constructor(node: GroupType) {
    this._node = node;
  }

  hasText(text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck((element, expected) => element.eventually.hasText(expected, opts), text)
  }

  hasAnyText(opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck(element => element.eventually.hasAnyText(opts))
  }

  containsText(text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) {
    return this._node.eachCheck((element, expected) => element.eventually.containsText(expected, opts), text)
  }

  not = {
    hasText: (text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck((element, expected) => element.eventually.not.hasText(expected, opts), text)
    },
    hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck(element => element.eventually.not.hasAnyText(opts))
    },
    containsText: (text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => {
      return this._node.eachCheck((element, expected) => element.eventually.not.containsText(expected, opts), text)
    }
  }
}

// type guards
function isGetTextNode(node: any): node is Workflo.PageNode.IGetTextNode<any> {
  return typeof node.getText === 'function' &&
  typeof node.currently.hasText === 'function' &&
  typeof node.currently.hasAnyText === 'function' &&
  typeof node.currently.containsText === 'function' &&
  typeof node.eventually.hasText === 'function' &&
  typeof node.eventually.hasAnyText === 'function' &&
  typeof node.eventually.containsText === 'function'
}


const jd = {
  a: {
    getText: () => 'adsf',
    adsf: 1
  }
}

const jod: ExtractInterfaceFunc<typeof jd, {getText: () => string}, 'getText'> = {
  a: 'asdf'
}


function hasNodeInterface<NodeInterface>(node: Workflo.PageNode.INode | NodeInterface, funcName: keyof NodeInterface): node is NodeInterface {
  return (<NodeInterface>node)[funcName] !== undefined;
}