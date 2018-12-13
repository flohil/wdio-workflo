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
    toJSON() {
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
    /**
     * Executes func and, if an error occurs during execution of func,
     * throws a custom error message that the page element could not be located on the page.
     * @param func
     */
    __execute(func) {
        try {
            return func();
        }
        catch (error) {
            if (error.message.includes('could not be located on the page')) {
                const errorMsg = `${this.constructor.name} could not be located on the page.\n` +
                    `( ${this.getSelector()} )`;
                throw new Error(errorMsg);
            }
            else {
                throw error;
            }
        }
    }
    __eventually(func) {
        try {
            func();
            return true;
        }
        catch (error) {
            if (error.message.includes('could not be located on the page')) {
                throw error;
            }
            else if (error.type === 'WaitUntilTimeoutError') {
                return false;
            }
            else {
                throw error;
            }
        }
    }
    __wait(func, errorMessage, timeout) {
        try {
            func();
        }
        catch (error) {
            this._handleWaitError(error, errorMessage, timeout);
        }
        return this;
    }
    __waitUntil(waitFunc, errorMessageFunc, timeout, interval) {
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
            }, timeout, '', interval);
        }
        catch (untilError) {
            error = error || untilError;
            this._handleWaitError(error, errorMessageFunc(), timeout);
        }
        return this;
    }
    _handleWaitError(error, errorMessage, timeout) {
        if (error.message.includes('could not be located on the page')) {
            throw new Error(`${this.constructor.name} could not be located on the page within ${timeout}ms.\n` +
                `( ${this.getSelector()} )`);
        }
        else if ('type' in error && error.type === 'WaitUntilTimeoutError') {
            const waitError = new Error(`${this.constructor.name}${errorMessage} within ${timeout}ms.\n( ${this.getSelector()} )`);
            waitError.type = 'WaitUntilTimeoutError';
            throw waitError;
        }
        else {
            throw error;
        }
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
}
exports.PageNodeWait = PageNodeWait;
class PageNodeEventually {
    constructor(node) {
        this._node = node;
    }
}
exports.PageNodeEventually = PageNodeEventually;
//# sourceMappingURL=PageNode.js.map