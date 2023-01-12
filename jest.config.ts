import type { Config } from 'jest';

const config: Config = {
  maxWorkers: '50%',
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
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/services/*.ts',
    '**/resolvers/*.ts',
    '**/controllers/*.ts',
    '**/gateways/*.ts',
    '**/helpers/*.ts',
    '**/convertors/*.ts',
    '**/interceptors/*.ts',
    '**/strategies/*.ts',
    '**/guards/*.ts',
  ],
  coverageDirectory: 'coverage',
};

export default config;
