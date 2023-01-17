import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from '../../shared/models/base.model';

@Schema({ collection: 'userTrackMappings' })
export class UserTrackMappingModel extends BaseModel {
  @Prop({ type: String, required: true, immutable: true })
  userId: string;

  @Prop({ type: String, required: true, immutable: true })
  trackId: string;

  @Prop({ type: Number, required: true, index: true })
  order: number;
}

export type UserTrackMappingDocument = UserTrackMappingModel & Document;
export const UserTrackMappingSchema = SchemaFactory.createForClass(
  UserTrackMappingModel,
);
