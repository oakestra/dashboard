import { AppErrorHandler } from './app-error-handler';

describe('AppErrorHandler', () => {
    it('should log the received error to the console', () => {
        const handler = new AppErrorHandler();
        const error = new Error('boom');
        spyOn(console, 'log');

        handler.handleError(error);

        expect(console.log).toHaveBeenCalledWith(error);
    });
});
