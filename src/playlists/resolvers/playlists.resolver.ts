import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { PlaylistObject } from '../objects/playlist.object';
import { PlaylistsService } from '../services/playlists.service';
import { PlaylistModel } from '../models/playlist.model';
import { PlaylistNotFoundException } from '../exceptions/playlist-not-found.exception';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Track } from '../../tracks/types/track';
import { PlaylistTracksService } from '../services/playlist-tracks.service';
import { TracksWithCursorObject } from '../../tracks/objects/tracks-with-cursor.object';
import { WithCursor } from '../../shared/types/with-cursor';
import { BucketName } from '../../bucket/constants/bucket-name';
import { ConfigService } from '@nestjs/config';
import { TrackNotFoundException } from '../../tracks/exceptions/track-not-found.exception';
import { Env } from '../../core/helpers/env';

@Resolver(() => PlaylistObject)
export class PlaylistsResolver {
  constructor(
    private playlistsService: PlaylistsService,
    private playlistTracksService: PlaylistTracksService,
    private configService: ConfigService<Env, true>,
  ) {}

  @UseGuards(OauthGuard)
  @Query(() => [PlaylistObject])
  async publicPlaylists(
    @Args('search', { nullable: true }) search: string | undefined,
  ): Promise<PlaylistModel[]> {
    return this.playlistsService.getAllPublic(search);
  }

  @UseGuards(OauthGuard)
  @Query(() => PlaylistObject)
  async publicPlaylist(
    @Args('playlistId') playlistId: string,
  ): Promise<PlaylistModel> {
    const foundPlaylist = await this.playlistsService.getPublicById(playlistId);
    if (!foundPlaylist) {
      throw new PlaylistNotFoundException();
    }

    return foundPlaylist;
  }

  @UseGuards(OauthGuard)
  @Mutation(() => PlaylistObject)
  async copyPlaylist(
    @Args('playlistId') playlistId: string,
    @Auth() userId: string,
  ): Promise<PlaylistModel> {
    await this.checkPlaylistExists(userId, playlistId);

    return this.playlistsService.copy(playlistId, userId);
  }

  @ResolveField(() => TracksWithCursorObject)
  async tracks(
    @Args('cursor', { nullable: true }) cursor: string | undefined,
    @Args('limit', { nullable: true, defaultValue: 50 }) limit: number,
    @Parent() playlist: PlaylistModel,
  ): Promise<WithCursor<Track>> {
    return this.playlistTracksService.getAllTracksByPlaylistId(
      playlist.id,
      limit,
      cursor,
    );
  }

  @ResolveField(() => String, { nullable: true })
  async cover(@Parent() playlist: PlaylistModel): Promise<string> {
    const minioUrl = this.configService.get('URL_MINIO');
    const bucket = BucketName.PLAYLIST_COVERS;

    const hasCover = await this.playlistsService.hasCover(playlist.id);
    return hasCover ? `${minioUrl}/${bucket}/${playlist.id}` : undefined;
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
}
