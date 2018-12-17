"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
class Page {
    constructor(args) {
        this._elementStore = args.elementStore;
        this._timeout = args.timeout || JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || __1.DEFAULT_TIMEOUT;
        this._interval = args.interval || JSON.parse(process.env.WORKFLO_CONFIG).intervals.default || __1.DEFAULT_INTERVAL;
    }
    getTimeout() {
        return this._timeout;
    }
    getInterval() {
        return this._interval;
    }
    waitIsOpen(opts = Object.create(null)) {
        const timeout = opts.timeout || this._timeout;
        let error;
        try {
            browser.waitUntil(() => {
                try {
                    const result = this.isOpen();
                    error = undefined;
                    return result;
                }
                catch (funcError) {
                    error = funcError;
                }
            }, timeout, '', opts.interval || this._interval);
        }
        catch (untilError) {
            error = error || untilError;
            this._handleWaitError(error, timeout);
        }
    }
    eventuallyIsOpen(opts = Object.create(null)) {
        try {
            browser.waitUntil(() => this.isOpen(), opts.timeout || this._timeout, '', opts.interval || this._interval);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    _handleWaitError(error, timeout) {
        if ('type' in error && error.type === 'WaitUntilTimeoutError') {
            const waitError = new Error(`Waiting for page ${this.constructor.name} to be open within ${timeout}ms failed`);
            waitError.type = 'WaitUntilTimeoutError';
            throw waitError;
        }
        else {
            throw error;
        }
    }
}
exports.Page = Page;
//# sourceMappingURL=Page.js.map