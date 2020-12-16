import E1cDispatcher, { DumpedFileInfo } from './E1cDispatcher';
import { getStagedFiles, stageDir } from './git-utils';

export const getStagedFilesToProcess = async (filesExtensions: string[], pathToDistDir?: string): Promise<string[]> => (await getStagedFiles())
    .filter((filepath) => filesExtensions.map((s) => `.${s}`).indexOf(filepath.slice(-4)) >= 0)
    .filter((filepath) => !pathToDistDir || `./${filepath}`.indexOf(pathToDistDir) === 0 || `${filepath}`.indexOf(pathToDistDir) === 0);

export const processStagedFiles = async (e1cDispatcher?: E1cDispatcher): Promise<DumpedFileInfo[]> => {
    const dispatcher = e1cDispatcher || await E1cDispatcher.initWithLocalConfig();
    const filesToDump = await getStagedFilesToProcess(dispatcher.filesExtensions, dispatcher.pathToDistDir);
    const dumpedFilesInfo: DumpedFileInfo[] = [];
    for (let i = 0; i < filesToDump.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        dumpedFilesInfo.push(await dispatcher.DumpExternalBinFile(filesToDump[i]));
    }
    return dumpedFilesInfo;
};

export const precommitHook = async () => {
    const dispatcher = await E1cDispatcher.initWithLocalConfig();
    const dumpedFilesInfo = await processStagedFiles(dispatcher);
    for (let i = 0; i < dumpedFilesInfo.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await stageDir(dumpedFilesInfo[i].pathToSrcFiles);
    }
};
