import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TracksService } from '../services/tracks.service';
import { TrackObject } from '../objects/track.object';
import { Track } from '../types/track';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { TrackUrlObject } from '../objects/track-url.object';
import { TrackUrl } from '../types/track-url';
import { TrackCoverObject } from '../objects/track-cover.object';
import { TrackCover } from '../types/track-cover';
import { DataLoadersContext } from '../../shared/types/data-loader';
import { createLoader } from '../../shared/helpers/data-loader';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../core/helpers/env';
import { osuUrl } from '../../osu/constants/osu-url';

@Resolver(() => TrackObject)
export class TracksResolver {
  constructor(
    private tracksService: TracksService,
    private configService: ConfigService<Env, true>,
  ) {}

  // @UseGuards(OauthGuard)
  @Query(() => [TrackObject])
  async tracks(
    @Args('search', { nullable: true })
    search: string | undefined,
    @Args('limit', { nullable: true, type: () => Int })
    limit: number | undefined,
    @Args('offset', { nullable: true, type: () => Int })
    offset: number | undefined,
  ): Promise<Track[]> {
    return this.tracksService.getAllBySearch(search, limit, offset);
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
          audio: `${osuUrl.direct}/media/audio/${track.beatmapId}`,
          page: `${osuUrl.base}/beatmapsets/${track.beatmapSetId}`,
          map: `${osuUrl.direct}/d/${track.beatmapSetId}`,
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
        const proxyUrl = this.configService.get('URL_PROXY');
        const coversUrl = `${proxyUrl}/assets.ppy.sh/beatmaps/${track.beatmapSetId}/covers`;

        return tracks.map((track) => ({
          list: `${coversUrl}/list.jpg`,
          list2x: `${coversUrl}/list@2x.jpg`,
          wide: `${coversUrl}/slimcover.jpg`,
          wide2x: `${coversUrl}/slimcover@2x.jpg`,
        }));
      },
    );

    return dataLoader.load(track);
  }
}
