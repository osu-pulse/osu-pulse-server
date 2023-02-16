import {
  Args,
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
import { BucketService } from '../../bucket/services/bucket.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { TrackCoverObject } from '../objects/track-cover.object';
import { TrackCoverModel } from '../models/track-cover.model';

@Resolver(() => TrackObject)
export class TracksResolver {
  constructor(
    private tracksService: TracksService,
    private bucketService: BucketService,
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
    const isCached = await this.tracksService.isCached(trackId);
    if (isCached) {
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
  async url(@Parent() track: TrackModel): Promise<TrackUrlModel> {
    const minioUrl = this.configService.get('URL_MINIO');
    const bucket = BucketName.TRACK_CACHES;

    const isCached = await this.tracksService.isCached(track.id);
    const audio = isCached
      ? `${minioUrl}/${bucket}/${track.beatmapId}`
      : undefined;

    return {
      audio,
      page: `${osuOauthUrl}/beatmapsets/${track.beatmapSetId}`,
      file: `${kitsuApiUrl}/audio/${track.beatmapSetId}`,
    };
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
