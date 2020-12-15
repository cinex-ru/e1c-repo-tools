import path from 'path';
import E1cDispatcher from '../src/E1cDispatcher';

jest.mock('fs');
const mockFs = jest.requireMock('fs');
mockFs.existsSync = jest.fn().mockImplementation(() => true);

jest.mock('../src/console-operations.ts');
const mockConsoleOperations = jest.requireMock('../src/console-operations.ts');

describe('When init dispatcher with config', () => {
    describe('and config defined with all fields', () => {
        it('inits ok', async () => {
            expect(await E1cDispatcher.initWithLocalConfig()).toBeInstanceOf(E1cDispatcher);
        });

        it('gets path to executable', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToExecutable).toBe('path/to/executable');
        });

        it('gets path to src dir', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToSrcDir).toBe('path/to/src');
        });

        it('gets path to dist dir', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToDistDir).toBe('path/to/dist');
        });

        it('gets files extensions', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).filesExtensions).toEqual(['file', 'exts']);
        });

        it('gets path to logs dir', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToLogsDir).toBe('path/to/logs');
        });
    });

    describe('and config defined with path to executable only', () => {
        beforeEach(() => {
            mockFs.readFile.mockImplementationOnce(() => Promise.resolve('{ "e1cRepoConfig": { "pathToExecutable": "some/path" } }'));
        });

        it('inits ok', async () => {
            expect(await E1cDispatcher.initWithLocalConfig()).toBeInstanceOf(E1cDispatcher);
        });

        it('gets path to executable', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToExecutable).toBe('some/path');
        });

        it('gets default path to src dir', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToSrcDir).toBe('./src');
        });

        it('gets default path to dist dir', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToDistDir).toBe('./dist');
        });

        it('gets default files extensions', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).filesExtensions).toEqual(['erf', 'epf']);
        });

        it('gets default path to logs dir', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToLogsDir).toBe('./logs');
        });
    });

    describe('and config defined without path to executable', () => {
        beforeEach(() => {
            mockFs.readFile.mockImplementationOnce(() => Promise.resolve('{ "e1cRepoConfig": {} }'));
        });

        it('throws an error', async () => {
            expect.assertions(1);
            try {
                await E1cDispatcher.initWithLocalConfig();
            } catch (e) {
                // eslint-disable-next-line
                expect((e as Error).message).toEqual(
                    'Path to 1C executable undefined',
                );
            }
        });
    });

    describe('and config not defined', () => {
        beforeEach(() => {
            mockFs.readFile.mockImplementationOnce(() => Promise.resolve('{}'));
        });

        it('throws an error', async () => {
            expect.assertions(1);
            try {
                await E1cDispatcher.initWithLocalConfig();
            } catch (e) {
            // eslint-disable-next-line
            expect((e as Error).message).toEqual(
                    'Repo config not found in "package.json"',
                );
            }
        });
    });
});

describe('When dumping external bin file', () => {
    beforeAll(async () => {
        mockConsoleOperations.performOsTask.mockImplementation(jest.fn());
    });

    test('should run 1cv8 executable with given config', async () => {
        const pathToBinFile = 'path/to/bin/file';
        const e1cDispatcher = await E1cDispatcher.initWithLocalConfig();
        await e1cDispatcher.DumpExternalBinFile(pathToBinFile);
        const basename = path.basename(pathToBinFile);
        const basenameWithoutExt = basename.indexOf('.') < 0 ? basename : basename.split('.').filter((str) => str.length > 0).slice(0, -1).join('.');
        const absolutePathRoSrcFiles = path.join(path.resolve(e1cDispatcher.pathToSrcDir), basename, basenameWithoutExt);
        const absolutePathToBinFile = path.resolve(pathToBinFile);

        expect(mockConsoleOperations.performOsTask.mock.calls[1][0]).toBe(e1cDispatcher.pathToExecutable);
        expect(mockConsoleOperations.performOsTask.mock.calls[1][1][0]).toBe('DESIGNER');
        expect(mockConsoleOperations.performOsTask.mock.calls[1][1][1]).toBe('/DumpExternalDataProcessorOrReportToFiles');
        expect(mockConsoleOperations.performOsTask.mock.calls[1][1][2]).toBe(absolutePathRoSrcFiles);
        expect(mockConsoleOperations.performOsTask.mock.calls[1][1][3]).toBe(absolutePathToBinFile);
        expect(mockConsoleOperations.performOsTask.mock.calls[1][1][4]).toBe('-Format');
        expect(mockConsoleOperations.performOsTask.mock.calls[1][1][5]).toBe('Hierarchical');
        expect(mockConsoleOperations.performOsTask.mock.calls[1][1][6]).toBe('/Out');
        expect(mockConsoleOperations.performOsTask.mock.calls[1][1][7]).toMatch(
            new RegExp(`${path.join(e1cDispatcher.pathToLogsDir, path.sep)
                .split(path.sep).join(`\\${path.sep}`)}\\d+_\\d+_${basename}\\.log`),
        );
    });

    test('should return path to bin file and path to source files', async () => {
        const pathToBinFile = 'path/to/bin/file';
        const e1cDispatcher = await E1cDispatcher.initWithLocalConfig();
        const result = await e1cDispatcher.DumpExternalBinFile(pathToBinFile);
        const basename = path.basename(pathToBinFile);
        const absolutePathRoSrcFiles = path.join(path.resolve(e1cDispatcher.pathToSrcDir), basename);

        expect(result.pathToBinFile).toBe(pathToBinFile);
        expect(result.pathToSrcFiles).toBe(absolutePathRoSrcFiles);
    });
});
