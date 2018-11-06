"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
class Page {
    constructor(args) {
        this.elementStore = args.elementStore;
        if (args.timeout) {
            this.timeout = args.timeout;
        }
        else {
            this.timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || __1.DEFAULT_TIMEOUT;
        }
    }
    eventuallyIsOpened(timeout = this.timeout) {
        try {
            browser.waitUntil(() => this.isOpened(), timeout);
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.Page = Page;
//# sourceMappingURL=Page.js.map