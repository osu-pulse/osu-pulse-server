import fs from 'fs';
import { getEnvPath, validateEnv } from './config-env.helper';
import { EnvironmentDto } from '../dto/environment.dto';
import SpyInstance = jest.SpyInstance;

describe('getEnvPath', () => {
  let existsSyncMock: SpyInstance;

  beforeEach(() => {
    existsSyncMock = jest.spyOn(fs, 'existsSync');
    process.env.NODE_ENV = 'production';
  });

  it('should return local exact env if exist', () => {
    existsSyncMock.mockImplementation(
      (path) => path == '.env.production.local',
    );

    const result = getEnvPath();

    expect(result).toBe('.env.production.local');
  });

  it('should return exact env path if exist and local exact not exist', () => {
    existsSyncMock.mockImplementation((path) => path == '.env.production');

    const result = getEnvPath();

    expect(result).toBe('.env.production');
  });

  it('should return local generic env path if exist and local exact, exact envs not exist', () => {
    existsSyncMock.mockImplementation((path) => path == '.env');

    const result = getEnvPath();

    expect(result).toBe('.env');
  });

  it('should return generic env path if exist and generic local, local exact, exact envs not exist', () => {
    existsSyncMock.mockImplementation((path) => path == '.env');

    const result = getEnvPath();

    expect(result).toBe('.env');
  });

  it('should return undefined if no env exist', () => {
    existsSyncMock.mockImplementation(() => false);

    const result = getEnvPath();

    expect(result).toBeUndefined();
  });
});

describe('validateConfig', () => {
  let configMock: Record<string, unknown>;
  let configInvalidMock: Record<string, unknown>;

  beforeEach(() => {
    configMock = {
      NODE_ENV: 'development',
      CORS: 'true',
      DEBUG: 'true',
      DB_HOST: '127.0.0.1:27017',
      DB_NAME: 'dtts',
      DB_USER: 't1mon',
      DB_PASSWORD: '1234',
      MI_ENDPOINT: '127.0.0.1',
      MI_PORT: '9000',
      MI_BUCKET: 'dtts',
      MI_ACCESS_KEY: 'access_key',
      MI_SECRET_KEY: 'secret_key',
      MI_HOST: 'http://127.0.0.1:9000',
      KC_URL: 'http://127.0.0.1:8180/auth',
      KC_REALM: 'dtts',
      KC_CLIENT_ID: 'dtts-server',
      KC_CLIENT_SECRET: 'AGZtw8PlDmZ97HOysPpVUm6tOcYj6eT3',
      KC_ADMIN_USERNAME: 'admin-client',
      KC_ADMIN_PASSWORD: '1234',
    };
    configInvalidMock = {
      NODE_ENV: 'hiasef',
      LOG_LEVELS: 'ii',
      EXTERNAL_HOST: 'jij',
      DB_HOST: 'jisjef',
      DB_NAME: 'jih',
      DB_USER: undefined,
      DB_PASSWORD: undefined,
    };
  });

  it('should parse config if config is valid', () => {
    const env = validateEnv(configMock);

    expect(env).toBeInstanceOf(EnvironmentDto);
  });

  it('should throw if config is invalid', () => {
    const action = () => validateEnv(configInvalidMock);

    expect(action).toThrow();
  });
});
