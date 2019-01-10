import {defineSteps, proxifySteps} from 'wdio-workflo'

////////////////////////////////////////////////////////////
// EDIT THIS AREA TO CREATE A MERGED STEP DEFINITIONS OBJECT
////////////////////////////////////////////////////////////

// IMPORT YOUR STEP DEFINITIONS
// import {demoSteps} from '?/steps/demo.step'
// import {otherSteps} from '?/steps/other.step'

// MERGE ALL STEP DEFINITIONS IN ONE OBJECT AS SHOWN BELOW
const stepDefinitions = defineSteps({})

// const stepDefinitions = defineSteps({
//   ...demoSteps,
//   ...otherSteps,
// })

////////////////////////////////////////////////////////////

const steps = proxifySteps(stepDefinitions)

export {steps}