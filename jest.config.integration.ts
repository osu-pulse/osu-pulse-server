import type { Config } from 'jest';

const config: Config = {
  maxWorkers: '100%',
  testTimeout: 30000,
  detectOpenHandles: true,
  setupFiles: ['./jest-setup-file.ts'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.integration\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

export default config;
