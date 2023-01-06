import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'refreshTokens' })
export class RefreshTokenModel {
  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  value: string;

  @Prop({
    required: true,
    immutable: true,
  })
  issuedAt: Date;

  @Prop({
    required: true,
    index: true,
    immutable: true,
  })
  expiresAt: Date;

  @Prop({
    required: true,
    immutable: true,
  })
  userId: string;
}

export type RefreshTokenDocument = RefreshTokenModel & Document;
export const RefreshTokenSchema =
  SchemaFactory.createForClass(RefreshTokenModel);
