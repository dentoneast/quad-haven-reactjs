module.exports = {
  projects: [
    {
      displayName: 'shared',
      testMatch: ['<rootDir>/packages/shared/**/*.test.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
    },
    {
      displayName: 'web',
      testMatch: ['<rootDir>/packages/web/**/*.test.{ts,tsx}'],
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/packages/web/jest.setup.js'],
    },
    {
      displayName: 'mobile',
      testMatch: ['<rootDir>/packages/mobile/**/*.test.{ts,tsx}'],
      preset: 'react-native',
      setupFilesAfterEnv: ['<rootDir>/packages/mobile/jest.setup.js'],
    },
    {
      displayName: 'server',
      testMatch: ['<rootDir>/packages/server/**/*.test.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
    },
  ],
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/*.test.{ts,tsx}',
    '!packages/*/src/**/*.stories.{ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
