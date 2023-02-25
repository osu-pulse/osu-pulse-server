import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TracksService } from '../services/tracks.service';
import { TrackObject } from '../objects/track.object';
import { TracksWithCursorObject } from '../objects/tracks-with-cursor.object';
import { TrackModel } from '../models/track.model';
import { WithCursor } from '../../shared/types/with-cursor';
import { AlreadyCachedException } from '../exceptions/already-cached.exception';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { TrackUrlObject } from '../objects/track-url.object';
import { TrackUrlModel } from '../models/track-url.model';
import { ConfigService } from '@nestjs/config';
import { BucketName } from '../../bucket/constants/bucket-name';
import { kitsuApiUrl, osuOauthUrl } from '../../osu/constants/api-url';
import { EnvModel } from '../../core/models/env.model';
import { Auth } from '../../auth/decorators/auth.decorator';
import { TrackCoverObject } from '../objects/track-cover.object';
import { TrackCoverModel } from '../models/track-cover.model';
import { TrackMetasService } from '../services/track-metas.service';
import { DataLoadersContext } from '../../shared/types/data-loaders-context';
import { initDataLoader } from '../../shared/helpers/data-loader';

@Resolver(() => TrackObject)
export class TracksResolver {
  constructor(
    private tracksService: TracksService,
    private trackMetasService: TrackMetasService,
    private configService: ConfigService<EnvModel, true>,
  ) {}

  @UseGuards(OauthGuard)
  @Query(() => TracksWithCursorObject)
  async tracks(
    @Args('search', { nullable: true })
    search: string | undefined,
    @Args('cursor', { nullable: true })
    cursor: string | undefined,
  ): Promise<WithCursor<TrackModel>> {
    return this.tracksService.getAllBySearch(search, cursor);
  }

  @UseGuards(OauthGuard)
  @Query(() => TrackObject)
  async track(
    @Args('trackId')
    trackId: string,
  ): Promise<TrackModel> {
    return this.tracksService.getById(trackId);
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async cacheTrack(
    @Args('trackId')
    trackId: string,
    @Auth()
    userId: string,
  ): Promise<TrackModel> {
    const cached = await this.trackMetasService.existsByTrackId(trackId);
    if (cached) {
      throw new AlreadyCachedException();
    }

    await this.tracksService.cache(userId, trackId);
    return this.tracksService.getById(trackId);
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async cancelCacheTrack(
    @Args('trackId')
    trackId: string,
    @Auth()
    userId: string,
  ): Promise<TrackModel> {
    await this.tracksService.cancelCache(userId, trackId);
    return this.tracksService.getById(trackId);
  }

  @ResolveField(() => TrackUrlObject)
  async url(
    @Parent() track: TrackModel,
    @Context()
    context: DataLoadersContext<{ urlLoader: [TrackModel, TrackUrlModel] }>,
  ): Promise<TrackUrlModel> {
    return initDataLoader(context, 'urlLoader', async (tracks) => {
      const minioUrl = this.configService.get('URL_MINIO');
      const bucket = BucketName.TRACK_CACHES;

      const existsSet = new Set(
        await this.trackMetasService.existsAllByTrackIds(
          tracks.map(({ id }) => id),
        ),
      );

      return tracks.map((track) => ({
        audio: existsSet.has(track.id)
          ? `${minioUrl}/${bucket}/${track.beatmapId}`
          : undefined,
        page: `${osuOauthUrl}/beatmapsets/${track.beatmapSetId}`,
        file: `${kitsuApiUrl}/audio/${track.beatmapSetId}`,
      }));
    }).load(track);
  }

  @ResolveField(() => TrackCoverObject)
  cover(@Parent() track: TrackModel): TrackCoverModel {
    const assetsUrl = `${this.configService.get('URL_OSU')}/assets`;

    return {
      small: `${assetsUrl}/beatmaps/${track.beatmapSetId}/covers/list.jpg`,
      normal: `${assetsUrl}/beatmaps/${track.beatmapSetId}/covers/list@2x.jpg`,
      wide: `${assetsUrl}/beatmaps/${track.beatmapSetId}/covers/slimcover@2x.jpg`,
    };
  }
}
