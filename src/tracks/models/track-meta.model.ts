import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from '../../shared/models/base.model';

@Schema({ collection: 'trackMetas', versionKey: false, timestamps: true })
export class TrackMetaModel extends BaseModel {
  @Prop({ required: true, immutable: true, index: true, unique: true })
  trackId: string;
}

export type TrackMetaDocument = TrackMetaModel & Document;
export const TrackMetaSchema = SchemaFactory.createForClass(TrackMetaModel);
