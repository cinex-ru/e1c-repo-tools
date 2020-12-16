import { TextDecoder } from 'util';
import logUpdate from 'log-update';
import logSymbols from 'log-symbols';
import chalk from 'chalk';
import childProcess from 'child_process';

export const sleep = (ms: number) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});

const textDecoder = new TextDecoder();
let logUpdateActive = false;
let logUpdateIsOn = false;

export const switchLogUpdateOn = () => {
    logUpdateIsOn = true;
};

export const switchLogUpdateOff = () => {
    logUpdateIsOn = false;
};

type LogMessageType = 'Success' | 'Info' | 'Warning' | 'Error';
interface LogMessageSettings {
    prefix: string | undefined;
    style: chalk.Chalk;
}
// eslint-disable-next-line no-unused-vars
type LogMessagesConfig = { [K in LogMessageType]: LogMessageSettings };

const logMessagesConfig: LogMessagesConfig = {
    'Success': { 'prefix': logSymbols.success, 'style': chalk.green.bold },
    'Info': { 'prefix': logSymbols.info, 'style': chalk.blueBright },
    'Warning': { 'prefix': logSymbols.warning, 'style': chalk.yellow },
    'Error': { 'prefix': logSymbols.error, 'style': chalk.red },
};

export const getLogUpdateStatus = (): boolean => logUpdateIsOn;

export const startLogUpdate = async (operationTitle: string) => {
    logUpdateActive = true;
    const frames = ['-', '\\', '|', '/'];
    let i = 0;
    while (logUpdateActive) {
        const frame = frames[i = (i + 1) % frames.length];
        if (getLogUpdateStatus()) {
            logUpdate(`${operationTitle} ${frame}`);
        }
        // eslint-disable-next-line no-await-in-loop
        await sleep(50);
    }
};

export const buildLogMessage = (operationTitle: string, messageType: LogMessageType, additionalData?: string) => {
    let addData = additionalData;
    if (!addData) {
        if (messageType === 'Success') {
            addData = 'ok';
        } else if (messageType === 'Error') {
            addData = 'fail';
        }
    }
    if (addData) {
        if (messageType === 'Success' || messageType === 'Error') {
            addData = ` [${logMessagesConfig[messageType].style(addData)}]`;
        } else {
            addData = ` ${logMessagesConfig[messageType].style(addData)}`;
        }
    }

    return `${logMessagesConfig[messageType].prefix} ${operationTitle} ${addData}`;
};

export const log = (operationTitle: string, messageType: LogMessageType, additionalData?: string) => {
    logUpdate(buildLogMessage(operationTitle, messageType, additionalData));
    logUpdate.done();
};

export const success = (operationTitle: string, additionalData?: string) => {
    logUpdate(buildLogMessage(operationTitle, 'Success', additionalData));
    logUpdate.done();
};

export const error = (operationTitle: string, additionalData?: string) => {
    logUpdate(buildLogMessage(operationTitle, 'Error', additionalData));
    logUpdate.done();
};

export const warn = (operationTitle: string, additionalData?: string) => {
    logUpdate(buildLogMessage(operationTitle, 'Warning', additionalData));
    logUpdate.done();
};

export const info = (operationTitle: string, additionalData?: string) => {
    logUpdate(buildLogMessage(operationTitle, 'Info', additionalData));
    logUpdate.done();
};

export const stopLogUpdate = (operationTitle: string, messageType: LogMessageType, additionalData?: string) => {
    logUpdateActive = false;
    log(operationTitle, messageType, additionalData);
};

export const performOsTask = async (command: string, args: string[], taskTitle: string, options?: childProcess.SpawnOptionsWithoutStdio,
    // eslint-disable-next-line no-unused-vars
    onSuccess?: (result: string) => Promise<string | Error | undefined>, onError?: (result: string) => Promise<string | undefined>) => {
    const osTask = childProcess.spawn(command, args, options);
    const chunks: Buffer[] = [];

    osTask.stdout.on('data', (data) => {
        chunks.push(data);
    });

    osTask.stdout.on('end', async () => {
        if (!logUpdateActive) {
            return;
        }

        let additionalData: string | Error | undefined;
        const resultString = textDecoder.decode(new Uint8Array(chunks.flatMap((buffer) => [...buffer])));
        if (onSuccess) {
            additionalData = await onSuccess(resultString);
        }
        if (additionalData instanceof Error) {
            stopLogUpdate(taskTitle, 'Error', additionalData.message);
            throw additionalData;
        } else {
            stopLogUpdate(taskTitle, 'Success', additionalData);
        }
    });

    osTask.stderr.on('data', async (data) => {
        if (!logUpdateActive) {
            return;
        }

        let additionalData: string | undefined;
        // git pull print to stderr
        // TODO: filter stderr output
        const errorMessage = textDecoder.decode(data);
        if (!onError) {
            stopLogUpdate(taskTitle, 'Error', errorMessage);
            throw Error(errorMessage);
        } else {
            additionalData = await onError(errorMessage);
            if (additionalData) {
                stopLogUpdate(taskTitle, 'Error', additionalData);
            }
        }
    });

    await startLogUpdate(taskTitle);
};
