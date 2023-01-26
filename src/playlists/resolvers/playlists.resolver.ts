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
import { TrackObject } from '../../tracks/objects/track.object';
import { TrackModel } from '../../tracks/models/track.model';

@Resolver(() => PlaylistObject)
export class PlaylistsResolver {
  constructor(private playlistsService: PlaylistsService) {}

  @UseGuards(OauthGuard)
  @Query(() => [PlaylistObject])
  async publicPlaylists(
    @Args('search', { nullable: true })
    search: string | undefined,
  ): Promise<PlaylistModel[]> {
    return this.playlistsService.getAllPublic(search);
  }

  @UseGuards(OauthGuard)
  @Query(() => PlaylistObject)
  async publicPlaylist(
    @Args('playlistId')
    playlistId: string,
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
    @Args('playlistId')
    playlistId: string,
    @Auth()
    userId: string,
  ): Promise<PlaylistModel> {
    return this.playlistsService.copy(playlistId, userId);
  }

  @ResolveField(() => [TrackObject])
  async tracks(@Parent() playlist: PlaylistModel): Promise<TrackModel[]> {
    return [];
  }
}
