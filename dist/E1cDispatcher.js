"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const util_1 = require("util");
const console_operations_1 = require("./console-operations");
const utils_1 = require("./utils");
const getE1cRepoConfig = async () => {
    const pjson = JSON.parse(await fs_1.promises.readFile('./package.json', {
        'encoding': 'utf8',
    }));
    if (pjson.e1cRepoConfig) {
        return pjson.e1cRepoConfig;
    }
    throw new Error('Repo config not found in "package.json"');
};
class E1cDispatcher {
    constructor(e1cRepoConfig) {
        this.pathToExecutable = e1cRepoConfig.pathToExecutable;
        this.pathToSrcDir = e1cRepoConfig.pathToSrcDir || './src';
        this.pathToDistDir = e1cRepoConfig.pathToDistDir || './dist';
        this.filesExtensions = [...e1cRepoConfig.filesExtensions || ['erf', 'epf']];
        this.pathToLogsDir = e1cRepoConfig.pathToLogsDir || './logs';
    }
    static async initWithLocalConfig() {
        const config = await getE1cRepoConfig();
        if (!config.pathToExecutable) {
            throw new Error('Path to 1C executable undefined');
        }
        return new E1cDispatcher(config);
    }
    async DumpExternalBinFile(pathToBinFile) {
        const basename = path_1.default.basename(pathToBinFile);
        const basenameWithoutExt = basename.indexOf('.') < 0 ? basename : basename.split('.').filter((str) => str.length > 0).slice(0, -1).join('.');
        const pathToSrcFiles = path_1.default.join(path_1.default.resolve(this.pathToSrcDir), basename);
        const pathToLogFile = path_1.default.join(this.pathToLogsDir, `${utils_1.dateToLogString(new Date())}_${basename}.log`);
        if (!fs_1.existsSync(path_1.default.resolve(this.pathToSrcDir))) {
            await fs_1.promises.mkdir(path_1.default.resolve(this.pathToSrcDir));
        }
        await console_operations_1.performOsTask(this.pathToExecutable, [
            'DESIGNER',
            '/DumpExternalDataProcessorOrReportToFiles',
            path_1.default.join(pathToSrcFiles, basenameWithoutExt),
            path_1.default.resolve(pathToBinFile),
            '-Format', 'Hierarchical',
            '/Out', pathToLogFile,
        ], `Dumping ${pathToBinFile}`, undefined, async () => {
            const regexp = /Выгрузка завершена[^\d]+(?<time>\d+)/gmiu;
            const textDecoder = new util_1.TextDecoder('windows-1251');
            const logText = textDecoder.decode(await fs_1.promises.readFile(pathToLogFile));
            const match = regexp.exec(logText);
            if (match && match.groups) {
                return `${match.groups.time}ms`;
            }
            return Error('fail');
        });
        return { pathToBinFile, pathToSrcFiles };
    }
}
exports.default = E1cDispatcher;
