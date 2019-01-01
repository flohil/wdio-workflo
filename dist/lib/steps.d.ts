/**
 * Use this function to create step definitions and preserve their types.
 *
 * @param stepDefinitions An object whose keys are step descriptions and whose values are step creation functions.
 */
export declare function defineSteps<StepDefinitions extends Workflo.StepDefinitions>(stepDefinitions: StepDefinitions): StepDefinitions;
/**
 * Creates a Proxy that adds custom getters and setters to the merged step definitions.
 * Steps in wdio-workflo can only function properly if this proxy is used to interact with them.
 *
 * @param stepDefinitions the merged step definitions
 * @returns the proxified steps
 */
export declare function proxifySteps(stepDefinitions: Workflo.StepDefinitions): Record<string, (params?: Workflo.IStepParams<any, any> | Workflo.IOptStepParams<any, any>) => Workflo.IStep>;
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
    constructor(params: Workflo.IOptStepParams<ArgsType, ReturnType>, executionFunction: (arg: ArgsType) => ReturnType);
}
