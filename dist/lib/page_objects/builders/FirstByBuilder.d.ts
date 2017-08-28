export interface IFirstByBuilderOpts<Store extends Workflo.IPageElementStore, PageElementType extends Workflo.IPageElement<Store>, PageElementOptions> {
    store: Store;
    elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType;
    elementOptions: PageElementOptions;
}
export declare class FirstByBuilder<Store extends Workflo.IPageElementStore, PageElementType extends Workflo.IPageElement<Store>, PageElementOptions> {
    private selector;
    private store;
    private elementStoreFunc;
    private elementOptions;
    private xPathBuilder;
    constructor(selector: string, options: IFirstByBuilderOpts<Store, PageElementType, PageElementOptions>);
    reset(): this;
    constraint(constraint: string): this;
    text(text: string): this;
    containedText(text: string): this;
    attr(key: string, value: string): this;
    containedAttr(key: string, value: string): this;
    level(level: number): this;
    id(value: string): this;
    class(value: string): this;
    containedClass(value: string): this;
    get(): PageElementType;
}
