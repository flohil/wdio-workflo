import { readFileSync, existsSync } from "fs"
import * as ts from "typescript"
import * as JSON5 from 'json5'

type NodeArgFunc = (node: ts.Node) => void

// stores pos of callExpression and the function to be executed after this block
let afterFuncTable: Record<string, () => void> = {}

export interface SpecInfo {
  description?: string,
  metadata?: Workflo.IStoryMetaData
}

export interface FeatureInfo {
  metadata?: Workflo.IFeatureMetadata,
  specHash?: SpecHash
}

export type SpecHash = Record<string, SpecInfo>
export type FeatureHash = Record<string, FeatureInfo>

export interface SpecTableEntry {
  specFile: string,
  feature: string,
  testcases: Record<string, true>
  criteria: Record<string, true>
}

export interface FeatureTableEntry {
  specFiles: Record<string, true>
  specs: Record<string, true>
}

export interface SpecFileEntry {
  features: Record<string, true>
  specs: Record<string, true>
}

export type SpecTable = Record<string, SpecTableEntry>

export type FeatureTable = Record<string, FeatureTableEntry>

export type SpecFileTable = Record<string, SpecFileEntry>

export interface SpecParseResults {
  specTable: SpecTable
  specTree: FeatureHash
  featureTable: FeatureTable
  specFileTable: SpecFileTable
}

// used to determine, if a spec is to be executed for a feature or spec filter
const specTable: SpecTable = {}
// used to lookup spec information
const specTree: FeatureHash = {}
const featureTable: FeatureTable = {}
const specFileTable: SpecFileTable = {}

const specParserState: {
  callExpressionPos: number,
  activeSpecFile: string,
  activeFeature: string,
  activeSpecId: string,
  argFuncs: NodeArgFunc[],
  addArgFunc: (NodeArgFunc) => void,
  executeNextArgFunc: NodeArgFunc
} = {
  callExpressionPos: -1,
  activeSpecFile: undefined,
  activeFeature: undefined,
  activeSpecId: undefined,
  argFuncs: [],
  addArgFunc: (argFunc: NodeArgFunc) => {
    specParserState.argFuncs.push(argFunc)
  },
  executeNextArgFunc: (node: ts.Node) => {
    if (specParserState.argFuncs.length > 0) {
      const argFunc = specParserState.argFuncs.shift()

      argFunc(node)
    }
  }
}

export function parseSpecFiles(sourceFile: ts.SourceFile) {
  parseSpecNode(sourceFile);

  function parseSpecNode(node: ts.Node) {
    let nodePos = -1

    specParserState.executeNextArgFunc(node)

    switch (node.kind) {
      case ts.SyntaxKind.CallExpression:
        nodePos = node.pos
        specParserState.callExpressionPos = nodePos
        break
      case ts.SyntaxKind.Identifier:
        // ensure only functions and not varibables etc. are considered
        if (specParserState.callExpressionPos >= 0) {
          const identifier = <ts.Identifier> node
          const parentPos = specParserState.callExpressionPos

          specParserState.callExpressionPos = -1

          switch(identifier.text) {
            case 'fFeature':
            case 'xFeature':
            case 'Feature':
              specParserState.addArgFunc(
                (node) => {
                  const featureId = (<ts.StringLiteral> node).text
                  specParserState.activeFeature = featureId

                  if (!(featureId in specTree)) {
                    specTree[featureId] = {
                      specHash: {}
                    }
                  }

                  if (!(featureId in featureTable)) {
                    featureTable[featureId] = {
                      specFiles: {},
                      specs: {}
                    }
                  }

                  featureTable[featureId].specFiles[specParserState.activeSpecFile] = true
                  specFileTable[specParserState.activeSpecFile].features[featureId] = true
                }
              )
              specParserState.addArgFunc(
                (node) => {
                  const featureMetadata = (<ts.ObjectLiteralExpression> node)
                  const str = sourceFile.text.substr(featureMetadata.pos, featureMetadata.end - featureMetadata.pos)
                  let parsedMetadata

                  try {
                    parsedMetadata = JSON5.parse(str)
                  } catch (e) {
                    console.error(`Failed to parse feature metadata. Please do not use dynamic values inside feature metadata: ${parsedMetadata}\n`)
                    throw e
                  }

                  specTree[specParserState.activeFeature].metadata = parsedMetadata
                }
              )
              afterFuncTable[parentPos] = () => { specParserState.activeFeature = undefined }
              break
            case 'fStory':
            case 'xStory':
            case 'Story':
              specParserState.addArgFunc(
                (node) => {
                  const specId = (<ts.StringLiteral> node).text
                  specParserState.activeSpecId = specId

                  if (!(specId in specTree[specParserState.activeFeature])) {
                    specTree[specParserState.activeFeature].specHash[specId] = {}
                  }
                  if (!(specId in specTable)) {
                    specTable[specId] = {
                      feature: specParserState.activeFeature,
                      specFile: specParserState.activeSpecFile,
                      testcases: {},
                      criteria: {}
                    }
                  }

                  featureTable[specParserState.activeFeature].specs[specId] = true
                  specFileTable[specParserState.activeSpecFile].specs[specId] = true
                }
              )
              specParserState.addArgFunc(
                (node) => {
                  const specDescription = (<ts.StringLiteral> node).text

                  specTree[specParserState.activeFeature].specHash[specParserState.activeSpecId].description = specDescription
                }
              ),
              specParserState.addArgFunc(
                (node) => {
                  const specMetadata = (<ts.ObjectLiteralExpression> node)
                  const str = sourceFile.text.substr(specMetadata.pos, specMetadata.end - specMetadata.pos)
                  let parsedMetadata

                  try {
                    parsedMetadata = JSON5.parse(str)
                  } catch (e) {
                    console.error(`Failed to parse spec metadata. Please do not use dynamic values inside spec metadata: ${parsedMetadata}\n`)
                    throw e
                  }

                  specTree[specParserState.activeFeature].specHash[specParserState.activeSpecId].metadata = parsedMetadata
                }
              )
              afterFuncTable[parentPos] = () => { specParserState.activeSpecId = undefined }
              break
            case 'Then':
              if (!specParserState.activeSpecId) {
                throw new Error(`Then defined outside of story in ${specParserState.activeSpecFile}`)
              }

              specParserState.addArgFunc(
                (node) => {
                  const criteriaId = (<ts.StringLiteral> node).text

                  specTable[specParserState.activeSpecId].criteria[criteriaId] = true
                }
              )
              break
          }
        }
        break
    }

    ts.forEachChild(node, parseSpecNode);

    if (nodePos >= 0 && afterFuncTable[nodePos]) {
      afterFuncTable[nodePos]()
    }
  }
}

export interface TestcaseInfo {
  description?: string,
  metadata?: Workflo.ITestcaseMetadata,
  specValidateHash?: Record<string, Record<string, true>>
}

export interface SuiteInfo {
  metadata?: Workflo.ISuiteMetadata,
  testcaseHash?: TestcaseHash
}

export type TestcaseHash = Record<string, TestcaseInfo>
export type SuiteHash = Record<string, SuiteInfo>

export interface TestcaseTableEntry {
  testcaseFile: string,
  suiteId: string
}

export interface TestcaseFileTableEntry {
  testcases: Record<string, true>
}

export type TestcaseTable = Record<string, TestcaseTableEntry>

// each specId of validateObj has a hash of all fullTestcaseIds that validate it
export type ValidateTable = Record<string, Record<string, true>>

export type TestcaseFileTable = Record<string, TestcaseFileTableEntry>

export interface TestcaseParseResults {
  testcaseTable: TestcaseTable
  tree: SuiteHash
  validateTable: ValidateTable
  testcaseFileTable: TestcaseFileTable
}

// used to determine, if a spec is to be executed for a feature or spec filter
const testcaseTable: TestcaseTable = {}
// used to lookup spec information
const testcaseTree: SuiteHash = {}
const validateTable: ValidateTable = {}
const testcaseFileTable: TestcaseFileTable = {}

const testcaseParserState: {
  callExpressionPos: number,
  activeTestcaseFile: string,
  activeSuiteId: string,
  activeTestcaseId: string,
  argFuncs: NodeArgFunc[],
  addArgFunc: (NodeArgFunc) => void,
  executeNextArgFunc: NodeArgFunc
} = {
  callExpressionPos: -1,
  activeTestcaseFile: undefined,
  activeSuiteId: undefined,
  activeTestcaseId: undefined,
  argFuncs: [],
  addArgFunc: (argFunc: NodeArgFunc) => {
    testcaseParserState.argFuncs.push(argFunc)
  },
  executeNextArgFunc: (node: ts.Node) => {
    if (testcaseParserState.argFuncs.length > 0) {
      const argFunc = testcaseParserState.argFuncs.shift()

      argFunc(node)
    }
  }
}

export function parseTestcaseFiles(sourceFile: ts.SourceFile) {
  parseTestcaseNode(sourceFile);

  function parseTestcaseNode(node: ts.Node) {
    let nodePos = -1

    testcaseParserState.executeNextArgFunc(node)

    switch (node.kind) {
      case ts.SyntaxKind.CallExpression:
        nodePos = node.pos
        testcaseParserState.callExpressionPos = nodePos
        break
      case ts.SyntaxKind.Identifier:
        // ensure only functions and not varibables etc. are considered
        if (testcaseParserState.callExpressionPos >= 0) {
          const identifier = <ts.Identifier> node
          const parentPos = testcaseParserState.callExpressionPos

          testcaseParserState.callExpressionPos = -1

          switch(identifier.text) {
            case 'fsuite':
            case 'xsuite':
            case 'suite':
              testcaseParserState.addArgFunc(
                (node) => {
                  const suiteId = (<ts.StringLiteral> node).text

                  if (typeof testcaseParserState.activeSuiteId === 'undefined') {
                    testcaseParserState.activeSuiteId = suiteId
                  } else {
                    testcaseParserState.activeSuiteId += `.${suiteId}`
                  }

                  const fullSuiteId = testcaseParserState.activeSuiteId

                  if (!(fullSuiteId in testcaseTree)) {
                    testcaseTree[fullSuiteId] = {
                      testcaseHash: {}
                    }
                  }

                  testcaseFileTable[testcaseParserState.activeTestcaseFile].testcases[fullSuiteId] = true
                }
              )
              testcaseParserState.addArgFunc(
                (node) => {
                  const suiteMetadata = (<ts.ObjectLiteralExpression> node)
                  const str = sourceFile.text.substr(suiteMetadata.pos, suiteMetadata.end - suiteMetadata.pos)
                  let parsedMetadata

                  try {
                    parsedMetadata = JSON5.parse(str)
                  } catch (e) {
                    console.error(`Failed to parse suite metadata. Please do not use dynamic values inside suite metadata: ${parsedMetadata}\n`)
                    throw e
                  }

                  testcaseTree[testcaseParserState.activeSuiteId].metadata = parsedMetadata
                }
              )
              afterFuncTable[parentPos] = () => {
                const suiteIds = testcaseParserState.activeSuiteId.split('.')
                suiteIds.pop()

                let fullSuiteId = undefined

                if (suiteIds.length > 0) {
                  fullSuiteId = suiteIds.join('.')

                  if (fullSuiteId === '') {
                    fullSuiteId = undefined
                  }
                }

                testcaseParserState.activeSuiteId = fullSuiteId
              }
              break
            case 'ftestcase':
            case 'xtestcase':
            case 'testcase':
              testcaseParserState.addArgFunc(
                (node) => {
                  const testcaseId = (<ts.StringLiteral> node).text
                  let fullTestcaseId

                  try {
                    fullTestcaseId = `${testcaseParserState.activeSuiteId}.${testcaseId}`
                    testcaseParserState.activeTestcaseId = fullTestcaseId

                    if (!(fullTestcaseId in testcaseTree[testcaseParserState.activeSuiteId])) {
                      testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[fullTestcaseId] = {
                        description: testcaseId
                      }
                    }
                  } catch (e) {
                    if (!testcaseTree[testcaseParserState.activeSuiteId]) {

                        console.error(`Parsed testcase function outside of suite: ${testcaseId}\n
                        Always define testcase functions inside suites and do not use them
                        inside "external" functions invoked from inside suites`)

                        throw e
                    }
                  }

                  if (!(fullTestcaseId in testcaseTable)) {
                    testcaseTable[fullTestcaseId] = {
                      suiteId: testcaseParserState.activeSuiteId,
                      testcaseFile: testcaseParserState.activeTestcaseFile
                    }
                  }

                  testcaseFileTable[testcaseParserState.activeTestcaseFile].testcases[fullTestcaseId] = true
                }
              )
              testcaseParserState.addArgFunc(
                (node) => {
                  const testcaseMetadata = (<ts.ObjectLiteralExpression> node)
                  const str = sourceFile.text.substr(testcaseMetadata.pos, testcaseMetadata.end - testcaseMetadata.pos)
                  let parsedMetadata

                  try {
                    parsedMetadata = JSON5.parse(str)
                  } catch (e) {
                    console.error(`Failed to parse testcase metadata. Please do not use dynamic values inside testcase metadata: ${parsedMetadata}\n`)
                    throw e
                  }

                  testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[testcaseParserState.activeTestcaseId].metadata = parsedMetadata
                }
              )
              afterFuncTable[parentPos] = () => { testcaseParserState.activeTestcaseId = undefined }
              break
            case 'validate':
              testcaseParserState.addArgFunc(
                (node) => {
                  const validateMetadata = (<ts.ObjectLiteralExpression> node)
                  const str = sourceFile.text.substr(validateMetadata.pos, validateMetadata.end - validateMetadata.pos)
                  let validateObject

                  try {
                    validateObject = JSON5.parse(str)
                  } catch (e) {
                    console.error(`Failed to parse validate object. Please do not use dynamic values inside validateObject: ${str}\n`)
                    throw e
                  }

                  try {
                    if (!testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[testcaseParserState.activeTestcaseId].specValidateHash) {
                      testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[testcaseParserState.activeTestcaseId].specValidateHash = {}
                    }
                  } catch (e) {
                    if (!testcaseTree[testcaseParserState.activeSuiteId] ||
                      !testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[testcaseParserState.activeTestcaseId]) {

                        console.error(`Parsed validate function outside of suite or testcase: ${str}\n
                        Always define validate functions inside suites and testcases and do not use them
                        inside "external" functions invoked from inside suites or testcases`)

                        throw e
                    }
                  }

                  for (const spec in validateObject) {
                    if (validateObject[spec].length > 0) {
                      if (spec in specTable) {
                        specTable[spec].testcases[testcaseParserState.activeTestcaseId] = true
                      }

                      if (!(spec in validateTable)) {
                        validateTable[spec] = {};
                      }

                      validateTable[spec][testcaseParserState.activeTestcaseId] = true;

                      const specValidateHash = testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[testcaseParserState.activeTestcaseId].specValidateHash

                      if (!(spec in specValidateHash)) {
                        specValidateHash[spec] = {}
                      }

                      for (const criteria of validateObject[spec]) {
                        specValidateHash[spec][criteria] = true
                      }
                    }
                  }
                }
              )
              break
          }
        }
        break
    }

    ts.forEachChild(node, parseTestcaseNode);

    if (nodePos >= 0 && afterFuncTable[nodePos]) {
      afterFuncTable[nodePos]()
    }
  }
}

const compilerOptions = {
  noEmitOnError: true,
  noImplicitAny: true,
  target: ts.ScriptTarget.ES2017,
  module: ts.ModuleKind.CommonJS
}

export function specFilesParse(fileNames: string[]): SpecParseResults {

  const program = ts.createProgram(fileNames, compilerOptions);

  fileNames.forEach(fileName => {
    specParserState.activeSpecFile = fileName

    if(!existsSync(fileName)) {
      throw new Error(`Spec file could not be found: ${fileName}`)
    }

    let sourceFile = program.getSourceFile(fileName)

    afterFuncTable = {}
    specFileTable[fileName] = {
      features: {},
      specs: {}
    }

    parseSpecFiles(sourceFile)
  })

  return {
    specTree: specTree,
    specTable: specTable,
    featureTable: featureTable,
    specFileTable: specFileTable
  }
}

export function testcaseFilesParse(fileNames: string[]): TestcaseParseResults {
  const program = ts.createProgram(fileNames, compilerOptions);

  fileNames.forEach(fileName => {
    testcaseParserState.activeTestcaseFile = fileName

    if(!existsSync(fileName)) {
      throw new Error(`Testcase file could not be found: ${fileName}`)
    }

    let sourceFile = program.getSourceFile(fileName)

    afterFuncTable = {}
    testcaseFileTable[fileName] = {
      testcases: {},
    }

    parseTestcaseFiles(sourceFile)
  })

  return {
    testcaseTable: testcaseTable,
    tree: testcaseTree,
    validateTable: validateTable,
    testcaseFileTable: testcaseFileTable
  }
}