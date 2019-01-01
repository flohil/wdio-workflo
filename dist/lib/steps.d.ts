/**
 * This function must be used as a getter for all steps in wdio-workflo to ensure their correct functionality.
 *
 * By default, this is already taken care of in the steps/index.ts template file created
 * when executing `wdio-workflo --init`.
 *
 * @param target
 * @param name
 * @param receiver
 */
export declare function stepsGetter(target: any, name: any, receiver: any): <I, O>(stepCbArgs?: Workflo.IOptStepArgs<I, O>) => Workflo.IStep;
/**
 * This function must be used as a setter for all steps in wdio-workflo to ensure their correct functionality.
 *
 * By default, this is already taken care of in the steps/index.ts template file created
 * when executing `wdio-workflo --init`.
 *
 * @param target
 * @param name
 * @param value
 */
export declare function stepsSetter(target: any, name: any, value: any): boolean;
/**
 * This class is used to implement all steps in wdio-workflo.
 *
 * ParameterizedSteps are each identified by a step description that briefly summarizes in natural language all the
 * state manipulations performed by the step. This step description is also displayed in the generated test reports and
 * should therefore be understandable for all stakeholders.
 *
 * A ParameterizedStep is not executed when
 *
 * needs to be executed with the same parameters
 *
 * always with the same parameters and therefore called ParameterizedStep - but executed at a later point
 *
 */
export declare class Step<I, O> implements Workflo.IStep {
    /**
     *
     */
    __description: string;
    __execute: (prefix: string) => void;
    private static _patchedBrowser;
    private static _commandBlacklist;
    /**
     *
     * @param params
     * @param stepFunc
     */
    constructor(params: Workflo.IOptStepArgs<I, O>, stepFunc: (arg: I) => O);
}
