"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders = require("./builders");
exports.builders = builders;
const elements = require("./page_elements");
exports.elements = elements;
const pages = require("./pages");
exports.pages = pages;
const stores = require("./stores");
exports.stores = stores;
/**
 * The default timeout value used in functions that operate with timeouts if no other timeout is
 * specified in workflo.conf.ts, in the PageNode itself or as a parameter passed to the function.
 */
exports.DEFAULT_TIMEOUT = 5000;
/**
 * The default interval value used in functions that operate with intervals if no other interval is
 * specified in workflo.conf.ts, in the PageNode itself or as a parameter passed to the function.
 */
exports.DEFAULT_INTERVAL = 500;
//# sourceMappingURL=index.js.map