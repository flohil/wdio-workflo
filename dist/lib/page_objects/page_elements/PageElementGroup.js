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
    constructor({ id, content }) {
        this._id = id;
        this._$ = content;
        this.currently = new PageElementGroupCurrently(this);
    }
    get $() {
        return this._$;
    }
    __toJSON() {
        return {
            pageNodeType: this.constructor.name,
            nodeId: this._id
        };
    }
    // GETTER FUNCTIONS
    __getNodeId() {
        return this._id;
    }
    getText(filter) {
        let result = {};
        for (const k in this.$) {
            if (isGetTextNode(this.$[k])) {
                const elem = this.$[k];
                if (filter) {
                    if (typeof filter[k] !== 'undefined') {
                        result[k] = elem.getText();
                    }
                }
                else {
                    result[k] = elem.getText();
                }
            }
        }
        return result;
    }
}
exports.PageElementGroup = PageElementGroup;
// type guards
function isGetTextNode(node) {
    return node.getText !== undefined;
}
class PageElementGroupCurrently {
    constructor(node) {
        this._node = node;
    }
    getText(filter) {
        let result = {};
        for (const k in this._node.$) {
            if (isGetTextNode(this._node.$[k])) {
                const elem = this._node.$[k];
                if (filter) {
                    if (typeof filter[k] !== 'undefined') {
                        result[k] = elem.currently.getText();
                    }
                }
                else {
                    result[k] = elem.currently.getText();
                }
            }
        }
        return result;
    }
}
exports.PageElementGroupCurrently = PageElementGroupCurrently;
//# sourceMappingURL=PageElementGroup.js.map