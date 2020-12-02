import { execShellCommand } from '../src/utils';

jest.mock('child_process');
const mockChildProcess = jest.requireMock('child_process');

describe('When executing shell command', () => {
    beforeAll(() => {
        mockChildProcess.exec.mockImplementation(() => Promise.resolve(''));
    });

    it('executes command', async () => {
        const testCommand = 'test command';
        execShellCommand(testCommand);

        expect(mockChildProcess.exec).toHaveBeenCalledWith(testCommand, expect.anything());
    });
});
