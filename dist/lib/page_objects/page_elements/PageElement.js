"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const builders_1 = require("../builders");
const htmlParser = require("htmlparser2");
class PageElement extends _1.PageNode {
    // available options:
    // - wait -> initial wait operation: exist, visible, text, value
    constructor(_selector, _a) {
        var { waitType = "visible" /* visible */, timeout = JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default, customScroll = undefined } = _a, superOpts = __rest(_a, ["waitType", "timeout", "customScroll"]);
        super(_selector, superOpts);
        this._selector = _selector;
        this.currently = {
            element: this.__element,
            // GET STATE
            getHTML: () => {
                return this._getHTML(this.__element);
            },
            getText: () => {
                return this._getText(this.__element);
            },
            getDirectText: () => {
                return this._getDirectText(this.__element);
            },
            getValue: () => {
                return this._getValue(this.__element);
            },
            getAttribute: (attributeName) => {
                return this._getAttribute(this.__element, attributeName);
            },
            getClass: () => {
                return this._getAttribute(this.__element, 'class');
            },
            getId: () => {
                return this._getAttribute(this.__element, 'id');
            },
            getName: () => {
                return this._getAttribute(this.__element, 'name');
            },
            getLocation: () => {
                return this._getLocation(this.__element);
            },
            getX: () => {
                return this._getLocation(this.__element).x;
            },
            getY: () => {
                return this._getLocation(this.__element).y;
            },
            getSize: () => {
                return this._getSize(this.__element);
            },
            getWidth: () => {
                return this._getSize(this.__element).width;
            },
            getHeight: () => {
                return this._getSize(this.__element).height;
            },
            // CHECK STATE
            exists: () => {
                return this.__element.isExisting();
            },
            isVisible: () => {
                return this.__element.isVisible();
            },
            isEnabled: () => {
                return this._isEnabled(this.__element);
            },
            isSelected: () => {
                return this._isSelected(this.__element);
            },
            hasText: (text) => {
                return this.currently.getText() === text;
            },
            hasAnyText: () => {
                return this.currently.getText().length > 0;
            },
            containsText: (text) => {
                return this.currently.getText().indexOf(text) > -1;
            },
            hasValue: (value) => {
                return this.currently.getValue() === value;
            },
            hasAnyValue: () => {
                return this.currently.getValue().length > 0;
            },
            containsValue: (value) => {
                return this.currently.getValue().indexOf(value) > -1;
            },
            hasHTML: (html) => {
                return this.currently.getHTML() === html;
            },
            hasAnyHTML: () => {
                return this.currently.getHTML().length > 0;
            },
            containsHTML: (html) => {
                return this.currently.getHTML().indexOf(html) > -1;
            },
            hasDirectText: (directText) => {
                return this.currently.getDirectText() === directText;
            },
            hasAnyDirectText: () => {
                return this.currently.getDirectText().length > 0;
            },
            containsDirectText: (directText) => {
                return this.currently.getDirectText().indexOf(directText) > 0;
            },
            hasAttribute: (attributeName, attributeValue) => {
                return this.currently.getAttribute(attributeName) === attributeValue;
            },
            hasAnyAttribute: (attributeName) => {
                return this.currently.getAttribute(attributeName).length > 0;
            },
            containsAttribute: (attributeName, attributeValue) => {
                return this.currently.getAttribute(attributeName).indexOf(attributeValue) > 0;
            },
            hasClass: (className) => {
                return this.currently.getClass() === className;
            },
            containsClass: (className) => {
                const _class = this.currently.getClass();
                if (!_class) {
                    return false;
                }
                else {
                    return _class.indexOf(className) > -1;
                }
            },
            hasId: (id) => {
                return this.currently.getId() === id;
            },
            hasAnyId: () => {
                return this.currently.getId().length > 0;
            },
            containsId: (id) => {
                return this.currently.getId().indexOf(id) > -1;
            },
            hasName: (name) => {
                return this.currently.getName() === name;
            },
            hasAnyName: () => {
                return this.currently.getName().length > 0;
            },
            containsName: (name) => {
                return this.currently.getName().indexOf(name) > -1;
            },
            hasLocation: (coordinates, tolerances = { x: 0, y: 0 }) => {
                return this._hasAxisLocation('x', coordinates.x, tolerances.x) && this._hasAxisLocation('y', coordinates.y, tolerances.y);
            },
            hasX: (x, tolerance) => {
                return this._hasAxisLocation('x', x, tolerance);
            },
            hasY: (y, tolerance) => {
                return this._hasAxisLocation('y', y, tolerance);
            },
            hasSize: (size, tolerances = { width: 0, height: 0 }) => {
                return this._hasSideSize('width', size.width, tolerances.width) && this._hasSideSize('height', size.height, tolerances.height);
            },
            hasWidth: (width, tolerance) => {
                return this._hasSideSize('width', width, tolerance);
            },
            hasHeight: (height, tolerance) => {
                return this._hasSideSize('height', height, tolerance);
            },
            not: {
                exists: () => !this.currently.exists(),
                isVisible: () => !this.currently.isVisible(),
                isEnabled: () => !this.currently.isEnabled(),
                isSelected: () => !this.currently.isSelected(),
                hasClass: (className) => !this.currently.hasClass(className),
                containsClass: (className) => !this.currently.containsClass(className),
                hasText: (text) => !this.currently.hasText(text),
                hasAnyText: () => !this.currently.hasAnyText(),
                containsText: (text) => !this.currently.containsText(text),
                hasValue: (value) => !this.currently.hasValue(value),
                hasAnyValue: () => !this.currently.hasAnyValue(),
                containsValue: (value) => !this.currently.containsValue(value),
                hasDirectText: (directText) => !this.currently.hasDirectText(directText),
                hasAnyDirectText: () => !this.currently.hasAnyDirectText(),
                containsDirectText: (directText) => !this.currently.containsDirectText(directText),
                hasAttribute: (attributeName, attributeValue) => !this.currently.hasAttribute(attributeName, attributeValue),
                hasAnyAttribute: (attributeName) => !this.currently.hasAnyAttribute(attributeName),
                containsAttribute: (attributeName, attributeValue) => !this.currently.containsAttribute(attributeName, attributeValue),
                hasHTML: (html) => !this.currently.hasHTML(html),
                hasAnyHTML: () => !this.currently.hasAnyHTML(),
                containsHTML: (html) => !this.currently.containsHTML(html),
                hasId: (id) => !this.currently.hasId(id),
                hasAnyId: () => !this.currently.hasAnyId(),
                containsId: (id) => !this.currently.containsId(id),
                hasName: (name) => !this.currently.hasName(name),
                hasAnyName: () => !this.currently.hasAnyName(),
                containsName: (name) => !this.currently.containsName(name),
                hasLocation: (coordinates, tolerances) => !this.currently.hasLocation(coordinates, tolerances),
                hasX: (x, tolerance) => !this.currently.hasX(x, tolerance),
                hasY: (y, tolerance) => !this.currently.hasY(y, tolerance),
                hasSize: (size, tolerances) => !this.currently.hasSize(size, tolerances),
                hasWidth: (width, tolerance) => !this.currently.hasWidth(width, tolerance),
                hasHeight: (height, tolerance) => !this.currently.hasHeight(height, tolerance),
            }
        };
        this.wait = {
            exists: (opts) => this._waitWdioCheckFunc('existed', opts => this.currently.element.waitForExist(opts.timeout, opts.reverse), opts),
            isVisible: (opts) => this._waitWdioCheckFunc('became visible', opts => this.currently.element.waitForVisible(opts.timeout, opts.reverse), opts),
            isEnabled: (opts) => this._waitWdioCheckFunc('became enabled', opts => this.currently.element.waitForEnabled(opts.timeout, opts.reverse), opts),
            isSelected: (opts) => this._waitWdioCheckFunc('became selected', opts => this.currently.element.waitForSelected(opts.timeout, opts.reverse), opts),
            hasText: (text, opts) => this._waitHasProperty('text', text, () => this.currently.hasText(text), opts),
            hasAnyText: (opts) => this._waitWdioCheckFunc('had any text', opts => this.currently.element.waitForText(opts.timeout, opts.reverse), opts),
            containsText: (text, opts) => this._waitHasProperty('text', text, () => this.currently.containsText(text), opts),
            hasValue: (value, opts) => this._waitHasProperty('value', value, () => this.currently.hasValue(value), opts),
            hasAnyValue: (opts) => this._waitWdioCheckFunc('had any value', opts => this.currently.element.waitForValue(opts.timeout, opts.reverse), opts),
            containsValue: (value, opts) => this._waitContainsProperty('value', value, () => this.currently.containsValue(value), opts),
            hasHTML: (html, opts) => this._waitHasProperty('HTML', html, () => this.currently.hasHTML(html), opts),
            hasAnyHTML: (opts) => this._waitHasAnyProperty('HTML', () => this.currently.hasAnyHTML(), opts),
            containsHTML: (html, opts) => this._waitContainsProperty('HTML', html, () => this.currently.containsHTML(html), opts),
            hasDirectText: (directText, opts) => this._waitHasProperty('direct text', directText, () => this.currently.hasDirectText(directText), opts),
            hasAnyDirectText: (opts) => this._waitHasAnyProperty('direct text', () => this.currently.hasAnyDirectText(), opts),
            containsDirectText: (directText, opts) => this._waitContainsProperty('direct text', directText, () => this.currently.containsDirectText(directText), opts),
            hasAttribute: (attributeName, attributeValue, opts) => {
                return this._waitHasProperty(`Attribute '${attributeName}'`, attributeValue, () => this.currently.hasAttribute(attributeName, attributeValue), opts);
            },
            hasAnyAttribute: (attributeName, opts) => this._waitHasAnyProperty(`Attribute '${attributeName}'`, () => this.currently.hasAnyAttribute(attributeName), opts),
            containsAttribute: (attributeName, attributeValue, opts) => {
                return this._waitContainsProperty(`Attribute '${attributeName}'`, attributeValue, () => this.currently.containsAttribute(attributeName, attributeValue), opts);
            },
            hasClass: (className, opts) => this._waitHasProperty(`class`, className, () => this.currently.hasClass(className), opts),
            containsClass: (className, opts) => this._waitContainsProperty(`class`, className, () => this.currently.containsClass(className), opts),
            hasId: (id, opts) => this._waitHasProperty(`id`, id, () => this.currently.hasId(id), opts),
            hasAnyId: (opts) => this._waitHasAnyProperty(`id`, () => this.currently.hasAnyId(), opts),
            containsId: (id, opts) => this._waitContainsProperty(`id`, id, () => this.currently.containsId(id), opts),
            hasName: (name, opts) => this._waitHasProperty(`name`, name, () => this.currently.hasName(name), opts),
            hasAnyName: (opts) => this._waitHasAnyProperty(`id`, () => this.currently.hasAnyName(), opts),
            containsName: (name, opts) => this._waitContainsProperty(`name`, name, () => this.currently.containsName(name), opts),
            hasLocation: (coordinates, opts = { tolerances: { x: 0, y: 0 } }) => {
                const { tolerances } = opts, otherOpts = __rest(opts, ["tolerances"]);
                return this._waitHasProperty(`location`, tolerancesObjectToString(coordinates, tolerances), () => this._hasAxisLocation('x', coordinates.x, tolerances.x) && this._hasAxisLocation('y', coordinates.y, tolerances.y), otherOpts);
            },
            hasX: (x, opts = { tolerance: 0 }) => {
                const { tolerance } = opts, otherOpts = __rest(opts, ["tolerance"]);
                return this._waitHasProperty(`x`, tolerancesObjectToString({ x }, { x: tolerance }), () => this._hasAxisLocation('x', x, tolerance), otherOpts);
            },
            hasY: (y, opts = { tolerance: 0 }) => {
                const { tolerance } = opts, otherOpts = __rest(opts, ["tolerance"]);
                return this._waitHasProperty(`y`, tolerancesObjectToString({ y }, { y: tolerance }), () => this._hasAxisLocation('y', y, tolerance), otherOpts);
            },
            hasSize: (size, opts = { tolerances: { width: 0, height: 0 } }) => {
                const { tolerances } = opts, otherOpts = __rest(opts, ["tolerances"]);
                return this._waitHasProperty(`location`, tolerancesObjectToString(size, tolerances), () => this._hasSideSize('width', size.width, tolerances.width) && this._hasSideSize('height', size.height, tolerances.height), otherOpts);
            },
            hasWidth: (width, opts = { tolerance: 0 }) => {
                const { tolerance } = opts, otherOpts = __rest(opts, ["tolerance"]);
                return this._waitHasProperty(`width`, tolerancesObjectToString({ width }, { width: tolerance }), () => this._hasSideSize('width', width, tolerance), otherOpts);
            },
            hasHeight: (height, opts = { tolerance: 0 }) => {
                const { tolerance } = opts, otherOpts = __rest(opts, ["tolerance"]);
                return this._waitHasProperty(`height`, tolerancesObjectToString({ height }, { height: tolerance }), () => this._hasSideSize('height', height, tolerance), otherOpts);
            },
            untilElement: (description, condition, { timeout = this._timeout } = {}) => {
                browser.waitUntil(() => condition(this), timeout, `${this.constructor.name}: Wait until element ${description} failed.\n( ${this._selector} )`);
                return this;
            },
            not: {
                exists: (opts) => {
                    return this.wait.exists(this._makeReverseParams(opts));
                },
                isVisible: (opts) => {
                    return this.wait.isVisible(this._makeReverseParams(opts));
                },
                isEnabled: (opts) => {
                    return this.wait.isEnabled(this._makeReverseParams(opts));
                },
                isSelected: (opts) => {
                    return this.wait.isSelected(this._makeReverseParams(opts));
                },
                hasText: (text, opts) => {
                    return this.wait.hasText(text, this._makeReverseParams(opts));
                },
                hasAnyText: (opts) => {
                    return this.wait.hasAnyText(this._makeReverseParams(opts));
                },
                containsText: (text, opts) => {
                    return this.wait.containsText(text, this._makeReverseParams(opts));
                },
                hasValue: (value, opts) => {
                    return this.wait.hasValue(value, this._makeReverseParams(opts));
                },
                hasAnyValue: (opts) => {
                    return this.wait.hasAnyValue(this._makeReverseParams(opts));
                },
                containsValue: (value, opts) => {
                    return this.wait.containsValue(value, this._makeReverseParams(opts));
                },
                hasHTML: (html, opts) => {
                    return this.wait.hasHTML(html, this._makeReverseParams(opts));
                },
                hasAnyHTML: (opts) => {
                    return this.wait.hasAnyHTML(this._makeReverseParams(opts));
                },
                containsHTML: (html, opts) => {
                    return this.wait.containsHTML(html, this._makeReverseParams(opts));
                },
                hasDirectText: (directText, opts) => {
                    return this.wait.hasDirectText(directText, this._makeReverseParams(opts));
                },
                hasAnyDirectText: (opts) => {
                    return this.wait.hasAnyDirectText(this._makeReverseParams(opts));
                },
                containsDirectText: (directText, opts) => {
                    return this.wait.containsDirectText(directText, this._makeReverseParams(opts));
                },
                hasAttribute: (attributeName, attributeValue, opts) => {
                    return this.wait.hasAttribute(attributeName, attributeValue, this._makeReverseParams(opts));
                },
                hasAnyAttribute: (attributeName, opts) => {
                    return this.wait.hasAnyAttribute(attributeName, this._makeReverseParams(opts));
                },
                containsAttribute: (attributeName, attributeValue, opts) => {
                    return this.wait.containsAttribute(attributeName, attributeValue, this._makeReverseParams(opts));
                },
                hasClass: (className, opts) => {
                    return this.wait.hasClass(className, this._makeReverseParams(opts));
                },
                containsClass: (className, opts) => {
                    return this.wait.containsClass(className, this._makeReverseParams(opts));
                },
                hasId: (id, opts) => {
                    return this.wait.hasId(id, this._makeReverseParams(opts));
                },
                hasAnyId: (opts) => {
                    return this.wait.hasAnyId(this._makeReverseParams(opts));
                },
                containsId: (id, opts) => {
                    return this.wait.containsId(id, this._makeReverseParams(opts));
                },
                hasName: (name, opts) => {
                    return this.wait.hasName(name, this._makeReverseParams(opts));
                },
                hasAnyName: (opts) => {
                    return this.wait.hasAnyName(this._makeReverseParams(opts));
                },
                containsName: (name, opts) => {
                    return this.wait.containsName(name, this._makeReverseParams(opts));
                },
                hasLocation: (coordinates, opts = { tolerances: { x: 0, y: 0 } }) => this.wait.hasLocation(coordinates, { tolerances: opts.tolerances, timeout: opts.timeout, reverse: true }),
                hasX: (x, opts = { tolerance: 0 }) => this.wait.hasX(x, { tolerance: opts.tolerance, timeout: opts.timeout, reverse: true }),
                hasY: (y, opts = { tolerance: 0 }) => this.wait.hasY(y, { tolerance: opts.tolerance, timeout: opts.timeout, reverse: true }),
                hasSize: (size, opts = { tolerances: { width: 0, height: 0 } }) => this.wait.hasSize(size, { tolerances: opts.tolerances, timeout: opts.timeout, reverse: true }),
                hasWidth: (width, opts = { tolerance: 0 }) => this.wait.hasWidth(width, { tolerance: opts.tolerance, timeout: opts.timeout, reverse: true }),
                hasHeight: (height, opts = { tolerance: 0 }) => this.wait.hasHeight(height, { tolerance: opts.tolerance, timeout: opts.timeout, reverse: true })
            }
        };
        // EVENTUALLY FUNCTIONS (check wether certain state is reached after timeout)
        this.eventually = {
            exists: (opts) => {
                return this._eventually(() => this.wait.exists(opts));
            },
            isVisible: (opts) => {
                return this._eventually(() => this.wait.isVisible(opts));
            },
            isEnabled: (opts) => {
                return this._eventually(() => this.wait.isEnabled(opts));
            },
            isSelected: (opts) => {
                return this._eventually(() => this.wait.isSelected(opts));
            },
            hasText: (text, opts) => {
                return this._eventually(() => this.wait.hasText(text, opts));
            },
            hasAnyText: (opts) => {
                return this._eventually(() => this.wait.hasAnyText(opts));
            },
            containsText: (text, opts) => {
                return this._eventually(() => this.wait.containsText(text, opts));
            },
            hasValue: (value, opts) => {
                return this._eventually(() => this.wait.hasValue(value, opts));
            },
            hasAnyValue: (opts) => {
                return this._eventually(() => this.wait.hasAnyValue(opts));
            },
            containsValue: (value, opts) => {
                return this._eventually(() => this.wait.containsValue(value, opts));
            },
            hasHTML: (html, opts) => {
                return this._eventually(() => this.wait.hasHTML(html, opts));
            },
            hasAnyHTML: (opts) => {
                return this._eventually(() => this.wait.hasAnyHTML(opts));
            },
            containsHTML: (html, opts) => {
                return this._eventually(() => this.wait.containsHTML(html, opts));
            },
            hasDirectText: (directText, opts) => {
                return this._eventually(() => this.wait.hasDirectText(directText, opts));
            },
            hasAnyDirectText: (opts) => {
                return this._eventually(() => this.wait.hasAnyDirectText(opts));
            },
            containsDirectText: (directText, opts) => {
                return this._eventually(() => this.wait.containsDirectText(directText, opts));
            },
            hasAttribute: (attributeName, attributeValue, opts) => {
                return this._eventually(() => this.wait.hasAttribute(attributeName, attributeValue, opts));
            },
            hasAnyAttribute: (attributeName, opts) => {
                return this._eventually(() => this.wait.hasAnyAttribute(attributeName, opts));
            },
            containsAttribute: (attributeName, attributeValue, opts) => {
                return this._eventually(() => this.wait.containsAttribute(attributeName, attributeValue, opts));
            },
            hasClass: (className, opts) => {
                return this._eventually(() => this.wait.hasClass(className, opts));
            },
            containsClass: (className, opts) => {
                return this._eventually(() => this.wait.containsClass(className, opts));
            },
            hasId: (id, opts) => {
                return this._eventually(() => this.wait.hasId(id, opts));
            },
            hasAnyId: (opts) => {
                return this._eventually(() => this.wait.hasAnyId(opts));
            },
            containsId: (id, opts) => {
                return this._eventually(() => this.wait.containsId(id, opts));
            },
            hasName: (name, opts) => {
                return this._eventually(() => this.wait.hasName(name, opts));
            },
            hasAnyName: (opts) => {
                return this._eventually(() => this.wait.hasAnyName(opts));
            },
            containsName: (name, opts) => {
                return this._eventually(() => this.wait.containsName(name, opts));
            },
            hasLocation: (coordinates, opts = { tolerances: { x: 0, y: 0 } }) => this._eventually(() => this.wait.hasLocation(coordinates, { tolerances: opts.tolerances, timeout: opts.timeout })),
            hasX: (x, opts = { tolerance: 0 }) => this._eventually(() => this.wait.hasX(x, { tolerance: opts.tolerance, timeout: opts.timeout })),
            hasY: (y, opts = { tolerance: 0 }) => this._eventually(() => this.wait.hasY(y, { tolerance: opts.tolerance, timeout: opts.timeout })),
            hasSize: (size, opts = { tolerances: { width: 0, height: 0 } }) => this._eventually(() => this.wait.hasSize(size, { tolerances: opts.tolerances, timeout: opts.timeout })),
            hasWidth: (width, opts = { tolerance: 0 }) => this._eventually(() => this.wait.hasWidth(width, { tolerance: opts.tolerance, timeout: opts.timeout })),
            hasHeight: (height, opts = { tolerance: 0 }) => this._eventually(() => this.wait.hasHeight(height, { tolerance: opts.tolerance, timeout: opts.timeout })),
            meetsCondition: (condition, opts) => {
                return this._eventually(() => this.wait.untilElement(' meets condition', () => condition(this), opts));
            },
            not: {
                exists: (opts) => {
                    return this._eventually(() => this.wait.not.exists(opts));
                },
                isVisible: (opts) => {
                    return this._eventually(() => this.wait.not.isVisible(opts));
                },
                isEnabled: (opts) => {
                    return this._eventually(() => this.wait.not.isEnabled(opts));
                },
                isSelected: (opts) => {
                    return this._eventually(() => this.wait.not.isSelected(opts));
                },
                hasText: (text, opts) => {
                    return this._eventually(() => this.wait.not.hasText(text, opts));
                },
                hasAnyText: (opts) => {
                    return this._eventually(() => this.wait.not.hasAnyText(opts));
                },
                containsText: (text, opts) => {
                    return this._eventually(() => this.wait.not.containsText(text, opts));
                },
                hasValue: (value, opts) => {
                    return this._eventually(() => this.wait.not.hasValue(value, opts));
                },
                hasAnyValue: (opts) => {
                    return this._eventually(() => this.wait.not.hasAnyValue(opts));
                },
                containsValue: (value, opts) => {
                    return this._eventually(() => this.wait.not.containsValue(value, opts));
                },
                hasHTML: (html, opts) => {
                    return this._eventually(() => this.wait.not.hasHTML(html, opts));
                },
                hasAnyHTML: (opts) => {
                    return this._eventually(() => this.wait.not.hasAnyHTML(opts));
                },
                containsHTML: (html, opts) => {
                    return this._eventually(() => this.wait.not.containsHTML(html, opts));
                },
                hasDirectText: (directText, opts) => {
                    return this._eventually(() => this.wait.not.hasDirectText(directText, opts));
                },
                hasAnyDirectText: (opts) => {
                    return this._eventually(() => this.wait.not.hasAnyDirectText(opts));
                },
                containsDirectText: (directText, opts) => {
                    return this._eventually(() => this.wait.not.containsDirectText(directText, opts));
                },
                hasAttribute: (attributeName, attributeValue, opts) => {
                    return this._eventually(() => this.wait.not.hasAttribute(attributeName, attributeValue, opts));
                },
                hasAnyAttribute: (attributeName, opts) => {
                    return this._eventually(() => this.wait.not.hasAnyAttribute(attributeName, opts));
                },
                containsAttribute: (attributeName, attributeValue, opts) => {
                    return this._eventually(() => this.wait.not.containsAttribute(attributeName, attributeValue, opts));
                },
                hasClass: (className, opts) => {
                    return this._eventually(() => this.wait.not.hasClass(className, opts));
                },
                containsClass: (className, opts) => {
                    return this._eventually(() => this.wait.not.containsClass(className, opts));
                },
                hasId: (id, opts) => {
                    return this._eventually(() => this.wait.not.hasId(id, opts));
                },
                hasAnyId: (opts) => {
                    return this._eventually(() => this.wait.not.hasAnyId(opts));
                },
                containsId: (id, opts) => {
                    return this._eventually(() => this.wait.not.containsId(id, opts));
                },
                hasName: (name, opts) => {
                    return this._eventually(() => this.wait.not.hasName(name, opts));
                },
                hasAnyName: (opts) => {
                    return this._eventually(() => this.wait.not.hasAnyName(opts));
                },
                containsName: (name, opts) => {
                    return this._eventually(() => this.wait.not.containsName(name, opts));
                },
                hasLocation: (coordinates, opts = { tolerances: { x: 0, y: 0 } }) => this._eventually(() => this.wait.not.hasLocation(coordinates, { tolerances: opts.tolerances, timeout: opts.timeout })),
                hasX: (x, opts = { tolerance: 0 }) => this._eventually(() => this.wait.not.hasX(x, { tolerance: opts.tolerance, timeout: opts.timeout })),
                hasY: (y, opts = { tolerance: 0 }) => this._eventually(() => this.wait.not.hasY(y, { tolerance: opts.tolerance, timeout: opts.timeout })),
                hasSize: (size, opts = { tolerances: { width: 0, height: 0 } }) => this._eventually(() => this.wait.not.hasSize(size, { tolerances: opts.tolerances, timeout: opts.timeout })),
                hasWidth: (width, opts = { tolerance: 0 }) => this._eventually(() => this.wait.not.hasWidth(width, { tolerance: opts.tolerance, timeout: opts.timeout })),
                hasHeight: (height, opts = { tolerance: 0 }) => this._eventually(() => this.wait.not.hasHeight(height, { tolerance: opts.tolerance, timeout: opts.timeout })),
            }
        };
        this._$ = Object.create(null);
        for (const method of Workflo.Class.getAllMethods(this._store)) {
            if (method.indexOf('_') !== 0 && /^[A-Z]/.test(method)) {
                this._$[method] = (selector, _options) => {
                    if (selector instanceof builders_1.XPathBuilder) {
                        selector = builders_1.XPathBuilder.getInstance().build();
                    }
                    // chain selectors
                    selector = `${_selector}${selector}`;
                    return this._store[method].apply(this._store, [selector, _options]);
                };
            }
        }
        this._waitType = waitType;
        this._timeout = timeout;
        this._customScroll = customScroll;
    }
    // RETRIEVE ELEMENT FUNCTIONS
    /**
     * Return WdioElement from current state, not performing an initial wait.
     */
    get __element() {
        return browser.element(this._selector);
    }
    /**
     * Return WdioElement after performing an initial wait.
     */
    get element() {
        this.initialWait();
        return this.__element;
    }
    get $() {
        return this._$;
    }
    initialWait() {
        switch (this._waitType) {
            case "exist" /* exist */:
                if (!this.currently.exists()) {
                    this.wait.exists();
                }
                break;
            case "visible" /* visible */:
                if (!this.currently.isVisible()) {
                    this.wait.isVisible();
                }
                break;
            case "value" /* value */:
                if (!this.currently.hasAnyValue()) {
                    this.wait.hasAnyValue();
                }
                break;
            case "text" /* text */:
                if (!this.currently.hasAnyText()) {
                    this.wait.hasAnyText();
                }
                break;
        }
        return this;
    }
    // Private GETTER FUNCTIONS (work with both element and currently.element)
    /**
     * Get text that resides on the level directly below the selected page element.
     * Does not include text of the page element's nested children elements.
     */
    _getDirectText(element) {
        const html = element.getHTML();
        if (html.length === 0) {
            return '';
        }
        let text = "";
        const constructorName = this.constructor.name;
        const selector = this._selector;
        const handler = new htmlParser.DomHandler(function (error, dom) {
            if (error) {
                throw new Error(`Error creating dom for exclusive text in ${constructorName}: ${error}\n( ${selector} )`);
            }
            else {
                dom.forEach(node => {
                    node.children.forEach(childNode => {
                        if (childNode.type === 'text') {
                            text += childNode.data;
                        }
                    });
                });
            }
        });
        return text;
    }
    _getHTML(element) {
        const result = browser.selectorExecute([this.getSelector()], function (elems, elementSelector) {
            var error = {
                notFound: []
            };
            if (elems.length === 0) {
                error.notFound.push(elementSelector);
            }
            ;
            if (error.notFound.length > 0) {
                return error;
            }
            var elem = elems[0];
            return elem.innerHTML;
        }, this.getSelector());
        if (isJsError(result)) {
            throw new Error(`${this.constructor.name} could not be located in scrollTo.\n( ${this.getSelector()} )`);
        }
        else {
            return result;
        }
    }
    // returns text of this.element including
    // all texts of nested children
    _getText(element) {
        return element.getText();
    }
    _getValue(element) {
        return element.getValue();
    }
    _getAttribute(element, attrName) {
        return element.getAttribute(attrName);
    }
    _getClass(element) {
        return element.getAttribute('class');
    }
    _getId(element) {
        return element.getAttribute('id');
    }
    _getName(element) {
        return element.getAttribute('name');
    }
    _getLocation(element) {
        return element.getLocation();
    }
    _getSize(element) {
        return this.element.getElementSize();
    }
    _isEnabled(element) {
        return element.isEnabled();
    }
    _isSelected(element) {
        return element.isSelected();
    }
    // Public GETTER FUNCTIONS (return state after initial wait)
    getDirectText() {
        return this._getDirectText(this.element);
    }
    getHTML() {
        return this._getHTML(this.element);
    }
    getText() {
        return this._getText(this.element);
    }
    getValue() {
        return this._getValue(this.element);
    }
    getAttribute(attributeName) {
        return this._getAttribute(this.element, attributeName);
    }
    getClass() {
        return this._getClass(this.element);
    }
    getId() {
        return this._getId(this.element);
    }
    getName() {
        return this._getName(this.element);
    }
    getLocation() {
        return this._getLocation(this.element);
    }
    getX() {
        return this._getLocation(this.element).x;
    }
    getY() {
        return this._getLocation(this.element).y;
    }
    getSize() {
        return this._getSize(this.element);
    }
    getWidth() {
        return this._getSize(this.element).width;
    }
    getHeight() {
        return this._getSize(this.element).height;
    }
    getTimeout() {
        return this._timeout;
    }
    // INTERACTION FUNCTIONS (interact with state after initial wait)
    setValue(value) {
        this.element.setValue(value);
    }
    /**
     *
     * @param postCondition Sometimes javascript that is to be executed after a click
     * is not loaded right at the moment that the element wait condition
     * is fulfilled. (eg. element is visible)
     * In this case, postCondition function will be
     */
    click(options) {
        this.initialWait();
        let errorMessage = '';
        const interval = 250;
        const viewPortSize = browser.getViewportSize();
        let y = viewPortSize.height / 2;
        let x = viewPortSize.width / 2;
        let remainingTimeout = this._timeout;
        if (!options) {
            options = {};
        }
        if (options && !options.customScroll) {
            if (this._customScroll) {
                options.customScroll = this._customScroll;
            }
        }
        const clickFunc = !options.customScroll ? () => this.__element.click() : () => {
            const result = browser.selectorExecute(this.getSelector(), function (elems, selector) {
                if (elems.length === 0) {
                    return {
                        notFound: [selector]
                    };
                }
                elems[0].click();
            }, this.getSelector());
            if (isJsError(result)) {
                throw new Error(`${this.constructor.name} could not be clicked: ${result.notFound.join(', ')}\n( ${this._selector} )`);
            }
        };
        if (options.customScroll) {
            this.scrollTo(options.customScroll);
        }
        // wait for other overlapping elements to disappear
        try {
            browser.waitUntil(() => {
                remainingTimeout -= interval;
                try {
                    clickFunc();
                    errorMessage = undefined;
                    return true;
                }
                catch (error) {
                    if (error.message.indexOf("is not clickable at point") > -1) {
                        errorMessage = error.message;
                        return false;
                    }
                }
            }, this._timeout, `${this.constructor.name} did not become clickable after timeout.\n( ${this._selector} )`, interval);
        }
        catch (waitE) {
            waitE.message = errorMessage.replace('unknown error: ', '');
            throw waitE;
        }
        if (options && options.postCondition && remainingTimeout > 0) {
            options.timeout = options.timeout || this._timeout;
            try {
                browser.waitUntil(() => {
                    try {
                        if (options.postCondition()) {
                            return true;
                        }
                        else {
                            if (this.currently.isVisible() && this.currently.isEnabled()) {
                                clickFunc();
                            }
                        }
                    }
                    catch (error) {
                        errorMessage = error.message;
                    }
                }, remainingTimeout + options.timeout, `${this.constructor.name}: Postcondition for click never became true.\n( ${this._selector} )`, interval);
            }
            catch (waitE) {
                waitE.message = errorMessage.replace('unknown error: ', '');
                throw waitE;
            }
        }
        return this;
    }
    scrollTo(params) {
        if (!params.offsets) {
            params.offsets = {
                x: 0,
                y: 0
            };
        }
        if (!params.offsets.x) {
            params.offsets.x = 0;
        }
        if (!params.offsets.y) {
            params.offsets.y = 0;
        }
        if (typeof params.closestContainerIncludesHidden === 'undefined') {
            params.closestContainerIncludesHidden = true;
        }
        const result = browser.selectorExecute([this.getSelector()], function (elems, elementSelector, params) {
            var error = {
                notFound: []
            };
            if (elems.length === 0) {
                error.notFound.push(elementSelector);
            }
            ;
            if (error.notFound.length > 0) {
                return error;
            }
            var elem = elems[0];
            var container = undefined;
            function getScrollParent(element, includeHidden) {
                var style = getComputedStyle(element);
                var excludeStaticParent = style.position === "absolute";
                var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
                if (style.position === "fixed")
                    return document.body;
                for (var parent = element; (parent = parent.parentElement);) {
                    style = getComputedStyle(parent);
                    if (excludeStaticParent && style.position === "static") {
                        continue;
                    }
                    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
                        return parent;
                }
                return document.body;
            }
            if (typeof params.containerSelector === 'undefined') {
                container = getScrollParent(elem, params.closestContainerIncludesHidden);
            }
            else {
                container = document.evaluate(params.containerSelector, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (container === null) {
                    error.notFound.push(params.containerSelector);
                    return error;
                }
            }
            var elemTop = elem.getBoundingClientRect().top;
            var elemLeft = elem.getBoundingClientRect().left;
            var containerTop = container.getBoundingClientRect().top;
            var containerLeft = container.getBoundingClientRect().left;
            var previousScrollTop = container.scrollTop;
            var previousScrollLeft = container.scrollLeft;
            var scrollTop = elemTop - containerTop + previousScrollTop + params.offsets.y;
            var scrollLeft = elemLeft - containerLeft + previousScrollLeft + params.offsets.x;
            if (typeof params.directions !== 'undefined') {
                if (params.directions.y) {
                    container.scrollTop = scrollTop;
                }
                if (params.directions.x) {
                    container.scrollLeft = scrollLeft;
                }
            }
            return {
                elemTop: elemTop,
                elemLeft: elemLeft,
                containerTop: containerTop,
                containerLeft: containerLeft,
                scrollTop: scrollTop,
                scrollLeft: scrollLeft
            };
        }, this.getSelector(), params);
        if (isJsError(result)) {
            throw new Error(`${this.constructor.name} could not be located in scrollTo.\n( ${this.getSelector()} )`);
        }
        else {
            return result;
        }
    }
    // CURRENT CHECK STATE FUNCTIONS
    /**
     * @param actual the actual browser value in pixels
     * @param expected the expected value in pixels or 0 if expected was smaller than 0
     * @param tolerance the tolerance in pixels or 0 if tolerance was smaller than 0
     */
    _withinTolerance(actual, expected, tolerance) {
        const tolerances = {
            lower: actual,
            upper: actual
        };
        if (tolerance) {
            tolerances.lower -= Math.min(tolerance, 0);
            tolerances.upper += Math.min(tolerance, 0);
        }
        return Math.min(expected, 0) >= Math.min(tolerances.lower, 0) && Math.min(expected, 0) <= Math.min(tolerances.upper, 0);
    }
    _hasAxisLocation(axis, expected, tolerance) {
        const actualCoordinates = this.currently.getLocation();
        return this._withinTolerance(actualCoordinates[axis], expected, tolerance);
    }
    _hasSideSize(side, expected, tolerance) {
        const actualSize = this.currently.getSize();
        return this._withinTolerance(actualSize[side], expected, tolerance);
    }
    // WAIT (for certain state within timeout)
    _waitWdioCheckFunc(checkTypeStr, conditionFunc, { timeout = this._timeout, reverse } = {}) {
        const reverseStr = (reverse) ? ' not' : '';
        return this._wait(() => conditionFunc({ timeout, reverse }), ` never${reverseStr} ${checkTypeStr}.\n( ${this._selector} )`);
    }
    _waitProperty(name, conditionType, conditionFunc, { timeout = this._timeout, reverse } = {}, value) {
        const reverseStr = (reverse) ? ' not' : '';
        let conditionStr = '';
        let errorMessage = '';
        if (conditionType === 'has') {
            conditionStr = 'became';
        }
        else if (conditionType === 'contains') {
            conditionStr = 'contained';
        }
        else if (conditionType === 'any') {
            conditionStr = 'any';
        }
        if (conditionType === 'has' || conditionType === 'contains') {
            // capitalize first letter
            name = name.charAt(0).toUpperCase() + name.slice(1);
            errorMessage = `${this.constructor.name}: ${name} never${reverseStr} ${conditionStr} '${value}'.\n( ${this._selector} )`;
        }
        else if (conditionType === 'any') {
            errorMessage = `${this.constructor.name} never${reverseStr} had ${conditionStr} ${name}.\n( ${this._selector} )`;
        }
        browser.waitUntil(() => {
            if (reverse) {
                return !conditionFunc(value);
            }
            else {
                return conditionFunc(value);
            }
        }, timeout, errorMessage);
        return this;
    }
    _waitHasProperty(name, value, conditionFunc, opts) {
        return this._waitProperty(name, 'has', conditionFunc, opts, value);
    }
    _waitHasAnyProperty(name, conditionFunc, opts) {
        return this._waitProperty(name, 'any', conditionFunc, opts);
    }
    _waitContainsProperty(name, value, conditionFunc, opts) {
        return this._waitProperty(name, 'contains', conditionFunc, opts, value);
    }
    _makeReverseParams(opts = {}) {
        return { timeout: opts.timeout, reverse: true };
    }
}
exports.PageElement = PageElement;
// type guards
function isJsError(result) {
    if (!result) {
        return false;
    }
    return result.notFound !== undefined;
}
function isScrollResult(result) {
    return result.elemTop !== undefined;
}
function tolerancesObjectToString(actuals, tolerances) {
    var str = '{';
    var props = [];
    for (var p in actuals) {
        if (actuals.hasOwnProperty(p)) {
            const actual = actuals[p];
            let actualStr = '';
            if (tolerances[p] !== 0) {
                const tolerance = Math.abs(tolerances[p]);
                actualStr = `[${Math.max(actual - tolerance, 0)}, ${Math.max(actual + tolerance, 0)}]`;
            }
            else {
                actualStr = `${actual}`;
            }
            props.push(`${p}: ${actualStr}`);
        }
    }
    str += props.join(', ');
    return str + '}';
}
//# sourceMappingURL=PageElement.js.map