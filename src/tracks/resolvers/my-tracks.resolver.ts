import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { Auth } from '../../auth/decorators/auth.decorator';
import { TrackObject } from '../objects/track.object';
import { TracksService } from '../services/tracks.service';
import { Track } from '../types/track';
import { TracksWithCursorObject } from '../objects/tracks-with-cursor.object';
import { WithCursor } from '../../shared/types/with-cursor';
import { TrackNotFoundException } from '../exceptions/track-not-found.exception';
import { LibraryTracksService } from '../services/library-tracks.service';
import { TrackAlreadyInLibraryException } from '../exceptions/track-already-in-library.exception';
import { TrackNotInLibraryException } from '../exceptions/track-not-in-library.exception';

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
  ): Promise<WithCursor<Track>> {
    return this.libraryTracksService.getAllByUserId(
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
  ): Promise<Track> {
    await this.checkTrackExists(trackId);
    await this.checkTrackNotInLibrary(userId, trackId);

    await this.libraryTracksService.addByUserId(userId, trackId);
    return this.tracksService.getById(trackId);
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async removeMyTrack(
    @Args('trackId')
    trackId: string,
    @Auth()
    userId: string,
  ): Promise<Track> {
    await this.checkTrackExists(trackId);
    await this.checkTrackInLibrary(userId, trackId);

    await this.libraryTracksService.removeByUserId(userId, trackId);
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
  ): Promise<Track> {
    await this.checkTrackExists(trackId);
    await this.checkTrackInLibrary(userId, trackId);

    await this.libraryTracksService.moveByUserId(userId, trackId, position);
    return this.tracksService.getById(trackId);
  }

  private async checkTrackExists(trackId: string): Promise<void> | never {
    const trackExists = await this.tracksService.existsById(trackId);
    if (!trackExists) {
      throw new TrackNotFoundException();
    }
  }

  private async checkTrackNotInLibrary(
    userId: string,
    trackId: string,
  ): Promise<void> | never {
    const trackInLibrary = await this.libraryTracksService.existsByUserId(
      userId,
      trackId,
    );
    if (trackInLibrary) {
      throw new TrackAlreadyInLibraryException();
    }
  }

  private async checkTrackInLibrary(
    userId: string,
    trackId: string,
  ): Promise<void> | never {
    const trackInLibrary = await this.libraryTracksService.existsByUserId(
      userId,
      trackId,
    );
    if (!trackInLibrary) {
      throw new TrackNotInLibraryException();
    }
  }
}
