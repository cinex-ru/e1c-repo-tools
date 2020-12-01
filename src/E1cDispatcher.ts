import { promises as fs } from 'fs';

interface E1cRepoConfig {
    pathToExecutable: string,
    pathToSrcDir?: string,
    pathToDistDir?: string,
    filesExtensions?: string[],
    pathToLogsDir?: string
}

const getE1cRepoConfig = async (): Promise<E1cRepoConfig> => {
    const pjson = JSON.parse(await fs.readFile('./package.json', {
        'encoding': 'utf8',
    }));
    if (pjson.e1cRepoConfig) {
        return pjson.e1cRepoConfig;
    }
    throw new Error('Repo config not found in "package.json"');
    // return undefined;
};

export default class E1cDispatcher {
    readonly pathToExecutable: string | undefined;
    readonly pathToSrcDir: string;
    readonly pathToDistDir: string;
    readonly filesExtensions: string[];
    readonly pathToLogsDir: string;

    static async initWithLocalConfig(): Promise<E1cDispatcher> {
        const config = await getE1cRepoConfig();
        if (!config.pathToExecutable) {
            throw new Error('Path to 1C executable undefined');
        }
        return new E1cDispatcher(config!);
    }

    constructor(e1cRepoConfig: E1cRepoConfig) {
        this.pathToExecutable = e1cRepoConfig.pathToExecutable;
        this.pathToSrcDir = e1cRepoConfig.pathToSrcDir || './src';
        this.pathToDistDir = e1cRepoConfig.pathToDistDir || './dist';
        this.filesExtensions = [...e1cRepoConfig.filesExtensions! || ['erf', 'epf']];
        this.pathToLogsDir = e1cRepoConfig.pathToLogsDir || './logs';
    }
}
