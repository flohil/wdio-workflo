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
function copyFileSync(source, target) {
    var targetFile = target;
    //if target is a directory a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }
    fs.writeFileSync(targetFile, fs.readFileSync(source));
}
exports.copyFileSync = copyFileSync;
function copyFolderRecursiveSync(source, target) {
    var files = [];
    //check if folder needs to be created or integrated
    var targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }
    //copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            }
            else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}
exports.copyFolderRecursiveSync = copyFolderRecursiveSync;
//# sourceMappingURL=io.js.map