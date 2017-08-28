"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PageNode {
    // available options:
    // - wait -> initial wait operation: exist, visible, text, value
    constructor(selector, { store, wait = "visible" /* visible */, timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default }) {
        this.selector = selector;
        this.store = store;
        this.wait = wait;
        this.timeout = timeout;
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