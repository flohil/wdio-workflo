"use strict";
// Define functions available to Page.group's __groupWalker
//
// All of these Functions MUST start with uppercase letters
// to avoid overwriting the groups' nodes!
//
// Each group function can be passed a list of fixed parameters
// and an optional options object.
// The optional options object has to be passed as last parameter
// and can container a "walker" key which is used to define
// the walker's behavior.
// The walker options get filtered out by Page.group() before
// passing the parameters to the group functions defined below.
//
// If options.walker.throwUnmachtedKeys is set to true,
// an error will be thrown if a key of the problem.values object
// did not match any node in the walked group.
// Default: true
// If options.walker.throwSolveError is set to true, the walker will 
// throw any errors happening in the solve function.
// If options.walker.throwSolveError is set to false, the walker will 
// not throw errors happening in the solve function and write them
// into the result object instead.
// Default: true
//
// Each group function must return a problem object, that may consist 
// of a solve function, a values object and a callback function.
// 
// The problem.solve function is an anonmyous function performed on 
// each walked node.
// It gets passed the node as first parameter and, if given,
// the matching value from the values object.
// Be aware that all nodes in group must support the operations
// performed in problem.solve!
// 
// The problem.values object describes a set of values, 
// mapped to the walked nodes by the values' keys and passed 
// to them during the solve function.
// If the problem.values object is defined, only the nodes
// matching a key inside problem.values object will be walked.
// If the problem.values object is not defined, all nodes in the 
// group will be walked.
//
// The optional problem.callback function is executed after the 
// group walker has finished walking the group nodes.
// It gets the results object as the first and the values object
// as the second parameter and can be used to check whether the
// results are valid while not failing at the first error.
Object.defineProperty(exports, "__esModule", { value: true });
// ADD YOUR OWN GROUP FUNCTIONS HERE
const groupFunctions = {
    // Retrieves node values.
    //
    // filter is optional and can either be a string, an array or
    // an object.
    // If filter is a string, the result will contain only the value of 
    // the node whose name matches the string.
    // If filter is an array, the result will contain only values
    // of nodes whose names are elements of the filter array.
    // If filter is an object, the result will contain only values
    // of nodes whose names are keys of the filter object,
    // regardless of the keys' values inside the filter object.
    GetValue(filter) {
        return {
            values: (filter) ? Workflo.Util.convertToObject(filter) : undefined,
            solve: (node) => node.getValue()
        };
    },
    // Retrieves text of walked nodes.
    //
    // filter is optional and can either be a string, an array or
    // an object.
    // If filter is a string, the result will contain only the text of 
    // the node whose name matches the string.
    // If filter is an array, the result will contain only text
    // of nodes whose names are elements of the filter array.
    // If filter is an object, the result will contain only text
    // of nodes whose names are keys of the filter object,
    // regardless of the keys' values inside the filter object.
    GetText(filter) {
        return {
            values: (filter) ? Workflo.Util.convertToObject(filter) : undefined,
            solve: (node) => node.getText()
        };
    },
    // Sets node values.
    //
    // values is an object used to set the values on the nodes.
    // values' keys will be used to match the values inside the values 
    // object to the values set on the walked nodes by the nodes' names.
    SetValue(values) {
        return {
            values: values,
            solve: (node, value) => node.setValue(value)
        };
    }
};
exports.default = groupFunctions;
//# sourceMappingURL=groupFunctions.js.map