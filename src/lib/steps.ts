import Kiwi from './Kiwi'
import * as _ from 'lodash'
import * as CircularJson from 'circular-json'

export function mergeStepDefaults<I, O>
( defaults: Partial<I>, params: IStepArgs<I, O> | IOptStepArgs<I, O>): IStepArgs<I, O> {
  const _params = <any>params

  const res: { arg?: { [ key: string ]: any }, cb?: any } = _params || {}
  res.arg = _.merge( defaults, res.arg )
  return _params
}

export function stepsGetter(target, name, receiver) {
  if (typeof name === "string") {
    const stepName: string = name
    const parameterizedStep: Workflo.StepImpl = target[stepName]

    if ( typeof parameterizedStep === "undefined" ) {
      throw new Error(`Step ${stepName} is not implemented`)
    }

    return <I, O>(stepCbArgs: IOptStepArgs<I, O> = {}) : IParameterizedStep => {
      stepCbArgs.description = stepName

      const stepArgs = mergeStepDefaults({}, stepCbArgs)

      return parameterizedStep(stepArgs)
    }
  } else {
    throw new Error("Property keys of Steps must be of type string: Step " + name.toString)
  }
}

export function stepsSetter(target, name, value) : boolean {
  throw new Error("Step implementations may not be changed: Tried to set Step " + name.toString() + " to value " + value.toString())
}

export class ParameterizedStep<I, O> implements IParameterizedStep {
  public description: string
  public execute: (prefix: string) => void

  private static _patchedBrowser = false
  private static _commandBlacklist = {
    'isExecuted': true,
    'isMultiremote': true,
    'defer': true,
    'promise': true,
    'lastPromise': true,
    'desiredCapabilities': true,
    'requestHandler': true,
    'logger': true,
    'options': true,
    'commandList': true,
    'isMobile': true,
    'isIOS': true,
    'isAndroid': true,
    'next': true,
    'finally': true,
    'call': true,
    'then': true,
    'catch': true,
    'inspect': true,
    'unify': true,
    'addCommand': true,
    'getPrototype': true,
    'transferPromiseness': true,
    'sessionId': true,
    'orientation': true,
    'prependListener': true,
    'prependOnceListener': true,
    'eventNames': true,
    'actions': true,
    'alertAccept': true,
    'alertDismiss': true,
    'alertText': true,
    'applicationCacheStatus': true,
    'back': true,
    'background': true,
    'closeApp': true,
    'context': true,
    'contexts': true,
    'cookie': true,
    'currentActivity': true,
    'deviceKeyEvent': true,
    'frame': true,
    'frameParent': true,
    'getAppStrings': true,
    'getCurrentDeviceActivity': true,
    'getCurrentPackage': true,
    'getDeviceTime': true,
    'getNetworkConnection': true,
    'gridProxyDetails': true,
    'gridTestSession': true,
    'hideDeviceKeyboard': true,
    'imeActivate': true,
    'imeActivated': true,
    'imeActiveEngine': true,
    'imeAvailableEngines': true,
    'imeDeactivated': true,
    'init': true,
    'installApp': true,
    'isAppInstalled': true,
    'isLocked': true,
    'launch': true,
    'localStorage': true,
    'localStorageSize': true,
    'location': true,
    'lock': true,
    'log': true,
    'logTypes': true,
    'openNotifications': true,
    'removeApp': true,
    'screenshot': true,
    'sessionStorage': true,
    'sessionStorageSize': true,
    'setImmediateValue': true,
    'setNetworkConnection': true,
    'settings': true,
    'source': true,
    'status': true,
    'timeouts': true,
    'timeoutsAsyncScript': true,
    'timeoutsImplicitWait': true,
    'window': true,
    'windowHandle': true,
    'windowHandleFullscreen': true,
    'windowHandleMaximize': true,
    'windowHandlePosition': true,
    'windowHandleSize': true,
    'windowHandles': true,
    'close': true,
    'deleteCookie': true,
    'end': true,
    'endAll': true,
    'pause': true,
    'saveScreenshot': true,
    'lastResult': true
  }

  constructor(params: IOptStepArgs<I, O>, stepFunc: (arg: I) => O) {

    // HACK!!!
    // patch browser object to create stacktrace which can be displayed on selenium errors
    // to show the line number in the testcase where the error occured
    //
    // TODO: look for a better place to do this
    if (!ParameterizedStep._patchedBrowser) {
      browser = new Proxy(browser, {
          get: function(target, name) {
              if (!ParameterizedStep._commandBlacklist.hasOwnProperty(name) || ParameterizedStep._commandBlacklist[name] === false) {
                  Error.stackTraceLimit = 30

                  const error = new Error()
                  const stack = error.stack

                  process.send({ event: 'runner:currentStack', stack: stack, name: name });
              }

              return target[name]
          }
        })

      ParameterizedStep._patchedBrowser = true
  }

    if( typeof params.description !== "undefined" ) {
      this.description = Kiwi.compose(params.description, params.arg)
    }
    if ( typeof params.cb !== "undefined" ) {
      this.execute = prefix => {
        prefix = (typeof prefix === 'undefined') ? '' : `${prefix} `
        process.send({event: 'step:start', title: `${prefix}${this.description}`, arg: CircularJson.stringify(params.arg)})
        const result: O = stepFunc(params.arg)
        process.send({event: 'step:start', title: `Callback`, arg: CircularJson.stringify(result)})
        params.cb(result)
        process.send({event: 'step:end'})
        process.send({event: 'step:end', arg: CircularJson.stringify(result)})
      }
    } else {
      this.execute = prefix => {
        prefix = (typeof prefix === 'undefined') ? '' : `${prefix} `
        process.send({event: 'step:start', title: `${prefix}${this.description}`, arg: CircularJson.stringify(params.arg)})
        const result: O = stepFunc(params.arg)
        process.send({event: 'step:end', arg: CircularJson.stringify(result)})
      }
    }
  }
}