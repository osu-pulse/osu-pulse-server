import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setupLogger } from '../../../src/core/helpers/logger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { switchAssign } from '../../../src/shared/helpers/switch';
import { createMock } from '@golevelup/ts-jest';
import MockedFn = jest.MockedFn;

describe('setupLogger', () => {
  let module: TestingModule;
  let app: INestApplication;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();

    app = module.createNestApplication();
  });

  afterEach(async () => {
    await module.close();
    await app.close();
  });

  it('should call useLogger', () => {
    const useLoggerSpy = jest.spyOn(app, 'useLogger');

    setupLogger(app);

    expect(useLoggerSpy).toBeCalledTimes(1);
  });
});
