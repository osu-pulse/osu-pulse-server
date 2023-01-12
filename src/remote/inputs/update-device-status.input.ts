import { Field, InputType } from '@nestjs/graphql';

@InputType('UpdateDeviceStatus')
export class UpdateDeviceStatusInput {
  @Field(() => Boolean)
  playing: boolean;

  @Field(() => Number)
  volume: number;

  @Field(() => Number)
  progress: number;

  @Field(() => String)
  trackId: string;
}
