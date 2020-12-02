import { getStagedFiles } from '../src/git-utils';

jest.mock('simple-git');
const mockGit = jest.requireMock('simple-git');

describe('When getting staged files', () => {
    describe('and no files to commit', () => {
        beforeAll(() => {
            mockGit.diff.mockImplementation(() => Promise.resolve(''));
        });

        it('gets empty array', async () => {
            expect(await getStagedFiles()).toEqual([]);
        });
    });

    describe('and there are files to commit', () => {
        beforeAll(() => {
            mockGit.diff.mockImplementation(() => Promise.resolve('file1.txt\nfile2.erf\n'));
        });

        it('gets array of files names', async () => {
            expect(await getStagedFiles()).toEqual(['file1.txt', 'file2.erf']);
        });
    });
});
