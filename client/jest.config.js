export default {
    testEnvironment: 'jsdom',
    transform: {'^.+\\.[jt]sx?$': 'babel-jest'},
    moduleFileExtensions: ['js', 'jsx', 'json'],
    setupFiles: ['<rootDir>/jest.setup.cjs'],
    setupFilesAfterEnv: ['@testing-library/jest-dom']
};