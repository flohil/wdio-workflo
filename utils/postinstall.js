const path = require('path')
const fsExtra = require('fs-extra')
const fs = require('fs')

const sourcePath = path.join(__dirname, '..', 'templates', 'config', 'workflo.conf.ts')
const targetPath = path.join(__dirname, '..', '..', '..', 'workflo.conf.ts')

if (!fs.existsSync(targetPath)) {
  fsExtra.copySync(sourcePath, targetPath)

  console.log("\nCreated config file workflo.conf.ts in " + targetPath + '\n')
} else {
  console.log("\nConfig file workflo.conf.ts already exists in " + targetPath + '\n')
}