"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Encapsulates arbitrary page element types.
// Exposes its content directly as its own members,
// so each key in content can be accessed via dot notation.
//
// Naming Convention:
// - all content members must start with a lower case letter
// - all group functions must start with upper case letter
// - all private members of group must start with _
class PageElementGroup {
    constructor({ id, content }) {
        this._id = id;
        this._$ = content;
        this.currently = new PageElementGroupCurrently(this);
        this.eventually = new PageElementGroupEventually(this);
    }
    get $() {
        return this._$;
    }
    get __lastDiff() {
        return this._lastDiff;
    }
    __toJSON() {
        return {
            pageNodeType: this.constructor.name,
            nodeId: this._id
        };
    }
    __getNodeId() {
        return this._id;
    }
    // GETTER FUNCTIONS
    getText(filterMask) {
        let result = {};
        for (const k in this.$) {
            if (isGetTextNode(this.$[k])) {
                const elem = this.$[k];
                if (filterMask) {
                    if (filterMask[k] === true) {
                        result[k] = elem.getText();
                    }
                }
                else {
                    result[k] = elem.getText();
                }
            }
        }
        return result;
    }
    // HELPER FUNCTIONS
    __compareText(compareFunc, expected) {
        const diffs = {};
        for (const k in expected) {
            if (isGetTextNode(this._$[k])) {
                const elem = this._$[k];
                if (!compareFunc(elem, expected[k])) {
                    diffs[k] = elem.__lastDiff;
                }
            }
        }
        this._lastDiff = {
            tree: diffs
        };
        return Object.keys(diffs).length === 0;
    }
}
exports.PageElementGroup = PageElementGroup;
class PageElementGroupCurrently {
    constructor(node) {
        this.not = {
            hasText: (text) => {
                return this._node.__compareText((element, expected) => element.currently.not.hasText(expected), text);
            },
            hasAnyText: () => {
                return this._node.__compareText(element => element.currently.not.hasAnyText());
            },
            containsText: (text) => {
                return this._node.__compareText((element, expected) => element.currently.not.containsText(expected), text);
            }
        };
        this._node = node;
    }
    getText(filterMask) {
        let result = {};
        for (const k in this._node.$) {
            if (isGetTextNode(this._node.$[k])) {
                const elem = this._node.$[k];
                if (filterMask) {
                    if (filterMask[k] === true) {
                        result[k] = elem.currently.getText();
                    }
                }
                else {
                    result[k] = elem.currently.getText();
                }
            }
        }
        return result;
    }
    hasText(text) {
        return this._node.__compareText((element, expected) => element.currently.hasText(expected), text);
    }
    hasAnyText() {
        return this._node.__compareText(element => element.currently.hasAnyText());
    }
    containsText(text) {
        return this._node.__compareText((element, expected) => element.currently.containsText(expected), text);
    }
}
exports.PageElementGroupCurrently = PageElementGroupCurrently;
class PageElementGroupEventually {
    constructor(node) {
        this.not = {
            hasText: (text, opts) => {
                return this._node.__compareText((element, expected) => element.eventually.not.hasText(expected, opts), text);
            },
            hasAnyText: (opts) => {
                return this._node.__compareText(element => element.eventually.not.hasAnyText(opts));
            },
            containsText: (text, opts) => {
                return this._node.__compareText((element, expected) => element.eventually.not.containsText(expected, opts), text);
            }
        };
        this._node = node;
    }
    hasText(text, opts) {
        return this._node.__compareText((element, expected) => element.eventually.hasText(expected, opts), text);
    }
    hasAnyText(opts) {
        return this._node.__compareText(element => element.eventually.hasAnyText(opts));
    }
    containsText(text, opts) {
        return this._node.__compareText((element, expected) => element.eventually.containsText(expected, opts), text);
    }
}
exports.PageElementGroupEventually = PageElementGroupEventually;
// type guards
function isGetTextNode(node) {
    return typeof node.getText === 'function' &&
        typeof node.currently.hasText === 'function' &&
        typeof node.currently.hasAnyText === 'function' &&
        typeof node.currently.containsText === 'function' &&
        typeof node.eventually.hasText === 'function' &&
        typeof node.eventually.hasAnyText === 'function' &&
        typeof node.eventually.containsText === 'function';
}
//# sourceMappingURL=PageElementGroup.js.map