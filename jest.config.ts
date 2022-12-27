import type { Config } from 'jest';

const config: Config = {
  maxWorkers: '100%',
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
    '**/services/*.service.ts',
    '**/resolvers/*.resolver.ts',
    '**/controllers/*.controller.ts',
    '**/gateways/*.gateway.ts',
    '**/helpers/*.helper.ts',
    '**/convertors/*.convertor.ts',
    '**/interceptors/*.interceptor.ts',
    '**/guards/*.guard.ts',
  ],
  coverageDirectory: 'coverage',
};

export default config;
