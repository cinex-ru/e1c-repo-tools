export const revparse = jest.fn(() => Promise.resolve(''));
export const diff = jest.fn(() => Promise.resolve('123'));

const SimpleGit = () => ({
    revparse,
    diff,
});

export default SimpleGit;
