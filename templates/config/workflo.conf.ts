import { IWorkfloConfig } from 'wdio-workflo'

const testDir = __dirname + '/system_test'

const workfloConfig: IWorkfloConfig = {
  testDir: testDir,
  baseUrl: 'http://www.google.com/',
  host: '127.0.0.1',
  port: 4444,
  width: 1280,
  height: 800,
  capabilities: {
    browserName: 'chrome',
    requireWindowFocus: true,
    nativeEvents: true,
    unexpectedAlertBehaviour: "accept",
    ignoreProtectedModeSettings: true,
    "disable-popup-blocking": true,
    enablePersistentHover: true,
  },
  timeouts: {
    default: 4000
  },
  intervals: {
    default: 400
  },
  specFiles: [ `${testDir}/src/specs/**/*.spec.ts` ],
  testcaseFiles: [ `${testDir}/src/testcases/**/*.tc.ts` ],
  manualResultFiles: [ `${testDir}/src/manual_results/**/*.man.ts` ],
  uidStorePath: `${testDir}/data/uidStore.json`,
  allure: {
    issueTrackerPattern: 'http://example.com/issues/%s',
    testManagementPattern: 'http://example.com/tms/%s',
  }
}

export default workfloConfig