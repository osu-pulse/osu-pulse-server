import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('TrackCover')
export class TrackCoverObject {
  @Field(() => String)
  small: string;

  @Field(() => String)
  normal: string;
}
