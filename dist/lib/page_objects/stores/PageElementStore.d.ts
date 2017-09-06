import { PageElement, IPageElementOpts, PageElementList, IPageElementListOpts, PageElementMap, IPageElementMapOpts, PageElementGroup, IPageElementGroupOpts, TextGroup, ValueGroup } from '../page_elements';
import { PageElementGroupWalker, IPageElementGroupWalkerOpts } from '../walkers';
import { XPathBuilder } from '../builders';
export declare class PageElementStore {
    protected instanceCache: {
        [id: string]: any;
    };
    protected xPathBuilder: XPathBuilder;
    constructor();
    ElementGroup<Content extends {
        [key: string]: Workflo.PageNode.INode;
    }>(content: Content): Content & PageElementGroup<this, Content, PageElementGroupWalker<this>, IPageElementGroupWalkerOpts>;
    TextGroup<Content extends {
        [key: string]: Workflo.PageNode.INode;
    }>(content: Content): Content & TextGroup<this, Content, PageElementGroupWalker<this>, IPageElementGroupWalkerOpts>;
    ValueGroup<Content extends {
        [key: string]: Workflo.PageNode.INode;
    }>(content: Content): Content & ValueGroup<this, Content, PageElementGroupWalker<this>, IPageElementGroupWalkerOpts>;
    /**
     *
     * @param selector
     * @param options
     */
    Element(selector: Workflo.XPath, options?: Pick<IPageElementOpts<this>, "timeout" | "wait">): PageElement<this>;
    ExistElement(selector: Workflo.XPath, options?: Pick<IPageElementOpts<this>, "timeout">): PageElement<this>;
    ElementList(selector: Workflo.XPath, options?: Pick<IPageElementListOpts<this, PageElement<this>, IPageElementOpts<this>>, "wait" | "timeout" | "elementOptions" | "disableCache" | "identifier">): PageElementList<this, PageElement<this>, IPageElementOpts<this>>;
    ExistElementList(selector: Workflo.XPath, options?: Pick<IPageElementListOpts<this, PageElement<this>, IPageElementOpts<this>>, "timeout" | "elementOptions" | "disableCache" | "identifier">): PageElementList<this, PageElement<this>, IPageElementOpts<this>>;
    ElementMap<K extends string>(selector: Workflo.XPath, options: Pick<IPageElementMapOpts<this, K, PageElement<this>, IPageElementOpts<this>>, "elementOptions" | "identifier">): PageElementMap<this, K, PageElement<this>, IPageElementOpts<this>>;
    /**
     * Returns a page element with the given selector, type and options.
     *
     * If a page element with identical parameters already exists in this store,
     * a cached instance of this page element will be returned.
     *
     * @param selector
     * @param type
     * @param options
     */
    protected get<O, T>(selector: Workflo.XPath, type: {
        new (selector: string, options: O): T;
    }, options?: O): T;
    protected getGroup<Store extends PageElementStore, Content extends {
        [key: string]: Workflo.PageNode.INode;
    }, WalkerType extends PageElementGroupWalker<Store>, WalkerOptions extends IPageElementGroupWalkerOpts, GroupType extends PageElementGroup<Store, Content, WalkerType, WalkerOptions>, GroupOptions extends Pick<IPageElementGroupOpts<Store, Content, WalkerType, WalkerOptions>, "content" | "walkerType" | "walkerOptions">>(groupType: {
        new (options: IPageElementGroupOpts<Store, Content, WalkerType, WalkerOptions>): GroupType;
    }, groupOptions: GroupOptions): Content & GroupType;
}
