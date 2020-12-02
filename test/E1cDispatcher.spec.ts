import E1cDispatcher from '../src/E1cDispatcher';

jest.mock('fs');
const mockFs = jest.requireMock('fs');

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
        beforeAll(() => {
            mockFs.readFile.mockImplementation(() => Promise.resolve('{ "e1cRepoConfig": { "pathToExecutable": "some/path" } }'));
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
        beforeAll(() => {
            mockFs.readFile.mockImplementation(() => Promise.resolve('{ "e1cRepoConfig": {} }'));
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
        beforeAll(() => {
            mockFs.readFile.mockImplementation(() => Promise.resolve('{}'));
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
