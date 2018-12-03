import { PageElementStore } from '../stores';
export declare type ExtractText<T extends {
    [key: string]: Workflo.PageNode.INode;
}> = {
    [P in keyof T]: T[P] extends Workflo.PageNode.IGetTextNode<any> ? ReturnType<T[P]['getText']> : undefined;
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
    readonly currently: PageElementGroupCurrently<Store, Content, this>;
    constructor({ id, content }: IPageElementGroupOpts<Content>);
    readonly $: Content;
    __toJSON(): Workflo.PageNode.IElementJSON;
    __getNodeId(): string;
    getText(filter?: ExtractText<Partial<Content>>): ExtractText<Partial<Content>>;
}
export declare class PageElementGroupCurrently<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends PageElementGroup<Store, Content>> implements Workflo.PageNode.IGetText<ExtractText<Partial<Content>>> {
    protected readonly _node: GroupType;
    constructor(node: GroupType);
    getText(filter?: ExtractText<Partial<Content>>): ExtractText<Partial<Content>>;
}
