/* eslint-disable jest/no-disabled-tests */
import { getStagedFilesToProcess, processStagedFiles } from '../src/precommit-hook';
import E1cDispatcher from '../src/E1cDispatcher';

jest.mock('fs');
const mockFs = jest.requireMock('fs');

const mockDumpExternalBinFile = jest.fn();

const { initWithLocalConfig } = E1cDispatcher;
jest.spyOn(E1cDispatcher, 'initWithLocalConfig').mockImplementation(async () => {
    const instance = await initWithLocalConfig();
    jest.spyOn(instance, 'DumpExternalBinFile').mockImplementation(mockDumpExternalBinFile);
    return instance;
});

const mockGetStagedFiles = jest.spyOn(jest.requireActual('../src/git-utils.ts'), 'getStagedFiles');

describe('When getting staged files', () => {
    describe('and there are files to commit', () => {
        beforeAll(() => {
            mockGetStagedFiles.mockImplementation(() => Promise.resolve(['file1.txt', 'file2.erf', 'file3.exe']));
        });

        it('gets filtered array of files names', async () => {
            expect(await getStagedFilesToProcess(['erf', 'exe'])).toEqual(['file2.erf', 'file3.exe']);
        });

        describe.each([
            ['./good/path'],
            ['good/path'],
        ])('and path to dist dir defined', (goodPath) => {
            beforeAll(() => {
                mockGetStagedFiles.mockImplementation(() => Promise
                    .resolve(['file1.txt', 'good/path/file2.erf', 'bad/path/file3.exe', 'good/path/smth/file4.exe']));
            });

            it(`gets filtered array of files names for path ${goodPath}`, async () => {
                expect(await getStagedFilesToProcess(['erf', 'exe'], goodPath)).toEqual(['good/path/file2.erf', 'good/path/smth/file4.exe']);
            });
        });
    });
});

describe('When processing staged files', () => {
    beforeAll(() => {
        mockGetStagedFiles.mockImplementation(() => Promise.resolve(['file1.txt', 'path/to/dist/file2.erf', 'path/to/dist/smth/file3.epf']));
        mockFs.readFile.mockImplementation(() => Promise.resolve(`{ "e1cRepoConfig": {
            "pathToExecutable": "some/path",
            "pathToDistDir": "path/to/dist"
        } }`));
    });

    describe('and got dispatcher', () => {
        it('dumps bin files', async () => {
            const e1cDispatcher = await E1cDispatcher.initWithLocalConfig();
            await processStagedFiles(e1cDispatcher);

            expect(mockDumpExternalBinFile.mock.calls[0][0]).toBe('path/to/dist/file2.erf');
            expect(mockDumpExternalBinFile.mock.calls[1][0]).toBe('path/to/dist/smth/file3.epf');
        });
    });
});
