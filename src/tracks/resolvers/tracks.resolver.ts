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
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';

@Resolver(() => TrackObject)
export class TracksResolver {
  constructor(private tracksService: TracksService) {}

  @UseGuards(OauthGuard)
  @Query(() => TracksWithCursorObject)
  async tracks(
    @Args('search', { nullable: true })
    search: string | undefined,
    @Args('cursor', { nullable: true })
    cursor: string | undefined,
  ): Promise<TracksWithCursorModel> {
    return this.tracksService.getAll(search, cursor);
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

  @ResolveField(() => Boolean)
  async cached(@Parent() track: TrackModel): Promise<boolean> {
    return this.tracksService.isCached(track.id);
  }
}
