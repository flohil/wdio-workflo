"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const JSON5 = require("json5");
// used to determine, if a spec is to be executed for a feature or spec filter
const specTable = {};
// used to lookup spec information
const specTree = {};
const parserState = {
    beforeCallExpressionIdentifier: false,
    activeSpecFile: undefined,
    activeFeature: undefined,
    activeSpecId: undefined,
    argFuncs: [],
    addArgFunc: (argFunc) => {
        parserState.argFuncs.push(argFunc);
    },
    executeNextArgFunc: (node) => {
        if (parserState.argFuncs.length > 0) {
            const argFunc = parserState.argFuncs.shift();
            argFunc(node);
        }
    }
};
function parseSpecFiles(sourceFile) {
    parseSpecNode(sourceFile);
    function parseSpecNode(node) {
        let afterFunc = undefined;
        parserState.executeNextArgFunc(node);
        switch (node.kind) {
            case ts.SyntaxKind.CallExpression:
                parserState.beforeCallExpressionIdentifier = true;
                break;
            case ts.SyntaxKind.Identifier:
                // ensure only functions and not varibables etc. are considered
                if (parserState.beforeCallExpressionIdentifier) {
                    parserState.beforeCallExpressionIdentifier = false;
                    const identifier = node;
                    switch (identifier.text) {
                        case 'Feature':
                            parserState.addArgFunc((node) => {
                                const featureId = node.text;
                                parserState.activeFeature = featureId;
                                if (!(featureId in specTree)) {
                                    specTree[featureId] = {
                                        specHash: {}
                                    };
                                }
                            });
                            parserState.addArgFunc((node) => {
                                const featureMetadata = node;
                                const str = sourceFile.text.substr(featureMetadata.pos, featureMetadata.end - featureMetadata.pos);
                                specTree[parserState.activeFeature].metadata = JSON5.parse(str);
                            });
                            afterFunc = () => { parserState.activeFeature = undefined; };
                            break;
                        case 'Story':
                            parserState.addArgFunc((node) => {
                                const specId = node.text;
                                parserState.activeSpecId = specId;
                                if (!(specId in specTree[parserState.activeFeature])) {
                                    specTree[parserState.activeFeature].specHash[specId] = {};
                                }
                                if (!(specId in specTable)) {
                                    specTable[specId] = {
                                        feature: parserState.activeFeature,
                                        specFile: parserState.activeSpecFile
                                    };
                                }
                            });
                            parserState.addArgFunc((node) => {
                                const specDescription = node.text;
                                specTree[parserState.activeFeature].specHash[parserState.activeSpecId].description = specDescription;
                            }),
                                parserState.addArgFunc((node) => {
                                    const specMetadata = node;
                                    const str = sourceFile.text.substr(specMetadata.pos, specMetadata.end - specMetadata.pos);
                                    specTree[parserState.activeFeature].specHash[parserState.activeSpecId].metadata = JSON5.parse(str);
                                });
                            afterFunc = () => { parserState.activeSpecId = undefined; };
                            break;
                        case 'Then':
                            break;
                    }
                }
                break;
        }
        ts.forEachChild(node, parseSpecNode);
        if (afterFunc) {
            afterFunc();
        }
    }
}
exports.parseSpecFiles = parseSpecFiles;
function specFilesParse(fileNames) {
    const program = ts.createProgram(fileNames, {
        noEmitOnError: true,
        noImplicitAny: true,
        target: ts.ScriptTarget.ES2017,
        module: ts.ModuleKind.CommonJS
    });
    fileNames.forEach(fileName => {
        parserState.activeSpecFile = fileName;
        let sourceFile = program.getSourceFile(fileName);
        parseSpecFiles(sourceFile);
    });
    return {
        tree: specTree,
        table: specTable
    };
}
exports.specFilesParse = specFilesParse;
//# sourceMappingURL=parser.js.map