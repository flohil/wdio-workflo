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
  /**
   * specify test files
   */
  // specs: 'src/example.spec.ts',
  specs: workfloConf.specFiles,
  testcases: workfloConf.testcaseFiles,
  manualTestcases: workfloConf.manualTestcaseFiles,
  uidStorePath: workfloConf.uidStorePath,
  waitforTimeout: workfloConf.waitforTimeout,
  testDir: workfloConf.testDir,
  /**
   * capabilities
   */
  capabilities: [workfloConf.capabilities],
  services: ['selenium-standalone'],
  seleniumLogs: path.relative('./', path.join(workfloConf.testDir, 'logs', 'selenium', process.env.LATEST_RUN)),
  seleniumArgs: workfloConf.selenium.args,
  seleniumInstallArgs: workfloConf.selenium.installArgs,
  /**
   * test configurations
   */
  logLevel: workfloConf.logLevel,
  logOutput: path.join(workfloConf.testDir, 'logs'),
  coloredLogs: true,
  screenshotPath: null,
  baseUrl: workfloConf.baseUrl,
  waitforTimeout: workfloConf.timeouts.waitforTimeout,
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
          if (/* browser.sessions().length > 0 */ true) {
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
  },
  before: function (capabilties, specs) {
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

    // extend default object and string prototypes
    // with custom utitily functions
  },
  beforeValidator: function (capabilties, specs) {
    require('ts-node/register')
    require('tsconfig-paths/register')

    require('../dist/inject.js')
  },
  beforeTest: function (test) {
    // if (browser.sessions().length > 0) {
    //   const tabIds = browser.getTabIds()

    //   for( const tabId of tabIds ) {
    //     try {
    //       browser.close()
    //     } catch( e ) {
    //       // could not switch to tab if last tab was closed
    //     }
    //   }
    // }
  },
  afterTest: function (test) {
    if (test.passed === false) {
      browser.reload()
    }
  },
  beforeSuite: function (suite) {
    browser.timeouts('implicit', 1001)
  },
  onComplete: function (exitCode, config, capabilities) {
    copyFolderRecursiveSync(path.join(config.resultsPath, config.dateTime, 'allure-results'), config.mergedAllureResultsPath)
  },
  // Runs after a WebdriverIO command gets executed
  afterCommand: function (commandName, args, result, error) {
    if (error) {
      if (/* browser.sessions().length > 0 */ true) {
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
    }
  }
}
