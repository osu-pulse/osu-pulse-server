import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeviceStatusObject {
  @Field(() => Boolean, { nullable: true })
  playing?: boolean;

  @Field(() => Number, { nullable: true })
  volume?: number;

  @Field(() => Number, { nullable: true })
  progress?: number;

  @Field(() => String, { nullable: true })
  trackId?: string;
}
