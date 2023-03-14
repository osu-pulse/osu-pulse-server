import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { Auth } from '../../auth/decorators/auth.decorator';
import { TrackObject } from '../objects/track.object';
import { TracksService } from '../services/tracks.service';
import { TrackModel } from '../models/track.model';
import { TracksWithCursorObject } from '../objects/tracks-with-cursor.object';
import { WithCursor } from '../../shared/types/with-cursor';
import { TrackNotFoundException } from '../exceptions/track-not-found.exception';
import { LibraryTracksService } from '../services/library-tracks.service';

@Resolver(() => TrackObject)
export class MyTracksResolver {
  constructor(
    private libraryTracksService: LibraryTracksService,
    private tracksService: TracksService,
  ) {}

  @UseGuards(OauthGuard)
  @Query(() => TracksWithCursorObject)
  async myTracks(
    @Args('search', { nullable: true })
    search: string | undefined,
    @Args('cursor', { nullable: true })
    cursor: string | undefined,
    @Args('limit', { type: () => Int, nullable: true })
    limit: number | undefined,
    @Auth()
    userId: string,
  ): Promise<WithCursor<TrackModel>> {
    return this.libraryTracksService.getAllTracksByUserId(
      userId,
      search,
      limit,
      cursor,
    );
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async addMyTrack(
    @Args('trackId')
    trackId: string,
    @Auth()
    userId: string,
  ): Promise<TrackModel> {
    const trackExists = await this.tracksService.existsById(trackId);
    if (!trackExists) {
      throw new TrackNotFoundException();
    }

    await this.libraryTracksService.addTrackIdByUserId(userId, trackId);
    return this.tracksService.getById(trackId);
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async removeMyTrack(
    @Args('trackId')
    trackId: string,
    @Auth()
    userId: string,
  ): Promise<TrackModel> {
    const trackExists = await this.tracksService.existsById(trackId);
    if (!trackExists) {
      throw new TrackNotFoundException();
    }

    await this.libraryTracksService.removeTrackIdByUserId(userId, trackId);
    return this.tracksService.getById(trackId);
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async moveMyTrack(
    @Args('trackId')
    trackId: string,
    @Args('position')
    position: number,
    @Auth()
    userId: string,
  ): Promise<TrackModel> {
    const trackExists = await this.tracksService.existsById(trackId);
    if (!trackExists) {
      throw new TrackNotFoundException();
    }

    await this.libraryTracksService.moveTrackIdByUserId(
      userId,
      trackId,
      position,
    );
    return this.tracksService.getById(trackId);
  }
}
