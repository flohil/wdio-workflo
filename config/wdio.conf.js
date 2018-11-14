if (typeof process.env.WORKFLO_CONFIG === 'undefined') {
  console.error('Please provide the absolute path to workflo.conf.js location as WORKFLO_CONFIG environment variable!')
  process.exit(1)
}

const path = require('path')
const _ = require('lodash')
const fs = require('fs')
const workfloConf = require(process.env.WORKFLO_CONFIG)
const jsonfile = require('jsonfile')
const copyFolderRecursiveSync = require('../dist/lib/io.js').copyFolderRecursiveSync

const workfloMatcherNames = [ 'toExist' ]

let screenshotIdCtr = 1
let errorScreenshotFilename
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

function cleanStack (error) {
  let stack = error.split('\n')
  stack = stack.filter((line) => !line.match(STACKTRACE_FILTER))
  error = stack.join('\n')
  return error
}

// buildSpecs()
exports.config = {
  /**
   * server configurations
   */
  host: workfloConf.webdriver.host,
  port: workfloConf.webdriver.port,
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
  waitforInterval: workfloConf.waitforInterval || 500,
  connectionRetryTimeout: workfloConf.connectionRetryTimeout || 30000,
  connectionRetryCount: 0,
  testDir: workfloConf.testDir,
  /**
   * capabilities
   */
  capabilities: [ Object.assign(workfloConf.capabilities, { maxInstances: 1 }) ],
  services: workfloConf.services || ['selenium-standalone'],
  seleniumArgs: workfloConf.selenium.args,
  seleniumInstallArgs: workfloConf.selenium.installArgs,
  queryParams: workfloConf.queryParams || {},
  headers: workfloConf.headers || {},
  /**
   * test configurations
   */
  user: workfloConf.user,
  key: workfloConf.key,
  bail: workfloConf.bail || 0,
  logLevel: workfloConf.logLevel,
  protocol: workfloConf.protocol || 'http',
  debug: workfloConf.debug || false,
  execArgv: workfloConf.execArgv || null,
  coloredLogs: true || workfloConf.coloredLogs,
  deprecationWarnings: workfloConf.deprecationWarnings || false,
  screenshotPath: null,
  screenshotOnReject: workfloConf.screenshotOnReject || {
    connectionRetryTimeout: 15000,
    connectionRetryCount: 3
  },
  baseUrl: workfloConf.baseUrl,
  waitforTimeout: workfloConf.timeouts.waitforTimeout,
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
            const screenshotFilename = `${screenshotFolder}/${screenshotIdCtr}.png`

            assertion.screenshotFilename = screenshotFilename

            fs.writeFileSync(screenshotFilename, screenshot)
          } catch (err) {
            console.log(`Failed to take screenshot: ${err.message}`)
            console.log(err.stack)
          }

          var stack = new Error().stack
          assertion.stack = stack

          assertion.screenshotId = screenshotIdCtr
          screenshotIdCtr++

          process.send({event: 'step:failed', assertion: assertion})
          process.send({event: 'validate:failure', assertion: assertion})
        } else {
          assertion.stack = cleanStack(assertion.error.stack)

          delete assertion.matcherName
          delete assertion.passed
          delete assertion.expected
          delete assertion.actual
          delete assertion.error

          if (errorScreenshotFilename) {
            assertion.screenshotFilename = errorScreenshotFilename
            assertion.screenshotId = screenshotIdCtr
            screenshotIdCtr++
          }

          if (errorType) {
            assertion.errorType = errorType
          }

          errorScreenshotFilename = undefined

          process.send({event: 'step:broken', assertion: assertion})

          if (assertion.specObj) {
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
      workfloConf.onPrepare(config, capabilities)
    }
  },
  beforeSession: function (config, capabilities, specs) {
    if (typeof workfloConf.beforeSession === 'function') {
      workfloConf.beforeSession(config, capabilities, specs)
    }
  },
  before: function (capabilties, testcases) {
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
      workfloConf.before(capabilities, specs)
    }
  },
  beforeSuite: function (suite) {
    browser.timeouts('implicit', 1001)

    if (typeof workfloConf.beforeSuite === 'function') {
      workfloConf.beforeSuite(suite)
    }
  },
  beforeValidator: function (capabilties, specs) {
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
      browser.windowHandleSize(workfloConf.windowSize)
    }

    errorScreenshotFilename = undefined
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
        const screenshotFilename = `${screenshotFolder}/${screenshotIdCtr}.png`

        errorScreenshotFilename = screenshotFilename

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
  after: function (result, capabilities, specs) {
    if (typeof workfloConf.after === 'function') {
      workfloConf.after(result, capabilities, specs)
    }
  },
  afterSession: function (config, capabilities, specs) {
    if (typeof workfloConf.afterSession === 'function') {
      workfloConf.afterSession(config, capabilities, specs)
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
