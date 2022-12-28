import { Args, Query, Resolver } from '@nestjs/graphql';
import { TracksService } from '../services/tracks.service';
import { TrackObject } from '../objects/track.object';
import { TracksWithCursorObject } from '../objects/tracks-with-cursor.object';

@Resolver(() => TrackObject)
export class TracksResolver {
  constructor(private tracksService: TracksService) {}

  @Query(() => TracksWithCursorObject)
  async tracks(
    @Args('search', { nullable: true })
    search: string | undefined,
    @Args('cursor', { nullable: true })
    cursor: string | undefined,
  ) {
    return this.tracksService.getAll(search, cursor);
  }

  @Query(() => TrackObject)
  async track(
    @Args('trackId')
    trackId: number,
  ) {
    return this.tracksService.getById(trackId);
  }
}
