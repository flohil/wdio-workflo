import { PageElement, IPageElementOpts } from './'
import { PageElementStore } from '../stores'

export interface IInputOpts<Store extends PageElementStore> extends IPageElementOpts<Store> {}

export class Input<Store extends PageElementStore> extends PageElement<Store> implements Workflo.PageNode.ISetValue<string> {
  
  getValue() {
    return this.element.getValue()
  }

  setValue( value: string ) {
    const valueStr = '' + value
    const maxTries = 10
    let tries = 0

    this.element.setValue(value)

    while ( this._element.getValue() !== valueStr && tries < maxTries ) {
      this._element.setValue(value)
    }

    return this
  }
}