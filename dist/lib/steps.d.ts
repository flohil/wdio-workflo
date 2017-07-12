export declare function mergeStepDefaults<D extends {
    [key: string]: any;
}, I, O>(defaults: D, params: IStepArgs<I, O> | IOptStepArgs<I, O>): IStepArgs<I, O>;
export declare function stepsGetter(target: any, name: any, receiver: any): <I, O>(stepCbArgs?: IOptStepArgs<I, O>) => IParameterizedStep;
export declare function stepsSetter(target: any, name: any, value: any): boolean;
export declare class ParameterizedStep<I, O> implements IParameterizedStep {
    description: string;
    execute: (prefix: string) => void;
    constructor(params: IOptStepArgs<I, O>, stepFunc: (arg: I) => O);
}
