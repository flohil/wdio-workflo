"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Kiwi_1 = require("./Kiwi");
function stepsGetter(target, name, receiver) {
    if (typeof name === "string") {
        const stepName = name;
        const parameterizedStep = target[stepName];
        if (typeof parameterizedStep === "undefined") {
            throw new Error(`Step ${stepName} is not implemented`);
        }
        return (stepCbArgs) => {
            stepCbArgs.description = stepName;
            return parameterizedStep(stepCbArgs);
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
        if (typeof params.description !== "undefined") {
            this.description = Kiwi_1.default.compose(params.description, params.arg);
        }
        if (typeof params.cb !== "undefined") {
            this.execute = () => params.cb(stepFunc(params.arg));
        }
        else {
            this.execute = () => stepFunc(params.arg);
        }
    }
}
exports.ParameterizedStep = ParameterizedStep;
//# sourceMappingURL=steps.js.map