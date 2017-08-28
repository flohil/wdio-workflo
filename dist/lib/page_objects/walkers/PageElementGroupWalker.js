"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const page_elements_1 = require("../page_elements");
// Solves a problem on all nodes inside a context recursively.
class PageElementGroupWalker {
    constructor(options) {
    }
    // This function traverses a Group and performs a function
    // on each walked node.
    //
    // __walkGroup must be passed a problem object, which consists 
    // of a solve function and a values object.
    // For more details on the problem object, see 
    // page_objects/core/page_elements/ElementGroup.
    //
    // The optional options object can be used to parameterize the 
    // walker's behavior. 
    //
    // If options.throwUnmachtedKeys is set to true,
    // an error will be thrown if a key of the problem.values object
    // did not match any node in the walked group.
    // Default: true
    // If options.throwSolveError is set to true, the walker will throw
    // any errors happening in the solve function.
    // If options.throwSolveError is set to false, the walker will not
    // throw errors happening in the solve function and write them
    // into the result object instead.
    // Default: true
    walk(problem, content, options = { throwUnmatchedKey: true, throwSolveError: true }) {
        const results = Object.create(Object.prototype);
        const walkNodes = problem.values || content;
        // solve problem only for nodes which support operation
        // in case of lists or groups -> dont add result if no child
        // element node supported operation
        // execute problem on each node in group
        for (const key in walkNodes) {
            if (walkNodes.hasOwnProperty(key)) {
                const node = content[key];
                // group has a node matching key
                if (node) {
                    const values = (problem.values) ?
                        problem.values[key] :
                        undefined;
                    if (node instanceof page_elements_1.PageElement) {
                        const solveResults = this.solveElement(problem, node, values, options);
                        if (solveResults.nodeSupported) {
                            results[key] = solveResults.result;
                        }
                    }
                    else if (node instanceof page_elements_1.PageElementList) {
                        const solveResults = this.solveList(problem, node, values, options);
                        if (Object.keys(solveResults).length > 0) {
                            results[key] = solveResults;
                        }
                    }
                    else if (node instanceof page_elements_1.PageElementGroup) {
                        const solveResults = this.solveGroup(problem, node, values, options);
                        if (Object.keys(solveResults).length > 0) {
                            results[key] = solveResults;
                        }
                    }
                    else {
                        throw new Error(`Unknown Element Type: ${node.constructor.name}`);
                    }
                }
                else if (options.throwUnmatchedKey) {
                    throw new Error(`Key ${key} did not match any node name in context: ${content}`);
                }
            }
        }
        return results;
    }
    // Solves a problem for a single page element, 
    // passing value as a parameter to solve the problem.
    // Returns the problem's solution as a result.
    //
    // If throwSolveError is true, function will throw an 
    // any errors occuring during the problem solution.
    // If throwSolverError is false, any errors occuring
    // during the problem solution will be written into the
    // returned result.
    solveElement(problem, element, value, options) {
        try {
            return problem.solve(element, value);
        }
        catch (error) {
            if (options.throwSolveError) {
                throw error;
            }
            else {
                return {
                    nodeSupported: true,
                    result: error
                };
            }
        }
    }
    // Solves a problem on a subgroup.
    solveGroup(problem, group, values, options) {
        // change context of problem's values to match subgroup
        problem.values = values;
        return group.Solve(problem, options);
    }
    // Solves a problem for a list of page elements. 
    // Works only if identifier is set on list of elements.
    // Returns on object with the keys taken form identifiedObject 
    // and values taken form solved function.
    solveList(problem, list, values, options) {
        const results = Object.create(Object.prototype);
        const identifiedObject = list.identify();
        if (typeof list.identify() === 'undefined') {
            throw new Error(`Walker could not identify list ${list.__getNodeId()}: Please set a list identifier before calling a group function!`);
        }
        for (const key in values) {
            if (identifiedObject.hasOwnProperty(key)) {
                let value = undefined;
                if (values) {
                    if (key in values && values.hasOwnProperty(key)) {
                        value = values[key];
                    }
                    else if (options.throwUnmatchedKey) {
                        throw new Error(`Key ${key} did not match any node name in context: ${values}`);
                    }
                }
                const solveResults = this.solveElement(problem, identifiedObject[key], value, options);
                if (solveResults.nodeSupported) {
                    results[key] = solveResults.result;
                }
            }
        }
        return results;
    }
}
exports.PageElementGroupWalker = PageElementGroupWalker;
//# sourceMappingURL=PageElementGroupWalker.js.map