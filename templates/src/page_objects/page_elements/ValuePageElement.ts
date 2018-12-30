import { pageObjects as core } from 'wdio-workflo'

import { PageElementStore } from '../stores'
import { PageElement, IPageElementOpts } from '../page_elements'

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
> extends core.elements.ValuePageElement<Store, ValueType> implements PageElement<Store> {

  constructor(selector: string, opts?: IValuePageElementOpts<Store>) {
    super(selector, opts)
  }
}