"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Encapsulates arbitrary page element types.
// Exposes its content directly as its own members,
// so each key in content can be accessed via dot notation.
//
// Naming Convention:
// - all content members must start with a lower case letter
// - all group functions must start with upper case letter
// - all private members of group must start with _
class PageElementGroup {
    constructor({ id, content, walkerType, walkerOptions }) {
        const self = this;
        // merge content directly into group object,
        // so it can be accessed via dot notation
        for (const key in content) {
            if (content.hasOwnProperty(key)) {
                if (key.length >= 2 && key.substring(0, 2) === '__') {
                    throw new Error(`Content nodes must not start with '__': ${key}`);
                }
                else if (/^[A-Z]/.test(key)) {
                    throw new Error(`Content nodes must not start with capital letters: ${key}`);
                }
                else {
                    self[key] = content[key];
                }
            }
        }
        this.__id = id;
        this.__walker = new walkerType(walkerOptions);
        this.__content = content;
    }
    __getNodeId() {
        return this.__id;
    }
    toJSON() {
        return {
            pageNodeType: this.constructor.name,
            nodeId: this.__id
        };
    }
    Solve(problem, options = { throwUnmatchedKey: true, throwSolveError: true }) {
        return this.__walker.walk(problem, this.__content, options);
    }
}
exports.PageElementGroup = PageElementGroup;
//# sourceMappingURL=PageElementGroup.js.map