import { readFileSync } from "fs"
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
  feature: string
}

export interface FeatureTableEntry {
  specFiles: string[]
}

export type SpecTable = Record<string, SpecTableEntry>

export type FeatureTable = Record<string, FeatureTableEntry>

export interface SpecParseResults {
  specTable: SpecTable
  specTree: FeatureHash
  featureTable: FeatureTable
}

// used to determine, if a spec is to be executed for a feature or spec filter
const specTable: SpecTable = {}

// used to lookup spec information
const specTree: FeatureHash = {}

const featureTable: FeatureTable = {}

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
                      specFiles: []
                    }
                  }

                  featureTable[featureId].specFiles.push(specParserState.activeSpecFile)
                }
              )
              specParserState.addArgFunc(
                (node) => {
                  const featureMetadata = (<ts.ObjectLiteralExpression> node)
                  const str = sourceFile.text.substr(featureMetadata.pos, featureMetadata.end - featureMetadata.pos)

                  specTree[specParserState.activeFeature].metadata = JSON5.parse(str)
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
                      specFile: specParserState.activeSpecFile
                    }
                  }
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
                  
                  specTree[specParserState.activeFeature].specHash[specParserState.activeSpecId].metadata = JSON5.parse(str)
                }
              )
              afterFuncTable[parentPos] = () => { specParserState.activeSpecId = undefined }
              break
            case 'Then':
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
  specVerifyHash?: Record<string, number[]>
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

export type TestcaseTable = Record<string, TestcaseTableEntry>

// each specId of verifyObj has a hash of all fullTestcaseIds that verify it
export type VerifyTable = Record<string, Record<string, true>>

export interface TestcaseParseResults {
  testcaseTable: TestcaseTable
  tree: SuiteHash
  verifyTable: VerifyTable
}

// used to determine, if a spec is to be executed for a feature or spec filter
const testcaseTable: TestcaseTable = {}

// used to lookup spec information
const testcaseTree: SuiteHash = {}

const verifyTable: VerifyTable = {}

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
                }
              )
              testcaseParserState.addArgFunc(
                (node) => {
                  const suiteMetadata = (<ts.ObjectLiteralExpression> node)
                  const str = sourceFile.text.substr(suiteMetadata.pos, suiteMetadata.end - suiteMetadata.pos)

                  testcaseTree[testcaseParserState.activeSuiteId].metadata = JSON5.parse(str)
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
                  const fullTestcaseId = `${testcaseParserState.activeSuiteId}.${testcaseId}`
                  testcaseParserState.activeTestcaseId = fullTestcaseId

                  if (!(fullTestcaseId in testcaseTree[testcaseParserState.activeSuiteId])) {
                    testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[fullTestcaseId] = {
                      description: testcaseId
                    }
                  }
                  if (!(fullTestcaseId in testcaseTable)) {
                    testcaseTable[fullTestcaseId] = {
                      suiteId: testcaseParserState.activeSuiteId,
                      testcaseFile: testcaseParserState.activeTestcaseFile
                    }
                  }
                }
              )
              testcaseParserState.addArgFunc(
                (node) => {
                  const testcaseMetadata = (<ts.ObjectLiteralExpression> node)
                  const str = sourceFile.text.substr(testcaseMetadata.pos, testcaseMetadata.end - testcaseMetadata.pos)
                  
                  testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[testcaseParserState.activeTestcaseId].metadata = JSON5.parse(str)
                }
              )
              afterFuncTable[parentPos] = () => { testcaseParserState.activeTestcaseId = undefined }
              break
            case 'verify':
              testcaseParserState.addArgFunc(
                (node) => {
                  const verifyMetadata = (<ts.ObjectLiteralExpression> node)
                  const str = sourceFile.text.substr(verifyMetadata.pos, verifyMetadata.end - verifyMetadata.pos)
                  const verifyObject = JSON5.parse(str)
                  
                  if (!testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[testcaseParserState.activeTestcaseId].specVerifyHash) {
                      testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[testcaseParserState.activeTestcaseId].specVerifyHash = {}
                  }
                  
                  for (const spec in verifyObject) {
                    if (!(spec in verifyTable)) {
                      verifyTable[spec] = {};
                    }

                    verifyTable[spec][testcaseParserState.activeTestcaseId] = true;
                    
                    const specVerifyHash = testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[testcaseParserState.activeTestcaseId].specVerifyHash

                    if (!(spec in specVerifyHash)) {
                      specVerifyHash[spec] = []
                    }

                    for (const criteria of verifyObject[spec]) {
                      let found = false

                      for (const _criteria of specVerifyHash[spec]) {
                        if (criteria === _criteria) {
                          found = true
                        }
                      }

                      if (!found) {
                        specVerifyHash[spec].push(criteria)
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
  
    let sourceFile = program.getSourceFile(fileName)

    afterFuncTable = {}
  
    parseSpecFiles(sourceFile)
  })

  return {
    specTree: specTree,
    specTable: specTable,
    featureTable: featureTable
  }
}

export function testcaseFilesParse(fileNames: string[]): TestcaseParseResults {
  const program = ts.createProgram(fileNames, compilerOptions);
  
  fileNames.forEach(fileName => {
    testcaseParserState.activeTestcaseFile = fileName  
  
    let sourceFile = program.getSourceFile(fileName)

    afterFuncTable = {}
  
    parseTestcaseFiles(sourceFile)
  })

  return {
    testcaseTable: testcaseTable,
    tree: testcaseTree,
    verifyTable: verifyTable
  }
}