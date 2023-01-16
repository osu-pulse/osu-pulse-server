import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from '../../shared/models/base.model';

@Schema({ collection: 'libraries', versionKey: false, timestamps: true })
export class LibraryModel extends BaseModel {
  @Prop({
    type: String,
    required: true,
    immutable: true,
    unique: true,
  })
  userId: string;

  @Prop([
    {
      type: String,
    },
  ])
  trackIds: string[];
}

export type LibraryDocument = LibraryModel & Document;
export const LibrarySchema = SchemaFactory.createForClass(LibraryModel);
