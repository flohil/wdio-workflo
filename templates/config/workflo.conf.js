const path = require('path')

module.exports = {
  testDir: path.resolve('./testDir'),
  logLevel: 'verbose',
  baseUrl: 'http://webdriver.io', // replace with anna base url
  windowSize: {
    width: 1280,
    height: 800
  },
  webdriver: {
    host: '172.20.7.150',
    port: 4444
  },
  selenium: {
    version: '2.53.1',
    baseURL: 'http://selenium-release.storage.googleapis.com'
  },
  capabilities: {
    maxInstances: 1,
    browserName: 'internet explorer',
    requireWindowFocus: true,
    nativeEvents: true,    
    unexpectedAlertBehaviour: "accept",
    ignoreProtectedModeSettings: true,
    "disable-popup-blocking": true,
    enablePersistentHover: true,
  }
}