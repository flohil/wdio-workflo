// const _ = require('lodash')
// const fs = require('fs')
// const path = require('path')

// const NORMAL = 1
// const HIGH = 2

// let treeRoot = {} 
// let activeTreeContext
// let activeUserStories = {}

// ///////////////////////

// function initTreeRoot() {
//   treeRoot = {
//     highestItPriority: NORMAL,
//     highestDescribePriority: NORMAL,
//     content: [],
//     userStories: {}
//   }
// }

// function addActiveUserStories( context, userStories ) {
//   if ( typeof userStories === 'object') {
//     for ( const key in userStories ) {
//       if ( userStories.hasOwnProperty( key ) ) {
//         context.userStories[ key ] = true
//       }
//     }
//   } else {
//     context.userStories[ userStories] = true
//   }
// }

// function addDescribeToTree( description, bodyFunc, priority ) {

//   if ( description.includes('|||') ) {
//     throw new Error( `Description must not contain character sequence '|||': ${description}` )
//   }

//   const previousContext = activeTreeContext

//   const obj = {
//     priority: priority,
//     highestItPriority: NORMAL,
//     highestDescribePriority: NORMAL,
//     bodyFunc: bodyFunc,
//     description: description,
//     nodeId: '',
//     content: [],
//     userStories: {}
//   }

//   activeTreeContext.content.push( obj )

//   if ( priority > activeTreeContext.highestDescribePriority ) {
//     activeTreeContext.highestDescribePriority = priority
//   }

//   activeTreeContext = obj

//   bodyFunc()

//   activeTreeContext = previousContext
// }

// function appendToItTree( bodyFunc ) {
//   const content = activeTreeContext.content

//   content[ content.length - 1 ].bodyFuncs.push( bodyFunc )
// }

// function addItToTree( description, bodyFunc, priority ) {

//   const obj = {
//     priority: priority,
//     bodyFuncs: [ bodyFunc ], // append bodyFunc to array
//     description: description,
//     nodeId: '',
//     userStories: {}
//   }

//   activeTreeContext.content.push( obj )

//   if ( priority > activeTreeContext.highestItPriority ) {
//     activeTreeContext.highestItPriority = priority
//   }
// }

// function fillTree( context, parentId ) {
//   // figure out all leaves and their priority
//   for ( const obj of context.content ) {

//     activeTreeContext = obj

//     // describe
//     if ( 'content' in obj ) {
//       if ( obj.priority >= context.highestDescribePriority ) {
//         obj.nodeId = buildNodeId( obj, parentId )
  
//         fillTree( obj, obj.nodeId )
//       }
//     } 
//     // it
//     else {
//       if ( obj.priority >= context.highestItPriority ) {
//         obj.nodeId = buildNodeId( obj, parentId )

//         for ( const bodyFunc of obj.bodyFuncs ) {
//           bodyFunc()
//         }
//       }
//     }

//     addActiveUserStories( context, obj.userStories )
//   }
// }

// function buildBlocksTable( context, executionTable ) {

//   if ( context.nodeId ) {
//     if ( context.nodeId in executionTable ) {
//       const descriptions = context.nodeId.split('|||')
//       const lastDescription = descriptions[ descriptions.length - 1 ]

//       throw new Error(`Description must be unique within its context: '${lastDescription}' in '${context.nodeId}'`)
//     } else {
//       executionTable[ context.nodeId ] = context.userStories
//     }
//   }

//   if ( 'content' in context ) {
//     for ( const obj of context.content ) {
//       executionTable = buildBlocksTable( obj, executionTable )
//     }
//   }

//   return executionTable
// }

// function buildNodeId( node, parentId ) {
//   if ( node.description ) {
//     if ( parentId ) {
//       parentId = `${parentId}|||`
//     } else {
//       parentId = ''
//     }

//     return `${parentId}${node.description}`
//   } else {
//     throw new Error(`Node requires description for nodeId: ${node}`)
//   }
// }

// /////////////////////// 

// function fgiven( description, condInputObj, bodyFunc ) {
//   const args = arguments.toArray()
//   console.log( "given: ", description )

//   addDescribeToTree( HIGH )
// }

// function given( description, condInputObj, bodyFunc ) {
//   const args = Array.from(arguments)
//   console.log( "args: ", args )

//   addDescribeToTree( NORMAL )
// }

// function fwhen( description, bodyFunc ) {
//   console.log( "when: ", description )

//   addItToTree( description, bodyFunc, HIGH )
// }

// function when( description, bodyFunc ) {
//   console.log( "when: ", description )

//   addItToTree( description, bodyFunc, NORMAL ) // return for chaining

//   const chainContext = {
//     and: ( _description, _bodyFunc ) => {
//       appendToItTree( _bodyFunc )
//     }
//   }

//   return chainContext
// }

// function describe( description, bodyFunc ) {
//   addDescribeToTree( description, bodyFunc, NORMAL )
// }

// function fdescribe( description, bodyFunc ) {
//   addDescribeToTree( description, bodyFunc, HIGH )
// }

// /*
// function it( description, bodyFunc ) {
//   addItToTree( description, bodyFunc, NORMAL )
// }

// function fit( description, bodyFunc ) {
//   addItToTree( description, bodyFunc, HIGH )
// }*/

// function evaluate( specObj, bodyFunc ) {
//   for ( const key in specObj ) {
//     if ( specObj.hasOwnProperty( key ) ) {
//       addActiveUserStories( activeTreeContext, key )
//       activeUserStories[key] = true
//     }
//   }
// }

// ////////////////////

// function incrIdx( idx, increment ) {
//   idx += increment
//   return idx
// }

// function getParseCmds( signature, parserInfo ) {

//   const isStringIndicator = () => {
//     if( parserInfo.curChar === '\'' || parserInfo.curChar === '\"' ) {
//       if(( parserInfo.opIdx - 1 ) >= 0 && parserInfo.data.charAt( parserInfo.opIdx - 1 ) !== '\\') {
//         return true
//       } else if ( parserInfo.opIdx === 0 ) {
//         return true
//       }
//     } else if ( parserInfo.curChar === '`' ) {
//       return true
//     }

//     return false
//   }

//   let argStrOpen = false
//   let argStrOpenToken = ''

//   const toggleString = () => {
//     if ( argStrOpenToken === '' ) {
//       argStrOpen = true
//       argStrOpenToken = parserInfo.curChar
//     } else if ( parserInfo.curChar === argStrOpenToken ) {
//       argStrOpen = !argStrOpen
//       argStrOpenToken = ''
//     }
//   }

//   const skipStringArg = () => {
//     if( isStringIndicator() ) {
//       toggleString()
//     } else if ( !argStrOpen ) {
//       if ( parserInfo.curChar === ',' ) {
//         return true // skipped to end of string arg
//       }
//     }
//   }

//   const skipIntArg = () => {
//     if ( parserInfo.curChar === ',' ) {
//       return true // skipped to end of int arg
//     }
//   }

//   let paranthesisStack = 0
//   let passedParanthesis = false

//   const skipToBodyScope = () => {
//     if ( !passedParanthesis ) {
//       if ( parserInfo.curChar === '(' ) {
//         if ( paranthesisStack === 0 ) {
//           passedParanthesis = false
//         }
//         paranthesisStack++
//       } else if ( parserInfo.curChar === ')' ) {
//         paranthesisStack--

//         if ( paranthesisStack === 0 ) {
//           passedParanthesis = true
//         }
//       }
//     } else if ( parserInfo.curChar === '{' ) {
//       parserInfo.essStr += parserInfo.data.substring( parserInfo.dataIdx, parserInfo.opIdx + 1 )
//       paranthesisStack = 1 // if reaches 0, then function was closed
//       return true
//     }
//   }

//   const skipToEnd = () => {
//     if ( parserInfo.curChar === ')' ) {
//       paranthesisStack--
//     } else if ( parserInfo.curChar === '(' ) {
//       paranthesisStack++
//     }

//     if ( paranthesisStack === 0 ) {
//       parserInfo.essStr += '\n})'
//       parserInfo.signatureStack.shift()
//       return true
//     }
//   }

//   // determines what will come in following characters of parserInfo.data
//   const lookAhead = ( expectedStr ) => {
//     let tempIdx = parserInfo.opIdx
//     let tempStr = ''
//     let startIdx = -1

//     while ( tempIdx < parserInfo.data.length && tempStr.length < expectedStr.length ) {
//       const tempChar = parserInfo.data[tempIdx]

//       if ( ' \t\n\r\v'.indexOf(tempChar) > -1 && tempStr.length === 0 ) {
//         // ignore white space characters before expectedStr
//       } else {
//         if ( startIdx === -1 ) {
//           startIdx = tempIdx
//         }
//         tempStr += tempChar
//       }

//       tempIdx++     
//     }

//     if ( expectedStr.localeCompare( tempStr ) === 0 ) {
//       return startIdx
//     } else {
//       return -1
//     }
//   }

//   // if an .and comes next, inject its command chain
//   const condAnd = () => {
//     if ( lookAhead( '.and' ) > -1 ) {
//       parserInfo.signatures.unshift( {
//         index: parserInfo.opIdx,
//         signatureIdx: parserInfo.opIdx + 1, // skip .
//         type: 'and'
//       } )
//     }

//     return false
//   }

//   // if an object arg comes next, inject its command in command stack
//   const condSkipObjectArg = () => {
//     if ( lookAhead( '{' ) > -1 ) {
//       // insert skipObjectArg at index 1, because index 0 will be removed from stack immediatly after return
//       parserInfo.cmds.splice( 1, 0, skipObjectArg )
//     }

//     return false
//   }

//   const skipSignature = () => {
//     parserInfo.opIdx = signature.index
//     parserInfo.dataIdx = signature.index

//     // skip signature -> lenght - 1 because opIdx will always be incremented by 1
//     parserInfo.opIdx = incrIdx( parserInfo.opIdx, signature.type.length - 1 )

//     return true
//   }

//   const tagBlockIdPosition = () => {
//     if ( parserInfo.curChar === '(' ) {
//       parserInfo.blockIdPositions.arr.push( parserInfo.opIdx + 1 )

//       return true
//     }
//   }

//   let bracketsStack = 0
//   let passedObject = false

//   const skipObjectArg = () => {
//     if ( !passedObject ) {
//       if ( parserInfo.curChar === '{' ) {
//         if ( bracketsStack === 0 ) {
//           passedObject = false
//         }
//         bracketsStack++
//       } else if ( parserInfo.curChar === '}' ) {
//         bracketsStack--

//         if ( bracketsStack === 0 ) {
//           passedObject = true
//         }
//       }
//     } else {
//       if ( parserInfo.curChar === ',' ) {
//         passedObject = false
//         return true // skipped to end of string arg
//       }
//     }
//   }

//   if ( signature.type === 'describe' || signature.type === 'fdescribe' ) {
//     return [ skipSignature, tagBlockIdPosition, skipStringArg, skipToBodyScope, skipToEnd ]
//   } else if ( signature.type === 'given' || signature.type === 'fgiven' ) {
//     return [ skipSignature, tagBlockIdPosition, skipStringArg, condSkipObjectArg, skipToBodyScope, skipToEnd ]
//   } else if ( signature.type === 'it' || signature.type === 'fit' ) {
//     return [ skipSignature, tagBlockIdPosition, skipStringArg, skipToBodyScope, skipToEnd ]
//   } else if ( signature.type === 'when' || signature.type === 'fwhen' || signature.type === 'and' ) {
//     return [ skipSignature, tagBlockIdPosition, skipStringArg, condSkipObjectArg, skipToBodyScope, skipToEnd, condAnd ]
//   } else if ( signature.type === 'evaluate' ) {
//     return [ skipSignature, skipObjectArg, skipToBodyScope, skipToEnd ]
//   }
// }

// // removes comments from str and tags all start and end positions of strings inside str
// function findCommentsAndStrings( str ) {

//   // add aditional newline if there is none at the end of str
//   const eofNl = (str.charAt(str.length - 1) === '\n' || str.charAt(str.length - 1) === '\r') ? '' : '\n'

//   str = (`__${str}${eofNl}__`).split('')

//   const mode = {
//     singleQuote: false,
//     doubleQuote: false,
//     strangeQuote: false,
//     regex: false,
//     blockComment: false,
//     lineComment: false,
//     condComp: false 
//   }

//   const stringPositions = []
//   const stringPos = {
//     start: -1,
//     end: -1
//   }

//   const startPos = pos => stringPos.start = pos - 2

//   const endPos = pos => {
//     stringPos.end = pos - 2
//     stringPositions.push( _.clone( stringPos ) )
//   }

//   for (let i = 0, l = str.length; i < l; i++) {
//     if (mode.regex) {
//       if (str[i] === '/' && str[i-1] !== '\\') {
//         mode.regex = false
//         endPos( i )
//       }
//       continue
//     }
//     if (mode.singleQuote) {
//       if (str[i] === '\'' && str[i-1] !== '\\') {
//         mode.singleQuote = false
//         endPos( i )
//       }
//       continue
//     }

//     if (mode.doubleQuote) {
//       if (str[i] === '"' && str[i-1] !== '\\') {
//         mode.doubleQuote = false
//         endPos( i )
//       }
//       continue
//     }

//     if (mode.strangeQuote) {
//       if (str[i] === '`' && str[i-1] !== '\\') {
//         mode.strangeQuote = false
//         endPos( i )
//       }
//       continue
//     }

//     if (mode.blockComment) {
//       if (str[i] === '*' && str[i+1] === '/') {
//         str[i+1] = ''
//         mode.blockComment = false
//         endPos( i+1 )
//       }
//       str[i] = ''
//       continue
//     }

//     if (mode.lineComment) {
//       if (str[i+1] === '\n' || str[i+1] === '\r') {
//         mode.lineComment = false
//         endPos( i+1 )
//       }
//       str[i] = ''
//       continue
//     }

//     if (mode.condComp) {
//       if (str[i-2] === '@' && str[i-1] === '*' && str[i] === '/') {
//         mode.condComp = false
//         endPos( i )
//       }
//       continue
//     }

//     mode.doubleQuote = str[i] === '"'
//     mode.singleQuote = str[i] === '\''
//     mode.strangeQuote = str[i] === '`'

//     if ( mode.doubleQuote || mode.singleQuote || mode.strangeQuote ) {
//       startPos( i )
//     }

//     if (str[i] === '/') {
//       if (str[i+1] === '*' && str[i+2] === '@') {
//         mode.condComp = true
//         startPos( i )
//         continue
//       }
//       if (str[i+1] === '*') {
//         str[i] = ''
//         mode.blockComment = true
//         startPos( i )
//         continue
//       }
//       if (str[i+1] === '/') {
//         str[i] = ''
//         mode.lineComment = true
//         startPos( i )
//         continue
//       }
//       mode.regex = true
//       startPos( i )
//     }
//   }

//   return stringPositions
// }

// // removes everything not essential for finding out which
// // test cases should be executed
// // 'essential' function signatures: describe, fdescribe, it, fit, specEval

// function extractEssentialData( data, ignorePositions, blockIdPositions ) {
//   const re = /((^f?describe|\s+f?describe)\s*\()|(\s+f?given\s*\()|(\s+f?it\s*\()|(\s+f?when\s*\()|(\s+evaluate\s*\()/g

//   let found = -1
//   const signatures = []

//   while( (found = re.exec( data ) ) ) {

//     // skip whitespaces!
//     let signatureIdx = found.index

//     while ( ' \t\n\r\v'.indexOf( data.charAt( signatureIdx ) ) > -1 ) {
//       signatureIdx++
//     }

//     signatures.push( {
//       index: found.index,
//       signatureIdx: signatureIdx,
//       type: found[0].substring( 0, found[0].length - 1 ).replace(/^\s+|\s+$/g, ''),
//     } )
//   }

//   if ( signatures.length > 0 ) {

//     const parserInfo = {
//       opIdx: 0,
//       dataIdx: 0,
//       essStr: '',
//       data: data,
//       signatureStack: [],
//       currentString: undefined,
//       signatures: signatures,
//       cmds: [],
//       blockIdPositions: blockIdPositions
//     }

//     while ( parserInfo.opIdx < parserInfo.data.length ) {

//       parserInfo.curChar = parserInfo.data.charAt( parserInfo.opIdx )

//       // check if inside string - must not recognize block signatures inside strings!
//       if ( ignorePositions.length > 0 ) {
//         if ( !parserInfo.currentString ) {
//           if ( ignorePositions[ 0 ].start === parserInfo.opIdx ) {
//             parserInfo.currentString = ignorePositions.shift()
//           }
//         } else {
//           if ( parserInfo.currentString.end === parserInfo.opIdx ) {
//             parserInfo.currentString = undefined
//           }
//         }
//       }

//       // only allow describe block signature recognition when no string is open
//       if ( parserInfo.signatures.length > 0 ) {
//         if ( parserInfo.opIdx === parserInfo.signatures[ 0 ].signatureIdx && !parserInfo.currentString ) {
//           addSignaturesToStack( parserInfo )
//         } else if ( parserInfo.signatures[0].signatureIdx < parserInfo.opIdx ) {
//           // remove signatures that were completely enclosed by string or comment
//           parserInfo.signatures.shift()
//         }
//       }

//       if ( parserInfo.cmds.length > 0 ) {
//         // undefined if command not yet finished, false if finished but don't proceed to next character, true: proceed to next character
//         const cmdResultStatus = parserInfo.cmds[ 0 ]( parserInfo )

//         if ( typeof cmdResultStatus !== 'undefined' ) {
//           parserInfo.cmds.shift()
//         }

//         if ( cmdResultStatus === false ) {
//           continue
//         }
//       }

//       parserInfo.opIdx++
//     }

//     return parserInfo.essStr
//   }

//   return ''
// }

// function addSignaturesToStack( parserInfo ) {
//   parserInfo.signatureStack.unshift( parserInfo.signatures[ 0 ] )

//   parserInfo.signatures.shift()

//   parserInfo.cmds.unshift( ...getParseCmds( parserInfo.signatureStack[ 0 ], parserInfo, parserInfo.blockIdPositions ) )
//   parserInfo.dataIdx = parserInfo.opIdx
// }

// // Tags all blocks inside data with their block ids and returns results as string.
// // BlockIds are passed as an array - the order of the blockIds inside the array
// // must match the order of the ids in blockIdPositions.arr array.
// function tagBlocksWithIds( data, ids, positions, tcFilename ) {
//   /*if ( ids.length !== positions.arr.length ) {

//     console.log( "positions: ", positions )
//     console.log( "ids: ", ids )

//     throw new Error(`Length of block ids(${ids.length}) did not match length of block id positions (${positions.arr.length})`)
//   }*/

//   for ( let i = 0; i < ids.length; i++ ) {
//     const splitPos = positions.offset + positions.arr[i]
//     const idArg = ` '${tcFilename}|||${ids[i]}',`

//     // insert id
//     data = data.slice( 0, splitPos ) + idArg + data.slice( splitPos )

//     positions.offset += idArg.length
//   }

//   return data
// }

// // build a json tree consisting of node ids and their corresponding user stories
// // this json tree can be used during test execution to determine beforehand
// // if a describe/it block needs to be executed
// export default function( testCaseTable, tcFolderPath, tmpFolderPath ) {
//   const executionTable = {}
//   const blockIdPositions = {}

//   for ( const testCaseFile of Object.keys( testCaseTable ) ) {

//     const rowData = fs.readFileSync( testCaseFile, 'utf8' )
//     const tcFilename = testCaseFile.replace( `${tcFolderPath}/`, '' ).slice(0, -6)
//     const ignorePositions = findCommentsAndStrings( rowData )

//     blockIdPositions.offset = 0
//     blockIdPositions.arr = []

//     // read in content of test case files and remove comments
//     const essentialStr = extractEssentialData( rowData, ignorePositions, blockIdPositions )

//     console.log("essential: ", essentialStr)

//     initTreeRoot()
//     activeTreeContext = treeRoot
//     activeUserStories = {}

//     const myFuncStr = `() => { ${essentialStr}  }`
//     const myFunc = eval( myFuncStr )

//     myFunc()

//     // tree: inherit priorities from parent fdescribe
//     // always execute fit
//     // only execute it if inherited priority 2
//     fillTree( treeRoot )

//     const blocksTable = buildBlocksTable( treeRoot, {} )

//     console.log("blocksTable: ", blocksTable)

//     const taggedData = tagBlocksWithIds( rowData, Object.keys( blocksTable ), blockIdPositions, tcFilename )

//     executionTable[ tcFilename ] = { 
//       userStories: activeUserStories,
//       blocksTable: blocksTable
//     }

//     // write cleaned file to execution folder
//     fs.writeFileSync( `${tmpFolderPath}/${tcFilename}.tc.js`, taggedData )
//   }

//   return executionTable
// }