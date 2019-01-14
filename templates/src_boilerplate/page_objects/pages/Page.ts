
import { pageObjects as core } from 'wdio-workflo';

import { PageNodeStore } from '../stores';

/**
 * Defines the opts parameter passed to the constructor of Page.
 *
 * This interface can be used to extend wdio-workflo's IPageOpts interface.
 * It is supposed to serve as the base IPageOpts interface throughout your project.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes via Page
 */
export interface IPageOpts<
  Store extends PageNodeStore
> extends core.pages.IPageOpts<Store> {}

/**
 * This class can be used to extend or customize the functionality provided by wdio-workflo's Page class.
 * It is supposed to serve as the base Page class throughout your project.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes via Page
 * @template IsOpenOpts type of the opts parameter passed to the functions `isOpen`, `wait.isOpen` and
 * `eventually.isOpen`
 * @template IsClosedOpts type of the opts parameter passed to the functions `isClosed`, `wait.isClosed` and
 * `eventually.isClosed`
 */
export abstract class Page<
  Store extends PageNodeStore,
  IsOpenOpts = {},
  IsClosedOpts = IsOpenOpts
> extends core.pages.Page<Store, IsOpenOpts, IsClosedOpts> {

  /**
   * Page serves as the base class for all Pages.
   *
   * @param opts the options required to create an instance of Page
   */
  constructor(opts: IPageOpts<Store>) {
    super(opts);
  }
}
