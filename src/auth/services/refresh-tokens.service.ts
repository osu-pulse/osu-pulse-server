import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RefreshTokenDocument,
  RefreshTokenModel,
} from '../models/refresh-token.model';
import { randomGenerator } from '../../shared/helpers/random-generator';
import dayjs from 'dayjs';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectModel(RefreshTokenModel.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}
  async create(userId: string): Promise<RefreshTokenDocument> {
    return this.refreshTokenModel.create({
      userId,
      value: randomGenerator.refreshToken(),
      issuedAt: new Date(),
      expiresAt: dayjs().add(2, 'months').toDate(),
    });
  }

  async refreshValue(value: string): Promise<RefreshTokenDocument | null> {
    return this.refreshTokenModel
      .findOneAndUpdate(
        { value, expiresAt: { $gte: new Date() } },
        {
          value: randomGenerator.refreshToken(),
          issuedAt: new Date(),
          expiresAt: dayjs().add(2, 'months').toDate(),
        },
        { new: true },
      )
      .exec();
  }
}
