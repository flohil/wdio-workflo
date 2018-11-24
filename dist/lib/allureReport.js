"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const allure = require('allure-commandline');
function ensureRunPath(run) {
    let latestRun;
    if (fs.existsSync(process.env.WDIO_WORKFLO_LATEST_RUN_PATH)) {
        latestRun = fs.readFileSync(process.env.WDIO_WORKFLO_LATEST_RUN_PATH, 'utf8');
    }
    run = run || latestRun;
    const runPath = path.join(process.env.WDIO_WORKFLO_RESULTS_PATH, run);
    if (!fs.existsSync(runPath)) {
        throw new Error(`Could not find folder ${runPath} for generating or opening allure report`);
    }
    return runPath;
}
function ensureExecutable() {
    const allureCliPath = require.resolve('allure-commandline');
    const allureBinPath = path.resolve(allureCliPath, '../', 'dist/bin');
    try {
        fs.chmodSync(path.join(allureBinPath, 'allure'), 0o755);
    }
    finally { }
    try {
        fs.chmodSync(path.join(allureBinPath, 'allure.bat'), 0o755);
    }
    finally { }
}
function generateReport(workfloConf, run) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const runPath = ensureRunPath(run);
        ensureExecutable();
        try {
            let allurePropertiesContents = [];
            if (workfloConf.allure.issueTrackerPattern) {
                allurePropertiesContents.push('allure.issues.tracker.pattern=' + workfloConf.allure.issueTrackerPattern);
            }
            if (workfloConf.allure.bugTrackerPattern) {
                allurePropertiesContents.push('allure.tests.management.pattern=' + workfloConf.allure.bugTrackerPattern);
            }
            fs.writeFileSync(path.join(runPath, 'allure-results', 'allure.properties'), allurePropertiesContents.join('\n'), { mode: 0o755 });
        }
        catch (err) {
            console.error('Writing allure.properties file failed: \n');
            console.error(err);
            process.exit(1);
        }
        // returns ChildProcess instance
        const generation = allure([
            'generate',
            path.join(runPath, 'allure-results'),
            '-o',
            path.join(runPath, 'allure-report'),
            '--clean'
        ]);
        generation.on('exit', function (exitCode) {
            console.log('Report generation finished with code:', exitCode);
            resolve(exitCode);
        });
    }));
}
exports.generateReport = generateReport;
function openReport(workfloConf, run) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const runPath = ensureRunPath(run);
        ensureExecutable();
        // returns ChildProcess instance
        const open = allure([
            'open',
            path.join(runPath, 'allure-report')
        ]);
        open.on('exit', function (exitCode) {
            console.log('Showing report for run:', runPath);
            resolve(exitCode);
        });
    }));
}
exports.openReport = openReport;
//# sourceMappingURL=allureReport.js.map