import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DeviceInfoObject } from './device-info.object';
import { DeviceStatusObject } from './device-status.object';

@ObjectType()
export class DeviceObject {
  @Field(() => ID)
  deviceId: string;

  @Field(() => String)
  userId: string;

  @Field(() => DeviceInfoObject)
  info: DeviceInfoObject;

  @Field(() => DeviceStatusObject)
  status: DeviceStatusObject;
}
