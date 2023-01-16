import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from '../../shared/models/base.model';

@Schema({
  collection: 'trackCaches',
  versionKey: false,
  timestamps: { createdAt: true },
})
export class TrackCacheModel extends BaseModel {
  @Prop({
    type: String,
    required: true,
    immutable: true,
    index: true,
    unique: true,
  })
  trackId: string;
}

export type TrackCacheDocument = TrackCacheModel & Document;
export const TrackCacheSchema = SchemaFactory.createForClass(TrackCacheModel);
