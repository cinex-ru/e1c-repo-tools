#!/usr/bin/env node

import { switchLogUpdateOn } from './console-operations';
import E1cDispatcher, { DumpedFileInfo } from './E1cDispatcher';
import { getDirStatus, stageDir } from './git-utils';

export const getChangedFilesToProcess = async (
    filesExtensions: string[],
    pathToDistDir: string,
): Promise<string[]> => (await getDirStatus(pathToDistDir))
    .map((str) => str.split(' ')).map((arr) => arr.filter((str) => str.length > 0).splice(-1)[0])
    .filter((filepath) => filesExtensions.map((s) => `.${s}`).indexOf(filepath.slice(-4)) >= 0);

// TODO: remove duplicated code ./src/precommit-hook.ts
export const processChangedFiles = async (e1cDispatcher?: E1cDispatcher): Promise<DumpedFileInfo[]> => {
    const dispatcher = e1cDispatcher || await E1cDispatcher.initWithLocalConfig();
    const filesToDump = await getChangedFilesToProcess(dispatcher.filesExtensions, dispatcher.pathToDistDir);
    const dumpedFilesInfo: DumpedFileInfo[] = [];
    for (let i = 0; i < filesToDump.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        dumpedFilesInfo.push(await dispatcher.DumpExternalBinFile(filesToDump[i]));
    }
    return dumpedFilesInfo;
};

const main = async () => {
    const dispatcher = await E1cDispatcher.initWithLocalConfig();
    const dumpedFilesInfo = await processChangedFiles(dispatcher);
    for (let i = 0; i < dumpedFilesInfo.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await stageDir(dumpedFilesInfo[i].pathToSrcFiles);
    }
};

switchLogUpdateOn();
main();
