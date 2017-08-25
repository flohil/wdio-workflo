if (typeof process.env.WORKFLO_CONFIG === 'undefined') {
  console.error("Please provide the absolute path to workflo.conf.js location as WORKFLO_CONFIG environment variable!")
  process.exit(1)
}

const path = require('path')
const _ = require( 'lodash' )
const fs = require( 'fs' )
const workfloConf = require( process.env.WORKFLO_CONFIG )
const dateTime = require('../utils/report.js').getDateTime()
const jsonfile = require('jsonfile')

let assertionScreenshotCtr = 0

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
  specs: workfloConf.specFiles,
  testcases: workfloConf.testcaseFiles,
  manualTestcases: workfloConf.manualTestcaseFiles,
  uidStorePath: workfloConf.uidStorePath,
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
        // receive screenshot as Buffer
        const screenshot = browser.saveScreenshot(); // returns base64 string buffer
        
        const screenshotFolder = path.join(workfloConf.testDir, 'results', process.env.LATEST_RUN, 'allure-results')
        const screenshotFilename = `${screenshotFolder}/assertionFailure_${assertionScreenshotCtr}.png`

        assertionScreenshotCtr++
        assertion.screenshotFilename = screenshotFilename

        try {
            fs.writeFileSync(screenshotFilename, screenshot)
        } catch (err) {
            console.log('Error writing screenshot:' + err.message)
        }

        process.send({event: 'step:failed', cid: '0-0', assertion: assertion})
        process.send({event: 'verify:failure', assertion: assertion})
      }
    },
  },
  /**
   * hooks
   */
  onPrepare: function(config, capabilities) {
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

    // patch JSON.stringify to avoid circular structure errors
    _orStringify = JSON.stringify
    
    function censor(censor) {
        let i = 0;
        return function (key, value) {
            if (i !== 0 && typeof (censor) === 'object' && typeof (value) == 'object' && censor == value)
                return '[Circular]';
            if (i >= 29)
                return '[Unknown]';
            ++i; // so we know we aren't using the original object anymore
            return value;
        };
    }

    JSON.stringify = (obj) => _orStringify(obj, censor(obj))

    // some gui tests require a sized window
    browser.windowHandleSize(workfloConf.windowSize)

    // extend default object and string prototypes
    // with custom utitily functions
  },
  beforeVerifier: function ( capabilties, specs ) {
    require('ts-node/register')
    require('tsconfig-paths/register')

    require('../dist/inject.js')
  },
  beforeTest: function(test) {
  },
  beforeSuite: function(suite) {
    browser.timeouts('implicit', 1001)
  },
  onComplete: function(exitCode, config, capabilities) {
    console.log('that\'s it')
  },
  // Runs after a WebdriverIO command gets executed
  afterCommand: function (commandName, args, result, error) {
   
  }
}