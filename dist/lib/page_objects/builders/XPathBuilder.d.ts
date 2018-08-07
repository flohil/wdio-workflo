export declare class XPathBuilder {
    private static instance;
    private _selector;
    static getInstance(): XPathBuilder;
    private SelectorBuilder;
    reset(selector: string): this;
    append(selector: string): this;
    constraint(constraint: string): this;
    text(text: string): this;
    containedText(text: string): this;
    attr(key: string, value: string): this;
    containedAttr(key: string, value: string): this;
    level(level: number): this;
    id(value: string): this;
    class(value: string): this;
    containedClass(value: string): this;
    build(): string;
}
