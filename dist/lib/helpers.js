"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function tolerancesObjectToString(actuals, tolerances) {
    var str = '{';
    var props = [];
    for (var p in actuals) {
        if (actuals.hasOwnProperty(p)) {
            const actual = actuals[p];
            let actualStr = '';
            if (tolerances && tolerances[p] !== 0) {
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
exports.tolerancesObjectToString = tolerancesObjectToString;
//# sourceMappingURL=helpers.js.map