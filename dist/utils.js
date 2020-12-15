"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateToLogString = exports.removeDir = exports.createTempDir = exports.execShellCommand = void 0;
const child_process_1 = require("child_process");
const os_1 = require("os");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const execShellCommand = (cmd) => new Promise((resolve, reject) => {
    child_process_1.exec(cmd, (error, stdout, stderr) => {
        if (error) {
            reject(error);
        }
        resolve(stdout || stderr);
    });
});
exports.execShellCommand = execShellCommand;
const createTempDir = async (prefix = '') => fs_1.promises.mkdtemp(path_1.default.join(os_1.tmpdir(), prefix, path_1.default.sep), {
    'encoding': 'utf8',
});
exports.createTempDir = createTempDir;
const removeDir = async (dirPath) => {
    fs_1.promises.rmdir(dirPath, { 'recursive': true });
};
exports.removeDir = removeDir;
// eslint-disable-next-line prefer-template
const dateToLogString = (d) => ''
    + d.getFullYear().toString().padStart(4, '0')
    + (d.getMonth() + 1).toString().padStart(2, '0')
    + d.getDate().toString().padStart(2, '0')
    + '_'
    + d.getHours().toString().padStart(2, '0')
    + d.getMinutes().toString().padStart(2, '0')
    + d.getSeconds().toString().padStart(2, '0');
exports.dateToLogString = dateToLogString;
