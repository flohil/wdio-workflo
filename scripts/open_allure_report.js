if (typeof process.env.WORKFLO_CONFIG === 'undefined') {
  console.error("Please provide the absolute path to workflo.conf.js location as WORKFLO_CONFIG environment variable!")
  process.exit(1)
}

var fs = require('fs')
var path = require('path')
var allure = require('allure-commandline')

var workfloConf = require(process.env.WORKFLO_CONFIG)
var latestRunPath = path.join(workfloConf.testDir, 'results', 'latestRun')
var latestRun = fs.readFileSync(latestRunPath, 'utf8');

// returns ChildProcess instance 
var open = allure([
    'open',
    path.join(workfloConf.testDir, 'results', latestRun, 'allure-report')]);
 
open.on('exit', function(exitCode) {
    console.log('Showing report for run:', latestRun);
});