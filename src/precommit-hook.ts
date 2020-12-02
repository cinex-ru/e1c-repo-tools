import { getStagedFiles } from './git-utils';

export const getStagedFilesToProcess = async (filesExtensions: string[], pathToDistDir?: string): Promise<string[]> => (await getStagedFiles())
    .filter((filepath) => filesExtensions.map((s) => `.${s}`).indexOf(filepath.slice(-4)) >= 0)
    .filter((filepath) => !pathToDistDir || `./${filepath}`.indexOf(pathToDistDir) === 0);
