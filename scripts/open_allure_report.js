var fs = require('fs')
var path = require('path')
var allure = require('allure-commandline');
var testDir = process.env.testDir

if (typeof testDir === 'undefined') {
    console.error('TESTDIR must be specified!')
    process.exit(1)
}

var latestRunPath = path.join(testDir, 'results', 'latestRun')

var latestRun = fs.readFileSync(latestRunPath, 'utf8');

console.log(latestRun)

// returns ChildProcess instance 
var open = allure([
    'open',
    path.join(testDir, 'results', latestRun, 'allure-report')]);
 
open.on('exit', function(exitCode) {
    console.log('Showing report for run:', latestRun);
});