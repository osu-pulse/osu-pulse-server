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
import { PlaylistNotFoundException } from '../exceptions/playlist-not-found.exception';
import { PlaylistsService } from '../services/playlists.service';

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
    const playlistExists = await this.playlistsService.existsByUserIdAndId(
      userId,
      playlistId,
    );
    if (!playlistExists) {
      throw new PlaylistNotFoundException();
    }

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
    const playlistExists = await this.playlistsService.existsByUserIdAndId(
      userId,
      playlistId,
    );
    if (!playlistExists) {
      throw new PlaylistNotFoundException();
    }

    const trackExists = await this.tracksService.existsById(trackId);
    if (!trackExists) {
      throw new TrackNotFoundException();
    }

    await this.playlistTracksService.addTrackIdByPlaylistId(
      playlistId,
      trackId,
    );
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
    const playlistExists = await this.playlistsService.existsByUserIdAndId(
      userId,
      playlistId,
    );
    if (!playlistExists) {
      throw new PlaylistNotFoundException();
    }

    const trackExists = await this.tracksService.existsById(trackId);
    if (!trackExists) {
      throw new TrackNotFoundException();
    }

    await this.playlistTracksService.removeTrackIdByPlaylistId(
      playlistId,
      trackId,
    );
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
    const playlistExists = await this.playlistsService.existsByUserIdAndId(
      userId,
      playlistId,
    );
    if (!playlistExists) {
      throw new PlaylistNotFoundException();
    }

    const trackExists = await this.tracksService.existsById(trackId);
    if (!trackExists) {
      throw new TrackNotFoundException();
    }

    await this.playlistTracksService.moveTrackIdByPlaylistId(
      playlistId,
      trackId,
      position,
    );
    return this.tracksService.getById(trackId);
  }
}
