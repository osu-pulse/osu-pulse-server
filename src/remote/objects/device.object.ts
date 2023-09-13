import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DeviceInfoObject } from './device-info.object';
import { DeviceType } from '../constants/device-type';

@ObjectType()
export class DeviceObject {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => DeviceType)
  type: DeviceInfoObject;

  @Field(() => String, { nullable: true })
  model?: string;

  @Field(() => String, { nullable: true })
  os?: string;
}
