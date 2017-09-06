"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PageNode {
    // available options:
    // - wait -> initial wait operation: exist, visible, text, value
    constructor(selector, { store }) {
        this.selector = selector;
        this.store = store;
    }
    __getNodeId() {
        return this.selector;
    }
    getSelector() {
        return this.selector;
    }
}
exports.PageNode = PageNode;
//# sourceMappingURL=PageNode.js.map