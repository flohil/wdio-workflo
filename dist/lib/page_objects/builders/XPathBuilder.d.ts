export declare class XPathBuilder {
    private static _instance;
    private _selector;
    static getInstance(): XPathBuilder;
    private SelectorBuilder;
    reset(selector: string): this;
    /**
     * Appends plain xPath string to current selector.
     * @param appendedSelector
     */
    append(appendedSelector: string): this;
    /**
     * Adds plain xPath constraint to current selector.
     * @param constraintSelector
     * @param builderFunc optional -> can be used to apply XPathSelector API to constraintSelector
     */
    constraint(constraintSelector: string, builderFunc?: (xpath: XPathBuilder) => XPathBuilder): this;
    /**
     * Restrict current selector to elements which have at least one child defined by childSelector.
     * Calls constraint() but adds a '.' to the beginning of the constraint to select only child elements.
     * @param childSelector
     * @param builderFunc optional -> can be used to apply XPathSelector API to childrenSelector
     */
    child(childSelector: string, builderFunc?: (xpath: XPathBuilder) => XPathBuilder): this;
    text(text: string): this;
    textContains(text: string): this;
    attribute(key: string, value: string): this;
    attributeContains(key: string, value: string): this;
    id(value: string): this;
    idContains(value: string): this;
    class(value: string): this;
    classContains(value: string): this;
    name(value: string): this;
    nameContains(value: string): this;
    /**
     * Finds element by index of accurence on a single "level" of the DOM.
     * Eg.: If index === 3, there must be 3 siblings on the same DOM level that match the current selector
     * and the third one will be selected.
     * @param index starts at 1
     */
    levelIndex(index: number): this;
    /**
     * Finds element by index of accurence accross all "levels/depths" of the DOM.
     * @param index starts at 1
     */
    index(index: number): this;
    build(): string;
}
