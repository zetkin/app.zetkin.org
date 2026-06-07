module.exports = {
  setupFiles: ['<rootDir>/src/utils/testing/setup.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/integrationTesting/',
    '<rootDir>/node_modules/',
  ],
  transform: {
    '^.+\\.tsx?$': ['babel-jest', { configFile: './.babelrc.jest.json' }],
    '^.+\\.m?jsx?$': ['babel-jest', { configFile: './.babelrc.jest.json' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(next-intl|use-intl|@formatjs|intl-messageformat)/)',
  ],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(css|scss|less)$': '<rootDir>/src/utils/testing/jest/mocks/css.ts',
  },
};
