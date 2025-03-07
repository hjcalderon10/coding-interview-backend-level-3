import { requiredEnv, requiredNumberEnv } from '@/server/config/environment'

describe('Environment Variable Helpers', () => {
    const originalEnv = process.env

    beforeEach(() => {
        process.env = { ...originalEnv } // Clone original environment
    })

    afterEach(() => {
        process.env = originalEnv // Restore original environment
    })

    describe('requiredEnv', () => {
        it('should return the environment variable value if it exists', () => {
            process.env.TEST_VAR = 'test-value'
            expect(requiredEnv('TEST_VAR')).toBe('test-value')
        })

        it('should throw an error if the environment variable is missing', () => {
            delete process.env.TEST_VAR
            expect(() => requiredEnv('TEST_VAR')).toThrowError(
                'Missing required environment variable: TEST_VAR'
            )
        })
    })

    describe('requiredNumberEnv', () => {
        it('should return the environment variable value as a number', () => {
            process.env.TEST_NUMBER = '123'
            expect(requiredNumberEnv('TEST_NUMBER')).toBe(123)
        })

        it('should throw an error if the environment variable is missing', () => {
            delete process.env.TEST_NUMBER
            expect(() => requiredNumberEnv('TEST_NUMBER')).toThrowError(
                'Missing required environment variable: TEST_NUMBER'
            )
        })

        it('should throw an error if the environment variable is not a valid number', () => {
            process.env.TEST_NUMBER = 'not_a_number'
            expect(() => requiredNumberEnv('TEST_NUMBER')).toThrowError(
                'Env is not a number value: TEST_NUMBER'
            )
        })
    })
})
