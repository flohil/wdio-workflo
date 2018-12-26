"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_objects_1 = require("./page_objects");
const _ = require("lodash");
// MATCHER FUNCS
function isWithoutExpected(node, withoutExpected = []) {
    let _withoutExpected = false;
    if (node instanceof page_objects_1.elements.PageElement) {
        if (withoutExpected.indexOf('element') >= 0) {
            _withoutExpected = true;
        }
    }
    else if (node instanceof page_objects_1.elements.PageElementList) {
        if (withoutExpected.indexOf('list') >= 0) {
            _withoutExpected = true;
        }
    }
    else if (node instanceof page_objects_1.elements.PageElementMap) {
        if (withoutExpected.indexOf('map') >= 0) {
            _withoutExpected = true;
        }
    }
    else if (node instanceof page_objects_1.elements.PageElementGroup) {
        if (withoutExpected.indexOf('group') >= 0) {
            _withoutExpected = true;
        }
    }
    else {
        throw new Error(`Unknown node type in matchers: ${node.constructor.name}.` +
            `Node type needs to extend PageElement, PageElementList, PageElementMap or PageElementGroup.`);
    }
    return _withoutExpected;
}
function createMatcher(compareFuncs, ensureOpts = false, withoutExpected = []) {
    return (util, customEqualityTesters) => {
        function baseCompareFunction(node, negativeComparison, opts = undefined, expected = undefined) {
            let result = {
                pass: true,
                message: ''
            };
            let resultFunc;
            let errorTextFunc;
            if (node instanceof page_objects_1.elements.PageElement) {
                if (compareFuncs.element) {
                    ({ resultFunc, errorTextFunc } = compareFuncs.element);
                }
                else {
                    throw new Error(`No PageElement matcher was implemented for node type ${node.constructor.name}`);
                }
            }
            else if (node instanceof page_objects_1.elements.PageElementList) {
                if (compareFuncs.list) {
                    ({ resultFunc, errorTextFunc } = compareFuncs.list);
                }
                else {
                    throw new Error(`No PageElementList matcher was implemented for node type ${node.constructor.name}`);
                }
            }
            else if (node instanceof page_objects_1.elements.PageElementMap) {
                if (compareFuncs.map) {
                    ({ resultFunc, errorTextFunc } = compareFuncs.map);
                }
                else {
                    throw new Error(`No PageElementMap matcher was implemented for node type ${node.constructor.name}`);
                }
            }
            else if (node instanceof page_objects_1.elements.PageElementGroup) {
                if (compareFuncs.group) {
                    ({ resultFunc, errorTextFunc } = compareFuncs.group);
                }
                else {
                    throw new Error(`No PageElementGroup matcher was implemented for node type ${node.constructor.name}`);
                }
            }
            else {
                throw new Error(`Unknown node type in matchers: ${node.constructor.name}.` +
                    `Node type needs to extend PageElement, PageElementList, PageElementMap or PageElementGroup.`);
            }
            if (ensureOpts && (typeof opts === 'undefined' || opts === null)) {
                opts = Object.create(null);
            }
            const successes = resultFunc({ node, expected, opts });
            const success = (negativeComparison) ? successes[1]() : successes[0]();
            if (!success) {
                let optsWithTimeout = (typeof opts === 'object' && opts !== null) ? opts : Object.create(null);
                if (!optsWithTimeout['timeout']) {
                    optsWithTimeout.timeout = node.getTimeout();
                }
                const actual = node.__lastDiff.actual;
                const errorTexts = errorTextFunc({ actual, expected, node, opts: optsWithTimeout });
                let errorText = undefined;
                if (negativeComparison && errorTexts.length > 1) {
                    errorText = errorTexts[1];
                }
                else {
                    errorText = errorTexts[0];
                }
                result.pass = false;
                result.message = errorText;
            }
            return result;
        }
        return {
            compare: (node, expectedOrOpts, opts) => {
                if (isWithoutExpected(node, withoutExpected)) {
                    return baseCompareFunction(node, false, expectedOrOpts);
                }
                else {
                    return baseCompareFunction(node, false, opts, expectedOrOpts);
                }
            },
            negativeCompare: (node, expectedOrOpts, opts) => {
                if (isWithoutExpected(node, withoutExpected)) {
                    return baseCompareFunction(node, true, expectedOrOpts);
                }
                else {
                    return baseCompareFunction(node, true, opts, expectedOrOpts);
                }
            }
        };
    };
}
exports.createMatcher = createMatcher;
function createMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createMatcher(compareFuncs, false, withoutExpected);
}
exports.createMatcherWithoutExpected = createMatcherWithoutExpected;
function createEventuallyMatcher(compareFuncs) {
    return createMatcher(compareFuncs, true);
}
exports.createEventuallyMatcher = createEventuallyMatcher;
function createEventuallyMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createMatcher(compareFuncs, true, withoutExpected);
}
exports.createEventuallyMatcherWithoutExpected = createEventuallyMatcherWithoutExpected;
function createTextMatcher(compareFuncs) {
    return createMatcher(compareFuncs, false);
}
exports.createTextMatcher = createTextMatcher;
function createTextMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createMatcher(compareFuncs, false, withoutExpected);
}
exports.createTextMatcherWithoutExpected = createTextMatcherWithoutExpected;
function createEventuallyTextMatcher(compareFuncs) {
    return createMatcher(compareFuncs, true);
}
exports.createEventuallyTextMatcher = createEventuallyTextMatcher;
function createEventuallyTextMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createMatcher(compareFuncs, true, withoutExpected);
}
exports.createEventuallyTextMatcherWithoutExpected = createEventuallyTextMatcherWithoutExpected;
function createBooleanMatcher(compareFuncs) {
    return createMatcher(compareFuncs);
}
exports.createBooleanMatcher = createBooleanMatcher;
function createBooleanMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createMatcher(compareFuncs, false, withoutExpected);
}
exports.createBooleanMatcherWithoutExpected = createBooleanMatcherWithoutExpected;
function createEventuallyBooleanMatcher(compareFuncs) {
    return createMatcher(compareFuncs, true);
}
exports.createEventuallyBooleanMatcher = createEventuallyBooleanMatcher;
function createEventuallyBooleanMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createMatcher(compareFuncs, true, withoutExpected);
}
exports.createEventuallyBooleanMatcherWithoutExpected = createEventuallyBooleanMatcherWithoutExpected;
function createValueMatcher(compareFuncs) {
    return createMatcher(compareFuncs);
}
exports.createValueMatcher = createValueMatcher;
function createValueMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createMatcher(compareFuncs, false, withoutExpected);
}
exports.createValueMatcherWithoutExpected = createValueMatcherWithoutExpected;
function createEventuallyValueMatcher(compareFuncs) {
    return createMatcher(compareFuncs, true);
}
exports.createEventuallyValueMatcher = createEventuallyValueMatcher;
function createEventuallyValueMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createMatcher(compareFuncs, true, withoutExpected);
}
exports.createEventuallyValueMatcherWithoutExpected = createEventuallyValueMatcherWithoutExpected;
// export function createValueMatcherWithoutExpected<
//   NodeType extends Workflo.PageNode.INode,
//   OptsType extends Object = {timeout?: number},
// >(
//   compareFuncs: ICompareValueElementFuncs,
// ) {
//   return createMatcher<NodeType, OptsType, undefined, ICompareValueElementFuncs>(compareFuncs, true)
// }
// ERROR TEXT FUNCTIONS
function convertDiffToMessages(diff, actualOnly = false, comparisonLines = [], paths = []) {
    if (diff.tree && Object.keys(diff.tree).length > 0) {
        const keys = Object.keys(diff.tree);
        keys.forEach(key => {
            const _paths = [...paths];
            _paths.push(key);
            convertDiffToMessages(diff.tree[key], actualOnly, comparisonLines, _paths);
        });
    }
    else {
        let _paths = paths.join('');
        if (_paths.charAt(0) === '.') {
            _paths = _paths.substring(1);
        }
        const _actual = printValue(diff.actual);
        const _expected = printValue(diff.expected);
        let compareStr = '';
        if (actualOnly) {
            compareStr = (typeof diff.actual === 'undefined') ?
                '' : `{actual: "${_actual}"}\n`;
        }
        else {
            compareStr = (typeof diff.actual === 'undefined' && typeof diff.expected === 'undefined') ?
                '' : `{actual: "${_actual}", expected: "${_expected}"}\n`;
        }
        comparisonLines.push(`${diff.constructorName} at path '${_paths}'\n${compareStr}( ${diff.selector} )`);
    }
    return comparisonLines;
}
function printValue(value) {
    if (typeof value === 'undefined') {
        return '';
    }
    else if (value === null) {
        return '';
    }
    return value.toString();
}
function createBaseMessage(node, errorTexts) {
    let errorText = undefined;
    let notErrorText = undefined;
    if (_.isArray(errorTexts)) {
        errorText = errorTexts[0];
        notErrorText = errorTexts[1];
    }
    else {
        errorText = errorTexts;
        notErrorText = errorTexts;
    }
    return [
        `Expected ${node.constructor.name}${errorText}.\n( ${node.__getNodeId()} )`,
        `Expected ${node.constructor.name}${notErrorText}.\n( ${node.__getNodeId()} )`
    ];
}
exports.createBaseMessage = createBaseMessage;
function createMessage(node, errorTexts) {
    let errorText = undefined;
    let notErrorText = undefined;
    if (_.isArray(errorTexts)) {
        errorText = errorTexts[0];
        notErrorText = errorTexts[1];
    }
    else {
        errorText = errorTexts;
        notErrorText = errorTexts;
    }
    return createBaseMessage(node, [
        ` to ${errorText}`,
        ` not to ${notErrorText}`
    ]);
}
exports.createMessage = createMessage;
function createEventuallyMessage(node, errorTexts, timeout) {
    let errorText = undefined;
    let notErrorText = undefined;
    if (_.isArray(errorTexts)) {
        errorText = errorTexts[0];
        notErrorText = errorTexts[1];
    }
    else {
        errorText = errorTexts;
        notErrorText = errorTexts;
    }
    return createBaseMessage(node, [
        ` to eventually ${errorText} within ${timeout} ms`,
        ` not to eventually ${notErrorText} within ${timeout} ms`
    ]);
}
exports.createEventuallyMessage = createEventuallyMessage;
function createPropertyMessage(node, property, comparison, actual, expected) {
    const _actual = printValue(actual);
    const _expected = printValue(expected);
    return createBaseMessage(node, [
        `'s ${property} "${_actual}" to ${comparison} "${_expected}"`,
        `'s ${property} "${_actual}" not to ${comparison} "${_expected}"`,
    ]);
}
exports.createPropertyMessage = createPropertyMessage;
function createAnyMessage(node, property, comparison, actual) {
    const _actual = printValue(actual);
    return createBaseMessage(node, [
        ` to ${comparison} any ${property}`,
        ` to ${comparison} no ${property} but had ${property} "${_actual}"`,
    ]);
}
exports.createAnyMessage = createAnyMessage;
function createEventuallyPropertyMessage(node, property, comparison, actual, expected, timeout) {
    const _actual = printValue(actual);
    const _expected = printValue(expected);
    return createBaseMessage(node, [
        `'s ${property} "${_actual}" to eventually ${comparison} "${_expected}" within ${timeout} ms`,
        `'s ${property} "${_actual}" not to eventually ${comparison} "${_expected}" within ${timeout} ms`
    ]);
}
exports.createEventuallyPropertyMessage = createEventuallyPropertyMessage;
function createEventuallyAnyMessage(node, property, comparison, actual, timeout) {
    const _actual = printValue(actual);
    return createBaseMessage(node, [
        ` to eventually ${comparison} any ${property} within ${timeout} ms`,
        ` to eventually ${comparison} no ${property} within ${timeout} ms but had ${property} "${_actual}"`,
    ]);
}
exports.createEventuallyAnyMessage = createEventuallyAnyMessage;
function createEachMessage(node, errorTexts, actualOnly = false) {
    let errorText = undefined;
    let notErrorText = undefined;
    if (_.isArray(errorTexts)) {
        errorText = errorTexts[0];
        notErrorText = errorTexts[1];
    }
    else {
        errorText = errorTexts;
        notErrorText = errorTexts;
    }
    const comparisonLines = convertDiffToMessages(node.__lastDiff, actualOnly);
    const comparisonList = comparisonLines.join('\n\n');
    const hrLine = `\n------------------------------------------------------------------\n`;
    return [
        `Expected each of ${node.constructor.name}'s elements to ${errorText}:${hrLine}${comparisonList}${hrLine}`,
        `Expected none of ${node.constructor.name}'s elements to ${notErrorText}:${hrLine}${comparisonList}${hrLine}`
    ];
}
exports.createEachMessage = createEachMessage;
function createAnyEachMessage(node, errorTexts) {
    return createEachMessage(node, errorTexts, true);
}
exports.createAnyEachMessage = createAnyEachMessage;
function createEventuallyEachMessage(node, errorTexts, timeout) {
    const within = _.isArray(errorTexts) ?
        errorTexts.map(errorText => `eventually ${errorText} within ${timeout}ms`) :
        `eventually ${errorTexts} within ${timeout}ms`;
    return createEachMessage(node, within);
}
exports.createEventuallyEachMessage = createEventuallyEachMessage;
function createEventuallyAnyEachMessage(node, errorTexts, timeout) {
    const within = _.isArray(errorTexts) ?
        errorTexts.map(errorText => `eventually ${errorText} within ${timeout}ms`) :
        `eventually ${errorTexts} within ${timeout}ms`;
    return createEachMessage(node, within, true);
}
exports.createEventuallyAnyEachMessage = createEventuallyAnyEachMessage;
// MATCHERS
exports.elementMatchers = {
    toExist: createMatcherWithoutExpected({
        element: {
            resultFunc: ({ node }) => [() => node.currently.exists(), () => node.currently.not.exists()],
            errorTextFunc: ({ node }) => createMessage(node, "exist")
        },
        list: {
            resultFunc: ({ node, opts }) => {
                if (_.isArray(opts)) {
                    throw new Error('Filtermask for toExist() on PageElementList can only be boolean');
                }
                else {
                    return [
                        () => node.currently.exists(opts), () => node.currently.not.exists(opts)
                    ];
                }
            },
            errorTextFunc: ({ node }) => [
                `Expected at least one of ${node.constructor.name}'s elements to exist.\n( ${node.__getNodeId()} )`,
                `Expected none one of ${node.constructor.name}'s elements to exist.\n( ${node.__getNodeId()} )`
            ]
        },
        map: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.exists(opts), () => node.currently.not.exists(opts)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, "exist")
        },
        group: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.exists(opts), () => node.currently.not.exists(opts)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, "exist")
        }
    }),
    toEventuallyExist: createEventuallyMatcherWithoutExpected({
        element: {
            resultFunc: ({ node, opts }) => [() => node.eventually.exists(opts), () => node.eventually.not.exists(opts)],
            errorTextFunc: ({ node, opts }) => createEventuallyMessage(node, "exist", opts.timeout)
        },
        list: {
            resultFunc: ({ node, opts }) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                if (_.isArray(filterMask)) {
                    throw new Error('Filtermask for toEventuallyExist() on PageElementList can only be boolean');
                }
                else {
                    return [
                        () => node.eventually.exists(Object.assign({ filterMask }, otherOpts)),
                        () => node.eventually.not.exists(Object.assign({ filterMask }, otherOpts))
                    ];
                }
            },
            errorTextFunc: ({ node, opts }) => [
                `Expected at least one of ${node.constructor.name}'s elements to eventually exist within ${opts.timeout}ms.\n` +
                    `( ${node.__getNodeId()} )`,
                `Expected none one of ${node.constructor.name}'s elements to eventually exist within ${opts.timeout}ms.\n` +
                    `( ${node.__getNodeId()} )`
            ]
        },
        map: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.exists(opts), () => node.eventually.not.exists(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, "exist", opts.timeout)
        },
        group: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.exists(opts), () => node.eventually.not.exists(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, "exist", opts.timeout)
        }
    }),
    toBeVisible: createMatcherWithoutExpected({
        element: {
            resultFunc: ({ node }) => [() => node.currently.isVisible(), () => node.currently.not.isVisible()],
            errorTextFunc: ({ node }) => createMessage(node, "be visible")
        },
        list: {
            resultFunc: ({ node, opts }) => [() => node.currently.isVisible(opts), () => node.currently.not.isVisible(opts)],
            errorTextFunc: ({ node }) => createEachMessage(node, "be visible")
        },
        map: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.isVisible(opts), () => node.currently.not.isVisible(opts)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, "be visible")
        },
        group: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.isVisible(opts), () => node.currently.not.isVisible(opts)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, "be visible")
        }
    }),
    toEventuallyBeVisible: createEventuallyMatcherWithoutExpected({
        element: {
            resultFunc: ({ node, opts }) => [() => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts)],
            errorTextFunc: ({ node, opts }) => createEventuallyMessage(node, "be visible", opts.timeout)
        },
        list: {
            resultFunc: ({ node, opts }) => [() => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts)],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, "be visible", opts.timeout)
        },
        map: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, "be visible", opts.timeout)
        },
        group: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.isVisible(opts), () => node.eventually.not.isVisible(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, "be visible", opts.timeout)
        }
    }),
    toBeEnabled: createMatcherWithoutExpected({
        element: {
            resultFunc: ({ node }) => [() => node.currently.isEnabled(), () => node.currently.not.isEnabled()],
            errorTextFunc: ({ node }) => createMessage(node, "be enabled")
        },
        list: {
            resultFunc: ({ node, opts }) => [() => node.currently.isEnabled(opts), () => node.currently.not.isEnabled(opts)],
            errorTextFunc: ({ node }) => createEachMessage(node, "be enabled")
        },
        map: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.isEnabled(opts), () => node.currently.not.isEnabled(opts)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, "be enabled")
        },
        group: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.isEnabled(opts), () => node.currently.not.isEnabled(opts)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, "be enabled")
        }
    }),
    toEventuallyBeEnabled: createEventuallyMatcherWithoutExpected({
        element: {
            resultFunc: ({ node, opts }) => [() => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts)],
            errorTextFunc: ({ node, opts }) => createEventuallyMessage(node, "be enabled", opts.timeout)
        },
        list: {
            resultFunc: ({ node, opts }) => [() => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts)],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, "be enabled", opts.timeout)
        },
        map: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, "be enabled", opts.timeout)
        },
        group: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.isEnabled(opts), () => node.eventually.not.isEnabled(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, "be enabled", opts.timeout)
        }
    }),
    toHaveText: createTextMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasText(expected), () => node.currently.not.hasText(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'text', 'be', actual, expected)
        },
        list: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasText(expected), () => node.currently.not.hasText(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, 'have text')
        },
        map: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasText(expected), () => node.currently.not.hasText(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, 'have text')
        },
        group: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasText(expected), () => node.currently.not.hasText(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, "have text")
        }
    }),
    toEventuallyHaveText: createEventuallyTextMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'text', 'be', actual, expected, opts.timeout)
        },
        list: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have text', opts.timeout)
        },
        map: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have text', opts.timeout)
        },
        group: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasText(expected, opts), () => node.eventually.not.hasText(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, "have text", opts.timeout)
        }
    }),
    toHaveAnyText: createTextMatcherWithoutExpected({
        element: {
            resultFunc: ({ node }) => [
                () => node.currently.hasAnyText(), () => node.currently.not.hasAnyText()
            ],
            errorTextFunc: ({ node, actual }) => createAnyMessage(node, "text", "have", actual)
        },
        list: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.hasAnyText(opts), () => node.currently.not.hasAnyText(opts)
            ],
            errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any text')
        },
        map: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.hasAnyText(opts), () => node.currently.not.hasAnyText(opts)
            ],
            errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any text')
        },
        group: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.hasAnyText(opts), () => node.currently.not.hasAnyText(opts)
            ],
            errorTextFunc: ({ node }) => createAnyEachMessage(node, "have any text")
        }
    }),
    toEventuallyHaveAnyText: createEventuallyTextMatcherWithoutExpected({
        element: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyText(opts), () => node.eventually.not.hasAnyText(opts)
            ],
            errorTextFunc: ({ node, actual, opts }) => createEventuallyAnyMessage(node, "text", "have", actual, opts.timeout)
        },
        list: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyText(opts), () => node.eventually.not.hasAnyText(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any text', opts.timeout)
        },
        map: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyText(opts), () => node.eventually.not.hasAnyText(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any text', opts.timeout)
        },
        group: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyText(opts), () => node.eventually.not.hasAnyText(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, "have any text", opts.timeout)
        }
    }),
    toContainText: createTextMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsText(expected), () => node.currently.not.containsText(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'text', 'contain', actual, expected)
        },
        list: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsText(expected), () => node.currently.not.containsText(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, 'contain text')
        },
        map: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsText(expected), () => node.currently.not.containsText(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, 'contain text')
        },
        group: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsText(expected), () => node.currently.not.containsText(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, "contain text")
        }
    }),
    toEventuallyContainText: createEventuallyTextMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsText(expected, opts), () => node.eventually.not.containsText(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'text', 'contain', actual, expected, opts.timeout)
        },
        list: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsText(expected, opts), () => node.eventually.not.containsText(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain text', opts.timeout)
        },
        map: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsText(expected, opts), () => node.eventually.not.containsText(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain text', opts.timeout)
        },
        group: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsText(expected, opts), () => node.eventually.not.containsText(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, "contain text", opts.timeout)
        }
    }),
};
// export const listMatchers: jasmine.CustomMatcherFactories = {
// toBeEmpty: listMatcherFunction(
//   ({node}) => [() => node.currently.isEmpty(), () => node.currently.not.isEmpty()],
//   ({node}) => createBaseMessage(node, "to be empty")
// ),
// toHaveLength: listMatcherFunction<number, {comparator?: Workflo.Comparator}>(
//   ({node, expected, opts}) => [
//     () => node.currently.hasLength(expected, opts.comparator),
//     () => node.currently.not.hasLength(expected, opts.comparator)
//   ],
//   ({actual, expected, opts, node}) => createBaseMessage(
//     node, `'s length ${actual} to be${comparatorStr(opts.comparator)} ${expected}`
//   )
// ),
// toEventuallyBeEmpty: listMatcherWithoutExpectedFunction<IPageElementListWaitEmptyParams>(
//   ({node, opts}) => [
//     () => node.eventually.isEmpty(opts), () => node.eventually.not.isEmpty(opts)
//   ],
//   ({opts, node}) => createBaseMessage(node, ` to eventually be empty within ${opts.timeout} ms`)
// ),
// toEventuallyHaveLength: listMatcherFunction<number, IPageElementListWaitLengthParams>(
//   ({node, expected, opts}) => [
//     () => node.eventually.hasLength(expected, opts),
//     () => node.eventually.not.hasLength(expected, opts)
//   ],
//   ({actual, expected, opts, node}) => createBaseMessage(
//     node, `'s length ${actual} to be${comparatorStr(opts.comparator)} ${expected} within ${opts.timeout} ms`
//   )
// ),
// }
exports.valueElementMatchers = {
    toHaveValue: createValueMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'value', 'be', actual, expected)
        },
        list: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, 'have value')
        },
        map: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, 'have value')
        },
        group: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, "have value")
        }
    }),
    toEventuallyHaveValue: createEventuallyValueMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasValue(expected, opts), () => node.eventually.not.hasValue(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'value', 'be', actual, expected, opts.timeout)
        },
        list: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasValue(expected, opts), () => node.eventually.not.hasValue(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have value', opts.timeout)
        },
        map: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasValue(expected, opts), () => node.eventually.not.hasValue(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have value', opts.timeout)
        },
        group: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasValue(expected, opts), () => node.eventually.not.hasValue(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, "have value", opts.timeout)
        }
    }),
    toHaveAnyValue: createValueMatcherWithoutExpected({
        element: {
            resultFunc: ({ node }) => [
                () => node.currently.hasAnyValue(), () => node.currently.not.hasAnyValue()
            ],
            errorTextFunc: ({ node, actual }) => createAnyMessage(node, "value", "have", actual)
        },
        list: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.hasAnyValue(opts), () => node.currently.not.hasAnyValue(opts)
            ],
            errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any value')
        },
        map: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.hasAnyValue(opts), () => node.currently.not.hasAnyValue(opts)
            ],
            errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any value')
        },
        group: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.hasAnyValue(opts), () => node.currently.not.hasAnyValue(opts)
            ],
            errorTextFunc: ({ node }) => createAnyEachMessage(node, "have any value")
        }
    }),
    toEventuallyHaveAnyValue: createEventuallyValueMatcherWithoutExpected({
        element: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyValue(opts), () => node.eventually.not.hasAnyValue(opts)
            ],
            errorTextFunc: ({ node, actual, opts }) => createEventuallyAnyMessage(node, "value", "have", actual, opts.timeout)
        },
        list: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyValue(opts), () => node.eventually.not.hasAnyValue(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any value', opts.timeout)
        },
        map: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyValue(opts), () => node.eventually.not.hasAnyValue(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any value', opts.timeout)
        },
        group: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyValue(opts), () => node.eventually.not.hasAnyValue(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, "have any value", opts.timeout)
        }
    }),
};
function expectElement(element) {
    return expect(element);
}
exports.expectElement = expectElement;
function expectList(list) {
    return expect(list);
}
exports.expectList = expectList;
function expectMap(map) {
    return expect(map);
}
exports.expectMap = expectMap;
function expectGroup(group) {
    return expect(group);
}
exports.expectGroup = expectGroup;
//# sourceMappingURL=matchers.js.map