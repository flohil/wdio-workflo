const gulp      = require('gulp'),
  shell         = require('gulp-shell'),
  selenium      = require('selenium-standalone'),
  testConfig    = require( process.env.testConfig ),
  testPath      = testConfig.testPath,
  sysTestConfig = testConfig.systemTests,
  fs            = require('fs'),
  buildExecutionTable = require( testConfig.workfloPath ).buildExecutionTable,
  selectFiles   = require( `${sysTestConfig.utilsPath}/io` ).selectFiles

let locale      = require( process.env.testConfig ).locale

// returns an array of values from arg
// 
// if arg is surrounded by [], splits its contents by comma (!!! don't use whitespaces inside !!!)
// else puts value into result array
function splitArgument( arg ) {
  if ( arg.indexOf('[') === 0 && arg.indexOf(']') === (arg.length - 1) ) {
    return arg.replace( '[', '' ).replace( ']', '' ).split(',')
  } else {
    const res = []
    res.push( arg )
    return res
  }
}

// merges contents from lists into stories and testcases
function mergeLists( list, data ) {
  for ( const listName of list ) {
    const list = require( `${sysTestConfig.listsPath}/${listName}.list.js` )

    if ( typeof list.stories !== 'undefined' ) {
      data.stories = data.stories.concat( [ list.stories ][ 0 ] )
    }
    if ( typeof list.testcases !== 'undefined' ) {
      data.testcases = data.testcases.concat( [ list.testcases ][ 0 ] )
    }
    if ( typeof list.lists !== 'undefined' ) {
      for ( const sublist of [ list.lists ] ) {
        mergeLists( sublist, data ) }
    }
  }
}

function buildTestCaseTable( testcasesPaths ) {
  const testcaseTable = {}

  for ( const testcasePath of testcasesPaths ) {
    testcaseTable[ testcasePath ] = true
  }

  return testcaseTable
}

// Merges all user story ids from lists and "raw" ids together.
function buildStoryTree( stories ) {

  // Extracts branches form user story id, determines if it is to be negated
  // and puts it into story tree.
  function handleStory( story, storyTree ) {
    const negate = story.charAt( 0 ) === '!'
    const rawId = ( negate ) ? story.substring( 1, story.length ) : story
    const branchIds = rawId.split( '.' )

    putIntoStoryTree( storyTree, branchIds, negate )
  }

  // Story Tree: branches correspond to parts of user story ids, seperated by dots.
  // Each branch will be executed if it was defined and never negated.
  // If a branch was negated once, it itself and all its children will not be executed.
  function putIntoStoryTree( treeContext, branchIds, negate ) {
    // function was called without branches
    if ( branchIds.length > 0 ) {
      const branchId = branchIds.shift()

      if ( !treeContext.hasOwnProperty( branchId ) ) {
        treeContext[ branchId ] = {
          execute: true
        }
      }

      treeContext = treeContext[ branchId ]

      // there are still more branches in the tree
      if ( branchIds.length > 0 ) {
        putIntoStoryTree( treeContext, branchIds, negate )
      } 
      // this is the last branch: write value!
      else {
        if ( treeContext.hasOwnProperty( 'execute' ) ) {
          if ( negate && treeContext.execute === true ) {
            treeContext.execute = false
          }
        } else {
          treeContext.execute = !negate
        }
      }
    }
  }

  // a tree of user story ids
  const storyTree = {}

  for ( const story of stories ) {
    handleStory( story, storyTree )
  }

  return storyTree
}

// removes all test cases of testcaseTable that do not contains any story of storyTree,
// according to executionTable's information
function filterTestCases( data ) {
  const shouldTestCaseExecute = ( testcase ) => {
    const executionStories = data.executionTable[ testcase ].userStories
    let execute = false

    for ( const story of Object.keys( executionStories ) ) {
      const executeStory = determineStoryExecution( data.storyTree, story.split( '.' ) )

      // write into execution table if user wants to execute a user story
      executionStories[ story ] = executeStory

      if ( executeStory === true ) {
        execute = true
      }
    }

    return execute
  }

  // check if currently active node (treeContext) should be executed
  // do so recursively until leave node is reached
  const determineStoryExecution = ( treeContext, nodeIds ) => {
    if ( nodeIds.length > 0) {
      const nodeId = nodeIds.shift()

      if ( treeContext.hasOwnProperty( nodeId ) ) {

        if ( treeContext[ nodeId ].execute === true ) {
          if ( nodeIds.length > 0 ) {
            return determineStoryExecution( treeContext[ nodeId ], nodeIds )
          } else {
            return true
          }
        }
      } 
    }

    return false
  }

  for ( const testcase of Object.keys( data.testcaseTable ) ) {
    if ( !shouldTestCaseExecute( testcase ) ) {
      delete data.testcaseTable[ testcase ]
    }
  }
}

function buildExecutionFiles( data ) {
  return Object.keys( data.testcaseTable ).map( tcFile => 
    tcFile.replace( sysTestConfig.testcasesPath, sysTestConfig.tmpPath )
  )
}

/* executes the selenium system tests with wdio runner */
gulp.task('run_system_tests', () => {

  let cmd = 'node_modules/.bin/wdio ' + testPath + '/system_tests.wdio.conf.js --color'
  let lastAddCmd = undefined

  const data = {
    testcases: [],
    testcasePaths: [],
    stories: [],
    lists: [],
    testCaseTable: {},
    storyTree: {},
    executionTable: {},
    tmpTable: {}
  }

  // skip first 3 params, which are node location, gulp location, gulp task
  for (let i = 3; i < process.argv.length; i++) {

    // command key
    if (process.argv[i].indexOf('--') === 0) {
      lastAddCmd = process.argv[i]
    } else {

      // Selects test cases to be executed.
      //
      // Option can be a single value like 'tc1' or an array like '[tc1,tc2,tc3]'.
      //
      // If not specified, all test cases in test case directory will be run.
      if ( lastAddCmd === '--testcases' ) {
        data.testcases = splitArgument( process.argv[ i ] )
      }

      // Selects user stories to be tested.
      //
      // Option can be a single user story ids like '5.2.1'
      // or an array of user story ids like '[1.1.2,3.4,2.7]'.
      //
      // List filenames should contain no dots before the type specification -> eg. 'dashboard.list.js'
      //
      // If not specified, all user stories in the selected test cases will be run.
      else if ( lastAddCmd === '--stories' ) {
        data.stories = splitArgument( process.argv[ i ] )
      }

      // Selects user stories to be tested.
      //
      // Option can be a single list name like 'dashboard'
      // or an array of list names like '[composer,dashboard]'.
      //
      // List filenames should contain no dots before the type specification -> eg. 'dashboard.list.js'
      //
      // If not specified, all user stories in the selected test cases will be run.
      else if ( lastAddCmd === '--lists' ) {
        data.lists = splitArgument( process.argv[ i ] )
      }

      // set language to use for tests
      else if ( lastAddCmd === '--locale' ) {
        locale = process.argv[i]
      }
    }
  }

  // merge contents of lists into stories and testcases
  mergeLists( data.lists, data )

  // by default, if no testcase files are specified,
  // select all test case files in test case directory
  if ( data.testcases.length === 0 ) {
    data.testcasePaths = selectFiles( sysTestConfig.testcasesPath, 'tc.js' )
  } else {
    for ( const testcase of data.testcases ) {
      data.testcasePaths.push( `${sysTestConfig.testcasesPath}/${testcase}.tc.js` )
    }
  }

  // build a hashtable of the paths of all testcases to be executed
  data.testcaseTable = buildTestCaseTable( data.testcasePaths )

  // build a tree of user story ids to be executed
  data.storyTree = buildStoryTree( data.stories )

  // if user story ids were defined, filter the test cases hashtable
  // so that only test cases containing the specified user stories
  // will be executed

  try {
    data.executionTable = buildExecutionTable( data.testcaseTable, sysTestConfig.testcasesPath, sysTestConfig.tmpPath )

    if ( Object.keys( data.storyTree ).length > 0 ) {
      filterTestCases( data )
    }

    data.executionFiles = buildExecutionFiles( data )

    // story execution table as json, so that test cases can access it
    fs.writeFileSync( sysTestConfig.executionTablePath, JSON.stringify( data.executionTable ), 'utf-8' )

    process.env.testLocale = locale
    process.env.executionFiles = JSON.stringify( data.executionFiles )
    process.env.executionTable = JSON.stringify( data.executionTable )
  } catch (err) {
    console.error(err)
  }

  return gulp.src('', {read: false})
    .pipe(shell([
      cmd
    ])
    .on('error', (err) => {
      console.log(err)
      if (selenium && selenium.child) {
        selenium.child.kill()
      }
    }))
})
