const _ = require( 'lodash' )
const fs = require( 'fs' )
const workfloConf = require( './workflo.conf.js' )
const dateTime = require('../src/utils/report.js').getDateTime()
const AllureReporter = require('jasmine-allure-reporter')

if ( typeof process.env.LATEST_RUN === 'undefined' ) {
  fs.writeFile(`${workfloConf.testDir}/results/latestRun`, dateTime, err => {
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
  specs: [ 'src/testDir/src/testcases/helloworld.tc.ts', /*'src/testDir/src/testcases/other.tc.ts',*/ 'src/testDir/src/specs/example.spec.ts' ],
  /**
   * capabilities
   */
  capabilities: [workfloConf.capabilities],
  services: ['selenium-standalone'],
  seleniumLogs: `${workfloConf.testDir}/logs/selenium/${dateTime}`,
  seleniumArgs: workfloConf.selenium.args,
  seleniumInstallArgs: workfloConf.selenium.installArgs,
  /**
   * test configurations
   */
  logLevel: workfloConf.logLevel,
  logOutput: `${workfloConf.testDir}/logs/`,
  coloredLogs: true,
  screenshotPath: null,
  baseUrl: workfloConf.baseUrl,
  waitforTimeout: 10000,
  framework: 'workflo-jasmine',
  reporters: ['workflo-spec', /*'junit',*/ 'workflo-allure' /*'allure-addons'/*, 'allure'*/],
  reporterOptions: {
    outputDir: `${workfloConf.testDir}/results/${dateTime}`,
    /*allure: {
      outputDir: `${workfloConf.testDir}/results/${dateTime}/allure-results/`
    },*/
    /*'allure-addons': {
      outputDir: `${workfloConf.testDir}/results/${dateTime}/allure-results/`,
      debug: false,
      debugSeleniumCommand: true
    }*/
    junit: {
      outputDir: `${workfloConf.testDir}/results/${dateTime}/junit-results/`
    },
    'workflo-allure': {
      outputDir: `${workfloConf.testDir}/results/${dateTime}/allure-results/`,
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

      if ( passed ) {
        return
      }
      if ( assertion.error ) {
          // either a webdriver command which is 
          // already captured by screenshots in afterCommand()
          // if another error occured, don't take 
          // screenshot
      }
      else if ( assertion.matcherName ) {
        process.send({event: 'step:failed', cid: '0-0'})

        if ( process.workflo && process.workflo.specObj ) {
          assertion.specObj = process.workflo.specObj
          //assertion.screenshot = browser.saveScreenshot()
          //console.log("PROCESS: ", process.workflo.specObj)
          //console.log("screenshot: ", assertion.screenshot)
        }

        //console.log('\n\n\n\n', process.getuid())
        //console.log(process.getgid())
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

    require('../src/inject.ts')

    // some gui tests require a sized window
    browser.windowHandleSize(workfloConf.windowSize)

    global.myTestFunc = () => { console.log("hello") }

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