"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PageNode {
    // available options:
    // - wait -> initial wait operation: exist, visible, text, value
    constructor(_selector, { store }) {
        this._selector = _selector;
        this._store = store;
        this.currently = new PageNodeCurrently(this);
        this.wait = new PageNodeWait(this);
        this.eventually = new PageNodeEventually(this);
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
    get __lastDiff() {
        const lastDiff = this._lastDiff || {};
        lastDiff.selector = this.getSelector();
        lastDiff.constructorName = this.constructor.name;
        return lastDiff;
    }
    __setLastDiff(diff) {
        this._lastDiff = diff;
    }
    getSelector() {
        return this._selector;
    }
}
exports.PageNode = PageNode;
class PageNodeCurrently {
    constructor(node) {
        this._node = node;
    }
}
exports.PageNodeCurrently = PageNodeCurrently;
class PageNodeWait {
    constructor(node) {
        this._node = node;
    }
    _wait(func, errorMessage, timeout) {
        try {
            func();
        }
        catch (error) {
            if (error.message.includes('could not be located on the page')) {
                throw new Error(`${this._node.constructor.name} could not be located on the page within ${timeout}ms.\n` +
                    `( ${this._node.getSelector()} )`);
            }
            else {
                throw new Error(`${this._node.constructor.name}${errorMessage} within ${timeout}ms.\n( ${this._node.getSelector()} )`);
            }
        }
        return this._node;
    }
    _waitUntil(waitFunc, errorMessageFunc, timeout) {
        let error;
        try {
            browser.waitUntil(() => {
                try {
                    const result = waitFunc();
                    error = undefined;
                    return result;
                }
                catch (funcError) {
                    error = funcError;
                }
            }, timeout);
        }
        catch (untilError) {
            error = error || untilError;
            if (error.message.includes('could not be located on the page')) {
                throw new Error(`${this._node.constructor.name} could not be located on the page within ${timeout}ms.\n` +
                    `( ${this._node.getSelector()} )`);
            }
            else {
                throw new Error(`${this._node.constructor.name}${errorMessageFunc()} within ${timeout}ms.\n( ${this._node.getSelector()} )`);
            }
        }
        return this._node;
    }
}
exports.PageNodeWait = PageNodeWait;
class PageNodeEventually {
    constructor(node) {
        this._node = node;
    }
}
exports.PageNodeEventually = PageNodeEventually;
//# sourceMappingURL=PageNode.js.map