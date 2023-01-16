import { INestApplication } from '@nestjs/common';
import { setupCors } from '../../../src/core/helpers/cors.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { switchAssign } from '../../../src/shared/helpers/switch.helper';

describe('setupCors', () => {
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

  it('should call enableCors with given config', () => {
    jest.spyOn(configService, 'get').mockImplementation((key) =>
      switchAssign(key, {
        CORS: true,
      }),
    );
    const enableCorsSpy = jest.spyOn(app, 'enableCors');

    setupCors(app);

    expect(enableCorsSpy).toBeCalledWith({ origin: true, credentials: true });
  });
});
