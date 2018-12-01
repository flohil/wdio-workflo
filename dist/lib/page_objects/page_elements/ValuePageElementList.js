"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class ValuePageElementList extends _1.PageElementList {
    initialWait() {
        if (this._waitType === "value" /* value */) {
            this.wait.any.hasAnyValue();
        }
        else {
            super.initialWait();
        }
    }
}
exports.ValuePageElementList = ValuePageElementList;
//# sourceMappingURL=ValuePageElementList.js.map