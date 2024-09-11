/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/src/utils/testing/setup.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/integrationTesting/',
    '<rootDir>/node_modules/',
  ],
  transform: {
    '^.+\\.tsx?$': ['babel-jest', { configFile: './.babelrc.jest.json' }],
  },
  moduleDirectories: ['node_modules', 'src'],
};
