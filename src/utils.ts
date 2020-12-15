import { exec } from 'child_process';
import { tmpdir } from 'os';
import path from 'path';
import { promises as fs } from 'fs';

export const execShellCommand = (cmd: string): Promise<string> => new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            reject(error);
        }
        resolve(stdout || stderr);
    });
});

export const createTempDir = async (prefix: string = ''): Promise<string> => fs.mkdtemp(path.join(tmpdir(), prefix, path.sep), {
    'encoding': 'utf8',
});

export const removeDir = async (dirPath: string) => {
    fs.rmdir(dirPath, { 'recursive': true });
};

// eslint-disable-next-line prefer-template
export const dateToLogString = (d: Date): string => ''
        + d.getFullYear().toString().padStart(4, '0')
        + (d.getMonth() + 1).toString().padStart(2, '0')
        + d.getDate().toString().padStart(2, '0')
        + '_'
        + d.getHours().toString().padStart(2, '0')
        + d.getMinutes().toString().padStart(2, '0')
        + d.getSeconds().toString().padStart(2, '0');
