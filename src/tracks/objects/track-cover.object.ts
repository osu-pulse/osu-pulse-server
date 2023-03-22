import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TrackCoverObject {
  @Field(() => String)
  list: string;

  @Field(() => String)
  list2x: string;

  @Field(() => String)
  wide: string;

  @Field(() => String)
  wide2x: string;
}
