import { performOsTask } from './console-operations';

const gitErrorCallback = async (result: string) => {
    const errorMessage = result.split('\n')
        .map((str) => str.trim())
        .filter((str) => str.length > 0)[0];
    // throw Error(errorMessage);
    return errorMessage;
};

export const getStagedFiles = async (workingDir: string = ''): Promise<string[]> => {
    const spawnOptions = workingDir.length === 0 ? undefined : { 'cwd': workingDir };

    let against = '';
    await performOsTask('git', ['rev-parse', '--verify', 'HEAD'], 'Git: rev-parse', spawnOptions,
        async (result: string) => {
            against = result.split('\n')
                .map((str) => str.trim())
                .filter((str) => str.length > 0)
                .pop() || '';
            return against;
        },
        gitErrorCallback);

    const diffParams = ['--cached', '--name-only', '--diff-filter=AM'];
    if (against) {
        diffParams.push(against);
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
