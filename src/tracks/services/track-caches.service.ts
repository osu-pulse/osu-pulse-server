import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  TrackCacheDocument,
  TrackCacheModel,
} from '../models/track-cache.model';

@Injectable()
export class TrackCachesService {
  constructor(
    @InjectModel(TrackCacheModel.name)
    private trackCacheModel: Model<TrackCacheDocument>,
  ) {}

  async existsByTrackId(trackId: string): Promise<boolean> {
    return Boolean(await this.trackCacheModel.exists({ trackId }).lean());
  }

  async create(trackId: string): Promise<TrackCacheModel> {
    return this.trackCacheModel.create({ trackId });
  }
}
