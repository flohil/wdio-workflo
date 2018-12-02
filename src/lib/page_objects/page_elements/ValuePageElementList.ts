import { PageElementList, ValuePageElement, IValuePageElementOpts, IPageElementListOpts } from './'
import { PageElementStore } from '../stores'

export interface IValuePageElementListOpts<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ValueType
> extends IPageElementListOpts<Store, PageElementType, PageElementOptions> {}

export class ValuePageElementList<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  PageElementOptions extends Partial<IValuePageElementOpts<Store>>,
  ValueType
> extends PageElementList<Store, PageElementType, PageElementOptions>
implements Workflo.PageNode.IGetValue<ValueType[]>, Workflo.PageNode.ISetValue<ValueType[]> {

  constructor(
    selector: string,
    opts: IValuePageElementListOpts<Store, PageElementType, PageElementOptions, ValueType>
  ) {
    super(selector, opts)
  }

  initialWait() {
    if (this._waitType === Workflo.WaitType.value) {
      this.wait.any.hasAnyValue()
    } else {
      super.initialWait()
    }
  }

  getValue(): ValueType[] {
    return this.all.map(valuePageElement => valuePageElement.getValue())
  }

  setValue(values: ValueType[]) {
    const allElements = this.all

    if (allElements.length !== values.length) {
      throw new Error(
        `Length of values array (${allElements.length}) did not match length of list page elements (${values.length})!`
      )
    } else {
      for ( let i = 0; i < values.length; i++) {
        allElements[i].setValue(values[i])
      }
    }

    return this
  }
}