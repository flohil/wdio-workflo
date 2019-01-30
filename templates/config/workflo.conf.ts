import { IWorkfloConfig } from 'wdio-workflo';

const testDir = `${__dirname}/system_test`;

const workfloConfig: IWorkfloConfig = {
  testDir,
  baseUrl: 'http://www.google.com/',
  host: '127.0.0.1',
  port: 4444,
  width: 1280,
  height: 800,
  capabilities: {
    browserName: 'chrome',
  },
  timeouts: {
    default: 5000,
  },
  intervals: {
    default: 500,
  },
  allure: {
    issueTrackerPattern: 'http://example.com/issues/%s',
    testManagementPattern: 'http://example.com/tms/%s',
  },
};

export default workfloConfig;
