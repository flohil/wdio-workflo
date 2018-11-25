import { stepsGetter, stepsSetter } from 'wdio-workflo'

////////////////////////////////////////////////////////////////////////
// EDIT THIS AREA IN ORDER FOR INTELLISENSE TO SUGGEST STEPS BY NAMES
////////////////////////////////////////////////////////////////////////

// IMPORT YOUR STEPS FROM THE STEP DEFINITION FILES
// import DemoSteps from '?/steps/demo.step'
// import OtherSteps from '?/steps/other.step'

// REPLACE THIS LINE AND ADD YOUR STEPS IN THE WAY SHOWN BELOW
const Steps = Object.assign({})

// CREATE A SINGLE STEPS OBJECT THAT MERGES ALL STEP DEFINITIONS
// const Steps:
//   typeof DemoSteps &
//   typeof OtherSteps
// = Object.assign(
//   DemoSteps,
//   OtherSteps
// )

////////////////////////////////////////////////////////////////////////

const steps = new Proxy(Steps, {
  get: (target, name, receiver) => stepsGetter(target, name, receiver),
  set: (target, name, value) => stepsSetter(target, name, value)
})

export default steps