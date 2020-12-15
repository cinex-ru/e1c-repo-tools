"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stageFolder = exports.getStagedFiles = void 0;
const console_operations_1 = require("./console-operations");
const gitErrorCallback = async (result) => {
    const errorMessage = result.split('\n')
        .map((str) => str.trim())
        .filter((str) => str.length > 0)[0];
    // throw Error(errorMessage);
    return errorMessage;
};
const getStagedFiles = async (workingDir = '') => {
    const spawnOptions = workingDir.length === 0 ? undefined : { 'cwd': workingDir };
    let against = '';
    await console_operations_1.performOsTask('git', ['rev-parse', '--verify', 'HEAD'], 'Git: rev-parse', spawnOptions, async (result) => {
        against = result.split('\n')
            .map((str) => str.trim())
            .filter((str) => str.length > 0)
            .pop() || '';
        return against;
    }, gitErrorCallback);
    const diffParams = ['--cached', '--name-only', '--diff-filter=AM'];
    if (against) {
        diffParams.push(against);
    }
    let files = [];
    await console_operations_1.performOsTask('git', ['diff', ...diffParams], 'Git: diff', spawnOptions, async (result) => {
        files = result.split('\n')
            .map((str) => str.trim())
            .filter((str) => str.length > 0);
        return files.length.toString();
    }, gitErrorCallback);
    return files;
};
exports.getStagedFiles = getStagedFiles;
const stageFolder = async (pathToFolder, workingDir = '') => {
    const spawnOptions = workingDir.length === 0 ? undefined : { 'cwd': workingDir };
    await console_operations_1.performOsTask('git', ['add', pathToFolder], 'Git: add new files', spawnOptions, undefined, gitErrorCallback);
};
exports.stageFolder = stageFolder;
