const path = require('path')
const fsExtra = require('fs-extra')
const fs = require('fs')

const sourcePath = path.join(__dirname, '..', 'templates', 'config', 'workflo.conf.ts')
const targetPath = path.join(__dirname, '..', '..', '..', 'workflo.conf.ts')
const sourceTsPath = path.join(__dirname, '..', 'templates', 'config', 'tsconfig.workflo.json')
const targetTsPath = path.join(__dirname, '..', '..', '..', 'tsconfig.workflo.json')

if (!fs.existsSync(targetPath)) {
  fsExtra.copySync(sourcePath, targetPath)

  console.log("\nCreated config file workflo.conf.ts in " + targetPath)
} else {
  console.log("\nConfig file workflo.conf.ts already exists in " + targetPath)
}

if (!fs.existsSync(targetTsPath)) {
  fsExtra.copySync(sourceTsPath, targetTsPath)

  console.log("Created config file tsconfig.workflo.json in " + targetTsPath + '\n')
} else {
  console.log("Config file tsconfig.workflo.json already exists in " + targetTsPath + '\n')
}