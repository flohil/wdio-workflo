import { PageElementStore } from '../stores';
export declare type ExtractText<T extends {
    [key: string]: Workflo.PageNode.INode;
}> = {
    [P in keyof T]: T[P] extends Workflo.PageNode.IGetTextNode<any> ? ReturnType<T[P]['getText']> : undefined;
};
export declare type FilterMaskText<T extends {
    [key: string]: Workflo.PageNode.INode;
}> = {
    [P in keyof T]: T[P] extends Workflo.PageNode.IGetTextNode<any> ? boolean : undefined;
};
export interface IPageElementGroupOpts<Content extends {
    [key: string]: Workflo.PageNode.INode;
}> {
    id: string;
    content: Content;
}
export declare class PageElementGroup<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}> implements Workflo.PageNode.IGetTextNode<ExtractText<Partial<Content>>> {
    protected _id: string;
    protected _$: Content;
    protected _lastDiff: Workflo.PageNode.IDiff;
    readonly currently: PageElementGroupCurrently<Store, Content, this>;
    readonly eventually: PageElementGroupEventually<Store, Content, this>;
    constructor({ id, content }: IPageElementGroupOpts<Content>);
    readonly $: Content;
    readonly __lastDiff: Workflo.PageNode.IDiff;
    __toJSON(): Workflo.PageNode.IElementJSON;
    __getNodeId(): string;
    getText(filterMask?: FilterMaskText<Partial<Content>>): ExtractText<Partial<Content>>;
    __compareText<K extends string>(compareFunc: (node: Workflo.PageNode.IGetTextNode<any>, expected?: Content[K]) => boolean, expected?: ExtractText<Partial<Content>>): boolean;
}
export declare class PageElementGroupCurrently<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends PageElementGroup<Store, Content>> implements Workflo.PageNode.IGetText<ExtractText<Partial<Content>>>, Workflo.PageNode.ICheckTextCurrently<ExtractText<Partial<Content>>> {
    protected readonly _node: GroupType;
    constructor(node: GroupType);
    getText(filterMask?: FilterMaskText<Partial<Content>>): ExtractText<Partial<Content>>;
    hasText(text: ExtractText<Partial<Content>>): boolean;
    hasAnyText(): boolean;
    containsText(text: ExtractText<Partial<Content>>): boolean;
    not: {
        hasText: (text: ExtractText<Partial<Content>>) => boolean;
        hasAnyText: () => boolean;
        containsText: (text: ExtractText<Partial<Content>>) => boolean;
    };
}
export declare class PageElementGroupEventually<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends PageElementGroup<Store, Content>> implements Workflo.PageNode.ICheckTextEventually<ExtractText<Partial<Content>>> {
    protected readonly _node: GroupType;
    constructor(node: GroupType);
    hasText(text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional): boolean;
    hasAnyText(opts?: Workflo.IWDIOParamsOptional): boolean;
    containsText(text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional): boolean;
    not: {
        hasText: (text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsOptional) => boolean;
        containsText: (text: ExtractText<Partial<Content>>, opts?: Workflo.IWDIOParamsOptional) => boolean;
    };
}
