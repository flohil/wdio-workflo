import { stepsGetter, stepsSetter } from '../../../'

////////////////////////////////////////////////////////////////////////
// EDIT THIS AREA IN ORDER FOR INTELLISENSE TO SUGGEST STEPS BY NAMES
////////////////////////////////////////////////////////////////////////

import LoginSteps from './login.step'
import LogoutSteps from './logout.step'

// create a single steps object that merges all single step definitions
const Steps = Object.assign({}, LoginSteps, LogoutSteps)

////////////////////////////////////////////////////////////////////////

const steps = new Proxy(Steps, {
  get: (target, name, receiver) => stepsGetter(target, name, receiver),
  set: (target, name, value) => stepsSetter(target, name, value)
})

export default steps