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
export declare class Step<ArgsType extends Object, ReturnType> implements Workflo.IStep {
    __description: string;
    __execute: (prefix: string) => void;
    private static _patchedBrowser;
    private static _commandBlacklist;
    /**
     * Steps consist of a description and an execution function.
     * The execution function performs changes to the state of the tested application and the description briefly summarizes
     * these changes in natural language.
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
     * @template ArgsType defines the type of the step arguments passed to the execution function.
     * @template ReturnType defines the return type of the execution function.
     * @param params encapsulates the following step parameters: description, step arguments and step callback
     * @param executionFunction changes the state of the tested application
     */
    constructor(params: Workflo.IOptStepArgs<ArgsType, ReturnType>, executionFunction: (arg: ArgsType) => ReturnType);
}
