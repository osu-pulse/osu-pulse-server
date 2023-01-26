import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from '../../shared/models/base.model';

@Schema({ collection: 'playlists', versionKey: false, timestamps: true })
export class PlaylistModel extends BaseModel {
  @Prop({ index: true })
  createdAt: Date;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  public: boolean;

  @Prop()
  cover?: string;

  @Prop({ required: true, immutable: true, unique: true })
  userId: string;

  @Prop()
  trackIds: string[];
}

export type PlaylistDocument = PlaylistModel & Document;
export const PlaylistSchema = SchemaFactory.createForClass(PlaylistModel);
