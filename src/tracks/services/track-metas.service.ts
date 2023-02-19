import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TrackMetaDocument, TrackMetaModel } from '../models/track-meta.model';
import { CreateTrackMeta } from '../types/create-track-meta';

@Injectable()
export class TrackMetasService {
  constructor(
    @InjectModel(TrackMetaModel.name)
    private trackMetaModel: Model<TrackMetaDocument>,
  ) {}

  async existsByTrackId(trackId: string): Promise<boolean> {
    return Boolean(await this.trackMetaModel.exists({ trackId }).lean());
  }

  async existsAllByTrackIds(trackIds: string[]): Promise<string[]> {
    const existing = await this.trackMetaModel
      .find({ trackId: { $in: trackIds } })
      .lean({ virtuals: true });
    return existing.map(({ trackId }) => trackId);
  }

  async getByTrackId(trackId: string): Promise<TrackMetaModel> {
    return this.trackMetaModel.findOne({ trackId }).lean({ virtuals: true });
  }

  async getAllByTrackIds(trackIds: string[]): Promise<TrackMetaModel[]> {
    return this.trackMetaModel
      .find({ trackId: { $in: trackIds } })
      .lean({ virtuals: true });
  }

  async create(payload: CreateTrackMeta): Promise<TrackMetaModel> {
    return this.trackMetaModel.create(payload);
  }

  async removeBefore(date: Date): Promise<TrackMetaModel[]> {
    const deleted = await this.trackMetaModel
      .find({
        createdAt: { $lt: date },
      })
      .lean({ virtuals: true });
    await this.trackMetaModel.deleteMany({
      id: { $in: deleted.map(({ id }) => id) },
    });
    return deleted;
  }
}
