const storyMap: Map<string, Workflo.IStoryMapEntry> = new Map<string, Workflo.IStoryMapEntry>()

const words = {
  'Given': 'Given',
  'When': 'When',
  'Then': 'Then',
  'And': 'And',
}

export const Feature = (
  description: string, 
  metadata: Workflo.IFeatureMetadata, 
  bodyFunc: () => void, 
  jasmineFunc: (description: string, bodyFunc: () => void) => void = describe
) => {
  this.__currentFeature = description

  jasmineFunc(`${description}:`, bodyFunc)
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
    insideWhenSequence: false,
    whenSequenceLengths: [],
    whenRecLevel: 0,
    insideGivenSequence: false,
    givenSequenceLengths: [],
    givenRecLevel: 0
  })
  
  jasmineFunc(fullStoryName, bodyFunc)  
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

/*export const When = (description: string, bodyFunc?: () => void) => {
  const story = storyMap.get(this.__currentStoryId)

  if (!story.insideWhenSequence) {
    story.descriptionStack.whens = []
  } else {
    story.insideWhenSequence = false
  }

  story.descriptionStack.whens.push(description) // empty after when chain has ended

  if (bodyFunc) {
    bodyFunc()
  }
  
  return {
    "And": (description: string, bodyFunc?: () => void) => {
      story.insideWhenSequence = true
      return When.call(this, description, bodyFunc)
    }
  }
}*/

export const Then = (
  id: number, 
  description: string,
  jasmineFunc: (description: string, bodyFunc: () => void) => void = it
) => {
  const story = storyMap.get(this.__currentStoryId)
  const storyId = this.__currentStoryId

  const stepFunc = (title) => {
    process.send({event: 'step:triggerSpecMode'}) // workaround until runner and reporter are properly customized
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

  const bodyFunc = () => {
    // allure report metadata
    process.send({event: 'test:meta', feature: `${story.featureName}`})
    process.send({event: 'test:meta', story: `${story.storyName}`})
    process.send({event: 'test:meta', issue: story.metadata.issues})
    process.send({event: 'test:meta', severity: story.metadata.severity || 'normal'})

    process.send({event: 'test:meta', description: 'my description'})

    // create an allure step for each given and when
    allDescriptions.slice(0, allDescriptions.length - 1).forEach(description => stepFunc(description))

    // for last allure step (then), check if results where correct
    process.send({event: 'step:start', title: allDescriptions[allDescriptions.length - 1]})
    process.send({event: 'step:end', verify: {
      criteriaId: id,
      storyId: storyId
    }})
  }
  
  jasmineFunc(`${words.Then} ${id}: ${description}`, bodyFunc)
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
  Then(id, description, xit)
}

export const suite = (
  description: string, 
  metadata: Workflo.ISuiteMetadata, 
  bodyFunc: () => void,
  jasmineFunc: (description: string, bodyFunc: () => void) => void = describe
) => {
  jasmineFunc(description, bodyFunc)
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
  this.__stepStack =[]

  jasmineFunc(description, bodyFunc)
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
  testcase(description, metadata, bodyFunc, xit)
}

const _when = function(step: IParameterizedStep, prefix: string) {
  //process.send({event: 'step:start', title: `${prefix} ${step.description}`})
  
  step.execute(prefix)
  
  //process.send({event: 'step:end'})

  return {
    "and": step => _when(step, words.And.toLowerCase())
  }
}

const _given = function(step: IParameterizedStep, prefix: string) { 
  //process.send({event: 'step:start', title: `${prefix} ${step.description}`})
  
  step.execute(prefix)
  
  //process.send({event: 'step:end'})

  return {
    "and": step => _given(step, words.And.toLowerCase()),
    "when": step => _when(step, words.When)
  }
}

export const given = function(step: IParameterizedStep) {
  return _given(step, words.Given)
}

export const verify = function(specObj: Workflo.IVerifySpecObject, func: (...testargs : any[]) => void) {
  const verifyContainer: Workflo.IVerifyContainer = {
    specObj: specObj
  }

  process.send({event: 'step:verifyStart', verifyContainer: verifyContainer})

  const _process:any = process

  if (typeof _process.workflo === 'undefined') {
    _process.workflo = {}
  }

  _process.workflo.specObj = specObj

  process.send({event: 'step:start', title: `verify: ${JSON.stringify(specObj)}`})

  func()

  process.send({event: 'step:end', type: 'verifyEnd'})

  _process.workflo.specObj = undefined
}