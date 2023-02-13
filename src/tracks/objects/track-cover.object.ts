import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TrackCoverObject {
  @Field(() => String)
  small: string;

  @Field(() => String)
  normal: string;

  @Field(() => String)
  wide: string;
}
