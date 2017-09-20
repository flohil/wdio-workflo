import * as path from 'path'
import * as fs from 'fs'
import * as ejs from 'ejs' 

import {specFilesParse, SpecTableEntry, testcaseFilesParse, TestcaseTableEntry, SpecParseResults, TestcaseParseResults} from './parser'
import {getAllFiles} from './io'

import * as npmInstallPackage from 'npm-install-package'
import * as inquirer from 'inquirer'
import * as optimist from 'optimist'
import * as merge from 'deepmerge'

import { Launcher } from 'webdriverio-workflo'

const pkg = require('../../package.json')

const VERSION = pkg.version

const ALLOWED_ARGV = [
    'host', 'port',  'logLevel', 'coloredLogs', 'baseUrl', 'waitforTimeout', 
    'connectionRetryTimeout', 'connectionRetryCount',
    'testcaseFiles', 'specFiles', 'listFiles', 'testcases', 'specs', 'features'
    //, 'jasmineOpts', 'user', 'key', 'watch', 'path'
]

let configFile
let optionsOffset = 2 // config file defined as first "parameter"

// options (not yet) supported are commented out
optimist
    .usage('wdio-workflo CLI runner\n\n' +
        'Usage: wdio-workflo [configFile] [options]\n' +
        'The [options] object will override values from the config file.')

    .describe('help', 'prints wdio-workflo help menu')
    .alias('help', 'h')
    .describe('version', 'prints wdio-workflo version')
    .alias('version', 'v')
    .describe('host', 'Selenium server host address')
    .describe('port', 'Selenium server port')
    .describe('logLevel', 'level of logging verbosity (default: silent)')
    .alias('logLevel', 'l')
    .describe('coloredLogs', 'if true enables colors for log output (default: true)')
    .alias('coloredLogs', 'c')
    .describe('bail', 'stop test runner after specific amount of tests have failed (default: 0 - don\'t bail)')
    .describe('baseUrl', 'shorten url command calls by setting a base url')
    .alias('baseUrl', 'b')
    .describe('waitforTimeout', 'timeout for all waitForXXX commands (default: 5000ms)')
    .alias('waitforTimeout', 'w')

    .describe('testcases', 'restricts test execution to these testcases\n' +
        '\t\t\t\'["Suite1", "Suite2.Testcase1"]\' => execute all testcases of Suite1 and Testcase1 of Suite2\n' +
        '\t\t\t\'["Suite2", "-Suite2.Testcase2"]\' => execute all testcases of Suite2 except for Testcase2\n')
    .describe('features', 'restricts test execution to these features\n' +
        '\t\t\t\'["Login"]\' => execute all testcases which are verified by specs defined within these features\n')
    .describe('specs', 'restricts test execution to these specs\n' +
        '\t\t\t\'["3.2"]\' => execute all testcases which verify spec 3.2\n' + 
        '\t\t\t\'["1.1*", "-1.1.2.4"]\' => 1.1* includes spec 1.1 and all of its sub-specs (eg. 1.1.2), -1.1.2.4 excludes spec 1.1.2.4\n' +
        '\t\t\t\'["1.*"]\' => 1.* excludes spec 1 itself but includes of of its sub-specs\n')
    .describe('testcaseFiles', 'restricts test execution to testcases defined within these files\n' + 
        '\t\t\t\'["testcaseFile1", "testcaseFile2"]\' => execute all testcases defined within testcaseFile1.tc.ts and testcaseFile2.tc.ts\n')
    .describe('specFiles', 'restricts test execution to testcases verified by specs defined within these files\n' + 
        '\t\t\t\'["specFile1", "specFile2"]\' => execute all testcases verified by specs defined within specFile1.spec.ts and specFile2.spec.ts\n')
    .describe('listFiles', 'restricts test execution to the testcases, specs, testcaseFiles, specFiles and lists defined within these files \n' +
        '\t\t\t\'["listFile1"]\' => execute all testcases include by the contents of listFile1.list.ts\n')

    
    // wdio-workflo options
   
    // support priority: low

    // .describe('path', 'Selenium server path (default: /wd/hub)')
    // .describe('user', 'username if using a cloud service as Selenium backend')
    // .alias('user', 'u')
    // .describe('key', 'corresponding access key to the user')
    // .alias('key', 'k')
    // .describe('watch', 'watch specs for changes')
    // .describe('jasmineOpts.*', 'Jasmine options, see the full list options at https://github.com/webdriverio/wdio-jasmine-framework#jasminenodeopts-options')

    // not supported
    
    // .describe('suite', 'overwrites the specs attribute and runs the defined suite') // replaced by 'testcases'
    // .describe('spec', 'run only a certain spec file') // replaced by 'testcaseFiles' and 'specFiles'
    // .describe('cucumberOpts.*', 'Cucumber options, see the full list options at https://github.com/webdriverio/wdio-cucumber-framework#cucumberopts-options') // only jasmine is supported
    // .describe('mochaOpts.*', 'Mocha options, see the full list options at http://mochajs.org') // only jasmine is supported
    // .describe('screenshotPath', 'saves a screenshot to a given path if a command fails') // stored with allure results
    // .alias('screenshotPath', 's')
    // .describe('framework', 'defines the framework (Mocha, Jasmine or Cucumber) to run the specs (default: mocha)')
    // .alias('framework', 'f')
    // .describe('reporters', 'reporters to print out the results on stdout') // supports only workflo adaptions of spec and allure reporters
    // .alias('reporters', 'r')
    
    .string(['host', 'path', 'logLevel', 'baseUrl', 'specs', 'testcases', 'specFiles', 'testcaseFiles', 'listFiles'
     /*, 'user', 'key', 'screenshotPath', 'framework', 'reporters', 'suite', 'spec' */])
    .boolean(['coloredLogs', 'watch'])
    .default({ coloredLogs: true })

    .check((arg) => {
        if (arg._.length > 1 && arg._[0] !== 'repl') {
            throw new Error('Error: more than one config file specified')
        }
    })


if (process.argv.length === 2 || process.argv.length > 2 && process.argv[2].substr(0,1) === '-') {
    configFile = './workflo.conf.js'
    optionsOffset = 1 // no config file specified
}

let argv = optimist.parse(process.argv.slice(optionsOffset))

if (argv.help) {
    optimist.showHelp()
    process.exit(0)
}

if (argv.version) {
    console.log(`v${VERSION}`)
    process.exit(0)
}

/**
 * use wdio.conf.js default file name if no config was specified
 * otherwise run config sequenz
 */
if (typeof configFile === 'undefined') {
    configFile = argv._[0]
}

/**
 * sanitize jasmineOpts
 */
if (argv.jasmineOpts && argv.jasmineOpts.defaultTimeoutInterval) {
    argv.jasmineOpts.defaultTimeoutInterval = parseInt(argv.jasmineOpts.defaultTimeoutInterval, 10)
}

// cli config file defined workflo config, wdio config is placed in config/wdio.conf.js
const wdioConfigFile = path.join(__dirname, '..', '..', 'config', 'wdio.conf.js')
const workfloConfigFile = path.join(process.cwd(), configFile)

if (!fs.existsSync(workfloConfigFile)) {
    console.error(`Workflo config file was not specified or could not be found in its default location (<<current working directory>>/workflo.conf.js)\n`)
    optimist.showHelp()
    process.exit(1)
}

process.env.WORKFLO_CONFIG = workfloConfigFile

const workfloConfig = require(workfloConfigFile)

// check workflo config properties
const mandatoryProperties = ['testDir', 'baseUrl', 'specFiles', 'testcaseFiles', 'manualTestcaseFiles', 'uidStorePath']

for(const property of mandatoryProperties) {
    if (!(property in workfloConfig)) {
        throw new Error(`Property '${property}' must be defined in workflo config file!`)
    }
}

const testDir = workfloConfig.testDir

// complete cli specFiles paths
if (argv.specFiles) {
    const specsDir = path.join(testDir, 'src', 'specs')
    const specFiles: string[] = JSON.parse(argv.specFiles)

    argv.specFiles = JSON.stringify(specFiles.map(specFile => path.join(specsDir, `${specFile}.spec.ts`)))
}

// complete cli testcaseFiles paths
if (argv.testcaseFiles) {
    const testcasesDir = path.join(testDir, 'src', 'testcases')
    const testcaseFiles: string[] = JSON.parse(argv.testcaseFiles)
    
    argv.testcaseFiles = JSON.stringify(testcaseFiles.map(testcaseFile => path.join(testcasesDir, `${testcaseFile}.tc.ts`)))
}

// complete cli listFiles paths
if (argv.listFiles) {
    const listsDir = path.join(testDir, 'src', 'lists')
    const listFiles: string[] = JSON.parse(argv.listFiles)
    
    argv.listFiles = JSON.stringify(listFiles.map(listFile => path.join(listsDir, `${listFile}.list.ts`)))
}

const specsDir = path.join(testDir, 'src', 'specs')
const testcasesDir = path.join(testDir, 'src', 'testcases')

let specParseResults: SpecParseResults
let testcaseParseResults: TestcaseParseResults

const specFiles = determineSpecFiles()
const testcaseFiles = determineTestcaseFiles()

let specFilesObj: Record<string, true> = {}
let testcaseFilesObj: Record<string, true> = {}

let specs: string[]
let testcases: string[]
let features: string[]

// parse specs and testcases
if (argv.specs || argv.testcases || argv.specFiles || argv.testcaseFiles || argv.features) {
    specParseResults = specFilesParse(specFiles)
    testcaseParseResults = testcaseFilesParse(testcaseFiles)

    specFiles.forEach(specFile => specFilesObj[specFile] = true)
    testcaseFiles.forEach(testcaseFile => testcaseFilesObj[testcaseFile] = true)
}

if (argv.specs) {
    specs = JSON.parse(argv.specs)
    const filteredSpecFilesObj: Record<string, true> = {}

    for (const spec of specs) {
        getSpecMatchFiles(spec, specParseResults.specTable).forEach(file => filteredSpecFilesObj[file] = true)
    }

    for (const specFile in specFilesObj) {
        if (!(specFile in filteredSpecFilesObj)) {
            delete specFilesObj[specFile]
        }
    }
}

if (argv.testcases) {
    testcases = JSON.parse(argv.testcases)
    const filteredTestcaseFilesObj: Record<string, true> = {}

    for (const testcase of testcases) {
        getTestcaseMatchFiles(testcase, testcaseParseResults.testcaseTable).forEach(file => filteredTestcaseFilesObj[file] = true)
    }

    // only execute spec files that include filtered options
    for (const testcaseFile in testcaseFilesObj) {
        if (!(testcaseFile in filteredTestcaseFilesObj)) {
            delete testcaseFilesObj[testcaseFile]
        }
    }
}

if (argv.features) {
    features = JSON.parse(argv.features)
    const filteredFeaturesObj: Record<string, true> = {}

    for (const feature of features) {
        if (feature in specParseResults.featureTable) {
            for (const specFile of specParseResults.featureTable[feature].specFiles) {
                filteredFeaturesObj[specFile] = true
            }            
        }
    }

    for (const specFile in specFilesObj) {
        if (!(specFile in filteredFeaturesObj)) {
            delete specFilesObj[specFile]
        }
    }
}

// filter spec files based on those specs verified by testcases if no spec filters were supplied
if ((argv.testcaseFiles || argv.testcases) && !argv.spec && !argv.specFiles && !argv.features) {
    const verifiedSpecs: Record<string, true> = {}
    const verifiedSpecFiles: Record<string, true> = {}

    if (argv.testcases) {
        // add all spec ids verified in given testcases
        for (const testcase of testcases) {
            let matchSuite = testcase
            const testcaseParts = testcase.split('.')
            
            if (testcaseParts.length > 0) {
                matchSuite = testcaseParts[0]
            }
            
            if (matchSuite in testcaseParseResults.tree) {
                for (const testcaseId in testcaseParseResults.tree[matchSuite].testcaseHash) {
                    for (const verifiedSpec in testcaseParseResults.tree[matchSuite].testcaseHash[testcaseId].specVerifyHash) {
                        verifiedSpecs[verifiedSpec] = true
                    }
                }
            }
        }
    } else {
        // only testcaseFiles were given
        // these have already been considered in testcaseParseResults
        for (const testcase in testcaseParseResults.tree) {
            for (const testcaseId in testcaseParseResults.tree[testcase].testcaseHash) {
                for (const verifiedSpec in testcaseParseResults.tree[testcase].testcaseHash[testcaseId].specVerifyHash) {
                    verifiedSpecs[verifiedSpec] = true
                }
            }
        }
    }

    // for all verified specs, add the corresponding specFiles...
    for (const verifiedSpec in verifiedSpecs) {
        verifiedSpecFiles[specParseResults.specTable[verifiedSpec].specFile] = true
    }

    // removed specFiles not verified by filtered testcases
    for (const specFile in specFilesObj) {
        if (!(specFile in verifiedSpecFiles)) {
            delete specFilesObj[specFile]
        }
    }

    // add specs as spec filter...
    argv.specs = JSON.stringify(Object.keys(verifiedSpecs))
}

// filter spec files based on those specs verified by testcases if no spec filters were supplied
if ((argv.specFiles || argv.features || argv.specs) && !argv.testcases && !argv.testcaseFiles) {
    const verifiedSpecSpecs: Record<string, true> = {}
    const verifiedFeatureSpecs: Record<string, true> = {}
    let verifiedSpecs: Record<string, true> = {}
    const verifiedTestcases: Record<string, true> = {}
    const verifiedTestcaseFiles: Record<string, true> = {}

    if (argv.specFiles && !argv.specs && !argv.features) {
        // only specFiles were given
        // these have already been considered in specParseResults
        for (const spec in specParseResults.specTable) {
            verifiedSpecs[spec] = true
        }
    } else {
        if (argv.specs) {
            for (const spec of specs) {
                verifiedSpecSpecs[spec] = true
            }
        }
    
        if (argv.features) {
            for (const feature of features) {
                if (feature in specParseResults.specTree) {
                    for (const featureId in specParseResults.specTree[feature].specHash) {
                        for (const verifiedSpec in specParseResults.specTree[feature].specHash) {
                            verifiedFeatureSpecs[verifiedSpec] = true
                        }
                    }
                }
            }
        }
    
        if (argv.specs && !argv.features) {
            verifiedSpecs = verifiedSpecSpecs
        } else if (argv.features && !argv.specs) {
            verifiedSpecs = verifiedFeatureSpecs
        } else if (argv.features && argv.specs) {
            for (const featureSpec in verifiedFeatureSpecs) {
                if (featureSpec in verifiedSpecSpecs) {
                    verifiedSpecs[featureSpec] = true
                }
            }
        }
    }

    // get all testcase files that verify the extracted specs
    for (const verifiedSpec in verifiedSpecs) {
        if (verifiedSpec in testcaseParseResults.verifyTable) {
            for (const testcaseId in testcaseParseResults.verifyTable[verifiedSpec]) {
                verifiedTestcases[testcaseId] = true
                verifiedTestcaseFiles[testcaseParseResults.testcaseTable[testcaseId].testcaseFile] = true
            }
        }
    }

    // removed testcase files not verified by filtered specs
    for (const testcaseFile in testcaseFilesObj) {
        if (!(testcaseFile in verifiedTestcaseFiles)) {
            delete testcaseFilesObj[testcaseFile]
        }
    }

    // add testcases as testcases filter...
    argv.testcases = JSON.stringify(Object.keys(verifiedTestcases))
}

// only execute spec files that include filtered options
argv.specFiles = JSON.stringify(Object.keys(specFilesObj))
argv.testcaseFiles = JSON.stringify(Object.keys(testcaseFilesObj))

let args = {}
for (let key of ALLOWED_ARGV) {
    if (argv[key] !== undefined) {
        args[key] = argv[key]
    }
}

/**
 * run launch sequence
 */
let launcher = new Launcher(wdioConfigFile, args)
launcher.run().then(
    (code) => process.exit(code),
    (e) => process.nextTick(() => {
        throw e
    }))


function determineSpecFiles(): string[] {
    if (argv.specFiles) {
        if (argv.specFiles.length > 0) {
            const specFiles: string[] = JSON.parse(argv.specFiles)
            return specFiles
        } else {
            return []
        }
    } else {
        return getAllFiles(specsDir, '.spec.ts')                
    }
}

function determineTestcaseFiles(): string[] {
    if (argv.testcaseFiles) {
        if (argv.testcaseFiles.length > 0) {
            const testcaseFiles: string[] = JSON.parse(argv.testcaseFiles)
            return testcaseFiles
        } else {
            return []
        }
    } else {
        return getAllFiles(testcasesDir, '.tc.ts')                
    }
}

function getSpecMatchFiles(spec: string, table: Record<string, SpecTableEntry>): string[] {
    if (spec.substr(0,1) === '-') {
        return []
    } else if (spec in table) {
        return [table[spec].specFile]
    } else if (spec.substr(spec.length - 1, 1) === '*') {
        const matchStr = spec.substr(0, spec.length - 1)
        const matchFilesObj = {}

        for (const specEntry in table) {
            if (specEntry.length >= matchStr.length && specEntry.substr(0, matchStr.length) === matchStr) {
                matchFilesObj[table[specEntry].specFile] = true
            }
        }

        return Object.keys(matchFilesObj)
    } 

    return []
}

function getTestcaseMatchFiles(testcase: string, table: Record<string, TestcaseTableEntry>): string[] {
    if (testcase.substr(0,1) === '-') {
        return []
    } else {
        const matchFilesObj = {}

        for (const testcaseEntry in table) {
            if (testcaseEntry.substr(0, testcase.length) === testcase) {
                matchFilesObj[table[testcaseEntry].testcaseFile] = true
            }
        }

        return Object.keys(matchFilesObj)
    } 
}