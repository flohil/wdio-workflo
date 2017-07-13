export declare function mergeStepDefaults<I, O>(params: IStepArgs<I, O> | IOptStepArgs<I, O>, defaults: I): IStepArgs<I, O>;
export declare function stepsGetter(target: any, name: any, receiver: any): <I, O>(stepCbArgs?: IOptStepArgs<I, O>) => IParameterizedStep;
export declare function stepsSetter(target: any, name: any, value: any): boolean;
export declare class ParameterizedStep<I, O> implements IParameterizedStep {
    description: string;
    execute: (prefix: string) => void;
    constructor(params: IOptStepArgs<I, O>, stepFunc: (arg: I) => O);
}
