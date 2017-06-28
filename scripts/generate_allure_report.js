if (typeof process.env.WORKFLO_CONFIG === 'undefined') {
  console.error("Please provide the absolute path to workflo.conf.js location as WORKFLO_CONFIG environment variable!")
  process.exit(1)
}

var fs = require('fs')
var path = require('path')
var allure = require('allure-commandline')
var wrench = require('wrench')

var workfloConf = require(process.env.WORKFLO_CONFIG)
var latestRunPath = path.join(workfloConf.testDir, 'results', 'latestRun')
var latestRun = fs.readFileSync(latestRunPath, 'utf8')

// replace original allure-commandline bin files with patched ones,
// which support issue tracker pattern and bug tracker pattern

var rmdir = function(dir) {
    var list = fs.readdirSync(dir);
    for(var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);

        if(filename == "." || filename == "..") {
            // pass these files
        } else if(stat.isDirectory()) {
            // rmdir recursively
            rmdir(filename);
        } else {
            // rm fiilename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
}

const allureBinPath = path.resolve(__dirname,'../node_modules/allure-commandline/dist/bin')
const allurePathBinPath = path.resolve(__dirname, '../templates/node_modules/allure-commandline/dist/bin')

console.log("binPath: ", allureBinPath)

if (fs.existsSync(allureBinPath)) {
    rmdir(allureBinPath)
}

wrench.copyDirSyncRecursive(allurePathBinPath, allureBinPath)

process.env.ALLURE_BUG_TRACKER_PATTERN = workfloConf.allure.bugTrackerPattern
process.env.ALLURE_ISSUE_TRACKER_PATTERN = workfloConf.allure.issueTrackerPattern

// returns ChildProcess instance 
var generation = allure([
    'generate', 
    path.join(workfloConf.testDir, 'results', latestRun, 'allure-results'),
    '-o',
    path.join(workfloConf.testDir, 'results', latestRun, 'allure-report')]);
 
generation.on('exit', function(exitCode) {
    console.log('Generation is finished with code:', exitCode);
});