import { readFileSync } from "fs"
import * as ts from "typescript"
import * as JSON5 from 'json5'

type NodeArgFunc = (node: ts.Node) => void

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

export type SpecTable = Record<string, SpecTableEntry>

export interface SpecParseResults {
  table: SpecTable
  tree: FeatureHash
}

// used to determine, if a spec is to be executed for a feature or spec filter
const specTable: SpecTable = {}

// used to lookup spec information
const specTree: FeatureHash = {}

const parserState: {
  beforeCallExpressionIdentifier: boolean,
  activeSpecFile: string,
  activeFeature: string,
  activeSpecId: string,
  argFuncs: NodeArgFunc[],
  addArgFunc: (NodeArgFunc) => void,
  executeNextArgFunc: NodeArgFunc
} = {
  beforeCallExpressionIdentifier: false,
  activeSpecFile: undefined,
  activeFeature: undefined,
  activeSpecId: undefined,
  argFuncs: [],
  addArgFunc: (argFunc: NodeArgFunc) => {
    parserState.argFuncs.push(argFunc)
  },
  executeNextArgFunc: (node: ts.Node) => {
    if (parserState.argFuncs.length > 0) {
      const argFunc = parserState.argFuncs.shift()
      
      argFunc(node)
    }
  }
}

export function parseSpecFiles(sourceFile: ts.SourceFile) {
  parseSpecNode(sourceFile);

  function parseSpecNode(node: ts.Node) {
    let afterFunc: () => void = undefined

    parserState.executeNextArgFunc(node)

    switch (node.kind) {
      case ts.SyntaxKind.CallExpression:
        parserState.beforeCallExpressionIdentifier = true
        break
      case ts.SyntaxKind.Identifier:
        // ensure only functions and not varibables etc. are considered
        if (parserState.beforeCallExpressionIdentifier) {
          parserState.beforeCallExpressionIdentifier = false

          const identifier = <ts.Identifier> node
          
          switch(identifier.text) {
            case 'Feature':
              parserState.addArgFunc(
                (node) => {
                  const featureId = (<ts.StringLiteral> node).text
                  parserState.activeFeature = featureId

                  if (!(featureId in specTree)) {
                    specTree[featureId] = {
                      specHash: {}
                    }
                  }
                }
              )
              parserState.addArgFunc(
                (node) => {
                  const featureMetadata = (<ts.ObjectLiteralExpression> node)
                  const str = sourceFile.text.substr(featureMetadata.pos, featureMetadata.end - featureMetadata.pos)

                  specTree[parserState.activeFeature].metadata = JSON5.parse(str)
                }
              )
              afterFunc = () => { parserState.activeFeature = undefined }
              break
            case 'Story':
              parserState.addArgFunc(
                (node) => {
                  const specId = (<ts.StringLiteral> node).text
                  parserState.activeSpecId = specId

                  if (!(specId in specTree[parserState.activeFeature])) {
                    specTree[parserState.activeFeature].specHash[specId] = {}
                  }
                  if (!(specId in specTable)) {
                    specTable[specId] = {
                      feature: parserState.activeFeature,
                      specFile: parserState.activeSpecFile
                    }
                  }
                }
              )
              parserState.addArgFunc(
                (node) => {
                  const specDescription = (<ts.StringLiteral> node).text

                  specTree[parserState.activeFeature].specHash[parserState.activeSpecId].description = specDescription
                }
              ),
              parserState.addArgFunc(
                (node) => {
                  const specMetadata = (<ts.ObjectLiteralExpression> node)
                  const str = sourceFile.text.substr(specMetadata.pos, specMetadata.end - specMetadata.pos)
                  
                  specTree[parserState.activeFeature].specHash[parserState.activeSpecId].metadata = JSON5.parse(str)
                }
              )
              afterFunc = () => { parserState.activeSpecId = undefined }
              break
            case 'Then':
              break
          }
        }
        break
    }

    ts.forEachChild(node, parseSpecNode);

    if (afterFunc) {
      afterFunc()
    }
  }
}

export function specFilesParse(fileNames: string[]) {
  
  const program = ts.createProgram(fileNames, {
    noEmitOnError: true, 
    noImplicitAny: true,
    target: ts.ScriptTarget.ES2017, 
    module: ts.ModuleKind.CommonJS
  });
  
  fileNames.forEach(fileName => {
    parserState.activeSpecFile = fileName  
  
    let sourceFile = program.getSourceFile(fileName)
  
    parseSpecFiles(sourceFile)
  })

  return {
    tree: specTree,
    table: specTable
  }
}