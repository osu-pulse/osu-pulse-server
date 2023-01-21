import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TrackUrlObject {
  @Field(() => String)
  page: string;

  @Field(() => String)
  file: string;

  @Field(() => String)
  audio: string;
}
