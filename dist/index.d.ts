import { InstallOpts, StartOpts } from 'selenium-standalone';
import { Client, DesiredCapabilities, Element, Options, RawResult, Suite, Test } from 'webdriverio';
import { IAnalysedCriteria, IExecutionFilters, IParseResults, ITraceInfo } from './lib/cli';
import * as enums from './lib/enums';
import * as pageObjects from './lib/page_objects';
import * as helpers from './lib/helpers';
import { IPageElementListWaitLengthParams } from './lib/page_objects/page_elements/PageElementList';
/**
 * This interface describes custom expectation matchers for PageElements.
 *
 * It can be used for both positive and negative (.not) comparisons.
 */
interface ICustomElementMatchers {
    /**
     * Checks if the PageElement currently exists.
     */
    toExist(): boolean;
    /**
     * Checks if the PageElement is currently visible.
     */
    toBeVisible(): boolean;
    /**
     * Checks if the PageElement is currently enabled.
     */
    toBeEnabled(): boolean;
    /**
     * Checks if the PageElement is currently selected.
     */
    toBeSelected(): boolean;
    /**
     * Checks if the PageElement is currently checked.
     */
    toBeChecked(): boolean;
    /**
     * Checks if the PageElement currently has the specified text.
     *
     * @param text the text which the PageElement is supposed to have
     */
    toHaveText(text: string): boolean;
    /**
     * Checks if the PageElement currently has any text.
     */
    toHaveAnyText(): boolean;
    /**
     * Checks if the PageElement currently contains the specified text.
     *
     * @param text the text which the PageElement is supposed to contain
     */
    toContainText(text: string): boolean;
    /**
     * Checks if the PageElement currently has the specified HTML.
     *
     * @param html the HTML which the PageElement is supposed to have
     */
    toHaveHTML(html: string): boolean;
    /**
     * Checks if the PageElement currently has any HTML.
     */
    toHaveAnyHTML(): boolean;
    /**
     * Checks if the PageElement currently contains the specified HTML.
     *
     * @param html the HTML which the PageElement is supposed to contain
     */
    toContainHTML(html: string): boolean;
    /**
     * Checks if the PageElement currently has the specified text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the directText which the PageElement is supposed to have
     */
    toHaveDirectText(directText: string): boolean;
    /**
     * Checks if the PageElement currently has any direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     */
    toHaveAnyDirectText(): boolean;
    /**
     * Checks if the PageElement currently contains the specified HTML.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the directText which the PageElement is supposed to contain
     */
    toContainDirectText(directText: string): boolean;
    /**
     * Checks if the specified HTML attribute of PageElement currently has the expected value.
     *
     * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value it
     * is expected to have
     */
    toHaveAttribute(attribute: Workflo.IAttribute): boolean;
    /**
     * Checks if the HTML attribute with the specified attributeName of PageElement currently has any value.
     *
     * @param attributeName the specified attributeName of an HTML attribute of PageElement which is supposed to have any
     * value
     */
    toHaveAnyAttribute(attributeName: string): boolean;
    /**
     * Checks if the specified HTML attribute of PageElement currently contains the expected value.
     *
     * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value it
     * is expected to contain
     */
    toContainAttribute(attribute: Workflo.IAttribute): boolean;
    /**
     * Checks if the 'class' HTML attribute of PageElement currently has the specified className.
     *
     * @param className the className which the 'class' HTML attribute of PageElement is supposed to have
     */
    toHaveClass(className: string): boolean;
    /**
     * Checks if the 'class' HTML attribute of PageElement currently has any className.
     */
    toHaveAnyClass(): boolean;
    /**
     * Checks if the 'class' HTML attribute of PageElement currently contains the specified className.
     *
     * @param className the className which the 'class' HTML attribute of PageElement is supposed to contain
     */
    toContainClass(className: string): boolean;
    /**
     * Checks if the 'id' HTML attribute of PageElement currently has the specified value.
     *
     * @param id the value which the 'id' HTML attribute of PageElement is supposed to have
     */
    toHaveId(id: string): boolean;
    /**
     * Checks if the 'id' HTML attribute of PageElement currently has any value.
     */
    toHaveAnyId(): boolean;
    /**
     * Checks if the 'id' HTML attribute of PageElement currently contains the specified value.
     *
     * @param id the value which the 'id' HTML attribute of PageElement is supposed to contain
     */
    toContainId(id: string): boolean;
    /**
     * Checks if the 'name' HTML attribute of PageElement currently has the specified value.
     *
     * @param name the value which the 'name' HTML attribute of PageElement is supposed to have
     */
    toHaveName(name: string): boolean;
    /**
     * Checks if the 'name' HTML attribute of PageElement currently has any value.
     */
    toHaveAnyName(): boolean;
    /**
     * Checks if the 'name' HTML attribute of PageElement currently contains the specified value.
     *
     * @param name the value which the 'name' HTML attribute of PageElement is supposed to contain
     */
    toContainName(name: string): boolean;
    /**
     * Checks if - currently - the location of PageElement matches the specified coordinates or if its location deviates
     * no more than the specified tolerances from the specified coordinates.
     *
     * @param coordinates the expected coordinates of PageElement
     * @param tolerances used to calculate the maximal allowed deviations from the expected coordinates
     */
    toHaveLocation(coordinates: Workflo.ICoordinates, tolerances?: Partial<Workflo.ICoordinates>): boolean;
    /**
     * Checks if - currently - the x-location of PageElement matches the specified x-location or if PageElement's
     * x-location deviates no more than the specified tolerance from the specified x-location.
     *
     * @param x the expected x-location of PageElement
     * @param tolerance used to calculate the maximal allowed deviation from the expected x-location
     */
    toHaveX(x: number, tolerance?: number): boolean;
    /**
     * Checks if - currently - the y-location of PageElement matches the specified y-location or if PageElement's
     * y-location deviates no more than the specified tolerance from the specified y-location.
     *
     * @param y the expected y-location of PageElement
     * @param tolerance used to calculate the maximal allowed deviation from the expected y-location
     */
    toHaveY(y: number, tolerance?: number): boolean;
    /**
     * Checks if - currently - the size of PageElement matches the specified size or if PageElement's size deviates no
     * more than the specified tolerances from the specified size.
     *
     * @param size the expected size of PageElement
     * @param tolerances used to calculate the maximal allowed deviations from the expected size
     */
    toHaveSize(size: Workflo.ISize, tolerances?: Partial<Workflo.ISize>): boolean;
    /**
     * Checks if - currently - the width of PageElement matches the specified width or if PageElement's width deviates no
     * more than the specified tolerance from the specified width.
     *
     * @param width the expected width of PageElement
     * @param tolerance used to calculate the maximal allowed deviation from the expected width
     */
    toHaveWidth(width: number, tolerance?: number): boolean;
    /**
     * Checks if - currently - the height of PageElement matches the specified height or if PageElement's height deviates
     * no more than the specified tolerance from the specified height.
     *
     * @param height the expected height of PageElement
     * @param tolerance used to calculate the maximal allowed deviation from the expected height
     */
    toHaveHeight(height: number, tolerance?: number): boolean;
    /**
     * Checks if the PageElement eventually exists within a specific timeout.
     *
     * @param opts Includes the `timeout` within which the condition is expected to be met.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     */
    toEventuallyExist(opts?: Workflo.ITimeout): boolean;
    /**
     * Checks if the PageElement eventually becomes visible within a specific timeout.
     *
     * @param opts Includes the `timeout` within which the condition is expected to be met.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     */
    toEventuallyBeVisible(opts?: Workflo.ITimeout): boolean;
    /**
     * Checks if the PageElement eventually becomes enabled within a specific timeout.
     *
     * @param opts Includes the `timeout` within which the condition is expected to be met.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     */
    toEventuallyBeEnabled(opts?: Workflo.ITimeout): boolean;
    /**
     * Checks if the PageElement eventually becomes selected within a specific timeout.
     *
     * @param opts Includes the `timeout` within which the condition is expected to be met.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     */
    toEventuallyBeSelected(opts?: Workflo.ITimeout): boolean;
    /**
     * Checks if the PageElement eventually becomes checked within a specific timeout.
     *
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyBeChecked(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the PageElement eventually has the specified text within a specific timeout.
     *
     * @param text the text which the PageElement is supposed to have
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveText(text: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the PageElement eventually has any text within a specific timeout.
     *
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveAnyText(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the PageElement eventually contains the specified text within a specific timeout.
     *
     * @param text the text which the PageElement is supposed to contain
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyContainText(text: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the PageElement eventually has the specified HTML within a specific timeout.
     *
     * @param html the HTML which the PageElement is supposed to have
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveHTML(html: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the PageElement eventually has any HTML within a specific timeout.
     *
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveAnyHTML(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the PageElement eventually contains the specified HTML within a specific timeout.
     *
     * @param html the HTML which the PageElement is supposed to contain
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyContainHTML(html: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the PageElement eventually has the specified direct text within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the direct text which the PageElement is supposed to have
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveDirectText(directText: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the PageElement eventually has any direct text within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveAnyDirectText(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the PageElement eventually contains the specified direct text within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText the direct text which the PageElement is supposed to contain
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyContainDirectText(directText: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the specified HTML attribute of PageElement eventually has the expected value within a specific timeout.
     *
     * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value it
     * is expected to have
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveAttribute(attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the HTML attribute with the specified attributeName of PageElement eventually has any value within a
     * specific timeout.
     *
     * @param attributeName the specified attributeName of an HTML attribute of PageElement which is supposed to have any
     * value
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveAnyAttribute(attributeName: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the specified HTML attribute of PageElement eventually contains the expected value within a specific
     * timeout.
     *
     * @param attribute the specified HTML attribute of PageElement, consisting of the attribute's name and the value it
     * is expected to contain
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyContainAttribute(attribute: Workflo.IAttribute, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the 'class' HTML attribute of PageElement eventually has the specified className within a specific
     * timeout.
     *
     * @param className the className which the 'class' HTML attribute of PageElement is supposed to have
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveClass(className: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the 'class' HTML attribute of PageElement eventually has any className within a specific timeout.
     *
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveAnyClass(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the 'class' HTML attribute of PageElement eventually contains the specified className within a specific
     * timeout.
     *
     * @param className the className which the 'class' HTML attribute of PageElement is supposed to contain
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyContainClass(className: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the 'id' HTML attribute of PageElement eventually has the specified value within a specific timeout.
     *
     * @param id the value which the 'id' HTML attribute of PageElement is supposed to have
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveId(id: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the 'id' HTML attribute of PageElement eventually has any value within a specific timeout.
     *
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveAnyId(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the 'id' HTML attribute of PageElement eventually contains the specified value within a specific timeout.
     *
     * @param id the value which the 'id' HTML attribute of PageElement is supposed to contain
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyContainId(id: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the 'name' HTML attribute of PageElement eventually has the specified value within a specific timeout.
     *
     * @param id the value which the 'id' HTML attribute of PageElement is supposed to have
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveName(name: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the 'name' HTML attribute of PageElement eventually has any value within a specific timeout.
     *
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveAnyName(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the 'name' HTML attribute of PageElement eventually contains the specified value within a specific
     * timeout.
     *
     * @param id the value which the HTML attribute 'id' of PageElement is supposed to contain
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyContainName(name: string, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if - eventually within a specific timeout - the location of PageElement matches the specified coordinates or
     * if its location deviates no more than the specified tolerances from the specified coordinates.
     *
     * @param coordinates the expected coordinates of PageElement
     * @param opts Includes the `tolerances` used to calculate the maximal allowed deviations from the expected
     * coordinates, the `timeout` within which the condition is expected to be met and the `interval` used to check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveLocation(coordinates: Workflo.ICoordinates, opts?: {
        tolerances?: Partial<Workflo.ICoordinates>;
    } & Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if - eventually within a specific timeout - the x-location of PageElement matches the specified x-location
     * or if PageElement's x-location deviates no more than the specified tolerance from the specified x-location.
     *
     * @param x the expected x-location of PageElement
     * @param opts Includes the `tolerance` used to calculate the maximal allowed deviation from the expected x-location,
     * the `timeout` within which the condition is expected to be met and the `interval` used to check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveX(x: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if - eventually within a specific timeout - the y-location of PageElement matches the specified y-location
     * or if PageElement's y-location deviates no more than the specified tolerance from the specified y-location.
     *
     * @param y the expected y-location of PageElement
     * @param opts Includes the `tolerance` used to calculate the maximal allowed deviation from the expected y-location,
     * the `timeout` within which the condition is expected to be met and the `interval` used to check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveY(y: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if - eventually within a specific timeout - the size of PageElement matches the specified size or if
     * PageElement's size deviates no more than the specified tolerances from the specified size.
     *
     * @param size the expected size of PageElement
     * @param opts Includes the `tolerances` used to calculate the maximal allowed deviations from the expected size,
     * the `timeout` within which the condition is expected to be met and the `interval` used to check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveSize(size: Workflo.ISize, opts?: {
        tolerances?: Partial<Workflo.ISize>;
    } & Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if - eventually within a specific timeout - the width of PageElement matches the specified width or if
     * PageElement's width deviates no more than the specified tolerance from the specified width.
     *
     * @param width the expected width of PageElement
     * @param opts Includes the `tolerance` used to calculate the maximal allowed deviation from the expected width,
     * the `timeout` within which the condition is expected to be met and the `interval` used to check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveWidth(width: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if - eventually within a specific timeout - the height of PageElement matches the specified height or if
     * PageElement's height deviates no more than the specified tolerance from the specified height.
     *
     * @param height the expected height of PageElement
     * @param opts Includes the `tolerance` used to calculate the maximal allowed deviation from the expected height,
     * the `timeout` within which the condition is expected to be met and the `interval` used to check it.
     *
     * If no `timeout` is specified, PageElement's default timeout is used.
     * If no `interval` is specified, PageElement's default interval is used.
     */
    toEventuallyHaveHeight(height: number, opts?: {
        tolerance?: number;
    } & Workflo.ITimeoutInterval): boolean;
}
/**
 * This interface describes custom expectation matchers for PageElementLists.
 *
 * It can be used for both positive and negative (.not) comparisons.
 */
interface ICustomListMatchers {
    /**
     * Checks if the PageElementList currently is empty.
     */
    toBeEmpty(): boolean;
    /**
     * Checks if the length of the PageElementList currently has/not has/is less or is greater than the specified length.
     *
     * @param length the specified length which is compared to PageElementList's actual length
     * @param opts A comparator that defines how to compare the actual length and the expected length of the list
     * (equals, not equals, less than, greater than).
     */
    toHaveLength(length: number, opts?: Workflo.Comparator): boolean;
    /**
     * Checks if the PageElementList eventually is empty within a specific timeout.
     *
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     */
    toEventuallyBeEmpty(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the length of the PageElementList eventually has/not has/is less or is greater than the specified length
     * within a specific timeout.
     *
     * @param length the specified length which is compared to PageElementList's actual length
     * @param opts Includes the `comparator` that defines how to compare the actual length and the expected length of the
     * list (equals, not equals, less than, greater than), the `timeout` within which the condition is expected to be met
     * and the `interval` used to check it.
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     */
    toEventuallyHaveLength(length: number, opts?: IPageElementListWaitLengthParams): boolean;
    /**
     * Checks if at least one of the PageElements managed by PageElementList currently exists.
     *
     * @param filterMask If set to `false`, the existence check will be skipped and the matcher will return true.
     */
    toExist(filterMask?: boolean): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList are currently visible.
     *
     * @param filterMask Can be used to skip the check for some or all managed PageElements.
     */
    toBeVisible(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList are currently enabled.
     *
     * @param filterMask Can be used to skip the check for some or all managed PageElements.
     */
    toBeEnabled(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList currently have the expected text.
     *
     * @param text A single value (used for all managed PageElements) or an array of values with the expected text(s).
     */
    toHaveText(text: string | string[]): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList currently have any text.
     *
     * @param filterMask Can be used to skip the check for some or all managed PageElements.
     */
    toHaveAnyText(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList currently contain the expected text.
     *
     * @param text A single value (used for all managed PageElements) or an array of values with the expected contained
     * text(s).
     */
    toContainText(text: string | string[]): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList currently have the expected direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText A single value (used for all managed PageElements) or an array of values with the expected direct
     * text(s).
     */
    toHaveDirectText(directText: string | string[]): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList currently have any direc text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask Can be used to skip the check for some or all managed PageElements.
     */
    toHaveAnyDirectText(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList currently contain the expected direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText A single value (used for all managed PageElements) or an array of values with the expected
     * contained direct text(s).
     */
    toContainDirectText(directText: string | string[]): boolean;
    /**
     * Checks if at least one of the PageElements managed by PageElementList eventually exists within a specific timeout.
     *
     * @param opts Includes a `filterMask` that, if set to `false`, will cause the existence check to be skipped and the
     * matcher to return true. Furthermore opts also includes the `timeout` within which the condition is expected to be
     * met.
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     */
    toEventuallyExist(opts?: Workflo.ITimeout & {
        filterMask?: boolean;
    }): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList eventually become visible within a specific timeout.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageElements and the
     * `timeout` within which the condition is expected to be met.
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     */
    toEventuallyBeVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList eventually become enabled within a specific timeout.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageElements and the
     * `timeout` within which the condition is expected to be met.
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     */
    toEventuallyBeEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IListFilterMask): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList eventually have the expected text within a specific
     * timeout.
     *
     * @param text A single value (used for all managed PageElements) or an array of values with the expected text(s).
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     */
    toEventuallyHaveText(text: string | string[], opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList eventually have any text within a specific timeout.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageElements, the
     * `timeout` within which the condition is expected to be met and the `interval` used to check it.
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     */
    toEventuallyHaveAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList eventually contain the expected text within a specific
     * timeout.
     *
     * @param text A single value (used for all managed PageElements) or an array of values with the expected contained
     * text(s).
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     */
    toEventuallyContainText(text: string | string[], opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList eventually have the expected direct text within a
     * specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText A single value (used for all managed PageElements) or an array of values with the expected direct
     * text(s).
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     */
    toEventuallyHaveDirectText(directText: string | string[], opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList eventually have any direct text within a specific
     * timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageElements, the
     * `timeout` within which the condition is expected to be met and the `interval` used to check it.
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     */
    toEventuallyHaveAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementList eventually contain the expected direct text within a
     * specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText A single value (used for all managed PageElements) or an array of values with the expected
     * contained direct text(s).
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElementList's default timeout is used.
     * If no `interval` is specified, PageElementList's default interval is used.
     */
    toEventuallyContainDirectText(directText: string | string[], opts?: Workflo.ITimeoutInterval): boolean;
}
/**
 * This interface describes custom expectation matchers for PageElementMaps.
 *
 * It can be used for both positive and negative (.not) comparisons.
 *
 * @template K the names of the elements stored in the map (the map's keys) as string literals
 */
interface ICustomMapMatchers<K extends string> {
    /**
     * Checks if all of the PageElements managed by PageElementMap currently exist.
     *
     * @param filterMask Can be used to skip the check for some or all managed PageElements.
     */
    toExist(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap are currently visible.
     *
     * @param filterMask Can be used to skip the check for some or all managed PageElements.
     */
    toBeVisible(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap are currently enabled.
     *
     * @param filterMask Can be used to skip the check for some or all managed PageElements.
     */
    toBeEnabled(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap currently have the expected text.
     *
     * @param text An object with the names of the corresponding PageElements as keys and the expected texts as values.
     */
    toHaveText(text: Partial<Record<K, string>>): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap currently have any text.
     *
     * @param filterMask Can be used to skip the check for some or all managed PageElements.
     */
    toHaveAnyText(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap currently contain the expected text.
     *
     * @param text An object with the names of the corresponding PageElements as keys and the expected contained texts as
     * values.
     */
    toContainText(text: Partial<Record<K, string>>): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap currently have the expected direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText An object with the names of the corresponding PageElements as keys and the expected direct texts
     * as values.
     */
    toHaveDirectText(directText: Partial<Record<K, string>>): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap currently have any direct text.
     *
     * @param filterMask Can be used to skip the check for some or all managed PageElements.
     */
    toHaveAnyDirectText(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap currently contain the expected direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText An object with the names of the corresponding PageElements as keys and the expected contained
     * direct texts as values.
     */
    toContainDirectText(directText: Partial<Record<K, string>>): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap eventually exist within a specific timeout.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageElements and the
     * `timeout` within which the condition is expected to be met.
     *
     * If no `timeout` is specified, PageElementMap's default timeout is used.
     */
    toEventuallyExist(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap eventually become visible within a specific timeout.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageElements and the
     * `timeout` within which the condition is expected to be met.
     *
     * If no `timeout` is specified, PageElementMap's default timeout is used.
     */
    toEventuallyBeVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap eventually become enabled within a specific timeout.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageElements and the
     * `timeout` within which the condition is expected to be met.
     *
     * If no `timeout` is specified, PageElementMap's default timeout is used.
     */
    toEventuallyBeEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap eventually have the expected text within a specific
     * timeout.
     *
     * @param text An object with the names of the corresponding PageElements as keys and the expected texts as values.
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElementMap's default timeout is used.
     * If no `interval` is specified, PageElementMap's default interval is used.
     */
    toEventuallyHaveText(text: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap eventually have any text within a specific
     * timeout.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageElements, the
     * `timeout` within which the condition is expected to be met and the `interval` used to check it.
     *
     * If no `timeout` is specified, PageElementMap's default timeout is used.
     * If no `interval` is specified, PageElementMap's default interval is used.
     */
    toEventuallyHaveAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap eventually contain the expected text within a specific
     * timeout.
     *
     * @param text An object with the names of the corresponding PageElements as keys and the expected contained texts as
     * values.
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElementMap's default timeout is used.
     * If no `interval` is specified, PageElementMap's default interval is used.
     */
    toEventuallyContainText(text: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap eventually have the expected direct text within a
     * specific timeout.
     *
     * @param directText An object with the names of the corresponding PageElements as keys and the expected direct texts
     * as values.
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElementMap's default timeout is used.
     * If no `interval` is specified, PageElementMap's default interval is used.
     */
    toEventuallyHaveDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap eventually have any direct text within a specific
     * timeout.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageElements, the
     * `timeout` within which the condition is expected to be met and the `interval` used to check it.
     *
     * If no `timeout` is specified, PageElementMap's default timeout is used.
     * If no `interval` is specified, PageElementMap's default interval is used.
     */
    toEventuallyHaveAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): boolean;
    /**
     * Checks if all of the PageElements managed by PageElementMap eventually contain the expected direct text within a
     * specific timeout.
     *
     * @param directText An object with the names of the corresponding PageElements as keys and the expected contained
     * direct texts as values.
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElementMap's default timeout is used.
     * If no `interval` is specified, PageElementMap's default interval is used.
     */
    toEventuallyContainDirectText(directText: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval): boolean;
}
/**
 * This interface describes custom expectation matchers for PageElementGroups.
 *
 * It can be used for both positive and negative (.not) comparisons.
 *
 * @template Content the type of the content managed by the group
 */
interface ICustomGroupMatchers<Content extends Workflo.PageNode.GroupContent> {
    /**
     * Checks if all of the PageNodes defined within the content of PageElementGroup currently exist.
     *
     * @param filterMask Can be used to skip the check for some or all PageNodes defined within the content of
     * PageElementGroup.
     */
    toExist(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    /**
     * Checks if all of the PageNodes defined within the content of PageElementGroup are currently visible.
     *
     * @param filterMask Can be used to skip the check for some or all PageNodes defined within the content of
     * PageElementGroup.
     */
    toBeVisible(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    /**
     * Checks if all of the PageNodes defined within the content of PageElementGroup are currently enabled.
     *
     * @param filterMask Can be used to skip the check for some or all PageNodes defined within the content of
     * PageElementGroup.
     */
    toBeEnabled(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    /**
     * Checks if all of the PageNodes managed by PageElementGroup currently have the expected text.
     *
     * @param text An object with the names of the corresponding PageNodes as keys and the expected texts as values.
     */
    toHaveText(text: Workflo.PageNode.ExtractTextStateChecker<Content>): boolean;
    /**
     * Checks if all of the PageNodes managed by PageElementGroup currently have any text.
     *
     * @param filterMask Can be used to skip the check for some or all PageNodes defined within the content of
     * PageElementGroup.
     */
    toHaveAnyText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    /**
     * Checks if all of the PageNodes managed by PageElementGroup currently contain the expected text.
     *
     * @param text An object with the names of the corresponding PageNodes as keys and the expected contained texts as
     * values.
     */
    toContainText(text: Workflo.PageNode.ExtractTextStateChecker<Content>): boolean;
    /**
     * Checks if all of the PageNodes managed by PageElementGroup currently have the expected direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText An object with the names of the corresponding PageNodes as keys and the expected direct texts as
     * values.
     */
    toHaveDirectText(directText: Workflo.PageNode.ExtractTextStateChecker<Content>): boolean;
    /**
     * Checks if all of the PageNodes managed by PageElementGroup currently have any direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param filterMask Can be used to skip the check for some or all PageNodes defined within the content of
     * PageElementGroup.
     */
    toHaveAnyDirectText(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    /**
     * Checks if all of the PageNodes managed by PageElementGroup currently contain the expected direct text.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText An object with the names of the corresponding PageNodes as keys and the expected contained direct
     * texts as values.
     */
    toContainDirectText(directText: Workflo.PageNode.ExtractTextStateChecker<Content>): boolean;
    /**
     * Checks if all of the PageNodes defined within the content of PageElementGroup eventually exist within a specific
     * timeout.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageElements and the
     * `timeout` within which the condition is expected to be met.
     *
     * If no `timeout` is specified, PageElementGroup's default timeout is used.
     */
    toEventuallyExist(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
    /**
     * Checks if all of the PageNodes defined within the content of PageElementGroup eventually become visible within a
     * specific timeout.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageElements and the
     * `timeout` within which the condition is expected to be met.
     *
     * If no `timeout` is specified, PageElementGroup's default timeout is used.
     */
    toEventuallyBeVisible(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
    /**
     * Checks if all of the PageNodes defined within the content of PageElementGroup eventually become enabled within a
     * specific timeout.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageElements and the
     * `timeout` within which the condition is expected to be met.
     *
     * If no `timeout` is specified, PageElementGroup's default timeout is used.
     */
    toEventuallyBeEnabled(opts?: Workflo.ITimeout & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
    /**
     * Checks if all of the PageNodes defined within the content of PageElementGroup eventually have the expected text
     * within a specific timeout.
     *
     * @param text An object with the names of the corresponding PageNodes as keys and the expected texts as values.
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElementGroup's default timeout is used.
     * If no `interval` is specified, PageElementGroup's default interval is used.
     */
    toEventuallyHaveText(text: Workflo.PageNode.ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if all of the PageNodes defined within the content of PageElementGroup eventually have any text within a
     * specific timeout.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageElements, the
     * `timeout` within which the condition is expected to be met and the `interval` used to check it.
     *
     * If no `timeout` is specified, PageElementGroup's default timeout is used.
     * If no `interval` is specified, PageElementGroup's default interval is used.
     */
    toEventuallyHaveAnyText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
    /**
     * Checks if all of the PageNodes defined within the content of PageElementGroup eventually contain the expected text
     * within a specific timeout.
     *
     * @param text An object with the names of the corresponding PageNodes as keys and the expected contained texts as
     * values.
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElementGroup's default timeout is used.
     * If no `interval` is specified, PageElementGroup's default interval is used.
     */
    toEventuallyContainText(text: Workflo.PageNode.ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if all of the PageNodes defined within the content of PageElementGroup eventually have the expected direct
     * text within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText An object with the names of the corresponding PageNodes as keys and the expected direct texts
     * as values.
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElementGroup's default timeout is used.
     * If no `interval` is specified, PageElementGroup's default interval is used.
     */
    toEventuallyHaveDirectText(directText: Workflo.PageNode.ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if all of the PageNodes defined within the content of PageElementGroup eventually have any direct text
     * within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageNodes, the
     * `timeout` within which the condition is expected to be met and the `interval` used to check it.
     *
     * If no `timeout` is specified, PageElementGroup's default timeout is used.
     * If no `interval` is specified, PageElementGroup's default interval is used.
     */
    toEventuallyHaveAnyDirectText(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
    /**
     * Checks if all of the PageNodes defined within the content of PageElementGroup eventually contain the expected
     * direct text within a specific timeout.
     *
     * A direct text is a text that resides on the level directly below the selected HTML element.
     * It does not include any text of the HTML element's nested children HTML elements.
     *
     * @param directText An object with the names of the corresponding PageNodes as keys and the expected contained
     * direct texts as values.
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, PageElementGroup's default timeout is used.
     * If no `interval` is specified, PageElementGroup's default interval is used.
     */
    toEventuallyContainDirectText(directText: Workflo.PageNode.ExtractTextStateChecker<Content>, opts?: Workflo.ITimeoutInterval): boolean;
}
/**
 * This interface describes custom expectation matchers for ValuePageElements.
 *
 * It can be used for both positive and negative (.not) comparisons.
 *
 * @template ValueType the type of the values handled by this elements' xxxValue functions
 */
interface ICustomValueElementMatchers<ValueType> extends ICustomElementMatchers {
    /**
     * Checks if the ValuePageElement currently has the specified value.
     *
     * @param value the value which the ValuePageElement is supposed to have
     */
    toHaveValue(value: ValueType): boolean;
    /**
     * Checks if the ValuePageElement currently has any value.
     */
    toHaveAnyValue(): boolean;
    /**
     * Checks if the ValuePageElement currently contains the specified value.
     *
     * @param value the value which the ValuePageElement is supposed to contain
     */
    toContainValue(value: ValueType): boolean;
    /**
     * Checks if the ValuePageElement eventually has the specified value within a specific timeout.
     *
     * @param value the value which the PageElement is supposed to have
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, ValuePageElement's default timeout is used.
     * If no `interval` is specified, ValuePageElement's default interval is used.
     */
    toEventuallyHaveValue(value: ValueType, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the ValuePageElement eventually has any value within a specific timeout.
     *
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, ValuePageElement's default timeout is used.
     * If no `interval` is specified, ValuePageElement's default interval is used.
     */
    toEventuallyHaveAnyValue(opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if the ValuePageElement eventually contains the specified value within a specific timeout.
     *
     * @param value the value which the ValuePageElement is supposed to contain
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, ValuePageElement's default timeout is used.
     * If no `interval` is specified, ValuePageElementList's default interval is used.
     */
    toEventuallyContainValue(value: ValueType, opts?: Workflo.ITimeoutInterval): boolean;
}
/**
 * This interface describes custom expectation matchers for ValuePageElementLists.
 *
 * It can be used for both positive and negative (.not) comparisons.
 *
 * @template ValueType the type of the values handled by the list's elements' xxxValue functions
 */
interface ICustomValueListMatchers<ValueType> extends ICustomListMatchers {
    /**
     * Checks if all of the ValuePageElements managed by ValuePageElementList currently have the expected value.
     *
     * @param value A single expected value (used for all managed PageElements) or an array of expected values.
     */
    toHaveValue(value: ValueType | ValueType[]): boolean;
    /**
     * Checks if all of the ValuePageElements managed by ValuePageElementList currently have any value.
     *
     * @param filterMask Can be used to skip the check for some or all managed ValuePageElements.
     */
    toHaveAnyValue(filterMask?: Workflo.PageNode.ListFilterMask): boolean;
    /**
     * Checks if all of the ValuePageElements managed by ValuePageElementList currently contain the expected value.
     *
     * @param value A single expected contained value (used for all managed ValuePageElements) or an array of expected
     * contained values.
     */
    toContainValue(value: ValueType | ValueType[]): boolean;
    /**
     * Checks if all of the ValuePageElements managed by ValuePageElementList eventually have the expected value within a
     * specific timeout.
     *
     * @param value A single expected value (used for all managed ValuePageElements) or an array of expected values.
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, ValuePageElementList's default timeout is used.
     * If no `interval` is specified, ValuePageElementList's default interval is used.
     */
    toEventuallyHaveValue(value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if all of the ValuePageElements managed by ValuePageElementList eventually have any value within a specific
     * timeout.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed ValuePageElements,
     * the `timeout` within which the condition is expected to be met and the `interval` used to check it.
     *
     * If no `timeout` is specified, ValuePageElementList's default timeout is used.
     * If no `interval` is specified, ValuePageElementList's default interval is used.
     */
    toEventuallyHaveAnyValue(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IListFilterMask): boolean;
    /**
     * Checks if all of the ValuePageElements managed by ValuePageElementList eventually have the expected value within a
     * specific timeout.
     *
     * @param value A single expected contained value (used for all managed ValuePageElements) or an array of expected
     * contained values.
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, ValuePageElementList's default timeout is used.
     * If no `interval` is specified, ValuePageElementList's default interval is used.
     */
    toEventuallyContainValue(value: ValueType | ValueType[], opts?: Workflo.ITimeoutInterval): boolean;
}
/**
 * This interface describes custom expectation matchers for ValuePageElementMaps.
 *
 * It can be used for both positive and negative (.not) comparisons.
 *
 * @template K the names of the elements stored in the map (the map's keys) as string literals
 * @template ValueType the type of the values handled by the map's elements' xxxValue functions
 */
interface ICustomValueMapMatchers<K extends string, ValueType> extends ICustomMapMatchers<K> {
    /**
     * Checks if all of the ValuePageElements managed by ValuePageElementMap currently have the expected value.
     *
     * @param value An object with the names of the corresponding ValuePageElements as keys and the expected values as
     * values.
     */
    toHaveValue(value: Partial<Record<K, ValueType>>): boolean;
    /**
     * Checks if all of the ValuePageElements managed by ValuePageElementMap currently have any value.
     *
     * @param filterMask Can be used to skip the check for some or all managed ValuePageElements.
     */
    toHaveAnyValue(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    /**
     * Checks if all of the ValuePageElements managed by ValuePageElementMap currently contain the expected value.
     *
     * @param value An object with the names of the corresponding ValuePageElements as keys and the expected contained
     * values as values.
     */
    toContainValue(value: Partial<Record<K, ValueType>>): boolean;
    /**
     * Checks if all of the ValuePageElements managed by ValuePageElementMap eventually have the expected value within a
     * specific timeout.
     *
     * @param value An object with the names of the corresponding ValuePageElements as keys and the expected values as
     * values.
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, ValuePageElementMap's default timeout is used.
     * If no `interval` is specified, ValuePageElementMap's default interval is used.
     */
    toEventuallyHaveValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Checks if all of the ValuePageElements managed by ValuePageElementMap eventually have any value within a specific
     * timeout.
     *
     * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed ValuePageElements,
     * the `timeout` within which the condition is expected to be met and the `interval` used to check it.
     *
     * If no `timeout` is specified, ValuePageElementMap's default timeout is used.
     * If no `interval` is specified, ValuePageElementMap's default interval is used.
     */
    toEventuallyHaveAnyValue(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): boolean;
    /**
     * Checks if all of the ValuePageElements managed by ValuePageElementMap eventually contain the expected value within
     * a specific timeout.
     *
     * @param value An object with the names of the corresponding ValuePageElements as keys and the expected contained
     * values as values.
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, ValuePageElementMap's default timeout is used.
     * If no `interval` is specified, ValuePageElementMap's default interval is used.
     */
    toEventuallyContainValue(value: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval): boolean;
}
/**
 * This interface describes custom expectation matchers for ValuePageElementGroups.
 *
 * It can be used for both positive and negative (.not) comparisons.
 *
 * @template Content the type of the content managed by the group
 */
interface ICustomValueGroupMatchers<Content extends Workflo.PageNode.GroupContent> extends ICustomGroupMatchers<Content> {
    /**
     * Checks if all of the PageNodes managed by ValuePageElementGroup currently have the expected value.
     *
     * @param value An object with the names of the corresponding PageNodes as keys and the expected values as values.
     */
    toHaveValue(value: Workflo.PageNode.ExtractValueStateChecker<Content>): boolean;
    /**
     * Checks if all of the PageNodes managed by ValuePageElementGroup currently have any value.
     *
     * @param filterMask Can be used to skip the check for some or all PageNodes defined within the content of
     * ValuePageElementGroup.
     */
    toHaveAnyValue(filterMask?: Workflo.PageNode.GroupFilterMask<Content>): boolean;
    /**
     * Checks if all of the PageNodes managed by ValuePageElementGroup currently contain the expected value.
     *
     * @param value An object with the names of the corresponding PageNodes as keys and the expected contained values as
     * values.
     */
    toContainValue(value: Workflo.PageNode.ExtractValueStateChecker<Content>): boolean;
    /**
     * Checks if all of the PageNodes defined within the content of ValuePageElementGroup eventually have the expected
     * value within a specific timeout.
     *
     * @param value An object with the names of the corresponding PageNodes as keys and the expected values as values.
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, ValuePageElementGroup's default timeout is used.
     * If no `interval` is specified, ValuePageElementGroup's default interval is used.
     */
    toEventuallyHaveValue(value: Workflo.PageNode.ExtractValueStateChecker<Content>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
    * Checks if all of the PageNodes defined within the content of ValuePageElementGroup eventually have any value within
    * a specific timeout.
    *
    * @param opts Includes a `filterMask` that can be used to skip the check for some or all managed PageNodes, the
    * `timeout` within which the condition is expected to be met and the `interval` used to check it.
    *
    * If no `timeout` is specified, ValuePageElementGroup's default timeout is used.
    * If no `interval` is specified, ValuePageElementGroup's default interval is used.
    */
    toEventuallyHaveAnyValue(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IGroupFilterMask<Content>): boolean;
    /**
     * Checks if all of the PageNodes defined within the content of ValuePageElementGroup eventually contain the expected
     * value within a specific timeout.
     *
     * @param value An object with the names of the corresponding PageNodes as keys and the expected contained values as
     * values.
     * @param opts Includes the `timeout` within which the condition is expected to be met and the `interval` used to
     * check it.
     *
     * If no `timeout` is specified, ValuePageElementGroup's default timeout is used.
     * If no `interval` is specified, ValuePageElementGroup's default interval is used.
     */
    toEventuallyContainValue(value: Workflo.PageNode.ExtractValueStateChecker<Content>, opts?: Workflo.ITimeoutInterval): boolean;
}
/**
 * This interface describes custom expectation matchers for Page.
 *
 * It can be used for both positive and negative (.not) comparisons.
 *
 * @template IsOpenOpts type of the opts parameter passed to Page's `isOpen` function
 * @template IsClosedOpts type of the opts parameter passed to Page's `isClosed` function
 */
interface ICustomPageMatchers<IsOpenOpts extends {}, IsClosedOpts extends {}> {
    /**
     * Checks if Page is currently open.
     *
     * @param opts the opts parameter passed to Page's `isOpen` function
     */
    toBeOpen(opts?: IsOpenOpts): boolean;
    /**
     * Checks if Page is currently closed.
     *
     * @param opts the opts parameter passed to Page's `isClosed` function
     */
    toBeClosed(opts?: IsClosedOpts): boolean;
    /**
     * Checks if Page is eventually open within a specific timeout.
     *
     * @param opts the opts parameter passed to Page's `eventually.isOpen` function which also includes
     * the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, Page's default timeout is used.
     */
    toEventuallyBeOpen(opts?: Workflo.ITimeout & IsOpenOpts): boolean;
    /**
     * Checks if Page is eventually closed within a specific timeout.
     *
     * @param opts the opts parameter passed to Page's `eventually.isClosed` function which also includes
     * the `timeout` within which the condition is expected to be met
     *
     * If no `timeout` is specified, Page's default timeout is used.
     */
    toEventuallyBeClosed(opts?: Workflo.ITimeout & IsClosedOpts): boolean;
}
/**
 * This interface describes positive and negative (.not) expectation matchers for PageElements.
 *
 * It is implemented by the return value of the `expectElement` function if expectElement was passed an instance of
 * PageElement.
 */
interface IElementMatchers extends ICustomElementMatchers {
    not: ICustomElementMatchers;
}
/**
 * This interface describes positive and negative (.not) expectation matchers for PageElementLists.
 *
 * It is implemented by the return value of the `expectList` function if expectList was passed an instance of
 * PageElementList.
 */
interface IListMatchers extends ICustomListMatchers {
    not: ICustomListMatchers;
}
/**
 * This interface describes positive and negative (.not) expectation matchers for PageElementMaps.
 *
 * It is implemented by the return value of the `expectMap` function if expectMap was passed an instance of
 * PageElementMap.
 *
 * @template K the names of the elements stored in the map (the map's keys) as string literals
 */
interface IMapMatchers<K extends string> extends ICustomMapMatchers<K> {
    not: ICustomMapMatchers<K>;
}
/**
 * This interface describes positive and negative (.not) expectation matchers for PageElementGroups.
 *
 * It is implemented by the return value of the `expectGroup` function if expectGroup was passed an instance of
 * PageElementGroup.
 *
 * @template Content the type of the content managed by the group
 */
interface IGroupMatchers<Content extends Workflo.PageNode.GroupContent> extends ICustomGroupMatchers<Content> {
    not: ICustomGroupMatchers<Content>;
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
    not: ICustomValueElementMatchers<ValueType>;
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
    not: ICustomValueListMatchers<Workflo.ArrayElement<ValueType>>;
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
interface IValueMapMatchers<K extends string, ValueType> extends ICustomValueMapMatchers<K, ValueType> {
    not: ICustomValueMapMatchers<K, ValueType>;
}
/**
 * This interface describes positive and negative (.not) expectation matchers for ValuePageElementGroups.
 *
 * It is implemented by the return value of the `expectGroup` function if expectGroup was passed an instance of
 * ValuePageElementGroup.
 *
 * @template Content the type of the content managed by the group
 */
interface IValueGroupMatchers<Content extends Workflo.PageNode.GroupContent> extends ICustomValueGroupMatchers<Content> {
    not: ICustomValueGroupMatchers<Content>;
}
interface IPageMatchers<IsOpenOpts extends {}, IsClosedOpts extends {}> extends ICustomPageMatchers<IsOpenOpts, IsClosedOpts> {
    not: ICustomPageMatchers<IsOpenOpts, IsClosedOpts>;
}
declare global {
    /**
     * This function provides expectation matchers for PageElements or ValuePageElements.
     *
     * All template type parameters can be inferred automatically.
     *
     * @template Store type of PageNodeStore used by the passed element
     * @template PageElementType type of the passed element
     * @template ValueType If the passed element is an instance of ValuePageElement, this is the type of the values
     * handled in element's xxxValue functions.
     *
     * @param element an instance of PageElement or an instance of ValuePageElement
     * @returns the expectation matchers for PageElement or ValuePageElement
     */
    function expectElement<Store extends pageObjects.stores.PageNodeStore, PageElementType extends pageObjects.elements.PageElement<Store>, ValueType>(element: PageElementType): (typeof element) extends (infer ElementType) ? ElementType extends pageObjects.elements.ValuePageElement<Store, ValueType> ? IValueElementMatchers<ReturnType<ElementType['getValue']>> : IElementMatchers : IElementMatchers;
    /**
     * This function provides expectation matchers for PageElementLists or ValuePageElementLists.
     *
     * All template type parameters can be inferred automatically.
     *
     * @template Store type of PageNodeStore used by the passed list and its elements
     * @template PageElementType type of the element's handled by the passed list
     * @template PageElementOptions options type of the element's handled by the passed list
     * @template PageElementListType type of the passed list
     * @template ValueType If the passed list is an instance of ValuePageElementList, this is the type of the values
     * handled in the xxxValue functions of the elements managed by the list.
     *
     * @param list an instance of PageElementList or an instance of ValuePageElementList
     * @returns the expectation matchers for PageElementList or ValuePageElementList
     */
    function expectList<Store extends pageObjects.stores.PageNodeStore, PageElementType extends pageObjects.elements.PageElement<Store>, PageElementOptions, PageElementListType extends pageObjects.elements.PageElementList<Store, PageElementType, PageElementOptions>, ValueType>(list: PageElementListType): (typeof list) extends (infer ListType) ? ListType extends pageObjects.elements.ValuePageElementList<Store, pageObjects.elements.ValuePageElement<Store, ValueType>, PageElementOptions, ValueType> ? IValueListMatchers<ReturnType<ListType['getValue']>> : IListMatchers : IListMatchers;
    /**
     * This function provides expectation matchers for PageElementMaps or ValuePageElementMaps.
     *
     * All template type parameters can be inferred automatically.
     *
     * @template Store type of PageNodeStore used by the passed map and its elements
     * @template K the names of the elements stored in the map (the map's keys) as string literals
     * @template PageElementType type of the element's handled by the passed map
     * @template PageElementOptions options type of the element's handled by the passed map
     * @template PageElementMapType type of the passed map
     * @template ValueType If the passed map is an instance of ValuePageElementMap, this is the type of the values
     * handled in the xxxValue functions of the elements managed by the map.
     *
     * @param map an instance of PageElementMap or an instance of ValuePageElementMap
     * @returns the expectation matchers for PageElementMap or ValuePageElementMap
     */
    function expectMap<Store extends pageObjects.stores.PageNodeStore, K extends string, PageElementType extends pageObjects.elements.PageElement<Store>, PageElementOptions, PageElementMapType extends pageObjects.elements.PageElementMap<Store, K, PageElementType, PageElementOptions>, ValueType>(map: PageElementMapType): (typeof map) extends (infer MapType) ? MapType extends pageObjects.elements.ValuePageElementMap<Store, K, pageObjects.elements.ValuePageElement<Store, ValueType>, PageElementOptions, any> ? IValueMapMatchers<Extract<keyof typeof map['$'], string>, ReturnType<MapType['getValue']>[keyof typeof map['$']]> : IMapMatchers<Extract<keyof typeof map['$'], string>> : IMapMatchers<Extract<keyof typeof map['$'], string>>;
    /**
     * This function provides expectation matchers for PageElementGroups or ValuePageElementGroups.
     *
     * All template type parameters can be inferred automatically.
     *
     * @template Store type of PageNodeStore used by the passed group
     * @template Content type of the content managed by the passed group
     * @template PageElementGroupType type of the passed group
     *
     * @param group an instance of PageElementGroup or an instance of ValuePageElementGroup
     * @returns the expectation matchers for PageElementGroup or ValuePageElementGroup
     */
    function expectGroup<Store extends pageObjects.stores.PageNodeStore, Content extends Workflo.PageNode.GroupContent, PageElementGroupType extends pageObjects.elements.PageElementGroup<Store, Content>>(group: PageElementGroupType): (typeof group) extends (infer GroupType) ? GroupType extends pageObjects.elements.ValuePageElementGroup<Store, Content> ? IValueGroupMatchers<typeof group['$']> : IGroupMatchers<typeof group['$']> : IGroupMatchers<typeof group['$']>;
    /**
     * This function provides expectation matchers for Pages.
     *
     * All template type parameters can be inferred automatically.
     *
     * @template Store type of PageNodeStore used by the passed element
     * @template PageElementType type of the passed element
     * @template ValueType If the passed element is an instance of ValuePageElement, this is the type of the values
     * handled in element's xxxValue functions.
     *
     * @param element an instance of PageElement or an instance of ValuePageElement
     * @returns the expectation matchers for PageElement or ValuePageElement
     */
    function expectPage<Store extends pageObjects.stores.PageNodeStore, PageType extends pageObjects.pages.Page<Store, IsOpenOpts, IsClosedOpts>, IsOpenOpts extends {}, IsClosedOpts extends {}>(page: PageType): IPageMatchers<IsOpenOpts, IsClosedOpts>;
    namespace WebdriverIO {
        interface Client<T> {
            /**
             * Allows for any type of promise to be resolved in order to continue synchronous code execution.
             */
            resolvePromise<Type>(promise: Promise<Type>): Type;
        }
    }
    namespace Workflo {
        /**
         * Makes all properties of Type optional, except for those whose keys are passed as K.
         */
        type PartialRequire<Type, K extends keyof Type> = Partial<Type> & Pick<Type, K>;
        /**
         * Type is the original object.
         *
         * K represents the original object's property keys to be picked from the original object unaltered.
         *
         * KPartial represents the original object's property keys to be picked from the original object and turned into
         * optional properties.
         */
        type PickPartial<Type, K extends keyof Type, KPartial extends keyof Type> = Pick<Type, K> & Partial<Pick<Type, KPartial>>;
        /**
         * Omits all properties from T whose key names are in K.
         */
        type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
        /**
         * Returns the keys of all properties of T whose values extend U.
         */
        type FilteredKeys<T, U> = {
            [P in keyof T]: T[P] extends U ? P : never;
        }[keyof T];
        /**
         * Returns the keys of all properties of T whose values' ReturnTypes extend U.
         */
        type FilteredKeysByReturnType<T, U> = {
            [P in keyof T]: T[P] extends (...args: any[]) => Workflo.PageNode.IPageNode ? ReturnType<T[P]> extends U ? P : never : P;
        }[keyof T];
        /**
         * Returns the keys of all properties of T whose values are not never.
         */
        type KeysWithoutNever<T> = {
            [P in keyof T]: T[P] extends never ? never : P;
        }[keyof T];
        /**
         * Returns all properties of T whose values are not never.
         */
        type WithoutNever<T> = Pick<T, KeysWithoutNever<T>>;
        /**
         * Reserved for future use when typescript bugs https://github.com/Microsoft/TypeScript/issues/24560 and
         * https://github.com/Microsoft/TypeScript/issues/24791are are resolved.
         */
        type StripNever<T> = T;
        /**
         * Reserved for future use when typescript bugs https://github.com/Microsoft/TypeScript/issues/24560 and
         * https://github.com/Microsoft/TypeScript/issues/24791are are resolved.
         */
        type StripNeverByReturnType<T> = T;
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
         * The type of a webdriverio element returned by `browser.element` or `browser.$`.
         *
         * @see http://v4.webdriver.io/api/protocol/element.html
         */
        type WdioElement = Client<RawResult<Element>> & RawResult<Element>;
        /**
         * The type of webdriverio elements returned by `browser.elements` or `browser.$$`.
         *
         * @see http://v4.webdriver.io/api/protocol/elements.html
         */
        type WdioElements = Client<RawResult<Element[]>> & RawResult<Element[]>;
        /**
         * Use this type instead of {} if you need to define an object
         * which must not have any properties, eg. steps which have no parameters.
         */
        type EmptyObject = {
            [key: string]: never;
        };
        /**
         * @ignore
         */
        interface IJSError {
            notFound: string[];
        }
        /**
         * This interface describes the coordinates of the upper left corner of a PageElement on the page in pixels.
         */
        interface ICoordinates extends Record<string, number> {
            /**
             * X-Location of the upper left corner of a PageElement on the page in pixels
             */
            x: number;
            /**
             * Y-Location of the upper left corner of a PageElement on the page in pixels
             */
            y: number;
        }
        /**
         * This interface describes the size of a PageElement in pixels.
         */
        interface ISize extends Record<string, number> {
            /**
             * Width of a PageElement in pixels
             */
            width: number;
            /**
             * Height of a PageElement in pixels
             */
            height: number;
        }
        /**
         * Tolerances used for comparisons of numbers.
         */
        interface ITolerance extends Record<string, number> {
            /**
             * Lower tolerances bound used for comparisons of numbers.
             */
            lower: number;
            /**
             * Upper tolerances bound used for comparisons of numbers.
             */
            upper: number;
        }
        /**
         * Desribes the result of calling the `scroll` function on PageElement in pixels.
         */
        interface IScrollResult {
            /**
             * Top location of the scrolled element in pixels.
             */
            elemTop: number;
            /**
             * Left location of the scrolled element in pixels.
             */
            elemLeft: number;
            /**
             * Top location of the scroll container in pixels.
             */
            containerTop: number;
            /**
             * Left location of the scrolled container in pixels.
             */
            containerLeft: number;
            /**
             * Value of the HTML scrollTop property of the scroll container in pixels.
             */
            scrollTop: number;
            /**
             * Value of the HTML scrollLeft property of the scroll container in pixels.
             */
            scrollLeft: number;
        }
        /**
         * This interface is used in the parameters of `scrollTo` and `click` actions of PageElement.
         * It allows you to scroll a PageElement that resides inside a scrollable container into view.
         */
        interface IScrollParams {
            /**
             * The XPath selector of the scroll container.
             * If undefined, the closest scrollable parent container is determined automatically.
             */
            containerSelector?: string;
            /**
             * The directions for which scrolling should be performed.
             * Set values to true to enable scrolling into the given direction.
             */
            directions: {
                x?: boolean;
                y?: boolean;
            };
            /**
             * Offsets that will be added to the final scroll position of the scrolled container.
             */
            offsets?: {
                x?: number;
                y?: number;
            };
            /**
             * If no containerSelector is set explicitly, and therefore the scroll container is determined automatically,
             * setting this property to true will also detect scroll containers whose overflow property is set to "hidden".
             * Otherwise, scroll containers with an overflow property set to "hidden" will be ignored.
             */
            closestContainerIncludesHidden?: boolean;
        }
        /**
         * Describes the opts parameter passed to PageElement's click function.
         */
        interface IClickOpts extends ITimeoutInterval {
            /**
             * If defined, the click on PageElement will be repeated until the result of `postCondition` returns true or until
             * a specific timeout is reached.
             *
             * This can be useful, for example, if an HTML element does not react to clicks until a certain async code is
             * finished executing.
             */
            postCondition?: () => boolean;
            /**
             * Before clicking on PageElement, the PageElement will be scrolled into the viewport.
             *
             * By defining customScroll, PageElement's default custom scrolling behavior can be overwritten.
             */
            customScroll?: Workflo.IScrollParams;
        }
        /**
         * Allows you to build an recursively nested object whose values are of type Type.
         */
        interface IRecObj<Type> {
            [key: string]: Type | IRecObj<Type>;
        }
        /**
         * This interface is used to describe parameters passed to functions which periodically check for a certain
         * condition to be met until a timeout is reached (primarily `wait` and `eventually`).
         */
        interface ITimeout {
            /**
             * A timeout in milliseconds.
             */
            timeout?: number;
        }
        /**
         * This interface is used to describe parameters passed to functions which periodically check for a certain
         * condition to be met until a timeout is reached (primarily `wait` and `eventually`). The checks are performed in
         * the defined interval.
         */
        interface ITimeoutInterval extends ITimeout {
            /**
             * An interval in milliseconds.
             */
            interval?: number;
        }
        /**
         * This interface is used to describe parameters passed to functions which check for a certain
         * condition to be met.
         *
         * It allows to set a reverse flag which, if set to true, will check for the condition NOT to be met instead.
         */
        interface IReverse {
            /**
             * Set this flag to true to check for a condition NOT to be met.
             */
            reverse?: boolean;
        }
        /**
         * This interface is used to describe parameters passed to functions which periodically check for a certain
         * condition to be met until a timeout is reached (primarily `wait` and `eventually`).
         *
         * It allows to set a reverse flag which, if set to true, will check for the condition NOT to be met instead.
         */
        interface ITimeoutReverse extends ITimeout, IReverse {
        }
        /**
         * This interface is used to describe parameters passed to functions which periodically check for a certain
         * condition to be met until a timeout is reached (primarily `wait` and `eventually`). The checks are performed in
         * the defined interval.
         *
         * It allows to set a reverse flag which, if set to true, will check for the condition NOT to be met instead.
         */
        interface ITimeoutReverseInterval extends ITimeoutInterval, ITimeoutReverse {
        }
        /**
         * Used for the attribute parameter in the PageElement functions `hasAttribute` and `containsAttribute`
         * and their respective expectation matcher functions.
         */
        interface IAttribute {
            /**
             * The name of an HTML element's attribute.
             */
            name: string;
            /**
             * The value of an HTML element's attribute.
             */
            value: string;
        }
        /**
         * Used when converting PageNodes to JSON.
         */
        interface IElementJSON {
            /**
             * Type of the PageNode (usually its constructor name)
             */
            pageNodeType: string;
            /**
             * An id to identify the PageNode.
             */
            nodeId: string;
        }
        /**
         * Used when converting PageNodes to JSON.
         */
        interface IPageJSON {
            /**
             * Type of the Page (usually its constructor name)
             */
            pageType: string;
        }
        /**
         * Used to get and set the last differences (actual vs expected values) of a PageNode's state check functions
         * (eg. hasText, hasAnyText, containsText) in order to use them in expectation matcher error messages.
         */
        interface ILastDiff {
            /**
             * Retrieves the last differences of a PageNode's check state functions.
             *
             * Intended for framework-internal usage only.
             */
            __lastDiff: IDiff;
            /**
             * Sets the last differences of a PageNode's check state functions.
             *
             * Intended for framework-internal usage only.
             */
            __setLastDiff: (diff: IDiff) => void;
        }
        /**
         * Used to store the last differences (actual vs expected values) of PageNodes' state check functions
         * (eg. hasText, hasAnyText, containsText) in a tree structure in order to use them in expectation matcher error
         * messages.
         */
        interface IDiffTree {
            [key: string]: IDiff;
        }
        /**
         * Used to store the last differences (actual vs expected values) of PageNode's state check functions
         * (eg. hasText, hasAnyText, containsText) in order to use them in expectation matcher error
         * messages.
         */
        interface IDiff {
            /**
             * The constructor name of the PageNode.
             */
            constructorName?: string;
            /**
             * The actual value of a state check function.
             */
            actual?: string;
            /**
             * The expected value of a state check function.
             */
            expected?: string;
            /**
             * The selector of the PageNode.
             */
            selector?: string;
            /**
             * If the PageNode is a PageElementList, PageElementMap or a PageElementGroup,
             * the diffs of the PageElement's handled by PageNode are stored in tree.
             */
            tree?: IDiffTree;
            /**
             * timeout used to perform the last state check function in milliseconds
             */
            timeout?: number;
        }
        /**
         * This interface describes common functionalities of all Pages.
         */
        interface IPage<Store extends pageObjects.stores.PageNodeStore, IsOpenOpts = {}, IsClosedOpts = IsOpenOpts> {
            /**
             * All functions defined inside wait, when invoked, will wait for a condition to be met and throw
             * an error if the condition is never met within a specified timeout.
             */
            wait: {};
            /**
             * All functions defined inside eventually, when invoked, will wait for a condition to be met and return
             * false if the the condition is never met within a specified timeout.
             */
            eventually: {};
            /**
             * Retrieves the last timeout used by Page's `wait` and `eventually` functions.
             *
             * Intended for framework-internal usage only.
             */
            __lastTimeout: number;
            /**
             * Sets the last timeout used by Page's `wait` and `eventually` functions.
             *
             * Intended for framework-internal usage only.
             */
            __setLastTimeout(timeout: number): void;
            /**
             * Returns an instance of PageNodeStore which can be used to retrieve/create PageNodes via Page.
             */
            getStore(): Store;
            /**
             * Returns the default timeout in milliseconds used by Page for its `wait` and `eventually` functions.
             */
            getTimeout(): number;
            /**
             * Returns the default interval in milliseconds used by Page for its `wait` and `eventually` functions.
             */
            getInterval(): number;
            /**
             * Checks if the Page is currently open.
             *
             * @param opts options needed to determine if the Page is currently open
             */
            isOpen(opts?: IsOpenOpts): boolean;
            /**
             * Checks if the Page is currently closed.
             *
             * @param opts options needed to determine if the Page is currently closed
             */
            isClosed(opts?: IsClosedOpts): boolean;
        }
        namespace Store {
            type BaseKeys = 'timeout' | 'waitType';
            type GroupPublicKeys = 'timeout';
            type GroupConstructorKeys = GroupPublicKeys | 'content' | 'store';
            type ElementPublicKeys = BaseKeys | 'customScroll';
            type ListPublicKeys = 'timeout' | 'disableCache' | 'identifier';
            type ListPublicPartialKeys = 'elementOpts';
            type ListConstructorKeys = ListPublicKeys | ListPublicPartialKeys | 'elementStoreFunc';
            type MapPublicKeys = 'identifier' | 'timeout';
            type MapPublicPartialKeys = 'elementOpts';
            type MapConstructorKeys = MapPublicKeys | MapPublicPartialKeys | 'elementStoreFunc';
        }
        namespace PageNode {
            /**
             * This interface describes common functionalities of all PageNodes.
             */
            interface IPageNode extends ILastDiff {
                /**
                 * Retrieves the id used to identify a PageNode in the instance cache of PageNodeStore.
                 *
                 * Intended for framework-internal usage only.
                 */
                __getNodeId(): string;
                /**
                 * Returns a JSON representation of the PageNode.
                 */
                toJSON(): IElementJSON;
                /**
                 * All functions defined inside currently, when invoked, will instantly check if a condition is met and return
                 * false if the condition is not met.
                 */
                currently: {};
                /**
                 * All functions defined inside wait, when invoked, will wait for a condition to be met and throw
                 * an error if the condition is never met within a specified timeout.
                 */
                wait: {};
                /**
                 * All functions defined inside eventually, when invoked, will wait for a condition to be met and return
                 * false if the the condition is never met within a specified timeout.
                 */
                eventually: {};
            }
            /**
             * The content of a PageElementGroup must be an object whose keys are arbitrary names of the PageNodes defined
             * within the content and whose values or the PageNodes themselves.
             */
            type GroupContent = {
                [key: string]: Workflo.PageNode.IPageNode;
            };
            /**
             * Extracts the return value types of the `getText` functions of all PageNodes defined within a PageElementGroup's
             * content. For a PageElement, the extracted return value type will be `string`.
             */
            type ExtractText<T extends {
                [key in keyof T]: IPageNode;
            }> = {
                -readonly [P in keyof T]?: T[P] extends IElementNode<any, any, any> ? ReturnType<T[P]['getText']> : never;
            };
            /**
             * Extracts the return value types of the `getText` functions of all PageNodes defined within a PageElementGroup's
             * content for state check functions. For a PageElement, the extracted return value type will be `string`.
             * Compared to `ExtractText`, this will allow a PageElementList to pass either a single string or
             * an array of strings.
             */
            type ExtractTextStateChecker<T extends {
                [key in keyof T]: IPageNode;
            }> = {
                -readonly [P in keyof T]?: T[P] extends IElementNode<any, any, any> ? TryArrayOrElement<ReturnType<T[P]['getText']>> : never;
            };
            /**
             * Extracts the return value types of the `currently.getExists` functions of all PageNodes defined within a
             * PageElementGroup's content for filter masks.
             * This will allow the a PageElementList to pass either a single boolean or
             * an array of booleans.
             */
            type ExtractExistsFilterMask<T extends {
                [key in keyof T]: IPageNode;
            }> = {
                -readonly [P in keyof T]?: T[P] extends IElementNode<any, any, any> ? TryArrayElement<ReturnType<T[P]['currently']['getExists']>> : never;
            };
            /**
             * Extracts the return value types of the `getIsEnabled` functions of all PageNodes defined within a
             * PageElementGroup's content. For a PageElement, the extracted return value type will be `boolean`.
             */
            type ExtractBoolean<T extends {
                [key in keyof T]: IPageNode;
            }> = {
                -readonly [P in keyof T]?: T[P] extends IElementNode<any, any, any> ? ReturnType<T[P]['getIsEnabled']> : never;
            };
            /**
             * Extracts the return value types of the `getIsEnabled` functions of all PageNodes defined within a
             * PageElementGroup's content for state check functions. For a PageElement, the extracted return value
             * type will be `boolean`.
             * Compared to `ExtractBoolean`, this will allow the a PageElementList to pass either a single boolean or
             * an array of booleans.
             */
            type ExtractBooleanStateChecker<T extends {
                [key in keyof T]: IPageNode;
            }> = {
                -readonly [P in keyof T]?: T[P] extends IElementNode<any, any, any> ? TryArrayOrElement<ReturnType<T[P]['getIsEnabled']>> : never;
            };
            /**
             * This interface is implemented by PageElement, PageElementList, PageElementMap and PageElementGroup.
             *
             * IElementNode guarantees support of the following state retrieval functions:
             *
             * - getIsEnabled
             * - getText
             * - getDirectText
             * - getHasText
             * - getHasAnyText
             * - getContainsText
             * - getHasDirectText
             * - getHasAnyDirectText
             * - getContainsDirectText
             *
             * IElementNode guarantees support of the following state check functions:
             *
             * - exists
             * - isVisible
             * - isEnabled
             * - hasText
             * - hasAnyText
             * - containsText
             * - hasDirectText
             * - hasAnyDirectText
             * - containsDirectText
             *
             * @template TextType type of IElementNode's state retrieval functions (getText...)
             * @template BooleanType type of IElementNode's state compare functions (getHasText...)
             * @template FilterType type of IElementNode's filter mask
             */
            interface IElementNode<TextType, BooleanType, FilterType = any> extends IPageNode, IGetElement<TextType, BooleanType, FilterType> {
                /**
                 * defines an api for all functions of PageNode which check if a condition is currently true or which retrieve a
                 * current value from the tested application's state
                 */
                currently: IGetElement<TextType, BooleanType, FilterType> & ICheckCurrently<TextType, BooleanType, FilterType>;
                /**
                 * defines an api for all functions of PageNode which wait for a condition to become true within a specified
                 * timeout
                 */
                wait: ICheckWait<TextType, BooleanType, FilterType>;
                /**
                 * defines an api for all functions of PageNode which check if a condition eventually becomes true within a
                 * specified timeout
                 */
                eventually: ICheckEventually<TextType, BooleanType, FilterType>;
            }
            /**
             * Used by IElementNode to describe state retrieval functions supported by PageElement, PageElementList,
             * PageElementMap and PageElementGroup.
             */
            interface IGetElement<TextType, BooleanType, FilterType> {
                /**
                 * Returns the 'enabled' status of a PageElement or of the PageElements managed by a PageElementList,
                 * PageElementMap or PageElementGroup.
                 *
                 * @param filterMask can be used to skip the invocation of the state retrieval function for some or all managed
                 * PageElements and not include the skipped results in the total result
                 */
                getIsEnabled(filterMask?: FilterType): BooleanType;
                /**
                 * Returns the text of a PageElement or of the PageElements managed by a PageElementList,
                 * PageElementMap or PageElementGroup.
                 *
                 * @param filterMask can be used to skip the invocation of the state retrieval function for some or all managed
                 * PageElements and not include the skipped results in the total result
                 */
                getText(filterMask?: FilterType): TextType;
                /**
                 * Returns the direct text of a PageElement or of the PageElements managed by a PageElementList,
                 * PageElementMap or PageElementGroup.
                 *
                 * A direct text is a text that resides on the level directly below the selected HTML element.
                 * It does not include any text of the HTML element's nested children HTML elements.
                 *
                 * @param filterMask can be used to skip the invocation of the state retrieval function for some or all managed
                 * PageElements and not include the skipped results in the total result
                 */
                getDirectText(filterMask?: FilterType): TextType;
                /**
                 * Returns the 'hasText' status of a PageElement or of the PageElements managed by a PageElementList,
                 * PageElementMap or PageElementGroup.
                 *
                 * A PageElement's 'hasText' status is set to true if its actual text equals the expected text.
                 *
                 * @param text the expected text used in the comparison which sets the 'hasText' status
                 */
                getHasText(text: TextType): BooleanType;
                /**
                 * Returns the 'hasAnyText' status of a PageElement or of the PageElements managed by a PageElementList,
                 * PageElementMap or PageElementGroup.
                 *
                 * A PageElement's 'hasAnyText' status is set to true if it has any actual text.
                 *
                 * @param filterMask can be used to skip the invocation of the state retrieval function for some or all managed
                 * PageElements and not include the skipped results in the total result
                 */
                getHasAnyText(filterMask?: FilterType): BooleanType;
                /**
                 * Returns the 'containsText' status of a PageElement or of the PageElements managed by a PageElementList,
                 * PageElementMap or PageElementGroup.
                 *
                 * A PageElement's 'containsText' status is set to true if its actual text contains the expected text.
                 *
                 * @param text the expected text used in the comparison which sets the 'containsText' status
                 */
                getContainsText(text: TextType): BooleanType;
                /**
                 * Returns the 'hasDirectText' status of a PageElement or of the PageElements managed by a PageElementList,
                 * PageElementMap or PageElementGroup.
                 *
                 * A PageElement's 'hasDirectText' status is set to true if its actual direct text equals the expected direct
                 * text.
                 *
                 * A direct text is a text that resides on the level directly below the selected HTML element.
                 * It does not include any text of the HTML element's nested children HTML elements.
                 *
                 * @param text the expected direct text used in the comparison which sets the 'hasDirectText' status
                 */
                getHasDirectText(text: TextType): BooleanType;
                /**
                 * Returns the 'hasAnyDirectText' status of a PageElement or of the PageElements managed by a PageElementList,
                 * PageElementMap or PageElementGroup.
                 *
                 * A PageElement's 'hasAnyDirectText' status is set to true if it has any actual text.
                 *
                 * A direct text is a text that resides on the level directly below the selected HTML element.
                 * It does not include any text of the HTML element's nested children HTML elements.
                 *
                 * @param filterMask can be used to skip the invocation of the state retrieval function for some or all managed
                 * PageElements and not include the skipped results in the total result
                 */
                getHasAnyDirectText(filterMask?: FilterType): BooleanType;
                /**
                 * Returns the 'containsDirectText' status of a PageElement or of the PageElements managed by a PageElementList,
                 * PageElementMap or PageElementGroup.
                 *
                 * A PageElement's 'containsDirectText' status is set to true if its actual direct text equals the expected
                 * direct text.
                 *
                 * A direct text is a text that resides on the level directly below the selected HTML element.
                 * It does not include any text of the HTML element's nested children HTML elements.
                 *
                 * @param text the expected direct text used in the comparison which sets the 'containsDirectText' status
                 */
                getContainsDirectText(text: TextType): BooleanType;
            }
            /**
             * Used by IElementNode to describe `wait` state check functions supported by PageElement, PageElementList,
             * PageElementMap and PageElementGroup.
             */
            interface ICheckWait<TextType, BooleanType, FilterType, OptsType = ITimeoutReverseInterval> {
                /**
                 * Waits for a PageElement or for all PageElements managed by a PageElementList, PageElementMap or
                 * PageElementGroup to exist within a specific timeout.
                 *
                 * Throws an error if the condition is not met within the specific timeout.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed PageElements, the `timeout` within which the condition is expected to be met and a
                 * `reverse` flag that, if set to true, checks for the condition NOT to be met instead
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 */
                exists(opts?: OptsType & {
                    filterMask?: FilterType;
                }): IElementNode<TextType, BooleanType, FilterType>;
                /**
                 * Waits for a PageElement or for all PageElements managed by a PageElementList, PageElementMap or
                 * PageElementGroup to be visible.
                 *
                 * Throws an error if the condition is not met within the specific timeout.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed PageElements, the `timeout` within which the condition is expected to be met and a
                 * `reverse` flag that, if set to true, checks for the condition NOT to be met instead
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 */
                isVisible(opts?: OptsType & {
                    filterMask?: FilterType;
                }): IElementNode<TextType, BooleanType, FilterType>;
                /**
                 * Waits for a PageElement or for all PageElements managed by a PageElementList, PageElementMap or
                 * PageElementGroup to be enabled.
                 *
                 * Throws an error if the condition is not met within the specific timeout.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed PageElements, the `timeout` within which the condition is expected to be met and a
                 * `reverse` flag that, if set to true, checks for the condition NOT to be met instead
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 */
                isEnabled(opts?: OptsType & {
                    filterMask?: FilterType;
                }): IElementNode<TextType, BooleanType, FilterType>;
                /**
                 * Waits for a PageElement or for all PageElements managed by a PageElementList, PageElementMap or
                 * PageElementGroup to have an actual text which equals the expected text.
                 *
                 * Throws an error if the condition is not met within the specific timeout.
                 *
                 * @param text the expected text which is supposed to equal the actual text
                 * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
                 * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                hasText(text: TextType, opts?: OptsType): IElementNode<TextType, BooleanType, FilterType>;
                /**
                 * Waits for a PageElement or for all PageElements managed by a PageElementList, PageElementMap or
                 * PageElementGroup to have any text.
                 *
                 * Throws an error if the condition is not met within the specific timeout.
                 *
                 * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
                 * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                hasAnyText(opts?: OptsType & {
                    filterMask?: FilterType;
                }): IElementNode<TextType, BooleanType, FilterType>;
                /**
                 * Waits for a PageElement or for all PageElements managed by a PageElementList, PageElementMap or
                 * PageElementGroup to have an actual text which contains the expected text.
                 *
                 * Throws an error if the condition is not met within the specific timeout.
                 *
                 * @param text the expected text which is supposed to be contained in the actual text
                 * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
                 * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                containsText(text: TextType, opts?: OptsType): IElementNode<TextType, BooleanType, FilterType>;
                /**
                 * Waits for a PageElement or for all PageElements managed by a PageElementList, PageElementMap or
                 * PageElementGroup to have an actual direct text which equals the expected direct text.
                 *
                 * Throws an error if the condition is not met within the specific timeout.
                 *
                 * A direct text is a text that resides on the level directly below the selected HTML element.
                 * It does not include any text of the HTML element's nested children HTML elements.
                 *
                 * @param text the expected direct text which is supposed to equal the actual direct text
                 * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
                 * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                hasDirectText(directText: TextType, opts?: OptsType): IElementNode<TextType, BooleanType, FilterType>;
                /**
                 * Waits for a PageElement or for all PageElements managed by a PageElementList, PageElementMap or
                 * PageElementGroup to have any direct text.
                 *
                 * Throws an error if the condition is not met within the specific timeout.
                 *
                 * A direct text is a text that resides on the level directly below the selected HTML element.
                 * It does not include any text of the HTML element's nested children HTML elements.
                 *
                 * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
                 * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                hasAnyDirectText(opts?: OptsType & {
                    filterMask?: FilterType;
                }): IElementNode<TextType, BooleanType, FilterType>;
                /**
                 * Waits for a PageElement or for all PageElements managed by a PageElementList, PageElementMap or
                 * PageElementGroup to have an actual direct text which contains the expected direct text.
                 *
                 * Throws an error if the condition is not met within the specific timeout.
                 *
                 * A direct text is a text that resides on the level directly below the selected HTML element.
                 * It does not include any text of the HTML element's nested children HTML elements.
                 *
                 * @param text the expected direct text which is supposed to be contained in the actual direct text
                 * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
                 * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                containsDirectText(directText: TextType, opts?: OptsType): IElementNode<TextType, BooleanType, FilterType>;
                /**
                 * returns the negated variants of ICheckWait's state check functions
                 */
                not: Omit<ICheckWait<TextType, BooleanType, FilterType, ITimeoutInterval>, 'not'>;
            }
            /**
             * Used by IElementNode to describe `currently` state check and state retrieval functions supported by
             * PageElement, PageElementList, PageElementMap and PageElementGroup.
             */
            interface ICheckCurrently<TextType, BooleanType, FilterType> {
                /**
                 * Returns the current 'exists' status of a PageElement or of the PageElements managed by a PageElementList,
                 * PageElementMap or PageElementGroup.
                 *
                 * @param filterMask can be used to skip the invocation of the state retrieval function for some or all managed
                 * PageElements and not include the skipped results in the total result
                 */
                getExists(filterMask?: FilterType): BooleanType;
                /**
                 * Returns the current 'visible' status of a PageElement or of the PageElements managed by a PageElementList,
                 * PageElementMap or PageElementGroup.
                 *
                 * @param filterMask can be used to skip the invocation of the state retrieval function for some or all managed
                 * PageElements and not include the skipped results in the total result
                 */
                getIsVisible(filterMask?: FilterType): BooleanType;
                /**
                 * Returns the current 'enabled' status of a PageElement or of the PageElements managed by a PageElementList,
                 * PageElementMap or PageElementGroup.
                 *
                 * @param filterMask can be used to skip the invocation of the state retrieval function for some or all managed
                 * PageElements and not include the skipped results in the total result
                 */
                getIsEnabled(filterMask?: FilterType): BooleanType;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * currently exist.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed PageElements
                 */
                exists(filterMask?: FilterType): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * currently is visible.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed PageElements
                 */
                isVisible(filterMask?: FilterType): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * currently is enabled.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed PageElements
                 */
                isEnabled(filterMask?: FilterType): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * currently have an actual text which equals the expected text.
                 *
                 * @param text the expected text which is supposed to equal the actual text
                 */
                hasText(text: TextType): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * currently have any text.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed PageElements
                 */
                hasAnyText(filterMask?: FilterType): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * currently have an actual text which contains the expected text.
                 *
                 * @param text the expected text which is supposed to be contained in the actual text
                 */
                containsText(text: TextType): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * currently have an actual direct text which equals the expected direct text.
                 *
                 * A direct text is a text that resides on the level directly below the selected HTML element.
                 * It does not include any text of the HTML element's nested children HTML elements.
                 *
                 * @param directText the expected direct text which is supposed to equal the actual direct text
                 */
                hasDirectText(directText: TextType): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * currently have any direct text.
                 *
                 * A direct text is a text that resides on the level directly below the selected HTML element.
                 * It does not include any text of the HTML element's nested children HTML elements.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed PageElements
                 */
                hasAnyDirectText(filterMask?: FilterType): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * currently have an actual direct text which contains the expected direct text.
                 *
                 * A direct text is a text that resides on the level directly below the selected HTML element.
                 * It does not include any text of the HTML element's nested children HTML elements.
                 *
                 * @param directText the expected direct text which is supposed to be contained in the actual direct text
                 */
                containsDirectText(directText: TextType): boolean;
                /**
                 * returns the negated variants of ICheckCurrently's state check functions
                 */
                not: Omit<ICheckCurrently<TextType, BooleanType, FilterType>, 'not' | 'getExists' | 'getIsVisible' | 'getIsEnabled'>;
            }
            /**
             * Used by IElementNode to describe `eventually` state check functions supported by PageElement, PageElementList,
             * PageElementMap and PageElementGroup.
             */
            interface ICheckEventually<TextType, BooleanType, FilterType> {
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * eventually exist within a specific timeout.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed PageElements and the `timeout` within which the condition is expected to be met
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 */
                exists(opts?: ITimeout & {
                    filterMask?: FilterType;
                }): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * eventually becomes visible within a specific timeout.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed PageElements and the `timeout` within which the condition is expected to be met
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 */
                isVisible(opts?: ITimeout & {
                    filterMask?: FilterType;
                }): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * eventually becomes enabled within a specific timeout.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed PageElements and the `timeout` within which the condition is expected to be met
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 */
                isEnabled(opts?: ITimeout & {
                    filterMask?: FilterType;
                }): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * eventually have an actual text which equals the expected text within a specific timeout.
                 *
                 * @param text the expected text which is supposed to equal the actual text
                 * @param opts includes the `timeout` within which the condition is expected to be met and the
                 * `interval` used to check it
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                hasText(text: TextType, opts?: ITimeoutInterval): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * eventually have any text within a specific timeout.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed PageElements, the `timeout` within which the condition is expected to be met and the
                 * `interval` used to check it
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                hasAnyText(opts?: ITimeoutInterval & {
                    filterMask?: FilterType;
                }): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * eventually have an actual text which contains the expected text within a specific timeout.
                 *
                 * @param text the expected text which is supposed to be contained in the actual text
                 * @param opts includes the `timeout` within which the condition is expected to be met and the
                 * `interval` used to check it
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                containsText(text: TextType, opts?: ITimeoutInterval): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * eventually have an actual direct text which equals the expected direct text within a specific timeout.
                 *
                 * A direct text is a text that resides on the level directly below the selected HTML element.
                 * It does not include any text of the HTML element's nested children HTML elements.
                 *
                 * @param directText the expected direct text which is supposed to equal the actual direct text
                 * @param opts includes the `timeout` within which the condition is expected to be met and the
                 * `interval` used to check it
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                hasDirectText(text: TextType, opts?: ITimeoutInterval): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * eventually have any direct text within a specific timeout.
                 *
                 * A direct text is a text that resides on the level directly below the selected HTML element.
                 * It does not include any text of the HTML element's nested children HTML elements.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed PageElements, the `timeout` within which the condition is expected to be met and the
                 * `interval` used to check it
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                hasAnyDirectText(opts?: ITimeoutInterval & {
                    filterMask?: FilterType;
                }): boolean;
                /**
                 * Checks if a PageElement or all PageElements managed by a PageElementList, PageElementMap or PageElementGroup
                 * eventually have an actual direct text which contains the expected direct text within a specific timeout.
                 *
                 * A direct text is a text that resides on the level directly below the selected HTML element.
                 * It does not include any text of the HTML element's nested children HTML elements.
                 *
                 * @param directText the expected direct text which is supposed to be contained in the actual direct text
                 * @param opts includes the `timeout` within which the condition is expected to be met and the
                 * `interval` used to check it
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                containsDirectText(text: TextType, opts?: ITimeoutInterval): boolean;
                /**
                 * returns the negated variants of ICheckEventually's state check functions
                 */
                not: Omit<ICheckEventually<TextType, BooleanType, FilterType>, 'not'>;
            }
            /**
             * Extracts the return value types of the `getValue` functions of all PageNodes defined within a
             * ValuePageElementGroup's content.
             */
            type ExtractValue<T extends {
                [key: string]: IPageNode;
            }> = {
                -readonly [P in keyof T]?: T[P] extends IValueElementNode<any, any> ? ReturnType<T[P]['getValue']> : never;
            };
            /**
             * Extracts the return value types of the `getValue` functions of all PageNodes defined within a
             * ValuePageElementGroup's content for state check functions and the setValue function.
             * Compared to `ExtractValue`, this will allow ta PageElementList to pass either a single value or
             * an array of values.
             */
            type ExtractValueStateChecker<T extends {
                [key: string]: IPageNode;
            }> = {
                -readonly [P in keyof T]?: T[P] extends IValueElementNode<any, any> ? TryArrayOrElement<ReturnType<T[P]['getValue']>> : never;
            };
            /**
             * Extracts the return value types of the `getHasValue` functions of all PageNodes defined within a
             * ValuePageElementGroup's content. For a ValuePageElement, the extracted return value type will be `boolean`.
             */
            type ExtractValueBoolean<T extends {
                [key in keyof T]: IPageNode;
            }> = {
                -readonly [P in keyof T]?: T[P] extends IValueElementNode<any, any> ? ReturnType<T[P]['getHasValue']> : never;
            };
            /**
             * Extracts the return value types of the `getHasValue` functions of all PageNodes defined within a
             * ValuePageElementGroup's content for state check functions. For a ValuePageElement, the extracted
             * return value type will be `boolean`.
             * Compared to `ExtractValueBoolean`, this will allow a ValuePageElementList to pass either a
             * single boolean or an array of booleans.
             */
            type ExtractValueBooleanStateChecker<T extends {
                [key in keyof T]: IPageNode;
            }> = {
                -readonly [P in keyof T]?: T[P] extends IValueElementNode<any, any> ? TryArrayOrElement<ReturnType<T[P]['getHasValue']>> : never;
            };
            /**
             * Reserved for future use when typescript bugs https://github.com/Microsoft/TypeScript/issues/24560 and
             * https://github.com/Microsoft/TypeScript/issues/24791are are resolved.
             */
            type ExtractValueBooleanWN<T extends {
                [key in keyof T]: IPageNode;
            }> = {
                -readonly [P in keyof T]?: T[P] extends IValueElementNode<any, any> ? WithoutNever<TryArrayOrElement<ReturnType<T[P]['getHasValue']>>> : never;
            };
            /**
             * This interface is implemented by ValuePageElement, ValuePageElementList, ValuePageElementMap and
             * ValuePageElementGroup.
             *
             * IValueElementNode guarantees support of the following state retrieval functions:
             *
             * - getValue
             * - getHasValue
             * - getHasAnyValue
             * - getContainsValue
             *
             * IValueElementNode guarantees support of the following state check functions:
             *
             * - hasValue
             * - hasAnyValue
             * - containsValue
             *
             * @template GetType type of IValueElementNode's state retrieval functions (getValue)
             * @template FilterType type of IValueElementNode's filter mask
             * @template SetType type of a setter values structure used by a IValueElementNode's setter functions
             */
            interface IValueElementNode<GetType, FilterType = any, SetType = GetType> extends IPageNode, IGetValueElement<GetType, FilterType> {
                /**
                 * defines an api for all functions of PageNode which check if a condition is currently true or which retrieve a
                 * current value from the tested application's state
                 */
                currently: IGetValueElement<GetType, FilterType> & ICheckValueCurrently<GetType, FilterType>;
                /**
                 * defines an api for all functions of PageNode which wait for a condition to become true within a specified
                 * timeout
                 */
                wait: ICheckWaitValue<GetType, FilterType>;
                /**
                 * defines an api for all functions of PageNode which check if a condition eventually becomes true within a
                 * specified timeout
                 */
                eventually: ICheckValueEventually<GetType, FilterType>;
                /**
                 * Sets the value of a ValuePageElement or of all ValuePageElements managed by ValuePageElementList,
                 * ValuePageElementMap or ValuePageElementGroup.
                 */
                setValue(value: SetType): IValueElementNode<GetType, FilterType, SetType>;
            }
            /**
             * Used by IValueElementNode to describe state retrieval functions supported by ValuePageElement,
             * ValuePageElementList, ValuePageElementMap and ValuePageElementGroup.
             */
            interface IGetValueElement<GetType, FilterType> {
                /**
                 * Returns the value of a ValuePageElement or of the ValuePageElements managed by a ValuePageElementList,
                 * ValuePageElementMap or ValuePageElementGroup.
                 *
                 * @param filterMask can be used to skip the invocation of the state retrieval function for some or all managed
                 * PageElements and not include the skipped results in the total result
                 */
                getValue(filterMask?: FilterType): GetType;
                /**
                 * Returns the 'hasValue' status of a ValuePageElement or of the ValuePageElements managed by
                 * ValuePageElementList, ValuePageElementMap or ValuePageElementGroup.
                 *
                 * A ValuePageElement's 'hasValue' status is set to true if its actual value equals the expected value.
                 *
                 * @param value the expected value used in the comparison which sets the 'hasValue' status
                 */
                getHasValue(value: GetType): FilterType;
                /**
                 * Returns the 'hasAnyValue' status of a ValuePageElement or of the ValuePageElements managed by
                 * ValuePageElementList, ValuePageElementMap or ValuePageElementGroup.
                 *
                 * @param filterMask can be used to skip the invocation of the state retrieval function for some or all managed
                 * PageElements and not include the skipped results in the total result
                 */
                getHasAnyValue(filterMask?: FilterType): FilterType;
                /**
                 * Returns the 'containsValue' status of a ValuePageElement or of the ValuePageElements managed by
                 * ValuePageElementList, ValuePageElementMap or ValuePageElementGroup.
                 *
                 * A ValuePageElement's 'hasValue' status is set to true if its actual value contains the expected value.
                 *
                 * @param value the expected value used in the comparison which sets the 'containsValue' status
                 */
                getContainsValue(value: GetType): FilterType;
            }
            /**
             * Used by IValueElementNode to describe `wait` state check functions supported by ValuePageElement,
             * ValuePageElementList, ValuePageElementMap and ValuePageElementGroup.
             */
            interface ICheckWaitValue<ValueType, FilterType, OptsType = ITimeoutReverseInterval> {
                /**
                 * Waits for a ValuePageElement or for all ValuePageElements managed by a ValuePageElementList,
                 * ValuePageElementMap or ValuePageElementGroup to have an actual value which equals the expected value.
                 *
                 * Throws an error if the condition is not met within the specific timeout.
                 *
                 * @param value the expected value which is supposed to equal the actual value
                 * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
                 * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                hasValue(value: ValueType, opts?: OptsType): IValueElementNode<ValueType, FilterType>;
                /**
                 * Waits for a ValuePageElement or for all ValuePageElements managed by a ValuePageElementList,
                 * ValuePageElementMap or ValuePageElementGroup to have any value.
                 *
                 * Throws an error if the condition is not met within the specific timeout.
                 *
                 * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
                 * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                hasAnyValue(opts?: OptsType & {
                    filterMask?: FilterType;
                }): IValueElementNode<ValueType, FilterType>;
                /**
                 * Waits for a ValuePageElement or for all ValuePageElements managed by a ValuePageElementList,
                 * ValuePageElementMap or ValuePageElementGroup to have an actual value which contains the expected value.
                 *
                 * Throws an error if the condition is not met within the specific timeout.
                 *
                 * @param value the expected value which is supposed to be contained in the actual value
                 * @param opts includes the `timeout` within which the condition is expected to be met, the `interval` used to
                 * check it and a `reverse` flag that, if set to true, checks for the condition NOT to be met instead
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                containsValue(value: ValueType, opts?: OptsType): IValueElementNode<ValueType, FilterType>;
                /**
                 * returns the negated variants of ICheckWaitValue's state check functions
                 */
                not: Omit<ICheckWaitValue<ValueType, FilterType, ITimeoutInterval>, 'not'>;
            }
            /**
             * Used by IValueElementNode to describe `currently` state check and state retrieval functions supported by
             * ValuePageElement, ValuePageElementList, ValuePageElementMap and ValuePageElementGroup.
             */
            interface ICheckValueCurrently<ValueType, FilterType> {
                /**
                 * Checks if a ValuePageElement or all ValuePageElements managed by a ValuePageElementList, ValuePageElementMap
                 * or ValuePageElementGroup currently have an actual value which equals the expected value.
                 *
                 * @param value the expected value which is supposed to equal the actual value
                 */
                hasValue(value: ValueType): boolean;
                /**
                 * Checks if a ValuePageElement or all ValuePageElements managed by a ValuePageElementList, ValuePageElementMap
                 * or ValuePageElementGroup currently have any value.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed ValuePageElements
                 */
                hasAnyValue(filterMask?: FilterType): boolean;
                /**
                 * Checks if a ValuePageElement or all ValuePageElements managed by a ValuePageElementList, ValuePageElementMap
                 * or ValuePageElementGroup currently have an actual value which contains the expected value.
                 *
                 * @param value the expected value which is supposed to be contained in the actual value
                 */
                containsValue(value: ValueType): boolean;
                /**
                 * returns the negated variants of ICheckValueCurrently's state check functions
                 */
                not: Omit<ICheckValueCurrently<ValueType, FilterType>, 'not'>;
            }
            /**
             * Used by IValueElementNode to describe `eventually` state check functions supported by ValuePageElement,
             * ValuePageElementList, ValuePageElementMap and ValuePageElementGroup.
             */
            interface ICheckValueEventually<ValueType, FilterType> {
                /**
                 * Checks if a ValuePageElement or all ValuePageElements managed by a ValuePageElementList, ValuePageElementMap
                 * or ValuePageElementGroup eventually have an actual value which equals the expected value within a
                 * specific timeout.
                 *
                 * @param value the expected value which is supposed to equal the actual value
                 * @param opts includes the `timeout` within which the condition is expected to be met and the
                 * `interval` used to check it
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                hasValue(value: ValueType, opts?: ITimeoutInterval): boolean;
                /**
                 * Checks if a ValuePageElement or all ValuePageElements managed by a ValuePageElementList, ValuePageElementMap
                 * or ValuePageElementGroup eventually have any value within a specific timeout.
                 *
                 * @param opts includes `filterMask` which can be used to skip the invocation of the state check function for
                 * some or all managed PageElements, the `timeout` within which the condition is expected to be met and the
                 * `interval` used to check it
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                hasAnyValue(opts?: ITimeoutInterval & {
                    filterMask?: FilterType;
                }): boolean;
                /**
                 * Checks if a ValuePageElement or all ValuePageElements managed by a ValuePageElementList, ValuePageElementMap
                 * or ValuePageElementGroup eventually have an actual value which contains the expected value within a specific
                 * timeout.
                 *
                 * @param value the expected value which is supposed to be contained in the actual value
                 * @param opts includes the `timeout` within which the condition is expected to be met and the
                 * `interval` used to check it
                 *
                 * If no `timeout` is specified, PageNode's default timeout is used.
                 * If no `interval` is specified, PageNode's default interval is used.
                 */
                containsValue(value: ValueType, opts?: ITimeoutInterval): boolean;
                /**
                 * returns the negated variants of ICheckValueEventually's state check functions
                 */
                not: Omit<ICheckValueEventually<ValueType, FilterType>, 'not'>;
            }
            /**
             * A filter mask can be passed as a parameter to PageElementList functions that invoke a 'child' function on each
             * of the PageElements managed by the list.
             *
             * The filter mask can be used to skip the invocation of some or all of these 'child' functions:
             *
             * - Setting the value of ListFilterMask to `false` causes all 'child' function invocations to be skipped.
             * - Setting the value of ListFilterMask to an array and the value of an array element to `false`, `null` or
             * `undefined` causes the 'child' function invocation of the PageElement whose index in PageElementList's `all`
             * array corresponds to the index of the element in the ListFilterMask array to be skipped.
             *
             * Using a filter mask has the following implications for the return value of a PageElementList function:
             *
             * - A state check function (hasXXX, hasAnyXXX, containsXXX in `currently` and `eventually`) whose filter mask
             * skips all 'child' functions always returns `true`.
             * - A state retrieval function (getXXX) whose filter mask skips all 'child' functions returns an empty array.
             * - The return value of a state retrieval function's 'child' function whose invocation is skipped by the filter
             * mask will not be written to the results array of the state retrieval function. The length of the results array
             * can therefore differ from the number of PageElements managed by PageElementList.
             */
            type ListFilterMask = boolean | boolean[];
            /**
             * A filter mask can be passed as a parameter to PageElementMap functions that invoke a 'child' function on each
             * of the PageElements managed by the map.
             *
             * The filter mask can be used to skip the invocation of some or all of these 'child' functions:
             *
             * - Omitting a property in MapFilterMask or setting the value of a property in MapFilterMask to `false`, `null`
             * or `undefined` causes the 'child' function invocation of the corresponding PageElement
             * (which has the same key name as the filter mask entry) to be skipped.
             *
             * Using a filter mask has the following implications for the return value of a PageElementMap function:
             *
             * - A state check function (hasXXX, hasAnyXXX, containsXXX in `currently` and `eventually`) whose filter mask
             * skips all 'child' functions always returns `true`.
             * - A state retrieval function (getXXX) whose filter mask skips all 'child' functions returns an empty object.
             * - For a state retrieval function's 'child' function whose invocation is skipped by the filter mask,
             * no property will be created in the state retrieval function's result object. Therefore, the property whose key
             * name matches the key name of the skipped filter mask entry will be missing from the state retrieval function's
             * result object.
             */
            type MapFilterMask<K extends string> = Partial<Record<K, boolean>>;
            /**
             * A filter mask can be passed as a parameter to PageElementGroup functions that invoke a 'child' function on each
             * of the PageNodes defined inside the group's content.
             *
             * The filter mask can be used to skip the invocation of some or all of these 'child' functions:
             *
             * - Omitting a property in GroupFilterMask or setting the value of a property in GroupFilterMask to `null` or
             * `undefined` causes the 'child' function invocation of the corresponding PageNode
             * (which has the same key name as the filter mask entry) to be skipped.
             * - Setting the value of a filter mask entry which maps to a PageElement (by having the same key name as the
             * filter mask entry) to `false` causes the 'child' function invocation of this PageElement to be skipped.
             *
             * Using a filter mask has the following implications for the return value of a PageElementGroup function:
             *
             * - A state check function (hasXXX, hasAnyXXX, containsXXX in `currently` and `eventually`) whose filter mask
             * skips all 'child' functions always returns `true`.
             * - A state retrieval function (getXXX) whose filter mask skips all 'child' functions returns an empty object.
             * - For a state retrieval function's 'child' function whose invocation is skipped by the filter mask,
             * no property will be created in the state retrieval function's result object. Therefore, the property whose key
             * name matches the key name of the skipped filter mask entry will be missing from the state retrieval function's
             * result object.
             */
            type GroupFilterMask<Content extends GroupContent> = Workflo.PageNode.ExtractBooleanStateChecker<Content>;
            /**
             * Type of the filter mask used by exist functions of PageElementGroup.
             */
            type GroupFilterMaskExists<Content extends GroupContent> = Workflo.PageNode.ExtractExistsFilterMask<Content>;
            /**
             * Type of the filter mask used by functions of ValuePageElementGroup.
             */
            type ValueGroupFilterMask<Content extends GroupContent> = Workflo.PageNode.ExtractValueBooleanStateChecker<Content>;
            /**
             * Reserved for future use when typescript bugs https://github.com/Microsoft/TypeScript/issues/24560 and
             * https://github.com/Microsoft/TypeScript/issues/24791 are are resolved.
             */
            type ValueGroupFilterMaskWN<Content extends GroupContent> = WithoutNever<Partial<Workflo.PageNode.ExtractValueBooleanWN<Content>>>;
            /**
             * Used to merge a filter mask into the opts parameter of a PageElementList's functions.
             */
            interface IListFilterMask {
                filterMask?: ListFilterMask;
            }
            /**
             * Used to merge a filter mask into the opts parameter of a PageElementMap's functions.
             */
            interface IMapFilterMask<K extends string> {
                filterMask?: Partial<Record<K, boolean>>;
            }
            /**
             * Used to merge a filter mask into the opts parameter of a PageElementGroup's functions.
             */
            interface IGroupFilterMask<Content extends GroupContent> {
                filterMask?: Partial<Workflo.PageNode.ExtractBooleanStateChecker<Content>>;
            }
            /**
             * Used to merge a filter mask into the opts parameter of a PageElementGroup's exist functions.
             */
            interface IGroupFilterMaskExists<Content extends GroupContent> {
                filterMask?: Partial<Workflo.PageNode.ExtractExistsFilterMask<Content>>;
            }
            /**
             * Used to merge a filter mask into the opts parameter of a ValuePageElementGroup's functions.
             */
            interface IValueGroupFilterMask<Content extends GroupContent> {
                filterMask?: Partial<Workflo.PageNode.ExtractValueBooleanStateChecker<Content>>;
            }
        }
        /**
         * @ignore
         */
        type Value = string | boolean | number;
        /**
         * This enum describes the four possible initial waiting types supported by wdio-workflo.
         *
         * Every time an interaction with the tested application takes place via a PageElement's action (eg. click),
         * an initial wait condition will be performed before executing the specified action:
         *
         * - 'exist' waits for the PageElement to exist in the DOM
         * - 'visible' waits for the PageElement to become visible (this will not be the case if the
         * PageElement is obscured by another element, hidden or not existing )
         * - 'text' waits for the PageElement to have any text (this will not be the case if the PageElement does not exist,
         * is not visible, or has no text at all)
         * - 'value' waits for the PageElement to have any value (this will not be the case if the PageElement does not
         * exist, is not visible, or has no value at all)
         */
        export import WaitType = enums.WaitType;
        /**
         * This enum is used to perform comparisons of numbers.
         */
        export import Comparator = enums.Comparator;
        /**
         * XPath can be supplied to wdio-workflo either via an XPathBuilder or as a raw XPath string
         */
        type XPath = pageObjects.builders.XPathBuilder | string;
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
            function mapProperties<T, O, K extends string>(input: Record<K, T>, func: (value: T, key?: K) => O): Record<K, O>;
            /**
             * Iterates over all properties in an object and executes func on each.
             *
             * @param input
             * @param func
             */
            function forEachProperty<T, K extends string>(input: Record<K, T>, func: (value: T, key?: K) => void): Record<K, T>;
            /**
             * Returns a new object with the original object's keys and values inverted.
             * The original object's values must therefore be implicitly convertable to type string.
             *
             * @param obj
             */
            function invert<K extends string>(obj: Record<K, string>): Record<string, K>;
            /**
             * Returns a new filtered object that only contains those
             * properties of the initial object where func returned true.
             *
             * Does not traverse nested objects!
             *
             * @param obj
             * @param func
             */
            function filter<T>(obj: Record<string, T>, func: (value: T, key?: string) => boolean): Record<string, T>;
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
            function addToProp<T, K extends string>(obj: Record<K, T | T[]>, key: K, value: T, overwrite?: boolean): Record<K, T | T[]>;
            /**
             * Creates a copy of original object in which all
             * key-value pairs matching the passed props are removed.
             *
             * @param obj
             * @param props
             */
            function stripProps<T>(obj: Record<string, T>, props: string[]): Record<string, T>;
            /**
             * Returns properties of obj whose keys are also present in
             * subsetObj as a new object.
             *
             * Does not traverse nested objects!
             *
             * @param obj
             * @param matchingObject
             */
            function subset<T, O>(obj: Record<string, T>, maskObject: Record<string, O>): Record<string, T>;
            /**
             * Returns a new object where all properties with a boolean value of false are stripped recursively.
             * @param obj
             */
            function stripMaskDeep(obj: Workflo.IRecObj<boolean>): Workflo.IRecObj<boolean>;
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
            function mapToObject<T>(input: string[], mapFunc: (element: string) => T): {
                [key: string]: T;
            };
        }
        namespace String {
            /**
              * Splits a string at delim and returns an object with the
              * split string parts as keys and the values set to true.
              *
              * @param str
              * @param delim
              */
            function splitToObj(str: string, delim: string | RegExp): {
                [part: string]: boolean;
            };
            /**
             * Removes all whitespace characters from a string.
             *
             * @param str
             */
            function stripWhitespaces(str: string): string;
        }
        namespace Class {
            /**
             * Returns names of all methods of a ES6 class (except for constructor).
             *
             * see http://stackoverflow.com/questions/31054910/get-functions-methods-of-a-class
             *
             * @param obj
             */
            function getAllMethods(obj: any): string[];
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
            function convertToObject<T>(unknownTypedInput: {
                [key: string]: T;
            } | string[] | string, valueFunc?: (key: string) => T): {
                [key: string]: T;
            };
            /**
             * Compares two variables of same type.
             *
             * @param var1
             * @param var2
             * @param operator
             */
            function compare<Type>(var1: Type, var2: Type, operator: Workflo.Comparator): boolean;
        }
        /**
         * @ignore
         */
        interface IFilterList {
            listFiles?: string[];
            specFiles?: string[];
            testcaseFiles?: string[];
            features?: string[];
            specs?: string[];
            testcases?: string[];
        }
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
            [key: number]: {
                result: boolean;
                date: string;
                comment?: string;
            };
        }
        /**
         * This interface describes an object that defines the results of manually executed testcases to also include them
         * in the test report.
         *
         * The object's keys are the ids of the manually validated Stories (eg. "2.4.5") and its values are objects which
         * implement IManualCriteria.
         */
        interface IManualTestcaseResults {
            [key: string]: IManualCriteria;
        }
        /**
         * @ignore
         */
        type StepImpl = <ArgsType extends Object, ReturnType>(params: IStepParams<ArgsType, ReturnType>) => IStep;
        /**
         * @ignore
         */
        type StepImplMap = {
            [key: string]: StepImpl;
        };
        /**
         * Severity describes how severe the implications of something not working correctly would be.
         */
        type Severity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';
        /**
         * The result status of a testcase.
         */
        type TestcaseStatus = 'passed' | 'failed' | 'broken' | 'unknown' | 'pending';
        /**
         * The result status of a validation/an acceptance criteria of a Story.
         */
        type SpecStatus = 'passed' | 'failed' | 'broken' | 'unvalidated' | 'unknown' | 'pending';
        /**
         * This interface is implemented by the return value of a Story's `Given` function.
         *
         * It can be used to chain multiple `Given` functions together sequentially by calling `.And` in order to create an
         * initial state.
         */
        interface ISpecGiven {
            /**
             * Call this function to chain multiple `Given` functions together sequentially in order to create an initial
             * state.
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
            And: (description: string, bodyFunc?: () => void) => ISpecGiven;
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
             * To validate the state following a state change with acceptance criteria, use `Then` inside the bodyFunc of
             * When.
             *
             * @param description a short description of an initial state
             * @param bodyFunc Use the body of this function to define acceptance criteria or nested state changes.
             */
            And: (description: string, bodyFunc?: () => void) => ISpecWhen;
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
            and: (step: IStep) => ITCWhen;
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
            and: (step: IStep) => ITCGiven;
            /**
             * Call this function to invoke a state change of the tested application.
             *
             * To validate the state following the execution of this step, use `validate` inside the step callback.
             *
             * @param step a step that performs a state change
             */
            when: (step: IStep) => ITCWhen;
        }
        /**
         * @ignore
         */
        interface IDescriptionStack {
            givens: string[];
            whens: string[];
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
            issues?: string[];
            /**
             * Ids of bugs associated with this Story in an issue tracker tool (eg. bugs in JIRA).
             *
             * In the allure test report, links to these bugs will be created.
             * To build these links, wdio-workflo examines the "allure" property in workflo.conf.ts
             * and for each bug concatenates allure.bugPrefix, allure.issueTrackerPattern and allure.bugAppendix and
             * substitutes '%s' in the issueTrackerPattern with the bug id.
             */
            bugs?: string[];
            /**
             * The severity of a Story describes how severe the implications of one or more acceptance criteria of the Story
             * not being fulfilled correctly would be. It defaults to 'normal'.
             */
            severity?: Workflo.Severity;
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
            bugs?: string[];
            /**
             * Id of this testcase in a test management tool.
             *
             * In the test report, a link to this testcase will be created.
             * To build this link, wdio-workflo examines the "allure" property in workflo.conf.ts
             * and substitutes '%s' in allure.testManagementPattern with the test id.
             */
            testId?: string;
            /**
             * The severity of a testcase describes how severe the implications of the testcase failing would be.
             * It defaults to 'normal'.
             */
            severity?: Workflo.Severity;
        }
        /**
         * @ignore
         */
        interface IStoryMapEntry {
            descriptionStack: IDescriptionStack;
            description: string;
            metadata: IStoryMetaData;
            featureName: string;
            storyName: string;
            insideWhenSequence: boolean;
            whenSequenceLengths: number[];
            whenRecLevel: number;
            insideGivenSequence: boolean;
            givenSequenceLengths: number[];
            givenRecLevel: number;
        }
        /**
         * @ignore
         */
        interface IExpectationBlock {
            testcaseName: string;
            execute: () => void;
            screenshot: any;
        }
        /**
         * This object's keys are the ids of the validated Stories (eg."2.4.5") and its values are either a single id (eg. 3)
         * or an ids array (eg. [3, 4, 5]) of acceptance criteria defined within the associated Story.
         */
        type IValidateSpecObject = {
            [specId: string]: number | number[];
        };
        /**
         * @ignore
         */
        type IValidateContainer = {
            specObj: IValidateSpecObject;
        };
        /**
         * IOptStepParams are supposed to be used as the parameters of a step creation function if a step does not require
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
            cb?: (param: ReturnType) => void;
            /**
             * Optional arguments that can, but do not have to be, passed to a step execution function.
             */
            args?: ArgsType;
            /**
             * A short description of the interactions a step performs with the tested application.
             */
            description?: string;
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
            args: ArgsType;
        }
        /**
         * Steps consist of a description and an execution function.
         * The execution function performs changes to the state of the tested application and the description briefly
         * summarizes these changes in natural language.
         *
         * A step can be parameterized by passing step arguments and a step callback (both of which are optional) to the
         * execution function:
         *
         * Step arguments are key-value pair objects that provide dynamic values to the state changes of the execution f
         * unction.
         * They also enable the interpolation of a step's description by replacing `%{key}` in the description string
         * with key's value retrieved from the step arguments object).
         *
         * Step callbacks can be used to query and validate the state of the tested application right after step execution.
         * A step callback will be passed the return value of the execution function as its first parameter.
         *
         */
        interface IStep {
            __description: string;
            execute: (prefix?: string) => void;
        }
        /**
         * Steps in wdio-workflo need to be defined in this format - on object where the keys are the step descriptions and
         * the values are step creation functions that take the step parameters as and argument and return a created Step.
         */
        type StepDefinitions = Record<string, (params?: Workflo.IStepParams<any, any> | Workflo.IOptStepParams<any, any>) => Workflo.IStep>;
    }
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
    function getUid(str: string): string;
    /**
     * A Feature in wdio-workflo represents a collection of related Stories.
     *
     * @param description the name or a short description of the Feature
     * @param metadata the metadata of the Feature
     * @param bodyFunc Define all Stories that belong to this Feature in the body of this function.
     */
    function Feature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void): void;
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
    function fFeature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void): void;
    /**
     * All Features marked as "xFeature" will not be executed by the test runner.
     *
     * A Feature in wdio-workflo represents a collection of related Stories.
     *
     * @param description the name or a short description of the Feature
     * @param metadata the metadata of the Feature
     * @param bodyFunc Define all Stories that belong to this Feature in the body of this function.
     */
    function xFeature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void): void;
    /**
     * A Story describes functional requirements of the tested application as a series of application states and state
     * changes triggered by a user or a system. It contains acceptance criteria that validate the state following a state
     * change to check if the functional requirements are met.
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
    function Story(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void): void;
    /**
     * If one or more Stories in a Feature are marked as "fStory",
     * the test runner will execute only these Stories and ignore all other Stories defined in the same Feature.
     *
     * A Story describes functional requirements of the tested application as a series of application states and state
     * changes triggered by a user or a system. It contains acceptance criteria that validate the state following a state
     * change to check if the functional requirements are met.
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
    function fStory(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void): void;
    /**
     * All Stories marked as "xStory" will not be executed by the test runner.
     *
     * A Story describes functional requirements of the tested application as a series of application states and state
     * changes triggered by a user or a system. It contains acceptance criteria that validate the state following a state
     * change to check if the functional requirements are met.
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
    function xStory(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void): void;
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
    function Given(description: string, bodyFunc?: () => void): Workflo.ISpecGiven;
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
    function When(description: string, bodyFunc?: () => void): Workflo.ISpecWhen;
    /**
     * Then represents an acceptance criteria that validates an application state to check if a functional requirement
     * was fulfilled.
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
    function Then(id: number, description: string): void;
    /**
     * If one or more acceptance criteria in a Story are marked as "fThen",
     * the test runner will execute only these acceptance criteria and ignore all others defined in the same Story.
     *
     * Then represents an acceptance criteria that validates an application state to check if a functional requirement
     * was fulfilled.
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
    function fThen(id: number, description: string): void;
    /**
     * All acceptance criteria marked as "xThen" will not be executed by the test runner.
     *
     * Then represents an acceptance criteria that validates an application state to check if a functional requirement
     * was fulfilled.
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
    function xThen(id: number, description: string): void;
    /**
     * A suite is a collection of related testcases.
     *
     * @param description the name or a short description of the suite
     * @param metadata the metadata of the suite
     * @param bodyFunc define all testcases for this suite inside the body of this function
     */
    function suite(description: string, metadata: Workflo.ISuiteMetadata, bodyFunc: () => void): void;
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
    function fsuite(description: string, metadata: Workflo.ISuiteMetadata, bodyFunc: () => void): void;
    /**
     * All suites marked as "xsuite" will not be executed by the test runner.
     *
     * A suite is a collection of related testcases.
     *
     * @param description the name or a short description of the suite
     * @param metadata the metadata of the suite
     * @param bodyFunc define all testcases for this suite inside the body of this function
     */
    function xsuite(description: string, metadata: Workflo.ISuiteMetadata, bodyFunc: () => void): void;
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
    function testcase(description: string, metadata: Workflo.ITestcaseMetadata, bodyFunc: () => void): void;
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
    function ftestcase(description: string, metadata: Workflo.ITestcaseMetadata, bodyFunc: () => void): void;
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
    function xtestcase(description: string, metadata: Workflo.ITestcaseMetadata, bodyFunc: () => void): void;
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
    function given(step: Workflo.IStep): Workflo.ITCGiven;
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
    function validate(validateObject: Workflo.IValidateSpecObject, validationFunc: (...args: any[]) => void): void;
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
    function xpath(selector: string): pageObjects.builders.XPathBuilder;
}
/**
 * Severity describes how severe the implications of something not working correctly would be.
 */
export declare type Severity = Workflo.Severity;
/**
 * The result status of a testcase.
 */
export declare type TestcaseStatus = Workflo.TestcaseStatus;
/**
 * The result status of a validation/an acceptance criteria of a Story.
 */
export declare type SpecStatus = Workflo.SpecStatus;
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
export declare type IStep = Workflo.IStep;
/**
 * IStepParams are supposed to be used as the parameters of a step creation function if a step requires mandatory
 * step arguments.
 *
 * @template ArgsType defines the type of the step arguments passed to the execution function.
 * @template ReturnType defines the return type of the execution function.
 */
export declare type IStepParams<ArgsType extends Object, ReturnType> = Workflo.IStepParams<ArgsType, ReturnType>;
/**
 * IOptStepParams are supposed to be used as the parameters of a step creation function if a step does not require
 * any or only optional arguments.
 *
 * @template ArgsType defines the type of the step arguments passed to the execution function.
 * @template ReturnType defines the return type of the execution function.
 */
export declare type IOptStepParams<ArgsType extends Object, ReturnType> = Workflo.IOptStepParams<ArgsType, ReturnType>;
/**
 * Steps in wdio-workflo need to be defined in this format - on object where the keys are the step descriptions and
 * the values are step creation functions that take the step parameters as and argument and return a created Step.
 */
export declare type StepDefinitions = Workflo.StepDefinitions;
export * from './lib/steps';
import * as arrayFunctions from './lib/utility_functions/array';
import * as classFunctions from './lib/utility_functions/class';
import * as objectFunctions from './lib/utility_functions/object';
import * as utilFunctions from './lib/utility_functions/util';
export { objectFunctions, arrayFunctions, classFunctions, utilFunctions };
export { pageObjects, helpers };
/**
 * @ignore
 */
import Kiwi from './lib/Kiwi';
/**
 * @ignore
 */
export { Kiwi };
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
    [key: string]: number;
    default?: number;
}
/**
 * Intervals in milliseconds.
 */
export interface IIntervals {
    [key: string]: number;
    default?: number;
}
/**
 * @ignore
 */
export interface ICountAndPercentage {
    count?: number;
    percentage?: string;
}
/**
 * @ignore
 */
export interface IPrintObject {
    'Spec Files': number;
    'Testcase Files': number;
    'Manual Result Files': number;
    Features: number;
    Specs: number;
    Suites: number;
    Testcases: number;
    'Manual Results (Specs)': number;
    'Defined Spec Criteria': ICountAndPercentage;
    'Automated Criteria': ICountAndPercentage;
    'Manual Criteria': ICountAndPercentage;
    'Uncovered Criteria': ICountAndPercentage;
    'Uncovered Criteria Object': ICountAndPercentage;
}
/**
 * The desired capabilities of the browser used to run the tests.
 */
export interface ICapabilities extends DesiredCapabilities {
    [key: string]: any;
}
/**
 * Type definitions of the `config` parameter passed to the callback functions of IWorkfloConfig.
 */
export interface ICallbackConfig extends IWorkfloCallbackConfig, IWorkfloCommonConfig, Options {
}
/**
 * Type definitions of all properties of the `config` parameter passed to the callback functions of IWorkfloConfig that
 * can be defined in IWorkfloConfig.
 */
export interface IWorkfloCommonConfig {
    /**
     * Root directory for all system test artifacts of wdio-workflo.
     *
     * If you set this value to something other than `${__dirname} + '/system_test`, you need to make sure that
     * the `include` array in workflo's tsconfig file `tsconfig.workflo.json` contains your testDir folder.
     */
    testDir: string;
    /**
     * http(s).Agent instance to use
     *
     * @default new http(s).Agent({ keepAlive: true })
     */
    agent?: Object;
    /**
     * An HTTP proxy to be used. Supports proxy Auth with Basic Auth, identical to support for the url
     * parameter (by embedding the auth info in the uri)
     *
     * @default undefined (no proxy used)
     */
    proxy?: String;
    /**
     * Path to the uidStore.json file which is used to generate unique ids during test execution.
     *
     * The generated ids will be preserved for future test runs until the uidStore.json file is deleted.
     */
    uidStorePath?: string;
    /**
     * Arguments for start command of selenium-standalone service.
     *
     * @default {}
     */
    seleniumStartArgs?: StartOpts;
    /**
     * Arguments for install command of selenium-standalone service.
     *
     * @default {}
     */
    seleniumInstallArgs?: InstallOpts;
    /**
     * A key-value store of query parameters to be added to every selenium request.
     *
     * @default {}
     */
    queryParams?: Object;
    /**
     * A key-value store of headers to be added to every selenium request. Values must be strings.
     *
     * @default {}
     */
    headers?: Object;
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
        issueTrackerPattern?: string;
        /**
         * Pattern used to create urls for testcase management system.
         *
         * '%s' in pattern will be replaced with testId keys defined in Story options.
         *
         * @example "http://example.com/tms/browse/%s"
         */
        testManagementPattern?: string;
        /**
         * Will be prepended to issue keys displayed in allure report.
         * This can be useful as allure report provides no way to distinct issues and bugs by default.
         */
        issuePrefix?: string;
        /**
         * Will be appended to issue keys displayed in allure report.
         * This can be useful as allure report provides no way to distinct issues and bugs by default.
         */
        issueAppendix?: string;
        /**
         * Will be prepended to bug keys displayed in allure report.
         * This can be useful as allure report provides no way to distinct issues and bugs by default.
         */
        bugPrefix?: string;
        /**
         * Will be appended to bug keys displayed in allure report.
         * This can be useful as allure report provides no way to distinct issues and bugs by default.
         */
        bugAppendix?: string;
    };
    /**
     * Log level output in spec reporter console.
     *
     * @default testcases
     */
    consoleLogLevel?: 'results' | 'testcases' | 'steps';
    /**
     * If set to true, will output errors and validation failures immediately.
     * Will be enabled by default if consoleLogLevel is set to 'steps'.
     *
     * @default false
     */
    reportErrorsInstantly?: boolean;
    /**
   * Defines how many times a testcase should be rerun if it did not pass.
   * The current testcase will be aborted on the first error or failed expectation
   * and rerun <retries> times.
   *
   * @default 0
   */
    retries?: number;
}
/**
 * Type definitions of all properties of the `config` parameter passed to the callback functions of IWorkfloConfig that
 * only exist in wdio-workflo but not in webdriverio and that cannot be defined in IWorkfloConfig.
 */
export interface IWorkfloCallbackConfig {
    /**
     * Defines which testcase files should run. The pattern is relative to the directory
     * from which `wdio-workflo` was called.
     *
     * Corresponds to the "testcaseFiles" config option in the workflo config file.
     */
    testcases?: string[];
    /**
     * Defines which spec files should run. The pattern is relative to the directory
     * from which `wdio-workflo` was called.
     *
     * Corresponds to the "specFiles" config option in the workflo config file.
     */
    specs?: string[];
    /**
     * Path where the testinfo.json file resides.
     */
    testInfoFilePath: string;
    /**
     * Path where results for the currently active browser are stored.
     */
    resultsPath: string;
    /**
     * Path to the file that contains the name of the folder which stores the results of the latest test run.
     */
    latestRunPath: string;
    /**
     * Name of the browser used to run the current tests.
     */
    browser: string;
    /**
     * Date and time when the current test run was launched.
     */
    dateTime: string;
    /**
     * Path to the json file that stores the merged results of all previous test runs and the current test run.
     */
    mergedResultsPath: string;
    /**
     * Path where the spec reporter console report of the current test run is stored.
     */
    consoleReportPath: string;
    /**
     * Path where the merged results of all previous test runs and the current test run are stored for allure.
     */
    mergedAllureResultsPath: string;
    /**
     * Information about spec criteria of current test run.
     * Used internally by wdio-workflo.
     */
    criteriaAnalysis: IAnalysedCriteria;
    /**
     * Filters used by wdio-workflo to determine which tests and specs to execute.
     * Filters include specFiles, testcaseFiles, features, specs, testcases, suites, manualResultFiles and manualSpecs.
     */
    executionFilters: IExecutionFilters;
    /**
     * Parsing results of testcases and spec files used internally by wdio-workflo
     * to link specs and testcases.
     */
    parseResults: IParseResults;
    /**
     * Information used to trace which testcases validate which specs and which
     * specs are validated in which testcases.
     * Used internally by wdio-workflo.
     */
    traceInfo: ITraceInfo;
    /**
     * Data used by wdio-workflo to output the results and statistics of a test run.
     */
    printObject: IPrintObject;
}
/**
 * Type definitions of the config used by wdio-workflo in the file workflo.conf.ts.
 */
export interface IWorkfloConfig extends IWorkfloCommonConfig {
    /**
     * Set a base URL in order to shorten url command calls. If your `url` parameter starts
     * with `/`, the base url gets prepended, not including the path portion of your baseUrl.
     * If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
     * gets prepended directly.
     */
    baseUrl: string;
    /**
     * Protocol to use when communicating with the Selenium standalone server (or driver)
     * @default http
     */
    protocol?: string;
    /**
     * Host of your WebDriver server.
     * @default 127.0.0.1
     */
    host?: string;
    /**
     * Port your WebDriver server is on.
     * @default 4444
     */
    port?: number;
    /**
     * Path to WebDriver server.
     * @default  /wd/hub
     */
    path?: string;
    /**
     * WebdriverIO supports Sauce Labs, Browserstack and Testing Bot (other cloud providers
     * should work too though). These services define specific user and key (or access key)
     * values you need to put in here in order to connect to these services.
     *
     * @default undefined
     */
    user?: string;
    /**
     * WebdriverIO supports Sauce Labs, Browserstack and Testing Bot (other cloud providers
     * should work too though). These services define specific user and key (or access key)
     * values you need to put in here in order to connect to these services.
     *
     * @default undefined
     */
    key?: string;
    /**
     * Width of the browser window in pixels.
     */
    width: number;
    /**
     * Height of the browser window in pixels.
     */
    height: number;
    /**
     * Defines the capabilities you want to run in your Selenium session.
     * See https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities for a list of the available capabilities.
     *
     * Please be aware that wdio-workflo's reporting only supports one single instance at a time.
     * Therefore, the "maxInstance" property will always be set to 1.
     */
    capabilities: ICapabilities;
    /**
     * Webdriverio Services to run for test execution.
     *
     * See http://webdriver.io/guide for more information.
     *
     * @default ['selenium-standalone']
     */
    services?: string[];
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
    debug?: boolean;
    /**
     * Execution arguments for the node process.
     * If using the debug option, execArgv will always be overwritten with the value ['--inspect']
     */
    execArgv?: string[];
    /**
     * Outputs selenium commands in the allure report if set to true.
     *
     * ACTIVATE THIS AT YOUR OWN RISK: Sometimes there is so much output
     * that the maximum call stack size is exceeded.
     *
     * @default false
     */
    debugSeleniumCommand?: boolean;
    /**
     * Skip future testcases after a specific amount of already executed testcases have failed.
     * By default, does not bail.
     *
     * @default 0
     */
    bail?: number;
    /**
     * Timeout for any request to the Selenium server in milliseconds.
     *
     * @default 90000
     */
    connectionRetryTimeout?: number;
    /**
     * Count of request retries to the Selenium server.
     *
     * @default 3
     */
    connectionRetryCount?: number;
    /**
     * Timeouts (for waitXXX and eventuallyXXX actions) in milliseconds.
     *
     * "default" property will be used for every waitXXX and eventuallyXXX action
     * if not explicitly stated otherwise.
     *
     * @default {default: 5000}
     */
    timeouts?: ITimeouts;
    /**
     * Intervals (for waitXXX and eventuallyXXX actions) in milliseconds.
     *
     * "default" property will be used for every waitXXX and eventuallyXXX action
     * if not explicitly stated otherwise.
     *
     * @default {default: 500}
     */
    intervals?: IIntervals;
    /**
     * Restricts test execution to these testcases.
     *
     * @example
     * ["Suite1", "Suite2.Testcase1"] => execute all testcases of Suite1 and Testcase1 of Suite2
     * ["Suite2", "-Suite2.Testcase2"] => execute all testcases of Suite2 except for Testcase2
     */
    testcases?: string[];
    /**
     * Restricts test execution to these features.
     *
     * @example
     * ["Login", "Logout"] => execute all testcases which validate specs defined within these features
     * ["-Login"] => execute all testcases except those which validate specs defined within these features
     */
    features?: string[];
    /**
     * Restricts test execution to these specs.
     *
     * @example
     * ["3.2"] => execute all testcases which validate spec 3.2
     * ["1.1*", "-1.1.2.4"] => 1.1* includes spec 1.1 and all of its sub-specs (eg. 1.1.2), -1.1.2.4 excludes spec 1.1.2.4
     * ["1.*"] => 1.* excludes spec 1 itself but includes of of its sub-specs
     */
    specs?: string[];
    /**
     * Restricts specs by status of their criteria set during their last execution.
     *
     * @example
     * ["passed", "failed", "broken", "unvalidated", "unknown"] => these are all available status - combine as you see fit
     * ["faulty"] => faulty is a shortcut for failed, broken, unvalidated and unknown
     */
    specStatus?: (SpecStatus | 'faulty')[];
    /**
     * Restricts executed testcases by their result status set during their last execution.
     *
     * @example
     * ["passed", "failed", "broken", "pending", "unknown"] => these are all available status - combine as you see fit
     * ["faulty"] => faulty is a shortcut for failed, broken and unknown
     */
    testcaseStatus?: (TestcaseStatus | 'faulty')[];
    /**
     * Restricts specs by severity set during their last execution.
     *
     * @example
     * ["blocker", "critical", "normal", "minor", "trivial"] => these are all available severities - combine as you see fit
     */
    specSeverity?: Severity[];
    /**
     * Restricts testcases by severity set during their last execution.
     *
     * @example
     * ["blocker", "critical", "normal", "minor", "trivial"] => these are all available severities - combine as you see fit
     */
    testcaseSeverity?: Severity[];
    /**
     * Restricts testcases and specs (oldest spec criteria) by given date and time (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss).
     *
     * @example
     * ["(2017-03-10,2017-10-28)"] => restricts by status set between 2017-03-10 and 2017-10-28 (at 0 pm, 0 min, 0 sec)
     * ["2017-07-21", "2017-07-22T14:51:13"] => restricts by last status set on 2017-07-21 or 2017-07-22 at 2 pm, 51 min, 13 sec
     */
    dates?: string[];
    /**
     * Do not run automatic testcases and consider only manual results.
     *
     * @default {default: false}
     */
    manualOnly?: boolean;
    /**
     * Run only automatic testcases and do not consider manual results.
     *
     * @default {default: false}
     */
    automaticOnly?: boolean;
    /**
     * Remove error stack trace lines that originate from the test framework itself.
     *
     * @default {default: true}
     */
    cleanStackTraces?: boolean;
    /**
     * Gets executed once before all workers get launched.
     * @param {ICallbackConfig} config wdio-workflo configuration object
     * @param {Array.<ICapabilities>} capabilities list of capabilities details
     */
    onPrepare?<T>(config: ICallbackConfig, capabilities: ICapabilities[]): Promise<T> | void;
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
    beforeSession?<T>(config: ICallbackConfig, capabilities: ICapabilities[], testcaseFiles: string[]): Promise<T> | void;
    /**
     * Gets executed before testcases execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     *
     * This callback is only invoked during the "testcases" phase.
     *
     * @param {Array.<ICapabilities>} capabilities list of capabilities details
     * @param {Array.<String>} testcaseFiles List of testcases file paths that are to be run
     */
    before?<T>(capabilities: ICapabilities[], testcaseFiles: string[]): Promise<T> | void;
    /**
     * Hook that gets executed before the suite starts
     * @param {Suite} suite suite details
     */
    beforeSuite?<T>(suite: Suite): Promise<T> | void;
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Jasmine)
     */
    beforeHook?<T>(): Promise<T> | void;
    /**
     * Hook that gets executed _after_ a hook within the suite ends (e.g. runs after calling
     * afterEach in Jasmine)
     */
    afterHook?<T>(): Promise<T> | void;
    /**
     * Function to be executed before a testcase starts.
     * @param {Test} test test details
     */
    beforeTest?<T>(test: Test): Promise<T> | void;
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    beforeCommand?<T>(commandName: string, args: any[]): Promise<T> | void;
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Error} error error object if any
     */
    afterCommand?<T>(commandName: string, args: any[], result: number, error: Error): Promise<T> | void;
    /**
     * Function to be executed after a testcase ends.
     * @param {Test} test test details
     */
    afterTest?<T>(test: Test): Promise<T> | void;
    /**
     * Hook that gets executed after the suite has ended
     * @param {Suite} suite suite details
     */
    afterSuite?<T>(suite: Suite): Promise<T> | void;
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<ICapabilities>} capabilities list of capabilities details
     * @param {Array.<String>} testcaseFiles List of testcases file paths that ran
     */
    after?<T>(result: number, capabilities: ICapabilities[], testcaseFiles: string[]): Promise<T> | void;
    /**
     * Gets executed right after terminating the webdriver session.
     *
     * This callback is only invoked during the "testcases" phase.
     *
     * @param {ICallbackConfig} config wdio-workflo configuration object
     * @param {Array.<ICapabilities>} capabilities list of capabilities details
     * @param {Array.<String>} testcaseFiles List of testcases file paths that ran
     */
    afterSession?<T>(config: ICallbackConfig, capabilities: ICapabilities, testcaseFiles: string[]): Promise<T> | void;
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     *
     * This callback is only invoked during the "testcases" phase.
     *
     * @param {Array.<ICapabilities>} capabilities list of capabilities details
     * @param {Array.<String>} specFiles List of spec file paths that are to be run
     */
    beforeValidator?<T>(capabilities: ICapabilities[], specFiles: string[]): Promise<T> | void;
    /**
    * Gets executed after all tests are done. You still have access to all global variables from
    * the test.
    * @param {Number} result 0 - test pass, 1 - test fail
    * @param {Array.<ICapabilities>} capabilities list of capabilities details
    * @param {Array.<String>} specFiles List of spec file paths that ran
    */
    afterValidator?<T>(result: number, capabilities: ICapabilities[], specFiles: string[]): Promise<T> | void;
    /**
     * Gets executed after all workers got shut down and the process is about to exit.
     * @param {Number} exitCode 0 - success, 1 - fail
     * @param {ICallbackConfig} config wdio-workflo configuration object
     * @param {Array.<ICapabilities>} capabilities list of capabilities details
     */
    onComplete?<T>(exitCode: number, config: ICallbackConfig, capabilities: ICapabilities[]): Promise<T> | void;
    /**
    * Gets executed when an error happens, good place to take a screenshot
    * @ {Error} error
    */
    onError?<T>(error: Error): Promise<T> | void;
}
