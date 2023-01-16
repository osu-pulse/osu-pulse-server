import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LibraryTracksService } from '../services/library-tracks.service';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { Auth } from '../../auth/decorators/auth.decorator';
import { TrackObject } from '../../tracks/objects/track.object';
import { TracksService } from '../../tracks/services/tracks.service';
import { TracksWithCursorModel } from '../../tracks/models/tracks-with-cursor.model';
import { TracksWithCursorObject } from '../../tracks/objects/tracks-with-cursor.object';
import { TrackNotFoundException } from '../../tracks/exceptions/track-not-found.exception';
import { TrackModel } from '../../tracks/models/track.model';

@Resolver(() => TrackObject)
export class LibraryTracksResolver {
  constructor(
    private librariesService: LibraryTracksService,
    private tracksService: TracksService,
  ) {}

  @UseGuards(OauthGuard)
  @Query(() => TracksWithCursorObject)
  async libraryTracks(
    @Args('cursor', { nullable: true })
    cursor: string | undefined,
    @Auth()
    userId: string,
  ): Promise<TracksWithCursorModel> {
    const { trackIds } = await this.librariesService.getByUserId(userId);
    return this.tracksService.getAllByIds(trackIds, cursor);
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async addLibraryTrack(
    @Args('trackId')
    trackId: string,
    @Auth()
    userId: string,
  ): Promise<TrackModel> {
    const trackExists = await this.tracksService.existsById(trackId);
    if (!trackExists) {
      throw new TrackNotFoundException();
    }

    await this.librariesService.addTrackIdByUserId(userId, trackId);
    return this.tracksService.getById(trackId);
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async removeLibraryTrack(
    @Args('trackId')
    trackId: string,
    @Auth()
    userId: string,
  ): Promise<TrackModel> {
    const trackExists = await this.tracksService.existsById(trackId);
    if (!trackExists) {
      throw new TrackNotFoundException();
    }

    await this.librariesService.removeTrackIdByUserId(userId, trackId);
    return this.tracksService.getById(trackId);
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async moveLibraryTrack(
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

    await this.librariesService.moveTrackByUserId(userId, trackId, position);
    return this.tracksService.getById(trackId);
  }
}
