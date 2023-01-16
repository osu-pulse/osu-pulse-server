import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';

describe('bootstrap', () => {
  let module: TestingModule;
  let app: NestExpressApplication;

  beforeEach(async () => {
    const configServiceMock = createMock<ConfigService>({
      get: () => '',
    });

    module = await Test.createTestingModule({
      providers: [{ provide: ConfigService, useValue: configServiceMock }],
    }).compile();
    app = module.createNestApplication();
  });

  afterEach(async () => {
    await module.close();
    await app.close();
  });

  it('should create and run the app', async () => {
    const createSpy = jest
      .spyOn(NestFactory, 'create')
      .mockImplementation(async () => app);
    const listenSpy = jest.spyOn(app, 'listen');

    await import('../src/main');

    expect(createSpy).toBeCalledTimes(1);
    expect(listenSpy).toBeCalledTimes(1);
  });
});
