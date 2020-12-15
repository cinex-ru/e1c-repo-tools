import E1cDispatcher, { DumpedFileInfo } from './E1cDispatcher';
import { getStagedFiles, stageFolder } from './git-utils';

export const getStagedFilesToProcess = async (filesExtensions: string[], pathToDistDir?: string): Promise<string[]> => (await getStagedFiles())
    .filter((filepath) => filesExtensions.map((s) => `.${s}`).indexOf(filepath.slice(-4)) >= 0)
    .filter((filepath) => !pathToDistDir || `./${filepath}`.indexOf(pathToDistDir) === 0 || `${filepath}`.indexOf(pathToDistDir) === 0);

export const processStagedFiles = async (e1cDispatcher?: E1cDispatcher): Promise<DumpedFileInfo[]> => {
    const dispatcher = e1cDispatcher || await E1cDispatcher.initWithLocalConfig();
    const dumpedFilesInfo = await getStagedFilesToProcess(dispatcher.filesExtensions, dispatcher.pathToDistDir)
        .then((filepaths) => filepaths.map((filepath) => dispatcher.DumpExternalBinFile(filepath)));
    return Promise.all(dumpedFilesInfo);
};

export const precommitHook = async () => {
    const dispatcher = await E1cDispatcher.initWithLocalConfig();
    const dumpedFilesInfo = await processStagedFiles(dispatcher);
    Promise.all(dumpedFilesInfo.map((dumpedFileInfo) => stageFolder(dumpedFileInfo.pathToSrcFiles)));
};
