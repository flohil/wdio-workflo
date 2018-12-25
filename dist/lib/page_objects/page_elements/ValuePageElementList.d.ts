import { PageElementList, ValuePageElement, IValuePageElementOpts, IPageElementListOpts, PageElementListCurrently, PageElementListEventually, PageElementListWait } from './';
import { PageElementStore } from '../stores';
export interface IValuePageElementListOpts<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ValueType> extends IPageElementListOpts<Store, PageElementType, PageElementOptions> {
}
export declare class ValuePageElementList<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ValueType> extends PageElementList<Store, PageElementType, PageElementOptions> implements Workflo.PageNode.IValueElementNode<ValueType[], boolean[], ValueType[] | ValueType> {
    readonly currently: ValuePageElementListCurrently<Store, PageElementType, PageElementOptions, this, ValueType>;
    readonly wait: ValuePageElementListWait<Store, PageElementType, PageElementOptions, this, ValueType>;
    readonly eventually: ValuePageElementListEventually<Store, PageElementType, PageElementOptions, this, ValueType>;
    constructor(selector: string, opts: IValuePageElementListOpts<Store, PageElementType, PageElementOptions, ValueType>);
    initialWait(): void;
    /**
     * Returns values of all list elements in the order they were retrieved from the DOM
     * after the initial wait was performed.
     */
    getValue(filterMask?: Workflo.PageNode.ListFilterMask): ValueType[];
    /**
     * Sets values on all list elements after the initial wait was performed.
     *
     * If values is an array, the number of list elements must match the number of passed values.
     * The values will be assigned in the order that the list elements were retrieved from the DOM.
     *
     * If values is a single value, the same value will be set on all list elements.
     *
     * @param values
     */
    setValue(values: ValueType[] | ValueType): this;
}
declare class ValuePageElementListCurrently<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementListCurrently<Store, PageElementType, PageElementOptions, ListType> {
    /**
     * Returns values of all list elements in the order they were retrieved from the DOM immediatly.
     */
    getValue(filterMask?: Workflo.PageNode.ListFilterMask): ValueType[];
    hasValue(value: ValueType | ValueType[]): boolean;
    hasAnyValue(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    containsValue(value: ValueType | ValueType[]): boolean;
    readonly not: {
        hasValue: (value: ValueType | ValueType[]) => boolean;
        hasAnyValue: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        containsValue: (value: ValueType | ValueType[]) => boolean;
        isEmpty: () => boolean;
        hasLength: (length: number, comparator?: Workflo.Comparator) => boolean;
        exists: (filterMask?: boolean) => boolean;
        isVisible: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        isEnabled: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        hasText: (text: string | string[]) => boolean;
        hasAnyText: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        containsText: (text: string | string[]) => boolean;
        hasDirectText: (directText: string | string[]) => boolean;
        hasAnyDirectText: (filterMask?: Workflo.PageNode.ListFilterMask) => boolean;
        containsDirectText: (directText: string | string[]) => boolean;
    };
}
declare class ValuePageElementListWait<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementListWait<Store, PageElementType, PageElementOptions, ListType> {
    hasValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval): ListType;
    hasAnyValue(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask): ListType;
    containsValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval): ListType;
    readonly not: {
        hasValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval) => ListType;
        hasAnyValue: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask) => ListType;
        containsValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval) => ListType;
        isEmpty: (opts?: Workflo.IWDIOParamsInterval) => ListType;
        hasLength: (length: number, opts?: import("./PageElementList").IPageElementListWaitLengthParams) => ListType;
        exists: (opts?: Workflo.IWDIOParams & {
            filterMask?: boolean;
        }) => ListType;
        isVisible: (opts?: Workflo.IWDIOParams & Workflo.PageNode.IListFilterMask) => ListType;
        isEnabled: (opts?: Workflo.IWDIOParams & Workflo.PageNode.IListFilterMask) => ListType;
        hasText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => ListType;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask) => ListType;
        containsText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => ListType;
        hasDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => ListType;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask) => ListType;
        containsDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => ListType;
    };
}
declare class ValuePageElementListEventually<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementListEventually<Store, PageElementType, PageElementOptions, ListType> {
    hasValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyValue(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask): boolean;
    containsValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval): boolean;
    readonly not: {
        hasValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyValue: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask) => boolean;
        containsValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval) => boolean;
        isEmpty: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasLength: (length: number, opts?: import("./PageElementList").IPageElementListWaitLengthParams) => boolean;
        exists: (opts?: Workflo.IWDIOParams & {
            filterMask?: boolean;
        }) => boolean;
        isVisible: (opts?: Workflo.IWDIOParams & Workflo.PageNode.IListFilterMask) => boolean;
        isEnabled: (opts?: Workflo.IWDIOParams & Workflo.PageNode.IListFilterMask) => boolean;
        hasText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask) => boolean;
        containsText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask) => boolean;
        containsDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => boolean;
    };
}
export {};
