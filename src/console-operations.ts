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

export const stopLogUpdate = (operationTitle: string, isSuccessful: boolean, additionalData?: string) => {
    logUpdateActive = false;
    let addData = additionalData;
    if (!addData) {
        if (isSuccessful) {
            addData = 'ok';
        } else {
            addData = `[${chalk.red('fail')}]`;
        }
    }
    if (isSuccessful) {
        logUpdate(`${logSymbols.success} ${operationTitle} [${chalk.green.bold(addData)}]`);
    } else {
        logUpdate(`${logSymbols.error} ${operationTitle} ${chalk.red(addData)}`);
    }
    logUpdate.done();
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
            stopLogUpdate(taskTitle, false, additionalData.message);
            throw additionalData;
        } else {
            stopLogUpdate(taskTitle, true, additionalData);
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
            stopLogUpdate(taskTitle, false, errorMessage);
            throw Error(errorMessage);
        } else {
            additionalData = await onError(errorMessage);
            if (additionalData) {
                stopLogUpdate(taskTitle, false, additionalData);
            }
        }
    });

    await startLogUpdate(taskTitle);
};
