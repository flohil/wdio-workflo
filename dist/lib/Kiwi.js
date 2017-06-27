"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let Kiwi;
Kiwi = (function ($) {
    const interpolate_general = function (text, array) {
        let stringToReturn = "", length = text.length, index = 0, array_length = array.length;
        for (let i = 0; i < length; i++) {
            const currentChar = text[i];
            let nextChar = null;
            if (i + 1 < length)
                nextChar = text[i + 1];
            if (currentChar === '`' && nextChar === '%') {
                stringToReturn += '%';
                i += 1;
            }
            else {
                if (currentChar === '%') {
                    if (index < array_length) {
                        stringToReturn += array[index++];
                    }
                    else {
                        stringToReturn += '';
                    }
                }
                else {
                    stringToReturn += currentChar;
                }
            }
        }
        return stringToReturn;
    };
    const get_key_length = function (text, index) {
        const length = text.length;
        let key = "";
        let i = index;
        while (i < length && text[i] !== '}') {
            key += text[i];
            i++;
        }
        if (text[i] === '}')
            key += '}';
        else
            throw Error("SYNTAX ERROR");
        return [key.slice(2, key.length - 1), key.length];
    };
    const interpolate_key_value = function (text, json) {
        let stringToReturn = "";
        const length = text.length, index = 0;
        for (let i = 0; i < length; i++) {
            const currentChar = text[i];
            let nextChar = null;
            if (i + 1 < length)
                nextChar = text[i + 1];
            if (currentChar === '`' && nextChar === '%') {
                stringToReturn += '%';
                i += 1;
            }
            else if (currentChar === '%' && nextChar === '{') {
                const result = get_key_length(text, i);
                const key = result[0];
                const key_length = result[1];
                stringToReturn += (json[key] === undefined ? "" : json[key]);
                i += key_length - 1;
            }
            else {
                stringToReturn += currentChar;
            }
        }
        return stringToReturn;
    };
    const interpolate = function (text, input) {
        if (input === undefined)
            return text;
        if (Object.prototype.toString.call(input) === "[object Array]") {
            return interpolate_general(text, input);
        }
        else {
            return interpolate_key_value(text, input);
        }
    };
    return {
        "compose": interpolate
    };
}(Kiwi));
exports.default = Kiwi;
//# sourceMappingURL=Kiwi.js.map