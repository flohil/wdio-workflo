"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
class Page {
    constructor(args) {
        this._store = args.store;
        this._timeout = args.timeout || JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || __1.DEFAULT_TIMEOUT;
        this._interval = args.interval || JSON.parse(process.env.WORKFLO_CONFIG).intervals.default || __1.DEFAULT_INTERVAL;
        this.wait = new PageWait(this);
        this.eventually = new PageEventually(this);
    }
    getStore() {
        return this._store;
    }
    getTimeout() {
        return this._timeout;
    }
    getInterval() {
        return this._interval;
    }
}
exports.Page = Page;
class PageWait {
    constructor(page) {
        this._page = page;
    }
    _wait(conditionFunc, conditionMessage, opts = Object.create(null)) {
        const timeout = opts.timeout || this._page.getTimeout();
        const interval = opts.interval || this._page.getInterval();
        try {
            browser.waitUntil(() => conditionFunc(), timeout, '', interval);
        }
        catch (error) {
            if (error.type === 'WaitUntilTimeoutError') {
                const waitError = new Error(`Waiting for page ${this.constructor.name}${conditionMessage} within ${timeout}ms failed`);
                waitError.type = 'WaitUntilTimeoutError';
                throw waitError;
            }
            else {
                throw error;
            }
        }
        return this._page;
    }
    isOpen(opts = Object.create(null)) {
        return this._wait(() => this._page.isOpen(opts), " to be open", opts);
    }
    isClosed(opts = Object.create(null)) {
        return this._wait(() => this._page.isClosed(opts), " to be closed", opts);
    }
}
class PageEventually {
    constructor(page) {
        this._page = page;
    }
    _eventually(conditionFunc, opts = Object.create(null)) {
        const timeout = opts.timeout || this._page.getTimeout();
        const interval = opts.interval || this._page.getInterval();
        try {
            browser.waitUntil(() => conditionFunc(), timeout, '', interval);
            return true;
        }
        catch (error) {
            if (error.type === 'WaitUntilTimeoutError') {
                return false;
            }
            else {
                throw error;
            }
        }
    }
    isOpen(opts = Object.create(null)) {
        this._eventually(() => this._page.isOpen(opts), opts);
    }
    isClosed(opts = Object.create(null)) {
        this._eventually(() => this._page.isClosed(opts), opts);
    }
}
//# sourceMappingURL=Page.js.map