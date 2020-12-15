#!/usr/bin/env node

import { switchLogUpdateOn } from './console-operations';
import E1cDispatcher, { DumpedFileInfo } from './E1cDispatcher';
import { getDirStatus, stageDir } from './git-utils';

export const getChangedFilesToProcess = async (
    filesExtensions: string[],
    pathToDistDir: string,
): Promise<string[]> => (await getDirStatus(pathToDistDir))
    .map((str) => str.split(' ')).filter((str) => str.length > 0).splice(-1)[0]
    .filter((filepath) => filesExtensions.map((s) => `.${s}`).indexOf(filepath.slice(-4)) >= 0);

export const processChangedFiles = async (e1cDispatcher?: E1cDispatcher): Promise<DumpedFileInfo[]> => {
    const dispatcher = e1cDispatcher || await E1cDispatcher.initWithLocalConfig();
    const dumpedFilesInfo = await getChangedFilesToProcess(dispatcher.filesExtensions, dispatcher.pathToDistDir)
        .then((filepaths) => filepaths.map((filepath) => dispatcher.DumpExternalBinFile(filepath)));
    return Promise.all(dumpedFilesInfo);
};

const main = async () => {
    const dispatcher = await E1cDispatcher.initWithLocalConfig();
    const dumpedFilesInfo = await processChangedFiles(dispatcher);
    Promise.all(dumpedFilesInfo.map((dumpedFileInfo) => stageDir(dumpedFileInfo.pathToSrcFiles)));
};

switchLogUpdateOn();
main();
