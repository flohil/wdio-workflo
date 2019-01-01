import { XPathBuilder } from './page_objects/builders'
import { IExecutionFilters, ITraceInfo, IAnalysedCriteria } from './cli'

const testinfo = require((<any> jasmine.getEnv()).testInfoFilePath)
const executionFilters = <IExecutionFilters> testinfo.executionFilters
const traceInfo = <ITraceInfo> testinfo.traceInfo
const criteriaAnalysis = <IAnalysedCriteria> testinfo.criteriaAnalysis
const automaticOnly = <boolean> testinfo.automaticOnly
const manualOnly = <boolean> testinfo.manualOnly
const retries = <number> testinfo.retries
const bail = testinfo.bail;

const storyMap: Map<string, Workflo.IStoryMapEntry> = new Map<string, Workflo.IStoryMapEntry>()

const words = {
  'Given': 'Given',
  'When': 'When',
  'Then': 'Then',
  'And': 'And',
}

const STACKTRACE_FILTER = /(node_modules(\/|\\)(\w+)*|wdio-sync\/build|- - - - -)/g
const STACKTRACE_FILTER_2 = /    at.*:\d+:\d+/;

function cleanStack (error) {
  let stack = error.split('\n')
  stack = stack.filter((line) => {
    return !line.match(STACKTRACE_FILTER) && line.match(STACKTRACE_FILTER_2);
  })
  error = stack.join('\n')
  return error
}

function featuresInclude(id: string) {
  return id in executionFilters.features
}

function specsInclude(id: string) {
  return id in executionFilters.specs
}

function suitesInclude(id: string) {
  return id in executionFilters.suites
}

function testcasesInclude(id: string) {
  return id in executionFilters.testcases
}

function shouldRunThen(story: string, criteria: number) {
  // check if spec is included in filters
  // do not execute spec if it is not in testcase filters but in validated in other testcases

  const testcases = traceInfo.specs[story].criteriaValidationFiles[criteria.toString()].testcaseIds

  let inSomeTestcase = false

  if (!manualOnly) {
    for (const testcase in testcases) {
      if (testcase in executionFilters.testcases) {
        return true
      }
    }
  }

  if (criteria in criteriaAnalysis.specs[story].uncovered) {
    return true
  }

  if (!automaticOnly) {
    if (criteria in criteriaAnalysis.specs[story].manual) {
      return true
    }
  }

  return false
}

export const Feature = (
  description: string,
  metadata: Workflo.IFeatureMetadata,
  bodyFunc: () => void,
  jasmineFunc: (description: string, bodyFunc: () => void) => void = describe
) => {
  this.__currentFeature = description

  if (featuresInclude(description)) {
    jasmineFunc(`${description}:`, bodyFunc)
  }
}

export const fFeature = (
  description: string,
  metadata: Workflo.IFeatureMetadata,
  bodyFunc: () => void
) => {
  Feature(description, metadata, bodyFunc, fdescribe)
}

export const xFeature = (
  description: string,
  metadata: Workflo.IFeatureMetadata,
  bodyFunc: () => void
) => {
  Feature(description, metadata, bodyFunc, xdescribe)
}

export const Story = (
  id: string,
  description: string,
  metadata: Workflo.IStoryMetaData,
  bodyFunc: () => void,
  jasmineFunc: (description: string, bodyFunc: () => void) => void = describe
) => {
  const fullStoryName = `${id} - ${description}`

  this.__currentStoryId = id

  storyMap.set(id, {
    descriptionStack: {givens: [], whens: []},
    metadata: metadata,
    featureName: this.__currentFeature,
    storyName: fullStoryName,
    description: description,
    insideWhenSequence: false,
    whenSequenceLengths: [],
    whenRecLevel: 0,
    insideGivenSequence: false,
    givenSequenceLengths: [],
    givenRecLevel: 0
  })

  if (specsInclude(id)) {
    jasmineFunc(fullStoryName, bodyFunc)
  }
}

export const fStory = (
  id: string,
  description: string,
  metadata: Workflo.IStoryMetaData,
  bodyFunc: () => void,
) => {
  Story(id, description, metadata, bodyFunc, fdescribe)
}

export const xStory = (
  id: string,
  description: string,
  metadata: Workflo.IStoryMetaData,
  bodyFunc: () => void,
) => {
  Story(id, description, metadata, bodyFunc, xdescribe)
}

export const Given = (description: string, bodyFunc?: () => void) => {
  const story = storyMap.get(this.__currentStoryId)

  const prevRecDepth = story.givenSequenceLengths.length

  // new given block
  if (!story.insideGivenSequence) {
    // remove descriptions from previous given blocks in same recursion level
    const prevGivens = story.givenSequenceLengths[story.givenRecLevel]

    for (let i = 0; i < prevGivens; ++i) {
      story.descriptionStack.givens.pop()
    }

    story.givenSequenceLengths[story.givenRecLevel] = 0
  } else {
    story.insideGivenSequence = false
  }

  story.descriptionStack.givens.push(description)

  if (bodyFunc) {

    // for counting number of given sequence elements in nested block
    story.givenSequenceLengths.push(0)
    story.givenRecLevel++

    bodyFunc()

    story.givenRecLevel--

    const newRecDepth = story.givenSequenceLengths.length

    // removes descriptions of nested givens
    if (newRecDepth > prevRecDepth) {
      const nestedDescriptionsCount = story.givenSequenceLengths[newRecDepth - 1]

      for (let i = 0; i < nestedDescriptionsCount; ++i) {
        story.descriptionStack.givens.pop()
      }
    }

    story.givenSequenceLengths.pop()
  }

  // if there is no count for current recursion level yet
  if (story.givenSequenceLengths.length <= story.givenRecLevel) {
    story.givenSequenceLengths.push(0)
  }

  // increase length of sequence in current recursion level
  story.givenSequenceLengths[story.givenSequenceLengths.length - 1]++

  return {
    "And": (description: string, bodyFunc?: () => void) => {
      story.insideGivenSequence = true
      return Given.call(this, description, bodyFunc)
    }
  }
}

export const When = (description: string, bodyFunc?: () => void) => {
  const story = storyMap.get(this.__currentStoryId)

  const prevRecDepth = story.whenSequenceLengths.length

  // new when block
  if (!story.insideWhenSequence) {
    // remove descriptions from previous when blocks in same recursion level
    const prevWhens = story.whenSequenceLengths[story.whenRecLevel]

    for (let i = 0; i < prevWhens; ++i) {
      story.descriptionStack.whens.pop()
    }

    story.whenSequenceLengths[story.whenRecLevel] = 0
  } else {
    story.insideWhenSequence = false
  }

  story.descriptionStack.whens.push(description)

  if (bodyFunc) {

    // for counting number of when sequence elements in nested block
    story.whenSequenceLengths.push(0)
    story.whenRecLevel++

    bodyFunc()

    story.whenRecLevel--

    const newRecDepth = story.whenSequenceLengths.length

    // removes descriptions of nested whens
    if (newRecDepth > prevRecDepth) {
      const nestedDescriptionsCount = story.whenSequenceLengths[newRecDepth - 1]

      for (let i = 0; i < nestedDescriptionsCount; ++i) {
        story.descriptionStack.whens.pop()
      }
    }

    story.whenSequenceLengths.pop()
  }

  // if there is no count for current recursion level yet
  if (story.whenSequenceLengths.length <= story.whenRecLevel) {
    story.whenSequenceLengths.push(0)
  }

  // increase length of sequence in current recursion level
  story.whenSequenceLengths[story.whenSequenceLengths.length - 1]++

  return {
    "And": (description: string, bodyFunc?: () => void) => {
      story.insideWhenSequence = true
      return When.call(this, description, bodyFunc)
    }
  }
}

export const Then = (
  id: number,
  description: string,
  jasmineFunc: (description: string, bodyFunc: () => void) => void = it,
  skip: boolean = false
) => {
  const story = storyMap.get(this.__currentStoryId)
  const storyId = this.__currentStoryId

  if (!shouldRunThen(storyId, id)) {
    return
  }

  const stepFunc = (title) => {
    process.send({event: 'step:start', title: title})
    process.send({event: 'step:end'})
  }

  const reduceFunc = (acc, cur) => acc + `\n${words.And} ` + cur

  const givenDescriptions = [ `${words.Given} ${story.descriptionStack.givens[0]}` ]
  .concat(
    story.descriptionStack.givens
    .slice(1, story.descriptionStack.givens.length)
    .map(description => `${words.And.toLocaleLowerCase()} ${description}`)
  )

  const whenDescriptions = [ `${words.When} ${story.descriptionStack.whens[0]}` ]
  .concat(
    story.descriptionStack.whens
    .slice(1, story.descriptionStack.whens.length)
    .map(description => `${words.And.toLocaleLowerCase()} ${description}`)
  )

  const thenDescription = `${words.Then} ${description}`

  const allDescriptions: string[] = givenDescriptions.concat(whenDescriptions).concat([thenDescription])

  const skipFunc = (skip) ? () => { pending() } : undefined

  const bodyFunc = () => {

    process.send({event: 'test:setCurrentId', id: `${storyId}|${id}`, spec: true, descriptions: {
      spec: story.description,
      criteria: description
    }}) // split at last | occurence

    // allure report metadata
    process.send({event: 'test:meta', epic: `Specs`});
    process.send({event: 'test:meta', feature: `${story.featureName}`})
    process.send({event: 'test:meta', story: `${story.storyName}`})
    process.send({event: 'test:meta', issue: story.metadata.issues})
    process.send({event: 'test:meta', bug: story.metadata.bugs})
    process.send({event: 'test:meta', severity: story.metadata.severity || 'normal'})

    // create an allure step for each given and when
    allDescriptions.slice(0, allDescriptions.length - 1).forEach(description => stepFunc(description))

    // for last allure step (then), check if results where correct
    process.send({event: 'step:start', title: allDescriptions[allDescriptions.length - 1]})
    process.send({event: 'step:end', validate: {
      criteriaId: id,
      storyId: storyId
    }})
  }

  const testData = {
    title: `${words.Then} ${id}: ${description}`,
    metadata: {
      feature: story.featureName,
      story: story.storyName,
      issue: story.metadata.issues,
      severity: story.metadata.severity
    }
  }

  jasmineFunc(JSON.stringify(testData), skipFunc || bodyFunc)
}

export const fThen = (
  id: number,
  description: string
) => {
  Then(id, description, fit)
}

export const xThen = (
  id: number,
  description: string
) => {
  Then(id, description, it, true)
}

export const suite = (
  description: string,
  metadata: Workflo.ISuiteMetadata,
  bodyFunc: () => void,
  jasmineFunc: (description: string, bodyFunc: () => void) => void = describe
) => {
  if (!this.suiteIdStack) {
    this.suiteIdStack = [description]
  }
  else {
    this.suiteIdStack.push(description)
  }

  if (suitesInclude(this.suiteIdStack.join('.'))) {
    jasmineFunc(description, bodyFunc)
  }

  this.suiteIdStack.pop()
}

export const fsuite = (
  description: string,
  metadata: Workflo.ISuiteMetadata,
  bodyFunc: () => void
) => {
  suite(description, metadata, bodyFunc, fdescribe)
}

export const xsuite = (
  description: string,
  metadata: Workflo.ISuiteMetadata,
  bodyFunc: () => void
) => {
  suite(description, metadata, bodyFunc, xdescribe)
}

export const testcase = (
  description: string,
  metadata: Workflo.ITestcaseMetadata,
  bodyFunc: () => void,
  jasmineFunc: (description: string, bodyFunc: () => void) => void = it
) => {
  const fullSuiteId = this.suiteIdStack.join('.')
  const fullId = `${fullSuiteId}.${description}`

  this.__stepStack = []

  const testData = {
    title: description
  }

  let remainingTries = retries;
  let performedTries = 0

  const _bodyFunc = () => {
    process.send({event: 'test:setCurrentId', id: fullId, testcase: true})

    process.send({event: 'test:meta', epic: `Testcases`});
    process.send({event: 'test:meta', story: fullSuiteId})

    // allure report metadata
    if (metadata.bugs) {
      process.send({event: 'test:meta', bug: metadata.bugs})
    }
    if (metadata.testId) {
      process.send({event: 'test:meta', testId: metadata.testId})
    }
    process.send({event: 'test:meta', severity: metadata.severity || 'normal'})

    if (bail && (<any> global).bailErrors && (<any> global).bailErrors >= bail) {
      jasmineSpecObj.throwOnExpectationFailure = false;
      pending();
    } else {
      process.send({event: 'retry:resetErrors' })

      while (remainingTries >= 0) {
        jasmineSpecObj.result.failedExpectations = []
        jasmineSpecObj.result.passedExpectations = []
        jasmineSpecObj.result.deprecationWarnings = []
        if (remainingTries > 0) {
          (<any> global).ignoreErrors = true
          performedTries++
          try {
            bodyFunc();
            remainingTries = -1;
          }
          catch (error) {
            if (error.stack.indexOf('at JasmineAdapter._callee$') > -1) {
              process.send({event: 'retry:failed', retry:  performedTries})
            } else {
              const assertion = {
                message: error.message,
                stack: cleanStack(error.stack),
                screenshotFilename: undefined,
                screenshotId: undefined
              }

              if ((<any> global).errorScreenshotFilename) {
                  assertion.screenshotFilename = (<any> global).errorScreenshotFilename,
                  assertion.screenshotId = (<any> global).screenshotId++
              }

              process.send({event: 'retry:broken', assertion: assertion, retry:  performedTries })
            }

            remainingTries--;
          }
        } else {
          (<any> global).ignoreErrors = false
          jasmineSpecObj.throwOnExpectationFailure = false
          bodyFunc();
          remainingTries = -1;
        }
      }
    }
  }

  let jasmineSpecObj = undefined

  if (testcasesInclude(`${this.suiteIdStack.join('.')}.${description}`)) {
    jasmineSpecObj = jasmineFunc(JSON.stringify(testData), _bodyFunc)

    jasmineSpecObj.throwOnExpectationFailure = true
  }
}

export const ftestcase = (
  description: string,
  metadata: Workflo.ITestcaseMetadata,
  bodyFunc: () => void
) => {
  testcase(description, metadata, bodyFunc, fit)
}

export const xtestcase = (
  description: string,
  metadata: Workflo.ITestcaseMetadata,
  bodyFunc: () => void
) => {
  testcase(description, metadata, () => { pending() })
}

const _when = function(step: Workflo.IStep, prefix: string) {
  //process.send({event: 'step:start', title: `${prefix} ${step.description}`})

  step.__execute(prefix)

  //process.send({event: 'step:end'})

  return {
    "and": step => _when(step, words.And.toLowerCase())
  }
}

const _given = function(step: Workflo.IStep, prefix: string) {
  //process.send({event: 'step:start', title: `${prefix} ${step.description}`})

  step.__execute(prefix)

  //process.send({event: 'step:end'})

  return {
    "and": step => _given(step, words.And.toLowerCase()),
    "when": step => _when(step, words.When)
  }
}

export const given = function(step: Workflo.IStep) {
  return _given(step, words.Given)
}

export const validate = function(specObj: Workflo.IValidateSpecObject, func: (...testargs : any[]) => void) {
  const validateContainer: Workflo.IValidateContainer = {
    specObj: specObj
  }

  process.send({event: 'validate:start', specObj: specObj})

  const _process:any = process

  if (typeof _process.workflo === 'undefined') {
    _process.workflo = {}
  }
  _process.workflo.specObj = specObj

  process.send({event: 'step:start', title: `validate: ${JSON.stringify(specObj)}`})

  func()

  process.send({event: 'validate:end', specObj: specObj})
  process.send({event: 'step:end', type: 'validateEnd'})

  _process.workflo.specObj = undefined
}

export function xpath(selector: string) {
  return XPathBuilder.getInstance().reset(selector)
}