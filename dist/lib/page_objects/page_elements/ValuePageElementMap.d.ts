import { PageElementMap, ValuePageElement, IValuePageElementOpts, IPageElementMapOpts, PageElementMapCurrently, PageElementMapEventually, PageElementMapWait } from './';
import { PageElementStore } from '../stores';
export interface IValuePageElementMapOpts<Store extends PageElementStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ValueType> extends IPageElementMapOpts<Store, K, PageElementType, PageElementOptions> {
}
export declare class ValuePageElementMap<Store extends PageElementStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ValueType> extends PageElementMap<Store, K, PageElementType, PageElementOptions> implements Workflo.PageNode.IValueElementNode<Partial<Record<K, ValueType>>> {
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
    getValue(filterMask?: Partial<Record<K, ValueType>>): Partial<Record<K, ValueType>>;
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
    getValue(filterMask?: Partial<Record<K, ValueType>>): Partial<Record<K, ValueType>>;
    setValue(values: Partial<Record<K, ValueType>>): MapType;
    hasValue(value: Partial<Record<K, ValueType>>): boolean;
    hasAnyValue(filterMask?: Partial<Record<K, string>>): boolean;
    containsValue(value: Partial<Record<K, ValueType>>): boolean;
    readonly not: {
        hasValue: (value: Partial<Record<K, ValueType>>) => boolean;
        hasAnyValue: (filterMask?: Partial<Record<K, string>>) => boolean;
        containsValue: (value: Partial<Record<K, ValueType>>) => boolean;
        exists: (filterMask?: Partial<Record<K, true>>) => boolean;
        isVisible: (filterMask?: Partial<Record<K, true>>) => boolean;
        isEnabled: (filterMask?: Partial<Record<K, true>>) => boolean;
        hasText: (text: Partial<Record<K, string>>) => boolean;
        hasAnyText: (filterMask?: Partial<Record<K, string>>) => boolean;
        containsText: (text: Partial<Record<K, string>>) => boolean;
        hasDirectText: (directText: Partial<Record<K, string>>) => boolean;
        hasAnyDirectText: (filterMask?: Partial<Record<K, string>>) => boolean;
        containsDirectText: (directText: Partial<Record<K, string>>) => boolean;
    };
}
declare class ValuePageElementMapWait<Store extends PageElementStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, MapType extends ValuePageElementMap<Store, K, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementMapWait<Store, K, PageElementType, PageElementOptions, MapType> {
    hasValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsOptional): MapType;
    hasAnyValue(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: Partial<Record<K, string>>;
    }): MapType;
    containsValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsOptional): MapType;
    readonly not: {
        hasValue: (value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsOptional) => MapType;
        hasAnyValue: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, string>>;
        }) => MapType;
        containsValue: (value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsOptional) => MapType;
        exists: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, true>>;
        }) => MapType;
        isVisible: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, true>>;
        }) => MapType;
        isEnabled: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, true>>;
        }) => MapType;
        hasText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => MapType;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, string>>;
        }) => MapType;
        containsText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => MapType;
        hasDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => MapType;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, string>>;
        }) => MapType;
        containsDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => MapType;
    };
}
declare class ValuePageElementMapEventually<Store extends PageElementStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, MapType extends ValuePageElementMap<Store, K, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementMapEventually<Store, K, PageElementType, PageElementOptions, MapType> {
    hasValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyValue(opts?: Workflo.IWDIOParamsOptional & {
        filterMask?: Partial<Record<K, string>>;
    }): boolean;
    containsValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsOptional): boolean;
    readonly not: {
        hasValue: (value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyValue: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, string>>;
        }) => boolean;
        containsValue: (value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        exists: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, true>>;
        }) => boolean;
        isVisible: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, true>>;
        }) => boolean;
        isEnabled: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, true>>;
        }) => boolean;
        hasText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, string>>;
        }) => boolean;
        containsText: (text: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional & {
            filterMask?: Partial<Record<K, string>>;
        }) => boolean;
        containsDirectText: (directText: Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
    };
}
export {};
