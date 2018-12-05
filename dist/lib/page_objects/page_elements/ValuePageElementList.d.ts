import { PageElementList, ValuePageElement, IValuePageElementOpts, IPageElementListOpts, PageElementListCurrently, PageElementListEventually } from './';
import { PageElementStore } from '../stores';
export interface IValuePageElementListOpts<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ValueType> extends IPageElementListOpts<Store, PageElementType, PageElementOptions> {
}
export declare class ValuePageElementList<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ValueType> extends PageElementList<Store, PageElementType, PageElementOptions> implements Workflo.PageNode.IGetValueNode<ValueType[]>, Workflo.PageNode.ISetValueNode<ValueType[] | ValueType> {
    readonly currently: ValuePageElementListCurrently<Store, PageElementType, PageElementOptions, this, ValueType>;
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
declare class ValuePageElementListCurrently<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementListCurrently<Store, PageElementType, PageElementOptions, ListType> implements Workflo.PageNode.IGetValue<ValueType[]> {
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
    not: {
        hasValue: (value: ValueType | ValueType[]) => boolean;
        hasAnyValue: () => boolean;
        containsValue: (value: ValueType | ValueType[]) => boolean;
        isEmpty: () => boolean;
        hasLength: (length: number, comparator?: Workflo.Comparator) => boolean;
        hasText: (text: string | string[]) => boolean;
        hasAnyText: () => boolean;
        containsText: (text: string | string[]) => boolean;
    };
}
declare class ValuePageElementListEventually<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOptions extends Partial<IValuePageElementOpts<Store>>, ListType extends ValuePageElementList<Store, PageElementType, PageElementOptions, ValueType>, ValueType> extends PageElementListEventually<Store, PageElementType, PageElementOptions, ListType> {
    hasValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyValue(opts?: Workflo.IWDIOParamsOptional): boolean;
    containsValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional): boolean;
    not: {
        hasValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsValue: (value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsOptional) => boolean;
        isEmpty: (opts: import("./PageElementList").IPageElementListWaitEmptyParams) => boolean;
        hasLength: (length: number, opts: import("./PageElementList").IPageElementListWaitLengthParams) => boolean;
        hasText: (text: string | string[], opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsText: (text: string | string[], opts?: Workflo.IWDIOParamsOptional) => boolean;
    };
}
export {};
