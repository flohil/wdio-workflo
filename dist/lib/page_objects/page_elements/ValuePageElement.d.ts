import { PageElement, IPageElementOpts, PageElementCurrently, PageElementWait, PageElementEventually } from './PageElement';
import { PageElementStore } from '../stores';
export interface IValuePageElementOpts<Store extends PageElementStore> extends IPageElementOpts<Store> {
}
export declare abstract class ValuePageElement<Store extends PageElementStore, ValueType> extends PageElement<Store> implements Workflo.PageNode.IValueElementNode<ValueType, boolean> {
    readonly abstract currently: ValuePageElementCurrently<Store, this, ValueType>;
    readonly wait: ValuePageElementWait<Store, this, ValueType>;
    readonly eventually: ValuePageElementEventually<Store, this, ValueType>;
    constructor(selector: string, opts: IPageElementOpts<Store>);
    /**
     * Sets the value of this PageElement.
     *
     * @param value
     */
    abstract setValue(value: ValueType): this;
    initialWait(): this;
    getValue(): ValueType;
    getHasValue(value: ValueType): boolean;
    getHasAnyValue(): boolean;
    getContainsValue(value: ValueType): boolean;
}
export declare abstract class ValuePageElementCurrently<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, ValueType> extends PageElementCurrently<Store, PageElementType> {
    abstract getValue(): ValueType;
    getHasValue(value: ValueType): boolean;
    getHasAnyValue(): boolean;
    getContainsValue(value: ValueType): boolean;
    hasValue(value: ValueType): boolean;
    hasAnyValue(): boolean;
    containsValue(value: ValueType): boolean;
    readonly not: {
        hasValue: (value: ValueType) => boolean;
        hasAnyValue: () => boolean;
        containsValue: (value: ValueType) => boolean;
        exists: () => boolean;
        isVisible: () => boolean;
        isEnabled: () => boolean;
        isSelected: () => boolean;
        isChecked: () => boolean;
        hasText: (text: string) => boolean;
        hasAnyText: () => boolean;
        containsText: (text: string) => boolean;
        hasDirectText: (directText: string) => boolean;
        hasAnyDirectText: () => boolean;
        containsDirectText: (directText: string) => boolean;
        hasAttribute: (attribute: Workflo.IAttribute) => boolean;
        hasAnyAttribute: (attributeName: string) => boolean;
        containsAttribute: (attribute: Workflo.IAttribute) => boolean;
        hasHTML: (html: string) => boolean;
        hasAnyHTML: () => boolean;
        containsHTML: (html: string) => boolean;
        hasClass: (className: string) => boolean;
        hasAnyClass: () => boolean;
        containsClass: (className: string) => boolean;
        hasId: (id: string) => boolean;
        hasAnyId: () => boolean;
        containsId: (id: string) => boolean;
        hasName: (name: string) => boolean;
        hasAnyName: () => boolean;
        containsName: (name: string) => boolean;
        hasLocation: (coordinates: Workflo.ICoordinates, tolerances?: Partial<Workflo.ICoordinates>) => boolean;
        hasX: (x: number, tolerance?: number) => boolean;
        hasY: (y: number, tolerance?: number) => boolean;
        hasSize: (size: Workflo.ISize, tolerances?: Partial<Workflo.ISize>) => boolean;
        hasWidth: (width: number, tolerance?: number) => boolean;
        hasHeight: (height: number, tolerance?: number) => boolean;
    };
}
export declare class ValuePageElementWait<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, ValueType> extends PageElementWait<Store, PageElementType> {
    hasValue(value: ValueType, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    hasAnyValue(opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    containsValue(value: ValueType, opts?: Workflo.IWDIOParamsReverseInterval): PageElementType;
    readonly not: {
        hasValue: (value: ValueType, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyValue: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsValue: (value: ValueType, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        exists: (opts?: Workflo.IWDIOParams) => PageElementType;
        isVisible: (opts?: Workflo.IWDIOParams) => PageElementType;
        isEnabled: (opts?: Workflo.IWDIOParams) => PageElementType;
        isSelected: (opts?: Workflo.IWDIOParams) => PageElementType;
        isChecked: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasText: (text: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsText: (text: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasHTML: (html: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyHTML: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsHTML: (html: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasClass: (className: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyClass: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsClass: (className: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasId: (id: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyId: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsId: (id: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasName: (name: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasAnyName: (opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        containsName: (name: string, opts?: Workflo.IWDIOParamsInterval) => PageElementType;
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.IWDIOParamsInterval) => PageElementType;
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => PageElementType;
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => PageElementType;
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.IWDIOParamsInterval) => PageElementType;
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => PageElementType;
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => PageElementType;
    };
}
export declare class ValuePageElementEventually<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, ValueType> extends PageElementEventually<Store, PageElementType> {
    hasValue(value: ValueType, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyValue(opts?: Workflo.IWDIOParamsInterval): boolean;
    containsValue(value: ValueType, opts?: Workflo.IWDIOParamsInterval): boolean;
    readonly not: {
        hasValue: (value: ValueType, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyValue: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsValue: (value: ValueType, opts?: Workflo.IWDIOParamsInterval) => boolean;
        exists: (opts?: Workflo.IWDIOParams) => boolean;
        isVisible: (opts?: Workflo.IWDIOParams) => boolean;
        isEnabled: (opts?: Workflo.IWDIOParams) => boolean;
        isSelected: (opts?: Workflo.IWDIOParams) => boolean;
        isChecked: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasText: (text: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsText: (text: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasHTML: (html: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyHTML: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsHTML: (html: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasClass: (className: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyClass: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsClass: (className: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasId: (id: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyId: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsId: (id: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasName: (name: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyName: (opts?: Workflo.IWDIOParamsInterval) => boolean;
        containsName: (name: string, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.IWDIOParamsInterval) => boolean;
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => boolean;
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => boolean;
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.IWDIOParamsInterval) => boolean;
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => boolean;
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsInterval) => boolean;
    };
}
