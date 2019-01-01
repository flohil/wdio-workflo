"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Kiwi_1 = require("./Kiwi");
const _ = require("lodash");
const CircularJson = require("circular-json");
function mergeStepDefaults(defaults, params) {
    const _params = params;
    const res = _params || {};
    res.arg = _.merge(defaults, res.arg);
    return _params;
}
function stepsGetter(target, name, receiver) {
    if (typeof name === "string") {
        const stepName = name;
        const parameterizedStep = target[stepName];
        if (typeof parameterizedStep === "undefined") {
            throw new Error(`Step ${stepName} is not implemented`);
        }
        return (stepCbArgs = {}) => {
            stepCbArgs.description = stepName;
            const stepArgs = mergeStepDefaults({}, stepCbArgs);
            return parameterizedStep(stepArgs);
        };
    }
    else {
        throw new Error("Property keys of Steps must be of type string: Step " + name.toString);
    }
}
exports.stepsGetter = stepsGetter;
function stepsSetter(target, name, value) {
    throw new Error("Step implementations may not be changed: Tried to set Step " + name.toString() + " to value " + value.toString());
}
exports.stepsSetter = stepsSetter;
class ParameterizedStep {
    constructor(params, stepFunc) {
        // HACK!!!
        // patch browser object to create stacktrace which can be displayed on selenium errors
        // to show the line number in the testcase where the error occured
        //
        // TODO: look for a better place to do this
        if (!ParameterizedStep._patchedBrowser) {
            browser = new Proxy(browser, {
                get: function (target, name) {
                    if (!ParameterizedStep._commandBlacklist.hasOwnProperty(name) || ParameterizedStep._commandBlacklist[name] === false) {
                        Error.stackTraceLimit = 30;
                        const error = new Error();
                        const stack = error.stack;
                        process.send({ event: 'runner:currentStack', stack: stack, name: name });
                    }
                    return target[name];
                }
            });
            ParameterizedStep._patchedBrowser = true;
        }
        if (typeof params.description !== "undefined") {
            this.description = Kiwi_1.default.compose(params.description, params.arg);
        }
        if (typeof params.cb !== "undefined") {
            this.execute = prefix => {
                prefix = (typeof prefix === 'undefined') ? '' : `${prefix} `;
                process.send({ event: 'step:start', title: `${prefix}${this.description}`, arg: CircularJson.stringify(params.arg) });
                const result = stepFunc(params.arg);
                process.send({ event: 'step:start', title: `Callback`, arg: CircularJson.stringify(result) });
                params.cb(result);
                process.send({ event: 'step:end' });
                process.send({ event: 'step:end', arg: CircularJson.stringify(result) });
            };
        }
        else {
            this.execute = prefix => {
                prefix = (typeof prefix === 'undefined') ? '' : `${prefix} `;
                process.send({ event: 'step:start', title: `${prefix}${this.description}`, arg: CircularJson.stringify(params.arg) });
                const result = stepFunc(params.arg);
                process.send({ event: 'step:end', arg: CircularJson.stringify(result) });
            };
        }
    }
}
ParameterizedStep._patchedBrowser = false;
ParameterizedStep._commandBlacklist = {
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
};
exports.ParameterizedStep = ParameterizedStep;
//# sourceMappingURL=steps.js.map