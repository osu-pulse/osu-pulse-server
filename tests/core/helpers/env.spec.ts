import fs from 'fs';
import { Env, getEnvPath, validateEnv } from '../../../src/core/helpers/env';

describe('getEnvPath', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'production';
  });

  it('should return local exact env if exist', () => {
    jest
      .spyOn(fs, 'existsSync')
      .mockImplementation((path) => path === '.env.production.local');

    const result = getEnvPath();

    expect(result).toBe('.env.production.local');
  });

  it('should return exact env path if exist and local exact not exist', () => {
    jest
      .spyOn(fs, 'existsSync')
      .mockImplementation((path) => path === '.env.production');

    const result = getEnvPath();

    expect(result).toBe('.env.production');
  });

  it('should return local generic env path if exist and local exact, exact envs not exist', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation((path) => path === '.env');

    const result = getEnvPath();

    expect(result).toBe('.env');
  });

  it('should return generic env path if exist and generic local, local exact, exact envs not exist', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation((path) => path === '.env');

    const result = getEnvPath();

    expect(result).toBe('.env');
  });

  it('should return undefined if no env exist', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false);

    const result = getEnvPath();

    expect(result).toBeUndefined();
  });
});

describe('validateConfig', () => {
  let configMock: Record<keyof Env, string>;
  let configInvalidMock: Partial<Record<keyof Env, string>>;

  beforeEach(() => {
    configMock = {
      NODE_ENV: 'development',
      CORS: 'true',
      DEBUG: 'true',
      URL_API: 'http://localhost/api',
      URL_AUTH: 'http://localhost/oauth',
      URL_MINIO: 'http://localhost/minio',
      URL_PROXY: 'http://localhost/osu',
      MONGO_HOST: '127.0.0.1',
      MONGO_PORT: '27017',
      MONGO_NAME: 'pulse',
      MONGO_USERNAME: 't1mon',
      MONGO_PASSWORD: '1234',
      REDIS_HOST: '127.0.0.1',
      REDIS_PORT: '6379',
      MINIO_HOST: '127.0.0.1',
      MINIO_PORT: '9000',
      MINIO_USERNAME: 'access_key',
      MINIO_PASSWORD: 'secret_key',
      OSU_CLIENT_ID: '123',
      OSU_CLIENT_SECRET: 'secret',
    };
    configInvalidMock = {
      MONGO_HOST: 'jisjef',
      MONGO_NAME: 'jih',
      MONGO_USERNAME: undefined,
      MONGO_PASSWORD: undefined,
    };
  });

  it('should parse config if config is valid', () => {
    const env = validateEnv(configMock);

    expect(env).toBeInstanceOf(Env);
  });

  it('should throw if config is invalid', () => {
    const action = () => validateEnv(configInvalidMock);

    expect(action).toThrow();
  });
});
