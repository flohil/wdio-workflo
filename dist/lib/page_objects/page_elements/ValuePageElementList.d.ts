import { PageElementList, ValuePageElement, IValuePageElementOpts } from './';
import { PageElementStore } from '../stores';
export declare class ValuePageElementList<Store extends PageElementStore, PageElementType extends ValuePageElement<Store>, PageElementOptions extends IValuePageElementOpts<Store>> extends PageElementList<Store, PageElementType, PageElementOptions> {
    initialWait(): void;
}
