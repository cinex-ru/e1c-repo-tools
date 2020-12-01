import E1cDispatcher from '../src/E1cDispatcher';

jest.mock('fs');
const mockFs = jest.requireMock('fs');

describe('Analyzing repo config', () => {
    describe('config defined with all fields', () => {
        it('if defined inits ok', async () => {
            expect(await E1cDispatcher.initWithLocalConfig()).toBeInstanceOf(E1cDispatcher);
        });

        it('if defined get path to executable', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToExecutable).toBe('path/to/executable');
        });

        it('if defined get path to src dir', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToSrcDir).toBe('path/to/src');
        });

        it('if defined get path to dist dir', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToDistDir).toBe('path/to/dist');
        });

        it('if defined get files extensions', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).filesExtensions).toEqual(['file', 'exts']);
        });

        it('if defined get path to logs dir', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToLogsDir).toBe('path/to/logs');
        });
    });

    describe('config defined with path to executable only', () => {
        beforeAll(() => {
            mockFs.readFile.mockImplementation(() => Promise.resolve('{ "e1cRepoConfig": { "pathToExecutable": "some/path" } }'));
        });

        it('if defined inits ok', async () => {
            expect(await E1cDispatcher.initWithLocalConfig()).toBeInstanceOf(E1cDispatcher);
        });

        it('if defined get path to executable', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToExecutable).toBe('some/path');
        });

        it('if defined get default path to src dir', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToSrcDir).toBe('./src');
        });

        it('if defined get default path to dist dir', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToDistDir).toBe('./dist');
        });

        it('if defined get default files extensions', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).filesExtensions).toEqual(['erf', 'epf']);
        });

        it('if defined get default path to logs dir', async () => {
            expect((await E1cDispatcher.initWithLocalConfig()).pathToLogsDir).toBe('./logs');
        });
    });

    describe('config defined with undefined path to executable', () => {
        beforeAll(() => {
            mockFs.readFile.mockImplementation(() => Promise.resolve('{ "e1cRepoConfig": {} }'));
        });

        it('if undefined path to executable throws an error', async () => {
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

    describe('config not defined', () => {
        beforeAll(() => {
            mockFs.readFile.mockImplementation(() => Promise.resolve('{}'));
        });

        it('if not defined throws an error', async () => {
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
