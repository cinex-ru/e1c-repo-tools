/* eslint-disable jest/no-disabled-tests */
import { writeFileSync } from 'fs';
import childProcess from 'child_process';
import path from 'path';
import { getStagedFiles } from '../src/git-utils';
import { createTempDir, removeDir } from '../src/utils';

const filenames = ['file1.txt', 'file2.erf'];

// eslint-disable-next-line jest/no-disabled-tests
describe('When getting staged files', () => {
    describe('and directory not initialized', () => {
        test('should return empty array', async () => {
            const tempDir = await createTempDir();
            filenames.map((filename) => writeFileSync(path.join(tempDir, filename), ''));

            const stagedFiles = await getStagedFiles(tempDir);
            expect(stagedFiles).toEqual([]);

            await removeDir(tempDir);
        });
    });

    describe('and no files to commit', () => {
        test('should return empty array', async () => {
            const tempDir = await createTempDir();
            filenames.map((filename) => writeFileSync(path.join(tempDir, filename), ''));
            childProcess.spawnSync('git', ['init'], { 'cwd': tempDir });

            const stagedFiles = await getStagedFiles(tempDir);
            expect(stagedFiles).toEqual([]);

            await removeDir(tempDir);
        });
    });

    describe('and there are files to commit', () => {
        it('gets array of files names', async () => {
            const tempDir = await createTempDir();
            filenames.map((filename) => writeFileSync(path.join(tempDir, filename), ''));
            childProcess.spawnSync('git', ['init'], { 'cwd': tempDir });
            childProcess.spawnSync('git', ['add', '.'], { 'cwd': tempDir });

            const stagedFiles = await getStagedFiles(tempDir);
            expect(stagedFiles).toEqual(filenames);

            await removeDir(tempDir);
        });
    });
});
