import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SwaggerModule } from '@nestjs/swagger';
import { setupDocs } from '../../../src/core/helpers/docs';

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
    const setupSwaggerSpy = jest.spyOn(SwaggerModule, 'setup');

    setupDocs(app);

    expect(setupSwaggerSpy).toBeCalledTimes(1);
  });
});
