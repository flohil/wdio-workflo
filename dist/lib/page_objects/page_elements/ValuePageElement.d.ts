import { PageElement, IPageElementOpts, PageElementCurrently, PageElementWait, PageElementEventually } from './PageElement';
import { PageElementStore } from '../stores';
export interface IValuePageElementOpts<Store extends PageElementStore> extends IPageElementOpts<Store> {
}
export declare abstract class ValuePageElement<Store extends PageElementStore, ValueType> extends PageElement<Store> implements Workflo.PageNode.IValueElementNode<ValueType> {
    abstract readonly currently: ValuePageElementCurrently<Store, this, ValueType>;
    readonly wait: ValuePageElementWait<Store, this, ValueType>;
    readonly eventually: ValuePageElementEventually<Store, this, ValueType>;
    constructor(selector: string, opts: IPageElementOpts<Store>);
    initialWait(): this;
    getValue(): ValueType;
    setValue(value: ValueType): this;
}
export declare abstract class ValuePageElementCurrently<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, ValueType> extends PageElementCurrently<Store, PageElementType> {
    abstract getValue(): ValueType;
    abstract setValue(value: ValueType): PageElementType;
    hasValue(value: ValueType): boolean;
    hasAnyValue(): boolean;
    containsValue(value: ValueType): any;
    not: {
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
        hasAttribute: (attributeName: string, attributeValue: string) => boolean;
        hasAnyAttribute: (attributeName: string) => boolean;
        containsAttribute: (attributeName: string, attributeValue: string) => boolean;
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
    hasValue(value: ValueType, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    hasAnyValue(opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    containsValue(value: ValueType, opts?: Workflo.IWDIOParamsOptionalReverse): PageElementType;
    not: {
        hasValue: (value: ValueType, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsValue: (value: ValueType, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        exists: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        isVisible: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        isEnabled: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        isSelected: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        isChecked: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasText: (text: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsText: (text: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyHTML: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyClass: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasId: (id: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyId: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsId: (id: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasName: (name: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasAnyName: (opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        containsName: (name: string, opts?: Workflo.IWDIOParamsOptional) => PageElementType;
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.IWDIOParamsOptional) => PageElementType;
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => PageElementType;
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => PageElementType;
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.IWDIOParamsOptional) => PageElementType;
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => PageElementType;
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => PageElementType;
    };
}
export declare class ValuePageElementEventually<Store extends PageElementStore, PageElementType extends ValuePageElement<Store, ValueType>, ValueType> extends PageElementEventually<Store, PageElementType> {
    hasValue(value: ValueType, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyValue(opts?: Workflo.IWDIOParamsOptional): boolean;
    containsValue(value: ValueType, opts?: Workflo.IWDIOParamsOptional): boolean;
    not: {
        hasValue: (value: ValueType, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyValue: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsValue: (value: ValueType, opts?: Workflo.IWDIOParamsOptional) => boolean;
        exists: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        isVisible: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        isEnabled: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        isSelected: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        isChecked: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasText: (text: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsText: (text: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyHTML: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsHTML: (html: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsDirectText: (directText: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyAttribute: (attributeName: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsAttribute: (attributeName: string, attributeValue: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyClass: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsClass: (className: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasId: (id: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyId: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsId: (id: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasName: (name: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyName: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsName: (name: string, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasLocation: (coordinates: Workflo.ICoordinates, opts?: {
            tolerances?: Partial<Workflo.ICoordinates>;
        } & Workflo.IWDIOParamsOptional) => boolean;
        hasX: (x: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => boolean;
        hasY: (y: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => boolean;
        hasSize: (size: Workflo.ISize, opts?: {
            tolerances?: Partial<Workflo.ISize>;
        } & Workflo.IWDIOParamsOptional) => boolean;
        hasWidth: (width: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => boolean;
        hasHeight: (height: number, opts?: {
            tolerance?: number;
        } & Workflo.IWDIOParamsOptional) => boolean;
    };
}
