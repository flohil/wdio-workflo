import Kiwi from './Kiwi'
import * as _ from 'lodash'
import CircularJson from 'circular-json'

export function mergeStepDefaults<I, O>
( defaults: Partial<I>, params: IStepArgs<I, O> | IOptStepArgs<I, O>): IStepArgs<I, O> {
  const _params = <any>params

  const res: { arg?: { [ key: string ]: any }, cb?: any } = _params || {}
  res.arg = _.merge( defaults, res.arg )
  return _params
}

export function stepsGetter(target, name, receiver) {
  if (typeof name === "string") {
    const stepName: string = name
    const parameterizedStep: Workflo.StepImpl = target[stepName]

    if ( typeof parameterizedStep === "undefined" ) {
      throw new Error(`Step ${stepName} is not implemented`)
    }

    return <I, O>(stepCbArgs: IOptStepArgs<I, O> = {}) : IParameterizedStep => {
      stepCbArgs.description = stepName

      const stepArgs = mergeStepDefaults({}, stepCbArgs)

      return parameterizedStep(stepArgs)
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
  public execute: (prefix: string) => void

  constructor(params: IOptStepArgs<I, O>, stepFunc: (arg: I) => O) {
    if( typeof params.description !== "undefined" ) {
      this.description = Kiwi.compose(params.description, params.arg)
    }
    if ( typeof params.cb !== "undefined" ) {
      this.execute = prefix => {
        prefix = (typeof prefix === 'undefined') ? '' : `${prefix} `
        process.send({event: 'step:start', title: `${prefix}${this.description}`, arg: CircularJson.stringify(params.arg)})
        const result: O = stepFunc(params.arg)
        process.send({event: 'step:start', title: `Callback`, arg: CircularJson.stringify(result)})
        params.cb(result)
        process.send({event: 'step:end'})
        process.send({event: 'step:end', arg: CircularJson.stringify(result)})
      }
    } else {
      this.execute = prefix => {
        prefix = (typeof prefix === 'undefined') ? '' : `${prefix} `
        process.send({event: 'step:start', title: `${prefix}${this.description}`, arg: CircularJson.stringify(params.arg)})
        const result: O = stepFunc(params.arg)
        process.send({event: 'step:end', arg: CircularJson.stringify(result)})
      }
    }
  }
}