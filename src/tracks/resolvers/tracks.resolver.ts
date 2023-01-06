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
import { TracksWithCursorModel } from '../models/tracks-with-cursor.model';
import { AlreadyCachedException } from '../exceptions/already-cached.exception';
import { OsuService } from '../../osu/services/osu.service';
import { BeatmapSetNotFoundException } from '../exceptions/beatmap-set-not-found.exception';
import { TracksSubService } from '../services/tracks-sub.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Resolver(() => TrackObject)
export class TracksResolver {
  constructor(
    private tracksService: TracksService,
    private osuService: OsuService,
    private tracksSubService: TracksSubService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => TracksWithCursorObject)
  async tracks(
    @Args('search', { nullable: true })
    search: string | undefined,
    @Args('cursor', { nullable: true })
    cursor: string | undefined,
  ): Promise<TracksWithCursorModel> {
    return this.tracksService.getAll(search, cursor);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => TrackObject)
  async track(
    @Args('trackId')
    trackId: string,
  ): Promise<TrackModel> {
    return this.tracksService.getById(trackId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ID)
  async cacheTrack(
    @Args('trackId')
    trackId: string,
  ): Promise<string> {
    const isCached = await this.tracksService.isCached(trackId);
    if (isCached) {
      throw new AlreadyCachedException();
    }

    await this.tracksService.cache(trackId);
    return trackId;
  }

  @UseGuards(JwtAuthGuard)
  @Subscription(() => String, {
    async filter({ trackCached }, { trackId }) {
      const cachedTrack: TrackModel = await trackCached;
      return cachedTrack.id === trackId;
    },
  })
  async trackCached(@Args('trackId') trackId: string) {
    const beatmapSetExists = await this.osuService.beatmapSetExists(trackId);

    if (!beatmapSetExists) {
      throw new BeatmapSetNotFoundException();
    }

    return this.tracksSubService.iterator('trackCached');
  }

  @ResolveField(() => Boolean)
  async cached(@Parent() track: TrackModel): Promise<boolean> {
    return this.tracksService.isCached(track.id);
  }
}
