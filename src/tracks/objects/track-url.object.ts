import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('TrackUrl')
export class TrackUrlObject {
  @Field(() => String)
  page: string;

  @Field(() => String)
  file: string;

  @Field(() => String)
  audio: string;
}
