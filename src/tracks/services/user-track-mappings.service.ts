import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  UserTrackMappingDocument,
  UserTrackMappingModel,
} from '../models/user-track-mapping.model';
import { UserTrackMapping } from '../types/user-track-mapping';
import { WithCursor } from '../types/with-cursor';
import { cursorConvertor } from '../../shared/convertors/cursor.convertor';

@Injectable()
export class UserTrackMappingsService {
  private readonly ORDER_MAX = 10 ** 10;
  private readonly ORDER_STEP = 1000;

  constructor(
    @InjectModel(UserTrackMappingModel.name)
    private userTrackMappingModel: Model<UserTrackMappingDocument>,
    @InjectConnection()
    private connection: Connection,
  ) {}

  async getAllByUserId(
    userId: string,
    cursor?: string,
    limit?: number,
  ): Promise<WithCursor<UserTrackMappingModel>> {
    const cursorModel =
      cursor &&
      (await this.userTrackMappingModel
        .findById(cursorConvertor.toString(cursor))
        .select('order')
        .lean());

    const data = await this.userTrackMappingModel
      .find({
        userId,
        ...(cursorModel && { order: { $gt: cursorModel.order } }),
      })
      .sort({ order: 1 })
      .limit(limit)
      .lean({ virtuals: true });

    const rawCursor = data.at(-1)?.id;

    return { data, cursor: rawCursor && cursorConvertor.fromString(rawCursor) };
  }

  async create({
    userId,
    trackId,
  }: UserTrackMapping): Promise<UserTrackMappingModel> {
    const first = await this.userTrackMappingModel
      .findOne({ userId })
      .sort({ order: 1 })
      .lean({ virtuals: true });

    return this.userTrackMappingModel.create({
      userId,
      trackId,
      order: (first?.order ?? this.ORDER_MAX) - this.ORDER_STEP,
    });
  }

  async remove({
    userId,
    trackId,
  }: UserTrackMapping): Promise<UserTrackMappingModel> {
    return this.userTrackMappingModel
      .findOneAndDelete({ userId, trackId })
      .lean({ virtuals: true });
  }

  async move(
    { userId, trackId }: UserTrackMapping,
    position: number,
  ): Promise<UserTrackMapping | null> {
    const next = await this.userTrackMappingModel
      .findOne({ userId })
      .sort({ order: 1 })
      .skip(position)
      .lean();

    const prev = await this.userTrackMappingModel
      .findOne({ userId, order: { $lt: next.order } })
      .sort({ order: -1 })
      .lean();

    let order;
    if (prev && next) {
      order = (prev.order + next.order) / 2;
    } else if (prev) {
      order = prev.order + this.ORDER_STEP;
    } else if (next) {
      order = next.order - this.ORDER_STEP;
    } else {
      return;
    }

    return this.userTrackMappingModel.findOneAndUpdate(
      { userId, trackId },
      { order },
    );
  }
}
