export const readFile = jest.fn(() => Promise.resolve(`{
    "e1cRepoConfig": {
        "pathToExecutable": "path/to/executable",
        "pathToSrcDir": "path/to/src",
        "pathToDistDir": "path/to/dist",
        "filesExtensions": ["file", "exts"],
        "pathToLogsDir": "path/to/logs"
    }
}`));

export const promises = {
    'readFile': jest.fn((filename: string) => {
        if (filename === 'test1.txt') {
            return Promise.resolve('234');
        }
        if (filename === './package.json' || filename === 'package.json') {
            return readFile();
        }
        throw new Error(`Error no file ${filename}`);
    }),
};
