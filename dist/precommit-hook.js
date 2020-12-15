"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.precommitHook = exports.processStagedFiles = exports.getStagedFilesToProcess = void 0;
const E1cDispatcher_1 = __importDefault(require("./E1cDispatcher"));
const git_utils_1 = require("./git-utils");
const getStagedFilesToProcess = async (filesExtensions, pathToDistDir) => (await git_utils_1.getStagedFiles())
    .filter((filepath) => filesExtensions.map((s) => `.${s}`).indexOf(filepath.slice(-4)) >= 0)
    .filter((filepath) => !pathToDistDir || `./${filepath}`.indexOf(pathToDistDir) === 0 || `${filepath}`.indexOf(pathToDistDir) === 0);
exports.getStagedFilesToProcess = getStagedFilesToProcess;
const processStagedFiles = async (e1cDispatcher) => {
    const dispatcher = e1cDispatcher || await E1cDispatcher_1.default.initWithLocalConfig();
    const dumpedFilesInfo = await exports.getStagedFilesToProcess(dispatcher.filesExtensions, dispatcher.pathToDistDir)
        .then((filepaths) => filepaths.map((filepath) => dispatcher.DumpExternalBinFile(filepath)));
    return Promise.all(dumpedFilesInfo);
};
exports.processStagedFiles = processStagedFiles;
const precommitHook = async () => {
    const dispatcher = await E1cDispatcher_1.default.initWithLocalConfig();
    const dumpedFilesInfo = await exports.processStagedFiles(dispatcher);
    Promise.all(dumpedFilesInfo.map((dumpedFileInfo) => git_utils_1.stageFolder(dumpedFileInfo.pathToSrcFiles)));
};
exports.precommitHook = precommitHook;
