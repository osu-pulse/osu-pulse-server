import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { PlaylistObject } from '../objects/playlist.object';
import { PlaylistsService } from '../services/playlists.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { PlaylistModel } from '../models/playlist.model';
import { PlaylistNotFoundException } from '../exceptions/playlist-not-found.exception';
import { CreatePlaylistInput } from '../inputs/create-playlist.input';
import { UpdatePlaylistInput } from '../inputs/update-playlist.input';

@Resolver(() => PlaylistObject)
export class MyPlaylistsResolver {
  constructor(private playlistsService: PlaylistsService) {}

  @UseGuards(OauthGuard)
  @Query(() => [PlaylistObject])
  async myPlaylists(
    @Args('search', { nullable: true })
    search: string | undefined,
    @Auth()
    userId: string,
  ): Promise<PlaylistModel[]> {
    return this.playlistsService.getAllByUserId(userId, search);
  }

  @UseGuards(OauthGuard)
  @Query(() => PlaylistObject)
  async myPlaylist(
    @Args('playlistId')
    playlistId: string,
    @Auth()
    userId: string,
  ): Promise<PlaylistModel> {
    const foundPlaylist = await this.playlistsService.getByUserIdAndId(
      userId,
      playlistId,
    );
    if (!foundPlaylist) {
      throw new PlaylistNotFoundException();
    }

    return foundPlaylist;
  }

  @UseGuards(OauthGuard)
  @Mutation(() => PlaylistObject)
  async createMyPlaylist(
    @Args('payload')
    payload: CreatePlaylistInput,
    @Auth()
    userId: string,
  ): Promise<PlaylistModel> {
    return this.playlistsService.create(payload, userId);
  }

  @UseGuards(OauthGuard)
  @Mutation(() => PlaylistObject)
  async updateMyPlaylist(
    @Args('playlistId')
    playlistId: string,
    @Args('payload')
    payload: UpdatePlaylistInput,
    @Auth()
    userId: string,
  ): Promise<PlaylistModel> {
    const playlistExists = await this.playlistsService.existsByUserIdAndId(
      userId,
      playlistId,
    );
    if (!playlistExists) {
      throw new PlaylistNotFoundException();
    }

    return this.playlistsService.update(payload, playlistId);
  }

  @UseGuards(OauthGuard)
  @Mutation(() => PlaylistObject)
  async deleteMyPlaylist(
    @Args('playlistId')
    playlistId: string,
    @Auth()
    userId: string,
  ): Promise<PlaylistModel> {
    const playlistExists = await this.playlistsService.existsByUserIdAndId(
      userId,
      playlistId,
    );
    if (!playlistExists) {
      throw new PlaylistNotFoundException();
    }

    return this.playlistsService.delete(playlistId);
  }
}
