import { pageObjects as core } from 'wdio-workflo'

import { PageElementStore } from '../stores'
import { PageElement, PageElementCurrently, PageElementEventually, PageElementWait, IPageElementOpts } from '../page_elements'

/**
 * This interface can be used to extend wdio-workflo's IValuePageElementOpts interface.
 * It is supposed to serve as the base IValuePageElementOpts interface throughout your project.
 */
export interface IValuePageElementOpts<
  Store extends PageElementStore
> extends core.elements.IValuePageElementOpts<Store>, IPageElementOpts<Store> {}

/**
 * This class can be used to extend or customize the functionality provided by wdio-workflo's ValuePageElement class.
 * It is supposed to serve as the base ValuePageElement class throughout your project.
 */
export abstract class ValuePageElement<
  Store extends PageElementStore,
  ValueType
> extends core.elements.ValuePageElement<Store, ValueType>
implements PageElement<Store> {

  readonly abstract currently: ValuePageElementCurrently<Store, this, ValueType>
  readonly wait: ValuePageElementWait<Store, this, ValueType>
  readonly eventually: ValuePageElementEventually<Store, this, ValueType>

  constructor(selector: string, opts?: IValuePageElementOpts<Store>) {
    super(selector, opts)

    this.wait = new ValuePageElementWait(this)
    this.eventually = new ValuePageElementEventually(this)
  }
}

export abstract class ValuePageElementCurrently<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends core.elements.ValuePageElementCurrently<Store, PageElementType, ValueType>
implements PageElementCurrently<Store, PageElementType> {}

export class ValuePageElementWait<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends core.elements.ValuePageElementWait<Store, PageElementType, ValueType>
implements PageElementWait<Store, PageElementType> {}

export class ValuePageElementEventually<
  Store extends PageElementStore,
  PageElementType extends ValuePageElement<Store, ValueType>,
  ValueType
> extends core.elements.ValuePageElementEventually<Store, PageElementType, ValueType>
implements PageElementEventually<Store, PageElementType> {}