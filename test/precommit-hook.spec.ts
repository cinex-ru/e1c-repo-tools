import { getStagedFilesToProcess } from '../src/precommit-hook';

jest.mock('simple-git');
const mockGit = jest.requireMock('simple-git');

describe('When getting staged files', () => {
    describe('and there are files to commit', () => {
        beforeAll(() => {
            mockGit.diff.mockImplementation(() => Promise.resolve('file1.txt\nfile2.erf\nfile3.exe\n'));
        });

        it('gets filtered array of files names', async () => {
            expect(await getStagedFilesToProcess(['erf', 'exe'])).toEqual(['file2.erf', 'file3.exe']);
        });

        describe('and path to dist dir defined', () => {
            beforeAll(() => {
                mockGit.diff.mockImplementation(() => Promise
                    .resolve('file1.txt\ngood/path/file2.erf\nbad/path/file3.exe\ngood/path/smth/file4.exe\n'));
            });

            it('gets filtered array of files names', async () => {
                expect(await getStagedFilesToProcess(['erf', 'exe'], './good/path')).toEqual(['good/path/file2.erf', 'good/path/smth/file4.exe']);
            });
        });
    });
});
