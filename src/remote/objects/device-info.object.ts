import { Field, ObjectType } from '@nestjs/graphql';
import { DeviceType } from '../constants/device-type';

@ObjectType()
export class DeviceInfoObject {
  @Field(() => DeviceType)
  type: DeviceType;

  @Field(() => String)
  device: string;

  @Field(() => String)
  client: string;
}
