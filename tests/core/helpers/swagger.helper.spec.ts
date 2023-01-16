import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SwaggerModule } from '@nestjs/swagger';
import { setupSwagger } from '../../../src/core/helpers/swagger.helper';

describe('setupSwagger', () => {
  let module: TestingModule;
  let app: INestApplication;

  beforeEach(async () => {
    module = await Test.createTestingModule({}).compile();
    app = module.createNestApplication();
  });

  afterEach(async () => {
    await module.close();
    await app.close();
  });

  it('should call enableCors', () => {
    const setupSpy = jest.spyOn(SwaggerModule, 'setup');

    setupSwagger(app);

    expect(setupSpy).toBeCalledTimes(1);
  });
});
