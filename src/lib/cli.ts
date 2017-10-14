require('ts-node/register')
require('tsconfig-paths/register')

import * as path from 'path'
import * as fs from 'fs'
import * as ejs from 'ejs' 
import * as jsonfile from 'jsonfile'

import {specFilesParse, SpecTableEntry, testcaseFilesParse, TestcaseTableEntry, SpecParseResults, TestcaseParseResults} from './parser'
import {getAllFiles} from './io'
import {generateReport, openReport} from './allureReport'

import * as npmInstallPackage from 'npm-install-package'
import * as inquirer from 'inquirer'
import * as optimist from 'optimist'
import * as merge from 'deepmerge'

import { objectFunctions, arrayFunctions } from '../'

import { Launcher } from 'webdriverio-workflo'

const table = require('text-table')
const pkg = require('../../package.json')

const VERSION = pkg.version

const ALLOWED_ARGV = [
    'host', 'port',  'logLevel', 'coloredLogs', 'baseUrl', 'waitforTimeout', 
    'connectionRetryTimeout', 'connectionRetryCount', 'testInfoFilePath',
    'workfloOpts'
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

    .describe('info', 'shows static information about testcases and specs')

    .describe('testcases', 'restricts test execution to these testcases\n' +
        '\t\t\t\'["Suite1", "Suite2.Testcase1"]\' => execute all testcases of Suite1 and Testcase1 of Suite2\n' +
        '\t\t\t\'["Suite2", "-Suite2.Testcase2"]\' => execute all testcases of Suite2 except for Testcase2\n')
    .describe('features', 'restricts test execution to these features\n' +
        '\t\t\t\'["Login", "Logout"]\' => execute all testcases which verify specs defined within these features\n' +
        '\t\t\t\'["-Login"]\' => execute all testcases except those which verify specs defined within these features\n')
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

    .describe('generateReport', 'generates report for latest results or\n' +
    '\t\t\t\'2017-10-10_20-38-13\' => generate report for given result folder\n')
    .describe('openReport', 'opens report generated latest results or\n' +
    '\t\t\t\'2017-10-10_20-38-13\' => open report for given result folder\n')
    .describe('report', 'generates and opens report for latest results or\n' +
    '\t\t\t\'2017-10-10_20-38-13\' => generate and open report for given result folder\n')

    .describe('traceSpec', 'show spec file defining and all testcases, testcase files and manual result files verifying this spec\n' +
    '\t\t\t\'4.1\' => show traceability information for spec 4.1\n')
    .describe('traceTestcase', 'show testcase file defining and all specs and spec files verified by this testcase\n' +
    '\t\t\t\'Suite1.testcase1\' => show traceability information for testcase1 in Suite1\n')

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
 * otherwise run config sequence
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

checkGenerateReport().then(() => {
    // check workflo config properties
    const mandatoryProperties = ['testDir', 'baseUrl', 'specFiles', 'testcaseFiles', 'manualResultFiles', 'uidStorePath']

    for(const property of mandatoryProperties) {
        if (!(property in workfloConfig)) {
            throw new Error(`Property '${property}' must be defined in workflo config file!`)
        }
    }

    if (typeof workfloConfig.testDir === 'undefined') {
        throw new Error(`Please specify option 'testDir' in workflo.conf.js file!`)
    }

    const testDir = workfloConfig.testDir
    const specsDir = path.join(testDir, 'src', 'specs')
    const testcasesDir = path.join(testDir, 'src', 'testcases')
    const listsDir = path.join(testDir, 'src', 'lists')
    const manDir = path.join(testDir, 'src', 'manualResults')
    const testInfoFilePath = path.join(testDir, 'testinfo.json')

    interface ExecutionFilters {
        specFiles?: Record<string, true>
        testcaseFiles?: Record<string, true>
        manualResultFiles?: Record<string, true>
        specs?: Record<string, true>
        features?: Record<string, true>
        testcases?: Record<string, true>
        suites?: Record<string, true>
        manualSpecs?: Record<string, true>
    }

    const filters: ExecutionFilters = {}
    const mergedFilters: ExecutionFilters = {}
    const mergeKeys = ['features', 'specs', 'testcases', 'specFiles', 'testcaseFiles']

    interface TestcaseTraceInfo {
        testcase: string,
        testcaseFile: string
        specs: string[]
    }

    interface SpecTraceInfo {
        spec: string,
        specFile: string,
        testcaseCriteriaStrs: string[],
        manualCriteria: string[],
        manualCriteriaStr: string
    }

    interface TraceInfo {
        testcases: Record<string, TestcaseTraceInfo>
        specs: Record<string, SpecTraceInfo>
    }

    // merge non-file cli filters
    mergeKeys.forEach(key => mergeIntoFilters(key, argv, mergedFilters))

    // merge filters defined in cli lists and sublists
    if (argv.listFiles) {
        mergeLists({
            listFiles: JSON.parse(argv.listFiles)
        }, mergedFilters)    
    }

    // complete cli specFiles and testcaseFiles paths
    completeFilePaths(mergedFilters)

    // if no cli params were defined, merge in all spec and testcase files...
    completeSpecFiles(argv, mergedFilters)
    completeTestcaseFiles(argv, mergedFilters)

    const parseResults: {
        specs: SpecParseResults
        testcases: TestcaseParseResults
    } = {
        specs: specFilesParse(Object.keys(mergedFilters.specFiles)),
        testcases: testcaseFilesParse(Object.keys(mergedFilters.testcaseFiles))
    }

    // check if all defined filters exist
    checkFiltersExist()

    // add manual test cases to test information
    const manualResults = importManualResults()
    
    // trace argv handling
    if (handleTracingArgs()) {
        process.exit(0)       
    }

    // filters contains all filter criteria that is actually executed
    // and will be filtered further
    filters.specFiles = mergedFilters.specFiles
    filters.testcaseFiles = mergedFilters.testcaseFiles

    // get all features and specs in specFiles
    for (const specFile in filters.specFiles) {
        filters.features = merge(parseResults.specs.specFileTable[specFile].features, filters.features || {})
        filters.specs = merge(parseResults.specs.specFileTable[specFile].specs, filters.specs || {})
    }

    // get all testcases in testcaseFiles
    for (const testcaseFile in filters.testcaseFiles) {
        filters.testcases = merge(parseResults.testcases.testcaseFileTable[testcaseFile].testcases, filters.testcases || {})
    }

    // remove specs not matched by specs filter
    filterSpecsBySpecs()

    // remove specs not matched by features filter
    filterSpecsByFeatures()

    // remove testcases not matched by testcases filter
    filterTestcasesByTestcases()

    // remove specs not matched by verifies in testcases or manual results
    filterSpecsByTestcases()

    // remove testcases that do not verify filtered specs
    filterTestcasesBySpecs()

    // remove features not matched by specs
    filterFeaturesBySpecs()

    // build suites based on testcases
    addSuites()

    // remove specFiles not matched by filtered specs
    filterSpecFilesBySpecs()

    // remove testcaseFiles not matched by filtered testcases
    filterTestcaseFilesByTestcases()

    // add manual specs based on manual result files
    addManualResultFilesAndSpecs()

    const criteriaAnalysis = analyseCriteria()

    const automatedCriteriaRate = (criteriaAnalysis.allCriteriaCount > 0) ? criteriaAnalysis.automatedCriteriaCount / criteriaAnalysis.allCriteriaCount : 0
    const manualCriteriaRate = (criteriaAnalysis.allCriteriaCount > 0) ? criteriaAnalysis.manualCriteriaCount / criteriaAnalysis.allCriteriaCount : 0
    const uncoveredCriteriaRate = (criteriaAnalysis.allCriteriaCount > 0) ? criteriaAnalysis.uncoveredCriteriaCount / criteriaAnalysis.allCriteriaCount : 0

    type CountInfo = {count: number, percentage: string}

    const infoObject: {
        specFiles: number
        testcaseFiles: number
        manualResultFiles: number
        features: number
        specs: number
        suites: number
        testcases: number
        manualResults: number
        allCriteriaCount: CountInfo
        automatedCriteria: CountInfo
        manualCriteria: CountInfo
        uncoveredCriteria: CountInfo
        uncoveredCriteriaObject: Record<string, string[]>
    } = {
        specFiles: Object.keys(filters.specFiles).length,
        testcaseFiles: Object.keys(filters.testcaseFiles).length,
        manualResultFiles: Object.keys(filters.manualResultFiles).length,
        features: Object.keys(filters.features).length,
        specs: Object.keys(filters.specs).length,
        suites: Object.keys(getSuites()).length,
        testcases: Object.keys(filters.testcases).length,
        manualResults: Object.keys(filters.manualSpecs).length,
        allCriteriaCount: {
            count: criteriaAnalysis.allCriteriaCount,
            percentage: `(${(criteriaAnalysis.allCriteriaCount > 0) ? 100 : 0}%)`
        },
        automatedCriteria: {
            count: criteriaAnalysis.automatedCriteriaCount,
            percentage: `(~${automatedCriteriaRate.toLocaleString("en", {style: "percent"})})`
        },
        manualCriteria: {
            count: criteriaAnalysis.manualCriteriaCount,
            percentage: `(~${manualCriteriaRate.toLocaleString("en", {style: "percent"})})`
        },
        uncoveredCriteria: {
            count: criteriaAnalysis.uncoveredCriteriaCount,
            percentage: `(~${uncoveredCriteriaRate.toLocaleString("en", {style: "percent"})})`
        },
        uncoveredCriteriaObject: {}
    }

    if (criteriaAnalysis.uncoveredCriteriaCount > 0) {
        for (const spec in criteriaAnalysis.specs) {
            const uncoveredCriteria = Object.keys(criteriaAnalysis.specs[spec].uncovered)
            if (uncoveredCriteria.length > 0) {
                infoObject.uncoveredCriteriaObject[spec] = uncoveredCriteria
            }
        }
    }

    const translations = {
        specFiles: 'Spec Files',
        testcaseFiles: 'Testcase Files',
        manualResultFiles: 'Manual Result Files',
        features: 'Features',
        specs: 'Specs',
        suites: 'Suites',
        testcases: 'Testcases',
        manualResults: 'Manual Results (Specs)',
        allCriteriaCount: 'Defined Spec Criteria',
        automatedCriteria: 'Automated Criteria',
        manualCriteria: 'Manual Criteria',
        uncoveredCriteria: 'Uncovered Criteria',
        uncoveredCriteriaObject: 'Uncovered Criteria Object'
    }

    const invertedTranslations = objectFunctions.invert(translations)
    const printObject = objectFunctions.mapProperties(invertedTranslations, value => infoObject[value])

    if (argv.info) {
        function toTable(key) {
            return [key, printObject[key], '']
        }

        function toPercentTable(key) {
            return [key, (<CountInfo> printObject[key]).count, (<CountInfo> printObject[key]).percentage]
        }

        const infoTable = table([
            ['FILTER FILES:', '', ''],
            toTable(translations.testcaseFiles),
            toTable(translations.specFiles), 
            toTable(translations.manualResultFiles),
            ['', '', ''],
            ['FILTERS:', '', ''],
            toTable(translations.suites),
            toTable(translations.testcases),
            toTable(translations.features),
            toTable(translations.specs),
            toTable(translations.manualResults),
            ['', '', ''],
            ['CRITERIA COUNT:', '', ''],
            toPercentTable(translations.automatedCriteria),
            toPercentTable(translations.manualCriteria),
            toPercentTable(translations.uncoveredCriteria),
            toPercentTable(translations.allCriteriaCount)
        ], { align: [ 'l', 'r', 'r' ] })

        console.log('\n' + infoTable + '\n')

        if (Object.keys(infoObject.uncoveredCriteriaObject).length > 0) {
            console.log('UNCOVERED CRITERIA:')

            let uncoveredTableRows = []

            for (const spec in infoObject.uncoveredCriteriaObject) {
                uncoveredTableRows.push([`${spec}:`, `[${infoObject.uncoveredCriteriaObject[spec].join(', ')}]`])
            }

            const uncoveredTable = table(uncoveredTableRows, { align: [ 'l', 'l' ] })

            console.log(uncoveredTable)
        }

        process.exit(0)
    }

    if (fs.existsSync(testInfoFilePath)) {
        fs.unlinkSync(testInfoFilePath)
    }

    const testinfo = {
        executionFilters: filters,
        parseResults: parseResults,
        traceInfo: buildTraceInfo(),
        printObject: printObject,
        uidStorePath: workfloConfig.uidStorePath,
        allure: workfloConfig.allure
    }

    jsonfile.writeFileSync(testInfoFilePath, testinfo)

    argv.testInfoFilePath = testInfoFilePath

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

    function mergeIntoFilters(key: string, argv: any, _filters: ExecutionFilters) {
        _filters[key] = {}
        
        if (argv[key]) {
            const filterArray: string[] = JSON.parse(argv[key])

            filterArray.forEach(value => _filters[key][value] = true)
        }
    }

    function checkFiltersExist() {
        for (const testcase in mergedFilters.testcases) {
            let matchStr = testcase
            
            if (matchStr.substr(0,1) === '-') {
                matchStr = matchStr.substr(1, matchStr.length - 1)
            }

            if (!(matchStr in parseResults.testcases.testcaseTable) && !(matchStr in parseResults.testcases.tree)) {
                throw new Error(`Testcase '${testcase}' did not match any defined testcase or suite!`)
            }
        }

        for (const spec in mergedFilters.specs) {
            let matchStr = spec
            
            if (matchStr.substr(0,1) === '-') {
                matchStr = matchStr.substr(1, matchStr.length - 1)
            }

            if (!(matchStr in parseResults.specs.specTable)) {
                if (matchStr.substr(matchStr.length - 1, 1) === '*') {
                    matchStr = matchStr.substr(0, matchStr.length - 1)
                }
    
                let found = false
    
                for (const _spec in parseResults.specs.specTable) {
                    if (_spec.length >= matchStr.length && _spec.substr(0, matchStr.length) === matchStr) {
                        found = true
                    }
                }
    
                if (!found) {
                    throw new Error(`Spec '${spec}' did not match any defined spec!`)
                }   
            }
        }

        for (const feature in mergedFilters.features) {
            let matchStr = feature
            
            if (matchStr.substr(0,1) === '-') {
                matchStr = matchStr.substr(1, matchStr.length - 1)
            }

            if (!(matchStr in parseResults.specs.featureTable)) {
                throw new Error(`Feature '${feature}' did not match any defined feature!`)
            }
        }
    }

    // if no spec files are present in filters, use all spec files in specs folder
    function completeSpecFiles(argv: any, _filters: ExecutionFilters): void {
        // if user manually defined an empty specFiles array, do not add specFiles from folder
        if (Object.keys(_filters.specFiles).length === 0 && !argv.specFiles) {
            getAllFiles(specsDir, '.spec.ts').forEach(specFile => _filters.specFiles[specFile] = true)
        } else {
            let removeOnly = true
            const removeSpecFiles: Record<string, true> = {}

            for (const specFile in _filters.specFiles) {
                let remove = false
                let matchStr = specFile
                
                if (specFile.substr(0,1) === '-') {
                    remove = true
                    matchStr = specFile.substr(1, specFile.length - 1)
                } else {
                    removeOnly = false
                }

                if (remove) {
                    delete _filters.specFiles[specFile]
                    removeSpecFiles[matchStr] = true
                }
            }

            if (removeOnly) {
                getAllFiles(specsDir, '.spec.ts')
                .filter(specFile => !(specFile in removeSpecFiles))
                .forEach(specFile => _filters.specFiles[specFile] = true)
            }
        }
    }

    // if no testcase files are present in filters, use all testcase files in testcase folder
    function completeTestcaseFiles(argv: any, _filters: ExecutionFilters): void {
        // if user manually defined an empty testcaseFiles array, do not add testcaseFiles from folder
        if (Object.keys(_filters.testcaseFiles).length === 0 && !argv.testcaseFiles) {
            getAllFiles(testcasesDir, '.tc.ts').forEach(testcaseFile => _filters.testcaseFiles[testcaseFile] = true)
        } else {
            let removeOnly = true
            const removeTestcaseFiles: Record<string, true> = {}

            for (const testcaseFile in _filters.testcaseFiles) {
                let remove = false
                let matchStr = testcaseFile
                
                if (testcaseFile.substr(0,1) === '-') {
                    remove = true
                    matchStr = testcaseFile.substr(1, testcaseFile.length - 1)
                } else {
                    removeOnly = false
                }

                if (remove) {
                    delete _filters.testcaseFiles[testcaseFile]
                    removeTestcaseFiles[matchStr] = true
                }
            }

            if (removeOnly) {
                getAllFiles(testcasesDir, '.tc.ts')
                .filter(testcaseFile => !(testcaseFile in removeTestcaseFiles))
                .forEach(testcaseFile => _filters.testcaseFiles[testcaseFile] = true)
            }
        }
    }

    function completeFilePaths(_filters: ExecutionFilters) {
        const specFilePaths: Record<string, true> = {}
        const testcaseFilePaths: Record<string, true> = {}
        
        for (const specFile in _filters.specFiles) {
            let matchStr = specFile
            let prefix = ''
            
            if (specFile.substr(0,1) === '-') {
                matchStr = specFile.substr(1, specFile.length - 1)
                prefix = '-'
            }

            const specFilePath = path.join(`${prefix}${specsDir}`, `${matchStr}.spec.ts`)
            specFilePaths[specFilePath] = true
        }
        
        for (const testcaseFile in _filters.testcaseFiles) {
            let matchStr = testcaseFile
            let prefix = ''
            
            if (testcaseFile.substr(0,1) === '-') {
                matchStr = testcaseFile.substr(1, testcaseFile.length - 1)
                prefix = '-'
            }

            const testcaseFilePath = path.join(`${prefix}${testcasesDir}`, `${matchStr}.tc.ts`)
            testcaseFilePaths[testcaseFilePath] = true
        }
        
        _filters.specFiles = specFilePaths
        _filters.testcaseFiles = testcaseFilePaths
    }

    /**
     * Loads all specFiles, testcaseFiles, features, specs and testcases defined in lists and sublists of argv.listFiles
     * @param argv 
     */
    function mergeLists(list: Workflo.FilterList, _filters: ExecutionFilters) {
        if (list.specFiles) {
            list.specFiles.forEach(value => _filters.specFiles[value] = true)
        }
        if (list.testcaseFiles) {
            list.testcaseFiles.forEach(value => _filters.testcaseFiles[value] = true)
        }
        if (list.features) {
            list.features.forEach(value => _filters.features[value] = true)
        }
        if (list.specs) {
            list.specs.forEach(value => _filters.specs[value] = true)
        }
        if (list.testcases) {
            list.testcases.forEach(value => _filters.testcases[value] = true)
        } 
        if (list.listFiles) {
            for (const listFile of list.listFiles) {
                // complete cli listFiles paths
                const listFilePath = path.join(listsDir, `${listFile}.list.ts`)

                if (!fs.existsSync(listFilePath)) {
                    throw new Error(`List file could not be found: ${listFilePath}`)
                } else {
                    const sublist: Workflo.FilterList = require(listFilePath).default
        
                    // recursively traverse sub list files
                    mergeLists(sublist, _filters)
                }
            }
        }
    }

    function filterSpecsBySpecs() {
        if (Object.keys(mergedFilters.specs).length > 0) {
            const filteredSpecs: Record<string, true> = {}
            const filteredFeatures: Record<string, true> = {}
            let removeOnly = true
            
            for (const spec in mergedFilters.specs) {
                let remove = false
                let matchStr = spec
        
                if (spec.substr(0,1) === '-') {
                    remove = true
                    matchStr = spec.substr(1, spec.length - 1)
                } else {
                    removeOnly = false
                }
                if (matchStr.substr(matchStr.length - 1, 1) === '*') {
                    matchStr = matchStr.substr(0, matchStr.length - 1)
            
                    for (const specEntry in parseResults.specs.specTable) {
                        if (specEntry.length >= matchStr.length && specEntry.substr(0, matchStr.length) === matchStr) {
                            if (remove) {
                                delete filters.specs[specEntry]
                            } else {
                                filteredSpecs[specEntry] = true
                            }
                        }
                    }        
                } else {
                    if (remove) {
                        delete filters.specs[matchStr]
                    } else {
                        filteredSpecs[matchStr] = true
                    }
                }           
            }
        
            if (!removeOnly) {
                for (const spec in filters.specs) {
                    if (!(spec in filteredSpecs)) {
                        delete filters.specs[spec]
                    }
                }
            }
        }
    }

    function filterSpecsByFeatures() {
        if (Object.keys(mergedFilters.features).length > 0) {
            const filteredSpecs: Record<string, true> = {}
            let removeOnly = true

            for (const feature in mergedFilters.features) {
                let remove = false
                let matchStr = feature
        
                if (feature.substr(0,1) === '-') {
                    remove = true
                    matchStr = feature.substr(1, feature.length - 1)
                } else {
                    removeOnly = false
                }

                if (matchStr in parseResults.specs.featureTable) {
                    for (const spec in parseResults.specs.featureTable[matchStr].specs) {
                        if (remove) {
                            delete filters.specs[spec]
                        } else {
                            filteredSpecs[spec] = true
                        }
                    }            
                }
            }

            // delete specs not matched by features
            if (!removeOnly) {
                for (const spec in filters.specs) {
                    if (!(spec in filteredSpecs)) {
                        delete filters.specs[spec]
                    }
                }
            }
        }
    }

    function filterTestcasesByTestcases() {
        if (Object.keys(mergedFilters.testcases).length > 0) {    
            const filteredTestcases: Record<string, true> = {}
            let removeOnly = true

            for (const testcase in mergedFilters.testcases) {
                let remove = false
                let matchStr = testcase

                if (testcase.substr(0,1) === '-') {
                    remove = true
                    matchStr = testcase.substr(1, testcase.length - 1)
                } else {
                    removeOnly = false
                }

                const testcaseParts = matchStr.split('.')
                let insideTable = false

                for (const testcaseEntry in parseResults.testcases.testcaseTable) {
                    const entryParts = testcaseEntry.split('.')
                    let match = true

                    for (let i = 0; i < testcaseParts.length; ++i) {
                        if (testcaseParts[i] !== entryParts[i]) {
                            match = false
                        }
                    }

                    if (match) {
                        insideTable = true
                        if (remove) {
                            delete filters.testcases[testcaseEntry];
                        }
                        else {
                            filteredTestcases[testcaseEntry] = true;
                        }
                    }
                }
                if (!insideTable) {
                    delete mergedFilters.testcases[testcase]
                    delete filters.testcases[testcase]
                }        
            }

            // only execute spec files that include filtered options
            if (!removeOnly) {
                for (const testcase in filters.testcases) {
                    if (!(testcase in filteredTestcases)) {
                        delete filters.testcases[testcase]
                    }
                }
            }
        }
    }

    function filterSpecsByTestcases() {
        if (Object.keys(mergedFilters.testcaseFiles).length > 0 && Object.keys(mergedFilters.testcases).length > 0) {
            const verifiedSpecs: Record<string, true> = {}

            // add all spec ids verified in given testcases
            for (const testcase in filters.testcases) {
                
                // testcase is a suite
                if (testcase in parseResults.testcases.tree) {
                    for (const testcaseId in parseResults.testcases.tree[testcase].testcaseHash) {
                        for (const verifiedSpec in parseResults.testcases.tree[testcase].testcaseHash[testcaseId].specVerifyHash) {
                            verifiedSpecs[verifiedSpec] = true
                        }
                    }
                } else { // testcase is a testcase
                    let matchSuite = testcase;
                    const testcaseParts = testcase.split('.')

                    // at least one suite followed by a testcase
                    if (testcaseParts.length > 1) {
                        testcaseParts.pop() // remove testcase
                        matchSuite = testcaseParts.join('.')

                        if (matchSuite in parseResults.testcases.tree) {
                            for (const verifiedSpec in parseResults.testcases.tree[matchSuite].testcaseHash[testcase].specVerifyHash) {
                                verifiedSpecs[verifiedSpec] = true
                            }
                        }
                    }
                }               
            }

            // remove specs not verified by filtered testcases or manual results
            for (const spec in filters.specs) {
                if (!(spec in verifiedSpecs)) {
                    delete filters.specs[spec]
                }
            }
        }
    }

    function filterTestcasesBySpecs() {
        const filteredTestcases: Record<string, true> = {}

        if (Object.keys(filters.specs).length > 0) {
            for (const spec in filters.specs) {
                for (const testcase in parseResults.specs.specTable[spec].testcases) {
                    filteredTestcases[testcase] = true
                }
            }

            for (const testcase in filters.testcases) {
                if (!(testcase in filteredTestcases)) {
                    delete filters.testcases[testcase]
                }
            }
        }
    }

    function filterFeaturesBySpecs() {
        const filteredFeatures: Record<string, true> = {}

        for (const spec in filters.specs) {
            filteredFeatures[parseResults.specs.specTable[spec].feature] = true
        }

        for (const feature in filters.features) {
            if (!(feature in filteredFeatures)) {
                delete filters.features[feature]
            }
        }
    }

    function filterSpecFilesBySpecs() {
        const filteredSpecFiles: Record<string, true> = {}

        for (const spec in filters.specs) {
            filteredSpecFiles[parseResults.specs.specTable[spec].specFile] = true
        }

        for (const specFile in filters.specFiles) {
            if (!(specFile in filteredSpecFiles)) {
                delete filters.specFiles[specFile]
            }
        }
    }

    function filterTestcaseFilesByTestcases() {
        const filteredTestcaseFiles: Record<string, true> = {}

        for (const testcase in filters.testcases) {
            filteredTestcaseFiles[parseResults.testcases.testcaseTable[testcase].testcaseFile] = true
        }

        for (const testcaseFile in filters.testcaseFiles) {
            if (!(testcaseFile in filteredTestcaseFiles)) {
                delete filters.testcaseFiles[testcaseFile]
            }
        }
    }

    function addSuites() {
        filters.suites = {}

        // add suites from testcases
        for (const testcase in filters.testcases) {
            filters.suites[parseResults.testcases.testcaseTable[testcase].suiteId] = true
        }

        // add parent suites
        for (const suite in filters.suites) {
            const suiteParts = suite.split('.')
            let str = ''

            // child suite is already included
            for (let i = 0; i < (suiteParts.length - 1); ++i) {
                if (suiteParts[i] !== '') {
                    let delim = '.'
                    if (str.length === 0) {
                        delim = ''
                    }
                    str += `${delim}${suiteParts[i]}`

                    filters.suites[str] = true
                }
            }
        }
    }

    interface IManualResultEntry {
        file: string
        criteria: Workflo.IManualCriteria
    }

    function importManualResults() {
        let mergedManualTestcases: Record<string, IManualResultEntry> = {}
        let fileTable: Record<string, Workflo.IManualTestcaseResults> = {}

        const manualTestcaseResults = getAllFiles(manDir, '.man.ts')

        for (const manualTestcaseFile of manualTestcaseResults) {
            const manualTestcase: Workflo.IManualTestcaseResults = require(manualTestcaseFile).default

            fileTable[manualTestcaseFile] = manualTestcase

            for (const spec in manualTestcase) {
                if (spec in mergedManualTestcases) {
                    throw new Error(`Manual results for spec '${spec}' were declared in both '${manualTestcaseFile}' and '${mergedManualTestcases[spec].file}'`)
                } else {
                    mergedManualTestcases[spec] = {
                        file: manualTestcaseFile,
                        criteria: manualTestcase[spec]
                    }
                }
            }
        }
        
        return {
            fileTable: fileTable,
            specTable: mergedManualTestcases
        }
    }

    interface IAnalysedSpec {
        automated: Record<string, true>
        manual: Record<string, true>
        uncovered: Record<string, true>
        undefined: boolean
    }

    function analyseCriteria() {
        const analysedCriteria: {
            specs: Record<string, IAnalysedSpec>
            allCriteriaCount: number,
            automatedCriteriaCount: number,
            manualCriteriaCount: number,
            uncoveredCriteriaCount: number,
        } = {
            specs: {},
            allCriteriaCount: 0,
            automatedCriteriaCount: 0,
            manualCriteriaCount: 0,
            uncoveredCriteriaCount: 0,
        }

        for (const spec in filters.specs) {
            analysedCriteria.specs[spec] = {
                automated: {},
                manual: {},
                uncovered: {},
                undefined: false
            }

            // spec was not defined in a spec file
            if (!(spec in parseResults.specs.specTable)) {
                analysedCriteria.specs[spec].undefined = true
            } else {
                for (const criteria in parseResults.specs.specTable[spec].criteria) {
                    let covered = false
        
                    if (spec in manualResults.specTable && criteria in manualResults.specTable[spec].criteria) {
                        covered = true
        
                        analysedCriteria.specs[spec].manual[criteria] = true
                        analysedCriteria.manualCriteriaCount++
                    }
                    if (spec in parseResults.testcases.verifyTable) {
                        let _autoCovered = false

                        for (const testcaseId in parseResults.testcases.verifyTable[spec]) {
                            const suite = parseResults.testcases.testcaseTable[testcaseId].suiteId

                            if (criteria in parseResults.testcases.tree[suite].testcaseHash[testcaseId].specVerifyHash[spec]) {
                                if (!_autoCovered) {
                                    analysedCriteria.automatedCriteriaCount++
                                }

                                _autoCovered = true

                                analysedCriteria.specs[spec].automated[criteria] = true
                            }
                        }

                        if (_autoCovered) {
                            if (covered) {
                                throw new Error(`Criteria ${criteria} of spec ${spec} must not be both verified automatically and tested manually!`)  
                            } else {
                                covered = true
                            }
                        }
                    }
                    if (!covered) {
                        analysedCriteria.specs[spec].uncovered[criteria] = true
                        analysedCriteria.uncoveredCriteriaCount++
                    }
                }
            }
        }

        analysedCriteria.allCriteriaCount = 
            analysedCriteria.automatedCriteriaCount + 
            analysedCriteria.manualCriteriaCount + 
            analysedCriteria.uncoveredCriteriaCount

        return analysedCriteria
    }

    function addManualResultFilesAndSpecs() {
        filters.manualResultFiles = {}
        filters.manualSpecs = {}

        for (const spec in filters.specs) {
            if (spec in manualResults.specTable) {
                filters.manualResultFiles[manualResults.specTable[spec].file] = true
                filters.manualSpecs[spec] = true
            }
        }
    }

    function getSuites() {
        const suites: Record<string, true> = {}

        for (const testcase in filters.testcases) {
            suites[parseResults.testcases.testcaseTable[testcase].suiteId] = true
        }

        return suites
    }

    function handleTracingArgs(): boolean {
        let traced = false
        
        if (argv.traceTestcase) {
            if (argv.traceTestcase in parseResults.testcases.testcaseTable) {
                const testcaseTraceInfo = buildTestcaseTraceInfo(argv.traceTestcase)
                printTestcaseTraceInfo(testcaseTraceInfo)
            }
            else 
            {
                console.warn(`\nTestcase '${argv.traceTestcase}' could not be found and traced!`)
            }

            traced = true
        }

        if (argv.traceSpec) {
            if (argv.traceSpec in parseResults.specs.specTable) {
                const specTraceInfo = buildSpecTraceInfo(argv.traceSpec)
                printSpecTraceInfo(specTraceInfo)
            }
            else 
            {
                console.warn(`\nSpec '${argv.traceSpec}' could not be found and traced!`)
            }

            traced = true
        }

        return traced
    }

    function buildTestcaseTraceInfo(testcase: string): TestcaseTraceInfo {
        const testcaseTableEntry = parseResults.testcases.testcaseTable[testcase]
        let testcaseFile = testcaseTableEntry.testcaseFile.replace(testcasesDir, '')
        testcaseFile = testcaseFile.substring(1, testcaseFile.length)
        const specHash = parseResults.testcases.tree[testcaseTableEntry.suiteId].testcaseHash[testcase].specVerifyHash
        const specFilesHash = (specHash) ? arrayFunctions.mapToObject(Object.keys(specHash).map(spec => parseResults.specs.specTable[spec].specFile), (spec) => true) : {}
        const specFiles = Object.keys(specFilesHash)
        const specs = (specHash) ? Object.keys(specHash).map(spec => {
            `${spec}: [${Object.keys(specHash[spec]).join(', ')}] ('${parseResults.specs.specTable[spec].specFile}')`

            let file = parseResults.specs.specTable[spec].specFile.replace(specsDir, '')
            file = file.substring(1, file.length)

            return `${spec}: [${Object.keys(specHash[spec]).join(', ')}] (${file})`
        }) : []

        return {
            testcase,
            testcaseFile,
            specs
        }
    }

    function buildSpecTraceInfo(spec: string): SpecTraceInfo {
        const specFile = parseResults.specs.specTable[spec].specFile
        const testcaseHash = parseResults.testcases.verifyTable[spec]
        const testcases = (testcaseHash) ? Object.keys(testcaseHash) : []
        const testcaseFileHash = (testcaseHash) ? arrayFunctions.mapToObject(testcases.map(testcase => parseResults.testcases.testcaseTable[testcase].testcaseFile), (testcase) => true) : {}
        const testcaseFiles = Object.keys(testcaseFileHash)
        let manualFile = (spec in manualResults.specTable) ? manualResults.specTable[spec].file.replace(manDir, '') : ''

        if (manualFile.length > 0) {
            manualFile = manualFile.substring(1, manualFile.length)
        }

        let testcaseCriteria: Record<string, string[]> = {}
        testcases.forEach(testcase => testcaseCriteria[testcase] = Object.keys(parseResults.testcases.tree[parseResults.testcases.testcaseTable[testcase].suiteId].testcaseHash[testcase].specVerifyHash[spec]))
        
        const testcaseCriteriaStrs: string[] = Object.keys(testcaseCriteria).map(testcase => {
            let file = parseResults.testcases.testcaseTable[testcase].testcaseFile.replace(testcasesDir, '')
            file = file.substring(1, file.length)

            return `${testcase}: [${testcaseCriteria[testcase].join(', ')}] (${file})`
        })
        
        const manualCriteria = (spec in manualResults.specTable) ? Object.keys(manualResults.specTable[spec].criteria) : []
        const manualCriteriaStr = (manualCriteria.length > 0) ? `[${manualCriteria.join(', ')}] (${manualFile})` : ''

        return {
            spec,
            specFile,
            testcaseCriteriaStrs,
            manualCriteria,
            manualCriteriaStr
        }
    }

    function buildTraceInfo(): TraceInfo {
        let traceInfo: TraceInfo = {
            specs: {},
            testcases: {}
        }

        for (const testcase in filters.testcases) {
            traceInfo.testcases[testcase] = buildTestcaseTraceInfo(testcase)
        }

        for (const spec in filters.specs) {
            traceInfo.specs[spec] = buildSpecTraceInfo(spec)
        }

        return traceInfo
    }

    function printTestcaseTraceInfo(testcaseTraceInfo: TestcaseTraceInfo) {
        const content: string[][] = []
        
        content.push(['Testcase File:', testcaseTraceInfo.testcaseFile])

        content.push(['Verifies Specs:', (testcaseTraceInfo.specs.length > 0) ? testcaseTraceInfo.specs.shift() : '[]'])
        testcaseTraceInfo.specs.forEach(spec => content.push(['', spec]))

        const traceTable = table(content, { align: [ 'l', 'l' ] })

        console.log(`\nTrace information for testcase '${testcaseTraceInfo.testcase}':`)
        console.log('\n' + traceTable)
    }

    function printSpecTraceInfo(specTraceInfo: SpecTraceInfo) {
        const content: string[][] = []
        
        content.push(['Spec File:', specTraceInfo.specFile])

        content.push(['Verified by Testcases:', (specTraceInfo.testcaseCriteriaStrs.length > 0) ? specTraceInfo.testcaseCriteriaStrs.shift() : '[]'])
        specTraceInfo.testcaseCriteriaStrs.forEach(testcaseCriteriaStr => content.push(['', testcaseCriteriaStr]))

        content.push(['Verified in Manual Results:', (specTraceInfo.manualCriteria.length > 0) ? specTraceInfo.manualCriteriaStr : '[]'])

        const traceTable = table(content, { align: [ 'l', 'l' ] })

        console.log(`\nTrace information for spec '${specTraceInfo.spec}':`)
        console.log('\n' + traceTable)
    }
}).catch((error) => console.error(error))

async function checkGenerateReport() {
    // generate and display reports
    if (argv.generateReport) {
        if (typeof argv.generateReport === 'boolean') {
            argv.generateReport = undefined
        }
        const exitCode = await generateReport(workfloConfig, argv.generateReport)
        process.exit(exitCode)
    }
    if (argv.openReport) {
        if (typeof argv.openReport === 'boolean') {
            argv.openReport = undefined
        }
        const exitCode = await openReport(workfloConfig, argv.openReport)
        process.exit(exitCode)
    }
    if (argv.report) {
        if (typeof argv.report === 'boolean') {
            argv.report = undefined
        }
        let exitCode = await generateReport(workfloConfig, argv.report)

        if (exitCode !== 0) {
            process.exit(exitCode)
        }

        exitCode = await openReport(workfloConfig, argv.report)
        process.exit(exitCode)
    }
}