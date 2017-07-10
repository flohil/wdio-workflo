export declare function stepsGetter(target: any, name: any, receiver: any): <I, O>(stepCbArgs?: IStepArgs<I, O>) => IParameterizedStep;
export declare function stepsSetter(target: any, name: any, value: any): boolean;
export declare class ParameterizedStep<I, O> implements IParameterizedStep {
    description: string;
    execute: (prefix: string) => void;
    constructor(params: IStepArgs<I, O>, stepFunc: (arg: I) => O);
}
