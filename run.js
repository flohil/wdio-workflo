console.log(__dirname)

require('babel-register')

const testCaseRegistration = require('./setup/registerTestcases.js')
const stepRegistration = require('./setup/registerSteps.js')

console.log(testCaseRegistration)

testCaseRegistration.default({"../spec/system_tests/test_cases/test/example.tc.js": true}, "../spec/system_tests/test_cases/test", "../spec/system_tests/tmp")
//stepRegistration.registerSteps("test/spec/system_tests/tmp/steps", "test/spec/system_tests/tmp/steps")