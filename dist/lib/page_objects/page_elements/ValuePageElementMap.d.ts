import { PageElementMap, ValuePageElement, IValuePageElementOpts, IPageElementMapOpts, PageElementMapCurrently } from './';
import { PageElementStore } from '../stores';
export interface IValuePageElementMapOpts<Store extends PageElementStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ValueType> extends IPageElementMapOpts<Store, K, PageElementType, PageElementOptions> {
}
declare type ExtractValue<T extends {
    [key: string]: Workflo.PageNode.INode;
}> = {
    [P in keyof T]: T[P] extends Workflo.PageNode.IGetValueNode<any> ? ReturnType<T[P]['getValue']> : undefined;
};
export declare class ValuePageElementMap<Store extends PageElementStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ValueType> extends PageElementMap<Store, K, PageElementType, PageElementOptions> implements Workflo.PageNode.IGetValueNode<Partial<Record<K, ValueType>>>, Workflo.PageNode.ISetValueNode<ExtractValue<Record<K, PageElementType>>> {
    readonly currently: ValuePageElementMapCurrently<Store, K, PageElementType, PageElementOptions, this, ValueType>;
    constructor(selector: string, opts: IValuePageElementMapOpts<Store, K, PageElementType, PageElementOptions, ValueType>);
    /**
     * Returns values of all list elements after performing an initial wait in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getValue(filter?: Partial<Record<K, ValueType>>): Partial<Record<K, ValueType>>;
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
    setValue(values: ExtractValue<Partial<Record<K, PageElementType>>>): this;
}
declare class ValuePageElementMapCurrently<Store extends PageElementStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, MapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>, ValueType> extends PageElementMapCurrently<Store, K, PageElementType, PageElementOptions, MapType> implements Workflo.PageNode.IGetValue<Partial<Record<K, ValueType>>>, Workflo.PageNode.ISetValueWithContext<ExtractValue<Record<K, PageElementType>>, MapType> {
    /**
     * Returns values of all list elements immediatly in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getValue(filter?: Partial<Record<K, ValueType>>): Partial<Record<K, ValueType>>;
    setValue(values: ExtractValue<Partial<Record<K, PageElementType>>>): MapType;
}
export {};
