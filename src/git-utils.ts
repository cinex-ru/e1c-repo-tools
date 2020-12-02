import SimpleGit from 'simple-git';

export const getStagedFiles = async ():Promise<string[]> => {
    const git = SimpleGit();

    let against = '';
    try {
        against = await git.revparse(['--verify', 'HEAD']);
    } catch (e) { // GitError if no revisions
    }

    const diffParams = ['--cached', '--name-only', '--diff-filter=AM'];
    if (against) {
        diffParams.push(against);
    }

    return (await git.diff(diffParams)).split('\n').filter((fn) => fn.length > 0);
};
