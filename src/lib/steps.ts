import * as CircularJson from 'circular-json';
import * as _ from 'lodash';
import Kiwi from './Kiwi';

/**
 * @ignore
 */
function mergeStepDefaults<I, O>(
  defaults: Partial<I>, params: Workflo.IStepParams<I, O> | Workflo.IOptStepParams<I, O>,
): Workflo.IStepParams<I, O> {
  const _params = <any>params;

  const res: { args?: { [ key: string ]: any }, cb?: any } = _params || {};
  res.args = _.merge(defaults, res.args);
  return _params;
}

/**
 * @ignore
 */
function stepsGetter(target, name, receiver) {
  if (typeof name === 'string') {
    const stepName: string = name;
    const parameterizedStep: Workflo.StepImpl = target[stepName];

    if (typeof parameterizedStep === 'undefined') {
      throw new Error(`Step ${stepName} is not implemented`);
    }

    return <I, O>(stepCbArgs: Workflo.IOptStepParams<I, O> = {}) : Workflo.IStep => {
      stepCbArgs.description = stepName;

      const stepArgs = mergeStepDefaults({}, stepCbArgs);

      return parameterizedStep(stepArgs);
    };
  } else {
    throw new Error(`Property keys of Steps must be of type string: Step ${name.toString}`);
  }
}

/**
 * @ignore
 */
function stepsSetter(target, name, value) : boolean {
  throw new Error(
    `Step implementations may not be changed: Tried to set Step ${name.toString()} to value ${value.toString()}`,
  );
}

/**
 * Use this function to create step definitions and preserve their types.
 *
 * @param stepDefinitions An object whose keys are step descriptions and whose values are step creation functions.
 */
export function defineSteps<StepDefinitions extends Workflo.StepDefinitions>(stepDefinitions: StepDefinitions) {
  return stepDefinitions;
}

/**
 * Creates a Proxy that adds custom getters and setters to the merged step definitions.
 * Steps in wdio-workflo can only function properly if this proxy is used to interact with them.
 *
 * @param stepDefinitions the merged step definitions
 * @returns the proxified steps
 */
export function proxifySteps<StepDefinitions extends Workflo.StepDefinitions>(
  stepDefinitions: StepDefinitions,
): StepDefinitions {
  return new Proxy(stepDefinitions, {
    get: (target, name, receiver) => stepsGetter(target, name, receiver),
    set: (target, name, value) => stepsSetter(target, name, value),
  });
}

/**
   * Steps consist of a description and an execution function.
   * The execution function performs changes to the state of the tested application and the description briefly
   * summarizes these changes in natural language.
   *
   * A step can be parameterized by passing step arguments and a step callback (both of which are optional) to the
   * execution function:
   *
   * Step arguments are key-value pair objects that provide dynamic values to the state changes of the execution
   * function.
   * They also enable the interpolation of a step's description by replacing `%{key}` in the description string
   * with key's value retrieved from the step arguments object).
   *
   * Step callbacks can be used to query and validate the state of the tested application right after step execution.
   * A step callback will be passed the return value of the execution function as its first parameter.
   *
   * @template ArgsType defines the type of the step arguments passed to the execution function.
   * @template ReturnType defines the return type of the execution function.
   */
export class Step<ArgsType extends Object, ReturnType> implements Workflo.IStep {

  /**
   * A step's description.
   *
   * Intended for framework-internal usage only.
   */
  public __description: string;

  /**
   * Executes the parameterized step.
   *
   * If a step is used as a parameter of `given`, `when` or `and`, this function will be invoked automatically.
   *
   * Calling this function manually is only needed when invoking a step from inside the body function of another step.
   *
   * @param prefix the prefix of a nested step (titles of its "upper" steps in the nesting hierarchy)
   */
  public execute: (prefix?: string) => void;

  /**
   * Indicates whether browser object was already patched to create stacktrace which can be displayed on selenium errors
   * and show the line number in the testcase where the error occurred.
   */
  private static _patchedBrowser = false;
  /**
   * Defines for which functions of the browser object no patched stacktrace should be created.
   */
  private static _commandBlacklist = {
    isExecuted: true,
    isMultiremote: true,
    defer: true,
    promise: true,
    lastPromise: true,
    desiredCapabilities: true,
    requestHandler: true,
    logger: true,
    options: true,
    commandList: true,
    isMobile: true,
    isIOS: true,
    isAndroid: true,
    next: true,
    finally: true,
    call: true,
    then: true,
    catch: true,
    inspect: true,
    unify: true,
    addCommand: true,
    getPrototype: true,
    transferPromiseness: true,
    sessionId: true,
    orientation: true,
    prependListener: true,
    prependOnceListener: true,
    eventNames: true,
    actions: true,
    alertAccept: true,
    alertDismiss: true,
    alertText: true,
    applicationCacheStatus: true,
    back: true,
    background: true,
    closeApp: true,
    context: true,
    contexts: true,
    cookie: true,
    currentActivity: true,
    deviceKeyEvent: true,
    frame: true,
    frameParent: true,
    getAppStrings: true,
    getCurrentDeviceActivity: true,
    getCurrentPackage: true,
    getDeviceTime: true,
    getNetworkConnection: true,
    gridProxyDetails: true,
    gridTestSession: true,
    hideDeviceKeyboard: true,
    imeActivate: true,
    imeActivated: true,
    imeActiveEngine: true,
    imeAvailableEngines: true,
    imeDeactivated: true,
    init: true,
    installApp: true,
    isAppInstalled: true,
    isLocked: true,
    launch: true,
    localStorage: true,
    localStorageSize: true,
    location: true,
    lock: true,
    log: true,
    logTypes: true,
    openNotifications: true,
    removeApp: true,
    screenshot: true,
    sessionStorage: true,
    sessionStorageSize: true,
    setImmediateValue: true,
    setNetworkConnection: true,
    settings: true,
    source: true,
    status: true,
    timeouts: true,
    timeoutsAsyncScript: true,
    timeoutsImplicitWait: true,
    window: true,
    windowHandle: true,
    windowHandleFullscreen: true,
    windowHandleMaximize: true,
    windowHandlePosition: true,
    windowHandleSize: true,
    windowHandles: true,
    close: true,
    deleteCookie: true,
    end: true,
    endAll: true,
    pause: true,
    saveScreenshot: true,
    lastResult: true,
  };

  /**
   * Steps consist of a description and an execution function.
   * The execution function performs changes to the state of the tested application and the description briefly
   * summarizes these changes in natural language.
   *
   * A step can be parameterized by passing step arguments and a step callback (both of which are optional) to the
   * execution function:
   *
   * Step arguments are key-value pair objects that provide dynamic values to the state changes of the execution
   * function.
   * They also enable the interpolation of a step's description by replacing `%{key}` in the description string
   * with key's value retrieved from the step arguments object).
   *
   * Step callbacks can be used to query and validate the state of the tested application right after step execution.
   * A step callback will be passed the return value of the execution function as its first parameter.
   *
   * @template ArgsType defines the type of the step arguments passed to the execution function.
   * @template ReturnType defines the return type of the execution function.
   * @param params encapsulates the following step parameters: description, step arguments and step callback
   * @param executionFunction changes the state of the tested application
   */
  constructor(params: Workflo.IOptStepParams<ArgsType, ReturnType>, executionFunction: (args: ArgsType) => ReturnType) {

    // HACK!!!
    // patch browser object to create stacktrace which can be displayed on selenium errors
    // to show the line number in the testcase where the error occured
    if (!Step._patchedBrowser) {
      browser = new Proxy(browser, {
        get(target, name) {
          if (
            !Step._commandBlacklist.hasOwnProperty(name) ||
            Step._commandBlacklist[name] === false
          ) {
            Error.stackTraceLimit = 30;

            const error = new Error();
            const stack = error.stack;

            process.send({ stack, name, event: 'runner:currentStack' });
          }

          return target[name];
        },
      });

      Step._patchedBrowser = true;
    }

    if (typeof params.description !== 'undefined') {
      this.__description = Kiwi.compose(params.description, params.args);
    }
    if (typeof params.cb !== 'undefined') {
      this.execute = prefix => {
        prefix = (typeof prefix === 'undefined') ? '' : `${prefix} `;
        process.send({
          event: 'step:start',
          title: `${prefix}${this.__description}`,
          description: this.__description,
          arg: CircularJson.stringify(params.args),
        });
        const result: ReturnType = executionFunction(params.args);
        process.send({
          event: 'step:start',
          title: 'Callback',
          description: 'Callback',
          arg: CircularJson.stringify(result),
        });
        params.cb(result);
        process.send({ event: 'step:end' });
        process.send({ event: 'step:end', arg: CircularJson.stringify(result) });
      };
    } else {
      this.execute = prefix => {
        prefix = (typeof prefix === 'undefined') ? '' : `${prefix} `;
        process.send({
          event: 'step:start',
          title: `${prefix}${this.__description}`,
          description: this.__description,
          arg: CircularJson.stringify(params.args),
        });
        const result: ReturnType = executionFunction(params.args);
        process.send({ event: 'step:end', arg: CircularJson.stringify(result) });
      };
    }
  }
}
