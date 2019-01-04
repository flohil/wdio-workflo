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
    hasValue(value: ValueType, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    hasAnyValue(opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    containsValue(value: ValueType, opts?: Workflo.ITimeoutReverseInterval): PageElementType;
    readonly not: {
        hasValue: (value: ValueType, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyValue: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsValue: (value: ValueType, opts?: Workflo.ITimeoutInterval) => PageElementType;
        exists: (opts?: Workflo.ITimeout) => PageElementType;
        isVisible: (opts?: Workflo.ITimeout) => PageElementType;
        isEnabled: (opts?: Workflo.ITimeout) => PageElementType;
        isSelected: (opts?: Workflo.ITimeout) => PageElementType;
        isChecked: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasText: (text: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyText: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsText: (text: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasHTML: (html: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyHTML: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsHTML: (html: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyAttribute: (attributeName: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasClass: (className: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyClass: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsClass: (className: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasId: (id: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyId: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsId: (id: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasName: (name: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasAnyName: (opts?: Workflo.ITimeoutInterval) => PageElementType;
        containsName: (name: string, opts?: Workflo.ITimeoutInterval) => PageElementType;
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => PageElementType;
    };
}
export declare class ValuePageElementEventually<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, ValueType> extends PageElementEventually<Store, PageElementType> {
    hasValue(value: ValueType, opts?: Workflo.ITimeoutInterval): boolean;
    hasAnyValue(opts?: Workflo.ITimeoutInterval): boolean;
    containsValue(value: ValueType, opts?: Workflo.ITimeoutInterval): boolean;
    readonly not: {
        hasValue: (value: ValueType, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyValue: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsValue: (value: ValueType, opts?: Workflo.ITimeoutInterval) => boolean;
        exists: (opts?: Workflo.ITimeout) => boolean;
        isVisible: (opts?: Workflo.ITimeout) => boolean;
        isEnabled: (opts?: Workflo.ITimeout) => boolean;
        isSelected: (opts?: Workflo.ITimeout) => boolean;
        isChecked: (opts?: Workflo.ITimeoutInterval) => boolean;
        hasText: (text: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyText: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsText: (text: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasHTML: (html: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyHTML: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsHTML: (html: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsDirectText: (directText: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyAttribute: (attributeName: string, opts?: Workflo.ITimeoutInterval) => boolean;
        containsAttribute: (attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval) => boolean;
        hasClass: (className: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyClass: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsClass: (className: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasId: (id: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyId: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsId: (id: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasName: (name: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyName: (opts?: Workflo.ITimeoutInterval) => boolean;
        containsName: (name: string, opts?: Workflo.ITimeoutInterval) => boolean;
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.ITimeoutInterval) => boolean;
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.ITimeoutInterval) => boolean;
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.ITimeoutInterval) => boolean;
    };
}
