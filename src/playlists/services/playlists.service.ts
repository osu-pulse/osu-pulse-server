import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PlaylistDocument, PlaylistModel } from '../models/playlist.model';
import { CreatePlaylistInput } from '../inputs/create-playlist.input';
import { UpdatePlaylistInput } from '../inputs/update-playlist.input';
import { searchFilter } from '../../shared/helpers/mongo';
import { BucketService } from '../../bucket/services/bucket.service';
import { BucketName } from '../../bucket/constants/bucket-name';
import { ImageFileType } from '../../bucket/constants/file-type';
import sharp from 'sharp';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectModel(PlaylistModel.name)
    private playlistModel: Model<PlaylistDocument>,
    private bucketService: BucketService,
  ) {}

  async existsByUserIdAndId(
    userId: string,
    playlistId: string,
  ): Promise<boolean> {
    return Boolean(
      await this.playlistModel.exists({ _id: playlistId, userId }).lean(),
    );
  }

  async existsPublicOrUserIdAndId(
    userId: string,
    playlistId: string,
  ): Promise<boolean> {
    return Boolean(
      await this.playlistModel
        .exists({ _id: playlistId, $or: [{ userId }, { public: true }] })
        .lean(),
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

  async hasCover(playlistId: string): Promise<boolean> {
    return this.bucketService.exists(BucketName.PLAYLIST_COVERS, playlistId);
  }

  async setCover(playlistId: string, cover?: Buffer): Promise<void> {
    if (cover) {
      const file = await sharp(cover)
        .resize({ width: 800, height: 800, fit: 'inside' })
        .webp()
        .toBuffer();

      await this.bucketService.create(
        BucketName.PLAYLIST_COVERS,
        playlistId,
        file,
        ImageFileType.WEBP,
      );
    } else {
      await this.bucketService.remove(BucketName.PLAYLIST_COVERS, playlistId);
    }
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

  async copy(playlistId: string, userId: string): Promise<PlaylistModel> {
    const foundPlaylist = await this.playlistModel.findById(playlistId);
    return this.playlistModel.create({ ...foundPlaylist, userId });
  }
}
