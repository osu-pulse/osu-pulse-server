import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
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
import {
  kitsuApiUrl,
  osuAssetsUrl,
  osuOauthUrl,
} from '../../osu/constants/api-url';
import { Env } from '../../core/types/env';
import { BucketService } from '../../bucket/services/bucket.service';
import { TrackCoverObject } from '../objects/track-cover.object';
import { TrackCoverModel } from '../models/track-cover.model';

@Resolver(() => TrackObject)
export class TracksResolver {
  constructor(
    private tracksService: TracksService,
    private bucketService: BucketService,
    private configService: ConfigService<Env, true>,
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
  ): Promise<TrackModel> {
    const isCached = await this.tracksService.isCached(trackId);
    if (isCached) {
      throw new AlreadyCachedException();
    }

    await this.tracksService.cache(trackId);
    return this.tracksService.getById(trackId);
  }

  @ResolveField(() => TrackUrlObject)
  async url(@Parent() track: TrackModel): Promise<TrackUrlModel> {
    const minioUrl = this.configService.get('URL_MINIO');
    const bucket = BucketName.TRACK_CACHES;

    const isCached = await this.tracksService.isCached(track.id);
    const audio = isCached
      ? `${minioUrl}/${bucket}/${track.beatmapSetId}`
      : undefined;

    return {
      audio,
      page: `${osuOauthUrl}/beatmapsets/${track.beatmapSetId}`,
      file: `${kitsuApiUrl}/audio/${track.beatmapSetId}`,
    };
  }
}
