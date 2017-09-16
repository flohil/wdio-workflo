"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const read = (dir) => fs.readdirSync(dir)
    .reduce((files, file) => fs.statSync(path.join(dir, file)).isDirectory() ?
    files.concat(read(path.join(dir, file))) :
    files.concat(path.join(dir, file)), []);
function getAllFiles(dirPath, extension) {
    return read(dirPath).filter((fileName) => fileName.endsWith(extension));
}
exports.getAllFiles = getAllFiles;
//# sourceMappingURL=io.js.map