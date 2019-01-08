import { PageElementMap, ValuePageElement, IValuePageElementOpts, IPageElementMapOpts, PageElementMapCurrently, PageElementMapEventually, PageElementMapWait } from './';
import { PageElementStore } from '../stores';
export interface IValuePageElementMapOpts<Store extends PageElementStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ValueType> extends IPageElementMapOpts<Store, K, PageElementType, PageElementOptions> {
}
export declare class ValuePageElementMap<Store extends PageElementStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ValueType> extends PageElementMap<Store, K, PageElementType, PageElementOptions> implements Workflo.PageNode.IValueElementNode<Partial<Record<K, ValueType>>, Partial<Record<K, boolean>>> {
    readonly currently: ValuePageElementMapCurrently<Store, K, PageElementType, PageElementOptions, this, ValueType>;
    readonly wait: ValuePageElementMapWait<Store, K, PageElementType, PageElementOptions, this, ValueType>;
    readonly eventually: ValuePageElementMapEventually<Store, K, PageElementType, PageElementOptions, this, ValueType>;
    constructor(selector: string, opts: IValuePageElementMapOpts<Store, K, PageElementType, PageElementOptions, ValueType>);
    /**
     * Returns values of all list elements after performing an initial wait in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filterMask a filter mask
     */
    getValue(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, ValueType>>;
    getHasValue(value: Partial<Record<K, ValueType>>): Partial<Record<K, boolean>>;
    getHasAnyValue(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    getContainsValue(value: Partial<Record<K, ValueType>>): Partial<Record<K, boolean>>;
    /**
     * Sets values on all list elements.
     *
     * If values is an array, the number of list elements must match the number of passed values.
     * The values will be assigned in the order that the list elements were retrieved from the DOM.
     *
     * If values is a single value, the same value will be set on all list elements.
     *
     * @param values
     */
    setValue(values: Partial<Record<K, ValueType>>): this;
}
declare class ValuePageElementMapCurrently<Store extends PageElementStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, MapType extends ValuePageElementMap<Store, K, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementMapCurrently<Store, K, PageElementType, PageElementOptions, MapType> {
    /**
     * Returns values of all list elements immediatly in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filterMask a filter mask
     */
    getValue(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, ValueType>>;
    getHasValue(value: Partial<Record<K, ValueType>>): Partial<Record<K, boolean>>;
    getHasAnyValue(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    getContainsValue(value: Partial<Record<K, ValueType>>): Partial<Record<K, boolean>>;
    hasValue(value: Partial<Record<K, ValueType>>): boolean;
    hasAnyValue(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    containsValue(value: Partial<Record<K, ValueType>>): boolean;
    readonly not: {
        hasValue: (value: Partial<Record<K, ValueType>>) => boolean;
        hasAnyValue: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        containsValue: (value: Partial<Record<K, ValueType>>) => boolean;
        exists: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        isVisible: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        isEnabled: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        hasText: (text: Partial<Record<K, string>>) => boolean;
        hasAnyText: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        containsText: (text: Partial<Record<K, string>>) => boolean;
        hasDirectText: (directText: Partial<Record<K, string>>) => boolean;
        hasAnyDirectText: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        containsDirectText: (directText: Partial<Record<K, string>>) => boolean;
    };
}
declare class ValuePageElementMapWait<Store extends PageElementStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, MapType extends ValuePageElementMap<Store, K, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementMapWait<Store, K, PageElementType, PageElementOptions, MapType> {
    hasValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval): MapType;
    hasAnyValue(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): MapType;
    containsValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval): MapType;
    readonly not: {
        hasValue: (value: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval) => MapType;
        hasAnyValue: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        containsValue: (value: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval) => MapType;
        exists: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        hasText: (texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        containsText: (texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
        hasDirectText: (directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        containsDirectText: (directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
    };
}
declare class ValuePageElementMapEventually<Store extends PageElementStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, MapType extends ValuePageElementMap<Store, K, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementMapEventually<Store, K, PageElementType, PageElementOptions, MapType> {
    hasValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyValue(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): boolean;
    containsValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval): boolean;
    readonly not: {
        hasValue: (value: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyValue: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        containsValue: (value: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval) => boolean;
        exists: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        hasText: (texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        containsText: (texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasDirectText: (directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        containsDirectText: (directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
    };
}
export {};
