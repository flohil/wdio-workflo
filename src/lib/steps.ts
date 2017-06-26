import Kiwi from './Kiwi'

export function stepsGetter(target, name, receiver) {
  if (typeof name === "string") {
    const stepName: string = name
    const parameterizedStep: Workflo.StepImpl = target[stepName]

    if ( typeof parameterizedStep === "undefined" ) {
      throw new Error(`Step ${stepName} is not implemented`)
    }

    return <I, O>(stepCbArgs: IStepArgs<I, O>) : IParameterizedStep => {
      stepCbArgs.description = stepName

      return parameterizedStep(stepCbArgs)
    }
  } else {
    throw new Error("Property keys of Steps must be of type string: Step " + name.toString)
  }
}

export function stepsSetter(target, name, value) : boolean {
  throw new Error("Step implementations may not be changed: Tried to set Step " + name.toString() + " to value " + value.toString())
}

export class ParameterizedStep<I, O> implements IParameterizedStep {
  public description: string
  public execute: () => void

  constructor(params: IStepArgs<I, O>, stepFunc: (arg: I) => O) {
    if( typeof params.description !== "undefined" ) {
      this.description = Kiwi.compose(params.description, params.arg)
    }
    if ( typeof params.cb !== "undefined" ) {
      this.execute = () => params.cb(stepFunc(params.arg))
    } else {
      this.execute = () => stepFunc(params.arg)
    }
  }
}