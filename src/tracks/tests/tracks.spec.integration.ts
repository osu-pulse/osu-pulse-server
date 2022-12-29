import { Test } from '@nestjs/testing';
import supertestGql from 'supertest-graphql';
import { INestApplication } from '@nestjs/common';
import { gql } from 'apollo-server-express';
import { TracksModule } from '../tracks.module';
import { TracksWithCursorObject } from '../objects/tracks-with-cursor.object';
import { CoreModule } from '../../core/core.module';
import { TrackObject } from '../objects/track.object';

describe('graphql', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [CoreModule, TracksModule],
    }).compile();

    app = module.createNestApplication();
    await app.listen(5000);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('query tracks', () => {
    it('should return object with tracks list and cursor', async () => {
      const { data } = await supertestGql<{ tracks: TracksWithCursorObject }>(
        app.getHttpServer(),
      ).query(
        gql`
          query {
            tracks {
              cursor
              tracks {
                id
                title
                artist
                url
                cover {
                  small
                  normal
                }
              }
            }
          }
        `,
      );

      expect(typeof data.tracks.cursor).toBe('string');
      data.tracks.tracks.forEach((item) => {
        expect(typeof item.id).toBe('number');
        expect(typeof item.title).toBe('string');
        expect(typeof item.artist).toBe('string');
        expect(typeof item.url).toBe('string');
        expect(typeof item.cover.normal).toBe('string');
        expect(typeof item.cover.small).toBe('string');
      });
    });
  });

  describe('query track', () => {
    it('should return single track', async () => {
      const { data } = await supertestGql<{ track: TrackObject }>(
        app.getHttpServer(),
      ).query(
        gql`
          query {
            track(trackId: 1805771) {
              id
              title
              artist
              url
              cover {
                small
                normal
              }
            }
          }
        `,
      );

      expect(typeof data.track.id).toBe('number');
      expect(typeof data.track.title).toBe('string');
      expect(typeof data.track.artist).toBe('string');
      expect(typeof data.track.url).toBe('string');
      expect(typeof data.track.cover.normal).toBe('string');
      expect(typeof data.track.cover.small).toBe('string');
    });
  });
});
