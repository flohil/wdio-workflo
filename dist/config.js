"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = JSON.parse(process.env.WORKFLO_CONFIG);
exports.config = config;
const WORKFLO_DEFAULT_TIMEOUT = 5000;
const BASE_URL = '/';
config.timeouts = config.timeouts || {};
config.timeouts.default = config.timeouts.default || WORKFLO_DEFAULT_TIMEOUT;
config.baseUrl = config.baseUrl || BASE_URL;
exports.default = config;
//# sourceMappingURL=config.js.map