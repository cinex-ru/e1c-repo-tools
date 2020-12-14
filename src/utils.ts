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
