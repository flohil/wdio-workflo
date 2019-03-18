const fs = require('fs');
const path = require('path');
const allure = require('allure-commandline');

function ensureRunPath(run?: string) {
  let latestRun;

  if (fs.existsSync(process.env.WDIO_WORKFLO_LATEST_RUN_PATH)) {
    latestRun = fs.readFileSync(process.env.WDIO_WORKFLO_LATEST_RUN_PATH, 'utf8');
  }

  run = run || latestRun;

  const runPath = path.join(process.env.WDIO_WORKFLO_RESULTS_PATH, run);

  if (!fs.existsSync(runPath)) {
    throw new Error(`Could not find folder ${runPath} for generating or opening allure report`);
  }

  if (runPath.indexOf(' ') > -1) {
    throw new Error(
`Allure command line cannot handle paths with spaces.
Please run your tests from a folder without spaces.
Run path: ${runPath}`,
    );
  }

  return runPath;
}

function ensureExecutable() {
  const allureCliPath = require.resolve('allure-commandline');
  const allureBinPath = path.resolve(allureCliPath, '../', 'dist/bin');

  try {
    fs.chmodSync(path.join(allureBinPath, 'allure'), 0o755);
  } finally {
    //
  }

  try {
    fs.chmodSync(path.join(allureBinPath, 'allure.bat'), 0o755);
  } finally {
    //
  }
}

export function generateReport(workfloConf: any, run?: string) {
  return new Promise<number>(async (resolve, reject) => {
    const runPath = ensureRunPath(run);

    ensureExecutable();

        // returns ChildProcess instance
    const generation = allure([
      'generate',
      path.join(runPath, 'allure-results'),
      '-o',
      path.join(runPath, 'allure-report'),
      '--clean']);

    generation.on('exit', (exitCode) => {
      console.log('Report generation finished with code:', exitCode);
      resolve(exitCode);
    });
  });
}

export function openReport(workfloConf: any, run?: string) {
  return new Promise<number>(async (resolve, reject) => {
    const runPath = ensureRunPath(run);

    ensureExecutable();

        // returns ChildProcess instance
    const open = allure([
      'open',
      path.join(runPath, 'allure-report'),
    ]);

    open.on('exit', (exitCode) => {
      console.log('Showing report for run:', runPath);
      resolve(exitCode);
    });
  });
}
