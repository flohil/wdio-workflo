"use strict";
// import { getAllMethods } from './utilityFunctions/class'
// import * as _ from 'lodash'
Object.defineProperty(exports, "__esModule", { value: true });
const steps_1 = require("./steps");
const Steps = {
    "open container base dialog in content administration": (params) => new steps_1.ParameterizedStep(params, () => {
    }),
    /*"fill data in container settings dialog in content administration": (params?: IStepArgs< { formValues: { [key: string]:any } }, void> ): IParameterizedStep =>
      new ParameterizedStep(mergeStepDefaults({fo}, params ), (formValues) : void => {
        console.log("formValues: ", formValues)
      }),*/
    "fill data in container settings dialog in content administration": (params) => new steps_1.ParameterizedStep(steps_1.mergeStepDefaults({}, params), (formValues) => {
        console.log("formValues: ", formValues);
    }),
    /*"fill data in container settings dialog in content administration": (params?: IStepArgs< { formValues: { [key: string]:any } }, void> ): IParameterizedStep =>
      new ParameterizedStep(mergeStepDefaults({}, params ), (formValues) : void => {
      }),*/
    "create new container in content administration": (params) => new steps_1.ParameterizedStep(params, () => {
    })
};
const steps = new Proxy(Steps, {
    get: (target, name, receiver) => steps_1.stepsGetter(target, name, receiver),
    set: (target, name, value) => steps_1.stepsSetter(target, name, value)
});
steps["fill data in container settings dialog in content administration"]();
//# sourceMappingURL=testElementsAndStores.js.map