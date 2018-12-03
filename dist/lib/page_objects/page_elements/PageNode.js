"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PageNode {
    // available options:
    // - wait -> initial wait operation: exist, visible, text, value
    constructor(_selector, { store }) {
        this._selector = _selector;
        this._store = store;
    }
    __getNodeId() {
        return this._selector;
    }
    __toJSON() {
        return {
            pageNodeType: this.constructor.name,
            nodeId: this._selector
        };
    }
    getSelector() {
        return this._selector;
    }
}
exports.PageNode = PageNode;
//# sourceMappingURL=PageNode.js.map