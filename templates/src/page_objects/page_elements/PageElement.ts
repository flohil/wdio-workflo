import { pageObjects as core } from 'wdio-workflo'

import { PageElementStore } from '../stores'

/**
 * This interface can be used to extend wdio-workflo's IPageElementOpts interface.
 * It is supposed to serve as the base IPageElementOpts interface throughout your project.
 */
export interface IPageElementOpts<
  Store extends PageElementStore
> extends core.elements.IPageElementOpts<Store> {}

/**
 * This class can be used to extend or customize the functionality provided by wdio-workflo's PageElement class.
 * It is supposed to serve as the base PageElement class throughout your project.
 */
export class PageElement<Store extends PageElementStore> extends core.elements.PageElement<Store> {

  // constructor arguments structure must remain intact:
  // arg1 is selector of type string,
  // arg2 is object that extends baseclass opts with otherwise arbitrary structure - it can be mandatory or optional
  constructor(selector: string, opts?: IPageElementOpts<Store>) {
    super(selector, opts)
  }
}