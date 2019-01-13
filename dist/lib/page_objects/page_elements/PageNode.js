"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class serves as a base class for all PageElements, PageElementLists, PageElementMaps and PageElementGroups.
 *
 * @template Store type of the PageNodeStore used by PageNode to retrieve PageNodes from the store
 */
class PageNode {
    /**
     * PageNode serves as a base class for all PageElements, PageElementLists, PageElementMaps and PageElementGroups.
     *
     * @param selector the raw XPath selector of the PageNode
     * @param opts the options used to configure an instance of PageNode
     */
    constructor(selector, opts) {
        this._selector = selector;
        this._store = opts.store;
    }
    // INTERNAL GETTERS AND SETTERS
    __getNodeId() {
        return this._selector;
    }
    get __lastDiff() {
        const lastDiff = this._lastDiff || {};
        lastDiff.selector = this.__getNodeId();
        lastDiff.constructorName = this.constructor.name;
        return lastDiff;
    }
    __setLastDiff(diff) {
        this._lastDiff = diff;
    }
    // PUBLIC ACTIONS
    toJSON() {
        return {
            pageNodeType: this.constructor.name,
            nodeId: this._selector
        };
    }
    // COMMON HELPER FUNCTIONS
    /**
     * Executes func and trows any errors that occur during its execution.
     *
     * If an error occurs because an element could not be located on the page, throws a custom 'could not be located'
     * error message.
     *
     * @template ResultType the result type of the executed function
     * @param func the function to be executed
     * @returns the result value of the executed function
     */
    __execute(func) {
        try {
            return func();
        }
        catch (error) {
            if (error.message.includes('could not be located on the page')) {
                const errorMsg = `${this.constructor.name} could not be located on the page.\n` +
                    `( ${this.__getNodeId()} )`;
                throw new Error(errorMsg);
            }
            else {
                throw error;
            }
        }
    }
    /**
     * Provides custom error handling of 'could not be located' and 'WaitUntilTimeoutError' errors for functions that
     * check if a condition returns true within a specific timeout.
     *
     *
     * @param func the function which is supposed to return true within a specific timeout
     */
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
    /**
     * Provides custom error handling of 'could not be located' and 'WaitUntilTimeoutError' errors for functions that
     * wait for a condition to become true within a specific timeout and throw an error if the condition does not become
     * true.
     *
     *
     * @param func the function which is supposed to return true within a specific timeout and throws an error if the
     * condition does not become true
     * @param errorMessage an errorMessage that describes the condition which did not become true within a specific
     * timeout
     * @param timeout the timeout used to wait for the result of the passed func to return true
     * @returns this (an instance of PageNode)
     */
    __wait(func, errorMessage, timeout) {
        try {
            func();
        }
        catch (error) {
            this._handleWaitError(error, errorMessage, timeout);
        }
        return this;
    }
    /**
     * This function executes a waitFunc until it returns true or a specific timeout is reached.
     * If the return value of waitFunc does not become true within the timeout, this function throws a
     * 'WaitUntilTimeoutError'.
     *
     * __waitUntil also provides custom error handling for 'could not be located' errors.
     *
     *
     * @param waitFunc the function which is supposed to return true within a specific timeout
     * @param errorMessageFunc a function that returns an errorMessage which describes the condition that did not become
     * true within a specific timeout
     * @param timeout the timeout used to wait for the result of the waitFunc to return true
     * @param interval the interval used to check for the result of the waitFunc to return true
     * @returns this (an instance of PageNode)
     */
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
    /**
     * This function implements custom error handling for 'could not be located' and 'WaitUntilTimeoutError' errors.
     *
     * @param error an arbitrary type of error
     * @param errorMessage used to describe the failed condition check which caused a WaitUntilTimeoutError
     * @param timeout the timeout used to wait for an element to be located or for a wait condition to return true
     */
    _handleWaitError(error, errorMessage, timeout) {
        if (error.message.includes('could not be located on the page')) {
            throw new Error(`${this.constructor.name} could not be located on the page within ${timeout}ms.\n` +
                `( ${this.__getNodeId()} )`);
        }
        else if ('type' in error && error.type === 'WaitUntilTimeoutError') {
            const waitError = new Error(`${this.constructor.name}${errorMessage} within ${timeout}ms.\n( ${this.__getNodeId()} )`);
            waitError.type = 'WaitUntilTimeoutError';
            throw waitError;
        }
        else {
            throw error;
        }
    }
}
exports.PageNode = PageNode;
/**
 * This class defines all `currently` functions of PageNode.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the Page for which PageNodeCurrently defines all `currently` functions
 */
class PageNodeCurrently {
    /**
     * PageNodeCurrently defines all `currently` functions of PageNode.
     *
     * @param node PageNode for which PageNodeCurrently defines all `currently` functions
     */
    constructor(node) {
        this._node = node;
    }
}
exports.PageNodeCurrently = PageNodeCurrently;
/**
 * This class defines all `wait` functions of PageNode.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the Page for which PageNodeWait defines all `wait` functions
 */
class PageNodeWait {
    /**
     * PageNodeWait defines all `wait` functions of PageNode.
     *
     * @param node PageNode for which PageNodeWait defines all `wait` functions
     */
    constructor(node) {
        this._node = node;
    }
}
exports.PageNodeWait = PageNodeWait;
/**
 * This class defines all `eventually` functions of PageNode.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template PageElementType type of the Page for which PageNodeEventually defines all `eventually` functions
 */
class PageNodeEventually {
    /**
     * PageNodeEventually defines all `eventually` functions of PageNode.
     *
     * @param node PageNode for which PageNodeEventually defines all `eventually` functions
     */
    constructor(node) {
        this._node = node;
    }
}
exports.PageNodeEventually = PageNodeEventually;
//# sourceMappingURL=PageNode.js.map