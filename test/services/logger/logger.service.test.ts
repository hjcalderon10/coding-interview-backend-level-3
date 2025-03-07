import { LoggerService } from '@/services/logger/logger.service';
import { LoggerContextService } from '@/services/logger/logger-context.service';
import { ENV } from '@/server/config/environment';

describe('LoggerService', () => {
    let loggerMock: any;

    beforeEach(() => {
        loggerMock = {
            info: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
        };

        jest.spyOn(LoggerContextService, 'requestId', 'get').mockReturnValue('test-request-id');

        LoggerService.logger = loggerMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should log info messages', () => {
        LoggerService.info('Info message', { key: 'value' });

        expect(loggerMock.info).toHaveBeenCalledWith(
            { requestId: 'test-request-id', key: 'value' },
            'Info message'
        );
    });

    it('should log error messages', () => {
        LoggerService.error('Error message', { key: 'value' });

        expect(loggerMock.error).toHaveBeenCalledWith(
            { requestId: 'test-request-id', key: 'value' },
            'Error message'
        );
    });

    it('should log debug messages when LOG_LEVEL is debug', () => {
        ENV.LOG_LEVEL = 'debug';
        LoggerService.debug('Debug message', { key: 'value' });

        expect(loggerMock.debug).toHaveBeenCalledWith(
            { requestId: 'test-request-id', key: 'value' },
            'Debug message'
        );
    });

    it('should not log debug messages when LOG_LEVEL is not debug', () => {
        ENV.LOG_LEVEL = 'info';
        LoggerService.debug('Debug message', { key: 'value' });

        expect(loggerMock.debug).not.toHaveBeenCalled();
    });
});
