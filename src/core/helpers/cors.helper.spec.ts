import { INestApplication } from '@nestjs/common';
import { setupCors } from './cors.helper';
import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import Mock = jest.Mock;

describe('setupCors', () => {
  let getMock: Mock;
  let app: INestApplication;

  beforeEach(async () => {
    getMock = jest.fn();

    const configServiceMock = createMock<ConfigService>({ get: getMock });

    const moduleRef = await Test.createTestingModule({
      providers: [{ provide: ConfigService, useValue: configServiceMock }],
    }).compile();
    app = moduleRef.createNestApplication();
  });

  it('should call enableCors with given config', () => {
    const enableCorsSpy = jest.spyOn(app, 'enableCors');
    getMock.mockReturnValue(true);

    setupCors(app);

    expect(enableCorsSpy).toBeCalledWith({ origin: true, credentials: true });
  });
});
