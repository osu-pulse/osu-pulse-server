import { INestApplication } from '@nestjs/common';
import { setupCors } from './cors.helper';
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Mock = jest.Mock;
import { EnvironmentDto } from '../dto/environment.dto';
import { switchAssign } from '../../shared/helpers/switch.helper';

describe('setupCors', () => {
  let app: INestApplication;
  let configService: ConfigService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();
    configService = module.get(ConfigService);

    app = module.createNestApplication();
  });

  afterAll(async () => {
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
