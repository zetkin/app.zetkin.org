/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ["<rootDir>/playwright/", "<rootDir>/node_modules/"],
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  moduleDirectories: ['node_modules', 'src']
};
