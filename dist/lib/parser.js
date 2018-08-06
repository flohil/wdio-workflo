"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const ts = require("typescript");
const JSON5 = require("json5");
// stores pos of callExpression and the function to be executed after this block
let afterFuncTable = {};
// used to determine, if a spec is to be executed for a feature or spec filter
const specTable = {};
// used to lookup spec information
const specTree = {};
const featureTable = {};
const specFileTable = {};
const specParserState = {
    callExpressionPos: -1,
    activeSpecFile: undefined,
    activeFeature: undefined,
    activeSpecId: undefined,
    argFuncs: [],
    addArgFunc: (argFunc) => {
        specParserState.argFuncs.push(argFunc);
    },
    executeNextArgFunc: (node) => {
        if (specParserState.argFuncs.length > 0) {
            const argFunc = specParserState.argFuncs.shift();
            argFunc(node);
        }
    }
};
function parseSpecFiles(sourceFile) {
    parseSpecNode(sourceFile);
    function parseSpecNode(node) {
        let nodePos = -1;
        specParserState.executeNextArgFunc(node);
        switch (node.kind) {
            case ts.SyntaxKind.CallExpression:
                nodePos = node.pos;
                specParserState.callExpressionPos = nodePos;
                break;
            case ts.SyntaxKind.Identifier:
                // ensure only functions and not varibables etc. are considered
                if (specParserState.callExpressionPos >= 0) {
                    const identifier = node;
                    const parentPos = specParserState.callExpressionPos;
                    specParserState.callExpressionPos = -1;
                    switch (identifier.text) {
                        case 'fFeature':
                        case 'xFeature':
                        case 'Feature':
                            specParserState.addArgFunc((node) => {
                                const featureId = node.text;
                                if (featureId.length === 0) {
                                    throw new Error(`Feature description must not be empty!`);
                                }
                                specParserState.activeFeature = featureId;
                                if (!(featureId in specTree)) {
                                    specTree[featureId] = {
                                        specHash: {}
                                    };
                                }
                                if (!(featureId in featureTable)) {
                                    featureTable[featureId] = {
                                        specFiles: {},
                                        specs: {}
                                    };
                                }
                                featureTable[featureId].specFiles[specParserState.activeSpecFile] = true;
                                specFileTable[specParserState.activeSpecFile].features[featureId] = true;
                            });
                            specParserState.addArgFunc((node) => {
                                const featureMetadata = node;
                                const str = sourceFile.text.substr(featureMetadata.pos, featureMetadata.end - featureMetadata.pos);
                                let parsedMetadata;
                                try {
                                    parsedMetadata = JSON5.parse(str);
                                }
                                catch (e) {
                                    console.error(`Failed to parse feature metadata. Please do not use dynamic values inside feature metadata: ${parsedMetadata}\n`);
                                    throw e;
                                }
                                specTree[specParserState.activeFeature].metadata = parsedMetadata;
                            });
                            afterFuncTable[parentPos] = () => { specParserState.activeFeature = undefined; };
                            break;
                        case 'fStory':
                        case 'xStory':
                        case 'Story':
                            specParserState.addArgFunc((node) => {
                                const specId = node.text;
                                if (specId.length === 0) {
                                    throw new Error(`Story id must not be empty!`);
                                }
                                specParserState.activeSpecId = specId;
                                if (!(specId in specTree[specParserState.activeFeature])) {
                                    specTree[specParserState.activeFeature].specHash[specId] = {};
                                }
                                if (!(specId in specTable)) {
                                    specTable[specId] = {
                                        feature: specParserState.activeFeature,
                                        specFile: specParserState.activeSpecFile,
                                        testcases: {},
                                        criteria: {}
                                    };
                                }
                                featureTable[specParserState.activeFeature].specs[specId] = true;
                                specFileTable[specParserState.activeSpecFile].specs[specId] = true;
                            });
                            specParserState.addArgFunc((node) => {
                                const specDescription = node.text;
                                specTree[specParserState.activeFeature].specHash[specParserState.activeSpecId].description = specDescription;
                            }),
                                specParserState.addArgFunc((node) => {
                                    const specMetadata = node;
                                    const str = sourceFile.text.substr(specMetadata.pos, specMetadata.end - specMetadata.pos);
                                    let parsedMetadata;
                                    try {
                                        parsedMetadata = JSON5.parse(str);
                                    }
                                    catch (e) {
                                        console.error(`Failed to parse spec metadata. Please do not use dynamic values inside spec metadata: ${parsedMetadata}\n`);
                                        throw e;
                                    }
                                    specTree[specParserState.activeFeature].specHash[specParserState.activeSpecId].metadata = parsedMetadata;
                                });
                            afterFuncTable[parentPos] = () => { specParserState.activeSpecId = undefined; };
                            break;
                        case 'Then':
                            if (!specParserState.activeSpecId) {
                                throw new Error(`Then defined outside of story in ${specParserState.activeSpecFile}`);
                            }
                            specParserState.addArgFunc((node) => {
                                const criteriaId = node.text;
                                specTable[specParserState.activeSpecId].criteria[criteriaId] = true;
                            });
                            break;
                    }
                }
                break;
        }
        ts.forEachChild(node, parseSpecNode);
        if (nodePos >= 0 && afterFuncTable[nodePos]) {
            afterFuncTable[nodePos]();
        }
    }
}
exports.parseSpecFiles = parseSpecFiles;
// used to determine, if a spec is to be executed for a feature or spec filter
const testcaseTable = {};
// used to lookup spec information
const testcaseTree = {};
const validateTable = {};
const testcaseFileTable = {};
const testcaseParserState = {
    callExpressionPos: -1,
    activeTestcaseFile: undefined,
    activeSuiteId: undefined,
    activeTestcaseId: undefined,
    argFuncs: [],
    addArgFunc: (argFunc) => {
        testcaseParserState.argFuncs.push(argFunc);
    },
    executeNextArgFunc: (node) => {
        if (testcaseParserState.argFuncs.length > 0) {
            const argFunc = testcaseParserState.argFuncs.shift();
            argFunc(node);
        }
    }
};
function parseTestcaseFiles(sourceFile) {
    parseTestcaseNode(sourceFile);
    function parseTestcaseNode(node) {
        let nodePos = -1;
        testcaseParserState.executeNextArgFunc(node);
        switch (node.kind) {
            case ts.SyntaxKind.CallExpression:
                nodePos = node.pos;
                testcaseParserState.callExpressionPos = nodePos;
                break;
            case ts.SyntaxKind.Identifier:
                // ensure only functions and not varibables etc. are considered
                if (testcaseParserState.callExpressionPos >= 0) {
                    const identifier = node;
                    const parentPos = testcaseParserState.callExpressionPos;
                    testcaseParserState.callExpressionPos = -1;
                    switch (identifier.text) {
                        case 'fsuite':
                        case 'xsuite':
                        case 'suite':
                            testcaseParserState.addArgFunc((node) => {
                                const suiteId = node.text;
                                if (suiteId.length === 0) {
                                    throw new Error(`Suite description must not be empty`);
                                }
                                else if (suiteId.indexOf('.') > -1) {
                                    throw new Error(`Suite description must not contain the '.' character: ${suiteId}`);
                                }
                                else if (suiteId.substr(0, 1) === '-') {
                                    throw new Error(`Suite description must not start with '-' character: ${suiteId}`);
                                }
                                if (typeof testcaseParserState.activeSuiteId === 'undefined') {
                                    testcaseParserState.activeSuiteId = suiteId;
                                }
                                else {
                                    testcaseParserState.activeSuiteId += `.${suiteId}`;
                                }
                                const fullSuiteId = testcaseParserState.activeSuiteId;
                                if (!(fullSuiteId in testcaseTree)) {
                                    testcaseTree[fullSuiteId] = {
                                        testcaseHash: {}
                                    };
                                }
                                testcaseFileTable[testcaseParserState.activeTestcaseFile].testcases[fullSuiteId] = true;
                            });
                            testcaseParserState.addArgFunc((node) => {
                                const suiteMetadata = node;
                                const str = sourceFile.text.substr(suiteMetadata.pos, suiteMetadata.end - suiteMetadata.pos);
                                let parsedMetadata;
                                try {
                                    parsedMetadata = JSON5.parse(str);
                                }
                                catch (e) {
                                    console.error(`Failed to parse suite metadata. Please do not use dynamic values inside suite metadata: ${parsedMetadata}\n`);
                                    throw e;
                                }
                                testcaseTree[testcaseParserState.activeSuiteId].metadata = parsedMetadata;
                            });
                            afterFuncTable[parentPos] = () => {
                                const suiteIds = testcaseParserState.activeSuiteId.split('.');
                                suiteIds.pop();
                                let fullSuiteId = undefined;
                                if (suiteIds.length > 0) {
                                    fullSuiteId = suiteIds.join('.');
                                    if (fullSuiteId === '') {
                                        fullSuiteId = undefined;
                                    }
                                }
                                testcaseParserState.activeSuiteId = fullSuiteId;
                            };
                            break;
                        case 'ftestcase':
                        case 'xtestcase':
                        case 'testcase':
                            testcaseParserState.addArgFunc((node) => {
                                const testcaseId = node.text;
                                if (testcaseId.length === 0) {
                                    throw new Error(`Testcase description must not be empty`);
                                }
                                else if (testcaseId.indexOf('.') > -1) {
                                    throw new Error(`Testcase description must not contain the '.' character: ${testcaseId}`);
                                }
                                let fullTestcaseId;
                                try {
                                    fullTestcaseId = `${testcaseParserState.activeSuiteId}.${testcaseId}`;
                                    testcaseParserState.activeTestcaseId = fullTestcaseId;
                                    if (!(fullTestcaseId in testcaseTree[testcaseParserState.activeSuiteId])) {
                                        testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[fullTestcaseId] = {
                                            description: testcaseId
                                        };
                                    }
                                }
                                catch (e) {
                                    if (!testcaseTree[testcaseParserState.activeSuiteId]) {
                                        console.error(`Parsed testcase function outside of suite: ${testcaseId}\nAlways define testcase functions inside suites and do not use them\ninside "external" functions invoked from inside suites`);
                                        throw e;
                                    }
                                }
                                if (!(fullTestcaseId in testcaseTable)) {
                                    testcaseTable[fullTestcaseId] = {
                                        suiteId: testcaseParserState.activeSuiteId,
                                        testcaseFile: testcaseParserState.activeTestcaseFile
                                    };
                                }
                                testcaseFileTable[testcaseParserState.activeTestcaseFile].testcases[fullTestcaseId] = true;
                            });
                            testcaseParserState.addArgFunc((node) => {
                                const testcaseMetadata = node;
                                const str = sourceFile.text.substr(testcaseMetadata.pos, testcaseMetadata.end - testcaseMetadata.pos);
                                let parsedMetadata;
                                try {
                                    parsedMetadata = JSON5.parse(str);
                                }
                                catch (e) {
                                    console.error(`Failed to parse testcase metadata. Please do not use dynamic values inside testcase metadata: ${parsedMetadata}\n`);
                                    throw e;
                                }
                                testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[testcaseParserState.activeTestcaseId].metadata = parsedMetadata;
                            });
                            afterFuncTable[parentPos] = () => { testcaseParserState.activeTestcaseId = undefined; };
                            break;
                        case 'validate':
                            testcaseParserState.addArgFunc((node) => {
                                const validateMetadata = node;
                                const str = sourceFile.text.substr(validateMetadata.pos, validateMetadata.end - validateMetadata.pos);
                                let validateObject;
                                try {
                                    validateObject = JSON5.parse(str);
                                }
                                catch (e) {
                                    console.error(`Failed to parse validate object. Please do not use dynamic values inside validateObject: ${str}\n`);
                                    throw e;
                                }
                                try {
                                    if (!testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[testcaseParserState.activeTestcaseId].specValidateHash) {
                                        testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[testcaseParserState.activeTestcaseId].specValidateHash = {};
                                    }
                                }
                                catch (e) {
                                    if (!testcaseTree[testcaseParserState.activeSuiteId] ||
                                        !testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[testcaseParserState.activeTestcaseId]) {
                                        console.error(`Parsed validate function outside of suite or testcase: ${str}\n
                        Always define validate functions inside suites and testcases and do not use them
                        inside "external" functions invoked from inside suites or testcases`);
                                        throw e;
                                    }
                                }
                                for (const spec in validateObject) {
                                    if (validateObject[spec].length > 0) {
                                        if (spec in specTable) {
                                            specTable[spec].testcases[testcaseParserState.activeTestcaseId] = true;
                                        }
                                        if (!(spec in validateTable)) {
                                            validateTable[spec] = {};
                                        }
                                        validateTable[spec][testcaseParserState.activeTestcaseId] = true;
                                        const specValidateHash = testcaseTree[testcaseParserState.activeSuiteId].testcaseHash[testcaseParserState.activeTestcaseId].specValidateHash;
                                        if (!(spec in specValidateHash)) {
                                            specValidateHash[spec] = {};
                                        }
                                        for (const criteria of validateObject[spec]) {
                                            specValidateHash[spec][criteria] = true;
                                        }
                                    }
                                }
                            });
                            break;
                    }
                }
                break;
        }
        ts.forEachChild(node, parseTestcaseNode);
        if (nodePos >= 0 && afterFuncTable[nodePos]) {
            afterFuncTable[nodePos]();
        }
    }
}
exports.parseTestcaseFiles = parseTestcaseFiles;
const compilerOptions = {
    noEmitOnError: true,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES2017,
    module: ts.ModuleKind.CommonJS
};
function specFilesParse(fileNames) {
    const program = ts.createProgram(fileNames, compilerOptions);
    fileNames.forEach(fileName => {
        specParserState.activeSpecFile = fileName;
        if (!fs_1.existsSync(fileName)) {
            throw new Error(`Spec file could not be found: ${fileName}`);
        }
        let sourceFile = program.getSourceFile(fileName);
        afterFuncTable = {};
        specFileTable[fileName] = {
            features: {},
            specs: {}
        };
        parseSpecFiles(sourceFile);
    });
    return {
        specTree: specTree,
        specTable: specTable,
        featureTable: featureTable,
        specFileTable: specFileTable
    };
}
exports.specFilesParse = specFilesParse;
function testcaseFilesParse(fileNames) {
    const program = ts.createProgram(fileNames, compilerOptions);
    fileNames.forEach(fileName => {
        testcaseParserState.activeTestcaseFile = fileName;
        if (!fs_1.existsSync(fileName)) {
            throw new Error(`Testcase file could not be found: ${fileName}`);
        }
        let sourceFile = program.getSourceFile(fileName);
        afterFuncTable = {};
        testcaseFileTable[fileName] = {
            testcases: {},
        };
        parseTestcaseFiles(sourceFile);
    });
    return {
        testcaseTable: testcaseTable,
        tree: testcaseTree,
        validateTable: validateTable,
        testcaseFileTable: testcaseFileTable
    };
}
exports.testcaseFilesParse = testcaseFilesParse;
//# sourceMappingURL=parser.js.map