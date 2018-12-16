"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const page_objects_1 = require("./page_objects");
const _ = require("lodash");
// export interface ICompareElementFuncs {
//   element?: IMatcherArgs<elements.PageElement<stores.PageElementStore>, undefined, {timeout?: number}>,
//   list?: <
//     Store extends stores.PageElementStore,
//     PageElementType extends PageElement<Store>,
//     PageElementOptions,
//     PageElementListType extends PageElementList<Store, PageElementType, PageElementOptions>,
//     ExpectedType,
//     OptsType extends {timeout?: number}
//   >() => IMatcherArgs<PageElementListType, ExpectedType, OptsType>,
//   map?: <
//     Store extends stores.PageElementStore,
//     K extends string,
//     PageElementType extends PageElement<Store>,
//     PageElementOptions,
//     PageElementMapType extends PageElementMap<Store, K, PageElementType, PageElementOptions>,
//     ExpectedType,
//     OptsType extends {timeout?: number}
//   >() => IMatcherArgs<PageElementMapType, ExpectedType, OptsType>,
//   group?: <
//     Store extends stores.PageElementStore,
//     Content extends {[K in keyof Content] : Workflo.PageNode.INode},
//     PageElementGroupType extends PageElementGroup<Store, Content>,
//     ExpectedType,
//     OptsType extends {timeout?: number}
//   >() => IMatcherArgs<PageElementGroupType, ExpectedType, OptsType>,
// }
// MATCHER FUNCS
// export function expectElement<
//   Store extends stores.PageElementStore,
//   PageElementType extends elements.PageElement<Store>
// >(element: PageElementType) {
//   return expect(element)
// }
// export function expectList<
//   Store extends stores.PageElementStore,
//   PageElementType extends elements.PageElement<Store>,
//   PageElementOptions,
//   PageElementListType extends elements.PageElementList<Store, PageElementType, PageElementOptions>
// >(list: PageElementListType) {
//   return expect(list)
// }
// export function expectMap<
//   Store extends stores.PageElementStore,
//   K extends string,
//   PageElementType extends elements.PageElement<Store>,
//   PageElementOptions,
//   PageElementMapType extends elements.PageElementMap<Store, K, PageElementType, PageElementOptions>
// >(map: PageElementMapType) {
//   return expect(map)
// }
// export function expectGroup<
//   Store extends stores.PageElementStore,
//   Content extends {[K in keyof Content] : Workflo.PageNode.INode},
//   PageElementGroupType extends elements.PageElementGroup<Store, Content>
// >(group: PageElementGroupType) {
//   return expect(group)
// }
function matcher(compareFuncs, withoutExpected = false) {
    return (util, customEqualityTesters) => {
        function baseCompareFunction(node, negativeComparison, opts = Object.create(null), expected = undefined) {
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
            const successes = resultFunc({ node, expected, opts });
            const success = (negativeComparison) ? successes[1]() : successes[0]();
            if (!success) {
                let optsWithTimeout = opts || Object.create(null);
                if (typeof opts === 'undefined' || !opts['timeout']) {
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
        if (withoutExpected) {
            return {
                compare: (node, opts) => {
                    return baseCompareFunction(node, false, opts);
                },
                negativeCompare: (node, opts) => {
                    return baseCompareFunction(node, true, opts);
                }
            };
        }
        else {
            return {
                compare: (node, expected, opts) => {
                    return baseCompareFunction(node, false, opts, expected);
                },
                negativeCompare: (node, expected, opts) => {
                    return baseCompareFunction(node, true, opts, expected);
                }
            };
        }
    };
}
exports.matcher = matcher;
function matcherWithoutExpected(compareFuncs) {
    return matcher(compareFuncs, true);
}
exports.matcherWithoutExpected = matcherWithoutExpected;
function booleanMatcherWithoutExpected(compareFuncs) {
    return matcher(compareFuncs, true);
}
exports.booleanMatcherWithoutExpected = booleanMatcherWithoutExpected;
// export function createValueMatcher<
//   NodeType extends Workflo.PageNode.INode,
//   OptsType extends Object = {timeout?: number},
// >(
//   compareFuncs: ICompareValueElementFuncs,
// ) {
//   return create<NodeType, OptsType, undefined, ICompareValueElementFuncs>(compareFuncs, true)
// }
// export function createValueMatcherWithoutExpected<
//   NodeType extends Workflo.PageNode.INode,
//   OptsType extends Object = {timeout?: number},
// >(
//   compareFuncs: ICompareValueElementFuncs,
// ) {
//   return createMatcher<NodeType, OptsType, undefined, ICompareValueElementFuncs>(compareFuncs, true)
// }
// ERROR TEXT FUNCTIONS
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
        `Expected ${node.constructor.name} ${errorText}.\n( ${node.__getNodeId()} )`,
        `Expected ${node.constructor.name} not ${notErrorText}.\n( ${node.__getNodeId()} )`
    ];
}
exports.createBaseMessage = createBaseMessage;
function createPropertyMessage(node, property, comparison, actual, expected) {
    return createBaseMessage(node, [
        `'s ${property} "${actual}" to ${comparison} "${expected}"`,
        `'s ${property} "${actual}" not to ${comparison} "${expected}"`,
    ]);
}
exports.createPropertyMessage = createPropertyMessage;
function createEventuallyPropertyMessage(node, property, comparison, actual, expected, timeout) {
    return createBaseMessage(node, [
        `'s ${property} "${actual}" to eventually ${comparison} "${expected}" within ${timeout} ms`,
        `'s ${property} "${actual}" not to eventually ${comparison} "${expected}" within ${timeout} ms`
    ]);
}
exports.createEventuallyPropertyMessage = createEventuallyPropertyMessage;
function createEachMessage(node, errorTexts) {
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
    const comparisonLines = Object.keys(node.__lastDiff.tree).map(key => {
        const diff = node.__lastDiff.tree[key];
        return `[0] => ${diff.constructorName}\n` +
            `{actual: "${diff.actual}", expected: "${diff.expected}"}\n` +
            `( ${diff.selector} )`;
    });
    const comparisonList = comparisonLines.join('\n');
    return [
        `Expected each of ${node.constructor.name}'s elements ${errorText}:\n\n${comparisonList}`,
        `Expected each of ${node.constructor.name}'s elements not ${notErrorText}:\n\n${comparisonList}`
    ];
}
exports.createEachMessage = createEachMessage;
function createEventuallyEachMessage(node, errorTexts, timeout) {
    const within = _.isArray(errorTexts) ?
        errorTexts.map(errorText => `${errorText} within ${timeout}ms`) :
        `${errorTexts} within ${timeout}ms`;
    return createEachMessage(node, within);
}
exports.createEventuallyEachMessage = createEventuallyEachMessage;
// MATCHERS
exports.elementMatchers = {
    toExist: booleanMatcherWithoutExpected({
        element: {
            resultFunc: ({ node }) => [() => node.currently.exists(), () => node.currently.not.exists()],
            errorTextFunc: ({ node }) => createBaseMessage(node, "to exist")
        }
    }),
    toBeVisible: booleanMatcherWithoutExpected({
        element: {
            resultFunc: ({ node }) => [() => node.currently.isVisible(), () => node.currently.not.isVisible()],
            errorTextFunc: ({ node }) => createEachMessage(node, "to be visible")
        },
        list: {
            resultFunc: ({ node }) => [() => node.currently.isVisible(), () => node.currently.not.isVisible()],
            errorTextFunc: ({ node }) => createEachMessage(node, "to be visible")
        },
        map: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.isVisible(opts.filterMask), () => node.currently.not.isVisible(opts.filterMask)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, "to be visible")
        },
        group: {
            resultFunc: ({ node, opts }) => [
                () => node.currently.isVisible(opts.filterMask), () => node.currently.not.isVisible(opts.filterMask)
            ],
            errorTextFunc: ({ node }) => createEachMessage(node, "to be visible")
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
// toHaveValue: valueElementMatcherFunction(
//   ({node, expected}) => [
//     () => node.currently.hasValue(expected), () => node.currently.not.hasValue(expected)
//   ],
//   ({actual, expected, node}) => createPropertyMessage(
//     node, 'value', 'be', actual, node.__typeToString(expected)
//   )
// ),
// toHaveAnyValue: valueElementMatcherFunction(
//   ({node}) => [() => node.currently.hasAnyValue(), () => node.currently.not.hasAnyValue()],
//   ({node}) => createBaseMessage(node, "to have any value")
// ),
// toContainValue: valueElementMatcherFunction(
//   ({node, expected}) => [
//     () => node.currently.containsValue(expected), () => node.currently.not.containsValue(expected)
//   ],
//   ({actual, expected, node}) => createPropertyMessage(
//     node, 'value', 'contain', actual, node.__typeToString(expected)
//   )
// ),
// toEventuallyHaveValue: valueElementMatcherFunction(
//   ({node, expected, opts}) => [
//     () => node.eventually.hasValue(expected, opts),
//     () => node.eventually.not.hasValue(expected, opts)
//   ],
//   ({actual, expected, node, opts}) => createEventuallyPropertyMessage(
//     node, 'value', 'be', actual, node.__typeToString(expected), opts.timeout
//   )
// ),
// toEventuallyHaveAnyValue: valueElementMatcherFunction(
//   ({node, opts}) => [
//     () => node.eventually.hasAnyValue(opts),
//     () => node.eventually.not.hasAnyValue(opts)
//   ],
//   ({opts, node}) => createBaseMessage(
//     node, ` to eventually have any value within ${opts.timeout} ms`
//   )
// ),
// toEventuallyContainValue: valueElementMatcherFunction(
//   ({node, expected, opts}) => [
//     () => node.eventually.containsValue(expected, opts),
//     () => node.eventually.not.containsValue(expected, opts)
//   ],
//   ({actual, expected, node, opts}) => createEventuallyPropertyMessage(
//     node, 'value', 'contain', actual, node.__typeToString(expected), opts.timeout
//   )
// ),
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