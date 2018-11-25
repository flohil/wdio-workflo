if (typeof process.env.WORKFLO_CONFIG === 'undefined') {
  console.error('Please provide the absolute path to workflo.conf.ts location as WORKFLO_CONFIG environment variable!')
  process.exit(1)
}

require('ts-node/register')
require('tsconfig-paths/register')

const path = require('path')
const _ = require('lodash')
const fs = require('fs')
const workfloConf = require(process.env.WORKFLO_CONFIG).default
const jsonfile = require('jsonfile')
const copyFolderRecursiveSync = require('../dist/lib/io.js').copyFolderRecursiveSync

const workfloMatcherNames = [ 'toExist' ]

let errorType
let finishedTestcases = false

// set defaults for workflo config
if (!workfloConf.timeouts) {
  workfloConf.timeouts = {}
}
if (!workfloConf.timeouts.waitforTimeout) {
  workfloConf.timeouts.waitforTimeout = workfloConf.timeouts.waitforTimeout || 5000
}
if (!workfloConf.capabilities) {
  workfloConf.capabilities = {}
}
if (!workfloConf.capabilities.browserName) {
  workfloConf.capabilities.browserName = 'chrome'
}

const STACKTRACE_FILTER = /(node_modules(\/|\\)(\w+)*|wdio-sync\/build|- - - - -)/g

function cleanStack (error, removeMessage) {
  let stack = error.split('\n')
  stack = stack.filter((line) => {
    let keep = !line.match(STACKTRACE_FILTER)

    if (removeMessage && keep) {
      keep = line.startsWith('    at ')
    }

    return keep
  })
  error = stack.join('\n')
  return error
}

function increaseBailErrors() {
  if (!global.bailErrors) {
    global.bailErrors = 1
  } else {
    global.bailErrors += 1
  }
}

// buildSpecs()
exports.config = {
  /**
   * server configurations
   */
  host: workfloConf.host,
  port: workfloConf.port,
  path: workfloConf.path,
  agent: workfloConf.agent,
  proxy: workfloConf.proxy,
  /**
   * specify test files
   */
  specs: workfloConf.specFiles,
  testcases: workfloConf.testcaseFiles,
  manualTestcases: workfloConf.manualTestcaseFiles,
  uidStorePath: workfloConf.uidStorePath,
  connectionRetryTimeout: workfloConf.connectionRetryTimeout,
  connectionRetryCount: workfloConf.connectionRetryCount,
  testDir: workfloConf.testDir,
  /**
   * capabilities
   */
  capabilities: [ Object.assign(workfloConf.capabilities, { maxInstances: 1 }) ],
  services: workfloConf.services || ['selenium-standalone'],
  seleniumArgs: workfloConf.seleniumStartArgs,
  seleniumInstallArgs: workfloConf.installArgs,
  queryParams: workfloConf.queryParams || {},
  headers: workfloConf.headers || {},
  /**
   * test configurations
   */
  user: workfloConf.user,
  key: workfloConf.key,
  bail: 0,
  logLevel: workfloConf.logLevel,
  protocol: workfloConf.protocol || 'http',
  debug: workfloConf.debug || false,
  execArgv: workfloConf.execArgv || null,
  coloredLogs: true || workfloConf.coloredLogs,
  deprecationWarnings: workfloConf.deprecationWarnings || false,
  screenshotPath: null,
  screenshotOnReject: false,
  baseUrl: workfloConf.baseUrl,
  waitforTimeout: workfloConf.timeouts.default,
  waitforInterval: workfloConf.intervals.default,
  plugins: workfloConf.plugins,
  framework: 'workflo-jasmine',
  reporters: ['workflo-spec', 'workflo-allure'],
  jasmineNodeOpts: {
    defaultTimeoutInterval: 9999999,
    expectationResultHandler: function (passed, assertion) {
      /**
       * only take screenshot if assertion failed
       */

      if (process.workflo && process.workflo.specObj) {
        assertion.specObj = process.workflo.specObj
      }

      if (assertion.matcherName && workfloMatcherNames.indexOf(assertion.matcherName) >= 0 ) {
        delete assertion.actual
        delete assertion.expected
      }

      if (passed) {
        process.send({event: 'validate:success', assertion: assertion})

        // rework
        process.send({event: 'step:succeeded', cid: '0-0', assertion: assertion})
        return
      } else {
        if (assertion.matcherName) {
          try {
            const screenshot = browser.saveScreenshot() // returns base64 string buffer

            const screenshotFolder = path.join(process.env.WDIO_WORKFLO_RUN_PATH, 'allure-results')
            const screenshotFilename = `${screenshotFolder}/${global.screenshotId}.png`

            assertion.screenshotFilename = screenshotFilename

            fs.writeFileSync(screenshotFilename, screenshot)
          } catch (err) {
            console.log(`Failed to take screenshot: ${err.message}`)
            console.log(err.stack)
          }

          var stack = new Error().stack
          assertion.stack = stack

          assertion.screenshotId = global.screenshotId
          global.screenshotId++

          process.send({event: 'step:failed', assertion: assertion, ignoreErrors: global.ignoreErrors})

          if (!global.ignoreErrors) {
            increaseBailErrors()
            process.send({event: 'validate:failure', assertion: assertion})
          } else {
            const stackLines = assertion.stack.split('\n').filter(line => line.startsWith('    at '))

            stackLines.pop()
            assertion.stack =  stackLines.join('\n')

            process.send({event: 'retry:validateFailure', assertion: assertion})
          }
        } else {
          assertion.stack = cleanStack(assertion.error.stack, true)

          delete assertion.matcherName
          delete assertion.passed
          delete assertion.expected
          delete assertion.actual
          delete assertion.error

          if (global.errorScreenshotFilename) {
            assertion.screenshotFilename = global.errorScreenshotFilename
            assertion.screenshotId = global.screenshotId
            global.screenshotId++
          }

          if (errorType) {
            assertion.errorType = errorType
          }

          global.errorScreenshotFilename = undefined

          process.send({event: 'step:broken', assertion: assertion, ignoreErrors: global.ignoreErrors})

          if (assertion.specObj && !global.ignoreErrors) {
            increaseBailErrors()
            process.send({event: 'validate:broken', assertion: assertion})
          }
        }
      }
    }
  },
  /**
   * hooks
   */
  onPrepare: function (config, capabilities) {
    if (typeof workfloConf.onPrepare === 'function') {
      return workfloConf.onPrepare(config, capabilities)
    }
  },
  beforeSession: function (config, capabilities, testcases) {
    if (typeof workfloConf.beforeSession === 'function') {
      return workfloConf.beforeSession(config, capabilities, testcases)
    }

    global.bailErrors = config.bailErrors
    global.screenshotId = config.screenshotId + 1
    global.errorScreenshotFilename = undefined
  },
  before: function (capabilities, testcases) {
    process.env.WORKFLO_CONFIG = JSON.stringify(workfloConf)

    // allow custom failure messages in jasmine
    // require('jasmine2-custom-message')

    // import additional matchers from https://github.com/JamieMason/Jasmine-Matchers
    require('jasmine-expect')

    require('ts-node/register')
    require('tsconfig-paths/register')

    require('../dist/inject.js')

    // extend webdriverio client instance with capability to resolve any type of promise in order to continue code synchronously
    browser.addCommand('resolvePromise', function async (promise) {
      return promise
    })

    if (typeof workfloConf.before === 'function') {
      workfloConf.before(capabilities, testcases)
    }
  },
  beforeSuite: function (suite) {
    browser.timeouts('implicit', 1001)

    if (typeof workfloConf.beforeSuite === 'function') {
      workfloConf.beforeSuite(suite)
    }
  },
  beforeValidator: function (capabilities, specs) {
    require('ts-node/register')
    require('tsconfig-paths/register')

    require('../dist/inject.js')

    finishedTestcases = true

    if (typeof workfloConf.beforeValidator === 'function') {
      workfloConf.beforeValidator(capabilities, specs)
    }
  },
  beforeHook: function () {
    if (typeof workfloConf.beforeHook === 'function') {
      workfloConf.beforeHook()
    }
  },
  afterHook: function () {
    if (typeof workfloConf.afterHook === 'function') {
      workfloConf.afterHook()
    }
  },
  beforeTest: function (test) {
    // some gui tests require a sized window
    if (!finishedTestcases) {
      browser.windowHandleSize({
        width: workfloConf.width,
        height: workfloConf.height
      })
    }

    global.errorScreenshotFilename = undefined
    errorType = undefined

    if (process.workflo) {
      process.workflo.specObj = undefined
    }

    if (typeof workfloConf.beforeTest === 'function') {
      workfloConf.beforeTest(test)
    }
  },
  beforeCommand: function (commandName, args) {
    if (typeof workfloConf.beforeCommand === 'function') {
      workfloConf.beforeCommand(commandName, args)
    }
  },
  // Runs after a WebdriverIO command gets executed
  afterCommand: function (commandName, args, result, error) {
    if (error) {
      if ( error.type ) {
        errorType = error.type
      } else if ( error.toString().indexOf("Error: An element could not be located on the page using the given search parameters") > -1 ) {
        errorType = true
      }

      try {
        const screenshot = browser.saveScreenshot() // returns base64 string buffer

        const screenshotFolder = path.join(process.env.WDIO_WORKFLO_RUN_PATH, 'allure-results')
        const screenshotFilename = `${screenshotFolder}/${global.screenshotId}.png`

        global.errorScreenshotFilename = screenshotFilename

        fs.writeFileSync(screenshotFilename, screenshot)
      } catch (err) {
        console.log(`Failed to take screenshot: ${err.message}`)
        console.log(err.stack)
      }
    }

    if (typeof workfloConf.afterCommand === 'function') {
      workfloConf.afterCommand(commandName, args, result, error)
    }
  },
  afterTest: function (test) {
    if (typeof workfloConf.afterTest === 'function') {
      workfloConf.afterTest(test)
    }

    if (test.passed === false) {
      browser.reload()
    }
  },
  afterSuite: function (suite) {
    if (typeof workfloConf.afterSuite === 'function') {
      workfloConf.afterSuite(suite)
    }
  },
  after: function (result, capabilities, testcases) {
    if (typeof workfloConf.after === 'function') {
      workfloConf.after(result, capabilities, testcases)
    }
  },
  afterValidator: function (result, capabilities, specs) {
    if (typeof workfloConf.after === 'function') {
      workfloConf.afterValidator(result, capabilities, specs)
    }
  },
  afterSession: function (config, capabilities, testcases) {
    if (typeof workfloConf.afterSession === 'function') {
      workfloConf.afterSession(config, capabilities, testcases)
    }
  },
  onComplete: function (exitCode, config, capabilities) {
    copyFolderRecursiveSync(path.join(config.resultsPath, config.dateTime, 'allure-results'), config.mergedAllureResultsPath)

    if (typeof workfloConf.onComplete === 'function') {
      workfloConf.onComplete(exitCode, config, capabilities)
    }
  },
  onError: function (message) {
    if (typeof workfloConf.onError === 'function') {
      workfloConf.onError(message)
    }
  }
}
