
import { pageObjects as core } from 'wdio-workflo'

import { PageElementStore } from '../stores'

/**
 * This interface can be used to extend wdio-workflo's IPageArgs interface.
 * It is supposed to serve as the base IPageArgs interface throughout your project.
 */
export interface IPageArgs<
  Store extends PageElementStore
> extends core.pages.IPageArgs<Store> {}

/**
 * This class can be used to extend or customize the functionality provided by wdio-workflo's Page class.
 * It is supposed to serve as the base Page class throughout your project.
 */
export abstract class Page<
  Store extends PageElementStore
> extends core.pages.Page<Store> {

  constructor(args: IPageArgs<Store>) {
    super(args)
  }
}