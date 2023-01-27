import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setupLogger } from '../../../src/core/helpers/logger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { switchAssign } from '../../../src/shared/helpers/switch';

describe('setupLogger', () => {
  let module: TestingModule;
  let app: INestApplication;
  let configService: ConfigService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();
    configService = module.get(ConfigService);

    app = module.createNestApplication();
  });

  afterEach(async () => {
    await module.close();
    await app.close();
  });

  it('should enable all log levels if debug is enabled', () => {
    jest.spyOn(ConfigService.prototype, 'get').mockImplementation((key) =>
      switchAssign(key, {
        DEBUG: true,
      }),
    );
    const useLoggerSpy = jest.spyOn(app, 'useLogger');

    setupLogger(app);

    expect(useLoggerSpy).toBeCalledWith([
      'log',
      'error',
      'warn',
      'debug',
      'verbose',
    ]);
  });

  it('should enable only important log levels if debug is disabled', () => {
    jest.spyOn(configService, 'get').mockImplementation((key) =>
      switchAssign(key, {
        DEBUG: false,
      }),
    );
    const useLoggerSpy = jest.spyOn(app, 'useLogger');

    setupLogger(app);

    expect(useLoggerSpy).toBeCalledWith(['log', 'error', 'warn']);
  });
});
