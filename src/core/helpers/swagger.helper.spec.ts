import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SwaggerModule } from '@nestjs/swagger';
import { setupSwagger } from './swagger.helper';

describe('setupSwagger', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({}).compile();
    app = moduleRef.createNestApplication();
  });

  it('should call enableCors', () => {
    const setupSpy = jest.spyOn(SwaggerModule, 'setup');

    setupSwagger(app);

    expect(setupSpy).toBeCalledTimes(1);
  });
});
