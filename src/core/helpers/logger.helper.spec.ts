import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { setupLogger } from './logger.helper';
import { ConfigService } from '@nestjs/config';

describe('setupLogger', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue({ get: () => [] })
      .compile();
    app = moduleRef.createNestApplication();
  });

  it('should call enableCors', () => {
    const useLoggerSpy = jest.spyOn(app, 'useLogger');

    setupLogger(app);

    expect(useLoggerSpy).toBeCalledTimes(1);
  });
});
