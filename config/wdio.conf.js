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

let assertionScreenshotCtr = 0
let errorScreenshotCtr = 0
let errorScreenshotFilename

// set defaults for workflo config
if (!workfloConf.timeouts) {
  workfloConf.timeouts = {}
}
if (!workfloConf.timeouts.waitforTimeout) {
  workfloConf.timeouts.waitforTimeout = workfloConf.timeouts.waitforTimeout || 5000
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
  waitforTimeout: workfloConf.waitforTimeout,
  waitforInterval: workfloConf.waitforInterval || 500,
  connectionRetryTimeout: workfloConf.connectionRetryTimeout || 30000,
  connectionRetryCount: 0,
  testDir: workfloConf.testDir,
  /**
   * capabilities
   */
  capabilities: [ Object.assign( workfloConf.capabilities, { maxInstances: 1 } ) ],
  services: ['selenium-standalone'],
  seleniumLogs: path.relative('./', path.join(workfloConf.testDir, 'logs', 'selenium', process.env.LATEST_RUN)),
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
  logOutput: path.join(workfloConf.testDir, 'logs'),
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
  reporterOptions: {
    outputDir: path.join(workfloConf.testDir, 'results', process.env.LATEST_RUN),
    'workflo-allure': {
      outputDir: path.join(workfloConf.testDir, 'results', process.env.LATEST_RUN, 'allure-results'),
      debug: false,
      debugSeleniumCommand: true
    }
  },
  jasmineNodeOpts: {
    defaultTimeoutInterval: 9999999,
    expectationResultHandler: function (passed, assertion) {
      /**
       * only take screenshot if assertion failed
       */

      if (process.workflo && process.workflo.specObj) {
        assertion.specObj = process.workflo.specObj
      }

      if (passed) {
        process.send({event: 'validate:success', assertion: assertion})

        // rework
        process.send({event: 'step:succeeded', cid: '0-0', assertion: assertion})
        return
      } else {
        if (assertion.matcherName) {
          // receive screenshot as Buffer
          if (true) {
            const screenshot = browser.saveScreenshot() // returns base64 string buffer

            const screenshotFolder = path.join(workfloConf.testDir, 'results', process.env.LATEST_RUN, 'allure-results')
            const screenshotFilename = `${screenshotFolder}/assertionFailure_${assertionScreenshotCtr}.png`

            assertionScreenshotCtr++
            assertion.screenshotFilename = screenshotFilename

            try {
              fs.writeFileSync(screenshotFilename, screenshot)
            } catch (err) {
              console.log(`Error writing screenshot:${err.message}`)
            }
          }

          var stack = new Error().stack
          assertion.stack = stack

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
          }

          errorScreenshotFilename = undefined

          process.send({event: 'step:broken', assertion: assertion})
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

    // some gui tests require a sized window
    browser.windowHandleSize(workfloConf.windowSize)

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
      browser.saveScreenshot()

      const screenshot = browser.saveScreenshot() // returns base64 string buffer

      const screenshotFolder = path.join(workfloConf.testDir, 'results', process.env.LATEST_RUN, 'allure-results')
      const screenshotFilename = `${screenshotFolder}/error_${errorScreenshotCtr}.png`

      errorScreenshotCtr++
      errorScreenshotFilename = screenshotFilename

      try {
        fs.writeFileSync(screenshotFilename, screenshot)
      } catch (err) {
        console.log(`Error writing screenshot:${err.message}`)
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
  onError: function(message) {
    if (typeof workfloConf.onError === 'function') {
      workfloConf.onError(message)
    }
  }
}