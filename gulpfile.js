const gulp = require("gulp"),
  shell = require('gulp-shell'),
  runSequence = require('run-sequence').use(gulp),
  gutil = require('gulp-util'),
  fwName = 'workflo',
  selenium = require('selenium-standalone'),
  tcpPortUsed = require('tcp-port-used'),
  config = require('./config/workflo.conf.js'),
  gitHubUrl = 'github.com',
  gitHubPort = 443,
  gitHubTimeout = 5


/*var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});*/

gulp.task("default", () => {
  let cmdAdds = ''

  // skip first 3 params, which are node location, gulp location, gulp task
  for (let i = 3; i < process.argv.length; i++) {
    cmdAdds += (` ${process.argv[i]}`)
  }

  //const cmd = `NODE_ENV=${env} gulp system_tests_start${cmdAdds} --colors; npm run generate_test_results`

  // run with colors
  const cmd = `gulp test${cmdAdds} --colors`

  return gulp.src('', {read:false})
    .pipe(shell([
      cmd
    ]))
})

gulp.task('test', (done) => {
  return runSequence( 'selenium_start', 'run_tests', 'selenium_stop',
    (err) => {
      test_callback( err, done )
    }
  )
})

gulp.task('run_tests', () => {
  console.log("running tests")
})

/* starts selenium server prior to selenium system tests */
gulp.task('selenium_start', ['wait_for_selenium_start'], (done) => {
  done()
})

gulp.task('wait_for_selenium_start', (done) => {
  return waitForGithub( 0, done )
})

gulp.task('selenium_stop', () => {
  selenium.child.kill()
})

/* executes the selenium system tests with wdio runner */
gulp.task('run_system_tests', () => {

  let cmd = 'node_modules/.bin/wdio ' + /*testPath +*/ '/system_tests.wdio.conf.js --color'
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

function test_callback( err, done ) {
  if (err) {
    const exitCode = 2
    console.error(gutil.colors.red(`${fwName} tests failed - exiting with code ${exitCode}!`))
    return process.exit(exitCode)
  }
  else {
    return done(console.log(gutil.colors.green(`${fwName} tests passed!`)))
  }
}

function waitForGithub( iteration, done ) {
  tcpPortUsed.check(gitHubPort, gitHubUrl)
  .then((inUse) => {
    if ( !inUse ) {
      if (iteration < gitHubTimeout) {
        if (iteration == 0) {
          console.error("GitHub not (yet) available at " + gitHubUrl,
            "\nWaiting for GitHub to download latest selenium drivers...")
        }
        iteration++
        setTimeout(() => {
          waitForGithub( iteration, done )
        }, 1000)
      } else {
        console.error("GitHub not available after " + iteration + " seconds. Trying to use already downloaded drivers...")
        selenium.start( (err, child) => seleniumStartCb(err, child, done))
      }
    } else {
      console.log("GitHub available at " + gitHubUrl + ". Download latest selenium drivers...")
      selenium.install(config.selenium, (err) => {
        if (err) return done(err)
        selenium.start( (err, child) => seleniumStartCb(err, child, done))
      })
    }
  }, (err) => {
    console.error("Error contacting Github to download latest selenium drivers. Trying to use already downloaded drivers...")
    selenium.start( (err, child) => seleniumStartCb(err, child, done))
  })
}

const seleniumStartCb = (err, child, done) => {
  if (err) return done(err)
  selenium.child = child
  done()
}