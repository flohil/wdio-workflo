import { PageElementList, ValuePageElement, IValuePageElementOpts, ValuePageElementWait, ValuePageElementEventually } from './'
import { PageElementStore } from '../stores'

export class ValuePageElementList<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store>,
  PageElementOptions extends IValuePageElementOpts<Store>,
  PageElementTypeWait extends ValuePageElementWait<Store, PageElementType>,
  PageElementTypeEventually extends ValuePageElementEventually<Store, PageElementType>
> extends PageElementList<
  Store, ValuePageElement<Store>, PageElementOptions, PageElementTypeWait, PageElementTypeEventually
> {

  initialWait() {
    if (this._waitType === Workflo.WaitType.value) {
      this.wait.any.hasAnyValue()
    } else {
      super.initialWait()
    }
  }
}