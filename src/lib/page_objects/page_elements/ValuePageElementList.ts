import { PageElementList, ValuePageElement, IValuePageElementOpts } from './'
import { PageElementStore } from '../stores'

export class ValuePageElementList<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store>,
  PageElementOptions extends IValuePageElementOpts<Store>,
> extends PageElementList<Store, PageElementType, PageElementOptions> {

  initialWait() {
    if (this._waitType === Workflo.WaitType.value) {
      this.wait.any.hasAnyValue()
    } else {
      super.initialWait()
    }
  }
}