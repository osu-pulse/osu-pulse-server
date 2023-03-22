import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { Auth } from '../../auth/decorators/auth.decorator';
import { WithCursor } from '../../shared/types/with-cursor';
import { TrackNotFoundException } from '../../tracks/exceptions/track-not-found.exception';
import { TrackObject } from '../../tracks/objects/track.object';
import { TracksService } from '../../tracks/services/tracks.service';
import { TrackModel } from '../../tracks/models/track.model';
import { TracksWithCursorObject } from '../../tracks/objects/tracks-with-cursor.object';
import { PlaylistTracksService } from '../services/playlist-tracks.service';
import { PlaylistsService } from '../services/playlists.service';
import { TrackAlreadyInPlaylistException } from '../exceptions/track-already-in-playlist.exception';

@Resolver(() => TrackObject)
export class PlaylistTracksResolver {
  constructor(
    private playlistTracksService: PlaylistTracksService,
    private playlistsService: PlaylistsService,
    private tracksService: TracksService,
  ) {}

  @UseGuards(OauthGuard)
  @Query(() => TracksWithCursorObject)
  async playlistTracks(
    @Args('playlistId')
    playlistId: string,
    @Args('cursor', { nullable: true })
    cursor: string | undefined,
    @Args('limit', { type: () => Int, nullable: true })
    limit: number | undefined,
    @Auth()
    userId: string,
  ): Promise<WithCursor<TrackModel>> {
    await this.checkPlaylistExists(userId, playlistId);

    return this.playlistTracksService.getAllTracksByPlaylistId(
      playlistId,
      limit,
      cursor,
    );
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async addPlaylistTrack(
    @Args('playlistId')
    playlistId: string,
    @Args('trackId')
    trackId: string,
    @Auth()
    userId: string,
  ): Promise<TrackModel> {
    await this.checkPlaylistExists(userId, playlistId);
    await this.checkTrackExists(trackId);
    await this.checkTrackNotInPlaylist(userId, trackId);

    await this.playlistTracksService.addByPlaylistId(playlistId, trackId);
    return this.tracksService.getById(trackId);
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async removePlaylistTrack(
    @Args('playlistId')
    playlistId: string,
    @Args('trackId')
    trackId: string,
    @Auth()
    userId: string,
  ): Promise<TrackModel> {
    await this.checkPlaylistExists(userId, playlistId);
    await this.checkTrackExists(trackId);
    await this.checkTrackInPlaylist(userId, playlistId);

    await this.playlistTracksService.removeByPlaylistId(playlistId, trackId);
    return this.tracksService.getById(trackId);
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async movePlaylistTrack(
    @Args('playlistId')
    playlistId: string,
    @Args('trackId')
    trackId: string,
    @Args('position')
    position: number,
    @Auth()
    userId: string,
  ): Promise<TrackModel> {
    await this.checkPlaylistExists(userId, playlistId);
    await this.checkTrackExists(trackId);
    await this.checkTrackInPlaylist(userId, playlistId);

    await this.playlistTracksService.moveByPlaylistId(
      playlistId,
      trackId,
      position,
    );
    return this.tracksService.getById(trackId);
  }

  private async checkPlaylistExists(
    userId: string,
    playlistId: string,
  ): Promise<void> | never {
    const trackExists = await this.playlistsService.existsByUserIdAndId(
      userId,
      playlistId,
    );
    if (!trackExists) {
      throw new TrackNotFoundException();
    }
  }

  private async checkTrackExists(trackId: string): Promise<void> | never {
    const trackExists = await this.tracksService.existsById(trackId);
    if (!trackExists) {
      throw new TrackNotFoundException();
    }
  }

  private async checkTrackNotInPlaylist(
    userId: string,
    trackId: string,
  ): Promise<void> | never {
    const trackInPlaylist = await this.playlistTracksService.existsByUserId(
      userId,
      trackId,
    );
    if (trackInPlaylist) {
      throw new TrackAlreadyInPlaylistException();
    }
  }

  private async checkTrackInPlaylist(
    userId: string,
    trackId: string,
  ): Promise<void> | never {
    const trackInPlaylist = await this.playlistTracksService.existsByUserId(
      userId,
      trackId,
    );
    if (!trackInPlaylist) {
      throw new TrackAlreadyInPlaylistException();
    }
  }
}
