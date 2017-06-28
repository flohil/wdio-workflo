const storyMap: Map<string, Workflo.IStoryMapEntry> = new Map<string, Workflo.IStoryMapEntry>()

const words = {
  'Given': 'Given',
  'When': 'When',
  'Then': 'Then',
  'And': 'And',
}

export const Feature = (description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) => {
  this.__currentFeature = description

  describe(`${description}:`, bodyFunc)
}

export const Story = (id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void) => {
  const fullStoryName = `${id} - ${description}`

  this.__currentStoryId = id

  storyMap.set(id, {
    descriptionStack: {givens: [], whens: []},
    metadata: metadata,
    featureName: this.__currentFeature,
    storyName: fullStoryName
  })
  
  describe(fullStoryName, bodyFunc)  
}

export const Given = (description: string, bodyFunc: () => void) => {  
  const story = storyMap.get(this.__currentStoryId)

  story.descriptionStack.givens.push(description)

  bodyFunc()

  // top element can either be string of given or array of strings from when
  const topElem = story.descriptionStack.givens.pop()

  // if array of strings from when -> remove both when string array and given string
  story.descriptionStack.whens = []
}

export const When = (description: string, bodyFunc: () => void) => {
  const story = storyMap.get(this.__currentStoryId)

  story.descriptionStack.whens.push(description) // empty after when chain has ended

  bodyFunc()

  return {
    "And": (description: string, bodyFunc: () => void) => When.call(this, description, bodyFunc)
  }
}

export const Then = (id: number, description: string) => {
  const story = storyMap.get(this.__currentStoryId)
  const storyId = this.__currentStoryId

  const stepFunc = (title) => {
    process.send({event: 'step:triggerSpecMode'}) // workaround until runner and reporter are properly customized
    process.send({event: 'step:start', title: title})
    process.send({event: 'step:end'})
  }

  const reduceFunc = (acc, cur) => acc + "\nAnd " + cur

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
  
  it(`${words.Then} ${id}: ${description}`, bodyFunc)
}

export const suite = (description: string, metadata: Workflo.ISuiteMetadata, bodyFunc: () => void) => {
  describe(description, bodyFunc)
}

export const testcase = (description: string, metadata: Workflo.ITestcaseMetadata, bodyFunc: () => void) => {
  this.__stepStack =[]

  it(description, bodyFunc)
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