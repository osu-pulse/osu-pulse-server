import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PlaylistDocument, PlaylistModel } from '../models/playlist.model';
import { CreatePlaylistInput } from '../inputs/create-playlist.input';
import { UpdatePlaylistInput } from '../inputs/update-playlist.input';
import { searchFilter } from '../../shared/helpers/mongo';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectModel(PlaylistModel.name)
    private playlistModel: Model<PlaylistDocument>,
  ) {}

  async existsByUserIdAndId(
    userId: string,
    playlistId: string,
  ): Promise<boolean> {
    return Boolean(
      await this.playlistModel.exists({ _id: playlistId, userId }).lean(),
    );
  }

  async getAllPublic(search?: string): Promise<PlaylistModel[]> {
    return this.playlistModel
      .find({
        ...searchFilter<PlaylistModel>(search, ['title']),
        public: true,
      })
      .lean({ virtuals: true });
  }

  async getPublicById(playlistId: string): Promise<PlaylistModel> {
    return this.playlistModel
      .findOne({ _id: playlistId, public: true })
      .lean({ virtuals: true });
  }

  async getAllByUserId(
    userId: string,
    search?: string,
  ): Promise<PlaylistModel[]> {
    return this.playlistModel
      .find({
        ...searchFilter<PlaylistModel>(search, ['title']),
        userId,
      })
      .lean({ virtuals: true });
  }

  async getByUserIdAndId(
    userId: string,
    playlistId: string,
  ): Promise<PlaylistModel> {
    return this.playlistModel
      .findOne({ _id: playlistId, userId })
      .lean({ virtuals: true });
  }

  async copy(playlistId: string, userId: string): Promise<PlaylistModel> {
    const foundPlaylist = await this.playlistModel.findById(playlistId);
    return this.playlistModel.create({ ...foundPlaylist, userId });
  }

  async create(
    payload: CreatePlaylistInput,
    userId: string,
  ): Promise<PlaylistModel> {
    return this.playlistModel.create({ ...payload, userId, trackIds: [] });
  }

  async update(
    payload: UpdatePlaylistInput,
    playlistId: string,
  ): Promise<PlaylistModel> {
    return this.playlistModel
      .findByIdAndUpdate(playlistId, payload, { new: true })
      .lean({ virtuals: true });
  }

  async delete(playlistId: string): Promise<PlaylistModel> {
    return this.playlistModel
      .findByIdAndDelete(playlistId)
      .lean({ virtuals: true });
  }
}
