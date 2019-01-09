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
const _ = require("lodash");
const page_objects_1 = require("./page_objects");
const util_1 = require("./utility_functions/util");
const helpers_1 = require("./helpers");
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
function createBaseMatcher(compareFuncs, ensureOpts = false, withoutExpected = []) {
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
                let optsWithTimeout = ((typeof opts === 'object' && opts !== null) || !!opts) ? opts : Object.create(null);
                if (typeof optsWithTimeout === 'object' && !optsWithTimeout['timeout']) {
                    optsWithTimeout.timeout = node.__lastDiff.timeout;
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
exports.createBaseMatcher = createBaseMatcher;
function createMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, false);
}
exports.createMatcher = createMatcher;
function createMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createBaseMatcher(compareFuncs, false, withoutExpected);
}
exports.createMatcherWithoutExpected = createMatcherWithoutExpected;
function createEventuallyMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, true);
}
exports.createEventuallyMatcher = createEventuallyMatcher;
function createEventuallyMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createBaseMatcher(compareFuncs, true, withoutExpected);
}
exports.createEventuallyMatcherWithoutExpected = createEventuallyMatcherWithoutExpected;
function createTextMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, false);
}
exports.createTextMatcher = createTextMatcher;
function createTextMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createBaseMatcher(compareFuncs, false, withoutExpected);
}
exports.createTextMatcherWithoutExpected = createTextMatcherWithoutExpected;
function createEventuallyTextMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, true);
}
exports.createEventuallyTextMatcher = createEventuallyTextMatcher;
function createEventuallyTextMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createBaseMatcher(compareFuncs, true, withoutExpected);
}
exports.createEventuallyTextMatcherWithoutExpected = createEventuallyTextMatcherWithoutExpected;
function createBooleanMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs);
}
exports.createBooleanMatcher = createBooleanMatcher;
function createBooleanMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createBaseMatcher(compareFuncs, false, withoutExpected);
}
exports.createBooleanMatcherWithoutExpected = createBooleanMatcherWithoutExpected;
function createEventuallyBooleanMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, true);
}
exports.createEventuallyBooleanMatcher = createEventuallyBooleanMatcher;
function createEventuallyBooleanMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createBaseMatcher(compareFuncs, true, withoutExpected);
}
exports.createEventuallyBooleanMatcherWithoutExpected = createEventuallyBooleanMatcherWithoutExpected;
function createValueMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs);
}
exports.createValueMatcher = createValueMatcher;
function createValueMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createBaseMatcher(compareFuncs, false, withoutExpected);
}
exports.createValueMatcherWithoutExpected = createValueMatcherWithoutExpected;
function createEventuallyValueMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, true);
}
exports.createEventuallyValueMatcher = createEventuallyValueMatcher;
function createEventuallyValueMatcherWithoutExpected(compareFuncs, withoutExpected = ['element', 'list', 'map', 'group']) {
    return createBaseMatcher(compareFuncs, true, withoutExpected);
}
exports.createEventuallyValueMatcherWithoutExpected = createEventuallyValueMatcherWithoutExpected;
function createListLengthMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, false);
}
exports.createListLengthMatcher = createListLengthMatcher;
function createEventuallyListLengthMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, false);
}
exports.createEventuallyListLengthMatcher = createEventuallyListLengthMatcher;
function createAttributeMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, false);
}
exports.createAttributeMatcher = createAttributeMatcher;
function createEventuallyAttributeMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, false);
}
exports.createEventuallyAttributeMatcher = createEventuallyAttributeMatcher;
function createLocationMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, false);
}
exports.createLocationMatcher = createLocationMatcher;
function createEventuallyLocationMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, false);
}
exports.createEventuallyLocationMatcher = createEventuallyLocationMatcher;
function createSizeMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, false);
}
exports.createSizeMatcher = createSizeMatcher;
function createEventuallySizeMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, false);
}
exports.createEventuallySizeMatcher = createEventuallySizeMatcher;
function createNumberWithToleranceMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, false);
}
exports.createNumberWithToleranceMatcher = createNumberWithToleranceMatcher;
function createEventuallyNumberWithToleranceMatcher(compareFuncs) {
    return createBaseMatcher(compareFuncs, false);
}
exports.createEventuallyNumberWithToleranceMatcher = createEventuallyNumberWithToleranceMatcher;
// ERROR TEXT FUNCTIONS
function convertDiffToMessages(diff, actualOnly = false, includeTimeouts = false, timeout = undefined, comparisonLines = [], paths = []) {
    if (diff.tree && Object.keys(diff.tree).length > 0) {
        const keys = Object.keys(diff.tree);
        keys.forEach(key => {
            const _paths = [...paths];
            _paths.push(key);
            convertDiffToMessages(diff.tree[key], actualOnly, includeTimeouts, timeout, comparisonLines, _paths);
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
        const timeoutStr = (includeTimeouts) ? ` within ${timeout || diff.timeout}ms` : '';
        comparisonLines.push(`${diff.constructorName} at path '${_paths}'${timeoutStr}\n${compareStr}( ${diff.selector} )`);
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
        ` to eventually ${errorText} within ${timeout}ms`,
        ` not to eventually ${notErrorText} within ${timeout}ms`
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
        `'s ${property} "${_actual}" to eventually ${comparison} "${_expected}" within ${timeout}ms`,
        `'s ${property} "${_actual}" not to eventually ${comparison} "${_expected}" within ${timeout}ms`
    ]);
}
exports.createEventuallyPropertyMessage = createEventuallyPropertyMessage;
function createEventuallyAnyMessage(node, property, comparison, actual, timeout) {
    const _actual = printValue(actual);
    return createBaseMessage(node, [
        ` to eventually ${comparison} any ${property} within ${timeout}ms`,
        ` to eventually ${comparison} no ${property} within ${timeout}ms but had ${property} "${_actual}"`,
    ]);
}
exports.createEventuallyAnyMessage = createEventuallyAnyMessage;
function createEachMessage(node, errorTexts, actualOnly = false, includeTimeouts = false, timeout = undefined) {
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
    const comparisonLines = convertDiffToMessages(node.__lastDiff, actualOnly, includeTimeouts, timeout);
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
        errorTexts.map(errorText => `eventually ${errorText}`) :
        `eventually ${errorTexts}`;
    return createEachMessage(node, within, false, true, timeout);
}
exports.createEventuallyEachMessage = createEventuallyEachMessage;
function createEventuallyAnyEachMessage(node, errorTexts, timeout) {
    const within = _.isArray(errorTexts) ?
        errorTexts.map(errorText => `eventually ${errorText}`) :
        `eventually ${errorTexts}`;
    return createEachMessage(node, within, true, true, timeout);
}
exports.createEventuallyAnyEachMessage = createEventuallyAnyEachMessage;
// MATCHERS
exports.elementMatchers = {
    toBeSelected: createMatcherWithoutExpected({
        element: {
            resultFunc: ({ node }) => [() => node.currently.isSelected(), () => node.currently.not.isSelected()],
            errorTextFunc: ({ node }) => createMessage(node, "be selected")
        }
    }),
    toEventuallyBeSelected: createEventuallyMatcherWithoutExpected({
        element: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.isSelected(opts), () => node.eventually.not.isSelected(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyMessage(node, "be selected", opts.timeout)
        }
    }),
    toBeChecked: createMatcherWithoutExpected({
        element: {
            resultFunc: ({ node }) => [() => node.currently.isChecked(), () => node.currently.not.isChecked()],
            errorTextFunc: ({ node }) => createMessage(node, "be checked")
        }
    }),
    toEventuallyBeChecked: createEventuallyMatcherWithoutExpected({
        element: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.isChecked(opts), () => node.eventually.not.isChecked(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyMessage(node, "be checked", opts.timeout)
        }
    }),
    toHaveHTML: createTextMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasHTML(expected), () => node.currently.not.hasHTML(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'HTML', 'be', actual, expected)
        }
    }),
    toEventuallyHaveHTML: createEventuallyTextMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasHTML(expected, opts), () => node.eventually.not.hasHTML(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'HTML', 'be', actual, expected, opts.timeout)
        }
    }),
    toHaveAnyHTML: createTextMatcherWithoutExpected({
        element: {
            resultFunc: ({ node }) => [
                () => node.currently.hasAnyHTML(), () => node.currently.not.hasAnyHTML()
            ],
            errorTextFunc: ({ node, actual }) => createAnyMessage(node, "HTML", "have", actual)
        }
    }),
    toEventuallyHaveAnyHTML: createEventuallyTextMatcherWithoutExpected({
        element: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyHTML(opts), () => node.eventually.not.hasAnyHTML(opts)
            ],
            errorTextFunc: ({ node, actual, opts }) => createEventuallyAnyMessage(node, "HTML", "have", actual, opts.timeout)
        }
    }),
    toContainHTML: createTextMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsHTML(expected), () => node.currently.not.containsHTML(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'HTML', 'contain', actual, expected)
        }
    }),
    toEventuallyContainHTML: createEventuallyTextMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsHTML(expected, opts), () => node.eventually.not.containsHTML(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'HTML', 'contain', actual, expected, opts.timeout)
        }
    }),
    toHaveAttribute: createAttributeMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasAttribute(expected), () => node.currently.not.hasAttribute(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, expected.name, 'be', actual, expected.value)
        }
    }),
    toEventuallyHaveAttribute: createEventuallyAttributeMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasAttribute(expected, opts), () => node.eventually.not.hasAttribute(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, expected.name, 'be', actual, expected.value, opts.timeout)
        }
    }),
    toHaveAnyAttribute: createTextMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasAnyAttribute(expected),
                () => node.currently.not.hasAnyAttribute(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createBaseMessage(node, [
                ` to have any ${expected}`,
                ` to have no ${expected} but had ${expected} "${actual}"`
            ])
        }
    }),
    toEventuallyHaveAnyAttribute: createEventuallyTextMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasAnyAttribute(expected, opts),
                () => node.eventually.not.hasAnyAttribute(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createBaseMessage(node, [
                ` to have any ${expected} within ${opts.timeout}ms`,
                ` to have no ${expected} within ${opts.timeout}ms but had ${expected} "${actual}"`
            ])
        }
    }),
    toContainAttribute: createAttributeMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsAttribute(expected),
                () => node.currently.not.containsAttribute(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, expected.name, 'contain', actual, expected.value)
        }
    }),
    toEventuallyContainAttribute: createEventuallyAttributeMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsAttribute(expected, opts),
                () => node.eventually.not.containsAttribute(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, expected.name, 'contain', actual, expected.value, opts.timeout)
        }
    }),
    toHaveClass: createTextMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasClass(expected), () => node.currently.not.hasClass(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'class', 'be', actual, expected)
        }
    }),
    toEventuallyHaveClass: createEventuallyTextMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasClass(expected, opts), () => node.eventually.not.hasClass(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'class', 'be', actual, expected, opts.timeout)
        }
    }),
    toHaveAnyClass: createTextMatcherWithoutExpected({
        element: {
            resultFunc: ({ node }) => [
                () => node.currently.hasAnyClass(), () => node.currently.not.hasAnyClass()
            ],
            errorTextFunc: ({ node, actual }) => createAnyMessage(node, "class", "have", actual)
        }
    }),
    toEventuallyHaveAnyClass: createEventuallyTextMatcherWithoutExpected({
        element: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyClass(opts), () => node.eventually.not.hasAnyClass(opts)
            ],
            errorTextFunc: ({ node, actual, opts }) => createEventuallyAnyMessage(node, "class", "have", actual, opts.timeout)
        }
    }),
    toContainClass: createTextMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsClass(expected), () => node.currently.not.containsClass(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'class', 'contain', actual, expected)
        }
    }),
    toEventuallyContainClass: createEventuallyTextMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsClass(expected, opts), () => node.eventually.not.containsClass(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'class', 'contain', actual, expected, opts.timeout)
        }
    }),
    toHaveId: createTextMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasId(expected), () => node.currently.not.hasId(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'id', 'be', actual, expected)
        }
    }),
    toEventuallyHaveId: createEventuallyTextMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasId(expected, opts), () => node.eventually.not.hasId(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'id', 'be', actual, expected, opts.timeout)
        }
    }),
    toHaveAnyId: createTextMatcherWithoutExpected({
        element: {
            resultFunc: ({ node }) => [
                () => node.currently.hasAnyId(), () => node.currently.not.hasAnyId()
            ],
            errorTextFunc: ({ node, actual }) => createAnyMessage(node, "id", "have", actual)
        }
    }),
    toEventuallyHaveAnyId: createEventuallyTextMatcherWithoutExpected({
        element: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyId(opts), () => node.eventually.not.hasAnyId(opts)
            ],
            errorTextFunc: ({ node, actual, opts }) => createEventuallyAnyMessage(node, "id", "have", actual, opts.timeout)
        }
    }),
    toContainId: createTextMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsId(expected), () => node.currently.not.containsId(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'id', 'contain', actual, expected)
        }
    }),
    toEventuallyContainId: createEventuallyTextMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsId(expected, opts), () => node.eventually.not.containsId(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'id', 'contain', actual, expected, opts.timeout)
        }
    }),
    toHaveName: createTextMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasName(expected), () => node.currently.not.hasName(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'name', 'be', actual, expected)
        }
    }),
    toEventuallyHaveName: createEventuallyTextMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasName(expected, opts), () => node.eventually.not.hasName(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'name', 'be', actual, expected, opts.timeout)
        }
    }),
    toHaveAnyName: createTextMatcherWithoutExpected({
        element: {
            resultFunc: ({ node }) => [
                () => node.currently.hasAnyName(), () => node.currently.not.hasAnyName()
            ],
            errorTextFunc: ({ node, actual }) => createAnyMessage(node, "name", "have", actual)
        }
    }),
    toEventuallyHaveAnyName: createEventuallyTextMatcherWithoutExpected({
        element: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyName(opts), () => node.eventually.not.hasAnyName(opts)
            ],
            errorTextFunc: ({ node, actual, opts }) => createEventuallyAnyMessage(node, "name", "have", actual, opts.timeout)
        }
    }),
    toContainName: createTextMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsName(expected), () => node.currently.not.containsName(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'name', 'contain', actual, expected)
        }
    }),
    toEventuallyContainName: createEventuallyTextMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsName(expected, opts), () => node.eventually.not.containsName(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'name', 'contain', actual, expected, opts.timeout)
        }
    }),
    toHaveLocation: createLocationMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.currently.hasLocation(expected, opts), () => node.currently.not.hasLocation(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createPropertyMessage(node, 'location', (opts && (opts.x > 0 || opts.y > 0)) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts))
        }
    }),
    toEventuallyHaveLocation: createEventuallyLocationMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasLocation(expected, opts), () => node.eventually.not.hasLocation(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'location', (opts.tolerances && (opts.tolerances.x > 0 || opts.tolerances.y > 0)) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerances), opts.timeout)
        }
    }),
    toHaveX: createNumberWithToleranceMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.currently.hasX(expected, opts), () => node.currently.not.hasX(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createPropertyMessage(node, 'X-coordinate', (typeof opts === 'number' && opts > 0) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, (typeof opts === 'number') ? opts : undefined))
        }
    }),
    toEventuallyHaveX: createEventuallyNumberWithToleranceMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasX(expected, opts), () => node.eventually.not.hasX(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'X-coordinate', (opts.tolerance && opts.tolerance > 0) ? 'be in range ' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerance), opts.timeout)
        }
    }),
    toHaveY: createNumberWithToleranceMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.currently.hasY(expected, opts), () => node.currently.not.hasY(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createPropertyMessage(node, 'Y-coordinate', (typeof opts === 'number' && opts > 0) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, (typeof opts === 'number') ? opts : undefined))
        }
    }),
    toEventuallyHaveY: createEventuallyNumberWithToleranceMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasY(expected, opts), () => node.eventually.not.hasY(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'Y-coordinate', (opts.tolerance && opts.tolerance > 0) ? 'be in range ' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerance), opts.timeout)
        }
    }),
    toHaveSize: createSizeMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.currently.hasSize(expected, opts), () => node.currently.not.hasSize(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createPropertyMessage(node, 'size', (opts && (opts.width > 0 || opts.height > 0)) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts))
        }
    }),
    toEventuallyHaveSize: createEventuallySizeMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasSize(expected, opts), () => node.eventually.not.hasSize(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'size', (opts.tolerances && (opts.tolerances.width > 0 || opts.tolerances.height > 0)) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerances), opts.timeout)
        }
    }),
    toHaveWidth: createNumberWithToleranceMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.currently.hasWidth(expected, opts), () => node.currently.not.hasWidth(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createPropertyMessage(node, 'width', (typeof opts === 'number' && opts > 0) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, (typeof opts === 'number') ? opts : undefined))
        }
    }),
    toEventuallyHaveWidth: createEventuallyNumberWithToleranceMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasWidth(expected, opts), () => node.eventually.not.hasWidth(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'width', (opts.tolerance && opts.tolerance > 0) ? 'be in range ' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerance), opts.timeout)
        }
    }),
    toHaveHeight: createNumberWithToleranceMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.currently.hasHeight(expected, opts), () => node.currently.not.hasHeight(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createPropertyMessage(node, 'height', (typeof opts === 'number' && opts > 0) ? 'be in range' : 'be', actual, helpers_1.tolerancesToString(expected, (typeof opts === 'number') ? opts : undefined))
        }
    }),
    toEventuallyHaveHeight: createEventuallyNumberWithToleranceMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasHeight(expected, opts), () => node.eventually.not.hasHeight(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'height', (opts.tolerance && opts.tolerance > 0) ? 'be in range ' : 'be', actual, helpers_1.tolerancesToString(expected, opts.tolerance), opts.timeout)
        }
    })
};
exports.listMatchers = {
    toBeEmpty: createMatcherWithoutExpected({
        list: {
            resultFunc: ({ node }) => [
                () => node.currently.isEmpty(), () => node.currently.not.isEmpty()
            ],
            errorTextFunc: ({ node, actual }) => createBaseMessage(node, [` with length ${actual} to be empty`, ` not to be empty`])
        },
    }),
    toHaveLength: createListLengthMatcher({
        list: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.currently.hasLength(expected, opts), () => node.currently.not.hasLength(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createBaseMessage(node, [
                `'s length ${actual} to be${util_1.comparatorStr(opts)} ${expected}`,
                `'s length ${actual} not to be${util_1.comparatorStr(opts)} ${expected}`
            ])
        },
    }),
    toEventuallyBeEmpty: createEventuallyMatcherWithoutExpected({
        list: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.isEmpty(opts), () => node.eventually.not.isEmpty(opts)
            ],
            errorTextFunc: ({ node, actual, opts }) => createBaseMessage(node, [` with length ${actual} to be empty within ${opts.timeout}ms`, ` not to be empty within ${opts.timeout}ms`])
        },
    }),
    toEventuallyHaveLength: createEventuallyListLengthMatcher({
        list: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasLength(expected, opts), () => node.eventually.not.hasLength(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createBaseMessage(node, [
                `'s length ${actual} to be${util_1.comparatorStr(opts.comparator)} ${expected} within ${opts.timeout}ms`,
                `'s length ${actual} not to be${util_1.comparatorStr(opts.comparator)} ${expected} within ${opts.timeout}ms`
            ])
        },
    })
};
exports.allMatchers = {
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
            errorTextFunc: ({ node }) => createEachMessage(node, 'have text')
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
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have text', opts.timeout)
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
            errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any text')
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
            errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any text', opts.timeout)
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
            errorTextFunc: ({ node }) => createEachMessage(node, 'contain text')
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
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain text', opts.timeout)
        }
    }),
    toHaveDirectText: createTextMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasDirectText(expected), () => node.currently.not.hasDirectText(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'direct text', 'be', actual, expected)
        },
        list: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasDirectText(expected), () => node.currently.not.hasDirectText(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, 'have direct text')
        },
        map: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasDirectText(expected), () => node.currently.not.hasDirectText(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, 'have direct text')
        },
        group: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.hasDirectText(expected), () => node.currently.not.hasDirectText(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, 'have direct text')
        }
    }),
    toEventuallyHaveDirectText: createEventuallyTextMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasDirectText(expected, opts), () => node.eventually.not.hasDirectText(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'direct text', 'be', actual, expected, opts.timeout)
        },
        list: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasDirectText(expected, opts), () => node.eventually.not.hasDirectText(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have direct text', opts.timeout)
        },
        map: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasDirectText(expected, opts), () => node.eventually.not.hasDirectText(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have direct text', opts.timeout)
        },
        group: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.hasDirectText(expected, opts), () => node.eventually.not.hasDirectText(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have direct text', opts.timeout)
        }
    }),
    toHaveAnyDirectText: createTextMatcherWithoutExpected({
        element: {
            resultFunc: ({ node }) => [
                () => node.currently.hasAnyDirectText(), () => node.currently.not.hasAnyDirectText()
            ],
            errorTextFunc: ({ node, actual }) => createAnyMessage(node, "direct text", "have", actual)
        },
        list: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.hasAnyDirectText(opts), () => node.currently.not.hasAnyDirectText(opts)
            ],
            errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any direct text')
        },
        map: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.hasAnyDirectText(opts), () => node.currently.not.hasAnyDirectText(opts)
            ],
            errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any direct text')
        },
        group: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.hasAnyDirectText(opts), () => node.currently.not.hasAnyDirectText(opts)
            ],
            errorTextFunc: ({ node }) => createAnyEachMessage(node, 'have any direct text')
        }
    }),
    toEventuallyHaveAnyDirectText: createEventuallyTextMatcherWithoutExpected({
        element: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyDirectText(opts), () => node.eventually.not.hasAnyDirectText(opts)
            ],
            errorTextFunc: ({ node, actual, opts }) => createEventuallyAnyMessage(node, "direct text", "have", actual, opts.timeout)
        },
        list: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyDirectText(opts), () => node.eventually.not.hasAnyDirectText(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any direct text', opts.timeout)
        },
        map: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyDirectText(opts), () => node.eventually.not.hasAnyDirectText(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any direct text', opts.timeout)
        },
        group: {
            resultFunc: ({ node, opts }) => [
                () => node.eventually.hasAnyDirectText(opts), () => node.eventually.not.hasAnyDirectText(opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyAnyEachMessage(node, 'have any direct text', opts.timeout)
        }
    }),
    toContainDirectText: createTextMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsDirectText(expected), () => node.currently.not.containsDirectText(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'direct text', 'contain', actual, expected)
        },
        list: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsDirectText(expected), () => node.currently.not.containsDirectText(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, 'contain direct text')
        },
        map: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsDirectText(expected), () => node.currently.not.containsDirectText(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, 'contain direct text')
        },
        group: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsDirectText(expected), () => node.currently.not.containsDirectText(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, 'contain direct text')
        }
    }),
    toEventuallyContainDirectText: createEventuallyTextMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsDirectText(expected, opts),
                () => node.eventually.not.containsDirectText(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'direct text', 'contain', actual, expected, opts.timeout)
        },
        list: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsDirectText(expected, opts),
                () => node.eventually.not.containsDirectText(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain direct text', opts.timeout)
        },
        map: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsDirectText(expected, opts),
                () => node.eventually.not.containsDirectText(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain direct text', opts.timeout)
        },
        group: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsDirectText(expected, opts),
                () => node.eventually.not.containsDirectText(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain direct text', opts.timeout)
        }
    })
};
exports.valueAllMatchers = {
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
            errorTextFunc: ({ node }) => createEachMessage(node, 'have value')
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
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'have value', opts.timeout)
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
    toContainValue: createValueMatcher({
        element: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsValue(expected), () => node.currently.not.containsValue(expected)
            ],
            errorTextFunc: ({ node, actual, expected }) => createPropertyMessage(node, 'value', 'contain', actual, expected)
        },
        list: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsValue(expected), () => node.currently.not.containsValue(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, 'contain value')
        },
        map: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsValue(expected), () => node.currently.not.containsValue(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, 'contain value')
        },
        group: {
            resultFunc: ({ node, expected }) => [
                () => node.currently.containsValue(expected), () => node.currently.not.containsValue(expected)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, "contain value")
        }
    }),
    toEventuallyContainValue: createEventuallyValueMatcher({
        element: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsValue(expected, opts), () => node.eventually.not.containsValue(expected, opts)
            ],
            errorTextFunc: ({ node, actual, expected, opts }) => createEventuallyPropertyMessage(node, 'value', 'contain', actual, expected, opts.timeout)
        },
        list: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsValue(expected, opts), () => node.eventually.not.containsValue(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain value', opts.timeout)
        },
        map: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsValue(expected, opts), () => node.eventually.not.containsValue(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, 'contain value', opts.timeout)
        },
        group: {
            resultFunc: ({ node, expected, opts }) => [
                () => node.eventually.containsValue(expected, opts), () => node.eventually.not.containsValue(expected, opts)
            ],
            errorTextFunc: ({ node, opts }) => createEventuallyEachMessage(node, "contain value", opts.timeout)
        }
    })
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