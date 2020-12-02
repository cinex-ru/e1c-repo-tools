export const exec = jest.fn(() => Promise.resolve(''));

const mock = () => ({
    exec,
});

export default mock;
