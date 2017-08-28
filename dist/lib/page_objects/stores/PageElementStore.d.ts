import { PageElementGroup, IPageElementGroupOpts, PageElement, IPageElementOpts, PageElementList, IPageElementListOpts } from '../page_elements';
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
    /**
     *
     * @param selector
     * @param options
     */
    Element(selector: Workflo.XPath, options?: Pick<IPageElementOpts<this>, "timeout" | "wait">): PageElement<this>;
    ExistElement(selector: Workflo.XPath, options?: Pick<IPageElementOpts<this>, "timeout">): PageElement<this>;
    ElementList(selector: Workflo.XPath, options?: Pick<IPageElementListOpts<this, PageElement<this>, IPageElementOpts<this>>, "wait" | "timeout" | "elementOptions" | "disableCache" | "identifier">): PageElementList<this, PageElement<this>, IPageElementOpts<this>>;
    ExistElementList(selector: Workflo.XPath, options?: Pick<IPageElementListOpts<this, PageElement<this>, IPageElementOpts<this>>, "timeout" | "elementOptions" | "disableCache" | "identifier">): PageElementList<this, PageElement<this>, IPageElementOpts<this>>;
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
    protected getGroup<Store extends Workflo.IPageElementStore, Content extends {
        [key: string]: Workflo.PageNode.INode;
    }, WalkerType extends Workflo.IPageElementGroupWalker<Store>, WalkerOptions extends IPageElementGroupWalkerOpts, GroupType extends Workflo.IPageElementGroup<Store, Content, WalkerType, WalkerOptions>, GroupOptions extends Pick<IPageElementGroupOpts<Store, Content, WalkerType, WalkerOptions>, "content" | "walkerType" | "walkerOptions">>(groupType: {
        new (options: IPageElementGroupOpts<Store, Content, WalkerType, WalkerOptions>): GroupType;
    }, groupOptions: GroupOptions): Content & GroupType;
}
