import { Schema } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export abstract class BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
