#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { switchLogUpdateOn } from './console-operations';
import E1cDispatcher from './E1cDispatcher';

export const getRootSrcFiles = async (e1cDispatcher?: E1cDispatcher): Promise<string[]> => {
    const dispatcher = e1cDispatcher || await E1cDispatcher.initWithLocalConfig();
    return Promise.all(
        (await fs.readdir(dispatcher.pathToSrcDir, { 'encoding': 'utf8', 'withFileTypes': true }))
            .filter((file) => file.isDirectory && !file.name.match(/.bak\d*$/gmi))
            .map(async (dir) => path.join(dispatcher.pathToSrcDir, dir.name,
                (await fs.readdir(path.join(dispatcher.pathToSrcDir, dir.name), { 'encoding': 'utf8', 'withFileTypes': true }))
                    .filter((file) => file.isFile && file.name.match(/.xml$/gmi))[0].name)),
    );
};

const main = async () => {
    const dispatcher = await E1cDispatcher.initWithLocalConfig();
    const rootSrcFiles = await getRootSrcFiles(dispatcher);
    for (let i = 0; i < rootSrcFiles.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await dispatcher.BuildExternalBinFile(rootSrcFiles[i]);
    }
};

switchLogUpdateOn();
main();
