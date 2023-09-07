import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TracksService } from '../services/tracks.service';
import { TrackObject } from '../objects/track.object';
import { TracksWithCursorObject } from '../objects/tracks-with-cursor.object';
import { Track } from '../types/track';
import { WithCursor } from '../../shared/types/with-cursor';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { TrackUrlObject } from '../objects/track-url.object';
import { TrackUrl } from '../types/track-url';
import { ConfigService } from '@nestjs/config';
import { osuDirectUrl, osuUrl } from '../../osu/constants/api-url';
import { EnvModel } from '../../core/models/env.model';
import { TrackCoverObject } from '../objects/track-cover.object';
import { TrackCover } from '../types/track-cover';
import { DataLoadersContext } from '../../shared/types/data-loader';
import { createLoader } from '../../shared/helpers/data-loader';

@Resolver(() => TrackObject)
export class TracksResolver {
  constructor(
    private tracksService: TracksService,
    private configService: ConfigService<EnvModel, true>,
  ) {}

  @UseGuards(OauthGuard)
  @Query(() => TracksWithCursorObject)
  async tracks(
    @Args('search', { nullable: true })
    search: string | undefined,
    @Args('cursor', { nullable: true })
    cursor: string | undefined,
  ): Promise<WithCursor<Track>> {
    return this.tracksService.getAllBySearch(search, cursor);
  }

  @UseGuards(OauthGuard)
  @Query(() => TrackObject)
  async track(
    @Args('trackId')
    trackId: string,
  ): Promise<Track> {
    return this.tracksService.getById(trackId);
  }

  @ResolveField(() => TrackUrlObject)
  async url(
    @Parent() track: Track,
    @Context()
    context: DataLoadersContext<{ url: [Track, TrackUrl] }>,
  ): Promise<TrackUrl> {
    const dataLoader = createLoader(
      context,
      'url',
      async (tracks): Promise<TrackUrl[]> =>
        tracks.map((track) => ({
          audio: `${osuDirectUrl}/media/audio/${track.beatmapId}`,
          page: `${osuUrl}/beatmapsets/${track.beatmapSetId}`,
          map: `${osuDirectUrl}/d/${track.beatmapSetId}`,
        })),
    );

    return dataLoader.load(track);
  }

  @ResolveField(() => TrackCoverObject)
  async cover(
    @Parent() track: Track,
    @Context() context: DataLoadersContext<{ cover: [Track, TrackCover] }>,
  ): Promise<TrackCover> {
    const dataLoader = createLoader(
      context,
      'cover',
      async (tracks: Track[]): Promise<TrackCover[]> => {
        const osuProxyUrl = this.configService.get('URL_OSU_PROXY');

        return tracks.map((track) => {
          const coversUrl = `${osuProxyUrl}/assets/beatmaps/${track.beatmapSetId}/covers`;

          return {
            list: `${coversUrl}/list.jpg`,
            list2x: `${coversUrl}/list@2x.jpg`,
            wide: `${coversUrl}/slimcover.jpg`,
            wide2x: `${coversUrl}/slimcover@2x.jpg`,
          };
        });
      },
    );

    return dataLoader.load(track);
  }
}
