const testDir = __dirname + '/system_test'

module.exports = {
  testDir: testDir,
  logLevel: 'verbose',
  baseUrl: 'http://www.google.com/',
  windowSize: {
    width: 1280,
    height: 800
  },
  webdriver: {
    host: '127.0.0.1',
    port: 4444
  },
  selenium: {
    version: '3.4.0',
    baseURL: 'http://selenium-release.storage.googleapis.com'
  },
  capabilities: {
    maxInstances: 1,
    browserName: 'chrome',
    requireWindowFocus: true,
    nativeEvents: true,    
    unexpectedAlertBehaviour: "accept",
    ignoreProtectedModeSettings: true,
    "disable-popup-blocking": true,
    enablePersistentHover: true,
  },
  specFiles: [ `${testDir}/src/specs/**/*.spec.ts` ],
  testcaseFiles: [ `${testDir}/src/testcases/**/*.tc.ts` ],
  manualResultFiles: [ `${testDir}/src/manualResults/**/*.man.ts` ],
  uidStorePath: "",
  allure: {
    issueTrackerPattern: "http://issueTracker/issue-%s",
    bugTrackerPattern: "https://bugtracker/bug-%s"
  },
  timeouts: {
    default: 5000
  }
}