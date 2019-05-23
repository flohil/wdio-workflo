import * as _ from 'lodash';

import { IPageNodeOpts, PageElementGroup, PageNode, PageNodeCurrently, PageNodeEventually, PageNodeWait } from '.';
import { DEFAULT_INTERVAL, DEFAULT_TIMEOUT } from '..';
import { XPathBuilder } from '../builders';
import { PageNodeStore } from '../stores';

/**
 * Defines the opts parameter passed to the constructor function of PageElementBase.
 *
 * @template Store type of the PageNodeStore used by PageElementBase to retrieve PageNodes from the store
 */
export interface IPageElementBaseOpts<
  Store extends PageNodeStore,
> extends IPageNodeOpts<Store>, Workflo.ITimeoutInterval {
  /**
   * Defines the kind of waiting condition performed when `initialWait` is invoked.
   *
   * The initial waiting condition is performed every time before an interaction with the tested application takes place
   * via a PageElement's action (eg. click).
   */
  waitType?: Workflo.WaitType;
}

/**
 * This class provides basic functionalities for all PageElements.
 *
 * @template Store type of the PageNodeStore used by PageElementBase to retrieve PageNodes from the store
 */
export abstract class PageElementBase<
  Store extends PageNodeStore,
> extends PageNode<Store> {
  /**
   * Defines the kind of wait condition performed when `initialWait` is invoked.
   *
   * The initial wait condition is performed every time before an interaction with the tested application takes place
   * via a PageElement's action (eg. click).
   */
  protected _waitType: Workflo.WaitType;
  /**
   * `_$` provides access to the PageNode retrieval functions of PageElementBase's PageNodeStore and prefixes the
   * selectors of all PageNodes retrieved via `_$` with the selector of PageElementBase.
   */
  protected _$: Store;
  /**
   * the default timeout used by PageElement for all of its functions that operate with timeouts
   * (eg. `wait` and `eventually`)
   */
  protected _timeout: number;
  /**
   * the default interval used by PageElement for all of its functions that operate with intervals
   * (eg. `wait` and `eventually`)
   */
  protected _interval: number;

  abstract readonly currently: PageElementBaseCurrently<Store, this>;
  abstract readonly wait: PageElementBaseWait<Store, this>;
  abstract readonly eventually: PageElementBaseEventually<Store, this>;

  /**
   * PageElementBase provides basic functionalities for all PageElements.
   *
   * @param selector the raw XPath selector of the PageElementBase
   * @param opts the options used to configure PageElementBase
   */
  constructor(
    selector: string,
    {
      waitType = Workflo.WaitType.visible,
      timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || DEFAULT_TIMEOUT,
      interval = JSON.parse(process.env.WORKFLO_CONFIG).intervals.default || DEFAULT_INTERVAL,
      ...superOpts
    }: IPageElementBaseOpts<Store>,
  ) {
    super(selector, superOpts);

    this._$ = Object.create(null);
    this._timeout = timeout;
    this._interval = interval;

    for (const method of Workflo.Class.getAllMethods(this._store)) {
      if (method.indexOf('_') !== 0 && /^[A-Z]/.test(method)) {
        this._$[method] = <Options extends IPageElementBaseOpts<Store>>(
          _selector: Workflo.XPath, _options: Options,
        ) => {

          if (_selector instanceof XPathBuilder) {
            _selector = XPathBuilder.getInstance().build();
          }

          if (typeof _selector === 'object') {
            // Cleaner solution would be to remove PageElementGroups from public store accessor of PageElement,
            // but this does not work due to typescript bugs that prevent extended generics to work with keyof.
            // typescript bugs 3.3.0:
          // https://github.com/Microsoft/TypeScript/issues/24560, https://github.com/Microsoft/TypeScript/issues/24791
            throw new Error(
`Selector chaining via the '.$' accessor is not supported for PageElementGroups.
Instead, you can retrieve PageElementGroups directly from an instance of PageNodeStore.`,
            );
          }

          // chain selectors
          _selector = `${selector}${_selector}`;

          return this._store[method].apply(this._store, [_selector, _options]);
        };
      }
    }

    this._waitType = waitType;
  }

  // typescript bugs 3.3.0:
  // https://github.com/Microsoft/TypeScript/issues/24560, https://github.com/Microsoft/TypeScript/issues/24791

  /**
   * `$` provides access to the PageNode retrieval functions of PageElementBase's PageNodeStore and prefixes the
   * selectors of all PageNodes retrieved via `$` with the selector of PageElementBase.
   */
  get $() /*: Workflo.Omit<Store, Workflo.FilteredKeysByReturnType<Store, PageElementGroup<any, any>>>*/ {
    return this._$;
  }

  /**
   * Returns the XPath selector of PageElementBase.
   */
  getSelector() {
    return this._selector;
  }

  /**
   * Returns the default timeout that a PageElement uses if no other explicit timeout
   * is passed to one of its functions which operates with timeouts (eg. wait, eventually)
   */
  getTimeout() {
    return this._timeout;
  }

  /**
   * Returns the default interval that a PageElement uses if no other explicit interval
   * is passed to one of its functions which operates with intervals (eg. wait, eventually)
   */
  getInterval() {
    return this._interval;
  }

  /**
   * Compares the values of `actual` and `expected` and returns true if they are equal.
   *
   * @param actual the actual value to be compared
   * @param expected the expected value to be compared
   */
  abstract __equals(actual: any, expected: any): boolean;

  /**
   * Returns true if `actual` has any value.
   *
   * @param actual the actual value which is supposed to have any value
   */
  abstract __any(actual: any): boolean;

  /**
   * Compares the values of `actual` and `expected` and returns true if `actual` contains `expected`.
   *
   * @param actual the actual value to be compared
   * @param expected the expected value to be compared
   */
  abstract __contains(actual: any, expected: any): boolean;

  /**
   * This function is used to write a value of an arbitrary type
   * into error messages and log outputs.
   *
   * @param value the value to convert to a string
   */
  abstract __typeToString(value: any): string;
}

/**
 * This class defines all `currently` functions of PageElementBase.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementBaseCurrently defines all `currently`
 * functions
 */
export abstract class PageElementBaseCurrently<
  Store extends PageNodeStore,
  PageElementType extends PageElementBase<Store>
> extends PageNodeCurrently<Store, PageElementType> {

  /**
   * Fetches the first webdriverio element from the HTML page that is identified by PageElement's XPath selector.
   */
  get element() {
    return browser.element(this._node.getSelector());
  }

  /**
   * Stores the values of `actual` and `expected` into `this._lastDiff` as strings.
   *
   * @param actual an actual value
   * @param expected an expected value
   */
  protected _writeLastDiff<T>(actual: T, expected?: T) {
    const diff: Workflo.IDiff = {
      actual: this._node.__typeToString(actual),
      timeout: this._node.getTimeout(),
    };

    diff.expected = this._node.__typeToString(expected);

    this._node.__setLastDiff(diff);
  }

  /**
   * Checks if the actual value lies within a given tolerance of the expected value.
   *
   * @param actual the actual value from the browser
   * @param expected the expected value or 0 if expected was smaller than 0
   * @param tolerance the tolerance or 0 if tolerance was smaller than 0
   */
  protected _withinTolerance(actual: number, expected: number, tolerance?: number) {
    const tolerances: Workflo.ITolerance = {
      lower: actual,
      upper: actual,
    };

    if (tolerance) {
      tolerances.lower -= Math.max(tolerance, 0);
      tolerances.upper += Math.max(tolerance, 0);
    }

    return Math.max(expected, 0) >= Math.max(tolerances.lower, 0) &&
      Math.max(expected, 0) <= Math.max(tolerances.upper, 0);
  }

  /**
   * Checks if the `actual` value has/equals the `expected` value and writes both values into `this._lastDiff`.
   *
   * @template T the type of both the actual and the expected value
   * @param expected the expected value
   * @param actual the actual value
   */
  protected _compareHas<T>(expected: T, actual: T) {
    this._writeLastDiff(actual, expected);

    return this._node.__equals(actual, expected);
  }

  /**
   * Checks if `actual` has any value and writes `actual` into `this._lastDiff`.
   *
   * @template T the type of the actual value
   * @param actual the actual value
   */
  protected _compareHasAny<T>(actual: T) {
    this._writeLastDiff(actual);

    return this._node.__any(actual);
  }

  /**
   * Checks if the `actual` value contains the `expected` value and writes both values into `this._lastDiff`.
   *
   * @template T the type of both the actual and the expected value
   * @param expected the value expected to be contained in the actual value
   * @param actual the actual value expected to contain the expected value
   */
  protected _compareContains<T>(expected: T, actual: T) {
    this._writeLastDiff(actual, expected);

    return this._node.__contains(actual, expected);
  }
}

/**
 * This class defines all `wait` functions of PageElementBase.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementBaseWait defines all `wait`
 * functions
 */
export abstract class PageElementBaseWait<
  Store extends PageNodeStore,
  PageElementType extends PageElementBase<Store>,
> extends PageNodeWait<Store, PageElementType> {

  /**
   * This function wraps webdriverio commands that wait for an HTML element to reach a certain state.
   *
   * It does so by invoking a condition function which checks if a certain condition eventually becomes true within a
   * specific timeout.
   *
   * A `WaitUntilTimeoutError` will be thrown and the PageElement's default timeout will be written to `_lastdiff`
   * if the condition function's return value is `false`.
   *
   * @param checkTypeStr describes what kind of check is performed by the condition function
   * @param conditionFunc a function that checks if a certain condition is eventually met within a specific timeout
   * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
   * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
   * condition function
   */
  protected _waitWdioCheckFunc(
    checkTypeStr: string,
    conditionFunc: (opts: Workflo.ITimeoutReverseInterval) => boolean,
    { timeout = this._node.getTimeout(), reverse, interval = this._node.getInterval() }:
      Workflo.ITimeoutReverseInterval = {},
  ) {
    const reverseStr = (reverse) ? ' not' : '';

    try {
      return this._node.__wait(
        () => conditionFunc({ timeout, reverse, interval }), ` never${reverseStr} ${checkTypeStr}`, timeout,
      );
    } catch (error) {
      this._node.__setLastDiff({ timeout });

      throw error;
    }
  }

  /**
   * This function can be used to assemble and execute a `wait` state check function
   * to wait for an HMTL element to reach an expected state.
   *
   * It regularly invokes a condition function until it returns true or until a specific timeout is reached.
   *
   * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
   * specific timeout.
   *
   * @param conditionFunc a function which checks if an HTML element has an expected state
   * @param errorMessageFunc a function that returns an errorMessage if the HTML element didn't reach its expected state
   * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
   * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
   * condition function
   */
  protected _waitUntil<T>(
    conditionFunc: () => boolean,
    errorMessageFunc: () => string,
    { timeout = this._node.getTimeout(), interval = this._node.getInterval() }: Workflo.ITimeoutInterval = {},
  ) {
    try {
      return this._node.__waitUntil(
        () => conditionFunc(),
        () => errorMessageFunc(),
        timeout, interval,
      );
    } catch (error) {
      this._node.__setLastDiff({ timeout });

      throw error;
    }
  }

  /**
   * This function can be used to assemble and execute a `wait` state check function
   * to wait for the value of a certain property of an HMTL element to reach an expected state.
   *
   * It regularly invokes a condition function until it returns true or until a specific timeout is reached.
   * If an expected value was provided, this value will be passed to the condition function as second parameter.
   *
   * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
   * specific timeout.
   *
   * @param name the name of the property for which the wait condition is performed
   * @param conditionType the type of comparison performed in the conditionFunc
   * @param conditionFunc a function which compares an actual with an expected value
   * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
   * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
   * condition function
   * @param expectedValue the expected value passed to the conditionFunc
   */
  protected _waitProperty<T>(
    name: string,
    conditionType: 'has' | 'contains' | 'any' | 'within',
    conditionFunc: (opts: Workflo.ITimeoutReverseInterval, value?: T) => boolean,
    { timeout = this._node.getTimeout(), reverse, interval = this._node.getInterval() }:
      Workflo.ITimeoutReverseInterval = {},
    expectedValue?: T,
  ) {
    const reverseStr = (reverse) ? ' not' : '';
    let conditionStr = '';

    if (conditionType === 'has') {
      conditionStr = 'became';
    } else if (conditionType === 'contains') {
      conditionStr = 'contained';
    } else if (conditionType === 'any') {
      conditionStr = 'had any';
    } else if (conditionType === 'within') {
      conditionStr = 'was in range';
    }

    return this._node.__waitUntil(
      () => (reverse) ? !conditionFunc(expectedValue) : conditionFunc(expectedValue),
      () => {
        if (conditionType === 'has' || conditionType === 'contains' || conditionType === 'within') {
          return `'s ${name} "${this._node.__lastDiff.actual}" never` +
            `${reverseStr} ${conditionStr} "${this._node.__typeToString(expectedValue)}"`;
        } else if (conditionType === 'any') {
          return ` never${reverseStr} ${conditionStr} ${name}`;
        } else {
          return '';
        }
      },
      timeout, interval,
    );
  }

  /**
   * This function waits for an actual value to lie within a certain range of an expected value.
   *
   * It does so by regularly invoking a condition function until it returns true or until a specific timeout is reached.
   *
   * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
   * specific timeout.
   *
   * @param name the name of the property for which the wait condition is performed
   * @param expectedValue the expected value passed to the conditionFunc
   * @param conditionFunc a function which compares the actual and the expected value
   * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
   * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
   * condition function
   */
  protected _waitWithinProperty<T>(
    name: string,
    expectedValue: T,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.ITimeoutReverseInterval,
  ) {
    return this._waitProperty(name, 'within', conditionFunc, opts, expectedValue);
  }

  /**
   * This function waits for an actual value to have/equal an expected value.
   *
   * It does so by regularly invoking a condition function until it returns true or until a specific timeout is reached.
   *
   * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
   * specific timeout.
   *
   * @param name the name of the property for which the wait condition is performed
   * @param expectedValue the expected value passed to the conditionFunc
   * @param conditionFunc a function which compares the actual and the expected value
   * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
   * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
   * condition function
   */
  protected _waitHasProperty<T>(
    name: string,
    expectedValue: T,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.ITimeoutReverseInterval,
  ) {
    return this._waitProperty(name, 'has', conditionFunc, opts, expectedValue);
  }

  /**
   * This function waits for a property to have any value.
   *
   * It does so by regularly invoking a condition function until it returns true or until a specific timeout is reached.
   *
   * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
   * specific timeout.
   *
   * @param name the name of the property for which the wait condition is performed
   * @param conditionFunc a function which checks if a property has any value
   * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
   * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
   * condition function
   */
  protected _waitHasAnyProperty<T>(
    name: string,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.ITimeoutReverseInterval,
  ) {
    return this._waitProperty(name, 'any', conditionFunc, opts);
  }

  /**
   * This function waits for an actual value to contain an expected value.
   *
   * It does so by regularly invoking a condition function until it returns true or until a specific timeout is reached.
   *
   * A `WaitUntilTimeoutError` will be thrown if the condition function's return value does not become true within the
   * specific timeout.
   *
   * @param name the name of the property for which the wait condition is performed
   * @param expectedValue the expected value passed to the conditionFunc
   * @param conditionFunc a function which compares the actual and the expected value
   * @param opts includes the `timeout` within which the condition function is expected to become true, the `interval`
   * used to invoke the condition function and a `reverse` flag which, if set to `true`, negates the result of the
   * condition function
   */
  protected _waitContainsProperty<T>(
    name: string,
    expectedValue: T,
    conditionFunc: (value: T) => boolean,
    opts?: Workflo.ITimeoutReverseInterval,
  ) {
    return this._waitProperty(name, 'contains', conditionFunc, opts, expectedValue);
  }

  /**
   * Adds a `reverse` property to the passed opts parameter and sets its value to `true`.
   *
   * @param opts the object which should be extended with a `reverse` property
   */
  protected _makeReverseParams(opts: Workflo.ITimeoutInterval = {}): Workflo.ITimeoutReverseInterval {
    return { timeout: opts.timeout, reverse: true, interval: opts.interval };
  }
}

/**
 * This class defines all `eventually` functions of PageElementBase.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the PageElement for which PageElementBaseEventually defines all `eventually`
 * functions
 */
export abstract class PageElementBaseEventually<
  Store extends PageNodeStore,
  PageElementType extends PageElementBase<Store>
> extends PageNodeEventually<Store, PageElementType> {}
