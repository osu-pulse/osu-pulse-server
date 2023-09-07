import { Config } from 'jest';

const config: Config = {
  maxWorkers: '50%',
  detectOpenHandles: true,
  setupFiles: ['./jest-setup-file.ts'],
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/services/*.ts',
    'src/**/resolvers/*.ts',
    'src/**/controllers/*.ts',
    'src/**/gateways/*.ts',
    'src/**/helpers/*.ts',
    'src/**/convertors/*.ts',
    'src/**/interceptors/*.ts',
    'src/**/strategies/*.ts',
    'src/**/guards/*.ts',
  ],
  coverageDirectory: 'coverage',
};

export default config;
