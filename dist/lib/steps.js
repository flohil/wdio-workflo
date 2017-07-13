"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Kiwi_1 = require("./Kiwi");
const _ = require("lodash");
function mergeStepDefaults(params, defaults) {
    const _params = params;
    const res = _params || {};
    res.arg = _.merge(defaults, res.arg);
    return _params;
}
exports.mergeStepDefaults = mergeStepDefaults;
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
        // REMOVE
        console.log("params: ", params);
        if (typeof params.description !== "undefined") {
            this.description = Kiwi_1.default.compose(params.description, params.arg);
        }
        if (typeof params.cb !== "undefined") {
            this.execute = prefix => {
                prefix = (typeof prefix === 'undefined') ? '' : `${prefix} `;
                process.send({ event: 'step:start', title: `${prefix}${this.description}`, arg: JSON.stringify(params.arg) });
                const result = stepFunc(params.arg);
                process.send({ event: 'step:start', title: `Callback`, arg: JSON.stringify(result) });
                params.cb(result);
                process.send({ event: 'step:end' });
                process.send({ event: 'step:end', arg: JSON.stringify(result) });
            };
        }
        else {
            this.execute = prefix => {
                prefix = (typeof prefix === 'undefined') ? '' : `${prefix} `;
                process.send({ event: 'step:start', title: `${prefix}${this.description}`, arg: JSON.stringify(params.arg) });
                const result = stepFunc(params.arg);
                process.send({ event: 'step:end', arg: JSON.stringify(result) });
            };
        }
    }
}
exports.ParameterizedStep = ParameterizedStep;
//# sourceMappingURL=steps.js.map