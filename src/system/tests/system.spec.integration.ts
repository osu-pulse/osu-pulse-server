import { Test } from '@nestjs/testing';
import supertestGql from 'supertest-graphql';
import supertestRest from 'supertest';
import { INestApplication } from '@nestjs/common';
import { gql } from 'apollo-server-express';
import { CoreModule } from '../../core/core.module';
import { SystemModule } from '../system.module';

describe('graphql', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [CoreModule, SystemModule],
    }).compile();

    app = module.createNestApplication();
    await app.listen(5000);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('query health', () => {
    it('should return true', async () => {
      const { data } = await supertestGql<{ health: boolean }>(
        app.getHttpServer(),
      ).query(
        gql`
          query {
            health
          }
        `,
      );

      expect(data.health).toBeTruthy();
    });
  });
});

describe('rest', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [SystemModule],
    }).compile();

    app = module.createNestApplication();
    await app.listen(5000);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('query health', () => {
    it('should return status 200', async () => {
      const response = await supertestRest(app.getHttpServer()).get('/health');

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({});
    });
  });
});
