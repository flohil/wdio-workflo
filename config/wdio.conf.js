if (typeof process.env.WORKFLO_CONFIG === 'undefined') {
  console.error("Please provide the absolute path to workflo.conf.js location as WORKFLO_CONFIG environment variable!")
  process.exit(1)
}

const path = require('path')
const _ = require( 'lodash' )
const fs = require( 'fs' )
const workfloConf = require( process.env.WORKFLO_CONFIG )
const dateTime = require('../utils/report.js').getDateTime()

if ( typeof process.env.LATEST_RUN === 'undefined' ) {

  const resultsPath = path.join(workfloConf.testDir, 'results')

  if (!fs.existsSync(resultsPath)){
    fs.mkdirSync(resultsPath);
  }

  const filepath = path.join(resultsPath, 'latestRun')

  fs.writeFile(filepath, dateTime, err => {
    if (err) {
      return console.error(err)
    }

    console.log(`Set latest run: ${dateTime}`)
  })

  process.env.LATEST_RUN = dateTime
}

//buildSpecs()
exports.config = {
  /**
   * server configurations
   */
  host: workfloConf.webdriver.host,
  port: workfloConf.webdriver.port,
  /**
   * specify test files
   */
  //specs: 'src/example.spec.ts',
  specs: workfloConf.specs,
  testcases: workfloConf.testcases,
  /**
   * capabilities
   */
  capabilities: [workfloConf.capabilities],
  services: ['selenium-standalone'],
  seleniumLogs: path.relative('./', path.join(workfloConf.testDir, 'logs', 'selenium', dateTime)),
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
  waitforTimeout: 10000,
  framework: 'workflo-jasmine',
  reporters: ['workflo-spec', 'workflo-allure'],
  reporterOptions: {
    outputDir: path.join(workfloConf.testDir, 'results', dateTime),
    /*allure: {
      outputDir: `${workfloConf.testDir}/results/${dateTime}/allure-results/`
    },*/
    /*'allure-addons': {
      outputDir: `${workfloConf.testDir}/results/${dateTime}/allure-results/`,
      debug: false,
      debugSeleniumCommand: true
    }*/
    'workflo-allure': {
      outputDir: path.join(workfloConf.testDir, 'results', dateTime, 'allure-results'),
      debug: false,
      debugSeleniumCommand: true
    }
  },
  jasmineNodeOpts: {
    defaultTimeoutInterval: 9999999,
    expectationResultHandler: function(passed, assertion) {
      /**
       * only take screenshot if assertion failed
       */

      if ( process.workflo && process.workflo.specObj ) {
        assertion.specObj = process.workflo.specObj
      }

      if ( passed ) {
        process.send({event: 'verify:success', assertion: assertion})

        // rework
        process.send({event: 'step:succeeded', cid: '0-0', assertion: assertion})
        return
      }
      if ( assertion.error ) {
          // either a webdriver command which is 
          // already captured by screenshots in afterCommand()
          // if another error occured, don't take 
          // screenshot
      }
      else if ( assertion.matcherName ) {
        // rework
        process.send({event: 'step:failed', cid: '0-0', assertion: assertion})

        process.send({event: 'verify:failure', assertion: assertion})
      }
    },
  },
  /**
   * hooks
   */
  onPrepare: function() {
    console.log('let\'s go')
  },
  before: function ( capabilties, specs ) {

    process.env.WORKFLO_CONFIG = JSON.stringify(workfloConf)
   
    // allow custom failure messages in jasmine
    //require('jasmine2-custom-message')
    
    // import additional matchers from https://github.com/JamieMason/Jasmine-Matchers
    require('jasmine-expect')

    require('ts-node/register')
    require('tsconfig-paths/register')

    require('../dist/inject.js')

    // some gui tests require a sized window
    browser.windowHandleSize(workfloConf.windowSize)

    // extend default object and string prototypes
    // with custom utitily functions
  },
  beforeTest: function(test) {
  },
  beforeSuite: function(suite) {
    browser.timeouts('implicit', 1001)
  },
  onComplete: function() {
    console.log('that\'s it')
  },
  // Runs after a WebdriverIO command gets executed
  afterCommand: function (commandName, args, result, error) {
   
  }
}