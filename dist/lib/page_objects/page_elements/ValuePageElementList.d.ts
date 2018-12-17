import { PageElementList, ValuePageElement, IValuePageElementOpts, IPageElementListOpts, PageElementListCurrently, PageElementListEventually, PageElementListWait } from './';
import { PageElementStore } from '../stores';
export interface IValuePageElementListOpts<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ValueType> extends IPageElementListOpts<Store, PageElementType, PageElementOptions> {
}
export declare class ValuePageElementList<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ValueType> extends PageElementList<Store, PageElementType, PageElementOptions> implements Workflo.PageNode.IValueElementNode<ValueType[], ValueType[] | ValueType> {
    readonly currently: ValuePageElementListCurrently<Store, PageElementType, PageElementOptions, this, ValueType>;
    readonly wait: ValuePageElementListWait<Store, PageElementType, PageElementOptions, this, ValueType>;
    readonly eventually: ValuePageElementListEventually<Store, PageElementType, PageElementOptions, this, ValueType>;
    constructor(selector: string, opts: IValuePageElementListOpts<Store, PageElementType, PageElementOptions, ValueType>);
    initialWait(): void;
    /**
     * Returns values of all list elements in the order they were retrieved from the DOM
     * after the initial wait was performed.
     */
    getValue(): ValueType[];
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
    getValue(): ValueType[];
    /**
     * Sets values on all list elements immediatly.
     *
     * If values is an array, the number of list elements must match the number of passed values.
     * The values will be assigned in the order that the list elements were retrieved from the DOM.
     *
     * If values is a single value, the same value will be set on all list elements.
     *
     * @param values
     */
    setValue(values: ValueType[] | ValueType): ListType;
    hasValue(value: ValueType | ValueType[]): boolean;
    hasAnyValue(): boolean;
    containsValue(value: ValueType | ValueType[]): boolean;
    readonly not: {
        hasValue: (value: ValueType | ValueType[]) => boolean;
        hasAnyValue: () => boolean;
        containsValue: (value: ValueType | ValueType[]) => boolean;
        isEmpty: () => boolean;
        hasLength: (length: number, comparator?: Workflo.Comparator) => boolean;
        exists: () => boolean;
        isVisible: () => boolean;
        isEnabled: () => boolean;
        hasText: (text: string | string[]) => boolean;
        hasAnyText: () => boolean;
        containsText: (text: string | string[]) => boolean;
        hasDirectText: (directText: string | string[]) => boolean;
        hasAnyDirectText: () => boolean;
        containsDirectText: (directText: string | string[]) => boolean;
    };
}
declare class ValuePageElementListWait<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementListWait<Store, PageElementType, PageElementOptions, ListType> {
    hasValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval): ListType;
    hasAnyValue(opts?: Workflo.IWDIOParamsInterval): ListType;
    containsValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval): ListType;
    readonly not: {
        hasValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval) => ListType;
        hasAnyValue: (opts?: Workflo.IWDIOParamsInterval) => ListType;
        containsValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval) => ListType;
        isEmpty: (opts?: Workflo.IWDIOParamsInterval) => ListType;
        hasLength: (length: number, opts?: import("./PageElementList").IPageElementListWaitLengthParams) => ListType;
        exists: (opts?: Workflo.IWDIOParams) => ListType;
        isVisible: (opts?: Workflo.IWDIOParams) => ListType;
        isEnabled: (opts?: Workflo.IWDIOParams) => ListType;
        hasText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => ListType;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval) => ListType;
        containsText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => ListType;
        hasDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => ListType;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval) => ListType;
        containsDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => ListType;
    };
}
declare class ValuePageElementListEventually<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementListEventually<Store, PageElementType, PageElementOptions, ListType> {
    hasValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyValue(opts?: Workflo.IWDIOParamsInterval): boolean;
    containsValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval): boolean;
    readonly not: {
        hasValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyValue: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval) => boolean;
        isEmpty: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasLength: (length: number, opts?: import("./PageElementList").IPageElementListWaitLengthParams) => boolean;
        exists: (opts?: Workflo.IWDIOParams) => boolean;
        isVisible: (opts?: Workflo.IWDIOParams) => boolean;
        isEnabled: (opts?: Workflo.IWDIOParams) => boolean;
        hasText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => boolean;
    };
}
export {};
