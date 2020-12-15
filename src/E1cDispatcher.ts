import path from 'path';
import { promises as fs, existsSync } from 'fs';
import { TextDecoder } from 'util';
import { performOsTask } from './console-operations';
import { dateToLogString, removeDir } from './utils';
import { getDirStatus, revParse } from './git-utils';

interface E1cRepoConfig {
    pathToExecutable: string,
    pathToSrcDir?: string,
    pathToDistDir?: string,
    filesExtensions?: string[],
    pathToLogsDir?: string
}

export interface DumpedFileInfo {
    pathToBinFile: string,
    pathToSrcFiles: string
}

const getE1cRepoConfig = async (): Promise<E1cRepoConfig> => {
    const pjson = JSON.parse(await fs.readFile('./package.json', {
        'encoding': 'utf8',
    }));
    if (pjson.e1cRepoConfig) {
        return pjson.e1cRepoConfig;
    }
    throw new Error('Repo config not found in "package.json"');
};

export default class E1cDispatcher {
    readonly pathToExecutable: string;
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

    async DumpExternalBinFile(pathToBinFile: string): Promise<DumpedFileInfo> {
        const basename = path.basename(pathToBinFile);
        const basenameWithoutExt = basename.indexOf('.') < 0 ? basename : basename.split('.').filter((str) => str.length > 0).slice(0, -1).join('.');
        const pathToSrcFiles = path.join(path.resolve(this.pathToSrcDir), basename);
        const pathToLogFile = path.join(this.pathToLogsDir, `${dateToLogString(new Date())}_${basename}.log`);

        if (existsSync(path.resolve(pathToSrcFiles))) {
            const changes = await getDirStatus(pathToSrcFiles);
            if (changes.length > 0) {
                const hash = await revParse();
                const backUpName = `${pathToSrcFiles}.${hash.length > 0 ? `${hash.slice(0, 8)}.` : ''}bak`;

                let newBackupName = backUpName;
                let index = 0;
                while (existsSync(newBackupName)) {
                    index += 1;
                    newBackupName = `${backUpName}${index}`;
                }
                await fs.rename(pathToSrcFiles, newBackupName);
            }
            await removeDir(pathToSrcFiles);
        }

        if (!existsSync(path.resolve(this.pathToLogsDir))) {
            await fs.mkdir(path.resolve(this.pathToLogsDir));
        }

        await performOsTask(this.pathToExecutable, [
            'DESIGNER',
            '/DumpExternalDataProcessorOrReportToFiles',
            path.join(pathToSrcFiles, basenameWithoutExt),
            path.resolve(pathToBinFile),
            '-Format', 'Hierarchical',
            '/Out', pathToLogFile,
        ], `Dumping ${pathToBinFile}`, undefined,
        async () => {
            const regexp = /Выгрузка завершена[^\d]+(?<time>\d+)/gmiu;
            const textDecoder = new TextDecoder('windows-1251');
            const logText = textDecoder.decode(await fs.readFile(pathToLogFile));
            const match = regexp.exec(logText);
            if (match && match.groups) {
                return `${match.groups.time}ms`;
            }

            return Error('fail');
        });

        return { pathToBinFile, pathToSrcFiles };
    }
}
