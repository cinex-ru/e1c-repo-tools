import path from 'path';
import { cwd } from 'process';
import { performOsTask } from './console-operations';

const gitErrorCallback = async (result: string) => {
    const errorMessage = result.split('\n')
        .map((str) => str.trim())
        .filter((str) => str.length > 0)[0];
    return errorMessage;
};

export const revParse = async (revision: string = 'HEAD', workDir: string = ''): Promise<string> => {
    const spawnOptions = workDir.length === 0 ? undefined : { 'cwd': workDir };

    let hash = '';
    await performOsTask('git', ['rev-parse', '--verify', revision], 'Git: rev-parse', spawnOptions,
        async (result: string) => {
            hash = result.split('\n')
                .map((str) => str.trim())
                .filter((str) => str.length > 0)
                .pop() || '';
            return hash;
        },
        gitErrorCallback);

    return hash;
};

export const getStagedFiles = async (workDir: string = ''): Promise<string[]> => {
    const spawnOptions = workDir.length === 0 ? undefined : { 'cwd': workDir };

    const hash = await revParse();

    const diffParams = ['--cached', '--name-only', '--diff-filter=AM'];
    if (hash) {
        diffParams.push(hash);
    }

    let files: string[] = [];
    await performOsTask('git', ['diff', ...diffParams], 'Git: diff', spawnOptions,
        async (result: string) => {
            files = result.split('\n')
                .map((str) => str.trim())
                .filter((str) => str.length > 0);
            return files.length.toString();
        },
        gitErrorCallback);

    return files;
};

export const stageDir = async (pathToDir: string, workDir: string = '') => {
    const spawnOptions = workDir.length === 0 ? undefined : { 'cwd': workDir };
    const relPathToDir = path.relative(workDir.length === 0 ? cwd() : workDir, pathToDir);

    await performOsTask('git', ['add', pathToDir], `Git: add new files '${relPathToDir}'`, spawnOptions,
        undefined,
        gitErrorCallback);
};

export const getDirStatus = async (pathToDir: string, workDir: string = ''): Promise<string[]> => {
    const spawnOptions = workDir.length === 0 ? undefined : { 'cwd': workDir };
    const relPathToDir = path.relative(workDir.length === 0 ? cwd() : workDir, pathToDir);

    let files: string[] = [];
    await performOsTask('git', ['status', '--porcelain', '-uall', pathToDir], `Git: status '${relPathToDir}'`, spawnOptions,
        async (result: string) => {
            files = result.split('\n')
                .map((str) => str.trim())
                .filter((str) => str.length > 0);
            return files.length.toString();
        },
        gitErrorCallback);

    return files;
};
