import { InstallOpts, StartOpts  } from 'selenium-standalone'
import { DesiredCapabilities, Options, Suite, Test, Client, RawResult, Element } from 'webdriverio'

import { IAnalysedCriteria, IExecutionFilters, IParseResults, ITraceInfo } from './lib/cli'
import * as pageObjects from './lib/page_objects'
import * as helpers from './lib/helpers'
import { IPageElementListWaitLengthParams } from './lib/page_objects/page_elements/PageElementList'

/**
 * This interface describes custom expectation matchers for PageElements.
 *
 * It can be used for both positive and negative (.not) comparisons.
 */
interface ICustomElementMatchers {
  toExist(): boolean
  toBeVisible(): boolean
  toBeEnabled(): boolean
  toBeSelected(): boolean
  toBeChecked(): boolean
  toHaveText(text: string): boolean
  toHaveAnyText(): boolean
  toContainText(text: string): boolean
  toHaveHTML(html: string): boolean
  toHaveAnyHTML(): boolean
  toContainHTML(html: string): boolean
  toHaveDirectText(directText: string): boolean
  toHaveAnyDirectText(): boolean
  toContainDirectText(directText: string): boolean
  toHaveAttribute(attribute: Workflo.IAttribute): boolean
  toHaveAnyAttribute(attributeName: string): boolean
  toContainAttribute(attribute: Workflo.IAttribute): boolean
  toHaveClass(className: string): boolean
  toHaveAnyClass(): boolean
  toContainClass(className: string): boolean
  toHaveId(id: string): boolean
  toHaveAnyId(): boolean
  toContainId(id: string): boolean
  toHaveName(name: string): boolean
  toHaveAnyName(): boolean
  toContainName(name: string): boolean
  toHaveLocation(
    coordinates: Workflo.ICoordinates,
    tolerances?: Partial<Workflo.ICoordinates>
  ): boolean
  toHaveX(x: number, tolerance?: number): boolean
  toHaveY(y: number, tolerance?: number): boolean
  toHaveSize(
    size: Workflo.ISize,
    tolerances?: Partial<Workflo.ISize>
  ): boolean
  toHaveWidth(width: number, tolerance?: number): boolean,
  toHaveHeight(height: number, tolerance?: number): boolean,

  toEventuallyExist(opts?: Workflo.IWDIOParams): boolean
  toEventuallyBeVisible(opts?: Workflo.IWDIOParams): boolean
  toEventuallyBeEnabled(opts?: Workflo.IWDIOParams): boolean
  toEventuallyBeSelected(opts?: Workflo.IWDIOParams): boolean
  toEventuallyBeChecked(opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveText(text: string, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyText(opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyContainText(text: string, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveHTML(html: string, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyHTML(opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyContainHTML(html: string, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveDirectText(directText: string, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyDirectText(opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyContainDirectText(directText: string, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAttribute(attribute: Workflo.IAttribute, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyAttribute(attributeName: string, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyContainAttribute(attribute: Workflo.IAttribute, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveClass(className: string, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyClass(opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyContainClass(className: string, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveId(id: string, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyId(opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyContainId(id: string, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveName(name: string, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyName(opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyContainName(name: string, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveLocation(
    coordinates: Workflo.ICoordinates,
    opts?: {tolerances?: Partial<Workflo.ICoordinates>} & Workflo.IWDIOParamsInterval
  ): boolean
  toEventuallyHaveX(x: number, opts?: {tolerance?: number} & Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveY(y: number, opts?: {tolerance?: number} & Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveSize(
    size: Workflo.ISize,
    opts?: { tolerances?: Partial<Workflo.ISize> } & Workflo.IWDIOParamsInterval
  ): boolean
  toEventuallyHaveWidth(width: number, opts?: {tolerance?: number} & Workflo.IWDIOParamsInterval): boolean,
  toEventuallyHaveHeight(height: number, opts?: {tolerance?: number} & Workflo.IWDIOParamsInterval): boolean
}

/**
 * This interface describes custom expectation matchers for PageElementLists.
 *
 * It can be used for both positive and negative (.not) comparisons.
 */
interface ICustomListMatchers {
  toBeEmpty(): boolean
  toHaveLength(length: number, opts?: Workflo.Comparator): boolean
  toEventuallyBeEmpty(opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveLength(length: number, opts?: IPageElementListWaitLengthParams): boolean

  toExist(filterMask?: boolean): boolean
  toBeVisible(filterMask?: Workflo.PageNode.ListFilterMask): boolean
  toBeEnabled(filterMask?: Workflo.PageNode.ListFilterMask): boolean
  toHaveText(text: string | string[]): boolean
  toHaveAnyText(filterMask?: Workflo.PageNode.ListFilterMask): boolean
  toContainText(text: string | string[]): boolean
  toHaveDirectText(text: string | string[]): boolean
  toHaveAnyDirectText(filterMask?: Workflo.PageNode.ListFilterMask): boolean
  toContainDirectText(text: string | string[]): boolean

  toEventuallyExist(opts?: Workflo.IWDIOParams & {filterMask?: boolean}): boolean
  toEventuallyBeVisible(opts?: Workflo.IWDIOParams & Workflo.PageNode.IListFilterMask): boolean
  toEventuallyBeEnabled(opts?: Workflo.IWDIOParams & Workflo.PageNode.IListFilterMask): boolean
  toEventuallyHaveText(text: string | string[], opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyText(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask): boolean
  toEventuallyContainText(text: string | string[], opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveDirectText(text: string | string[], opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyDirectText(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask): boolean
  toEventuallyContainDirectText(text: string | string[], opts?: Workflo.IWDIOParamsInterval): boolean
}

/**
 * This interface describes custom expectation matchers for PageElementMaps.
 *
 * It can be used for both positive and negative (.not) comparisons.
 *
 * @template K the names of the elements stored in the map (the map's keys) as string literals
 */
interface ICustomMapMatchers<K extends string | number | symbol> {
  toExist(opts?: Workflo.PageNode.MapFilterMask<K>): boolean
  toBeVisible(opts?: Workflo.PageNode.MapFilterMask<K>): boolean
  toBeEnabled(opts?: Workflo.PageNode.MapFilterMask<K>): boolean
  toHaveText(text: Partial<Record<K, string>>): boolean
  toHaveAnyText(opts?: Workflo.PageNode.MapFilterMask<K>): boolean
  toContainText(text: Partial<Record<K, string>>): boolean
  toHaveDirectText(text: Partial<Record<K, string>>): boolean
  toHaveAnyDirectText(opts?: Workflo.PageNode.MapFilterMask<K>): boolean
  toContainDirectText(text: Partial<Record<K, string>>): boolean

  toEventuallyExist(opts?: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K>): boolean
  toEventuallyBeVisible(opts?: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K>): boolean
  toEventuallyBeEnabled(opts?: Workflo.IWDIOParams & Workflo.PageNode.IMapFilterMask<K>): boolean
  toEventuallyHaveText(text:Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyText(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K>): boolean
  toEventuallyContainText(text:Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveDirectText(text:Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyDirectText(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K>): boolean
  toEventuallyContainDirectText(text:Partial<Record<K, string>>, opts?: Workflo.IWDIOParamsInterval): boolean
}

/**
 * This interface describes custom expectation matchers for PageElementGroups.
 *
 * It can be used for both positive and negative (.not) comparisons.
 *
 * @template Content the type of the content managed by the group
 */
interface ICustomGroupMatchers<Content extends Workflo.PageNode.GroupContent> {
  toExist(opts?: Workflo.PageNode.GroupFilterMask<Content>): boolean
  toBeVisible(opts?: Workflo.PageNode.GroupFilterMask<Content>): boolean
  toBeEnabled(opts?: Workflo.PageNode.GroupFilterMask<Content>): boolean
  toHaveText(text: Workflo.PageNode.ExtractText<Content>): boolean
  toHaveAnyText(opts?: Workflo.PageNode.GroupFilterMask<Content>): boolean
  toContainText(text: Workflo.PageNode.ExtractText<Content>): boolean
  toHaveDirectText(text: Workflo.PageNode.ExtractText<Content>): boolean
  toHaveAnyDirectText(opts?: Workflo.PageNode.GroupFilterMask<Content>): boolean
  toContainDirectText(text: Workflo.PageNode.ExtractText<Content>): boolean

  toEventuallyExist(opts?: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content>): boolean
  toEventuallyBeVisible(opts?: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content>): boolean
  toEventuallyBeEnabled(opts?: Workflo.IWDIOParams & Workflo.PageNode.IGroupFilterMask<Content>): boolean
  toEventuallyHaveText(text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyText(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content>): boolean
  toEventuallyContainText(text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveDirectText(text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyDirectText(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content>): boolean
  toEventuallyContainDirectText(text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval): boolean
}

/**
 * This interface describes custom expectation matchers for ValuePageElements.
 *
 * It can be used for both positive and negative (.not) comparisons.
 *
 * @template ValueType the type of the values handled by this elements' xxxValue functions
 */
interface ICustomValueElementMatchers<ValueType> extends ICustomElementMatchers {
  toHaveValue(value: ValueType): boolean
  toHaveAnyValue(): boolean
  toContainValue(value: ValueType): boolean

  toEventuallyHaveValue(value: ValueType, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyValue(opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyContainValue(value: ValueType, opts?: Workflo.IWDIOParamsInterval): boolean
}

/**
 * This interface describes custom expectation matchers for ValuePageElementLists.
 *
 * It can be used for both positive and negative (.not) comparisons.
 *
 * @template ValueType the type of the values handled by the list's elements' xxxValue functions
 */
interface ICustomValueListMatchers<ValueType> extends ICustomListMatchers {
  toHaveValue(value: ValueType | ValueType[]): boolean
  toHaveAnyValue(filterMask?: Workflo.PageNode.ListFilterMask): boolean
  toContainValue(value: ValueType | ValueType[]): boolean

  toEventuallyHaveValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyValue(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IListFilterMask): boolean
  toEventuallyContainValue(value: ValueType | ValueType[], opts?: Workflo.IWDIOParamsInterval): boolean
}

/**
 * This interface describes custom expectation matchers for ValuePageElementMaps.
 *
 * It can be used for both positive and negative (.not) comparisons.
 *
 * @template K the names of the elements stored in the map (the map's keys) as string literals
 * @template ValueType the type of the values handled by the map's elements' xxxValue functions
 */
interface ICustomValueMapMatchers<
  K extends string | number | symbol,
  ValueType
> extends ICustomMapMatchers<K> {
  toHaveValue(value: Partial<Record<K, ValueType>>): boolean
  toHaveAnyValue(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean
  toContainValue(value: Partial<Record<K, ValueType>>): boolean

  toEventuallyHaveValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyValue(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IMapFilterMask<K>): boolean
  toEventuallyContainValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.IWDIOParamsInterval): boolean
}

/**
 * This interface describes custom expectation matchers for ValuePageElementGroups.
 *
 * It can be used for both positive and negative (.not) comparisons.
 *
 * @template Content the type of the content managed by the group
 */
interface ICustomValueGroupMatchers<Content extends Workflo.PageNode.GroupContent> extends ICustomGroupMatchers<Content>
{
  toHaveValue(value: Workflo.PageNode.ExtractValue<Content>): boolean
  toHaveAnyValue(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean
  toContainValue(value: Workflo.PageNode.ExtractValue<Content>): boolean

  toEventuallyHaveValue(value: Workflo.PageNode.ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval): boolean
  toEventuallyHaveAnyValue(opts?: Workflo.IWDIOParamsInterval & Workflo.PageNode.IGroupFilterMask<Content>): boolean
  toEventuallyContainValue(value: Workflo.PageNode.ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval): boolean
}

/**
 * This interface describes positive and negative (.not) expectation matchers for PageElements.
 *
 * It is implemented by the return value of the `expectElement` function if expectElement was passed an instance of
 * PageElement.
 */
interface IElementMatchers extends ICustomElementMatchers {
  not: ICustomElementMatchers
}

/**
 * This interface describes positive and negative (.not) expectation matchers for PageElementLists.
 *
 * It is implemented by the return value of the `expectList` function if expectList was passed an instance of
 * PageElementList.
 */
interface IListMatchers extends ICustomListMatchers {
  not: ICustomListMatchers
}

/**
 * This interface describes positive and negative (.not) expectation matchers for PageElementMaps.
 *
 * It is implemented by the return value of the `expectMap` function if expectMap was passed an instance of
 * PageElementMap.
 *
 * @template K the names of the elements stored in the map (the map's keys) as string literals
 */
interface IMapMatchers<K extends string | number | symbol> extends ICustomMapMatchers<K> {
  not: ICustomMapMatchers<K>
}

/**
 * This interface describes positive and negative (.not) expectation matchers for PageElementGroups.
 *
 * It is implemented by the return value of the `expectGroup` function if expectGroup was passed an instance of
 * PageElementGroup.
 *
 * @template Content the type of the content managed by the group
 */
interface IGroupMatchers<
  Content extends {[key: string]: Workflo.PageNode.INode}
> extends ICustomGroupMatchers<Content> {
  not: ICustomGroupMatchers<Content>
}

/**
 * This interface describes positive and negative (.not) expectation matchers for ValuePageElements.
 *
 * It is implemented by the return value of the `expectElement` function if expectElement was passed an instance of
 * ValuePageElement.
 *
 * @template ValueType the type of the values handled by this elements' xxxValue functions
 */
interface IValueElementMatchers<ValueType> extends ICustomValueElementMatchers<ValueType> {
  not: ICustomValueElementMatchers<ValueType>
}

/**
 * This interface describes positive and negative (.not) expectation matchers for ValuePageElementLists.
 *
 * It is implemented by the return value of the `expectList` function if expectList was passed an instance of
 * ValuePageElementList.
 *
 * @template ValueType the type of the values handled by the list's elements' xxxValue functions
 */
interface IValueListMatchers<ValueType> extends ICustomValueListMatchers<Workflo.ArrayElement<ValueType>> {
  not: ICustomValueListMatchers<Workflo.ArrayElement<ValueType>>
}

/**
 * This interface describes positive and negative (.not) expectation matchers for ValuePageElementMaps.
 *
 * It is implemented by the return value of the `expectMap` function if expectMap was passed an instance of
 * ValuePageElementMap.
 *
 * @template K the names of the elements stored in the map (the map's keys) as string literals
 * @template ValueType the type of the values handled by the map's elements' xxxValue functions
 */
interface IValueMapMatchers<K extends string | number | symbol, ValueType>
extends ICustomValueMapMatchers<K, ValueType> {
  not: ICustomValueMapMatchers<K, ValueType>
}

/**
 * This interface describes positive and negative (.not) expectation matchers for ValuePageElementGroups.
 *
 * It is implemented by the return value of the `expectGroup` function if expectGroup was passed an instance of
 * ValuePageElementGroup.
 *
 * @template Content the type of the content managed by the group
 */
interface IValueGroupMatchers<Content extends Workflo.PageNode.GroupContent>
extends ICustomValueGroupMatchers<Content> {
  not: ICustomValueGroupMatchers<Content>
}

declare global {

  /**
   * This function provides expectation matchers for PageElements or ValuePageElements.
   *
   * All template type parameters can be inferred automatically.
   *
   * @template Store type of PageElementStore used by the passed element
   * @template PageElementType type of the passed element
   * @template ValueType If the passed element is an instance of ValuePageElement, this is the type of the values
   * handled in element's xxxValue functions.
   *
   * @param element an instance of PageElement or an instance of ValuePageElement
   * @returns the expectation matchers for PageElement or ValuePageElement
   */
  function expectElement<
    Store extends pageObjects.stores.PageElementStore,
    PageElementType extends pageObjects.elements.PageElement<Store>,
    ValueType
  >(element: PageElementType): (typeof element) extends (infer ElementType) ?
    ElementType extends pageObjects.elements.ValuePageElement<any, ValueType> ?
    IValueElementMatchers<ReturnType<ElementType['getValue']>> :
    IElementMatchers : IElementMatchers

  /**
   * This function provides expectation matchers for PageElementLists or ValuePageElementLists.
   *
   * All template type parameters can be inferred automatically.
   *
   * @template Store type of PageElementStore used by the passed list and its elements
   * @template PageElementType type of the element's handled by the passed list
   * @template PageElementOptions options type of the element's handled by the passed list
   * @template PageElementListType type of the passed list
   *
   * @param list an instance of PageElementList or an instance of ValuePageElementList
   * @returns the expectation matchers for PageElementList or ValuePageElementList
   */
  function expectList<
    Store extends pageObjects.stores.PageElementStore,
    PageElementType extends pageObjects.elements.PageElement<Store>,
    PageElementOptions,
    PageElementListType extends pageObjects.elements.PageElementList<Store, PageElementType, PageElementOptions>,
  >(list: PageElementListType): (typeof list) extends (infer ListType) ?
    ListType extends pageObjects.elements.ValuePageElementList<
      any, pageObjects.elements.ValuePageElement<any, any>, PageElementOptions, any
    > ?
    IValueListMatchers<ReturnType<ListType['getValue']>> : IListMatchers : IListMatchers;

  /**
   * This function provides expectation matchers for PageElementMaps or ValuePageElementMaps.
   *
   * All template type parameters can be inferred automatically.
   *
   * @template Store type of PageElementStore used by the passed map and its elements
   * @template K the names of the elements stored in the map (the map's keys) as string literals
   * @template PageElementType type of the element's handled by the passed map
   * @template PageElementOptions options type of the element's handled by the passed map
   * @template PageElementMapType type of the passed map
   *
   * @param map an instance of PageElementMap or an instance of ValuePageElementMap
   * @returns the expectation matchers for PageElementMap or ValuePageElementMap
   */
  function expectMap<
    Store extends pageObjects.stores.PageElementStore,
    K extends string,
    PageElementType extends pageObjects.elements.PageElement<Store>,
    PageElementOptions,
    PageElementMapType extends pageObjects.elements.PageElementMap<Store, K, PageElementType, PageElementOptions>,
  >(map: PageElementMapType): (typeof map) extends (infer MapType) ?
    MapType extends pageObjects.elements.ValuePageElementMap<
      any, K, pageObjects.elements.ValuePageElement<any, any>, PageElementOptions, any
    > ?
    IValueMapMatchers<keyof MapType['$'], ReturnType<MapType['getValue']>[keyof MapType['$']]> :
    IMapMatchers<keyof typeof map['$']> : IMapMatchers<keyof typeof map['$']>

  /**
   * This function provides expectation matchers for PageElementGroups or ValuePageElementGroups.
   *
   * All template type parameters can be inferred automatically.
   *
   * @template Store type of PageElementStore used by the passed group
   * @template Content type of the content managed by the passed group
   * @template PageElementGroupType type of the passed group
   *
   * @param group an instance of PageElementGroup or an instance of ValuePageElementGroup
   * @returns the expectation matchers for PageElementGroup or ValuePageElementGroup
   */
  function expectGroup<
    Store extends pageObjects.stores.PageElementStore,
    Content extends Workflo.PageNode.GroupContent,
    PageElementGroupType extends pageObjects.elements.PageElementGroup<Store, Content>
  >(group: PageElementGroupType): (typeof group) extends (infer GroupType) ?
    GroupType extends pageObjects.elements.ValuePageElementGroup<any, Content> ?
    IValueGroupMatchers<GroupType['$']> : IGroupMatchers<typeof group['$']> : IGroupMatchers<typeof group['$']>

  namespace WebdriverIO {
    interface Client<T> {
      /**
       * Allows for any type of promise to be resolved in order to continue synchronous code execution.
       */
      resolvePromise <Type> (promise: Promise<Type>): Type
    }
  }

  namespace Workflo {

    /**
     * Makes all properties of Type optional, except for those whose keys are passed as K.
     */
    type PartialRequire<Type, K extends keyof Type> = Partial<Type> & Pick<Type, K>

    /**
     * Type is the original object.
     *
     * K represents the original object's property keys to be picked from the original object unaltered.
     *
     * KPartial represents the original object's property keys to be picked from the original object and turned into optional properties.
     */
    type PickPartial<Type, K extends keyof Type, KPartial extends keyof Type> = Pick<Type, K> & Partial<Pick<Type, KPartial>>

    /**
     * Omits all properties from T whose key names are in K.
     */
    type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

    /**
     * Returns the keys of all properties of T whose values extend U.
     */
    type FilteredKeys<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T];

    /**
     * Returns the keys of all properties of T whose values' ReturnTypes extend U.
     */
    type FilteredKeysByReturnType<T, U> = {
      [P in keyof T]: T[P] extends (...args) => Workflo.PageNode.INode ?
      ReturnType<T[P]> extends U ? P : never :
      P
    }[keyof T];

    /**
     * Returns the keys of all properties of T whose values are not never.
     */
    type KeysWithoutNever<T> = { [P in keyof T]: T[P] extends never ? never : P }[keyof T];

    /**
     * Returns all properties of T whose values are not never.
     */
    type WithoutNever<T> = Pick<T, KeysWithoutNever<T>>

    /**
     * Reserved for future use when typescript bugs https://github.com/Microsoft/TypeScript/issues/24560 and
     * https://github.com/Microsoft/TypeScript/issues/24791are are resolved.
     */
    type StripNever<T> = T // Pick<T, KeysWithoutNever<T>> // Omit<T, FilteredKeys<T, never>> // T

    /**
     * Reserved for future use when typescript bugs https://github.com/Microsoft/TypeScript/issues/24560 and
     * https://github.com/Microsoft/TypeScript/issues/24791are are resolved.
     */
    type StripNeverByReturnType<T> = T // Omit<T, FilteredKeysByReturnType<T, never>>

    /**
     * If ArrayType is an array, returns the type of an array element.
     * If ArrayType is not an array, returns never.
     */
    type ArrayElement<ArrayType> = ArrayType extends (infer ElementType)[] ? ElementType : never;

    /**
     * If ArrayType is an array, returns the type of an array element or the type of the array.
     * If ArrayType is not an array, returns never.
     */
    type ArrayOrElement<ArrayType> = ArrayType extends (infer ElementType)[] ? ElementType | ElementType[] : never;

    /**
     * If ArrayType is an array, returns the type of an array element.
     * If ArrayType is not an array, returns ArrayType.
     */
    type TryArrayElement<ArrayType> = ArrayType extends (infer ElementType)[] ? ElementType : ArrayType;

    /**
     * If ArrayType is an array, returns the type of an array element or the type of the array.
     * If ArrayType is not an array, returns ArrayType.
     */
    type TryArrayOrElement<ArrayType> = ArrayType extends (infer ElementType)[] ? ElementType | ElementType[] : ArrayType;

    /**
     * The type of a webdriverio element returned by browser.element or browser.elements.
     *
     * @see http://v4.webdriver.io/api/protocol/element.html
     */
    type WdioElement = Client<RawResult<Element>> & RawResult<Element>

    /**
     * @ignore
     */
    interface IJSError {
      notFound: string[]
    }

    /**
     * This interface describes the coordinates of the upper left corner of a PageElement on the page in pixels.
     */
    interface ICoordinates extends Record<string, number> {
      /**
       * X-Location of the upper left corner of a PageElement on the page in pixels
       */
      x: number,
      /**
       * Y-Location of the upper left corner of a PageElement on the page in pixels
       */
      y: number
    }

    /**
     * This interface describes the size of a PageElement in pixels.
     */
    interface ISize extends Record<string, number> {
      /**
       * Width of a PageElement in pixels
       */
      width: number,
      /**
       * Height of a PageElement in pixels
       */
      height: number
    }

    /**
     * Tolerances used for comparisons of numbers.
     */
    interface ITolerance extends Record<string, number> {
      /**
       * Lower tolerances bound used for comparisons of numbers.
       */
      lower: number,
      /**
       * Upper tolerances bound used for comparisons of numbers.
       */
      upper: number
    }

    /**
     * Desribes the result of calling the `scroll` function on PageElement in pixels.
     */
    interface IScrollResult {
      /**
       * Top location of the scrolled element in pixels.
       */
      elemTop: number
      /**
       * Left location of the scrolled element in pixels.
       */
      elemLeft: number
      /**
       * Top location of the scroll container in pixels.
       */
      containerTop: number
      /**
       * Left location of the scrolled container in pixels.
       */
      containerLeft: number
      /**
       * Value of the HTML scrollTop property of the scroll container in pixels.
       */
      scrollTop: number
      /**
       * Value of the HTML scrollLeft property of the scroll container in pixels.
       */
      scrollLeft: number
    }

    /**
     * 
     */
    interface IScrollParams {
      containerSelector?: string,
      directions: {
        x?: boolean,
        y?: boolean
      },
      offsets?: {
        x?: number,
        y?: number
      },
      padding?: {
        x?: number,
        y?: number
      },
      closestContainerIncludesHidden?: boolean
    }

    interface IRecObj<Type> {
      [key: string] : Type | IRecObj<Type>
    }

    interface IWDIOParams {
      timeout?: number,
    }

    interface IWDIOParamsInterval {
      timeout?: number,
      interval?: number
    }

    interface IWDIOParamsReverse extends IWDIOParams {
      reverse?: boolean,
    }

    interface IWDIOParamsReverseInterval extends IWDIOParamsInterval {
      reverse?: boolean,
    }

    interface IAnyAttribute {
      name: string,
    }

    interface IAttribute extends IAnyAttribute {
      value: string
    }

    interface IElementJSON {
      pageNodeType: string,
      nodeId: string
    }

    interface ILastDiff {
      __lastDiff: IDiff
      __setLastDiff: (diff: IDiff) => void
    }

    interface IDiffTree {
      [key: string]: IDiff
    }

    interface IDiff {
      constructorName?: string,
      actual?: string,
      expected?: string,
      selector?: string,
      tree?: IDiffTree
    }

    namespace Store {
      type BaseKeys = "timeout" | "waitType"
      type GroupPublicKeys = "timeout"
      type GroupConstructorKeys = GroupPublicKeys | "content" | "store"
      type ElementPublicKeys = BaseKeys | "customScroll"
      type ListPublicKeys = BaseKeys | "disableCache" | "identifier"
      type ListPublicPartialKeys = "elementOptions"
      type ListConstructorKeys = ListPublicKeys | ListPublicPartialKeys | "elementStoreFunc"
      type MapPublicKeys = "identifier" | "timeout"
      type MapPublicPartialKeys = "elementOptions"
      type MapConstructorKeys = MapPublicKeys | MapPublicPartialKeys | "elementStoreFunc"
    }

    namespace PageNode {

      interface INode extends ILastDiff {
        __getNodeId(): string
        getTimeout(): number
        toJSON(): IElementJSON

        currently: {}
        wait: {}
        eventually: {}
      }

      type GroupContent = {[key: string] : Workflo.PageNode.INode}

      type ExtractText<T extends {[key in keyof T]: INode}> = {
        [P in keyof T]?: T[P] extends IElementNode<any, any, any> ?
        TryArrayOrElement<ReturnType<T[P]['getText']>> :
        never;
      }

      type ExtractExistsFilterMask<T extends {[key in keyof T]: INode}> = {
        [P in keyof T]?: T[P] extends IElementNode<any, any, any> ?
        TryArrayElement<ReturnType<T[P]['currently']['getExists']>> :
        never;
      }

      type ExtractBoolean<T extends {[key in keyof T]: INode}> = {
        [P in keyof T]?: T[P] extends IElementNode<any, any, any> ?
        TryArrayOrElement<ReturnType<T[P]['getIsEnabled']>> :
        never;
      }

      interface IElementNode<TextType, BooleanType, FilterType = any>
        extends INode, IGetElement<TextType, BooleanType, FilterType>
      {
        currently: IGetElement<TextType, BooleanType, FilterType> &
          ICheckElementCurrently<TextType, BooleanType, FilterType>
        wait: IWaitElement<TextType, BooleanType, FilterType>
        eventually: ICheckElementEventually<TextType, BooleanType, FilterType>
      }

      interface IGetElement<TextType, BooleanType, FilterType> {
        getIsEnabled(filterMask?: FilterType): BooleanType
        getText(filterMask?: FilterType): TextType
        getDirectText(filterMask?: FilterType): TextType

        getHasText(text: TextType): BooleanType
        getHasAnyText(filterMask?: FilterType): BooleanType
        getContainsText(text: TextType): BooleanType
        getHasDirectText(text: TextType): BooleanType
        getHasAnyDirectText(filterMask?: FilterType): BooleanType
        getContainsDirectText(text: TextType): BooleanType
      }

      interface IWaitElement<TextType, BooleanType, FilterType, OptsType = IWDIOParamsReverseInterval> {
        exists(opts?: OptsType & {filterMask?: FilterType}): IElementNode<TextType, BooleanType, FilterType>
        isVisible(opts?: OptsType & {filterMask?: FilterType}): IElementNode<TextType, BooleanType, FilterType>
        isEnabled(opts?: OptsType & {filterMask?: FilterType}): IElementNode<TextType, BooleanType, FilterType>
        hasText(text: TextType, opts?: OptsType): IElementNode<TextType, BooleanType, FilterType>
        hasAnyText(opts?: OptsType & {filterMask?: FilterType}): IElementNode<TextType, BooleanType, FilterType>
        containsText(text: TextType, opts?: OptsType): IElementNode<TextType, BooleanType, FilterType>
        hasDirectText(directText: TextType, opts?: OptsType): IElementNode<TextType, BooleanType, FilterType>
        hasAnyDirectText(opts?: OptsType & {filterMask?: FilterType}): IElementNode<TextType, BooleanType, FilterType>
        containsDirectText(directText: TextType, opts?: OptsType): IElementNode<TextType, BooleanType, FilterType>

        not: Omit<IWaitElement<TextType, BooleanType, FilterType, IWDIOParamsInterval>, 'not'>
      }

      interface ICheckElementCurrently<TextType, BooleanType, FilterType> {
        getExists(filterMask?: FilterType): BooleanType
        getIsVisible(filterMask?: FilterType): BooleanType
        getIsEnabled(filterMask?: FilterType): BooleanType
        exists(filterMask?: FilterType): boolean
        isVisible(filterMask?: FilterType): boolean
        isEnabled(filterMask?: FilterType): boolean
        hasText(text: TextType): boolean
        hasAnyText(filterMask?: FilterType): boolean
        containsText(text: TextType): boolean
        hasDirectText(directText: TextType): boolean
        hasAnyDirectText(filterMask?: FilterType): boolean
        containsDirectText(directText: TextType): boolean

        not: Omit<
          ICheckElementCurrently<TextType, BooleanType, FilterType>,
          'not' | 'getExists' | 'getIsVisible' | 'getIsEnabled'
        >
      }

      interface ICheckElementEventually<TextType, BooleanType, FilterType> {
        exists(opts?: IWDIOParams & {filterMask?: FilterType}): boolean
        isVisible(opts?: IWDIOParams & {filterMask?: FilterType}): boolean
        isEnabled(opts?: IWDIOParams & {filterMask?: FilterType}): boolean
        hasText(text: TextType, opts?: IWDIOParamsInterval): boolean
        hasAnyText(opts?: IWDIOParamsInterval & {filterMask?: FilterType}): boolean
        containsText(text: TextType, opts?: IWDIOParamsInterval): boolean
        hasDirectText(text: TextType, opts?: IWDIOParamsInterval): boolean
        hasAnyDirectText(opts?: IWDIOParamsInterval & {filterMask?: FilterType}): boolean
        containsDirectText(text: TextType, opts?: IWDIOParamsInterval): boolean

        not: Omit<ICheckElementEventually<TextType, BooleanType, FilterType>, 'not'>
      }

      type ExtractValue<T extends {[key: string]: INode}> = {
        [P in keyof T]?: T[P] extends IValueElementNode<any, any> ?
          TryArrayOrElement<ReturnType<T[P]['getValue']>> : never;
      }

      type ExtractValueBoolean<T extends {[key in keyof T]: INode}> = {
        [P in keyof T]?: T[P] extends IValueElementNode<any, any> ?
        TryArrayOrElement<ReturnType<T[P]['getHasValue']>> :
        never;
      }

      type ExtractValueBooleanWN<T extends {[key in keyof T]: INode}> = {
        [P in keyof T]?: T[P] extends IValueElementNode<any, any> ?
        WithoutNever<TryArrayOrElement<ReturnType<T[P]['getHasValue']>>> :
        never;
      }

      interface IValueElementNode<GetType, FilterType = any, SetType = GetType>
      extends INode, IValueElement<GetType, FilterType>
      {
        currently: IValueElement<GetType, FilterType> & ICheckValueCurrently<GetType, FilterType>
        wait: IWaitValue<GetType, FilterType>
        eventually: ICheckValueEventually<GetType, FilterType>

        setValue(value: SetType): IValueElementNode<GetType, FilterType, SetType>
      }

      interface IValueElement<GetType, FilterType> {
        getValue(filterMask?: FilterType): GetType

        getHasValue(value: GetType): FilterType
        getHasAnyValue(filterMask?: FilterType): FilterType
        getContainsValue(value: GetType): FilterType
      }

      interface IWaitValue<ValueType, FilterType, OptsType = IWDIOParamsReverseInterval> {
        hasValue(text: ValueType, opts?: OptsType): IValueElementNode<ValueType, FilterType>
        hasAnyValue(opts?: OptsType & {filterMask?: FilterType}): IValueElementNode<ValueType, FilterType>
        containsValue(text: ValueType, opts?: OptsType): IValueElementNode<ValueType, FilterType>

        not: Omit<IWaitValue<ValueType, FilterType, IWDIOParamsInterval>, 'not'>
      }

      interface ICheckValueCurrently<ValueType, FilterType> {
        hasValue(value: ValueType): boolean
        hasAnyValue(filterMask?: FilterType): boolean
        containsValue(value: ValueType): boolean

        not: Omit<ICheckValueCurrently<ValueType, FilterType>, 'not'>
      }

      interface ICheckValueEventually<ValueType, FilterType> {
        hasValue(value: ValueType, opts?: IWDIOParamsInterval): boolean
        hasAnyValue(opts?: IWDIOParamsInterval & {filterMask?: FilterType}): boolean
        containsValue(value: ValueType, opts?: IWDIOParamsInterval): boolean

        not: Omit<ICheckValueEventually<ValueType, FilterType>, 'not'>
      }

      type ListFilterMask = boolean | boolean[]

      type MapFilterMask<K extends string | number | symbol> = Partial<Record<K, boolean>>

      type GroupFilterMask<Content extends GroupContent> = Partial<Workflo.PageNode.ExtractBoolean<Content>>

      type GroupFilterMaskExists<Content extends GroupContent> =
        Partial<Workflo.PageNode.ExtractExistsFilterMask<Content>>

      type ValueGroupFilterMask<Content extends GroupContent> = Partial<Workflo.PageNode.ExtractValueBoolean<Content>>

      type ValueGroupFilterMaskWN<Content extends GroupContent> = WithoutNever<
        Partial<Workflo.PageNode.ExtractValueBooleanWN<Content>>
      >

      interface IListFilterMask {
        filterMask?: ListFilterMask
      }

      interface IMapFilterMask<K extends string | number | symbol> {
        filterMask?: Partial<Record<K, boolean>>
      }

      interface IGroupFilterMask<Content extends GroupContent>{
        filterMask?: Partial<Workflo.PageNode.ExtractBoolean<Content>>
      }

      interface IGroupFilterMaskExists<Content extends GroupContent> {
        filterMask?: Partial<Workflo.PageNode.ExtractExistsFilterMask<Content>>
      }

      interface IValueGroupFilterMask<Content extends GroupContent> {
        filterMask?: Partial<Workflo.PageNode.ExtractValueBoolean<Content>>
      }
    }

    /**
     * @ignored
     */
    type Value = string | boolean | number

    /**
     * This enum describes the four possible initial waiting types supported by wdio-workflo.
     *
     * Every time an interaction with the tested application takes place via a PageElement's action (eg. click),
     * an initial wait condition will be performed before executing the specified action:
     *
     * - 'exist' waits for the PageElement to exist in the DOM
     * - 'visible' waits for the PageElement to become visible in the viewport (this will not be the case if the
     * PageElement is concealed by another element, hidden, not existing or outside of the viewport)
     * - 'text' waits for the PageElement to have any text (this will not be the case if the PageElement does not exist,
     * is not visible, or has no text at all)
     * - 'value' waits for the PageElement to have any value (this will not be the case if the PageElement does not
     * exist, is not visible, or has no value at all)
     */
    const enum WaitType {
      exist = 'exist',
      visible = 'visible',
      text = 'text',
      value = 'value'
    }

    /**
     * This enum is used to perform comparisons of numbers.
     */
    const enum Comparator {
      equalTo = '==',
      lessThan = '<',
      greaterThan = '>',
      notEqualTo = '!=',
      ne = '!=',
      eq = '==',
      lt = '<',
      gt = '>',
    }

    /**
     * XPath can be supplied to wdio-workflo either via an XPathBuilder or as a raw XPath string
     */
    type XPath = pageObjects.builders.XPathBuilder | string

   // UTILITY FUNCTIONS

    namespace Object {

      /**
       * Iterates over all properties in an object and executes
       * func on each.
       *
       * Returns a new object with the same keys as the input
       * object and the values as result of the func.
       *
       * @param input
       * @param func
       */
      export function mapProperties<T, O, K extends string>(input: Record<K, T>, func: (value: T, key?: K) => O): Record<K, O>;

      /**
       * Iterates over all properties in an object and executes func on each.
       *
       * @param input
       * @param func
       */
      export function forEachProperty<T, K extends string>(input: Record<K, T>, func: (value: T, key?: K) => void): Record<K, T>;

      /**
       * Returns a new object with the original object's keys and values inverted.
       * The original object's values must therefore be implicitly convertable to type string.
       *
       * @param obj
       */
      export function invert<K extends string>(obj: Record<K, string>): Record<string, K>;

      /**
       * Returns a new filtered object that only contains those
       * properties of the initial object where func returned true.
       *
       * Does not traverse nested objects!
       *
       * @param obj
       * @param func
       */
      export function filter<T>(obj: Record<string, T>, func: (value: T, key?: string) => boolean): Record<string, T>;

      /**
       * If key already exists in obj, turns respective value
       * into array and pushes value onto the array.
       * Else, adds "normal" key-value pair as property.
       * If overwrite is true, always overwrites existing value
       * with new value without turning it into array.
       *
       * @param obj
       * @param key
       * @param value
       * @param overwrite
       */
      export function addToProp<T, K extends string>(obj: Record<K, T | T[]>, key: K, value: T, overwrite?: boolean): Record<K, T | T[]>;

      /**
       * Creates a copy of original object in which all
       * key-value pairs matching the passed props are removed.
       *
       * @param obj
       * @param props
       */
      export function stripProps<T>(obj: Record<string, T>, props: string[]): Record<string, T>;

      /**
       * Returns properties of obj whose keys are also present in
       * subsetObj as a new object.
       *
       * Does not traverse nested objects!
       *
       * @param obj
       * @param matchingObject
       */
      export function subset<T, O>(obj: Record<string, T>, maskObject: Record<string, O>): Record<string, T>;

      /**
       * Returns a new object where all properties with a boolean value of false are stripped recursively.
       * @param obj
       */
      export function stripMaskDeep(obj: Workflo.IRecObj<boolean>): Workflo.IRecObj<boolean>;
    }

    namespace Array {
      /**
       * Gets an input array and maps it to an object where
       * the property keys correspond to the array elements
       * and the property values are defiend by mapFunc.
       *
       * @param input
       * @param mapFunc
       */
      export function mapToObject<T>(input: string[], mapFunc: (element: string) => T): {
          [key: string]: T;
      }
    }

    namespace String {
     /**
       * Splits a string at delim and returns an object with the
       * split string parts as keys and the values set to true.
       *
       * @param str
       * @param delim
       */
      export function splitToObj(str: string, delim: string | RegExp): {
          [part: string]: boolean;
      }

      /**
       * Removes all whitespace characters from a string.
       *
       * @param str
       */
      export function stripWhitespaces(str: string): string
    }

    namespace Class {
      /**
       * Returns names of all methods of a ES6 class (except for constructor).
       *
       * see http://stackoverflow.com/questions/31054910/get-functions-methods-of-a-class
       *
       * @param obj
       */
      export function getAllMethods(obj: any): string[]
    }

    namespace Util {

      /**
       * Converts strings, arrays and objects into objects.
       *
       * If input is string, output is an object with one
       * entry where the key is the string.
       * If input is array, output is an object where each key
       * represents one element in the array.
       * If input is object, output is a clone of the input object.
       *
       * For strings and arrays, valueFunc is used to calculate the
       * resulting object's property values.
       * For objects, valueFunc has no effect -> original property values will be preserved!
       *
       * @param unknownTypedInput
       * @param valueFunc
       */
      export function convertToObject<T>(unknownTypedInput: {
          [key: string]: T;
      } | string[] | string, valueFunc?: (key: string) => T): {
          [key: string]: T;
      }

      /**
       * Compares two variables of same type.
       *
       * @param var1
       * @param var2
       * @param operator
       */
      export function compare<Type>(var1: Type, var2: Type, operator: Workflo.Comparator): boolean;
    }

    /**
     * @ignore
     */
    interface FilterList {
      listFiles?: string[]
      specFiles?: string[]
      testcaseFiles?: string[]
      features?: string[]
      specs?: string[]
      testcases?: string[]
    }

  // SPECS AND TESTCASES

    /**
    * This interfaces describes the results of manually executed testcases for one Story in the form of an object.
    *
    * The object's keys are the ids of acceptance criteria of the validated Story and its values are an object that
    * contains:
    *
    * - the result of the validation as a boolean (true if it passed, false if it failed)
    * - the date at which the validation was performed
    * - an optional comment to add supplementary notes (eg. "fails in Internet Explorer only")
    */
    interface IManualCriteria {
      [key: number] : {
        result: boolean,
        date: string,
        comment?: string
      }
    }

    /**
     * This interface describes an object that defines the results of manually executed testcases to also include them
     * in the test report.
     *
     * The object's keys are the ids of the manually validated Stories (eg. "2.4.5") and its values are objects which
     * implement IManualCriteria.
     */
    interface IManualTestcaseResults {
      [key: string] : IManualCriteria
    }

    /**
     * @ignore
     */
    type StepImpl = <ArgsType extends Object, ReturnType>(params: IStepParams<ArgsType, ReturnType>) => IStep

    /**
     * @ignore
     */
    type StepImplMap = { [key:string]: StepImpl }

    /**
     * Severity describes how severe the implications of something not working correctly would be.
     */
    type Severity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'
    /**
     * The result status of a testcase.
     */
    type TestcaseStatus = 'passed' | 'failed' | 'broken' | 'unknown' | 'pending'
    /**
     * The result status of a validation/an acceptance criteria of a Story.
     */
    type SpecStatus = 'passed' | 'failed' | 'broken' | 'unvalidated' | 'unknown' | 'pending'

    /**
     * This interface is implemented by the return value of a Story's `Given` function.
     *
     * It can be used to chain multiple `Given` functions together sequentially by calling `.And` in order to create an
     * initial state.
     */
    interface ISpecGiven {
      /**
       * Call this function to chain multiple `Given` functions together sequentially in order to create an initial state.
       *
       * Alternatively, if you can nest another `Given` inside the bodyFunc to express diverging "Story lines".
       *
       * Once you finished describing all initial states, you can invoke a state change by calling `When` inside the
       * bodyFunc of this function.
       *
       * To validate an initial state with acceptance criteria, use `Then` inside the bodyFunc of this function.
       *
       * @param description a short description of an initial state
       * @param bodyFunc Use the body of this function to define acceptance criteria, nested initial states or state
       * changes.
       */
      And: (description: string, bodyFunc?: () => void) => ISpecGiven
    }

   /**
     * This interface is implemented by the return value of a Story's `When` function.
     *
     * It can be used to chain multiple `When` functions together sequentially by calling `.And`.
     */
    interface ISpecWhen {
      /**
       * Call this function to chain multiple `When` functions together sequentially.
       *
       * Alternatively, if you can nest another `When` inside the bodyFunc to express diverging "Story lines".
       *
       * To validate the state following a state change with acceptance criteria, use `Then` inside the bodyFunc of When.
       *
       * @param description a short description of an initial state
       * @param bodyFunc Use the body of this function to define acceptance criteria or nested state changes.
       */
      And: (description: string, bodyFunc?: () => void) => ISpecWhen
    }

  /**
   * The `given` function establishes the initial state of a tested application by executing the passed step.
   *
   * You can also chain together multiple given statements to create the initial state by appending `.and` to the end
   * of this function.
   *
   * Once you finished establishing the initial state(s), you can trigger a state change by appending a `.when` step to
   * the end of the given function/chain.
   * State change steps can also be chained together sequentially by appending `.and` to the end of the step chain.
   *
   * @param step a step that establishes the initial state
   */

    /**
     * This interface is implemented by the return value of a testcase's `when` function.
     *
     * It can be used to chain multiple `when` functions together sequentially by calling `.and`.
     */
    interface ITCWhen {
      /**
       * Call this function to chain multiple `when` functions together sequentially.
       *
       * To validate the state following the execution of this step, use `validate` inside the step callback.
       *
       * @param step a step that performs a state change
       */
      and: (step: IStep) => ITCWhen
    }

    /**
     * This interface is implemented by the return value of a testcase's `given` function.
     *
     * It can be used to chain multiple `given` functions together sequentially by calling `.and` or to trigger
     * a state change by invoking `.when`.
     */
    interface ITCGiven {
      /**
       * Call this function to chain multiple `given` functions together sequentially.
       *
       * To validate the initial state following the execution of this step, use `validate` inside the step callback.
       *
       * @param step a step that establishes the initial state
       */
      and: (step: IStep) => ITCGiven,
      /**
       * Call this function to invoke a state change of the tested application.
       *
       * To validate the state following the execution of this step, use `validate` inside the step callback.
       *
       * @param step a step that performs a state change
       */
      when: (step: IStep) => ITCWhen
    }

    /**
     * @ignore
     */
    interface IDescriptionStack {
      givens: string[]
      whens: string[]
    }

    /**
     * Optional metadata of a Story.
     */
    interface IStoryMetaData {
      /**
       * Ids of issues associated with this Story in an issue tracker tool (eg. user stories in JIRA).
       *
       * In the allure test report, links to these issues will be created.
       * To build these links, wdio-workflo examines the "allure" property in workflo.conf.ts
       * and for each issue concatenates allure.issuePrefix, allure.issueTrackerPattern and allure.issueAppendix and
       * substitutes '%s' in the issueTrackerPattern with the issue id.
       */
      issues?: string[],
      /**
       * Ids of bugs associated with this Story in an issue tracker tool (eg. bugs in JIRA).
       *
       * In the allure test report, links to these bugs will be created.
       * To build these links, wdio-workflo examines the "allure" property in workflo.conf.ts
       * and for each bug concatenates allure.bugPrefix, allure.issueTrackerPattern and allure.bugAppendix and
       * substitutes '%s' in the issueTrackerPattern with the bug id.
       */
      bugs?: string[],
      /**
       * The severity of a Story describes how severe the implications of one or more acceptance criteria of the Story 
       * not being fulfilled correctly would be. It defaults to 'normal'.
       */
      severity?: Workflo.Severity
    }

    /**
     * Optional metadata of a Feature.
     *
     * Empty at the moment - reserved for future use.
     */
    interface IFeatureMetadata {
    }

    /**
     * Optional metadata of a suite.
     *
     * Empty at the moment - reserved for future use.
     */
    interface ISuiteMetadata {
    }

    /**
     * Optional metadata of a testcase.
     */
    interface ITestcaseMetadata {
      /**
       * Ids of bugs associated with this testcase in an issue tracker tool.
       *
       * In the allure test report, links to these bugs will be created.
       * To build these links, wdio-workflo examines the "allure" property in workflo.conf.ts
       * and for each bug concatenates allure.bugPrefix, allure.issueTrackerPattern and allure.bugAppendix and
       * substitutes '%s' in the issueTrackerPattern with the bug id.
       */
      bugs?: string[],
      /**
       * Id of this testcase in a test management tool.
       *
       * In the test report, a link to this testcase will be created.
       * To build this link, wdio-workflo examines the "allure" property in workflo.conf.ts
       * and substitutes '%s' in allure.testManagementPattern with the test id.
       */
      testId?: string,
      /**
       * The severity of a testcase describes how severe the implications of the testcase failing would be.
       * It defaults to 'normal'.
       */
      severity?: Workflo.Severity
    }

    /**
     * @ignore
     */
    interface IStoryMapEntry {
      descriptionStack: IDescriptionStack
      description: string
      metadata: IStoryMetaData
      featureName: string,
      storyName: string,
      insideWhenSequence: boolean,
      whenSequenceLengths: number[],
      whenRecLevel: number,
      insideGivenSequence: boolean,
      givenSequenceLengths: number[],
      givenRecLevel: number
    }

    /**
     * @ignore
     */
    interface IExpectationBlock {
      testcaseName: string
      execute: () => void
      screenshot: any
    }

   /**
    * This object's keys are the ids of the validated Stories (eg."2.4.5") and its values are either a single id (eg. 3)
    * or an ids array (eg. [3, 4, 5]) of acceptance criteria defined within the associated Story.
    */
    type IValidateSpecObject = {
      [specId: string]: number | number[]
    }

    /**
     * @ignore
     */
    type IValidateContainer = {
      specObj: IValidateSpecObject
    }

    /**
     * IStepOptParams are supposed to be used as the parameters of a step creation function if a step does not require
     * any or only optional arguments.
     *
     * @template ArgsType defines the type of the step arguments passed to the execution function.
     * @template ReturnType defines the return type of the execution function.
     */
    interface IOptStepParams<ArgsType extends Object, ReturnType> {
      /**
       * An optional callback function that is invoked right after the execution of a step.
       *
       * The return value of the step's execution function is passed to the callback function as a single parameter.
       *
       * The step callback function can be used to retrieve and validate the state of the application right after
       * the execution of a step.
       */
      cb?: (param: ReturnType) => void,
      /**
       * Optional arguments that can, but do not have to be, passed to a step execution function.
       */
      arg?: ArgsType,
      /**
       * A short description of the interactions a step performs with the tested application.
       */
      description?: string
    }

    /**
     * IStepParams are supposed to be used as the parameters of a step creation function if a step requires mandatory
     * step arguments.
     *
     * @template ArgsType defines the type of the step arguments passed to the execution function.
     * @template ReturnType defines the return type of the execution function.
     */
    interface IStepParams<ArgsType extends Object, ReturnType> extends IOptStepParams<ArgsType, ReturnType> {
      /**
       * Mandatory arguments that a step requires in order to be executed.
       */
      arg: ArgsType,
    }

    /**
     * Steps consist of a description and an execution function.
     * The execution function performs changes to the state of the tested application and the description briefly
     * summarizes these changes in natural language.
     *
     * A step can be parameterized by passing step arguments and a step callback (both of which are optional) to the
     * execution function:
     *
     * Step arguments are key-value pair objects that provide dynamic values to the state changes of the execution function.
     * They also enable the interpolation of a step's description by replacing `%{key}` in the description string
     * with key's value retrieved from the step arguments object).
     *
     * Step callbacks can be used to query and validate the state of the tested application right after step execution.
     * A step callback will be passed the return value of the execution function as its first parameter.
     *
     */
    interface IStep {
      __description: string,
      __execute: (prefix?: string) => void
    }

    /**
     * Steps in wdio-workflo need to be defined in this format - on object where the keys are the step descriptions and
     * the values are step creation functions that take the step parameters as and argument and return a created Step.
     */
    type StepDefinitions = Record<
      string, (params?: Workflo.IStepParams<any, any> | Workflo.IOptStepParams<any, any>) => Workflo.IStep
    >
  }

  // API FUNCTIONS

  /**
   * Returns a unique id by concatenating the passed string and a counter value that is incremented on each invocation
   * of the function with the same passed string.
   *
   * Pairs of each passed string and the latest value of its respective counter are stored in the file uidStore.json
   * and will be preserved for the next test run.
   * To reset a single counter value, you can edit this file. To reset all counter values, you can delete it.
   *
   * @param str a string for which to create a unique id
   * @returns the generated unique id
   */
  function getUid(str: string) : string

  /**
   * A Feature in wdio-workflo represents a collection of related Stories.
   *
   * @param description the name or a short description of the Feature
   * @param metadata the metadata of the Feature
   * @param bodyFunc Define all Stories that belong to this Feature in the body of this function.
   */
  function Feature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void

  /**
   * If one or more Features in a scope (usually a .spec.ts file) are marked as "fFeature",
   * the test runner will execute only these Features and ignore all other Features defined in the same scope.
   *
   * A Feature in wdio-workflo represents a collection of related Stories.
   *
   * @param description the name or a short description of the Feature
   * @param metadata the metadata of the Feature
   * @param bodyFunc Define all Stories that belong to this Feature in the body of this function.
   */
  function fFeature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void

  /**
   * All Features marked as "xFeature" will not be executed by the test runner.
   *
   * A Feature in wdio-workflo represents a collection of related Stories.
   *
   * @param description the name or a short description of the Feature
   * @param metadata the metadata of the Feature
   * @param bodyFunc Define all Stories that belong to this Feature in the body of this function.
   */
  function xFeature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void

  /**
   * A Story in wdio-workflo represents a series of application states and state changes triggered by a user or a system.
   * It also contains acceptance criteria that validate the state following a state change.
   *
   * Wdio-workflo evaluates all acceptance criteria defined within a Story and sets their result status accordingly.
   *
   * States, state changes and acceptance criteria can be implemented using the following functions:
   *
   * - `Given` to describe the initial state
   * - `When` for state changes
   * - `Then` to define acceptance criteria
   *
   * @param id a unique id that identifies a Story (1.1, 2.4.5 etc...)
   * @param description the name or a short description of the Story
   * @param metadata the metadata of the Story
   * @param bodyFunc Define all states, state changes and acceptance criteria of a Story in the body of this function.
   */
  function Story(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void) : void

  /**
   * If one or more Stories in a Feature are marked as "fStory",
   * the test runner will execute only these Stories and ignore all other Stories defined in the same Feature.
   *
   * A Story in wdio-workflo represents a series of application states and state changes triggered by a user or a system.
   * It also contains acceptance criteria that validate the state following a state change.
   *
   * Wdio-workflo evaluates all acceptance criteria defined within a Story and sets their result status accordingly.
   *
   * States, state changes and acceptance criteria can be implemented using the following functions:
   *
   * - `Given` to describe the initial state
   * - `When` for state changes
   * - `Then` to define acceptance criteria
   *
   * @param id a unique id that identifies a Story (1.1, 2.4.5 etc...)
   * @param description the name or a short description of the Story
   * @param metadata the metadata of the Story
   * @param bodyFunc Define all states, state changes and acceptance criteria of a Story in the body of this function.
   */
  function fStory(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void) : void

  /**
   * All Stories marked as "xStory" will not be executed by the test runner.
   *
   * A Story in wdio-workflo represents a series of application states and state changes triggered by a user or a system.
   * It also contains acceptance criteria that validate the state following a state change.
   *
   * Wdio-workflo evaluates all acceptance criteria defined within a Story and sets their result status accordingly.
   *
   * States, state changes and acceptance criteria can be implemented using the following functions:
   *
   * - `Given` to describe the initial state
   * - `When` for state changes
   * - `Then` to define acceptance criteria
   *
   * @param id a unique id that identifies a Story (1.1, 2.4.5 etc...)
   * @param description the name or a short description of the Story
   * @param metadata the metadata of the Story
   * @param bodyFunc Define all states, state changes and acceptance criteria of a Story in the body of this function.
   */
  function xStory(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void) : void

  /**
   * Given describes an initial state of a Story.
   *
   * To join multiple initial states sequentially, you can either chain them together by appending `.And` to the end of
   * this function or you can nest another `Given` inside the bodyFunc to express diverging "Story lines".
   *
   * Once you finished describing all initial states, you can invoke a state change by calling `When` inside the
   * bodyFunc of this Given function.
   *
   * To validate an initial state with acceptance criteria, use `Then` inside the bodyFunc of Given.
   *
   * @param description a short description of an initial state
   * @param bodyFunc Use the body of this function to define acceptance criteria, nested initial states or state
   * changes.
   */
  function Given(description: string, bodyFunc?: () => void) : Workflo.ISpecGiven

  /**
   * When describes a state change inside a Story that is triggered either by a user or by a system.
   *
   * To join multiple state changes sequentially, you can either chain them together by appending `.And` to the end of
   * this function or you can nest another `When` inside the bodyFunc to express diverging "Story lines".
   *
   * To validate the state following a state change with acceptance criteria, use `Then` inside the bodyFunc of When.
   *
   * @param description a short description of who did what to trigger a state change
   * @param bodyFunc Use the body of this function to define acceptance criteria or nested state changes.
   */
  function When(description: string, bodyFunc?: () => void) : Workflo.ISpecWhen

  /**
   * Then represents an acceptance criteria that is used to validate the correctness and completeness of an application
   * state.
   *
   * An acceptance criteria needs to be uniquely identifiable by a combination of its surrounding Story's id and its
   * own id (eg. 2.4.5 [1], 2.4.5 [2], 1.1 [1]). The resulting id can be used to reference an acceptance criteria
   * in a testcase's `validate` function.
   *
   * Wdio-workflo evaluates all validations defined inside testcases that reference an acceptance criteria and sets the
   * result of the acceptance criteria accordingly:
   *
   * - Only if all validations for an acceptance criteria were successful, the criteria is marked as "passed".
   * - If one or more validations were unsuccessful (the actual value did not match the expected value), the criteria is
   *  marked as "failed".
   * - If runtime errors occurred within at least one validation, the criteria is marked as "broken".
   * - If an acceptance criteria is not referenced by any validation, the criteria is marked as "unvalidated".
   *
   * @param id the id of an acceptance criteria which must be unique within its surrounding Story
   * @param description a short description of the expected state under validation
   */
  function Then(id: number, description: string) : void

  /**
   * If one or more acceptance criteria in a Story are marked as "fThen",
   * the test runner will execute only these acceptance criteria and ignore all others defined in the same Story.
   *
   * Then represents an acceptance criteria that is used to validate the correctness and completeness of an application
   * state.
   *
   * An acceptance criteria needs to be uniquely identifiable by a combination of its surrounding Story's id and its
   * own id (eg. 2.4.5 [1], 2.4.5 [2], 1.1 [1]). The resulting id can be used to reference an acceptance criteria
   * in a testcase's `validate` function.
   *
   * Wdio-workflo evaluates all validations defined inside testcases that reference an acceptance criteria and sets the
   * result of the acceptance criteria accordingly:
   *
   * - Only if all validations for an acceptance criteria were successful, the criteria is marked as "passed".
   * - If one or more validations were unsuccessful (the actual value did not match the expected value), the criteria is
   *  marked as "failed".
   * - If runtime errors occurred within at least one validation, the criteria is marked as "broken".
   * - If an acceptance criteria is not referenced by any validation, the criteria is marked as "unvalidated".
   *
   * @param id the id of an acceptance criteria which must be unique within its surrounding Story
   * @param description a short description of the expected state under validation
   */
  function fThen(id: number, description: string) : void

  /**
   * All acceptance criteria marked as "xThen" will not be executed by the test runner.
   *
   * Then represents an acceptance criteria that is used to validate the correctness and completeness of an application
   * state.
   *
   * An acceptance criteria needs to be uniquely identifiable by a combination of its surrounding Story's id and its
   * own id (eg. 2.4.5 [1], 2.4.5 [2], 1.1 [1]). The resulting id can be used to reference an acceptance criteria
   * in a testcase's `validate` function.
   *
   * Wdio-workflo evaluates all validations defined inside testcases that reference an acceptance criteria and sets the
   * result of the acceptance criteria accordingly:
   *
   * - Only if all validations for an acceptance criteria were successful, the criteria is marked as "passed".
   * - If one or more validations were unsuccessful (the actual value did not match the expected value), the criteria is
   *  marked as "failed".
   * - If runtime errors occurred within at least one validation, the criteria is marked as "broken".
   * - If an acceptance criteria is not referenced by any validation, the criteria is marked as "unvalidated".
   *
   * @param id the id of an acceptance criteria which must be unique within its surrounding Story
   * @param description a short description of the expected state under validation
   */
  function xThen(id: number, description: string) : void

  /**
   * A suite is a collection of related testcases.
   *
   * @param description the name or a short description of the suite
   * @param metadata the metadata of the suite
   * @param bodyFunc define all testcases for this suite inside the body of this function
   */
  function suite(description: string, metadata: Workflo.ISuiteMetadata, bodyFunc: () => void) : void

  /**
   * If one or more suites in a scope (usually a .tc.ts file) are marked as "fsuite",
   * the test runner will execute only these suites and ignore all others defined in the same scope.
   *
   * A suite is a collection of related testcases.
   *
   * @param description the name or a short description of the suite
   * @param metadata the metadata of the suite
   * @param bodyFunc define all testcases for this suite inside the body of this function
   */
  function fsuite(description: string, metadata: Workflo.ISuiteMetadata, bodyFunc: () => void) : void

  /**
   * All suites marked as "xsuite" will not be executed by the test runner.
   *
   * A suite is a collection of related testcases.
   *
   * @param description the name or a short description of the suite
   * @param metadata the metadata of the suite
   * @param bodyFunc define all testcases for this suite inside the body of this function
   */
  function xsuite(description: string, metadata: Workflo.ISuiteMetadata, bodyFunc: () => void) : void

  /**
   * A testcase is composed of a sequence of steps strung together in a step chain.
   *
   * Each step represents a single or multiple interactions with the tested application and allows you to pass a step
   * callback in order to perform validations of the application state right after the step was performed.
   *
   * Wdio-workflo evaluates all validations defined within a testcase and sets the testcase status accordingly:
   *
   * - Only if all validations defined within a testcase were successful, the testcase is marked as "passed".
   * - If one or more validations were unsuccessful (the actual value did not match the expected value), the testcase is
   *  marked as "failed".
   * - If runtime errors occurred anywhere inside a testcase, the testcase is marked as "broken".
   * - A testcase can also be marked as "pending" if it was not executed because it was marked with "xtestcase" or
   * because a bail option was specified and the bail limit was already reached.
   *
   * Steps and validations can be implemented using the following functions:
   *
   * - `given` to establish the initial state
   * - `when` to describe changes of the application state
   * - `validate` to perform validations of the application state inside a step callback
   *
   * @param description the name or a short description of the suite
   * @param metadata the metadata of the testcase
   * @param bodyFunc define all steps for this testcase inside the body of this function
   */
  function testcase(description: string, metadata: Workflo.ITestcaseMetadata, bodyFunc: () => void) : void

  /**
   * If one or testcases in a suite are marked as "fTestcase",
   * the test runner will execute only testcases and ignore all others defined in the same suite.
   *
   * A testcase is composed of a sequence of steps.
   *
   * Each step represents a single or multiple interactions with the tested application and allows you to pass a step
   * callback in order to perform validations of the application state right after the step was performed.
   *
   * Wdio-workflo evaluates all validations defined within a testcase and sets the testcase status accordingly:
   *
   * - Only if all validations defined within a testcase were successful, the testcase is marked as "passed".
   * - If one or more validations were unsuccessful (the actual value did not match the expected value), the testcase is
   *  marked as "failed".
   * - If runtime errors occurred anywhere inside a testcase, the testcase is marked as "broken".
   * - A testcase can also be marked as "pending" if it was not executed because it was marked with "xtestcase" or
   * because a bail option was specified and the bail limit was already reached.
   *
   * Steps and validations can be implemented using the following functions:
   *
   * - `given` to establish the initial state
   * - `when` to describe changes of the application state
   * - `validate` to perform validations of the application state inside a step callback
   *
   * @param description the name or a short description of the suite
   * @param metadata the metadata of the testcase
   * @param bodyFunc define all steps for this testcase inside the body of this function
   */
  function ftestcase(description: string, metadata: Workflo.ITestcaseMetadata, bodyFunc: () => void) : void

  /**
   * All testcases criteria marked as "xtestcase" will not be executed by the test runner.
   *
   * A testcase is composed of a sequence of steps.
   *
   * Each step represents a single or multiple interactions with the tested application and allows you to pass a step
   * callback in order to perform validations of the application state right after the step was performed.
   *
   * Wdio-workflo evaluates all validations defined within a testcase and sets the testcase status accordingly:
   *
   * - Only if all validations defined within a testcase were successful, the testcase is marked as "passed".
   * - If one or more validations were unsuccessful (the actual value did not match the expected value), the testcase is
   *  marked as "failed".
   * - If runtime errors occurred anywhere inside a testcase, the testcase is marked as "broken".
   * - A testcase can also be marked as "pending" if it was not executed because it was marked with "xtestcase" or
   * because a bail option was specified and the bail limit was already reached.
   *
   * Steps and validations can be implemented using the following functions:
   *
   * - `given` to establish the initial state
   * - `when` to describe changes of the application state
   * - `validate` to perform validations of the application state inside a step callback
   *
   * @param description the name or a short description of the suite
   * @param metadata the metadata of the testcase
   * @param bodyFunc define all steps for this testcase inside the body of this function
   */
  function xtestcase(description: string, metadata: Workflo.ITestcaseMetadata, bodyFunc: () => void) : void

  /**
   * The `given` function establishes the initial state of a tested application by executing the passed step.
   *
   * You can also chain together multiple given statements to create the initial state by appending `.and` to the end
   * of this function.
   *
   * Once you finished establishing the initial state(s), you can trigger a state change by appending a `.when` step to
   * the end of the given function/chain.
   * State change steps can also be chained together sequentially by appending `.and` to the end of the step chain.
   *
   * @param step a step that establishes the initial state
   */
  function given(step: Workflo.IStep) : Workflo.ITCGiven

  /**
   * The `validate` function provides the means to validate an application state.
   * It MUST BE PLACED INSIDE A STEP CALLBACK, otherwise validations will not function properly.
   *
   * Validations can reference a single or more acceptance criteria in one or more Stories:
   *
   * In order for wdio-workflo to know which specs (Features, Stories, acceptance criteria) should be validated by this
   * function, you need to pass a validateObject as first parameter.
   * This object's keys are the ids of the validated Stories (eg."2.4.5") and its values are either a single id (eg. 3)
   * or an ids array (eg. [3, 4, 5]) of acceptance criteria defined within the associated Story.
   *
   * The result status of a validation is determined by the results of all expectation matchers
   * (eg. `expect(1).toBe(2)`) defined within its validationFunc:
   *
   * - If all expectation matchers pass, the validation is marked as 'passed'.
   * - If one or more expectation matchers failed (actual value did not match expected value), the validation is marked
   * as 'failed'.
   * - If a runtime error occurred inside the validationFunc, the validation is marked as 'broken'.
   *
   * @param validateObject an object whose keys represent the ids of Stories to be validated and whose values are either
   * a single id or an array of ids of validated acceptance criteria
   * @param validationFunc Define all expectation matchers that together determine the result of this validation inside
   * the body of this function.
   */
  function validate(validateObject: Workflo.IValidateSpecObject, validationFunc: (...args : any[]) => void) : void

  /**
   * Returns an instance of XPathBuilder to create XPath expressions using functions instead of writing the whole
   * XPath as a raw string.
   *
   * Using XPathBuilder can help to reduce the number of errors originating from a wrong usage of the sometimes quite
   * complex syntax of XPath.
   *
   * @param selector the initial XPath selector (eg. "//div", "/span")
   * @returns an instance of XPathBuilder
   */
  function xpath(selector: string) : pageObjects.builders.XPathBuilder
}

export type Severity = Workflo.Severity
export type TestcaseStatus = Workflo.TestcaseStatus
export type SpecStatus = Workflo.SpecStatus
export type IStep = Workflo.IStep
export type IStepParams<ArgsType extends Object, ReturnType> = Workflo.IStepParams<ArgsType, ReturnType>
export type IOptStepParams<ArgsType extends Object, ReturnType> = Workflo.IOptStepParams<ArgsType, ReturnType>
export type StepDefinitions = Workflo.StepDefinitions

export * from './lib/steps'

import * as objectFunctions from './lib/utility_functions/object'
import * as arrayFunctions from './lib/utility_functions/array'
import * as classFunctions from './lib/utility_functions/class'
import * as stringFunctions from './lib/utility_functions/string'
import * as utilFunctions from './lib/utility_functions/util'

export { objectFunctions, arrayFunctions, classFunctions, stringFunctions, utilFunctions }

export { pageObjects, helpers }

/**
 * @ignore
 */
import Kiwi from './lib/Kiwi'

/**
 * @ignore
 */
export { Kiwi }

// CONFIG FILE TYPES SECTION

/**
 * @ignore
 */
export interface Error {
  stack?: string;
}

/**
 * Timeouts in milliseconds.
 */
export interface ITimeouts {
  [key: string]: number
  default?: number
}

/**
 * Intervals in milliseconds.
 */
export interface IIntervals {
  [key: string]: number
  default?: number
}

/**
 * @ignore
 */
export interface ICountAndPercentage {
  count?: number
  percentage?: string
}

/**
 * @ignore
 */
export interface IPrintObject {
  'Spec Files': number,
  'Testcase Files': number,
  'Manual Result Files': number,
  Features: number,
  Specs: number,
  Suites: number,
  Testcases: number,
  'Manual Results (Specs)': number,
  'Defined Spec Criteria': ICountAndPercentage,
  'Automated Criteria': ICountAndPercentage,
  'Manual Criteria': ICountAndPercentage,
  'Uncovered Criteria': ICountAndPercentage,
  'Uncovered Criteria Object': ICountAndPercentage
}

export interface ICapabilities extends DesiredCapabilities {
  [key: string]: any,
}

export interface ICallbackConfig extends IWorkfloCallbackConfig, IWorkfloCommonConfig, Options {

}

// wdio excluded:
        // browserstackLocal
        // capabilities
        // desiredCapabilities
        // isWDIO
        // maxSession
        // mochaOpts
        // cucumberOpts

// wdio:
        // baseUrl
        // bail
        // deprecationWarnings
        // coloredLogs
        // connectionRetryTimeout
        // connectionRetryCount
        // debug
        // execArgv
        // exclude
        // framework
        // host
        // protocol
        // port
        // path
        // plugins
        // reporters
        // reporterOptions
        // logLevel
        // maxInstances
        // maxInstancesPerCapability
        // jasmineNodeOpts
        // services
        // screenshotPath
        // seleniumLogs
        // suites
        // sync
        // waitforInterval
        // waitforTimeout
        // user
        // key

// workflo excluded:
        // manualTestcases
        // screenshotOnReject
        // beforeValidator
        // logOutput
        // reportResultsInstantly
        // manualResults

// workflo:
        // testcases
        // specs
        // uidStorePath
        // testDir
        // seleniumArgs
        // seleniumInstallArgs
        // queryParams
        // headers
        // testInfoFilePath
        // allure
        // reportErrorsInstantly
        // consoleLogLevel
        // resultsPath
        // latestRunPath
        // browser
        // dateTime
        // mergedResultsPath
        // consoleReportPath
        // mergedAllureResultsPath
        // retries
        // criteriaAnalysis
        // executionFilters
        // parseResults
        // traceInfo
        // printObject

export interface IWorkfloCommonConfig {
  /**
   * Root directory for all test artifacts of wdio-workflo.
   */
  testDir: string
  /**
   * http(s).Agent instance to use
   *
   * @default new http(s).Agent({ keepAlive: true })
   */
  agent?: Object
  /**
   * An HTTP proxy to be used. Supports proxy Auth with Basic Auth, identical to support for the url
   * parameter (by embedding the auth info in the uri)
   *
   * @default undefined (no proxy used)
   */
  proxy?: String
  /**
   * Path to the uidStore.json file which is used to generate unique ids during test execution.
   *
   * The generated ids will be preversed for future test runs until the uidStore.json file is deleted.
   */
  uidStorePath: string
  /**
   * Arguments for start command of selenium-standalone service.
   *
   * @default {}
   */
  seleniumStartArgs?: StartOpts
  /**
   * Arguments for install command of selenium-standalone service.
   *
   * @default {}
   */
  seleniumInstallArgs?: InstallOpts
  /**
   * A key-value store of query parameters to be added to every selenium request.
   *
   * @default {}
   */
  queryParams?: Object
  /**
   * A key-value store of headers to be added to every selenium request. Values must be strings.
   *
   * @default {}
   */
  headers?: Object
  /**
   * Options for allure report.
   */
  allure?: {
    /**
     * Pattern used to create urls for issues and bugs.
     *
     * '%s' in pattern will be replaced with issue/bug keys defined in Story options.
     *
     * @example "http://example.com/jira/browse/%s"
     */
    issueTrackerPattern?: string,
    /**
     * Pattern used to create urls for testcase management system.
     *
     * '%s' in pattern will be replaced with testId keys defined in Story options.
     *
     * @example "http://example.com/tms/browse/%s"
     */
    testManagementPattern?: string,
    /**
     * Will be prepended to issue keys displayed in allure report.
     * This can be useful as allure report provides no way to distinct issues and bugs by default.
     */
    issuePrefix?: string,
    /**
     * Will be appended to issue keys displayed in allure report.
     * This can be useful as allure report provides no way to distinct issues and bugs by default.
     */
    issueAppendix?: string,
    /**
     * Will be prepended to bug keys displayed in allure report.
     * This can be useful as allure report provides no way to distinct issues and bugs by default.
     */
    bugPrefix?: string
    /**
     * Will be appended to bug keys displayed in allure report.
     * This can be useful as allure report provides no way to distinct issues and bugs by default.
     */
    bugAppendix?: string
  }
  /**
   * Log level output in spec reporter console.
   *
   * @default testcases
   */
  consoleLogLevel?: 'results' | 'testcases' | 'steps'
  /**
   * If set to true, will output errors and validation failures immediatly.
   *
   * @default false
   */
  reportErrorsInstantly?: boolean
    /**
   * Defines how many times a testcase should be rerun if it did not pass.
   * The current testcase will be aborted on the first error or failed expectation
   * and rerun <retries> times.
   *
   * @default 0
   */
  retries?: number
}

export interface IWorkfloCallbackConfig {
  /**
   * Defines which testcase files should run. The pattern is relative to the directory
   * from which `wdio-workflo` was called.
   *
   * Corresponds to the "testcaseFiles" config option in the workflo config file.
   */
  testcases?: string[]
  /**
   * Defines which spec files should run. The pattern is relative to the directory
   * from which `wdio-workflo` was called.
   *
   * Corresponds to the "specFiles" config option in the workflo config file.
   */
  specs?: string[]
  /**
   * Path where the testinfo.json file resides.
   */
  testInfoFilePath: string
  /**
   * Path where results for the currently active browser are stored.
   */
  resultsPath: string
  /**
   * Path to the file that contains the name of the folder which stores the results of the latest test run.
   */
  latestRunPath: string
  /**
   * Name of the browser used to run the current tests.
   */
  browser: string
  /**
   * Date and time when the current test run was launched.
   */
  dateTime: string
  /**
   * Path to the json file that stores the merged results of all previous test runs and the current test run.
   */
  mergedResultsPath: string
  /**
   * Path where the spec reporter console report of the current test run is stored.
   */
  consoleReportPath: string
  /**
   * Path where the merged results of all previous test runs and the current test run are stored for allure.
   */
  mergedAllureResultsPath: string
  /**
   * Information about spec criteria of current test run.
   * Used internally by wdio-workflo.
   */
  criteriaAnalysis: IAnalysedCriteria
  /**
   * Filters used by wdio-workflo to determine which tests and specs to execute.
   * Filters include specFiles, testcaseFiles, features, specs, testcases, suites, manualResultFiles and manualSpecs.
   */
  executionFilters: IExecutionFilters
  /**
   * Parsing results of testcases and spec files used internally by wdio-workflo
   * to link specs and testcases.
   */
  parseResults: IParseResults
  /**
   * Information used to trace which testcases validate which specs and which
   * specs are validated in which testcases.
   * Used internally by wdio-workflo.
   */
  traceInfo: ITraceInfo
  /**
   * Data used by wdio-workflo to output the results and statistics of a test run.
   */
  printObject: IPrintObject
}

export interface IWorkfloConfig extends IWorkfloCommonConfig {
  /**
   * Set a base URL in order to shorten url command calls. If your `url` parameter starts
   * with `/`, the base url gets prepended, not including the path portion of your baseUrl.
   * If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
   * gets prepended directly.
   */
  baseUrl: string
  /**
   * Protocol to use when communicating with the Selenium standalone server (or driver)
   * @default http
   */
  protocol?: string,
  /**
   * Host of your WebDriver server.
   * @default 127.0.0.1
   */
  host?: string,
  /**
   * Port your WebDriver server is on.
   * @default 4444
   */
  port?: number,
  /**
   * Path to WebDriver server.
   * @default  /wd/hub
   */
  path?: string
  /**
   * WebdriverIO supports Sauce Labs, Browserstack and Testing Bot (other cloud providers
   * should work too though). These services define specific user and key (or access key)
   * values you need to put in here in order to connect to these services.
   *
   * @default undefined
   */
  user?: string
  /**
   * WebdriverIO supports Sauce Labs, Browserstack and Testing Bot (other cloud providers
   * should work too though). These services define specific user and key (or access key)
   * values you need to put in here in order to connect to these services.
   *
   * @default undefined
   */
  key?: string
  /**
   * Width of the browser window in pixels.
   */
  width: number,
  /**
   * Height of the browser window in pixels.
   */
  height: number,
  /**
   * Defines the capabilities you want to run in your Selenium session.
   * See https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities for a list of the available capabilities.
   *
   * Please be aware that wdio-workflo's reporting only supports one single instance at a time.
   * Therefore, the "maxInstance" property will always be set to 1.
   */
  capabilities: ICapabilities
  /**
   * Webdriverio Services to run for test execution.
   *
   * See http://webdriver.io/guide for more information.
   *
   * @default ['selenium-standalone']
   */
  services?: string[]
  /**
   * If set to true, Node debugging via the chrome extension "Node-Inspector Manager" is enabled.
   * The test process will then automatically connect to chrome's dedicated dev tools and break on
   * "debugger" statements.
   *
   * In order for this to work properly, a chrome browser must be installed on the system
   * and the chrome extension "Node-Inspector Manager" needs to be installed.
   *
   * Sometimes tests might hang after running with debug enabled.
   * In this case, close all chrome processes, open a new chrome window,
   * turn "Node-Inspector Menu" from "Auto" to "Manual" and again to "Auto"
   * and then restarting the tests should resolve the problem.
   *
   * The following settings are recommended for the "Node-Inspector Manager" extension:
   *
   * (Main Menu)
   * - Host: localhost
   * - Port: 9229
   * - Open DevTools: "Auto"
   *
   * (Settings Menu)
   * - Open in new Window: On
   * - Switch to inspector-window: On
   * - Close automatically: On
   * - Choose DevTools Version: On (default version)
   *
   * @default false
   */
  debug?: boolean
  /**
   * Execution arguments for the node process.
   * If using the debug option, execArgv will always be overwritten with the value ['--inspect']
   */
  execArgv?: string[]
  /**
   * Outputs selenium commands in the allure report if set to true.
   *
   * @default true
   */
  debugSeleniumCommand?: boolean
  /**
   * Skip future testcases after specific amount of already executed testcases have failed.
   * By default, does not bail.
   *
   * @default 0
   */
  bail?: number
  /**
   * Timeout for any request to the Selenium server in milliseconds.
   *
   * @default 90000
   */
  connectionRetryTimeout?: number
  /**
   * Count of request retries to the Selenium server.
   *
   * @default 3
   */
  connectionRetryCount?: number
  /**
   * Timeouts (for waitXXX and eventuallyXXX actions) in milliseconds.
   *
   * "default" property will be used for every waitXXX and eventuallyXXX action
   * if not explicitly stated otherwise.
   *
   * @default {default: 5000}
   */
  timeouts?: ITimeouts
  /**
   * Intervals (for waitXXX and eventuallyXXX actions) in milliseconds.
   *
   * "default" property will be used for every waitXXX and eventuallyXXX action
   * if not explicitly stated otherwise.
   *
   * @default {default: 500}
   */
  intervals?: IIntervals
  /**
   * Defines which testcase files should run. The pattern is relative to the directory
   * from which `wdio-workflo` was called.
   */
  testcaseFiles?: string[]
  /**
   * Defines which spec files should run. The pattern is relative to the directory
   * from which `wdio-workflo` was called.
   */
  specFiles?: string[]
  /**
   * Defines which manual testcase result files should run. The pattern is relative to the directory
   * from which `wdio-workflo` was called.
   */
  manualResultFiles?: string[]
  /**
   * Restricts test execution to the testcases, specs, testcaseFiles, specFiles and lists defined within these files.
   * The pattern is relative to the directory from which `wdio-workflo` was called.
   */
  listFiles?: string[]

  /**
   * Restricts test execution to these testcases.
   *
   * @example
   * ["Suite1", "Suite2.Testcase1"] => execute all testcases of Suite1 and Testcase1 of Suite2
   * ["Suite2", "-Suite2.Testcase2"] => execute all testcases of Suite2 except for Testcase2
   */
  testcases?: string[]
  /**
   * Restricts test execution to these features.
   *
   * @example
   * ["Login", "Logout"] => execute all testcases which validate specs defined within these features
   * ["-Login"] => execute all testcases except those which validate specs defined within these features
   */
  features?: string[]
  /**
   * Restricts test execution to these specs.
   *
   * @example
   * ["3.2"] => execute all testcases which validate spec 3.2
   * ["1.1*", "-1.1.2.4"] => 1.1* includes spec 1.1 and all of its sub-specs (eg. 1.1.2), -1.1.2.4 excludes spec 1.1.2.4
   * ["1.*"] => 1.* excludes spec 1 itself but includes of of its sub-specs
   */
  specs?: string[]
  /**
   * Restricts specs by status of their criteria set during their last execution.
   *
   * @example
   * ["passed", "failed", "broken", "unvalidated", "unknown"] => these are all available status - combine as you see fit
   * ["faulty"] => faulty is a shortcut for failed, broken, unvalidated and unknown
   */
  specStatus?: (SpecStatus | 'faulty')[]
  /**
   * Restricts executed testcases by given status.
   *
   * @example
   * ["passed", "failed", "broken", "pending", "unknown"] => these are all available status - combine as you see fit
   * ["faulty"] => faulty is a shortcut for failed, broken and unknown
   */
  testcaseStatus?: (TestcaseStatus | 'faulty')[]
  /**
   * Restricts specs by severity set during their last execution.
   *
   * @example
   * ["blocker", "critical", "normal", "minor", "trivial"] => these are all available severities - combine as you see fit
   */
  specSeverity?: Severity[]
  /**
   * Restricts testcases by severity set during their last execution.
   *
   * @example
   * ["blocker", "critical", "normal", "minor", "trivial"] => these are all available severities - combine as you see fit
   */
  testcaseSeverity?: Severity[]
  /**
   * Restricts testcases and specs (oldest spec criteria) by given date and time (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss).
   *
   * @example
 * ["(2017-03-10,2017-10-28)"] => restricts by status set between 2017-03-10 and 2017-10-28 (both at 0 pm, 0 min, 0 sec)
   * ["2017-07-21", "2017-07-22T14:51:13"] => restricts by last status set on 2017-07-21 or 2017-07-22 at 2 pm, 51 min, 13 sec
   */
  dates?: string[]
  /**
   * Do not run automatic testcases and consider only manual results.
   *
   * @default {default: false}
   */
  manualOnly?: boolean
  /**
   * Run only automatic testcases and do not consider manual results.
   *
   * @default {default: false}
   */
  automaticOnly?: boolean
  /**
   * Remove error stack trace lines that originate from the test framework itself.
   *
   * @default {default: true}
   */
  cleanStackTraces?: boolean

// RETYPE OBJECTS

  /**
   * Gets executed once before all workers get launched.
   * @param {ICallbackConfig} config wdio-workflo configuration object
   * @param {Array.<ICapabilities>} capabilities list of capabilities details
   */
  onPrepare?<T>(config: ICallbackConfig, capabilities: ICapabilities[]): Promise<T> | void
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or testcase.
   *
   * This callback is only invoked during the "testcases" phase.
   *
   * @param {ICallbackConfig} config wdio-workflo configuration object
   * @param {Array.<ICapabilities>} capabilities list of capabilities details
   * @param {Array.<String>} testcaseFiles List of testcases file paths that are to be run
   */
  beforeSession?<T>(config: ICallbackConfig, capabilities: ICapabilities[], testcaseFiles: string[]): Promise<T> | void
  /**
   * Gets executed before testcases execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   *
   * This callback is only invoked during the "testcases" phase.
   *
   * @param {Array.<ICapabilities>} capabilities list of capabilities details
   * @param {Array.<String>} testcaseFiles List of testcases file paths that are to be run
   */
  before?<T>(capabilities: ICapabilities[], testcaseFiles: string[]): Promise<T> | void
  /**
   * Hook that gets executed before the suite starts
   * @param {Suite} suite suite details
   */
  beforeSuite?<T>(suite: Suite): Promise<T> | void
  /**
   * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
   * beforeEach in Jasmine)
   */
  beforeHook?<T>(): Promise<T> | void
  /**
   * Hook that gets executed _after_ a hook within the suite ends (e.g. runs after calling
   * afterEach in Jasmine)
   */
  afterHook?<T>(): Promise<T> | void
  /**
   * Function to be executed before a testcase starts.
   * @param {Test} test test details
   */
  beforeTest?<T>(test: Test): Promise<T> | void
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   */
  beforeCommand?<T>(commandName: string, args: any[]): Promise<T> | void
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {Number} result 0 - command success, 1 - command error
   * @param {Error} error error object if any
   */
  afterCommand?<T>(commandName: string, args: any[], result: number, error: Error): Promise<T> | void
  /**
   * Function to be executed after a testcase ends.
   * @param {Test} test test details
   */
  afterTest?<T>(test: Test): Promise<T> | void
  /**
   * Hook that gets executed after the suite has ended
   * @param {Suite} suite suite details
   */
  afterSuite?<T>(suite: Suite): Promise<T> | void
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<ICapabilities>} capabilities list of capabilities details
   * @param {Array.<String>} testcaseFiles List of testcases file paths that ran
   */
  after?<T>(result: number, capabilities: ICapabilities[], testcaseFiles: string[]): Promise<T> | void
  /**
   * Gets executed right after terminating the webdriver session.
   *
   * This callback is only invoked during the "testcases" phase.
   *
   * @param {ICallbackConfig} config wdio-workflo configuration object
   * @param {Array.<ICapabilities>} capabilities list of capabilities details
   * @param {Array.<String>} testcaseFiles List of testcases file paths that ran
   */
  afterSession?<T>(config: ICallbackConfig, capabilities: ICapabilities, testcaseFiles: string[]): Promise<T> | void
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   *
   * This callback is only invoked during the "testcases" phase.
   *
   * @param {Array.<ICapabilities>} capabilities list of capabilities details
   * @param {Array.<String>} specFiles List of spec file paths that are to be run
   */
  beforeValidator?<T>(capabilities: ICapabilities[], specFiles: string[]): Promise<T> | void
   /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<ICapabilities>} capabilities list of capabilities details
   * @param {Array.<String>} specFiles List of spec file paths that ran
   */
  afterValidator?<T>(result: number, capabilities: ICapabilities[], specFiles: string[]): Promise<T> | void
  /**
   * Gets executed after all workers got shut down and the process is about to exit.
   * @param {Number} exitCode 0 - success, 1 - fail
   * @param {ICallbackConfig} config wdio-workflo configuration object
   * @param {Array.<ICapabilities>} capabilities list of capabilities details
   */
  onComplete?<T>(exitCode: number, config: ICallbackConfig, capabilities: ICapabilities[]): Promise<T> | void
  /**
  * Gets executed when an error happens, good place to take a screenshot
  * @ {Error} error
  */
  onError?<T>(error: Error): Promise<T> | void
}