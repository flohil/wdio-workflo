"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PageNode {
    // available options:
    // - wait -> initial wait operation: exist, visible, text, value
    constructor(_selector, { store }) {
        this._selector = _selector;
        this.store = store;
    }
    __getNodeId() {
        return this._selector;
    }
    toJSON() {
        return {
            pageNodeType: this.constructor.name,
            nodeId: this._selector
        };
    }
    getSelector() {
        return this._selector;
    }
    _eventually(func) {
        try {
            func();
            return true;
        }
        catch (error) {
            return false;
        }
    }
    _wait(func, errorMessage) {
        try {
            func();
        }
        catch (error) {
            throw new Error(`${this.constructor.name}${errorMessage}.\n( ${this._selector} )`);
        }
        return this;
    }
}
exports.PageNode = PageNode;
//# sourceMappingURL=PageNode.js.map