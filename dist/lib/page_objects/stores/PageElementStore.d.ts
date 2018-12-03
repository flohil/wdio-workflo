import { PageElement, IPageElementOpts, PageElementList, IPageElementListOpts, PageElementMap, IPageElementMapOpts, PageElementGroup, IPageElementGroupOpts, ValuePageElementGroup, ValuePageElement, IValuePageElementOpts, IValuePageElementListOpts, ValuePageElementList } from '../page_elements';
import { XPathBuilder } from '../builders';
import { IValuePageElementMapOpts, ValuePageElementMap } from '../page_elements/ValuePageElementMap';
export declare type CloneFunc<Type> = (selector?: Workflo.XPath) => Type;
export declare class PageElementStore {
    protected _instanceCache: {
        [id: string]: any;
    };
    protected _xPathBuilder: XPathBuilder;
    constructor();
    ElementGroup<Content extends Record<string, Workflo.PageNode.INode>>(content: Content): PageElementGroup<this, Content>;
    ValueGroup<Content extends Record<string, Workflo.PageNode.INode>>(content: Content): ValuePageElementGroup<this, Content>;
    /**
     *
     * @param selector
     * @param options
     */
    Element(selector: Workflo.XPath, options?: Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>): PageElement<this>;
    ExistElement(selector: Workflo.XPath, options?: Pick<IPageElementOpts<this>, Exclude<Workflo.Store.ElementPublicKeys, "waitType">>): PageElement<this>;
    protected List<PageElementType extends PageElement<this>, PageElementOpts extends Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>>(selector: Workflo.XPath, options: Pick<IPageElementListOpts<this, PageElementType, PageElementOpts>, Workflo.Store.ListConstructorKeys>): PageElementList<this, PageElementType, PageElementOpts>;
    protected ValueList<PageElementType extends ValuePageElement<this, ReturnType<PageElementType['getValue']>>, PageElementOpts extends Pick<IValuePageElementOpts<this>, Workflo.Store.ElementPublicKeys>>(selector: Workflo.XPath, options: Pick<IValuePageElementListOpts<this, PageElementType, PageElementOpts, ReturnType<PageElementType['getValue']>>, Workflo.Store.ListConstructorKeys>): ValuePageElementList<this, PageElementType, PageElementOpts, ReturnType<PageElementType["getValue"]>>;
    ElementList(selector: Workflo.XPath, options?: PickPartial<IPageElementListOpts<this, PageElement<this>, Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>>, Workflo.Store.ListPublicKeys, Workflo.Store.ListPublicPartialKeys>): PageElementList<this, PageElement<this>, Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>>;
    ExistElementList(selector: Workflo.XPath, options?: PickPartial<IPageElementListOpts<this, PageElement<this>, Pick<IPageElementOpts<this>, "timeout">>, Exclude<Workflo.Store.ListPublicKeys, "waitType">, Workflo.Store.ListPublicPartialKeys>): PageElementList<this, PageElement<this>, {}>;
    protected Map<K extends string, PageElementType extends PageElement<this>, PageElementOpts extends Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>>(selector: Workflo.XPath, options: Pick<IPageElementMapOpts<this, K, PageElementType, PageElementOpts>, Workflo.Store.MapConstructorKeys>): PageElementMap<this, K, PageElementType, PageElementOpts>;
    protected ValueMap<K extends string, PageElementType extends ValuePageElement<this, ReturnType<PageElementType["getValue"]>>, PageElementOpts extends Pick<IValuePageElementOpts<this>, Workflo.Store.ElementPublicKeys>>(selector: Workflo.XPath, options: Pick<IValuePageElementMapOpts<this, K, PageElementType, PageElementOpts, ReturnType<PageElementType["getValue"]>>, Workflo.Store.MapConstructorKeys>): ValuePageElementMap<this, K, PageElementType, PageElementOpts, ReturnType<PageElementType["getValue"]>>;
    ElementMap<K extends string>(selector: Workflo.XPath, options: PickPartial<IPageElementMapOpts<this, K, PageElement<this>, Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>>, Workflo.Store.MapPublicKeys, Workflo.Store.MapPublicPartialKeys>): PageElementMap<this, K, PageElement<this>, Pick<IPageElementOpts<this>, Workflo.Store.ElementPublicKeys>>;
    ExistElementMap<K extends string>(selector: Workflo.XPath, options: PickPartial<IPageElementMapOpts<this, K, PageElement<this>, Pick<IPageElementOpts<this>, Exclude<Workflo.Store.ElementPublicKeys, "waitType">>>, Workflo.Store.MapPublicKeys, Workflo.Store.MapPublicPartialKeys>): PageElementMap<this, K, PageElement<this>, Pick<IPageElementOpts<this>, "timeout" | "customScroll">>;
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
    private _get;
    protected _getElement<ElementType extends PageElement<this>, ElementOptions>(selector: Workflo.XPath, type: {
        new (selector: string, options: ElementOptions): ElementType;
    }, options?: ElementOptions): ElementType;
    protected _getList<ListType extends PageElementList<this, any, any>, ListOptions>(selector: Workflo.XPath, type: {
        new (selector: string, options: ListOptions): ListType;
    }, options?: ListOptions): ListType;
    protected _getMap<K extends string, MapType extends PageElementMap<this, K, any, any>, MapOptions extends IPageElementMapOpts<this, K, any, any>>(selector: Workflo.XPath, type: {
        new (selector: string, options: MapOptions): MapType;
    }, options?: MapOptions): MapType;
    protected _getGroup<Store extends PageElementStore, Content extends {
        [key: string]: Workflo.PageNode.INode;
    }, GroupType extends PageElementGroup<Store, Content>, GroupOptions extends Pick<IPageElementGroupOpts<Content>, "content">>(groupType: {
        new (options: IPageElementGroupOpts<Content>): GroupType;
    }, groupOptions: GroupOptions): GroupType;
}
