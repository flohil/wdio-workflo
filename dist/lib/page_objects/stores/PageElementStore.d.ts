import { PageElement, IPageElementOpts, PageElementList, IPageElementListOpts, PageElementMap, IPageElementMapOpts, PageElementGroup, IPageElementGroupOpts, TextGroup, ValueGroup } from '../page_elements';
import { PageElementGroupWalker, IPageElementGroupWalkerOpts } from '../walkers';
import { XPathBuilder } from '../builders';
export declare class PageElementStore {
    protected instanceCache: {
        [id: string]: any;
    };
    protected xPathBuilder: XPathBuilder;
    constructor();
    ElementGroup<Content extends Record<string, Workflo.PageNode.INode>>(content: Content): Content & PageElementGroup<this, Content, PageElementGroupWalker<this>, IPageElementGroupWalkerOpts>;
    TextGroup<Content extends Record<string, Workflo.PageNode.INode>>(content: Content): Content & TextGroup<this, Content, PageElementGroupWalker<this>, IPageElementGroupWalkerOpts>;
    ValueGroup<Content extends Record<string, Workflo.PageNode.INode>>(content: Content): Content & ValueGroup<this, Content, PageElementGroupWalker<this>, IPageElementGroupWalkerOpts>;
    /**
     *
     * @param selector
     * @param options
     */
    Element(selector: Workflo.XPath, options?: Pick<IPageElementOpts<this>, Workflo.PageElementOptions>): PageElement<this>;
    ExistElement(selector: Workflo.XPath, options?: Pick<IPageElementOpts<this>, "timeout" | "customScroll">): PageElement<this>;
    protected List<PageElementType extends PageElement<this>, PageElementOpts extends Pick<IPageElementOpts<this>, 'timeout' | 'wait'>>(selector: Workflo.XPath, options: Pick<IPageElementListOpts<this, PageElementType, PageElementOpts>, "wait" | "timeout" | "elementStoreFunc" | "elementOptions" | "disableCache" | "identifier">): PageElementList<this, PageElementType, PageElementOpts>;
    ElementList(selector: Workflo.XPath, options?: PickPartial<IPageElementListOpts<this, PageElement<this>, Pick<IPageElementOpts<this>, "timeout" | "wait">>, "wait" | "timeout" | "disableCache" | "identifier", "elementOptions">): PageElementList<this, PageElement<this>, {}>;
    ExistElementList(selector: Workflo.XPath, options?: PickPartial<IPageElementListOpts<this, PageElement<this>, Pick<IPageElementOpts<this>, "timeout">>, "timeout" | "disableCache" | "identifier", "elementOptions">): PageElementList<this, PageElement<this>, {}>;
    protected Map<K extends string, PageElementType extends PageElement<this>, PageElementOpts extends Pick<IPageElementOpts<this>, 'timeout' | 'wait'>>(selector: Workflo.XPath, options: Pick<IPageElementMapOpts<this, K, PageElementType, PageElementOpts>, "elementOptions" | "identifier" | "elementStoreFunc">): PageElementMap<this, K, PageElementType, PageElementOpts>;
    ElementMap<K extends string>(selector: Workflo.XPath, options: PickPartial<IPageElementMapOpts<this, K, PageElement<this>, Pick<IPageElementOpts<this>, 'timeout' | 'wait'>>, "identifier", "elementOptions">): PageElementMap<this, K, PageElement<this>, {}>;
    ExistElementMap<K extends string>(selector: Workflo.XPath, options: PickPartial<IPageElementMapOpts<this, K, PageElement<this>, Pick<IPageElementOpts<this>, 'timeout'>>, "identifier", "elementOptions">): PageElementMap<this, K, PageElement<this>, {}>;
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
    protected get<Type, Options>(selector: Workflo.XPath, type: {
        new (selector: string, options: Options): Type;
    }, options?: Options): Type;
    protected getGroup<Store extends PageElementStore, Content extends {
        [key: string]: Workflo.PageNode.INode;
    }, WalkerType extends PageElementGroupWalker<Store>, WalkerOptions extends IPageElementGroupWalkerOpts, GroupType extends PageElementGroup<Store, Content, WalkerType, WalkerOptions>, GroupOptions extends Pick<IPageElementGroupOpts<Store, Content, WalkerType, WalkerOptions>, "content" | "walkerType" | "walkerOptions">>(groupType: {
        new (options: IPageElementGroupOpts<Store, Content, WalkerType, WalkerOptions>): GroupType;
    }, groupOptions: GroupOptions): Content & GroupType;
}
