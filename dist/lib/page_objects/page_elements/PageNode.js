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
    toJSON() {
        return {
            pageNodeType: this.constructor.name,
            nodeId: this.selector
        };
    }
    getSelector() {
        return this.selector;
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
}
exports.PageNode = PageNode;
//# sourceMappingURL=PageNode.js.map