import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setupLogger } from '../../../src/core/helpers/logger.helper';
import { ConfigService } from '@nestjs/config';

describe('setupLogger', () => {
  let module: TestingModule;
  let app: INestApplication;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue({ get: () => [] })
      .compile();
    app = module.createNestApplication();
  });

  afterEach(async () => {
    await module.close();
    await app.close();
  });

  it('should call enableCors', () => {
    const useLoggerSpy = jest.spyOn(app, 'useLogger');

    setupLogger(app);

    expect(useLoggerSpy).toBeCalledTimes(1);
  });
});
